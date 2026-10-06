import { createContext, PropsWithChildren, useMemo, useState } from "react";

import {
  buildGitPullerPath,
  parseGitPullerPath,
  TGitPullerConfig,
} from "../utils/permalink";

type TPermalinkValues = { [key: string]: string }

export type TGitPullerValues = Required<TGitPullerConfig>;

interface IPermalink {
  permalinkParseError: boolean;
  permalinkValues: TPermalinkValues;
  autoStartOnLoad: boolean;
  autoStart: boolean;
  setAutoStart: (value: boolean) => void;
  gitPuller: TGitPullerValues;
  setGitPuller: (value: TGitPullerValues) => void;
  spawnNextUrl: string | null;
  copyPermalink: () => Promise<void>;
  setPermalinkValue: (key: string, value: string) => void;
}

const queryParamName = "fancy-forms-config";
const autoStartKey = "autoStart";
const gitPullerKeys: Record<keyof TGitPullerValues, string> = {
  repo: "gitPuller:repo",
  branch: "gitPuller:branch",
  filePath: "gitPuller:filePath",
};
const emptyGitPuller: TGitPullerValues = { repo: "", branch: "", filePath: "" };

export const PermalinkContext = createContext<IPermalink>(null);
export const PermalinkProvider = ({ children }: PropsWithChildren) => {
  const [permalinkParseError, setPermalinkParseError] = useState<boolean>(false);

  const urlParams: TPermalinkValues = useMemo(() => {
    let hash = window.location.hash;
    if (hash.startsWith("#")) {
      hash = hash.slice(1);
    }
    const params = new URLSearchParams(hash);

    const formConfig = params.get(queryParamName);
    if (formConfig) {
      try {
        return JSON.parse(formConfig);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error parsing form config", e);
        setPermalinkParseError(true);
      }
    }
    return {};
  }, []);

  // Older links carried the nbgitpuller path in the spawn page's ?next=.
  const queryGitPuller = useMemo(() => {
    const next = new URLSearchParams(window.location.search).get("next");
    return next ? parseGitPullerPath(next) : null;
  }, []);

  const [autoStartOnLoad, setAutoStartOnLoad] = useState<boolean>(
    urlParams[autoStartKey] === "true",
  );
  const [autoStart, setAutoStart] = useState<boolean>(autoStartOnLoad);
  const [gitPuller, setGitPuller] = useState<TGitPullerValues>(() => {
    if (urlParams[gitPullerKeys.repo]) {
      return {
        repo: urlParams[gitPullerKeys.repo],
        branch: urlParams[gitPullerKeys.branch] || "",
        filePath: urlParams[gitPullerKeys.filePath] || "",
      };
    }
    return queryGitPuller ? { ...emptyGitPuller, ...queryGitPuller } : emptyGitPuller;
  });

  // JupyterHub follows a posted "next" once the server is up, in preference to
  // the one in the page's query. An empty value cancels a git-pull from an
  // older link after the repository was cleared.
  const spawnNextUrl = gitPuller.repo.trim()
    ? buildGitPullerPath(gitPuller)
    : queryGitPuller ? "" : null;

  const resetParams = () => {
    for (const key of Object.keys(urlParams)) {
      delete urlParams[key];
    }
    setAutoStartOnLoad(false);
    setAutoStart(false);
    setGitPuller(emptyGitPuller);
  };

  const setPermalinkValue = (key: string, value: string) => {
    if (key === "profile" && value !== urlParams["profile"]) resetParams();
    urlParams[key] = value;
  };

  const copyPermalink = () => {
    const config: TPermalinkValues = { ...urlParams };
    for (const key of [autoStartKey, ...Object.values(gitPullerKeys)]) {
      delete config[key];
    }
    config[autoStartKey] = autoStart ? "true" : "false";
    if (gitPuller.repo.trim()) {
      for (const [field, key] of Object.entries(gitPullerKeys)) {
        config[key] = gitPuller[field as keyof TGitPullerValues].trim();
      }
    }

    const search = new URLSearchParams(location.search);
    search.delete("next");
    const query = search.toString();

    const params = new URLSearchParams();
    params.set(queryParamName, JSON.stringify(config));
    const link = `${location.origin}/hub/login${query ? `?${query}&` : "?"}next=/hub/spawn%23${params.toString()}`;
    return navigator.clipboard.writeText(link);
  };

  const contextValue = {
    permalinkParseError,
    permalinkValues: urlParams,
    autoStartOnLoad,
    autoStart,
    setAutoStart,
    gitPuller,
    setGitPuller,
    spawnNextUrl,
    setPermalinkValue,
    copyPermalink
  };

  return (
    <PermalinkContext.Provider value={contextValue}>
      {children}
    </PermalinkContext.Provider>
  );
};
