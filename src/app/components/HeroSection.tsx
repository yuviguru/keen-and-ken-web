"use client";
import React from "react";
import { motion } from "framer-motion";
import GradientButton from "./GradientButton";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.4 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Aurora background — real divs, not pseudo-elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute rounded-full"
          style={{
            top: "-30%",
            left: "5%",
            width: "70vw",
            height: "70vh",
            background: "rgba(124, 90, 237, 0.35)",
            filter: "blur(100px)",
            animation: "aurora-1 10s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: "-15%",
            right: "-5%",
            width: "55vw",
            height: "55vh",
            background: "rgba(97, 54, 217, 0.30)",
            filter: "blur(90px)",
            animation: "aurora-2 12s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: "5%",
            left: "25%",
            width: "45vw",
            height: "40vh",
            background: "rgba(147, 123, 216, 0.18)",
            filter: "blur(80px)",
            animation: "aurora-3 14s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 text-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Social proof badge */}
        <motion.div variants={fadeUp} className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/[0.04]">
            <div className="flex -space-x-2">
              {[
                "bg-gradient-to-br from-purple-400 to-pink-500",
                "bg-gradient-to-br from-blue-400 to-purple-500",
                "bg-gradient-to-br from-pink-400 to-red-500",
              ].map((bg, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full border-2 border-[var(--bg-deep)] ${bg}`}
                />
              ))}
            </div>
            <span className="text-[var(--text-small)] text-white/60 tracking-[var(--ls-body)]">
              Trusted by growing businesses
            </span>
          </div>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4.5rem] font-extrabold leading-[1.2] tracking-[var(--ls-tight)] text-white max-w-5xl mx-auto"
        >
          We Build AI Systems
          <br />
          That Run Your Business
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 text-[var(--text-body)] md:text-[var(--text-body-lg)] text-white/50 max-w-2xl mx-auto leading-[var(--lh-relaxed)] tracking-[var(--ls-body)]"
        >
          Custom AI agents, workflow automation, and full-stack products —
          so you can scale without scaling headcount.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <GradientButton
            size="lg"
            variant="primary"
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Get Started
          </GradientButton>
          <GradientButton
            size="lg"
            variant="outline"
            onClick={() =>
              document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            See Our Services
          </GradientButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
