import { describe, expect, test, beforeEach } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ProfileForm from "./ProfileForm";
import { SpawnerFormProvider } from "./state";

describe("Profile form", () => {
  test("image and resource fields initially not tabable", async () => {
    render(
      <SpawnerFormProvider>
        <ProfileForm />
      </SpawnerFormProvider>,
    );

    const imageField = screen.getByLabelText("Image");
    expect(imageField.tabIndex).toEqual(-1);

    const resourceField = screen.getByLabelText("Resource Allocation");
    expect(resourceField.tabIndex).toEqual(-1);
  });

  test("image and resource fields tabable", async () => {
    const user = userEvent.setup();

    render(
      <SpawnerFormProvider>
        <ProfileForm />
      </SpawnerFormProvider>,
    );

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

    render(
      <SpawnerFormProvider>
        <ProfileForm />
      </SpawnerFormProvider>,
    );

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

  test("custom image field needs specific format", async () => {
    const user = userEvent.setup();

    render(
      <SpawnerFormProvider>
        <ProfileForm />
      </SpawnerFormProvider>,
    );

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

    render(
      <SpawnerFormProvider>
        <ProfileForm />
      </SpawnerFormProvider>,
    );

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

    render(
      <SpawnerFormProvider>
        <ProfileForm />
      </SpawnerFormProvider>,
    );

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
    render(
      <SpawnerFormProvider>
        <ProfileForm />
      </SpawnerFormProvider>,
    );
    expect(
      screen.queryByLabelText("Image - No options"),
    ).not.toBeInTheDocument();
  });

  test("profile marked as default is selected by default", () => {
    const { container } = render(
      <SpawnerFormProvider>
        <ProfileForm />
      </SpawnerFormProvider>,
    );
    const hiddenRadio = container.querySelector('[name="profile"]');
    expect(hiddenRadio.value).toEqual("custom");
    const defaultRadio = screen.getByRole("radio", {
      name: "Bring your own image Specify your own docker image",
    });
    expect(defaultRadio.checked).toBeTruthy();
    const nonDefaultRadio = screen.getByRole("radio", {
      name: "GPU Nvidia Tesla T4 GPU",
    });
    expect(nonDefaultRadio.checked).toBeFalsy();
  });

  test("having dynamic_image_building enabled and no other choices shows dropdown", async () => {
    const user = userEvent.setup();

    render(
      <SpawnerFormProvider>
        <ProfileForm />
      </SpawnerFormProvider>,
    );
    const select = screen.getByLabelText("Image - dynamic image building");
    await user.click(select);
    expect(screen.getByText("Build your own image")).toBeInTheDocument();
    expect(screen.getAllByText("Other...").length).toEqual(2); // There are two selects with the "Other..." label defined
  });
});

describe("Profile form with URL Params", () => {
  beforeEach(() => {
    const location = {
      ...window.location,
      search: "?binderProvider=gh&binderRepo=org/repo&ref=v1.0",
    };
    Object.defineProperty(window, "location", {
      writable: true,
      value: location,
    });
  });

  test("preselects values", async () => {
    render(
      <SpawnerFormProvider>
        <ProfileForm />
      </SpawnerFormProvider>,
    );

    const radio = screen.getByRole("radio", {
      name: "Build custom environment Dynamic Image building + unlisted choice",
    });
    expect(radio.checked).toBeTruthy();

    expect(screen.getByLabelText("Repository").value).toEqual("org/repo");
    expect(screen.getByLabelText("Git Ref").value).toEqual("v1.0");
  });

  test("no-option profiles are rendered", () => {
    render(
      <SpawnerFormProvider>
        <ProfileForm />
      </SpawnerFormProvider>,
    );

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
