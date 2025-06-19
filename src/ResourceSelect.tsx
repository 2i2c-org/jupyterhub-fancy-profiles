import { useContext, useState } from "react";
import useSelectOptions from "./hooks/useSelectOptions";
import { SpawnerFormContext } from "./state";
import { SelectField } from "./components/form/fields";
import { IProfileOption } from "./types/config";
import { ICustomOption } from "./types/fields";
import Combobox from "./components/form/Combobox";
import useFormCache from "./hooks/useFormCache";
import { PermalinkContext } from "./context/Permalink";

interface IResourceSelect {
  id: string;
  profile: string;
  config: IProfileOption;
  customOptions: ICustomOption[];
}

function ResourceSelect({
  id,
  profile,
  config,
  customOptions = [],
}: IResourceSelect) {
  const { display_name, unlisted_choice } = config;

  const { options, defaultOption, hasDefaultChoices } = useSelectOptions(
    config,
    customOptions,
  );
  const { profile: selectedProfile } = useContext(SpawnerFormContext);
  const { setPermalinkValue, permalinkValues } = useContext(PermalinkContext);
  const { getChoiceOptions, removeChoiceOption } = useFormCache();
  const FIELD_ID = `profile-option-${profile}--${id}`;
  const FIELD_ID_UNLISTED = `${FIELD_ID}--unlisted-choice`;

  const isActive = selectedProfile?.slug === profile;
  const setVal = isActive && permalinkValues["profile"] === selectedProfile.slug;

  const [value, setValue] = useState((setVal && permalinkValues[id]) || defaultOption?.value);
  const [unlistedChoiceValue, setUnlistedChoiceValue] = useState((setVal && permalinkValues[`${id}:unlisted_choice`]) || "");

  if (!(options.length > 0)) {
    return null;
  }

  if (isActive) {
    setPermalinkValue(id, value);
    setPermalinkValue(`${id}:unlisted_choice`, unlistedChoiceValue);
  }

  const selectedCustomOption = customOptions.find((opt) => opt.value === value);
  const choiceOptions = getChoiceOptions(FIELD_ID_UNLISTED);
  return (
    <>
      {(options.length > 1 || hasDefaultChoices) && (
        <SelectField
          id={FIELD_ID}
          label={display_name}
          options={options}
          defaultOption={defaultOption}
          value={value}
          onChange={(e) => setValue(e.value)}
          tabIndex={isActive ? 0 : -1}
          validate={
            isActive && {
              required: "Select a value.",
            }
          }
        />
      )}
      {value === "unlisted_choice" && (
        <Combobox
          id={FIELD_ID_UNLISTED}
          className={isActive ? "cache-unlisted-choice" : ""}
          label={unlisted_choice.display_name}
          value={unlistedChoiceValue}
          validate={
            isActive && {
              required: "Enter a value.",
              pattern: {
                value: unlisted_choice.validation_regex,
                message: unlisted_choice.validation_message,
              },
            }
          }
          onChange={(e) => setUnlistedChoiceValue(e.target.value)}
          tabIndex={isActive ? 0 : -1}
          options={choiceOptions}
          autoComplete="off"
          onRemoveOption={(option) => removeChoiceOption(FIELD_ID_UNLISTED, option)}
        />
      )}
      {!!selectedCustomOption && (
        <selectedCustomOption.component
          name={FIELD_ID_UNLISTED}
          isActive={isActive}
          optionKey={id}
        />
      )}
    </>
  );
}

export default ResourceSelect;
