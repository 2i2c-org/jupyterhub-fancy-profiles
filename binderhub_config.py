# Placate our linters, which don't know c is traitlets' special sauce
c = get_config()  # noqa

# Enable debug logs for binderhub itself
c.BinderHub.debug = True

c.BinderHub.auth_enabled = True

# Just leave the built image in the node, so our hub can launch it
c.BinderHub.use_registry = False

# BinderHub is launched as a service by JupyterHub under /services/binder,
# and this is also where jupyterhub-fancy-profiles looks.
c.BinderHub.base_url = "/services/binder/"

# We only want to build, not launch
c.BinderHub.enable_api_only_mode = True
