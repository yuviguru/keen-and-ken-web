"use client";
import React from "react";
import { Bug, Search, Rocket, Users } from "lucide-react";

const services = [
  {
    title: "Bug & Issue Resolution",
    description: "Your app broke and AI can't fix it anymore. We diagnose the root cause — not the symptom — and deliver a clean fix with documentation explaining what went wrong.",
    turnaround: "24-48 hours for isolated bugs, 2-4 days for interconnected issues",
    icon: Bug,
  },
  {
    title: "Architecture Review",
    description: "Is your AI-built app structured to survive real users and ongoing development? We review for structural problems, security vulnerabilities, and hidden technical debt.",
    turnaround: "3-5 business days",
    icon: Search,
  },
  {
    title: "Production Readiness",
    description: "The gap between \"works in preview\" and \"works for real users\" is where most AI-built apps die. We take your project through a complete launch checklist.",
    turnaround: "5-7 business days",
    icon: Rocket,
  },
  {
    title: "Fractional Technical Architect",
    description: "For founders building something serious with AI tools. Weekly codebase check-ins, architectural guidance, priority bug resolution, and strategic advice.",
    turnaround: "Ongoing engagement",
    icon: Users,
  },
];

export default function VRServices() {
  return (
    <section id="vr-services" className="relative px-6 md:px-12 lg:px-16 py-24 md:py-32 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-4">Services</p>
          <h2 className="text-[var(--text-h3)] md:text-[var(--text-h2)] font-bold text-white leading-[var(--lh-heading)] tracking-[var(--ls-heading)]">
            From Quick Fix to Full Architecture
          </h2>
          <p className="mt-5 text-[var(--text-body)] md:text-[var(--text-body-lg)] text-white/45 max-w-2xl mx-auto leading-[var(--lh-body)] tracking-[var(--ls-body)]">
            Whether it&apos;s a single bug or a full architecture overhaul, we get your app from stuck to shipped.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="glass-card p-8 group">
                <div className="w-10 h-10 mb-5 flex items-center justify-center rounded-lg border border-white/[0.08] group-hover:border-[var(--accent-magenta)]/30 transition-colors duration-300">
                  <Icon className="w-4 h-4 text-white/40 group-hover:text-[var(--accent-magenta)] transition-colors duration-300" />
                </div>
                <h3 className="text-white font-semibold text-[var(--text-subhead)] leading-[var(--lh-subhead)] tracking-[var(--ls-body)] mb-3">
                  {service.title}
                </h3>
                <p className="text-white/40 text-[0.875rem] leading-[var(--lh-body)] tracking-[var(--ls-body)] mb-4">
                  {service.description}
                </p>
                <span className="inline-block px-3 py-1 rounded-full border border-[var(--accent-magenta)]/20 bg-[var(--accent-magenta)]/[0.06] text-[var(--text-caption)] text-[var(--accent-lavender)] tracking-[var(--ls-wide)]" style={{ fontFamily: "var(--font-mono)" }}>
                  {service.turnaround}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
