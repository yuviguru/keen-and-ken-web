"use client";
// The "convert" step: per docs/keen-and-ken-widget-spec.md, capture name + contact
// (phone/email) only — no fixed pricing anywhere, a time-range estimate belongs in
// the relay text above this form, never here. Reused for both the normal convert
// phase and the error phase's fallback lead capture, so a failed voice session
// still never drops a lead.
import { useState } from "react";
import { CheckCircle2, Mail, User } from "lucide-react";
import GradientButton from "../GradientButton";
import type { ContactInfo } from "./types";

interface ContactCaptureFormProps {
  onSubmit: (contact: ContactInfo) => Promise<void>;
  introText?: string;
}

export default function ContactCaptureForm({ onSubmit, introText }: ContactCaptureFormProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    setStatus("submitting");
    setErrorMessage("");
    try {
      await onSubmit({ name: name.trim(), contact: contact.trim() });
    } catch {
      setStatus("error");
      setErrorMessage(
        "Couldn't reach our system just now. You can also use the contact form at the bottom of this page — we'll get it either way."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
      {introText && (
        <p className="text-[var(--text-small)] text-white/50 leading-[var(--lh-body)] mb-1">{introText}</p>
      )}

      <div className="relative">
        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" aria-hidden="true" />
        <label htmlFor="kk-name" className="sr-only">
          Your name
        </label>
        <input
          id="kk-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm outline-none transition-all duration-300 focus:border-[var(--accent-magenta)]/40 focus:bg-white/[0.05] placeholder:text-white/25"
        />
      </div>

      <div className="relative">
        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" aria-hidden="true" />
        <label htmlFor="kk-contact" className="sr-only">
          Phone or email
        </label>
        <input
          id="kk-contact"
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Phone or email"
          required
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm outline-none transition-all duration-300 focus:border-[var(--accent-magenta)]/40 focus:bg-white/[0.05] placeholder:text-white/25"
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-red-400 text-[var(--text-small)] leading-[var(--lh-body)]">
          {errorMessage}
        </p>
      )}

      <GradientButton
        type="submit"
        size="md"
        variant="primary"
        className={`w-full mt-1 ${status === "submitting" ? "opacity-70 pointer-events-none" : ""}`}
      >
        {status === "submitting" ? (
          "Sending…"
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4" /> Have the team reach out
          </>
        )}
      </GradientButton>
    </form>
  );
}
