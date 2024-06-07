var CACHE_NAME = "pokemon-pwa-cache-v1";
var urlsToCache = ["/", "/index.html", "/bundle.js", "/offline.html"];

self.addEventListener("install", function (event) {
    // console.log("[Service Worker] Install");
    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(
                keyList.map(function (key) {
                    if (key !== CACHE_NAME) {
                        //console.log("[Service Worker] Deleting old cache:", key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(function () {
            // console.log("[Service Worker] Caching new resources");
            return caches.open(CACHE_NAME).then(function (cache) {
                return cache.addAll(urlsToCache);
            });
        })
    );
});

self.addEventListener("activate", function (event) {
    // console.log("[Service Worker] Activate");
    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(
                keyList.map(function (key) {
                    if (key !== CACHE_NAME) {
                        //console.log("[Service Worker] Deleting old cache:", key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(function () {
            return self.clients.claim();
        })
    );
});

self.addEventListener("fetch", function (event) {
    // console.log("[Service Worker] Fetch", event.request.url);
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                //console.log("[Service Worker] Found in cache:", event.request.url);
                return response;
            }
            // console.log("[Service Worker] Network request for:", event.request.url);
            return fetch(event.request).catch(function () {
                //console.log("[Service Worker] Fetch failed; returning offline page instead.");
                return caches.match("/offline.html");
            });
        })
    );
});
