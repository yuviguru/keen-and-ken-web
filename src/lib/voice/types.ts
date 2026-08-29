// src/lib/voice/types.ts
//
// VoiceProviderInterface family — the contract every voice provider adapter
// (Gemini Live, OpenAI Realtime, and any future provider) must implement.
// Shape is frozen per docs/keen-and-ken-voice-architecture.md
// (yuvi-ventures repo) section 6.2. Do not redesign; this is an
// already-agreed contract shared with whoever builds the React widget
// (frontend engineer) and the API route that wires createVoiceProvider()
// in (backend engineer).
//
// TranscriptTurn is the one shape shared with the reasoning layer (Keen's
// transcript is Ken's input). It is defined once, in
// ../reasoning/types.ts (it appears first there, in the architecture doc's
// section 6.1), and re-exported here so voice code has a single import
// path and the two layers can never drift out of sync on this shape. This
// is a minor, intentional deviation from the doc's two standalone code
// blocks (which each show TranscriptTurn inline) — same fields, same
// meaning, one source of truth instead of two copies to keep in sync.
import type { TranscriptTurn } from '../reasoning/types'

export type { TranscriptTurn }

export type VoiceProviderId = 'gemini-live' | 'openai-realtime' | 'elevenlabs' | 'self-hosted'

export interface VoiceSessionConfig {
  provider: VoiceProviderId
  model?: string // override the provider's default model
  voiceId?: string // TTS voice selection, provider-specific
  systemPrompt: string // Keen's persona/instructions
  maxTurns?: number // hard cap, e.g. 4-6 exchanges, so a conversation can't run forever
  interruptible?: boolean // default true; lets the visitor talk over Keen
}

export interface VoiceSessionHandlers {
  onPartialTranscript?(who: 'visitor' | 'keen', text: string, isFinal: boolean): void
  onAudioChunk(chunk: Uint8Array): void // Keen's spoken audio, to play back to the visitor
  onInterrupted?(): void // visitor barged in; app should stop any queued playback
  onTurnComplete?(turn: TranscriptTurn): void
  onSessionEnd?(reason: 'visitor_ended' | 'max_turns' | 'timeout' | 'error', transcript: TranscriptTurn[]): void
  onError(err: { code: string; message: string; recoverable: boolean }): void
}

export interface VoiceSession {
  sendAudioChunk(chunk: Uint8Array): void // visitor's mic audio, streamed in
  interrupt(): void // manual barge-in trigger (e.g. a "stop" button, or client-side VAD)
  endSession(): Promise<{ transcript: TranscriptTurn[] }>
}

export interface VoiceProviderInterface {
  startSession(config: VoiceSessionConfig, handlers: VoiceSessionHandlers): Promise<VoiceSession>
}

// --- Below this line is NOT part of the frozen interface. ---
// Additive types used by this engineer's implementations
// (gemini-live.ts, openai-realtime.ts) and by whoever builds the API
// route that mints tokens for the browser. See the "client/server split"
// boundary comment at the top of gemini-live.ts / openai-realtime.ts for
// why this exists and who owns what on each side of it.

export interface EphemeralVoiceToken {
  token: string
  provider: VoiceProviderId
  model: string
  expiresAt: string // ISO timestamp
  /** Provider-specific extra data the browser SDK/WebSocket call needs (e.g. a session id). Opaque to callers. */
  extra?: Record<string, unknown>
}
