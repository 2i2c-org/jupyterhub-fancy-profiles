export type TGitPullerConfig = {
  repo: string;
  branch?: string;
  filePath?: string;
};

// Matches the segment that separates a repository URL from the branch and
// path inside it, for GitHub (/blob/, /tree/) and GitLab (/-/blob/, /-/tree/).
const BLOB_OR_TREE = /\/(?:-\/)?(?:blob|tree)\//;

/**
 * nbgitpuller clones a repository into a directory named after it, so paths
 * opened from the pulled content have to be prefixed with that name.
 */
export function repositoryDirectoryName(repo: string): string {
  const cleaned = repo.trim().replace(/\/+$/, "").replace(/\.git$/, "");
  const segments = cleaned.split("/");
  return segments[segments.length - 1] || "";
}

/**
 * Splits a link to a file or directory within a repository into the parts
 * nbgitpuller needs, so that users can paste a URL straight from their
 * browser instead of filling in the fields by hand.
 *
 * Returns null when the URL doesn't point inside a repository.
 */
export function parseRepositoryUrl(url: string): TGitPullerConfig | null {
  const trimmed = url.trim();
  const match = BLOB_OR_TREE.exec(trimmed);
  if (!match) return null;

  const repo = trimmed.slice(0, match.index);
  const rest = trimmed.slice(match.index + match[0].length);
  if (!repo || !rest) return null;

  // A branch containing "/" is indistinguishable from a path here, so the
  // first segment is assumed to be the branch.
  const [branch, ...pathParts] = rest.split("/");
  return { repo, branch, filePath: pathParts.join("/") };
}

/**
 * Reads back the parts of an nbgitpuller endpoint built by
 * buildGitPullerPath, so that a link being edited keeps its repository.
 */
export function parseGitPullerPath(path: string): TGitPullerConfig | null {
  const [base, query] = path.split("?");
  if (!base.endsWith("/git-pull") || !query) return null;

  const params = new URLSearchParams(query);
  const repo = params.get("repo");
  if (!repo) return null;

  // The first segment of urlpath is the directory the repository was cloned
  // into, which is derived from the repository name rather than chosen.
  const [, ...pathParts] = (params.get("urlpath") || "")
    .replace(/^lab\/tree\//, "")
    .split("/");

  return {
    repo,
    branch: params.get("branch") || "",
    filePath: pathParts.join("/"),
  };
}

/**
 * Builds the nbgitpuller endpoint that clones the repository and opens the
 * requested file once the server has started.
 */
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
