import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { cacheOption, getRecords, removeOption, removeRepository } from "../utils/indexedDb";

export interface IFormCache {
  getChoiceOptions: (fieldName: string) => string[];
  cacheChoiceOption: (fieldName: string, choice: string) => void;
  removeChoiceOption: (fieldName: string, choice: string) => void;
  getRepositoryOptions: (fieldName: string) => string[];
  getRefOptions: (fieldName: string, repoName?: string) => string[];
  removeRepositoryOption: (fieldName: string, repository: string) => void;
  removeRefOption: (fieldName: string, repository: string, ref: string) => void;
  cacheRepositorySelection: (
    fieldName: string,
    repository: string,
    ref: string,
  ) => void;
}

type TChoiceEntry = {
  id: string;
  field_name: string;
  choice: string;
  last_used: string;
  num_used: string;
};

type TRepositoryEntry = {
  id: string;
  field_name: string;
  repository: string;
  ref: string;
  last_used: string;
  num_used: string;
};

export const FormCacheContext = createContext<IFormCache>(null);

export const FormCacheProvider = ({ children }: PropsWithChildren) => {
  const [previousChoices, setPreviousChoices] = useState<TChoiceEntry[]>([]);
  const [previousRepositories, setPreviousRepositories] = useState<
    TRepositoryEntry[]
  >([]);

  const loadPreviousChoices = () => {
    getRecords("choices").then(setPreviousChoices);
  };

  const loadPreviousRepositories = () => {
    getRecords("repositories").then(setPreviousRepositories);
  };

  const cacheChoiceOption = (fieldName: string, choice: string) => {
    cacheOption(
      "choices",
      {
        field_name: fieldName,
        choice,
      }
    ).then(loadPreviousChoices);
  };

  const cacheRepositorySelection = (fieldName: string, repository: string, ref: string) => {
    cacheOption(
      "repositories",
      {
        field_name: fieldName,
        repository,
        ref,
      }
    ).then(loadPreviousRepositories);
  };

  const getChoiceOptions = (fieldName: string) => {
    return previousChoices
      .filter(({ field_name }) => fieldName === field_name)
      .map(({ choice }) => choice);
  };

  const removeChoiceOption = (fieldName: string, choice: string) => {
    removeOption(
      "choices",
      {
        field_name: fieldName,
        choice,
      }
    ).then(loadPreviousChoices);
  };

  const getRepositoryOptions = useCallback(
    (fieldName: string) => {
      const options = previousRepositories
        .filter(({ field_name }) => field_name === fieldName)
        .reduce((acc, { repository, num_used }) => {
          const repo = acc.find(([repoName]) => repository === repoName);
          if (repo) {
            return [
              ...acc.filter(([repoName]) => repository !== repoName),
              {
                ...repo,
                num_used: repo.num_used + num_used,
              },
            ];
          } else {
            return [...acc, [repository, num_used]];
          }
        }, [])
        .map(([repository]) => repository);

      return options;
    },
    [previousRepositories],
  );

  const getRefOptions = useCallback(
    (fieldName: string, repoName?: string) => {
      if (!repoName) return [];
      const options = previousRepositories
        .filter(
          ({ field_name, repository }) =>
            field_name === fieldName && repository === repoName,
        )
        .map(({ ref }) => ref);

      return options;
    },
    [previousRepositories],
  );

  const removeRefOption = (fieldName: string, repository: string, ref: string) => {
    removeOption(
      "repositories",
      {
        field_name: fieldName,
        repository,
        ref,
      }
    ).then(loadPreviousRepositories);
  };

  const removeRepositoryOption = (fieldName: string, repository: string) => {
    removeRepository(fieldName, repository).then(loadPreviousRepositories);
  };

  useEffect(() => {
    // Retrieve previously used choices
    loadPreviousChoices();
    loadPreviousRepositories();
  }, []);

  const contextValue = {
    getChoiceOptions,
    cacheChoiceOption,
    getRepositoryOptions,
    getRefOptions,
    cacheRepositorySelection,
    removeChoiceOption,
    removeRepositoryOption,
    removeRefOption
  };

  return (
    <FormCacheContext.Provider value={contextValue}>
      {children}
    </FormCacheContext.Provider>
  );
};
