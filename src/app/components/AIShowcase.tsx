"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  TrendingUp,
  Zap,
  CheckCircle,
  AlertTriangle,
  Activity,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import GradientButton from "./GradientButton";

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

/* ── 1. RadarScanVisual: AI scanning for opportunities ── */
function RadarScanVisual() {
  const dataPoints = [
    { x: "28%", y: "22%", delay: 0.6 },
    { x: "72%", y: "35%", delay: 0.9 },
    { x: "45%", y: "68%", delay: 1.2 },
    { x: "18%", y: "55%", delay: 1.5 },
    { x: "80%", y: "72%", delay: 1.8 },
    { x: "60%", y: "18%", delay: 0.3 },
  ];

  return (
    <div className="relative w-full h-32 overflow-hidden">
      {/* Concentric scan rings */}
      {[80, 56, 32].map((size, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            width: `${size}%`,
            height: `${size * 1.2}px`,
            borderColor: `rgba(197,10,189,${0.12 - i * 0.03})`,
            animation: `pulse-glow ${3 + i * 0.5}s ease-in-out infinite`,
          }}
        />
      ))}
      {/* Sweep line */}
      <div
        className="absolute top-1/2 left-1/2 origin-bottom-left w-[40%] h-[1px]"
        style={{
          background: "linear-gradient(90deg, rgba(197,10,189,0.6), transparent)",
          animation: "spin 4s linear infinite",
          transformOrigin: "0% 50%",
        }}
      />
      {/* Discovered data points */}
      {dataPoints.map((pt, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: pt.x,
            top: pt.y,
            background: i % 2 === 0 ? "var(--accent-magenta)" : "var(--accent-purple)",
            boxShadow: i % 2 === 0
              ? "0 0 8px rgba(197,10,189,0.7)"
              : "0 0 8px rgba(122,62,219,0.7)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.9 }}
          viewport={{ once: true }}
          transition={{ delay: pt.delay, duration: 0.4, ease: "backOut" }}
        />
      ))}
      {/* Center brain icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Search className="w-5 h-5 text-[var(--accent-magenta)] opacity-60" />
      </div>
    </div>
  );
}

/* ── 2. DesignSystemVisual: AI generating a design system ── */
function DesignSystemVisual() {
  const swatches = [
    { color: "var(--accent-magenta)", delay: 0.3 },
    { color: "var(--accent-purple)", delay: 0.4 },
    { color: "var(--accent-lavender)", delay: 0.5 },
    { color: "#f0eef6", delay: 0.6 },
    { color: "#0a0a0a", delay: 0.7, border: true },
  ];

  const components = [
    { w: "60%", h: 8, radius: 99, delay: 0.5, glow: true },
    { w: "45%", h: 8, radius: 99, delay: 0.6, glow: false },
    { w: "100%", h: 10, radius: 6, delay: 0.7, glow: false },
    { w: "100%", h: 24, radius: 8, delay: 0.8, glow: false },
  ];

  return (
    <div className="w-full py-3 px-1 space-y-3">
      {/* Color palette row */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-1 h-1 rounded-full bg-[var(--accent-magenta)]" style={{ boxShadow: "0 0 4px rgba(197,10,189,0.6)" }} />
          <span className="text-[9px] text-white/30 uppercase tracking-wider">Palette</span>
        </div>
        <div className="flex items-center gap-1.5">
          {swatches.map((swatch, i) => (
            <motion.div
              key={i}
              className="h-6 flex-1 rounded-md"
              style={{
                background: swatch.color,
                border: swatch.border ? "1px solid rgba(255,255,255,0.1)" : "none",
                boxShadow: i === 0 ? "0 0 10px rgba(197,10,189,0.3)" : "none",
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              whileInView={{ scaleY: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: swatch.delay, duration: 0.3, ease: "backOut" }}
            />
          ))}
        </div>
      </div>

      {/* Typography lines */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-1 h-1 rounded-full bg-[var(--accent-purple)]" style={{ boxShadow: "0 0 4px rgba(122,62,219,0.6)" }} />
          <span className="text-[9px] text-white/30 uppercase tracking-wider">Type</span>
        </div>
        <div className="space-y-1.5">
          {[
            { w: "50%", h: 3, delay: 0.55, opacity: 0.6 },
            { w: "75%", h: 2, delay: 0.65, opacity: 0.35 },
            { w: "60%", h: 2, delay: 0.75, opacity: 0.2 },
          ].map((line, i) => (
            <motion.div
              key={i}
              className="rounded-full bg-white"
              style={{ height: line.h, opacity: line.opacity }}
              initial={{ width: 0 }}
              whileInView={{ width: line.w }}
              viewport={{ once: true }}
              transition={{ delay: line.delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          ))}
        </div>
      </div>

      {/* Component blocks */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-1 h-1 rounded-full bg-[var(--accent-lavender)]" style={{ boxShadow: "0 0 4px rgba(147,123,216,0.6)" }} />
          <span className="text-[9px] text-white/30 uppercase tracking-wider">Components</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {components.map((comp, i) => (
            <motion.div
              key={i}
              className="border border-white/[0.08]"
              style={{
                width: comp.w,
                height: comp.h,
                borderRadius: comp.radius,
                background: comp.glow
                  ? "linear-gradient(90deg, var(--accent-magenta), var(--accent-purple))"
                  : "rgba(255,255,255,0.04)",
                boxShadow: comp.glow
                  ? "0 0 12px rgba(197,10,189,0.3)"
                  : "none",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: comp.delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 3. CodePairVisual: AI pair-programming with code lines ── */
function CodePairVisual() {
  const lines = [
    { indent: 0, w: "70%", type: "human", delay: 0.3 },
    { indent: 1, w: "55%", type: "human", delay: 0.45 },
    { indent: 1, w: "80%", type: "ai", delay: 0.6 },
    { indent: 2, w: "45%", type: "ai", delay: 0.75 },
    { indent: 1, w: "60%", type: "human", delay: 0.9 },
    { indent: 0, w: "40%", type: "ai", delay: 1.05 },
  ];

  return (
    <div className="py-3 px-1 space-y-1.5">
      {lines.map((line, i) => (
        <div key={i} className="flex items-center gap-2" style={{ paddingLeft: `${line.indent * 12}px` }}>
          {/* Line number */}
          <span className="text-[10px] text-white/20 w-3 text-right shrink-0">{i + 1}</span>
          {/* AI/Human indicator */}
          <motion.div
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              line.type === "ai" ? "bg-[var(--accent-magenta)]" : "bg-[var(--accent-purple)]"
            }`}
            style={{
              boxShadow: line.type === "ai"
                ? "0 0 6px rgba(197,10,189,0.6)"
                : "0 0 6px rgba(122,62,219,0.4)",
            }}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: line.delay, duration: 0.2 }}
          />
          {/* Code line */}
          <motion.div
            className="h-2 rounded-full"
            style={{
              background: line.type === "ai"
                ? "linear-gradient(90deg, rgba(197,10,189,0.4), rgba(197,10,189,0.1))"
                : "linear-gradient(90deg, rgba(122,62,219,0.3), rgba(122,62,219,0.08))",
            }}
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: line.w, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: line.delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>
      ))}
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-purple)]" />
          <span className="text-[9px] text-white/30">Engineer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-magenta)]" />
          <span className="text-[9px] text-white/30">AI Copilot</span>
        </div>
      </div>
    </div>
  );
}

/* ── 4. PipelineVisual: CI/CD pipeline with health monitoring ── */
function PipelineVisual() {
  const stages = [
    { label: "Build", status: "pass", delay: 0.3 },
    { label: "Test", status: "pass", delay: 0.6 },
    { label: "Scan", status: "warn", delay: 0.9 },
    { label: "Deploy", status: "pass", delay: 1.2 },
    { label: "Monitor", status: "live", delay: 1.5 },
  ];

  return (
    <div className="py-4 px-2">
      {/* Pipeline stages */}
      <div className="flex items-center justify-between gap-1 mb-4">
        {stages.map((stage, i) => (
          <React.Fragment key={i}>
            <motion.div
              className="flex flex-col items-center gap-1.5"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: stage.delay, duration: 0.4 }}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
                  stage.status === "pass"
                    ? "bg-[rgba(34,197,94,0.1)] border-green-500/20"
                    : stage.status === "warn"
                    ? "bg-[rgba(234,179,8,0.1)] border-yellow-500/20"
                    : "bg-[rgba(197,10,189,0.1)] border-[var(--accent-magenta)]/20"
                }`}
              >
                {stage.status === "pass" ? (
                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                ) : stage.status === "warn" ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                ) : (
                  <Activity
                    className="w-3.5 h-3.5 text-[var(--accent-magenta)]"
                    style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
                  />
                )}
              </div>
              <span className="text-[9px] text-white/40">{stage.label}</span>
            </motion.div>
            {/* Connector line */}
            {i < stages.length - 1 && (
              <motion.div
                className="flex-1 h-[1px] self-start mt-3.5"
                style={{
                  background: "linear-gradient(90deg, rgba(147,123,216,0.3), rgba(147,123,216,0.1))",
                }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: stage.delay + 0.15, duration: 0.3, ease: "easeOut" }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Health heartbeat line */}
      <motion.div
        className="w-full h-8 relative overflow-hidden rounded-md bg-white/[0.02] border border-white/[0.05]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.6, duration: 0.4 }}
      >
        <svg viewBox="0 0 200 30" className="w-full h-full" preserveAspectRatio="none">
          <motion.path
            d="M0,15 L30,15 L35,5 L40,25 L45,10 L50,20 L55,15 L80,15 L85,8 L90,22 L95,12 L100,18 L105,15 L140,15 L145,4 L150,26 L155,8 L160,20 L165,15 L200,15"
            fill="none"
            stroke="url(#heartbeatGradient)"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.8, duration: 1.5, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="heartbeatGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(122,62,219,0.6)" />
              <stop offset="50%" stopColor="rgba(197,10,189,0.8)" />
              <stop offset="100%" stopColor="rgba(122,62,219,0.6)" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
}

/* ── 5. OptimizationVisual: upward trend with AI intervention markers ── */
function OptimizationVisual() {
  const points = [
    { x: 0, y: 75 },
    { x: 25, y: 65 },
    { x: 40, y: 55, marker: true },
    { x: 55, y: 40 },
    { x: 70, y: 45 },
    { x: 80, y: 30, marker: true },
    { x: 95, y: 18 },
    { x: 110, y: 22 },
    { x: 125, y: 12, marker: true },
    { x: 145, y: 8 },
  ];

  const pathData = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x + 10},${p.y}`).join(" ");
  const markers = points.filter((p) => p.marker);

  return (
    <div className="py-3 px-2">
      <div className="relative w-full h-24 overflow-hidden">
        <svg viewBox="0 0 165 85" className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          {[20, 40, 60].map((y) => (
            <line key={y} x1="10" y1={y} x2="155" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          ))}
          {/* Area fill under curve */}
          <motion.path
            d={`${pathData} L155,80 L10,80 Z`}
            fill="url(#areaGradient)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.3 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 1 }}
          />
          {/* Main trend line */}
          <motion.path
            d={pathData}
            fill="none"
            stroke="url(#trendGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1.5, ease: "easeInOut" }}
          />
          {/* AI intervention markers */}
          {markers.map((m, i) => (
            <motion.g key={i}>
              <motion.circle
                cx={m.x + 10}
                cy={m.y}
                r="4"
                fill="var(--accent-magenta)"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.0 + i * 0.3, duration: 0.3, ease: "backOut" }}
              />
              <motion.circle
                cx={m.x + 10}
                cy={m.y}
                r="7"
                fill="none"
                stroke="rgba(197,10,189,0.3)"
                strokeWidth="1"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.1 + i * 0.3, duration: 0.4 }}
              />
            </motion.g>
          ))}
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(122,62,219,0.8)" />
              <stop offset="100%" stopColor="rgba(197,10,189,0.9)" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(197,10,189,0.15)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 pt-1">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3 h-3 text-[var(--accent-lavender)]" />
          <span className="text-[9px] text-white/30">Performance</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[var(--accent-magenta)]" style={{ boxShadow: "0 0 4px rgba(197,10,189,0.6)" }} />
          <span className="text-[9px] text-white/30">AI Optimization</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function AIShowcase() {
  const topCards = [
    {
      title: "AI-Powered Discovery",
      description:
        "We use AI to analyze your market, competitors, and operations — surfacing the highest-ROI opportunities in days, not weeks.",
      visual: <RadarScanVisual />,
    },
    {
      title: "AI-Assisted Design & Prototyping",
      description:
        "AI generates wireframes, UI variations, and user flows — so you go from idea to interactive prototype 3x faster.",
      visual: <DesignSystemVisual />,
    },
    {
      title: "AI-Augmented Development",
      description:
        "AI pair-programs with our engineers — writing tests, catching bugs, and accelerating delivery while maintaining production-grade quality.",
      visual: <CodePairVisual />,
    },
  ];

  const bottomCards = [
    {
      title: "Intelligent Deployment & Monitoring",
      description:
        "AI-driven CI/CD pipelines, automated rollbacks, and real-time anomaly detection — your product stays healthy 24/7.",
      visual: <PipelineVisual />,
    },
    {
      title: "Continuous AI-Driven Optimization",
      description:
        "Post-launch, AI monitors user behavior, flags performance bottlenecks, and suggests improvements — your product gets smarter over time.",
      visual: <OptimizationVisual />,
    },
  ];

  return (
    <section id="solutions" className="relative min-h-screen px-6 md:px-[90px] py-20 scroll-mt-20">
      <div className="max-w-[1100px] mx-auto">
        {/* Section header */}
        <ScrollReveal direction="blur" className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--accent-lavender)]">
            AI at Every Step of the Process
          </h2>
          <div className="accent-line w-20 mx-auto mt-4 rounded-full" />
          <p className="mt-6 text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            AI isn&apos;t just what we build — it&apos;s how we build. Every phase of our workflow is AI-augmented, delivering faster timelines, fewer errors, and smarter outcomes.
          </p>
        </ScrollReveal>

        {/* Row 1: 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {topCards.map((card, i) => (
            <motion.div
              key={card.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass-card group relative p-6 overflow-hidden"
            >
              <h3 className="text-[var(--text-primary)] font-semibold text-base mb-2">
                {card.title}
              </h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {card.description}
              </p>
              <div className="mt-4">{card.visual}</div>
            </motion.div>
          ))}
        </div>

        {/* Row 2: 2 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {bottomCards.map((card, i) => (
            <motion.div
              key={card.title}
              custom={i + 3}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass-card group relative p-6 overflow-hidden"
            >
              <h3 className="text-[var(--text-primary)] font-semibold text-base mb-2">
                {card.title}
              </h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {card.description}
              </p>
              <div className="mt-4">{card.visual}</div>
            </motion.div>
          ))}
        </div>

        {/* Row 3: Full-width banner with CTA */}
        <ScrollReveal delay={0.3} direction="blur">
          <div className="relative glass-card noise-overlay p-8 overflow-hidden text-center">
            <div
              className="absolute inset-0 rounded-2xl opacity-40 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, transparent 30%, rgba(197,10,189,0.08) 50%, transparent 70%)",
                backgroundSize: "200% 200%",
                animation: "gradient-shift 6s ease-in-out infinite",
              }}
            />
            <div className="relative z-10 flex items-center justify-center gap-3 mb-3">
              <Zap
                className="w-5 h-5 text-[var(--accent-magenta)]"
                style={{ filter: "drop-shadow(0 0 6px rgba(197,10,189,0.5))" }}
              />
              <h3 className="text-[var(--text-primary)] font-semibold text-lg">
                The Result? 3x Faster Delivery. Fewer Bugs. Smarter Products.
              </h3>
              <Zap
                className="w-5 h-5 text-[var(--accent-purple)]"
                style={{ filter: "drop-shadow(0 0 6px rgba(122,62,219,0.5))" }}
              />
            </div>
            <p className="relative z-10 text-[var(--text-secondary)] text-sm max-w-xl mx-auto mb-5">
              Our AI-first workflow means you get production-ready software in weeks, not months — with continuous intelligence baked in from day one.
            </p>
            <div className="relative z-10">
              <GradientButton
                size="md"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                See This Process in Action
              </GradientButton>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
