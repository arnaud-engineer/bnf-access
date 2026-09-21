const imageCachePrefix = "bnf-access:v2:images:";
let imageVersion = "fallback";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("message", (event) => {
  if (event.data?.type !== "SET_ASSET_VERSION" || !event.data.iconVersion) return;
  imageVersion = String(event.data.iconVersion);
  event.waitUntil(removeOldImageCaches());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !isLocalImage(url.pathname)) return;
  event.respondWith(cacheLocalImage(request));
});

function isLocalImage(pathname) {
  return pathname.includes("/assets/logos/")
    || pathname.includes("/assets/flags/")
    || pathname.endsWith("/assets/icons/bnf-access-icon.svg");
}

async function cacheLocalImage(request) {
  const cache = await caches.open(`${imageCachePrefix}${imageVersion}`);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

async function removeOldImageCaches() {
  const currentName = `${imageCachePrefix}${imageVersion}`;
  const names = await caches.keys();
  await Promise.all(
    names
      .filter((name) => name.startsWith(imageCachePrefix) && name !== currentName)
      .map((name) => caches.delete(name)),
  );
}
