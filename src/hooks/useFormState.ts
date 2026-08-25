import { useContext, useMemo } from "react";
import { FormStateContext, IFormState } from "../context/FormState";

function useFormState(): IFormState {
  const {
    formErrors,
    setFormErrors,
    isImageBuildActive,
    setIsImageBuildActive,
  } = useContext(FormStateContext) as IFormState;

  return useMemo(
    () => ({
      formErrors,
      setFormErrors,
      isImageBuildActive,
      setIsImageBuildActive,
    }),
    [
      formErrors,
      setFormErrors,
      isImageBuildActive,
      setIsImageBuildActive,
    ],
  );
}

export default useFormState;
