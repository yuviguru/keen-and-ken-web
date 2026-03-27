"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";

const platforms = ["Lovable", "Bolt", "Cursor", "Replit", "v0"];

export default function VibeRefactorBanner() {
  return (
    <Link href="/viberefactor" className="block relative z-20 -mt-12 group">
      <div className="w-full border-y border-white/[0.06] bg-white/[0.03] backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.06]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-center gap-3 md:gap-5 px-6 md:px-12 py-3.5 md:py-4">
          <div className="shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/25 flex items-center justify-center">
            <Wrench className="w-3 h-3 md:w-3.5 md:h-3.5 text-[var(--accent-primary)]" />
          </div>

          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 min-w-0">
            <span className="text-white font-semibold text-[0.8rem] md:text-[var(--text-small)] tracking-[var(--ls-body)]">
              Free AI App Health Scan
            </span>
            <span className="text-white/40 text-[0.8rem] md:text-[var(--text-small)] tracking-[var(--ls-body)] hidden sm:inline">
              — check your repo built with
            </span>
            <span className="text-white/40 text-[0.8rem] tracking-[var(--ls-body)] sm:hidden">
              for
            </span>
            {platforms.map((p, i) => (
              <span key={p} className="text-white/50 text-[0.75rem] font-medium">
                {p}{i < platforms.length - 1 ? "," : ""}
              </span>
            ))}
            <span className="hidden sm:inline text-white/30 text-[0.75rem]">&amp; more</span>
          </div>

          <span className="shrink-0 px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-[0.6rem] font-bold tracking-wider uppercase">
            New
          </span>

          <ArrowRight className="w-4 h-4 text-[var(--accent-primary)] shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
