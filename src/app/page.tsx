// app/page.tsx (Server Component)
import HeroSection from "./components/HeroSection";
import WhatWeDo from "./components/WhatWeDo";

export default function Page() {
  return (
    <main className="h-[500vh]">
      <HeroSection />
      <WhatWeDo />
      {/* Additional sections if needed */}
    </main>
  );
}
