# User guide

This guide covers how to configure and use `jupyterhub-fancy-profiles` features.

## Understanding profile lists

`jupyterhub-fancy-profiles` enhances KubeSpawner's `profile_list` configuration. It renders the same profile data with a better-looking and more feature-rich interface.

### What Gets Enhanced

The package interprets your existing KubeSpawner `profile_list` configuration and renders it with:
- Better looking and more featureful interface
- Descriptions for various options
- Better descriptions for "write-in" choices

You configure profiles the same way as standard KubeSpawner—`jupyterhub-fancy-profiles` provides the enhanced UI!

## Configuration

`jupyterhub-fancy-profiles` works with standard KubeSpawner `profile_list` configuration. You define profiles the same way you would with regular KubeSpawner—this package simply provides an enhanced UI for displaying them.

For detailed information on configuring KubeSpawner profiles, see the [KubeSpawner documentation](https://jupyterhub-kubespawner.readthedocs.io/).


## Known limitations

```{warning}
**State Persistence**

Form values don't remember their previous state upon browser refresh. Users will need to re-select their options if they reload the page before starting their server.
```

This is a known issue we're working to address. Contributions are welcome!
