import { describe, expect, test } from "@jest/globals";

import {
  buildGitPullerPath,
  parseGitPullerPath,
  parseRepositoryUrl,
  repositoryDirectoryName,
} from "./permalink";

describe("repositoryDirectoryName", () => {
  test.each([
    ["https://github.com/org/repo", "repo"],
    ["https://github.com/org/repo/", "repo"],
    ["https://github.com/org/repo.git", "repo"],
    ["https://github.com/org/repo.git/", "repo"],
    ["  https://github.com/org/repo  ", "repo"],
  ])("%s -> %s", (repo, expected) => {
    expect(repositoryDirectoryName(repo)).toEqual(expected);
  });
});

describe("parseRepositoryUrl", () => {
  test("splits a GitHub file URL", () => {
    expect(
      parseRepositoryUrl(
        "https://github.com/org/repo/blob/main/notebooks/example.ipynb",
      ),
    ).toEqual({
      repo: "https://github.com/org/repo",
      branch: "main",
      filePath: "notebooks/example.ipynb",
    });
  });

  test("splits a GitHub directory URL", () => {
    expect(
      parseRepositoryUrl("https://github.com/org/repo/tree/v1.0/notebooks"),
    ).toEqual({
      repo: "https://github.com/org/repo",
      branch: "v1.0",
      filePath: "notebooks",
    });
  });

  test("splits a GitLab file URL", () => {
    expect(
      parseRepositoryUrl("https://gitlab.com/org/repo/-/blob/main/example.ipynb"),
    ).toEqual({
      repo: "https://gitlab.com/org/repo",
      branch: "main",
      filePath: "example.ipynb",
    });
  });

  test("returns null for a plain repository URL", () => {
    expect(parseRepositoryUrl("https://github.com/org/repo")).toBeNull();
  });

  test("returns null for a partially typed URL", () => {
    expect(parseRepositoryUrl("https://github.com/org/repo/blob/")).toBeNull();
  });
});

describe("buildGitPullerPath", () => {
  test("prefixes the file path with the repository directory", () => {
    const path = buildGitPullerPath({
      repo: "https://github.com/org/repo",
      branch: "main",
      filePath: "notebooks/example.ipynb",
    });

    const params = new URLSearchParams(path.split("?")[1]);
    expect(path.startsWith("/hub/user-redirect/git-pull?")).toBe(true);
    expect(params.get("repo")).toEqual("https://github.com/org/repo");
    expect(params.get("branch")).toEqual("main");
    expect(params.get("urlpath")).toEqual("lab/tree/repo/notebooks/example.ipynb");
  });

  test("opens the repository folder when no file is given", () => {
    const path = buildGitPullerPath({ repo: "https://github.com/org/repo" });

    const params = new URLSearchParams(path.split("?")[1]);
    expect(params.get("urlpath")).toEqual("lab/tree/repo");
    expect(params.has("branch")).toBe(false);
  });

  test("ignores a leading slash on the file path", () => {
    const path = buildGitPullerPath({
      repo: "https://github.com/org/repo",
      filePath: "/example.ipynb",
    });

    const params = new URLSearchParams(path.split("?")[1]);
    expect(params.get("urlpath")).toEqual("lab/tree/repo/example.ipynb");
  });
});

describe("parseGitPullerPath", () => {
  test.each([
    { repo: "https://github.com/org/repo", branch: "main", filePath: "a/b.ipynb" },
    { repo: "https://github.com/org/repo", branch: "", filePath: "" },
    { repo: "https://gitlab.com/org/repo.git", branch: "v1", filePath: "x.ipynb" },
  ])("round-trips %s", (config) => {
    expect(parseGitPullerPath(buildGitPullerPath(config))).toEqual(config);
  });

  test("returns null for a path that is not nbgitpuller", () => {
    expect(parseGitPullerPath("/hub/spawn?next=/lab")).toBeNull();
  });

  test("returns null when there is no repository", () => {
    expect(parseGitPullerPath("/hub/user-redirect/git-pull?branch=main")).toBeNull();
  });
});
