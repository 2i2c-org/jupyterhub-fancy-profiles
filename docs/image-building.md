
(dynamic-image-building)=
# Dynamic image building with binderhub

This gives users the ability to build and share their own user environment images from the JupyterHub UI.

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

[TODO: Where is the configuration for how to do this?]

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