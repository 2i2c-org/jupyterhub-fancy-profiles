import { forwardRef, useState } from "react";

import { CustomizedSelect } from "./CustomSelect";

function validateField(value, validateConfig, touched) {
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

function Field({ id, label, hint, children, error }) {
  return (
    <div className="profile-option-container">
      <div className="profile-option-label-container">
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      </div>
      <div className="profile-option-control-container">
        {children}
        {error && <div className="invalid-feedback">{error}</div>}
        {hint && <div className="profile-option-control-hint">{hint}</div>}
      </div>
    </div>
  );
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
}) {
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
        id={id}
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

function _TextField(
  { id, label, value, hint, validate = {}, onChange, tabIndex },
  ref,
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
