import { CategoryResult, Finding, PackageJson, PythonConfig, TreeEntry } from "../types";

const PROBLEMATIC_DEPS: Record<string, string> = {
  "moment": "Consider using dayjs or date-fns (smaller bundle)",
  "request": "Deprecated — use fetch or axios",
  "node-sass": "Deprecated — use sass (dart-sass)",
  "tslint": "Deprecated — use ESLint with typescript-eslint",
  "create-react-class": "Legacy React pattern — use function components",
};

const DUPLICATE_PURPOSES: [string, string, string][] = [
  ["axios", "node-fetch", "HTTP client"],
  ["moment", "dayjs", "date library"],
  ["moment", "date-fns", "date library"],
  ["lodash", "underscore", "utility library"],
];

const PROBLEMATIC_PY_DEPS: Record<string, string> = {
  "nose": "Deprecated — use pytest instead",
  "optparse": "Deprecated — use argparse",
  "imp": "Deprecated — use importlib",
  "fabric": "Consider using invoke or paramiko directly",
};

function analyzePythonDeps(py: PythonConfig, tree: TreeEntry[]): CategoryResult {
  const findings: Finding[] = [];
  let score = 100;

  const allDeps = [...py.requirements, ...py.pyprojectDeps, ...py.pyprojectDevDeps];
  const totalCount = allDeps.length;

  // Count
  if (totalCount > 80) {
    findings.push({ severity: "fail", message: `${totalCount} Python packages — very heavy dependency tree` });
    score -= 20;
  } else if (totalCount > 40) {
    findings.push({ severity: "warn", message: `${totalCount} Python packages — consider auditing for unused deps` });
    score -= 10;
  } else if (totalCount > 0) {
    findings.push({ severity: "pass", message: `${totalCount} Python packages detected` });
  }

  // Dependency file type
  if (py.hasPoetry) {
    findings.push({ severity: "pass", message: "Poetry detected — modern dependency management" });
  } else if (py.pyprojectDeps.length > 0) {
    findings.push({ severity: "pass", message: "pyproject.toml detected — modern project config" });
  } else if (py.requirements.length > 0) {
    findings.push({ severity: "pass", message: "requirements.txt found" });
  }

  // Lock file
  const hasLockFile = tree.some(
    (e) => e.path === "poetry.lock" || e.path === "Pipfile.lock" || e.path === "pdm.lock" || e.path === "uv.lock"
  );
  if (hasLockFile) {
    findings.push({ severity: "pass", message: "Lock file present — reproducible installs" });
  } else if (totalCount > 0) {
    findings.push({ severity: "warn", message: "No lock file found (poetry.lock, Pipfile.lock) — builds may be non-deterministic" });
    score -= 10;
  }

  // Pinned versions in requirements.txt
  if (py.requirements.length > 0) {
    // We can't perfectly check pinning from just dep names, but we note the concern
    findings.push({ severity: "pass", message: "requirements.txt dependencies parsed" });
  }

  // Virtual env committed
  const hasVenvCommitted = tree.some(
    (e) => e.path.startsWith("venv/") || e.path.startsWith(".venv/") || e.path.startsWith("env/")
  );
  if (hasVenvCommitted) {
    findings.push({ severity: "fail", message: "Virtual environment directory committed to repo — add to .gitignore" });
    score -= 15;
  }

  // Problematic deps
  for (const [dep, reason] of Object.entries(PROBLEMATIC_PY_DEPS)) {
    if (allDeps.includes(dep)) {
      findings.push({ severity: "warn", message: `${dep}: ${reason}` });
      score -= 5;
    }
  }

  // Both requirements.txt and Pipfile (conflicting)
  if (py.requirements.length > 0 && py.pipfileExists) {
    findings.push({ severity: "warn", message: "Both requirements.txt and Pipfile found — pick one dependency manager" });
    score -= 10;
  }

  return { score: Math.max(0, score), label: "Dependencies", findings };
}

export function analyzeDependencies(pkg: PackageJson | null, pythonConfig: PythonConfig | null, tree: TreeEntry[]): CategoryResult {
  // Python project
  if (pythonConfig && !pkg) {
    return analyzePythonDeps(pythonConfig, tree);
  }

  // Hybrid — run both and merge
  if (pythonConfig && pkg) {
    const pyResult = analyzePythonDeps(pythonConfig, tree);
    const jsResult = analyzeJsDeps(pkg, tree);
    return {
      score: Math.round((pyResult.score + jsResult.score) / 2),
      label: "Dependencies",
      findings: [...jsResult.findings, ...pyResult.findings],
    };
  }

  // JS-only
  if (pkg) {
    return analyzeJsDeps(pkg, tree);
  }

  return { score: 0, label: "Dependencies", findings: [{ severity: "fail", message: "No package.json or Python config found" }] };
}

function analyzeJsDeps(pkg: PackageJson, tree: TreeEntry[]): CategoryResult {
  const findings: Finding[] = [];
  let score = 100;

  const deps = pkg.dependencies || {};
  const devDeps = pkg.devDependencies || {};
  const allDeps = { ...deps, ...devDeps };
  const depCount = Object.keys(deps).length;
  const devDepCount = Object.keys(devDeps).length;
  const totalCount = depCount + devDepCount;

  // Total dependency count
  if (totalCount > 100) {
    findings.push({ severity: "fail", message: `${totalCount} total packages — very heavy dependency tree`, detail: `${depCount} prod, ${devDepCount} dev` });
    score -= 20;
  } else if (totalCount > 60) {
    findings.push({ severity: "warn", message: `${totalCount} total packages — consider auditing for unused deps`, detail: `${depCount} prod, ${devDepCount} dev` });
    score -= 10;
  } else {
    findings.push({ severity: "pass", message: `${totalCount} packages (${depCount} prod, ${devDepCount} dev)` });
  }

  // Lock file presence
  const hasLockFile = tree.some(
    (e) => e.path === "package-lock.json" || e.path === "yarn.lock" || e.path === "pnpm-lock.yaml" || e.path === "bun.lockb"
  );
  if (hasLockFile) {
    findings.push({ severity: "pass", message: "Lock file present — reproducible installs" });
  } else {
    findings.push({ severity: "fail", message: "No lock file found — builds may be non-deterministic" });
    score -= 15;
  }

  // Multiple lock files
  const lockFiles = tree.filter(
    (e) => ["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb"].includes(e.path)
  );
  if (lockFiles.length > 1) {
    findings.push({ severity: "warn", message: `Multiple lock files found (${lockFiles.map((f) => f.path).join(", ")}) — pick one package manager` });
    score -= 10;
  }

  // Problematic dependencies
  for (const [dep, reason] of Object.entries(PROBLEMATIC_DEPS)) {
    if (allDeps[dep]) {
      findings.push({ severity: "warn", message: `${dep}: ${reason}` });
      score -= 5;
    }
  }

  // Duplicate purpose packages
  for (const [a, b, purpose] of DUPLICATE_PURPOSES) {
    if (allDeps[a] && allDeps[b]) {
      findings.push({ severity: "warn", message: `Both ${a} and ${b} installed (duplicate ${purpose})` });
      score -= 5;
    }
  }

  return { score: Math.max(0, score), label: "Dependencies", findings };
}
