const CACHE_NAME = 'brewery-tracker-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://cdn.tailwindcss.com'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE).catch((err) => {
        console.warn('Failed to cache some resources:', err);
        // Continue installation even if some resources fail to cache
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Handle API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Update cache with fresh data
          if (response.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(event.request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Return cached version if offline
          return caches.match(event.request);
        })
    );
    return;
  }

  // Handle static assets - cache first
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Cache successful responses
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Offline fallback
          return new Response(
            '<html><body><h1>Offline</h1><p>You appear to be offline. Some features may be unavailable.</p></body></html>',
            {
              headers: { 'Content-Type': 'text/html' },
              status: 503,
            }
          );
        });
    })
  );
});

// Background sync for data sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-batches') {
    event.waitUntil(
      syncBatches().catch(() => {
        // Retry sync later
        return Promise.reject();
      })
    );
  }
});

async function syncBatches() {
  try {
    // Get batches from IndexedDB or localStorage
    const batches = await getBatchesFromStorage();
    
    // Send to server
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ batches }),
    });

    if (!response.ok) {
      throw new Error('Sync failed');
    }

    // Clear sync flag
    await clearSyncPending();
    
    return response.json();
  } catch (error) {
    console.error('Sync error:', error);
    throw error;
  }
}

async function getBatchesFromStorage() {
  // Try to get from IndexedDB first, fallback to localStorage
  return new Promise((resolve) => {
    if (typeof localStorage !== 'undefined') {
      try {
        const batches = JSON.parse(localStorage.getItem('breweryBatches') || '[]');
        resolve(batches);
      } catch {
        resolve([]);
      }
    } else {
      resolve([]);
    }
  });
}

async function clearSyncPending() {
  return new Promise((resolve) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('syncPending');
      resolve();
    } else {
      resolve();
    }
  });
}

// Push notifications (optional)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Brewery Tracker notification',
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%231e293b" width="192" height="192"/><text x="96" y="120" font-size="120" text-anchor="middle">🍺</text></svg>',
      badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect fill="%23fbbf24" width="48" height="48"/><text x="24" y="32" font-size="32" text-anchor="middle">🍺</text></svg>',
      tag: data.tag || 'default',
      requireInteraction: data.requireInteraction || false,
      actions: [
        {
          action: 'open',
          title: 'Open App',
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M5 13h6v6H5zm0-6h6v6H5zm6-6h6v6h-6zm6 0h6v6h-6z"/></svg>',
        },
        {
          action: 'close',
          title: 'Close',
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
        },
      ],
    };

    event.waitUntil(self.registration.showNotification('Brewery Tracker', options));
  } catch (error) {
    console.error('Push notification error:', error);
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Check if app is already open
        for (let client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise, open the app
        if (clients.openWindow) {
          return clients.openWindow('./');
        }
      })
    );
  }
});

// Message handler for client communication
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
