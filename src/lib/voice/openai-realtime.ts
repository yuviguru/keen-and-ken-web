// src/lib/voice/openai-realtime.ts
//
// Keen's configured voice fallback (docs/keen-and-ken-voice-architecture.md
// section 5): OpenAI Realtime, used when VOICE_FALLBACK_PROVIDER=openai-realtime
// fires per factory.ts's failure handling, or when VOICE_PROVIDER=openai-realtime
// is selected directly.
//
// ============================================================================
// CLIENT/SERVER BOUNDARY — same split as gemini-live.ts, read that file's
// header comment first if you haven't. Short version: this file owns (1)
// server-only ephemeral client-secret minting and (2) a complete reference
// implementation of VoiceProviderInterface that runs the actual duplex
// session wherever this code executes (server-side WebSocket to OpenAI).
// The production-latency path is the frontend connecting directly to
// OpenAI (WebRTC, per OpenAI's own guidance for browser clients) using the
// ephemeral client secret from `mintOpenAIRealtimeEphemeralToken()` below
// — that direct browser connection is the frontend engineer's territory,
// not built here.
// ============================================================================
//
// Written but unverified: no OPENAI_REALTIME_API_KEY is provisioned in
// this build pass. Endpoint/event names below match OpenAI's documented
// Realtime API as of 2026-08-29 (developers.openai.com/api/docs/guides/
// realtime, /realtime-conversations, and the client_secrets reference),
// fetched/searched directly, but this exact combination has NOT been
// exercised against a live connection. Two things flagged explicitly
// because they are known to have changed recently and could not be
// pinned to one single fetched source: (a) the audio-delta event name —
// older docs/examples use `response.audio.delta`, current ones use
// `response.output_audio.delta`; this file listens for both so it does
// not silently drop audio if OpenAI is mid-migration on any given
// account. (b) the exact client_secret response field names
// (`value`/`expires_at` at the top level) came from a WebSearch summary
// of the reference docs, not a direct WebFetch of that exact page (it
//404'd/403'd in this pass) — re-verify against a live call before trusting
// this in production.

import type {
  EphemeralVoiceToken,
  TranscriptTurn,
  VoiceProviderInterface,
  VoiceSession,
  VoiceSessionConfig,
  VoiceSessionHandlers,
} from './types'

export const OPENAI_REALTIME_DEFAULT_MODEL = 'gpt-realtime-2.1'

const CLIENT_SECRETS_URL = 'https://api.openai.com/v1/realtime/client_secrets'
const REALTIME_WS_URL = 'wss://api.openai.com/v1/realtime'

/**
 * Server-only. Mints a short-lived OpenAI Realtime client secret using the
 * real OPENAI_REALTIME_API_KEY. Hand the returned token to the frontend;
 * never the real key.
 */
export async function mintOpenAIRealtimeEphemeralToken(
  config: Pick<VoiceSessionConfig, 'model' | 'systemPrompt' | 'voiceId'>
): Promise<EphemeralVoiceToken> {
  const apiKey = process.env.OPENAI_REALTIME_API_KEY
  if (!apiKey) throw new Error('mintOpenAIRealtimeEphemeralToken: OPENAI_REALTIME_API_KEY is required')

  const model = config.model || OPENAI_REALTIME_DEFAULT_MODEL

  const response = await fetch(CLIENT_SECRETS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      session: {
        type: 'realtime',
        model,
        instructions: config.systemPrompt,
        ...(config.voiceId ? { audio: { output: { voice: config.voiceId } } } : {}),
      },
    }),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(
      `mintOpenAIRealtimeEphemeralToken error (${response.status}): ${errorBody?.error?.message || response.statusText}`
    )
  }

  const data = (await response.json()) as { value: string; expires_at: number }

  return {
    token: data.value,
    provider: 'openai-realtime',
    model,
    expiresAt: new Date(data.expires_at * 1000).toISOString(),
  }
}

