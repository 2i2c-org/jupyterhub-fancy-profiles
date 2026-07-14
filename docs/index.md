---
site:
  hide_outline: true
  hide_title_block: false
---
# JupyterHub Fancy Profiles

### A more flexible and powerful profile selector for JupyterHub

When you offer users a choice of server environments, [KubeSpawner](https://jupyterhub-kubespawner.readthedocs.io/) shows a plain list of options with minimal functionality.
Fancy Profiles renders the same configuration as a card-based interface, with additional functionality for descriptions, on-demand image building, and shareable launch links.

It's a drop-in replacement, and requires no changes to your [KubeSpawner `profileList`](https://z2jh.jupyter.org/en/latest/jupyterhub/customizing/user-environment.html#using-multiple-profiles-to-let-users-select-their-environment) configuration. Enable it like so:

```python
from jupyterhub_fancy_profiles import setup_ui

setup_ui(c)
```

And your users will see something like the following when they next log-in:

```{figure} images/screen-mock.png
The Fancy Profiles selector, rendered from a standard KubeSpawner `profileList`.
```

{button}`Install <install.md>` {button}`User guide <guide/index.md>`


## Key features

::::{grid} 1 1 2 2

:::{card} ⚙️ Drop-in, no config changes
Works with your existing KubeSpawner `profileList`. Add two lines of config and your profiles render in the new UI. There's no migration step, and it's easy to revert.
:::

:::{card} ✅ Enhanced profile selection
Users pick from selectable cards with names, descriptions, and images, instead of a bare list of options.
:::

:::{card} ⚗️ Dynamic image building
Let users build an environment image from a Git repository at launch, powered by [BinderHub](#dynamic-image-building), so each user can define their own images.
:::

:::{card} 🔗 Permalinks & auto-start
Share a URL that pre-selects (or auto-launches) a configured environment. This works well for workshops, courses, and shared team setups.
:::

::::

## Who is this for?

Fancy Profiles is for **JupyterHub administrators running on Kubernetes (KubeSpawner)** who let users choose between multiple server environments, resource sizes, or images at launch.

It's a good fit if you run:

- Research platforms offering several pre-configured environments
- Courses where students launch a specific environment per assignment
- Hubs that let users bring or build their own images

## Compatibility

```{note}
**JupyterHub Version**

Version 0.4.0+ requires **JupyterHub 5 or higher**. If you're using an older version of JupyterHub, use version 0.3.x.
```

---

## Acknowledgments

Funded in part by [GESIS](http://notebooks.gesis.org) in cooperation with NFDI4DS [460234259](https://gepris.dfg.de/gepris/projekt/460234259) and [CESSDA](https://www.cessda.eu).
