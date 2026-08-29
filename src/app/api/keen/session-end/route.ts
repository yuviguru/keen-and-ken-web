import { NextResponse } from "next/server";
import { Resend } from "resend";
// Keen & Ken voice widget - session-end handler (engineer-backend track).
// Contract: docs/keen-and-ken-voice-architecture.md sections 6.1 (ReasoningProvider), 6.3 (config),
// 6.5 (failure handling); docs/keen-and-ken-widget-spec.md "What happens on the backend";
// sales/keen-and-ken-lead-plan.md (Stage/Next Action conventions, matched from
// services/keen-and-ken/n8n-workflow.json's "Prepare Airtable Fields" node).
//
// REQUEST/RESPONSE CONTRACT: matched exactly against the already-built caller,
// src/app/components/KeenKenWidget/useKeenKenSession.ts + types.ts (`SessionEndRequest`/
// `SessionEndResponse`), not guessed independently. Per types.ts's own comment on
// SessionEndRequest, engineer-frontend built this route as being called TWICE per
// conversation with the same sessionId:
//   1. stage: "transcript" - right after the live voice portion ends. Runs Ken's reasoning and
//      returns { recommendation, leadQuality, needsManualReview } so Keen can speak the relay
//      line. No contact info exists yet at this point.
//   2. stage: "contact" - when the visitor submits the ContactCaptureForm (name + one free-text
//      phone-or-email field). No transcript is resent.
// This means one lead can span two calls with no server-side session store. Design decision
// (named, not silently invented): stage "transcript" WRITES the Airtable Pipeline record
// immediately (so a visitor who never reaches stage "contact" - abandons at convert - still
// isn't a silently lost lead, per architecture doc 6.5's explicit "a lead is never silently
// lost" principle), tagging it with `[session_id=<id>]` inside Notes (reusing the same
// bracket-tag-in-Notes convention already established by
// services/keen-and-ken/n8n-workflow.json's `[response_time_sec=N]` marker, rather than
// inventing a new one). Stage "contact" then searches the Pipeline for that tag and PATCHes
// Name/Email/Phone onto the same record; if it can't find one (e.g. the transcript-stage write
// itself failed), it creates a fresh record instead so the contact is still never lost.
import { createReasoningProvider } from "@/lib/reasoning/factory";
import type { ReasoningRequest, TranscriptTurn } from "@/lib/reasoning/types";

const AIRTABLE_BASE_ID = "app7vPYci5zFCGHz4";
const AIRTABLE_PIPELINE_TABLE_ID = "tblCA4vxxTUYPRlTA";
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_PIPELINE_TABLE_ID}`;

// NAMED DECISION (per task instructions, needs the same one-click Airtable UI addition Yuvi
// already did once for "Keen & Ken" on the plain contact form - the connector cannot add
// picklist choices, only Yuvi can, in the Airtable UI). Tagged distinctly from the plain
// contact-form Source value so retro can compare voice-widget conversion separately.
const AIRTABLE_SOURCE_VALUE = "Keen & Ken Voice Widget";

// Offer is a plain singleLineText field (confirmed in sales/keen-and-ken-lead-plan.md), not a
// picklist, so this needs no schema change - matches the existing
// "Keen & Ken Inbound - Uncategorized" pattern used by the plain contact form.
const AIRTABLE_UNCATEGORIZED_OFFER = "Keen & Ken Voice Widget - Uncategorized";

// The marker createReasoningProvider()'s template fallback writes into structured.nextAction
// when every configured reasoning provider failed (src/lib/reasoning/factory.ts
// buildTemplateFallback()). Used here to detect the degraded case and flag the Airtable record
// accordingly, without this route needing its own copy of the retry logic.
const NEEDS_MANUAL_REVIEW_MARKER = "NEEDS_MANUAL_REVIEW";

// Ken's persona/instructions for synthesizing a structured recommendation from Keen's transcript.
const KEN_SYSTEM_PROMPT = `You are Ken, the reasoning partner behind Keen & Ken Solutions' voice widget.
You never speak to the visitor directly - you only read a transcript of a conversation Keen (the
voice persona) just had with a website visitor, and produce a structured recommendation that Keen
will relay in one or two spoken sentences, and that also becomes a CRM lead record.

