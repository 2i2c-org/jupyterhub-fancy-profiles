# Contributing

## Setting up a dev environment

### Setting up `minikube`

Currently, these instructions only work with [minikube](https://minikube.sigs.k8s.io/docs/start/)
but can be adapted to work with any other local kubernetes setup.

1. Download, set up and start [minikube](https://minikube.sigs.k8s.io/docs/start/)

2. Allow the spawned JupyterHub server pods to talk to the JupyterHub instance on your
   local machine with the following command:

   ```bash
   # Linux
   sudo ip route add $(kubectl get node minikube -o jsonpath="{.spec.podCIDR}") via $(minikube ip)

   # MACOS
   sudo route -n add -net $(kubectl get node minikube -o jsonpath="{.spec.podCIDR}") $(minikube ip)
   ```

   You can later undo the effects of this with the following command

   ```bash
   # Linux
   sudo ip route del $(kubectl get node minikube -o jsonpath="{.spec.podCIDR}")

   # MACOS
   sudo route delete -net $(kubectl get node minikube -o jsonpath="{.spec.podCIDR}")
   ```

### Setup a virtual environment

1. Clone this repository

2. Setup a virtual environment, in whatever way works for you (`venv`, `conda`, etc)

3. Install the packages specified in `dev-requirements.txt`

   ```bash
   python -m pip install -r dev-requirements.txt
   ```

4. Install the `jupyterhub-fancy-profiles` package itself.

   ```bash
   python -m pip install -e .
   ```

   This also will build the JS and CSS assets.

5. Install [configurable-http-proxy](https://github.com/jupyterhub/configurable-http-proxy/),
   as that is required for JupyterHub to run.

   ```bash
   npm install configurable-http-proxy
   ```

6. Put `configurable-http-proxy` in `$PATH` so jupyterhub can discover it.

   ```bash
   export PATH="$(pwd)/node_modules/.bin:${PATH}"
   ```

7. Now, start `jupyterhub` and go to `localhost:8000` to access it! You can login with any
   username and password.

   ```bash
   jupyterhub
   ```

   **Troubleshooting:** On MacOS, if you're seeing the error `Errno 8: Nodename nor servname provided`, try running `jupyterhub --ip=localhost` instead.

8. If you're working on the JS / CSS, you can also run the following command in another
   terminal to automatically watch and rebuild the JS / CSS as you edit.

   ```bash
   npm run webpack:watch
   ```

## Make release notes

Here are some steps you can take to create release notes for a new release.

1. Install `github-activity`. It is the tool we'll use to generate release notes.

   ```bash
   pip install github-activity
   ```
2. Make the release and push to pypi. As part of this, a new GitHub tag should be created for the release.
3. Generate release notes using GitHub Activity:

   ```bash
   github-activity 2i2c-org/jupyterhub-fancy-profiles -s <last-release-tag> -u <this-release-tag>
   ```

   For example, the release notes for v0.5.0 were generated with the following command:


   ```bash
   github-activity 2i2c-org/jupyterhub-fancy-profiles -s v0.4.0 -u v0.5.0
   ```
4. Copy the output, rearrange and categorize it as you wish. `github-activity` will automatically group PRs based on their tag (e.g. `enhancement`, `bug`) or prefix (e.g., `[ENH]`, `[BUG]`).
5. [Make a release on GitHub](https://github.com/2i2c-org/jupyterhub-fancy-profiles/releases/new), use the tag as the title, paste in the release notes you generated above.
6. Click `Publish Release`. That's it!

## Tests

Tests for the front-end use [Jest](https://jestjs.io) to set up and specify tests and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for rendering components and asseting DOM state.

To all tests:

```sh
npm test
```

To run a specific test suite, ie. the tests in `ProfileForm.test.tsx`

```sh
npm test ProfileForm
```
