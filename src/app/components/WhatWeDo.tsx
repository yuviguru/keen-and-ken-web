"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Compass,
  Palette,
  Code2,
  Bot,
  BookOpen,
  BarChart3,
  Cloud,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import GradientButton from "./GradientButton";

const cards = [
  { title: "Discovery & Strategy", description: "We assess your business, map AI opportunities, and build a clear roadmap — before writing a single line of code.", icon: Compass },
  { title: "UI/UX Design", description: "User research, wireframes, and polished prototypes that turn complex workflows into intuitive, delightful experiences.", icon: Palette },
  { title: "Custom Software", description: "Full-stack web and mobile apps, APIs, and integrations — architected to scale reliably from day one.", icon: Code2 },
  { title: "AI & Automation", description: "Custom AI agents, workflow automation, and ML models that eliminate repetitive tasks with human-level accuracy.", icon: Bot },
  { title: "Consulting & Training", description: "We upskill your team on the AI tools we build — workshops, docs, and hands-on training so you stay independent.", icon: BookOpen },
  { title: "Data & Analytics", description: "Turn raw data into decisions. We build pipelines, dashboards, and BI tools that surface what actually matters.", icon: BarChart3 },
  { title: "Cloud & DevOps", description: "AWS, Azure, or GCP — we handle infrastructure, CI/CD pipelines, and zero-downtime deployments end to end.", icon: Cloud },
  { title: "Quality Assurance", description: "Automated testing, performance audits, and security reviews so you ship with confidence every single time.", icon: ShieldCheck },
  { title: "Support & Maintenance", description: "Post-launch monitoring, updates, bug fixes, and scaling support — we don't disappear after delivery day.", icon: Wrench },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function WhatWeDo() {
  return (
    <section
      id="services"
      className="relative px-6 md:px-12 lg:px-16 py-24 md:py-32 scroll-mt-20"
    >
      <div className="text-center w-full max-w-[1400px] mx-auto">
        <motion.p
          className="section-label mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Our Services
        </motion.p>

        <motion.h2
          className="text-[var(--text-h3)] md:text-[var(--text-h2)] font-bold text-white leading-[var(--lh-heading)] tracking-[var(--ls-heading)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          End-to-End, From Idea to Launch & Beyond
        </motion.h2>

        <motion.p
          className="mt-5 text-[var(--text-body)] md:text-[var(--text-body-lg)] text-white/45 mb-16 max-w-2xl mx-auto leading-[var(--lh-body)] tracking-[var(--ls-body)]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          We own the entire lifecycle — discovery, design, development, deployment, and ongoing support. One team, no handoffs, no gaps.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px max-w-[1200px] mx-auto bg-white/[0.06] rounded-2xl overflow-hidden">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group flex flex-col items-center justify-center p-8 bg-[var(--bg-deep)]
                  hover:bg-white/[0.03] transition-colors duration-300 cursor-default"
              >
                <div className="w-10 h-10 mb-4 flex items-center justify-center rounded-lg border border-white/[0.08]
                  group-hover:border-[var(--accent-magenta)]/30 transition-colors duration-300">
                  <Icon className="w-4 h-4 text-white/40 group-hover:text-[var(--accent-magenta)] transition-colors duration-300" />
                </div>
                <h4 className="text-white font-semibold text-[var(--text-subhead)] text-center leading-[var(--lh-subhead)] tracking-[var(--ls-body)]">
                  {card.title}
                </h4>
                <p className="text-white/40 text-[0.875rem] mt-2 leading-[var(--lh-body)] tracking-[var(--ls-body)] text-center max-w-[220px]">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <GradientButton
            size="md"
            variant="outline"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Discuss Your Project With Us
          </GradientButton>
        </motion.div>
      </div>
    </section>
  );
}
