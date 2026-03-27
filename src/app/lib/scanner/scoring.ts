import { CategoryResult, Recommendation } from "./types";

const CATEGORY_WEIGHTS: Record<string, number> = {
  projectType: 10,
  dependencies: 15,
  structure: 20,
  codeQuality: 25,
  environment: 15,
  security: 10,
  database: 5,
  deadCode: 5,
};

export function computeOverallScore(categories: Record<string, CategoryResult>): number {
  let totalWeight = 0;
  let weightedSum = 0;

  for (const [key, result] of Object.entries(categories)) {
    const weight = CATEGORY_WEIGHTS[key] || 10;
    weightedSum += result.score * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

export function generateRecommendations(categories: Record<string, CategoryResult>): Recommendation[] {
  const recs: Recommendation[] = [];

  for (const [key, result] of Object.entries(categories)) {
    for (const finding of result.findings) {
      if (finding.severity === "fail") {
        recs.push({ priority: "high", category: key, message: finding.message });
      } else if (finding.severity === "warn" && result.score < 70) {
        recs.push({ priority: "medium", category: key, message: finding.message });
      }
    }
  }

  // Sort: high first, then medium, then low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recs.slice(0, 10); // Top 10 recommendations
}
