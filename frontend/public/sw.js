/* WorkZone service worker: makes the app installable and lets it start offline.
 *
 * Plain browser JS served from /public as-is (not bundled).
 *
 *  - Page loads: network first, so a new deploy shows up on the next load;
 *    offline, the cached app shell is served instead.
 *  - Vite's hashed /assets/*: cache first — a hashed URL never changes.
 *  - Icons, images, fonts: served from cache, refreshed in the background.
 *  - The API is never cached: requests to another origin (the backend) and any
 *    same-origin /api/* go straight to the network, so data is always live.
 */

const CACHE_VERSION = 'v1';
const SHELL_CACHE = `shell-${CACHE_VERSION}`;
const ASSET_CACHE = `assets-${CACHE_VERSION}`;
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const KNOWN_CACHES = [SHELL_CACHE, ASSET_CACHE, STATIC_CACHE];

// Every route is a client-side route served by index.html, so one cached copy
// under '/' answers any page load while offline.
const SHELL_URL = '/';
const STATIC_PRECACHE = [
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/favicon-32.png',
];
// Old hashed bundles pile up across deploys; keep the newest N.
const MAX_ASSET_ENTRIES = 120;
const STATIC_FILE = /\.(?:png|jpe?g|webp|gif|svg|ico|woff2?|webmanifest)$/i;

// Cache the shell and the bundles it links to, so the very first install can
// already start offline (the page that registered us loaded them before we
// existed, so we would otherwise only see them on the next visit).
async function precacheShell() {
  const res = await fetch(SHELL_URL, { cache: 'no-cache' });
  if (!res.ok) return;
  const html = await res.clone().text();
  await (await caches.open(SHELL_CACHE)).put(SHELL_URL, res);

  const assetUrls = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1]);
  if (assetUrls.length) await (await caches.open(ASSET_CACHE)).addAll(assetUrls);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // A failed precache must not fail the install; the shell is re-cached on
      // the next successful page load.
      precacheShell().catch(() => {}),
      caches.open(STATIC_CACHE).then((c) => c.addAll(STATIC_PRECACHE)).catch(() => {}),
    ]).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !KNOWN_CACHES.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trimCache(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  // keys() is in insertion order, so the oldest bundles go first.
  await Promise.all(keys.slice(0, Math.max(0, keys.length - max)).map((k) => cache.delete(k)));
}

async function networkFirstShell(event) {
  try {
    const res = await fetch(event.request);
    if (res.ok && (res.headers.get('content-type') || '').includes('text/html')) {
      const copy = res.clone();
      event.waitUntil(caches.open(SHELL_CACHE).then((c) => c.put(SHELL_URL, copy)));
    }
    return res;
  } catch (err) {
    const cached = await caches.match(SHELL_URL, { cacheName: SHELL_CACHE });
    if (cached) return cached;
    throw err;
  }
}

async function cacheFirst(event, cacheName) {
  const cached = await caches.match(event.request, { cacheName });
  if (cached) return cached;
  const res = await fetch(event.request);
  if (res.ok) {
    const copy = res.clone();
    event.waitUntil(
      caches
        .open(cacheName)
        .then((c) => c.put(event.request, copy))
        .then(() => trimCache(cacheName, MAX_ASSET_ENTRIES))
    );
  }
  return res;
}

async function staleWhileRevalidate(event, cacheName) {
  const cached = await caches.match(event.request, { cacheName });
  const network = fetch(event.request).then((res) => {
    if (res.ok) {
      const copy = res.clone();
      caches.open(cacheName).then((c) => c.put(event.request, copy));
    }
    return res;
  });
  if (cached) {
    event.waitUntil(network.catch(() => {}));
    return cached;
  }
  return network;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // The backend, Firebase and analytics live on other origins: not ours to cache.
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstShell(event));
  } else if (url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(event, ASSET_CACHE));
  } else if (STATIC_FILE.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(event, STATIC_CACHE));
  }
  // Anything else (incl. Vite dev-server modules) goes to the network as usual.
});
