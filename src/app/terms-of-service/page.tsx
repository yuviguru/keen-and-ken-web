import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Keen & Ken",
  description: "The terms that apply to using keenken.com and contacting Keen & Ken Solutions.",
  alternates: { canonical: "https://keenken.com/terms-of-service" },
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

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-12 lg:px-16 py-28 md:py-36">
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-4">Legal</p>
          <h1 className="text-[var(--text-h3)] md:text-[var(--text-h2)] font-bold text-white leading-[var(--lh-heading)] tracking-[var(--ls-heading)]">
            Terms of Service
          </h1>
          <Prose>
            <strong className="text-white/70">Keen & Ken Solutions</strong> (&quot;Keen & Ken,&quot; &quot;we,&quot; &quot;us&quot;) &mdash; keenken.com &mdash; info@keenken.com
          </Prose>
          <Prose>Effective date: August 31, 2026</Prose>
          <Prose>By using keenken.com or submitting our contact form, you agree to these terms.</Prose>

          <H2>1. Who we are</H2>
          <Prose>
            Keen & Ken Solutions builds custom AI agents, workflow automation, and full-stack software and websites
            for growing businesses. This website is how prospective clients learn about our work and get in touch
            with us.
          </Prose>

          <H2>2. Using this website</H2>
          <Prose>
            You may browse this site and submit the contact form to reach out to us. You agree to provide accurate
            information when you contact us and not to use the site or contact form for any unlawful purpose, to
            send spam, or to attempt to disrupt or abuse the site or our systems.
          </Prose>

          <H2>3. What happens when you contact us</H2>
          <Prose>
            Submitting our contact form starts a conversation, not a contract. It does not obligate either party to
            any paid work. Any actual engagement with Keen & Ken Solutions (scope, pricing, timelines) is governed
            by a separate signed agreement (a Statement of Work) at that time, not by these terms.
          </Prose>
          <Prose>
            When you submit the form, an automated system will send you one immediate confirmation (by email and/or
            text message) and a real person will personally follow up within one business day. If we do not hear
            back from you, we may send up to two further optional follow-up messages over the next few days. See
            our{" "}
            <a href="/privacy-policy" className="underline underline-offset-4 hover:text-white/70">
              Privacy Policy
            </a>{" "}
            for full detail on how your information is used.
          </Prose>

          <H2>4. Text messaging (SMS) program</H2>
          <Prose>
            If you provide a phone number when you contact us, you are opting in to receive text messages related
            specifically to your inquiry:
          </Prose>
          <Prose>
            <strong className="text-white/70">Message types:</strong> an initial confirmation that we received your
            inquiry, and up to two optional follow-up messages if you have not responded. These are customer-service
            messages about the inquiry you submitted, not marketing or promotional messages.
          </Prose>
          <Prose>
            <strong className="text-white/70">Message frequency:</strong> up to about 3 messages per inquiry.
          </Prose>
          <Prose>
            <strong className="text-white/70">Cost:</strong> message and data rates may apply, depending on your
            carrier and plan.
          </Prose>
          <Prose>
            <strong className="text-white/70">Opt out:</strong> reply STOP to any message at any time to stop
            receiving further texts about that inquiry.
          </Prose>
          <Prose>
            <strong className="text-white/70">Help:</strong> for any questions, contact us at info@keenken.com.
          </Prose>
          <Prose>
            Consent to receive these text messages is not a condition of doing business with us; you can also submit
            the contact form without a phone number, or ask us to only reach you by email.
          </Prose>

          <H2>5. AI-assisted responses</H2>
          <Prose>
            Some of the replies you receive may be drafted with the help of AI tools before being reviewed and sent
            as part of our process. We use AI to help us respond to you faster and more consistently, not as a
            substitute for a person being involved in following up with you.
          </Prose>

          <H2>6. Intellectual property</H2>
          <Prose>
            Everything on this website (text, design, branding) belongs to Keen & Ken Solutions unless otherwise
            noted. Nothing in these terms grants you rights to our website content, brand, or work product beyond
            viewing the site and submitting an inquiry. Ownership and IP terms for any actual client work are set
            out separately in that client&apos;s Statement of Work.
          </Prose>

          <H2>7. No warranty</H2>
          <Prose>
            This website and the information on it are provided &quot;as is.&quot; We make reasonable efforts to
            keep it accurate and available, but we do not guarantee it will be error-free, uninterrupted, or fit for
            any particular purpose. Nothing on this website is a guarantee of specific results from any future
            engagement.
          </Prose>

          <H2>8. Limitation of liability</H2>
          <Prose>
            To the extent permitted by law, Keen & Ken Solutions is not liable for any indirect, incidental, or
            consequential damages arising from your use of this website or the contact/messaging process described
            here. This section does not limit liability that cannot be limited by law.
          </Prose>

          <H2>9. Changes to these terms</H2>
          <Prose>
            We may update these terms as our website or process changes. Continued use of the site after an update
            means you accept the revised terms. We will post the updated version here with a new effective date.
          </Prose>

          <H2>10. Governing law</H2>
          <Prose>
            These terms are intended to be governed by the laws applicable to where Keen & Ken Solutions operates
            from, India, without prejudice to any mandatory consumer-protection rights you may have under the law of
            your own location.
          </Prose>

          <H2>11. Contact</H2>
          <Prose>Questions about these terms: info@keenken.com</Prose>
        </div>
      </main>
      <Footer />
    </>
  );
}
