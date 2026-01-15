const CACHE_NAME = 'gustoplan-v1';
const ASSETS_TO_CACHE = [
    './index.html',
    './src/style.css',
    './src/script.js',
    './src/shopping-mode.js',
    './src/main.js',
    './src/lists.js',
    './src/view-plan.js',
    './src/plans.js',
    './src/auth.js',
    './src/router.js',
    './manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
    'https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

self.addEventListener('fetch', (event) => {
    // Firestore/API requests should go to network first or be handled by Firestore SDK offline persistence
    if (event.request.url.includes('firestore.googleapis.com') || event.request.url.includes('identitytoolkit')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache Hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(() => {
                    // Optional: Return offline page if navigation request fails
                });
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
