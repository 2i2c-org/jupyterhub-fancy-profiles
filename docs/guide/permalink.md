# Permalink and auto-start

## Permalink

The permalink feature lets you share a URL that pre-fills the profile form with a specific configuration. This is useful for sharing server setups with colleagues, students, or workshop participants.

### How it works

1. Configure your desired server options in the profile form (profile type, image, resources, etc.)
2. Click the **Copy Permalink** button to copy a permalink to your clipboard
3. Share the URL with others or bookmark it for yourself

When someone visits the URL, the form automatically populates with the saved configuration. The user can review the options and click **Start** to launch.

The permalink encodes the selected configuration in the URL hash as `#fancy-forms-config=<encoded-json>`.

## Link options

**Link options**, next to the **Copy Permalink** button, controls what the copied link does when it is opened. The settings apply to the link you copy next — they don't change your own form.

### Auto-start

Tick **Start the server automatically** to have the link launch the server as soon as it is opened, instead of waiting for the person to press **Start**. The form still populates with the saved configuration first, so the options are visible while the server starts.

This is particularly useful for:
- **Workshops and tutorials**: provide participants with a link that starts their environment with the exact configuration needed
- **Course materials**: embed links in course content that launch students directly into the right environment
- **Shared environments**: create standardized setups for teams or projects

```{note}
Auto-start is stored in the link as `"autoStart":"true"` inside the `fancy-forms-config` hash. Links copied with the checkbox left unticked contain `"autoStart":"false"` and behave like a normal permalink.
```

### Opening a Git repository (nbgitpuller)

Tick **Open a Git repository in the server** to have the link also clone a repository into the server and open it. This is especially useful for distributing workshop materials or course notebooks, where participants need both the right environment and the right content.

Fill in:

- **Repository** — the repository to clone, for example `https://github.com/org/repo`. You can paste a link to a file within the repository instead, such as `https://github.com/org/repo/blob/main/notebooks/example.ipynb`, and the branch and file fields are filled in for you.
- **Branch** — the branch to pull. Leave empty to use the repository's default branch.
- **File to open** — the path within the repository to open, for example `notebooks/example.ipynb`. Leave empty to open the repository folder.

Combine this with auto-start to get a single link that logs the user in, configures the server, starts it, clones the repository and opens a notebook.

```{note}
This requires [nbgitpuller](https://github.com/jupyterhub/nbgitpuller) to be installed in the user image. Without it, the server still starts with the right configuration, but the repository is not cloned.
```

```{dropdown} Advanced: the URL that gets generated
:icon: code-square

Understanding the structure is useful if you want to generate these links programmatically rather than from the form.

The copied link chains three destinations together:

~~~text
https://hub.example.org/hub/login
  ?next=/hub/spawn
    ?next=<url-encoded nbgitpuller path>
    #fancy-forms-config=<url-encoded json>
~~~

1. `/hub/login` authenticates the user, then redirects to its `next` destination.
2. `/hub/spawn` renders the profile form. The `fancy-forms-config` hash pre-fills the form, and `"autoStart":"true"` submits it.
3. Once the server has started, JupyterHub follows the spawn page's own `next` parameter to the nbgitpuller endpoint, which clones the repository and opens the requested file:

~~~text
/hub/user-redirect/git-pull?repo=<repo>&branch=<branch>&urlpath=lab/tree/<repo-name>/<file>
~~~

Note that `urlpath` is prefixed with the repository's directory name, because nbgitpuller clones into a directory named after the repository.
```
