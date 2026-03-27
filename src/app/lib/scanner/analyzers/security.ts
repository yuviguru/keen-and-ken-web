import { CategoryResult, Finding, TreeEntry } from "../types";

const SECRET_PATTERNS = [
  /\.env$/,
  /\.env\.local$/,
  /\.env\.production$/,
  /\.env\.staging$/,
  /credentials\.json$/,
  /service[_-]?account.*\.json$/,
  /\.pem$/,
  /\.key$/,
  /secrets?\.(json|yml|yaml)$/,
];

const SUSPICIOUS_FILE_NAMES = [
  "firebase-adminsdk",
  "serviceAccountKey",
  "google-credentials",
  ".npmrc",
];

export function analyzeSecurity(tree: TreeEntry[], gitignoreContent: string | null): CategoryResult {
  const findings: Finding[] = [];
  let score = 100;
  const filePaths = tree.filter((e) => e.type === "blob").map((e) => e.path);

  // Check for secret files in repo
  const secretFiles: string[] = [];
  for (const p of filePaths) {
    const fileName = p.includes("/") ? p.split("/").pop()! : p;
    if (SECRET_PATTERNS.some((pattern) => pattern.test(fileName))) {
      secretFiles.push(p);
    }
    if (SUSPICIOUS_FILE_NAMES.some((s) => fileName.toLowerCase().includes(s.toLowerCase()))) {
      secretFiles.push(p);
    }
  }

  if (secretFiles.length > 0) {
    const unique = [...new Set(secretFiles)];
    findings.push({
      severity: "fail",
      message: `${unique.length} potential secret file(s) in repo`,
      detail: unique.slice(0, 5).join(", "),
    });
    score -= 30;
  } else {
    findings.push({ severity: "pass", message: "No secret files detected in repo" });
  }

  // Check for common security packages
  // (We don't have package.json here, but we check for security-related config files)
  const hasSecurityHeaders = filePaths.some(
    (p) => p.includes("helmet") || p.includes("security-headers") || p.includes("next.config")
  );
  if (hasSecurityHeaders) {
    findings.push({ severity: "pass", message: "Security configuration files present" });
  }

  // .gitignore coverage
  if (gitignoreContent) {
    const ignoreLines = gitignoreContent.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
    if (ignoreLines.length < 5) {
      findings.push({ severity: "warn", message: `.gitignore has only ${ignoreLines.length} rules — may miss sensitive files` });
      score -= 10;
    } else {
      findings.push({ severity: "pass", message: `.gitignore has ${ignoreLines.length} rules` });
    }

    // Check for common sensitive patterns
    const coversSecrets = ignoreLines.some((l) => l.includes(".env") || l.includes("*.pem") || l.includes("*.key"));
    if (!coversSecrets) {
      findings.push({ severity: "warn", message: ".gitignore doesn't cover common secret file patterns (.env, .pem, .key)" });
      score -= 10;
    }
  }

  // Docker secrets
  const hasDockerCompose = filePaths.some((p) => p.includes("docker-compose"));
  if (hasDockerCompose) {
    findings.push({ severity: "pass", message: "Docker Compose detected — verify secrets are not hardcoded" });
  }

  return { score: Math.max(0, score), label: "Security", findings };
}
