"use client";
import React from "react";
import HeroCanvas from "./HeroCanvas";
import Image from "next/image";
import LightStreaks from "./LightStreaks";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-[450px] h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background Canvas */}
      <HeroCanvas />
      {/* <LightStreaks /> */}

      {/* <div className="absolute inset-0 max-sm:block hidden backdrop-blur-xs bg-black/10 z-1"></div> */}

      {/* Logo & Branding */}
      <div className="absolute top-0 left-0 z-10 p-6 md:pl-[90px] max-w-full flex justify-between mb-6 items-center gap-4">
        <img
          src="/logo.svg"
          alt="Keen & Ken Logo"
          className="w-[50px] h-[50px] sm:w-[50px] sm:h-[50px] md:w-[70px] md:h-[70px] lg:w-[80px] lg:h-[80px]"
        />
        <h1 className="text-md md:text-lg font-bold tracking-wide">
          KEEN & KEN
        </h1>
      </div>

      {/* Foreground content */}
      <div className="absolute bottom-0 left-0 z-10 p-6 md:pl-[90px] max-w-full lg:max-w-[50%] md:max-w-[65%] flex flex-col justify-between">
        {/* Main Heading */}
        <div>
          <h1
            className="text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] xl:text-[56px] font-bold leading-[1.2] tracking-wide text-white 
  drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]"
          >
            "Think AI, Scale Your Business."
          </h1>

          <p className="mt-3 text-md md:text-lg xl:text-xl text-gray-200 tracking-wide leading-relaxed">
            Smarter decisions, faster outcomes, limitless possibilities.
          </p>

          <p className="mt-3 text-sm md:text-base xl:text-md text-gray-300 max-w-lg leading-[1.6]">
            Empower your vision with AI-driven efficiency.
            <br />
            Streamline workflows, cut complexity, and drive growth.
            <br />
            Designed for innovators, built for success.
          </p>

          {/* CTA Button */}
          <div className="mt-8 relative">
            <div className="glowingborder">
              <button
                className="relative px-6 py-3 rounded-full border border-[#C50ABD] 
  bg-gradient-to-r from-[#C50ABD] to-[#7A3EDB] text-white
  shadow-[0_0_15px_rgba(197,10,189,0.4), inset_0px_-7px_11px_0px_rgba(197,10,189,0.15)]
  text-sm font-semibold transition-all duration-300 ease-out
  hover:scale-105 hover:shadow-[0_0_25px_rgba(197,10,189,0.6)]
  active:scale-95 active:shadow-[0_0_8px_rgba(197,10,189,0.25)]"
              >
                <span className="relative z-10">
                  Experience AI Without Limits
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right-Side Robot Image */}
      <div className="hidden sm:block absolute bottom-0 right-0 w-[40vw] h-[100vh] max-w-[750px] max-h-[750px] min-w-[400px] min-h-[300px] overflow-visible">
        <motion.img
          src="/female-humanoid.png"
          alt="AI-Powered Robots"
          initial={{ 
            x: "100%",
            opacity: 0,
            scale: 1.2
          }}
          animate={{ 
            x: 0,
            opacity: 1,
            scale: 1
          }}
          transition={{
            duration: 2,
            ease: [0.16, 1, 0.3, 1], // Custom easing for a smooth entrance with slight overshoot
            opacity: { duration: 1.2 },
            scale: { duration: 2.2 }
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "bottom",
            willChange: "transform"
          }}
        />
      </div>
      {/* <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
    opacity-0 animate-lightSweep pointer-events-none"
      ></div> */}
    </section>
  );
}
