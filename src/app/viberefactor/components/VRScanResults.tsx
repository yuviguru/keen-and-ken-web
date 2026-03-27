"use client";
import React from "react";
import { ArrowRight, Clock, FileCode, Cpu } from "lucide-react";
import type { ScanReport } from "@/app/lib/scanner/types";
import VRScoreRing from "./VRScoreRing";
import VRScoreCard from "./VRScoreCard";
import VRAIAnalysis from "./VRAIAnalysis";
import GradientButton from "../../components/GradientButton";

interface VRScanResultsProps {
  report: ScanReport;
}

export default function VRScanResults({ report }: VRScanResultsProps) {
  const { score, techStack, recommendations, aiAnalysis, meta } = report;

  return (
    <div className="w-full max-w-[1100px] mx-auto mt-12 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-white font-bold text-[var(--text-h3)] leading-[var(--lh-heading)]">
          Health Report
        </h2>
        <div className="flex items-center justify-center gap-4 mt-2 text-white/30 text-[var(--text-small)]">
          <span className="flex items-center gap-1">
            <FileCode className="w-3.5 h-3.5" />
            {meta.filesAnalyzed} files analyzed
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {(meta.scanDurationMs / 1000).toFixed(1)}s
          </span>
        </div>
      </div>

      {/* Overall score + tech stack */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
        <VRScoreRing score={score.overall} size={180} />

        {/* Tech stack summary */}
        <div className="flex-1 glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-white font-semibold text-[var(--text-small)]">Tech Stack Detected</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(techStack).map(([key, value]) => {
              if (!value) return null;
              return (
                <span
                  key={key}
                  className="px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/50 text-[0.75rem]"
                >
                  {value}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category scores grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {Object.entries(score.categories).map(([key, result]) => (
          <VRScoreCard key={key} categoryKey={key} result={result} />
        ))}
      </div>

      {/* Top recommendations */}
      {recommendations.length > 0 && (
        <div className="glass-card p-6 mb-10">
          <h3 className="text-white font-semibold text-[var(--text-body)] mb-4">
            Top Recommendations
          </h3>
          <div className="space-y-3">
            {recommendations.slice(0, 6).map((rec, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className={`shrink-0 mt-1 px-2 py-0.5 rounded text-[0.6rem] font-bold uppercase tracking-wider ${
                    rec.priority === "high"
                      ? "bg-red-500/20 text-red-400"
                      : rec.priority === "medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {rec.priority}
                </span>
                <span className="text-white/50 text-[var(--text-small)] leading-relaxed">
                  {rec.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Analysis */}
      {aiAnalysis && <VRAIAnalysis content={aiAnalysis} />}

      {/* CTA */}
      <div className="text-center">
        <p className="text-white/35 text-[var(--text-small)] mb-4">
          Want expert help fixing these issues?
        </p>
        <GradientButton
          size="lg"
          variant="filled"
          onClick={() => document.getElementById("vr-intake")?.scrollIntoView({ behavior: "smooth" })}
        >
          Submit a Rescue Request <ArrowRight className="w-4 h-4" />
        </GradientButton>
      </div>
    </div>
  );
}
