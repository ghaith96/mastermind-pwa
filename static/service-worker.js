// A minimal service worker that only caches static assets
const CACHE_NAME = 'mastermind-static-v2';

// Get the base path from the service worker's location
const BASE_PATH = self.location.pathname.replace('service-worker.js', '');

const STATIC_ASSETS = [
  BASE_PATH + 'favicon.svg',
  BASE_PATH + 'icon-192.png',
  BASE_PATH + 'icon-512.png',
  BASE_PATH + 'manifest.json'
];

// Install event - cache static assets only
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Helper function to determine if a request is for a static asset
function isStaticAsset(url) {
  return STATIC_ASSETS.includes(url) || 
         url.match(/\.(png|jpg|jpeg|svg|ico|json)$/);
}

// Fetch event - only cache static assets, let everything else go to the network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Only cache static assets, nothing else
  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then((networkResponse) => {
              // Cache a copy of the response
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
              
              return networkResponse;
            });
        })
    );
  }
  
  // For all other requests, go straight to the network
  // This ensures we don't interfere with app state or dynamic content
});