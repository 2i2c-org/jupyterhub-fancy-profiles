import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { initDb } from "../utils/indexedDb";

export interface IFormCache {
  getChoiceOptions: (fieldName: string) => string[];
  cacheChoiceOption: (fieldName: string, choice: string) => void;
}

type TChoiceEntry = {
  id: string;
  field_name: string;
  choice: string;
  last_used: string;
  num_used: string;
};

export const FormCacheContext = createContext<IFormCache>(null);

export const FormCacheProvider = ({ children }: PropsWithChildren) => {
  const [db, setDb] = useState<IDBDatabase>();
  const [previousChoices, setPreviousChoices] = useState<TChoiceEntry[]>([]);

  const loadPreviousChoices = () => {
    const transaction = db.transaction(["choices"], "readonly");
    const objectStore = transaction.objectStore("choices");

    const dbReq = objectStore.getAll();
    dbReq.onsuccess = (event) => {
      const result: TChoiceEntry[] = (event.target as IDBRequest).result;
      setPreviousChoices(result);
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

  const getChoiceOptions = (fieldName: string) => {
    return previousChoices
      .filter(({ field_name }) => fieldName === field_name)
      .map(({ choice }) => choice);
  };

  useEffect(() => {
    // Initialize IndexedDB connection
    initDb().then(setDb);
  }, []);

  useEffect(() => {
    // Retrieve previously used choices
    if (db) {
      loadPreviousChoices();
    }
  }, [db]);

  const contextValue = {
    getChoiceOptions,
    cacheChoiceOption
  };

  return (
    <FormCacheContext.Provider value={contextValue}>
      {children}
    </FormCacheContext.Provider>
  );
};
