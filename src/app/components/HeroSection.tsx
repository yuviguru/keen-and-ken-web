"use client";
import React from "react";
import dynamic from "next/dynamic";
import GradientButton from "./GradientButton";
import { motion } from "framer-motion";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]" />
  ),
});

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[450px] h-screen flex items-center justify-center text-white overflow-hidden noise-overlay">
      <HeroCanvas />

      {/* Foreground content */}
      <motion.div
        className="absolute bottom-0 left-0 z-10 p-6 md:pl-[90px] max-w-full lg:max-w-[50%] md:max-w-[65%] flex flex-col justify-between pb-12 md:pb-16 pt-20"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <div>
          <motion.h1
            variants={fadeUp}
            className="text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] xl:text-[56px] font-extrabold leading-[1.1] tracking-[-0.02em] text-white"
            style={{ textShadow: "0 0 40px rgba(147, 123, 216, 0.15)" }}
          >
            We Build AI Systems That Run Your Business
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-4 text-md md:text-lg xl:text-xl text-gray-200 tracking-wide leading-relaxed max-w-xl">
            We help growing businesses automate operations, build custom AI agents, and launch AI-powered products — so you can scale without scaling headcount.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
            <GradientButton
              size="lg"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Book a Free AI Consultation
            </GradientButton>
            <button
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm text-[var(--accent-lavender)] hover:text-white transition-colors duration-300 underline underline-offset-4"
            >
              See what we build &rarr;
            </button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 accent-line w-32 rounded-full" />
        </div>
      </motion.div>

      {/* Right-Side Robot Image */}
      <div className="hidden sm:block absolute bottom-0 right-0 w-[40vw] h-[100vh] max-w-[750px] max-h-[750px] min-w-[400px] min-h-[300px] overflow-visible">
        <motion.img
          src="/female-humanoid.png"
          alt="AI-Powered Robots"
          initial={{ x: "100%", opacity: 0, scale: 1.2 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{
            duration: 2,
            ease: [0.16, 1, 0.3, 1],
            opacity: { duration: 1.2 },
            scale: { duration: 2.2 },
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "bottom",
            willChange: "transform",
          }}
        />
      </div>
    </section>
  );
}
