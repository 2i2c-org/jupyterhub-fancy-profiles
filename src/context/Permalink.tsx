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

    const search = new URLSearchParams(location.search);
    search.delete("next");
    const query = search.toString();
    const prefix = `${location.origin}/hub/login${query ? `?${query}&` : "?"}next=`;

    if (gitPuller?.repo) {
      const spawnUrl =
        `/hub/spawn?next=${encodeURIComponent(buildGitPullerPath(gitPuller))}` +
        `#${queryParamName}=${JSON.stringify(urlParams)}`;
      return navigator.clipboard.writeText(prefix + encodeURIComponent(spawnUrl));
    }

    const params = new URLSearchParams();
    params.set(queryParamName, JSON.stringify(urlParams));
    return navigator.clipboard.writeText(`${prefix}/hub/spawn%23${params.toString()}`);
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
