"use client";
import React from "react";

const platforms = [
  "Lovable",
  "Bolt.new",
  "Cursor",
  "Replit",
  "v0",
  "Claude Code",
  "Windsurf",
  "GitHub Copilot",
  "Cline",
  "Aider",
  "Bubble",
  "Webflow",
  "FlutterFlow",
];

const deployTargets = [
  "Vercel",
  "Netlify",
  "Railway",
  "Render",
  "AWS",
  "DigitalOcean",
  "Supabase",
  "Firebase",
];

export default function VRPlatforms() {
  return (
    <section className="relative px-6 md:px-12 lg:px-16 py-24 md:py-32 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <p className="section-label mb-4">Platforms</p>
          <h2 className="text-[var(--text-h3)] md:text-[var(--text-h2)] font-bold text-white leading-[var(--lh-heading)] tracking-[var(--ls-heading)]">
            We Work With Every AI Coding Tool
          </h2>
        </div>

        {/* AI Tools marquee */}
        <div className="relative overflow-hidden mb-10">
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-[var(--bg-deep)] to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-[var(--bg-deep)] to-transparent" />
          <div className="flex gap-4 animate-marquee">
            {[...platforms, ...platforms].map((platform, i) => (
              <span
                key={`${platform}-${i}`}
                className="shrink-0 px-5 py-2.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-white/50 text-[var(--text-small)] font-medium tracking-[var(--ls-body)] hover:border-[var(--accent-magenta)]/30 hover:text-white/70 transition-colors duration-300"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>

        {/* Deploy targets */}
        <div className="text-center">
          <p className="text-white/25 text-[var(--text-small)] mb-4 tracking-[var(--ls-wide)]" style={{ fontFamily: "var(--font-mono)" }}>
            WE DEPLOY TO
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {deployTargets.map((target) => (
              <span
                key={target}
                className="px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.01] text-white/35 text-[var(--text-small)] tracking-[var(--ls-body)]"
              >
                {target}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
