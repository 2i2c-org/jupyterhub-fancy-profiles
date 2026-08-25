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

  isImageBuildActive: boolean;
  setIsImageBuildActive: Dispatch<SetStateAction<boolean>>;
}

export const FormStateContext = createContext<IFormState>(null);

export const FormStateProvider = ({ children }: PropsWithChildren) => {
  const [formErrors, setFormErrors] = useState<Element[]>([]);
  const [isImageBuildActive, setIsImageBuildActive] = useState<boolean>(false);

  const contextValue = useMemo(() => ({
    formErrors,
    setFormErrors,
    isImageBuildActive,
    setIsImageBuildActive,
  }), [
    formErrors,
    setFormErrors,
    isImageBuildActive,
    setIsImageBuildActive,
  ]);

  return (
    <FormStateContext.Provider value={contextValue}>
      {children}
    </FormStateContext.Provider>
  );
};
