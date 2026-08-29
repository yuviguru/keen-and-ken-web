"use client";
// The client-side session state machine for the Keen & Ken widget.
//
// Drives the exact state sequence from docs/keen-and-ken-widget-spec.md:
//   idle -> listening (Keen) -> speaking (Keen) -> consulting (handoff) ->
//   thinking (Ken) -> relaying (Keen) -> convert -> done
// plus the technical states a real implementation needs around that sequence
// (permission, connecting, error) which are not scope creep on the persona
// states, just the plumbing around them.
//
// Calls only /api/keen/session-token and /api/keen/session-end (fetch, same-origin)
// — never imports src/lib/voice or src/lib/reasoning, which hold real API keys and
// are server-only. Once a session-token response comes back, this hook connects
// DIRECTLY from the browser to the voice provider over WebSocket (see providers/),
// per the architecture doc's explicit latency requirement that our backend never
// proxies audio.
//
// REAL BACKEND CONTRACT (read directly off the built routes — see types.ts's
// comments for the full detail):
//   - POST /api/keen/session-token returns 200 with the ephemeral token fields
//     plus `sessionId` on success, or a non-2xx status with `{ error }` on total
//     failure. It never returns a `success` field — see the INTEGRATION FIX note
//     below and in types.ts.
//   - POST /api/keen/session-end is called TWICE per conversation, correlated by
//     `sessionId`: stage "transcript" right after the voice portion ends (returns
//     Ken's real `recommendation`/`leadQuality`/`needsManualReview` and writes the
//     Airtable record immediately, so an abandoned conversation still isn't a lost
//     lead), then stage "contact" when the visitor submits the contact form
//     (attaches name/email/phone to the same record by session id).
//
// INTEGRATION FIX (2026-08-29, cross-track integration pass): this hook was
// originally built against an earlier read of the two routes and had two real
// bugs, both fixed here rather than left as a workaround:
//   1. `start()` checked `!tokenResponse.success`, but the route never sets a
//      `success` field — that check was always true, so every successful token
//      mint was being treated as a failure and the widget would never actually
//      start a voice session. Fixed to check `res.ok` plus the fields the route
//      actually returns.
//   2. `submitContact()` called session-end exactly once, with no `stage` or
//      `sessionId` at all — the real route requires both and returns 400 without
//      them, so this call would have failed every time. Fixed to call session-end
//      twice, matching the route's actual two-stage contract, which also means
//      Keen now relays Ken's real per-conversation recommendation instead of a
//      fixed line (the fixed line is kept only as an error-path fallback).
//
// STATUS: state machine transitions verified via `npm run build` + a running dev
// server hitting the real (built) /api/keen/session-token and /api/keen/session-end
// routes, which are currently unconfigured (no provider/Airtable keys) and so
// exercise the real failure/fallback paths end-to-end. The live provider WebSocket
// connection itself is Written but unverified — no API keys were available to
// complete a real voice session in this build pass.
import { useCallback, useRef, useState } from "react";
import type {
  ContactInfo,
  SessionEndContactResponse,
  SessionEndRequest,
  SessionEndTranscriptResponse,
  SessionTokenResponse,
  TranscriptTurn,
  VoiceSession,
  WidgetPhase,
} from "./types";
import { connectVoiceSession } from "./providers";
import type { ConnectedSessionToken } from "./providers/connectedSession";

const CONSULTING_ANIMATION_MS = 1400; // purely cosmetic pause per the spec — "load-bearing" for selling that real reasoning happened
const RELAY_DISPLAY_MS = 3400;

// Error-path fallback ONLY (per docs/keen-and-ken-widget-spec.md's "Example closing
// line" pattern, verbatim in spirit): used only if the real session-end(stage:
// "transcript") call fails outright, so Keen still has something spec-compliant to
// say — a time-range estimate, a vague reassurance never a number, a push to
// contact capture — rather than a broken relay phase. The normal path speaks Ken's
// real, per-conversation `recommendation` returned by that call.
const FALLBACK_RELAY_LINE =
  "Our team can definitely help with this. Projects like yours usually take anywhere from a couple months to about six months depending on scope, and it's typically pretty affordable to get started. I can't give you exact numbers here, but if you share your contact info, someone from our team will reach out with the specifics.";

const MIN_THINKING_MS = 900; // floor so "thinking" never flashes faster than it can be perceived, even if the real call resolves instantly

interface UseKeenKenSessionResult {
  phase: WidgetPhase;
  errorMessage: string | null;
  relayText: string | null;
  liveCaption: string | null; // most recent partial transcript, visitor or Keen, for on-screen feedback
  start: () => void;
  stopAndConsult: () => void; // visitor-initiated "I'm done, what do you think?"
  submitContact: (contact: ContactInfo) => Promise<void>;
  reset: () => void;
  close: () => void;
}

