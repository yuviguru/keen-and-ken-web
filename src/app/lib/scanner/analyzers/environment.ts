import { CategoryResult, Finding, TreeEntry } from "../types";

export function analyzeEnvironment(tree: TreeEntry[], gitignoreContent: string | null): CategoryResult {
  const findings: Finding[] = [];
  let score = 100;
  const filePaths = tree.map((e) => e.path);

  // .gitignore exists
  if (filePaths.includes(".gitignore")) {
    findings.push({ severity: "pass", message: ".gitignore present" });

    // Check if .env is in gitignore
    if (gitignoreContent) {
      const ignoresEnv = gitignoreContent.split("\n").some((line) => {
        const trimmed = line.trim();
        return trimmed === ".env" || trimmed === ".env*" || trimmed === ".env.local" || trimmed === "*.env";
      });
      if (ignoresEnv) {
        findings.push({ severity: "pass", message: ".env files are gitignored" });
      } else {
        findings.push({ severity: "warn", message: ".gitignore may not cover .env files" });
        score -= 10;
      }

      // Check for node_modules in gitignore
      const ignoresNodeModules = gitignoreContent.includes("node_modules");
      if (!ignoresNodeModules) {
        findings.push({ severity: "fail", message: "node_modules not in .gitignore" });
        score -= 15;
      }
    }
  } else {
    findings.push({ severity: "fail", message: "No .gitignore file — sensitive files may be committed" });
    score -= 25;
  }

  // .env files in repo (should NOT be there)
  const envFiles = filePaths.filter((p) => {
    const name = p.includes("/") ? p.split("/").pop()! : p;
    return name === ".env" || name === ".env.local" || name === ".env.production";
  });
  if (envFiles.length > 0) {
    findings.push({
      severity: "fail",
      message: `Environment file(s) committed to repo: ${envFiles.join(", ")}`,
      detail: "These may contain secrets. Remove them and add to .gitignore",
    });
    score -= 25;
  } else {
    findings.push({ severity: "pass", message: "No .env files committed to repo" });
  }

  // .env.example present
  const hasEnvExample = filePaths.some(
    (p) => p === ".env.example" || p === ".env.sample" || p === ".env.template"
  );
  if (hasEnvExample) {
    findings.push({ severity: "pass", message: ".env.example present — good documentation of required env vars" });
  } else {
    findings.push({ severity: "warn", message: "No .env.example — other developers won't know required env vars" });
    score -= 10;
  }

  // LICENSE
  const hasLicense = filePaths.some((p) => p.toLowerCase().startsWith("license"));
  if (hasLicense) {
    findings.push({ severity: "pass", message: "LICENSE file present" });
  }

  return { score: Math.max(0, score), label: "Environment Setup", findings };
}
