// src/lib/voice/gemini-live.ts
//
// Keen's default voice provider (docs/keen-and-ken-voice-architecture.md
// section 5): Gemini Live, Google's native audio-in/audio-out model.
//
// ============================================================================
// CLIENT/SERVER BOUNDARY — read this before wiring this file into anything.
// ============================================================================
// Per architecture doc section 6.2 ("Where the client/server split
// matters for latency"), the production-latency path is: our backend
// mints a short-lived ephemeral token using the real GEMINI_LIVE_API_KEY,
// and the BROWSER connects directly to Gemini's Live API over
// WebSocket/WebRTC using that token — raw audio never round-trips through
// our server, because that extra hop is exactly the kind of hidden
// latency docs/engineering-standards.md says to catch up front.
//
// This file owns two things, and only two things:
//
//   1. `mintGeminiLiveEphemeralToken()` — the real, server-only work. This
//      is the piece that touches the actual GEMINI_LIVE_API_KEY and must
//      never run in a browser bundle. The backend engineer's API route
//      calls this, then hands the returned token (NOT the real key) to
//      the frontend.
//
//   2. `GeminiLiveProvider` — a complete, working implementation of
//      `VoiceProviderInterface` (the "session-start contract"), so
//      `createVoiceProvider('gemini-live')` is genuinely usable end to
//      end and the factory/fallback machinery in factory.ts can be
//      exercised and typechecked. Internally it opens the actual
//      WebSocket to Gemini itself (via the `@google/genai` SDK, which
//      supports running in Node) and relays audio in/out through the
//      `VoiceSession` methods. This is a correct reference
//      implementation, useful for a server-mediated fallback path
//      (e.g. the text-chat degrade path never needs it, but a future
//      non-browser integration could) and for testing the interface
//      shape without a browser.
//
// What this file does NOT own: the browser's microphone capture, the
// browser's <audio>/AudioWorklet playback of Keen's voice, and the actual
// direct-to-Gemini WebSocket connection made FROM the browser using the
// ephemeral token. That is the frontend engineer's territory. In the real
// widget, the frontend should call its own API route (backend engineer's
// job, built on top of `mintGeminiLiveEphemeralToken` below) to get a
// token, then connect directly — it will typically NOT call
// `GeminiLiveProvider.startSession()` at all, since that method's
// `VoiceSession.sendAudioChunk`/`onAudioChunk` model a session running
// wherever this code executes, not a proxy for a connection happening
// elsewhere. This is a genuine interpretation call on an interface that
// has to serve both a real server-side implementation and a
// browser-optimized path; flagged here rather than guessed silently.
//
// Written but unverified: no GEMINI_LIVE_API_KEY is provisioned in this
// build pass. Request/response shapes below match Google's documented
// @google/genai SDK usage as of 2026-08-29 (ai.google.dev/gemini-api/docs/
// live-api/{get-started-sdk,ephemeral-tokens,capabilities}, fetched
// directly). Model id `gemini-3.1-flash-live-preview` is the current
// example model in Google's own docs at time of writing — architecture
// doc section 7 explicitly warns model names in this space drift every
// few weeks; re-confirm before shipping.

import { GoogleGenAI, Modality } from '@google/genai'
import type {
  EphemeralVoiceToken,
  TranscriptTurn,
  VoiceProviderInterface,
  VoiceSession,
  VoiceSessionConfig,
  VoiceSessionHandlers,
} from './types'

export const GEMINI_LIVE_DEFAULT_MODEL = 'gemini-3.1-flash-live-preview'

const EPHEMERAL_TOKEN_LIFETIME_MS = 30 * 60 * 1000 // 30 min to use the token for messages once connected
const NEW_SESSION_WINDOW_MS = 1 * 60 * 1000 // 1 min to actually start a session with the token

/**
 * Server-only. Mints a short-lived Gemini Live ephemeral token scoped to
 * one model/config, using the real GEMINI_LIVE_API_KEY. Never expose the
 * real key to the browser; hand the returned token to the frontend
 * instead (via whatever API route the backend engineer builds on top of
 * this function).
 */
