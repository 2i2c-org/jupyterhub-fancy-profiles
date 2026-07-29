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

    // Any "next" already on the page belongs to the link that opened it;
    // keeping it would leave the copied link with two competing destinations.
    const search = new URLSearchParams(location.search);
    search.delete("next");
    const query = search.toString();
    const prefix = `${location.origin}/hub/login${query ? `?${query}&` : "?"}next=`;

    if (gitPuller?.repo) {
      // nbgitpuller runs once the server is up, so it is chained onto the spawn
      // page as its own "next". That gives the spawn URL a query of its own,
      // which is read after this "next" has already been decoded once — so the
      // whole thing is encoded here as well. With only one layer, the "&"
      // separating the git-pull parameters breaks out of the value and its
      // branch and urlpath end up as stray parameters on the spawn page.
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
