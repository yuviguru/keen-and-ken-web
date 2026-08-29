// src/lib/reasoning/claude.ts
//
// Ken's default reasoning provider (docs/keen-and-ken-voice-architecture.md
// section 5). Adapts the exact HTTP pattern already proven in production at
// github.com/yuviguru/intelligent-sales-analytics/src/services/ai/providers/claude.ts
// (POST https://api.anthropic.com/v1/messages, anthropic-version header) to
// the synthesize() shape instead of that repo's open chat() loop.
//
// Structured output: uses Claude tool-use (forced tool_choice), not prompt-
// engineered JSON-in-text, so `ReasoningResponse.structured` is reliably
// parseable per architecture doc section 6.1's note on this. A malformed or
// missing tool_use block is treated as a hard failure (thrown), never a
// silently-empty structured object — the factory's fallback/retry logic
// (src/lib/reasoning/factory.ts) is what decides what happens next, per
// docs/engineering-standards.md's "no silent failures" rule.
//
// Written but unverified: no ANTHROPIC_API_KEY is provisioned in this build
// pass, so no live call has been made. The request/response shape below
// matches Anthropic's documented Messages API + tool-use format as of
// 2026-08-29; re-verify against a live call before relying on this in prod.

import type {
  ReasoningProviderInterface,
  ReasoningRequest,
  ReasoningResponse,
} from './types'
import { REASONING_DEFAULT_MODELS } from './types'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'

const RECOMMENDATION_TOOL_NAME = 'submit_recommendation'

/** Anthropic tool-use schema Ken must fill. Mirrors ReasoningResponse exactly. */
const recommendationTool = {
  name: RECOMMENDATION_TOOL_NAME,
  description:
    "Submit Ken's structured recommendation after reasoning over Keen's transcript with the visitor. Every field is required; use \"unclear\" / null where the transcript genuinely does not support a confident answer, never leave a field blank.",
  input_schema: {
    type: 'object',
    properties: {
      recommendation: {
        type: 'string',
        description:
          "One to two plain-spoken sentences Keen can relay aloud to the visitor: which problem, which kind of help fits. No dollar amounts, no time-range numbers (Keen adds those separately per the widget spec's convert step).",
      },
      painPoint: { type: 'string', description: "The visitor's core problem, in their own terms." },
      statedNeed: { type: 'string', description: 'What the visitor explicitly said they want or tried.' },
      fitService: {
        type: ['string', 'null'],
        description: "Which Keen & Ken service line this maps to, or null if none fits cleanly.",
      },
      leadQuality: { type: 'string', enum: ['hot', 'warm', 'unclear'] },
      nextAction: {
        type: 'string',
        description: 'What the human team should do next with this lead (e.g. "call within 24h about X").',
      },
    },
    required: ['recommendation', 'painPoint', 'statedNeed', 'fitService', 'leadQuality', 'nextAction'],
  },
} as const

interface AnthropicToolUseBlock {
  type: 'tool_use'
  name: string
  input: Record<string, unknown>
}

interface AnthropicMessagesResponse {
  content: Array<{ type: string; text?: string } | AnthropicToolUseBlock>
  usage?: { input_tokens: number; output_tokens: number }
  model: string
}

export class ClaudeReasoningProvider implements ReasoningProviderInterface {
  private apiKey: string
  private model: string

  constructor(apiKey: string, model?: string) {
    if (!apiKey) throw new Error('ClaudeReasoningProvider: ANTHROPIC_API_KEY is required')
    this.apiKey = apiKey
    this.model = model || REASONING_DEFAULT_MODELS.claude
  }

  async synthesize(request: ReasoningRequest): Promise<ReasoningResponse> {
    const messages = transcriptToAnthropicMessages(request)

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 1024,
        system: buildSystemPrompt(request),
        messages,
        tools: [recommendationTool],
        tool_choice: { type: 'tool', name: RECOMMENDATION_TOOL_NAME },
      }),
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      throw new Error(
        `Claude reasoning error (${response.status}): ${errorBody?.error?.message || response.statusText}`
      )
    }

    const data = (await response.json()) as AnthropicMessagesResponse

    const toolUse = data.content.find(
      (block): block is AnthropicToolUseBlock =>
        block.type === 'tool_use' && (block as AnthropicToolUseBlock).name === RECOMMENDATION_TOOL_NAME
    )

    if (!toolUse) {
      // No silent success: Claude answered but did not use the forced tool.
      // This is a hard failure the caller's fallback logic must handle.
      throw new Error('Claude reasoning error: model response did not include the required structured tool_use block')
    }

    const input = toolUse.input as {
      recommendation: string
      painPoint: string
      statedNeed: string
      fitService: string | null
      leadQuality: 'hot' | 'warm' | 'unclear'
      nextAction: string
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
      provider: 'claude',
      model: data.model || this.model,
      tokensUsed: data.usage
        ? { input: data.usage.input_tokens, output: data.usage.output_tokens }
        : undefined,
    }
  }
}

/** Shared by claude.ts and groq-llama.ts so the two adapters stay in sync on prompt shape. */
export function buildSystemPrompt(request: ReasoningRequest): string {
  return request.businessContext
    ? `${request.systemPrompt}\n\nBusiness context (Keen & Ken's service menu, for grounding the recommendation):\n${request.businessContext}`
    : request.systemPrompt
}

function transcriptToAnthropicMessages(request: ReasoningRequest) {
  // Anthropic requires alternating user/assistant roles with no leading
  // assistant turn; Keen's transcript is visitor/keen which maps 1:1 onto
  // user/assistant, and a real conversation should always start with the
  // visitor speaking, so no reordering is needed in practice. If it were
  // ever malformed (e.g. an empty transcript), fall back to a single
  // synthetic user turn so the API call still has valid content.
  if (request.transcript.length === 0) {
    return [{ role: 'user' as const, content: '(No transcript was captured for this conversation.)' }]
  }

  return request.transcript.map((turn) => ({
    role: turn.role === 'visitor' ? ('user' as const) : ('assistant' as const),
    content: turn.text,
  }))
}
