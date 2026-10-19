import {createFloatingTools} from './features/runtime/floating-tools.js';
import {createSettingsController} from './features/preferences/settings.js';
import {createReleaseMode} from './features/preferences/release-mode.js';
import {readStoredValue} from './shared/storage.js';

import {bookPlatformDefinitions, languageLabelOverrides, accessModeClasses} from './config/catalog.js';
import {unindexedBookResources} from './features/books/platforms.js';
import {bookDefaultFavoritesMigratedKey} from './config/storage-keys.js';
import {listRefreshAnimationClass, themeValues} from './config/runtime.js';

import {createDataUrls} from './config/data-urls.js';
import {collectApplicationElements} from './config/application-elements.js';
import {createApplicationState} from './config/application-state.js';
import {createCatalogLoader} from './features/runtime/catalog-loader.js';
import {createCatalogListing} from './features/catalog/listing.js';
import {createAssetWarmup} from './features/runtime/asset-warmup.js';
import {createFavoritesPersistence} from './features/favorites/persistence.js';
import {createProfilePreferences} from './features/preferences/profile.js';
import {createAppearancePreferences} from './features/preferences/appearance.js';
import {createCatalogOverview} from './features/catalog/overview.js';
import {createCatalogSuggestions} from './features/catalog/suggestions.js';
import {createCatalogCards} from './features/catalog/cards.js';
import {collectAccessLinks, createAccessLinksDialog} from './features/catalog/access-links.js';
import {createCatalogFilterControls} from './features/catalog/filter-controls.js';
import {createCatalogSelection} from './features/catalog/selection.js';
import {createCatalogContextNotes} from './features/catalog/context-notes.js';
import {createResourceActions} from './features/catalog/actions.js';
import {createPressFilters} from './features/press/filters.js';
import {createFavoritesEditor} from './features/favorites/editing.js';
import {createFavoritesRenderer} from './features/favorites/rendering.js';
import {createSharingController} from './features/sharing/controller.js';
import {createLinkConverterController} from './features/link-converter/controller.js';
import {normalize, escapeHtml} from './shared/text.js';
import {createBookSearch} from "./book-search.js?v=2026-10-18-prebnf4";
import {createSearchHints} from "./search-hints.js?v=2026-10-02-vertical-rewind";
import {canonicalizeEditorialTaxonomy, categoryIndex} from "./editorial-taxonomy.js?v=2026-09-06";
import {validateCatalog, mergeCatalogEntries, migratePreferences} from "./catalog-model.js";

import {applyLogoAppearance} from "./logo-appearance.js?v=2026-09-16-press-background";

const incomingShareToken = window.location.hash.startsWith("#share=")
  ? window.location.hash.slice("#share=".length)
  : null;
if (incomingShareToken) {
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
}

const catalogFavoritesPreview = new URLSearchParams(window.location.search)
  .get("catalog-editor-preview") === "all-favorites";
const catalogFavoritesPreviewTheme = new URLSearchParams(window.location.search).get("theme");

if (catalogFavoritesPreview) {
  document.body.classList.add("is-catalog-favorites-preview");
}

const state = createApplicationState();

const {
  grid,
  filters,
  searchInput,
  passFilter,
  remoteFilter,
  resultCount,
  resultsSummary,
  resultsHeading,
  pressPopularityNote,
  pressPopularityNoteTitle,
  pressPopularityNoteDetails,
  pressPopularityNoteClose,
  quickLaunch,
  releaseModeLabel,
  linkConverter,
  linkConverterForm,
  searchLinkOpen,
  linkConverterServices,
  linkConverterFeedback,
  linkConverterResourceListOpen,
  converterResourcesModal,
  converterResourcesClose,
  converterResourcesSearch,
  converterResourcesProviderFilter,
  converterResourcesCount,
  converterResourcesList,
  searchControls,
  siteFooter,
  jumpToSearchDock,
  jumpToSearch,
  openSettings,
  settingsModal,
  shareModal,
  openShareFromSettings,
  shareExportTab,
  shareImportTab,
  shareExport,
  shareImport,
  shareImportLink,
  shareImportPreview,
  shareScanPanel,
  shareScanVideo,
  shareScanStatus,
  shareLink,
  shareQr,
  shareStatus,
  shareScopeDetails,
  shareNetworkHint,
  shareImportSummary,
  shareImportDetails,
  shareImportStatus,
  confirmShareImport,
  closeSettings,
  releaseModeSettings,
  settingsAlphaMode,
  releaseModeToggleLabel,
  releaseModeDescription,
  alphaModeNote,
  alphaModeNoteClose,
  alphaModeSettingsLink,
  clearLocalDataButton,
  clearLocalDataStatus,
  settingsTheme,
  settingsColorBlindMode,
  settingsPassFilter,
  settingsSiteAccess,
  languageFilters,
  settingsLanguageFilters,
  privacyNotice,
  dismissNotice
} = collectApplicationElements();

const searchHints = createSearchHints(searchInput, [document.querySelector("#filterSearchInput")]);

