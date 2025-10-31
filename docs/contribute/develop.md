# Developer guide

This guide is for contributors who want to understand the codebase, make changes, or help maintain the project.

## Architecture overview

### How it works

1. **Templates**: Jinja2 templates render the initial HTML structure for the profile selection form
2. **React App**: JavaScript/React code handles the interactive UI, form state, and dynamic features
3. **Webpack**: Bundles the frontend code and outputs it to `static/`
4. **HTTP Handlers**: JupyterHub serves the static assets when the profile page loads
5. **KubeSpawner Integration**: The `setup_ui()` function configures KubeSpawner to use these templates and handlers

## Design philosophy

Keep this tool a fairly simple React app focused on profile selection.
This won't become a super-heavy, complex application. 

### Why react?

```{pull-quote}
If this file gets over 200 lines of code long (not counting docs / comments), start using a framework

-- From the [BinderHub JS Source Code](https://github.com/jupyterhub/binderhub/blob/036877ffdf0abfde7e84f3972c7d0478cf4f7cb2/binderhub/static/js/index.js#L1)
```

The file _did_ get more than 200 lines long, and BinderHub learned this lesson the hard way. For this project:

- **Lightweight**: Plain React without TypeScript keeps it approachable
- **Mainstream**: Attracts frontend developers and contributors
- **Just Right**: Complex enough for multiple interactive features, not so heavy that it's hard to maintain
- **Single Page**: Perfect scope for React—one complex page with state management

## Development setup

### Setting up minikube

Currently, these instructions work with [minikube](https://minikube.sigs.k8s.io/docs/start/) but can be adapted to any local Kubernetes setup.

1. Download, set up and start [minikube](https://minikube.sigs.k8s.io/docs/start/)

2. Allow spawned JupyterHub server pods to talk to the JupyterHub instance on your local machine:

   ```bash
   # Linux
   sudo ip route add $(kubectl get node minikube -o jsonpath="{.spec.podCIDR}") via $(minikube ip)

   # macOS
   sudo route -n add -net $(kubectl get node minikube -o jsonpath="{.spec.podCIDR}") $(minikube ip)
   ```

   You can later undo this with:

   ```bash
   # Linux
   sudo ip route del $(kubectl get node minikube -o jsonpath="{.spec.podCIDR}")

   # macOS
   sudo route delete -net $(kubectl get node minikube -o jsonpath="{.spec.podCIDR}")
   ```

### Setting up the development environment

1. Clone the repository:
   ```bash
   git clone https://github.com/2i2c-org/jupyterhub-fancy-profiles.git
   cd jupyterhub-fancy-profiles
   ```

2. Set up a virtual environment (using `venv`, `conda`, etc.)

3. Install Python dependencies:
   ```bash
   pip install -r dev-requirements.txt
   pip install -e .
   ```

   This also builds the JS and CSS assets.

4. Install [configurable-http-proxy](https://github.com/jupyterhub/configurable-http-proxy/) (required for JupyterHub):
   ```bash
   npm install configurable-http-proxy
   ```

5. Add `configurable-http-proxy` to your `$PATH`:
   ```bash
   export PATH="$(pwd)/node_modules/.bin:${PATH}"
   ```

6. Start JupyterHub and navigate to `localhost:8000`:
   ```bash
   jupyterhub
   ```

   You can login with any username and password.

   ```{tip}
   **Troubleshooting:** On macOS, if you see the error `Errno 8: Nodename nor servname provided`, try running `jupyterhub --ip=localhost` instead.
   ```

7. If working on JS/CSS, run this in another terminal to automatically watch and rebuild:
   ```bash
   npm run webpack:watch
   ```

## Testing

Tests for the frontend use [Jest](https://jestjs.io) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for rendering components and asserting DOM state.

### Run all tests

```bash
npm test
```

### Run specific test suite

To run tests in a specific file (e.g., `ProfileForm.test.tsx`):

```bash
npm test ProfileForm
```

## Making a release

We use [automation](https://github.com/pypa/gh-action-pypi-publish/) to publish releases to [PyPI](https://pypi.org/project/jupyterhub-fancy-profiles/). Release early and often!

### Creating the release

1. **Update your local checkout**:
   ```bash
   git checkout main
   git stash  # if needed
   git pull upstream main  # or origin, as needed
   ```

2. **Create a new git tag**:
   ```bash
   git tag -a v<version-number>
   ```

   In the tag message, at minimum write: `Version <version-number>`

   Ideally, include a brief changelog of notable changes.

3. **Push your tag to GitHub**:
   ```bash
   git push origin --tags
   ```

4. **Done!** A new release will automatically be published to PyPI.

### Generating release notes

After making the release:

1. Install `github-activity`:
   ```bash
   pip install github-activity
   ```

2. Generate release notes using the previous and current release tags:
   ```bash
   github-activity 2i2c-org/jupyterhub-fancy-profiles -s <last-release-tag> -u <this-release-tag>
   ```

   For example, for v0.5.0:
   ```bash
   github-activity 2i2c-org/jupyterhub-fancy-profiles -s v0.4.0 -u v0.5.0
   ```

3. Copy the output and rearrange/categorize as needed. `github-activity` will automatically group PRs based on tags (e.g., `enhancement`, `bug`) or prefixes (e.g., `[ENH]`, `[BUG]`).

4. [Create a GitHub release](https://github.com/2i2c-org/jupyterhub-fancy-profiles/releases/new), use the tag as the title, and paste in the generated release notes.

5. Click **Publish Release**.
