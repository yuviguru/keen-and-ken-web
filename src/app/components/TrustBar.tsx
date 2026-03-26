"use client";
import React from "react";

const techStack = [
  { name: "OpenAI", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  )},
  { name: "Claude AI", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M4.709 15.955l4.72-2.756.08-.046 2.91-1.707c.136-.08.2-.186.2-.33 0-.142-.064-.25-.2-.33L9.51 8.875l-.08-.046-4.72-2.83c-.136-.08-.26-.08-.396 0-.136.08-.2.186-.2.33v11.296c0 .144.064.25.2.33.136.08.26.08.396 0zm6.89-4.498l5.5-3.22c.135-.08.2-.186.2-.33 0-.142-.065-.25-.2-.33l-5.5-3.148c-.137-.08-.262-.08-.398 0-.136.08-.2.186-.2.33v6.368c0 .144.064.25.2.33.136.08.26.08.397 0zm0 5.116l5.5-3.22c.135-.08.2-.186.2-.33 0-.142-.065-.25-.2-.33l-5.5-3.148c-.137-.08-.262-.08-.398 0-.136.08-.2.186-.2.33v6.368c0 .144.064.25.2.33.136.08.26.08.397 0z" />
    </svg>
  )},
  { name: "LangChain", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
    </svg>
  )},
  { name: "HuggingFace", icon: (<span className="text-base">🤗</span>) },
  { name: "Make", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )},
  { name: "n8n", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <rect x="3" y="8" width="6" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="15" y="8" width="6" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )},
  { name: "Firebase", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M3.89 15.672L6.255 1.618a.381.381 0 0 1 .723-.077l2.478 4.632L3.89 15.672zm16.794 3.692l-2.25-13.993a.381.381 0 0 0-.653-.174L3.316 19.364l7.856 4.428a1.146 1.146 0 0 0 1.12 0l8.392-4.428zM14.3 7.147l-1.745-3.347a.381.381 0 0 0-.673 0L3.89 15.672 14.3 7.147z" />
    </svg>
  )},
  { name: "AWS", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.374 6.18 6.18 0 0 1-.248-.467c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103a6.395 6.395 0 0 0-.862.271 2.294 2.294 0 0 1-.28.104.493.493 0 0 1-.127.023c-.112 0-.168-.08-.168-.247V5.55c0-.127.016-.223.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.44.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296z" />
    </svg>
  )},
  { name: "Supabase", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M13.7 21.13c-.42.55-1.3.22-1.3-.46V13.5H21c.82 0 1.27-.96.74-1.58L10.3 2.87c-.42-.55-1.3-.22-1.3.46V10.5H3c-.82 0-1.27.96-.74 1.58l10.44 9.05z" />
    </svg>
  )},
];

export default function TrustBar() {
  const items = [...techStack, ...techStack];

  return (
    <section className="relative py-12 md:py-16 border-t border-b border-white/[0.06] overflow-hidden">
      <p className="text-center section-label text-white/30 mb-8">
        Our Core Stack
      </p>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none bg-gradient-to-r from-[var(--bg-deep)] to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-[var(--bg-deep)] to-transparent" />

        <div className="flex animate-marquee w-max gap-12 md:gap-16 items-center">
          {items.map((tech, i) => (
            <div
              key={`${tech.name}-${i}`}
              className="flex-shrink-0 flex items-center gap-2.5 text-white/30 hover:text-white/55 transition-colors duration-300 cursor-default"
            >
              <span className="opacity-70">{tech.icon}</span>
              <span className="text-[0.875rem] font-semibold tracking-[0.03em] whitespace-nowrap">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