const bookSearch = createBookSearch({
  openPlatformDirectory,
  input: searchInput,
  mirrors: [{ input: document.querySelector("#filterSearchInput"), clear: document.querySelector("#filterSearchClear") }],
  suggestions: document.querySelector("#bookSuggestions"),
  getSuggestionGroups: (...args) => getCatalogSuggestionGroups(...args),
  shouldSuggest: () => !isSearchLink(searchInput.value),
  getContext: () => {
    const byId = new Map(state.resources.map((entry) => [entry.id, entry]));
    const canAccess = (id) => {
      const resource = byId.get(id);
      return Boolean(resource && matchesPassFilter(resource) && matchesRemoteFilter(getAccessMode(resource)));
    };
    const platforms = bookPlatformDefinitions.filter(([, id]) => canAccess(id)).map(([id, resourceId, label, indexed = true]) => {
      const resource = byId.get(resourceId);
      return { id, label, indexed, resource, access: getAccessModeLabel(resource), accessClass: accessModeClasses[getAccessMode(resource)] ?? "onsite", url: resource.actions?.[0]?.url };
    });
    const unindexedPlatforms = unindexedBookResources(state.resources, state.resourceTaxonomy, bookPlatformDefinitions)
      .filter(resource => isCatalogVisible(resource) && canAccess(resource.id))
      .map(resource => {
        const definition = bookPlatformDefinitions.find(([, resourceId]) => resourceId === resource.id);
        return {id: definition?.[0] ?? resource.id, label: definition?.[2] ?? resource.name,
          indexed: false, resource, access: getAccessModeLabel(resource),
          accessClass: accessModeClasses[getAccessMode(resource)] ?? 'onsite', url: resource.actions?.[0]?.url};
      });
    return {
      category: state.category,
      query: state.query,
      favoritesOnly: state.favoritesOnly,
      languages: state.languageFilter,
      languageTag: (code) => ({ text: formatLanguageBadgeText(code), title: formatLanguageTooltipItem(code) }),
      canAccess,
      platforms: platforms.filter(platform => platform.indexed),
      unindexedPlatforms,
      platformUrl: (id) => byId.get(id)?.actions?.[0]?.url,
    };
  },
  createPlatformLogo: (resource) => {
    const logo = document.createElement("span");
    logo.className = `quick-launch-tile press-platform-logo${resource.icon_no_padding ? " icon-no-padding" : ""}`;
    applyLogoAppearance(logo, resource);
    logo.innerHTML = resource.icon_url ? renderIcon(resource, true) : escapeHtml(getFallbackLabel(resource));
    return logo;
  },
  selectBooks: (query, { keepFavorites = false } = {}) => {
    state.category = "Livre";
    if (!keepFavorites) state.favoritesOnly = false;
    state.query = query;
    renderFilters();
    render();
  },
  onFavoritesChange: () => renderQuickLaunch(),
  getFavoriteIds: () => state.favorites,
  toggleFavoriteBook: (id) => toggleFavorite(id),
  onCatalogReady: () => { integrateBookFavorites(); render(); },
});

function openPlatformDirectory(category) {
  state.category = category;
  state.favoritesOnly = false;
  state.query = '';
  searchInput.value = '';
  document.querySelector('#filterSearchInput').value = '';
  for (const id of ['searchClear', 'filterSearchClear']) {
    const button = document.getElementById(id);
    if (button) button.hidden = true;
  }
  renderFilters();
  render();
  requestAnimationFrame(() => grid.scrollIntoView({behavior: 'smooth', block: 'start'}));
}

const linkConverterInput = searchInput;

const sharingState = {
  pendingShareImport: null,
  shareGeneration: 0,
  shareReturnFocus: null,
  qrScriptPromise: null,
  shareScanner: null,
  shareScanGeneration: 0,
};

// A multiple of every supported column count keeps each progressive batch row-complete.

const dataUrls = createDataUrls();

const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
const pressTitleMediumLayoutQuery = window.matchMedia("(max-width: 980px)");
const pressTitleNarrowLayoutQuery = window.matchMedia("(max-width: 640px)");

async function init() {
  try { migratePreferences(); } catch (error) { console.warn("Préférences historiques conservées", error); }
  if (catalogFavoritesPreview && themeValues.has(catalogFavoritesPreviewTheme)) {
    state.theme = catalogFavoritesPreviewTheme;
    applyTheme();
  } else {
    loadTheme();
  }
  loadColorBlindMode();
  setupPrivacyNotice();
  renderLinkConverterServices();
  await initializeAssetManifest();
  const [data, indexpresseBusinessLinkSources] = await Promise.all([
    fetchJson(dataUrls.catalog),
    fetchOptionalIndexPresseBusinessLinkSources(),
  ]);
  validateCatalog(data);
  state.resources = data.resources;
  renderLinkConverterServices();
  state.providers = data.providers;
  state.editorialTaxonomy = getEditorialTaxonomy(data, state.resources);
  state.editorialTaxonomyIndex = categoryIndex(state.editorialTaxonomy);
  state.resourceTaxonomy = getResourceTaxonomy(data);
  state.resourceTaxonomyIndex = new Map(
    (state.resourceTaxonomy.taxonomy.categories ?? []).map((category) => [category.id, category]),
  );
  state.localGeography = Array.isArray(data) ? null : data.local_geography ?? null;
  state.languageVocabulary = getLanguageVocabulary(data);
  state.indexpresseBusinessLinkSources = indexpresseBusinessLinkSources;
  if (catalogFavoritesPreview) await loadPressCatalog();
  loadEditionSelections();
  if (catalogFavoritesPreview) {
    state.favorites = new Set(
      state.resources.filter(isCatalogVisible).map((resource) => resource.id),
    );
    state.favoritesReady = true;
  } else {
    loadFavorites();
    loadFavoriteLayout();
    if (readStoredValue(bookDefaultFavoritesMigratedKey) !== "true" || bookSearch.legacyFavoriteIds().length || [...state.favorites].some(id => id.startsWith("book:"))) bookSearch.load().then(integrateBookFavorites);
    loadProfileFilters();
    loadReleaseMode();
    applyInitialViewFromUrl();
    renderFilters();
    renderLanguageFilterControls();
  }
  render();
  if (catalogFavoritesPreview) {
    setupCatalogFavoritesPreview();
  }
  if (!catalogFavoritesPreview) {
    bindEvents();
    setupFloatingTools();
  }
  await waitForStartupImages();
  revealApp();
  if (!catalogFavoritesPreview) {
    scheduleDeferredStartupWork();
    const pressReady = loadPressCatalog();
    if (incomingShareToken) {
      pressReady.then(() => openIncomingShare(incomingShareToken));
    }
  }
}

