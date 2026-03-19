"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  ReactFlow,
  Handle,
  type Node,
  type Edge,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// ─── Data ────────────────────────────────────────────────────
interface Category {
  name: string;
  items: string[];
}

const categories: Category[] = [
  { name: "Enterprise Platforms", items: ["HRMS", "CRM", "ERP", "LMS"] },
  { name: "AI & Automation", items: ["AI Agents", "Chatbots", "Analytics", "Workflow Automation"] },
  { name: "Digital Products", items: ["EdTech", "E-Commerce", "Micro SaaS", "CMS"] },
];

// ─── Custom Hub Node (3 source handles: left, top, right) ────
function HubNode() {
  return (
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        background: "linear-gradient(135deg, rgba(97,54,217,0.5), rgba(30,20,60,0.9))",
        border: "2px solid rgba(139,92,246,0.4)",
        boxShadow: "0 0 50px rgba(97,54,217,0.3), 0 0 100px rgba(97,54,217,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="Keen & Ken" style={{ width: 36, height: 36 }} />
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  );
}

const nodeTypes = { hub: HubNode };

// ─── Shared styles ───────────────────────────────────────────
const catStyle: React.CSSProperties = {
  background: "rgba(97,54,217,0.15)",
  border: "1px solid rgba(139,92,246,0.3)",
  borderRadius: 20,
  color: "#a78bfa",
  fontWeight: 600,
  fontSize: 12,
  padding: "6px 16px",
};

const itemStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  color: "#f0eef6",
  fontWeight: 500,
  fontSize: 13,
  padding: "8px 20px",
};

// ─── Fixed positions (symmetric around x:500, y:280) ─────────
const HUB = { x: 500, y: 280 };

const catPos = [
  { x: 260, y: 280 },  // Enterprise - left
  { x: 500, y: 110 },  // AI & Automation - top
  { x: 740, y: 280 },  // Digital Products - right
];

const leftItems = [
  { x: 0, y: 100 },
  { x: 0, y: 210 },
  { x: 0, y: 350 },
  { x: 0, y: 460 },
];

const topItems = [
  { x: 180, y: -80 },
  { x: 380, y: -80 },
  { x: 620, y: -80 },
  { x: 820, y: -80 },
];

const rightItems = [
  { x: 1000, y: 100 },
  { x: 1000, y: 210 },
  { x: 1000, y: 350 },
  { x: 1000, y: 460 },
];

const itemPositions = [leftItems, topItems, rightItems];

// ─── Build nodes ─────────────────────────────────────────────
function buildNodes(): Node[] {
  const nodes: Node[] = [
    {
      id: "hub",
      type: "hub",
      position: HUB,
      data: { label: "K & K" },
    },
  ];

  // Category source/target handles for connecting to their sub-items
  const catSourcePos = [Position.Left, Position.Top, Position.Right];
  const catTargetPos = [Position.Right, Position.Bottom, Position.Left];

  categories.forEach((cat, ci) => {
    nodes.push({
      id: cat.name,
      position: catPos[ci],
      data: { label: cat.name },
      style: catStyle,
      sourcePosition: catSourcePos[ci],
      targetPosition: catTargetPos[ci],
    });

    const positions = itemPositions[ci];
    // Items connect back toward their category
    const itemTarget = ci === 0 ? Position.Right : ci === 2 ? Position.Left : Position.Bottom;

    cat.items.forEach((item, si) => {
      nodes.push({
        id: item,
        position: positions[si],
        data: { label: item },
        style: itemStyle,
        sourcePosition: Position.Left,
        targetPosition: itemTarget,
      });
    });
  });

  return nodes;
}

// ─── Build edges ─────────────────────────────────────────────
// Hub edges use sourceHandle to route from the correct side
const hubHandles = ["left", "top", "right"];

function buildEdges(): Edge[] {
  const edges: Edge[] = [];

  categories.forEach((cat, ci) => {
    edges.push({
      id: `hub-${cat.name}`,
      source: "hub",
      sourceHandle: hubHandles[ci],
      target: cat.name,
      type: "bezier",
      style: { stroke: "rgba(139,92,246,0.45)", strokeWidth: 1.8 },
      animated: true,
    });

    cat.items.forEach((item) => {
      edges.push({
        id: `${cat.name}-${item}`,
        source: cat.name,
        target: item,
        type: "bezier",
        style: { stroke: "rgba(139,92,246,0.2)", strokeWidth: 1.2 },
      });
    });
  });

  return edges;
}

const initialNodes = buildNodes();
const initialEdges = buildEdges();

// ─── CSS to hide handles and polish ──────────────────────────
const flowCSS = `
  .expertise-flow .react-flow__handle {
    opacity: 0 !important;
    width: 1px !important;
    height: 1px !important;
    min-width: 0 !important;
    min-height: 0 !important;
    border: none !important;
    background: transparent !important;
  }
  .expertise-flow .react-flow__node {
    cursor: default !important;
  }
  .expertise-flow .react-flow__edge-interaction {
    pointer-events: none !important;
  }
`;

// ─── Component ───────────────────────────────────────────────
export default function ProductsOrbit() {
  return (
    <section
      id="products"
      className="relative px-6 md:px-12 lg:px-16 py-24 md:py-32 overflow-hidden scroll-mt-20"
    >
      <style dangerouslySetInnerHTML={{ __html: flowCSS }} />

      {/* Header */}
      <div className="text-center mb-8">
        <motion.p
          className="section-label mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Our Expertise
        </motion.p>
        <motion.h2
          className="text-[var(--text-h3)] md:text-[var(--text-h2)] font-bold text-white leading-[var(--lh-heading)] tracking-[var(--ls-heading)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Solutions We Design & Build
        </motion.h2>
      </div>

      {/* Desktop: React Flow */}
      <motion.div
        className="hidden md:block expertise-flow"
        style={{ height: 620 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.05 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          elementsSelectable={false}
          panOnDrag={false}
          panOnScroll={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          style={{ background: "transparent" }}
        />
      </motion.div>

      {/* Mobile: categorized grid */}
      <div className="md:hidden space-y-8 max-w-sm mx-auto">
        {categories.map((cat, ci) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ci * 0.1, duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: "var(--accent-primary)",
                  boxShadow: "0 0 8px rgba(139,92,246,0.4)",
                }}
              />
              <span
                className="text-[0.8125rem] font-semibold tracking-[0.02em]"
                style={{ color: "var(--accent-primary)" }}
              >
                {cat.name}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {cat.items.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-center px-4 py-3 rounded-lg border border-white/[0.08] bg-white/[0.03]"
                >
                  <span className="text-sm font-medium text-white">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
