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
  title: "Keen & Ken | AI Automation & Custom AI Agents for Business",
  description:
    "We build AI systems that run your business. Custom AI agents, workflow automation, EdTech platforms, and AI-powered products. Book a free consultation.",
  keywords: [
    "AI consultancy",
    "AI automation",
    "custom AI agents",
    "AI for business",
    "EdTech AI",
    "workflow automation",
    "Keen and Ken",
  ],
  openGraph: {
    title: "Keen & Ken | AI Automation & Custom AI Agents for Business",
    description:
      "We build AI systems that run your business. Custom AI agents, workflow automation, and AI-powered products.",
    url: "https://keenken.com",
    siteName: "Keen & Ken",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keen & Ken | AI Automation & Custom AI Agents for Business",
    description:
      "We build AI systems that run your business. Book a free AI consultation.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://keenken.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Keen & Ken",
  url: "https://keenken.com",
  logo: "https://keenken.com/logo.svg",
  description:
    "AI consultancy specializing in custom AI agents, workflow automation, EdTech solutions, and AI-powered product development.",
  email: "info@keenken.com",
  serviceType: [
    "AI Automation",
    "Custom AI Agent Development",
    "EdTech Solutions",
    "AI Product Development",
    "Research & Development",
  ],
  areaServed: "Worldwide",
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
