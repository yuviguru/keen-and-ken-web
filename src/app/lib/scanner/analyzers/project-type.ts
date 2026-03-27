import { CategoryResult, Finding, PackageJson, PythonConfig, TreeEntry, TechStack } from "../types";

const FRAMEWORKS: Record<string, { name: string; type: "frontend" | "backend" | "fullstack" }> = {
  next: { name: "Next.js", type: "fullstack" },
  nuxt: { name: "Nuxt", type: "fullstack" },
  "react-scripts": { name: "Create React App", type: "frontend" },
  react: { name: "React", type: "frontend" },
  vue: { name: "Vue", type: "frontend" },
  svelte: { name: "Svelte", type: "frontend" },
  "@sveltejs/kit": { name: "SvelteKit", type: "fullstack" },
  angular: { name: "Angular", type: "frontend" },
  "@angular/core": { name: "Angular", type: "frontend" },
  express: { name: "Express", type: "backend" },
  fastify: { name: "Fastify", type: "backend" },
  "@nestjs/core": { name: "NestJS", type: "backend" },
  hono: { name: "Hono", type: "backend" },
  remix: { name: "Remix", type: "fullstack" },
  "@remix-run/react": { name: "Remix", type: "fullstack" },
  astro: { name: "Astro", type: "fullstack" },
  gatsby: { name: "Gatsby", type: "fullstack" },
};

const PYTHON_FRAMEWORKS: Record<string, { name: string; type: "frontend" | "backend" | "fullstack" | "ml" }> = {
  django: { name: "Django", type: "fullstack" },
  flask: { name: "Flask", type: "backend" },
  fastapi: { name: "FastAPI", type: "backend" },
  streamlit: { name: "Streamlit", type: "frontend" },
  gradio: { name: "Gradio", type: "frontend" },
  tornado: { name: "Tornado", type: "backend" },
  starlette: { name: "Starlette", type: "backend" },
  sanic: { name: "Sanic", type: "backend" },
  aiohttp: { name: "aiohttp", type: "backend" },
  celery: { name: "Celery", type: "backend" },
  langchain: { name: "LangChain", type: "ml" },
  transformers: { name: "Hugging Face Transformers", type: "ml" },
  tensorflow: { name: "TensorFlow", type: "ml" },
  torch: { name: "PyTorch", type: "ml" },
  pytorch: { name: "PyTorch", type: "ml" },
  scikit_learn: { name: "scikit-learn", type: "ml" },
  "scikit-learn": { name: "scikit-learn", type: "ml" },
  pandas: { name: "Pandas", type: "ml" },
  numpy: { name: "NumPy", type: "ml" },
};

const STYLING: Record<string, string> = {
  tailwindcss: "Tailwind CSS",
  "styled-components": "Styled Components",
  "@emotion/react": "Emotion",
  sass: "Sass",
  less: "Less",
  "@chakra-ui/react": "Chakra UI",
  "@mantine/core": "Mantine",
  "@mui/material": "Material UI",
};

const STATE: Record<string, string> = {
  zustand: "Zustand",
  redux: "Redux",
  "@reduxjs/toolkit": "Redux Toolkit",
  jotai: "Jotai",
  recoil: "Recoil",
  mobx: "MobX",
  "@tanstack/react-query": "TanStack Query",
  swr: "SWR",
};

const UI_LIBS: Record<string, string> = {
  "@radix-ui/react-dialog": "Radix UI",
  "@headlessui/react": "Headless UI",
  "@shadcn/ui": "shadcn/ui",
  "lucide-react": "Lucide Icons",
  "@heroicons/react": "Heroicons",
};

function getAllPythonDeps(py: PythonConfig): string[] {
  return [...py.requirements, ...py.pyprojectDeps, ...py.pyprojectDevDeps];
}

export function analyzeProjectType(
  pkg: PackageJson | null,
  pythonConfig: PythonConfig | null,
  tree: TreeEntry[]
): { result: CategoryResult; techStack: Partial<TechStack> } {
  const findings: Finding[] = [];
  const techStack: Partial<TechStack> = {};

  // Python project
  if (pythonConfig) {
    const allPyDeps = getAllPythonDeps(pythonConfig);
    techStack.language = "Python";

    // Detect Python framework
    let framework: string | null = null;
    for (const [dep, info] of Object.entries(PYTHON_FRAMEWORKS)) {
      if (allPyDeps.includes(dep)) {
        framework = info.name;
        findings.push({ severity: "pass", message: `${info.name} detected`, detail: info.type });
        break;
      }
    }
    techStack.framework = framework;

    // Check for type hints (mypy / pyright)
    const hasTypeChecking = allPyDeps.includes("mypy") || allPyDeps.includes("pyright");
    if (hasTypeChecking) {
      findings.push({ severity: "pass", message: "Type checking enabled (mypy/pyright)" });
    } else {
      findings.push({ severity: "warn", message: "No type checker detected — consider adding mypy or pyright" });
    }

    // Detect if it's also a JS project (monorepo)
    if (pkg) {
      findings.push({ severity: "pass", message: "Hybrid project: both Python and JS/TS detected" });
    }

    if (!framework) {
      // Check for manage.py (Django without explicit dep)
      const hasManagePy = tree.some((e) => e.path === "manage.py" || e.path.endsWith("/manage.py"));
      if (hasManagePy) {
        framework = "Django";
        techStack.framework = "Django";
        findings.push({ severity: "pass", message: "Django detected (manage.py found)", detail: "fullstack" });
      } else {
        findings.push({ severity: "warn", message: "Could not detect a known Python framework" });
      }
    }

    const score = framework ? (hasTypeChecking ? 95 : 75) : 40;
    return { result: { score, label: "Project Type", findings }, techStack };
  }

  // JS/TS project (existing logic)
  if (!pkg) {
    return {
      result: { score: 0, label: "Project Type", findings: [{ severity: "fail", message: "No package.json or Python config found" }] },
      techStack,
    };
  }

  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

  // Detect framework
  let framework: string | null = null;
  for (const [dep, info] of Object.entries(FRAMEWORKS)) {
    if (allDeps[dep]) {
      framework = info.name;
      const version = allDeps[dep];
      findings.push({ severity: "pass", message: `${info.name} ${version} detected`, detail: info.type });
      break;
    }
  }
  techStack.framework = framework;

  // Detect language
  const hasTS = !!allDeps.typescript;
  techStack.language = hasTS ? "TypeScript" : "JavaScript";
  findings.push({
    severity: hasTS ? "pass" : "warn",
    message: hasTS ? "TypeScript enabled" : "No TypeScript detected — consider adding type safety",
  });

  // Detect styling
  for (const [dep, name] of Object.entries(STYLING)) {
    if (allDeps[dep]) {
      techStack.styling = name;
      findings.push({ severity: "pass", message: `${name} for styling` });
      break;
    }
  }

  // Detect state management
  for (const [dep, name] of Object.entries(STATE)) {
    if (allDeps[dep]) {
      techStack.stateManagement = name;
      break;
    }
  }

  // Detect UI library
  for (const [dep, name] of Object.entries(UI_LIBS)) {
    if (allDeps[dep]) {
      techStack.ui = name;
      break;
    }
  }

  if (!framework) {
    findings.push({ severity: "warn", message: "Could not detect a known framework" });
  }

  const score = framework ? (hasTS ? 95 : 75) : 40;
  return { result: { score, label: "Project Type", findings }, techStack };
}
