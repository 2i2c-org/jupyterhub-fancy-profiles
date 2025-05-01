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
  } = useContext(FormCacheContext) as IFormCache;

  return useMemo(
    () => ({
      getChoiceOptions,
      cacheChoiceOption,
      getRepositoryOptions,
      getRefOptions,
      cacheRepositorySelection,
      removeChoiceOption,
    }),
    [
      getChoiceOptions,
      cacheChoiceOption,
      getRepositoryOptions,
      getRefOptions,
      cacheRepositorySelection,
      removeChoiceOption,
    ],
  );
}

export default useFormCache;
