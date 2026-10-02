import {
  converterResourcesAnimationMs as defaultConverterResourcesAnimationMs,
  siteAccessValues as defaultSiteAccessValues,
  themeValues as defaultThemeValues
} from '../../config/runtime.js';
import {
  packFavoriteLayout as defaultPackFavoriteLayout,
  encodeShareConfig as defaultEncodeShareConfig,
  decodeShareConfig as defaultDecodeShareConfig,
  unpackFavoriteLayout as defaultUnpackFavoriteLayout
} from '../../share-config.js?v=2026-09-22';
import {
  listFavoriteResourceIds as defaultListFavoriteResourceIds,
  normalizeFavoriteLayout as defaultNormalizeFavoriteLayout
} from '../../favorite-layout.js?v=2026-09-13';
import {
  favoriteStorageKey as defaultFavoriteStorageKey,
  favoriteStorageReadyKey as defaultFavoriteStorageReadyKey,
  favoriteLayoutStorageKey as defaultFavoriteLayoutStorageKey,
  editionSelectionStorageKey as defaultEditionSelectionStorageKey,
  passFilterStorageKey as defaultPassFilterStorageKey,
  siteAccessStorageKey as defaultSiteAccessStorageKey,
  remoteFilterStorageKey as defaultRemoteFilterStorageKey,
  languageFilterStorageKey as defaultLanguageFilterStorageKey,
  themeStorageKey as defaultThemeStorageKey,
  colorBlindModeStorageKey as defaultColorBlindModeStorageKey
} from '../../config/storage-keys.js';
export function createSharingController({
  sharingState,
  shareScanVideo,
  shareScanPanel,
  shareModal,
  shareImportPreview,
  shareImport,
  confirmShareImport,
  shareExport,
  shareExportTab,
  shareImportTab,
  converterResourcesAnimationMs = defaultConverterResourcesAnimationMs,
  shareScopeDetails,
  shareStatus,
  shareQr,
  shareLink,
  shareNetworkHint,
  loadPressCatalog,
  state,
  packFavoriteLayout = defaultPackFavoriteLayout,
  encodeShareConfig = defaultEncodeShareConfig,
  settingsModal,
  openSettings,
  closeSettingsModal,
  shareImportStatus,
  shareScanStatus,
  decodeShareConfig = defaultDecodeShareConfig,
  unpackFavoriteLayout = defaultUnpackFavoriteLayout,
  listFavoriteResourceIds = defaultListFavoriteResourceIds,
  bookSearch,
  resolveCatalogResourceId,
  getResourceById,
  isCatalogVisible,
  normalizeFavoriteLayout = defaultNormalizeFavoriteLayout,
  isValidEditionSelection,
  passFilter,
  siteAccessValues = defaultSiteAccessValues,
  remoteFilter,
  themeValues = defaultThemeValues,
  getKnownLanguageCodes,
  shareImportSummary,
  shareImportDetails,
  favoriteStorageKey = defaultFavoriteStorageKey,
  favoriteStorageReadyKey = defaultFavoriteStorageReadyKey,
  favoriteLayoutStorageKey = defaultFavoriteLayoutStorageKey,
  editionSelectionStorageKey = defaultEditionSelectionStorageKey,
  passFilterStorageKey = defaultPassFilterStorageKey,
  siteAccessStorageKey = defaultSiteAccessStorageKey,
  remoteFilterStorageKey = defaultRemoteFilterStorageKey,
  languageFilterStorageKey = defaultLanguageFilterStorageKey,
  themeStorageKey = defaultThemeStorageKey,
  colorBlindModeStorageKey = defaultColorBlindModeStorageKey,
  applyTheme,
  applyColorBlindMode,
  syncProfileFilterState,
  renderFilters,
  renderLanguageFilterControls,
  render,
  openShareFromSettings,
  shareImportLink
}) {

  function stopShareScanning() {
    sharingState.shareScanGeneration += 1;
    const scanner = sharingState.shareScanner;
    sharingState.shareScanner = null;
    if (scanner) {
      scanner.pause(true).catch(() => {});
      scanner.destroy();
    }
    if (shareScanVideo.srcObject) {
      shareScanVideo.srcObject.getTracks().forEach((track) => track.stop());
      shareScanVideo.srcObject = null;
    }
    shareScanPanel.hidden = true;
    shareModal.inert = false;
    document.querySelector("#startShareScan").disabled = false;
  }

  function setImportPreviewVisible(visible) {
    shareImportPreview.hidden = !visible;
    shareImport.classList.toggle("has-preview", visible);
    confirmShareImport.disabled = !visible;
    if (!shareImport.hidden) {
      document.querySelector("#shareIntro").textContent = visible
        ? "Vérifiez la configuration avant de remplacer vos réglages locaux."
        : "Collez un lien ou scannez son QR code. Vérifiez le contenu avant de remplacer vos réglages locaux.";
    }
  }

  function setShareMode(mode) {
    stopShareScanning();
    document.querySelector("#chooseShareQrPhoto").hidden = true;
    if (mode === "import") setImportPreviewVisible(false);
    shareExport.hidden = mode !== "export";
    shareImport.hidden = mode !== "import";
    shareExportTab.setAttribute("aria-selected", String(mode === "export"));
    shareImportTab.setAttribute("aria-selected", String(mode === "import"));
    document.querySelector("#shareTitle").textContent = mode === "import"
      ? "Importer une configuration" : "Partager ma configuration";
    document.querySelector("#shareIntro").textContent = mode === "import"
      ? "Collez un lien ou scannez son QR code. Vérifiez le contenu avant de remplacer vos réglages locaux."
      : "Choisissez ce que le lien contiendra.";
  }

  function showShareModal(mode = "export") {
    setShareMode(mode);
    shareModal.hidden = false;
    document.body.classList.add("has-modal");
    window.requestAnimationFrame(() => {
      shareModal.classList.add("is-open");
      document.querySelector("#closeShare").focus();
    });
  }

  function closeShareModal() {
    stopShareScanning();
    shareModal.classList.remove("is-open");
    document.body.classList.remove("has-modal");
    window.setTimeout(() => { shareModal.hidden = true; }, converterResourcesAnimationMs);
    sharingState.shareReturnFocus?.focus();
    sharingState.pendingShareImport = null;
  }

  async function loadQrGenerator() {
    if (window.qrcode) return window.qrcode;
    if (!sharingState.qrScriptPromise) {
      sharingState.qrScriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "./assets/js/vendor/qrcode-generator.js";
        script.onload = () => resolve(window.qrcode);
        script.onerror = () => reject(new Error("Impossible de charger le générateur de QR code."));
        document.head.append(script);
      });
    }
    return sharingState.qrScriptPromise;
  }

  async function updateShareLink() {
    const generation = ++sharingState.shareGeneration;
    const mode = document.querySelector('input[name="shareScope"]:checked').value;
    shareScopeDetails.textContent = mode === "c"
      ? "Favoris, dossiers, éditions choisies, profil, langues, thème et accessibilité."
      : "Favoris, dossiers et éditions choisies. Les autres réglages du destinataire restent inchangés.";
    shareStatus.textContent = "Création du lien…";
    shareQr.replaceChildren();
    shareLink.value = "";
    shareNetworkHint.hidden = !["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    shareNetworkHint.textContent = "Ce lien pointe vers cet appareil. Pour le scanner avec un téléphone, ouvrez d’abord le site via son adresse IP locale.";
    try {
      await loadPressCatalog();
      if (state.pressLoadError) throw new Error("Le catalogue de presse doit être chargé avant le partage.");
      const config = {
        v: 1,
        m: mode,
        l: packFavoriteLayout(state.favoriteLayout),
        e: [...state.editionSelections],
      };
      if (mode === "c") {
        config.p = [state.passFilter, state.siteAccess, state.remoteFilter,
          [...state.languageFilter], state.theme, state.colorBlindMode ? 1 : 0];
      }
      const encoded = await encodeShareConfig(config);
      const url = new URL(window.location.pathname, window.location.origin);
      url.hash = `share=${encoded}`;
      if (generation !== sharingState.shareGeneration) return;
      shareLink.value = url.href;
      try {
        const qrcode = await loadQrGenerator();
        if (generation !== sharingState.shareGeneration) return;
        const qr = qrcode(0, "L");
        qr.addData(url.href);
        qr.make();
        shareQr.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 4 });
        shareStatus.textContent = qr.getModuleCount() > 85
          ? "QR dense : pour beaucoup de favoris, copier le lien peut être plus fiable."
          : "Le lien contient la configuration sélectionnée et ne passe par aucun serveur.";
      } catch {
        if (generation === sharingState.shareGeneration) {
          shareStatus.textContent = "QR indisponible pour ce partage : le lien reste copiable.";
        }
      }
    } catch (error) {
      if (generation !== sharingState.shareGeneration) return;
      shareStatus.textContent = error.message || "Impossible de créer ce partage.";
    }
  }

  function openShareExport(trigger) {
    sharingState.shareReturnFocus = settingsModal.hidden ? trigger : openSettings;
    if (!settingsModal.hidden) closeSettingsModal();
    showShareModal();
    updateShareLink();
  }

  function isLocalShareHost(hostname) {
    const host = hostname.toLowerCase();
    if (["localhost", "127.0.0.1", "[::1]"].includes(host)
      || host.endsWith(".localhost") || host.endsWith(".local")) return true;
    const octets = host.split(".").map(Number);
    if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
    return octets[0] === 10 || octets[0] === 127
      || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31)
      || (octets[0] === 192 && octets[1] === 168)
      || (octets[0] === 169 && octets[1] === 254);
  }

  function readShareLink(rawLink) {
    let url;
    try {
      url = new URL(rawLink.trim());
    } catch {
      throw new Error("Collez un lien de partage BnF Access complet.");
    }
    const acceptedOrigin = url.origin === "https://bnfaccess.fr"
      || (url.protocol === "http:" && isLocalShareHost(url.hostname));
    if (!acceptedOrigin
      || !["/", "/index.html"].includes(url.pathname)
      || url.search || url.username || url.password) {
      throw new Error("Ce lien ne vient pas de BnF Access.");
    }
    const token = url.hash.startsWith("#share=") ? url.hash.slice(7) : "";
    if (!/^1[zr]\.[A-Za-z0-9_-]+$/.test(token) || token.length > 120000) {
      throw new Error("Ce lien ne contient pas de configuration partageable.");
    }
    return token;
  }

  async function startShareScanning() {
    if (sharingState.shareScanner) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      document.querySelector("#chooseShareQrPhoto").hidden = false;
      shareImportStatus.textContent = "Flux caméra indisponible ici. Vous pouvez prendre une photo du QR code ou coller le lien.";
      return;
    }
    const generation = ++sharingState.shareScanGeneration;
    const button = document.querySelector("#startShareScan");
    button.disabled = true;
    document.querySelector("#chooseShareQrPhoto").hidden = true;
    shareImportStatus.textContent = "Ouverture de la caméra…";
    shareScanStatus.textContent = "Recherche du QR code…";
    try {
      const { default: QrScanner } = await import("../../vendor/qr-scanner.min.js");
      if (generation !== sharingState.shareScanGeneration) return;
      const scanner = new QrScanner(shareScanVideo, (result) => {
        try {
          const token = readShareLink(result.data);
          stopShareScanning();
          const completedGeneration = sharingState.shareScanGeneration;
          shareImportStatus.textContent = "Lecture du lien…";
          loadPressCatalog().then(() => {
            if (completedGeneration === sharingState.shareScanGeneration && !shareModal.hidden) openIncomingShare(token);
          }).catch(() => {
            if (completedGeneration === sharingState.shareScanGeneration) {
              shareImportStatus.textContent = "Impossible de charger le catalogue pour cet import.";
            }
          });
        } catch (error) {
          shareScanStatus.textContent = error.message;
        }
      }, { preferredCamera: "environment", returnDetailedScanResult: true });
      sharingState.shareScanner = scanner;
      await scanner.start();
      if (generation !== sharingState.shareScanGeneration) return;
      shareScanPanel.hidden = false;
      shareModal.inert = true;
      document.querySelector("#stopShareScan").focus();
      shareImportStatus.textContent = "";
    } catch (error) {
      if (generation !== sharingState.shareScanGeneration) return;
      stopShareScanning();
      document.querySelector("#chooseShareQrPhoto").hidden = false;
      const reason = error?.name && error.name !== "Error" ? ` (${error.name})` : "";
      shareImportStatus.textContent = error?.name === "NotAllowedError"
        ? `Accès à la caméra refusé${reason}. Vous pouvez prendre une photo du QR code ou coller le lien.`
        : `Impossible de démarrer la caméra${reason}. Vous pouvez prendre une photo du QR code ou coller le lien.`;
    }
  }

  async function readShareQrPhoto(file) {
    if (!file) return;
    const generation = sharingState.shareScanGeneration;
    shareImportStatus.textContent = "Lecture du QR code…";
    try {
      const { default: QrScanner } = await import("../../vendor/qr-scanner.min.js");
      const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
      if (generation !== sharingState.shareScanGeneration || shareModal.hidden || shareImport.hidden) return;
      const token = readShareLink(result.data);
      await loadPressCatalog();
      if (generation !== sharingState.shareScanGeneration || shareModal.hidden || shareImport.hidden) return;
      await openIncomingShare(token);
    } catch (error) {
      if (generation !== sharingState.shareScanGeneration || shareModal.hidden || shareImport.hidden) return;
      shareImportStatus.textContent = String(error).includes("No QR code found")
        ? "Aucun QR code trouvé dans cette photo. Réessayez ou collez le lien."
        : error?.message || "Impossible de lire ce QR code. Réessayez ou collez le lien.";
    }
  }

  async function openIncomingShare(token) {
    if (shareModal.hidden) {
      sharingState.shareReturnFocus = document.querySelector("#openSettings");
      showShareModal("import");
    }
    else setShareMode("import");
    sharingState.pendingShareImport = null;
    setImportPreviewVisible(false);
    shareImportStatus.textContent = "Lecture du lien…";
    try {
      if (state.pressLoadError) throw new Error("Le catalogue de presse doit être chargé pour recevoir ce partage.");
      const config = await decodeShareConfig(token);
      const layout = unpackFavoriteLayout(config.l);
      const requestedIds = listFavoriteResourceIds(layout);
      if (requestedIds.some(id => id.startsWith("book:"))) await bookSearch.load();
      const knownIds = [...new Set(requestedIds.map(resolveCatalogResourceId))]
        .filter((id) => getResourceById(id) && isCatalogVisible(getResourceById(id)));
      const normalizedLayout = normalizeFavoriteLayout(layout, knownIds, resolveCatalogResourceId);
      if (config.e.length > 1500 || !config.e.every((entry) => Array.isArray(entry)
        && entry.length === 2 && entry.every((value) => typeof value === "string" && value.length <= 200))) {
        throw new Error("Éditions partagées invalides.");
      }
      const editions = new Map(config.e.filter(([id, edition]) =>
        isValidEditionSelection(getResourceById(resolveCatalogResourceId(id)), edition))
        .map(([id, edition]) => [resolveCatalogResourceId(id), edition]));
      let profile = null;
      if (config.m === "c") {
        const [pass, site, remote, languages, theme, colorBlind] = config.p;
        if (config.p.length !== 6 || ![...passFilter.options].some((option) => option.value === pass)
          || !siteAccessValues.has(site) || ![...remoteFilter.options].some((option) => option.value === remote)
          || !Array.isArray(languages) || languages.length > 200 || !languages.every((code) => typeof code === "string" && code.length <= 20)
          || !themeValues.has(theme) || ![0, 1].includes(colorBlind)) {
          throw new Error("Préférences partagées invalides.");
        }
        profile = { pass, site, remote, languages: languages.filter((code) => getKnownLanguageCodes().has(code)), theme, colorBlind: Boolean(colorBlind) };
      }
      sharingState.pendingShareImport = { layout: normalizedLayout, editions, profile };
      const missingCount = requestedIds.length - knownIds.length;
      shareImportSummary.textContent = `${knownIds.length} favori${knownIds.length > 1 ? "s" : ""}, ${normalizedLayout.rows.length} rangée${normalizedLayout.rows.length > 1 ? "s" : ""} et ${editions.size} édition${editions.size > 1 ? "s" : ""} sélectionnée${editions.size > 1 ? "s" : ""}.`;
      shareImportDetails.textContent = `${profile ? "Configuration complète : profil, langues, thème et accessibilité seront aussi remplacés." : "Favoris uniquement : votre profil et votre apparence seront conservés."}${missingCount ? ` ${missingCount} ressource(s) absente(s) du catalogue actuel seront ignorée(s).` : ""}`;
      shareImportStatus.textContent = "Rien n’a encore été modifié sur cet appareil.";
      setImportPreviewVisible(true);
      document.querySelector("#shareImportPreviewTitle").focus();
    } catch (error) {
      shareImportSummary.textContent = "Impossible de recevoir cette configuration.";
      shareImportDetails.textContent = "";
      shareImportStatus.textContent = error.message || "Lien invalide.";
    }
  }

  function applyIncomingShare() {
    if (!sharingState.pendingShareImport) return;
    const { layout, editions, profile } = sharingState.pendingShareImport;
    const favoriteIds = listFavoriteResourceIds(layout);
    const entries = new Map([
      [favoriteStorageKey, JSON.stringify(favoriteIds)],
      [favoriteStorageReadyKey, "true"],
      [favoriteLayoutStorageKey, JSON.stringify(layout)],
      [editionSelectionStorageKey, JSON.stringify(Object.fromEntries(editions))],
    ]);
    if (profile) {
      entries.set(passFilterStorageKey, profile.pass);
      entries.set(siteAccessStorageKey, profile.site);
      entries.set(remoteFilterStorageKey, profile.remote);
      entries.set(languageFilterStorageKey, JSON.stringify(profile.languages));
      entries.set(themeStorageKey, profile.theme);
      entries.set(colorBlindModeStorageKey, String(profile.colorBlind));
    }
    const previous = new Map();
    try {
      for (const [key, value] of entries) {
        previous.set(key, window.localStorage.getItem(key));
        window.localStorage.setItem(key, value);
      }
    } catch {
      for (const [key, value] of previous) {
        try {
          if (value === null) window.localStorage.removeItem(key);
          else window.localStorage.setItem(key, value);
        } catch {}
      }
      shareImportStatus.textContent = "Impossible d’enregistrer cette configuration dans ce navigateur.";
      return;
    }
    state.favoriteLayout = layout;
    state.favorites = new Set(favoriteIds);
    state.editionSelections = editions;
    if (profile) {
      state.passFilter = profile.pass;
      state.siteAccess = profile.site;
      state.remoteFilter = profile.remote;
      state.languageFilter = new Set(profile.languages);
      state.theme = profile.theme;
      state.colorBlindMode = profile.colorBlind;
      passFilter.value = profile.pass;
      remoteFilter.value = profile.remote;
      applyTheme();
      applyColorBlindMode();
      syncProfileFilterState();
    }
    renderFilters();
    renderLanguageFilterControls();
    render();
    closeShareModal();
  }

  function bindSharingEvents() {
    openShareFromSettings.addEventListener("click", () => openShareExport(openShareFromSettings));

    shareExportTab.addEventListener("click", () => {
      setShareMode("export");
      updateShareLink();
    });

    shareImportTab.addEventListener("click", () => setShareMode("import"));

    const pasteShareLink = document.querySelector("#pasteShareLink");

    pasteShareLink.hidden = !window.isSecureContext || typeof navigator.clipboard?.readText !== "function";

    pasteShareLink.addEventListener("click", async () => {
      sharingState.pendingShareImport = null;
      setImportPreviewVisible(false);
      let link;
      try {
        if (!navigator.clipboard?.readText) throw new Error("clipboard unavailable");
        link = (await navigator.clipboard.readText()).trim();
      } catch {
        shareImportLink.focus();
        shareImportStatus.textContent = window.matchMedia("(pointer: coarse)").matches
          ? "Le navigateur bloque le collage automatique ici. Utilisez le menu Coller du champ."
          : "Le navigateur bloque le collage automatique ici. Collez dans le champ avec ⌘V ou Ctrl+V.";
        return;
      }
      if (!link) {
        shareImportStatus.textContent = "Le presse-papiers est vide.";
        return;
      }
      try {
        readShareLink(link);
        shareImportLink.value = link;
        shareImportStatus.textContent = "Lien collé. Appuyez sur « Lire le lien ».";
      } catch (error) {
        shareImportStatus.textContent = error.message;
      }
    });

    document.querySelector("#shareImportForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      try {
        const token = readShareLink(shareImportLink.value);
        stopShareScanning();
        await loadPressCatalog();
        await openIncomingShare(token);
      } catch (error) {
        sharingState.pendingShareImport = null;
        setImportPreviewVisible(false);
        shareImportStatus.textContent = error.message;
      }
    });

    document.querySelector("#startShareScan").addEventListener("click", startShareScanning);

    document.querySelector("#chooseShareQrPhoto").addEventListener("click", () => {
      document.querySelector("#shareQrPhoto").click();
    });

    document.querySelector("#shareQrPhoto").addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      readShareQrPhoto(file);
    });

    document.querySelector("#stopShareScan").addEventListener("click", () => {
      stopShareScanning();
      shareImportStatus.textContent = "Caméra arrêtée.";
      document.querySelector("#startShareScan").focus();
    });

    document.querySelector("#retryShareImport").addEventListener("click", () => {
      sharingState.pendingShareImport = null;
      setImportPreviewVisible(false);
      shareImportLink.value = "";
      shareImportStatus.textContent = "";
      document.querySelector("#startShareScan").focus();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && sharingState.shareScanner) stopShareScanning();
    });

    window.addEventListener("pagehide", stopShareScanning);

    document.querySelector("#closeShare").addEventListener("click", closeShareModal);

    document.querySelector("#cancelShareImport").addEventListener("click", closeShareModal);

    confirmShareImport.addEventListener("click", applyIncomingShare);

    document.querySelectorAll('input[name="shareScope"]').forEach((input) => {
      input.addEventListener("change", updateShareLink);
    });

    document.querySelector("#copyShareLink").addEventListener("click", async () => {
      if (!shareLink.value) return;
      if (!navigator.clipboard?.writeText) {
        shareLink.select();
        if (document.execCommand("copy")) {
          shareStatus.textContent = "Lien copié.";
        } else {
          shareStatus.textContent = "Copiez le lien sélectionné avec ⌘C ou Ctrl+C.";
        }
        return;
      }
      try {
        await navigator.clipboard.writeText(shareLink.value);
        shareStatus.textContent = "Lien copié.";
      } catch {
        shareLink.select();
        shareStatus.textContent = document.execCommand("copy")
          ? "Lien copié."
          : "Copiez le lien sélectionné avec ⌘C ou Ctrl+C.";
      }
    });

    shareModal.addEventListener("click", (event) => {
      if (event.target === shareModal) closeShareModal();
    });

    window.addEventListener("hashchange", () => {
      if (!window.location.hash.startsWith("#share=")) return;
      const token = window.location.hash.slice("#share=".length);
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      loadPressCatalog().then(() => openIncomingShare(token));
    });
  }

  return {
    bindSharingEvents,
    openIncomingShare,
    openShareExport,
    setShareMode,
    updateShareLink,
    setImportPreviewVisible,
    readShareLink,
    stopShareScanning,
    startShareScanning,
    readShareQrPhoto,
    closeShareModal,
    applyIncomingShare
  };
}
