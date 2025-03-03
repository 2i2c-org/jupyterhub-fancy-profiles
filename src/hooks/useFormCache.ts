import { useContext, useMemo } from "react";
import { FormCacheContext, IFormCache } from "../context/FormCache";

function useFormCache(): IFormCache {
  const {
    getChoiceOptions,
    cacheChoiceOption
  } = useContext(FormCacheContext) as IFormCache;

  return useMemo(() => ({
    getChoiceOptions,
    cacheChoiceOption
  }), [
    getChoiceOptions,
    cacheChoiceOption
  ]);
}

export default useFormCache;
