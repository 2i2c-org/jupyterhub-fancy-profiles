import { expect, test, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TextField, SelectField } from "./fields";

test("TextField renders", async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();

  render(
    <TextField
      id="text"
      label="Text field"
      value="Text value"
      onChange={onChange}
    />,
  );

  const field = screen.getByRole("textbox", { name: "Text field" });
  await user.type(field, "new text");
  expect(onChange).toBeCalledTimes(8); // user types 8 characters
});

test("TextField renders", async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();

  render(
    <TextField
      id="text"
      label="Text field"
      value=""
      onChange={onChange}
      validate={{ required: "Enter a value." }}
    />,
  );

  const field = screen.getByRole("textbox", { name: "Text field" });
  expect((field as HTMLInputElement).required).toBeTruthy();
  expect(screen.queryByText("Enter a value.")).not.toBeInTheDocument();

  await user.click(field);
  await user.click(document.body);

  expect(screen.queryByText("Enter a value.")).toBeInTheDocument();
  expect(field).toBeInvalid();
});

test("TextField renders", async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();

  const { rerender } = render(
    <TextField
      id="text"
      label="Text field"
      value="abc"
      onChange={onChange}
      validate={{
        pattern: {
          value: "^.+:.+$",
          message: "Pattern error",
        },
      }}
    />,
  );

  const field = screen.getByRole("textbox", { name: "Text field" });
  expect(screen.queryByText("Pattern error")).not.toBeInTheDocument();

  await user.click(field);
  await user.click(document.body);
  expect(screen.queryByText("Pattern error")).toBeInTheDocument();
  expect(field).toBeInvalid();

  rerender(
    <TextField
      id="text"
      label="Text field"
      value="abc:123"
      onChange={onChange}
      validate={{
        pattern: {
          value: "^.+:.+$",
          message: "Pattern error",
        },
      }}
    />,
  );
  expect(screen.queryByText("Pattern error")).not.toBeInTheDocument();
  expect(field).toBeValid();
});

const options = [
  {
    value: "one",
    label: "Option one",
  },
  {
    value: "two",
    label: "Option two",
  },
];

test("SelectField renders", async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();

  render(
    <SelectField
      id="select"
      label="Select field"
      options={options}
      value=""
      onChange={onChange}
      defaultOption={options[1]}
    />,
  );

  expect(screen.queryByText("Option two")).toBeInTheDocument();
  const field = screen.getByLabelText("Select field");
  await user.click(field);
  await user.click(screen.getByText("Option one"));
  expect(onChange).toBeCalledTimes(1);
});