async function loadPressCatalog() {
  if (state.pressLoaded) return;
  if (state.pressLoadPromise) return state.pressLoadPromise;
  state.pressLoadPromise = (async () => {
    try {
      const [press, popularity] = await Promise.all([
        fetchJson(dataUrls.press),
        fetchJson(dataUrls.popularity).catch(() => ({ popular_catalog_ids: [] })),
      ]);
      state.resources = mergeCatalogEntries({ schema_version: "2.0.0", resources: state.resources }, press).resources;
      state.popularPressTitleIds = new Set(popularity.popular_catalog_ids ?? []);
      state.pressPopularityReasons = buildPressPopularityReasonIndex(popularity);
      state.pressLoaded = true;
      renderLinkConverterServices();
      state.pressLoadError = false;
      finalizeInitialFavoriteLayout();
      loadEditionSelections();
      if (!catalogFavoritesPreview && state.appRevealed) {
        renderFilters();
        renderLanguageFilterControls();
        render();
      }
    } catch (error) {
      state.pressLoadError = true;
      console.warn("Titres de presse indisponibles", error);
      if (state.category === "Presse") render();
    } finally {
      state.pressLoadPromise = null;
    }
  })();
  return state.pressLoadPromise;
}

function getEditorialTaxonomy(data) {
  if (!data?.editorial_taxonomy) throw new Error("Taxonomie du catalogue manquante");
  return canonicalizeEditorialTaxonomy(data.editorial_taxonomy);
}

function getResourceTaxonomy(data) {
  const workspace = data?.resource_taxonomy_v2;
  if (!workspace?.taxonomy?.categories || !workspace?.assignments) {
    throw new Error("Taxonomie Phoenix des ressources manquante");
  }
  return workspace;
}

function getLanguageVocabulary(data) {
  const vocabulary = { ...(Array.isArray(data) ? {} : data.language_vocabulary ?? {}) };

  Object.entries(languageLabelOverrides).forEach(([code, label]) => {
    if (!vocabulary[code]) {
      vocabulary[code] = label;
    }
  });

  for (const resource of state.resources) {
    const codes = getResourceLanguageCodes(resource);
    const labels = getResourceLanguageLabels(resource);

    codes.forEach((code, index) => {
      const normalizedCode = normalizeLanguageCode(code);
      if (normalizedCode && labels[index] && !vocabulary[normalizedCode]) {
        vocabulary[normalizedCode] = labels[index];
      }
      if (code && labels[index] && !vocabulary[code]) {
        vocabulary[code] = labels[index];
      }
    });
  }

  return vocabulary;
}

function scheduleDeferredStartupWork() {
  scheduleBackgroundAssetWarmup();
}

function applyInitialViewFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const requestedView = params.get("view") || params.get("category");
  const requestedLanguage = params.get("lang") || params.get("language");

  if (requestedView) {
    const requestedCategory = normalize(requestedView);
    const knownCategories = getGeneralResourceCategories();
    const category = [...knownCategories].find((item) => normalize(item) === requestedCategory);

    if (category) {
      state.category = category;
    }
  }

  if (requestedLanguage) {
    const knownCodes = getKnownLanguageCodes();
    const requestedCodes = requestedLanguage
      .split(",")
      .map((code) => code.trim().toLowerCase())
      .filter((code) => knownCodes.has(code));

    if (requestedCodes.length) {
      state.languageFilter = new Set(requestedCodes);
      saveProfileFilters();
      renderLanguageFilterControls();
    }
  }

}

function bindEvents() {
  setupEuropresseSessionHelpers();
  setupLinkConverter();
  for (const eventName of ["pointerdown", "touchstart", "wheel"]) {
    document.addEventListener(eventName, interruptBackgroundAssetWarmup, { passive: true });
  }
  pressPopularityNoteClose.addEventListener("click", closePressPopularityNote);

  searchInput.addEventListener("input", (event) => {
    state.query = isSearchLink(event.target.value) ? "" : event.target.value;
    linkConverterFeedback.textContent = "";
    syncSearchLinkAction();
    render();
  });
  searchInput.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "Enter" && isSearchLink(searchInput.value)) {
      event.preventDefault();
      if (getAlphaMode()) linkConverterForm.requestSubmit();
      return;
    }
    if (bookSearch.handleKeydown(event)) return;
    if (event.key !== "Enter") return;
    event.preventDefault();
    searchInput.blur();
    bookSearch.dismissSuggestions();
    requestAnimationFrame(() => grid.scrollIntoView({ block: "start", behavior: "smooth" }));
  });

  passFilter.addEventListener("change", (event) => {
    state.passFilter = event.target.value;
    syncProfileFilterState();
    saveProfileFilters();
    render();
  });

  remoteFilter.addEventListener("change", (event) => {
    state.remoteFilter = event.target.value;
    state.siteAccess = getSiteAccessFromRemoteFilter(state.remoteFilter);
    syncProfileFilterState();
    saveProfileFilters();
    render();
  });

  bindSettingsEvents();

  bindReleaseModeEvents();
  bindSharingEvents();

  pressTitleMediumLayoutQuery.addEventListener("change", syncPressTitleEditorialBranchExpansion);
  pressTitleNarrowLayoutQuery.addEventListener("change", syncPressTitleEditorialBranchExpansion);
  pressTitleMediumLayoutQuery.addEventListener("change", syncEntryGridColumns);
  pressTitleNarrowLayoutQuery.addEventListener("change", syncEntryGridColumns);

  document.addEventListener("keydown", (event) => {
    interruptBackgroundAssetWarmup();
    const usesOptionOnly = event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;

    if (usesOptionOnly && ["Enter", "NumpadEnter"].includes(event.code) && !event.repeat) {
      event.preventDefault();
      setAlphaMode(!getAlphaMode(), { gesture: true });
      return;
    }

    if (usesOptionOnly && event.key === "Tab" && !event.repeat) {
      event.preventDefault();
      cycleTheme();
      return;
    }

    if (
      usesOptionOnly
      && event.code === "Space"
      && !event.repeat
    ) {
      event.preventDefault();
      if (getAlphaMode()) toggleLinkConverter();
      return;
    }

    if (event.key === "Escape" && !settingsModal.hidden) {
      closeSettingsModal();
    }

    if (event.key === "Escape" && !shareScanPanel.hidden) {
      event.preventDefault();
      stopShareScanning();
      document.querySelector("#startShareScan").focus();
      return;
    }

    if (event.key === "Escape" && !shareModal.hidden) {
      closeShareModal();
    }

    if (event.key === "Escape" && !pressPopularityNote.hidden) {
      closePressPopularityNote();
    }

    if (event.key === "Escape" && !alphaModeNote.hidden) {
      closeAlphaModeNote();
    }

    if (event.key === "Escape" && state.quickLaunchActionMenus.size) {
      state.quickLaunchActionMenus.clear();
      renderQuickLaunch();
    }
  });

  jumpToSearch.addEventListener("click", () => {
    searchControls.scrollIntoView({ behavior: "smooth", block: "start" });
    searchInput.focus({ preventScroll: true });
  });
}

