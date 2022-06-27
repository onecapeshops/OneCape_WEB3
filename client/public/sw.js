/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const OFFLINE_VERSION = 1;
const CACHE_NAME = 'offline';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));
    })(),
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      if ('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })(),
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })(),
    );
  }
});

// eslint-disable-next-line func-names
// self.addEventListener('notificationclick', function(event) {
//   const subDomain = localStorage.getItem('subdomain');
//   const url = `https://${subDomain}onecape.in/`;
//   event.notification.close(); // Android needs explicit close.
//   event.waitUntil(
//     clients.matchAll({ type: 'window' }).then(windowClients => {
//       // Check if there is already a window/tab open with the target URL
//       // eslint-disable-next-line no-plusplus
//       for (let i = 0; i < windowClients.length; i++) {
//         const client = windowClients[i];
//         // If so, just focus it.
//         if (client.url === url && 'focus' in client) {
//           return client.focus();
//         }
//       }
//       // If not, then open the target URL in a new window/tab.
//       if (clients.openWindow) {
//         return clients.openWindow(url);
//       }
//       return true;
//     }),
//   );
// });