From the transcript, identify:
- painPoint: the concrete problem/friction the visitor described, in their own terms.
- statedNeed: what they said (or implied) they are looking for help with.
- fitService: which Keen & Ken service line this best maps to, if any is a clear match, else null.
- leadQuality: "hot" if they gave clear business context, budget-adjacent urgency, and contact
  intent; "warm" if there is a real problem but less urgency/detail; "unclear" if the conversation
  was too short or vague to judge.
- nextAction: a short, concrete next step for the human team (e.g. "Ask about their current lead
  volume on the follow-up call").

Also produce a one-to-two sentence "recommendation" in plain spoken language, suitable for Keen to
read aloud verbatim, that never states a dollar figure and never promises an exact timeline.

Respond only with the structured fields requested by the calling code's schema - do not add any
other commentary.`;

interface ContactInfo {
  name: string;
  contact: string; // one free-text field, phone or email - matches the widget's ContactCaptureForm
}

interface SessionEndRequest {
  sessionId?: string;
  stage?: "transcript" | "contact";
  transcript?: TranscriptTurn[];
  endReason?: "visitor_ended" | "max_turns" | "timeout" | "error";
  contact?: ContactInfo;
}

function nextBusinessDayISO(from: Date): string {
  const next = new Date(from.getTime());
  next.setDate(next.getDate() + 1);
  while (next.getDay() === 0 || next.getDay() === 6) next.setDate(next.getDate() + 1);
  return next.toISOString().slice(0, 10);
}

function transcriptToText(transcript: TranscriptTurn[]): string {
  if (transcript.length === 0) return "(no transcript captured)";
  return transcript.map((t) => `${t.role === "visitor" ? "Visitor" : "Keen"}: ${t.text}`).join("\n");
}

function sessionTag(sessionId: string): string {
  // Alphanumeric/dash only (matches crypto.randomUUID()'s own charset) so this is always safe
  // to embed unescaped inside both a plain-text Notes field and an Airtable filterByFormula
  // string literal.
  const safe = sessionId.replace(/[^a-zA-Z0-9-]/g, "");
  return `[session_id=${safe}]`;
}

interface AirtableFetchResult {
  ok: boolean;
  status: number;
  json: { records?: Array<{ id: string }>; error?: { message?: string } } | null;
  error?: string;
}

async function airtableFetch(path: string, init: RequestInit): Promise<AirtableFetchResult> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) {
    return { ok: false, status: 0, json: null, error: "AIRTABLE_API_KEY is not configured." };
  }
  try {
    const res = await fetch(path, {
      ...init,
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", ...(init.headers || {}) },
      signal: AbortSignal.timeout(10000),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, status: res.status, json, error: json?.error?.message || `Airtable responded ${res.status}` };
    }
    return { ok: true, status: res.status, json };
  } catch (err) {
    return { ok: false, status: 0, json: null, error: err instanceof Error ? err.message : "Unknown Airtable error" };
  }
}

async function createPipelineRecord(fields: Record<string, unknown>) {
  const result = await airtableFetch(AIRTABLE_API_URL, {
    method: "POST",
    // typecast deliberately omitted (defaults to false): per the task's own instructions, the
    // "Keen & Ken Voice Widget" Source picklist value needs a manual one-click Airtable UI
    // addition by Yuvi, same as "Keen & Ken" was before it. typecast:true would silently
    // auto-create missing select options, hiding that this step is still pending - we want a
    // loud, visible 422 here until Yuvi adds the option, not a silent schema change.
    body: JSON.stringify({ records: [{ fields }] }),
  });
  return { ok: result.ok, recordId: result.json?.records?.[0]?.id as string | undefined, error: result.error };
}

async function findRecordBySessionId(sessionId: string): Promise<{ recordId: string | null; error?: string }> {
  const formula = `FIND("${sessionTag(sessionId)}", {Notes})`;
  const url = `${AIRTABLE_API_URL}?${new URLSearchParams({ filterByFormula: formula, maxRecords: "1" }).toString()}`;
  const result = await airtableFetch(url, { method: "GET" });
  if (!result.ok) return { recordId: null, error: result.error };
  const recordId = result.json?.records?.[0]?.id as string | undefined;
  return { recordId: recordId ?? null };
}

async function patchRecord(recordId: string, fields: Record<string, unknown>) {
  const result = await airtableFetch(`${AIRTABLE_API_URL}/${recordId}`, {
    method: "PATCH",
    body: JSON.stringify({ fields }),
  });
  return { ok: result.ok, error: result.error };
}

// Last-resort channel if an Airtable write fails outright, so a lead is never silently lost
// end-to-end - reuses the same Resend dependency and "Keen & Ken <noreply@keenken.com>" pattern
// already established in src/app/api/contact/route.ts for the identical failure category. This
// is an engineering judgment call beyond what the specs literally require, justified directly
// by the architecture doc's "a lead is never silently lost" principle; flagged here, not hidden.
async function sendFallbackEmail(subject: string, fields: Record<string, unknown>, error: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.error("session-end: RESEND_API_KEY not configured; cannot send fallback notification either.");
    return false;
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Keen & Ken <noreply@keenken.com>",
      to: "info@keenken.com",
      subject,
      html: `
        <h2>Voice widget - Airtable Pipeline write FAILED</h2>
        <p><strong>Airtable error:</strong> ${error}</p>
        <p>Add this manually and check the Airtable API key/schema.</p>
        <pre style="white-space: pre-wrap; font-family: monospace;">${JSON.stringify(fields, null, 2)}</pre>
      `,
    });
    return true;
  } catch (err) {
    console.error("session-end: fallback Resend notification also failed:", err);
    return false;
  }
}

async function handleTranscriptStage(sessionId: string, transcript: TranscriptTurn[], endReason?: string) {
  const request: ReasoningRequest = { systemPrompt: KEN_SYSTEM_PROMPT, transcript };

  // createReasoningProvider() never throws and never returns a blank recommendation - its own
  // retry/fallback/template-summary chain (src/lib/reasoning/factory.ts) guarantees that. Still
  // wrapped in try/catch as a last line of defense in case that contract is ever violated by a
  // future change on engineer-ai's side - per docs/engineering-standards.md, no empty catch
  // blocks and no silent success-on-failure, even against a "should never throw" dependency.
  let ken;
  try {
    ken = await createReasoningProvider().synthesize(request);
  } catch (err) {
    console.error(
      "session-end: createReasoningProvider().synthesize() threw, which its own contract says " +
        "should never happen - falling back to an inline template summary:",
      err
    );
    const visitorLines = transcript.filter((t) => t.role === "visitor").map((t) => t.text.trim()).filter(Boolean);
    ken = {
      recommendation:
        "Thanks for sharing that - our team will follow up directly to go through the details with you.",
      structured: {
        painPoint: visitorLines[0] || "Not captured: reasoning provider factory threw unexpectedly.",
        statedNeed: visitorLines.slice(1).join(" ") || "Not captured.",
        fitService: null as string | null,
        leadQuality: "unclear" as const,
        nextAction: `${NEEDS_MANUAL_REVIEW_MARKER}: reasoning factory threw unexpectedly, see server logs.`,
      },
      provider: "claude" as const,
      model: "inline-fallback",
    };
  }

  const needsManualReview = ken.structured.nextAction.includes(NEEDS_MANUAL_REVIEW_MARKER);
  const now = new Date();

  const notesLines = [
    sessionTag(sessionId),
    `Voice widget session ended (reason: ${endReason ?? "not reported"}).`,
    `Reasoning provider: ${ken.provider} (${ken.model})`,
    `Pain point: ${ken.structured.painPoint}`,
    `Stated need: ${ken.structured.statedNeed}`,
    `Lead quality (Ken's judgment): ${ken.structured.leadQuality}`,
    `Ken's recommendation: ${ken.recommendation}`,
    "",
    "Full transcript:",
    transcriptToText(transcript),
  ];
  if (needsManualReview) {
    notesLines.push(
      "",
      "[needs_manual_review] All configured reasoning providers failed for this conversation " +
        "(src/lib/reasoning/factory.ts template fallback fired). The fields above are a plain " +
        "summary built directly from the raw transcript, not a real synthesized recommendation."
    );
  }
  notesLines.push(
    "",
    "(Contact info, if the visitor submits the contact-capture step, is attached to this same " +
      "record by a later PATCH keyed on the [session_id=...] tag above.)"
  );

  const fields: Record<string, unknown> = {
    Name: `Voice widget lead (name not captured yet, ${now.toISOString()})`,
    Source: AIRTABLE_SOURCE_VALUE,
    Stage: "Contacted",
    Offer: ken.structured.fitService || AIRTABLE_UNCATEGORIZED_OFFER,
    "Next Action": needsManualReview
      ? "Yuvi: personal review (Ken reasoning failed)"
      : "Yuvi: personal reply",
    "Next Action Date": nextBusinessDayISO(now),
    Notes: notesLines.join("\n"),
  };

  const write = await createPipelineRecord(fields);
  if (!write.ok) {
    console.error("session-end (stage=transcript): Airtable Pipeline write failed:", write.error);
    await sendFallbackEmail(
      `[URGENT - Airtable write failed] Voice widget session ${sessionId}`,
      fields,
      write.error ?? "unknown error"
    );
    // Per architecture doc 6.5, a persistence failure must never blank the visitor-facing
    // recommendation - Ken's line (or its template fallback) still gets returned and spoken
    // regardless of whether it made it into the Pipeline. The failure is logged and emailed for
    // Yuvi to recover manually, not surfaced to the visitor.
  }

  return NextResponse.json({
    recommendation: ken.recommendation,
    leadQuality: ken.structured.leadQuality,
    needsManualReview,
    ok: write.ok,
  });
}

