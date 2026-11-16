import { describe, expect, test } from "@jest/globals";

import { IProfile } from "../types/config";
import { userOptionsToFormValues } from "./userOptions";

const profileList = [
  {
    slug: "cpu",
    display_name: "CPU",
    profile_options: {
      image: {
        display_name: "Image",
        unlisted_choice: {
          enabled: true,
          display_name: "Custom image",
          validation_regex: "^.+:.+$",
          kubespawner_override: { image: "{value}" },
        },
        choices: {
          pangeo: { display_name: "Pangeo", kubespawner_overwrite: {} },
          scipy: { display_name: "SciPy", kubespawner_overwrite: {} },
        },
      },
      resources: {
        display_name: "Resources",
        choices: {
          small: { display_name: "Small", kubespawner_overwrite: {} },
          large: { display_name: "Large", kubespawner_overwrite: {} },
        },
      },
    },
  },
  {
    slug: "gpu",
    display_name: "GPU",
    profile_options: {
      image: {
        display_name: "Image",
        choices: {
          pangeo: { display_name: "Pangeo", kubespawner_overwrite: {} },
        },
      },
    },
  },
  { slug: "empty", display_name: "Empty" },
] as IProfile[];

describe("userOptionsToFormValues", () => {
  test("maps listed choices", () => {
    expect(
      userOptionsToFormValues(
        { profile: "cpu", image: "scipy", resources: "large" },
        profileList,
      ),
    ).toEqual({ profile: "cpu", image: "scipy", resources: "large" });
  });

  test("maps an unlisted choice", () => {
    expect(
      userOptionsToFormValues(
        {
          profile: "cpu",
          image: "unlisted_choice",
          "image--unlisted-choice": "quay.io/org/image:tag",
        },
        profileList,
      ),
    ).toEqual({
      profile: "cpu",
      image: "unlisted_choice",
      "image:unlisted_choice": "quay.io/org/image:tag",
    });
  });

  test("maps a built image to an unlisted choice", () => {
    expect(
      userOptionsToFormValues(
        {
          profile: "cpu",
          image: "--extra-selectable-item",
          "image--unlisted-choice": "registry/binder-org-repo:abc123",
        },
        profileList,
      ),
    ).toEqual({
      profile: "cpu",
      image: "unlisted_choice",
      "image:unlisted_choice": "registry/binder-org-repo:abc123",
    });
  });

  test("keeps the profile when it has no options", () => {
    expect(userOptionsToFormValues({ profile: "empty" }, profileList)).toEqual({
      profile: "empty",
    });
  });

  test("drops choices that no longer exist", () => {
    expect(
      userOptionsToFormValues(
        { profile: "cpu", image: "removed", resources: "small" },
        profileList,
      ),
    ).toEqual({ profile: "cpu", resources: "small" });
  });

  test("drops an unlisted choice when it is not enabled", () => {
    expect(
      userOptionsToFormValues(
        { profile: "gpu", "image--unlisted-choice": "quay.io/org/image:tag" },
        profileList,
      ),
    ).toEqual({ profile: "gpu" });
  });

  test.each([
    [undefined],
    [{}],
    [{ image: "scipy" }],
    [{ profile: "removed", image: "scipy" }],
  ])("returns nothing for %j", (userOptions) => {
    expect(userOptionsToFormValues(userOptions, profileList)).toEqual({});
  });
});
