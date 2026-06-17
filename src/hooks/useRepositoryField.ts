import { ChangeEventHandler, useCallback, useEffect, useState } from "react";

export function extractOrgAndRepo(value: string) {
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

const FORMAT_ERROR = "Provide the repository as the format 'organization/repository'.";

export default function useRepositoryField(defaultValue: string) {
  const [value, setValue] = useState<string>(defaultValue || "");
  const [error, setError] = useState<string>();

  // Always derived from current value — no separate state, no blur needed
  const repoId = extractOrgAndRepo(value.trim());

  useEffect(() => {
    if (defaultValue) {
      onBlur();
    }
  }, [defaultValue]);

  const resetError = useCallback(() => {
    setError(undefined);
  }, []);

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setValue(e.target.value);
    setError(undefined);
  }, []);

  // Show format error without trimming — for use when a button is clicked before blur
  const forceValidation = useCallback(() => {
    setError(extractOrgAndRepo(value.trim()) ? undefined : FORMAT_ERROR);
  }, [value]);

  const onBlur = useCallback(() => {
    const trimmedValue = value.trim();
    setValue(trimmedValue);
    setError(extractOrgAndRepo(trimmedValue) ? undefined : FORMAT_ERROR);
  }, [value]);

  return {
    repo: value,
    repoError: error,
    repoId,
    forceValidation,
    resetError,
    repoFieldProps: {
      value,
      onChange,
      onBlur,
    },
  };
}
