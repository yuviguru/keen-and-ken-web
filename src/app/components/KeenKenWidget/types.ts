// Client-side types for the Keen & Ken voice widget.
//
// The Voice* types mirror docs/keen-and-ken-voice-architecture.md section 6.2 /
// src/lib/voice/types.ts's frozen VoiceProviderInterface family, trimmed to what the
// browser needs — this file has no import dependency on src/lib/voice or
// src/lib/reasoning (those are server-only, per this build's file-ownership split);
// the shapes are duplicated by hand to keep that boundary real.
//
// The SessionToken*/SessionEnd* types were read directly off the actual, already-built
// route handlers (src/app/api/keen/session-token/route.ts, .../session-end/route.ts)
// rather than guessed — see the comment on SessionEndResponse below for the one real
// gap found between what those routes return and what this widget needs.

export type VoiceProviderId = "gemini-live" | "openai-realtime";

export interface TranscriptTurn {
  role: "visitor" | "keen";
  text: string;
  at: string; // ISO timestamp
}

export interface VoiceSessionConfig {
  provider: VoiceProviderId;
  model?: string;
  voiceId?: string;
  systemPrompt: string;
  maxTurns?: number;
  interruptible?: boolean;
}

export interface VoiceSessionHandlers {
  onPartialTranscript?(who: "visitor" | "keen", text: string, isFinal: boolean): void;
  onAudioChunk(chunk: Uint8Array): void;
  onInterrupted?(): void;
  onTurnComplete?(turn: TranscriptTurn): void;
  onSessionEnd?(reason: "visitor_ended" | "max_turns" | "timeout" | "error", transcript: TranscriptTurn[]): void;
  onError(err: { code: string; message: string; recoverable: boolean }): void;
}

export interface VoiceSession {
  sendAudioChunk(chunk: Uint8Array): void;
  interrupt(): void;
  endSession(): Promise<{ transcript: TranscriptTurn[] }>;
}

/**
 * Response shape of POST /api/keen/session-token, read directly off the real route
 * (src/app/api/keen/session-token/route.ts).
 *
 * INTEGRATION FIX (2026-08-29, done during cross-track integration): the route never
 * returns a `success` field at all — on success it returns HTTP 200 with the spread
 * `EphemeralVoiceToken` fields plus `systemPrompt`, `maxTurns`, `sessionId` (and
 * `usedFallback` if the fallback provider was used); on total failure (primary and
 * fallback both fail to mint) it returns a non-2xx status (503) with `{ error }`.
 * The original build of this widget checked `!tokenResponse.success`, which is
 * always true since that field is never set — meaning every successful mint was
 * being treated as a failure. Fixed to check `res.ok` plus the presence of the
 * fields actually returned (`token`, `provider`, `systemPrompt`, `sessionId`).
 */
export interface SessionTokenResponse {
  provider?: VoiceProviderId;
  token?: string; // ephemeral, short-lived, safe to use client-side (Gemini: pass as the SDK's apiKey)
  model?: string;
  expiresAt?: string;
  extra?: Record<string, unknown>;
  systemPrompt?: string; // Keen's persona/instructions, sent in the session setup message
  maxTurns?: number;
  sessionId?: string; // correlates this token mint with the two later session-end calls
  usedFallback?: boolean;
  error?: string;
}

/**
 * Request shape of POST /api/keen/session-end, read directly off the real route
 * (src/app/api/keen/session-end/route.ts).
 *
 * INTEGRATION FIX (2026-08-29): the route is called TWICE per conversation, keyed by
 * `sessionId` (minted by session-token), not once — `stage` is required, not optional,
 * and `sessionId` is required, not merely "accepted." Stage "transcript" fires right
 * after the voice portion ends and returns Ken's real `recommendation` (see
 * SessionEndTranscriptResponse below) so Keen can relay it; stage "contact" fires when
 * the visitor submits the contact form and attaches contact info to the same Pipeline
 * record by session id. This was the one real cross-track gap both engineer-backend
 * and engineer-frontend flagged independently — resolved here by using the route's
 * actual two-stage contract as built, rather than the single-call workaround.
 */
export interface SessionEndRequest {
  sessionId: string;
  stage: "transcript" | "contact";
  transcript?: TranscriptTurn[]; // stage "transcript" only
  endReason?: "visitor_ended" | "max_turns" | "timeout" | "error" | "session_interrupted"; // stage "transcript" only
  // stage "contact" only. IMPORTANT: the route's ContactInfo is { name, contact } —
  // ONE free-text field the route itself splits into Email/Phone by checking for
  // "@" (see session-end/route.ts's handleContactStage). Do not send {email, phone}
  // here — verified against the real route's runtime behavior with a live curl
  // test during integration (2026-08-29), not just its source.
  contact?: { name: string; contact: string };
}

/** Response to a stage:"transcript" call — Ken's actual per-conversation recommendation. */
export interface SessionEndTranscriptResponse {
  recommendation: string;
  leadQuality: "hot" | "warm" | "unclear";
  needsManualReview: boolean;
  ok: boolean;
}

/** Response to a stage:"contact" call. */
export interface SessionEndContactResponse {
  ok?: boolean;
  error?: string;
}

export interface ContactInfo {
  name: string;
  contact: string; // phone or email — one free-text field in this widget's UI, per the
  // spec's "name + contact (phone/email)"; split into {email, phone} right before
  // calling session-end, since that route wants them as separate fields (see
  // splitContact() in useKeenKenSession.ts).
}

export type WidgetPhase =
  | "closed"
  | "idle"
  | "permission"
  | "connecting"
  | "listening"
  | "speaking"
  | "consulting"
  | "thinking"
  | "relaying"
  | "convert"
  | "done"
  | "error";
