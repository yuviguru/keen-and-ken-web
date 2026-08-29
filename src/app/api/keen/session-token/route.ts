import { NextResponse } from "next/server";
// Keen & Ken voice widget - session-token minting (engineer-backend track).
// Contract: docs/keen-and-ken-voice-architecture.md section 6.2 (client/server split) + 6.3
// (config) + 6.5 (failure handling), docs/keen-and-ken-widget-spec.md (conversation flow).
//
// Per section 6.2: "our backend never proxies raw audio ... it only (a) mints the ephemeral
// token ... using the real API key, kept server-side ... and (b) receives the final transcript
// via the provider's session-end event." This route is (a). The browser takes the token/session
// info returned here and connects directly to the voice provider over WebSocket - this route
// never touches audio.
//
// REQUEST/RESPONSE CONTRACT: matched exactly against the already-built caller,
// src/app/components/KeenKenWidget/useKeenKenSession.ts + types.ts (`SessionTokenResponse`),
// not guessed independently - engineer-frontend built and clearly flagged their assumption
// (types.ts's comment on SessionTokenResponse) before this route existed, so this route
// conforms to that documented shape rather than the other way around:
//   - POST with no body.
//   - On success: 200 with { provider, token, model?, wsUrl?, systemPrompt, maxTurns, sessionId }.
//   - On total failure (primary + fallback both failed to mint): non-2xx status. The frontend
//     only branches on `res.ok` here (it does not read a `success` field on this route), so a
//     200-with-success:false body would NOT trigger its graceful text/contact-capture fallback -
//     confirmed by reading useKeenKenSession.ts's `start()` before finalizing this.
//
// Integration note: the task brief said to import from `src/lib/voice/factory.ts`, but
// engineer-ai's actual factory.ts only exports `createVoiceProvider()`/`startVoiceSession()`,
// which return/build a full server-mediated VoiceProviderInterface (startSession() +
// onAudioChunk handlers) - the reference-implementation path, not a browser-token mint. Per
// gemini-live.ts's and openai-realtime.ts's own header comments, the actual integration point
// for this route is each provider file's dedicated exported mint function -
// `mintGeminiLiveEphemeralToken()` and `mintOpenAIRealtimeEphemeralToken()` - which their
// comments explicitly name this API route as the intended caller of.
import { mintGeminiLiveEphemeralToken } from "@/lib/voice/gemini-live";
import { mintOpenAIRealtimeEphemeralToken } from "@/lib/voice/openai-realtime";
import type { EphemeralVoiceToken, VoiceProviderId } from "@/lib/voice/types";

// Keen's persona/instructions, per docs/keen-and-ken-widget-spec.md's conversation flow.
// Returned to the client alongside the token: OpenAI's ephemeral-token mint bakes this in as
// `instructions` server-side, but Gemini Live's `mintGeminiLiveEphemeralToken()` only scopes
// the token to a model (see its signature), not a system prompt - so for Gemini, the browser's
// own connect call needs this text to set `systemInstruction` itself (confirmed in
// providers/geminiLiveConnector.ts, which reads `session.systemPrompt`).
const KEEN_SYSTEM_PROMPT = `You are Keen, the voice persona for Keen & Ken Solutions, a B2B software/automation studio.
You are talking live, by voice, with a visitor on keenken.com. Keep the conversation natural, warm,
and short: 2-4 exchanges maximum, never scripted-sounding.

Your job in this conversation:
1. Ask what their business does.
2. Ask what the actual problem or friction is that brought them here today.
3. Ask what they have already tried, if anything.

Rules:
- Never state or imply a dollar figure, ever, for any service.
- Never promise a specific timeline more precise than a rough range.
- You are not the one who gives the recommendation - once you have enough to work with (or you hit
  the turn limit), tell the visitor you are checking with Ken, your reasoning partner, and hand off.
  Do not try to solve their problem yourself.
- After the handoff, relay only Ken's brief summary back in one or two sentences - never read out a
  full structured analysis.
- Close by asking for their name and a way to reach them (email or phone) so the human team can
  follow up with specifics. Never close without attempting to capture contact info.`;

