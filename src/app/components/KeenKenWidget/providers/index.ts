// Factory: picks the browser-side WebSocket connector to use based on which
// provider POST /api/keen/session-token said to use. Mirrors the factory shape
// in docs/keen-and-ken-voice-architecture.md section 6.4, on the client side.
// ElevenLabs and self-hosted are documented server-side options in the
// architecture doc but are not in scope here — no spec doc lists them as an
// expected client target for v1, so they are intentionally left unimplemented
// rather than stubbed speculatively.
import type { VoiceSession, VoiceSessionHandlers } from "../types";
import type { ConnectedSessionToken } from "./connectedSession";
import { connectGeminiLive } from "./geminiLiveConnector";
import { connectOpenAIRealtime } from "./openaiRealtimeConnector";

export async function connectVoiceSession(
  session: ConnectedSessionToken,
  handlers: VoiceSessionHandlers
): Promise<VoiceSession> {
  switch (session.provider) {
    case "gemini-live":
      return connectGeminiLive(session, handlers);
    case "openai-realtime":
      return connectOpenAIRealtime(session, handlers);
    default:
      throw new Error(`Unknown voice provider: ${session.provider}`);
  }
}
