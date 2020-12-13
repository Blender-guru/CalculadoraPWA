; 
const CACHE_NAME='v1_cache_calculadora_pwa',
urlsToCache=[
    './',
    'https://fonts.googleapis.com/css?family=Open+Sans&display=swap',
    './style.css',
    './script.js',
    './img/favicon_io/favicon-32x32.png',
    './img/favicon_io/android-chrome-192x192.png',
    './img/favicon_io/android-chrome-512x512.png',
    './img/favicon_io/apple-touch-icon.png',
    './img/favicon_io/favicon-32x32.png'
]

self.addEventListener('install', e => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
          console.log('[ServiceWorker] Pre-caching offline page');
          return cache.addAll(urlsToCache);
        })
    );

    evt.waitUntil(
        caches.keys().then((keyList) => {
          return Promise.all(keyList.map((key) => {
            if (key !== CACHE_NAME) {
              console.log('[ServiceWorker] Removing old cache', key);
              return caches.delete(key);
            }
          }));
        })
    );
    
    //antiguo code con fallos, no funciona offline
    /*e.waitUntil(
        caches.open(CACHE_NAME)
        .then(CACHE => {
            return caches.addAll(urlsToCache)
            .then(() => self.skipWaiting())
        })
        .catch(err => console.warn('Fallo registro de cache', err))
    )*/
});

self.addEventListener('activate', e => {
    const cacheWhitelist = [CACHE_NAME]

    e.waitUntil(
        caches.keys().then(cachesNames => {
            cachesNames.map(cacheNames => {
                if(cacheWhitelist.indexOf(cacheNames) == -1) return caches.delete(cacheNames);
            })
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
        .then(res => {
            if(res)
            {
                return res
            }
            return fetch(e.request)
        })
    )
});