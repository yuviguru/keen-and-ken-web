"use client";
import React from "react";
import { Zap, Layers, Search, Rocket, Users } from "lucide-react";
import GradientButton from "../../components/GradientButton";

const tiers = [
  {
    name: "Quick Fix",
    price: "₹3,499",
    priceUsd: "$41",
    description: "A single clear bug or deployment error",
    features: ["Single issue diagnosis", "Root cause analysis", "Fix with documentation", "24-48 hour turnaround"],
    icon: Zap,
    popular: false,
  },
  {
    name: "Deep Fix",
    price: "₹8,749",
    priceUsd: "$104",
    description: "Complex or cascading issues across multiple files",
    features: ["Multi-file issue tracing", "Cascading fix resolution", "Architecture notes", "2-4 day turnaround"],
    icon: Layers,
    popular: true,
  },
  {
    name: "Architecture Review",
    price: "₹17,499",
    priceUsd: "$209",
    description: "Pre-launch review, security audit, scalability check",
    features: ["Full codebase audit", "Security vulnerability scan", "Performance analysis", "Prioritized action plan"],
    icon: Search,
    popular: false,
  },
  {
    name: "Production Readiness",
    price: "Custom",
    priceUsd: "quote",
    description: "Full launch preparation for AI-built apps",
    features: ["Environment configuration", "Error handling hardening", "Auth & security review", "Deployment setup"],
    icon: Rocket,
    popular: false,
  },
  {
    name: "Fractional Architect",
    price: "From ₹34,999",
    priceUsd: "$419/mo",
    description: "Ongoing technical leadership for your project",
    features: ["Weekly codebase check-ins", "Priority bug resolution", "Architecture guidance", "Same-day response"],
    icon: Users,
    popular: false,
  },
];

export default function VRPricing() {
  return (
    <section id="vr-pricing" className="relative px-6 md:px-12 lg:px-16 py-24 md:py-32 scroll-mt-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-4">Pricing</p>
          <h2 className="text-[var(--text-h3)] md:text-[var(--text-h2)] font-bold text-white leading-[var(--lh-heading)] tracking-[var(--ls-heading)]">
            Transparent Pricing, Real Results
          </h2>
          <p className="mt-5 text-[var(--text-body)] md:text-[var(--text-body-lg)] text-white/45 max-w-2xl mx-auto leading-[var(--lh-body)] tracking-[var(--ls-body)]">
            If we can&apos;t fix it, you don&apos;t pay. No risk.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.name}
                className={`glass-card p-6 flex flex-col ${
                  tier.popular ? "border-[var(--accent-magenta)]/40 ring-1 ring-[var(--accent-magenta)]/20" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/[0.08]">
                    <Icon className="w-4 h-4 text-[var(--accent-magenta)]" />
                  </div>
                  {tier.popular && (
                    <span className="px-3 py-1 rounded-full bg-[var(--accent-magenta)] text-white text-[var(--text-caption)] font-semibold tracking-[var(--ls-wide)]">
                      Most Popular
                    </span>
                  )}
                </div>

                <h3 className="text-white font-semibold text-[var(--text-subhead)] leading-[var(--lh-subhead)] mb-1">
                  {tier.name}
                </h3>

                <div className="mb-3">
                  <span className="text-white font-bold text-[1.5rem] leading-tight">{tier.price}</span>
                  <span className="text-white/30 text-[var(--text-small)] ml-2">/ {tier.priceUsd}</span>
                </div>

                <p className="text-white/35 text-[var(--text-small)] leading-[var(--lh-body)] mb-5">
                  {tier.description}
                </p>

                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-[var(--accent-magenta)] mt-2 shrink-0" />
                      <span className="text-white/40 text-[var(--text-small)] leading-[var(--lh-body)]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <GradientButton
                  size="sm"
                  variant={tier.popular ? "filled" : "outline"}
                  className="w-full"
                  onClick={() => document.getElementById("vr-intake")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Get Started
                </GradientButton>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
