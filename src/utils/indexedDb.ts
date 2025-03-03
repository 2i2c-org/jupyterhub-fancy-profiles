const DB_NAME = "jupytherhub-imagebuild";

const STORES = [{
  name: "repositories",
  indexes: [{
    config: { unique: true },
    fields: ["field_name", "repository", "ref"]
  }]
}, {
  name: "choices",
  indexes: [{
    config: { unique: true },
    fields: ["field_name", "choice"]
  }]
}];

export function initDb() {
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

      STORES.forEach(({ name, indexes }) => {
        const objectStore = db.createObjectStore(name, { keyPath: "id" });
        indexes.forEach(({ config, fields }) => {
          objectStore.createIndex(fields.join(", "), fields, config);
        });
      });

    };
  });
}
