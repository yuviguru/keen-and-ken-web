"use client";
import React from "react";
import { RefreshCw, CloudOff, Lock, Database, Plug } from "lucide-react";

const issues = [
  {
    title: "The Fix Loop",
    description: "Every AI fix breaks something else. The codebase has crossed from fixable to structurally broken. We know exactly when to patch and when to restructure.",
    icon: RefreshCw,
  },
  {
    title: "Deployment Failures",
    description: "App works in preview mode, crashes when deployed to Vercel, Netlify, or a custom domain. Usually environment variables, missing configs, or platform-specific dependencies.",
    icon: CloudOff,
  },
  {
    title: "Authentication & Sessions",
    description: "Login works for you but breaks for real users. Sessions expire mid-flow. API keys exposed in client-side code. Security checks on the wrong side.",
    icon: Lock,
  },
  {
    title: "Database & Performance",
    description: "Queries that work with test data but timeout with real data. Missing indexes, N+1 problems, and unoptimized API chains that stack latency.",
    icon: Database,
  },
  {
    title: "Integration Breakdowns",
    description: "Stripe payments failing silently. Third-party APIs returning unhandled errors. Supabase or Firebase connections that work locally but not in deployment.",
    icon: Plug,
  },
];

export default function VRIssues() {
  return (
    <section className="relative px-6 md:px-12 lg:px-16 py-24 md:py-32 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-4">What We Fix</p>
          <h2 className="text-[var(--text-h3)] md:text-[var(--text-h2)] font-bold text-white leading-[var(--lh-heading)] tracking-[var(--ls-heading)]">
            Common AI-Generated Code Problems
          </h2>
          <p className="mt-5 text-[var(--text-body)] md:text-[var(--text-body-lg)] text-white/45 max-w-2xl mx-auto leading-[var(--lh-body)] tracking-[var(--ls-body)]">
            AI tools create predictable failure patterns. We&apos;ve seen them all.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {issues.map((issue) => {
            const Icon = issue.icon;
            return (
              <div key={issue.title} className="glass-card p-7 group">
                <div className="w-10 h-10 mb-4 flex items-center justify-center rounded-lg border border-white/[0.08] group-hover:border-[var(--accent-magenta)]/30 transition-colors duration-300">
                  <Icon className="w-4 h-4 text-white/40 group-hover:text-[var(--accent-magenta)] transition-colors duration-300" />
                </div>
                <h3 className="text-white font-semibold text-[var(--text-subhead)] leading-[var(--lh-subhead)] tracking-[var(--ls-body)] mb-2">
                  {issue.title}
                </h3>
                <p className="text-white/40 text-[0.875rem] leading-[var(--lh-body)] tracking-[var(--ls-body)]">
                  {issue.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
