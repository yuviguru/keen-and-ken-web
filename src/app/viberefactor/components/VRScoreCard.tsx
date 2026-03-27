"use client";
import React from "react";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import type { CategoryResult } from "@/app/lib/scanner/types";

interface VRScoreCardProps {
  categoryKey: string;
  result: CategoryResult;
}

const CATEGORY_ICONS: Record<string, string> = {
  projectType: "🔧",
  dependencies: "📦",
  structure: "🏗️",
  codeQuality: "✨",
  environment: "⚙️",
  security: "🔒",
  database: "🗄️",
  deadCode: "🧹",
};

function getBarColor(score: number): string {
  if (score >= 75) return "bg-green-500";
  if (score >= 50) return "bg-yellow-500";
  if (score >= 30) return "bg-orange-500";
  return "bg-red-500";
}

export default function VRScoreCard({ categoryKey, result }: VRScoreCardProps) {
  const icon = CATEGORY_ICONS[categoryKey] || "📋";
  const barColor = getBarColor(result.score);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-white font-semibold text-[var(--text-small)]">{result.label}</span>
        </div>
        <span className="text-white/60 font-bold text-[var(--text-small)]">{result.score}</span>
      </div>

      {/* Score bar */}
      <div className="w-full h-1.5 rounded-full bg-white/[0.06] mb-3">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${result.score}%`, transition: "width 1s ease-out" }}
        />
      </div>

      {/* Top findings */}
      <div className="space-y-1.5">
        {result.findings.slice(0, 3).map((f, i) => (
          <div key={i} className="flex items-start gap-1.5">
            {f.severity === "pass" && <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />}
            {f.severity === "warn" && <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 mt-0.5 shrink-0" />}
            {f.severity === "fail" && <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />}
            <span className="text-white/40 text-[0.75rem] leading-tight">{f.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
