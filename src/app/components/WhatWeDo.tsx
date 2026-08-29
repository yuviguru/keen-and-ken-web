"use client";
import React, { useState } from "react";
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
  CheckCircle2,
} from "lucide-react";
import GradientButton from "./GradientButton";

const services = [
  {
    title: "Discovery & Strategy",
    tag: "Strategy",
    description:
      "We assess your business, map AI opportunities, and build a clear roadmap — before writing a single line of code.",
    icon: Compass,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop&q=80&auto=format",
    features: [
      "Business & technical audit",
      "AI opportunity mapping",
      "Roadmap & milestone planning",
      "Risk assessment & mitigation",
    ],
  },
  {
    title: "UI/UX Design",
    tag: "Design",
    description:
      "User research, wireframes, and polished prototypes that turn complex workflows into intuitive, delightful experiences.",
    icon: Palette,
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop&q=80&auto=format",
    features: [
      "User research & personas",
      "Wireframes & interactive prototypes",
      "Design system creation",
      "Usability testing & iteration",
    ],
  },
  {
    title: "Custom Software",
    tag: "Development",
    description:
      "Full-stack web and mobile apps, APIs, and integrations — architected to scale reliably from day one.",
    icon: Code2,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop&q=80&auto=format",
    features: [
      "Full-stack web & mobile apps",
      "API design & third-party integrations",
      "Database architecture & optimization",
      "Performance tuning & scalability",
    ],
  },
  {
    title: "AI & Automation",
    tag: "AI",
    description:
      "Custom AI agents, workflow automation, and ML models that eliminate repetitive tasks — with human oversight built into every workflow.",
    icon: Bot,
    image:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=500&fit=crop&q=80&auto=format",
    features: [
      "Custom AI agents & chatbots",
      "End-to-end workflow automation",
      "ML model development & deployment",
      "Human-in-the-loop oversight systems",
    ],
  },
  {
    title: "Consulting & Training",
    tag: "Training",
    description:
      "We upskill your team on every tool we build — workshops, documentation, and hands-on training so you never depend on us to operate what we deliver.",
    icon: BookOpen,
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=500&fit=crop&q=80&auto=format",
    features: [
      "Team workshops & live training",
      "Comprehensive technical documentation",
      "Hands-on onboarding sessions",
      "Ongoing advisory & office hours",
    ],
  },
  {
    title: "Data & Analytics",
    tag: "Analytics",
    description:
      "Turn raw data into decisions. We build pipelines, dashboards, and BI tools that surface what actually matters.",
    icon: BarChart3,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&q=80&auto=format",
    features: [
      "Data pipeline architecture",
      "BI dashboard creation",
      "Real-time analytics & alerting",
      "Predictive modelling & reporting",
    ],
  },
  {
    title: "Cloud & DevOps",
    tag: "DevOps",
    description:
      "AWS, Azure, or GCP — we handle infrastructure, CI/CD pipelines, and zero-downtime deployments end to end.",
    icon: Cloud,
    image:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=500&fit=crop&q=80&auto=format",
    features: [
      "Multi-cloud infrastructure setup",
      "CI/CD pipeline automation",
      "Container orchestration (Kubernetes)",
      "Security, compliance & cost optimisation",
    ],
  },
  {
    title: "Quality Assurance",
    tag: "QA",
    description:
      "Automated testing, performance audits, and security reviews so you ship with confidence every single time.",
    icon: ShieldCheck,
    image:
      "https://images.unsplash.com/photo-1518349619113-03114f06ac3a?w=800&h=500&fit=crop&q=80&auto=format",
    features: [
      "Automated test suite development",
      "Performance & load benchmarking",
      "Security vulnerability audits",
      "Continuous integration & quality gates",
    ],
  },
  {
    title: "Support & Maintenance",
    tag: "Support",
    description:
      "Post-launch monitoring, updates, bug fixes, and scaling support — we don't disappear after delivery day.",
    icon: Wrench,
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=500&fit=crop&q=80&auto=format",
    features: [
      "24/7 uptime monitoring & alerting",
      "Proactive bug fixing & patches",
      "Feature updates & infrastructure scaling",
      "SLA-backed response times",
    ],
  },
];

const stats = [
  { value: "9+", label: "Core Services" },
  { value: "50+", label: "Projects Delivered" },
  { value: "100%", label: "Client Retention" },
  { value: "3+", label: "Years Building" },
];

