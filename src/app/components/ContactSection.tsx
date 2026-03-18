"use client";
import React, { useState } from "react";
import { User, Building2, Phone, Mail, CheckCircle, type LucideIcon } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import GradientButton from "./GradientButton";

interface FieldConfig {
  name: string;
  label: string;
  type: string;
  icon: LucideIcon;
  required?: boolean;
}

const fields: FieldConfig[] = [
  { name: "name", label: "Your Name", type: "text", icon: User, required: true },
  { name: "email", label: "Email Address", type: "email", icon: Mail, required: true },
  { name: "company", label: "Company Name", type: "text", icon: Building2 },
  { name: "contact", label: "Contact Number", type: "tel", icon: Phone, required: true },
];

function FloatingInput({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;
  const Icon = field.icon;

  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
        <Icon
          className={`w-4 h-4 transition-colors duration-300 ${
            isActive ? "text-[var(--accent-magenta)]" : "text-[var(--text-muted)]"
          }`}
        />
      </div>

      <input
        type={field.type}
        name={field.name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={field.required}
        placeholder=" "
        className="peer w-full pl-12 pr-5 pt-5 pb-2 rounded-xl
          bg-white/[0.03] border border-white/[0.1]
          text-[var(--text-primary)] text-sm
          outline-none
          transition-all duration-300
          focus:border-[var(--accent-magenta)]/40
          focus:bg-white/[0.05]
          focus:shadow-[0_0_20px_rgba(197,10,189,0.08)]"
      />

      <label
        className={`absolute left-12 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
          ${
            isActive
              ? "top-1.5 text-[10px] text-[var(--accent-lavender)]"
              : "top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]"
          }`}
      >
        {field.label}
      </label>

      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
          ${focused ? "w-full opacity-100" : "w-0 opacity-0"}`}
        style={{
          background: "linear-gradient(90deg, transparent, var(--accent-magenta), var(--accent-purple), transparent)",
        }}
      />
    </div>
  );
}

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    contact: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setFormData({ name: "", email: "", company: "", contact: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <section
      id="contact"
      className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center px-6 md:px-[90px] py-20 noise-overlay scroll-mt-20"
      style={{
        background:
          "linear-gradient(135deg, rgba(197, 10, 189, 0.2) 0%, rgba(122, 62, 219, 0.12) 40%, rgba(10, 10, 10, 0.95) 100%)",
      }}
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left side */}
        <ScrollReveal direction="left">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <img src="/logo.svg" alt="Keen & Ken" className="w-14 h-14" />
              <span className="text-white font-bold text-lg tracking-widest">
                KEEN&KEN
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Ready to Transform Your Business with AI?
            </h2>
            <p className="mt-4 text-base md:text-lg text-gray-400 leading-relaxed max-w-md">
              Tell us about your project. We&apos;ll respond within 24 hours with a free assessment of how AI can help.
            </p>
            <div className="mt-6 space-y-3">
              {[
                "Free 30-minute strategy call",
                "No upfront commitment",
                "Response within 24 hours",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-[var(--accent-magenta)] shrink-0" />
                  <span className="text-sm text-gray-300">{item}</span>
                </div>
              ))}
            </div>
            <div className="accent-line w-24 mt-8 rounded-full" />
          </div>
        </ScrollReveal>

        {/* Right side - Glass card form */}
        <ScrollReveal direction="right" delay={0.2}>
          <div className="glass-card p-8 md:p-10 !rounded-2xl">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle className="w-14 h-14 text-[var(--accent-magenta)] mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Thank you!</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  We&apos;ll reach out within 24 hours. Looking forward to learning about your project.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-sm text-[var(--accent-lavender)] hover:text-white transition-colors underline underline-offset-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {fields.map((field) => (
                  <FloatingInput
                    key={field.name}
                    field={field}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleChange}
                  />
                ))}

                {status === "error" && (
                  <p className="text-red-400 text-sm">{errorMessage}</p>
                )}

                <div className="pt-2">
                  <GradientButton
                    type="submit"
                    size="lg"
                    className={`w-full ${status === "submitting" ? "opacity-70 pointer-events-none" : ""}`}
                  >
                    {status === "submitting" ? "Sending..." : "Request Free Consultation"}
                  </GradientButton>
                </div>

                <p className="text-center text-[var(--text-muted)] text-xs mt-3">
                  We respect your privacy. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
