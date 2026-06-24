import { Dispatch, SetStateAction } from "react";

export const collectFormErrors = (
  form: HTMLFormElement,
  setFormErrors: Dispatch<SetStateAction<Element[]>>,
) => {
  queueMicrotask(() => {
    const errors = form.getElementsByClassName("invalid-feedback");
    setFormErrors(Array.from(errors));
  });
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, 100);
};

export const cacheFormValues = (
  form: HTMLFormElement,
  cacheChoiceOption: (fieldName: string, choice: string) => void,
  cacheRepositorySelection: (fieldName: string, repository: string, ref: string) => void,
) => {
  const cacheUnlistedChoices = form.getElementsByClassName("cache-unlisted-choice");
  Array.from(cacheUnlistedChoices).forEach((el) => {
    const { id, value } = el as HTMLInputElement;
    cacheChoiceOption(id, value);
  });

  const cacheRepositories = form.getElementsByClassName("cache-repository");
  Array.from(cacheRepositories).forEach((el) => {
    const { id, value } = el as HTMLInputElement;
    if (id.endsWith("--repo")) {
      const fieldName = id.slice(0, -6);
      const refField = form.querySelector(`#${CSS.escape(`${fieldName}--ref`)}`);
      if (refField) {
        cacheRepositorySelection(fieldName, value, (refField as HTMLInputElement).value);
      }
    }
  });
};

export const preBuildValidate = (form: HTMLFormElement): boolean => {
  let firstInvalid: HTMLInputElement | null = null;
  form.querySelectorAll<HTMLInputElement>("input, select, textarea").forEach((field) => {
    // Hidden text input for dynamically buit image name (input is empty)
    if (field.dataset.dynamicBuild === "true") return;
    if (field.disabled) return;
    if (!field.checkValidity()) {
      if (!firstInvalid) firstInvalid = field;
    }
  });
  if (firstInvalid) {
    firstInvalid!.reportValidity();
    return false;
  }
  return true;
};