const VALID_VOICE_PROVIDERS: VoiceProviderId[] = [
  "gemini-live",
  "openai-realtime",
  "elevenlabs",
  "self-hosted",
];

// Matches src/lib/voice/factory.ts's own default ('gemini-live' if VOICE_PROVIDER is unset),
// so both integration points behave identically when the env var is missing rather than one
// silently degrading and the other silently defaulting.
const DEFAULT_VOICE_PROVIDER: VoiceProviderId = "gemini-live";

function readVoiceProviderEnv(name: "VOICE_PROVIDER" | "VOICE_FALLBACK_PROVIDER"): VoiceProviderId | null {
  const value = process.env[name];
  if (!value) return null;
  if (!VALID_VOICE_PROVIDERS.includes(value as VoiceProviderId)) {
    console.error(`session-token: ${name} is set to an unrecognized provider id: "${value}"`);
    return null;
  }
  return value as VoiceProviderId;
}

async function mintForProvider(
  id: VoiceProviderId,
  opts: { model?: string; systemPrompt: string; voiceId?: string }
): Promise<EphemeralVoiceToken> {
  switch (id) {
    case "gemini-live":
      return mintGeminiLiveEphemeralToken({ model: opts.model });
    case "openai-realtime":
      return mintOpenAIRealtimeEphemeralToken({
        model: opts.model,
        systemPrompt: opts.systemPrompt,
        voiceId: opts.voiceId,
      });
    case "elevenlabs":
    case "self-hosted":
      throw new Error(
        `Voice provider "${id}" is named in the interface but has no mint-token implementation in this build pass (src/lib/voice/${id}.ts does not exist yet).`
      );
    default:
      throw new Error(`Unknown voice provider: ${id}`);
  }
}

function newSessionId(): string {
  // Purely a correlation id between this token mint and the two later session-end calls
  // (stage "transcript" then stage "contact") - no server-side session store is created or
  // needed (would be gold-plating at this scale); session-end's stage "contact" call finds the
  // stage "transcript" record it belongs to by searching the Pipeline for this id embedded in
  // Notes (see session-end/route.ts).
  return globalThis.crypto.randomUUID();
}

export async function POST(request: Request) {
  // Frontend sends no body (see useKeenKenSession.ts's `start()`), but accept and ignore one
  // defensively rather than requiring `Content-Type: application/json` with an empty body.
  try {
    await request.text();
  } catch {
    // Not fatal - body is entirely optional here.
  }

  const primary = readVoiceProviderEnv("VOICE_PROVIDER") ?? DEFAULT_VOICE_PROVIDER;
  const fallback = readVoiceProviderEnv("VOICE_FALLBACK_PROVIDER");
  const maxTurns = Number(process.env.VOICE_MAX_TURNS ?? 6);
  const sessionId = newSessionId();
  const mintOpts = { systemPrompt: KEEN_SYSTEM_PROMPT };

  try {
    const token = await mintForProvider(primary, mintOpts);
    return NextResponse.json({ ...token, systemPrompt: KEEN_SYSTEM_PROMPT, maxTurns, sessionId });
  } catch (primaryErr) {
    console.error(
      `session-token: primary voice provider "${primary}" failed to mint a session token:`,
      primaryErr
    );

    if (fallback) {
      try {
        const token = await mintForProvider(fallback, mintOpts);
        return NextResponse.json({
          ...token,
          systemPrompt: KEEN_SYSTEM_PROMPT,
          maxTurns,
          sessionId,
          usedFallback: true,
        });
      } catch (fallbackErr) {
        console.error(
          `session-token: fallback voice provider "${fallback}" also failed to mint a session token:`,
          fallbackErr
        );
      }
    } else {
      console.error("session-token: no VOICE_FALLBACK_PROVIDER configured; skipping fallback attempt.");
    }

    // Both primary and (if configured) fallback failed: non-2xx so the widget's `!res.ok`
    // check fires and it degrades to text/contact-capture per architecture doc section 6.5 -
    // never a broken or blank widget.
    return NextResponse.json(
      { error: "Voice session could not be started; both configured providers failed." },
      { status: 503 }
    );
  }
}