function revealApp() {
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-ready");
  state.appRevealed = true;
  if (!catalogFavoritesPreview) searchHints.start();

  resumeProgressiveRendering();
}

// Reveal happens after startup images; resume only the still-current render.

function render() {
  renderLinkConverterServices();
  renderQuickLaunch();
  if (catalogFavoritesPreview) {
    return;
  }
  renderResourceGrid();
  bookSearch.update();
  scheduleFloatingToolsUpdate();
}

function playListRefreshAnimation(element) {
  element.classList.remove(listRefreshAnimationClass);
  void element.offsetWidth;
  element.classList.add(listRefreshAnimationClass);
}

function playResourceGridAnimation(animationTarget = "all") {
  if (animationTarget === "press-titles") {
    grid.classList.remove(listRefreshAnimationClass);
    const titlesGrid = grid.querySelector(".press-titles .entry-grid");
    if (titlesGrid) {
      playListRefreshAnimation(titlesGrid);
    }
    return;
  }

  playListRefreshAnimation(grid);
}

const {
  closeConverterResourcesModal,
  getLinkConverterServices,
  invalidateConverterResourceIndex,
  isSearchLink,
  renderConverterResourceList,
  renderLinkConverterServices,
  setupLinkConverter,
  syncSearchLinkAction,
  toggleLinkConverter
} = createLinkConverterController({
  bookSearch,
  buildEuropresseDeepLink: (...args) => buildEuropresseDeepLink(...args),
  converterResourcesClose,
  converterResourcesCount,
  converterResourcesList,
  converterResourcesModal,
  converterResourcesProviderFilter,
  converterResourcesSearch,
  getAccessMode: (...args) => getAccessMode(...args),
  getFallbackLabel: (...args) => getFallbackLabel(...args),
  isAlphaMode: () => getAlphaMode(),
  isCatalogVisible: (...args) => isCatalogVisible(...args),
  isPressTitleEntry: (...args) => isPressTitleEntry(...args),
  linkConverterFeedback,
  linkConverterForm,
  linkConverterInput,
  linkConverterResourceListOpen,
  linkConverterServices,
  loadDeferredLinkSources: (...args) => loadDeferredLinkSources(...args),
  matchesPassFilter: (...args) => matchesPassFilter(...args),
  matchesRemoteFilter: (...args) => matchesRemoteFilter(...args),
  openNewTab: (...args) => openNewTab(...args),
  playListRefreshAnimation,
  renderFilters: (...args) => renderFilters(...args),
  renderIcon: (...args) => renderIcon(...args),
  searchInput,
  searchLinkOpen,
  state,
  withTransitionParams: (...args) => withTransitionParams(...args)
});

const {
  bindSharingEvents,
  openIncomingShare,
  openShareExport,
  stopShareScanning,
  closeShareModal
} = createSharingController({
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
  shareScopeDetails,
  shareStatus,
  shareQr,
  shareLink,
  shareNetworkHint,
  loadPressCatalog: (...args) => loadPressCatalog(...args),
  state,
  settingsModal,
  openSettings,
  closeSettingsModal: (...args) => closeSettingsModal(...args),
  shareImportStatus,
  shareScanStatus,
  bookSearch,
  resolveCatalogResourceId: (...args) => resolveCatalogResourceId(...args),
  getResourceById: (...args) => getResourceById(...args),
  isCatalogVisible: (...args) => isCatalogVisible(...args),
  isValidEditionSelection: (...args) => isValidEditionSelection(...args),
  passFilter,
  remoteFilter,
  getKnownLanguageCodes: (...args) => getKnownLanguageCodes(...args),
  shareImportSummary,
  shareImportDetails,
  applyTheme: (...args) => applyTheme(...args),
  applyColorBlindMode: (...args) => applyColorBlindMode(...args),
  syncProfileFilterState: (...args) => syncProfileFilterState(...args),
  renderFilters: (...args) => renderFilters(...args),
  renderLanguageFilterControls: (...args) => renderLanguageFilterControls(...args),
  render: (...args) => render(...args),
  openShareFromSettings,
  shareImportLink
});

