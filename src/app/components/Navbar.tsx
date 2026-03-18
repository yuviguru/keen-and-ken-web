"use client";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import GradientButton from "./GradientButton";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
  { label: "Products", href: "#products" },
  { label: "Contact", href: "#contact" },
];

function scrollToSection(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  } else if (href === "#") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-6 md:px-[90px] h-16 md:h-18">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="flex items-center gap-3 shrink-0"
        >
          <img src="/logo.svg" alt="Keen & Ken" className="w-8 h-8 md:w-10 md:h-10" />
          <span className="text-white font-bold text-sm md:text-base tracking-widest">
            KEEN & KEN
          </span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
              className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors duration-300 relative
                after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:rounded-full
                after:bg-[var(--accent-magenta)] after:transition-all after:duration-300
                hover:after:w-full"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <GradientButton
            size="sm"
            onClick={() => scrollToSection("#contact")}
          >
            Book a Call
          </GradientButton>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center text-white"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 top-16 z-40 transition-all duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-xl" />
        <div className="relative flex flex-col items-center justify-center gap-8 pt-16">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                setMobileOpen(false);
                setTimeout(() => scrollToSection(item.href), 300);
              }}
              className="text-xl text-[var(--text-secondary)] hover:text-white transition-colors duration-300"
            >
              {item.label}
            </a>
          ))}
          <GradientButton
            size="md"
            onClick={() => {
              setMobileOpen(false);
              setTimeout(() => scrollToSection("#contact"), 300);
            }}
          >
            Book a Call
          </GradientButton>
        </div>
      </div>
    </header>
  );
}
