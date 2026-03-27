import { NextRequest, NextResponse } from "next/server";
import { parseGitHubUrl } from "@/app/lib/scanner/github";
import { scanRepository } from "@/app/lib/scanner";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later.", code: "RATE_LIMITED" },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { repoUrl } = body;

    if (!repoUrl || typeof repoUrl !== "string") {
      return NextResponse.json(
        { error: "Missing repoUrl", code: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      return NextResponse.json(
        { error: "Invalid GitHub URL. Please provide a URL like https://github.com/owner/repo", code: "INVALID_URL" },
        { status: 400 }
      );
    }

    const report = await scanRepository(parsed.owner, parsed.repo);
    return NextResponse.json(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message === "REPO_NOT_FOUND") {
      return NextResponse.json(
        { error: "Repository not found. Make sure it exists and is public.", code: "REPO_NOT_FOUND" },
        { status: 404 }
      );
    }
    if (message === "REPO_PRIVATE") {
      return NextResponse.json(
        { error: "This repository is private. We can only scan public repos.", code: "REPO_PRIVATE" },
        { status: 403 }
      );
    }
    if (message === "RATE_LIMITED") {
      return NextResponse.json(
        { error: "GitHub API rate limit reached. Try again in a few minutes.", code: "GITHUB_RATE_LIMITED" },
        { status: 429 }
      );
    }

    console.error("Scan error:", message);
    return NextResponse.json(
      { error: "Something went wrong while scanning. Please try again.", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
