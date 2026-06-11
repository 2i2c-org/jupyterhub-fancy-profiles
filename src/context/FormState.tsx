import {
  createContext,
  PropsWithChildren,
  useState,
  useMemo,
  Dispatch,
  SetStateAction
} from "react";

export interface IFormState {
  formErrors: Element[];
  setFormErrors: Dispatch<SetStateAction<Element[]>>;
}

export const FormStateContext = createContext<IFormState>(null);

export const FormStateProvider = ({ children }: PropsWithChildren) => {
  const [formErrors, setFormErrors] = useState<Element[]>([]);

  const contextValue = useMemo(() => ({
    formErrors,
    setFormErrors,
  }), [
    formErrors,
    setFormErrors,
  ]);

  return (
    <FormStateContext.Provider value={contextValue}>
      {children}
    </FormStateContext.Provider>
  );
};
