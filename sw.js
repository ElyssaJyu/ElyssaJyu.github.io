const CACHE_NAME = `browser-portrait`;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
      'https://d3js.org/d3.v4.min.js',
      '/node_modules/d3-cloud/build/d3.layout.cloud.js',
      '/',
      '/script.js',
      '/manifest.json',
    ]);
  })());
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    if (event.request.url.endsWith('/manifest.json')) {
      try {
        const fetchResponse = await fetch(event.request);
        cache.put(event.request, fetchResponse.clone());
        return fetchResponse;
      } catch (e) {
        const cachedResponse = await cache.match(event.request);
        return cachedResponse || new Response("Error fetching manifest", { status: 404 });
      }
    }

    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    } else {
      try {
        const fetchResponse = await fetch(event.request);
        if (!event.request.url.startsWith('chrome-extension://')) {
          cache.put(event.request, fetchResponse.clone());
        }
        return fetchResponse;
      } catch (e) {
        // Handle fetch error
      }
    }
  })());
});

