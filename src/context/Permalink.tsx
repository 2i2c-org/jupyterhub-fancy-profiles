import { createContext, PropsWithChildren, useContext } from "react";
import { SpawnerFormContext } from "../state";

interface IPermalink {
  copyPermalink: () => Promise<void>;
  setPermalinkValue: (key: string, value: string) => void;
}

const urlParams = new URLSearchParams(location.search);
const resettableParams = [
  "binderProvider",
  "binderRepo",
  "ref",
  "unlisted_choice"
];

export const PermalinkContext = createContext<IPermalink>(null);
export const PermalinkProvider = ({ children }: PropsWithChildren) => {
  const { profile } = useContext(SpawnerFormContext);
  const resetParams = () => {
    const resetFields = [
      ...resettableParams,
      ...Object.keys(profile.profile_options)
    ];

    for (const i in resetFields) {
      urlParams.delete(resetFields[i]);
    }
  };

  const setPermalinkValue = (key: string, value: string) => {
    urlParams.set(key, value);
    if (key === "profile") resetParams();
  };

  const copyPermalink = () => {
    const link = `${location.origin}${location.pathname}?${urlParams.toString()}`;
    return navigator.clipboard.writeText(link);
  };

  const contextValue = {
    setPermalinkValue,
    copyPermalink
  };

  return (
    <PermalinkContext.Provider value={contextValue}>
      {children}
    </PermalinkContext.Provider>
  );
};
