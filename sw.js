self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    // Necessário para ser instalável
    event.respondWith(fetch(event.request));
});
