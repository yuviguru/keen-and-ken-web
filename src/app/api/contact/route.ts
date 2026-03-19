import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, company, contact, message } = await request.json();

    if (!name || !email || !contact) {
      return NextResponse.json(
        { error: "Name, email, and contact number are required." },
        { status: 400 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Keen & Ken Website <onboarding@resend.dev>",
      to: "info@keenken.com",
      subject: `New Lead: ${name} from ${company || "N/A"}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || "Not provided"}</p>
        <p><strong>Phone:</strong> ${contact}</p>
        ${message ? `<p><strong>Message:</strong></p><p>${message}</p>` : ""}
        <hr />
        <p style="color: #666; font-size: 12px;">Sent from keenken.com contact form</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
