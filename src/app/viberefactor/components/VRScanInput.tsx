"use client";
import React, { useState } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import type { ScanReport } from "@/app/lib/scanner/types";
import VRScanResults from "./VRScanResults";

const SCAN_STEPS = [
  "Connecting to repository...",
  "Reading file structure...",
  "Analyzing dependencies...",
  "Checking code quality...",
  "Computing health score...",
  "Reading source files...",
  "Generating AI code review...",
];

export default function VRScanInput() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "scanning" | "done" | "error">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");
  const [report, setReport] = useState<ScanReport | null>(null);

  const isValidUrl = (u: string) => /^https?:\/\/github\.com\/[^/]+\/[^/]+/.test(u.trim());

  async function handleScan() {
    const trimmed = url.trim();
    if (!isValidUrl(trimmed)) {
      setError("Please enter a valid GitHub URL (e.g., https://github.com/owner/repo)");
      setStatus("error");
      return;
    }

    setStatus("scanning");
    setError("");
    setCurrentStep(0);

    // Animate through steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, SCAN_STEPS.length - 1));
    }, 1200);

    try {
      const res = await fetch("/api/viberefactor/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: trimmed }),
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        setStatus("error");
        return;
      }

      const data: ScanReport = await res.json();
      setReport(data);
      setStatus("done");
    } catch {
      clearInterval(stepInterval);
      setError("Failed to connect. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="w-full max-w-[700px] mx-auto">
      {/* Input */}
      <div className="relative flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && status !== "scanning") handleScan();
            }}
            placeholder="https://github.com/your-username/your-repo"
            className="w-full px-5 py-4 pr-12 rounded-xl border border-white/[0.1] bg-white/[0.04] backdrop-blur-sm text-white placeholder:text-white/25 text-[var(--text-body)] focus:outline-none focus:border-[var(--accent-primary)]/40 focus:ring-1 focus:ring-[var(--accent-primary)]/20 transition-all"
            disabled={status === "scanning"}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
        </div>
        <button
          onClick={handleScan}
          disabled={status === "scanning" || !url.trim()}
          className="shrink-0 px-6 py-4 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-purple)] text-white font-semibold text-[var(--text-body)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {status === "scanning" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Scan"
          )}
        </button>
      </div>

      {/* Error */}
      {status === "error" && (
        <div className="mt-4 flex items-center gap-2 text-red-400 text-[var(--text-small)]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Scanning progress */}
      {status === "scanning" && (
        <div className="mt-8 space-y-3">
          {SCAN_STEPS.map((step, i) => (
            <div
              key={step}
              className={`flex items-center gap-3 transition-all duration-500 ${
                i <= currentStep ? "opacity-100" : "opacity-20"
              }`}
            >
              {i < currentStep ? (
                <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-[0.7rem]">✓</span>
              ) : i === currentStep ? (
                <Loader2 className="w-5 h-5 text-[var(--accent-primary)] animate-spin" />
              ) : (
                <span className="w-5 h-5 rounded-full border border-white/10" />
              )}
              <span className="text-white/50 text-[var(--text-small)]">{step}</span>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {status === "done" && report && <VRScanResults report={report} />}
    </div>
  );
}
