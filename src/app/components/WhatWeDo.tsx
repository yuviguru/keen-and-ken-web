"use client";
import React, { useEffect, useState } from "react";
import throttle from "lodash/throttle";
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
  { title: "UI/UX Design", description: "User research, wireframes, and polished prototypes that turn complex workflows into intuitive experiences.", icon: Palette },
  { title: "Custom Software Development", description: "Full-stack web and mobile apps, APIs, and integrations — built to scale from day one.", icon: Code2 },
  { title: "AI & Automation", description: "Custom AI agents, workflow automation, and ML models that eliminate repetitive tasks with human-level accuracy.", icon: Bot },
  { title: "Consulting & Training", description: "We upskill your team on the AI tools we build — workshops, documentation, and hands-on training so you're never dependent on us.", icon: BookOpen },
  { title: "Data & Analytics", description: "Turn raw data into decisions. We build pipelines, dashboards, and BI tools that surface what matters.", icon: BarChart3 },
  { title: "Cloud & DevOps", description: "AWS, Azure, or GCP — we handle infrastructure, CI/CD pipelines, and zero-downtime deployments.", icon: Cloud },
  { title: "Quality Assurance", description: "Automated testing, performance audits, and security reviews so you ship with confidence every time.", icon: ShieldCheck },
  { title: "Support & Maintenance", description: "Post-launch monitoring, updates, bug fixes, and scaling support — we don't disappear after delivery.", icon: Wrench },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function WhatWeDo() {
  const [bgOpacity, setBgOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const transitionPoint = windowHeight * 0.5;
      if (scrollPosition > transitionPoint) {
        setBgOpacity(Math.min((scrollPosition - transitionPoint) / (windowHeight * 0.5), 1));
      } else {
        setBgOpacity(0);
      }
    }, 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="services"
      className="relative min-h-screen flex items-center justify-center px-6 md:px-[90px] py-20 scroll-mt-20"
      style={{
        background: `radial-gradient(98.05% 261.61% at 1.95% 3.59%, rgba(97, 54, 217, ${bgOpacity * 0.4}) 0%, rgba(97, 54, 217, 0) 100%)`,
        transition: "background 0.5s ease",
      }}
    >
      <div className="text-center w-full max-w-[960px] mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--accent-lavender)]"
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          End-to-End, From Idea to Launch & Beyond
        </motion.h2>

        <motion.div
          className="accent-line w-20 mx-auto mt-4 rounded-full"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />

        <motion.p
          className="mt-6 text-base md:text-lg text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          We own the entire lifecycle — discovery, design, development, deployment, and ongoing support. One team, no handoffs, no gaps.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 max-w-[900px] mx-auto">
          {cards.map((card, index) => {
            const Icon = card.icon;
            const isLastRow = index >= Math.floor(cards.length / 3) * 3;
            const isLastInRow = (index + 1) % 3 === 0;

            return (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group flex flex-col items-center justify-center p-8 cursor-default
                  transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
                  hover:bg-white/[0.03] rounded-lg"
                style={{
                  borderRight: isLastInRow || index === cards.length - 1 ? "none" : "1px solid transparent",
                  borderBottom: isLastRow ? "none" : "1px solid transparent",
                  borderImage: "linear-gradient(to left, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.00) 100%) 1",
                  borderImageSlice: 1,
                }}
              >
                <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.06]
                  group-hover:bg-[rgba(197,10,189,0.08)] group-hover:border-[rgba(197,10,189,0.2)]
                  transition-all duration-300">
                  <Icon className="w-5 h-5 text-[#937bd8] group-hover:text-[#C50ABD] transition-colors duration-300" />
                </div>
                <h4 className="text-center text-[#f0eef6] font-medium text-sm">
                  {card.title}
                </h4>
                <p className="text-center text-[rgba(239,237,253,0.6)] text-xs mt-1.5 leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GradientButton
            size="md"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Discuss Your Project With Us
          </GradientButton>
        </motion.div>
      </div>
    </section>
  );
}
