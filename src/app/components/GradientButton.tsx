"use client";
import { type ReactNode } from "react";

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "filled" | "outline" | "primary";
}

const sizeClasses = {
  sm: "px-5 py-2.5 text-[var(--text-small)]",
  md: "px-7 py-3 text-[var(--text-body)]",
  lg: "px-9 py-4 text-[var(--text-body)]",
};

export default function GradientButton({
  children,
  onClick,
  type = "button",
  className = "",
  size = "md",
  variant = "outline",
}: GradientButtonProps) {
  const base =
    "relative rounded-full font-semibold cursor-pointer transition-all duration-300 ease-out tracking-[0.01em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lavender)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-deep)]";

  const variants = {
    outline: `border border-white/20 bg-transparent text-white
      hover:border-[var(--accent-magenta)]/60 hover:shadow-[0_0_24px_rgba(124,90,237,0.2)]
      active:scale-[0.97]`,
    filled: `border border-[var(--accent-magenta)]/40 text-white
      bg-gradient-to-r from-[var(--accent-magenta)] to-[var(--accent-purple)]
      hover:shadow-[0_0_30px_rgba(124,90,237,0.4)]
      active:scale-[0.97]`,
    primary: `!bg-white !text-black border border-white/90
      hover:!bg-[var(--accent-purple)] hover:!text-white hover:border-[var(--accent-purple)] hover:shadow-[0_0_30px_rgba(122,62,219,0.4)]
      active:scale-[0.97]`,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizeClasses[size]} ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
