import {
  createContext,
  PropsWithChildren,
  useMemo,
  useState,
} from "react";
import {
  IJupytherHubWindowObject,
  IProfile,
  ISearchParams,
} from "./types/config";

interface ISpawnerFormContext {
  profileList: IProfile[];
  profile: IProfile;
  setProfile: React.Dispatch<React.SetStateAction<string>>;
  urlSearchParams: ISearchParams;
}

export const SpawnerFormContext = createContext<ISpawnerFormContext>(null);

export const SpawnerFormProvider = ({ children }: PropsWithChildren) => {
  const urlSearchParams = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams: URLSearchParams, prop: string) =>
      searchParams.get(prop),
  }) as unknown as ISearchParams;

  const { profile: profileParam } = urlSearchParams;

  const profileList = (window as IJupytherHubWindowObject).profileList;
  const defaultProfile =
    profileList.find((profile) => profile.default === true) || profileList[0];
  const [selectedProfile, setProfile] = useState(profileParam || defaultProfile.slug);

  const profile = useMemo(() => {
    return profileList.find(({ slug }) => slug === selectedProfile);
  }, [selectedProfile]);

  const value = {
    profileList,
    profile,
    setProfile,
    urlSearchParams
  };

  return (
    <SpawnerFormContext.Provider value={value}>
      {children}
    </SpawnerFormContext.Provider>
  );
};
