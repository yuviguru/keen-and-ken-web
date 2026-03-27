"use client";
import React from "react";
import { Sparkles } from "lucide-react";

interface VRAIAnalysisProps {
  content: string;
}

interface Section {
  title: string;
  body: string;
}

function parseMarkdownSections(md: string): Section[] {
  const sections: Section[] = [];
  const parts = md.split(/^## /m);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const newlineIdx = trimmed.indexOf("\n");
    if (newlineIdx === -1) {
      sections.push({ title: trimmed, body: "" });
    } else {
      sections.push({
        title: trimmed.slice(0, newlineIdx).trim(),
        body: trimmed.slice(newlineIdx + 1).trim(),
      });
    }
  }

  return sections;
}

function renderInlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-white/80 font-medium">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[var(--accent-primary)] text-[0.7rem] font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

function renderBody(body: string): React.ReactNode[] {
  const lines = body.split("\n");
  const elements: React.ReactNode[] = [];
  let currentBlock: string[] = [];
  let listItems: string[] = [];
  let inCodeBlock = false;
  let key = 0;

  const flushBlock = () => {
    if (currentBlock.length === 0) return;
    const text = currentBlock.join("\n").trim();
    if (!text) { currentBlock = []; return; }
    elements.push(
      <p key={key++} className="text-white/50 text-[0.8rem] leading-[1.7]">
        {renderInlineMarkdown(text)}
      </p>
    );
    currentBlock = [];
  };

  const flushList = () => {
    if (listItems.length === 0) return;
    elements.push(
      <ul key={key++} className="space-y-1.5 my-1">
        {listItems.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-white/50 text-[0.8rem] leading-[1.7]">
            <span className="mt-[0.45rem] w-1 h-1 rounded-full bg-white/20 shrink-0" />
            <span>{renderInlineMarkdown(item)}</span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  for (const line of lines) {
    // Code blocks
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={key++}
            className="text-[0.7rem] text-white/40 bg-white/[0.02] border border-white/[0.06] rounded-lg p-3 overflow-x-auto font-mono my-2"
          >
            {currentBlock.join("\n")}
          </pre>
        );
        currentBlock = [];
        inCodeBlock = false;
      } else {
        flushBlock();
        flushList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      currentBlock.push(line);
      continue;
    }

    // ### sub-headers (issue titles like "### 1. Lack of Package Management")
    if (line.startsWith("### ")) {
      flushBlock();
      flushList();
      const title = line.replace("### ", "");
      elements.push(
        <div
          key={key++}
          className="mt-3 mb-1.5 pt-3 first:mt-0 first:pt-0 border-t border-white/[0.04] first:border-0"
        >
          <h4 className="text-white/80 font-medium text-[0.8rem]">{title}</h4>
        </div>
      );
      continue;
    }

    // List items (- item or numbered 1. item)
    const listMatch = line.match(/^[-*]\s+(.+)/) || line.match(/^\d+\.\s+(.+)/);
    if (listMatch) {
      flushBlock();
      listItems.push(listMatch[1]);
      continue;
    }

    // If we were collecting list items and hit a non-list line, flush the list
    if (listItems.length > 0 && line.trim() !== "") {
      flushList();
    }

    // Empty line = paragraph break
    if (line.trim() === "") {
      flushBlock();
      flushList();
      continue;
    }

    currentBlock.push(line);
  }

  flushBlock();
  flushList();
  return elements;
}

// Map section titles to accent colors for visual variety
function getSectionColor(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("critical") || lower.includes("issue")) return "bg-red-500/80";
  if (lower.includes("security") || lower.includes("performance")) return "bg-orange-500/80";
  if (lower.includes("fix first") || lower.includes("roadmap")) return "bg-yellow-500/80";
  if (lower.includes("skill")) return "bg-blue-500/80";
  if (lower.includes("architecture")) return "bg-purple-500/80";
  return "bg-[var(--accent-primary)]";
}

export default function VRAIAnalysis({ content }: VRAIAnalysisProps) {
  const sections = parseMarkdownSections(content);

  return (
    <div className="glass-card p-6 md:p-8 mb-10 text-left">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 pb-5 border-b border-white/[0.06]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-magenta)] flex items-center justify-center shrink-0">
          <Sparkles className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-white font-semibold text-[0.95rem]">
              AI Code Review
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-[0.55rem] font-bold uppercase tracking-widest">
              AI-Powered
            </span>
          </div>
          <p className="text-white/25 text-[0.7rem] mt-0.5">
            Automated analysis by VibeRefactor AI
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-7">
        {sections.map((section, i) => (
          <div key={i}>
            {/* Section header */}
            <div className="flex items-center gap-2.5 mb-3">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getSectionColor(section.title)}`} />
              <h3 className="text-white/90 font-semibold text-[0.85rem] tracking-tight">
                {section.title}
              </h3>
            </div>
            {/* Section body */}
            <div className="ml-4 pl-4 border-l border-white/[0.05] space-y-2">
              {renderBody(section.body)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
