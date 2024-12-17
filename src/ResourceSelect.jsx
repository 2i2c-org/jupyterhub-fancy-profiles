import { useContext, useState } from "react";
import useSelectOptions from "./hooks/useSelectOptions";
import { SpawnerFormContext } from "./state";
import { SelectField, TextField } from "./components/form/fields";

function ResourceSelect({ id, profile, config, customOptions = [] }) {
  const { display_name, unlisted_choice } = config;

  const { setCustomOption } = useContext(SpawnerFormContext);
  const { options, defaultOption, hasDefaultChoices } = useSelectOptions(
    config,
    customOptions,
  );
  const { profile: selectedProfile } = useContext(SpawnerFormContext);
  const FIELD_ID = `profile-option-${profile}--${id}`;
  const FIELD_ID_UNLISTED = `${FIELD_ID}--unlisted-choice`;

  const isActive = selectedProfile?.slug === profile;
  const [value, setValue] = useState(
    setCustomOption ? "--extra-selectable-item" : defaultOption?.value,
  );
  const [unlistedChoiceValue, setUnlistedChoiceValue] = useState("");

  if (!options.length > 0) {
    return null;
  }

  const selectedCustomOption = customOptions.find((opt) => opt.value === value);

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
          tabIndex={isActive ? "0" : "-1"}
          validate={
            isActive && {
              required: "Select a value.",
            }
          }
        />
      )}
      {value === "unlisted_choice" && (
        <TextField
          id={FIELD_ID_UNLISTED}
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
          tabIndex={isActive ? "0" : "-1"}
        />
      )}
      {!!selectedCustomOption && (
        <selectedCustomOption.component
          name={FIELD_ID_UNLISTED}
          isActive={isActive}
        />
      )}
    </>
  );
}

export default ResourceSelect;
