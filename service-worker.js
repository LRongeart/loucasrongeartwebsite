// Service Worker for Performance and Offline Functionality
const CACHE_NAME = 'loucas-rongeart-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
    './',
    './index.html',
    './about.html',
    './contact.html',
    './courses.html',
    './styles.css',
    './shared/project-styles.css',
    './css/mobile-optimizations.css',
    './js/performance.js',
    './shared/header-footer-loader.js',
    './header.html',
    './footer.html',
    './offline.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS.map(url => {
                    // Handle relative URLs
                    return new Request(url, { mode: 'no-cors' });
                })).catch(error => {
                    console.warn('Service Worker: Some assets failed to cache', error);
                    // Continue installation even if some assets fail
                    return Promise.resolve();
                });
            })
            .then(() => {
                console.log('Service Worker: Static assets cached');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve cached content when available
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip external requests (except for fonts and images)
    if (url.origin !== location.origin && 
        !url.hostname.includes('fonts.googleapis.com') &&
        !url.hostname.includes('fonts.gstatic.com') &&
        !request.url.includes('.jpg') &&
        !request.url.includes('.png') &&
        !request.url.includes('.gif') &&
        !request.url.includes('.webp')) {
        return;
    }
    
    event.respondWith(
        cacheFirst(request)
            .catch(() => networkFirst(request))
            .catch(() => {
                // If both cache and network fail, return offline page for navigation requests
                if (request.mode === 'navigate') {
                    return caches.match('/offline.html');
                }
                // For other requests, return a basic response
                return new Response('Offline', { 
                    status: 200, 
                    statusText: 'Offline',
                    headers: { 'Content-Type': 'text/plain' }
                });
            })
    );
});

// Cache-first strategy for static assets
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        console.log('Service Worker: Serving from cache', request.url);
        return cachedResponse;
    }
    
    throw new Error('Not in cache');
}

// Network-first strategy with cache fallback
async function networkFirst(request) {
    try {
        console.log('Service Worker: Fetching from network', request.url);
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            
            // Clone the response before caching
            const responseClone = networkResponse.clone();
            
            // Cache the response
            await cache.put(request, responseClone);
            console.log('Service Worker: Cached new resource', request.url);
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Network failed, trying cache', request.url);
        
        // Try to get from cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// Background sync for failed requests (if supported)
if ('sync' in self.registration) {
    self.addEventListener('sync', (event) => {
        if (event.tag === 'background-sync') {
            console.log('Service Worker: Background sync triggered');
            event.waitUntil(
                // Handle background sync logic here
                Promise.resolve()
            );
        }
    });
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: CACHE_NAME
        });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            })
        );
    }
});
