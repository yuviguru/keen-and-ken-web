"use client";
import React, { useState } from "react";
import { ArrowRight, Bot, Shield, Users } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Automated Refactoring Agents",
    description: "AI agents that fix common issues in your codebase automatically — structure, security, accessibility, and more.",
  },
  {
    icon: Users,
    title: "Vibecoder Marketplace",
    description: "Get matched with vetted developers who specialize in rescuing AI-built apps. Pay per fix, escrow-protected.",
  },
  {
    icon: Shield,
    title: "Scoped Repo Access",
    description: "Grant temporary, limited access to your repos with full audit trails. Vibecoders only see what you allow.",
  },
];

export default function VRPlatformTeaser() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    try {
      await fetch("/api/viberefactor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Waitlist Signup",
          email,
          projectUrl: "",
          aiTool: "waitlist",
          problem: "Platform waitlist signup",
          errorDetails: "",
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true); // Show success anyway for UX
    }
  }

  return (
    <section className="relative px-6 md:px-12 lg:px-16 py-24 md:py-32 scroll-mt-20">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% 50%, rgba(124, 90, 237, 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-[1100px] mx-auto">
        <div className="text-center mb-12">
          <p className="section-label mb-4">Coming Soon</p>
          <h2 className="text-[var(--text-h3)] md:text-[var(--text-h2)] font-bold text-white leading-[var(--lh-heading)] tracking-[var(--ls-heading)]">
            The VibeRefactor Platform
          </h2>
          <p className="mt-4 text-[var(--text-body)] text-white/40 max-w-2xl mx-auto leading-[var(--lh-body)]">
            We&apos;re building the infrastructure for AI-built apps to go from prototype to production — automated agents, a developer marketplace, and secure collaboration tools.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="glass-card p-6">
                <div className="w-10 h-10 mb-4 flex items-center justify-center rounded-lg border border-white/[0.08]">
                  <Icon className="w-4 h-4 text-[var(--accent-magenta)]" />
                </div>
                <h3 className="text-white font-semibold text-[var(--text-body)] mb-2">{f.title}</h3>
                <p className="text-white/35 text-[var(--text-small)] leading-[var(--lh-body)]">{f.description}</p>
              </div>
            );
          })}
        </div>

        {/* Waitlist */}
        <div className="max-w-md mx-auto text-center">
          {submitted ? (
            <div className="glass-card p-6">
              <p className="text-white font-semibold mb-1">You&apos;re on the list!</p>
              <p className="text-white/40 text-[var(--text-small)]">We&apos;ll notify you when the platform launches.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 rounded-xl border border-white/[0.1] bg-white/[0.04] text-white placeholder:text-white/25 text-[var(--text-small)] focus:outline-none focus:border-[var(--accent-primary)]/40 transition-all"
              />
              <button
                type="submit"
                className="shrink-0 px-5 py-3 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-purple)] text-white font-semibold text-[var(--text-small)] transition-all duration-300 cursor-pointer flex items-center gap-2"
              >
                Join Waitlist <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
