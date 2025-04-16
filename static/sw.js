// This is a minimal service worker file to prevent build errors
// It does nothing but allows the site to build correctly

self.addEventListener('install', event => {
  // Skip over the "waiting" lifecycle state, to ensure that our
  // service worker becomes active even if there are still previous
  // versions active.
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Take control of all pages immediately
  event.waitUntil(clients.claim());
});

// Respond to all fetch requests with the original request
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});
