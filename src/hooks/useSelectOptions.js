import { useMemo } from "react";

function useSelectOptions(config, customOptions = []) {
  const { choices, unlisted_choice } = config;
  const hasDefaultChoices = Object.keys(choices).length > 0;
  const options = useMemo(() => {
    const defaultChoices = Object.keys(choices).map((choiceName) => {
      return {
        value: choiceName,
        label: choices[choiceName].display_name,
        description: choices[choiceName].description,
      };
    });

    const extraChoices = [];
    if (unlisted_choice?.enabled) {
      extraChoices.push({
        value: "unlisted_choice",
        label: unlisted_choice.display_name_in_choices,
        description: unlisted_choice.description_in_choices,
      });
    }

    return [...defaultChoices, ...extraChoices, ...customOptions];
  }, [choices]);

  // The default choice is either the choice marked as default,
  // OR the first explicit choice
  // OR the first item from options which could be an extra or custom choice
  const defaultChoiceName =
    Object.keys(choices).find((choiceName) => choices[choiceName].default) ||
    (Object.keys(choices).length > 0
      ? Object.keys(choices)[0]
      : options[0].value);

  const defaultOption = options.find(
    (option) => option.value === defaultChoiceName,
  );

  return {
    options,
    defaultOption,
    hasDefaultChoices,
  };
}

export default useSelectOptions;
