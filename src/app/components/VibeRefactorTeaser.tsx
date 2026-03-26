"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GradientButton from "./GradientButton";

const platforms = ["Lovable", "Bolt", "Cursor", "Replit", "v0", "Windsurf"];

export default function VibeRefactorTeaser() {
  return (
    <section
      id="viberefactor"
      className="relative px-6 md:px-12 lg:px-16 py-24 md:py-32 scroll-mt-20"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% 50%, rgba(124, 90, 237, 0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-[900px] mx-auto text-center">
        <p className="section-label mb-4">VibeRefactor</p>

        <h2 className="text-[var(--text-h3)] md:text-[var(--text-h2)] font-bold text-white leading-[var(--lh-heading)] tracking-[var(--ls-heading)]">
          Built It With AI?{" "}
          <span className="gradient-text">Let Us Make It Ship-Ready.</span>
        </h2>

        <p className="mt-5 text-[var(--text-body)] md:text-[var(--text-body-lg)] text-white/45 max-w-2xl mx-auto leading-[var(--lh-body)] tracking-[var(--ls-body)]">
          We rescue, review, and production-harden applications built with AI coding tools. From bug fixes to architecture overhauls — if we can&apos;t fix it, you don&apos;t pay.
        </p>

        {/* Platform pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {platforms.map((p) => (
            <span
              key={p}
              className="px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-white/40 text-[var(--text-small)] tracking-[var(--ls-body)]"
            >
              {p}
            </span>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/viberefactor">
            <GradientButton size="md" variant="filled">
              Learn More <ArrowRight className="w-4 h-4" />
            </GradientButton>
          </Link>
          <GradientButton
            size="md"
            variant="outline"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Book a Free Call
          </GradientButton>
        </div>
      </div>
    </section>
  );
}
