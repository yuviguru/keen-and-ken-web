"use client";
import React from "react";
import VRScanInput from "./VRScanInput";

export default function VRHero() {
  return (
    <section className="relative px-6 md:px-12 lg:px-16 pt-32 pb-16 md:pt-40 md:pb-24 scroll-mt-20 overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: "var(--accent-magenta)",
            top: "-20%",
            left: "10%",
            animation: "aurora-1 12s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
          style={{
            background: "var(--accent-purple)",
            bottom: "-10%",
            right: "15%",
            animation: "aurora-2 15s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--accent-magenta)]/20 bg-[var(--accent-magenta)]/[0.06] mb-8">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-magenta)]" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
          <span className="text-[var(--text-small)] text-[var(--accent-lavender)] tracking-[var(--ls-wide)]" style={{ fontFamily: "var(--font-mono)" }}>
            VibeRefactor
          </span>
        </div>

        <h1 className="text-[var(--text-h2)] md:text-[var(--text-display)] font-bold text-white leading-[var(--lh-tight)] tracking-[var(--ls-heading)]">
          How Healthy Is Your{" "}
          <span className="gradient-text">AI-Built App?</span>
        </h1>

        <p className="mt-6 text-[var(--text-body)] md:text-[var(--text-body-lg)] text-white/45 max-w-2xl mx-auto leading-[var(--lh-body)] tracking-[var(--ls-body)]">
          Paste your GitHub repo URL and get an instant health report — project structure, dependency health, security signals, code quality, and more. Free, no sign-up required.
        </p>

        <div className="mt-10">
          <VRScanInput />
        </div>

        <p className="mt-6 text-white/20 text-[0.75rem] tracking-[var(--ls-body)]">
          Works with public GitHub repositories · Analysis takes 5-8 seconds
        </p>
      </div>
    </section>
  );
}
