import {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import { hasDynamicImageBuilding } from "./utils";
import {
  IJupytherHubWindowObject,
  IProfile,
  ISearchParams,
} from "./types/config";

interface ISpawnerFormContext {
  profileList: IProfile[];
  profile: IProfile;
  setProfile: React.Dispatch<React.SetStateAction<string>>;
  binderProvider: string;
  binderRepo: string;
  ref: string;
  paramsError: string;
  setCustomOption: boolean;
}

export const SpawnerFormContext = createContext<ISpawnerFormContext>(null);

function isDynamicImageProfile(profile: IProfile) {
  const { profile_options } = profile;

  if (!profile_options) return false;

  return Object.entries(profile_options).some(([key, option]) =>
    hasDynamicImageBuilding(key, option),
  );
}

export const SpawnerFormProvider = ({ children }: PropsWithChildren) => {
  const profileList = (window as IJupytherHubWindowObject).profileList;
  const defaultProfile =
    profileList.find((profile) => profile.default === true) || profileList[0];
  const [selectedProfile, setProfile] = useState(defaultProfile.slug);

  const profile = useMemo(() => {
    return profileList.find(({ slug }) => slug === selectedProfile);
  }, [selectedProfile]);

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams: URLSearchParams, prop: string) =>
      searchParams.get(prop),
  });
  const { binderProvider, binderRepo, ref } = params as ISearchParams;

  const paramsError = useMemo(() => {
    if (binderProvider && binderRepo && ref) {
      const profilesWithDynamicImageBuilding = profileList.filter(
        isDynamicImageProfile,
      );
      if (profilesWithDynamicImageBuilding.length > 1) {
        return "Unable to pre-select dynamic image building.";
      }
    }
  }, [binderProvider, binderRepo, ref]);

  const setCustomOption = binderProvider && binderRepo && ref && !paramsError;

  useEffect(() => {
    if (setCustomOption) {
      const dynamicImageProfile = profileList.find(isDynamicImageProfile);
      setProfile(dynamicImageProfile.slug);
    }
  }, [setCustomOption]);

  const value = {
    profileList,
    profile,
    setProfile,
    binderProvider,
    binderRepo,
    ref,
    paramsError,
    setCustomOption,
  };

  return (
    <SpawnerFormContext.Provider value={value}>
      {children}
    </SpawnerFormContext.Provider>
  );
};