export async function mintGeminiLiveEphemeralToken(
  config: Pick<VoiceSessionConfig, 'model'>
): Promise<EphemeralVoiceToken> {
  const apiKey = process.env.GEMINI_LIVE_API_KEY
  if (!apiKey) throw new Error('mintGeminiLiveEphemeralToken: GEMINI_LIVE_API_KEY is required')

  const model = config.model || GEMINI_LIVE_DEFAULT_MODEL
  const client = new GoogleGenAI({ apiKey })

  const expireTime = new Date(Date.now() + EPHEMERAL_TOKEN_LIFETIME_MS).toISOString()
  const newSessionExpireTime = new Date(Date.now() + NEW_SESSION_WINDOW_MS).toISOString()

  const token = await client.authTokens.create({
    config: {
      uses: 1,
      expireTime,
      newSessionExpireTime,
      liveConnectConstraints: {
        model,
        config: { responseModalities: [Modality.AUDIO] },
      },
    },
  })

  // The SDK's created-token object exposes the usable value as `.name`
  // per Google's own documented usage (`apiKey: token.name` on the client
  // side) — not `.token`/`.value`. Confirmed against two independently
  // fetched doc pages; re-verify against the installed SDK's actual
  // TypeScript types at build time since this is exactly the kind of
  // field name that drifts between SDK versions.
  return {
    token: token.name as string,
    provider: 'gemini-live',
    model,
    expiresAt: expireTime,
  }
}

interface GeminiLiveMessage {
  serverContent?: {
    modelTurn?: { parts?: Array<{ inlineData?: { data?: string; mimeType?: string } }> }
    inputTranscription?: { text?: string }
    outputTranscription?: { text?: string }
    turnComplete?: boolean
    interrupted?: boolean
  }
}

export class GeminiLiveProvider implements VoiceProviderInterface {
  async startSession(config: VoiceSessionConfig, handlers: VoiceSessionHandlers): Promise<VoiceSession> {
    const apiKey = process.env.GEMINI_LIVE_API_KEY
    if (!apiKey) {
      throw new Error('GeminiLiveProvider.startSession: GEMINI_LIVE_API_KEY is required')
    }

    const model = config.model || GEMINI_LIVE_DEFAULT_MODEL
    const maxTurns = config.maxTurns ?? 6
    const ai = new GoogleGenAI({ apiKey })

    const transcript: TranscriptTurn[] = []
    let completedTurns = 0
    let ended = false

    const liveSession = await ai.live.connect({
      model,
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: config.systemPrompt,
      },
      callbacks: {
        onmessage: (message: GeminiLiveMessage) => {
          const content = message.serverContent
          if (!content) return

          if (content.interrupted) {
            handlers.onInterrupted?.()
          }

          const audioPart = content.modelTurn?.parts?.find((part) => part.inlineData?.data)
          if (audioPart?.inlineData?.data) {
            handlers.onAudioChunk(Buffer.from(audioPart.inlineData.data, 'base64'))
          }

          if (content.outputTranscription?.text) {
            handlers.onPartialTranscript?.('keen', content.outputTranscription.text, Boolean(content.turnComplete))
          }
          if (content.inputTranscription?.text) {
            handlers.onPartialTranscript?.('visitor', content.inputTranscription.text, Boolean(content.turnComplete))
          }

          if (content.turnComplete) {
            completedTurns += 1
            const turn: TranscriptTurn = {
              role: 'keen',
              text: content.outputTranscription?.text || '',
              at: new Date().toISOString(),
            }
            transcript.push(turn)
            handlers.onTurnComplete?.(turn)

            if (completedTurns >= maxTurns && !ended) {
              ended = true
              handlers.onSessionEnd?.('max_turns', transcript)
              liveSession.close()
            }
          }
        },
        onerror: (err: unknown) => {
          const message = err instanceof Error ? err.message : String(err)
          handlers.onError({ code: 'gemini_live_error', message, recoverable: false })
        },
        onclose: () => {
          if (!ended) {
            ended = true
            handlers.onSessionEnd?.('error', transcript)
          }
        },
      },
    })

    return {
      sendAudioChunk(chunk: Uint8Array) {
        liveSession.sendRealtimeInput({
          audio: {
            data: Buffer.from(chunk).toString('base64'),
            mimeType: 'audio/pcm;rate=16000',
          },
        })
      },
      interrupt() {
        // Gemini Live detects barge-in from the incoming audio stream
        // itself (per architecture doc section 2, this is one of its
        // stated strengths); there is no documented explicit
        // "interrupt now" client message distinct from just sending new
        // audio. Manual/button-triggered interrupts are surfaced to the
        // app immediately so playback can stop client-side without
        // waiting on the round trip.
        handlers.onInterrupted?.()
      },
      async endSession() {
        if (!ended) {
          ended = true
          handlers.onSessionEnd?.('visitor_ended', transcript)
        }
        liveSession.close()
        return { transcript }
      },
    }
  }
}
