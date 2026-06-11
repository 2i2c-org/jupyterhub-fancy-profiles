import { useContext, useMemo } from "react";
import { FormStateContext, IFormState } from "../context/FormState";

function useFormState(): IFormState {
  const {
    formErrors,
    setFormErrors,
    buildImageSelected,
    setBuildImageSelected,
    isBuildingImage,
    setIsBuildingImage,
  } = useContext(FormStateContext) as IFormState;

  return useMemo(
    () => ({
      formErrors,
      setFormErrors,
      buildImageSelected,
      setBuildImageSelected,
      isBuildingImage,
      setIsBuildingImage,
    }),
    [
      formErrors,
      setFormErrors,
      buildImageSelected,
      setBuildImageSelected,
      isBuildingImage,
      setIsBuildingImage,
    ],
  );
}

export default useFormState;
