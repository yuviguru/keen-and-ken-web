import { CategoryResult, Finding, PackageJson, PythonConfig, TreeEntry } from "../types";

export function analyzeCodeQuality(
  pkg: PackageJson | null,
  pythonConfig: PythonConfig | null,
  tree: TreeEntry[],
  files: Map<string, string>
): { result: CategoryResult; testing: string | null } {
  const findings: Finding[] = [];
  let score = 100;
  let testing: string | null = null;

  const filePaths = tree.map((e) => e.path);
  const isPython = !!pythonConfig;
  const isJs = !!pkg;

  if (isPython) {
    const allPyDeps = pythonConfig
      ? [...pythonConfig.requirements, ...pythonConfig.pyprojectDeps, ...pythonConfig.pyprojectDevDeps]
      : [];

    // Linting
    const hasLinter = allPyDeps.includes("ruff") || allPyDeps.includes("flake8") || allPyDeps.includes("pylint");
    const hasRuffConfig = filePaths.some((p) => p === "ruff.toml" || p === ".flake8" || p === "setup.cfg" || p === ".pylintrc");
    if (hasLinter || hasRuffConfig) {
      const linterName = allPyDeps.includes("ruff") ? "Ruff" : allPyDeps.includes("flake8") ? "Flake8" : "Pylint";
      findings.push({ severity: "pass", message: `${linterName} configured for linting` });
    } else {
      findings.push({ severity: "warn", message: "No Python linter detected — consider adding ruff or flake8" });
      score -= 15;
    }

    // Formatting
    const hasFormatter = allPyDeps.includes("black") || allPyDeps.includes("ruff") || allPyDeps.includes("yapf") || allPyDeps.includes("autopep8");
    if (hasFormatter) {
      const name = allPyDeps.includes("black") ? "Black" : allPyDeps.includes("ruff") ? "Ruff" : "autopep8/yapf";
      findings.push({ severity: "pass", message: `${name} for code formatting` });
    } else {
      findings.push({ severity: "warn", message: "No Python formatter detected — consider adding black or ruff" });
      score -= 10;
    }

    // Type checking
    const hasTypes = allPyDeps.includes("mypy") || allPyDeps.includes("pyright") || allPyDeps.includes("pytype");
    if (hasTypes) {
      findings.push({ severity: "pass", message: "Type checking enabled" });
    } else {
      findings.push({ severity: "warn", message: "No type checker — consider adding mypy or pyright" });
      score -= 10;
    }

    // Tests
    const pyTestFiles = tree.filter(
      (e) => e.type === "blob" && (e.path.match(/test_.*\.py$/) || e.path.match(/.*_test\.py$/))
    );
    const hasTestDir = tree.some(
      (e) => e.type === "tree" && (e.path === "tests" || e.path === "test" || e.path.endsWith("/tests"))
    );
    const hasPytest = allPyDeps.includes("pytest");
    const hasUnittest = pyTestFiles.some((f) => f.path.includes("test"));

    if (hasPytest) testing = "pytest";
    else if (hasUnittest) testing = "unittest";

    if (pyTestFiles.length > 0) {
      findings.push({ severity: "pass", message: `${pyTestFiles.length} test file(s) found${testing ? ` (${testing})` : ""}` });
    } else if (hasTestDir || hasPytest) {
      findings.push({ severity: "warn", message: `Test framework (${testing || "unknown"}) configured but no test files found` });
      score -= 10;
    } else {
      findings.push({ severity: "fail", message: "No tests detected — no test files, directories, or test framework" });
      score -= 25;
    }
  }

  if (isJs) {
    const allDeps = pkg ? { ...pkg.dependencies, ...pkg.devDependencies } : {};

    // ESLint
    const hasEslint = filePaths.some(
      (p) => p.match(/^\.?eslint(rc|\.config)\.(js|cjs|mjs|json|yml|yaml)$/) || p === ".eslintrc"
    );
    if (hasEslint || allDeps["eslint"]) {
      findings.push({ severity: "pass", message: "ESLint configured" });
    } else {
      findings.push({ severity: "warn", message: "No ESLint configuration — code linting not enforced" });
      score -= 15;
    }

    // Prettier
    const hasPrettier = filePaths.some(
      (p) => p.match(/^\.?prettier(rc)?\.(js|cjs|mjs|json|yml|yaml|toml)$/) || p === ".prettierrc"
    );
    if (hasPrettier || allDeps["prettier"]) {
      findings.push({ severity: "pass", message: "Prettier configured" });
    } else {
      findings.push({ severity: "warn", message: "No Prettier — code formatting may be inconsistent" });
      score -= 10;
    }

    // TypeScript strict mode
    const tsconfig = files.get("tsconfig.json");
    if (tsconfig) {
      try {
        const hasStrict = tsconfig.includes('"strict"') && tsconfig.includes("true");
        if (hasStrict) {
          findings.push({ severity: "pass", message: "TypeScript strict mode enabled" });
        } else {
          findings.push({ severity: "warn", message: "TypeScript found but strict mode not enabled" });
          score -= 10;
        }
      } catch {
        findings.push({ severity: "pass", message: "TypeScript configured" });
      }
    }

    // Tests
    const testFiles = tree.filter(
      (e) => e.type === "blob" && e.path.match(/\.(test|spec)\.(ts|tsx|js|jsx|mjs)$/)
    );
    const hasTestDir = tree.some(
      (e) => e.type === "tree" && (e.path === "__tests__" || e.path.endsWith("/__tests__") || e.path === "tests" || e.path === "test")
    );
    const testRunners: Record<string, string> = {
      vitest: "Vitest",
      jest: "Jest",
      "@playwright/test": "Playwright",
      cypress: "Cypress",
      mocha: "Mocha",
    };
    if (!testing) {
      for (const [dep, name] of Object.entries(testRunners)) {
        if (allDeps[dep]) {
          testing = name;
          break;
        }
      }
    }

    if (testFiles.length > 0) {
      findings.push({ severity: "pass", message: `${testFiles.length} test file(s) found${testing ? ` (${testing})` : ""}` });
    } else if (hasTestDir || testing) {
      findings.push({ severity: "warn", message: `Test runner (${testing || "unknown"}) configured but no test files found` });
      score -= 10;
    } else {
      findings.push({ severity: "fail", message: "No tests detected — no test files, directories, or test runner" });
      score -= 25;
    }
  }

  // CI/CD (common to both)
  const hasCI = tree.some(
    (e) => e.path.startsWith(".github/workflows/") || e.path === ".gitlab-ci.yml" || e.path.startsWith(".circleci/")
  );
  if (hasCI) {
    findings.push({ severity: "pass", message: "CI/CD pipeline configured" });
  } else {
    findings.push({ severity: "warn", message: "No CI/CD pipeline detected" });
    score -= 10;
  }

  // README
  const hasReadme = filePaths.some((p) => p.toLowerCase() === "readme.md" || p.toLowerCase() === "readme");
  if (hasReadme) {
    findings.push({ severity: "pass", message: "README present" });
  } else {
    findings.push({ severity: "warn", message: "No README file" });
    score -= 5;
  }

  return { result: { score: Math.max(0, score), label: "Code Quality", findings }, testing };
}
