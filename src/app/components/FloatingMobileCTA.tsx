"use client";
import React, { useState, useEffect } from "react";
import GradientButton from "./GradientButton";

export default function FloatingMobileCTA() {
  const [visible, setVisible] = useState(false);
  const [contactInView, setContactInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const contactEl = document.getElementById("contact");
    if (!contactEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => setContactInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(contactEl);
    return () => observer.disconnect();
  }, []);

  const show = visible && !contactInView;

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 p-4 transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      style={{
        background: "linear-gradient(to top, rgba(10,10,10,0.95), rgba(10,10,10,0.8))",
        backdropFilter: "blur(12px)",
      }}
    >
      <GradientButton
        size="md"
        className="w-full"
        onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
      >
        Book a Free Consultation
      </GradientButton>
    </div>
  );
}
