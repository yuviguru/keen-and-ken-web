"use client";
import React from "react";
import { Search, Palette, Code2, Rocket, BarChart3 } from "lucide-react";
import GradientButton from "./GradientButton";

const steps = [
  { step: 1, title: "Discovery & Research", description: "We map your market, competitors, and operations — surfacing high-value opportunities through structured, AI-assisted research.", icon: Search },
  { step: 2, title: "Design & Prototyping", description: "AI generates wireframes, UI variations, and user flows — accelerating the path from idea to interactive prototype.", icon: Palette },
  { step: 3, title: "AI-Augmented Dev", description: "AI pair-programs with our engineers — writing tests, catching bugs, and shipping production-grade code.", icon: Code2 },
  { step: 4, title: "Smart Deployment", description: "Automated CI/CD pipelines, instant rollbacks, and real-time anomaly detection — built to stay stable around the clock.", icon: Rocket },
  { step: 5, title: "Ongoing Optimization", description: "Post-launch, AI monitors user behavior, flags bottlenecks, and recommends improvements — so your product keeps getting better.", icon: BarChart3 },
];

export default function AIShowcase() {
  return (
    <section id="solutions" className="relative px-6 md:px-12 lg:px-16 py-24 md:py-32 scroll-mt-20">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="section-label mb-4">How It Works</p>
          <h2 className="text-[var(--text-h3)] md:text-[var(--text-h2)] font-bold text-white leading-[var(--lh-heading)] tracking-[var(--ls-heading)]">
            How We Use AI to Build Better Software
          </h2>
          <p className="mt-5 text-[var(--text-body)] md:text-[var(--text-body-lg)] text-white/45 max-w-2xl mx-auto leading-[var(--lh-body)] tracking-[var(--ls-body)]">
            AI isn&apos;t just what we build — it&apos;s how we build. Every phase of our workflow is AI-augmented to reduce friction and deliver higher-quality results.
          </p>
        </div>

        {/* Timeline — desktop horizontal */}
        <div className="hidden md:block">
          <div className="relative mx-auto max-w-[1200px]">
            <div className="absolute top-[18px] left-[10%] right-[10%] h-px bg-white/[0.08]" />
            <div
              className="absolute top-[18px] left-[10%] h-px"
              style={{
                width: "80%",
                background: "linear-gradient(90deg, var(--accent-magenta), var(--accent-purple))",
              }}
            />

            <div className="grid grid-cols-5 gap-4">
              {steps.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.step} className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div
                        className="w-9 h-9 rounded-full border border-[var(--accent-magenta)]/40 bg-[var(--bg-deep)] flex items-center justify-center"
                        style={{ animation: "pulse-dot 3s ease-in-out infinite", animationDelay: `${(s.step - 1) * 0.5}s` }}
                      >
                        <Icon className="w-4 h-4 text-[var(--accent-magenta)]" />
                      </div>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full border border-[var(--accent-magenta)]/30 bg-[var(--accent-magenta)]/[0.08] text-[var(--text-small)] font-semibold text-[var(--accent-lavender)] tracking-[var(--ls-wide)] mb-3" style={{ fontFamily: 'var(--font-mono)' }}>
                      Step {s.step}
                    </span>
                    <p className="text-white font-semibold text-[1.25rem] mb-2 leading-[var(--lh-subhead)]">{s.title}</p>
                    <p className="text-white/40 text-[0.875rem] leading-[var(--lh-body)] max-w-[200px]">{s.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Timeline — mobile vertical */}
        <div className="md:hidden space-y-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="flex gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-9 h-9 rounded-full border border-[var(--accent-magenta)]/40 bg-[var(--bg-deep)] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[var(--accent-magenta)]" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 mt-2 bg-gradient-to-b from-[var(--accent-magenta)]/30 to-transparent" />
                  )}
                </div>
                <div className="pb-6">
                  <span className="inline-block px-3 py-1 rounded-full border border-[var(--accent-magenta)]/30 bg-[var(--accent-magenta)]/[0.08] text-[var(--text-small)] font-semibold text-[var(--accent-lavender)] tracking-[var(--ls-wide)] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                    Step {s.step}
                  </span>
                  <p className="text-white font-semibold text-[1.0625rem] mb-1 leading-[var(--lh-subhead)]">{s.title}</p>
                  <p className="text-white/40 text-[0.875rem] leading-[var(--lh-body)]">{s.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA banner */}
        <div className="mt-16 md:mt-20 text-center">
          <div className="glass-card p-8 md:p-10 max-w-[700px] mx-auto">
            <p className="text-white font-semibold text-[1.25rem] md:text-[1.5rem] mb-3 leading-[var(--lh-subhead)]">
              The Result? Faster Delivery, Fewer Bugs, and Products Built to Last.
            </p>
            <p className="text-white/45 text-[var(--text-body)] max-w-md mx-auto mb-6 leading-[var(--lh-body)]">
              Our AI-first workflow compresses timelines without cutting corners — delivering production-ready software with continuous intelligence built in from day one.
            </p>
            <GradientButton
              size="md"
              variant="outline"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              See This Process in Action
            </GradientButton>
          </div>
        </div>
      </div>
    </section>
  );
}
