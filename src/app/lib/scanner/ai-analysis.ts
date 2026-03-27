import { fetchMultipleFiles } from "./github";
import { ScanReport, TreeEntry, TechStack } from "./types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
const MAX_FILE_LINES = 200;
const MAX_FILES = 12;
const MAX_TREE_ENTRIES = 300;

// Priority patterns for smart file selection
const ENTRY_POINTS = [
  "src/app/page.tsx", "src/app/page.jsx", "src/app/page.ts",
  "src/pages/index.tsx", "src/pages/index.jsx", "src/pages/index.js",
  "src/index.ts", "src/index.tsx", "src/index.js", "src/index.jsx",
  "src/main.ts", "src/main.tsx", "src/main.js", "src/main.jsx",
  "index.ts", "index.js", "index.tsx", "index.jsx",
  "app.ts", "app.js", "server.ts", "server.js",
  // Python
  "app.py", "main.py", "manage.py", "wsgi.py", "asgi.py",
  "src/app.py", "src/main.py",
];

const CONFIG_FILES = [
  "next.config.js", "next.config.mjs", "next.config.ts",
  "vite.config.ts", "vite.config.js",
  "webpack.config.js", "webpack.config.ts",
  "tailwind.config.js", "tailwind.config.ts",
  "tsconfig.json",
  // Python
  "settings.py", "config.py", "pyproject.toml",
];

const DB_SCHEMA_FILES = [
  "prisma/schema.prisma",
  "drizzle.config.ts",
  "src/db/schema.ts", "src/schema.ts",
  // Python
  "models.py", "src/models.py", "app/models.py",
];

