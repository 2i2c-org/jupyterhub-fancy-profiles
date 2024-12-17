import os
import socket

from jupyterhub_fancy_profiles import setup_ui

c = get_config()  # noqa

# Allow any username and any password to login
c.JupyterHub.authenticator_class = "dummy"

# Launch into Kubernetes
c.JupyterHub.spawner_class = "kubespawner.KubeSpawner"

# Explicitly set the command to start, as repo2docker default is notebook,
# not the jupyterhub-singleuser
c.Spawner.cmd = ["jupyterhub-singleuser"]

# Don't try to cleanup servers on exit - since in general for k8s, we want
# the hub to be able to restart without losing user containers
c.JupyterHub.cleanup_servers = False

# Automatically start binderhub as a service, at the URL path that jupyterhub-fancy-profiles
# expects it to be at
c.JupyterHub.services = [
    {
        "name": "binder",
        "url": "http://localhost:8585",
        "command": ["python", "-m", "binderhub", "-f", "binderhub_config.py"],
        # Pass on environment variables required for binderhub to find where the docker image is
        "environment": os.environ.copy(),
    }
]

# Find the IP of the machine that minikube is most likely able to talk to
# Graciously used from https://stackoverflow.com/a/166589
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
host_ip = s.getsockname()[0]
s.close()

c.JupyterHub.hub_connect_ip = host_ip

# Setup jupyterhub_fancy_profiles
setup_ui(c)

