const DB_NAME = "jupytherhub-imagebuild";

const STORES = {
  "repositories": {
    index: {
      config: { unique: true },
      fields: ["field_name", "repository", "ref"],
    },
  },
  "choices": {
    index: {
      config: { unique: true },
      fields: ["field_name", "choice"],
    },
  }
} as const;

function initDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 4);
    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      Object.keys(STORES).forEach((name) => {
        const { config, fields } = STORES[name as keyof typeof STORES].index;

        if (event.oldVersion < 3) {
          const objectStore = db.createObjectStore(name, { keyPath: "id" });
          objectStore.createIndex(fields.join(", "), fields.map(f => f), config);
        }
        if (event.oldVersion < 4) {
          if (name === "repositories") {
            const repoIndexFields = fields.slice(0, -1);
            request.transaction.objectStore("repositories").createIndex(repoIndexFields.join(", "), repoIndexFields.map(f => f));
          }
        }
      });
    };
  });
}

export function getRecords(store: keyof typeof STORES) {
  return new Promise((resolve, reject) => {
    initDb().then((db) => {
      const transaction = db.transaction([store], "readonly");

      const objectStore = transaction.objectStore(store);
      const dbReq = objectStore.getAll();
      dbReq.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        resolve(result);
      };
      dbReq.onerror = (event) => reject((event.target as IDBRequest).error);
      db.close();
    });
  });
}

export function cacheOption<StoreName extends keyof typeof STORES>(
  store: StoreName,
  record: Record<typeof STORES[StoreName]["index"]["fields"][number], string>
): Promise<void> {
  return new Promise((resolve, reject) => {
    initDb().then((db) => {
      const transaction = db.transaction([store], "readwrite");
      const objectStore = transaction.objectStore(store);

      const fields = STORES[store].index.fields;
      const index = objectStore.index(fields.join(", "));
      const dbReq = index.get(fields.map((key) => record[key as keyof typeof record]));

      dbReq.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;

        if (result) {
          // update the record if the choice combination has been used before
          result.num_used = result.num_used + 1;
          result.last_used = new Date().toISOString();
          const r = objectStore.put(result);
          r.onsuccess = () => resolve();
          r.onerror = (event) => reject((event.target as IDBRequest).error);
        } else {
          const r = objectStore.add({
            ...record,
            id: crypto.randomUUID(),
            num_used: 1,
            last_used: new Date().toISOString(),
          });
          r.onsuccess = () => resolve();
          r.onerror = (event) => reject((event.target as IDBRequest).error);
        }
      };
      db.close();
    });
  });
}

export function removeOption<StoreName extends keyof typeof STORES>(
  store: StoreName,
  record: Record<typeof STORES[StoreName]["index"]["fields"][number], string>
): Promise<void> {
  return new Promise((resolve, reject) => {
    initDb().then((db) => {
      const transaction = db.transaction([store], "readwrite");
      const objectStore = transaction.objectStore(store);

      const fields = STORES[store].index.fields;
      const index = objectStore.index(fields.join(", "));
      const dbReq = index.get(fields.map((key) => record[key as keyof typeof record]));

      dbReq.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        const r = objectStore.delete(result.id);
        r.onsuccess = () => resolve();
        r.onerror = (event) => reject((event.target as IDBRequest).error);
      };
      dbReq.onerror = (event) => reject((event.target as IDBRequest).error);

      db.close();
    });
  });
}

export function removeRepository(fieldName: string, repository: string): Promise<void> {
  return new Promise((resolve, reject) => {
    initDb().then((db) => {
      const transaction = db.transaction(["repositories"], "readwrite");
      const objectStore = transaction.objectStore("repositories");

      const fields = STORES["repositories"].index.fields.slice(0, -1);
      const index = objectStore.index(fields.join(", "));
      const dbReq = index.getAll([fieldName, repository]);

      dbReq.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        Promise.all(result.map((res: {id: string}) => {
          return new Promise<void>((deleteResolve, deleteReject) => {
            const r = objectStore.delete(res.id);
            r.onsuccess = () => deleteResolve();
            r.onerror = (event) => deleteReject((event.target as IDBRequest).error);
          });
        }))
          .then(() => resolve())
          .catch((e) => reject(e));
      };

      dbReq.onerror = (event) => reject((event.target as IDBRequest).error);
      db.close();
    });
  });
}
