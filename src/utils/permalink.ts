export type TGitPullerConfig = {
  repo: string;
  branch?: string;
  filePath?: string;
};

const BLOB_OR_TREE = /\/(?:-\/)?(?:blob|tree)\//;


export function repositoryDirectoryName(repo: string): string {
  const cleaned = repo.trim().replace(/\/+$/, "").replace(/\.git$/, "");
  const segments = cleaned.split("/");
  return segments[segments.length - 1] || "";
}


export function parseRepositoryUrl(url: string): TGitPullerConfig | null {
  const trimmed = url.trim();
  const match = BLOB_OR_TREE.exec(trimmed);
  if (!match) return null;

  const repo = trimmed.slice(0, match.index);
  const rest = trimmed.slice(match.index + match[0].length);
  if (!repo || !rest) return null;

  const [branch, ...pathParts] = rest.split("/");
  return { repo, branch, filePath: pathParts.join("/") };
}

export function parseGitPullerPath(path: string): TGitPullerConfig | null {
  const [base, query] = path.split("?");
  if (!base.endsWith("/git-pull") || !query) return null;

  const params = new URLSearchParams(query);
  const repo = params.get("repo");
  if (!repo) return null;

  const [, ...pathParts] = (params.get("urlpath") || "")
    .replace(/^lab\/tree\//, "")
    .split("/");

  return {
    repo,
    branch: params.get("branch") || "",
    filePath: pathParts.join("/"),
  };
}

export function buildGitPullerPath({
  repo,
  branch,
  filePath,
}: TGitPullerConfig): string {
  const params = new URLSearchParams();
  params.set("repo", repo.trim());
  if (branch?.trim()) {
    params.set("branch", branch.trim());
  }

  const directory = repositoryDirectoryName(repo);
  const path = filePath?.trim().replace(/^\/+/, "");
  params.set("urlpath", path ? `lab/tree/${directory}/${path}` : `lab/tree/${directory}`);

  return `/hub/user-redirect/git-pull?${params.toString()}`;
}
