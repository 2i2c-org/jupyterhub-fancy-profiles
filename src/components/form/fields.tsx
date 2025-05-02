import { forwardRef, PropsWithChildren, useState } from "react";

import { CustomizedSelect } from "./CustomSelect";
import { SelectOption } from "../../types/fields";

export type TValidateConfig = {
  required?: string;
  pattern?: {
    value: string;
    message: string;
  };
};

export function validateField(
  value: string,
  validateConfig: TValidateConfig,
  touched: boolean,
) {
  if (!touched) return;

  if (validateConfig.required && !value) {
    return validateConfig.required;
  }

  if (
    validateConfig.pattern &&
    !new RegExp(validateConfig.pattern.value, "g").test(value)
  ) {
    return validateConfig.pattern.message;
  }

  return;
}

interface IField extends PropsWithChildren {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}

export function Field({ id, label, hint, children, error }: IField) {
  return (
    <div className="profile-option-container">
      <div className="profile-option-label-container">
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      </div>
      <div className="profile-option-control-container" style={{ position: "relative" }}>
        {children}
        {error && <div className="invalid-feedback d-block">{error}</div>}
        {hint && <div className="profile-option-control-hint">{hint}</div>}
      </div>
    </div>
  );
}

interface ISelectField extends Omit<IField, "children"> {
  options: SelectOption[];
  defaultOption: SelectOption;
  value: string;
  onChange: (e: { value: string }) => void;
  validate?: TValidateConfig;
  tabIndex?: number;
}

export function SelectField({
  id,
  label,
  hint,
  options,
  defaultOption,
  onChange,
  value,
  validate = {},
  tabIndex,
}: ISelectField) {
  const [touched, setTouched] = useState(false);
  const onBlur = () => setTouched(true);

  const required = !!validate.required;
  const error = validateField(value, validate, touched);

  const selectedOption = options.find(
    ({ value: optionVal }) => optionVal === value,
  );

  return (
    <Field id={id} label={label} hint={hint} error={error}>
      <CustomizedSelect
        options={options}
        name={id}
        defaultValue={defaultOption}
        onChange={onChange}
        onBlur={onBlur}
        tabIndex={tabIndex}
        required={required}
        aria-invalid={!!error}
        aria-label={label}
        value={selectedOption}
      />
    </Field>
  );
}

interface ITextFieldProps extends Omit<IField, "children"> {
  value: string;
  validate?: TValidateConfig;
  tabIndex?: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

function _TextField(
  {
    id,
    label,
    value,
    hint,
    validate = {},
    onChange,
    tabIndex,
  }: ITextFieldProps,
  ref: React.LegacyRef<HTMLInputElement>,
) {
  const [touched, setTouched] = useState(false);
  const onBlur = () => setTouched(true);

  const required = !!validate.required;
  const pattern = validate.pattern?.value;
  const error = validateField(value, validate, touched);

  return (
    <Field id={id} label={label} hint={hint} error={touched && error}>
      <input
        className={`form-control ${error ? "is-invalid" : ""}`}
        ref={ref}
        type="text"
        id={id}
        name={id}
        value={value}
        pattern={pattern}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        tabIndex={tabIndex}
        aria-invalid={!!error}
        onInvalid={() => setTouched(true)}
      />
    </Field>
  );
}

export const TextField = forwardRef(_TextField);
