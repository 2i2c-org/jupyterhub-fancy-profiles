import { createContext, PropsWithChildren, useMemo, useState } from "react";

import {
  buildGitPullerPath,
  parseGitPullerPath,
  TGitPullerConfig,
} from "../utils/permalink";

type TPermalinkValues = { [key: string]: string }

export type TPermalinkOptions = {
  autoStart?: boolean;
  gitPuller?: TGitPullerConfig | null;
};

interface IPermalink {
  permalinkParseError: boolean;
  permalinkValues: TPermalinkValues;
  initialLinkOptions: TPermalinkOptions;
  copyPermalink: (options?: TPermalinkOptions) => Promise<void>;
  setPermalinkValue: (key: string, value: string) => void;
}

const queryParamName = "fancy-forms-config";

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

  // When the page was opened through a generated link, its options are shown
  // in the form so that copying a new link doesn't silently drop them.
  const initialLinkOptions: TPermalinkOptions = useMemo(() => {
    const next = new URLSearchParams(window.location.search).get("next");
    return {
      autoStart: urlParams["autoStart"] === "true",
      gitPuller: next ? parseGitPullerPath(next) : null,
    };
  }, [urlParams]);

  const resetParams = () => {
    for (const key of Object.keys(urlParams)) {
      delete urlParams[key];
    }
  };

  const setPermalinkValue = (key: string, value: string) => {
    if (key === "profile" && value !== urlParams["profile"]) resetParams();
    urlParams[key] = value;
  };

  const copyPermalink = (options: TPermalinkOptions = {}) => {
    const { autoStart = false, gitPuller = null } = options;

    setPermalinkValue("autoStart", autoStart ? "true" : "false");
    const params = new URLSearchParams();
    params.set(queryParamName, JSON.stringify(urlParams));

    // nbgitpuller runs after the server has started, so it is chained onto the
    // spawn page as its own "next" destination.
    const spawnPath = gitPuller?.repo
      ? `/hub/spawn?next=${encodeURIComponent(buildGitPullerPath(gitPuller))}`
      : "/hub/spawn";

    // Any "next" already on the page belongs to the link that opened it;
    // keeping it would leave the copied link with two competing destinations.
    const search = new URLSearchParams(location.search);
    search.delete("next");
    const query = search.toString();

    const link = `${location.origin}/hub/login${query ? `?${query}&` : "?"}next=${spawnPath}%23${params.toString()}`;
    return navigator.clipboard.writeText(link);
  };

  const contextValue = {
    permalinkParseError,
    permalinkValues: urlParams,
    initialLinkOptions,
    setPermalinkValue,
    copyPermalink
  };

  return (
    <PermalinkContext.Provider value={contextValue}>
      {children}
    </PermalinkContext.Provider>
  );
};
