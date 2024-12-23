const VERSION = 0;
const CACHE_NAME = 'enseirb-calculateur-cache-v' + VERSION;
const urlsToCache = [
    '/',
    '/styles/style.css',
    '/images/favicon.ico',
    '/manifest.webmanifest',
    "https://unpkg.com/vue@3/dist/vue.global.prod.js"
];

self.addEventListener('install', event => {
    self.skipWaiting()
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', event => {
    clients.claim()
    let cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.matchAll({ type: 'window' }).then(clients => {
                for (const client of clients) {
                    client.navigate(client.url);
                }
            });
        })
    );
});

function putToCache(request, response) {
    caches.open(CACHE_NAME)
    .then(cache => {
        cache.put(request, response);
    });
}

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then((cachResponse) => {
            if (cachResponse) {
                return cachResponse;
            };
            if (event.request.url.match(/\/\?/i) || event.request.url.endsWith('index.html')) {
                return caches.open(CACHE_NAME).then(cache => {
                    return cache.match('/').then((cacheRes) => {
                        if (cacheRes) {
                            return cacheRes;
                        };
                        return fetch('/').then(res => {
                            req = new Request('/')
                            putToCache(req, res.clone());
                            return res;
                        });
                    });
                });
            };
            let fetchRequest = event.request.clone();
            return fetch(fetchRequest).then((response) => {
                if (!response || response.status !== 200) {
                    if (event.request.url.match(/\.html/i)) {
                        return caches.open(CACHE_NAME).then(cache => {
                            return cache.match('/');
                        });
                    }
                    return response;
                }
                if (event.request.method === "POST") {
                    return response;
                }
                if (event.request.url.startsWith('chrome-extension')) {
                    return response;
                }
                putToCache(event.request, response.clone());
                return response;
            }).catch((err) => {
                if (event.request.url.match(/\.html/i) || event.request.url.match(/\/\?/i)) {
                    return caches.open(CACHE_NAME).then(cache => {
                        return cache.match('/');
                    });
                }
            })
        })
    );
});