# Provide an example profile with various options in use
c.KubeSpawner.profile_list = [
    {
        "display_name": "CPU only usage",
        "description": "For use with just CPU, no GPU",
        "profile_options": {
            "image": {
                "display_name": "Image",
                "unlisted_choice": {
                    "enabled": True,
                    "display_name": "Custom image",
                    "validation_regex": "^.+:.+$",
                    "validation_message": "Must be a publicly available docker image, of form <image-name>:<tag>",
                    "display_name_in_choices": "Specify an existing docker image",
                    "description_in_choices": "Use a pre-existing docker image from a public docker registry",
                    "kubespawner_override": {"image": "{value}"},
                },
                "choices": {
                    "pangeo": {
                        "display_name": "Pangeo Notebook Image",
                        "description": "Python image with scientific, dask and geospatial tools",
                        "kubespawner_override": {
                            "image": "pangeo/pangeo-notebook:2023.09.11"
                        },
                    },
                    "geospatial": {
                        "display_name": "Rocker Geospatial",
                        "description": "R image with RStudio, the tidyverse & Geospatial tools",
                        "default": True,
                        "slug": "geospatial",
                        "kubespawner_override": {
                            "image": "rocker/binder:4.3",
                            "default_url": "/rstudio",
                            "working_dir": "/home/rstudio",
                        },
                    },
                    "scipy": {
                        "display_name": "Jupyter SciPy Notebook",
                        "slug": "scipy",
                        "kubespawner_override": {
                            "image": "jupyter/scipy-notebook:2023-06-26"
                        },
                    },
                },
            },
            "resources": {
                "display_name": "Resource Allocation",
                "choices": {
                    "mem_2_7": {
                        "display_name": "2.7 GB RAM, upto 3.479 CPUs",
                        "description": "Use this for the workshop on 2023 September",
                        "kubespawner_override": {
                            "mem_guarantee": 1024,
                            "mem_limit": 2904451072,
                            "cpu_guarantee": 0.1,
                            "cpu_limit": 3.479,
                        },
                        "default": True,
                    },
                    "mem_5_4": {
                        "display_name": "5.4 GB RAM, upto 3.479 CPUs",
                        "kubespawner_override": {
                            "mem_guarantee": 1024,
                            "mem_limit": 5808902144,
                            "cpu_guarantee": 0.1,
                            "cpu_limit": 3.479,
                        },
                    },
                    "mem_10_8": {
                        "display_name": "10.8 GB RAM, upto 3.479 CPUs",
                        "kubespawner_override": {
                            "mem_guarantee": 1024,
                            "mem_limit": 11617804288,
                            "cpu_guarantee": 0.1,
                            "cpu_limit": 3.479,
                        },
                    },
                    "mem_21_6": {
                        "display_name": "21.6 GB RAM, upto 3.479 CPUs",
                        "description": "Large amount of RAM, might start slowly",
                        "kubespawner_override": {
                            "mem_guarantee": 1024,
                            "mem_limit": 23235608576,
                            "cpu_guarantee": 0.1,
                            "cpu_limit": 3.479,
                        },
                    },
                },
            },
        },
    },
    {
        "display_name": "GPU only usage",
        "description": "for use with GPU",
        "profile_options": {
            "image": {
                "display_name": "Image",
                "dynamic_image_building": {"enabled": True},
                "unlisted_choice": {
                    "enabled": True,
                    "display_name": "Custom image",
                    "validation_regex": "^.+:.+$",
                    "validation_message": "Must be a publicly available docker image, of form <image-name>:<tag>",
                    "display_name_in_choices": "Specify an existing docker image",
                    "description_in_choices": "Use a pre-existing docker image from a public docker registry",
                    "kubespawner_override": {"image": "{value}"},
                },
                "choices": {
                    "pangeo": {
                        "display_name": "Pangeo Notebook Image",
                        "description": "Python image with scientific, dask and geospatial tools",
                        "kubespawner_override": {
                            "image": "pangeo/pangeo-notebook:2023.09.11"
                        },
                    },
                    "geospatial": {
                        "display_name": "Rocker Geospatial",
                        "description": "R image with RStudio, the tidyverse & Geospatial tools",
                        "default": True,
                        "slug": "geospatial",
                        "kubespawner_override": {
                            "image": "rocker/binder:4.3",
                            "default_url": "/rstudio",
                            "working_dir": "/home/rstudio",
                        },
                    },
                    "scipy": {
                        "display_name": "Jupyter SciPy Notebook",
                        "slug": "scipy",
                        "kubespawner_override": {
                            "image": "jupyter/scipy-notebook:2023-06-26"
                        },
                    },
                },
            },
            "resources": {
                "display_name": "Resource Allocation",
                "choices": {
                    "mem_2_7": {
                        "display_name": "2.7 GB RAM, upto 3.479 CPUs",
                        "description": "Use this for the workshop on 2023 September",
                        "kubespawner_override": {
                            "mem_guarantee": 1024,
                            "mem_limit": 2904451072,
                            "cpu_guarantee": 0.1,
                            "cpu_limit": 3.479,
                        },
                        "default": True,
                    },
                    "mem_5_4": {
                        "display_name": "5.4 GB RAM, upto 3.479 CPUs",
                        "kubespawner_override": {
                            "mem_guarantee": 1024,
                            "mem_limit": 5808902144,
                            "cpu_guarantee": 0.1,
                            "cpu_limit": 3.479,
                        },
                    },
                    "mem_10_8": {
                        "display_name": "10.8 GB RAM, upto 3.479 CPUs",
                        "kubespawner_override": {
                            "mem_guarantee": 1024,
                            "mem_limit": 11617804288,
                            "cpu_guarantee": 0.1,
                            "cpu_limit": 3.479,
                        },
                    },
                    "mem_21_6": {
                        "display_name": "21.6 GB RAM, upto 3.479 CPUs",
                        "description": "Large amount of RAM, might start slowly",
                        "kubespawner_override": {
                            "mem_guarantee": 1024,
                            "mem_limit": 23235608576,
                            "cpu_guarantee": 0.1,
                            "cpu_limit": 3.479,
                        },
                    },
                },
            },
        },
    },
    {
        "description": "Specify your own docker image (must have python and jupyterhub installed in it)",
        "display_name": "Bring your own image",
        "default": True,
        "profile_options": {
            "image": {
                "choices": {},
                "display_name": "Image",
                "dynamic_image_building": {"enabled": True},
                "unlisted_choice": {
                    "display_name": "Custom image",
                    "enabled": True,
                    "kubespawner_override": {"image": "{value}"},
                    "validation_message": "Must be a publicly available docker image, of form <image-name>:<tag>",
                    "validation_regex": "^.+:.+$",
                    "display_name_in_choices": "Other...",
                },
            },
        },
        "slug": "custom",
    },
    {
        "description": "Dynamic Image building + unlisted choice",
        "display_name": "Build custom environment",
        "profile_options": {
            "image": {
                "choices": {},
                "display_name": "Image - dynamic image building",
                "unlisted_choice": {
                    "display_name": "Docker image",
                    "enabled": True,
                    "kubespawner_override": {"image": "{value}"},
                    "validation_message": "Must be a publicly available docker image, of form <image-name>:<tag>",
                    "validation_regex": "^.+:.+$",
                    "display_name_in_choices": "Other...",
                },
                "dynamic_image_building": {"enabled": True},
            }
        },
    },
    {
        "display_name": "Profile without any options",
        "description": "Just a profile that doesn't contain any profile options",
        "kubespawner_override": {"image": "pangeo/pangeo-notebook:2023.09.11"},
    },
]
