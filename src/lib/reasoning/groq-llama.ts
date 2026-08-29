// src/lib/reasoning/groq-llama.ts
//
// Ken's cheaper/faster reasoning fallback (docs/keen-and-ken-voice-architecture.md
// section 5), used when REASONING_PROVIDER=groq-llama or as the automatic
// fallback when the default (Claude) errors, per factory.ts.
//
// Groq exposes an OpenAI-compatible Chat Completions endpoint
// (https://api.groq.com/openai/v1/chat/completions), so this follows the
// same request shape OpenAI-compatible tooling uses: `tools` +
// `tool_choice` forcing a specific function, for the same reason claude.ts
// forces a tool_use block — reliable, parseable `structured` output instead
// of hoping the model's prose contains valid JSON.
//
// Model id verified against console.groq.com/docs/model/llama-3.3-70b-versatile
// directly (WebFetch, 2026-08-29): no deprecation notice, listed as active.
// One aggregator search result claimed Groq deprecated this model in favor
// of openai/gpt-oss-120b; that did not hold up against the vendor's own
// docs page in this pass, so it was not adopted, but re-verify before a
// long-term commitment (architecture doc section 7's own warning applies).
//
// Written but unverified: no GROQ_API_KEY is provisioned in this build
// pass, so no live call has been made.

import type {
  ReasoningProviderInterface,
  ReasoningRequest,
  ReasoningResponse,
} from './types'
import { REASONING_DEFAULT_MODELS } from './types'
import { buildSystemPrompt } from './claude'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const RECOMMENDATION_FUNCTION_NAME = 'submit_recommendation'

const recommendationFunction = {
  name: RECOMMENDATION_FUNCTION_NAME,
  description:
    "Submit Ken's structured recommendation after reasoning over Keen's transcript with the visitor. Every field is required.",
  parameters: {
    type: 'object',
    properties: {
      recommendation: {
        type: 'string',
        description:
          'One to two plain-spoken sentences Keen can relay aloud to the visitor. No dollar amounts, no time-range numbers.',
      },
      painPoint: { type: 'string' },
      statedNeed: { type: 'string' },
      fitService: { type: ['string', 'null'] },
      leadQuality: { type: 'string', enum: ['hot', 'warm', 'unclear'] },
      nextAction: { type: 'string' },
    },
    required: ['recommendation', 'painPoint', 'statedNeed', 'fitService', 'leadQuality', 'nextAction'],
  },
} as const

interface GroqChatResponse {
  model: string
  choices: Array<{
    message: {
      tool_calls?: Array<{ function: { name: string; arguments: string } }>
      content?: string | null
    }
  }>
  usage?: { prompt_tokens: number; completion_tokens: number }
}

export class GroqLlamaReasoningProvider implements ReasoningProviderInterface {
  private apiKey: string
  private model: string

  constructor(apiKey: string, model?: string) {
    if (!apiKey) throw new Error('GroqLlamaReasoningProvider: GROQ_API_KEY is required')
    this.apiKey = apiKey
    this.model = model || REASONING_DEFAULT_MODELS['groq-llama']
  }

  async synthesize(request: ReasoningRequest): Promise<ReasoningResponse> {
    const messages = [
      { role: 'system' as const, content: buildSystemPrompt(request) },
      ...transcriptToOpenAIMessages(request),
    ]

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 1024,
        messages,
        tools: [{ type: 'function', function: recommendationFunction }],
        tool_choice: { type: 'function', function: { name: RECOMMENDATION_FUNCTION_NAME } },
      }),
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      throw new Error(
        `Groq reasoning error (${response.status}): ${errorBody?.error?.message || response.statusText}`
      )
    }

    const data = (await response.json()) as GroqChatResponse
    const toolCall = data.choices?.[0]?.message?.tool_calls?.find(
      (call) => call.function.name === RECOMMENDATION_FUNCTION_NAME
    )

    if (!toolCall) {
      throw new Error('Groq reasoning error: model response did not include the required structured tool call')
    }

    let input: {
      recommendation: string
      painPoint: string
      statedNeed: string
      fitService: string | null
      leadQuality: 'hot' | 'warm' | 'unclear'
      nextAction: string
    }
    try {
      input = JSON.parse(toolCall.function.arguments)
    } catch {
      throw new Error('Groq reasoning error: tool call arguments were not valid JSON')
    }

    return {
      recommendation: input.recommendation,
      structured: {
        painPoint: input.painPoint,
        statedNeed: input.statedNeed,
        fitService: input.fitService,
        leadQuality: input.leadQuality,
        nextAction: input.nextAction,
      },
      provider: 'groq-llama',
      model: data.model || this.model,
      tokensUsed: data.usage
        ? { input: data.usage.prompt_tokens, output: data.usage.completion_tokens }
        : undefined,
    }
  }
}

function transcriptToOpenAIMessages(request: ReasoningRequest) {
  if (request.transcript.length === 0) {
    return [{ role: 'user' as const, content: '(No transcript was captured for this conversation.)' }]
  }
  return request.transcript.map((turn) => ({
    role: turn.role === 'visitor' ? ('user' as const) : ('assistant' as const),
    content: turn.text,
  }))
}
