import { useContext, useMemo } from "react";
import { FormStateContext, IFormState } from "../context/FormState";

function useFormState(): IFormState {
  const { formErrors, setFormErrors } = useContext(FormStateContext) as IFormState;

  return useMemo(
    () => ({
      formErrors,
      setFormErrors,
    }),
    [formErrors, setFormErrors],
  );
}

export default useFormState;
