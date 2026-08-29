// src/lib/reasoning/factory.ts
//
// createReasoningProvider() per docs/keen-and-ken-voice-architecture.md
// section 6.4, reading REASONING_PROVIDER / REASONING_FALLBACK_PROVIDER by
// explicit name (section 6.3's "explicit selection over implicit key
// presence" decision) rather than picking whichever API key happens to be
// set, so a provider/cost/behavior change is always a deliberate config
// edit, never an accident of which env vars exist.
//
// Failure handling (section 6.5, non-negotiable): this factory owns the
// retry + fallback + last-resort-template logic itself, so every caller
// (the API route that wires this into the widget) gets a safe
// ReasoningProviderInterface for free and never has to remember to
// implement fallback logic itself. No path here can throw out to the
// widget or return a blank/undefined recommendation.

import type { ReasoningProvider, ReasoningProviderInterface, ReasoningRequest, ReasoningResponse } from './types'
import { ClaudeReasoningProvider } from './claude'
import { GroqLlamaReasoningProvider } from './groq-llama'

const RETRY_BACKOFF_MS = 500

/**
 * Builds a single named provider instance (no fallback logic — that lives
 * in createReasoningProvider() below). Exported separately so tests/QA can
 * exercise one provider in isolation without going through the full
 * fallback chain.
 *
 * Scope note: `gpt`, `gemini`, and `grok` are valid members of the frozen
 * `ReasoningProvider` union and appear in the architecture doc's section 6.4
 * factory switch, but this build pass was only assigned to implement
 * claude.ts and groq-llama.ts. Selecting one of the other three throws a
 * clear, named error rather than silently falling through to a default —
 * this is a stated scope boundary, not a bug. Add `providers/gpt.ts` etc.
 * following claude.ts's pattern, then add a case here, when that work is
 * assigned.
 */
export function createReasoningProviderById(id: ReasoningProvider): ReasoningProviderInterface {
  switch (id) {
    case 'claude': {
      const key = process.env.ANTHROPIC_API_KEY
      if (!key) throw new Error('REASONING_PROVIDER=claude requires ANTHROPIC_API_KEY to be set')
      return new ClaudeReasoningProvider(key, process.env.REASONING_MODEL || undefined)
    }
    case 'groq-llama': {
      const key = process.env.GROQ_API_KEY
      if (!key) throw new Error('REASONING_PROVIDER=groq-llama requires GROQ_API_KEY to be set')
      return new GroqLlamaReasoningProvider(key, process.env.REASONING_MODEL || undefined)
    }
    case 'gpt':
    case 'gemini':
    case 'grok':
      throw new Error(
        `Reasoning provider "${id}" is named in the interface but not implemented in this build pass. ` +
          `Implement src/lib/reasoning/${id}.ts following claude.ts's pattern before selecting it.`
      )
    default:
      throw new Error(`Unknown reasoning provider: ${id}`)
  }
}

/**
 * The factory callers actually use. Takes an optional primary provider id
 * (so a caller that has already resolved/validated REASONING_PROVIDER
 * itself can pass it straight through); if omitted, reads
 * REASONING_PROVIDER from the environment directly (default 'claude', per
 * architecture doc section 5's recommendation). Always reads
 * REASONING_FALLBACK_PROVIDER from the environment itself regardless of
 * how the primary id was supplied — section 6.5 is explicit that fallback
 * retry logic belongs in the factory, not left for every call site to
 * reimplement or to independently decide whether the fallback env var
 * even applies.
 *
 * Returns a ReasoningProviderInterface whose synthesize() has the full
 * failure handling from section 6.5 built in and never throws:
 *
 *   1. Try the primary provider.
 *   2. On failure, retry the primary once after a short backoff.
 *   3. On second failure, try the configured fallback provider, if any.
 *   4. If everything failed (or no fallback was configured), degrade to a
 *      plain-template summary built directly from the raw transcript,
 *      never a blank/undefined recommendation, with `nextAction` flagged
 *      NEEDS_MANUAL_REVIEW so the caller can route it into whatever human
 *      follow-up flag the Airtable Pipeline record needs
 *      (per sales/keen-and-ken-lead-plan.md section 3).
 *
 * Every failure is logged with provider id, stage, and error message —
 * never an empty catch block — per docs/engineering-standards.md.
 */
export function createReasoningProvider(primaryOverride?: ReasoningProvider): ReasoningProviderInterface {
  const primaryId = primaryOverride || (process.env.REASONING_PROVIDER as ReasoningProvider | undefined) || 'claude'
  const fallbackId = (process.env.REASONING_FALLBACK_PROVIDER as ReasoningProvider | undefined) || undefined

  return {
    async synthesize(request: ReasoningRequest): Promise<ReasoningResponse> {
      try {
        return await createReasoningProviderById(primaryId).synthesize(request)
      } catch (primaryErr) {
        logReasoningFailure('primary', primaryId, primaryErr)
      }

      try {
        await sleep(RETRY_BACKOFF_MS)
        return await createReasoningProviderById(primaryId).synthesize(request)
      } catch (retryErr) {
        logReasoningFailure('primary-retry', primaryId, retryErr)
      }

      if (fallbackId) {
        try {
          return await createReasoningProviderById(fallbackId).synthesize(request)
        } catch (fallbackErr) {
          logReasoningFailure('fallback', fallbackId, fallbackErr)
        }
      }

      return buildTemplateFallback(request, fallbackId || primaryId)
    },
  }
}

function logReasoningFailure(stage: string, providerId: ReasoningProvider, err: unknown): void {
  const message = err instanceof Error ? err.message : String(err)
  // Deliberately console.error, not swallowed: this is the "enough detail
  // to see it in a dashboard later" requirement from architecture doc 6.5.
  console.error(`[reasoning-factory] stage="${stage}" provider="${providerId}" failed: ${message}`)
}

function buildTemplateFallback(request: ReasoningRequest, lastAttemptedProvider: ReasoningProvider): ReasoningResponse {
  const visitorLines = request.transcript.filter((turn) => turn.role === 'visitor').map((turn) => turn.text.trim()).filter(Boolean)

  return {
    recommendation:
      "Thanks for sharing that — our team will follow up directly to go through the details with you.",
    structured: {
      painPoint: visitorLines[0] || 'Not captured: all reasoning providers failed before a summary could be generated.',
      statedNeed: visitorLines.slice(1).join(' ') || 'Not captured.',
      fitService: null,
      leadQuality: 'unclear',
      nextAction:
        'NEEDS_MANUAL_REVIEW: all configured reasoning providers failed for this conversation. Review the raw transcript and follow up personally.',
    },
    // `provider`/`model` on the frozen ReasoningResponse type have no
    // dedicated "degraded" value (the union only lists real providers) — a
    // real ambiguity the two spec docs don't resolve. Named decision made
    // here: report the last provider actually attempted (for traceability
    // in logs/Airtable) and use a distinguishable model string so this
    // response is never mistaken for a real model's output.
    provider: lastAttemptedProvider,
    model: 'template-fallback',
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
