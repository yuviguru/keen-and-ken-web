"use client";
import React from "react";
import GradientButton from "../../components/GradientButton";

export default function VRHero() {
  return (
    <section className="relative px-6 md:px-12 lg:px-16 pt-32 pb-24 md:pt-40 md:pb-32 scroll-mt-20 overflow-hidden">
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
            A Keen & Ken Service
          </span>
        </div>

        <h1 className="text-[var(--text-h2)] md:text-[var(--text-display)] font-bold text-white leading-[var(--lh-tight)] tracking-[var(--ls-heading)]">
          Built It With AI?{" "}
          <span className="gradient-text">We&apos;ll Make Sure It Ships.</span>
        </h1>

        <p className="mt-6 text-[var(--text-body)] md:text-[var(--text-body-lg)] text-white/45 max-w-2xl mx-auto leading-[var(--lh-body)] tracking-[var(--ls-body)]">
          You used Lovable, Bolt, Cursor, or another AI coding tool to build your app.
          It worked — until it didn&apos;t. We specialize in rescuing, reviewing, and
          production-hardening applications built with AI coding tools.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <GradientButton
            size="lg"
            variant="filled"
            onClick={() => document.getElementById("vr-intake")?.scrollIntoView({ behavior: "smooth" })}
          >
            Submit a Rescue Request
          </GradientButton>
          <GradientButton
            size="lg"
            variant="outline"
            onClick={() => document.getElementById("vr-pricing")?.scrollIntoView({ behavior: "smooth" })}
          >
            View Pricing
          </GradientButton>
        </div>

        <p className="mt-6 text-white/25 text-[var(--text-small)] tracking-[var(--ls-body)]">
          If we can&apos;t fix it, you don&apos;t pay. No risk.
        </p>
      </div>
    </section>
  );
}
