self.addEventListener('install', event => {
    console.log('Service worker install event!')
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            return cache.addAll(resourcesToPrecache);
        })
    )
});

self.addEventListener('activate', event => {
    console.log('Activate event!')
});

self.addEventListener('fetch', event => {
    console.log('Fetch intercepted for: ' + event.request.url);
    //TODO: explore more on these codes below to fix error it causes
    // event.respondWith(caches.match(event.request))
    // .then(cachedResponse => {
    //     return cachedResponse || fetch(event.request);
    // })
});

const cacheName = 'pasabuy-calc-v1';
const resourcesToPrecache = [
    '/',
    'index.html',
    'index.js',
    'index.css',
    'desktop-guard.html',
    'logo64.ico',
    'logo128.png',
    'logo512.png',
    'manifest.json'
];