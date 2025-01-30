import { ChangeEventHandler, useCallback, useEffect, useState } from "react";

function extractOrgAndRepo(value: string) {
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

export default function useRepositoryField(defaultValue: string) {
  const [value, setValue] = useState<string>(defaultValue || "");
  const [error, setError] = useState<string>();
  const [repoId, setRepoId] = useState<string>();

  useEffect(() => {
    if (defaultValue) {
      // Automatically validate the value if the defaultValue is set
      onBlur();
    }
  }, [defaultValue]);

  const validate = () => {
    setError(undefined);
    const orgRepoString = extractOrgAndRepo(value);

    if (!orgRepoString) {
      return "Provide the repository as the format 'organization/repository'.";
    }
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const onBlur = useCallback(() => {
    setRepoId(undefined);
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
