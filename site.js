const isAppDisplayMode = window.matchMedia("(display-mode: fullscreen)").matches
  || window.matchMedia("(display-mode: standalone)").matches
  || navigator.standalone === true;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
});

if (!isAppDisplayMode) {
  window.addEventListener("load", () => {
    unregisterAppWorker();
    clearAppCaches();
    clearLegacyAppPreference();
  });
}

async function unregisterAppWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    const rootScope = `${window.location.origin}/`;
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations
      .filter((registration) => registration.scope === rootScope)
      .map((registration) => registration.unregister()));
  } catch (error) {
    console.warn("Nettoyage du service worker impossible.", error);
  }
}

async function clearAppCaches() {
  if (!("caches" in window)) {
    return;
  }

  try {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith("bnf-access-v")).map((key) => caches.delete(key)));
  } catch (error) {
    console.warn("Nettoyage du cache applicatif impossible.", error);
  }
}

function clearLegacyAppPreference() {
  try {
    localStorage.removeItem("bnf-access:pwa-mode:v1");
    sessionStorage.removeItem("bnf-access:pwa-mode-reload-status:v1");
  } catch {
    // Les stockages peuvent être bloqués sans empêcher le site de fonctionner.
  }
}
