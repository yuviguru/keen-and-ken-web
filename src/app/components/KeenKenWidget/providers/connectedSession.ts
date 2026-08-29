// A narrowed view of SessionTokenResponse for the connectors: by the time
// useKeenKenSession.ts calls connectVoiceSession, it has already validated
// success/token/provider are present (see start() in useKeenKenSession.ts), so the
// connectors themselves can work with required fields instead of re-checking
// optionality that was already handled one layer up.
import type { SessionTokenResponse, VoiceProviderId } from "../types";

export interface ConnectedSessionToken extends SessionTokenResponse {
  provider: VoiceProviderId;
  token: string;
  systemPrompt: string;
  maxTurns: number;
}