export function useKeenKenSession(): UseKeenKenSessionResult {
  const [phase, setPhase] = useState<WidgetPhase>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [relayText, setRelayText] = useState<string | null>(null);
  const [liveCaption, setLiveCaption] = useState<string | null>(null);

  const sessionRef = useRef<VoiceSession | null>(null);
  const voiceProviderRef = useRef<SessionTokenResponse["provider"] | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const endReasonRef = useRef<SessionEndRequest["endReason"]>("visitor_ended");
  const transcriptRef = useRef<TranscriptTurn[]>([]);
  const turnCountRef = useRef(0);
  const maxTurnsRef = useRef(6);

  const cleanupVoiceSession = useCallback(() => {
    if (sessionRef.current) {
      void sessionRef.current.endSession().catch(() => {
        // Best-effort teardown; the session is already being abandoned.
      });
      sessionRef.current = null;
    }
  }, []);

  const speakRelay = useCallback((text: string) => {
    try {
      if (typeof window !== "undefined" && "speechSynthesis" in window && text) {
        // Design decision (flagged, not silent): session-end doesn't return a
        // recommendation to speak (see file header), and reopening a full realtime
        // voice session for two fixed sentences would be disproportionate. The
        // browser's built-in SpeechSynthesis API gives Keen an actual spoken voice
        // for this line at zero cost and zero vendor lock, while the same text is
        // always shown on screen regardless of whether speech succeeds.
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Speech synthesis is a nice-to-have on top of the on-screen text, which is
      // always shown regardless — never let this throw block the flow.
    }
  }, []);

  const runConsultAndRelay = useCallback(
    (transcript: TranscriptTurn[], reason: SessionEndRequest["endReason"]) => {
      transcriptRef.current = transcript;
      endReasonRef.current = reason;
      setPhase("consulting");

      window.setTimeout(() => {
        setPhase("thinking");
        const sessionId = sessionIdRef.current;
        const thinkingStartedAt = Date.now();

        const speakAndAdvance = (text: string) => {
          const elapsed = Date.now() - thinkingStartedAt;
          const remaining = Math.max(0, MIN_THINKING_MS - elapsed);
          window.setTimeout(() => {
            setRelayText(text);
            setPhase("relaying");
            speakRelay(text);
            window.setTimeout(() => setPhase("convert"), RELAY_DISPLAY_MS);
          }, remaining);
        };

        if (!sessionId) {
          // No session id (shouldn't happen if start() succeeded, but this path
          // must degrade, not crash) — fall back to the spec-compliant fixed line.
          speakAndAdvance(FALLBACK_RELAY_LINE);
          return;
        }

        (async () => {
          try {
            const body: SessionEndRequest = { sessionId, stage: "transcript", transcript, endReason: reason };
            const res = await fetch("/api/keen/session-end", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });
            const data: SessionEndTranscriptResponse = await res.json();
            if (!res.ok || !data.recommendation) {
              throw new Error("session-end(transcript) did not return a recommendation");
            }
            speakAndAdvance(data.recommendation);
          } catch (err) {
            // Ken's reasoning call failing must never block the visitor-facing
            // flow (docs/keen-and-ken-voice-architecture.md 6.5) — the fixed,
            // spec-compliant line is the correct degrade here, not an error state.
            console.error("session-end(stage=transcript) failed; using fallback relay line:", err);
            speakAndAdvance(FALLBACK_RELAY_LINE);
          }
        })();
      }, CONSULTING_ANIMATION_MS);
    },
    [speakRelay]
  );

  const handleSessionEnd = useCallback(
    (reason: "visitor_ended" | "max_turns" | "timeout" | "error", transcript: TranscriptTurn[]) => {
      sessionRef.current = null;
      if (reason === "error") {
        transcriptRef.current = transcript;
        setPhase("error");
        setErrorMessage(
          "Looks like the connection dropped. You can still leave your contact info and we'll follow up personally."
        );
        return;
      }
      runConsultAndRelay(transcript, reason);
    },
    [runConsultAndRelay]
  );

  const start = useCallback(() => {
    setErrorMessage(null);
    setPhase("permission");
    turnCountRef.current = 0;
    transcriptRef.current = [];

    (async () => {
      let tokenResponse: SessionTokenResponse;
      try {
        setPhase("connecting");
        const res = await fetch("/api/keen/session-token", { method: "POST" });
        // The real route returns a non-2xx status on total provider failure and
        // never sets a `success` field (see file header's INTEGRATION FIX note) —
        // check res.ok plus the fields actually present on success.
        tokenResponse = await res.json();
        if (
          !res.ok ||
          !tokenResponse.token ||
          !tokenResponse.provider ||
          !tokenResponse.systemPrompt ||
          !tokenResponse.sessionId
        ) {
          throw new Error(tokenResponse.error || `session-token returned ${res.status}`);
        }
      } catch {
        // Per docs/keen-and-ken-widget-spec.md and the architecture doc's failure
        // handling (6.5): a session that fails to start degrades gracefully —
        // never a broken or blank widget. Route straight to contact capture so a
        // visitor who hit this can still become a lead.
        setPhase("error");
        setErrorMessage(
          "Voice chat isn't available right now. You can still leave your contact info below and our team will reach out directly."
        );
        return;
      }

      voiceProviderRef.current = tokenResponse.provider;
      sessionIdRef.current = tokenResponse.sessionId ?? null;
      maxTurnsRef.current = tokenResponse.maxTurns ?? 6;

      const connectedToken: ConnectedSessionToken = {
        ...tokenResponse,
        provider: tokenResponse.provider,
        token: tokenResponse.token,
        systemPrompt: tokenResponse.systemPrompt,
        maxTurns: maxTurnsRef.current,
      };

      try {
        const session = await connectVoiceSession(connectedToken, {
          onPartialTranscript: (who, text, isFinal) => {
            setLiveCaption(text);
            setPhase(who === "keen" ? "speaking" : "listening");
            if (isFinal && who === "keen") setPhase("listening");
          },
          onAudioChunk: () => {
            // Playback itself happens inside the provider connector; nothing
            // additional needed at the widget level.
          },
          onInterrupted: () => {
            setPhase("listening");
          },
          onTurnComplete: (turn) => {
            transcriptRef.current = [...transcriptRef.current, turn];
            turnCountRef.current += 1;
            if (turnCountRef.current >= maxTurnsRef.current) {
              cleanupVoiceSession();
              runConsultAndRelay(transcriptRef.current, "max_turns");
            }
          },
          onSessionEnd: handleSessionEnd,
          onError: (err) => {
            if (!err.recoverable) {
              setPhase("error");
              setErrorMessage(
                "Looks like the connection dropped. You can still leave your contact info and we'll follow up personally."
              );
            }
          },
        });
        sessionRef.current = session;
        setPhase("listening");
      } catch {
        setPhase("error");
        setErrorMessage(
          "Couldn't start the microphone connection. You can still leave your contact info below and our team will reach out directly."
        );
      }
    })();
  }, [cleanupVoiceSession, handleSessionEnd, runConsultAndRelay]);

  const stopAndConsult = useCallback(() => {
    const transcript = transcriptRef.current;
    cleanupVoiceSession();
    runConsultAndRelay(transcript, "visitor_ended");
  }, [cleanupVoiceSession, runConsultAndRelay]);

  const submitContact = useCallback(async (contact: ContactInfo) => {
    const sessionId = sessionIdRef.current;
    if (!sessionId) {
      // No session id means stage "transcript" never ran (e.g. the visitor hit the
      // error path before a token was ever minted) — the route has no record to
      // attach contact info to yet, so create one directly via a synthetic
      // transcript-free session id rather than losing the lead. crypto.randomUUID()
      // is safe here since findRecordBySessionId() on the server will simply find
      // nothing and fall through to its own "create a fresh record" path.
      sessionIdRef.current = globalThis.crypto.randomUUID();
    }
    const body: SessionEndRequest = {
      sessionId: sessionIdRef.current as string,
      stage: "contact",
      // The route's ContactInfo is { name, contact } — one free-text field, split
      // into Email/Phone server-side. Send it as-is, do not pre-split here.
      contact: { name: contact.name, contact: contact.contact },
    };
    const res = await fetch("/api/keen/session-end", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data: SessionEndContactResponse = await res.json().catch(() => ({ ok: false }));
    if (!res.ok || data.ok === false) {
      throw new Error(data.error || `session-end returned ${res.status}`);
    }
    setPhase("done");
  }, []);

  const reset = useCallback(() => {
    cleanupVoiceSession();
    setPhase("idle");
    setErrorMessage(null);
    setRelayText(null);
    setLiveCaption(null);
    transcriptRef.current = [];
    turnCountRef.current = 0;
    voiceProviderRef.current = null;
    sessionIdRef.current = null;
  }, [cleanupVoiceSession]);

  const close = useCallback(() => {
    cleanupVoiceSession();
    setPhase("closed");
  }, [cleanupVoiceSession]);

  return { phase, errorMessage, relayText, liveCaption, start, stopAndConsult, submitContact, reset, close };
}
