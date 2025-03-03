import { useCallback, useEffect, useMemo, useState } from "react";
import { initDb } from "../utils/indexedDb";

type TRepositoryEntry = {
  id: string;
  field_name: string;
  repository: string;
  ref: string;
  last_used: string;
  num_used: string;
};

function useRepositoryCache(fieldName: string) {
  const [db, setDb] = useState<IDBDatabase>();
  const [previousRepositories, setPreviousRepositories] = useState<
    TRepositoryEntry[]
  >([]);

  const getRepositoryOptions = () => {
    const transaction = db.transaction(["repositories"], "readonly");
    const objectStore = transaction.objectStore("repositories");

    const dbReq = objectStore.getAll();
    dbReq.onsuccess = (event) => {
      const result: TRepositoryEntry[] = (event.target as IDBRequest).result;
      setPreviousRepositories(result);
    };
  };

  const cacheRepositorySelection = useCallback(
    (repository: string, ref: string) => {
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

  const repositoryOptions = useMemo(() => {
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
  }, [previousRepositories]);

  const getRefOptions = useCallback(
    (repoName?: string) => {
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
    // Retrieve previously used repository and ref combinations
    if (db) {
      getRepositoryOptions();
    }
  }, [db]);

  return {
    cacheRepositorySelection,
    repositoryOptions,
    getRefOptions,
  };
}

export default useRepositoryCache;
