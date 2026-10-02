import {
  backgroundAssetBatchSize as defaultBackgroundAssetBatchSize,
  backgroundAssetRetryLimit as defaultBackgroundAssetRetryLimit,
  backgroundAssetWarmupDelayMs as defaultBackgroundAssetWarmupDelayMs,
  startupImageBlockingCount as defaultStartupImageBlockingCount,
  startupImageTimeoutMs as defaultStartupImageTimeoutMs
} from '../../config/runtime.js';
// Cancellable background asset warming is separate from catalogue loading and UI rendering.
export function createAssetWarmup({
  backgroundAssetBatchSize = defaultBackgroundAssetBatchSize,
  backgroundAssetRetryLimit = defaultBackgroundAssetRetryLimit,
  backgroundAssetWarmupDelayMs = defaultBackgroundAssetWarmupDelayMs,
  dataUrls,
  getFavoriteResources,
  getFilteredResources,
  getLinkConverterServices,
  isCatalogVisible,
  isJsonFetchPending,
  readRuntimeCachedResponse,
  startupImageBlockingCount = defaultStartupImageBlockingCount,
  startupImageTimeoutMs = defaultStartupImageTimeoutMs,
  state,
  storeRuntimeCachedResponse
}) {
  let backgroundAssetWarmupVersion = 0;

  let backgroundAssetWarmupTimer = 0;

  let backgroundAssetAbortController = null;

  const warmedAssetUrls = new Set();

  const warmingAssetPromises = new Map();

  const backgroundAssetFailures = new Map();

  let indexedBackgroundAssetUrls = [];

  async function waitForStartupImages() {
    const images = [...document.images]
      .filter((image) => !image.loading || image.loading === "eager")
      .slice(0, startupImageBlockingCount);

    if (!images.length) {
      return;
    }

    await Promise.race([
      Promise.allSettled(images.map(waitForImageElement)),
      delay(startupImageTimeoutMs),
    ]);
  }

  function scheduleBackgroundAssetWarmup() {
    const warmupVersion = ++backgroundAssetWarmupVersion;
    window.clearTimeout(backgroundAssetWarmupTimer);
    backgroundAssetAbortController?.abort();
    backgroundAssetWarmupTimer = window.setTimeout(() => {
      requestBackgroundIdleWork(() => warmNextAssetBatch(warmupVersion));
    }, backgroundAssetWarmupDelayMs);
  }

  function interruptBackgroundAssetWarmup() {
    scheduleBackgroundAssetWarmup();
  }

  function getBackgroundAssetUrls() {
    const resources = [
      ...getFavoriteResources(),
      ...getFilteredResources(),
      ...state.resources.filter(isCatalogVisible),
    ];
    const urls = [
      ...Object.entries(dataUrls)
        .filter(([key]) => !["europresseLinks", "pressreaderLinks", "linkDirectorySettings"].includes(key))
        .map(([, url]) => url),
      ...[...document.images].map((image) => image.currentSrc || image.src),
      ...getLinkConverterServices().map((rule) => rule.iconUrl),
      ...resources.flatMap((resource) => [resource.icon_url, resource.country_flag_url]),
      ...indexedBackgroundAssetUrls,
    ];

    return [...new Set(urls.filter(Boolean))]
      .map(getLocalAssetUrl)
      .filter((url) => (
        url
        && !warmedAssetUrls.has(url)
        && !warmingAssetPromises.has(url)
        && !isJsonFetchPending(url)
        && (backgroundAssetFailures.get(url) ?? 0) < backgroundAssetRetryLimit
      ));
  }

  function getLocalAssetUrl(value) {
    try {
      const url = new URL(value, window.location.href);
      return url.origin === window.location.origin ? url.href : "";
    } catch {
      return "";
    }
  }

  async function warmNextAssetBatch(warmupVersion) {
    if (warmupVersion !== backgroundAssetWarmupVersion) return;
    const batch = getBackgroundAssetUrls().slice(0, backgroundAssetBatchSize);
    if (!batch.length) return;

    const controller = new AbortController();
    backgroundAssetAbortController = controller;
    const results = await Promise.allSettled(
      batch.map((url) => warmAssetUrl(url, controller.signal)),
    );
    batch.forEach((url, index) => {
      if (results[index].status === "fulfilled") {
        warmedAssetUrls.add(url);
        backgroundAssetFailures.delete(url);
      } else if (results[index].reason?.name !== "AbortError") {
        backgroundAssetFailures.set(url, (backgroundAssetFailures.get(url) ?? 0) + 1);
      }
    });
    if (backgroundAssetAbortController === controller) backgroundAssetAbortController = null;
    if (warmupVersion !== backgroundAssetWarmupVersion) return;
    requestBackgroundIdleWork(() => warmNextAssetBatch(warmupVersion));
  }

  async function warmAssetUrl(url, signal) {
    if (warmingAssetPromises.has(url)) return warmingAssetPromises.get(url);

    const promise = (async () => {
      const request = new Request(url, { credentials: "same-origin" });
      if (new URL(url).pathname.endsWith(".json")) {
        const cachedResponse = await readRuntimeCachedResponse(request);
        if (cachedResponse) {
          await loadBackgroundAssetIndex(url, cachedResponse);
          return;
        }
        const response = await fetch(request, { cache: "no-cache", signal });
        if (!response.ok) throw new Error(`Impossible de précharger ${url}`);
        await storeRuntimeCachedResponse(request, response.clone());
        await loadBackgroundAssetIndex(url, response);
        await response.blob();
        return;
      }

      const response = await fetch(url, {
        cache: "force-cache",
        credentials: "same-origin",
        signal,
      });

      if (!response.ok) throw new Error(`Impossible de précharger ${url}`);
      await response.blob();
    })();

    warmingAssetPromises.set(url, promise);
    try {
      return await promise;
    } finally {
      warmingAssetPromises.delete(url);
    }
  }

  async function loadBackgroundAssetIndex(url, response) {
    if (!new URL(url).pathname.endsWith("/asset-index.json")) return;
    const payload = await response.clone().json();
    indexedBackgroundAssetUrls = (payload.images ?? [])
      .map((relative) => getLocalAssetUrl(`./${relative}`))
      .filter(Boolean);
  }

  function requestIdleWork(callback, timeout = 120) {
    if ("requestIdleCallback" in window) {
      return window.requestIdleCallback(callback, { timeout });
    }

    return window.setTimeout(callback, 16);
  }

  function requestBackgroundIdleWork(callback) {
    if ("requestIdleCallback" in window) {
      return window.requestIdleCallback(callback);
    }

    return window.setTimeout(callback, backgroundAssetWarmupDelayMs);
  }

  function waitForImageElement(image) {
    return new Promise((resolve) => {
      if (image.complete) {
        resolve();
        return;
      }

      image.addEventListener("load", resolve, { once: true });
      image.addEventListener("error", resolve, { once: true });
    });
  }

  function delay(duration) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, duration);
    });
  }

  return {
    interruptBackgroundAssetWarmup,
    requestIdleWork,
    scheduleBackgroundAssetWarmup,
    waitForImageElement,
    waitForStartupImages
  };
}
