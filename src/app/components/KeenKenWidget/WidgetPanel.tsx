"use client";
// The expanded widget panel: header + phase-driven body. Bottom-sheet on mobile,
// small floating card on desktop, matching the site's glass-card / aurora-purple
// language (GradientButton, glass-card, --accent-* custom properties) rather than
// introducing a new visual system.
import { useEffect, useRef } from "react";
import { CheckCircle2, Mic, X } from "lucide-react";
import GradientButton from "../GradientButton";
import ConversationStage from "./ConversationStage";
import ContactCaptureForm from "./ContactCaptureForm";
import type { useKeenKenSession } from "./useKeenKenSession";

interface WidgetPanelProps {
  session: ReturnType<typeof useKeenKenSession>;
  onClose: () => void;
}

export default function WidgetPanel({ session, onClose }: WidgetPanelProps) {
  const { phase, errorMessage, relayText, liveCaption, start, stopAndConsult, submitContact, reset } = session;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    panelRef.current?.querySelector<HTMLElement>("button, input")?.focus();
  }, [phase]);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Talk to Keen & Ken"
      className="fixed z-50 bottom-0 right-0 left-0 md:left-auto md:bottom-24 md:right-6 w-full md:w-[360px] rounded-t-2xl md:rounded-2xl border border-white/[0.08] bg-[var(--bg-surface)]/95 backdrop-blur-md shadow-[var(--shadow-card)] flex flex-col max-h-[85vh] md:max-h-[560px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div>
          <p className="section-label !text-[10px]">Talk it through</p>
          <p className="text-white font-semibold text-[var(--text-body)] leading-tight">Keen &amp; Ken</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lavender)]/50"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="px-5 py-6 overflow-y-auto flex-1 flex flex-col items-center justify-center gap-4">
        {phase === "idle" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-white/60 text-[var(--text-body)] leading-[var(--lh-body)] max-w-[260px]">
              Tell Keen what&apos;s going on in your business. A couple of quick questions, then a real
              recommendation.
            </p>
            <GradientButton size="md" variant="primary" onClick={start}>
              <Mic className="w-4 h-4" /> Talk to Keen
            </GradientButton>
            <p className="text-[var(--text-caption)] text-white/25">Uses your microphone. Ends automatically after a few exchanges.</p>
          </div>
        )}

        {(phase === "permission" ||
          phase === "connecting" ||
          phase === "listening" ||
          phase === "speaking" ||
          phase === "consulting" ||
          phase === "thinking" ||
          phase === "relaying") && (
          <ConversationStage
            phase={phase}
            liveCaption={liveCaption}
            relayText={relayText}
            onStopAndConsult={stopAndConsult}
          />
        )}

        {phase === "convert" && (
          <div className="w-full flex flex-col gap-3">
            <p className="text-[var(--text-caption)] text-white/30 text-center">
              No exact numbers here — just leave your info and our team follows up with specifics.
            </p>
            <ContactCaptureForm onSubmit={submitContact} />
          </div>
        )}

        {phase === "error" && (
          <div className="w-full flex flex-col gap-4">
            <p className="text-center text-white/60 text-[var(--text-body)] leading-[var(--lh-body)]">
              {errorMessage}
            </p>
            <ContactCaptureForm onSubmit={submitContact} />
          </div>
        )}

        {phase === "done" && (
          <div className="flex flex-col items-center gap-3 text-center py-4">
            <CheckCircle2 className="w-10 h-10 text-[var(--accent-magenta)]" />
            <p className="text-white font-semibold text-[var(--text-subhead)]">Thanks — that&apos;s in.</p>
            <p className="text-white/50 text-[var(--text-body)] max-w-[260px] leading-[var(--lh-body)]">
              Someone from our team will reach out with the specifics.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-2 text-[var(--text-small)] text-white/40 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
            >
              Start another conversation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
