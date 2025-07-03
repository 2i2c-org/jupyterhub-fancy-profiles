import { describe, expect, test } from "@jest/globals";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ProfileForm from "./ProfileForm";
import renderWithContext from "./test/renderWithContext";


describe("Profile form", () => {
  test("image and resource fields initially not tabable", async () => {
    renderWithContext(<ProfileForm />);

    const imageField = screen.getByLabelText("Image");
    expect(imageField.tabIndex).toEqual(-1);

    const resourceField = screen.getByLabelText("Resource Allocation");
    expect(resourceField.tabIndex).toEqual(-1);
  });

  test("image and resource fields tabable", async () => {
    const user = userEvent.setup();

    renderWithContext(<ProfileForm />);

    const radio = screen.getByRole("radio", {
      name: "CPU only No GPU, only CPU",
    });
    await user.click(radio);

    const imageField = screen.getByLabelText("Image");
    expect(imageField.tabIndex).toEqual(0);

    const resourceField = screen.getByLabelText("Resource Allocation");
    expect(resourceField.tabIndex).toEqual(0);
  });

  test("custom image field is required", async () => {
    const user = userEvent.setup();

    renderWithContext(<ProfileForm />);

    const radio = screen.getByRole("radio", {
      name: "CPU only No GPU, only CPU",
    });
    await user.click(radio);

    const imageField = screen.getByLabelText("Image");
    await user.click(imageField);
    await user.click(screen.getByText("Specify an existing docker image"));

    const customImageField = screen.getByLabelText("Custom image");
    await user.click(customImageField);
    await user.click(document.body);

    expect(screen.getByText("Enter a value.")).toBeInTheDocument();
  });

  test("shows error summary", async () => {
    const user = userEvent.setup();

    renderWithContext(
      <form>
        <ProfileForm />
      </form>
    );

    const radio = screen.getByRole("radio", {
      name: "CPU only No GPU, only CPU",
    });
    await user.click(radio);

    const imageField = screen.getByLabelText("Image");
    await user.click(imageField);
    await user.click(screen.getByText("Specify an existing docker image"));

    const submitButton = screen.getByRole("button", { "name": "Start" });
    await user.click(submitButton);
    await waitFor(() => expect(screen.getByText("Unable to start the server. The form is incomplete.")).toBeInTheDocument());
    expect(screen.queryAllByText("Enter a value.").length).toEqual(2);

    // Check that one of the errors is the link in the error summary.
    expect(screen.getByRole("link", {"name": "Enter a value."})).toBeInTheDocument();
  });

  test("custom image field needs specific format", async () => {
    const user = userEvent.setup();

    renderWithContext(<ProfileForm />);

    const radio = screen.getByRole("radio", {
      name: "CPU only No GPU, only CPU",
    });
    await user.click(radio);

    const imageField = screen.getByLabelText("Image");
    await user.click(imageField);
    await user.click(screen.getByText("Specify an existing docker image"));

    const customImageField = screen.getByLabelText("Custom image");
    await user.type(customImageField, "abc");
    await user.click(document.body);

    expect(
      screen.getByText(
        "Must be a publicly available docker image, of form <image-name>:<tag>",
      ),
    ).toBeInTheDocument();
  });

  test("custom image field accepts specific format", async () => {
    const user = userEvent.setup();

    renderWithContext(<ProfileForm />);

    const radio = screen.getByRole("radio", {
      name: "CPU only No GPU, only CPU",
    });
    await user.click(radio);

    const imageField = screen.getByLabelText("Image");
    await user.click(imageField);
    await user.click(screen.getByText("Specify an existing docker image"));

    const customImageField = screen.getByLabelText("Custom image");
    await user.type(customImageField, "abc:123");
    await user.click(document.body);

    expect(screen.queryByText("Enter a value.")).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "Must be a publicly available docker image, of form <image-name>:<tag>",
      ),
    ).not.toBeInTheDocument();
  });

  test("Multiple profiles renders", async () => {
    const user = userEvent.setup();

    renderWithContext(<ProfileForm />);

    const radio = screen.getByRole("radio", {
      name: "GPU Nvidia Tesla T4 GPU",
    });
    await user.click(radio);

    const imageField = screen.getByLabelText("Image - GPU");
    expect(imageField.tabIndex).toEqual(0);
    expect(screen.getByLabelText("Resource Allocation - GPU").tabIndex).toEqual(
      0,
    );

    const smallImageField = screen.getByLabelText("Image");
    await user.click(smallImageField);
    await user.click(screen.getByText("Specify an existing docker image"));

    const customImageField = screen.getByLabelText("Custom image");
    await user.click(customImageField);
    await user.click(document.body);

    expect(screen.queryByText("Enter a value.")).toBeInTheDocument();

    expect(smallImageField.tabIndex).toEqual(0);
    expect(screen.getByLabelText("Resource Allocation").tabIndex).toEqual(0);
    expect(imageField.tabIndex).toEqual(-1);
    expect(screen.getByLabelText("Resource Allocation - GPU").tabIndex).toEqual(
      -1,
    );
  });

  test("select with no options should not render", () => {
    renderWithContext(<ProfileForm />);
    expect(
      screen.queryByLabelText("Image - No options"),
    ).not.toBeInTheDocument();
  });

  test("profile marked as default is selected by default", () => {
    const { container } = renderWithContext(<ProfileForm />);
    const hiddenRadio = container.querySelector("[name='profile']");
    expect((hiddenRadio as HTMLInputElement).value).toEqual("custom");
    const defaultRadio = screen.getByRole("radio", {
      name: "Bring your own image Specify your own docker image",
    });
    expect((defaultRadio as HTMLInputElement).checked).toBeTruthy();
    const nonDefaultRadio = screen.getByRole("radio", {
      name: "GPU Nvidia Tesla T4 GPU",
    });
    expect((nonDefaultRadio as HTMLInputElement).checked).toBeFalsy();
  });

  test("having dynamic_image_building enabled and no other choices shows dropdown", async () => {
    const user = userEvent.setup();

    renderWithContext(<ProfileForm />);
    const select = screen.getByLabelText("Image - dynamic image building");
    await user.click(select);
    expect(screen.getByText("Build your own image")).toBeInTheDocument();
    expect(screen.getAllByText("Other...").length).toEqual(2); // There are two selects with the "Other..." label defined
  });

  test("copy permalink to clipboard", async () => {
    const user = userEvent.setup();

    renderWithContext(<ProfileForm />);
    const radio = screen.getByRole("radio", {
      name: "GPU Nvidia Tesla T4 GPU",
    });
    await user.click(radio);
    await user.click(screen.getByRole("button", {name: "Permalink"}));

    const clipboardText = await navigator.clipboard.readText();

    expect(clipboardText).toBe("http://localhost/hub/login?next=/hub/spawn%23fancy-forms-config=%7B%22profile%22%3A%22gpu%22%2C%22image%22%3A%22geospatial%22%2C%22image%3Aunlisted_choice%22%3A%22%22%2C%22resources%22%3A%22mem_2_7%22%2C%22resources%3Aunlisted_choice%22%3A%22%22%7D");
  });
});

