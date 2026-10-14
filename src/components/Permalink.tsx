import { KeyboardEventHandler, useContext, useState } from "react";
import { LuChevronDown, LuChevronRight } from "react-icons/lu";
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
  // while the user is still filling in the options.
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <div>
      <label htmlFor={id} className="form-label mb-1">
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
  const { copyPermalink, autoStart, setAutoStart, gitPuller, setGitPuller } =
    useContext(PermalinkContext);

  const [justCopied, setJustCopied] = useState<boolean>(false);
  const [showGitPuller, setShowGitPuller] = useState<boolean>(!!gitPuller.repo);

  const handleRepoChange = (value: string) => {
    // Let people paste a link to a notebook straight from their browser.
    const parsed = parseRepositoryUrl(value);
    if (parsed) {
      setGitPuller({ repo: parsed.repo, branch: parsed.branch || "", filePath: parsed.filePath || "" });
      return;
    }
    setGitPuller({ ...gitPuller, repo: value });
  };

  const handleButtonClick = () => {
    copyPermalink().then(() => {
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 3000);
    });
  };

  return (
    <div className="border-top" onClick={(e) => e.stopPropagation()}>
      <div className="mt-2 mb-2">
        <button
          type="button"
          className="btn btn-link p-0 d-inline-flex align-items-center gap-1"
          aria-expanded={showGitPuller}
          aria-controls="permalink-gitpuller"
          onClick={() => setShowGitPuller((shown) => !shown)}
        >
          {showGitPuller ? <LuChevronDown aria-hidden /> : <LuChevronRight aria-hidden />}
          nbgitpuller options
        </button>
        {showGitPuller && (
          <div className="permalink-options mt-2" id="permalink-gitpuller">
            <div className="profile-option-control-hint">
              Clones the repository into the server and opens it. Requires nbgitpuller to be installed in
              the image.
            </div>
            <div className="permalink-fields d-flex flex-column gap-3 mt-3">
              <LinkField
                id="permalink-repo"
                label="Repository"
                value={gitPuller.repo}
                placeholder="https://github.com/org/repo"
                hint="Paste a link to a file in the repository to fill in the branch and file below."
                onChange={handleRepoChange}
              />
              <LinkField
                id="permalink-branch"
                label="Branch"
                value={gitPuller.branch}
                placeholder="main"
                hint="Leave empty to use the repository's default branch."
                onChange={(branch) => setGitPuller({ ...gitPuller, branch })}
              />
              <LinkField
                id="permalink-file"
                label="File to open"
                value={gitPuller.filePath}
                placeholder="notebooks/example.ipynb"
                hint="Path within the repository. Leave empty to open the repository folder."
                onChange={(filePath) => setGitPuller({ ...gitPuller, filePath })}
              />
            </div>
          </div>
        )}
      </div>
      <div className="d-flex flex-wrap align-items-center gap-3">
        <button
          type="button"
          className="btn btn-link p-0"
          onClick={handleButtonClick}
        >
          Copy Permalink
        </button>
        <div className="form-check form-switch mb-0">
          <input
            type="checkbox"
            role="switch"
            className="form-check-input"
            id="permalink-autostart"
            checked={autoStart}
            onChange={(e) => setAutoStart(e.target.checked)}
            aria-describedby="permalink-autostart-hint"
          />
          <label className="form-check-label" htmlFor="permalink-autostart">
            Auto-start
          </label>
        </div>
        {justCopied && (
          <span className="small text-body-secondary" role="status">
            Copied to clipboard
          </span>
        )}
      </div>
      <div id="permalink-autostart-hint" className="profile-option-control-hint">
        With auto-start, opening the permalink launches the server without
        waiting for Start to be pressed.
      </div>

    </div>
  );
}

export default Permalink;
