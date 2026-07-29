import { KeyboardEventHandler, useContext, useState } from "react";
import { PermalinkContext } from "../context/Permalink";
import { parseRepositoryUrl } from "../utils/permalink";

interface ILinkField {
  id: string;
  label: string;
  value: string;
  hint?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

function LinkField({ id, label, value, hint, placeholder, onChange }: ILinkField) {
  // Enter inside a form field submits the form, which would spawn a server
  // while the user is still filling in the link options.
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <div className="permalink-field">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        type="text"
        className="form-control"
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {hint && <div className="profile-option-control-hint">{hint}</div>}
    </div>
  );
}

function Permalink() {
  const { copyPermalink, initialLinkOptions } = useContext(PermalinkContext);
  const initialGitPuller = initialLinkOptions?.gitPuller;

  const [justCopied, setJustCopied] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [autoStart, setAutoStart] = useState<boolean>(
    !!initialLinkOptions?.autoStart,
  );
  const [gitPullerEnabled, setGitPullerEnabled] = useState<boolean>(
    !!initialGitPuller,
  );
  const [repo, setRepo] = useState<string>(initialGitPuller?.repo || "");
  const [branch, setBranch] = useState<string>(initialGitPuller?.branch || "");
  const [filePath, setFilePath] = useState<string>(
    initialGitPuller?.filePath || "",
  );
  const [error, setError] = useState<string>("");

  const handleRepoChange = (value: string) => {
    setError("");
    // Let people paste a link to a notebook straight from their browser.
    const parsed = parseRepositoryUrl(value);
    if (parsed) {
      setRepo(parsed.repo);
      setBranch(parsed.branch || "");
      setFilePath(parsed.filePath || "");
      return;
    }
    setRepo(value);
  };

  const handleButtonClick = () => {
    if (gitPullerEnabled && !repo.trim()) {
      setError("Enter the repository to open, or turn off opening a repository.");
      setShowOptions(true);
      return;
    }
    setError("");

    copyPermalink({
      autoStart,
      gitPuller: gitPullerEnabled ? { repo, branch, filePath } : null,
    }).then(() => {
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 3000);
    });
  };

  return (
    <div className="permalink-container" onClick={(e) => e.stopPropagation()}>
      <div className="permalink-actions">
        <button
          type="button"
          className="btn btn-link p-0"
          onClick={handleButtonClick}
        >
          Copy Permalink
        </button>
        <button
          type="button"
          className="btn btn-link p-0"
          aria-expanded={showOptions}
          aria-controls="permalink-options"
          onClick={() => setShowOptions((shown) => !shown)}
        >
          {showOptions ? "Hide link options" : "Link options"}
        </button>
        {justCopied && (
          <span className="permalink-copied" role="status">
            Copied to clipboard
          </span>
        )}
      </div>

      {showOptions && (
        <div className="permalink-options" id="permalink-options">
          <div className="permalink-option">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="permalink-autostart"
                checked={autoStart}
                onChange={(e) => setAutoStart(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="permalink-autostart">
                Start the server automatically
              </label>
            </div>
            <div className="profile-option-control-hint">
              Opening the link launches the server with these options, without
              waiting for the person to press Start.
            </div>
          </div>

          <div className="permalink-option">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="permalink-gitpuller"
                checked={gitPullerEnabled}
                onChange={(e) => {
                  setGitPullerEnabled(e.target.checked);
                  setError("");
                }}
              />
              <label className="form-check-label" htmlFor="permalink-gitpuller">
                Open a Git repository in the server
              </label>
            </div>
            <div className="profile-option-control-hint">
              Clones the repository into the server and opens it. Requires
              nbgitpuller to be installed in the image.
            </div>

            {gitPullerEnabled && (
              <div className="permalink-fields">
                <LinkField
                  id="permalink-repo"
                  label="Repository"
                  value={repo}
                  placeholder="https://github.com/org/repo"
                  hint="Paste a link to a file in the repository to fill in the branch and file below."
                  onChange={handleRepoChange}
                />
                <LinkField
                  id="permalink-branch"
                  label="Branch"
                  value={branch}
                  placeholder="main"
                  hint="Leave empty to use the repository's default branch."
                  onChange={(value) => setBranch(value)}
                />
                <LinkField
                  id="permalink-file"
                  label="File to open"
                  value={filePath}
                  placeholder="notebooks/example.ipynb"
                  hint="Path within the repository. Leave empty to open the repository folder."
                  onChange={(value) => setFilePath(value)}
                />
              </div>
            )}
          </div>

          {error && <div className="invalid-feedback d-block">{error}</div>}
        </div>
      )}
    </div>
  );
}

export default Permalink;
