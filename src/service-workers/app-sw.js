importScripts("../assets/scripts/utils/pouchdb.min.js");
importScripts("../assets/scripts/utils/utils.js");

const CACHE_INMMUTABLE = "COURSE-CACHES-V1.0";

const SYNC_REGISTER = {
  COURSE: "sync-course",
};

const CONFIG = {
  URL_BASE: "http://localhost:3000/api/",
  ENTITIES: {
    COURSE: "course",
  },
};

const includeToCache = [
  // "/assets/scripts/utils/pouchdb.min.js",
  "./import-maps/",
  // "./import-map.json",
  // "./index.json",
  // "./assets",
];

const dbOffline = new PouchDB("dbOffline");

self.addEventListener("install", (event) => {
  console.log("INSTALLING");
  event.waitUntil(
    caches
      .open(CACHE_INMMUTABLE)
      .then((cache) => {
        console.log("INCLUDING TO CACHES");
        return cache.addAll(includeToCache);
      })
      .then(() => {
        console.log("INSTALLED");
        return self.skipWaiting();
      })
      .catch((e) => console.log(e))
  );
});