export default function WhatWeDo() {
  const [selected, setSelected] = useState(0);
  const service = services[selected];
  const Icon = service.icon;

  return (
    <section
      id="services"
      className="relative px-6 md:px-12 lg:px-16 py-24 md:py-32 scroll-mt-20"
    >
      <div className="w-full max-w-[1400px] mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="section-label mb-4">Our Services</p>
          <h2 className="text-[var(--text-h3)] md:text-[var(--text-h2)] font-bold text-white leading-[var(--lh-heading)] tracking-[var(--ls-heading)]">
            End-to-End, From Idea to Launch & Beyond
          </h2>
          <p className="mt-5 text-[var(--text-body)] md:text-[var(--text-body-lg)] text-white/45 max-w-2xl mx-auto leading-[var(--lh-body)] tracking-[var(--ls-body)]">
            We own the entire lifecycle — discovery, design, development,
            deployment, and ongoing support. One team, no handoffs, no gaps.
          </p>
        </div>

        {/* Split-view */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* ── LEFT: Service list ── */}
          <div className="w-full lg:w-[42%] rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
            {services.map((s, i) => {
              const SIcon = s.icon;
              const isActive = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left flex items-center gap-4 px-5 py-4 border-l-2 transition-all duration-200 cursor-pointer
                    ${
                      isActive
                        ? "border-[var(--accent-magenta)] bg-white/[0.05]"
                        : "border-transparent hover:border-white/20 hover:bg-white/[0.03]"
                    }
                    ${i < services.length - 1 ? "border-b border-b-white/[0.05]" : ""}
                  `}
                >
                  {/* Icon */}
                  <div
                    className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-lg border transition-all duration-200
                      ${
                        isActive
                          ? "border-[var(--accent-magenta)]/40 bg-[var(--accent-magenta)]/10"
                          : "border-white/[0.08] bg-white/[0.03]"
                      }`}
                  >
                    <SIcon
                      className={`w-4 h-4 transition-colors duration-200 ${
                        isActive
                          ? "text-[var(--accent-magenta)]"
                          : "text-white/40"
                      }`}
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold text-[var(--text-body)] leading-snug transition-colors duration-200 ${
                          isActive ? "text-white" : "text-white/70"
                        }`}
                      >
                        {s.title}
                      </span>
                    </div>
                    <span
                      className={`text-[var(--text-small)] transition-colors duration-200 ${
                        isActive ? "text-white/50" : "text-white/30"
                      }`}
                    >
                      {s.tag}
                    </span>
                  </div>

                  {/* Active chevron */}
                  <svg
                    className={`w-4 h-4 shrink-0 transition-all duration-200 ${
                      isActive
                        ? "text-[var(--accent-magenta)] opacity-100"
                        : "text-white/20 opacity-0 group-hover:opacity-100"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              );
            })}
          </div>

          {/* ── RIGHT: Detail panel ── */}
          <div className="w-full lg:w-[58%] lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
              {/* Service image */}
              <div className="relative h-[220px] md:h-[280px] overflow-hidden">
                <img
                  key={selected}
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover animate-fade-in"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)] via-transparent to-transparent" />
                {/* Tag badge */}
                <div className="absolute top-4 left-4">
                  <span className="section-label text-[var(--text-caption)] px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                    {service.tag}
                  </span>
                </div>
                {/* Service number */}
                <div className="absolute top-4 right-4">
                  <span className="font-mono text-[var(--text-caption)] text-white/30">
                    {String(selected + 1).padStart(2, "0")} /{" "}
                    {String(services.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-7 md:p-8">
                {/* Icon + Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg border border-[var(--accent-magenta)]/30 bg-[var(--accent-magenta)]/10">
                    <Icon className="w-5 h-5 text-[var(--accent-magenta)]" />
                  </div>
                  <h3 className="gradient-text font-bold text-[var(--text-h4)] md:text-[var(--text-h3)] leading-[var(--lh-subhead)] tracking-[var(--ls-heading)]">
                    {service.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-white/60 text-[var(--text-body)] leading-[var(--lh-body)] tracking-[var(--ls-body)] mb-6">
                  {service.description}
                </p>

                {/* Divider */}
                <div className="section-divider mb-6" />

                {/* Features */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {service.features.map((feature, fi) => (
                    <li
                      key={fi}
                      className="flex items-start gap-2.5 text-[var(--text-body)] text-white/60 leading-snug"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent-magenta)] mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#050505] px-6 py-8 text-center"
            >
              <div className="gradient-text font-bold text-[var(--text-h2)] leading-none mb-2">
                {stat.value}
              </div>
              <div className="text-white/40 text-[var(--text-small)] tracking-[var(--ls-wide)] uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="mt-12 text-center">
          <GradientButton
            size="md"
            variant="outline"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Discuss Your Project With Us
          </GradientButton>
        </div>
      </div>
    </section>
  );
}
