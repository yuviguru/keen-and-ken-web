"use client";
import React from "react";
import { Cpu, MessageCircle, Zap, FileText, Shield } from "lucide-react";

const differentiators = [
  {
    title: "AI-Native Builders",
    description: "We build production applications with AI-assisted workflows daily. We understand the patterns AI tools create and where they systematically fail.",
    icon: Cpu,
  },
  {
    title: "Plain Language Communication",
    description: "You don't need technical terminology. Describe your problem the way you'd describe it to a friend — we'll translate that into a diagnosis and fix.",
    icon: MessageCircle,
  },
  {
    title: "Fast Turnaround",
    description: "Most isolated bugs resolved within 24-48 hours. Complex issues within 2-4 days. Fractional architect clients get same-day response.",
    icon: Zap,
  },
  {
    title: "Everything Documented",
    description: "Every fix includes an explanation of what broke, why it broke, and how to prevent it next time. You learn from every engagement.",
    icon: FileText,
  },
  {
    title: "You Keep Everything",
    description: "Full code ownership stays with you, always. We work via pull requests when possible so you can review every change.",
    icon: Shield,
  },
];

export default function VRWhyUs() {
  return (
    <section className="relative px-6 md:px-12 lg:px-16 py-24 md:py-32 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-4">Why VibeRefactor</p>
          <h2 className="text-[var(--text-h3)] md:text-[var(--text-h2)] font-bold text-white leading-[var(--lh-heading)] tracking-[var(--ls-heading)]">
            Not Just Fixers — AI-Native Engineers
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {differentiators.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`glass-card p-7 group ${i >= 3 ? "sm:col-span-1 lg:col-span-1" : ""}`}
              >
                <div className="w-10 h-10 mb-4 flex items-center justify-center rounded-lg border border-white/[0.08] group-hover:border-[var(--accent-magenta)]/30 transition-colors duration-300">
                  <Icon className="w-4 h-4 text-white/40 group-hover:text-[var(--accent-magenta)] transition-colors duration-300" />
                </div>
                <h3 className="text-white font-semibold text-[var(--text-subhead)] leading-[var(--lh-subhead)] tracking-[var(--ls-body)] mb-2">
                  {item.title}
                </h3>
                <p className="text-white/40 text-[0.875rem] leading-[var(--lh-body)] tracking-[var(--ls-body)]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
