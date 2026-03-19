import type { Metadata } from "next";
import { Manrope, DM_Sans, Fira_Code } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://keenken.com"),
  title: "Keen & Ken | AI Automation Services & AI-Integrated Development",
  description:
    "AI automation services and AI-integrated development for businesses. We build custom AI agents, workflow automation systems, HRMS, CRM, EdTech platforms, and intelligent software. Book a free consultation.",
  keywords: [
    "AI automation services",
    "AI integrated development",
    "custom AI agents",
    "AI consultancy",
    "AI automation company",
    "workflow automation AI",
    "AI software development",
    "AI for business",
    "AI-powered products",
    "EdTech AI solutions",
    "enterprise AI platforms",
    "AI chatbot development",
    "HRMS software",
    "CRM development",
    "micro SaaS development",
    "Keen and Ken",
  ],
  openGraph: {
    title: "Keen & Ken | AI Automation Services & AI-Integrated Development",
    description:
      "We build AI systems that run your business. Custom AI agents, workflow automation, enterprise platforms, and AI-powered digital products.",
    url: "https://keenken.com",
    siteName: "Keen & Ken",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Keen & Ken - AI Automation & Development Services",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keen & Ken | AI Automation Services & AI-Integrated Development",
    description:
      "Custom AI agents, workflow automation, and intelligent software development. Book a free AI consultation.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://keenken.com",
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [{ url: "/logo.svg" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://keenken.com/#organization",
      name: "Keen & Ken",
      url: "https://keenken.com",
      logo: {
        "@type": "ImageObject",
        url: "https://keenken.com/logo.svg",
      },
      description:
        "AI automation services and AI-integrated development company. We build custom AI agents, workflow automation systems, and intelligent software for businesses worldwide.",
      email: "info@keenken.com",
      sameAs: [],
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://keenken.com/#service",
      name: "Keen & Ken - AI Automation & Development Services",
      provider: { "@id": "https://keenken.com/#organization" },
      serviceType: [
        "AI Automation Services",
        "AI-Integrated Software Development",
        "Custom AI Agent Development",
        "Workflow Automation",
        "Enterprise Platform Development",
        "EdTech Solutions",
        "AI Chatbot Development",
        "Data Analytics & AI",
      ],
      areaServed: "Worldwide",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "AI & Software Development Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Custom AI Agents",
              description:
                "Purpose-built AI agents that automate complex business processes and decision-making.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Workflow Automation",
              description:
                "End-to-end automation of business workflows using AI and intelligent orchestration.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Enterprise Platforms",
              description:
                "Custom HRMS, CRM, ERP, and LMS platforms powered by AI for smarter business operations.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Digital Products",
              description:
                "EdTech platforms, e-commerce solutions, micro SaaS, and CMS development with AI integration.",
            },
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://keenken.com/#website",
      url: "https://keenken.com",
      name: "Keen & Ken",
      publisher: { "@id": "https://keenken.com/#organization" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What AI automation services does Keen & Ken offer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Keen & Ken offers custom AI agent development, workflow automation, AI-integrated software development, enterprise platforms (HRMS, CRM, ERP, LMS), and digital products including EdTech, e-commerce, and micro SaaS solutions.",
          },
        },
        {
          "@type": "Question",
          name: "How does AI-integrated development work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our AI-integrated development process uses AI at every step — from discovery and research, through design and prototyping, to development, deployment, and continuous optimization. AI pair-programs with our engineers, accelerating delivery while maintaining production-grade quality.",
          },
        },
        {
          "@type": "Question",
          name: "What industries does Keen & Ken serve?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We serve businesses across all industries including education (EdTech), retail (e-commerce), healthcare, finance, HR, and more. Our solutions are tailored to each industry's specific automation and AI needs.",
          },
        },
        {
          "@type": "Question",
          name: "How can I get started with Keen & Ken?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Book a free consultation through our website. We'll analyze your business needs, identify high-ROI automation opportunities, and propose a tailored AI solution — typically delivering an initial prototype within weeks.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${manrope.variable} ${dmSans.variable} ${firaCode.variable} antialiased`}
      >
        {children}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
