import { useContext, useState } from "react";
import { PermalinkContext } from "../context/Permalink";

function Permalink() {
  const { copyPermalink } = useContext(PermalinkContext);
  const [ justCopied, setJustCopied ] = useState<boolean>(false);

  const handleButtonClick = () => {
    copyPermalink().then(() => {
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 3000);
    });
  };

  return (
    justCopied ? (
      <div>Copied to clipboard</div>
    ) : (
      <button type="button" className="btn btn-link p-0" onClick={handleButtonClick}>
        Permalink
      </button>
    )
  );
}

export default Permalink;
