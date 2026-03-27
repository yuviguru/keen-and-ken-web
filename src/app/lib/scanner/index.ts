import { fetchRepoMeta, fetchTree, fetchMultipleFiles, fetchFileContent } from "./github";
import { analyzeProjectType } from "./analyzers/project-type";
import { analyzeDependencies } from "./analyzers/dependencies";
import { analyzeStructure } from "./analyzers/structure";
import { analyzeCodeQuality } from "./analyzers/code-quality";
import { analyzeEnvironment } from "./analyzers/environment";
import { analyzeSecurity } from "./analyzers/security";
import { analyzeDatabase } from "./analyzers/database";
import { analyzeDeadCode } from "./analyzers/dead-code";
import { computeOverallScore, generateRecommendations } from "./scoring";
import { generateAIAnalysis } from "./ai-analysis";
import { ScanReport, PackageJson, PythonConfig, TechStack, CategoryResult } from "./types";

export async function scanRepository(owner: string, repo: string): Promise<ScanReport> {
  const startTime = Date.now();

  // Step 1: Fetch repo metadata
  const repoMeta = await fetchRepoMeta(owner, repo);
  if (repoMeta.isPrivate) {
    throw new Error("REPO_PRIVATE");
  }

  // Step 2: Fetch file tree
  const { entries: tree, truncated } = await fetchTree(owner, repo, repoMeta.defaultBranch);

  // Step 3: Fetch key files in parallel
  const keyFiles = [
    "package.json",
    "tsconfig.json",
    ".gitignore",
    "requirements.txt",
    "pyproject.toml",
    "setup.py",
    "Pipfile",
  ];
  const [filesMap, gitignoreContent] = await Promise.all([
    fetchMultipleFiles(owner, repo, keyFiles),
    fetchFileContent(owner, repo, ".gitignore"),
  ]);

  // Parse package.json
  let pkg: PackageJson | null = null;
  const pkgContent = filesMap.get("package.json");
  if (pkgContent) {
    try {
      pkg = JSON.parse(pkgContent);
    } catch {
      // Invalid JSON
    }
  }

  // Parse Python config
  let pythonConfig: PythonConfig | null = null;
  const reqTxt = filesMap.get("requirements.txt");
  const pyprojectToml = filesMap.get("pyproject.toml");
  const setupPyExists = filesMap.has("setup.py");
  const pipfileExists = filesMap.has("Pipfile");

  if (reqTxt || pyprojectToml || setupPyExists || pipfileExists) {
    const requirements = reqTxt
      ? reqTxt.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#") && !l.startsWith("-"))
          .map((l) => l.split(/[>=<!\[;]/)[0].trim().toLowerCase())
      : [];

    const pyprojectDeps: string[] = [];
    const pyprojectDevDeps: string[] = [];
    let hasPoetry = false;

    if (pyprojectToml) {
      hasPoetry = pyprojectToml.includes("[tool.poetry");
      // Simple TOML parsing for dependencies array
      const depsMatch = pyprojectToml.match(/\[project\]\s[\s\S]*?dependencies\s*=\s*\[([\s\S]*?)\]/);
      if (depsMatch) {
        depsMatch[1].split("\n").forEach((line) => {
          const m = line.match(/"([^">=<!\[;]+)/);
          if (m) pyprojectDeps.push(m[1].trim().toLowerCase());
        });
      }
      // Poetry deps
      const poetryDepsMatch = pyprojectToml.match(/\[tool\.poetry\.dependencies\]\s*([\s\S]*?)(?:\[|$)/);
      if (poetryDepsMatch) {
        poetryDepsMatch[1].split("\n").forEach((line) => {
          const m = line.match(/^([a-zA-Z0-9_-]+)\s*=/);
          if (m && m[1] !== "python") pyprojectDeps.push(m[1].trim().toLowerCase());
        });
      }
      // Dev deps
      const devMatch = pyprojectToml.match(/\[tool\.poetry\.(?:group\.dev\.)?dev-?dependencies\]\s*([\s\S]*?)(?:\[|$)/);
      if (devMatch) {
        devMatch[1].split("\n").forEach((line) => {
          const m = line.match(/^([a-zA-Z0-9_-]+)\s*=/);
          if (m) pyprojectDevDeps.push(m[1].trim().toLowerCase());
        });
      }
    }

    pythonConfig = { requirements, pyprojectDeps, pyprojectDevDeps, setupPyExists, pipfileExists, hasPoetry };
  }

  // Step 4: Run all analyzers
  const { result: projectTypeResult, techStack: detectedStack } = analyzeProjectType(pkg, pythonConfig, tree);
  const dependenciesResult = analyzeDependencies(pkg, pythonConfig, tree);
  const structureResult = analyzeStructure(tree);
  const { result: codeQualityResult, testing } = analyzeCodeQuality(pkg, pythonConfig, tree, filesMap);
  const environmentResult = analyzeEnvironment(tree, gitignoreContent);
  const securityResult = analyzeSecurity(tree, gitignoreContent);
  const { result: databaseResult, orm } = analyzeDatabase(pkg, pythonConfig, tree);
  const deadCodeResult = analyzeDeadCode(tree);

  // Build categories
  const categories: Record<string, CategoryResult> = {
    projectType: projectTypeResult,
    dependencies: dependenciesResult,
    structure: structureResult,
    codeQuality: codeQualityResult,
    environment: environmentResult,
    security: securityResult,
    database: databaseResult,
    deadCode: deadCodeResult,
  };

  // Add truncation warning
  if (truncated) {
    categories.structure.findings.push({
      severity: "warn",
      message: "Repository is very large — file tree was truncated. Analysis may be partial.",
    });
  }

  // Compute scores
  const overall = computeOverallScore(categories);
  const recommendations = generateRecommendations(categories);

  // Build tech stack
  const techStack: TechStack = {
    framework: detectedStack.framework || null,
    language: detectedStack.language || repoMeta.language,
    styling: detectedStack.styling || null,
    stateManagement: detectedStack.stateManagement || null,
    testing,
    orm,
    deployment: null,
    ui: detectedStack.ui || null,
  };

  // Check for deployment config
  const deployMap: Record<string, string> = {
    "vercel.json": "Vercel",
    "netlify.toml": "Netlify",
    "Dockerfile": "Docker",
    "fly.toml": "Fly.io",
    "render.yaml": "Render",
    "Procfile": "Heroku",
    "app.yaml": "Google App Engine",
    "serverless.yml": "Serverless",
  };
  const deployFiles = tree.filter((e) => deployMap[e.path]);
  if (deployFiles.length > 0) {
    techStack.deployment = deployMap[deployFiles[0].path] || null;
  }

  // Build partial report for AI analysis
  const partialReport: ScanReport = {
    repo: repoMeta,
    score: { overall, categories },
    techStack,
    recommendations,
    meta: {
      scannedAt: new Date().toISOString(),
      filesAnalyzed: tree.filter((e) => e.type === "blob").length,
      scanDurationMs: Date.now() - startTime,
    },
  };

  // Phase 2: AI analysis (runs in parallel-safe, gracefully degrades)
  const aiAnalysis = await generateAIAnalysis(partialReport, owner, repo, tree);

  return {
    ...partialReport,
    ...(aiAnalysis ? { aiAnalysis } : {}),
    meta: {
      ...partialReport.meta,
      scanDurationMs: Date.now() - startTime, // update with total time
    },
  };
}