const {
  renderQuickLaunch,
  setupCatalogFavoritesPreview,
  pressPlatformResourceIds,
  pressPlatformToneIds,
  pressPlatformCompactLabels,
  pressPlatformNarrowLabels,
  getResourceById,
  getAlphaFavoriteResources,
  openQuickLaunchFolder,
  getFavoriteResources
} = createFavoritesRenderer({
  state,
  catalogFavoritesPreview,
  quickLaunch,
  resetQuickLaunchActionAnimationFlag: (...args) => resetQuickLaunchActionAnimationFlag(...args),
  isCatalogVisible: (...args) => isCatalogVisible(...args),
  handleQuickLaunchRowPointerDown: (...args) => handleQuickLaunchRowPointerDown(...args),
  preventQuickLaunchEditContextMenu: (...args) => preventQuickLaunchEditContextMenu(...args),
  addDraftFavoriteRow: (...args) => addDraftFavoriteRow(...args),
  renderIcon: (...args) => renderIcon(...args),
  getFallbackLabel: (...args) => getFallbackLabel(...args),
  handleQuickLaunchPointerDown: (...args) => handleQuickLaunchPointerDown(...args),
  handleQuickLaunchKeyDown: (...args) => handleQuickLaunchKeyDown(...args),
  getActions: (...args) => getActions(...args),
  getProfileVisibleActions: (...args) => getProfileVisibleActions(...args),
  resolveActionHref: (...args) => resolveActionHref(...args),
  getSessionAttributes: (...args) => getSessionAttributes(...args),
  bookSearch,
  toggleAccessNote: (...args) => toggleAccessNote(...args),
  stopQuickLaunchRemoveEvent: (...args) => stopQuickLaunchRemoveEvent(...args),
  createFavoriteContainerId: (...args) => createFavoriteContainerId(...args),
  applyTheme: (...args) => applyTheme(...args),
  waitForImageElement: (...args) => waitForImageElement(...args),
  renderArchiveActionIcon: (...args) => renderArchiveActionIcon(...args),
  getAccessMode: (...args) => getAccessMode(...args),
  getAccessModeTitle: (...args) => getAccessModeTitle(...args),
  isContextNoteOpen: (...args) => isContextNoteOpen(...args),
  renderResourceCategoryIcon: (...args) => renderResourceCategoryIcon(...args),
  saveQuickLaunchOrder: (...args) => saveQuickLaunchOrder(...args),
  cancelQuickLaunchEdit: (...args) => cancelQuickLaunchEdit(...args),
  openShareExport: (...args) => openShareExport(...args),
  startQuickLaunchEdit: (...args) => startQuickLaunchEdit(...args),
  handleQuickLaunchRemove: (...args) => handleQuickLaunchRemove(...args),
  getPressEntryTypes: (...args) => getPressEntryTypes(...args),
  getPressTitleSourceFilterIds: (...args) => getPressTitleSourceFilterIds(...args)
});

const {
  resetQuickLaunchActionAnimationFlag,
  handleQuickLaunchRowPointerDown,
  preventQuickLaunchEditContextMenu,
  addDraftFavoriteRow,
  handleQuickLaunchPointerDown,
  handleQuickLaunchKeyDown,
  stopQuickLaunchRemoveEvent,
  saveQuickLaunchOrder,
  cancelQuickLaunchEdit,
  startQuickLaunchEdit,
  handleQuickLaunchRemove
} = createFavoritesEditor({
  state,
  render: (...args) => render(...args),
  resolveCatalogResourceId: (...args) => resolveCatalogResourceId(...args),
  saveFavorites: (...args) => saveFavorites(...args),
  saveFavoriteLayout: (...args) => saveFavoriteLayout(...args),
  integrateBookFavorites: (...args) => integrateBookFavorites(...args),
  createFavoriteContainerId: (...args) => createFavoriteContainerId(...args),
  renderQuickLaunch: (...args) => renderQuickLaunch(...args),
  quickLaunch,
  pressTitleNarrowLayoutQuery,
  openQuickLaunchFolder: (...args) => openQuickLaunchFolder(...args)
});

const {syncPressTitleEditorialBranchExpansion, createPressTitleFilters, getPressTitleEditorialSelection} = createPressFilters({
  state,
  renderResourceGrid: (...args) => renderResourceGrid(...args),
  matchesPressTitleSourceFilter: (...args) => matchesPressTitleSourceFilter(...args),
  matchesPressTitleCountryFilter: (...args) => matchesPressTitleCountryFilter(...args),
  matchesPressTitleEditorialFilter: (...args) => matchesPressTitleEditorialFilter(...args),
  matchesPressTitleLocalRegionFilter: (...args) => matchesPressTitleLocalRegionFilter(...args),
  pressTitleNarrowLayoutQuery,
  pressTitleMediumLayoutQuery,
  getPressTitleSourceFilterIds: (...args) => getPressTitleSourceFilterIds(...args)
});

const {
  setupEuropresseSessionHelpers,
  getVisibleActions,
  renderActionLink,
  renderActions,
  updateEditionSelection,
  resolveActionHref,
  resolveActionUrl,
  getSessionStartUrl,
  isEuropressePdfAction,
  getActionProviderLabel,
  isValidEditionSelection,
  buildEuropresseDeepLink,
  openNewTab,
  withTransitionParams,
  getActions,
  getProfileVisibleActions,
  getSessionAttributes,
  renderArchiveActionIcon
} = createResourceActions({
  isPressTitleEntry: (...args) => isPressTitleEntry(...args),
  shouldShowPressTitleSection: (...args) => shouldShowPressTitleSection(...args),
  state,
  getAccessMode: (...args) => getAccessMode(...args),
  saveEditionSelections: (...args) => saveEditionSelections(...args),
  renderQuickLaunch: (...args) => renderQuickLaunch(...args)
});

