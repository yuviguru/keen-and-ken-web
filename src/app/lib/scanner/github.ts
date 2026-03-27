import { RepoMeta, TreeEntry } from "./types";

const GITHUB_API = "https://api.github.com";

function headers(): HeadersInit {
  const h: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "VibeRefactor-Scanner",
  };
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const patterns = [
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/.*)?$/,
    /^github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/.*)?$/,
  ];
  for (const p of patterns) {
    const m = url.trim().match(p);
    if (m) return { owner: m[1], repo: m[2] };
  }
  return null;
}

export async function fetchRepoMeta(owner: string, repo: string): Promise<RepoMeta> {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers: headers() });
  if (res.status === 404) throw new Error("REPO_NOT_FOUND");
  if (res.status === 403) throw new Error("RATE_LIMITED");
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const data = await res.json();
  return {
    owner,
    name: repo,
    defaultBranch: data.default_branch,
    description: data.description,
    stars: data.stargazers_count,
    language: data.language,
    isPrivate: data.private,
  };
}

export async function fetchTree(owner: string, repo: string, branch: string): Promise<{ entries: TreeEntry[]; truncated: boolean }> {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, { headers: headers() });
  if (!res.ok) throw new Error(`Failed to fetch tree: ${res.status}`);
  const data = await res.json();
  const entries: TreeEntry[] = (data.tree || []).map((e: { path: string; type: string; size?: number }) => ({
    path: e.path,
    type: e.type as "blob" | "tree",
    size: e.size,
  }));
  return { entries, truncated: !!data.truncated };
}

export async function fetchFileContent(owner: string, repo: string, path: string): Promise<string | null> {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, { headers: headers() });
  if (res.status === 404) return null;
  if (!res.ok) return null;
  const data = await res.json();
  if (data.encoding === "base64" && data.content) {
    return Buffer.from(data.content, "base64").toString("utf-8");
  }
  return null;
}

export async function fetchMultipleFiles(owner: string, repo: string, paths: string[]): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  const settled = await Promise.allSettled(
    paths.map(async (p) => {
      const content = await fetchFileContent(owner, repo, p);
      if (content !== null) results.set(p, content);
    })
  );
  // Just collect what we got, ignore failures
  void settled;
  return results;
}
