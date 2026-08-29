"use client";
// Renders the two avatars plus a status caption for every non-form phase of the
// conversation. This is the component responsible for "something real is
// happening" per docs/keen-and-ken-widget-spec.md — deliberately just an avatar
// state change and a line of text, not a game or a rich transcript.
import { ArrowRight, MicOff } from "lucide-react";
import KeenAvatar from "./KeenAvatar";
import KenAvatar from "./KenAvatar";
import type { AvatarState } from "./PersonaAvatar";
import type { WidgetPhase } from "./types";

interface ConversationStageProps {
  phase: WidgetPhase;
  liveCaption: string | null;
  relayText: string | null;
  onStopAndConsult: () => void;
}

const CAPTIONS: Partial<Record<WidgetPhase, string>> = {
  permission: "Asking for microphone access…",
  connecting: "Connecting to Keen…",
  listening: "Listening — go ahead, tell Keen what's going on.",
  speaking: "Keen is responding…",
  consulting: "Keen is sending this over to Ken…",
  thinking: "Ken is thinking this through…",
};

function statesFor(phase: WidgetPhase): { keen: AvatarState; ken: AvatarState } {
  switch (phase) {
    case "permission":
    case "connecting":
      return { keen: "idle", ken: "dim" };
    case "listening":
      return { keen: "active", ken: "dim" };
    case "speaking":
      return { keen: "active", ken: "dim" };
    case "consulting":
      return { keen: "sending", ken: "receiving" };
    case "thinking":
      return { keen: "dim", ken: "thinking" };
    case "relaying":
      return { keen: "active", ken: "dim" };
    default:
      return { keen: "idle", ken: "idle" };
  }
}

export default function ConversationStage({ phase, liveCaption, relayText, onStopAndConsult }: ConversationStageProps) {
  const { keen, ken } = statesFor(phase);
  const showStopButton = phase === "listening" || phase === "speaking";
  const showHandoffArrow = phase === "consulting";

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div className="flex items-center gap-6">
        <KeenAvatar state={keen} />
        {showHandoffArrow && (
          <ArrowRight className="w-4 h-4 text-white/30 animate-pulse" aria-hidden="true" />
        )}
        <KenAvatar state={ken} />
      </div>

      <p
        className="text-center text-[var(--text-body)] text-white/70 leading-[var(--lh-body)] min-h-[3.2em] px-2"
        aria-live="polite"
      >
        {phase === "relaying"
          ? relayText
          : phase === "listening" || phase === "speaking"
            ? liveCaption || CAPTIONS[phase]
            : CAPTIONS[phase]}
      </p>

      {phase === "thinking" && (
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-purple)] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-purple)] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-purple)] animate-bounce" />
        </div>
      )}

      {showStopButton && (
        <button
          type="button"
          onClick={onStopAndConsult}
          className="flex items-center gap-1.5 text-[var(--text-small)] text-white/45 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lavender)]/50 rounded-full px-3 py-1"
        >
          <MicOff className="w-3.5 h-3.5" />
          I&apos;m done, what do you think?
        </button>
      )}
    </div>
  );
}
