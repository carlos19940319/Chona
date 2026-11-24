const CACHE = 'la-chona-pwa-static-v1';
const scope = self.registration.scope;
const offline = new URL('offline.html', scope).href;
const assets = [offline, new URL('icon-192.png', scope).href, new URL('icon-512.png', scope).href];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(assets)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('la-chona-pwa-static-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const r = event.request;
  if (r.method !== 'GET' || !r.url.startsWith(scope)) return;
  if (r.mode === 'navigate') {
    event.respondWith(fetch(r, {cache:'no-store'}).catch(async () => (await caches.match(offline, {cacheName:CACHE})) || Response.error()));
  } else if (assets.includes(r.url)) {
    event.respondWith(fetch(r).catch(async () => (await caches.match(r, {cacheName:CACHE})) || Response.error()));
  }
});
