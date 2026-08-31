import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Keen & Ken",
  description: "How Keen & Ken Solutions collects, uses, and protects information submitted through keenken.com.",
  alternates: { canonical: "https://keenken.com/privacy-policy" },
};

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-white/50 text-[var(--text-body)] leading-[var(--lh-body)] tracking-[var(--ls-body)] mt-3">
      {children}
    </p>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-white font-bold text-[var(--text-h4)] leading-[var(--lh-subhead)] mt-10 mb-1">
      {children}
    </h2>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-12 lg:px-16 py-28 md:py-36">
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-4">Legal</p>
          <h1 className="text-[var(--text-h3)] md:text-[var(--text-h2)] font-bold text-white leading-[var(--lh-heading)] tracking-[var(--ls-heading)]">
            Privacy Policy
          </h1>
          <Prose>
            <strong className="text-white/70">Keen & Ken Solutions</strong> (&quot;Keen & Ken,&quot; &quot;we,&quot; &quot;us&quot;) &mdash; keenken.com &mdash; info@keenken.com
          </Prose>
          <Prose>Effective date: August 31, 2026</Prose>
          <Prose>
            This policy explains what information we collect through keenken.com, why we collect it, and how it is
            used. It applies to visitors who submit our contact form, and to anyone who interacts with our voice
            widget once that feature is live.
          </Prose>

          <H2>1. What we collect</H2>
          <Prose>When you submit our contact form, we collect your name, email address, phone number, and the free-text message you write describing what you need.</Prose>
          <Prose>
            If you use our voice widget (a feature currently in development), we will additionally capture a
            transcript of the conversation and a short summary of your business situation, generated from that
            conversation. This is logged and used in the same way described in this policy.
          </Prose>
          <Prose>We do not collect payment information through this website.</Prose>

          <H2>2. Why we collect it</H2>
          <Prose>
            We use this information solely to respond to your inquiry: to understand what you need, to get back to
            you, and to follow up if we have not heard from you. We do not use it for unrelated marketing or
            promotional purposes.
          </Prose>

          <H2>3. How your information is used</H2>
          <Prose>When you submit the contact form:</Prose>
          <Prose>
            1. Your information is logged into our customer relationship management system (Airtable) so our team
            can track and respond to your inquiry.
          </Prose>
          <Prose>
            2. An automated system sends you one immediate reply, by email and/or text message, confirming we
            received your message and letting you know a real person will personally follow up within one business
            day.
          </Prose>
          <Prose>
            3. If we have not heard back from you, we may send up to two additional optional follow-up messages
            over the following few days, to make sure your inquiry did not fall through the cracks. We do not send
            ongoing marketing or promotional messages.
          </Prose>
          <Prose>
            Some replies to your inquiry may be drafted with the help of AI tools before a person reviews and sends
            them. We use AI plainly to speed up how quickly we respond to you, not to replace a person following up.
          </Prose>

          <H2>4. Text messages (SMS)</H2>
          <Prose>
            If you provide a phone number on our contact form, you are agreeing to receive text messages from us
            related to your inquiry: an initial confirmation and, if needed, up to two follow-up messages. That is a
            maximum of about three messages per inquiry. Message and data rates may apply. You can reply{" "}
            <strong className="text-white/70">STOP</strong> at any time to opt out of further text messages. We do
            not send marketing texts, only messages directly related to the inquiry you submitted.
          </Prose>

          <H2>5. Who we share it with</H2>
          <Prose>
            We do not sell your information to anyone. We share it only with the service providers that help us run
            this process, strictly to provide the service to you: Airtable (stores your inquiry as a record in our
            CRM), Anthropic and/or Groq (AI providers used to help classify and draft replies to your inquiry),
            Twilio (delivers our text messages), and Resend (delivers our emails). Each of these providers processes
            your data only to perform the function above, not for their own marketing purposes.
          </Prose>

          <H2>6. How long we keep it</H2>
          <Prose>
            We keep your inquiry information in our CRM for as long as reasonably needed to respond to you and to
            maintain a record of our business communications. If you ask us to delete your information, contact
            info@keenken.com and we will do so, except where we need to keep limited records for legal or accounting
            reasons.
          </Prose>

          <H2>7. Your rights</H2>
          <Prose>
            You can ask us, at any time, to tell you what information we hold about you, correct it, or delete it.
            Contact info@keenken.com to make a request.
          </Prose>

          <H2>8. Security</H2>
          <Prose>
            We take reasonable steps to protect the information you share with us, using the security practices of
            the providers listed above and by limiting who on our team can access it.
          </Prose>

          <H2>9. Children</H2>
          <Prose>
            This website and our services are intended for business use and are not directed at children. We do not
            knowingly collect information from anyone under 18.
          </Prose>

          <H2>10. Changes to this policy</H2>
          <Prose>
            We may update this policy as our website or process changes. We will post the updated version here with
            a new effective date.
          </Prose>

          <H2>11. Contact us</H2>
          <Prose>Questions about this policy or your information: info@keenken.com</Prose>
        </div>
      </main>
      <Footer />
    </>
  );
}
