import { useContext, useMemo } from "react";
import { FormStateContext, IFormState } from "../context/FormState";

function useFormState(): IFormState {
  const {
    formErrors,
    setFormErrors,
    isImageBuildActive,
    setIsImageBuildActive,
    isBuildingImage,
    setIsBuildingImage,
  } = useContext(FormStateContext) as IFormState;

  return useMemo(
    () => ({
      formErrors,
      setFormErrors,
      isImageBuildActive,
      setIsImageBuildActive,
      isBuildingImage,
      setIsBuildingImage,
    }),
    [
      formErrors,
      setFormErrors,
      isImageBuildActive,
      setIsImageBuildActive,
      isBuildingImage,
      setIsBuildingImage,
    ],
  );
}

export default useFormState;
