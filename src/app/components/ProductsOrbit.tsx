"use client";
import React from "react";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const products = [
  { name: "HRMS", orbit: 1, startAngle: 45 },
  { name: "LMS", orbit: 2, startAngle: 200 },
  { name: "AI Agents", orbit: 3, startAngle: 320 },
  { name: "Micro SaaS", orbit: 1, startAngle: 225 },
  { name: "CRM", orbit: 2, startAngle: 80 },
  { name: "CMS", orbit: 3, startAngle: 160 },
  { name: "Analytics", orbit: 4, startAngle: 270 },
  { name: "EdTech", orbit: 4, startAngle: 90 },
];

const orbitConfig = [
  { radius: 120, duration: 25 },
  { radius: 200, duration: 35 },
  { radius: 280, duration: 45 },
  { radius: 360, duration: 55 },
];

export default function ProductsOrbit() {
  return (
    <section id="products" className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-[90px] py-20 overflow-hidden scroll-mt-20">
      <ScrollReveal className="text-center mb-12 md:mb-0" direction="blur">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--accent-lavender)]">
          Products We Build & Power
        </h2>
        <div className="accent-line w-20 mx-auto mt-4 rounded-full" />
      </ScrollReveal>

      {/* Desktop orbit view */}
      <div className="hidden md:flex items-center justify-center relative w-full max-w-[800px] aspect-square">
        {/* Concentric orbit rings with alternating styles */}
        {orbitConfig.map((orbit, i) => (
          <React.Fragment key={i}>
            {/* Main ring */}
            <div
              className="absolute rounded-full"
              style={{
                width: orbit.radius * 2,
                height: orbit.radius * 2,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                border: i % 2 === 0
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px dashed rgba(147,123,216,0.12)",
              }}
            />
            {/* Depth ring (offset) */}
            <div
              className="absolute rounded-full"
              style={{
                width: orbit.radius * 2 + 8,
                height: orbit.radius * 2 + 8,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                border: "1px solid rgba(255,255,255,0.03)",
              }}
            />
          </React.Fragment>
        ))}

        {/* Center logo with pulse-glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div
            className="w-16 h-16 rounded-full bg-[var(--bg-deep)] border border-white/10 flex items-center justify-center"
            style={{
              animation: "pulse-glow 3s ease-in-out infinite",
            }}
          >
            <img src="/logo.svg" alt="K&K" className="w-8 h-8" />
          </div>
        </div>

        {/* Orbiting product pills */}
        {products.map((product, i) => {
          const orbit = orbitConfig[product.orbit - 1];
          const duration = orbit.duration;

          return (
            <div
              key={product.name}
              className="absolute top-1/2 left-1/2"
              style={{
                width: 0,
                height: 0,
                animation: `orbit-${product.orbit} ${duration}s linear infinite`,
                animationDelay: `${-(product.startAngle / 360) * duration}s`,
              }}
            >
              <motion.div
                className="absolute -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-full
                  text-xs font-semibold whitespace-nowrap"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.82))",
                  color: "#111",
                  boxShadow: "0 0 20px rgba(197,10,189,0.12), 0 2px 8px rgba(0,0,0,0.3)",
                  backdropFilter: "blur(4px)",
                }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {product.name}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Mobile grid fallback */}
      <div className="grid grid-cols-2 gap-3 md:hidden mt-8 w-full max-w-sm mx-auto">
        {products.map((product, i) => (
          <motion.div
            key={product.name}
            className="flex items-center justify-center px-4 py-3 rounded-full text-sm font-semibold"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.8))",
              color: "#111",
              boxShadow: "0 0 15px rgba(197,10,189,0.1), 0 2px 8px rgba(0,0,0,0.2)",
              border: "1px solid rgba(197,10,189,0.15)",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {product.name}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
