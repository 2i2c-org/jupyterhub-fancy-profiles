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
  isBuildingImage: boolean;
  setIsBuildingImage: Dispatch<SetStateAction<boolean>>;
}

export const FormStateContext = createContext<IFormState>(null);

export const FormStateProvider = ({ children }: PropsWithChildren) => {
  const [formErrors, setFormErrors] = useState<Element[]>([]);
  const [isImageBuildActive, setIsImageBuildActive] = useState<boolean>(false);
  const [isBuildingImage, setIsBuildingImage] = useState<boolean>(false);

  const contextValue = useMemo(() => ({
    formErrors,
    setFormErrors,
    isImageBuildActive,
    setIsImageBuildActive,
    isBuildingImage,
    setIsBuildingImage,
  }), [
    formErrors,
    setFormErrors,
    isImageBuildActive,
    setIsImageBuildActive,
    isBuildingImage,
    setIsBuildingImage,
  ]);

  return (
    <FormStateContext.Provider value={contextValue}>
      {children}
    </FormStateContext.Provider>
  );
};
