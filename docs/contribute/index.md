# Contributing guidelines

We welcome contributions! Here are some tips for contributing:

- **Frontend changes**: Run `npm run build` to rebuild assets, or use `npm run webpack:watch` for automatic rebuilding
- **Template changes**: Restart JupyterHub to see changes
- **Code style**: Follow existing patterns and use the configured linters
- **Testing**: Write tests for new features and run `npm test` before submitting
- **Pull requests**: Ensure all tests pass and your code follows the project's style

## Development guidelines

See [](./develop.md).

## Contributing resources

::::{grid} 1 1 2 2

:::{card} GitHub
:link: https://github.com/2i2c-org/jupyterhub-fancy-profiles

View the repository
:::

:::{card} 🐛 Report Issues
:link: https://github.com/2i2c-org/jupyterhub-fancy-profiles/issues

File bugs or feature requests
:::

:::{card} 📦 PyPI Package
:link: https://pypi.org/project/jupyterhub-fancy-profiles/

View releases
:::

:::{card} 💬 Discussions
:link: https://github.com/2i2c-org/jupyterhub-fancy-profiles/discussions

Ask questions and share ideas
:::

::::

## Documentation versions

The documentation site has a different version of the docs for each release. Use the version menu in the navigation bar to change the version.

- `main` shows the docs from the `main` branch. These docs can include features that are not released.
- `stable` shows the docs for the newest release.
- `v<X.Y.Z>` shows the docs for that release.
- `pr-<N>` shows a preview of the docs for an open pull request.

The [MyST version switcher plugin](https://github.com/DiamondLightSource/myst-version-switcher-plugin) supplies the version menu and the publish workflows.

- `.github/workflows/docs-ci.yml` builds the docs for each pull request, each push to `main`, and each tag. For a tag, it also attaches the docs as `docs.zip` to the GitHub Release.
- `.github/workflows/docs-publish.yml` collects all the versions, writes `switcher.json`, and publishes the site to GitHub Pages.

To add the docs for a new release, push the release tag. You do not have to do other steps.
