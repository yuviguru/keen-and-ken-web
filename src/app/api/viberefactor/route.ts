import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, projectUrl, aiTool, description, errorDetails } = await request.json();

    if (!name || !email || !projectUrl || !aiTool || !description) {
      return NextResponse.json(
        { error: "Name, email, project link, AI tool, and problem description are required." },
        { status: 400 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Keen & Ken <noreply@keenken.com>",
      to: "info@keenken.com",
      subject: `VibeRefactor Request: ${name} — ${aiTool}`,
      html: `
        <h2 style="color: #7C5AED;">VibeRefactor Rescue Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Project Link:</strong> <a href="${projectUrl}">${projectUrl}</a></p>
        <p><strong>AI Tool Used:</strong> ${aiTool}</p>
        <p><strong>Problem Description:</strong></p>
        <p>${description}</p>
        ${errorDetails ? `<p><strong>Error Details:</strong></p><p>${errorDetails}</p>` : ""}
        <hr />
        <p style="color: #666; font-size: 12px;">Sent from keenken.com/viberefactor intake form</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("VibeRefactor intake form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
