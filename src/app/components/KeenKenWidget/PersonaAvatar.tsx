"use client";
// Shared visual for both personas. Per docs/keen-and-ken-widget-spec.md: "two
// simple avatars — small animated icons/orbs, one per persona. Not elaborate
// characters, not 3D." This is deliberately a small circle with an icon and a
// CSS-only animation, nothing more. KeenAvatar.tsx / KenAvatar.tsx wrap this with
// each persona's icon/color so the two personas stay visually distinct while the
// animation logic isn't duplicated.
import { type LucideIcon } from "lucide-react";

export type AvatarState = "idle" | "active" | "thinking" | "sending" | "receiving" | "dim";

interface PersonaAvatarProps {
  icon: LucideIcon;
  label: string;
  state: AvatarState;
  accent: "magenta" | "purple";
}

export default function PersonaAvatar({ icon: Icon, label, state, accent }: PersonaAvatarProps) {
  // Built entirely on Tailwind's default animate-* utilities (spin, ping, pulse) —
  // no custom keyframes added to the site's shared globals.css, since that file is
  // outside this track's owned paths.
  const color = accent === "magenta" ? "var(--accent-magenta)" : "var(--accent-purple)";
  const showRing = state === "active" || state === "sending" || state === "receiving";
  const opacity = state === "dim" ? "opacity-35" : "opacity-100";

  return (
    <div className={`flex flex-col items-center gap-1.5 transition-opacity duration-300 ${opacity}`}>
      <div className="relative w-12 h-12">
        {showRing && (
          <span
            className={`absolute inset-0 rounded-full ${state === "sending" ? "animate-ping" : "animate-pulse"}`}
            style={{ border: `1.5px solid ${color}` }}
            aria-hidden="true"
          />
        )}
        <div
          className="relative w-12 h-12 rounded-full flex items-center justify-center border"
          style={{
            background: `linear-gradient(135deg, ${color}22, ${color}0a)`,
            borderColor: `${color}55`,
            boxShadow: state === "active" || state === "thinking" ? `0 0 18px ${color}44` : undefined,
          }}
        >
          <Icon className={`w-5 h-5 ${state === "thinking" ? "animate-spin" : ""}`} style={{ color }} />
        </div>
      </div>
      <span className="text-[var(--text-caption)] text-white/45 font-medium tracking-[var(--ls-body)]">{label}</span>
    </div>
  );
}
