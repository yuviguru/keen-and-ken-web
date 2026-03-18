"use client";
import React from "react";
import { Instagram, Youtube, Linkedin, Twitter } from "lucide-react";
import DiscordIcon from "./icons/DiscordIcon";

const navLinks = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
  { label: "Products", href: "#products" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: Linkedin, href: "https://linkedin.com/company/keenandken", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com/keenandken", label: "Instagram" },
  { icon: Twitter, href: "https://x.com/keenandken", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com/@keenandken", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[var(--bg-deep)] pt-16 pb-8 px-6 md:px-[90px]">
      {/* Gradient top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(to right, transparent, rgba(197,10,189,0.3), rgba(147,123,216,0.2), rgba(197,10,189,0.3), transparent)",
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-12">
          {/* Logo column */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Keen & Ken" className="w-10 h-10" />
              <span className="text-white font-bold text-base tracking-widest">
                KEEN & KEN
              </span>
            </div>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed text-center md:text-left max-w-[260px]">
              Think AI, Scale Your Business. Smarter decisions, faster outcomes, limitless possibilities.
            </p>
          </div>

          {/* Links column */}
          <div className="flex flex-col items-center">
            <h4 className="text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-widest mb-4">
              Quick Links
            </h4>
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[var(--text-muted)] hover:text-[var(--accent-lavender)] transition-colors duration-300 text-sm"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Social column */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-widest mb-4">
              Connect
            </h4>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full border border-white/[0.08] bg-white/[0.03]
                      flex items-center justify-center
                      text-[var(--text-muted)] hover:text-white
                      hover:border-[var(--accent-magenta)]/30 hover:bg-[rgba(197,10,189,0.08)]
                      hover:shadow-[0_0_12px_rgba(197,10,189,0.2)]
                      transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
              <a
                href="https://discord.gg/keenandken"
                aria-label="Discord"
                className="w-9 h-9 rounded-full border border-white/[0.08] bg-white/[0.03]
                  flex items-center justify-center
                  text-[var(--text-muted)] hover:text-white
                  hover:border-[var(--accent-magenta)]/30 hover:bg-[rgba(197,10,189,0.08)]
                  hover:shadow-[0_0_12px_rgba(197,10,189,0.2)]
                  transition-all duration-300"
              >
                <DiscordIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-center text-[var(--text-muted)] text-xs">
            &copy; {new Date().getFullYear()} Keen & Ken. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