async function handleContactStage(sessionId: string, contact: ContactInfo) {
  if (!contact?.name?.trim() || !contact?.contact?.trim()) {
    return NextResponse.json({ error: "contact.name and contact.contact are required." }, { status: 400 });
  }

  // NAMED DECISION: the widget's ContactCaptureForm collects one free-text "phone or email"
  // field (types.ts's ContactInfo), but the Airtable Pipeline has separate Email/Phone fields.
  // Heuristic: contains "@" -> Email field, else -> Phone field. Not specified in either spec
  // doc - flagged rather than silently assumed to be self-evident.
  const isEmail = contact.contact.includes("@");
  const contactFields: Record<string, unknown> = { Name: contact.name.trim() };
  if (isEmail) contactFields.Email = contact.contact.trim();
  else contactFields.Phone = contact.contact.trim();

  const found = await findRecordBySessionId(sessionId);

  if (found.recordId) {
    const patch = await patchRecord(found.recordId, contactFields);
    if (!patch.ok) {
      console.error("session-end (stage=contact): Airtable PATCH failed:", patch.error);
      const emailed = await sendFallbackEmail(
        `[URGENT - Airtable update failed] Voice widget contact for session ${sessionId}`,
        { recordId: found.recordId, sessionId, ...contactFields },
        patch.error ?? "unknown error"
      );
      if (!emailed) {
        return NextResponse.json(
          { error: "Failed to attach contact info to the lead and the fallback notification also failed." },
          { status: 502 }
        );
      }
    }
    return NextResponse.json({ ok: true });
  }

  // No matching transcript-stage record found (its own write likely failed earlier, or the
  // sessionId search itself errored) - create a fresh record now rather than dropping the
  // contact, per the "a lead is never silently lost" principle.
  if (found.error) {
    console.error("session-end (stage=contact): session-id lookup failed:", found.error);
  } else {
    console.error(
      `session-end (stage=contact): no Pipeline record found tagged ${sessionTag(sessionId)}; creating a new record from contact info alone.`
    );
  }

  const now = new Date();
  const fields: Record<string, unknown> = {
    ...contactFields,
    Source: AIRTABLE_SOURCE_VALUE,
    Stage: "Contacted",
    Offer: AIRTABLE_UNCATEGORIZED_OFFER,
    "Next Action": "Yuvi: personal reply",
    "Next Action Date": nextBusinessDayISO(now),
    Notes: [
      sessionTag(sessionId),
      "Contact captured, but no matching transcript-stage Pipeline record was found " +
        "(its write likely failed earlier - check server logs around this session id).",
    ].join("\n"),
  };

  const created = await createPipelineRecord(fields);
  if (!created.ok) {
    console.error("session-end (stage=contact): fallback record creation also failed:", created.error);
    const emailed = await sendFallbackEmail(
      `[URGENT - Airtable write failed] Voice widget contact for session ${sessionId}`,
      fields,
      created.error ?? "unknown error"
    );
    if (!emailed) {
      return NextResponse.json(
        { error: "Failed to log the contact anywhere - Airtable and the fallback email both failed." },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  let payload: SessionEndRequest;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!payload.sessionId || (payload.stage !== "transcript" && payload.stage !== "contact")) {
    return NextResponse.json(
      { error: 'sessionId and stage ("transcript" | "contact") are required.' },
      { status: 400 }
    );
  }

  if (payload.stage === "transcript") {
    const transcript = Array.isArray(payload.transcript) ? payload.transcript : [];
    return handleTranscriptStage(payload.sessionId, transcript, payload.endReason);
  }

  return handleContactStage(payload.sessionId, payload.contact as ContactInfo);
}
