# Permalink and auto-start

## Permalink

The permalink feature lets you share a URL that pre-fills the profile form with a specific configuration. This is useful for sharing server setups with colleagues, students, or workshop participants.

### How it works

1. Configure your desired server options in the profile form (profile type, image, resources, etc.)
2. Click the **Copy Permalink** button to copy a permalink to your clipboard
3. Share the URL with others or bookmark it for yourself

When someone visits the URL, the form automatically populates with the saved configuration. The user can review the options and click **Start** to launch.

The permalink encodes the selected configuration in the URL hash as `#fancy-forms-config=<encoded-json>`.

## Auto-start

Turn on the **Auto-start** toggle next to **Copy Permalink** to have the copied link launch the server as soon as it is opened, instead of waiting for the person to press **Start**. The form still populates with the saved configuration first, so the options are visible while the server starts.

This is particularly useful for:
- **Workshops and tutorials**: provide participants with a link that starts their environment with the exact configuration needed
- **Course materials**: embed links in course content that launch students directly into the right environment
- **Shared environments**: create standardized setups for teams or projects

```{note}
Auto-start is stored in the link as `"autoStart":"true"` inside the `fancy-forms-config` hash. Links copied with the toggle off contain `"autoStart":"false"` and behave like a normal permalink.
```

## Opening a Git repository (nbgitpuller)

Expand **nbgitpuller options**, below **Copy Permalink**, to clone a repository into the server and open it. This is especially useful for distributing workshop materials or course notebooks, where participants need both the right environment and the right content.

The repository is opened when you press **Start**, and is also saved in the permalink you copy. Fill in:

- **Repository** — the repository to clone, for example `https://github.com/org/repo`. You can paste a link to a file within the repository instead, such as `https://github.com/org/repo/blob/main/notebooks/example.ipynb`, and the branch and file fields are filled in for you. Leave it empty to not clone anything.
- **Branch** — the branch to pull. Leave empty to use the repository's default branch.
- **File to open** — the path within the repository to open, for example `notebooks/example.ipynb`. Leave empty to open the repository folder.

Combine this with auto-start to get a single link that logs the user in, configures the server, starts it, clones the repository and opens a notebook.

```{note}
This requires [nbgitpuller](https://github.com/jupyterhub/nbgitpuller) to be installed in the user image. Without it, the server still starts with the right configuration, but the repository is not cloned.
```

```{dropdown} Advanced: how the repository is opened
:icon: code-square

The repository is stored in the `fancy-forms-config` hash alongside the other options:

~~~json
{"gitPuller:repo": "https://github.com/org/repo", "gitPuller:branch": "main", "gitPuller:filePath": "notebooks/example.ipynb"}
~~~

When the form is submitted, it sends a `next` field pointing at the nbgitpuller endpoint. JupyterHub redirects there once the server has started, and nbgitpuller clones the repository and opens the requested file:

~~~text
/hub/user-redirect/git-pull?repo=<repo>&branch=<branch>&urlpath=lab/tree/<repo-name>/<file>
~~~

`urlpath` is prefixed with the repository's directory name, because nbgitpuller clones into a directory named after the repository.
```
