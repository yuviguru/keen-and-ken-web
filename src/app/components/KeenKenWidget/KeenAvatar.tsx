"use client";
import { Mic } from "lucide-react";
import PersonaAvatar, { type AvatarState } from "./PersonaAvatar";

export default function KeenAvatar({ state }: { state: AvatarState }) {
  return <PersonaAvatar icon={Mic} label="Keen" state={state} accent="magenta" />;
}
