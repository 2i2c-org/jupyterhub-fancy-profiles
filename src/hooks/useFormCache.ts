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
    buildImageSelected,
    setBuildImageSelected,
    isBuildingImage,
    setIsBuildingImage,
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
      buildImageSelected,
      setBuildImageSelected,
      isBuildingImage,
      setIsBuildingImage,
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
      buildImageSelected,
      setBuildImageSelected,
      isBuildingImage,
      setIsBuildingImage,
    ],
  );
}

export default useFormCache;
