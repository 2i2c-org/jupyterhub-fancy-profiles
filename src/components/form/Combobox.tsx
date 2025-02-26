import { forwardRef, KeyboardEventHandler, useState } from "react";
import { Field } from "./fields";

interface ICombobox {
  id: string;
  label: string;
  hint?: string;
  error: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  options: string[];
}

function setInputValue(input: HTMLInputElement, value: string){
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  ).set;
  nativeInputValueSetter.call(input, value);

  const inputEvent = new Event("change", { bubbles: true });
  input.dispatchEvent(inputEvent);
}

/**
 * Implements the Editable Combobx with List Autocomplete pattern
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
 */

function Combobox(
  {
    id,
    label,
    hint,
    error,
    value,
    onChange,
    onBlur,
    options,
  }: ICombobox,
  ref: React.MutableRefObject<HTMLInputElement>
) {
  const [touched, setTouched] = useState<boolean>(false);
  const [listBoxExpanded, setListBoxExpanded] = useState<boolean>(false);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number>();
  const [inputHasVisualFocus, setInputHasVisualFocus] = useState<boolean>(true);

  const displayOptions = value
    ? options.filter((o) => o.toLocaleLowerCase().startsWith(value.toLocaleLowerCase()))
    : options;

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    onBlur(event);
    setListBoxExpanded(false);
    setTouched(true);
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    switch (event.key) {
      case "Down":
      case "ArrowDown":
        setInputHasVisualFocus(false);
        setListBoxExpanded(true);
        if (selectedOptionIdx !== undefined) {
          setSelectedOptionIdx(prev => prev + 1 < displayOptions.length ? prev + 1 : 0);
        } else {
          if (!event.altKey) {
            setSelectedOptionIdx(0);
          }
        }
        break;
      case "Up":
      case "ArrowUp":
        setInputHasVisualFocus(false);
        setListBoxExpanded(true);
        if (selectedOptionIdx !== undefined) {
          setSelectedOptionIdx(prev => prev - 1 >= 0 ? prev - 1 : displayOptions.length - 1);
        } else {
          setSelectedOptionIdx(displayOptions.length - 1);
        }
        break;
      case "Enter":
        if (selectedOptionIdx !== undefined) {
          setInputValue(ref.current, displayOptions[selectedOptionIdx]);
        }
        setInputHasVisualFocus(true);
        setListBoxExpanded(false);
        setSelectedOptionIdx(undefined);
        break;
      case "Esc":
      case "Escape":
        setInputHasVisualFocus(true);
        if (listBoxExpanded) {
          setListBoxExpanded(false);
          setSelectedOptionIdx(undefined);
        } else {
          setInputValue(ref.current, "");
        }
        break;
      case "Home":
        setInputHasVisualFocus(true);
        ref.current.selectionStart = 0;
        ref.current.selectionEnd = 0;
        setSelectedOptionIdx(undefined);
        event.preventDefault();
        event.stopPropagation();
        break;
      case "End":
        setInputHasVisualFocus(true);
        ref.current.selectionStart = value.length;
        ref.current.selectionEnd = value.length;
        setSelectedOptionIdx(undefined);
        event.preventDefault();
        event.stopPropagation();
        break;
      default:
        setInputHasVisualFocus(true);
        setSelectedOptionIdx(undefined);
        return;
    }

  };

  const listboxId = `${id}-listbox`;

  return (
    <div style={{ position: "relative" }}>
      <Field id={id} label={label} hint={hint} error={error}>
        <input
          className={`form-control ${!inputHasVisualFocus ? "shadow-none" : ""} ${error ? "is-invalid" : ""}`}
          type="text"
          role="combobox"
          aria-invalid={!!error}
          aria-autocomplete="list"
          aria-expanded={listBoxExpanded}
          aria-controls={listboxId}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          ref={ref}
        />
        <ul
          id={listboxId}
          role="listbox"
          aria-label={`${label} Options`}
          className="list-group"
          style={{
            display: listBoxExpanded ? "block" : "none",
            position: "absolute",
            top: "2.5rem",
          }}
        >
          {displayOptions.map((option, index) => (
            <li
              key={`${id}-${option}`}
              role="option"
              className={`list-group-item ${index === selectedOptionIdx ? "active" : ""}`}
            >
              {option}
            </li>
          ))}
        </ul>
      </Field>
    </div>
  );
}

export default forwardRef(Combobox);
