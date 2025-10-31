# Installation

This guide shows you how to install `jupyterhub-fancy-profiles` with your JupyterHub deployment.

````{warning}
**JupyterHub Version**

Version 0.4.0+ requires **JupyterHub 5 or higher**.

If you're using an older version of JupyterHub, please use version 0.3.x:
```bash
pip install jupyterhub-fancy-profiles<0.4
```
````

## Installation with zero to jupyterhub (z2jh)

Configuration via the [Zero to JupyterHub helm chart](https://z2jh.jupyter.org) is the most common deployment method. We provide pre-built Docker images that bundle `jupyterhub-fancy-profiles` with the appropriate z2jh hub image.

### Step 1: Find the right docker tag

Browse the [list of available tags](https://quay.io/repository/yuvipanda/z2jh-hub-with-fancy-profiles?tab=tags) and find a tag that matches your z2jh version.

For example, if you're using z2jh version `4.2.0`, look for a tag like `4.2.0-*`.

### Step 2: Configure your helm values

Add the following to your `values.yaml` file:

```yaml
hub:
  image:
    name: quay.io/yuvipanda/z2jh-hub-with-fancy-profiles
    tag: <tag-from-the-list>
  extraConfig:
    01-enable-fancy-profiles: |
      from jupyterhub_fancy_profiles import setup_ui
      setup_ui(c)
```

Replace `<tag-from-the-list>` with the actual tag you found in Step 1.

### Step 3: Deploy

Run your Helm upgrade:

```bash
helm upgrade --install jupyterhub jupyterhub/jupyterhub \
  --namespace jupyterhub \
  --values values.yaml
```

That's it! Your JupyterHub should now have fancy profiles enabled.

## Installation with kubespawner in jupyterhub configuration

If you're running JupyterHub with KubeSpawner but not using z2jh, you can install the package directly.

### Step 1: Install the package

In your hub image or environment, install the package:

```bash
pip install jupyterhub-fancy-profiles
```

### Step 2: Configure jupyterhub

Add the following to your `jupyterhub_config.py`:

```python
from jupyterhub_fancy_profiles import setup_ui

setup_ui(c)
```

The `setup_ui()` function will:
1. Configure extra templates for rendering the profile list UI
2. Set up HTTP handlers for serving static assets (JavaScript, CSS)

### Step 3: Restart jupyterhub

Restart your JupyterHub hub to apply the changes.

## Verification

After installation, you should see the fancy profile selector when users try to start their server. The UI will display:

- Rich profile descriptions with images
- Better organized options
- Improved form controls for custom selections

If you don't see the new UI:
1. Check that your profiles are configured in KubeSpawner (see the [User Guide](guide.md))
2. Verify that `setup_ui(c)` is being called in your configuration
3. Check the JupyterHub logs for any errors

## Next steps

::::{grid} 1 1 2 2

:::{card} 📖 Configure Profiles
:link: guide

Learn how to set up and customize your profile list
:::

:::{card} ❓ Troubleshooting
:link: https://github.com/2i2c-org/jupyterhub-fancy-profiles/issues

Get help or report issues
:::

::::
