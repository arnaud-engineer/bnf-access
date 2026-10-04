import {runtimeJsonCacheName as defaultRuntimeJsonCacheName} from '../../config/runtime.js';
// Versioned catalogue loading and optional runtime caches share deduplicated request promises.
export function createCatalogLoader({
  converterResourcesModal,
  dataUrls,
  invalidateConverterResourceIndex,
  renderConverterResourceList,
  requestIdleWork,
  runtimeJsonCacheName = defaultRuntimeJsonCacheName,
  state
}) {
  let assetManifest = null;

  let deferredLinkSourcesPromise = null;

  const jsonFetchPromises = new Map();

  async function fetchJson(url) {
    const requestUrl = new URL(url, window.location.href).href;
    // Share one request between startup, suggestions and background warming.
    if (jsonFetchPromises.has(requestUrl)) return jsonFetchPromises.get(requestUrl);

    const promise = (async () => {
      const request = new Request(url, { cache: "no-cache" });
      const cachedResponse = await readRuntimeCachedResponse(request);
      const response = cachedResponse ?? await fetch(request);

      if (url === dataUrls.catalog) {
        document.body.dataset.catalogSource = cachedResponse ? "runtime-cache" : "network";
      }

      if (!response.ok) {
        throw new Error(`Impossible de charger ${url}`);
      }

      if (!cachedResponse) {
        await storeRuntimeCachedResponse(request, response.clone());
      }

      return response.json();
    })();

    jsonFetchPromises.set(requestUrl, promise);
    try {
      return await promise;
    } catch (error) {
      // A failed request must be retryable, not permanently cached as a rejection.
      jsonFetchPromises.delete(requestUrl);
      throw error;
    }
  }

  function isJsonFetchPending(url) {
    return jsonFetchPromises.has(new URL(url, window.location.href).href);
  }

  async function initializeAssetManifest() {
    try {
      const response = await fetch("./data/asset-manifest.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Manifeste de versions indisponible");
      const manifest = await response.json();
      if (manifest.schema_version !== 1 || !manifest.assets || !manifest.catalog_version) {
        throw new Error("Manifeste de versions invalide");
      }
      assetManifest = manifest;
      Object.entries(dataUrls).forEach(([key, url]) => {
        const filename = new URL(url, window.location.href).pathname.split("/").pop();
        const version = manifest.assets[filename];
        if (version) dataUrls[key] = `${url}?v=${version.slice(0, 16)}`;
      });
      registerAssetServiceWorker();
    } catch (error) {
      console.warn("Versions locales indisponibles, chargement direct", error);
    }
  }

  function registerAssetServiceWorker() {
    if (!("serviceWorker" in navigator) || !assetManifest?.icon_version) return;
    navigator.serviceWorker.controller?.postMessage({
      type: "SET_ASSET_VERSION",
      iconVersion: assetManifest.icon_version,
    });
    navigator.serviceWorker.register("./service-worker.js", { scope: "./" })
      .then(() => navigator.serviceWorker.ready)
      .then((registration) => {
        registration.active?.postMessage({
          type: "SET_ASSET_VERSION",
          iconVersion: assetManifest.icon_version,
        });
      })
      .catch((error) => console.warn("Cache local des icônes indisponible", error));
  }

  async function readRuntimeCachedResponse(request) {
    if (!("caches" in window)) {
      return null;
    }

    try {
      const cache = await window.caches.open(runtimeJsonCacheName);
      return await cache.match(request);
    } catch {
      return null;
    }
  }

  async function storeRuntimeCachedResponse(request, response) {
    if (!("caches" in window)) {
      return;
    }

    try {
      const cache = await window.caches.open(runtimeJsonCacheName);
      await cache.put(request, response);
    } catch {
      // The regular HTTP cache remains available when Cache Storage is unavailable.
    }
  }

  function loadDeferredLinkSources() {
    if (deferredLinkSourcesPromise) {
      return deferredLinkSourcesPromise;
    }

    deferredLinkSourcesPromise = Promise.all([
      fetchOptionalEuropresseWebSources(),
      fetchOptionalPressReaderLinkSources(),
      fetchOptionalLinkDirectorySettings(),
    ]).then(([europresseWebSources, pressreaderLinkSources, linkDirectorySettings]) => {
      state.europresseWebSources = europresseWebSources;
      state.pressreaderLinkSources = pressreaderLinkSources;
      state.linkDirectorySettings = linkDirectorySettings;
      invalidateConverterResourceIndex();
      state.deferredLinkSourcesReady = true;
      document.body.dataset.deferredSourcesReady = "true";

      if (!converterResourcesModal?.hidden) {
        renderConverterResourceList();
      }

      requestIdleWork(pruneRuntimeJsonCache, 500);
    }).catch(() => {
      state.deferredLinkSourcesReady = true;
      document.body.dataset.deferredSourcesReady = "true";
    });

    return deferredLinkSourcesPromise;
  }

  async function pruneRuntimeJsonCache() {
    if (!("caches" in window)) {
      return;
    }

    try {
      const cache = await window.caches.open(runtimeJsonCacheName);
      const currentUrls = new Set(
        Object.values(dataUrls).map((url) => new URL(url, window.location.href).href),
      );
      const requests = await cache.keys();
      await Promise.all(
        requests
          .filter((request) => !currentUrls.has(request.url))
          .map((request) => cache.delete(request)),
      );
    } catch {
      // Cache pruning is optional and must never block the interface.
    }
  }

  async function fetchOptionalEuropresseWebSources() {
    try {
      const data = await fetchJson(dataUrls.europresseLinks);
      return Array.isArray(data) ? data : data.sources ?? [];
    } catch {
      return [];
    }
  }

  async function fetchOptionalPressReaderLinkSources() {
    try {
      const data = await fetchJson(dataUrls.pressreaderLinks);
      return Array.isArray(data) ? data : data.sources ?? [];
    } catch {
      return [];
    }
  }

  async function fetchOptionalIndexPresseBusinessLinkSources() {
    try {
      const data = await fetchJson(dataUrls.indexpresseLinks);
      return Array.isArray(data) ? data : data.sources ?? [];
    } catch {
      return [];
    }
  }

  async function fetchOptionalLinkDirectorySettings() {
    try {
      const data = await fetchJson(dataUrls.linkDirectorySettings);
      return data?.entries ?? {};
    } catch {
      return {

      };
    }
  }

  return {
    fetchJson,
    fetchOptionalIndexPresseBusinessLinkSources,
    initializeAssetManifest,
    isJsonFetchPending,
    loadDeferredLinkSources,
    readRuntimeCachedResponse,
    storeRuntimeCachedResponse
  };
}
