const version = '1.0.0'
const CACHE_NAME = version + '::Astrology'
const urlsToCache = [
  'manifest.json',
  'index.html',
  'src/index.css',
  'src/index.js',
  'src/astrology.js',
  'src/qreki.php',
  'src/get_qreki.php',
  'src/icons/icon-192x192.png',
  'src/icons/icon-384x384.png',
  'src/icons/icon-512x512.png'
]


// InstallEvent
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  )
})

// FetchEvent
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      return response ? response : fetch(event.request);
    })
  )
})

// ActivatedEvent
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keylist => {
      return Promise.all(
        keylist
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      )
    })
    .then(() => self.clients.claim())
  )
})
