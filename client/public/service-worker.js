// Minimal service worker for PWA installability only

self.addEventListener("install", (event) => {
  self.skipWaiting();
  console.log("[SW] Installed");
});

self.addEventListener("activate", (event) => {
  self.clients.claim();
  console.log("[SW] Activated");
});

// Only handle navigation requests, let everything else pass through
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate" && event.request.url.startsWith(self.location.origin)) {
    event.respondWith(fetch(event.request));
  }
});
