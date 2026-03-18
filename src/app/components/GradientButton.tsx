"use client";
import { type ReactNode } from "react";

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function GradientButton({
  children,
  onClick,
  type = "button",
  className = "",
  size = "md",
}: GradientButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`group relative rounded-full border border-[#C50ABD]/60 overflow-hidden
        bg-gradient-to-r from-[#C50ABD] to-[#7A3EDB] text-white
        font-semibold cursor-pointer
        shadow-[0_0_20px_rgba(197,10,189,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
        transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
        hover:shadow-[0_0_35px_rgba(197,10,189,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]
        hover:scale-[1.03] hover:border-[#C50ABD]/80
        active:scale-[0.97] active:shadow-[0_0_10px_rgba(197,10,189,0.2)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#937bd8]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]
        ${sizeClasses[size]} ${className}`}
    >
      {/* Shimmer overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 2s ease-in-out infinite",
        }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