const {
  formatLanguageBadgeText,
  formatLanguageTooltipItem,
  buildPressPopularityReasonIndex,
  closePressPopularityNote,
  syncPressPopularityNoteDockOffset,
  schedulePressTitleCategoryBadgeLayout,
  formatLanguageOptionLabel,
  renderPassBadge,
  renderLanguageBadges,
  renderPressTitleCountryBadge,
  renderPressTitleLocalRegionBadges,
  renderPressTitleLanguageBadges,
  renderPressTitleRecommendedBadge,
  renderPressTitlePopularBadge,
  renderPressTitleEditorialBadges,
  layoutPressTitleCategoryBadges,
  togglePressPopularityNote,
  togglePressRecommendationNote,
  togglePassNote,
  toggleLanguageNote,
  toggleCountryNote,
  toggleRegionNote,
  toggleAccessNote,
  isContextNoteOpen
} = createCatalogContextNotes({
  getResourceLanguageCodes: (...args) => getResourceLanguageCodes(...args),
  pressPopularityNote,
  state,
  pressPopularityNoteDetails,
  getAccessModeTitle: (...args) => getAccessModeTitle(...args),
  closeAlphaModeNote: (...args) => closeAlphaModeNote(...args),
  pressPopularityNoteTitle,
  jumpToSearchDock,
  alphaModeNote,
  getResourceCategories: (...args) => getResourceCategories(...args),
  normalizeLanguageCode: (...args) => normalizeLanguageCode(...args)
});

const {
  getAccessMode,
  getAccessModeLabel,
  getAccessModeTitle,
  getFilteredResources,
  getPressEntryTypes,
  getPressTitleSourceFilterId,
  getPressTitleSourceFilterIds,
  getProviderLabel,
  getResourceCategories,
  getResourceLanguageCodes,
  getResourceLanguageLabels,
  getResourceTaxonomyAncestors,
  getResourceTaxonomyBadges,
  getResourceTaxonomyIndex,
  getResourceTaxonomyNodes,
  getResourceTaxonomyRoots,
  isCatalogVisible,
  isPressResourceEntry,
  isPressTitleEntry,
  isReviewLogo,
  matchesLanguageFilter,
  matchesPassFilter,
  matchesPressTitleCountryFilter,
  matchesPressTitleEditorialFilter,
  matchesPressTitleLocalRegionFilter,
  matchesPressTitleSourceFilter,
  matchesRemoteFilter,
  matchesResourceCategoryFilter,
  normalizeLanguageCode,
  shouldShowPressTitleSection,
  shouldShowResourceInCurrentListing
} = createCatalogSelection({
  getPressTitleEditorialSelection: (...args) => getPressTitleEditorialSelection(...args),
  state
});

const {
  getKnownLanguageCodes,
  renderFilters,
  renderLanguageFilterControls,
  renderResourceCategoryIcon
} = createCatalogFilterControls({
  filters,
  formatLanguageBadgeText: (...args) => formatLanguageBadgeText(...args),
  formatLanguageOptionLabel: (...args) => formatLanguageOptionLabel(...args),
  formatLanguageTooltipItem: (...args) => formatLanguageTooltipItem(...args),
  getResourceLanguageCodes: (...args) => getResourceLanguageCodes(...args),
  getResourceTaxonomyRoots: (...args) => getResourceTaxonomyRoots(...args),
  isCatalogVisible: (...args) => isCatalogVisible(...args),
  languageFilters,
  loadPressCatalog: (...args) => loadPressCatalog(...args),
  render: (...args) => render(...args),
  saveProfileFilters: (...args) => saveProfileFilters(...args),
  settingsLanguageFilters,
  state,
  syncProfileFilterState: (...args) => syncProfileFilterState(...args)
});

const accessLinksDialog = createAccessLinksDialog();
const getAccessLinks = resource => collectAccessLinks(resource, {
  getActions, resolveActionHref, resolveActionUrl, getSessionStartUrl, getActionProviderLabel,
}, window.location.href);

const {createCard, getFallbackLabel, renderIcon} = createCatalogCards({
  getAccessLinks,
  openAccessLinks: (resource, button) => accessLinksDialog.open(resource.name, getAccessLinks(resource), button, {
    iconElement: button.closest('.card')?.querySelector('.logo'),
  }),
  grid,
  getAccessMode: (...args) => getAccessMode(...args),
  getAccessModeLabel: (...args) => getAccessModeLabel(...args),
  getAccessModeTitle: (...args) => getAccessModeTitle(...args),
  getPressTitleSourceFilterId: (...args) => getPressTitleSourceFilterId(...args),
  getPressTitleSourceFilterIds: (...args) => getPressTitleSourceFilterIds(...args),
  getProviderLabel: (...args) => getProviderLabel(...args),
  getResourceTaxonomyBadges: (...args) => getResourceTaxonomyBadges(...args),
  isPressTitleEntry: (...args) => isPressTitleEntry(...args),
  isReviewLogo: (...args) => isReviewLogo(...args),
  layoutPressTitleCategoryBadges,
  render: (...args) => render(...args),
  renderActions: (...args) => renderActions(...args),
  renderFilters: (...args) => renderFilters(...args),
  renderLanguageBadges: (...args) => renderLanguageBadges(...args),
  renderPassBadge: (...args) => renderPassBadge(...args),
  renderPressTitleCountryBadge: (...args) => renderPressTitleCountryBadge(...args),
  renderPressTitleEditorialBadges: (...args) => renderPressTitleEditorialBadges(...args),
  renderPressTitleLanguageBadges: (...args) => renderPressTitleLanguageBadges(...args),
  renderPressTitleLocalRegionBadges: (...args) => renderPressTitleLocalRegionBadges(...args),
  renderPressTitlePopularBadge: (...args) => renderPressTitlePopularBadge(...args),
  renderPressTitleRecommendedBadge: (...args) => renderPressTitleRecommendedBadge(...args),
  shouldShowPressTitleSection: (...args) => shouldShowPressTitleSection(...args),
  state,
  toggleCountryNote: (...args) => toggleCountryNote(...args),
  toggleFavorite: (...args) => toggleFavorite(...args),
  toggleLanguageNote: (...args) => toggleLanguageNote(...args),
  togglePassNote: (...args) => togglePassNote(...args),
  togglePressPopularityNote: (...args) => togglePressPopularityNote(...args),
  togglePressRecommendationNote: (...args) => togglePressRecommendationNote(...args),
  toggleRegionNote: (...args) => toggleRegionNote(...args),
  updateEditionSelection: (...args) => updateEditionSelection(...args)
});

