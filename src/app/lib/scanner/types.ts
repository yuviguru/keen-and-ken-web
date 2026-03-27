export interface RepoMeta {
  owner: string;
  name: string;
  defaultBranch: string;
  description: string | null;
  stars: number;
  language: string | null;
  isPrivate: boolean;
}

export interface TreeEntry {
  path: string;
  type: "blob" | "tree";
  size?: number;
}

export type Severity = "pass" | "warn" | "fail";

export interface Finding {
  severity: Severity;
  message: string;
  detail?: string;
}

export interface CategoryResult {
  score: number;
  label: string;
  findings: Finding[];
}

export interface TechStack {
  framework: string | null;
  language: string | null;
  styling: string | null;
  stateManagement: string | null;
  testing: string | null;
  orm: string | null;
  deployment: string | null;
  ui: string | null;
}

export interface Recommendation {
  priority: "high" | "medium" | "low";
  category: string;
  message: string;
}

export interface ScanReport {
  repo: RepoMeta;
  score: {
    overall: number;
    categories: Record<string, CategoryResult>;
  };
  techStack: TechStack;
  recommendations: Recommendation[];
  aiAnalysis?: string;
  meta: {
    scannedAt: string;
    filesAnalyzed: number;
    scanDurationMs: number;
  };
}

export interface PackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  [key: string]: unknown;
}

export interface PythonConfig {
  requirements: string[];          // parsed from requirements.txt
  pyprojectDeps: string[];         // parsed from pyproject.toml [dependencies]
  pyprojectDevDeps: string[];      // parsed from pyproject.toml [optional-dependencies] or [tool.poetry.dev-dependencies]
  setupPyExists: boolean;
  pipfileExists: boolean;
  hasPoetry: boolean;
}
