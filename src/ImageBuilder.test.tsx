import { expect, test } from "@jest/globals";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import fetchMock from "jest-fetch-mock";

import ProfileForm from "./ProfileForm";
import renderWithContext, { renderWithJupyterForm } from "./test/renderWithContext";

jest.mock("xterm", () => ({
  Terminal: jest.fn().mockImplementation(() => ({
    write: jest.fn(),
    loadAddon: jest.fn(),
    open: jest.fn(),
    resize: jest.fn(),
  })),
}));

jest.mock("xterm-addon-fit", () => ({
  FitAddon: jest.fn().mockImplementation(() => ({
    fit: jest.fn(),
  })),
}));

jest.mock("@jupyterhub/binderhub-client/client.js", () => ({
  BinderRepository: jest.fn().mockImplementation(() => ({
    fetch: jest.fn().mockReturnValue({
      [Symbol.asyncIterator]() {
        let done = false;
        return {
          next() {
            if (!done) {
              done = true;
              return Promise.resolve({
                value: { phase: "ready", imageName: "ghcr.io/org/repo:abc123" },
                done: false,
              });
            }
            return Promise.resolve({ value: undefined, done: true });
          },
        };
      },
    }),
    close: jest.fn(),
  })),
}));

test("select repository by org/repo", async () => {
  const user = userEvent.setup();

  renderWithContext(<ProfileForm />);
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));

  const repoField = screen.getByLabelText("Repository");
  await user.type(repoField, "org/repo");
  await user.click(document.body);

  expect(
    screen.queryByText(
      "Provide the repository as the format 'organization/repository'.",
    ),
  ).not.toBeInTheDocument();
});

test("select repository by https://github.com/org/repo", async () => {
  const user = userEvent.setup();

  renderWithContext(<ProfileForm />);
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));

  const repoField = screen.getByLabelText("Repository");
  await user.type(repoField, "https://github.com/org/repo");
  await user.click(document.body);

  expect(
    screen.queryByText(
      "Provide the repository as the format 'organization/repository'.",
    ),
  ).not.toBeInTheDocument();
});

test("select repository by https://www.github.com/org/repo", async () => {
  const user = userEvent.setup();

  renderWithContext(<ProfileForm />);
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));

  const repoField = screen.getByLabelText("Repository");
  await user.type(repoField, "https://www.github.com/org/repo");
  await user.click(document.body);

  expect(
    screen.queryByText(
      "Provide the repository as the format 'organization/repository'.",
    ),
  ).not.toBeInTheDocument();
});

test("select repository by github.com/org/repo", async () => {
  const user = userEvent.setup();

  renderWithContext(<ProfileForm />);
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));

  const repoField = screen.getByLabelText("Repository");
  await user.type(repoField, "github.com/org/repo");
  await user.click(document.body);

  expect(
    screen.queryByText(
      "Provide the repository as the format 'organization/repository'.",
    ),
  ).not.toBeInTheDocument();
});

test("select repository by www.github.com/org/repo", async () => {
  const user = userEvent.setup();

  renderWithContext(<ProfileForm />);
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));

  const repoField = screen.getByLabelText("Repository");
  await user.type(repoField, "www.github.com/org/repo");
  await user.click(document.body);
  expect(
    screen.queryByText(
      "Provide the repository as the format 'organization/repository'.",
    ),
  ).not.toBeInTheDocument();
});

test("invalid org/repo string (not matching pattern)", async () => {
  const user = userEvent.setup();

  renderWithContext(<ProfileForm />);
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));

  const repoField = screen.getByLabelText("Repository");
  await user.type(repoField, "org");
  await user.click(document.body);

  expect(
    screen.getAllByText(
      "Provide the repository as the format 'organization/repository'.",
    ).length,
  ).toBeGreaterThan(0);
});