const {getCatalogSuggestionGroups} = createCatalogSuggestions({
  bookSearch,
  formatLanguageBadgeText: (...args) => formatLanguageBadgeText(...args),
  formatLanguageTooltipItem: (...args) => formatLanguageTooltipItem(...args),
  getAccessMode: (...args) => getAccessMode(...args),
  getAccessModeLabel: (...args) => getAccessModeLabel(...args),
  getActionProviderLabel: (...args) => getActionProviderLabel(...args),
  getFallbackLabel: (...args) => getFallbackLabel(...args),
  getResourceLanguageCodes: (...args) => getResourceLanguageCodes(...args),
  getSessionStartUrl: (...args) => getSessionStartUrl(...args),
  getVisibleActions: (...args) => getVisibleActions(...args),
  grid,
  isEuropressePdfAction: (...args) => isEuropressePdfAction(...args),
  isPressResourceEntry: (...args) => isPressResourceEntry(...args),
  isPressTitleEntry: (...args) => isPressTitleEntry(...args),
  matchesLanguageFilter: (...args) => matchesLanguageFilter(...args),
  matchesPassFilter: (...args) => matchesPassFilter(...args),
  matchesPressTitleCountryFilter: (...args) => matchesPressTitleCountryFilter(...args),
  matchesPressTitleEditorialFilter: (...args) => matchesPressTitleEditorialFilter(...args),
  matchesPressTitleLocalRegionFilter: (...args) => matchesPressTitleLocalRegionFilter(...args),
  matchesPressTitleSourceFilter: (...args) => matchesPressTitleSourceFilter(...args),
  matchesRemoteFilter: (...args) => matchesRemoteFilter(...args),
  matchesResourceCategoryFilter: (...args) => matchesResourceCategoryFilter(...args),
  render: (...args) => render(...args),
  renderFilters: (...args) => renderFilters(...args),
  renderIcon: (...args) => renderIcon(...args),
  resolveActionHref: (...args) => resolveActionHref(...args),
  searchInput,
  shouldShowResourceInCurrentListing: (...args) => shouldShowResourceInCurrentListing(...args),
  state,
  toggleFavorite: (...args) => toggleFavorite(...args)
});

const {renderOverview} = createCatalogOverview({
  appendCardRange: (...args) => appendCardRange(...args),
  bookSearch,
  getFilteredResources: (...args) => getFilteredResources(...args),
  getVisibleActions: (...args) => getVisibleActions(...args),
  grid,
  isPressResourceEntry: (...args) => isPressResourceEntry(...args),
  isPressTitleEntry: (...args) => isPressTitleEntry(...args),
  render: (...args) => render(...args),
  renderFilters: (...args) => renderFilters(...args),
  resultsSummary,
  state
});

const {
  applyColorBlindMode,
  applyTheme,
  cycleTheme,
  loadColorBlindMode,
  loadTheme,
  saveColorBlindMode,
  saveTheme
} = createAppearancePreferences({
  darkThemeQuery,
  settingsColorBlindMode,
  settingsTheme,
  state
});

const {
  getRemoteFilterFromSiteAccess,
  getSiteAccessFromRemoteFilter,
  loadProfileFilters,
  saveProfileFilters,
  syncProfileFilterState
} = createProfilePreferences({
  getKnownLanguageCodes: (...args) => getKnownLanguageCodes(...args),
  normalizeLanguageCode: (...args) => normalizeLanguageCode(...args),
  passFilter,
  remoteFilter,
  renderLanguageFilterControls: (...args) => renderLanguageFilterControls(...args),
  settingsPassFilter,
  settingsSiteAccess,
  state
});

const {
  createFavoriteContainerId,
  finalizeInitialFavoriteLayout,
  integrateBookFavorites,
  loadEditionSelections,
  loadFavoriteLayout,
  loadFavorites,
  resolveCatalogResourceId,
  saveEditionSelections,
  saveFavoriteLayout,
  saveFavorites,
  toggleFavorite
} = createFavoritesPersistence({
  bookSearch,
  catalogFavoritesPreview,
  getAlphaFavoriteResources: (...args) => getAlphaFavoriteResources(...args),
  getResourceById: (...args) => getResourceById(...args),
  isCatalogVisible: (...args) => isCatalogVisible(...args),
  isValidEditionSelection: (...args) => isValidEditionSelection(...args),
  render: (...args) => render(...args),
  state
});

const {
  interruptBackgroundAssetWarmup,
  requestIdleWork,
  scheduleBackgroundAssetWarmup,
  waitForImageElement,
  waitForStartupImages
} = createAssetWarmup({
  dataUrls,
  getFavoriteResources: (...args) => getFavoriteResources(...args),
  getFilteredResources: (...args) => getFilteredResources(...args),
  getLinkConverterServices: (...args) => getLinkConverterServices(...args),
  isCatalogVisible: (...args) => isCatalogVisible(...args),
  isJsonFetchPending: (...args) => isJsonFetchPending(...args),
  readRuntimeCachedResponse: (...args) => readRuntimeCachedResponse(...args),
  state,
  storeRuntimeCachedResponse: (...args) => storeRuntimeCachedResponse(...args)
});

