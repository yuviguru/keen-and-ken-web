// src/lib/voice/factory.ts
//
// createVoiceProvider() per docs/keen-and-ken-voice-architecture.md
// section 6.4, reading VOICE_PROVIDER / VOICE_FALLBACK_PROVIDER by
// explicit name (section 6.3's "explicit selection over implicit key
// presence" decision), same reasoning as src/lib/reasoning/factory.ts:
// a provider/cost/behavior change must be a deliberate config edit.
//
// Failure handling (section 6.5, non-negotiable): "Voice session fails to
// start: try VOICE_FALLBACK_PROVIDER once; if that also fails, degrade to
// a plain text-chat fallback (the visitor can still type to Keen) rather
// than showing a broken or silently-empty widget." This factory owns the
// first half of that (primary -> fallback retry on session start) since
// it is pure provider-selection logic. The text-chat degrade itself is a
// widget UI state, not a VoiceProviderInterface implementation — there is
// no meaningful "VoiceSession" for typed text — so it is intentionally
// NOT built here. `startVoiceSession()` below throws a distinguishable
// `VoiceUnavailableError` when both providers fail to start, and the
// caller (the widget/API route, outside this engineer's assigned files)
// is expected to catch that specific error and switch its own UI into
// the text-chat fallback state. Named explicitly rather than guessed
// silently, since building the text-chat UI is out of this file's scope
// per the task's file-ownership list.

import type { VoiceProviderId, VoiceProviderInterface, VoiceSession, VoiceSessionConfig, VoiceSessionHandlers } from './types'
import { GeminiLiveProvider } from './gemini-live'
import { OpenAIRealtimeProvider } from './openai-realtime'

export class VoiceUnavailableError extends Error {
  constructor(
    message: string,
    public readonly attempts: Array<{ provider: VoiceProviderId; error: string }>
  ) {
    super(message)
    this.name = 'VoiceUnavailableError'
  }
}

/**
 * Builds a single named provider instance (no fallback logic — see
 * `startVoiceSession()` below for the fallback-aware entry point most
 * callers should use instead).
 *
 * Scope note: `elevenlabs` and `self-hosted` are valid members of the
 * frozen `VoiceProviderId` union and appear in the architecture doc's
 * section 6.4 factory switch, but this build pass was only assigned to
 * implement gemini-live.ts and openai-realtime.ts (architecture doc
 * section 5's recommended default + fallback). Selecting either of the
 * other two throws a clear, named error rather than silently doing
 * nothing. Add `elevenlabs.ts` / `self-hosted.ts` following
 * gemini-live.ts's pattern, then add a case here, when that work is
 * assigned — the architecture doc (section 4/5) is explicit that
 * self-hosted is not recommended as a default at current traffic anyway.
 */
export function createVoiceProvider(id: VoiceProviderId): VoiceProviderInterface {
  switch (id) {
    case 'gemini-live':
      return new GeminiLiveProvider()
    case 'openai-realtime':
      return new OpenAIRealtimeProvider()
    case 'elevenlabs':
    case 'self-hosted':
      throw new Error(
        `Voice provider "${id}" is named in the interface but not implemented in this build pass. ` +
          `Implement src/lib/voice/${id}.ts following gemini-live.ts's pattern before selecting it.`
      )
    default:
      throw new Error(`Unknown voice provider: ${id}`)
  }
}

/**
 * The fallback-aware entry point most callers should use. Reads
 * VOICE_PROVIDER (default 'gemini-live', per architecture doc section 5)
 * and VOICE_FALLBACK_PROVIDER (default 'openai-realtime') from the
 * environment, tries the primary provider's startSession(), and on
 * failure tries the fallback once before giving up.
 *
 * `config.maxTurns` falls back to VOICE_MAX_TURNS from the environment,
 * then to VoiceSession's own hardcoded default (6) inside each provider,
 * so callers don't have to remember to read that env var themselves.
 */
export async function startVoiceSession(
  config: Omit<VoiceSessionConfig, 'provider'> & { provider?: VoiceProviderId },
  handlers: VoiceSessionHandlers
): Promise<VoiceSession> {
  const primaryId = config.provider || (process.env.VOICE_PROVIDER as VoiceProviderId | undefined) || 'gemini-live'
  const fallbackId = (process.env.VOICE_FALLBACK_PROVIDER as VoiceProviderId | undefined) || undefined
  const maxTurns = config.maxTurns ?? envInt('VOICE_MAX_TURNS')

  const resolvedConfig: VoiceSessionConfig = { ...config, provider: primaryId, maxTurns }
  const attempts: Array<{ provider: VoiceProviderId; error: string }> = []

  try {
    return await createVoiceProvider(primaryId).startSession(resolvedConfig, handlers)
  } catch (primaryErr) {
    const message = primaryErr instanceof Error ? primaryErr.message : String(primaryErr)
    console.error(`[voice-factory] primary provider="${primaryId}" failed to start: ${message}`)
    attempts.push({ provider: primaryId, error: message })
  }

  if (fallbackId) {
    try {
      return await createVoiceProvider(fallbackId).startSession({ ...resolvedConfig, provider: fallbackId }, handlers)
    } catch (fallbackErr) {
      const message = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr)
      console.error(`[voice-factory] fallback provider="${fallbackId}" failed to start: ${message}`)
      attempts.push({ provider: fallbackId, error: message })
    }
  }

  throw new VoiceUnavailableError(
    'All configured voice providers failed to start a session. Caller should degrade to the text-chat fallback per architecture doc section 6.5.',
    attempts
  )
}

function envInt(name: string): number | undefined {
  const raw = process.env[name]
  if (!raw) return undefined
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) ? parsed : undefined
}
