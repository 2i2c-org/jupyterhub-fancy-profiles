import { createContext, PropsWithChildren, useMemo } from "react";

type TPermalinkValues = { [key: string]: string }

interface IPermalink {
  permalinkValues: TPermalinkValues;
  copyPermalink: () => Promise<void>;
  setPermalinkValue: (key: string, value: string) => void;
}

const queryParamName = "fancy-forms-config";

export const PermalinkContext = createContext<IPermalink>(null);
export const PermalinkProvider = ({ children }: PropsWithChildren) => {
  const urlParams: TPermalinkValues = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return JSON.parse(params.get(queryParamName)) || {};
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
    const params = new URLSearchParams(location.search);
    params.set(queryParamName, JSON.stringify(urlParams));
    const link = `${location.origin}${location.pathname}?${params.toString()}`;
    return navigator.clipboard.writeText(link);
  };

  const contextValue = {
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
