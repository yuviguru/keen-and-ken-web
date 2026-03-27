import { CategoryResult, Finding, TreeEntry } from "../types";

const BACKUP_PATTERNS = [
  /\.bak$/,
  /\.old$/,
  /\.backup$/,
  /\.orig$/,
  /\.copy\./,
  /\bcopy\b/i,
  /\bold\b/i,
  /\.deprecated\./,
  /unused/i,
];

export function analyzeDeadCode(tree: TreeEntry[]): CategoryResult {
  const findings: Finding[] = [];
  let score = 100;
  const files = tree.filter((e) => e.type === "blob");

  // Backup/old files
  const backupFiles = files.filter((f) => {
    const name = f.path.split("/").pop()!;
    return BACKUP_PATTERNS.some((p) => p.test(name));
  });
  if (backupFiles.length > 0) {
    findings.push({
      severity: "warn",
      message: `${backupFiles.length} backup/deprecated file(s) detected`,
      detail: backupFiles.slice(0, 5).map((f) => f.path).join(", "),
    });
    score -= 10;
  } else {
    findings.push({ severity: "pass", message: "No backup or deprecated files detected" });
  }

  // Oversized single directories
  const dirCounts = new Map<string, number>();
  for (const f of files) {
    const dir = f.path.includes("/") ? f.path.substring(0, f.path.lastIndexOf("/")) : ".";
    dirCounts.set(dir, (dirCounts.get(dir) || 0) + 1);
  }
  const bloatedDirs = [...dirCounts.entries()].filter(([, count]) => count > 40);
  if (bloatedDirs.length > 0) {
    for (const [dir, count] of bloatedDirs.slice(0, 3)) {
      findings.push({ severity: "warn", message: `${dir}/ contains ${count} files — likely has unused code` });
    }
    score -= 10;
  }

  // Very large files (> 500 lines estimate based on size)
  const largeFiles = files.filter((f) => f.size && f.size > 15000); // ~500 lines
  if (largeFiles.length > 0) {
    findings.push({
      severity: "warn",
      message: `${largeFiles.length} large file(s) detected (>15KB)`,
      detail: largeFiles.slice(0, 5).map((f) => `${f.path} (${Math.round((f.size || 0) / 1024)}KB)`).join(", "),
    });
    score -= 5;
  }

  // TODO/FIXME in file names (unusual)
  const todoFiles = files.filter((f) => {
    const name = f.path.split("/").pop()!.toLowerCase();
    return name.includes("todo") || name.includes("fixme") || name.includes("temp") || name.includes("tmp");
  });
  if (todoFiles.length > 0) {
    findings.push({
      severity: "warn",
      message: `${todoFiles.length} temporary/todo file(s) found`,
      detail: todoFiles.slice(0, 3).map((f) => f.path).join(", "),
    });
    score -= 5;
  }

  if (findings.length === 0 || (findings.length === 1 && findings[0].severity === "pass")) {
    findings.push({ severity: "pass", message: "Codebase appears clean — no obvious dead code signals" });
  }

  return { score: Math.max(0, score), label: "Dead Code", findings };
}
