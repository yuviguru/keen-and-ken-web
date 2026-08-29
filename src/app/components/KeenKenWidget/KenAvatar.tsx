"use client";
import { Brain } from "lucide-react";
import PersonaAvatar, { type AvatarState } from "./PersonaAvatar";

export default function KenAvatar({ state }: { state: AvatarState }) {
  return <PersonaAvatar icon={Brain} label="Ken" state={state} accent="purple" />;
}
