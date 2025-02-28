import { expect, test, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Combobox from "./Combobox";

const options = ["Option 1", "Option 2", "Option 3", "Another Option"];

test("Combobox renders", async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();

  render(
    <Combobox
      id="combobox"
      label="Combobox"
      value=""
      onChange={onChange}
      options={options}
    />,
  );

  const field = screen.getByRole("combobox", { name: "Combobox" });
  await user.type(field, "new text");
  expect(onChange).toBeCalledTimes(8); // user types 8 characters
  expect(screen.queryByText("Option 1")).toBeVisible();
});

test("Combobox opens and highlights first item on arrow up", async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();

  render(
    <Combobox
      id="combobox"
      label="Combobox"
      value=""
      onChange={onChange}
      options={options}
    />,
  );

  const field = screen.getByRole("combobox", { name: "Combobox" });
  await user.type(field, "{ArrowDown}");
  expect(screen.queryByText("Option 1")).toBeVisible();
  expect(field.getAttribute("aria-activedescendant")).toEqual(
    "combobox-listbox-0",
  );
});

test("Combobox opens and highlights last item on arrow down", async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();

  render(
    <Combobox
      id="combobox"
      label="Combobox"
      value=""
      onChange={onChange}
      options={options}
    />,
  );

  const field = screen.getByRole("combobox", { name: "Combobox" });
  await user.type(field, "{ArrowUp}");
  expect(screen.queryByText("Another Option")).toBeVisible();
  expect(field.getAttribute("aria-activedescendant")).toEqual(
    "combobox-listbox-3",
  );
});

test("Combobox navigates through listbox items", async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();

  render(
    <Combobox
      id="combobox"
      label="Combobox"
      value=""
      onChange={onChange}
      options={options}
    />,
  );

  const field = screen.getByRole("combobox", { name: "Combobox" });
  await user.type(field, "{ArrowDown}");
  expect(field.getAttribute("aria-activedescendant")).toEqual(
    "combobox-listbox-0",
  );
  await user.type(field, "{ArrowDown}");
  expect(field.getAttribute("aria-activedescendant")).toEqual(
    "combobox-listbox-1",
  );

  // Arrow up twice should highlight the last element in the listbox
  await user.type(field, "{ArrowUp}");
  await user.type(field, "{ArrowUp}");
  expect(field.getAttribute("aria-activedescendant")).toEqual(
    "combobox-listbox-3",
  );

  await user.type(field, "{ArrowDown}");
  expect(field.getAttribute("aria-activedescendant")).toEqual(
    "combobox-listbox-0",
  );
});

test("Combobox selects value via Enter", async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();

  render(
    <Combobox
      id="combobox"
      label="Combobox"
      value=""
      onChange={onChange}
      options={options}
    />,
  );

  const field = screen.getByRole("combobox", { name: "Combobox" });
  await user.type(field, "{ArrowDown}");
  expect(field.getAttribute("aria-activedescendant")).toEqual(
    "combobox-listbox-0",
  );
  await user.type(field, "{Enter}");
  expect(onChange).toBeCalledTimes(1);
});

test("Combobox closes listbox and clears value via Esc", async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();

  render(
    <Combobox
      id="combobox"
      label="Combobox"
      value="Ano"
      onChange={onChange}
      options={options}
    />,
  );

  const field = screen.getByRole("combobox", { name: "Combobox" });
  await user.type(field, "{ArrowDown}");
  expect(field.getAttribute("aria-activedescendant")).toEqual(
    "combobox-listbox-0",
  );
  expect(screen.queryByText("Another Option")).toBeVisible();
  await user.type(field, "{Esc}");
  expect(screen.queryByText("Another Option")).not.toBeVisible();
  await user.type(field, "{Esc}");
  expect(onChange).toBeCalledTimes(1);
});

test("Combobox filters items", async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();

  render(
    <Combobox
      id="combobox"
      label="Combobox"
      value="Ano"
      onChange={onChange}
      options={options}
    />,
  );

  const field = screen.getByRole("combobox", { name: "Combobox" });
  await user.type(field, "{ArrowDown}");
  expect(field.getAttribute("aria-activedescendant")).toEqual(
    "combobox-listbox-0",
  );
  expect(screen.queryByText("Another Option")).toBeVisible();
  expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
  expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
  expect(screen.queryByText("Option 3")).not.toBeInTheDocument();
});

test("Combobox selects item via mouse click", async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();

  render(
    <Combobox
      id="combobox"
      label="Combobox"
      value=""
      onChange={onChange}
      options={options}
    />,
  );

  const field = screen.getByRole("combobox", { name: "Combobox" });
  await user.type(field, "{ArrowDown}");

  await user.click(screen.getByText("Option 1"));
  expect(onChange).toBeCalledTimes(1);
});
