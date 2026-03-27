import { CategoryResult, Finding, PackageJson, PythonConfig, TreeEntry } from "../types";

const ORMS: Record<string, string> = {
  prisma: "Prisma",
  "@prisma/client": "Prisma",
  typeorm: "TypeORM",
  sequelize: "Sequelize",
  mongoose: "Mongoose",
  drizzle: "Drizzle",
  "drizzle-orm": "Drizzle",
  knex: "Knex",
  "@supabase/supabase-js": "Supabase",
  firebase: "Firebase",
  "firebase-admin": "Firebase Admin",
};

const PYTHON_ORMS: Record<string, string> = {
  sqlalchemy: "SQLAlchemy",
  django: "Django ORM",
  tortoise: "Tortoise ORM",
  "tortoise-orm": "Tortoise ORM",
  peewee: "Peewee",
  mongoengine: "MongoEngine",
  pymongo: "PyMongo",
  psycopg2: "PostgreSQL (psycopg2)",
  "psycopg2-binary": "PostgreSQL (psycopg2)",
  asyncpg: "PostgreSQL (asyncpg)",
  sqlmodel: "SQLModel",
  alembic: "Alembic (migrations)",
  databases: "Databases (async)",
  motor: "Motor (async MongoDB)",
  redis: "Redis",
  "supabase": "Supabase",
  "firebase-admin": "Firebase Admin",
};

export function analyzeDatabase(
  pkg: PackageJson | null,
  pythonConfig: PythonConfig | null,
  tree: TreeEntry[]
): { result: CategoryResult; orm: string | null } {
  const findings: Finding[] = [];
  let score = 100;
  let orm: string | null = null;

  // Python ORM detection
  if (pythonConfig) {
    const allPyDeps = [...pythonConfig.requirements, ...pythonConfig.pyprojectDeps, ...pythonConfig.pyprojectDevDeps];

    for (const [dep, name] of Object.entries(PYTHON_ORMS)) {
      if (allPyDeps.includes(dep)) {
        orm = name;
        findings.push({ severity: "pass", message: `${name} detected` });
        break;
      }
    }

    // Django ORM detection via manage.py
    if (!orm && tree.some((e) => e.path === "manage.py")) {
      orm = "Django ORM";
      findings.push({ severity: "pass", message: "Django ORM detected (manage.py present)" });
    }

    // Check for Alembic migrations
    const hasAlembic = tree.some((e) => e.path.includes("alembic/") || e.path === "alembic.ini");
    const hasDjangoMigrations = tree.some((e) => e.path.match(/\/migrations\/\d{4}_/));

    if (hasAlembic) {
      findings.push({ severity: "pass", message: "Alembic migrations present" });
    } else if (hasDjangoMigrations) {
      findings.push({ severity: "pass", message: "Django migrations present" });
    } else if (orm && orm !== "Redis") {
      findings.push({ severity: "warn", message: "No migration files found — database changes may not be versioned" });
      score -= 10;
    }
  }

  // JS ORM detection
  if (pkg) {
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    if (!orm) {
      for (const [dep, name] of Object.entries(ORMS)) {
        if (allDeps[dep]) {
          orm = name;
          findings.push({ severity: "pass", message: `${name} detected` });
          break;
        }
      }
    }

    // Check for JS migrations
    if (!pythonConfig) {
      const hasMigrations = tree.some(
        (e) => e.path.includes("migrations/") || e.path.includes("prisma/migrations/") || e.path.includes("db/migrate")
      );
      if (orm && hasMigrations) {
        findings.push({ severity: "pass", message: "Database migrations present" });
      } else if (orm && !hasMigrations) {
        findings.push({ severity: "warn", message: "No migration files found — database changes may not be versioned" });
        score -= 10;
      }
    }
  }

  if (!orm) {
    // Check if it's frontend-only (no backend)
    const allJsDeps = pkg ? { ...pkg.dependencies, ...pkg.devDependencies } : {};
    const allPyDeps = pythonConfig ? [...pythonConfig.requirements, ...pythonConfig.pyprojectDeps] : [];
    const isBackend = allJsDeps.express || allJsDeps.fastify || allJsDeps["@nestjs/core"] || allJsDeps.hono ||
      allPyDeps.includes("django") || allPyDeps.includes("flask") || allPyDeps.includes("fastapi");

    if (!isBackend) {
      findings.push({ severity: "pass", message: "No database layer detected (appears frontend-only)" });
      return { result: { score: 80, label: "Database & ORM", findings }, orm };
    }
    findings.push({ severity: "warn", message: "Backend detected but no ORM/database library found" });
    score -= 15;
  }

  // Check for schema file
  const hasSchema = tree.some(
    (e) => e.path.includes("prisma/schema.prisma") || e.path.includes("schema.ts") || e.path.includes("models/") || e.path.includes("models.py")
  );
  if (hasSchema) {
    findings.push({ severity: "pass", message: "Database schema/models detected" });
  }

  // Check for seed files
  const hasSeed = tree.some(
    (e) => e.path.includes("seed") && e.type === "blob"
  );
  if (hasSeed) {
    findings.push({ severity: "pass", message: "Database seed file present" });
  }

  return { result: { score: Math.max(0, score), label: "Database & ORM", findings }, orm };
}
