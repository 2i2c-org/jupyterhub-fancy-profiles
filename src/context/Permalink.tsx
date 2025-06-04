import { createContext, PropsWithChildren } from "react";

type TPermalinkValues = { [key: string]: string }

interface IPermalink {
  permalinkValues: TPermalinkValues;
  copyPermalink: () => Promise<void>;
  setPermalinkValue: (key: string, value: string) => void;
}

const queryParamName = "fancy-forms-config";

const params = new URLSearchParams(location.search);
const urlParams: TPermalinkValues = JSON.parse(params.get(queryParamName)) || {};

export const PermalinkContext = createContext<IPermalink>(null);
export const PermalinkProvider = ({ children }: PropsWithChildren) => {
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
