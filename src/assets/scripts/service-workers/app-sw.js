importScripts('./../utils/pouchdb.min.js');
importScripts('./../utils/utils.js');

const CACHE_INMMUTABLE = 'COURSE-CACHES-V1.0';

const SYNC_REGISTER = {
  COURSE: 'sync-course'
};

const CONFIG = {
  URL_BASE: 'http://localhost:3000/api/',
  ENTITIES: {
    COURSE: 'course'
  }
}

const includeToCache = [
  // '/assets/scripts/service-workers/app-sw.js',
  'http://localhost:4200/main.js',
  '/assets/scripts/utils/pouchdb.min.js',
];

const dbOffline = new PouchDB('dbOffline');

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_INMMUTABLE)
      .then(cache => {
        return cache.addAll(includeToCache);
      })
      .then(() => {
        console.log("INSTALLED");
        return self.skipWaiting();
      })
      .catch((e) => console.log(e))
  );
});

self.addEventListener("activate", event => {
  console.log("ACTIVATING");
  const deleteCachePromise = caches.keys()
    .then(keys => {
      return Promise.all(keys.map(x => {
        if (CACHE_INMMUTABLE != x && x.indexOf(CACHE_INMMUTABLE.slice(0,14)) != -1) return caches.delete(x);
      }));
    });

  event.waitUntil(deleteCachePromise);
});

self.addEventListener("fetch", event => {
  if (event.request.url.toString().toLowerCase().indexOf('course') !== -1) {
    return;
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          } else {
            return caches.open(CACHE_INMMUTABLE).then(cache => {
              cache.addAll([event.request]);
              return fetch(event.request);
            });
          }
        }).catch(e => console.log(e))
    );
  }
});

self.addEventListener("sync", event => {
  console.log("SYNC");
  if (event.tag === SYNC_REGISTER.COURSE) {
    event.waitUntil(
      dbOffline.allDocs({ include_docs: true })
        .then(async docs => {
          let promises = [];
          for (const course of docs.rows) {

            course.doc.body.FechaModificacion = new Date().toISOString();

            promises.push(fetch(CONFIG.URL_BASE + CONFIG.ENTITIES.COURSE, {
              method: 'POST',
              body: JSON.stringify(course.doc.body),
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            }));
          }
          return Promise.all(promises)
            .then(() => {
              let promiseToDelete = [];
              for (const course of docs.rows) {
                promiseToDelete.push(dbOffline.remove(course.doc));
              }
              return Promise.all(promiseToDelete);
            });
        })
    );
  }
});


self.addEventListener("fetch", event => {
  debugger;
  console.log('FETCHING FROM SW');
  let res = null;
  if (event.request.url.toString().toLowerCase().indexOf('course') !== -1) {
    res = catchApiRequest(event);
    event.respondWith(res);
  }
});


function catchApiRequest(event) {
  let request = event.request;
  if (request.clone().method === 'POST') {
    if (!isOnline()) {
      let promiseSaveForm = request.clone().json();
      return promiseSaveForm
        .then((formData) => {
          return saveHttpRequest(formData);
        })
        .catch(e => console.log(e));
    } else {
      return fetch(request);
    }
  } else {
    return fetch(request);
  }
}

function saveHttpRequest(body) {

  let objToSave = {
    _id: new Date().toISOString(),
    body,
  }
  let response = null;
  return dbOffline.put(objToSave)
    .then(model => {
      self.registration.sync.register(SYNC_REGISTER.COURSE);
      response = { Id: body.Id };
      return new Response(JSON.stringify(response));
    });
}
