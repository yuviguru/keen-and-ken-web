"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Do I need to know how to code?",
    answer: "No. Most of our clients built their apps entirely with AI tools. Just describe the problem in your own words and share access to your project.",
  },
  {
    question: "How do you handle code access?",
    answer: "We request only the access needed for the specific issue. For GitHub repos, we work via pull requests so you see and approve every change. Access is scoped and temporary.",
  },
  {
    question: "What if the problem is bigger than I thought?",
    answer: "We tell you upfront after diagnosis. If the issue requires a different tier than what you selected, we'll explain what's involved and get your approval before proceeding.",
  },
  {
    question: "Can you build new features too?",
    answer: "Yes — through our fractional architect engagement or as a separate project. We offer full-stack development, AI integration, and technical consulting across all our services at Keen & Ken Solutions.",
  },
  {
    question: "What's your stack expertise?",
    answer: "React, Next.js, Vue, TypeScript, Node.js, NestJS, Firebase, Supabase, PostgreSQL, GraphQL, and most modern web frameworks. If your AI tool generated it, we can work with it.",
  },
  {
    question: "What if you can't fix it?",
    answer: "You don't pay. If we diagnose that a fix isn't possible without a full rebuild, we'll tell you honestly and provide a recommendation on the best path forward — no charge for the diagnosis.",
  },
];

export default function VRFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="vr-faq" className="relative px-6 md:px-12 lg:px-16 py-24 md:py-32 scroll-mt-20">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-4">FAQ</p>
          <h2 className="text-[var(--text-h3)] md:text-[var(--text-h2)] font-bold text-white leading-[var(--lh-heading)] tracking-[var(--ls-heading)]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="glass-card overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                >
                  <span className="text-white font-semibold text-[var(--text-body)] md:text-[var(--text-body-lg)] leading-[var(--lh-subhead)] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-white/30 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isOpen ? "200px" : "0px" }}
                >
                  <p className="px-6 pb-6 text-white/40 text-[var(--text-body)] leading-[var(--lh-body)] tracking-[var(--ls-body)]">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
