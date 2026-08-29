"use client";
// The collapsed floating trigger. Positioned above FloatingMobileCTA.tsx's bottom
// banner on mobile (bottom-24) so the two never overlap; sits lower on desktop
// where that banner doesn't render (md:bottom-6).
import { Sparkles } from "lucide-react";

export default function TriggerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Talk to Keen & Ken"
      className="fixed z-50 bottom-24 right-5 md:bottom-6 md:right-6 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer border border-white/15 transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lavender)]/60"
      style={{
        background: "linear-gradient(135deg, var(--accent-primary), var(--accent-purple))",
        boxShadow: "var(--glow-md)",
      }}
    >
      <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "var(--accent-primary)" }} aria-hidden="true" />
      <Sparkles className="relative w-5 h-5 text-white" />
    </button>
  );
}
