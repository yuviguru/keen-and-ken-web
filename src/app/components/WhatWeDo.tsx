"use client";
import React, { useEffect, useState } from "react";
import throttle from "lodash/throttle";

function AICard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className="ai-cards-item"
      style={{
        width: "300px",
        height: "164px",
        padding: "20px",
        backgroundColor: "transparent",
        backgroundImage: "none",
        borderRight: "1px solid rgba(255, 255, 255, 0.2)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        backgroundClip: "padding-box, border-box",
      }}
    >
      <div
        className="svg"
        style={{ width: "40px", height: "40px", margin: "0 auto" }}
      >
        {/* SVG or Icon here */}
      </div>
      <h4 style={{ textAlign: "center", color: "#f3f0ff" }}>{title}</h4>
      <p style={{ textAlign: "center", color: "rgba(239, 237, 253, 0.6)" }}>
        {description}
      </p>
    </div>
  );
}

function AICards() {
  const cards = [
    { title: "AI-Powered Automation", description: "with human-level accuracy" },
    { title: "Vertical Agents", description: "AI solutions for industry-specific needs" },
    { title: "Ed Tech Solutions", description: "Simplify education management" },
    { title: "Research & Development", description: "Innovation through research and technology" },
    { title: "List key takeaways and action", description: "items from your meeting notes" }
  ];

  const containerWidth = 900; // Width of the container
  const cardWidth = 300; // Width of each card
  const cardsPerRow = Math.floor(containerWidth / cardWidth);
  const lastRowStartIndex = Math.floor(cards.length / cardsPerRow) * cardsPerRow;

  return (
    <div
      className="ai-cards-items"
      style={{
        width: `${containerWidth}px`,
        height: "auto",
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          className="ai-cards-item"
          style={{
            width: `${cardWidth}px`,
            height: "164px",
            padding: "20px",
            backgroundColor: "transparent",
            position: "relative",
            backgroundImage: "none",
            borderRight: (index + 1) % cardsPerRow === 0 || index === cards.length - 1 ? "none" : "1px solid transparent",
            borderBottom: index >= lastRowStartIndex ? "none" : "1px solid transparent",
            borderImage: "linear-gradient(to left, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.00) 100%) 1",
            borderImageSlice: 1,
          }}
        >
          <div
            className="svg"
            style={{ width: "40px", height: "40px", margin: "0 auto" }}
          >
            {/* SVG or Icon here */}
          </div>
          <h4 style={{ textAlign: "center", color: "#f3f0ff" }}>{card.title}</h4>
          <p style={{ textAlign: "center", color: "rgba(239, 237, 253, 0.6)" }}>
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function WhatWeDo() {
  const [bgOpacity, setBgOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const transitionPoint = windowHeight * 0.5;

      if (scrollPosition > transitionPoint) {
        const opacity = Math.min(
          (scrollPosition - transitionPoint) / (windowHeight * 0.5),
          1
        );
        setBgOpacity(opacity);
      } else {
        setBgOpacity(0);
      }
    }, 100); // Throttle the scroll event to fire every 100ms

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="h-screen flex items-center justify-center"
      style={{
        background: `radial-gradient(98.05% 261.61% at 1.95% 3.59%, rgba(97, 54, 217, ${
          bgOpacity * 0.4
        }) 0%, rgba(97, 54, 217, 0) 100%)`,
        transition: "background 0.5s ease",
        padding: "0 90px",
      }}
    >
      <div className="text-center">
        <h2 className="text-4xl font-bold text-[#937bd8]">What We Do</h2>
        <p className="mt-4 text-lg text-gray-300 mb-20">
          We offer a range of services to help you achieve the results you're
          after. Not sure what you need, or what it costs? We can explain what
          services are right for you and tell you more about our fees. Get in
          touch below.
        </p>
        <AICards />
      </div>
    </section>
  );
}
