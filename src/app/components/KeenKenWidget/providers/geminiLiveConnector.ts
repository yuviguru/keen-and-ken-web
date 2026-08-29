/**
 * Gemini Live API connector — browser-side session using the @google/genai SDK.
 *
 * Rewritten to reuse the exact same SDK call shape already used server-side in
 * src/lib/voice/gemini-live.ts (`GeminiLiveProvider.startSession`, engineer-ai's
 * track), rather than hand-rolling a raw WebSocket protocol: that file's own
 * header comment confirms the browser is meant to use the ephemeral token from
 * `mintGeminiLiveEphemeralToken()` (returned as `token.name`, used as the SDK's
 * `apiKey`) directly with this SDK, and Google's docs describe @google/genai as
 * usable client-side for exactly this ephemeral-token pattern. Mirroring the
 * server file's `onmessage` handling (same field names: `serverContent.modelTurn`,
 * `outputTranscription`, `inputTranscription`, `turnComplete`, `interrupted`) means
 * this connector is consistent with the one other place in the codebase that
 * actually calls this SDK, instead of an independently-guessed protocol.
 *
 * STATUS: Written but unverified — no GEMINI_LIVE_API_KEY/ephemeral token was
 * available in this build pass to exercise a real browser session end to end.
 * `GEMINI_LIVE_DEFAULT_MODEL` below is copied from gemini-live.ts so the two
 * sides never drift on the default; if that file's constant changes, update this
 * one too (kept as a plain literal, not a shared import, per this build's
 * server/client file-ownership split — this file must never import from
 * src/lib/voice, which is server-only).
 */
import { GoogleGenAI, Modality } from "@google/genai";
import type { TranscriptTurn, VoiceSession, VoiceSessionHandlers } from "../types";
import type { ConnectedSessionToken } from "./connectedSession";
import { startAudioCapture, type AudioCaptureHandle } from "../audioCapture";
import { createAudioPlayback, type AudioPlaybackHandle } from "../audioPlayback";

const GEMINI_LIVE_DEFAULT_MODEL = "gemini-3.1-flash-live-preview"; // kept in sync with src/lib/voice/gemini-live.ts by hand — see file header
const PLAYBACK_SAMPLE_RATE = 24000; // Gemini Live's documented output rate — re-verify at build time (architecture doc section 7)

interface GeminiLiveMessage {
  serverContent?: {
    modelTurn?: { parts?: Array<{ inlineData?: { data?: string; mimeType?: string } }> };
    inputTranscription?: { text?: string };
    outputTranscription?: { text?: string };
    turnComplete?: boolean;
    interrupted?: boolean;
  };
}

export async function connectGeminiLive(
  session: ConnectedSessionToken,
  handlers: VoiceSessionHandlers
): Promise<VoiceSession> {
  const model = session.model || GEMINI_LIVE_DEFAULT_MODEL;
  const ai = new GoogleGenAI({ apiKey: session.token });

  const transcript: TranscriptTurn[] = [];
  const playback: AudioPlaybackHandle = createAudioPlayback(PLAYBACK_SAMPLE_RATE);
  let capture: AudioCaptureHandle | null = null;
  let ended = false;

  const liveSession = await ai.live.connect({
    model,
    config: {
      responseModalities: [Modality.AUDIO],
      systemInstruction: session.systemPrompt,
    },
    callbacks: {
      onmessage: (message: GeminiLiveMessage) => {
        const content = message.serverContent;
        if (!content) return;

        if (content.interrupted) {
          playback.stop();
          handlers.onInterrupted?.();
        }

        const audioPart = content.modelTurn?.parts?.find((part) => part.inlineData?.data);
        if (audioPart?.inlineData?.data) {
          const bytes = base64ToBytes(audioPart.inlineData.data);
          handlers.onAudioChunk(bytes);
          playback.enqueue(bytes);
        }

        if (content.outputTranscription?.text) {
          handlers.onPartialTranscript?.("keen", content.outputTranscription.text, Boolean(content.turnComplete));
        }
        if (content.inputTranscription?.text) {
          handlers.onPartialTranscript?.("visitor", content.inputTranscription.text, Boolean(content.turnComplete));
        }

        if (content.turnComplete) {
          const turn: TranscriptTurn = {
            role: "keen",
            text: content.outputTranscription?.text || "",
            at: new Date().toISOString(),
          };
          transcript.push(turn);
          handlers.onTurnComplete?.(turn);
        }
      },
      onerror: (err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        handlers.onError({ code: "gemini_live_error", message, recoverable: false });
      },
      onclose: () => {
        if (!ended) {
          ended = true;
          handlers.onSessionEnd?.("error", transcript);
        }
      },
    },
  });

  capture = await startAudioCapture(
    (chunk) => {
      liveSession.sendRealtimeInput({
        audio: { data: bytesToBase64(new Uint8Array(chunk.buffer)), mimeType: "audio/pcm;rate=16000" },
      });
    },
    (message) => handlers.onError({ code: "mic_error", message, recoverable: false })
  );

  return {
    sendAudioChunk: () => {
      // Audio streams directly from the capture callback above; kept only to
      // satisfy the shared VoiceSession interface.
    },
    interrupt: () => {
      // Gemini Live detects barge-in from the incoming audio stream itself (per
      // architecture doc section 2); there is no documented explicit "interrupt
      // now" client message. A manual/button-triggered interrupt still stops
      // local playback immediately rather than waiting on a round trip.
      playback.stop();
      handlers.onInterrupted?.();
    },
    endSession: async () => {
      if (!ended) {
        ended = true;
        handlers.onSessionEnd?.("visitor_ended", transcript);
      }
      capture?.stop();
      playback.stop();
      liveSession.close();
      return { transcript };
    },
  };
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
