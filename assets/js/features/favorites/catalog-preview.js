import {
  catalogFavoritesLargeImageThresholdBytes as defaultCatalogFavoritesLargeImageThresholdBytes,
  startupImageBlockingCount as defaultStartupImageBlockingCount,
  themeValues as defaultThemeValues
} from '../../config/runtime.js';
import {
  escapeAttribute as defaultEscapeAttribute,
  escapeHtml as defaultEscapeHtml
} from '../../shared/text.js';
import {
  logoAppearanceAttributes as defaultLogoAppearanceAttributes
} from '../../logo-appearance.js?v=2026-09-16-press-background';
import {
  pressEntryTypes as defaultPressEntryTypes,
  pressTitleSourceFilters as defaultPressTitleSourceFilters
} from '../../config/catalog.js';
// Editor-only catalogue preview and image inspection do not own user favourites.
export function createFavoritesCatalogPreview({
  applyTheme,
  catalogFavoritesLargeImageThresholdBytes = defaultCatalogFavoritesLargeImageThresholdBytes,
  escapeAttribute = defaultEscapeAttribute,
  escapeHtml = defaultEscapeHtml,
  getActions,
  getFallbackLabel,
  getFavoriteResources,
  getResourceById,
  getSessionAttributes,
  isCatalogVisible,
  logoAppearanceAttributes = defaultLogoAppearanceAttributes,
  pressEntryTypes = defaultPressEntryTypes,
  pressTitleSourceFilters = defaultPressTitleSourceFilters,
  quickLaunch,
  renderIcon,
  renderQuickLaunch,
  resolveActionHref,
  startupImageBlockingCount = defaultStartupImageBlockingCount,
  state,
  themeValues = defaultThemeValues,
  waitForImageElement
}) {
  function renderCatalogBackgroundComparison(resource, resourceIndex, accessWarning) {
    const eager = resourceIndex < startupImageBlockingCount;
    const logoOnlyResource = { ...resource, icon_background_image: "" };
    const backgroundUrl = new URL(resource.icon_background_image, window.location.href).href;
    return `
      <span class="quick-launch-background-comparison">
        <span class="quick-launch-background-part">
          <span class="quick-launch-background-label">Logo</span>
          <span class="quick-launch-tile ${resource.icon_no_padding ? "icon-no-padding" : ""}"${logoAppearanceAttributes(logoOnlyResource)}>${renderIcon(resource, eager)}${accessWarning}</span>
        </span>
        <span class="quick-launch-background-part">
          <span class="quick-launch-background-label">Fond</span>
          <span class="quick-launch-tile quick-launch-background-file"><img src="${escapeAttribute(backgroundUrl)}" alt="" loading="${eager ? "eager" : "lazy"}" decoding="async"></span>
        </span>
      </span>
    `;
  }

  function createCatalogFavoritesImageFilters() {
    const container = document.createElement("div");
    container.className = "catalog-favorites-image-filters";
    container.setAttribute("aria-label", "Filtrer les images");

    const entryType = document.createElement("select");
    entryType.setAttribute("aria-label", "Type d’entrée");
    for (const [value, label] of [["all", "Titres et ressources"], ["resource", "Ressources"], ["press_title", "Titres"]]) {
      entryType.add(new Option(label, value, false, value === state.catalogPreviewEntryType));
    }
    entryType.addEventListener("change", () => {
      state.catalogPreviewEntryType = entryType.value;
      if (entryType.value === "resource") state.catalogPreviewTitleSource = "all";
      refreshCatalogFavorites();
      quickLaunch.querySelector('[aria-label="Type d’entrée"]').focus({ preventScroll: true });
    });
    container.append(entryType);

    const titleSource = document.createElement("select");
    titleSource.setAttribute("aria-label", "Source du titre");
    pressTitleSourceFilters.forEach(({ id, label }) => {
      const optionLabel = id === "all" ? "Toutes les sources" : label;
      titleSource.add(new Option(optionLabel, id, false, id === state.catalogPreviewTitleSource));
    });
    titleSource.addEventListener("change", () => {
      state.catalogPreviewTitleSource = titleSource.value;
      if (titleSource.value !== "all") state.catalogPreviewEntryType = "press_title";
      refreshCatalogFavorites();
      quickLaunch.querySelector('[aria-label="Source du titre"]').focus({ preventScroll: true });
    });
    container.append(titleSource);

    const resources = getFavoriteResources({ ignoreImageFilters: true });
    const counts = new Map();
    resources.forEach((resource) => {
      const format = getCatalogImageFormat(resource.icon_url);
      counts.set(format, (counts.get(format) ?? 0) + 1);
    });

    const formatFilters = [
      { id: "all", label: "Tous", count: resources.length },
      ...["avif", "gif", "jpeg", "png", "svg", "webp", "no_image"]
        .filter((id) => counts.has(id) || state.catalogPreviewImageFormats.has(id))
        .map((id) => ({
          id,
          label: id === "no_image" ? "Sans image" : id === "webp" ? "WebP" : id.toUpperCase(),
          count: counts.get(id) ?? 0,
        })),
    ];
    const filters = [
      formatFilters[0],
      { separator: true },
      ...formatFilters.slice(1),
      { separator: true },
      {
        id: "over_15kb",
        label: "> 15 Ko",
        count: resources.filter((resource) => (
          resource.icon_size_bytes > catalogFavoritesLargeImageThresholdBytes
        )).length,
      },
      {
        id: "with_background",
        label: "Avec fond",
        count: resources.filter((resource) => Boolean(resource.icon_background_image)).length,
      },
    ];

    filters.forEach((filter) => {
      if (filter.separator) {
        const separator = document.createElement("span");
        separator.className = "catalog-favorites-filter-separator";
        separator.setAttribute("aria-hidden", "true");
        container.append(separator);
        return;
      }

      const button = document.createElement("button");
      button.type = "button";
      button.dataset.imageFormat = filter.id;
      const isPressed = filter.id === "all"
        ? state.catalogPreviewImageFormats.size === 0
        : filter.id === "over_15kb"
          ? state.catalogPreviewLargeImagesOnly
          : filter.id === "with_background"
            ? state.catalogPreviewBackgroundImagesOnly
          : state.catalogPreviewImageFormats.has(filter.id);
      button.setAttribute("aria-pressed", String(isPressed));
      button.innerHTML = `${escapeHtml(filter.label)} <small>${filter.count}</small>`;
      button.addEventListener("click", () => {
        if (filter.id === "all") {
          state.catalogPreviewImageFormats.clear();
        } else if (filter.id === "over_15kb") {
          state.catalogPreviewLargeImagesOnly = !state.catalogPreviewLargeImagesOnly;
        } else if (filter.id === "with_background") {
          state.catalogPreviewBackgroundImagesOnly = !state.catalogPreviewBackgroundImagesOnly;
        } else if (state.catalogPreviewImageFormats.has(filter.id)) {
          state.catalogPreviewImageFormats.delete(filter.id);
        } else {
          state.catalogPreviewImageFormats.add(filter.id);
        }
        refreshCatalogFavorites();
      });
      container.append(button);
    });

    return container;
  }

  function refreshCatalogFavorites() {
    renderQuickLaunch();
    const firstResource = getFavoriteResources()[0];
    if (firstResource) openCatalogFavoritesInspector(firstResource);
    else closeCatalogFavoritesInspector();
  }

  function getCatalogImageFormat(value) {
    const format = getImageFileFormat(getImageFileName(value)).toLocaleLowerCase("fr");
    if (!format) return "no_image";
    if (format === "jpg" || format === "jpeg") return "jpeg";
    return format;
  }

  function setupCatalogFavoritesPreview() {
    const inspector = document.createElement("aside");
    inspector.id = "catalogFavoritesInspector";
    inspector.className = "catalog-favorites-inspector";
    inspector.hidden = true;
    inspector.setAttribute("aria-label", "Informations sur l’image");
    inspector.innerHTML = `
      <div class="catalog-favorites-inspector-header">
        <h2>Images liées</h2>
        <button type="button" aria-label="Fermer l’inspecteur" title="Fermer">×</button>
      </div>
      <div id="catalogFavoritesInspectorContent"></div>
    `;
    inspector.querySelector("button").addEventListener("click", closeCatalogFavoritesInspector);
    document.body.append(inspector);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeCatalogFavoritesInspector();
      }
      const usesOptionOnly = event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
      if (usesOptionOnly && ["KeyT", "KeyR"].includes(event.code)) {
        event.preventDefault();
        setCatalogFavoritesPreviewEntryType(event.code === "KeyT" ? "press_title" : "resource");
      }
      handleCatalogFavoritesArrowNavigation(event);
    });
    window.addEventListener("message", (event) => {
      if (event.source !== window.parent) return;
      if (event.data?.type === "catalog-editor-preview-theme" && themeValues.has(event.data.theme)) {
        state.theme = event.data.theme;
        applyTheme();
      }
      if (
        event.data?.type === "catalog-editor-preview-entry-type"
        && ["resource", "press_title"].includes(event.data.entryType)
      ) {
        setCatalogFavoritesPreviewEntryType(event.data.entryType);
      }
      if (event.data?.type === "catalog-editor-preview-favorite-menus") {
        state.catalogPreviewFavoriteMenusOnly = Boolean(event.data.enabled);
        state.quickLaunchActionMenus.clear();
        renderQuickLaunch();
      }
    });

    const firstResource = getFavoriteResources()[0];
    if (firstResource) {
      openCatalogFavoritesInspector(firstResource);
    }
  }

  function handleCatalogFavoritesArrowNavigation(event) {
    if (
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
      || event.altKey
      || event.ctrlKey
      || event.metaKey
      || event.shiftKey
    ) {
      return;
    }

    const activeElement = document.activeElement;
    if (activeElement?.matches("input, textarea, select, [contenteditable='true']")) return;
    const activeMain = activeElement?.closest?.(".quick-launch-main");
    if (
      activeElement !== document.body
      && !activeMain
      && !activeElement?.closest?.("#catalogFavoritesInspector")
    ) {
      return;
    }

    const items = [...document.querySelectorAll(".quick-launch-item")]
      .filter(item => item.getClientRects().length && item.querySelector(".quick-launch-main"));
    if (!items.length) return;
    if (!activeMain) {
      event.preventDefault();
      const first = items[0];
      const firstResource = getResourceById(first.dataset.resourceId);
      first.querySelector(".quick-launch-main")?.focus({ preventScroll: true });
      first.scrollIntoView({ block: "nearest", inline: "nearest" });
      if (firstResource) openCatalogFavoritesInspector(firstResource);
      return;
    }
    const current = activeMain.closest(".quick-launch-item");
    const currentIndex = items.indexOf(current);
    let next = current;

    if (event.key === "ArrowLeft" && currentIndex > 0) next = items[currentIndex - 1];
    if (event.key === "ArrowRight" && currentIndex < items.length - 1) next = items[currentIndex + 1];
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      const currentBounds = current.getBoundingClientRect();
      const currentX = currentBounds.left + currentBounds.width / 2;
      const currentY = currentBounds.top + currentBounds.height / 2;
      const direction = event.key === "ArrowUp" ? -1 : 1;
      const candidates = items
        .filter(item => item !== current)
        .map(item => {
          const bounds = item.getBoundingClientRect();
          const x = bounds.left + bounds.width / 2;
          const y = bounds.top + bounds.height / 2;
          return { item, xDistance: Math.abs(x - currentX), yDistance: (y - currentY) * direction };
        })
        .filter(candidate => candidate.yDistance > 1)
        .sort((a, b) => a.yDistance - b.yDistance || a.xDistance - b.xDistance);
      if (candidates.length) {
        const nearestRowDistance = candidates[0].yDistance;
        next = candidates
          .filter(candidate => Math.abs(candidate.yDistance - nearestRowDistance) < 2)
          .sort((a, b) => a.xDistance - b.xDistance)[0].item;
      }
    }

    event.preventDefault();
    const resource = getResourceById(next.dataset.resourceId);
    if (!resource) return;
    next.querySelector(".quick-launch-main")?.focus({ preventScroll: true });
    next.scrollIntoView({ block: "nearest", inline: "nearest" });
    openCatalogFavoritesInspector(resource);
  }

  function setCatalogFavoritesPreviewEntryType(entryType) {
    state.catalogPreviewEntryType = entryType;
    state.catalogPreviewTitleSource = "all";
    refreshCatalogFavorites();
  }

  function closeCatalogFavoritesInspector() {
    const inspector = document.querySelector("#catalogFavoritesInspector");
    if (!inspector || inspector.hidden) {
      return;
    }
    state.catalogPreviewImageRevision += 1;
    inspector.hidden = true;
    document.body.classList.remove("has-catalog-preview-inspector");
  }

  function openCatalogFavoritesInspector(resource) {
    const inspector = document.querySelector("#catalogFavoritesInspector");
    const content = document.querySelector("#catalogFavoritesInspectorContent");
    if (!inspector || !content) {
      return;
    }

    const revision = ++state.catalogPreviewImageRevision;
    const iconUrl = resource.icon_url ? new URL(resource.icon_url, window.location.href).href : "";
    const backgroundUrl = resource.icon_background_image
      ? new URL(resource.icon_background_image, window.location.href).href
      : "";
    const logoOnlyResource = backgroundUrl ? { ...resource, icon_background_image: "" } : resource;
    const sharedTitles = getCatalogTitlesSharingIcon(resource);
    const fileName = getImageFileName(iconUrl);
    const fileFormat = getImageFileFormat(fileName);
    const backgroundFileName = getImageFileName(backgroundUrl);
    const backgroundFileFormat = getImageFileFormat(backgroundFileName);
    const primaryAction = getActions(resource)[0];
    const primaryUrl = resolveActionHref(resource, primaryAction);

    content.innerHTML = `
      <div class="catalog-favorites-inspector-previews${backgroundUrl ? " has-background" : ""}">
        <figure class="catalog-favorites-inspector-figure is-composite">
          <div class="catalog-favorites-inspector-preview${iconUrl ? "" : " generated"}${resource.icon_no_padding ? " icon-no-padding" : ""}"${logoAppearanceAttributes(resource)}>
            ${iconUrl
              ? `<img src="${escapeAttribute(iconUrl)}" alt="${escapeAttribute(resource.icon_alt || `Logo de ${resource.name}`)}">`
              : `<strong>${escapeHtml(getFallbackLabel(resource))}</strong>`}
          </div>
          <figcaption>${backgroundUrl ? "Assemblage" : "Logo"}</figcaption>
        </figure>
        ${backgroundUrl ? `
          <figure class="catalog-favorites-inspector-figure">
            <div class="catalog-favorites-inspector-preview${resource.icon_no_padding ? " icon-no-padding" : ""}"${logoAppearanceAttributes(logoOnlyResource)}>
              <img src="${escapeAttribute(iconUrl)}" alt="${escapeAttribute(resource.icon_alt || `Logo de ${resource.name}`)}">
            </div>
            <figcaption>Logo</figcaption>
          </figure>
          <figure class="catalog-favorites-inspector-figure">
            <div class="catalog-favorites-inspector-preview background-file">
              <img src="${escapeAttribute(backgroundUrl)}" alt="">
            </div>
            <figcaption>Fond</figcaption>
          </figure>
        ` : ""}
      </div>
      <div class="catalog-favorites-inspector-title">
        <h3>${escapeHtml(resource.name)}</h3>
        <a href="${escapeAttribute(primaryUrl)}" target="_blank" rel="noreferrer"${getSessionAttributes(resource, primaryAction, primaryUrl)}>Ouvrir le lien</a>
      </div>
      <dl class="catalog-favorites-image-facts">
        <div><dt>Fichier</dt><dd>${escapeHtml(fileName || "Aucun fichier image")}</dd></div>
        <div><dt>Format</dt><dd data-image-format>${escapeHtml(fileFormat || "Indisponible")}</dd></div>
        <div><dt>Dimensions</dt><dd data-image-dimensions>${iconUrl ? "Chargement…" : "Indisponibles"}</dd></div>
        <div><dt>Poids</dt><dd data-image-size>${iconUrl ? "Chargement…" : "Indisponible"}</dd></div>
        ${iconUrl ? `<div><dt>Adresse</dt><dd class="catalog-favorites-image-url">${escapeHtml(iconUrl)}</dd></div>` : ""}
        ${backgroundUrl ? `
          <div><dt>Fichier du fond</dt><dd>${escapeHtml(backgroundFileName)}</dd></div>
          <div><dt>Format du fond</dt><dd data-background-format>${escapeHtml(backgroundFileFormat || "Indisponible")}</dd></div>
          <div><dt>Dimensions du fond</dt><dd data-background-dimensions>Chargement…</dd></div>
          <div><dt>Poids du fond</dt><dd data-background-size>Chargement…</dd></div>
          <div><dt>Adresse du fond</dt><dd class="catalog-favorites-image-url">${escapeHtml(backgroundUrl)}</dd></div>
        ` : ""}
      </dl>
      <section class="catalog-favorites-shared-titles">
        <h3>Image partagée</h3>
        ${sharedTitles.length
          ? `<p>${sharedTitles.length} autre${sharedTitles.length > 1 ? "s" : ""} titre${sharedTitles.length > 1 ? "s" : ""}</p>
            <div>${sharedTitles.map((title) => `<button type="button" data-shared-resource-id="${escapeAttribute(title.id)}">${escapeHtml(title.name)}</button>`).join("")}</div>`
          : "<p>Aucun autre titre n’utilise ce fichier.</p>"}
      </section>
    `;

    content.querySelectorAll("[data-shared-resource-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const sharedResource = getResourceById(button.dataset.sharedResourceId);
        if (sharedResource) openCatalogFavoritesInspector(sharedResource);
      });
    });

    inspector.hidden = false;
    document.body.classList.add("has-catalog-preview-inspector");
    if (iconUrl) {
      loadCatalogPreviewImageMetadata(iconUrl, content, revision);
    }
    if (backgroundUrl) {
      loadCatalogPreviewBackgroundMetadata(backgroundUrl, content, revision);
    }
  }

  function getCatalogTitlesSharingIcon(resource) {
    const normalizedIconUrl = normalizeCatalogIconUrl(resource.icon_url);
    if (!normalizedIconUrl) {
      return [];
    }

    return state.resources
      .filter((candidate) => candidate.id !== resource.id && isCatalogVisible(candidate))
      .filter((candidate) => (candidate.entry_types ?? []).includes(pressEntryTypes.title))
      .filter((candidate) => normalizeCatalogIconUrl(candidate.icon_url) === normalizedIconUrl)
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }

  function normalizeCatalogIconUrl(value) {
    if (!value) {
      return "";
    }
    const url = new URL(value, window.location.href);
    url.search = "";
    url.hash = "";
    return url.href;
  }

  function getImageFileName(value) {
    if (!value) {
      return "";
    }
    try {
      return decodeURIComponent(new URL(value, window.location.href).pathname.split("/").filter(Boolean).pop() || "");
    } catch {
      return "";
    }
  }

  function getImageFileFormat(fileName) {
    const extension = fileName.split(".").pop();
    return extension && extension !== fileName ? extension.toLocaleUpperCase("fr") : "";
  }

  async function loadCatalogPreviewImageMetadata(iconUrl, content, revision) {
    const image = content.querySelector(".catalog-favorites-inspector-figure.is-composite .catalog-favorites-inspector-preview img");
    const dimensions = content.querySelector("[data-image-dimensions]");
    const size = content.querySelector("[data-image-size]");
    const format = content.querySelector("[data-image-format]");

    const imageReady = waitForImageElement(image).then(() => ({
      width: image.naturalWidth,
      height: image.naturalHeight,
    }));
    const fileReady = fetch(iconUrl, { cache: "force-cache" }).then(async (response) => {
      if (!response.ok) throw new Error("Image unavailable");
      const blob = await response.blob();
      return { bytes: blob.size, mime: blob.type };
    });

    const [imageResult, fileResult] = await Promise.allSettled([imageReady, fileReady]);
    if (revision !== state.catalogPreviewImageRevision || !content.isConnected) {
      return;
    }

    dimensions.textContent = imageResult.status === "fulfilled" && imageResult.value.width
      ? `${imageResult.value.width} × ${imageResult.value.height} px`
      : "Indisponibles";
    size.textContent = fileResult.status === "fulfilled"
      ? formatImageBytes(fileResult.value.bytes)
      : "Indisponible";
    if (fileResult.status === "fulfilled" && fileResult.value.mime) {
      const extension = getImageFileFormat(getImageFileName(iconUrl));
      format.textContent = extension
        ? `${extension} · ${fileResult.value.mime}`
        : fileResult.value.mime;
    }
  }

  async function loadCatalogPreviewBackgroundMetadata(backgroundUrl, content, revision) {
    const image = content.querySelector(".catalog-favorites-inspector-preview.background-file img");
    const dimensions = content.querySelector("[data-background-dimensions]");
    const size = content.querySelector("[data-background-size]");
    const format = content.querySelector("[data-background-format]");
    const imageReady = waitForImageElement(image).then(() => ({
      width: image.naturalWidth,
      height: image.naturalHeight,
    }));
    const fileReady = fetch(backgroundUrl, { cache: "force-cache" }).then(async (response) => {
      if (!response.ok) throw new Error("Background image unavailable");
      const blob = await response.blob();
      return { bytes: blob.size, mime: blob.type };
    });
    const [imageResult, fileResult] = await Promise.allSettled([imageReady, fileReady]);
    if (revision !== state.catalogPreviewImageRevision || !content.isConnected) return;
    dimensions.textContent = imageResult.status === "fulfilled" && imageResult.value.width
      ? `${imageResult.value.width} × ${imageResult.value.height} px`
      : "Indisponibles";
    size.textContent = fileResult.status === "fulfilled"
      ? formatImageBytes(fileResult.value.bytes)
      : "Indisponible";
    if (fileResult.status === "fulfilled" && fileResult.value.mime) {
      const extension = getImageFileFormat(getImageFileName(backgroundUrl));
      format.textContent = extension ? `${extension} · ${fileResult.value.mime}` : fileResult.value.mime;
    }
  }

  function formatImageBytes(bytes) {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toLocaleString("fr", { maximumFractionDigits: 1 })} Ko`;
    return `${(bytes / (1024 * 1024)).toLocaleString("fr", { maximumFractionDigits: 1 })} Mo`;
  }

  return {
    createCatalogFavoritesImageFilters,
    getCatalogImageFormat,
    openCatalogFavoritesInspector,
    renderCatalogBackgroundComparison,
    setupCatalogFavoritesPreview
  };
}
