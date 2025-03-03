import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { initDb } from "../utils/indexedDb";

export interface IFormCache {
  getChoiceOptions: (fieldName: string) => string[];
  cacheChoiceOption: (fieldName: string, choice: string) => void;
  getRepositoryOptions: (fieldName: string) => string[];
  getRefOptions: (fieldName: string, repoName?: string) => string[];
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
  const [db, setDb] = useState<IDBDatabase>();
  const [previousChoices, setPreviousChoices] = useState<TChoiceEntry[]>([]);
  const [previousRepositories, setPreviousRepositories] = useState<
    TRepositoryEntry[]
  >([]);

  const loadPreviousChoices = () => {
    const transaction = db.transaction(["choices"], "readonly");
    const objectStore = transaction.objectStore("choices");

    const dbReq = objectStore.getAll();
    dbReq.onsuccess = (event) => {
      const result: TChoiceEntry[] = (event.target as IDBRequest).result;
      setPreviousChoices(result);
    };
  };

  const loadPreviousRepositories = () => {
    const transaction = db.transaction(["repositories"], "readonly");
    const objectStore = transaction.objectStore("repositories");

    const dbReq = objectStore.getAll();
    dbReq.onsuccess = (event) => {
      const result: TRepositoryEntry[] = (event.target as IDBRequest).result;
      setPreviousRepositories(result);
    };
  };

  const cacheChoiceOption = (fieldName: string, choice: string) => {
    const transaction = db.transaction(["choices"], "readwrite");
    const objectStore = transaction.objectStore("choices");

    const index = objectStore.index("field_name, choice");
    const dbReq = index.get([fieldName, choice]);
    dbReq.onsuccess = (event) => {
      const result = (event.target as IDBRequest).result;

      if (result) {
        // update the record if the choice combination has been used before
        result.num_used = result.num_used + 1;
        result.last_used = new Date().toISOString();
        const r = objectStore.put(result);
        r.onerror = (event) => {
          console.error((event.target as IDBRequest).error);
        };
      } else {
        const r = objectStore.add({
          id: crypto.randomUUID(),
          field_name: fieldName,
          choice,
          num_used: 1,
          last_used: new Date().toISOString(),
        });
        r.onerror = (event) => {
          console.error((event.target as IDBRequest).error);
        };
      }
    };
  };

  const cacheRepositorySelection = useCallback(
    (fieldName: string, repository: string, ref: string) => {
      const transaction = db.transaction(["repositories"], "readwrite");
      const objectStore = transaction.objectStore("repositories");

      const index = objectStore.index("field_name, repository, ref");
      const dbReq = index.get([fieldName, repository, ref]);
      dbReq.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        if (result) {
          // update the record if the repository/ref combination has been used before
          result.num_used = result.num_used + 1;
          result.last_used = new Date().toISOString();
          const r = objectStore.put(result);
          r.onerror = (event) => {
            console.error((event.target as IDBRequest).error);
          };
        } else {
          // create the record
          const r = objectStore.add({
            id: crypto.randomUUID(),
            field_name: fieldName,
            repository,
            ref,
            num_used: 1,
            last_used: new Date().toISOString(),
          });
          r.onerror = (event) => {
            console.error((event.target as IDBRequest).error);
          };
        }
      };
    },
    [db],
  );

  const getChoiceOptions = (fieldName: string) => {
    return previousChoices
      .filter(({ field_name }) => fieldName === field_name)
      .map(({ choice }) => choice);
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

  useEffect(() => {
    // Initialize IndexedDB connection
    initDb().then(setDb);
  }, []);

  useEffect(() => {
    // Retrieve previously used choices
    if (db) {
      loadPreviousChoices();
      loadPreviousRepositories();
    }
  }, [db]);

  const contextValue = {
    getChoiceOptions,
    cacheChoiceOption,
    getRepositoryOptions,
    getRefOptions,
    cacheRepositorySelection,
  };

  return (
    <FormCacheContext.Provider value={contextValue}>
      {children}
    </FormCacheContext.Provider>
  );
};
