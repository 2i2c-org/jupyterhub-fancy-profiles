import os

from tornado.web import StaticFileHandler

HERE = os.path.dirname(__file__)

TEMPLATE_PATHS = [os.path.join(HERE, "templates")]

# FIXME: Handle JupyterHub's base_path here correctly, so we support
# running under prefixes
STATIC_HANDLER_TUPLE = (
    "/fancy-profiles/static/(.*)",
    StaticFileHandler,
    {"path": os.path.join(HERE, "static")},
)


def setup_ui(c):
    """
    Setup config to enable the UI provided by this package.

    Expects to be called from a `jupyterhub_config.py` file, with `c`
    the config object being passed in.
    """
    c.KubeSpawner.additional_profile_form_template_paths = TEMPLATE_PATHS

    # Add extra handler to serve JS & CSS assets
    c.JupyterHub.extra_handlers.append(STATIC_HANDLER_TUPLE)

    async def pre_spawn_hook(spawner):
        """Apply kubespawner_override values collected from nested profile options."""
        handler = getattr(spawner, "handler", None)
        if handler is None:
            return
        prefix = "profile-nested-override--"
        for key, values in handler.request.body_arguments.items():
            if key.startswith(prefix):
                attr = key[len(prefix):]
                value = values[0].decode("utf-8") if values else ""
                setattr(spawner, attr, value)

    c.KubeSpawner.pre_spawn_hook = pre_spawn_hook
