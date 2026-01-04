// Service Worker for Offline Support and Caching
const CACHE_NAME = 'givea-v2-android';
const RUNTIME_CACHE = 'givea-runtime-v2';
const IMAGE_CACHE = 'givea-images-v2';
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB max cache size for Android

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/logo1.png',
  '/logo2.ico',
  '/manifest.json',
];

// Cache strategies
const CACHE_FIRST_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
  /\.(?:css|js)$/,
  /\.(?:woff|woff2|ttf|eot)$/,
];

// Network first patterns (API calls, etc.)
const NETWORK_FIRST_PATTERNS = [
  /\/api\//,
  /\.supabase\.co\//,
  /auth\/v1\//,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  
  // Take control of all pages immediately
  return self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests (except for known patterns)
  if (url.origin !== location.origin && !NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.href))) {
    return;
  }
  
  // Android optimization: Skip caching for very large files
  if (request.headers.get('content-length') && parseInt(request.headers.get('content-length')) > 10 * 1024 * 1024) {
    // Files larger than 10MB - don't cache on Android
    return;
  }
  
  // Network First strategy for API calls and Supabase
  if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.href))) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }
  
  // Cache First strategy for static assets
  if (CACHE_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname)) || 
      STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }
  
  // Stale-While-Revalidate for HTML pages
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(staleWhileRevalidateStrategy(request));
    return;
  }
  
  // Default: Network first with cache fallback
  event.respondWith(networkFirstStrategy(request));
});

// Cache First Strategy - good for static assets
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.status === 200) {
      // Check cache size before adding (Android optimization)
      const cacheSize = await getCacheSize();
      if (cacheSize < MAX_CACHE_SIZE) {
        cache.put(request, response.clone());
      }
    }
    
    return response;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);
    // Return offline page if available
    const offlinePage = await cache.match('/index.html');
    return offlinePage || new Response('Offline', { status: 503 });
  }
}

// Get total cache size (Android optimization)
async function getCacheSize() {
  let totalSize = 0;
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    for (const key of keys) {
      const response = await cache.match(key);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}

// Clean old cache entries if size exceeds limit (Android optimization)
async function cleanOldCacheEntries() {
  const cacheSize = await getCacheSize();
  
  if (cacheSize > MAX_CACHE_SIZE) {
    console.log('[Service Worker] Cache size exceeded, cleaning old entries...');
    // Implementation for cleaning old entries
    // This is a simplified version - you might want to implement LRU cache
  }
}

// Network First Strategy - good for API calls
async function networkFirstStrategy(request) {
  // Don't cache POST, PUT, DELETE, PATCH requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    // Just pass through without caching
    try {
      return await fetch(request);
    } catch (error) {
      console.error('[Service Worker] Network request failed:', error);
      return new Response(
        JSON.stringify({ error: 'Offline - Please check your connection' }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }
  
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const response = await fetch(request);
    
    // Only cache successful GET requests
    if (response.status === 200 && request.method === 'GET') {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[Service Worker] Network request failed, trying cache:', error);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Return offline response for API calls
    return new Response(
      JSON.stringify({ error: 'Offline - Please check your connection' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Stale-While-Revalidate Strategy - good for HTML pages
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Network failed, return cached if available
    return cached;
  });
  
  // Return cached version immediately, update in background
  return cached || fetchPromise;
}

// Handle background sync (if needed in future)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Implement background sync logic here
  console.log('[Service Worker] Syncing data...');
}

// Handle push notifications (if needed in future)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Givea';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/logo1.png',
    badge: '/logo2.ico',
    tag: data.tag || 'notification',
    data: data,
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});