test("repofield trims leading/trailing spaces", async () => {
  const user = userEvent.setup();

  renderWithJupyterForm(<ProfileForm />);
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));

  const repoField = screen.getByLabelText("Repository");
  await user.type(repoField, "     extra/spaces  ");
  await user.click(document.body);
  await user.click(screen.getByRole("button", { name: "Build Image and Start" }));

  expect(repoField).toHaveValue("extra/spaces");
});

test("ref trims leading/trailing spaces", async () => {
  const user = userEvent.setup();

  renderWithJupyterForm(<ProfileForm />);
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));

  const refField = screen.getByLabelText("Git Ref");
  await user.clear(refField);
  await user.type(refField, " branch ");
  await user.click(document.body);
  await user.click(screen.getByRole("button", { name: "Build Image and Start" }));

  expect(refField).toHaveValue("branch");
});

test("invalid org/repo string (wrong base URL)", async () => {
  const user = userEvent.setup();

  renderWithJupyterForm(<ProfileForm />);
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));

  const repoField = screen.getByLabelText("Repository");
  await user.type(repoField, "example.com/org/repo");
  await user.click(document.body);

  expect(
    screen.getAllByText(
      "Provide the repository as the format 'organization/repository'.",
    ).length,
  ).toBeGreaterThan(0);
});

test("no org/repo provided", async () => {
  const user = userEvent.setup();

  renderWithJupyterForm(<ProfileForm />);
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));
  await user.click(screen.getByRole("button", { name: "Build Image and Start" }));

  expect(
    screen.getAllByText(
      "Provide the repository as the format 'organization/repository'.",
    ).length,
  ).toBeGreaterThan(0);
});

test("no branch selected", async () => {
  const user = userEvent.setup();

  renderWithJupyterForm(<ProfileForm />);
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));

  const repoField = screen.getByLabelText("Repository");
  await user.type(repoField, "org/repo");
  await user.click(document.body);

  await user.clear(screen.queryByLabelText("Git Ref"));
  await user.click(screen.getByRole("button", { name: "Build Image and Start" }));

  expect(screen.getAllByText("Enter a git ref.").length).toBeGreaterThan(0);
});

test("build image and start submits form on first click with image name in hidden input", async () => {
  // Pre-load a valid API token so getApiToken returns without requesting a new one.
  // The "jupytherhub" typo matches the TOKEN_KEY constant in ImageBuilder.tsx.
  localStorage.setItem("jupytherhub-build-token", JSON.stringify({
    id: "test-id",
    expires_at: "2099-01-01T00:00:00Z",
    token: "test-token",
  }));
  // getApiToken always fetches /hub/api/user first, even when a cached token exists
  fetchMock.mockResponseOnce(JSON.stringify({ name: "testuser" }));

  const user = userEvent.setup();
  const { container } = renderWithJupyterForm(<ProfileForm />);

  const radio = screen.getByRole("radio", {
    name: "Build custom environment Dynamic Image building + unlisted choice",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);
  await user.click(screen.getByText("Build your own image"));

  const repoField = screen.getByLabelText("Repository");
  await user.type(repoField, "org/repo");
  await user.click(document.body); // triggers blur → sets repoId

  const form = container.querySelector("form");
  let hiddenValueAtSubmit = "";
  const requestSubmitSpy = jest.spyOn(form, "requestSubmit").mockImplementation(() => {
    const input = form.querySelector("[data-dynamic-build='true']") as HTMLInputElement;
    hiddenValueAtSubmit = input?.value ?? "";
  });

  await user.click(screen.getByRole("button", { name: "Build Image and Start" }));

  // Build should complete and form should submit in this single click.
  // If the hidden input's ref isn't written synchronously before submit, it still has value="" here.
  await waitFor(() => expect(requestSubmitSpy).toHaveBeenCalledTimes(1));
  expect(hiddenValueAtSubmit).toBe("ghcr.io/org/repo:abc123");

  localStorage.removeItem("jupytherhub-build-token");
  requestSubmitSpy.mockRestore();
});
