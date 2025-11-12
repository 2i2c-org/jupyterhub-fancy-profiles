
(dynamic-image-building)=
# Dynamic image building with binderhub

This gives users the ability to build and share their own user environment images from the JupyterHub UI.

```{figure} ./images/build-ui.png
The Fancy Profiles UI with dynamic image building enabled.
```

```{note} Requires a BinderHub Service
This feature requires a [BinderHub](https://github.com/jupyterhub/binderhub/) instance deployed as a JupyterHub service.
```

When enabled, users can:

1. Provide a link to a GitHub repository
2. Wait for BinderHub to build an image from that repository
3. Launch their server with the freshly built image

This is particularly useful for:
- **Research reproducibility**: Users can specify exact environments from published repositories
- **Educational settings**: Instructors can provide course-specific repositories
- **Sharing work with colleagues**: Users can share the computational environment in addition to notebooks and computational content.

## Enable dynamic image building

Dynamic image building requires two components:

1. **A BinderHub service** configured in your JupyterHub
2. **The `dynamic_image_building` flag** enabled in your profile options

### Example configuration

The repository includes working example configurations for local development:

- [`jupyterhub_config.py`](https://github.com/2i2c-org/jupyterhub-fancy-profiles/blob/main/jupyterhub_config.py) - Shows how to [configure BinderHub as a JupyterHub service](https://github.com/2i2c-org/jupyterhub-fancy-profiles/blob/5fb2d060f4c45b2e5cd35c132fc6f3f3223f8d01/jupyterhub_config.py#L22-L32) and [enable the `dynamic_image_building` flag in profile options](https://github.com/2i2c-org/jupyterhub-fancy-profiles/blob/5fb2d060f4c45b2e5cd35c132fc6f3f3223f8d01/jupyterhub_config.py#L138-L152)
- [`binderhub_config.py`](https://github.com/2i2c-org/jupyterhub-fancy-profiles/blob/main/binderhub_config.py) - Basic BinderHub configuration for local development


## When to use this vs. the binderhub ui

Use `jupyterhub-fancy-profiles` with BinderHub integration when you're building a **persistent JupyterHub** with:
- Persistent home directories
- Multiple profile options
- Strong access control
- User authentication

Use the standard BinderHub UI when you're building an **ephemeral hub** where:
- Users click a link for immediate, temporary access
- No persistent storage is needed
- Sessions are short-lived
- Anonymous or lightweight auth is sufficient

```{tip} Quick Rubric

If your users want persistent home directories, use `jupyterhub-fancy-profiles` with BinderHub integration. If not, the BinderHub UI is more appropriate.
```