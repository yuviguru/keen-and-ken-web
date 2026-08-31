"use client";
import React from "react";
import { Instagram, Youtube, Linkedin, Twitter } from "lucide-react";
import DiscordIcon from "./icons/DiscordIcon";

const navLinks = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#solutions" },
  { label: "Products", href: "#products" },
  { label: "Contact", href: "#contact" },
  { label: "VibeRefactor", href: "/viberefactor" },
];

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/company/keen-ken-solutions", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com/keenandken", label: "Instagram" },
  { icon: Twitter, href: "https://x.com/keenandken", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com/@keenandken", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[var(--bg-deep)] pt-16 pb-8 px-6 md:px-12 lg:px-16">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-12">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Keen & Ken" className="w-8 h-8" />
              <span className="text-white font-bold text-[var(--text-body)] tracking-[0.08em]">
                Keen & Ken
              </span>
            </div>
            <p className="text-white/30 text-[var(--text-small)] leading-[var(--lh-body)] text-center md:text-left max-w-[260px] tracking-[var(--ls-body)]">
              End-to-end AI systems, built to hand over. One team, full ownership, no dependency.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center">
            <h4 className="section-label text-white/30 mb-4">
              Quick Links
            </h4>
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-white/25 hover:text-white/60 transition-colors duration-300 text-[var(--text-small)] tracking-[var(--ls-body)]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="section-label text-white/30 mb-4">
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
                    className="w-9 h-9 rounded-full border border-white/[0.06] bg-transparent
                      flex items-center justify-center text-white/25
                      hover:text-white/60 hover:border-white/[0.15]
                      transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
              <a
                href="https://discord.gg/keenandken"
                aria-label="Discord"
                className="w-9 h-9 rounded-full border border-white/[0.06] bg-transparent
                  flex items-center justify-center text-white/25
                  hover:text-white/60 hover:border-white/[0.15]
                  transition-all duration-300"
              >
                <DiscordIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/[0.04] flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            <a
              href="/privacy-policy"
              className="text-white/20 hover:text-white/50 text-[var(--text-caption)] tracking-[var(--ls-body)] underline underline-offset-4"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="text-white/20 hover:text-white/50 text-[var(--text-caption)] tracking-[var(--ls-body)] underline underline-offset-4"
            >
              Terms of Service
            </a>
          </div>
          <p className="text-center text-white/15 text-[var(--text-caption)] tracking-[var(--ls-body)]">
            &copy; {new Date().getFullYear()} Keen & Ken. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
