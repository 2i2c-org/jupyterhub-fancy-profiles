import { useCallback, useEffect, useState } from "react";

const DB_NAME = "jupytherhub-imagebuild";
const STORE_NAME = "repositories";

function initDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 3);
    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const objectStore = db.createObjectStore(STORE_NAME, { keyPath: "id" });
      objectStore.createIndex("field_name, repository, ref", ["field_name", "repository", "ref"], { unique: true });
    };
  });
}

function useRepositoryCache(fieldName: string) {
  const [db, setDb] = useState<IDBDatabase>();

  useEffect(() => {
    initDb().then(setDb);
  }, []);


  const cacheRepositorySelection = useCallback((repository: string, ref: string) => {
    const transaction = db.transaction(["repositories"], "readwrite");
    const objectStore = transaction.objectStore("repositories");

    const index = objectStore.index("field_name, repository, ref");
    const dbReq = index.get([fieldName, repository, ref]);
    dbReq.onsuccess = (event) => {
      const result = (event.target as IDBRequest).result;
      if (result) {
        // update the record
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
          last_used: new Date().toISOString()
        });
        r.onerror = (event) => {
          console.error((event.target as IDBRequest).error);
        };
      }
    };
  }, []);

  return {
    cacheRepositorySelection,
  };
}

export default useRepositoryCache;
