import { CategoryResult, Finding, TreeEntry } from "../types";

const GOOD_DIRS = ["components", "hooks", "lib", "utils", "services", "types", "config", "middleware", "modules"];
const SRC_PATTERNS = ["src/", "app/", "pages/"];

export function analyzeStructure(tree: TreeEntry[]): CategoryResult {
  const findings: Finding[] = [];
  let score = 100;

  const files = tree.filter((e) => e.type === "blob");
  const dirs = tree.filter((e) => e.type === "tree");

  findings.push({ severity: "pass", message: `${files.length} files across ${dirs.length} directories` });

  // Has src directory?
  const hasSrc = dirs.some((d) => SRC_PATTERNS.some((p) => d.path === p.replace("/", "") || d.path.startsWith(p)));
  if (hasSrc) {
    findings.push({ severity: "pass", message: "Organized under src/ or app/ directory" });
  } else {
    findings.push({ severity: "warn", message: "No src/ or app/ directory — code may be at root level" });
    score -= 10;
  }

  // Max directory depth
  const maxDepth = Math.max(...tree.map((e) => e.path.split("/").length), 0);
  if (maxDepth > 10) {
    findings.push({ severity: "warn", message: `Very deep nesting (${maxDepth} levels) — consider flattening` });
    score -= 10;
  } else if (maxDepth < 3 && files.length > 20) {
    findings.push({ severity: "warn", message: "Flat structure with many files — consider organizing into directories" });
    score -= 15;
  } else {
    findings.push({ severity: "pass", message: `Directory depth: ${maxDepth} levels` });
  }

  // Modular structure detection
  const topLevelDirs = dirs.filter((d) => !d.path.includes("/")).map((d) => d.path);
  const goodDirCount = topLevelDirs.filter((d) => GOOD_DIRS.includes(d)).length;
  const hasModules = dirs.some((d) => d.path.includes("modules/") || d.path.includes("features/"));

  if (hasModules) {
    findings.push({ severity: "pass", message: "Domain-driven structure detected (modules/ or features/)" });
  } else if (goodDirCount >= 3) {
    findings.push({ severity: "pass", message: "Well-organized directory structure" });
  } else if (files.length > 30) {
    findings.push({ severity: "warn", message: "No clear organizational pattern — consider grouping by feature or domain" });
    score -= 15;
  }

  // Oversized directories (files in a single dir)
  const dirFileCounts = new Map<string, number>();
  for (const f of files) {
    const dir = f.path.includes("/") ? f.path.substring(0, f.path.lastIndexOf("/")) : ".";
    dirFileCounts.set(dir, (dirFileCounts.get(dir) || 0) + 1);
  }
  const oversized = [...dirFileCounts.entries()].filter(([, count]) => count > 30);
  if (oversized.length > 0) {
    for (const [dir, count] of oversized.slice(0, 3)) {
      findings.push({ severity: "warn", message: `${dir}/ has ${count} files — consider splitting` });
    }
    score -= 10;
  }

  // Component count
  const componentFiles = files.filter(
    (f) => f.path.match(/\.(tsx|jsx)$/) && !f.path.match(/\.(test|spec|story|stories)\./i)
  );
  if (componentFiles.length > 0) {
    findings.push({ severity: "pass", message: `${componentFiles.length} component files detected` });
  }

  return { score: Math.max(0, score), label: "Folder Structure", findings };
}
