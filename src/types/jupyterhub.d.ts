// Type definitions for JupyterHub window extensions
interface JupyterHub {
  token: string;
  user: string;
  base_url: string;
  prefix: string;
  version: string;
}

interface Window {
  jupyter: JupyterHub;
}
