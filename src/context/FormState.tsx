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

  buildImageSelected: (() => Promise<void>) | null;
  setBuildImageSelected: Dispatch<SetStateAction<(() => Promise<void>) | null>>;
  isBuildingImage: boolean;
  setIsBuildingImage: Dispatch<SetStateAction<boolean>>;
}

export const FormStateContext = createContext<IFormState>(null);

export const FormStateProvider = ({ children }: PropsWithChildren) => {
  const [formErrors, setFormErrors] = useState<Element[]>([]);
  const [buildImageSelected, setBuildImageSelected] = useState<(() => Promise<void>) | null>(null);
  const [isBuildingImage, setIsBuildingImage] = useState<boolean>(false);

  const contextValue = useMemo(() => ({
    formErrors,
    setFormErrors,
    buildImageSelected,
    setBuildImageSelected,
    isBuildingImage,
    setIsBuildingImage,
  }), [
    formErrors,
    setFormErrors,
    buildImageSelected,
    setBuildImageSelected,
    isBuildingImage,
    setIsBuildingImage,
  ]);

  return (
    <FormStateContext.Provider value={contextValue}>
      {children}
    </FormStateContext.Provider>
  );
};
