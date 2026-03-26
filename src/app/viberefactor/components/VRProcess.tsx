"use client";
import React from "react";
import { Upload, Stethoscope, Wrench, Rocket } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Share Your Project",
    description: "Send us your GitHub repo or project link, describe the problem in plain language, and include any error messages. No technical knowledge needed.",
    icon: Upload,
  },
  {
    step: 2,
    title: "We Diagnose",
    description: "We trace the issue to its root cause. AI-generated codebases have predictable failure patterns — we identify exactly what's wrong.",
    icon: Stethoscope,
  },
  {
    step: 3,
    title: "We Fix & Document",
    description: "We deliver the fix along with clear documentation of what was wrong and what we changed. You understand your codebase better after working with us.",
    icon: Wrench,
  },
  {
    step: 4,
    title: "You Ship",
    description: "Your app works in production. You keep full ownership. We're here if you need us again.",
    icon: Rocket,
  },
];

export default function VRProcess() {
  return (
    <section id="vr-process" className="relative px-6 md:px-12 lg:px-16 py-24 md:py-32 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <p className="section-label mb-4">How It Works</p>
          <h2 className="text-[var(--text-h3)] md:text-[var(--text-h2)] font-bold text-white leading-[var(--lh-heading)] tracking-[var(--ls-heading)]">
            Four Steps to a Working App
          </h2>
          <p className="mt-5 text-[var(--text-body)] md:text-[var(--text-body-lg)] text-white/45 max-w-2xl mx-auto leading-[var(--lh-body)] tracking-[var(--ls-body)]">
            Simple, transparent process. You describe the problem, we fix it.
          </p>
        </div>

        {/* Desktop horizontal timeline */}
        <div className="hidden md:block">
          <div className="relative mx-auto max-w-[1000px]">
            <div className="absolute top-[18px] left-[12%] right-[12%] h-px bg-white/[0.08]" />
            <div
              className="absolute top-[18px] left-[12%] h-px"
              style={{
                width: "76%",
                background: "linear-gradient(90deg, var(--accent-magenta), var(--accent-purple))",
              }}
            />

            <div className="grid grid-cols-4 gap-6">
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
                    <span className="inline-block px-3 py-1 rounded-full border border-[var(--accent-magenta)]/30 bg-[var(--accent-magenta)]/[0.08] text-[var(--text-small)] font-semibold text-[var(--accent-lavender)] tracking-[var(--ls-wide)] mb-3" style={{ fontFamily: "var(--font-mono)" }}>
                      Step {s.step}
                    </span>
                    <p className="text-white font-semibold text-[1.25rem] mb-2 leading-[var(--lh-subhead)]">{s.title}</p>
                    <p className="text-white/40 text-[0.875rem] leading-[var(--lh-body)] max-w-[220px]">{s.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile vertical timeline */}
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
                  <span className="inline-block px-3 py-1 rounded-full border border-[var(--accent-magenta)]/30 bg-[var(--accent-magenta)]/[0.08] text-[var(--text-small)] font-semibold text-[var(--accent-lavender)] tracking-[var(--ls-wide)] mb-2" style={{ fontFamily: "var(--font-mono)" }}>
                    Step {s.step}
                  </span>
                  <p className="text-white font-semibold text-[1.0625rem] mb-1 leading-[var(--lh-subhead)]">{s.title}</p>
                  <p className="text-white/40 text-[0.875rem] leading-[var(--lh-body)]">{s.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