describe("Profile form with URL Params", () => {
  function setHash(hash: string) {
    const location = {
      ...window.location,
      hash
    };
    Object.defineProperty(window, "location", {
      writable: true,
      value: location,
    });
  }

  test("ignores irrelevant params", () => {
    setHash("#foo=bar");
    const { container } = renderWithContext(<ProfileForm />);
    const hiddenRadio = container.querySelector("[name='profile']");
    expect((hiddenRadio as HTMLInputElement).value).toEqual("custom");
    const defaultRadio = screen.getByRole("radio", {
      name: "Bring your own image Specify your own docker image",
    });
    expect((defaultRadio as HTMLInputElement).checked).toBeTruthy();
    expect(screen.queryByText("Unable to parse permalink configuration.")).not.toBeInTheDocument();
  });

  test("ignores empty config", () => {
    setHash("#fancy-forms-config");
    const { container } = renderWithContext(<ProfileForm />);
    const hiddenRadio = container.querySelector("[name='profile']");
    expect((hiddenRadio as HTMLInputElement).value).toEqual("custom");
    const defaultRadio = screen.getByRole("radio", {
      name: "Bring your own image Specify your own docker image",
    });
    expect((defaultRadio as HTMLInputElement).checked).toBeTruthy();
    expect(screen.queryByText("Unable to parse permalink configuration.")).not.toBeInTheDocument();
  });

  test("shows error for malformed config", () => {
    setHash("#fancy-forms-config=%7B%22profile%22%3A%22build-custom-environment%22%2C%22image%22%3A%22--extra-selectable-item%22%2C%22image%3Aunlisted_choice%22%3A%22%22%2C%22image%3AbinderProvider%22%3A%22gh%22%2C%22image%3AbinderRepo%22%3A%22org%2Fre");
    const { container } = renderWithContext(<ProfileForm />);
    const hiddenRadio = container.querySelector("[name='profile']");
    expect((hiddenRadio as HTMLInputElement).value).toEqual("custom");
    const defaultRadio = screen.getByRole("radio", {
      name: "Bring your own image Specify your own docker image",
    });
    expect((defaultRadio as HTMLInputElement).checked).toBeTruthy();
    expect(screen.queryByText("Unable to parse permalink configuration.")).toBeInTheDocument();
  });

  test("preselects values", async () => {
    setHash("#fancy-forms-config=%7B%22profile%22%3A%22build-custom-environment%22%2C%22image%22%3A%22--extra-selectable-item%22%2C%22image%3Aunlisted_choice%22%3A%22%22%2C%22image%3AbinderProvider%22%3A%22gh%22%2C%22image%3AbinderRepo%22%3A%22org%2Frepo%22%2C%22image%3Aref%22%3A%22v1.0%22%7D");
    renderWithContext(<ProfileForm />);

    const radio = screen.getByRole("radio", {
      name: "Build custom environment Dynamic Image building + unlisted choice",
    });
    expect((radio as HTMLInputElement).checked).toBeTruthy();

    expect(
      (screen.getByLabelText("Repository") as HTMLInputElement).value,
    ).toEqual("org/repo");
    expect(
      (screen.getByLabelText("Git Ref") as HTMLInputElement).value,
    ).toEqual("v1.0");
  });

  test("no-option profiles are rendered", () => {
    setHash("#fancy-forms-config=%7B%22profile%22%3A%22build-custom-environment%22%2C%22image%22%3A%22--extra-selectable-item%22%2C%22image%3Aunlisted_choice%22%3A%22%22%2C%22image%3AbinderProvider%22%3A%22gh%22%2C%22image%3AbinderRepo%22%3A%22org%2Frepo%22%2C%22image%3Aref%22%3A%22v1.0%22%7D");
    renderWithContext(<ProfileForm />);

    const empty = screen.queryByRole("radio", {
      name: "Empty Options Profile with empty options",
    });
    expect(empty).toBeInTheDocument();

    const noObject = screen.queryByRole("radio", {
      name: "No Options Profile with no options",
    });
    expect(noObject).toBeInTheDocument();
  });
});
