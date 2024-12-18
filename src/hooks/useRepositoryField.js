import { useCallback, useEffect, useState } from "react";

function extractOrgAndRepo(value) {
  let orgRepoString;
  const orgRepoMatch = /^[^/]+\/[^/]+$/.exec(value);

  if (orgRepoMatch) {
    orgRepoString = orgRepoMatch[0];
  } else {
    const fullUrlMatch =
      /^(?:https?:\/\/)?(?:www\.)?github\.com\/((?:[^/]+\/[^/]+|[^/]+\/[^/]+)?)\/?$/.exec(
        value,
      );
    if (fullUrlMatch) {
      orgRepoString = fullUrlMatch[1];
    }
  }

  return orgRepoString;
}

export default function useRepositoryField(defaultValue) {
  const [value, setValue] = useState(defaultValue || "");
  const [error, setError] = useState();
  const [repoId, setRepoId] = useState();

  useEffect(() => {
    if (defaultValue) {
      // Automatically validate the value if the defaultValue is set
      onBlur();
    }
  }, [defaultValue]);

  const validate = () => {
    setError();
    const orgRepoString = extractOrgAndRepo(value);

    if (!orgRepoString) {
      return "Provide the repository as the format 'organization/repository'.";
    }
  };

  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const onBlur = useCallback(() => {
    setRepoId();
    const err = validate();
    if (err) {
      setError(err);
    } else {
      setRepoId(extractOrgAndRepo(value));
    }
  }, [value]);

  return {
    repo: value,
    repoError: error,
    repoId,
    repoFieldProps: {
      value,
      onChange,
      onBlur,
    },
  };
}
