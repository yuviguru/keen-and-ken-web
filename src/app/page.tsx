// app/page.tsx (Server Component)
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import TrustBar from "./components/TrustBar";
import WhatWeDo from "./components/WhatWeDo";
import AIShowcase from "./components/AIShowcase";
import ProductsOrbit from "./components/ProductsOrbit";
import ContactSection from "./components/ContactSection";
import FloatingMobileCTA from "./components/FloatingMobileCTA";
import Footer from "./components/Footer";
import VibeRefactorTeaser from "./components/VibeRefactorTeaser";
import VibeRefactorBanner from "./components/VibeRefactorBanner";

function SectionDivider() {
  return <div className="section-divider" />;
}

export default function Page() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <VibeRefactorBanner />
      <SectionDivider />
      <WhatWeDo />
      <TrustBar />
      <SectionDivider />
      <AIShowcase />
      <SectionDivider />
      <ProductsOrbit />
      <SectionDivider />
      <VibeRefactorTeaser />
      <SectionDivider />
      <ContactSection />
      <Footer />
      <FloatingMobileCTA />
    </main>
  );
}
