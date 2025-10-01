import { useContext, useMemo } from "react";
import { FormCacheContext, IFormCache } from "../context/FormCache";

function useFormCache(): IFormCache {
  const {
    getChoiceOptions,
    cacheChoiceOption,
    getRepositoryOptions,
    getRefOptions,
    cacheRepositorySelection,
    removeChoiceOption,
    removeRepositoryOption,
    removeRefOption,
    buildImageStart,
    setBuildImageStart,
  } = useContext(FormCacheContext) as IFormCache;

  return useMemo(
    () => ({
      getChoiceOptions,
      cacheChoiceOption,
      getRepositoryOptions,
      getRefOptions,
      cacheRepositorySelection,
      removeChoiceOption,
      removeRepositoryOption,
      removeRefOption,
      buildImageStart,
      setBuildImageStart,
    }),
    [
      getChoiceOptions,
      cacheChoiceOption,
      getRepositoryOptions,
      getRefOptions,
      cacheRepositorySelection,
      removeChoiceOption,
      removeRepositoryOption,
      removeRefOption,
      buildImageStart,
      setBuildImageStart,
    ],
  );
}

export default useFormCache;
