// src/lib/reasoning/types.ts
//
// ReasoningProviderInterface family — the contract every reasoning provider
// adapter ("Ken") must implement. Shape is frozen per
// docs/keen-and-ken-voice-architecture.md (yuvi-ventures repo) section 6.1.
// Do not redesign; this is an already-agreed contract shared with the
// voice layer (src/lib/voice/) and with whoever builds the API route that
// calls createReasoningProvider().
//
// This extends the proven pattern already used in production at
// github.com/yuviguru/intelligent-sales-analytics (src/services/ai/), which
// uses one interface (AIProviderInterface.chat()) per provider file, a
// DEFAULT_MODELS map, and a switch-based factory. Ken's job is a single
// synthesis call (transcript in, structured recommendation out), not an
// open chat loop, so the interface here is `synthesize()` instead of
// `chat()`, with a `structured` field added because Ken's output writes
// directly into the Airtable Pipeline lead record, not just a chat bubble.

export type ReasoningProvider = 'claude' | 'gpt' | 'gemini' | 'grok' | 'groq-llama'

/**
 * A single turn of Keen's voice conversation with the visitor.
 *
 * This type is shared with the voice layer: it is the shape Keen's
 * transcript is built from, and it is what Ken (this module) reasons over.
 * Defined once, here, because it appears first in the architecture doc's
 * section 6.1 (ReasoningRequest.transcript); src/lib/voice/types.ts
 * re-exports it rather than redefining it, so there is exactly one
 * definition and voice/reasoning can never drift out of sync on this shape.
 */
export interface TranscriptTurn {
  role: 'visitor' | 'keen'
  text: string
  at: string // ISO timestamp
}

export interface ReasoningRequest {
  systemPrompt: string // Ken's persona + instructions + the JSON schema it must fill
  transcript: TranscriptTurn[] // Keen's full conversation
  businessContext?: string // e.g. Keen & Ken's service menu, for grounding the recommendation
}

export interface ReasoningResponse {
  recommendation: string // human-readable summary, shown to the visitor and/or read aloud
  structured: {
    painPoint: string
    statedNeed: string
    fitService: string | null // which Keen & Ken service line this maps to, if any
    leadQuality: 'hot' | 'warm' | 'unclear'
    nextAction: string
  }
  provider: ReasoningProvider
  model: string
  tokensUsed?: { input: number; output: number }
}

export interface ReasoningProviderInterface {
  synthesize(request: ReasoningRequest): Promise<ReasoningResponse>
  streamSynthesize?(request: ReasoningRequest): AsyncGenerator<string> // optional, for a live read-aloud UX
}

// Default models per provider. Model names/ids in this space drift every
// few weeks (architecture doc section 7) — re-verify before relying on
// these for a real budget or quality decision. Verified against each
// vendor's own current docs/pricing page where noted; re-pulled 2026-08-29.
export const REASONING_DEFAULT_MODELS: Record<ReasoningProvider, string> = {
  // Verified model id string, ai vendor pricing/model pages cross-checked 2026-08-29.
  claude: 'claude-sonnet-5',
  // Aggregator-named in the architecture doc; OpenAI's own current model list
  // was not re-checked in this pass beyond what the architecture doc already
  // verified against developers.openai.com/api/docs/pricing. Override via
  // REASONING_MODEL if this has drifted by build/deploy time.
  gpt: 'gpt-5.6-luna',
  gemini: 'gemini-3.5-flash-lite',
  // Aggregator-sourced per architecture doc section 3/7, not vendor-page-confirmed.
  grok: 'grok-4.6',
  // Verified directly against console.groq.com/docs/model/llama-3.3-70b-versatile
  // (WebFetch, 2026-08-29): no deprecation notice found there, listed as an
  // active "Enterprise" tier model. One aggregator search result claimed this
  // model was deprecated in favor of openai/gpt-oss-120b; that claim did NOT
  // hold up against the vendor's own docs page, so it was not adopted here.
  // Flagging both findings per the "no invented scope" / no-silent-drift rule
  // rather than silently picking one. Re-check at deploy time regardless.
  'groq-llama': 'llama-3.3-70b-versatile',
}

export const REASONING_PROVIDER_NAMES: Record<ReasoningProvider, string> = {
  claude: 'Claude',
  gpt: 'GPT',
  gemini: 'Gemini',
  grok: 'Grok',
  'groq-llama': 'Groq (Llama)',
}
