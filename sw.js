; 
const CACHE_NAME='v0.1_cache_calculadora_pwa',
urlsToCache=[
    './',
    'https://fonts.googleapis.com/css?family=Open+Sans&display=swap',
    './style.css',
    './script.js',
    './img/favicon_io/favicon-32x32.png',
    './img/favicon_io/android-chrome-192x192.png',
    './img/favicon_io/android-chrome-512x512.png',
    './img/favicon_io/apple-touch-icon.png'
]

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
          console.log('Obteniendo pagina offline');
          return cache.addAll(urlsToCache);
        })
    );
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
    //set cache only
    e.respondWith(caches.match(e.request));
});