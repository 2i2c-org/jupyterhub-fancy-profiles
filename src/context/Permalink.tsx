import { createContext, PropsWithChildren, useMemo, useState } from "react";

type TPermalinkValues = { [key: string]: string }

interface IPermalink {
  permalinkParseError: boolean;
  permalinkValues: TPermalinkValues;
  copyPermalink: () => Promise<void>;
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
        console.error("Error parsing form config", e);
        setPermalinkParseError(true);
      }
    }
    return {};
  }, []);

  const resetParams = () => {
    for (const key of Object.keys(urlParams)) {
      delete urlParams[key];
    }
  };

  const setPermalinkValue = (key: string, value: string) => {
    if (key === "profile" && value !== urlParams["profile"]) resetParams();
    urlParams[key] = value;
  };

  const copyPermalink = () => {
    const params = new URLSearchParams();
    params.set(queryParamName, JSON.stringify(urlParams));
    const link = `${location.origin}/hub/login${location.search ? location.search + "&" : "?"}next=/hub/spawn%23${params.toString()}`;
    return navigator.clipboard.writeText(link);
  };

  const contextValue = {
    permalinkParseError,
    permalinkValues: urlParams,
    setPermalinkValue,
    copyPermalink
  };

  return (
    <PermalinkContext.Provider value={contextValue}>
      {children}
    </PermalinkContext.Provider>
  );
};
