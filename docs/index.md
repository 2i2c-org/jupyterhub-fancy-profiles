---
site:
  hide_outline: true
---
# Jupyterhub fancy profiles


+++ { "kind": "split-image", "class": "col-page-inset-right" }

### A modern, React-based profile selector for JupyterHub

A beautiful, feature-rich implementation of user-selectable profiles for JupyterHub with KubeSpawner.

{button}`Install <install.md>` {button}`User guide <guide.md>`

![](images/ui.png)

+++

## Key features

::::{grid} 1 1 2 2

:::{card} ✅ Enhanced profile selection
Renders your [KubeSpawner `profileList`](https://z2jh.jupyter.org/en/latest/jupyterhub/customizing/user-environment.html#using-multiple-profiles-to-let-users-select-their-environment) with a better looking and more featureful interface, including descriptions for various options.
:::

:::{card} ✨ Better user interface
Uses React and modern web design components for an attractive interface.
:::

:::{card} ⚗️ Dynamic image building
When enabled, integrates with BinderHub (deployed as a JupyterHub service) to allow users to [dynamically build images](#dynamic-image-building).
:::

:::{card} ⚙️ Standard KubeSpawner config
Works with your existing KubeSpawner configuration—no need to change how you define profiles.
:::

::::

---

## Quick start

::::{grid} 1 1 2 2

:::{card} 🚀 Install
:link: install

Get started with z2jh or KubeSpawner
:::

:::{card} 📖 User Guide
:link: guide

Configure profiles and features
:::

:::{card} 💻 Developer Guide
:link: develop

Contribute and extend the project
:::

:::{card} GitHub
:link: https://github.com/2i2c-org/jupyterhub-fancy-profiles

View source and report issues
:::

::::

---

## Who is this for?

**JupyterHub Administrators** who want to provide a better user experience when offering multiple server environments, resource options, or dynamic image building capabilities.

**Common Use Cases**:
- Research institutions offering various pre-configured environments
- Educational platforms with different course-specific setups
- Organizations letting users customize their computational resources
- Deployments integrating dynamic image building from repositories

---

## Compatibility

```{note}
**JupyterHub Version**

Version 0.4.0+ requires **JupyterHub 5 or higher**. If you're using an older version of JupyterHub, use version 0.3.x.
```

---

## Acknowledgments

Funded in part by [GESIS](http://notebooks.gesis.org) in cooperation with NFDI4DS [460234259](https://gepris.dfg.de/gepris/projekt/460234259) and [CESSDA](https://www.cessda.eu).
