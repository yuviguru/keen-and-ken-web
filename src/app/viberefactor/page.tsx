import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VRHero from "./components/VRHero";
import VRServices from "./components/VRServices";
import VRProcess from "./components/VRProcess";
import VRPricing from "./components/VRPricing";
import VRIssues from "./components/VRIssues";
import VRPlatforms from "./components/VRPlatforms";
import VRWhyUs from "./components/VRWhyUs";
import VRFAQ from "./components/VRFAQ";
import VRPlatformTeaser from "./components/VRPlatformTeaser";
import VRIntakeForm from "./components/VRIntakeForm";

export const metadata: Metadata = {
  title: "VibeRefactor — AI App Rescue & Architecture Review | Keen & Ken",
  description:
    "Built your app with Lovable, Bolt, Cursor, or another AI coding tool? Stuck in a fix loop? We rescue, review, and production-harden AI-built applications. From quick bug fixes to full architecture overhauls.",
  keywords: [
    "vibecoding",
    "AI app rescue",
    "Lovable developer",
    "Bolt.new fix",
    "Cursor AI help",
    "AI code review",
    "vibe coding fix",
    "AI-built app bugs",
    "production readiness",
    "code architecture review",
  ],
  alternates: {
    canonical: "https://keenken.com/viberefactor",
  },
  openGraph: {
    title: "VibeRefactor — AI App Rescue & Architecture Review",
    description:
      "Built it with AI? We'll make sure it ships. Rescue, review, and production-harden your AI-built applications.",
    url: "https://keenken.com/viberefactor",
    siteName: "Keen & Ken",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeRefactor — AI App Rescue & Architecture Review",
    description:
      "Built it with AI? We'll make sure it ships. Rescue, review, and production-harden your AI-built applications.",
  },
};

function SectionDivider() {
  return <div className="section-divider" />;
}

export default function VibeRefactorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        name: "VibeRefactor by Keen & Ken",
        description:
          "AI App Rescue & Architecture Review service for applications built with AI coding tools.",
        url: "https://keenken.com/viberefactor",
        provider: {
          "@type": "Organization",
          name: "Keen & Ken Solutions",
          url: "https://keenken.com",
        },
        serviceType: [
          "AI App Rescue",
          "Architecture Review",
          "Code Audit",
          "Production Readiness",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "VibeRefactor Services",
          itemListElement: [
            { "@type": "Offer", name: "Quick Fix", price: "59", priceCurrency: "USD" },
            { "@type": "Offer", name: "Deep Fix", price: "149", priceCurrency: "USD" },
            { "@type": "Offer", name: "Architecture Review", price: "299", priceCurrency: "USD" },
          ],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Do I need to know how to code?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Most of our clients built their apps entirely with AI tools. Just describe the problem in your own words and share access to your project.",
            },
          },
          {
            "@type": "Question",
            name: "How do you handle code access?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We request only the access needed for the specific issue. For GitHub repos, we work via pull requests so you see and approve every change.",
            },
          },
          {
            "@type": "Question",
            name: "What if you can't fix it?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You don't pay. If we diagnose that a fix isn't possible without a full rebuild, we'll tell you honestly and provide a recommendation — no charge for the diagnosis.",
            },
          },
        ],
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar
        logoHref="/"
        navItems={[
          { label: "Services", href: "#vr-services" },
          { label: "How It Works", href: "#vr-process" },
          { label: "Pricing", href: "#vr-pricing" },
          { label: "FAQ", href: "#vr-faq" },
        ]}
        ctaLabel="Get Started"
        ctaTarget="#vr-intake"
      />
      <VRHero />
      <SectionDivider />
      <VRServices />
      <SectionDivider />
      <VRProcess />
      <SectionDivider />
      <VRPricing />
      <SectionDivider />
      <VRIssues />
      <SectionDivider />
      <VRPlatforms />
      <SectionDivider />
      <VRWhyUs />
      <SectionDivider />
      <VRPlatformTeaser />
      <SectionDivider />
      <VRFAQ />
      <SectionDivider />
      <VRIntakeForm />
      <Footer />
    </main>
  );
}
