"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import GradientButton from "./GradientButton";

/* Decorative floating orbs */
const orbs = [
  { size: 80, x: "10%", y: "20%", color: "rgba(197,10,189,0.08)", delay: 0, dur: 6 },
  { size: 120, x: "85%", y: "15%", color: "rgba(122,62,219,0.06)", delay: 1.5, dur: 7 },
  { size: 60, x: "75%", y: "70%", color: "rgba(197,10,189,0.06)", delay: 0.8, dur: 5.5 },
  { size: 90, x: "5%", y: "75%", color: "rgba(147,123,216,0.07)", delay: 2, dur: 6.5 },
  { size: 50, x: "50%", y: "85%", color: "rgba(197,10,189,0.05)", delay: 1, dur: 5 },
  { size: 70, x: "30%", y: "10%", color: "rgba(122,62,219,0.05)", delay: 0.5, dur: 7.5 },
];

export default function CareersSection() {
  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center px-6 md:px-[90px] py-20 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(122,62,219,0.08) 0%, rgba(197,10,189,0.04) 40%, transparent 70%)",
      }}
    >
      {/* Floating decorative orbs */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            animation: `float-slow ${orb.dur}s ease-in-out ${orb.delay}s infinite`,
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* Top decorative gradient line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-[60%]"
        style={{
          background: "linear-gradient(to right, transparent, rgba(147,123,216,0.15), transparent)",
        }}
      />

      {/* Bottom decorative gradient line */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-[40%]"
        style={{
          background: "linear-gradient(to right, transparent, rgba(197,10,189,0.12), transparent)",
        }}
      />

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <ScrollReveal direction="blur">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            We&apos;re Always Ready to Welcome{" "}
            <span className="gradient-text">Fresh Talent!</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15} direction="blur">
          <p className="mt-6 text-[var(--text-secondary)] text-base md:text-lg leading-relaxed">
            Join us in shaping the future. Be part of an innovative team and make an impact!
          </p>
          <p className="mt-2 text-[var(--text-muted)] text-sm md:text-base">
            Send us your work to{" "}
            <a
              href="mailto:info@keenken.com"
              className="text-[var(--accent-lavender)] hover:text-[var(--accent-magenta)] transition-colors duration-300 underline underline-offset-4 decoration-[var(--accent-lavender)]/30 hover:decoration-[var(--accent-magenta)]/50"
            >
              info@keenken.com
            </a>
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mt-10">
            <GradientButton size="lg">
              <motion.span
                className="flex items-center gap-2"
                whileHover="hover"
              >
                Share your work with us
                <motion.span
                  variants={{
                    hover: { x: 4 },
                  }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </motion.span>
            </GradientButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
