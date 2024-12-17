import { createContext, useEffect, useMemo, useState } from "react";
import { hasDynamicImageBuilding } from "./utils";

export const SpawnerFormContext = createContext();

function isDynamicImageProfile(profile) {
  const { profile_options } = profile;

  if (!profile_options) return false;

  return Object.entries(profile_options).some(([key, option]) =>
    hasDynamicImageBuilding(key, option),
  );
}

export const SpawnerFormProvider = ({ children }) => {
  const profileList = window.profileList;
  const defaultProfile =
    profileList.find((profile) => profile.default === true) || profileList[0];
  const [selectedProfile, setProfile] = useState(defaultProfile.slug);

  const profile = useMemo(() => {
    return profileList.find(({ slug }) => slug === selectedProfile);
  }, [selectedProfile]);

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  const { binderProvider, binderRepo, ref } = params;

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
