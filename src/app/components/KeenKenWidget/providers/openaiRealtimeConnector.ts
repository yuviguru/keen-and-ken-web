/**
 * OpenAI Realtime API connector — browser-side session.
 *
 * BIGGEST OPEN GAP IN THIS BUILD PASS, flagged plainly rather than guessed past:
 * the real session-token route (src/app/api/keen/session-token/route.ts) mints
 * this provider's token via `mintOpenAIRealtimeEphemeralToken()`
 * (src/lib/voice/openai-realtime.ts), which calls OpenAI's
 * `/v1/realtime/client_secrets` endpoint and returns a short-lived ephemeral
 * *client secret* (`data.value`) — NOT a raw API key. OpenAI's documented browser
 * integration for that kind of ephemeral secret is WebRTC (an SDP offer/answer
 * exchange against `/v1/realtime/calls` with the secret as a Bearer token), not a
 * plain WebSocket. The `openai-insecure-api-key.<token>` WebSocket subprotocol
 * used below is only valid for a real, long-lived API key exposed directly to the
 * browser (which must never happen — the "insecure" in its own name is OpenAI's
 * own warning) and is very likely the WRONG transport for the ephemeral secret
 * this route actually produces. Treat this file as a structural placeholder for
 * the VoiceSession contract and event-handling shape only, not a working
 * connection — replacing the transport with a real WebRTC implementation is a
 * dedicated follow-up, not something to guess further in this pass.
 *
 * Event names below (`session.update`, `input_audio_buffer.append`,
 * `response.audio.delta`, etc.) otherwise mirror the reference server
 * implementation in src/lib/voice/openai-realtime.ts (engineer-ai's track,
 * including its own noted audio-delta-event-name ambiguity), so at least the
 * message-level shape is consistent with the one other place in the codebase
 * that talks to this API — nothing here has been run against a live connection.
 */
import type { TranscriptTurn, VoiceSession, VoiceSessionHandlers } from "../types";
import type { ConnectedSessionToken } from "./connectedSession";
import { startAudioCapture, type AudioCaptureHandle } from "../audioCapture";
import { createAudioPlayback, type AudioPlaybackHandle } from "../audioPlayback";

const PLAYBACK_SAMPLE_RATE = 24000; // gpt-realtime's documented output rate as of general knowledge — re-verify at build time.

export async function connectOpenAIRealtime(
  session: ConnectedSessionToken,
  handlers: VoiceSessionHandlers
): Promise<VoiceSession> {
  const wsUrl = `wss://api.openai.com/v1/realtime?model=${encodeURIComponent(session.model ?? "gpt-realtime-mini")}`;

  const socket = new WebSocket(wsUrl, ["realtime", `openai-insecure-api-key.${session.token}`]);
  const transcript: TranscriptTurn[] = [];
  const playback: AudioPlaybackHandle = createAudioPlayback(PLAYBACK_SAMPLE_RATE);
  let capture: AudioCaptureHandle | null = null;

  await new Promise<void>((resolve, reject) => {
    const openListener = () => {
      socket.send(
        JSON.stringify({
          type: "session.update",
          session: {
            instructions: session.systemPrompt,
            input_audio_format: "pcm16",
            output_audio_format: "pcm16",
            turn_detection: { type: "server_vad" },
          },
        })
      );
      resolve();
    };
    const errorListener = () => reject(new Error("OpenAI Realtime connection failed"));
    socket.addEventListener("open", openListener, { once: true });
    socket.addEventListener("error", errorListener, { once: true });
  });

  socket.addEventListener("message", (event) => {
    try {
      const msg = JSON.parse(event.data as string);
      switch (msg.type) {
        // Listen for both the current and previously-documented event name (per
        // src/lib/voice/openai-realtime.ts's own note: this changed recently and
        // accounts may be mid-migration).
        case "response.output_audio.delta":
        case "response.audio.delta": {
          const bytes = base64ToBytes(msg.delta as string);
          handlers.onAudioChunk(bytes);
          playback.enqueue(bytes);
          break;
        }
        case "response.audio_transcript.delta":
          handlers.onPartialTranscript?.("keen", msg.delta as string, false);
          break;
        case "response.audio_transcript.done": {
          handlers.onPartialTranscript?.("keen", (msg.transcript as string) ?? "", true);
          const turn: TranscriptTurn = {
            role: "keen",
            text: (msg.transcript as string) ?? "",
            at: new Date().toISOString(),
          };
          transcript.push(turn);
          handlers.onTurnComplete?.(turn);
          break;
        }
        case "conversation.item.input_audio_transcription.completed":
          handlers.onPartialTranscript?.("visitor", (msg.transcript as string) ?? "", true);
          transcript.push({ role: "visitor", text: (msg.transcript as string) ?? "", at: new Date().toISOString() });
          break;
        case "input_audio_buffer.speech_started":
          handlers.onInterrupted?.();
          break;
        case "error":
          handlers.onError({
            code: msg.error?.code ?? "unknown",
            message: msg.error?.message ?? "OpenAI Realtime error",
            recoverable: true,
          });
          break;
        default:
          // Every other event type (response.created, response.done, rate limit
          // notices, etc.) is intentionally ignored here — nothing in the widget's
          // state machine needs them. TODO(verify): confirm nothing important is
          // being silently skipped once this runs against a live session.
          break;
      }
    } catch (err) {
      handlers.onError({ code: "parse_error", message: String(err), recoverable: true });
    }
  });

  socket.addEventListener("close", () => {
    handlers.onSessionEnd?.("visitor_ended", transcript);
  });

  socket.addEventListener("error", () => {
    handlers.onError({ code: "socket_error", message: "OpenAI Realtime socket error", recoverable: false });
  });

  capture = await startAudioCapture(
    (chunk) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "input_audio_buffer.append",
            audio: bytesToBase64(new Uint8Array(chunk.buffer)),
          })
        );
      }
    },
    (message) => handlers.onError({ code: "mic_error", message, recoverable: false })
  );

  return {
    sendAudioChunk: () => {
      // Audio streams directly from the capture callback above; kept here only to
      // satisfy the shared VoiceSession interface.
    },
    interrupt: () => {
      playback.stop();
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "response.cancel" }));
      }
      handlers.onInterrupted?.();
    },
    endSession: async () => {
      capture?.stop();
      playback.stop();
      if (socket.readyState === WebSocket.OPEN) socket.close();
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
