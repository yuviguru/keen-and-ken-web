import { Resend } from "resend";
import { NextResponse } from "next/server";

// Lead Rescue dogfood wiring (sales/keen-and-ken-lead-plan.md, services/keen-and-ken/).
// Primary channel: POST the normalized lead to the Lead Rescue n8n intake webhook, which
// replies to the lead, logs it to Airtable, and pings the owner (services/_template/build-spec.md).
// Secondary channel: Resend stays as a "you've got mail" copy to Yuvi's inbox - best effort,
// never blocks the response. Both channels are independent and their outcome is never silently
// swallowed (docs/engineering-standards.md "no silent failures"): failures are logged server-side,
// and the request only reports success if at least one channel actually succeeded.
export async function POST(request: Request) {
  let payload: {
    name?: string;
    email?: string;
    company?: string;
    contact?: string;
    intent?: string;
    message?: string;
  };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, company, contact, intent, message } = payload;

  if (!name || !email || !contact) {
    return NextResponse.json(
      { error: "Name, email, and contact number are required." },
      { status: 400 }
    );
  }

  // --- Primary: Lead Rescue intake webhook ---
  const webhookUrl = process.env.LEAD_RESCUE_WEBHOOK_URL;
  let webhookOk = false;
  let webhookError: string | null = null;

  if (webhookUrl) {
    try {
      const webhookRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: contact,
          intent: intent || "",
          message: message || "",
          source: "Website - Keen & Ken",
        }),
        signal: AbortSignal.timeout(8000),
      });
      webhookOk = webhookRes.ok;
      if (!webhookRes.ok) {
        webhookError = `Lead Rescue webhook responded ${webhookRes.status}`;
      }
    } catch (err) {
      webhookError = err instanceof Error ? err.message : "Unknown webhook error";
    }
  } else {
    webhookError = "LEAD_RESCUE_WEBHOOK_URL not configured";
  }

  if (!webhookOk) {
    // Visible, not silent: this needs to show up in server logs/monitoring so a broken
    // Lead Rescue pipe pages us, not the client (delivery-checklist.md step 4).
    console.error("Lead Rescue intake webhook failed:", webhookError);
  }

  // --- Secondary: Resend inbox copy (best-effort) ---
  let emailOk = false;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Keen & Ken <noreply@keenken.com>",
      to: "info@keenken.com",
      subject: `New Lead: ${name} from ${company || "N/A"}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || "Not provided"}</p>
        <p><strong>Phone:</strong> ${contact}</p>
        <p><strong>Looking for:</strong> ${intent || "Not specified"}</p>
        ${message ? `<p><strong>Message:</strong></p><p>${message}</p>` : ""}
        <hr />
        <p style="color: #666; font-size: 12px;">Sent from keenken.com contact form${
          webhookOk ? "" : " (Lead Rescue webhook did not confirm receipt - check server logs)"
        }</p>
      `,
    });
    emailOk = true;
  } catch (error) {
    console.error("Contact form Resend error:", error);
  }

  if (!webhookOk && !emailOk) {
    // Both channels failed. This must NOT look like success to the visitor.
    return NextResponse.json(
      { error: "Something went wrong. Please try again or email us directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, webhookOk, emailOk });
}