export class OpenAIRealtimeProvider implements VoiceProviderInterface {
  async startSession(config: VoiceSessionConfig, handlers: VoiceSessionHandlers): Promise<VoiceSession> {
    const apiKey = process.env.OPENAI_REALTIME_API_KEY
    if (!apiKey) {
      throw new Error('OpenAIRealtimeProvider.startSession: OPENAI_REALTIME_API_KEY is required')
    }

    // Lazy import: `ws` is a server-only dependency (Node's own WebSocket
    // client isn't reliably available across every Next.js server
    // runtime this could execute under). Keeping the import inside the
    // method means a browser bundle that accidentally pulls this file in
    // fails loudly on the real API-key check above before ever touching
    // this import, rather than crashing on bundling `ws` for the client.
    const { WebSocket } = await import('ws')

    const model = config.model || OPENAI_REALTIME_DEFAULT_MODEL
    const maxTurns = config.maxTurns ?? 6

    const ws = new WebSocket(`${REALTIME_WS_URL}?model=${encodeURIComponent(model)}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })

    const transcript: TranscriptTurn[] = []
    let completedTurns = 0
    let ended = false
    let currentKeenText = ''

    await new Promise<void>((resolve, reject) => {
      ws.once('open', () => resolve())
      ws.once('error', (err: Error) => reject(err))
    })

    ws.send(
      JSON.stringify({
        type: 'session.update',
        session: {
          instructions: config.systemPrompt,
          modalities: ['audio', 'text'],
          turn_detection: config.interruptible === false ? null : { type: 'server_vad' },
          ...(config.voiceId ? { voice: config.voiceId } : {}),
        },
      })
    )

    ws.on('message', (raw: Buffer) => {
      let event: Record<string, unknown>
      try {
        event = JSON.parse(raw.toString())
      } catch {
        handlers.onError({ code: 'openai_realtime_bad_event', message: 'Received non-JSON event', recoverable: true })
        return
      }

      switch (event.type) {
        // Audio deltas: listen for both the current and previously-documented
        // event name (see file header comment on why).
        case 'response.output_audio.delta':
        case 'response.audio.delta': {
          const delta = event.delta as string | undefined
          if (delta) handlers.onAudioChunk(Buffer.from(delta, 'base64'))
          break
        }

        case 'conversation.item.input_audio_transcription.completed': {
          const text = (event.transcript as string) || ''
          handlers.onPartialTranscript?.('visitor', text, true)
          transcript.push({ role: 'visitor', text, at: new Date().toISOString() })
          break
        }

        case 'response.output_audio_transcript.delta': {
          currentKeenText += (event.delta as string) || ''
          handlers.onPartialTranscript?.('keen', currentKeenText, false)
          break
        }

        case 'response.output_audio_transcript.done': {
          const text = (event.transcript as string) || currentKeenText
          handlers.onPartialTranscript?.('keen', text, true)
          currentKeenText = ''
          break
        }

        case 'input_audio_buffer.speech_started': {
          handlers.onInterrupted?.()
          break
        }

        case 'response.done': {
          completedTurns += 1
          const turn: TranscriptTurn = {
            role: 'keen',
            text: transcript.filter((t) => t.role === 'keen').slice(-1)[0]?.text || '',
            at: new Date().toISOString(),
          }
          transcript.push(turn)
          handlers.onTurnComplete?.(turn)

          if (completedTurns >= maxTurns && !ended) {
            ended = true
            handlers.onSessionEnd?.('max_turns', transcript)
            ws.close()
          }
          break
        }

        case 'error': {
          const err = event.error as { message?: string; code?: string } | undefined
          handlers.onError({
            code: err?.code || 'openai_realtime_error',
            message: err?.message || 'Unknown OpenAI Realtime error',
            recoverable: true,
          })
          break
        }

        default:
          // Deliberately silent for the many event types this app doesn't
          // need (rate limit updates, item creation acks, etc.) — not a
          // failure path, just events we don't act on.
          break
      }
    })

    ws.on('close', () => {
      if (!ended) {
        ended = true
        handlers.onSessionEnd?.('error', transcript)
      }
    })

    ws.on('error', (err: Error) => {
      handlers.onError({ code: 'openai_realtime_ws_error', message: err.message, recoverable: false })
    })

    return {
      sendAudioChunk(chunk: Uint8Array) {
        ws.send(
          JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: Buffer.from(chunk).toString('base64'),
          })
        )
      },
      interrupt() {
        ws.send(JSON.stringify({ type: 'response.cancel' }))
        handlers.onInterrupted?.()
      },
      async endSession() {
        if (!ended) {
          ended = true
          handlers.onSessionEnd?.('visitor_ended', transcript)
        }
        ws.close()
        return { transcript }
      },
    }
  }
}
