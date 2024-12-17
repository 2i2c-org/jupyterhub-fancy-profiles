import { jest } from "@jest/globals";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();

HTMLCanvasElement.prototype.getContext = () => {};
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

window.profileList = [
  {
    slug: "cpu",
    display_name: "CPU only",
    description: "No GPU, only CPU",
    profile_options: {
      image: {
        display_name: "Image",
        unlisted_choice: {
          enabled: true,
          display_name: "Custom image",
          validation_regex: "^.+:.+$",
          validation_message:
            "Must be a publicly available docker image, of form <image-name>:<tag>",
          display_name_in_choices: "Specify an existing docker image",
          description_in_choices:
            "Use a pre-existing docker image from a public docker registry",
          kubespawner_override: { image: "{value}" },
        },
        choices: {
          pangeo: {
            display_name: "Pangeo Notebook Image",
            description:
              "Python image with scientific, dask and geospatial tools",
            kubespawner_override: {
              image: "pangeo/pangeo-notebook:2023.09.11",
            },
          },
          geospatial: {
            display_name: "Rocker Geospatial",
            description:
              "R image with RStudio, the tidyverse & Geospatial tools",
            default: true,
            slug: "geospatial",
            kubespawner_override: {
              image: "rocker/binder:4.3",
              default_url: "/rstudio",
              working_dir: "/home/rstudio",
            },
          },
          scipy: {
            display_name: "Jupyter SciPy Notebook",
            slug: "scipy",
            kubespawner_override: {
              image: "jupyter/scipy-notebook:2023-06-26",
            },
          },
        },
      },
      resources: {
        display_name: "Resource Allocation",
        choices: {
          mem_2_7: {
            display_name: "2.7 GB RAM, upto 3.479 CPUs",
            description: "Use this for the workshop on 2023 September",
            kubespawner_override: {
              mem_guarantee: 1024,
              mem_limit: 2904451072,
              cpu_guarantee: 0.1,
              cpu_limit: 3.479,
            },
            default: true,
          },
          mem_5_4: {
            display_name: "5.4 GB RAM, upto 3.479 CPUs",
            kubespawner_override: {
              mem_guarantee: 1024,
              mem_limit: 5808902144,
              cpu_guarantee: 0.1,
              cpu_limit: 3.479,
            },
          },
          mem_10_8: {
            display_name: "10.8 GB RAM, upto 3.479 CPUs",
            kubespawner_override: {
              mem_guarantee: 1024,
              mem_limit: 11617804288,
              cpu_guarantee: 0.1,
              cpu_limit: 3.479,
            },
          },
          mem_21_6: {
            display_name: "21.6 GB RAM, upto 3.479 CPUs",
            description: "Large amount of RAM, might start slowly",
            kubespawner_override: {
              mem_guarantee: 1024,
              mem_limit: 23235608576,
              cpu_guarantee: 0.1,
              cpu_limit: 3.479,
            },
          },
        },
      },
    },
  },
  {
    slug: "gpu",
    display_name: "GPU",
    description: "Nvidia Tesla T4 GPU",
    profile_options: {
      image: {
        display_name: "Image - GPU",
        choices: {
          pangeo: {
            display_name: "Pangeo Notebook Image",
            description:
              "Python image with scientific, dask and geospatial tools",
            kubespawner_override: {
              image: "pangeo/pangeo-notebook:2023.09.11",
            },
          },
          geospatial: {
            display_name: "Rocker Geospatial",
            description:
              "R image with RStudio, the tidyverse & Geospatial tools",
            default: true,
            slug: "geospatial",
            kubespawner_override: {
              image: "rocker/binder:4.3",
              default_url: "/rstudio",
              working_dir: "/home/rstudio",
            },
          },
          scipy: {
            display_name: "Jupyter SciPy Notebook",
            slug: "scipy",
            kubespawner_override: {
              image: "jupyter/scipy-notebook:2023-06-26",
            },
          },
        },
      },
      resources: {
        display_name: "Resource Allocation - GPU",
        choices: {
          mem_2_7: {
            display_name: "3.7 GB RAM, upto 4.479 CPUs",
            description: "Use this for the workshop on 2023 September",
            kubespawner_override: {
              mem_guarantee: 1024,
              mem_limit: 2904451072,
              cpu_guarantee: 0.1,
              cpu_limit: 3.479,
            },
            default: true,
          },
          mem_5_4: {
            display_name: "8.4 GB RAM, upto 3.479 CPUs",
            kubespawner_override: {
              mem_guarantee: 1024,
              mem_limit: 5808902144,
              cpu_guarantee: 0.1,
              cpu_limit: 3.479,
            },
          },
        },
      },
    },
  },
  {
    description: "Specify your own docker image",
    display_name: "Bring your own image",
    default: true,
    profile_options: {
      image: {
        choices: {},
        display_name: "Image - No options",
        unlisted_choice: {
          display_name: "Docker image",
          enabled: true,
          kubespawner_override: { image: "{value}" },
          validation_message:
            "Must be a publicly available docker image, of form <image-name>:<tag>",
          validation_regex: "^.+:.+$",
          display_name_in_choices: "Other...",
        },
      },
    },
    slug: "custom",
  },
  {
    slug: "build-custom-environment",
    description: "Dynamic Image building + unlisted choice",
    display_name: "Build custom environment",
    profile_options: {
      image: {
        choices: {},
        display_name: "Image - dynamic image building",
        unlisted_choice: {
          display_name: "Docker image",
          enabled: true,
          kubespawner_override: { image: "{value}" },
          validation_message:
            "Must be a publicly available docker image, of form <image-name>:<tag>",
          validation_regex: "^.+:.+$",
          display_name_in_choices: "Other...",
        },
        dynamic_image_building: {
          enabled: true,
        },
      },
    },
  },
  {
    slug: "empty-options",
    description: "Profile with empty options",
    display_name: "Empty Options",
    profile_options: {},
  },
  {
    slug: "no-options",
    description: "Profile with no options",
    display_name: "No Options",
  },
];
