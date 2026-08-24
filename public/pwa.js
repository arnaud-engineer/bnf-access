let deferredInstallPrompt = null;
const installPromptListeners = new Set();

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  notifyInstallPromptListeners();
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  notifyInstallPromptListeners();
});

window.bnfAccessInstall = {
  canPrompt() {
    return Boolean(deferredInstallPrompt);
  },
  isInstalled() {
    return window.matchMedia("(display-mode: fullscreen)").matches
      || window.matchMedia("(display-mode: standalone)").matches
      || navigator.standalone === true;
  },
  async prompt() {
    if (!deferredInstallPrompt) {
      return "unavailable";
    }

    const promptEvent = deferredInstallPrompt;
    deferredInstallPrompt = null;
    notifyInstallPromptListeners();
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    notifyInstallPromptListeners();
    return choice?.outcome ?? "dismissed";
  },
  subscribe(listener) {
    installPromptListeners.add(listener);
    listener();
    return () => installPromptListeners.delete(listener);
  },
};

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("Service worker non disponible.", error);
    });
  });
}

function notifyInstallPromptListeners() {
  installPromptListeners.forEach((listener) => listener());
}