export function selectFilesForAnalysis(tree: TreeEntry[], techStack: TechStack): string[] {
  const selected: string[] = [];
  const blobs = tree.filter((e) => e.type === "blob");

  // 1. Entry points (first 2 found)
  for (const ep of ENTRY_POINTS) {
    if (selected.length >= 2) break;
    if (blobs.some((b) => b.path === ep)) selected.push(ep);
  }

  // 2. Config files (first 2 found)
  for (const cf of CONFIG_FILES) {
    if (selected.length >= 4) break;
    if (blobs.some((b) => b.path === cf) && !selected.includes(cf)) selected.push(cf);
  }

  // 3. API routes (first 3 matching api/ or routes/)
  const apiFiles = blobs
    .filter((b) => /\/(api|routes)\//.test(b.path) && /\.(ts|tsx|js|jsx|py)$/.test(b.path))
    .sort((a, b) => (b.size || 0) - (a.size || 0))
    .slice(0, 3);
  for (const f of apiFiles) {
    if (!selected.includes(f.path)) selected.push(f.path);
  }

  // 4. Largest components/source files (top 3 by size)
  const sourceFiles = blobs
    .filter((b) =>
      /\.(ts|tsx|js|jsx|py)$/.test(b.path) &&
      !b.path.includes("node_modules") &&
      !b.path.includes(".min.") &&
      !b.path.includes("dist/") &&
      !b.path.includes("build/") &&
      !selected.includes(b.path) &&
      (b.size || 0) < 50000 // skip huge generated files
    )
    .sort((a, b) => (b.size || 0) - (a.size || 0))
    .slice(0, 3);
  for (const f of sourceFiles) {
    selected.push(f.path);
  }

  // 5. DB schema files
  for (const df of DB_SCHEMA_FILES) {
    if (selected.length >= MAX_FILES) break;
    if (blobs.some((b) => b.path === df || b.path.endsWith(`/${df}`)) && !selected.includes(df)) {
      const match = blobs.find((b) => b.path === df || b.path.endsWith(`/${df}`));
      if (match && !selected.includes(match.path)) selected.push(match.path);
    }
  }

  return selected.slice(0, MAX_FILES);
}

function truncateFile(content: string): string {
  const lines = content.split("\n");
  if (lines.length <= MAX_FILE_LINES) return content;
  return lines.slice(0, MAX_FILE_LINES).join("\n") + `\n\n... (truncated, ${lines.length - MAX_FILE_LINES} more lines)`;
}

function summarizeFindings(report: ScanReport): string {
  const lines: string[] = [];
  for (const [key, cat] of Object.entries(report.score.categories)) {
    const issues = cat.findings.filter((f) => f.severity !== "pass");
    lines.push(`- **${cat.label}**: ${cat.score}/100${issues.length > 0 ? ` — ${issues.map((f) => f.message).join("; ")}` : " — all checks passed"}`);
  }
  return lines.join("\n");
}

function buildTreeSummary(tree: TreeEntry[]): string {
  const dirs = tree.filter((e) => e.type === "tree").map((e) => e.path);
  const files = tree.filter((e) => e.type === "blob").map((e) => e.path);

  // Show top-level structure + key directories
  const topLevel = [...new Set([...dirs, ...files].map((p) => p.split("/")[0]))].sort();
  const truncated = files.length > MAX_TREE_ENTRIES;
  const treePaths = files.slice(0, MAX_TREE_ENTRIES).join("\n");

  return `Top-level: ${topLevel.join(", ")}\n\nFull file list (${files.length} files${truncated ? ", showing first " + MAX_TREE_ENTRIES : ""}):\n${treePaths}`;
}

const SYSTEM_PROMPT = `You are a senior software architect at a code rescue consultancy called VibeRefactor. You specialize in reviewing codebases built with AI tools (Cursor, Bolt, Lovable, v0, ChatGPT) and identifying issues that vibecoded projects commonly have.

Your review should be:
- Specific: Reference exact file paths from the repository
- Actionable: Tell them exactly what to fix and where
- Skills-aware: For each issue, list the technical skills needed to fix it
- Effort-estimated: Give rough time estimates (hours/days)
- Honest but constructive: Acknowledge what's done well

Format your response in markdown with these exact sections:

## Overall Assessment
2-3 sentences summarizing the repo's health, maturity, and whether it's production-ready.

## Architecture Review
What patterns are used, what's done well, what architectural concerns exist. Reference specific folders and file organization.

## Critical Issues
List the top 3-5 issues, each as:

### [Number]. [Issue Title]
**What's wrong:** Clear description
**Files to check:** List specific file paths from the repo
**Skills needed:** Specific technical skills (e.g., "React Server Components", "JWT authentication", "PostgreSQL indexing")
**Effort:** Rough estimate (e.g., "~2-4 hours", "~1-2 days")

## What to Fix First
A prioritized 1-2-3 roadmap of which issues to tackle first and why.

## Security & Performance
Any security vulnerabilities or performance concerns with specific file paths.

## Skills Summary
Consolidated list of all skills/expertise needed:
- **Frontend:** [specific skills]
- **Backend:** [specific skills]
- **DevOps:** [specific skills]
- **Database:** [specific skills if applicable]

Keep the total response under 1500 words. Be specific — generic advice is useless.`;

export async function generateAIAnalysis(
  report: ScanReport,
  owner: string,
  repo: string,
  tree: TreeEntry[]
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    // Select and fetch key files
    const filePaths = selectFilesForAnalysis(tree, report.techStack);
    const fileContents = await fetchMultipleFiles(owner, repo, filePaths);

    // Build file contents section
    const fileSection = Array.from(fileContents.entries())
      .map(([path, content]) => `### ${path}\n\`\`\`\n${truncateFile(content)}\n\`\`\``)
      .join("\n\n");

    // Build the user prompt
    const userPrompt = `Review this GitHub repository: **${owner}/${repo}**

**Description:** ${report.repo.description || "No description"}
**Language:** ${report.repo.language || "Unknown"}
**Stars:** ${report.repo.stars}

## Static Analysis Results (automated scan)
**Overall Score: ${report.score.overall}/100**

${summarizeFindings(report)}

## Tech Stack Detected
${Object.entries(report.techStack).filter(([, v]) => v).map(([k, v]) => `- ${k}: ${v}`).join("\n") || "Minimal tech stack detected"}

## Repository File Tree
${buildTreeSummary(tree)}

## Source Code (key files)
${fileSection || "No source files could be read."}

## Top Recommendations from Static Analysis
${report.recommendations.slice(0, 8).map((r) => `- [${r.priority}] ${r.message}`).join("\n")}

Now provide your expert architectural review. Be specific — reference actual file paths and patterns you see in the code above.`;

    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2500,
      }),
    });

    if (!res.ok) {
      console.error("Groq API error:", res.status, await res.text().catch(() => ""));
      return null;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error("AI analysis failed:", err);
    return null;
  }
}
