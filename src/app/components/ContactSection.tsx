"use client";
import React, { useState } from "react";
import { User, Building2, Phone, Mail, MessageSquare, CheckCircle, Sparkles, type LucideIcon } from "lucide-react";
import GradientButton from "./GradientButton";

interface FieldConfig {
  name: string;
  label: string;
  type: string;
  icon: LucideIcon;
  required?: boolean;
  options?: string[];
}

const fields: FieldConfig[] = [
  { name: "name", label: "Your Name", type: "text", icon: User, required: true },
  { name: "email", label: "Email Address", type: "email", icon: Mail, required: true },
  { name: "company", label: "Company Name", type: "text", icon: Building2 },
  { name: "contact", label: "Contact Number", type: "tel", icon: Phone, required: true },
  {
    name: "intent",
    label: "What are you looking for?",
    type: "select",
    icon: Sparkles,
    required: true,
    options: ["Automate my leads/inbox", "Website or brand work", "Something else"],
  },
  { name: "message", label: "Tell us about your project", type: "textarea", icon: MessageSquare },
];

function FloatingInput({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;
  const Icon = field.icon;
  const isTextarea = field.type === "textarea";
  const isSelect = field.type === "select";

  const sharedClasses = `peer w-full pl-12 pr-5 pt-5 pb-2 rounded-xl
    bg-white/[0.03] border border-white/[0.08]
    text-white text-sm outline-none
    transition-all duration-300
    focus:border-[var(--accent-magenta)]/40
    focus:bg-white/[0.05]`;

  return (
    <div className="relative group">
      <div className={`absolute left-4 pointer-events-none z-10 ${isTextarea ? "top-4" : "top-1/2 -translate-y-1/2"}`}>
        <Icon
          className={`w-4 h-4 transition-colors duration-300 ${
            isActive ? "text-[var(--accent-magenta)]" : "text-white/20"
          }`}
        />
      </div>

      {isTextarea ? (
        <textarea
          name={field.name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={field.required}
          placeholder=" "
          rows={4}
          className={`${sharedClasses} resize-none`}
        />
      ) : isSelect ? (
        <select
          name={field.name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={field.required}
          className={`${sharedClasses} appearance-none cursor-pointer`}
        >
          <option value="" disabled hidden />
          {field.options?.map((opt) => (
            <option key={opt} value={opt} className="bg-[var(--bg-surface)] text-white">
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type}
          name={field.name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={field.required}
          placeholder=" "
          className={sharedClasses}
        />
      )}

      <label
        className={`absolute left-12 pointer-events-none transition-all duration-300
          ${
            isActive
              ? "top-1.5 text-[10px] text-[var(--accent-magenta)]/70"
              : isTextarea
                ? "top-4 text-sm text-white/25"
                : "top-1/2 -translate-y-1/2 text-sm text-white/25"
          }`}
      >
        {field.label}
      </label>
    </div>
  );
}

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    contact: "",
    intent: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", company: "", contact: "", intent: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <section
      id="contact"
      className="relative px-6 md:px-12 lg:px-16 py-24 md:py-32 scroll-mt-20"
    >
      {/* Subtle gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 100%, rgba(97, 54, 217, 0.40) 0%, rgba(97, 54, 217, 0) 100%)",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left side */}
        <div>
          <p className="section-label mb-4">
            Get In Touch
          </p>
          <h2 className="text-[var(--text-h3)] md:text-[var(--text-h2)] font-bold text-white leading-[var(--lh-heading)] tracking-[var(--ls-heading)]">
            Let&apos;s Talk About Your Next Build
          </h2>
          <p className="mt-5 text-[var(--text-body)] md:text-[var(--text-body-lg)] text-white/45 leading-[var(--lh-body)] tracking-[var(--ls-body)] max-w-md">
            Tell us about your project. We&apos;ll respond within 24 hours with a free assessment of how AI can help.
          </p>
          <div className="mt-8 space-y-3">
            {[
              "Free 30-minute strategy call",
              "No upfront commitment",
              "Response within 24 hours",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[var(--accent-magenta)]/70 shrink-0" />
                <span className="text-[var(--text-body)] text-white/50 tracking-[var(--ls-body)]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side — Form */}
        <div>
          <div className="glass-card p-8 md:p-10 !rounded-2xl">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle className="w-12 h-12 text-[var(--accent-magenta)] mb-4" />
                <h3 className="text-[var(--text-h4)] font-bold text-white mb-2 leading-[var(--lh-subhead)]">Thank you!</h3>
                <p className="text-white/45 text-[var(--text-body)] max-w-xs leading-[var(--lh-body)]">
                  We&apos;ll reach out within 24 hours. Looking forward to learning about your project.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-sm text-white/40 hover:text-white transition-colors underline underline-offset-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {fields.map((field) => (
                  <React.Fragment key={field.name}>
                    <FloatingInput
                      field={field}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                    />
                    {field.name === "contact" && (
                      <p className="text-white/25 text-[var(--text-caption)] leading-[var(--lh-body)] tracking-[var(--ls-body)] -mt-2">
                        By providing your phone number, you agree to receive text messages from Keen & Ken Solutions
                        about your inquiry (a confirmation and up to two optional follow-ups). Msg & data rates may
                        apply. Reply STOP to opt out. See our{" "}
                        <a href="/privacy-policy" className="underline hover:text-white/50">
                          Privacy Policy
                        </a>{" "}
                        and{" "}
                        <a href="/terms-of-service" className="underline hover:text-white/50">
                          Terms of Service
                        </a>
                        .
                      </p>
                    )}
                  </React.Fragment>
                ))}

                {status === "error" && (
                  <p className="text-red-400 text-[var(--text-small)]">{errorMessage}</p>
                )}

                <div className="pt-2">
                  <GradientButton
                    type="submit"
                    size="lg"
                    variant="primary"
                    className={`w-full ${status === "submitting" ? "opacity-70 pointer-events-none" : ""}`}
                  >
                    {status === "submitting" ? "Sending..." : "Request Free Consultation"}
                  </GradientButton>
                </div>

                <p className="text-center text-white/20 text-[var(--text-caption)] mt-3 tracking-[var(--ls-body)]">
                  We respect your privacy. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