const {
  appendCardRange,
  renderResourceGrid,
  resumeProgressiveRendering,
  syncEntryGridColumns
} = createCatalogListing({
  openPlatformDirectory,
  bookSearch,
  createCard: (...args) => createCard(...args),
  createPressTitleFilters: (...args) => createPressTitleFilters(...args),
  getAccessMode: (...args) => getAccessMode(...args),
  getAccessModeLabel: (...args) => getAccessModeLabel(...args),
  getFilteredResources: (...args) => getFilteredResources(...args),
  getResourceTaxonomyAncestors: (...args) => getResourceTaxonomyAncestors(...args),
  getResourceTaxonomyIndex: (...args) => getResourceTaxonomyIndex(...args),
  getResourceTaxonomyNodes: (...args) => getResourceTaxonomyNodes(...args),
  getVisibleActions: (...args) => getVisibleActions(...args),
  grid,
  isPressResourceEntry: (...args) => isPressResourceEntry(...args),
  isPressTitleEntry: (...args) => isPressTitleEntry(...args),
  loadPressCatalog: (...args) => loadPressCatalog(...args),
  matchesPressTitleCountryFilter: (...args) => matchesPressTitleCountryFilter(...args),
  matchesPressTitleEditorialFilter: (...args) => matchesPressTitleEditorialFilter(...args),
  matchesPressTitleLocalRegionFilter: (...args) => matchesPressTitleLocalRegionFilter(...args),
  matchesPressTitleSourceFilter: (...args) => matchesPressTitleSourceFilter(...args),
  playListRefreshAnimation: (...args) => playListRefreshAnimation(...args),
  playResourceGridAnimation: (...args) => playResourceGridAnimation(...args),
  pressPlatformCompactLabels,
  pressPlatformNarrowLabels,
  pressPlatformResourceIds,
  pressPlatformToneIds,
  pressTitleMediumLayoutQuery,
  pressTitleNarrowLayoutQuery,
  renderActionLink: (...args) => renderActionLink(...args),
  renderIcon: (...args) => renderIcon(...args),
  renderOverview: (...args) => renderOverview(...args),
  requestIdleWork: (...args) => requestIdleWork(...args),
  resultCount,
  resultsHeading,
  resultsSummary,
  scheduleBackgroundAssetWarmup: (...args) => scheduleBackgroundAssetWarmup(...args),
  scheduleFloatingToolsUpdate: (...args) => scheduleFloatingToolsUpdate(...args),
  shouldShowPressTitleSection: (...args) => shouldShowPressTitleSection(...args),
  state
});

const {
  fetchJson,
  fetchOptionalIndexPresseBusinessLinkSources,
  initializeAssetManifest,
  isJsonFetchPending,
  loadDeferredLinkSources,
  readRuntimeCachedResponse,
  storeRuntimeCachedResponse
} = createCatalogLoader({
  converterResourcesModal,
  dataUrls,
  invalidateConverterResourceIndex: (...args) => invalidateConverterResourceIndex(...args),
  renderConverterResourceList: (...args) => renderConverterResourceList(...args),
  requestIdleWork: (...args) => requestIdleWork(...args),
  state
});

const {
  bindReleaseModeEvents,
  closeAlphaModeNote,
  getAlphaMode,
  loadReleaseMode,
  resetReleaseModeDiscovery,
  setAlphaMode
} = createReleaseMode({
  alphaModeNote,
  bookSearch,
  closeConverterResourcesModal: (...args) => closeConverterResourcesModal(...args),
  closePressPopularityNote: (...args) => closePressPopularityNote(...args),
  linkConverter,
  linkConverterFeedback,
  loadDeferredLinkSources: (...args) => loadDeferredLinkSources(...args),
  releaseModeDescription,
  releaseModeLabel,
  releaseModeSettings,
  releaseModeToggleLabel,
  renderQuickLaunch: (...args) => renderQuickLaunch(...args),
  searchHints,
  settingsAlphaMode,
  syncPressPopularityNoteDockOffset: (...args) => syncPressPopularityNoteDockOffset(...args),
  syncSearchLinkAction: (...args) => syncSearchLinkAction(...args),
  alphaModeNoteClose
});

const {
  bindSettingsEvents,
  closeSettingsModal,
  setupPrivacyNotice
} = createSettingsController({
  bookSearch,
  clearLocalDataStatus,
  closeAlphaModeNote: (...args) => closeAlphaModeNote(...args),
  closeSettings,
  dismissNotice,
  openSettings,
  privacyNotice,
  resetReleaseModeDiscovery: (...args) => resetReleaseModeDiscovery(...args),
  setAlphaMode: (...args) => setAlphaMode(...args),
  settingsModal,
  settingsTheme,
  state,
  applyTheme: (...args) => applyTheme(...args),
  saveTheme: (...args) => saveTheme(...args),
  settingsColorBlindMode,
  applyColorBlindMode: (...args) => applyColorBlindMode(...args),
  saveColorBlindMode: (...args) => saveColorBlindMode(...args),
  alphaModeSettingsLink,
  darkThemeQuery,
  settingsPassFilter,
  passFilter,
  syncProfileFilterState: (...args) => syncProfileFilterState(...args),
  saveProfileFilters: (...args) => saveProfileFilters(...args),
  render: (...args) => render(...args),
  settingsSiteAccess,
  getRemoteFilterFromSiteAccess: (...args) => getRemoteFilterFromSiteAccess(...args),
  remoteFilter,
  clearLocalDataButton
});

const {
  scheduleFloatingToolsUpdate,
  setupFloatingTools
} = createFloatingTools({
  jumpToSearchDock,
  pressPopularityNote,
  schedulePressTitleCategoryBadgeLayout,
  siteFooter,
  syncPressPopularityNoteDockOffset
});

init().catch((error) => {
  console.error(error);
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-ready");
  grid.innerHTML = '<p class="empty">Impossible de charger le catalogue presse.</p>';
});
