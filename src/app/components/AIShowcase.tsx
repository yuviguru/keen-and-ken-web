"use client";
import React from "react";
import { motion } from "framer-motion";
import { Search, Palette, Code2, Rocket, BarChart3 } from "lucide-react";
import GradientButton from "./GradientButton";

const steps = [
  {
    step: 1,
    title: "Discovery & Research",
    description:
      "We map your market, competitors, and operations — surfacing high-ROI opportunities in days, not weeks.",
    icon: Search,
  },
  {
    step: 2,
    title: "Design & Prototyping",
    description:
      "AI generates wireframes, UI variations, and user flows — from idea to interactive prototype 3x faster.",
    icon: Palette,
  },
  {
    step: 3,
    title: "AI-Augmented Dev",
    description:
      "AI pair-programs with our engineers — writing tests, catching bugs, and shipping production-grade code.",
    icon: Code2,
  },
  {
    step: 4,
    title: "Smart Deployment",
    description:
      "Automated CI/CD pipelines, instant rollbacks, and real-time anomaly detection — healthy around the clock.",
    icon: Rocket,
  },
  {
    step: 5,
    title: "Ongoing Optimization",
    description:
      "Post-launch, AI monitors user behavior, flags bottlenecks, and suggests improvements — always evolving.",
    icon: BarChart3,
  },
];

const stepVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function AIShowcase() {
  return (
    <section id="solutions" className="relative px-6 md:px-12 lg:px-16 py-24 md:py-32 scroll-mt-20">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.p
            className="section-label mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.p>

          <motion.h2
            className="text-[var(--text-h3)] md:text-[var(--text-h2)] font-bold text-white leading-[var(--lh-heading)] tracking-[var(--ls-heading)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            AI at Every Step of the Process
          </motion.h2>

          <motion.p
            className="mt-5 text-[var(--text-body)] md:text-[var(--text-body-lg)] text-white/45 max-w-2xl mx-auto leading-[var(--lh-body)] tracking-[var(--ls-body)]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            AI isn&apos;t just what we build — it&apos;s how we build. Every phase of our workflow is AI-augmented for faster timelines and smarter outcomes.
          </motion.p>
        </div>

        {/* Timeline — desktop horizontal */}
        <div className="hidden md:block">
          {/* Connection line */}
          <div className="relative mx-auto max-w-[1200px]">
            <div className="absolute top-[18px] left-[10%] right-[10%] h-px bg-white/[0.08]" />
            <motion.div
              className="absolute top-[18px] left-[10%] h-px"
              style={{
                background: "linear-gradient(90deg, var(--accent-magenta), var(--accent-purple))",
              }}
              initial={{ width: 0 }}
              whileInView={{ width: "80%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
            />

            {/* Steps */}
            <div className="grid grid-cols-5 gap-4">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.step}
                    custom={i}
                    variants={stepVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Dot */}
                    <div className="relative mb-6">
                      <div
                        className="w-9 h-9 rounded-full border border-[var(--accent-magenta)]/40 bg-[var(--bg-deep)] flex items-center justify-center"
                        style={{ animation: "pulse-dot 3s ease-in-out infinite", animationDelay: `${i * 0.5}s` }}
                      >
                        <Icon className="w-4 h-4 text-[var(--accent-magenta)]" />
                      </div>
                    </div>

                    {/* Badge */}
                    <span className="inline-block px-3 py-1 rounded-full border border-[var(--accent-magenta)]/30 bg-[var(--accent-magenta)]/[0.08] text-[var(--text-small)] font-semibold text-[var(--accent-lavender)] tracking-[var(--ls-wide)] mb-3" style={{ fontFamily: 'var(--font-mono)' }}>
                      Step {s.step}
                    </span>

                    <p className="text-white font-semibold text-[1.25rem] mb-2 leading-[var(--lh-subhead)]">
                      {s.title}
                    </p>
                    <p className="text-white/40 text-[0.875rem] leading-[var(--lh-body)] max-w-[200px]">
                      {s.description}
                    </p>
                  </motion.div>
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
              <motion.div
                key={s.step}
                custom={i}
                variants={stepVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex gap-4"
              >
                {/* Left: dot + line */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-9 h-9 rounded-full border border-[var(--accent-magenta)]/40 bg-[var(--bg-deep)] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[var(--accent-magenta)]" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 mt-2 bg-gradient-to-b from-[var(--accent-magenta)]/30 to-transparent" />
                  )}
                </div>

                {/* Right: content */}
                <div className="pb-6">
                  <span className="inline-block px-3 py-1 rounded-full border border-[var(--accent-magenta)]/30 bg-[var(--accent-magenta)]/[0.08] text-[var(--text-small)] font-semibold text-[var(--accent-lavender)] tracking-[var(--ls-wide)] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                    Step {s.step}
                  </span>
                  <p className="text-white font-semibold text-[1.0625rem] mb-1 leading-[var(--lh-subhead)]">
                    {s.title}
                  </p>
                  <p className="text-white/40 text-[0.875rem] leading-[var(--lh-body)]">
                    {s.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA banner */}
        <motion.div
          className="mt-16 md:mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass-card p-8 md:p-10 max-w-[700px] mx-auto">
            <p className="text-white font-semibold text-[1.25rem] md:text-[1.5rem] mb-3 leading-[var(--lh-subhead)]">
              The Result? 3x Faster Delivery. Fewer Bugs. Smarter Products.
            </p>
            <p className="text-white/45 text-[var(--text-body)] max-w-md mx-auto mb-6 leading-[var(--lh-body)]">
              Our AI-first workflow means production-ready software in weeks, not months — with continuous intelligence baked in from day one.
            </p>
            <GradientButton
              size="md"
              variant="outline"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              See This Process in Action
            </GradientButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
