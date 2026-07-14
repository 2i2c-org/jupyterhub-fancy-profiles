# Permalink and auto-start

## Permalink

The permalink feature lets you share a URL that pre-fills the profile form with a specific configuration. This is useful for sharing server setups with colleagues, students, or workshop participants.

### How it works

1. Configure your desired server options in the profile form (profile type, image, resources, etc.)
2. Click the **Copy Link** button to copy a permalink to your clipboard
3. Share the URL with others or bookmark it for yourself

When someone visits the URL, the form automatically populates with the saved configuration. The user can review the options and click **Start** to launch.

The permalink encodes the selected configuration in the URL hash as `#fancy-forms-config=<encoded-json>`.

### Auto-start

Auto-start extends permalinks by automatically submitting the form after a brief timeout, launching the server immediately without user interaction.

#### How it works

1. Create a permalink as described above
2. In the copied URL, change `autoStart=false` to `autoStart=true`
3. Share the modified URL

When someone visits a URL with `autoStart=true`, the form populates with the saved configuration and submits itself automatically.

```{tip}
The **Copy Link** button sets `autoStart=false` by default. Change `false` to `true` in the URL to enable auto-start.
```

This is particularly useful for:
- **Workshops and tutorials**: provide participants with a link that starts their environment with the exact configuration needed
- **Course materials**: embed links in course content that launch students directly into the right environment
- **Shared environments**: create standardized setups for teams or projects

### Combining with nbgitpuller

```{dropdown} Advanced: auto-start with nbgitpuller
:icon: code-square

If your JupyterHub environment has [nbgitpuller](https://github.com/jupyterhub/nbgitpuller) installed, you can combine auto-start permalinks with git-pull functionality to create URLs that both clone a repository and launch a pre-configured server.

This is especially useful for distributing workshop materials or course notebooks where you want participants to have both the right environment and the right content.

Here's a Python script that generates such URLs:

~~~python
import urllib.parse
import re

# Configuration
notebook_url = "https://github.com/org/repo/blob/branch/notebooks/example.ipynb"
permalink = ""  # Permalink copied from fancy profiles form
jupyterhub_url = "https://jupyterhub.example.org"

# Extract repository information from notebook URL
git_repo_url = notebook_url.split("/blob/")[0]
branch = notebook_url.split("/blob/")[1].split("/")[0]
notebook_path = "/".join(notebook_url.split("/blob/")[1].split("/")[1:])
notebook_suburl = git_repo_url.split("/")[-1] + "/" + notebook_path

# Build git-pull URL (requires nbgitpuller)
gitpull_next = (
    f"/hub/user-redirect/git-pull"
    f"?repo={git_repo_url}"
    f"&branch={branch}"
    f"&urlpath=lab/tree/{notebook_suburl}"
)

# Build spawn URL with git-pull as next parameter
spawn_next = "/hub/spawn?next=" + urllib.parse.quote(gitpull_next, safe="")

# Extract fancy-forms-config from permalink and enable auto-start
config_match = re.search(r"%23.+?(?=%7D)", permalink)
if config_match:
    fancy_forms_config = config_match[0].replace(
        "%22autoStart%22%3A%22false%22",
        "%22autoStart%22%3A%22true%22"
    )
    # Construct final URL
    final_url = (
        f"{jupyterhub_url}/hub/login"
        f"?next={urllib.parse.quote(spawn_next, safe='')}"
        f"{fancy_forms_config}%7D"
    )
    print(final_url)
else:
    print("Error: Could not extract config from permalink")
~~~

**How it works:**

1. The script extracts the git repository URL and branch from a GitHub notebook URL
2. It creates a git-pull URL that clones the repository and opens the specified notebook
3. It combines this with the fancy profiles configuration from your permalink
4. It sets `autoStart=true` to automatically launch the server
5. The result is a single URL that authenticates users, clones the repository, configures the server environment, and launches it automatically

```{note}
This requires [nbgitpuller](https://github.com/jupyterhub/nbgitpuller) to be installed in your JupyterHub environment.
```
```
