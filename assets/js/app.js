import {
  activeEditorialCategoryIds,
  canonicalizeEditorialTaxonomy,
  categoryIndex,
  descendantCategoryIds,
  orderedCategoryRows,
} from "./editorial-taxonomy.js?v=2026-09-06";
import { validateCatalog, mergeCatalogEntries, migratePreferences } from "./catalog-model.js";
import { hydrateThemedSvgIcons } from "./catalog-icons.js?v=2026-09-14-white-themed-svg";
import {applyLogoAppearance, logoAppearanceAttributes} from "./logo-appearance.js?v=2026-09-16-press-background";
import {
  cloneFavoriteLayout,
  createFavoriteFolder,
  createFavoriteLayout,
  createFavoriteRow,
  deleteFavoriteFolder,
  deleteFavoriteRow,
  findFavoriteFolder,
  findFavoriteResource,
  listFavoriteResourceIds,
  moveFavoriteFolder,
  moveFavoriteResource,
  normalizeFavoriteLayout,
  removeFavoriteResource,
} from "./favorite-layout.js?v=2026-09-13";
import {
  decodeShareConfig,
  encodeShareConfig,
  packFavoriteLayout,
  unpackFavoriteLayout,
} from "./share-config.js?v=2026-09-22";

const incomingShareToken = window.location.hash.startsWith("#share=")
  ? window.location.hash.slice("#share=".length)
  : null;
if (incomingShareToken) {
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
}

const catalogFavoritesPreview = new URLSearchParams(window.location.search)
  .get("catalog-editor-preview") === "all-favorites";
const catalogFavoritesPreviewTheme = new URLSearchParams(window.location.search).get("theme");
const catalogFavoritesLargeImageThresholdBytes = 15 * 1024;

if (catalogFavoritesPreview) {
  document.body.classList.add("is-catalog-favorites-preview");
}

const state = {
  resources: [],
  pressLoaded: false,
  pressLoadPromise: null,
  pressLoadError: false,
  providers: [],
  editorialTaxonomy: null,
  editorialTaxonomyIndex: new Map(),
  resourceTaxonomy: null,
  resourceTaxonomyIndex: new Map(),
  europresseWebSources: [],
  pressreaderLinkSources: [],
  indexpresseBusinessLinkSources: [],
  linkDirectorySettings: {},
  popularPressTitleIds: new Set(),
  pressPopularityReasons: new Map(),
  languageVocabulary: {},
  category: "Toutes",
  favorites: new Set(),
  favoritesReady: false,
  favoritesOnly: false,
  passFilter: "all",
  remoteFilter: "all",
  pressTitleSourceFilter: "all",
  pressTitleCountryFilter: new Set(),
  pressTitleEditorialMode: "all",
  pressTitleEditorialFilters: new Set(),
  pressTitleEditorialRestoreSnapshot: null,
  pressTitleEditorialAllLastToggleAt: 0,
  pressTitleEditorialExpandedBranches: {
    wide: new Map(),
    medium: new Map(),
    narrow: new Map(),
  },
  pressTitleLocalCountryScope: "",
  pressTitleLocalRegionFilter: "",
  pressTitleLocalRegionPanelOpening: false,
  localGeography: null,
  editionSelections: new Map(),
  siteAccess: "unknown",
  languageFilter: new Set(),
  theme: "auto",
  colorBlindMode: false,
  favoriteOrder: [],
  favoriteOrderCustom: false,
  favoritesInitializedFromDefaults: false,
  favoriteLayoutNeedsPressClassification: false,
  pendingInitialFavoriteOrder: [],
  pendingDefaultPressFavorites: false,
  favoriteLayout: { version: 1, rows: [] },
  draftFavoriteLayout: null,
  openFavoriteFolderId: null,
  suppressedFavoriteFolderClickId: null,
  quickLaunchEditing: false,
  quickLaunchActionMenus: new Set(),
  catalogPreviewFavoriteMenusOnly: false,
  officialDescriptionResources: new Set(),
  quickLaunchTransitioning: false,
  quickLaunchActionsEntering: false,
  quickLaunchActionsExiting: false,
  quickLaunchModifierEntering: false,
  quickLaunchPendingExitAction: null,
  dragging: null,
  query: "",
  appRevealed: false,
  deferredLinkSourcesReady: false,
  converterResourceIndex: null,
  converterResourceSearchTimer: 0,
  converterResourceSearchRevision: 0,
  converterResourceVisibleLimit: 50,
  catalogPreviewImageRevision: 0,
  catalogPreviewImageFormats: new Set(),
  catalogPreviewEntryType: "all",
  catalogPreviewTitleSource: "all",
  catalogPreviewLargeImagesOnly: false,
  catalogPreviewBackgroundImagesOnly: false,
};

const grid = document.querySelector("#resourceGrid");
const filters = document.querySelector("#categoryFilters");
const searchInput = document.querySelector("#searchInput");
const passFilter = document.querySelector("#passFilter");
const remoteFilter = document.querySelector("#remoteFilter");
const resultCount = document.querySelector("#resultCount");
const resultsSummary = resultCount.closest(".section-heading");
const resultsHeading = resultsSummary.querySelector("h2");
const pressPopularityNote = document.querySelector("#pressPopularityNote");
const pressPopularityNoteTitle = document.querySelector("#pressPopularityNoteTitle");
const pressPopularityNoteDetails = document.querySelector("#pressPopularityNoteDetails");
const pressPopularityNoteClose = document.querySelector("#pressPopularityNoteClose");
const quickLaunch = document.querySelector("#quickLaunch");
const linkConverter = document.querySelector("#linkConverter");
const linkConverterForm = document.querySelector("#linkConverterForm");
const linkConverterInput = document.querySelector("#linkConverterInput");
const linkConverterServices = document.querySelector("#linkConverterServices");
const linkConverterFeedback = document.querySelector("#linkConverterFeedback");
const linkConverterResourceListOpen = document.querySelector("#linkConverterResourceListOpen");
const converterResourcesModal = document.querySelector("#converterResourcesModal");
const converterResourcesClose = document.querySelector("#converterResourcesClose");
const converterResourcesSearch = document.querySelector("#converterResourcesSearch");
const converterResourcesProviderFilter = document.querySelector("#converterResourcesProviderFilter");
const converterResourcesCount = document.querySelector("#converterResourcesCount");
const converterResourcesList = document.querySelector("#converterResourcesList");
const searchControls = document.querySelector("#searchControls");
const siteFooter = document.querySelector("#siteFooter");
const jumpToSearchDock = document.querySelector(".jump-to-search-dock");
const jumpToSearch = document.querySelector("#jumpToSearch");
const openSettings = document.querySelector("#openSettings");
const settingsModal = document.querySelector("#settingsModal");
const shareModal = document.querySelector("#shareModal");
const shareExport = document.querySelector("#shareExport");
const shareImport = document.querySelector("#shareImport");
const shareLink = document.querySelector("#shareLink");
const shareQr = document.querySelector("#shareQr");
const shareStatus = document.querySelector("#shareStatus");
const shareScopeDetails = document.querySelector("#shareScopeDetails");
const shareNetworkHint = document.querySelector("#shareNetworkHint");
const shareImportSummary = document.querySelector("#shareImportSummary");
const shareImportDetails = document.querySelector("#shareImportDetails");
const shareImportStatus = document.querySelector("#shareImportStatus");
const confirmShareImport = document.querySelector("#confirmShareImport");
let pendingShareImport = null;
let shareGeneration = 0;
let shareReturnFocus = null;
let qrScriptPromise = null;
const closeSettings = document.querySelector("#closeSettings");
const clearLocalDataButton = document.querySelector("#clearLocalData");
const clearLocalDataStatus = document.querySelector("#clearLocalDataStatus");
const settingsTheme = document.querySelector("#settingsTheme");
const settingsColorBlindMode = document.querySelector("#settingsColorBlindMode");
const settingsPassFilter = document.querySelector("#settingsPassFilter");
const settingsSiteAccess = document.querySelector("#settingsSiteAccess");
const languageFilters = document.querySelector("#languageFilters");
const settingsLanguageFilters = document.querySelector("#settingsLanguageFilters");
const privacyNotice = document.querySelector("#privacyNotice");
const dismissNotice = document.querySelector("#dismissNotice");

const startupImageTimeoutMs = 450;
const converterResourcesAnimationMs = 160;
const converterResourceSearchDelayMs = 350;
const converterResourcePageSize = 50;
// A multiple of every supported column count keeps each progressive batch row-complete.
const initialCardCount = 24;
const deferredCardBatchSize = 24;
const backgroundAssetBatchSize = 4;
const backgroundAssetWarmupDelayMs = 80;
const backgroundAssetRetryLimit = 2;
const runtimeJsonCacheName = "bnf-access:v2:json:v5";
let assetManifest = null;
const dataUrls = {
  assetIndex: "./data/asset-index.json",
  catalog: "./data/catalog-core.json",
  press: "./data/catalog-press.json",
  europresseLinks: "./data/europresse-link-sources.json",
  pressreaderLinks: "./data/pressreader-link-sources.json",
  indexpresseLinks: "./data/indexpresse-business-link-sources.json",
  linkDirectorySettings: "./data/link-directory-settings.json",
  popularity: "./data/press-popularity.json",
};
const pressEntryTypes = {
  resource: "resource",
  title: "press_title",
};
const hiddenCategoryBadges = new Set(["Sélection internationale"]);
const pressTitleSourceFilters = [
  { id: "all", label: "Tous" },
  { id: "direct", label: "Accès direct" },
  { id: "europresse", label: "Europresse" },
  { id: "pressreader", label: "PressReader" },
  { id: "indexpresse_business", label: "IndexPresse Business" },
  { id: "factiva", label: "Factiva" },
];
const pressTitleAllFilterValue = "all";
const pressTitleFavoriteFilterValue = "favorites";
const pressTitleRecommendedFilterValue = "recommended";
const pressTitlePopularFilterValue = "popular";
const pressTitleEditorialRootIcons = {
  actualite: '<path d="M15 18h-5"></path><path d="M18 14h-8"></path><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"></path><rect width="8" height="4" x="10" y="6" rx="1"></rect>',
  culture: '<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"></path><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>',
  divertissement: '<path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z"></path><circle cx="12" cy="12" r="10"></circle>',
  loisirs: '<circle cx="12" cy="12" r="10"></circle><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path>',
  professionnels: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect>',
  savoirs: '<path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>',
  vie_pratique: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>',
};
const resourceCategoryIcons = {
  favorites: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"></path>',
  Toutes: '<rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect>',
  Presse: '<path d="M15 18h-5"></path><path d="M18 14h-8"></path><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"></path><rect width="8" height="4" x="10" y="6" rx="1"></rect>',
  presse_et_medias: '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5"></path><path d="M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3v-6"></path>',
  economie_et_entreprise: '<rect width="18" height="13" x="3" y="8" rx="2"></rect><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M3 13h18"></path>',
  droit: '<path d="m16 16 3-8 3 8a5 5 0 0 1-6 0Z"></path><path d="m2 16 3-8 3 8a5 5 0 0 1-6 0Z"></path><path d="M7 21h10"></path><path d="M12 3v18"></path><path d="M3 7h18"></path>',
  art_et_image: '<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"></path><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>',
  musique_et_spectacle: '<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>',
  cinema: '<path d="M2 4c6-3 14-3 20 0v7c0 6-4.5 10-10 11C6.5 21 2 17 2 11Z" stroke-width="2.5"></path><ellipse cx="7.5" cy="9.5" rx="1.9" ry="1.35" fill="currentColor" stroke="none"></ellipse><ellipse cx="16.5" cy="9.5" rx="1.9" ry="1.35" fill="currentColor" stroke="none"></ellipse><ellipse cx="12" cy="16" rx="3.6" ry="2.7" fill="currentColor" stroke="none"></ellipse>',
  litterature_et_langues: '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><path d="M16 8 2 22"></path><path d="M17.5 15H9"></path>',
  histoire_et_antiquite: '<path d="M5 22h14"></path><path d="M7 18h10"></path><path d="M9.5 18V8"></path><path d="M14.5 18V8"></path><path d="M7 8h10"></path><path d="m8 8-1-3 4-2 2 2 4-1 1 4"></path>',
  sciences_humaines: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle>',
  sciences_et_technique: '<path d="M6 18h8"></path><path d="M3 22h18"></path><path d="M14 22a7 7 0 1 0 0-14h-1"></path><path d="M9 14h2"></path><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path><path d="M12 6V3H8v3"></path>',
  catalogues_et_bibliographies: '<path d="M3 7h5l2 2h11v11H3z"></path><path d="M3 7V4h6l2 3"></path><circle cx="16" cy="14" r="2.5"></circle><path d="m18 16 2 2"></path>',
  catalogues_et_bibliographies__livres: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"></path>',
  recherche_generale: '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>',
  dictionnaires_et_encyclopedies: '<path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>',
  biographies: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path>',
};
const promotedPressTitleCountryCodes = new Set(["fr", "ca", "be", "ch", "us", "gb"]);
const promotedPressTitleCountryMinimumCount = 20;
const privacyNoticeDismissedKey = "bnf-access:v2:privacy-notice-dismissed:v1";
const favoriteStorageKey = "bnf-access:v2:favorites:v1";
const favoriteStorageReadyKey = "bnf-access:v2:favorites-ready:v1";
const favoriteOrderStorageKey = "bnf-access:v2:favorite-order:v1";
const favoriteOrderCustomStorageKey = "bnf-access:v2:favorite-order-custom:v1";
const favoriteLayoutStorageKey = "bnf-access:v2:favorite-layout:v1";
const legacyFavoritesMigratedStorageKey = "bnf-access:v2:legacy-favorites-migrated:v1";
const pressFavoriteLayoutMigratedStorageKey = "bnf-access:v2:press-favorite-layout-migrated:v1";
const legacyCatalogResourceIds = new Map([
  ["indexpresse-business-inve", "europresse-gi-p"],
]);
const floatingFooterGap = 18;
const maxFloatingViewportOffset = 120;
const quickLaunchAutoScrollEdge = 72;
const quickLaunchAutoScrollAccelerationMs = 1600;
const quickLaunchAutoScrollMinSpeed = 1.5;
const quickLaunchAutoScrollMaxSpeed = 12;
let floatingToolsFrame = null;
let pressTitleCategoryLayoutFrame = null;
let pressPopularityNoteCloseTimer = null;
const editionSelectionStorageKey = "bnf-access:v2:edition-selections:v1";
const passFilterStorageKey = "bnf-access:v2:pass-filter:v1";
const remoteFilterStorageKey = "bnf-access:v2:remote-filter:v1";
const siteAccessStorageKey = "bnf-access:v2:site-access:v1";
const languageFilterStorageKey = "bnf-access:v2:language-filter:v1";
const themeStorageKey = "bnf-access:v2:theme:v1";
const colorBlindModeStorageKey = "bnf-access:v2:colorblind-mode:v1";
const bnfProxyLoginUrl = "https://bnf.idm.oclc.org/login";
const bnfPassPricingUrl = "https://www.bnf.fr/fr/tarifs-dacces-aux-bibliotheques-et-loffre-culturelle";
const bnfPassSubscriptionUrl = "https://inscriptionbilletterie.bnf.fr/";
const europresseEntrypointUrl = "https://nouveau.europresse.com/access/ip/default.aspx?un=D000067U_1";
const europresseProxyHost = "nouveau-europresse-com.bnf.idm.oclc.org";
const startupImageBlockingCount = 72;
const listRefreshAnimationClass = "is-entering";
const equivalentHostPrefixes = new Set(["www", "www2", "www3", "m", "mobile", "amp", "touch"]);
const siteAccessValues = new Set(["unknown", "yes", "no"]);
const themeValues = new Set(["auto", "light", "dark", "oled"]);
const themeCycle = ["light", "dark", "oled"];
const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
const pressTitleMediumLayoutQuery = window.matchMedia("(max-width: 980px)");
const pressTitleNarrowLayoutQuery = window.matchMedia("(max-width: 640px)");
const compactLanguageCodes = {
  enm: "ME",
  grc: "GR",
  mu: "MULTI",
  mul: "MULTI",
};
const languageLabelOverrides = {
  mu: "multilingue",
  mul: "multilingue",
};
const primaryLanguageCodes = ["fr", "en", "es", "de", "it"];
let converterResourcesCloseTimer = 0;
let deferredLinkSourcesPromise = null;
let progressiveRenderVersion = 0;
let pendingProgressiveRender = null;
let backgroundAssetWarmupVersion = 0;
let backgroundAssetWarmupTimer = 0;
let backgroundAssetAbortController = null;
const warmedAssetUrls = new Set();
const warmingAssetPromises = new Map();
const backgroundAssetFailures = new Map();
let indexedBackgroundAssetUrls = [];
const jsonFetchPromises = new Map();

const linkConverterRules = [
  {
    label: "Arrêt sur images",
    mappings: [
      {
        hosts: ["arretsurimages.net", "www.arretsurimages.net"],
        proxyHost: "www-arretsurimages-net.bnf.idm.oclc.org",
      },
    ],
    iconUrl: "./assets/logos/arretsurimages.svg",
    exampleUrl: "https://www.arretsurimages.net/chroniques/obsessions/silence-jancovici-sonne-le-glas",
    sessionStartUrl: "https://bnf.idm.oclc.org/login?url=http://www.arretsurimages.net/autologin.php",
  },
  {
    label: "Alternatives économiques",
    mappings: [
      {
        hosts: ["alternatives-economiques.fr", "www.alternatives-economiques.fr"],
        proxyHost: "www-alternatives-economiques-fr.bnf.idm.oclc.org",
      },
    ],
    iconUrl: "./assets/logos/altereco.svg",
    exampleUrl: "https://www.alternatives-economiques.fr/",
    sessionStartUrl: "https://bnf.idm.oclc.org/login?url=https://www.alternatives-economiques.fr",
  },
  {
    label: "Mediapart",
    mappings: [
      {
        hosts: ["mediapart.fr", "www.mediapart.fr"],
        proxyHost: "www-mediapart-fr.bnf.idm.oclc.org",
      },
      {
        hosts: ["blogs.mediapart.fr"],
        proxyHost: "blogs-mediapart-fr.bnf.idm.oclc.org",
      },
    ],
    iconUrl: "./assets/logos/mediapart.svg",
    exampleUrl: "https://www.mediapart.fr/",
    sessionStartUrl: "https://bnf.idm.oclc.org/login?url=http://www.mediapart.fr/licence",
  },
];

const europresseSearchConverterRule = {
  label: "Europresse",
  iconUrl: "./assets/logos/europresse.webp",
  exampleUrl: "https://www.lemonde.fr/",
};

const pressreaderSearchConverterRule = {
  label: "PressReader",
  iconUrl: "./assets/logos/pressreader.png",
  exampleUrl: "https://www.foreignaffairs.com/",
};

const indexpresseBusinessSearchConverterRule = {
  label: "IndexPresse Business",
  iconUrl: "./assets/logos/indexpresse.svg",
  exampleUrl: "https://www.strategies.fr/",
};

const europresseKnownDomainMappings = [
  { hosts: ["lemonde.fr", "www.lemonde.fr"], names: ["Le Monde"], searchSource: { id: "2121", label: "Monde, Le (site web)" } },
  { hosts: ["lefigaro.fr", "www.lefigaro.fr"], names: ["Le Figaro"], searchSource: { id: "2080", label: "Figaro, Le (site web)" } },
  { hosts: ["liberation.fr", "www.liberation.fr"], names: ["Libération"], searchSource: { id: "8343", label: "Libération (site web)" } },
  { hosts: ["la-croix.com", "www.la-croix.com"], names: ["La Croix"], searchSource: { id: "243", label: "Croix, La" } },
  { hosts: ["humanite.fr", "www.humanite.fr"], names: ["L'Humanité"], searchSource: { id: "242", label: "Humanité, L'" } },
  { hosts: ["ouest-france.fr", "www.ouest-france.fr"], names: ["Ouest-France"], searchSource: { id: "12303", label: "Ouest-France (site web)" } },
  { hosts: ["estrepublicain.fr", "www.estrepublicain.fr"], names: ["L'Est Républicain"], searchSource: { id: "2182", label: "Est Républicain, L'" } },
  { hosts: ["laprovence.com", "www.laprovence.com"], names: ["La Provence"] },
  { hosts: ["lamontagne.fr", "www.lamontagne.fr"], names: ["La Montagne"], searchSource: { id: "5404", label: "Montagne, La (site web)" } },
  { hosts: ["sudouest.fr", "www.sudouest.fr"], nameStartsWith: "Sud Ouest", searchSource: { id: "4488", label: "Sud Ouest (site web)" } },
  { hosts: ["nicematin.com", "www.nicematin.com"], names: ["Nice Matin"] },
  { hosts: ["varmatin.com", "www.varmatin.com"], names: ["Var Matin"], searchSource: { id: "4709", label: "Var-Matin (site web réf.)" } },
  { hosts: ["corsematin.com", "www.corsematin.com"], names: ["Corse Matin"], searchSource: { id: "21306", label: "Corse Matin (site web)" } },
  { hosts: ["lavoixdunord.fr", "www.lavoixdunord.fr"], names: ["La Voix du Nord"], searchSource: { id: "9586", label: "Voix du Nord, La (site web)" } },
  { hosts: ["leprogres.fr", "www.leprogres.fr"], names: ["Le Progrès (Lyon)"], searchSource: { id: "258", label: "Progrès, Le (Lyon)" } },
  { hosts: ["courrier-picard.fr", "www.courrier-picard.fr"], names: ["Courrier picard"], searchSource: { id: "25072", label: "Courrier picard" } },
  { hosts: ["charentelibre.fr", "www.charentelibre.fr"], names: ["Charente libre"], searchSource: { id: "2073", label: "Charente libre" } },
  { hosts: ["lardennais.fr", "www.lardennais.fr"], names: ["L'Ardennais"] },
  { hosts: ["berryrepublicain.fr", "www.leberry.fr", "www.berryrepublicain.fr"], names: ["Le Berry républicain"], searchSource: { id: "5402", label: "Berry républicain, Le (site web)" } },
  { hosts: ["lequipe.fr", "www.lequipe.fr"], names: ["L'Équipe"], searchSource: { id: "264", label: "Équipe, L'" } },
  { hosts: ["lexpress.fr", "www.lexpress.fr"], names: ["L'Express"], searchSource: { id: "9192", label: "Express, L' (site web)" } },
  { hosts: ["nouvelobs.com", "www.nouvelobs.com"], names: ["Le Nouvel Obs"], searchSource: { id: "19990", label: "Nouvel Obs, Le (site web)" } },
  { hosts: ["lepoint.fr", "www.lepoint.fr"], names: ["Le Point"], searchSource: { id: "2400", label: "Point, Le (site web)" } },
  { hosts: ["marianne.net", "www.marianne.net"], names: ["Marianne"] },
  { hosts: ["courrierinternational.com", "www.courrierinternational.com"], names: ["Courrier International"], searchSource: { id: "16934", label: "Courrier International (site web)" } },
  { hosts: ["telerama.fr", "www.telerama.fr"], names: ["Télérama"], searchSource: { id: "21724", label: "Télérama (site web)" } },
  { hosts: ["latribune.fr", "www.latribune.fr"], names: ["La Tribune (France)"], searchSource: { id: "1074", label: "Tribune, La (France) (site web)" } },
  { hosts: ["challenges.fr", "www.challenges.fr"], names: ["Challenges"], searchSource: { id: "20913", label: "Challenges (site web)" } },
];

const europresseSearchStopWords = new Set([
  "article",
  "articles",
  "actualite",
  "actualites",
  "afin",
  "ainsi",
  "alors",
  "apres",
  "aucun",
  "aucune",
  "aussi",
  "autre",
  "autres",
  "avant",
  "avec",
  "avoir",
  "chez",
  "comme",
  "dans",
  "deja",
  "des",
  "deux",
  "dont",
  "elle",
  "elles",
  "encore",
  "entre",
  "est",
  "et",
  "ete",
  "etre",
  "aux",
  "les",
  "leur",
  "leurs",
  "lorsqu",
  "lorsque",
  "mais",
  "meme",
  "par",
  "pas",
  "plus",
  "sans",
  "pour",
  "quoi",
  "que",
  "qui",
  "selon",
  "ses",
  "son",
  "sur",
  "tout",
  "toute",
  "toutes",
  "tous",
  "tres",
  "trois",
  "uns",
  "une",
  "vous",
  "your",
  "the",
  "and",
  "for",
  "from",
  "with",
]);

const europresseUrlPathNoise = new Set([
  "abonne",
  "abonnes",
  "actualite",
  "actualites",
  "article",
  "articles",
  "chronique",
  "chroniques",
  "dossier",
  "dossiers",
  "edition",
  "editions",
  "fr",
  "html",
  "journal",
  "journaux",
  "news",
  "politique",
  "premium",
]);

const pressreaderFrenchElisionRemainders = new Set([
  "accord",
  "actu",
  "actualite",
  "affaire",
  "afrique",
  "allemagne",
  "amerique",
  "amour",
  "angleterre",
  "argent",
  "art",
  "automne",
  "avenir",
  "aventure",
  "ecole",
  "economie",
  "education",
  "enfance",
  "enfant",
  "environnement",
  "equipe",
  "espagne",
  "etat",
  "ete",
  "europe",
  "habitude",
  "heritage",
  "heure",
  "histoire",
  "hiver",
  "homme",
  "hopital",
  "hotel",
  "humanite",
  "humilite",
  "inde",
  "innovation",
  "intelligence",
  "internet",
  "iran",
  "irak",
  "israel",
  "italie",
  "occasion",
  "oeuvre",
  "ombre",
  "ukraine",
  "urgence",
]);

const pressreaderFrenchContractedTerms = new Map([
  ["cest", "c'est"],
  ["dun", "d'un"],
  ["dune", "d'une"],
  ["jai", "j'ai"],
  ["jusqua", "jusqu'a"],
  ["lorsquil", "lorsqu'il"],
  ["lorsquelle", "lorsqu'elle"],
  ["puisquil", "puisqu'il"],
  ["puisquelle", "puisqu'elle"],
  ["quandil", "quand il"],
  ["quandelle", "quand elle"],
  ["quest", "qu'est"],
  ["quil", "qu'il"],
  ["quils", "qu'ils"],
  ["quelle", "qu'elle"],
  ["quelles", "qu'elles"],
  ["quon", "qu'on"],
]);

const pressreaderSearchStopWords = new Set([
  ...europresseSearchStopWords,
  "cela",
  "cet",
  "cette",
  "ces",
  "ceux",
  "celui",
  "celle",
  "celles",
  "celui",
  "cest",
  "contre",
  "depuis",
  "dire",
  "fait",
  "faut",
  "ils",
  "nos",
  "notre",
  "nous",
  "ont",
  "on",
  "peut",
  "peu",
  "sont",
  "sous",
  "vers",
  "vos",
]);

const accessLabels = {
  pass_lecture_culture: "Pass Lecture/Culture",
  pass_recherche_illimite: "Pass Recherche illimité",
  public: "Sans Pass BnF",
};

const accessModeLabels = {
  remote: "Accès distant",
  remote_conditional: "Accès distant sous condition",
  onsite: "Sur place uniquement",
  onsite_extended: "Accès sur site prolongé",
  mixed: "Accès mixte",
  free: "Accès libre",
};

const accessModeClasses = {
  remote: "remote",
  remote_conditional: "conditional",
  onsite: "onsite",
  onsite_extended: "onsite",
  mixed: "mixed",
  free: "free",
};

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
    loadProfileFilters();
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

async function fetchJson(url) {
  const requestUrl = new URL(url, window.location.href).href;
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
    jsonFetchPromises.delete(requestUrl);
    throw error;
  }
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

function scheduleDeferredStartupWork() {
  scheduleBackgroundAssetWarmup();
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
    return {};
  }
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

function setupPrivacyNotice() {
  if (readStoredValue(privacyNoticeDismissedKey) === "true") {
    privacyNotice.hidden = true;
    return;
  }

  dismissNotice.addEventListener("click", () => {
    privacyNotice.hidden = true;
    writeStoredValue(privacyNoticeDismissedKey, "true");
  });
}

function openSettingsModal() {
  clearLocalDataStatus.textContent = "";
  settingsModal.hidden = false;
  document.body.classList.add("has-modal");
  window.requestAnimationFrame(() => {
    settingsModal.classList.add("is-open");
    closeSettings.focus();
  });
}

function closeSettingsModal() {
  settingsModal.classList.remove("is-open");
  document.body.classList.remove("has-modal");
  window.setTimeout(() => {
    settingsModal.hidden = true;
  }, converterResourcesAnimationMs);
  openSettings.focus();
}

function showShareModal(mode = "export") {
  shareExport.hidden = mode !== "export";
  shareImport.hidden = mode !== "import";
  document.querySelector("#shareTitle").textContent = mode === "import"
    ? "Recevoir une configuration" : "Partager ma configuration";
  document.querySelector("#shareIntro").textContent = mode === "import"
    ? "Vérifiez le contenu avant de remplacer vos réglages locaux."
    : "Choisissez ce que le lien contiendra.";
  shareModal.hidden = false;
  document.body.classList.add("has-modal");
  window.requestAnimationFrame(() => {
    shareModal.classList.add("is-open");
    document.querySelector("#closeShare").focus();
  });
}

function closeShareModal() {
  shareModal.classList.remove("is-open");
  document.body.classList.remove("has-modal");
  window.setTimeout(() => { shareModal.hidden = true; }, converterResourcesAnimationMs);
  shareReturnFocus?.focus();
  pendingShareImport = null;
}

async function loadQrGenerator() {
  if (window.qrcode) return window.qrcode;
  if (!qrScriptPromise) {
    qrScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "./assets/js/vendor/qrcode-generator.js";
      script.onload = () => resolve(window.qrcode);
      script.onerror = () => reject(new Error("Impossible de charger le générateur de QR code."));
      document.head.append(script);
    });
  }
  return qrScriptPromise;
}

async function updateShareLink() {
  const generation = ++shareGeneration;
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
    if (generation !== shareGeneration) return;
    shareLink.value = url.href;
    try {
      const qrcode = await loadQrGenerator();
      if (generation !== shareGeneration) return;
      const qr = qrcode(0, "L");
      qr.addData(url.href);
      qr.make();
      shareQr.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 4 });
      shareStatus.textContent = qr.getModuleCount() > 85
        ? "QR dense : pour beaucoup de favoris, copier le lien peut être plus fiable."
        : "Le lien contient la configuration sélectionnée et ne passe par aucun serveur.";
    } catch {
      if (generation === shareGeneration) {
        shareStatus.textContent = "QR indisponible pour ce partage : le lien reste copiable.";
      }
    }
  } catch (error) {
    if (generation !== shareGeneration) return;
    shareStatus.textContent = error.message || "Impossible de créer ce partage.";
  }
}

function openShareExport(trigger) {
  shareReturnFocus = settingsModal.hidden ? trigger : openSettings;
  if (!settingsModal.hidden) closeSettingsModal();
  showShareModal();
  updateShareLink();
}

async function openIncomingShare(token) {
  shareReturnFocus = document.querySelector("#openSettings");
  showShareModal("import");
  pendingShareImport = null;
  confirmShareImport.disabled = true;
  shareImportStatus.textContent = "Lecture du lien…";
  try {
    if (state.pressLoadError) throw new Error("Le catalogue de presse doit être chargé pour recevoir ce partage.");
    const config = await decodeShareConfig(token);
    const layout = unpackFavoriteLayout(config.l);
    const requestedIds = listFavoriteResourceIds(layout);
    const knownIds = [...new Set(requestedIds.map(resolveCatalogResourceId))]
      .filter((id) => isCatalogVisible(getResourceById(id)));
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
    pendingShareImport = { layout: normalizedLayout, editions, profile };
    const missingCount = requestedIds.length - knownIds.length;
    shareImportSummary.textContent = `${knownIds.length} favori${knownIds.length > 1 ? "s" : ""}, ${normalizedLayout.rows.length} rangée${normalizedLayout.rows.length > 1 ? "s" : ""} et ${editions.size} édition${editions.size > 1 ? "s" : ""} sélectionnée${editions.size > 1 ? "s" : ""}.`;
    shareImportDetails.textContent = `${profile ? "Configuration complète : profil, langues, thème et accessibilité seront aussi remplacés." : "Favoris uniquement : votre profil et votre apparence seront conservés."}${missingCount ? ` ${missingCount} ressource(s) absente(s) du catalogue actuel seront ignorée(s).` : ""}`;
    shareImportStatus.textContent = "Rien n’a encore été modifié sur cet appareil.";
    confirmShareImport.disabled = false;
  } catch (error) {
    shareImportSummary.textContent = "Impossible de recevoir cette configuration.";
    shareImportDetails.textContent = "";
    shareImportStatus.textContent = error.message || "Lien invalide.";
  }
}

function applyIncomingShare() {
  if (!pendingShareImport) return;
  const { layout, editions, profile } = pendingShareImport;
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

async function clearLocalData() {
  const keys = [];
  let clearedRuntimeCaches = 0;

  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if ((key?.startsWith("bnf-access:") || key?.startsWith("bnf-access-press:"))
        && !key.includes(":catalog-editor:")) {
        keys.push(key);
      }
    }

    keys.forEach((key) => localStorage.removeItem(key));
    // An explicit reset must not restore the historical preferences on reload.
    localStorage.setItem("bnf-access:v2:migrated", "true");
    localStorage.setItem("bnf-access:v2:migration-version", "2");

    if ("caches" in window) {
      const cacheNames = await window.caches.keys();
      const appCacheNames = cacheNames.filter((name) => name.startsWith("bnf-access:v2:"));
      const deleted = await Promise.all(appCacheNames.map((name) => window.caches.delete(name)));
      clearedRuntimeCaches = deleted.filter(Boolean).length;
    }
  } catch {
    setClearLocalDataStatus("Impossible de supprimer les données locales depuis ce navigateur.", false);
    return;
  }

  setClearLocalDataStatus(
    keys.length > 0 || clearedRuntimeCaches > 0
      ? "Les préférences locales de BnF Access ont été supprimées."
      : "Aucune préférence locale BnF Access n'était enregistrée dans ce navigateur.",
    true,
  );
}

function setClearLocalDataStatus(message, ok) {
  clearLocalDataStatus.textContent = message;
  clearLocalDataStatus.dataset.status = ok ? "success" : "error";
}

function loadTheme() {
  const storedTheme = readStoredValue(themeStorageKey);
  state.theme = themeValues.has(storedTheme) ? storedTheme : "auto";
  applyTheme();
}

function saveTheme() {
  writeStoredValue(themeStorageKey, state.theme);
}

function applyTheme() {
  const resolvedTheme = state.theme === "auto" ? getAutomaticTheme() : state.theme;

  if (resolvedTheme === "light") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = resolvedTheme;
  }

  const browserThemeColors = {
    light: "#f7f7f4",
    dark: "#141619",
    oled: "#000000",
  };
  document.querySelector("#themeColor")?.setAttribute("content", browserThemeColors[resolvedTheme]);

  settingsTheme.value = state.theme;
  settingsTheme.closest("label")?.classList.toggle("has-selected-profile", state.theme !== "auto");
}

function getAutomaticTheme() {
  return darkThemeQuery.matches ? "oled" : "light";
}

function cycleTheme() {
  const currentTheme = state.theme === "auto" ? getAutomaticTheme() : state.theme;
  const currentIndex = themeCycle.indexOf(currentTheme);
  state.theme = themeCycle[(currentIndex + 1) % themeCycle.length];
  applyTheme();
  saveTheme();
}

function loadColorBlindMode() {
  state.colorBlindMode = readStoredValue(colorBlindModeStorageKey) === "true";
  applyColorBlindMode();
}

function saveColorBlindMode() {
  writeStoredValue(colorBlindModeStorageKey, String(state.colorBlindMode));
}

function applyColorBlindMode() {
  if (state.colorBlindMode) {
    document.documentElement.dataset.colorVision = "colorblind";
  } else {
    delete document.documentElement.dataset.colorVision;
  }

  settingsColorBlindMode.value = state.colorBlindMode ? "yes" : "no";
  settingsColorBlindMode.closest("label")?.classList.toggle("has-selected-profile", state.colorBlindMode);
}

function bindEvents() {
  setupEuropresseSessionHelpers();
  setupLinkConverter();
  for (const eventName of ["pointerdown", "touchstart", "wheel"]) {
    document.addEventListener(eventName, interruptBackgroundAssetWarmup, { passive: true });
  }
  pressPopularityNoteClose.addEventListener("click", closePressPopularityNote);

  searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    searchInput.blur();
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

  settingsTheme.addEventListener("change", (event) => {
    state.theme = event.target.value;
    applyTheme();
    saveTheme();
  });

  settingsColorBlindMode.addEventListener("change", (event) => {
    state.colorBlindMode = event.target.value === "yes";
    applyColorBlindMode();
    saveColorBlindMode();
  });

  darkThemeQuery.addEventListener("change", () => {
    if (state.theme === "auto") {
      applyTheme();
    }
  });

  pressTitleMediumLayoutQuery.addEventListener("change", syncPressTitleEditorialBranchExpansion);
  pressTitleNarrowLayoutQuery.addEventListener("change", syncPressTitleEditorialBranchExpansion);

  settingsPassFilter.addEventListener("change", (event) => {
    state.passFilter = event.target.value;
    passFilter.value = state.passFilter;
    syncProfileFilterState();
    saveProfileFilters();
    render();
  });

  settingsSiteAccess.addEventListener("change", (event) => {
    state.siteAccess = event.target.value;
    state.remoteFilter = getRemoteFilterFromSiteAccess(state.siteAccess);
    remoteFilter.value = state.remoteFilter;
    syncProfileFilterState();
    saveProfileFilters();
    render();
  });

  openSettings.addEventListener("click", openSettingsModal);
  closeSettings.addEventListener("click", closeSettingsModal);
  document.querySelector("#settingsShare").addEventListener("click", (event) => openShareExport(event.currentTarget));
  document.querySelector("#closeShare").addEventListener("click", closeShareModal);
  document.querySelector("#cancelShareImport").addEventListener("click", closeShareModal);
  confirmShareImport.addEventListener("click", applyIncomingShare);
  document.querySelectorAll('input[name="shareScope"]').forEach((input) => {
    input.addEventListener("change", updateShareLink);
  });
  document.querySelector("#copyShareLink").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(shareLink.value);
      shareStatus.textContent = "Lien copié.";
    } catch {
      shareLink.select();
      shareStatus.textContent = "Sélectionnez et copiez le lien.";
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
  clearLocalDataButton.addEventListener("click", clearLocalData);
  settingsModal.addEventListener("click", (event) => {
    if (event.target === settingsModal) {
      closeSettingsModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    interruptBackgroundAssetWarmup();
    const usesOptionOnly = event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;

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
      toggleLinkConverter();
      return;
    }

    if (event.key === "Escape" && !settingsModal.hidden) {
      closeSettingsModal();
    }

    if (event.key === "Escape" && !shareModal.hidden) {
      closeShareModal();
    }

    if (event.key === "Escape" && !pressPopularityNote.hidden) {
      closePressPopularityNote();
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

function toggleLinkConverter() {
  if (!linkConverter) return;
  const willShow = linkConverter.hidden;
  linkConverter.hidden = !willShow;

  if (willShow) {
    loadDeferredLinkSources();
    linkConverterInput?.focus({ preventScroll: true });
    linkConverter.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return;
  }

  window.clearTimeout(converterResourcesCloseTimer);
  converterResourcesModal?.classList.remove("is-open", "is-closing");
  if (converterResourcesModal) converterResourcesModal.hidden = true;
}

function setupLinkConverter() {
  if (!linkConverterForm || !linkConverterInput || !linkConverterFeedback || !linkConverterServices) {
    return;
  }

  setupConverterResourcesModal();

  linkConverterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const conversion = convertToBnfProxyUrl(linkConverterInput.value);

    if (!conversion) {
      linkConverterFeedback.textContent = `Lien non reconnu pour l’instant. Ressources prises en charge : ${getSupportedConverterLabels()}.`;
      linkConverterInput.focus();
      return;
    }

    const targetUrl = conversion.startUrl
      ? buildTransitionHref({
          title: conversion.label,
          action: "Ouverture du lien",
          start: conversion.startUrl,
          target: conversion.url,
        })
      : conversion.url;
    const openedWindow = conversion.startUrl
      ? openSessionBackedConvertedLink(conversion.startUrl, targetUrl)
      : openConvertedLink(targetUrl);

    renderLinkConverterFeedback({
      conversion,
      targetUrl,
      openedWindow,
      searchCopied: false,
    });

    if (!conversion.searchText && conversion.copyText) {
      copyTextToClipboard(conversion.copyText);
    }
  });
}

function setupConverterResourcesModal() {
  if (
    !linkConverterResourceListOpen ||
    !converterResourcesModal ||
    !converterResourcesClose ||
    !converterResourcesSearch ||
    !converterResourcesProviderFilter ||
    !converterResourcesCount ||
    !converterResourcesList
  ) {
    return;
  }

  linkConverterResourceListOpen.addEventListener("click", openConverterResourcesModal);
  converterResourcesClose.addEventListener("click", closeConverterResourcesModal);
  converterResourcesSearch.addEventListener("input", scheduleConverterResourceSearch);
  converterResourcesSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      renderConverterResourceListImmediately();
    }
  });
  converterResourcesProviderFilter.addEventListener("change", renderConverterResourceListImmediately);
  converterResourcesList.addEventListener("click", (event) => {
    if (!event.target.closest("[data-converter-show-more]")) return;
    state.converterResourceVisibleLimit += converterResourcePageSize;
    renderConverterResourceList();
  });
  converterResourcesModal.addEventListener("click", (event) => {
    if (event.target === converterResourcesModal) {
      closeConverterResourcesModal();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (!converterResourcesModal.hidden && event.key === "Escape") {
      closeConverterResourcesModal();
    }
  });
}

function openConverterResourcesModal() {
  window.clearTimeout(converterResourcesCloseTimer);
  converterResourcesModal.hidden = false;
  converterResourcesModal.classList.remove("is-closing");
  document.body.classList.add("has-modal");
  converterResourcesSearch.value = "";
  converterResourcesProviderFilter.value = "all";
  state.converterResourceVisibleLimit = converterResourcePageSize;
  renderConverterResourceList();
  loadDeferredLinkSources();
  window.requestAnimationFrame(() => {
    converterResourcesModal.classList.add("is-open");
  });
}

function closeConverterResourcesModal() {
  if (converterResourcesModal.hidden) {
    return;
  }

  converterResourcesModal.classList.remove("is-open");
  converterResourcesModal.classList.add("is-closing");
  document.body.classList.remove("has-modal");
  converterResourcesCloseTimer = window.setTimeout(() => {
    converterResourcesModal.hidden = true;
    converterResourcesModal.classList.remove("is-closing");
    linkConverterResourceListOpen.focus({ preventScroll: true });
  }, converterResourcesAnimationMs);
}

function renderConverterResourceList() {
  const query = normalize(converterResourcesSearch.value);
  const providerFilter = converterResourcesProviderFilter.value;
  const entries = getConverterResourceEntries();
  const publishedEntries = entries.filter((entry) => (
    entry.directoryVisible &&
    (providerFilter === "all" || entry.providerGroup === providerFilter) &&
    (!query || entry.searchText.includes(query))
  ));
  const secondaryMode = Boolean(query) && publishedEntries.length === 0;
  const matchingEntries = secondaryMode
    ? entries.filter((entry) => (
        entry.secondarySearchVisible
        && (providerFilter === "all" || entry.providerGroup === providerFilter)
        && entry.searchText.includes(query)
      ))
    : publishedEntries;
  const shownEntries = query
    ? matchingEntries.slice(0, state.converterResourceVisibleLimit)
    : matchingEntries;
  const remaining = matchingEntries.length - shownEntries.length;

  converterResourcesList.setAttribute("aria-busy", "false");
  converterResourcesCount.textContent = secondaryMode
    ? `${matchingEntries.length} correspondance${matchingEntries.length > 1 ? "s" : ""} possible${matchingEntries.length > 1 ? "s" : ""}`
    : `${matchingEntries.length} ressource${matchingEntries.length > 1 ? "s" : ""} vérifiée${matchingEntries.length > 1 ? "s" : ""}`;

  const secondaryIntroduction = secondaryMode && matchingEntries.length
    ? `<div class="converter-resources-secondary-intro">
        <strong>Aucune ressource vérifiée dans l’annuaire.</strong>
        <span>Le débrideur reconnaît néanmoins les correspondances possibles suivantes.</span>
      </div>`
    : "";
  const emptyMessage = query
    ? "Aucune ressource trouvée."
    : "Aucune ressource vérifiée dans cette sélection.";
  const showMoreButton = remaining > 0
    ? `<button class="converter-resources-show-more" type="button" data-converter-show-more>
        Afficher 50 résultats supplémentaires <span>${remaining} restant${remaining > 1 ? "s" : ""}</span>
      </button>`
    : "";

  converterResourcesList.innerHTML = matchingEntries.length
    ? `${secondaryIntroduction}${shownEntries.map((entry) => renderConverterResourceEntry(entry, secondaryMode)).join("")}${showMoreButton}`
    : `<p class="converter-resources-empty">${emptyMessage}</p>`;
  playListRefreshAnimation(converterResourcesList);
}

function scheduleConverterResourceSearch() {
  window.clearTimeout(state.converterResourceSearchTimer);
  state.converterResourceSearchRevision += 1;
  state.converterResourceVisibleLimit = converterResourcePageSize;
  const revision = state.converterResourceSearchRevision;

  if (!converterResourcesSearch.value.trim()) {
    renderConverterResourceList();
    return;
  }

  converterResourcesList.setAttribute("aria-busy", "true");
  converterResourcesCount.textContent = "Recherche…";
  state.converterResourceSearchTimer = window.setTimeout(() => {
    if (revision !== state.converterResourceSearchRevision) return;
    renderConverterResourceList();
  }, converterResourceSearchDelayMs);
}

function renderConverterResourceListImmediately() {
  window.clearTimeout(state.converterResourceSearchTimer);
  state.converterResourceSearchRevision += 1;
  state.converterResourceVisibleLimit = converterResourcePageSize;
  renderConverterResourceList();
}

function invalidateConverterResourceIndex() {
  state.converterResourceIndex = null;
}

function getConverterResourceEntries() {
  if (state.converterResourceIndex) return state.converterResourceIndex;
  const entries = [];

  for (const rule of getLinkConverterServices()) {
    const isSearchGateway = [
      europresseSearchConverterRule.label,
      indexpresseBusinessSearchConverterRule.label,
      pressreaderSearchConverterRule.label,
    ].includes(rule.label);
    entries.push({
      id: `direct:${rule.label}`,
      reviewId: ({
        "Alternatives économiques": "converter-link:direct:alternatives-economiques",
        "Arrêt sur images": "converter-link:direct:arret-sur-images",
        Mediapart: "converter-link:direct:mediapart",
        Europresse: "converter-link:direct:europresse",
        "IndexPresse Business": "converter-link:direct:indexpresse-business",
        PressReader: "converter-link:direct:pressreader",
      })[rule.label],
      name: rule.label,
      provider: isSearchGateway ? "Recherche générale" : "Accès direct",
      providerGroup: rule.label === pressreaderSearchConverterRule.label
        ? "pressreader"
        : rule.label === europresseSearchConverterRule.label
          ? "europresse"
          : rule.label === indexpresseBusinessSearchConverterRule.label
            ? "indexpresse"
            : "direct",
      iconUrl: rule.iconUrl || "",
      hosts: getHostsFromLinkRule(rule),
      searchLabel: "",
      sortName: rule.label,
    });
  }

  const seenEuropresseSources = new Set();
  const mappings = [...europresseKnownDomainMappings, ...state.europresseWebSources];

  for (const mapping of mappings) {
    const sourceId = mapping.searchSource?.id || "";
    const name = getEuropresseMappingDisplayName(mapping);
    const dedupeKey = sourceId ? `source:${sourceId}` : `name:${normalizeConverterLinkKey(name)}`;

    if (!name || seenEuropresseSources.has(dedupeKey)) {
      continue;
    }

    seenEuropresseSources.add(dedupeKey);

    const resource = findResourceForEuropresseMapping(mapping);
    entries.push({
      id: `europresse:${dedupeKey}`,
      reviewId: `converter-link:europresse:${dedupeKey}`,
      name,
      provider: "Europresse",
      providerGroup: "europresse",
      iconUrl: resource?.icon_url || europresseSearchConverterRule.iconUrl,
      hosts: mapping.hosts ?? [],
      websiteUrl: mapping.websiteUrl || "",
      searchLabel: mapping.searchSource?.label || "",
      sortName: name,
    });
  }

  const seenPressReaderSources = new Set();

  for (const source of state.pressreaderLinkSources) {
    const cids = source.cids ?? [];
    const dedupeKey = cids.length ? `cid:${cids.join("|")}` : `name:${normalizeConverterLinkKey(source.title)}`;

    if (!source.title || seenPressReaderSources.has(dedupeKey)) {
      continue;
    }

    seenPressReaderSources.add(dedupeKey);

    const resource = findResourceForPressReaderSource(source);
    entries.push({
      id: `pressreader:${dedupeKey}`,
      reviewId: `converter-link:pressreader:${dedupeKey}`,
      name: source.title,
      provider: "PressReader",
      providerGroup: "pressreader",
      iconUrl: resource?.icon_url || pressreaderSearchConverterRule.iconUrl,
      hosts: source.hosts ?? [],
      pathPrefixes: source.pathPrefixes ?? [],
      websiteUrl: source.websiteUrl || "",
      searchLabel: cids.length ? `CID ${cids.join(", ")}` : "",
      sortName: source.title,
    });
  }

  const seenIndexPresseSources = new Set();

  for (const source of state.indexpresseBusinessLinkSources) {
    const code = source.publicationCode || "";
    const dedupeKey = code ? `publication:${code}` : `name:${normalizeConverterLinkKey(source.title)}`;

    if (!source.title || seenIndexPresseSources.has(dedupeKey)) {
      continue;
    }

    seenIndexPresseSources.add(dedupeKey);

    const resource = findResourceForIndexPresseBusinessSource(source);
    entries.push({
      id: `indexpresse:${dedupeKey}`,
      reviewId: `converter-link:indexpresse:${dedupeKey}`,
      name: source.title,
      provider: "IndexPresse Business",
      providerGroup: "indexpresse",
      iconUrl: source.iconUrl || resource?.icon_url || indexpresseBusinessSearchConverterRule.iconUrl,
      hosts: source.hosts ?? [],
      pathPrefixes: source.pathPrefixes ?? [],
      websiteUrl: source.websiteUrl || "",
      searchLabel: code ? `Publication ${code}` : "",
      sortName: source.title,
    });
  }

  state.converterResourceIndex = entries
    .map((entry) => {
      const settings = state.linkDirectorySettings[entry.reviewId] ?? {};
      const displayName = String(settings.display_name || "").trim();
      const prepared = displayName
        ? { ...entry, name: displayName, sortName: displayName, searchAliases: [entry.name] }
        : entry;
      const reviewStatus = String(settings.review_status || "");
      const accessModel = String(settings.access_model || "");
      const directoryVisible = settings.directory_visible === true;
      return {
        ...prepared,
        reviewStatus,
        accessModel,
        directoryVisible,
        secondarySearchVisible: !directoryVisible
          && !["correction", "unavailable", "no_website", "ignore"].includes(reviewStatus),
        secondaryLabel: getConverterSecondaryAccessLabel(accessModel),
        searchText: normalize(`${prepared.name} ${prepared.searchAliases?.join(" ") || ""} ${prepared.provider} ${prepared.hosts.join(" ")} ${prepared.searchLabel}`),
      };
    })
    .sort((a, b) => a.sortName.localeCompare(b.sortName, "fr", { sensitivity: "base" }));
  return state.converterResourceIndex;
}

function getConverterSecondaryAccessLabel(accessModel) {
  if (accessModel === "free") return "Gratuit";
  if (["mixed", "paid"].includes(accessModel)) return "Payant";
  return "";
}

function renderConverterResourceEntry(entry, secondaryMode = false) {
  const websiteUrl = getConverterResourceWebsiteUrl(entry);
  const content = `
    <span class="converter-resource-logo">
      ${entry.iconUrl
        ? `<img src="${escapeAttribute(entry.iconUrl)}" alt="" loading="lazy" decoding="async">`
        : `<span aria-hidden="true">${escapeHtml(getFallbackLabel({ name: entry.name }))}</span>`}
    </span>
    <span class="converter-resource-text">
      <strong>${escapeHtml(entry.name)}</strong>
      <span class="converter-resource-meta">
        <small>${escapeHtml(entry.provider)}</small>
        ${secondaryMode && entry.secondaryLabel
          ? `<span class="converter-resource-status" data-status="${entry.secondaryLabel === "Gratuit" ? "free" : "paid"}">${escapeHtml(entry.secondaryLabel)}</span>`
          : ""}
      </span>
    </span>
  `;

  if (!websiteUrl) {
    return `<article class="converter-resource-item">${content}</article>`;
  }

  const label = secondaryMode
    ? `Ouvrir le site proposé de ${entry.name}`
    : `Ouvrir le site officiel de ${entry.name}`;
  return `
    <a class="converter-resource-item" href="${escapeAttribute(websiteUrl)}" target="_blank" rel="noreferrer" aria-label="${escapeAttribute(label)}" title="${escapeAttribute(label)}">
      ${content}
    </a>
  `;
}

function getConverterResourceWebsiteUrl(entry) {
  if (entry.websiteUrl) {
    try {
      const url = new URL(entry.websiteUrl);
      if (["http:", "https:"].includes(url.protocol) && url.hostname.includes(".")) {
        return url.href;
      }
    } catch {
      // Fall back to the converter matching rules below.
    }
  }

  const host = getPrimaryConverterResourceHost(entry.hosts);

  if (!host) {
    return "";
  }

  try {
    const candidate = /^https?:\/\//i.test(host) ? host : `https://${host}`;
    const url = new URL(candidate);

    if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".")) {
      return "";
    }

    const pathPrefix = getPrimaryConverterResourcePathPrefix(entry.pathPrefixes);
    if (pathPrefix) {
      url.pathname = pathPrefix;
    }

    return url.href;
  } catch {
    return "";
  }
}

function getPrimaryConverterResourcePathPrefix(pathPrefixes) {
  if (!Array.isArray(pathPrefixes)) {
    return "";
  }

  for (const pathPrefix of pathPrefixes) {
    const value = normalizePathPrefix(pathPrefix);

    if (value && value !== "/") {
      return value;
    }
  }

  return "";
}

function getPrimaryConverterResourceHost(hosts) {
  if (!Array.isArray(hosts)) {
    return "";
  }

  for (const host of hosts) {
    const value = String(host ?? "").trim().replace(/^\*\./, "");

    if (value) {
      return value;
    }
  }

  return "";
}

function getHostsFromLinkRule(rule) {
  return (rule.mappings ?? []).flatMap((mapping) => mapping.hosts ?? []);
}

function getEuropresseMappingDisplayName(mapping) {
  if (mapping.displayLabel) {
    return mapping.displayLabel;
  }

  if (mapping.names?.length) {
    return mapping.names[0];
  }

  return mapping.searchSource?.label || "";
}

function findResourceForEuropresseMapping(mapping) {
  const resources = state.resources.filter((resource) => resource.source === "europresse_pdf");
  const sourceCodes = new Set(mapping.sourceCodes ?? []);

  if (sourceCodes.size) {
    const bySourceCode = resources.find((resource) => sourceCodes.has(resource.source_code));

    if (bySourceCode) {
      return bySourceCode;
    }
  }

  if (mapping.searchSource?.id) {
    const bySearchSource = resources.find((resource) => resource.europresse_search_source?.id === mapping.searchSource.id);

    if (bySearchSource) {
      return bySearchSource;
    }
  }

  for (const name of mapping.names ?? []) {
    const byName = resources.find((resource) => normalizeComparableTitle(resource.name) === normalizeComparableTitle(name));

    if (byName) {
      return byName;
    }
  }

  return null;
}

function findResourceForPressReaderSource(source) {
  const cids = new Set(source.cids ?? []);
  const resourceIds = new Set(source.resourceIds ?? []);
  return state.resources.find((resource) => (
    resource.source === "pressreader" &&
    (
      cids.has(resource.pressreader_cid) ||
      resourceIds.has(resource.id)
    )
  )) || null;
}

function findResourceForIndexPresseBusinessSource(source) {
  const publicationCode = source.publicationCode || "";
  return state.resources.find((resource) => (
    resource.source === "indexpresse_business" &&
    resource.indexpresse_publication_code === publicationCode
  )) || null;
}

function renderLinkConverterFeedback({ conversion, targetUrl, openedWindow }) {
  if (conversion.provider === "source_choice") {
    linkConverterFeedback.innerHTML = `
      Plusieurs pistes ouvertes pour ${escapeHtml(conversion.sourceLabel || conversion.label)}.
      IndexPresse peut manquer certains articles ; PressReader fonctionne surtout sur site BnF.
      ${openedWindow ? "" : `Si l’ouverture est bloquée par le navigateur, <a href="${escapeAttribute(targetUrl)}" target="_blank" rel="noreferrer">ouvrir la page de choix</a>.`}
    `;
    return;
  }

  if (conversion.provider === "pressreader") {
    linkConverterFeedback.innerHTML = `
      Préparation PressReader ouverte pour ${escapeHtml(conversion.sourceLabel || conversion.label)}.
      <a href="${escapeAttribute(targetUrl)}" target="_blank" rel="noreferrer">Ouvrir la préparation PressReader</a>.
    `;
    return;
  }

  if (conversion.provider === "indexpresse_business") {
    linkConverterFeedback.innerHTML = `
      Recherche IndexPresse Business ouverte pour ${escapeHtml(conversion.sourceLabel || conversion.label)}.
      IndexPresse peut proposer une notice ou un texte intégral, mais son index n’est pas exhaustif.
      ${openedWindow ? "" : `Si l’ouverture est bloquée par le navigateur, <a href="${escapeAttribute(targetUrl)}" target="_blank" rel="noreferrer">ouvrir la recherche IndexPresse</a>.`}
    `;
    return;
  }

  if (conversion.searchText) {
    const displayedSearchText = conversion.copyText || humanizeSearchQuery(conversion.searchText);
    linkConverterFeedback.innerHTML = `
      Onglet de préparation ouvert. Vérifiez la recherche, puis cliquez sur “Copier la recherche et ouvrir Europresse”.
      <span class="converter-query">${escapeHtml(displayedSearchText)}</span>
      ${openedWindow ? "" : `Si l’ouverture est bloquée par le navigateur, <a href="${escapeAttribute(targetUrl)}" target="_blank" rel="noreferrer">ouvrir la préparation Europresse</a>.`}
    `;
    return;
  }

  linkConverterFeedback.innerHTML = `
    Ouverture via la BnF : ${escapeHtml(conversion.label)}.
    Si l’ouverture est bloquée par le navigateur,
    <a href="${escapeAttribute(targetUrl)}" target="_blank" rel="noreferrer">ouvrir le lien converti</a>.
  `;

  if (!openedWindow) {
    linkConverterFeedback.innerHTML = `
      Si l’ouverture est bloquée par le navigateur,
      <a href="${escapeAttribute(targetUrl)}" target="_blank" rel="noreferrer">ouvrir le lien converti</a>.
    `;
  }
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Some browsers reject Clipboard API on local-network HTTP pages.
    }
  }

  return copyTextWithSelection(text);
}

function copyTextWithSelection(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";

  document.body.append(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

function humanizeSearchQuery(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function openSessionBackedConvertedLink(startUrl, transitionHref) {
  const transitionTab = openNewTab(withTransitionParams(transitionHref, {
    helper: "1",
  }));

  if (!transitionTab) {
    return null;
  }

  window.location.assign(startUrl);

  try {
    transitionTab.focus();
  } catch {
    // Focus is only a convenience; the navigation flow does not depend on it.
  }

  return transitionTab;
}

function openConvertedLink(url) {
  const openedWindow = window.open("about:blank", "_blank");

  if (!openedWindow) {
    return null;
  }

  try {
    openedWindow.opener = null;
  } catch {
    // The tab is already open; clearing opener is a best-effort privacy guard.
  }

  openedWindow.location.href = url;
  return openedWindow;
}

function renderLinkConverterServices() {
  linkConverterServices.innerHTML = getLinkConverterServices()
    .map((rule) => `
      <button
        class="link-converter-service"
        type="button"
        title="${escapeAttribute(rule.label)}"
        aria-label="${escapeAttribute(rule.label)}"
        data-example-url="${escapeAttribute(rule.exampleUrl ?? "")}"
      >
        ${rule.iconUrl
          ? `<img src="${escapeAttribute(rule.iconUrl)}" alt="" aria-hidden="true" loading="eager" decoding="async" fetchpriority="high">`
          : `<span aria-hidden="true">${escapeHtml(getFallbackLabel({ name: rule.label }))}</span>`}
      </button>
    `)
    .join("");

  linkConverterServices.querySelectorAll(".link-converter-service").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.exampleUrl) {
        linkConverterInput.value = button.dataset.exampleUrl;
      }

      linkConverterInput.focus();
      linkConverterInput.select();
    });
  });
}

function convertToBnfProxyUrl(rawValue) {
  const url = parseConverterUrl(rawValue);

  if (!url) {
    return null;
  }

  for (const rule of linkConverterRules) {
    for (const mapping of rule.mappings) {
      if (url.hostname === mapping.proxyHost) {
        return {
          label: rule.label,
          url: url.href,
          startUrl: rule.sessionStartUrl,
        };
      }

      if (hostMatchesAny(url.hostname, mapping.hosts)) {
        const convertedUrl = new URL(url.href);
        convertedUrl.protocol = "https:";
        convertedUrl.hostname = mapping.proxyHost;
        return {
          label: rule.label,
          url: convertedUrl.href,
          startUrl: rule.sessionStartUrl,
        };
      }
    }
  }

  const europresseConversion = buildEuropresseSearchConversion(url);
  if (europresseConversion) {
    return europresseConversion;
  }

  const indexpresseConversion = buildIndexPresseBusinessSearchConversion(url);
  const pressreaderConversion = buildPressReaderSearchConversion(url);

  if (indexpresseConversion && pressreaderConversion) {
    return buildSourceChoiceConversion({
      originalUrl: url.href,
      indexpresseConversion,
      pressreaderConversion,
    });
  }

  return indexpresseConversion || pressreaderConversion;
}

function getLinkConverterServices() {
  return [
    ...linkConverterRules,
    europresseSearchConverterRule,
    indexpresseBusinessSearchConverterRule,
    pressreaderSearchConverterRule,
  ];
}

function buildTransitionHref({ title, action, start, target }) {
  const params = new URLSearchParams({
    title,
    action,
    start,
    target,
  });

  return `./pages/transition.html?${params.toString()}`;
}

function getSupportedConverterLabels() {
  return getLinkConverterServices().map((rule) => rule.label).join(", ");
}

function parseConverterUrl(rawValue) {
  const value = String(rawValue ?? "").trim();

  if (!value) {
    return null;
  }

  const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(value)
    ? value
    : `https://${value}`;

  try {
    const url = new URL(withProtocol);
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

function hostMatchesAny(hostname, knownHosts = []) {
  const comparableHost = getEquivalentComparableHost(hostname);
  return knownHosts.some((knownHost) => getEquivalentComparableHost(knownHost) === comparableHost);
}

function getEquivalentComparableHost(hostname) {
  const parts = String(hostname ?? "")
    .toLowerCase()
    .trim()
    .replace(/\.$/, "")
    .split(".")
    .filter(Boolean);

  while (parts.length > 2 && equivalentHostPrefixes.has(parts[0])) {
    parts.shift();
  }

  return parts.join(".");
}

function buildEuropresseSearchConversion(url) {
  if (isInternalUrl(url) || isKnownNonEuropresseProviderUrl(url)) {
    return null;
  }

  if (url.hostname === europresseProxyHost || url.hostname === "nouveau.europresse.com") {
    return {
      label: "Europresse",
      url: buildEuropresseDeepLink(`${url.pathname}${url.search}${url.hash}`),
    };
  }

  const titleQuery = buildEuropresseTitleQueryFromUrl(url);
  const keywordQuery = buildEuropresseKeywordQueryFromUrl(url);
  const query = titleQuery || keywordQuery;

  if (!query) {
    return null;
  }

  const sourceMatch = findEuropresseSourceForUrl(url);

  if (!sourceMatch.matches.length && !sourceMatch.searchSource?.id && !sourceMatch.sourceLabel) {
    return null;
  }

  const sourceLabel = getEuropresseSourceLabel(sourceMatch);
  const matchedSourceCode = sourceMatch.matches.length === 1
    ? sourceMatch.matches[0].source_code
    : sourceMatch.sourceCodes?.length === 1
      ? sourceMatch.sourceCodes[0]
      : "";

  return {
    label: sourceLabel ? `Recherche Europresse - ${sourceLabel}` : "Recherche Europresse",
    url: buildEuropresseSearchLauncherUrl({
      query,
      sourceLabel,
      searchSource: sourceMatch.searchSource,
      sourceCode: matchedSourceCode,
      sourceCount: sourceMatch.matches.length || (sourceMatch.searchSource?.id ? 1 : 0),
      confidence: sourceMatch.confidence,
      keywordQuery,
      originalUrl: url.href,
    }),
    searchText: query,
    copyText: buildEuropresseMachineQuery(query),
  };
}

function buildPressReaderSearchConversion(url) {
  if (isInternalUrl(url)) {
    return null;
  }

  const source = findPressReaderSourceForUrl(url);

  if (!source) {
    return null;
  }

  const queryOptions = buildPressReaderQueryOptionsFromUrl(url, source);
  const query = queryOptions[0] || source.title;
  const keywordQuery = queryOptions.find((option) => option !== query) || "";
  const resource = findResourceForPressReaderSource(source);

  if (!query || !(source.cids ?? []).length) {
    return null;
  }

  return {
    label: `Recherche PressReader - ${source.title}`,
    provider: "pressreader",
    sourceLabel: source.title,
    iconUrl: resource?.icon_url || source.iconUrl || pressreaderSearchConverterRule.iconUrl,
    url: buildPressReaderSearchLauncherUrl({
      query,
      source,
      keywordQuery,
      queryOptions,
      originalUrl: url.href,
    }),
    searchText: query,
  };
}

function buildIndexPresseBusinessSearchConversion(url) {
  if (isInternalUrl(url)) {
    return null;
  }

  if (url.hostname === "business.indexpresse.fr") {
    return {
      label: "IndexPresse Business",
      provider: "indexpresse_business",
      sourceLabel: "IndexPresse Business",
      url: url.href,
      startUrl: getIndexPresseBusinessSessionStartUrl(),
    };
  }

  const source = findIndexPresseBusinessSourceForUrl(url);

  if (!source?.publicationCode) {
    return null;
  }

  const query = buildIndexPresseBusinessQueryFromUrl(url);
  const resource = findResourceForIndexPresseBusinessSource(source);

  return {
    label: `Recherche IndexPresse Business - ${source.title}`,
    provider: "indexpresse_business",
    sourceLabel: source.title,
    iconUrl: source.iconUrl || resource?.icon_url || indexpresseBusinessSearchConverterRule.iconUrl,
    url: buildIndexPresseBusinessSearchUrl({
      query,
      source,
    }),
    startUrl: getIndexPresseBusinessSessionStartUrl(),
    searchText: query,
  };
}

function buildSourceChoiceConversion({ originalUrl, indexpresseConversion, pressreaderConversion }) {
  const sourceLabel = getSharedSourceChoiceLabel(indexpresseConversion, pressreaderConversion);
  const launcherUrl = new URL("./pages/source-choice.html", window.location.href);
  const indexpresseUrl = buildTransitionHref({
    title: indexpresseConversion.label,
    action: "Recherche IndexPresse Business",
    start: indexpresseConversion.startUrl,
    target: indexpresseConversion.url,
  });

  launcherUrl.searchParams.set("title", sourceLabel);
  launcherUrl.searchParams.set("from", originalUrl);
  launcherUrl.searchParams.set("indexpresseUrl", new URL(indexpresseUrl, window.location.href).href);
  launcherUrl.searchParams.set("indexpresseSource", indexpresseConversion.sourceLabel || "IndexPresse Business");
  if (indexpresseConversion.iconUrl) {
    launcherUrl.searchParams.set("indexpresseIcon", new URL(indexpresseConversion.iconUrl, window.location.href).href);
  }
  launcherUrl.searchParams.set("pressreaderUrl", pressreaderConversion.url);
  launcherUrl.searchParams.set("pressreaderSource", pressreaderConversion.sourceLabel || "PressReader");
  if (pressreaderConversion.iconUrl) {
    launcherUrl.searchParams.set("pressreaderIcon", new URL(pressreaderConversion.iconUrl, window.location.href).href);
  }

  return {
    label: `Choix de recherche - ${sourceLabel}`,
    provider: "source_choice",
    sourceLabel,
    url: launcherUrl.href,
  };
}

function getSharedSourceChoiceLabel(indexpresseConversion, pressreaderConversion) {
  const labels = [
    indexpresseConversion.sourceLabel,
    pressreaderConversion.sourceLabel,
  ].filter(Boolean);
  const seenLabels = new Set();
  const uniqueLabels = labels
    .map((label) => label.trim())
    .filter((label) => {
      const key = normalizeComparableTitle(label);
      if (!label || seenLabels.has(key)) {
        return false;
      }
      seenLabels.add(key);
      return true;
    });
  return uniqueLabels.length ? uniqueLabels.join(" / ") : "ce titre";
}

function findPressReaderSourceForUrl(url) {
  const matchingSources = state.pressreaderLinkSources
    .filter((source) => pressReaderSourceMatchesUrl(source, url))
    .sort((a, b) => getLongestPathPrefixLength(b) - getLongestPathPrefixLength(a));

  return matchingSources[0] || null;
}

function findIndexPresseBusinessSourceForUrl(url) {
  const matchingSources = state.indexpresseBusinessLinkSources
    .filter((source) => indexPresseBusinessSourceMatchesUrl(source, url))
    .sort((a, b) => getLongestPathPrefixLength(b) - getLongestPathPrefixLength(a));

  return matchingSources[0] || null;
}

function pressReaderSourceMatchesUrl(source, url) {
  if (!hostMatchesAny(url.hostname, source.hosts ?? [])) {
    return false;
  }

  const prefixes = getPressReaderPathPrefixes(source);
  if (!prefixes.length) {
    return true;
  }

  return prefixes.some((prefix) => pathMatchesPrefix(url.pathname, prefix));
}

function indexPresseBusinessSourceMatchesUrl(source, url) {
  if (!hostMatchesAny(url.hostname, source.hosts ?? [])) {
    return false;
  }

  const prefixes = getPressReaderPathPrefixes(source);
  if (!prefixes.length) {
    return true;
  }

  return prefixes.some((prefix) => pathMatchesPrefix(url.pathname, prefix));
}

function getPressReaderPathPrefixes(source) {
  return (source.pathPrefixes ?? [])
    .map((prefix) => normalizePathPrefix(prefix))
    .filter((prefix) => prefix && prefix !== "/");
}

function getLongestPathPrefixLength(source) {
  return Math.max(0, ...getPressReaderPathPrefixes(source).map((prefix) => prefix.length));
}

function pathMatchesPrefix(pathname, prefix) {
  const normalizedPathname = normalizePathPrefix(pathname);
  const normalizedPrefix = normalizePathPrefix(prefix);

  if (!normalizedPathname || !normalizedPrefix || normalizedPrefix === "/") {
    return false;
  }

  return normalizedPathname === normalizedPrefix || normalizedPathname.startsWith(`${normalizedPrefix}/`);
}

function normalizePathPrefix(value) {
  const path = `/${String(value ?? "").trim().replace(/^\/+/, "")}`;
  return path.replace(/\/+$/, "") || "/";
}

function buildPressReaderSearchLauncherUrl({ query, source, keywordQuery, queryOptions, originalUrl }) {
  const launcherUrl = new URL("./pages/pressreader-search.html", window.location.href);
  launcherUrl.searchParams.set("q", query);
  launcherUrl.searchParams.set("cids", (source.cids ?? []).join(","));
  launcherUrl.searchParams.set("source", source.title);
  launcherUrl.searchParams.set("from", originalUrl);

  if (keywordQuery && keywordQuery !== query) {
    launcherUrl.searchParams.set("keywords", keywordQuery);
  }

  if ((queryOptions ?? []).length > 1) {
    launcherUrl.searchParams.set("queries", JSON.stringify(queryOptions));
  }

  return launcherUrl.href;
}

function buildEuropresseSearchLauncherUrl({ query, sourceLabel, searchSource, sourceCode, sourceCount, confidence, keywordQuery, originalUrl }) {
  const launcherUrl = new URL("./pages/europresse-search.html", window.location.href);
  launcherUrl.searchParams.set("q", query);
  launcherUrl.searchParams.set("from", originalUrl);

  if (keywordQuery && keywordQuery !== query) {
    launcherUrl.searchParams.set("keywords", keywordQuery);
  }

  if (sourceLabel) {
    launcherUrl.searchParams.set("source", sourceLabel);
  }

  if (sourceCode) {
    launcherUrl.searchParams.set("sourceCode", sourceCode);
  }

  if (searchSource?.id) {
    launcherUrl.searchParams.set("criteriaId", searchSource.id);
  }

  if (searchSource?.label) {
    launcherUrl.searchParams.set("criteriaLabel", searchSource.label);
  }

  if (sourceCount) {
    launcherUrl.searchParams.set("sourceCount", String(sourceCount));
  }

  if (confidence) {
    launcherUrl.searchParams.set("confidence", confidence);
  }

  return launcherUrl.href;
}

function buildIndexPresseBusinessQueryFromUrl(url) {
  return buildEuropresseTitleQueryFromUrl(url) ||
    buildEuropresseKeywordQueryFromUrl(url) ||
    url.href;
}

function buildIndexPresseBusinessSearchUrl({ query, source }) {
  const targetUrl = new URL("/results", "https://business.indexpresse.fr");

  for (const [key, value] of Object.entries({
    query,
    publishedYearFrom: "",
    publishedYearTo: "",
    periodRange: "",
    publication: source.publicationCode,
    publicationMode: "AND",
    company: "",
    companyMode: "AND",
    theme: "",
    themeMode: "AND",
    country: "",
    countryMode: "OR",
  })) {
    targetUrl.searchParams.set(key, value);
  }

  return targetUrl.href;
}

function buildEuropresseMachineQuery(value) {
  const cleanQuery = String(value ?? "").replace(/\s+/g, " ").trim();
  return cleanQuery ? `TIT_HEAD="${cleanQuery.replace(/"/g, " ")}"` : "";
}

function getEuropresseSessionStartUrl() {
  const loginUrl = new URL(bnfProxyLoginUrl);
  loginUrl.searchParams.set("qurl", europresseEntrypointUrl);
  return loginUrl.href;
}

function getIndexPresseBusinessSessionStartUrl() {
  const loginUrl = new URL(bnfProxyLoginUrl);
  loginUrl.searchParams.set("url", "https://indexpresse.vercel.app/fr");
  return loginUrl.href;
}

function buildPressReaderQueryOptionsFromUrl(url, source) {
  const titleQuery = buildEuropresseTitleQueryFromUrl(url);
  const naturalTitleQuery = normalizeFrenchArticleQuery(titleQuery);
  const keywordQuery = buildPressReaderKeywordQueryFromUrl(url, naturalTitleQuery || titleQuery);
  const articleQueries = uniqueSearchQueries([
    keywordQuery,
    naturalTitleQuery,
    titleQuery,
  ]);

  return articleQueries.length ? articleQueries : uniqueSearchQueries([source?.title]);
}

function buildPressReaderKeywordQueryFromUrl(url, preferredTitle) {
  const terms = preferredTitle
    ? tokenizePressReaderQuery(preferredTitle)
    : getEuropresseArticleTerms(url);
  const usefulTerms = [];

  for (const term of terms) {
    if (term.length < 3 || pressreaderSearchStopWords.has(term)) {
      continue;
    }

    if (/^\d+$/.test(term)) {
      continue;
    }

    if (!usefulTerms.includes(term)) {
      usefulTerms.push(term);
    }

    if (usefulTerms.length >= 12) {
      break;
    }
  }

  if (usefulTerms.length >= 3) {
    return usefulTerms.join(" ");
  }

  return "";
}

function normalizeFrenchArticleQuery(value) {
  return expandFrenchArticleElisions(cleanFrenchArticleSearchText(value))
    .replace(/\s+/g, " ")
    .trim();
}

function cleanFrenchArticleSearchText(value) {
  return String(value ?? "")
    .replace(/[\u00ad\u200b-\u200d\u2060]/g, "")
    .replace(/[’‘`´]/g, "'")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function expandFrenchArticleElisions(value) {
  return String(value ?? "")
    .split(/\s+/)
    .map(expandFrenchArticleElisionTerm)
    .join(" ");
}

function expandFrenchArticleElisionTerm(term) {
  const cleanTerm = term.toLowerCase();
  const contracted = pressreaderFrenchContractedTerms.get(cleanTerm);

  if (contracted) {
    return contracted;
  }

  const explicitMatch = cleanTerm.match(/^([cdjlmnst])'(.+)$/i);

  if (explicitMatch) {
    return `${explicitMatch[1]}'${explicitMatch[2]}`;
  }

  const quMatch = cleanTerm.match(/^qu([aeiouyh].{1,})$/i);

  if (quMatch && pressreaderFrenchElisionRemainders.has(quMatch[1])) {
    return `qu'${quMatch[1]}`;
  }

  const singleLetterMatch = cleanTerm.match(/^([cdjlmnst])([aeiouyh].{2,})$/i);

  if (singleLetterMatch && pressreaderFrenchElisionRemainders.has(singleLetterMatch[2])) {
    return `${singleLetterMatch[1]}'${singleLetterMatch[2]}`;
  }

  return term;
}

function tokenizePressReaderQuery(value) {
  return normalizePressReaderComparableText(value).match(/[a-z0-9]+/g) ?? [];
}

function normalizePressReaderComparableText(value) {
  return normalizeFrenchArticleQuery(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function uniqueSearchQueries(values) {
  const queries = [];
  const seen = new Set();

  for (const value of values) {
    const query = String(value ?? "").replace(/\s+/g, " ").trim();
    const comparable = normalizePressReaderComparableText(query);

    if (!query || !comparable || seen.has(comparable)) {
      continue;
    }

    queries.push(query);
    seen.add(comparable);
  }

  return queries;
}

function buildEuropresseTitleQueryFromUrl(url) {
  const title = getEuropresseArticleTitleFromUrl(url);
  return title || "";
}

function buildEuropresseKeywordQueryFromUrl(url) {
  const terms = getEuropresseArticleTerms(url);
  const usefulTerms = [];

  for (const term of terms) {
    if (term.length < 3 || europresseSearchStopWords.has(term)) {
      continue;
    }

    if (/^\d+$/.test(term)) {
      continue;
    }

    if (!usefulTerms.includes(term)) {
      usefulTerms.push(term);
    }

    if (usefulTerms.length >= 14) {
      break;
    }
  }

  return usefulTerms.join(" ");
}

function getEuropresseArticleTitleFromUrl(url) {
  const pathParts = decodeURIComponent(url.pathname)
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
  const candidateParts = pathParts
    .slice()
    .reverse()
    .map(cleanEuropresseArticleSlug)
    .filter(Boolean);

  for (const candidate of candidateParts) {
    const terms = tokenizeEuropressePathPart(candidate);
    const meaningfulTerms = terms.filter((term) => (
      term.length >= 3 &&
      !/^\d+$/.test(term) &&
      !europresseSearchStopWords.has(term) &&
      !europresseUrlPathNoise.has(term)
    ));

    if (meaningfulTerms.length >= 3) {
      return candidate;
    }
  }

  return "";
}

function cleanEuropresseArticleSlug(value) {
  const cleanSlug = String(value ?? "")
    .replace(/\.[a-z0-9]{2,5}$/i, "")
    .replace(/[_-]\d{4,}(?:[_-]\d+)*$/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalizeFrenchArticleQuery(cleanSlug);
}

function getEuropresseArticleTerms(url) {
  const pathParts = decodeURIComponent(url.pathname)
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
  const candidateParts = pathParts
    .slice()
    .reverse()
    .map((part) => part.replace(/\.[a-z0-9]{2,5}$/i, ""))
    .filter((part) => part && !/^\d+$/.test(part));

  for (const candidate of candidateParts) {
    const terms = tokenizeEuropressePathPart(candidate);
    const meaningfulTerms = terms.filter((term) => (
      term.length >= 3 &&
      !/^\d+$/.test(term) &&
      !europresseSearchStopWords.has(term) &&
      !europresseUrlPathNoise.has(term)
    ));

    if (meaningfulTerms.length >= 3) {
      return terms;
    }
  }

  return tokenizeEuropressePathPart(pathParts.join(" "));
}

function tokenizeEuropressePathPart(value) {
  return normalizeFrenchArticleQuery(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .match(/[a-z0-9]+/g) ?? [];
}

function findEuropresseSourceForUrl(url) {
  const resources = state.resources.filter((resource) => resource.source === "europresse_pdf");
  const knownMapping = europresseKnownDomainMappings.find((mapping) => hostMatchesAny(url.hostname, mapping.hosts));

  if (knownMapping) {
    const sourceMatch = buildEuropresseSourceMatch(resources, knownMapping, "known-domain");

    if (sourceMatch) {
      return sourceMatch;
    }
  }

  const webSourceMapping = state.europresseWebSources.find((mapping) => hostMatchesAny(url.hostname, mapping.hosts));

  if (webSourceMapping) {
    const sourceMatch = buildEuropresseSourceMatch(resources, webSourceMapping, "verified-web-source");

    if (sourceMatch) {
      return sourceMatch;
    }
  }

  const inferredMatches = inferEuropresseResourcesFromHost(resources, url.hostname);
  return {
    matches: inferredMatches,
    searchSource: getEuropresseSearchSourceFromMatches(inferredMatches),
    confidence: inferredMatches.length === 1 ? "inferred-domain" : inferredMatches.length > 1 ? "inferred-domain-multiple" : "generic",
  };
}

function buildEuropresseSourceMatch(resources, mapping, confidence) {
  const matches = findEuropresseResourcesFromMapping(resources, mapping);
  const searchSource = mapping.searchSource || getEuropresseSearchSourceFromMatches(matches);

  if (!matches.length && !searchSource?.id && !mapping.displayLabel) {
    return null;
  }

  return {
    matches,
    searchSource,
    sourceCodes: mapping.sourceCodes ?? [],
    sourceLabel: mapping.displayLabel || searchSource?.label || "",
    confidence: matches.length > 1 ? `${confidence}-multiple` : confidence,
  };
}

function getEuropresseSearchSourceFromMatches(matches) {
  if (matches.length !== 1) {
    return null;
  }

  const sources = matches
    .map((resource) => resource.europresse_search_source)
    .filter((source) => source?.id);
  const uniqueIds = new Set(sources.map((source) => source.id));

  return uniqueIds.size === 1 ? sources[0] : null;
}

function findEuropresseResourcesFromMapping(resources, mapping) {
  if (mapping.names) {
    return mapping.names
      .map((name) => resources.find((resource) => normalizeComparableTitle(resource.name) === normalizeComparableTitle(name)))
      .filter(Boolean);
  }

  if (mapping.nameStartsWith) {
    const prefix = normalizeComparableTitle(mapping.nameStartsWith);
    return resources.filter((resource) => normalizeComparableTitle(resource.name).startsWith(prefix));
  }

  return [];
}

function inferEuropresseResourcesFromHost(resources, hostname) {
  const hostCore = getComparableHostCore(hostname);

  if (hostCore.length < 6) {
    return [];
  }

  return resources.filter((resource) => {
    const candidates = getComparableTitleCandidates(resource.name);
    return candidates.some((candidate) => (
      candidate.length >= 6 && (hostCore.includes(candidate) || candidate.includes(hostCore))
    ));
  });
}

function getEuropresseSourceLabel(sourceMatch) {
  if (sourceMatch.sourceLabel) {
    return sourceMatch.sourceLabel;
  }

  if (sourceMatch.matches.length === 1) {
    return sourceMatch.matches[0].name;
  }

  if (sourceMatch.matches.length > 1) {
    const names = sourceMatch.matches.slice(0, 3).map((resource) => resource.name).join(", ");
    const suffix = sourceMatch.matches.length > 3 ? ", ..." : "";
    return `${sourceMatch.matches.length} titres possibles : ${names}${suffix}`;
  }

  return "";
}

function getComparableHostCore(hostname) {
  const host = hostname
    .toLowerCase()
    .replace(/^www\./, "")
    .replace(/^m\./, "");
  const parts = host.split(".");

  return normalizeComparableTitle(parts.length > 2 ? parts.slice(0, -2).join(" ") : parts[0]);
}

function getComparableTitleCandidates(title) {
  const base = normalizeComparableTitle(title.replace(/\([^)]*\)/g, " "));
  const withoutLeadingArticle = base.replace(/^(le|la|les|l)/, "");
  const beforeSeparator = normalizeComparableTitle(title.split(/\s[-/]\s/)[0] ?? title);

  return [...new Set([base, withoutLeadingArticle, beforeSeparator].filter(Boolean))];
}

function normalizeComparableTitle(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "et")
    .replace(/[^a-z0-9]/g, "");
}

function normalizeConverterLinkKey(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isInternalUrl(url) {
  return url.hostname === window.location.hostname || url.hostname.endsWith(".local");
}

function isKnownNonEuropresseProviderUrl(url) {
  const hosts = [
    "bnf.idm.oclc.org",
    "login.bnf.idm.oclc.org",
    "www.pressreader.com",
    "www-pressreader-com.bnf.idm.oclc.org",
    "business.indexpresse.fr",
  ];

  return hostMatchesAny(url.hostname, hosts);
}

function revealApp() {
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-ready");
  state.appRevealed = true;

  if (pendingProgressiveRender) {
    scheduleNextCardBatch(pendingProgressiveRender.renderVersion);
  }
}

function render() {
  renderQuickLaunch();
  if (catalogFavoritesPreview) {
    return;
  }
  renderResourceGrid();
  scheduleFloatingToolsUpdate();
}

function setupFloatingTools() {
  if (!jumpToSearchDock) {
    return;
  }

  scheduleFloatingToolsUpdate();
  window.addEventListener("scroll", scheduleFloatingToolsUpdate, { passive: true });
  window.addEventListener("resize", scheduleFloatingToolsUpdate);
  window.addEventListener("resize", schedulePressTitleCategoryBadgeLayout);

  if (window.visualViewport) {
    window.visualViewport.addEventListener("scroll", scheduleFloatingToolsUpdate, { passive: true });
    window.visualViewport.addEventListener("resize", scheduleFloatingToolsUpdate);
  }

  if ("ResizeObserver" in window) {
    const popularityNoteObserver = new ResizeObserver(syncPressPopularityNoteDockOffset);
    popularityNoteObserver.observe(pressPopularityNote);
  }
}

function scheduleFloatingToolsUpdate() {
  if (!jumpToSearchDock || floatingToolsFrame) {
    return;
  }

  floatingToolsFrame = window.requestAnimationFrame(() => {
    floatingToolsFrame = null;
    updateFloatingToolsPosition();
  });
}

function updateFloatingToolsPosition() {
  const visualViewportOffset = getFloatingVisualViewportOffset();

  jumpToSearchDock.style.setProperty("--floating-viewport-offset", `${visualViewportOffset}px`);
  jumpToSearchDock.style.setProperty("--floating-footer-offset", "0px");

  if (!siteFooter) {
    return;
  }

  const dockRect = jumpToSearchDock.getBoundingClientRect();
  const footerRect = siteFooter.getBoundingClientRect();
  const footerOffset = Math.max(0, Math.ceil(dockRect.bottom + floatingFooterGap - footerRect.top));

  jumpToSearchDock.style.setProperty("--floating-footer-offset", `${footerOffset}px`);
}

function getFloatingVisualViewportOffset() {
  if (!window.visualViewport) {
    return 0;
  }

  const layoutHeight = window.innerHeight || document.documentElement.clientHeight;
  const hiddenBottom = layoutHeight - window.visualViewport.height - window.visualViewport.offsetTop;

  return Math.min(maxFloatingViewportOffset, Math.max(0, Math.ceil(hiddenBottom)));
}

function getResourceTaxonomyIndex() {
  return state.resourceTaxonomyIndex;
}

function getResourceTaxonomyAncestors(nodeOrId) {
  const byId = getResourceTaxonomyIndex();
  const ancestors = [];
  let node = typeof nodeOrId === "string" ? byId.get(nodeOrId) : nodeOrId;
  const visited = new Set();
  while (node && !visited.has(node.id)) {
    visited.add(node.id);
    ancestors.unshift(node);
    node = node.parent_id ? byId.get(node.parent_id) : null;
  }
  return ancestors;
}

function resourceTaxonomyNodeIsDescendantOf(node, ancestorId) {
  return getResourceTaxonomyAncestors(node).some((ancestor) => ancestor.id === ancestorId);
}

function getResourceTaxonomyRoots() {
  const categories = state.resourceTaxonomy?.taxonomy?.categories ?? [];
  const byId = getResourceTaxonomyIndex();
  const activeRootIds = new Set();
  Object.values(state.resourceTaxonomy?.assignments ?? {}).forEach((assignment) => {
    (assignment.node_ids ?? []).forEach((nodeId) => {
      const node = byId.get(nodeId);
      const root = node ? getResourceTaxonomyAncestors(node)[0] : null;
      if (root) activeRootIds.add(root.id);
    });
  });
  const roots = categories.filter((category) => category.parent_id === null && activeRootIds.has(category.id));
  const customOrder = state.resourceTaxonomy?.taxonomy?.child_orders?.__root__;
  if (!customOrder) return roots;
  const orderIndex = new Map(customOrder.map((id, index) => [id, index]));
  return roots.sort((left, right) => (
    (orderIndex.get(left.id) ?? Number.MAX_SAFE_INTEGER)
    - (orderIndex.get(right.id) ?? Number.MAX_SAFE_INTEGER)
  ));
}

function getResourceTaxonomyNodes(resource) {
  const byId = getResourceTaxonomyIndex();
  return (state.resourceTaxonomy?.assignments?.[resource.id]?.node_ids ?? [])
    .map((id) => byId.get(id))
    .filter(Boolean);
}

function getResourceTaxonomyBadges(resource) {
  const nodes = getResourceTaxonomyNodes(resource);
  const preferredNodeId = state.resourceTaxonomy?.assignments?.[resource.id]?.preferred_node_id;
  const preferredNode = nodes.find((node) => node.id === preferredNodeId) ?? nodes[0];
  if (!preferredNode) return [];
  const visiblePath = getResourceTaxonomyAncestors(preferredNode).slice(0, 2);
  const [rootNode, targetNode] = visiblePath;
  return [{
    label: visiblePath.map((ancestor) => ancestor.short_label || ancestor.label).join(" › "),
    title: visiblePath.map((ancestor) => ancestor.label).join(" › "),
    rootId: rootNode.id,
    rootLabel: rootNode.short_label || rootNode.label,
    targetId: targetNode?.id || rootNode.id,
    targetLabel: targetNode ? targetNode.short_label || targetNode.label : "",
  }];
}

function resourceMatchesTaxonomyRoot(resource, rootId) {
  return getResourceTaxonomyNodes(resource).some((node) => resourceTaxonomyNodeIsDescendantOf(node, rootId));
}

function renderFilters() {
  const categories = [
    { id: "Toutes", label: "Ressources" },
    { id: "Presse", label: "Presse" },
    ...getResourceTaxonomyRoots().map(({ id, label }) => ({ id, label })),
  ];

  if (!categories.some((category) => category.id === state.category)) {
    state.category = "Toutes";
  }

  filters.innerHTML = "";

  const favoriteButton = document.createElement("button");
  favoriteButton.className = "filter-button favorite-filter";
  favoriteButton.type = "button";
  favoriteButton.innerHTML = `${renderResourceCategoryIcon("favorites")}<span>Favoris</span>`;
  favoriteButton.setAttribute("aria-pressed", String(state.favoritesOnly));
  favoriteButton.addEventListener("click", () => {
    state.favoritesOnly = !state.favoritesOnly;
    renderFilters();
    render();
  });

  const separator = document.createElement("span");
  separator.className = "filter-separator";
  separator.setAttribute("aria-hidden", "true");
  filters.append(favoriteButton, separator);

  for (const category of categories) {
    const button = document.createElement("button");
    button.className = "filter-button";
    button.type = "button";
    button.innerHTML = `${renderResourceCategoryIcon(category.id)}<span>${escapeHtml(category.label)}</span>`;
    button.setAttribute("aria-pressed", String(category.id === state.category));
    button.addEventListener("click", () => {
      state.category = category.id;
      if (category.id === "Presse" && !state.pressLoaded) loadPressCatalog();
      renderFilters();
      render();
    });
    filters.append(button);
    if (category.id === "Presse") {
      const categorySeparator = document.createElement("span");
      categorySeparator.className = "filter-separator";
      categorySeparator.setAttribute("aria-hidden", "true");
      filters.append(categorySeparator);
    }
  }
}

function renderResourceCategoryIcon(categoryId) {
  const paths = resourceCategoryIcons[categoryId];
  if (!paths) return "";
  return `<svg class="resource-category-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

function renderLanguageFilterControls() {
  renderLanguageFilterControl(languageFilters);
  renderLanguageFilterControl(settingsLanguageFilters);
}

function renderLanguageFilterControl(container) {
  container.innerHTML = "";

  const knownCodes = getKnownLanguageCodes();
  const primaryCodes = primaryLanguageCodes.filter((code) => knownCodes.has(code));
  const extraCodes = getOrderedLanguageCodes()
    .filter((code) => !primaryLanguageCodes.includes(code));
  const selectedExtraCodes = [...state.languageFilter]
    .filter((code) => extraCodes.includes(code));

  container.append(createLanguageFilterButton("", "Toutes", "Toutes les langues", state.languageFilter.size === 0));

  for (const code of primaryCodes) {
    container.append(createLanguageFilterButton(
      code,
      formatLanguageBadgeText(code),
      formatLanguageTooltipItem(code),
      state.languageFilter.has(code),
    ));
  }

  if (extraCodes.length > 0) {
    const select = document.createElement("select");
    select.className = "language-filter-select";
    select.title = "Ajouter une autre langue";
    select.setAttribute("aria-label", "Ajouter une autre langue");
    select.innerHTML = `
      <option value="">+</option>
      ${extraCodes
        .filter((code) => !state.languageFilter.has(code))
        .map((code) => `<option value="${escapeAttribute(code)}">${escapeHtml(formatLanguageOptionLabel(code))}</option>`)
        .join("")}
    `;
    select.addEventListener("change", (event) => {
      const code = event.target.value;
      if (code) {
        updateLanguageFilter(code);
      }
      event.target.value = "";
    });
    container.append(select);
  }

  for (const code of selectedExtraCodes) {
    container.append(createLanguageFilterButton(
      code,
      formatLanguageBadgeText(code),
      formatLanguageTooltipItem(code),
      true,
    ));
  }
}

function createLanguageFilterButton(code, label, title, isActive) {
  const button = document.createElement("button");
  button.className = "language-filter-button";
  button.classList.toggle("is-active", isActive);
  button.type = "button";
  button.textContent = label;
  button.title = title;
  button.setAttribute("aria-pressed", String(isActive));
  button.addEventListener("click", () => {
    updateLanguageFilter(code);
  });
  return button;
}

function updateLanguageFilter(code) {
  if (!code) {
    state.languageFilter.clear();
  } else if (state.languageFilter.has(code)) {
    state.languageFilter.delete(code);
  } else {
    state.languageFilter.add(code);
  }

  syncProfileFilterState();
  saveProfileFilters();
  render();
}

function getOrderedLanguageCodes() {
  const knownCodes = getKnownLanguageCodes();
  const primaryCodes = primaryLanguageCodes.filter((code) => knownCodes.has(code));
  const otherCodes = [...knownCodes]
    .filter((code) => !primaryLanguageCodes.includes(code))
    .sort((a, b) => formatLanguageOptionLabel(a).localeCompare(formatLanguageOptionLabel(b), "fr"));

  return [...primaryCodes, ...otherCodes];
}

function getKnownLanguageCodes() {
  return new Set(state.resources.filter(isCatalogVisible).flatMap(getResourceLanguageCodes));
}

function renderQuickLaunch() {
  document.querySelector(".quick-launch-folder-dialog")?.remove();
  state.openFavoriteFolderId = null;
  const layout = state.quickLaunchEditing ? state.draftFavoriteLayout : state.favoriteLayout;
  let favorites = catalogFavoritesPreview
    ? getFavoriteResources()
    : getResourcesByIds(listFavoriteResourceIds(layout));
  if (catalogFavoritesPreview && state.catalogPreviewFavoriteMenusOnly) {
    favorites = favorites.filter(resourceHasQuickLaunchActionMenu);
    state.quickLaunchActionMenus = new Set(favorites.map((resource) => resource.id));
  }
  quickLaunch.innerHTML = "";
  quickLaunch.hidden = !catalogFavoritesPreview && !state.quickLaunchEditing && favorites.length === 0;
  quickLaunch.classList.toggle("is-editing", state.quickLaunchEditing);
  quickLaunch.classList.toggle(
    "shows-background-comparisons",
    catalogFavoritesPreview && state.catalogPreviewBackgroundImagesOnly,
  );

  if (!catalogFavoritesPreview && !state.quickLaunchEditing && !favorites.length) {
    state.quickLaunchModifierEntering = false;
    return;
  }

  quickLaunch.append(createQuickLaunchHeader(favorites));
  if (catalogFavoritesPreview) {
    quickLaunch.append(createCatalogFavoritesImageFilters());
  }
  resetQuickLaunchActionAnimationFlag();

  if (!favorites.length && (!state.quickLaunchEditing || catalogFavoritesPreview)) {
    const empty = document.createElement("p");
    empty.className = "quick-launch-empty";
    empty.textContent = catalogFavoritesPreview ? "Aucun résultat." : "Aucun favori.";
    quickLaunch.append(empty);
    return;
  }

  if (catalogFavoritesPreview) {
    const list = createQuickLaunchList("Favoris");
    favorites.forEach((resource, index) => list.append(createQuickLaunchResourceItem(resource, index)));
    quickLaunch.append(list);
    scheduleQuickLaunchMenuOverflowUpdate();
    return;
  }

  const rows = document.createElement("div");
  rows.className = "quick-launch-rows";
  if (state.quickLaunchEditing) rows.append(createQuickLaunchRowInsertBar(0));
  layout.rows.forEach((row, index) => {
    if (state.quickLaunchEditing || row.items.length) {
      rows.append(createQuickLaunchRow(row, index, layout.rows.length));
      if (state.quickLaunchEditing) rows.append(createQuickLaunchRowInsertBar(index + 1));
    }
  });
  quickLaunch.append(rows);
  scheduleQuickLaunchMenuOverflowUpdate();
}

function scheduleQuickLaunchMenuOverflowUpdate() {
  requestAnimationFrame(() => {
    quickLaunch.querySelectorAll(".quick-launch-action-menu").forEach((menu) => {
      const update = () => {
        const isScrollable = menu.scrollHeight > menu.clientHeight + 1;
        const isAtEnd = !isScrollable || menu.scrollTop + menu.clientHeight >= menu.scrollHeight - 1;
        menu.classList.toggle("is-scrollable", isScrollable);
        menu.classList.toggle("is-at-end", isAtEnd);
      };

      menu.addEventListener("scroll", update, { passive: true });
      update();
    });
  });
}

function createQuickLaunchRow(row, rowIndex, rowCount) {
  const section = document.createElement("section");
  section.className = "quick-launch-row";
  section.dataset.rowId = row.id;

  if (row.name || state.quickLaunchEditing) {
    section.classList.add("has-heading");
    const heading = document.createElement("div");
    heading.className = "quick-launch-row-heading";
    if (state.quickLaunchEditing) {
      const handle = createQuickLaunchRowDragHandle(row);
      const input = document.createElement("input");
      input.className = "quick-launch-row-name";
      input.type = "text";
      input.maxLength = 80;
      input.value = row.name;
      input.placeholder = `Ligne sans nom ${rowIndex + 1}`;
      input.setAttribute("aria-label", `Nom de la ligne ${rowIndex + 1}`);
      input.addEventListener("input", () => { row.name = input.value; });
      heading.append(handle, input, createQuickLaunchRowActions(row, rowIndex, rowCount));
    } else {
      const title = document.createElement("h3");
      title.textContent = row.name;
      heading.append(title);
    }
    section.append(heading);
  }

  const list = createQuickLaunchList(row.name || `Ligne ${rowIndex + 1}`);
  list.dataset.rowId = row.id;
  row.items.forEach((item, itemIndex) => {
    if (item.type === "folder") {
      list.append(createQuickLaunchFolderItem(row, item, itemIndex));
      return;
    }
    const resource = getResourceById(item.resourceId);
    if (resource && isCatalogVisible(resource)) {
      list.append(createQuickLaunchResourceItem(resource, itemIndex, { rowId: row.id }));
    }
  });

  if (state.quickLaunchEditing && !row.items.length) {
    const empty = document.createElement("p");
    empty.className = "quick-launch-row-empty";
    empty.textContent = "Ligne vide";
    list.append(empty);
  }
  section.append(list);
  return section;
}

function createQuickLaunchRowDragHandle(row) {
  const button = document.createElement("button");
  button.className = "quick-launch-row-drag-handle";
  button.type = "button";
  button.title = `Déplacer la ligne ${row.name || "sans nom"}`;
  button.setAttribute("aria-label", button.title);
  button.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="5" r="1.5"/><circle cx="16" cy="5" r="1.5"/><circle cx="8" cy="12" r="1.5"/><circle cx="16" cy="12" r="1.5"/><circle cx="8" cy="19" r="1.5"/><circle cx="16" cy="19" r="1.5"/></svg>';
  button.addEventListener("pointerdown", handleQuickLaunchRowPointerDown);
  button.addEventListener("click", (event) => event.preventDefault());
  button.addEventListener("contextmenu", preventQuickLaunchEditContextMenu);
  return button;
}

function createQuickLaunchRowInsertBar(index) {
  const bar = document.createElement("div");
  bar.className = "quick-launch-row-insert";
  const button = createIconTextButton("+", "Ajouter une ligne ici", () => addDraftFavoriteRow(index));
  button.classList.add("quick-launch-row-insert-button");
  bar.append(button);
  return bar;
}

function createQuickLaunchList(label) {
  const list = document.createElement("div");
  list.className = "quick-launch-list";
  list.setAttribute("aria-label", label);
  return list;
}

function createQuickLaunchResourceItem(resource, resourceIndex, location = {}) {
  const item = document.createElement("div");
  const accessWarning = renderQuickLaunchAccessWarning(resource);
  const showsBackgroundComparison = catalogFavoritesPreview
    && state.catalogPreviewBackgroundImagesOnly
    && Boolean(resource.icon_background_image);
  const quickLaunchTile = showsBackgroundComparison
    ? `${renderCatalogBackgroundComparison(resource, resourceIndex, accessWarning)}<small class="quick-launch-label">${escapeHtml(resource.name)}</small>`
    : resource.icon_url
    ? `<span class="quick-launch-tile ${resource.icon_no_padding ? "icon-no-padding" : ""}"${logoAppearanceAttributes(resource)}>${renderIcon(resource, !catalogFavoritesPreview || resourceIndex < startupImageBlockingCount)}${accessWarning}</span><small class="quick-launch-label">${escapeHtml(resource.name)}</small>`
    : `<span class="quick-launch-tile generated"><strong>${escapeHtml(getFallbackLabel(resource))}</strong>${accessWarning}</span><small class="quick-launch-label">${escapeHtml(resource.name)}</small>`;
  item.className = "quick-launch-item";
  item.classList.toggle("has-background-comparison", showsBackgroundComparison);
  item.dataset.resourceId = resource.id;
  if (location.rowId) item.dataset.rowId = location.rowId;
  if (location.folderId) item.dataset.folderId = location.folderId;

  if (state.quickLaunchEditing) {
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `Déplacer ${resource.name}`);
    item.setAttribute("draggable", "false");
    item.classList.toggle("is-dragging", state.dragging?.kind === "resource" && state.dragging.id === resource.id);
    item.innerHTML = quickLaunchTile;
    item.querySelector(".quick-launch-tile")?.append(createFavoriteDestinationControl(resource.id));
    item.append(createQuickLaunchRemoveButton(resource));
    item.addEventListener("pointerdown", handleQuickLaunchPointerDown);
    item.addEventListener("contextmenu", preventQuickLaunchEditContextMenu);
    item.addEventListener("dragstart", preventQuickLaunchEditContextMenu);
    item.addEventListener("keydown", handleQuickLaunchKeyDown);
    return item;
  }

  const actions = catalogFavoritesPreview ? getActions(resource) : getProfileVisibleActions(resource);
  const primaryAction = actions[0];
  if (!primaryAction) {
    item.classList.add("is-unavailable");
    item.title = `${resource.name} : indisponible avec les filtres de profil et d'accès actuels`;
    item.innerHTML = `<span class="quick-launch-main" aria-disabled="true">${quickLaunchTile}</span>`;
    bindQuickLaunchAccessWarning(item, resource);
    return item;
  }
  const secondaryActions = getQuickLaunchSecondaryActions(resource, actions, primaryAction);
  const primaryUrl = resolveActionHref(resource, primaryAction);
  item.title = resource.name;
  item.classList.toggle("has-open-actions", state.quickLaunchActionMenus.has(resource.id));
  item.innerHTML = `<a class="quick-launch-main" href="${escapeAttribute(primaryUrl)}" target="_blank" rel="noreferrer"${getSessionAttributes(resource, primaryAction, primaryUrl)} aria-label="${escapeAttribute(resource.name)}">${quickLaunchTile}</a>${renderQuickLaunchSecondaryActions(resource, secondaryActions)}`;

  if (catalogFavoritesPreview) {
    const mainAction = item.querySelector(".quick-launch-main");
    mainAction.setAttribute("aria-label", `Inspecter l’image de ${resource.name}`);
    mainAction.setAttribute("role", "button");
    mainAction.setAttribute("tabindex", "0");
    mainAction.removeAttribute("href");
    mainAction.removeAttribute("target");
    mainAction.addEventListener("click", (event) => { event.preventDefault(); openCatalogFavoritesInspector(resource); });
  }
  item.querySelector("[data-quick-launch-actions-toggle]")?.addEventListener("click", handleQuickLaunchActionsToggle);
  bindQuickLaunchAccessWarning(item, resource);
  return item;
}

function bindQuickLaunchAccessWarning(item, resource) {
  const warning = item.querySelector("[data-access-note-resource-id]");
  if (!warning) return;

  const openNote = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleAccessNote(resource);
  };
  warning.addEventListener("click", openNote);
  warning.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    openNote(event);
  });
}

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

function createQuickLaunchRowActions(row, rowIndex, rowCount) {
  const actions = document.createElement("div");
  actions.className = "quick-launch-row-actions";
  actions.append(createQuickLaunchFolderAddButton(row.id));
  if (rowCount > 1) {
    actions.append(
      createIconTextButton("↑", "Monter la ligne", () => moveDraftFavoriteRow(rowIndex, -1), rowIndex === 0),
      createIconTextButton("↓", "Descendre la ligne", () => moveDraftFavoriteRow(rowIndex, 1), rowIndex === rowCount - 1),
    );
  }
  actions.append(createIconTextButton("×", "Supprimer la ligne", () => requestDeleteDraftFavoriteRow(row.id), false, "danger"));
  return actions;
}

function createQuickLaunchFolderAddButton(rowId) {
  const button = createIconTextButton("", "Créer un dossier", () => addDraftFavoriteFolder(rowId));
  button.classList.add("quick-launch-folder-add");
  button.insertAdjacentHTML("beforeend", '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10v6"/><path d="M9 13h6"/><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>');
  return button;
}

function createIconTextButton(text, label, onClick, disabled = false, tone = "") {
  const button = document.createElement("button");
  button.className = `quick-launch-row-action ${tone}`.trim();
  button.type = "button";
  button.textContent = text;
  button.title = label;
  button.setAttribute("aria-label", label);
  button.disabled = disabled;
  button.addEventListener("click", onClick);
  return button;
}

function createQuickLaunchFolderItem(row, folder) {
  const item = document.createElement("div");
  item.className = "quick-launch-item quick-launch-folder-item";
  item.dataset.rowId = row.id;
  item.dataset.folderId = folder.id;

  const opener = document.createElement("button");
  opener.className = "quick-launch-folder-open";
  opener.type = "button";
  opener.setAttribute("aria-label", folder.name ? `Ouvrir le dossier ${folder.name}` : "Ouvrir le dossier");
  opener.append(createQuickLaunchFolderMosaic(folder));
  if (!state.quickLaunchEditing && folder.name) {
    const label = document.createElement("small");
    label.className = "quick-launch-label";
    label.textContent = folder.name;
    opener.classList.add("has-label");
    opener.append(label);
  }
  opener.addEventListener("click", () => {
    if (state.suppressedFavoriteFolderClickId === folder.id) {
      state.suppressedFavoriteFolderClickId = null;
      return;
    }
    openQuickLaunchFolder(folder.id);
  });
  item.append(opener);

  if (state.quickLaunchEditing) {
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", folder.name ? `Déplacer le dossier ${folder.name}` : "Déplacer le dossier");
    item.setAttribute("draggable", "false");
    item.classList.toggle("is-dragging", state.dragging?.kind === "folder" && state.dragging.id === folder.id);
    const input = document.createElement("input");
    input.className = "quick-launch-folder-name";
    input.type = "text";
    input.maxLength = 80;
    input.value = folder.name;
    input.placeholder = "Nom du dossier";
    input.setAttribute("aria-label", "Nom du dossier");
    input.dataset.folderNameEditor = folder.id;
    input.addEventListener("input", () => updateDraftFavoriteFolderName(folder.id, input.value, input));
    for (const eventName of ["pointerdown", "click", "keydown", "keyup"]) {
      input.addEventListener(eventName, stopQuickLaunchRemoveEvent);
    }
    const remove = createIconTextButton("×", "Supprimer le dossier et conserver ses favoris", () => {
      deleteFavoriteFolder(state.draftFavoriteLayout, row.id, folder.id, true);
      renderQuickLaunch();
    }, false, "danger");
    remove.classList.add("quick-launch-folder-remove");
    item.querySelector(".quick-launch-folder-mosaic")?.append(createFolderDestinationControl(row.id, folder.id));
    item.append(input, remove);
    item.addEventListener("pointerdown", handleQuickLaunchPointerDown);
    item.addEventListener("contextmenu", preventQuickLaunchEditContextMenu);
    item.addEventListener("dragstart", preventQuickLaunchEditContextMenu);
  }
  return item;
}

function createQuickLaunchFolderMosaic(folder) {
  const mosaic = document.createElement("span");
  mosaic.className = "quick-launch-tile quick-launch-folder-mosaic";
  const resources = getResourcesByIds(folder.resourceIds).slice(0, 4);
  for (const resource of resources) {
    const cell = document.createElement("span");
    cell.className = "quick-launch-folder-cell";
    cell.classList.toggle("icon-no-padding", resource.icon_no_padding === true);
    applyLogoAppearance(cell, resource);
    cell.innerHTML = resource.icon_url
      ? renderIcon(resource, true)
      : `<strong>${escapeHtml(getFallbackLabel(resource))}</strong>`;
    mosaic.append(cell);
  }
  while (mosaic.children.length < 4) {
    const cell = document.createElement("span");
    cell.className = "quick-launch-folder-cell is-empty";
    mosaic.append(cell);
  }
  return mosaic;
}

function openQuickLaunchFolder(folderId) {
  const layout = state.quickLaunchEditing ? state.draftFavoriteLayout : state.favoriteLayout;
  const row = layout.rows.find((candidate) => candidate.items.some((item) => item.type === "folder" && item.id === folderId));
  const folder = row?.items.find((item) => item.type === "folder" && item.id === folderId);
  if (!folder) return;

  document.querySelector(".quick-launch-folder-dialog")?.remove();
  state.openFavoriteFolderId = folderId;
  const dialog = document.createElement("dialog");
  dialog.className = "quick-launch-folder-dialog";
  dialog.classList.toggle("is-editing", state.quickLaunchEditing);
  dialog.dataset.folderId = folder.id;
  dialog.setAttribute("aria-label", folder.name ? `Dossier ${folder.name}` : "Dossier");
  const header = document.createElement("header");
  const close = createIconTextButton("×", "Fermer le dossier", () => dialog.close());
  if (state.quickLaunchEditing) {
    const input = document.createElement("input");
    input.className = "quick-launch-folder-dialog-name";
    input.type = "text";
    input.maxLength = 80;
    input.value = folder.name;
    input.placeholder = "Nom du dossier";
    input.setAttribute("aria-label", "Nom du dossier");
    input.dataset.folderNameEditor = folder.id;
    input.addEventListener("input", () => updateDraftFavoriteFolderName(folder.id, input.value, input));
    header.append(input);
  } else if (folder.name) {
    const title = document.createElement("h3");
    title.textContent = folder.name;
    header.append(title);
  }
  header.append(close);
  dialog.append(header);

  const list = createQuickLaunchList(folder.name || "Dossier");
  list.classList.add("quick-launch-folder-content");
  getResourcesByIds(folder.resourceIds).forEach((resource, index) => {
    list.append(createQuickLaunchResourceItem(resource, index, { rowId: row.id, folderId: folder.id }));
  });
  if (!folder.resourceIds.length) {
    const empty = document.createElement("p");
    empty.className = "quick-launch-row-empty";
    empty.textContent = state.quickLaunchEditing ? "Déplacez des favoris dans ce dossier." : "Dossier vide";
    list.append(empty);
  }
  dialog.append(list);
  dialog.addEventListener("close", () => {
    state.openFavoriteFolderId = null;
    dialog.remove();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.tabIndex = -1;
  document.body.append(dialog);
  dialog.showModal();
  dialog.focus({ preventScroll: true });
}

function addDraftFavoriteFolder(rowId) {
  const folder = createFavoriteFolder(
    state.draftFavoriteLayout,
    rowId,
    createFavoriteContainerId("folder"),
  );
  renderQuickLaunch();
  quickLaunch.querySelector(`[data-folder-id="${CSS.escape(folder.id)}"] .quick-launch-folder-name`)?.focus();
}

function moveDraftFavoriteRow(rowIndex, delta) {
  const rows = state.draftFavoriteLayout.rows;
  const nextIndex = rowIndex + delta;
  if (nextIndex < 0 || nextIndex >= rows.length) return;
  const [row] = rows.splice(rowIndex, 1);
  rows.splice(nextIndex, 0, row);
  renderQuickLaunch();
}

function createDestinationControl(select, label) {
  const control = document.createElement("span");
  control.className = "quick-launch-destination-control";
  control.title = label;
  control.insertAdjacentHTML("beforeend", '<svg class="quick-launch-destination-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1"/><path d="M2 13h10"/><path d="m9 16 3-3-3-3"/></svg>');
  control.append(select);
  for (const eventName of ["pointerdown", "click", "keydown", "keyup"]) {
    control.addEventListener(eventName, stopQuickLaunchRemoveEvent);
  }
  return control;
}

function createFavoriteDestinationControl(resourceId) {
  const select = document.createElement("select");
  select.className = "quick-launch-destination";
  select.setAttribute("aria-label", "Déplacer vers");
  const location = findFavoriteResource(state.draftFavoriteLayout, resourceId);
  for (const [index, row] of state.draftFavoriteLayout.rows.entries()) {
    const rowLabel = row.name || `Ligne sans nom ${index + 1}`;
    select.append(createDestinationOption(row.id, "", rowLabel, location?.row.id === row.id && !location.folder));
    for (const item of row.items) {
      if (item.type === "folder") {
        const option = createDestinationOption(row.id, item.id, `${rowLabel} / ${item.name || "Dossier"}`, location?.folder?.id === item.id);
        option.dataset.folderId = item.id;
        option.dataset.rowLabel = rowLabel;
        select.append(option);
      }
    }
  }
  select.addEventListener("change", () => {
    const [rowId, folderId] = select.value.split("::");
    moveFavoriteResource(state.draftFavoriteLayout, resourceId, { rowId, folderId: folderId || null });
    renderQuickLaunch();
  });
  return createDestinationControl(select, "Déplacer vers une ligne ou un dossier");
}

function createDestinationOption(rowId, folderId, label, selected) {
  const option = document.createElement("option");
  option.value = `${rowId}::${folderId}`;
  option.textContent = label;
  option.selected = selected;
  return option;
}

function createFolderDestinationControl(sourceRowId, folderId) {
  const select = document.createElement("select");
  select.className = "quick-launch-destination";
  select.setAttribute("aria-label", "Déplacer le dossier vers");
  state.draftFavoriteLayout.rows.forEach((row, index) => {
    select.append(createDestinationOption(row.id, "", row.name || `Ligne sans nom ${index + 1}`, row.id === sourceRowId));
  });
  select.addEventListener("change", () => {
    const [destinationRowId] = select.value.split("::");
    if (destinationRowId === sourceRowId) return;
    const source = state.draftFavoriteLayout.rows.find((row) => row.id === sourceRowId);
    const destination = state.draftFavoriteLayout.rows.find((row) => row.id === destinationRowId);
    const index = source.items.findIndex((item) => item.type === "folder" && item.id === folderId);
    if (!destination || index === -1) return;
    destination.items.push(source.items.splice(index, 1)[0]);
    renderQuickLaunch();
  });
  return createDestinationControl(select, "Déplacer le dossier vers une ligne");
}

function updateDraftFavoriteFolderName(folderId, value, sourceInput) {
  const location = findFavoriteFolder(state.draftFavoriteLayout, folderId);
  if (!location) return;
  location.folder.name = value;
  const selector = `[data-folder-name-editor="${CSS.escape(folderId)}"]`;
  document.querySelectorAll(selector).forEach((input) => {
    if (input !== sourceInput) input.value = value;
  });
  const folderItem = quickLaunch.querySelector(`.quick-launch-folder-item[data-folder-id="${CSS.escape(folderId)}"]`);
  folderItem?.setAttribute("aria-label", value ? `Déplacer le dossier ${value}` : "Déplacer le dossier");
  const opener = folderItem?.querySelector(".quick-launch-folder-open");
  opener?.setAttribute("aria-label", value ? `Ouvrir le dossier ${value}` : "Ouvrir le dossier");
  const dialog = document.querySelector(`.quick-launch-folder-dialog[data-folder-id="${CSS.escape(folderId)}"]`);
  dialog?.setAttribute("aria-label", value ? `Dossier ${value}` : "Dossier");
  dialog?.querySelector(".quick-launch-folder-content")?.setAttribute("aria-label", value || "Dossier");
  document.querySelectorAll(`.quick-launch-destination option[data-folder-id="${CSS.escape(folderId)}"]`).forEach((option) => {
    option.textContent = `${option.dataset.rowLabel} / ${value || "Dossier"}`;
  });
}

function requestDeleteDraftFavoriteRow(rowId) {
  const row = state.draftFavoriteLayout.rows.find((candidate) => candidate.id === rowId);
  const resourceCount = row?.items.reduce((count, item) => count + (item.type === "folder" ? item.resourceIds.length : 1), 0) ?? 0;
  if (!row || !resourceCount) {
    deleteFavoriteRow(state.draftFavoriteLayout, rowId);
    renderQuickLaunch();
    return;
  }

  const destinations = state.draftFavoriteLayout.rows.filter((candidate) => candidate.id !== rowId);
  const dialog = document.createElement("dialog");
  dialog.className = "quick-launch-delete-row-dialog";
  dialog.setAttribute("aria-label", "Supprimer une ligne de favoris");
  dialog.innerHTML = `<h3>Supprimer cette ligne ?</h3><p>Elle contient ${resourceCount} favori${resourceCount > 1 ? "s" : ""}.</p>`;
  if (destinations.length) {
    const select = document.createElement("select");
    destinations.forEach((candidate, index) => select.append(createDestinationOption(candidate.id, "", candidate.name || `Ligne sans nom ${index + 1}`, index === 0)));
    const move = createActionButton("Déplacer puis supprimer", () => {
      deleteFavoriteRow(state.draftFavoriteLayout, rowId, select.value.split("::")[0]);
      dialog.close();
      renderQuickLaunch();
    }, "save");
    dialog.append(select, move);
  }
  const remove = createActionButton("Retirer les favoris", () => {
    deleteFavoriteRow(state.draftFavoriteLayout, rowId);
    dialog.close();
    renderQuickLaunch();
  }, "danger");
  const cancel = createActionButton("Annuler", () => dialog.close(), "neutral");
  const actions = document.createElement("div");
  actions.className = "quick-launch-delete-row-actions";
  actions.append(remove, cancel);
  dialog.append(actions);
  dialog.addEventListener("close", () => dialog.remove());
  document.body.append(dialog);
  dialog.showModal();
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

function getQuickLaunchSecondaryActions(resource, actions, primaryAction) {
  const primaryId = primaryAction?.id;

  return actions.filter((action) => (
    action.id !== primaryId
    && action.favorite_visible !== false
    && (
      action.id === "archives"
      || action.source_filter_id === "indexpresse_business"
      || action.action_group === "variant"
    )
  ));
}

function renderQuickLaunchSecondaryActions(resource, actions) {
  if (!actions.length) {
    return "";
  }

  if (actions.length === 1 && isCompactQuickLaunchSingleSecondaryAction(actions[0])) {
    return renderQuickLaunchSingleSecondaryAction(resource, actions[0]);
  }

  return renderQuickLaunchActionMenu(resource, actions);
}

function resourceHasQuickLaunchActionMenu(resource) {
  const actions = getActions(resource);
  const primaryAction = actions[0];
  if (!primaryAction) return false;
  const secondaryActions = getQuickLaunchSecondaryActions(resource, actions, primaryAction);
  return secondaryActions.length > 1
    || (secondaryActions.length === 1 && !isCompactQuickLaunchSingleSecondaryAction(secondaryActions[0]));
}

function isCompactQuickLaunchSingleSecondaryAction(action) {
  if (action.id === "archives") return true;
  return getQuickLaunchExtraActionLabel(action).replace(/\s+/g, "").length <= 4;
}

function renderQuickLaunchSingleSecondaryAction(resource, action) {
  const href = resolveActionHref(resource, action);
  const label = getQuickLaunchExtraActionLabel(action);
  const classNames = [action.id === "archives" ? "quick-launch-archive" : "quick-launch-extra-action"];
  if (action.id !== "archives" && label.replace(/\s+/g, "").length <= 4) {
    classNames.push("compact");
  }
  const content = action.id === "archives"
    ? renderArchiveActionIcon("quick-launch-archive-icon")
    : escapeHtml(label);

  return `
    <a class="${classNames.join(" ")}" href="${escapeAttribute(href)}" target="_blank" rel="noreferrer"${getSessionAttributes(resource, action, href)} aria-label="${escapeAttribute(`${action.label} - ${resource.name}`)}" title="${escapeAttribute(action.label)}">
      ${content}
    </a>
  `;
}

function renderQuickLaunchActionMenu(resource, actions) {
  const isExpanded = state.quickLaunchActionMenus.has(resource.id);
  const toggleLabel = isExpanded
    ? `Masquer les actions - ${resource.name}`
    : `Afficher les actions - ${resource.name}`;

  return `
    <button class="quick-launch-action-toggle" type="button" data-quick-launch-actions-toggle="${escapeAttribute(resource.id)}" aria-expanded="${String(isExpanded)}" aria-label="${escapeAttribute(toggleLabel)}" title="${escapeAttribute(toggleLabel)}">
      ${isExpanded ? "-" : "+"}
    </button>
    ${isExpanded ? `
      <div class="quick-launch-action-menu" data-action-count="${actions.length}" aria-label="${escapeAttribute(`Actions - ${resource.name}`)}">
        ${renderQuickLaunchMenuRows(resource, actions)}
      </div>
    ` : ""}
  `;
}

function renderQuickLaunchMenuRows(resource, actions) {
  return groupQuickLaunchMenuActions(actions).map((row) => {
    const rowClassName = row.length > 1
      ? "quick-launch-menu-row is-split"
      : "quick-launch-menu-row";
    const rowStyle = row.length > 1
      ? ` style="${escapeAttribute(getQuickLaunchMenuRowTemplate(row))}"`
      : "";

    return `
      <div class="${rowClassName}"${rowStyle}>
        ${row.map((action) => renderQuickLaunchMenuAction(resource, action)).join("")}
      </div>
    `;
  }).join("");
}

function groupQuickLaunchMenuActions(actions) {
  const rows = [];
  let pendingCompactAction = null;

  actions.forEach((action) => {
    if (!isCompactQuickLaunchMenuAction(action)) {
      if (pendingCompactAction) {
        rows.push([pendingCompactAction]);
        pendingCompactAction = null;
      }
      rows.push([action]);
      return;
    }

    if (pendingCompactAction && canShareQuickLaunchMenuRow(pendingCompactAction, action)) {
      rows.push([pendingCompactAction, action]);
      pendingCompactAction = null;
      return;
    }

    if (pendingCompactAction) {
      rows.push([pendingCompactAction]);
    }

    pendingCompactAction = action;
  });

  if (pendingCompactAction) {
    rows.push([pendingCompactAction]);
  }

  return rows;
}

function isCompactQuickLaunchMenuAction(action) {
  if (action.id === "archives" || action.kind === "indexpresse_business_articles") {
    return false;
  }

  const label = getQuickLaunchExtraActionLabel(action);
  return label.replace(/\s+/g, "").length <= 4;
}

function canShareQuickLaunchMenuRow(firstAction, secondAction) {
  const firstScore = getQuickLaunchMenuLabelScore(firstAction);
  const secondScore = getQuickLaunchMenuLabelScore(secondAction);

  return Math.max(firstScore, secondScore) <= 4 && firstScore + secondScore <= 6;
}

function getQuickLaunchMenuLabelScore(action) {
  return getQuickLaunchExtraActionLabel(action).replace(/\s+/g, "").length;
}

function getQuickLaunchMenuRowTemplate(row) {
  const weights = row.map((action) => Math.max(1, Math.ceil(getQuickLaunchMenuLabelScore(action) / 2)));
  return `grid-template-columns: ${weights.map((weight) => `minmax(0, ${weight}fr)`).join(" ")}`;
}

function renderQuickLaunchMenuAction(resource, action) {
  const href = resolveActionHref(resource, action);
  const label = getQuickLaunchExtraActionLabel(action);
  const classNames = ["quick-launch-menu-action"];

  if (action.action_group === "variant") {
    classNames.push("variant");
  }

  if (action.variant_tone) {
    classNames.push(`variant-${action.variant_tone}`);
  }

  return `
    <a class="${classNames.join(" ")}" href="${escapeAttribute(href)}" target="_blank" rel="noreferrer"${getSessionAttributes(resource, action, href)} aria-label="${escapeAttribute(`${action.label} - ${resource.name}`)}" title="${escapeAttribute(action.label)}">
      ${escapeHtml(label)}
    </a>
  `;
}

function handleQuickLaunchActionsToggle(event) {
  event.preventDefault();
  event.stopPropagation();
  const resourceId = event.currentTarget.dataset.quickLaunchActionsToggle;

  if (!resourceId) {
    return;
  }

  if (state.quickLaunchActionMenus.has(resourceId)) {
    state.quickLaunchActionMenus.delete(resourceId);
  } else {
    state.quickLaunchActionMenus.add(resourceId);
  }

  renderQuickLaunch();
}

function getQuickLaunchExtraActionLabel(action) {
  if (action.kind === "indexpresse_business_articles" && action.action_group !== "variant") {
    return "Articles";
  }

  if (action.action_group === "variant" && action.short_label) {
    return action.short_label;
  }

  if (String(action.favorite_label || action.label || "").toLocaleLowerCase("fr").includes("hors-série")) {
    return "HS";
  }

  return action.favorite_label || action.label;
}

function renderQuickLaunchAccessWarning(resource) {
  const accessMode = getAccessMode(resource);
  if (accessMode !== "remote_conditional" && accessMode !== "onsite_extended") {
    return "";
  }

  const accessLabel = getAccessModeTitle(resource);
  const expanded = isContextNoteOpen(resource.id, "access");
  return `
    <span class="quick-launch-access-warning" role="button" tabindex="0" aria-label="${escapeAttribute(accessLabel)}" title="${escapeAttribute(accessLabel)}" aria-expanded="${String(expanded)}" aria-controls="pressPopularityNote" data-access-note-resource-id="${escapeAttribute(resource.id)}" data-context-note-resource-id="${escapeAttribute(resource.id)}" data-context-note-kind="access">
      !
    </span>
  `;
}

function createQuickLaunchHeader(favorites) {
  const header = document.createElement("div");
  header.className = "section-heading quick-launch-header";
  header.classList.toggle("actions-entering", state.quickLaunchActionsEntering);
  header.classList.toggle("actions-exiting", state.quickLaunchActionsExiting);
  header.classList.toggle("modifier-entering", state.quickLaunchModifierEntering);

  const title = document.createElement("h2");
  if (catalogFavoritesPreview) {
    title.textContent = "Tous les titres et ressources";
  } else {
    title.className = "quick-launch-title";
    title.innerHTML = `${renderResourceCategoryIcon("favorites")}<span>Favoris</span>`;
  }
  header.append(title);

  const actions = document.createElement("div");
  actions.className = "quick-launch-actions";

  if (state.quickLaunchEditing) {
    actions.append(
      createActionButton("Enregistrer", saveQuickLaunchOrder, "save"),
      createActionButton("Annuler", cancelQuickLaunchEdit, "discard"),
    );
    header.append(actions);
    return header;
  }

  if (!catalogFavoritesPreview && favorites.length > 0) {
    const share = document.createElement("button");
    share.className = "quick-launch-action share-shortcut";
    share.type = "button";
    share.setAttribute("aria-label", "Partager ma configuration");
    share.title = "Partager ma configuration";
    share.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.6 6.6-4.2m-6.6 7 6.6 4.2"/></svg>';
    share.addEventListener("click", () => openShareExport(share));
    actions.append(share);
    actions.append(createActionButton("Modifier", startQuickLaunchEdit, "neutral"));
  }

  header.append(actions);
  return header;
}

function createActionButton(label, onClick, tone = "neutral") {
  const button = document.createElement("button");
  button.className = `quick-launch-action ${tone}`;
  button.type = "button";
  button.disabled = state.quickLaunchActionsExiting;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function createQuickLaunchRemoveButton(resource) {
  const button = document.createElement("button");
  button.className = "quick-launch-remove";
  button.type = "button";
  button.setAttribute("aria-label", `Retirer ${resource.name} des favoris`);
  button.title = `Retirer ${resource.name} des favoris`;
  button.dataset.resourceId = resource.id;
  button.addEventListener("click", handleQuickLaunchRemove);
  button.addEventListener("pointerdown", stopQuickLaunchRemoveEvent);
  button.addEventListener("keydown", stopQuickLaunchRemoveEvent);
  button.addEventListener("keyup", stopQuickLaunchRemoveEvent);
  return button;
}

function getFavoriteResources(options = {}) {
  const resources = catalogFavoritesPreview
    ? getAlphaFavoriteResources()
    : getResourcesByIds(listFavoriteResourceIds(state.favoriteLayout));

  let visibleResources = resources.filter((resource) => (
    catalogFavoritesPreview ? getActions(resource).length > 0 : getProfileVisibleActions(resource).length > 0
  ));

  if (catalogFavoritesPreview && state.catalogPreviewEntryType !== "all") {
    visibleResources = visibleResources.filter(resource => getPressEntryTypes(resource).includes(state.catalogPreviewEntryType));
  }

  if (catalogFavoritesPreview && state.catalogPreviewTitleSource !== "all") {
    visibleResources = visibleResources.filter(resource => (
      getPressEntryTypes(resource).includes("press_title")
      && getPressTitleSourceFilterIds(resource).includes(state.catalogPreviewTitleSource)
    ));
  }

  if (catalogFavoritesPreview && !options.ignoreImageFilters) {
    return visibleResources.filter((resource) => {
      const matchesFormat = state.catalogPreviewImageFormats.size === 0
        || state.catalogPreviewImageFormats.has(getCatalogImageFormat(resource.icon_url));
      const matchesSize = !state.catalogPreviewLargeImagesOnly
        || resource.icon_size_bytes > catalogFavoritesLargeImageThresholdBytes;
      const matchesBackground = !state.catalogPreviewBackgroundImagesOnly
        || Boolean(resource.icon_background_image);
      return matchesFormat && matchesSize && matchesBackground;
    });
  }

  return visibleResources;
}

function getAlphaFavoriteResources() {
  return state.resources
    .filter((resource) => state.favorites.has(resource.id) && isCatalogVisible(resource))
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

function getResourcesByIds(ids) {
  const byId = new Map(state.resources.map((resource) => [resource.id, resource]));
  return ids.map((id) => byId.get(id)).filter((resource) => resource && isCatalogVisible(resource));
}

function getResourceById(id) {
  return state.resources.find((resource) => resource.id === id) ?? null;
}

const pressPlatformResourceIds = ["europresse", "pressreader", "indexpresse-business", "factiva"];
const pressPlatformToneIds = {
  europresse: "europresse",
  pressreader: "pressreader",
  "indexpresse-business": "indexpresse_business",
  factiva: "factiva",
};
const pressPlatformCompactLabels = {
  "indexpresse-business": "IndexPresse Bus.",
};
const pressPlatformNarrowLabels = {
  "indexpresse-business": "IndexPresse",
};

function getPressPlatformResources(resources) {
  const byId = new Map(resources.map((resource) => [resource.id, resource]));
  return pressPlatformResourceIds.map((id) => byId.get(id)).filter(Boolean);
}

function renderResourceGrid(options = {}) {
  const renderVersion = ++progressiveRenderVersion;
  const resources = getFilteredResources();
  const resourceEntries = resources.filter(isPressResourceEntry);
  const displayedResourceEntries = shouldShowPressTitleSection()
    ? getPressPlatformResources(resourceEntries)
    : resourceEntries;
  const titleCandidates = shouldShowPressTitleSection()
    ? resources.filter(isPressTitleEntry)
    : [];
  const titleEntries = titleCandidates
    .filter(matchesPressTitleSourceFilter)
    .filter(matchesPressTitleCountryFilter)
    .filter(matchesPressTitleEditorialFilter)
    .filter(matchesPressTitleLocalRegionFilter)
    .filter((resource) => getVisibleActions(resource).length > 0);
  const deferredSections = [];

  const pressCategorySelected = state.category === "Presse";
  resultsSummary.hidden = pressCategorySelected;
  resultsHeading.hidden = true;
  resultCount.textContent = `Total : ${formatSectionCount(displayedResourceEntries.length, "ressource")}`;
  grid.innerHTML = "";
  grid.classList.add("results-grouped");
  grid.dataset.renderComplete = "false";
  if (shouldShowPressTitleSection() && !state.pressLoaded) {
    const status = document.createElement("p");
    status.className = "empty";
    status.setAttribute("role", "status");
    status.textContent = state.pressLoadError ? "Les titres de presse n’ont pas pu être chargés. " : "Chargement des titres de presse…";
    if (state.pressLoadError) {
      const retry = document.createElement("button");
      retry.type = "button";
      retry.textContent = "Réessayer";
      retry.addEventListener("click", () => loadPressCatalog());
      status.append(retry);
    }
    grid.append(status);
  }

  if (!displayedResourceEntries.length && !titleCandidates.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Aucune ressource ne correspond à cette recherche.";
    grid.append(empty);
    grid.dataset.renderComplete = "true";
    playListRefreshAnimation(grid);
    return;
  }

  if (state.category === "Presse") {
    appendPressPlatformSection(displayedResourceEntries);
  } else if (state.category !== "Toutes") {
    appendTaxonomyResourceSections(resourceEntries);
  } else {
    appendResourceSection("Ressources", resourceEntries, "press-resources", {
      cardContext: "resource",
      hideHeading: !shouldShowPressTitleSection(),
    });
  }
  appendResourceSection("Titres de presse", titleEntries, "press-titles", {
    cardContext: "title",
    controls: titleCandidates.length ? createPressTitleFilters(titleCandidates) : null,
    emptyLabel: "Aucun titre de presse ne correspond à ce filtre.",
    showWhenEmpty: shouldShowPressTitleSection() && titleCandidates.length > 0,
  });

  playResourceGridAnimation(options.animationTarget);
  beginProgressiveCardRendering(renderVersion, deferredSections);
  if (state.appRevealed) {
    scheduleBackgroundAssetWarmup();
  }

  function appendResourceSection(title, sectionResources, sectionClass, options = {}) {
    if (!sectionResources.length && !options.showWhenEmpty) {
      return;
    }

    const section = document.createElement("section");
    section.className = `entry-section ${sectionClass}`;
    section.id = sectionClass;
    section.setAttribute("aria-labelledby", `${sectionClass}-heading`);

    const heading = document.createElement("div");
    heading.className = "entry-section-heading";
    heading.hidden = options.hideHeading === true;
    heading.innerHTML = `
      <h2 id="${sectionClass}-heading">${escapeHtml(title)}</h2>
      <p>${formatSectionCount(sectionResources.length, title === "Titres de presse" ? "titre" : "ressource")}</p>
    `;

    const list = document.createElement("div");
    list.className = "entry-grid";

    if (sectionResources.length) {
      const immediateEnd = Math.min(sectionResources.length, initialCardCount);
      appendCardRange(list, sectionResources, 0, immediateEnd, {
        context: options.cardContext,
        showTaxonomyBadges: options.showTaxonomyBadges,
        eager: true,
      });

      if (immediateEnd < sectionResources.length) {
        deferredSections.push({
          list,
          resources: sectionResources,
          nextIndex: immediateEnd,
          context: options.cardContext,
          showTaxonomyBadges: options.showTaxonomyBadges,
        });
      }
    } else {
      const empty = document.createElement("p");
      empty.className = "empty section-empty";
      empty.textContent = options.emptyLabel ?? "Aucune ressource ne correspond à cette recherche.";
      list.append(empty);
    }

    section.append(heading);
    if (options.controls) {
      section.append(options.controls);
    }
    section.append(list);
    grid.append(section);
  }

  function appendPressPlatformSection(platforms) {
    if (!platforms.length) return;

    const section = document.createElement("section");
    section.className = "entry-section press-platforms";
    section.setAttribute("aria-labelledby", "press-platforms-heading");
    section.innerHTML = `
      <div class="entry-section-heading press-platforms-heading">
        <h2 id="press-platforms-heading">Plateformes de presse</h2>
      </div>
      <div class="press-platform-list">
        ${platforms.map((resource) => {
          const action = getVisibleActions(resource)[0];
          const accessMode = getAccessMode(resource);
          const toneId = pressPlatformToneIds[resource.id] ?? "default";
          return `
            <article class="press-platform-item press-platform-${escapeAttribute(toneId)}">
              <div class="press-platform-logo"${logoAppearanceAttributes(resource)}>${renderIcon(resource, true)}</div>
              <strong title="${escapeAttribute(resource.name)}"><span class="press-platform-dot" aria-hidden="true"></span><span class="press-platform-label">${escapeHtml(pressPlatformCompactLabels[resource.id] ?? resource.name)}</span>${pressPlatformNarrowLabels[resource.id] ? `<span class="press-platform-label-narrow">${escapeHtml(pressPlatformNarrowLabels[resource.id])}</span>` : ""}</strong>
              <span class="press-platform-access ${escapeAttribute(accessModeClasses[accessMode] ?? "onsite")}">${escapeHtml(getAccessModeLabel(resource))}</span>
              ${action ? renderActionLink(resource, action, { compactAppearance: true }) : ""}
            </article>
          `;
        }).join("")}
      </div>
    `;
    grid.append(section);
  }

  function appendTaxonomyResourceSections(sectionResources) {
    const root = getResourceTaxonomyIndex().get(state.category);
    const categories = state.resourceTaxonomy?.taxonomy?.categories ?? [];
    const childOrders = state.resourceTaxonomy?.taxonomy?.child_orders ?? {};
    const byParent = new Map();
    categories.forEach((category) => {
      if (!byParent.has(category.parent_id)) byParent.set(category.parent_id, []);
      byParent.get(category.parent_id).push(category);
    });
    for (const [parentId, children] of byParent.entries()) {
      const order = childOrders[parentId] ?? [];
      const orderIndex = new Map(order.map((id, index) => [id, index]));
      children.sort((left, right) => {
        const leftIndex = orderIndex.get(left.id);
        const rightIndex = orderIndex.get(right.id);
        if (leftIndex != null || rightIndex != null) {
          if (leftIndex == null) return 1;
          if (rightIndex == null) return -1;
          return leftIndex - rightIndex;
        }
        return left.label.localeCompare(right.label, "fr", { sensitivity: "base" });
      });
    }
    const children = byParent.get(state.category) ?? [];
    const groupedIds = new Set();

    for (const child of children) {
      const branch = [];
      const collectBranch = (category) => {
        branch.push(category);
        (byParent.get(category.id) ?? []).forEach(collectBranch);
      };
      collectBranch(child);
      for (const category of branch) {
        const categoryResources = sectionResources.filter((resource) => (
          getResourceTaxonomyNodes(resource).some((node) => node.id === category.id)
        ));
        if (!categoryResources.length) continue;
        categoryResources.forEach((resource) => groupedIds.add(resource.id));
        const heading = getResourceTaxonomyAncestors(category)
          .slice(1)
          .map((ancestor) => ancestor.label)
          .join(" › ");
        appendResourceSection(heading, categoryResources, `resource-taxonomy-${category.id}`, {
          cardContext: "resource",
          showTaxonomyBadges: false,
        });
      }
    }

    const ungrouped = sectionResources.filter((resource) => !groupedIds.has(resource.id));
    if (ungrouped.length) {
      appendResourceSection(root?.label ?? "Autres ressources", ungrouped, `resource-taxonomy-${state.category}-other`, {
        cardContext: "resource",
        showTaxonomyBadges: false,
      });
    }
  }
}

function appendCardRange(list, resources, startIndex, endIndex, options = {}) {
  let currentRow = null;

  for (let index = startIndex; index < endIndex; index += 1) {
    if (index % 3 === 0) {
      currentRow = document.createElement("div");
      currentRow.className = "entry-row";
      list.append(currentRow);
    }

    currentRow.append(createCard(resources[index], options.eager === true, {
      context: options.context,
      showTaxonomyBadges: options.showTaxonomyBadges,
    }));
  }

  return endIndex - startIndex;
}

function beginProgressiveCardRendering(renderVersion, sections) {
  pendingProgressiveRender = { renderVersion, sections };

  if (!sections.length) {
    finishProgressiveCardRendering(renderVersion);
    return;
  }

  if (state.appRevealed) {
    scheduleNextCardBatch(renderVersion);
  }
}

function scheduleNextCardBatch(renderVersion) {
  window.requestAnimationFrame(() => {
    requestIdleWork(() => renderNextCardBatch(renderVersion), 120);
  });
}

function renderNextCardBatch(renderVersion) {
  if (renderVersion !== progressiveRenderVersion || pendingProgressiveRender?.renderVersion !== renderVersion) {
    return;
  }

  const section = pendingProgressiveRender.sections.find((item) => item.nextIndex < item.resources.length);

  if (!section) {
    finishProgressiveCardRendering(renderVersion);
    return;
  }

  const endIndex = Math.min(section.resources.length, section.nextIndex + deferredCardBatchSize);
  appendCardRange(section.list, section.resources, section.nextIndex, endIndex, {
    context: section.context,
    showTaxonomyBadges: section.showTaxonomyBadges,
    eager: false,
  });
  section.nextIndex = endIndex;
  scheduleFloatingToolsUpdate();
  scheduleNextCardBatch(renderVersion);
}

function finishProgressiveCardRendering(renderVersion) {
  if (renderVersion !== progressiveRenderVersion) {
    return;
  }

  pendingProgressiveRender = null;
  grid.dataset.renderComplete = "true";
  grid.dispatchEvent(new CustomEvent("bnf:render-complete"));
}

function formatSectionCount(count, label) {
  return `${count} ${label}${count > 1 ? "s" : ""}`;
}

function getPressEntryTypes(resource) {
  return resource.entry_types ?? [];
}

function isPressResourceEntry(resource) {
  return getPressEntryTypes(resource).includes(pressEntryTypes.resource);
}

function isPressTitleEntry(resource) {
  return getPressEntryTypes(resource).includes(pressEntryTypes.title);
}

function shouldShowPressTitleSection() {
  return state.category === "Presse";
}

function createPressTitleFilters(titleCandidates) {
  const container = document.createElement("div");
  const sourceFacetResources = getPressTitleFacetResources(titleCandidates, "source");
  const countryFacetResources = getPressTitleFacetResources(titleCandidates, "country");
  const editorialFacetResources = getPressTitleFacetResources(titleCandidates, "editorial");
  container.className = "entry-filter-panel";
  container.append(createPressTitleSourceFilters(sourceFacetResources));
  container.append(createPressTitleCountryFilters(countryFacetResources, titleCandidates));
  container.append(createPressTitleEditorialFilters(editorialFacetResources, titleCandidates));
  return container;
}

function createPressTitleSourceFilters(resources) {
  const wrapper = document.createElement("div");
  wrapper.className = "entry-source-filter";

  const label = document.createElement("span");
  label.className = "entry-source-filter-label";
  label.textContent = "Source";

  const container = document.createElement("div");
  container.className = "entry-subfilters";
  container.setAttribute("aria-label", "Filtrer les titres de presse par source");

  for (const filter of getPressTitleSourceOptions(resources)) {
    const button = document.createElement("button");
    const title = filter.id === pressTitleAllFilterValue
      ? `Toutes les sources (${filter.count} titres)`
      : `${filter.label} (${filter.count} titres)`;
    button.className = "filter-button entry-subfilter";
    if (filter.id !== pressTitleAllFilterValue) button.classList.add(`source-${filter.id}`);
    button.type = "button";
    button.disabled = isPressTitleFacetOptionDisabled(filter);
    button.title = title;
    button.setAttribute("aria-label", title);
    button.setAttribute("aria-pressed", String(filter.id === state.pressTitleSourceFilter));
    button.innerHTML = `
      ${filter.id === pressTitleAllFilterValue ? "" : '<span class="entry-source-dot" aria-hidden="true"></span>'}
      <span>${escapeHtml(filter.label)}</span>
      <span class="entry-subfilter-count">${filter.count}</span>
    `;
    button.addEventListener("click", () => {
      state.pressTitleSourceFilter = filter.id;
      renderResourceGrid({ animationTarget: "press-titles" });
    });
    container.append(button);
  }

  wrapper.append(label, container);
  return wrapper;
}

function createPressTitleCountryFilters(resources, allResources = resources) {
  const wrapper = document.createElement("div");
  wrapper.className = "entry-country-filter";

  const label = document.createElement("span");
  label.className = "entry-country-filter-label";
  label.textContent = "Pays";

  const controls = document.createElement("div");
  controls.className = "entry-country-filter-control";
  controls.setAttribute("aria-label", "Filtrer les titres de presse par pays");

  const countryOptions = getPressTitleCountryOptions(resources, allResources);
  const primaryOptions = countryOptions.filter((option) => (
    option.promoted && shouldShowPressTitleCountryOption(option)
  ));
  const extraOptions = countryOptions.filter((option) => (
    !option.promoted && shouldShowPressTitleCountryOption(option)
  ));
  const selectedExtraOptions = extraOptions.filter((option) => state.pressTitleCountryFilter.has(option.id));

  controls.append(createPressTitleCountryButton({
    id: "",
    label: "Tous",
    count: resources.length,
    isActive: state.pressTitleCountryFilter.size === 0,
  }));

  for (const option of primaryOptions) {
    controls.append(createPressTitleCountryButton({
      ...option,
      isActive: state.pressTitleCountryFilter.has(option.id),
    }));
  }

  const extraSelectOptions = extraOptions.filter((option) => !state.pressTitleCountryFilter.has(option.id));
  if (extraSelectOptions.length > 0) {
    const select = document.createElement("select");
    select.className = "entry-country-filter-select";
    select.title = "Ajouter un autre pays";
    select.setAttribute("aria-label", "Ajouter un autre pays");
    select.innerHTML = `
      <option value="">+</option>
      ${extraSelectOptions
        .map((option) => `<option value="${escapeAttribute(option.id)}">${escapeHtml(option.label)} (${option.count})</option>`)
        .join("")}
    `;
    select.addEventListener("change", (event) => {
      const code = event.target.value;
      if (code) {
        updatePressTitleCountryFilter(code);
      }
      event.target.value = "";
    });
    controls.append(select);
  }

  for (const option of selectedExtraOptions) {
    controls.append(createPressTitleCountryButton({
      ...option,
      isActive: true,
    }));
  }

  wrapper.append(label, controls);
  return wrapper;
}

function createPressTitleCountryButton({ id, label, count, flagUrl, isActive }) {
  const button = document.createElement("button");
  button.className = "entry-country-filter-button";
  button.classList.toggle("is-active", isActive);
  button.type = "button";
  button.title = id ? `${label} (${count} titres)` : "Tous les pays";
  button.setAttribute("aria-label", button.title);
  button.setAttribute("aria-pressed", String(isActive));
  button.innerHTML = id
    ? `${renderPressTitleCountryFilterFlag(flagUrl, label, id)}<span class="entry-country-filter-count">${count}</span>`
    : `<span class="entry-country-filter-all">Tous</span><span class="entry-country-filter-count">${count}</span>`;
  button.addEventListener("click", () => {
    updatePressTitleCountryFilter(id);
  });
  return button;
}

function shouldShowPressTitleCountryOption(option) {
  return option.count > 0 || state.pressTitleCountryFilter.has(option.id);
}

function renderPressTitleCountryFilterFlag(flagUrl, label, code) {
  if (flagUrl) {
    return `<img class="entry-country-filter-flag" src="${escapeAttribute(flagUrl)}" alt="" decoding="async">`;
  }

  return `<span class="entry-country-filter-fallback" aria-hidden="true">${escapeHtml(String(code || label).toLocaleUpperCase("fr").slice(0, 2))}</span>`;
}

function updatePressTitleCountryFilter(code) {
  state.pressTitleLocalRegionPanelOpening = false;
  state.pressTitleLocalCountryScope = "";
  state.pressTitleLocalRegionFilter = "";
  if (!code) {
    state.pressTitleCountryFilter.clear();
  } else if (state.pressTitleCountryFilter.has(code)) {
    state.pressTitleCountryFilter.delete(code);
  } else {
    state.pressTitleCountryFilter.add(code);
  }

  renderResourceGrid({ animationTarget: "press-titles" });
}

function getPressTitleFacetResources(resources, facet) {
  return resources.filter((resource) => (
    (facet === "source" || matchesPressTitleSourceFilter(resource)) &&
    (facet === "country" || matchesPressTitleCountryFilter(resource)) &&
    (facet === "editorial" || matchesPressTitleEditorialFilter(resource)) &&
    (facet === "country" || facet === "editorial" || matchesPressTitleLocalRegionFilter(resource))
  ));
}

function createPressTitleLocalRegionFilters(resources) {
  if (!isPressTitleEditorialFilterActive("quotidien_regional_local")) return null;
  if (state.pressTitleCountryFilter.size > 0 && !state.pressTitleCountryFilter.has("fr")) return null;

  const country = state.localGeography?.countries?.find((item) => item.id === "fr");
  if (!country?.subdivisions?.length) return null;

  const allEligibleResources = resources.filter((resource) => (
    matchesPressTitleSourceFilter(resource)
    && matchesPressTitleCountryFilter(resource)
    && matchesPressTitleEditorialFilter(resource)
  ));
  const eligibleResources = allEligibleResources.filter((resource) => resource.country_code === "fr");
  const counts = countByMany(eligibleResources, (resource) => resource.local_region_codes ?? []);
  const options = country.subdivisions.filter((region) => (
    (counts.get(region.id) || 0) > 0 || state.pressTitleLocalRegionFilter === region.id
  ));
  if (!options.length) return null;

  const expansion = document.createElement("div");
  expansion.className = "entry-local-region-expansion";
  expansion.classList.toggle("is-opening", state.pressTitleLocalRegionPanelOpening);
  state.pressTitleLocalRegionPanelOpening = false;
  const wrapper = document.createElement("div");
  wrapper.className = "entry-local-region-filter";
  const controls = document.createElement("div");
  controls.className = "entry-local-region-filter-control";
  controls.setAttribute("aria-label", "Filtrer la presse locale par pays ou région française");

  const allButton = document.createElement("button");
  const isAllActive = !state.pressTitleLocalRegionFilter && !state.pressTitleLocalCountryScope;
  allButton.className = "entry-local-region-filter-button is-country-scope";
  allButton.classList.toggle("is-active", isAllActive);
  allButton.type = "button";
  allButton.title = `Tous les titres locaux (${allEligibleResources.length} titres)`;
  allButton.setAttribute("aria-label", allButton.title);
  allButton.setAttribute("aria-pressed", String(isAllActive));
  allButton.innerHTML = `<span>Tous</span><span class="entry-local-region-filter-count">${allEligibleResources.length}</span>`;
  allButton.addEventListener("click", () => {
    state.pressTitleLocalRegionPanelOpening = false;
    state.pressTitleLocalCountryScope = "";
    state.pressTitleLocalRegionFilter = "";
    renderResourceGrid({ animationTarget: "press-titles" });
  });
  controls.append(allButton);

  const franceButton = document.createElement("button");
  const isFranceActive = (
    !state.pressTitleLocalRegionFilter
    && state.pressTitleLocalCountryScope === "fr"
  );
  franceButton.className = "entry-local-region-filter-button is-country-scope";
  franceButton.classList.toggle("is-active", isFranceActive);
  franceButton.type = "button";
  franceButton.title = `${country.label}, toutes les régions (${eligibleResources.length} titres)`;
  franceButton.setAttribute("aria-label", franceButton.title);
  franceButton.setAttribute("aria-pressed", String(isFranceActive));
  franceButton.innerHTML = `<span>${escapeHtml(country.label)}</span><span class="entry-local-region-filter-count">${eligibleResources.length}</span>`;
  franceButton.addEventListener("click", () => {
    state.pressTitleLocalRegionPanelOpening = false;
    state.pressTitleLocalCountryScope = "fr";
    state.pressTitleLocalRegionFilter = "";
    renderResourceGrid({ animationTarget: "press-titles" });
  });
  controls.append(franceButton);

  const separator = document.createElement("span");
  separator.className = "entry-local-region-filter-separator";
  separator.textContent = "|";
  separator.setAttribute("aria-hidden", "true");
  controls.append(separator);

  for (const region of options) {
    const count = counts.get(region.id) || 0;
    const button = document.createElement("button");
    const isActive = state.pressTitleLocalRegionFilter === region.id;
    button.className = "entry-local-region-filter-button";
    button.classList.toggle("is-active", isActive);
    button.type = "button";
    button.title = `${region.label} (${count} titres)`;
    button.setAttribute("aria-label", button.title);
    button.setAttribute("aria-pressed", String(isActive));
    button.innerHTML = `<span>${escapeHtml(region.label)}</span><span class="entry-local-region-filter-count">${count}</span>`;
    button.addEventListener("click", () => {
      state.pressTitleLocalRegionPanelOpening = false;
      state.pressTitleLocalRegionFilter = isActive ? "" : region.id;
      state.pressTitleLocalCountryScope = "fr";
      renderResourceGrid({ animationTarget: "press-titles" });
    });
    controls.append(button);
  }

  wrapper.append(controls);
  expansion.append(wrapper);
  return expansion;
}

function getPressTitleEditorialLayoutMode() {
  if (pressTitleNarrowLayoutQuery.matches) return "narrow";
  if (pressTitleMediumLayoutQuery.matches) return "medium";
  return "wide";
}

function getPressTitleEditorialRootId(categoryId) {
  const byId = state.editorialTaxonomyIndex;
  let category = byId.get(categoryId);

  while (category?.parent_id) {
    category = byId.get(category.parent_id);
  }

  return category?.id || "";
}

function getPressTitleEditorialExpandedBranches(branchIds) {
  const mode = getPressTitleEditorialLayoutMode();
  const preferences = state.pressTitleEditorialExpandedBranches[mode];
  const activeRoots = new Set(
    [...state.pressTitleEditorialFilters]
      .map(getPressTitleEditorialRootId)
      .filter((id) => branchIds.includes(id)),
  );

  return new Set(branchIds.filter((id, index) => {
    if (preferences.has(id)) return preferences.get(id);
    if (mode === "wide") return true;
    if (activeRoots.size) return activeRoots.has(id);
    return mode === "medium" && index === 0;
  }));
}

function applyPressTitleEditorialBranchExpansion(branch, expanded) {
  const label = branch.getAttribute("aria-label") || "cette catégorie";
  const disclosure = branch.querySelector(".entry-type-branch-toggle");
  const childrenShell = branch.querySelector(".entry-type-children-shell");
  branch.classList.toggle("is-expanded", expanded);

  if (disclosure) {
    const action = expanded ? "Replier" : "Déplier";
    disclosure.setAttribute("aria-expanded", String(expanded));
    disclosure.setAttribute("aria-label", `${action} ${label}`);
    disclosure.title = `${action} ${label}`;
  }

  if (childrenShell) {
    childrenShell.setAttribute("aria-hidden", String(!expanded));
    childrenShell.querySelectorAll("button").forEach((button) => {
      button.tabIndex = expanded ? 0 : -1;
    });
  }

  const localExpansion = branch.nextElementSibling;
  if (localExpansion?.classList.contains("entry-local-region-expansion")) {
    localExpansion.hidden = !expanded;
  }
}

function syncPressTitleEditorialBranchExpansion() {
  const taxonomy = document.querySelector(".entry-type-taxonomy");
  if (!taxonomy) return;
  const branches = [...taxonomy.querySelectorAll(".entry-type-branch.has-children[data-editorial-branch-id]")];
  const branchIds = branches.map((branch) => branch.dataset.editorialBranchId);
  const expanded = getPressTitleEditorialExpandedBranches(branchIds);

  branches.forEach((branch) => {
    applyPressTitleEditorialBranchExpansion(branch, expanded.has(branch.dataset.editorialBranchId));
  });
}

function togglePressTitleEditorialBranch(branch) {
  const taxonomy = branch.closest(".entry-type-taxonomy");
  const branches = [...taxonomy.querySelectorAll(".entry-type-branch.has-children[data-editorial-branch-id]")];
  const branchIds = branches.map((candidate) => candidate.dataset.editorialBranchId);
  const expanded = getPressTitleEditorialExpandedBranches(branchIds);
  const branchId = branch.dataset.editorialBranchId;
  const nextExpanded = !expanded.has(branchId);
  state.pressTitleEditorialExpandedBranches[getPressTitleEditorialLayoutMode()].set(branchId, nextExpanded);
  applyPressTitleEditorialBranchExpansion(branch, nextExpanded);
}

function getPressTitleEditorialRootIcon(id) {
  const paths = pressTitleEditorialRootIcons[id];
  if (!paths) return "";

  return `<svg class="entry-type-parent-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

function createPressTitleEditorialFilters(resources, allResources = resources) {
  const wrapper = document.createElement("div");
  wrapper.className = "entry-type-filter";

  const label = document.createElement("span");
  label.className = "entry-type-filter-label";
  label.textContent = "Type";

  const container = document.createElement("div");
  container.className = "entry-subfilters entry-type-subfilters";
  container.setAttribute("aria-label", "Filtrer les titres de presse par type");

  const options = getPressTitleEditorialOptions(resources, allResources);
  const utilityFilters = document.createElement("div");
  utilityFilters.className = "entry-type-utilities";
  const taxonomyFilters = document.createElement("div");
  taxonomyFilters.className = "entry-type-taxonomy";
  let branch = null;
  let branchChildren = null;
  let branchChildrenShell = null;
  let localRegionBranch = null;

  for (const [index, filter] of options.entries()) {
    const button = document.createElement("button");
    const hasChildren = filter.depth === 0 && Number.isInteger(options[index + 1]?.depth) && options[index + 1].depth > 0;
    const title = filter.id === pressTitleFavoriteFilterValue
      ? `Titres de presse favoris (${filter.count} titres)`
      : filter.id === pressTitleRecommendedFilterValue
      ? `Titres de presse recommandés (${filter.count} titres)`
      : filter.id === pressTitlePopularFilterValue
      ? `Titres de presse populaires selon les classements de référence (${filter.count} titres)`
      : filter.id === pressTitleAllFilterValue
      ? state.pressTitleEditorialMode === "all" && state.pressTitleEditorialRestoreSnapshot
        ? `Tous les types (${filter.count} titres). Réafficher la dernière sélection`
        : `Tous les types (${filter.count} titres)`
      : hasChildren
      ? `${filter.label} et ses sous-catégories (${filter.count} titres)`
      : `${filter.label} (${filter.count} titres)`;
    button.className = "filter-button entry-subfilter entry-type-subfilter";
    button.classList.toggle("is-taxonomy-filter", Number.isInteger(filter.depth));
    button.classList.toggle("favorite-filter", filter.id === pressTitleFavoriteFilterValue);
    button.classList.toggle("recommended-filter", filter.id === pressTitleRecommendedFilterValue);
    button.classList.toggle("popular-filter", filter.id === pressTitlePopularFilterValue);
    button.type = "button";
    button.disabled = isPressTitleFacetOptionDisabled(filter);
    button.title = title;
    button.setAttribute("aria-label", title);
    button.setAttribute("aria-pressed", String(isPressTitleEditorialFilterActive(filter.id)));
    if (Number.isInteger(filter.depth)) {
      button.style.setProperty("--editorial-depth", String(filter.depth));
      button.dataset.depth = String(filter.depth);
    }
    if (filter.id === "quotidien_regional_local") {
      button.classList.add("is-local-region-trigger");
    }
    const utilityIcon = getPressTitleUtilityFilterIcon(filter.id);
    button.innerHTML = `
      <span class="entry-subfilter-label">${utilityIcon}<span class="entry-subfilter-label-text">${escapeHtml(filter.label)}</span></span>
      <span class="entry-subfilter-count">${filter.count}</span>
      ${filter.depth === 0 ? getPressTitleEditorialRootIcon(filter.id) : ""}
    `;
    button.addEventListener("click", () => {
      if (filter.id === pressTitleAllFilterValue) {
        togglePressTitleEditorialAllFilter();
      } else if (filter.id === pressTitleFavoriteFilterValue) {
        togglePressTitleFavoriteFilter();
      } else if (filter.id === pressTitleRecommendedFilterValue) {
        togglePressTitleRecommendedFilter();
      } else if (filter.id === pressTitlePopularFilterValue) {
        togglePressTitlePopularFilter();
      } else {
        togglePressTitleTaxonomyFilter(filter.id);
      }
      renderResourceGrid({ animationTarget: "press-titles" });
    });
    if (!Number.isInteger(filter.depth)) {
      utilityFilters.append(button);
      continue;
    }
    if (filter.depth === 0 || !branch) {
      branch = document.createElement("div");
      branch.className = "entry-type-branch";
      branch.setAttribute("role", "group");
      branch.setAttribute("aria-label", filter.label);
      branch.dataset.editorialBranchId = filter.id;
      button.classList.add("entry-type-parent-filter");
      if (hasChildren) branch.classList.add("has-children");
      if (button.getAttribute("aria-pressed") === "true") branch.classList.add("is-parent-active");
      taxonomyFilters.append(branch);
      branchChildren = null;
      branchChildrenShell = null;

      branch.append(button);

      if (hasChildren) {
        const disclosure = document.createElement("button");
        disclosure.className = "entry-type-branch-toggle";
        disclosure.type = "button";
        disclosure.innerHTML = '<span class="entry-type-branch-chevron" aria-hidden="true"></span>';
        disclosure.addEventListener("click", (event) => {
          togglePressTitleEditorialBranch(event.currentTarget.closest(".entry-type-branch"));
        });
        branch.append(disclosure);
      }
      continue;
    }
    if (!branchChildren) {
      branchChildrenShell = document.createElement("div");
      branchChildrenShell.className = "entry-type-children-shell";
      branchChildren = document.createElement("div");
      branchChildren.className = "entry-type-children";
      branchChildren.id = `entry-type-children-${branch.dataset.editorialBranchId}`;
      branch.querySelector(".entry-type-branch-toggle")?.setAttribute("aria-controls", branchChildren.id);
      branchChildrenShell.append(branchChildren);
      branch.append(branchChildrenShell);
    }
    button.classList.add("entry-type-child-filter");
    if (button.getAttribute("aria-pressed") === "true") branch.classList.add("has-active-child");
    branchChildren.append(button);
    if (filter.id === "quotidien_regional_local") localRegionBranch = branch;
  }

  const branches = [...taxonomyFilters.querySelectorAll(".entry-type-branch.has-children")];
  const branchIds = branches.map((candidate) => candidate.dataset.editorialBranchId);
  const expandedBranches = getPressTitleEditorialExpandedBranches(branchIds);
  branches.forEach((candidate) => {
    const activeChildCount = candidate.querySelectorAll('.entry-type-child-filter[aria-pressed="true"]').length;
    if (activeChildCount) {
      const activeCount = document.createElement("span");
      activeCount.className = "entry-type-active-count";
      activeCount.textContent = String(activeChildCount);
      activeCount.title = `${activeChildCount} sous-catégorie${activeChildCount > 1 ? "s" : ""} active${activeChildCount > 1 ? "s" : ""}`;
      candidate.querySelector(".entry-type-parent-filter")?.append(activeCount);
    }
    applyPressTitleEditorialBranchExpansion(
      candidate,
      expandedBranches.has(candidate.dataset.editorialBranchId),
    );
  });

  const localRegionFilters = createPressTitleLocalRegionFilters(allResources);
  if (localRegionFilters && localRegionBranch) {
    localRegionBranch.classList.add("has-local-region-expansion");
    localRegionBranch.after(localRegionFilters);
    localRegionFilters.hidden = !localRegionBranch.classList.contains("is-expanded");
  }

  container.append(utilityFilters, taxonomyFilters);

  wrapper.append(label, container);
  return wrapper;
}

function isPressTitleFacetOptionDisabled(filter) {
  return (
    filter.id !== pressTitleAllFilterValue
    && !isPressTitleEditorialFilterActive(filter.id)
    && filter.count === 0
  );
}

function getPressTitleSourceOptions(resources) {
  const counts = countByMany(resources, getPressTitleSourceFilterIds);

  return pressTitleSourceFilters.map((filter) => ({
    ...filter,
    count: filter.id === pressTitleAllFilterValue
      ? resources.length
      : counts.get(filter.id) || 0,
  }));
}

function getPressTitleCountryOptions(resources, allResources = resources) {
  const counts = countBy(resources, (resource) => resource.country_code || "unknown");
  const baseCounts = countBy(allResources, (resource) => resource.country_code || "unknown");
  const metadata = getPressTitleCountryMetadata(allResources);
  const countryIds = new Set(
    [...baseCounts]
      .filter(([id, count]) => isPromotedPressTitleCountry(id, count))
      .map(([id]) => id),
  );

  for (const code of state.pressTitleCountryFilter) {
    if (metadata.has(code)) {
      countryIds.add(code);
    }
  }

  for (const code of counts.keys()) {
    countryIds.add(code);
  }

  const sortedCountries = sortPressTitleCountries(
    [...countryIds].map((id) => [id, counts.get(id) || 0]),
    metadata,
    baseCounts,
  );

  return sortedCountries.map(([id, count]) => ({
    id,
    count,
    label: metadata.get(id)?.label || id,
    flagUrl: metadata.get(id)?.flagUrl || "",
    promoted: isPromotedPressTitleCountry(id, baseCounts.get(id) || 0),
  }));
}

function getPressTitleCountryMetadata(resources) {
  const metadata = new Map();

  for (const resource of resources) {
    const id = resource.country_code || "unknown";
    if (!metadata.has(id)) {
      metadata.set(id, {
        label: resource.country_label || "À contrôler",
        flagUrl: resource.country_flag_url || "",
      });
    }
  }

  return metadata;
}

function sortPressTitleCountries(entries, metadata, baseCounts = new Map()) {
  const promoted = [];
  const regular = [];

  for (const entry of entries) {
    const [id, count] = entry;
    const baseCount = baseCounts.get(id) || count;
    if (isPromotedPressTitleCountry(id, baseCount)) {
      promoted.push(entry);
    } else {
      regular.push(entry);
    }
  }

  promoted.sort((a, b) => (
    (baseCounts.get(b[0]) || b[1]) - (baseCounts.get(a[0]) || a[1]) ||
    comparePressTitleCountryLabels(a, b, metadata)
  ));
  regular.sort((a, b) => comparePressTitleCountryLabels(a, b, metadata));

  return [...promoted, ...regular];
}

function isPromotedPressTitleCountry(id, count) {
  return promotedPressTitleCountryCodes.has(id) || count >= promotedPressTitleCountryMinimumCount;
}

function comparePressTitleCountryLabels(a, b, metadata) {
  return (metadata.get(a[0])?.label || "").localeCompare(metadata.get(b[0])?.label || "", "fr");
}

function getPressTitleEditorialOptions(resources, allResources = resources) {
  const activeIds = activeEditorialCategoryIds(state.editorialTaxonomy, allResources);
  activeIds.delete("presse");
  const rows = orderedCategoryRows(state.editorialTaxonomy, { activeIds });
  const favoriteCount = resources.filter((resource) => state.favorites.has(resource.id)).length;
  const recommendedCount = resources.filter((resource) => resource.recommended).length;
  const popularCount = resources.filter((resource) => state.popularPressTitleIds.has(resource.id)).length;

  const taxonomyOptions = rows
    .map((row) => ({
      id: row.id,
      label: row.label,
      path: row.path,
      depth: row.depth,
      count: getPressTitleEditorialOptionCount(row.id, resources),
    }))
    .filter((row) => row.count > 0);

  return [
    { id: pressTitleAllFilterValue, label: "Tous", count: resources.length },
    { id: pressTitleFavoriteFilterValue, label: "Favoris", count: favoriteCount },
    { id: pressTitleRecommendedFilterValue, label: "Recommandées", count: recommendedCount },
    { id: pressTitlePopularFilterValue, label: "Populaires", count: popularCount },
    ...taxonomyOptions,
  ];
}

function getPressTitleUtilityFilterIcon(filterId) {
  const paths = {
    [pressTitleFavoriteFilterValue]: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z"/>',
    [pressTitleRecommendedFilterValue]: '<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>',
    [pressTitlePopularFilterValue]: '<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10"/><path d="M17 4v5a5 5 0 0 1-10 0V4"/><path d="M5 9H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4"/><path d="M19 9h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4"/>',
  }[filterId];

  return paths
    ? `<svg class="press-title-utility-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
    : "";
}

function getPressTitleEditorialOptionCount(categoryId, resources) {
  const active = isPressTitleEditorialFilterActive(categoryId);
  const selection = active
    ? getPressTitleEditorialSelection()
    : getNextPressTitleEditorialSelection(categoryId);
  const keepsLocalScope = pressTitleEditorialSelectionIncludesLocal(selection);
  const localCountryScope = keepsLocalScope ? state.pressTitleLocalCountryScope : "";
  const localRegionFilter = keepsLocalScope ? state.pressTitleLocalRegionFilter : "";

  return resources.filter((resource) => (
    matchesPressTitleEditorialFilter(resource, selection)
    && matchesPressTitleLocalRegionFilter(resource, { localCountryScope, localRegionFilter })
  )).length;
}

function getPressTitleEditorialSelection() {
  return {
    mode: state.pressTitleEditorialMode,
    ids: new Set(state.pressTitleEditorialFilters),
  };
}

function getNextPressTitleEditorialSelection(categoryId) {
  const category = state.editorialTaxonomyIndex.get(categoryId);
  if (!category) return getPressTitleEditorialSelection();

  const current = getPressTitleEditorialSelection();
  const ids = current.mode === "categories" ? new Set(current.ids) : new Set();

  if (ids.has(categoryId)) {
    ids.delete(categoryId);
  } else {
    ids.add(categoryId);
  }

  return ids.size
    ? { mode: "categories", ids }
    : { mode: "all", ids: new Set() };
}

function isPressTitleEditorialFilterActive(filterId) {
  if (filterId === pressTitleAllFilterValue) return state.pressTitleEditorialMode === "all";
  if (filterId === pressTitleFavoriteFilterValue) return state.pressTitleEditorialMode === "favorites";
  if (filterId === pressTitleRecommendedFilterValue) return state.pressTitleEditorialMode === "recommended";
  if (filterId === pressTitlePopularFilterValue) return state.pressTitleEditorialMode === "popular";
  return state.pressTitleEditorialFilters.has(filterId);
}

function pressTitleEditorialSelectionIncludesLocal(selection = getPressTitleEditorialSelection()) {
  return selection.mode === "categories" && selection.ids.has("quotidien_regional_local");
}

function applyPressTitleEditorialSelection(selection) {
  state.pressTitleEditorialMode = selection.mode;
  state.pressTitleEditorialFilters = new Set(selection.ids ?? []);

  if (!pressTitleEditorialSelectionIncludesLocal(selection)) {
    state.pressTitleLocalCountryScope = "";
    state.pressTitleLocalRegionFilter = "";
  }
}

function togglePressTitleTaxonomyFilter(categoryId) {
  const hadLocal = pressTitleEditorialSelectionIncludesLocal();
  const next = getNextPressTitleEditorialSelection(categoryId);
  const hasLocal = pressTitleEditorialSelectionIncludesLocal(next);
  state.pressTitleEditorialRestoreSnapshot = null;
  state.pressTitleLocalRegionPanelOpening = !hadLocal && hasLocal;
  applyPressTitleEditorialSelection(next);
}

function togglePressTitleFavoriteFilter() {
  state.pressTitleEditorialRestoreSnapshot = null;
  state.pressTitleLocalRegionPanelOpening = false;
  applyPressTitleEditorialSelection(
    state.pressTitleEditorialMode === "favorites"
      ? { mode: "all", ids: new Set() }
      : { mode: "favorites", ids: new Set() },
  );
}

function togglePressTitleRecommendedFilter() {
  state.pressTitleEditorialRestoreSnapshot = null;
  state.pressTitleLocalRegionPanelOpening = false;
  applyPressTitleEditorialSelection(
    state.pressTitleEditorialMode === "recommended"
      ? { mode: "all", ids: new Set() }
      : { mode: "recommended", ids: new Set() },
  );
}

function togglePressTitlePopularFilter() {
  state.pressTitleEditorialRestoreSnapshot = null;
  state.pressTitleLocalRegionPanelOpening = false;
  applyPressTitleEditorialSelection(
    state.pressTitleEditorialMode === "popular"
      ? { mode: "all", ids: new Set() }
      : { mode: "popular", ids: new Set() },
  );
}

function capturePressTitleEditorialSnapshot() {
  return {
    mode: state.pressTitleEditorialMode,
    ids: [...state.pressTitleEditorialFilters],
    localCountryScope: state.pressTitleLocalCountryScope,
    localRegionFilter: state.pressTitleLocalRegionFilter,
  };
}

function togglePressTitleEditorialAllFilter() {
  const now = performance.now();
  if (now - state.pressTitleEditorialAllLastToggleAt < 250) return;
  state.pressTitleEditorialAllLastToggleAt = now;
  state.pressTitleLocalRegionPanelOpening = false;

  if (state.pressTitleEditorialMode === "all") {
    const snapshot = state.pressTitleEditorialRestoreSnapshot;
    if (!snapshot) return;
    applyPressTitleEditorialSelection({
      mode: snapshot.mode,
      ids: new Set(snapshot.ids),
    });
    state.pressTitleLocalCountryScope = snapshot.localCountryScope;
    state.pressTitleLocalRegionFilter = snapshot.localRegionFilter;
    return;
  }

  state.pressTitleEditorialRestoreSnapshot = capturePressTitleEditorialSnapshot();
  applyPressTitleEditorialSelection({ mode: "all", ids: new Set() });
}

function countBy(items, getKey) {
  const counts = new Map();
  for (const item of items) {
    const key = getKey(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

function countByMany(items, getKeys) {
  const counts = new Map();
  for (const item of items) {
    for (const key of getKeys(item)) {
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  return counts;
}

function matchesPressTitleSourceFilter(resource) {
  if (state.pressTitleSourceFilter === pressTitleAllFilterValue) {
    return true;
  }

  return getPressTitleSourceFilterIds(resource).includes(state.pressTitleSourceFilter);
}

function matchesPressTitleCountryFilter(resource) {
  if (state.pressTitleCountryFilter.size === 0) {
    return true;
  }

  return state.pressTitleCountryFilter.has(resource.country_code || "unknown");
}

function matchesPressTitleEditorialFilter(resource, selection) {
  if (!selection || typeof selection !== "object" || !(selection.ids instanceof Set)) {
    selection = getPressTitleEditorialSelection();
  }

  if (selection.mode === "favorites") {
    return state.favorites.has(resource.id);
  }

  if (selection.mode === "recommended") {
    return Boolean(resource.recommended);
  }

  if (selection.mode === "popular") {
    return state.popularPressTitleIds.has(resource.id);
  }

  if (selection.mode === "all") {
    return true;
  }

  const resourceTags = resource.topic_ids || [];
  return [...selection.ids].every((categoryId) => {
    const acceptedIds = new Set(descendantCategoryIds(state.editorialTaxonomy, categoryId));
    return resourceTags.some((tag) => acceptedIds.has(tag));
  });
}

function matchesPressTitleLocalRegionFilter(resource, options = {}) {
  if (!options || typeof options !== "object") options = {};
  const localCountryScope = options.localCountryScope ?? state.pressTitleLocalCountryScope;
  const localRegionFilter = options.localRegionFilter ?? state.pressTitleLocalRegionFilter;
  if (localCountryScope && resource.country_code !== localCountryScope) return false;
  if (!localRegionFilter) return true;
  return (resource.local_region_codes ?? []).includes(localRegionFilter);
}

function getPressTitleSourceFilterId(resource) {
  return getPressTitleSourceFilterIds(resource)[0] || "direct";
}

function getPressTitleSourceFilterIds(resource) {
  if (Array.isArray(resource.provider_ids) && resource.provider_ids.length) {
    return resource.provider_ids.filter((id) => pressTitleSourceFilters.some((filter) => filter.id === id));
  }

  return [];
}

function getProviderLabel(resource) {
  return state.providers.find((provider) => provider.id === resource.provider_ids?.[0])?.label ?? "";
}

function shouldShowPressTitleProviderBadge(resource, context) {
  const label = getProviderLabel(resource);
  return context === "title" && !isActivePressTitleSourceBadge(resource, label, context);
}

function shouldShowSecondaryCategoryBadge(resource, category, context) {
  return !isTitleSourceCategoryBadge(category, context)
    && !isRedundantPressCategoryBadge(category)
    && !isActivePressTitleSourceBadge(resource, category, context);
}

function isTitleSourceCategoryBadge(category, context) {
  return context !== "title"
    && pressTitleSourceFilters.some((filter) => filter.id !== "all" && filter.label === category);
}

function isRedundantPressCategoryBadge(category) {
  return category === "Presse" && shouldShowPressTitleSection();
}

function isActivePressTitleSourceBadge(resource, category, context) {
  if (!shouldShowPressTitleSection() || state.pressTitleSourceFilter === "all") {
    return false;
  }

  if (context !== "title") {
    return false;
  }

  if (!isPressTitleEntry(resource)) {
    return false;
  }

  const activeFilter = pressTitleSourceFilters.find((filter) => filter.id === state.pressTitleSourceFilter);
  if (!activeFilter || activeFilter.id === "all") {
    return false;
  }

  return getPressTitleSourceFilterIds(resource).includes(activeFilter.id)
    && category === activeFilter.label;
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

function createCard(resource, eagerLogo = false, options = {}) {
  const card = document.createElement("article");
  const context = options.context ?? "resource";
  const hasAccessInstruction = Boolean(resource.access_instruction?.text?.trim());
  const hasEditorialNotice = Boolean(resource.editorial_notice?.text?.trim());
  const hasCardNotice = hasAccessInstruction || hasEditorialNotice;
  const hasEditionOptions = Array.isArray(resource.edition_options) && resource.edition_options.length > 0;
  const cardClasses = [
    "card",
    context === "title" ? "press-title-card" : "resource-card",
    hasAccessInstruction ? "has-access-instruction" : "",
    hasEditorialNotice ? "has-editorial-notice" : "",
    hasCardNotice ? "has-card-notice" : "",
    hasEditionOptions ? "has-edition-options" : "",
  ].filter(Boolean);
  card.className = cardClasses.join(" ");

  const access = (resource.access ?? []).map((item) => accessLabels[item] ?? item);
  const accessMode = getAccessMode(resource);
  const accessModeLabel = getAccessModeLabel(resource);
  const accessModeClass = accessModeClasses[accessMode] ?? "onsite";
  const accessModeTitle = getAccessModeTitle(resource);
  const isFavorite = state.favorites.has(resource.id);
  const logo = resource.icon_url
    ? renderIcon(resource, eagerLogo)
    : `<span>${escapeHtml(getFallbackLabel(resource))}</span>`;
  const description = resource.description?.trim();
  const officialDescription = context === "resource"
    ? [...new Set((resource.bnf_official?.entries ?? []).map((entry) => entry.description?.trim()).filter(Boolean))].join("\n\n")
    : "";
  const hasOfficialDescription = Boolean(officialDescription && officialDescription !== description);
  const showingOfficialDescription = hasOfficialDescription && state.officialDescriptionResources.has(resource.id);
  const activeDescription = showingOfficialDescription ? officialDescription : description;
  const descriptionToggleHtml = hasOfficialDescription
    ? `<button class="description-toggle" type="button" aria-pressed="${String(showingOfficialDescription)}" aria-label="${showingOfficialDescription ? "Afficher la description courte" : "Afficher la description officielle BnF"} — ${escapeAttribute(resource.name)}" title="${showingOfficialDescription ? "Description courte" : "Description officielle BnF"}">${showingOfficialDescription ? "[-]" : "[+]"}</button>`
    : "";
  const descriptionHtml = activeDescription
    ? `<p class="description${showingOfficialDescription ? " is-official" : ""}"><span class="description-text">${showingOfficialDescription ? '<strong class="official-description-label">Description BnF :</strong> ' : ""}${escapeHtml(activeDescription)}</span>${descriptionToggleHtml}</p>`
    : `<p class="description pending"><span class="description-text">Description à renseigner.</span></p>`;
  const accessInstructionHtml = renderAccessInstruction(resource);
  const editorialNoticeHtml = renderEditorialNotice(resource);
  const noticesHtml = accessInstructionHtml || editorialNoticeHtml
    ? `<div class="card-notices">${accessInstructionHtml}${editorialNoticeHtml}</div>`
    : "";
  const pressTitleProviderId = getPressTitleSourceFilterId(resource);
  const categoryBadgeHtml = shouldShowPressTitleProviderBadge(resource, context)
    ? `<span class="badge category press-provider-badge source-${escapeAttribute(pressTitleProviderId)}"><span class="entry-source-dot" aria-hidden="true"></span>${escapeHtml(getProviderLabel(resource))}</span>`
    : "";
  const resourceTaxonomyBadges = context === "resource" && options.showTaxonomyBadges !== false
    ? getResourceTaxonomyBadges(resource)
    : [];
  const secondaryCategoryBadges = resourceTaxonomyBadges
    .filter(({ label }) => !hiddenCategoryBadges.has(label))
    .filter(({ label }) => shouldShowSecondaryCategoryBadge(resource, label, context))
    .map(({ title, rootId, rootLabel, targetId, targetLabel }) => `<button class="badge category taxonomy-badge-link" type="button" title="${escapeAttribute(title)}" aria-label="Ouvrir ${escapeAttribute(title)}" data-taxonomy-root="${escapeAttribute(rootId)}" data-taxonomy-target="${escapeAttribute(targetId)}"><span class="taxonomy-badge-segment taxonomy-badge-root" data-taxonomy-root-segment>${escapeHtml(rootLabel)}</span>${targetLabel ? `<span class="taxonomy-badge-chevron" aria-hidden="true"> › </span><span class="taxonomy-badge-segment taxonomy-badge-target">${escapeHtml(targetLabel)}</span>` : ""}</button>`)
    .join("");
  const resourceTaxonomySeparator = resourceTaxonomyBadges.length
    ? '<span class="badge-separator" aria-hidden="true">|</span>'
    : "";
  const compactProfileLabels = {
    "Pass Lecture/Culture": "Pass Culture",
    "Pass Recherche illimité": "Pass Recherche",
  };
  const compactProfileBadges = state.passFilter === "all"
    ? access.map((label) => renderPassBadge(label, compactProfileLabels[label] ?? label)).join("")
    : "";
  const languageBadges = context === "title" ? "" : renderLanguageBadges(resource);
  const accessModeBadge = `<span class="badge ${accessModeClass}" title="${escapeAttribute(accessModeTitle)}" aria-label="${escapeAttribute(accessModeTitle)}">${escapeHtml(accessModeLabel)}</span>`;
  const structuredResourceBadges = `
    <span class="badge-row badge-row-taxonomy">${categoryBadgeHtml}${secondaryCategoryBadges}${resourceTaxonomyBadges.length && languageBadges ? resourceTaxonomySeparator : ""}${languageBadges}</span>
    <span class="badge-row badge-row-passes">${compactProfileBadges}</span>
    <span class="badge-row badge-row-access">${state.remoteFilter === "all" ? accessModeBadge : ""}</span>
  `;
  const pressTitleLocaleBadges = context === "title"
    ? `${renderPressTitleCountryBadge(resource)}${renderPressTitleLocalRegionBadges(resource)}${renderPressTitleLanguageBadges(resource)}`
    : "";
  const pressTitleAccoladeBadges = context === "title"
    ? `${resource.recommended ? renderPressTitleRecommendedBadge(resource) : ""}${state.popularPressTitleIds.has(resource.id) ? renderPressTitlePopularBadge(resource) : ""}`
    : "";
  const pressTitlePrimaryGroups = [categoryBadgeHtml, pressTitleLocaleBadges, pressTitleAccoladeBadges].filter(Boolean);
  const pressTitlePrimaryBadges = pressTitlePrimaryGroups
    .map((group, index) => index === 0
      ? group
      : `<span class="badge-group">${group}</span>`)
    .join("");
  const structuredPressTitleBadges = `
    <span class="badge-row badge-row-press-metadata">${pressTitlePrimaryBadges}</span>
    <span class="badge-row badge-row-press-categories" data-press-categories>${context === "title" ? renderPressTitleEditorialBadges(resource) : ""}<button class="badge press-category-overflow" type="button" hidden></button></span>
    <span class="badge-row badge-row-passes">${compactProfileBadges}</span>
    <span class="badge-row badge-row-access">${state.remoteFilter === "all" ? accessModeBadge : ""}</span>
  `;
  const badgesHtml = context === "resource"
    ? structuredResourceBadges
    : structuredPressTitleBadges;

  card.innerHTML = `
    <div class="card-header">
      <div class="logo ${resource.icon_url ? "" : "generated"} ${isReviewLogo(resource) ? "cover-logo" : ""} ${resource.icon_no_padding ? "icon-no-padding" : ""}"${logoAppearanceAttributes(resource)}>
        ${logo}
      </div>
      <h3>${escapeHtml(resource.name)}</h3>
      <button
        class="favorite-button"
        type="button"
        aria-pressed="${String(isFavorite)}"
        aria-label="${isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}"
        title="${isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}"
        data-resource-id="${escapeAttribute(resource.id)}"
      >
        <span aria-hidden="true">${isFavorite ? "★" : "☆"}</span>
      </button>
    </div>
    <div class="card-copy">
      ${descriptionHtml}
      ${noticesHtml}
    </div>
    <div class="card-actions">
      ${renderActions(resource)}
    </div>
    <div class="badges is-structured">
      ${badgesHtml}
    </div>
  `;

  card.querySelector(".favorite-button").addEventListener("click", () => {
    toggleFavorite(resource.id);
  });

  card.querySelectorAll(".taxonomy-badge-link").forEach((badge) => {
    const openTaxonomy = (targetId) => {
      state.category = badge.dataset.taxonomyRoot;
      state.favoritesOnly = false;
      renderFilters();
      render();
      requestAnimationFrame(() => {
        const sectionId = `resource-taxonomy-${targetId}`;
        const target = targetId === badge.dataset.taxonomyRoot
          ? resourceGrid
          : document.getElementById(sectionId)
            ?? [...document.querySelectorAll('[id^="resource-taxonomy-"]')]
              .find((section) => section.id.startsWith(`${sectionId}__`));
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };
    badge.addEventListener("click", () => openTaxonomy(badge.dataset.taxonomyTarget));
    badge.querySelector("[data-taxonomy-root-segment]")?.addEventListener("click", (event) => {
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      event.stopPropagation();
      openTaxonomy(badge.dataset.taxonomyRoot);
    });
  });

  const pressCategoryRow = card.querySelector("[data-press-categories]");
  const pressCategoryOverflow = card.querySelector(".press-category-overflow");
  if (pressCategoryRow && pressCategoryOverflow) {
    pressCategoryOverflow.addEventListener("click", () => {
      const expanded = pressCategoryRow.dataset.expanded !== "true";
      pressCategoryRow.dataset.expanded = String(expanded);
      layoutPressTitleCategoryBadges(card);
    });
    requestAnimationFrame(() => layoutPressTitleCategoryBadges(card));
  }

  card.querySelector("[data-action-disclosure]")?.addEventListener("click", (event) => {
    const button = event.currentTarget;
    const disclosure = card.querySelector(`#${CSS.escape(button.getAttribute("aria-controls"))}`);
    const expanded = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(expanded));
    button.title = expanded ? "Masquer les options supplémentaires" : button.dataset.collapsedTitle;
    button.setAttribute("aria-label", button.title);
    button.classList.toggle("is-expanded", expanded);
    disclosure.hidden = !expanded;
  });

  card.querySelectorAll("[data-collapsible-notice]").forEach((notice) => {
    const button = notice.querySelector("[data-collapsible-notice-toggle]");
    const toggleNotice = () => {
      const expanded = notice.dataset.expanded !== "true";
      notice.dataset.expanded = String(expanded);
      button.title = expanded ? "Réduire le texte" : "Afficher le texte complet";
      button.setAttribute("aria-label", button.title);
      button.setAttribute("aria-expanded", String(expanded));
      button.classList.toggle("is-expanded", expanded);
    };
    notice.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      toggleNotice();
    });
  });

  card.querySelector("[data-popularity-note-resource-id]")?.addEventListener("click", () => {
    togglePressPopularityNote(resource);
  });
  card.querySelector("[data-recommendation-note-resource-id]")?.addEventListener("click", () => {
    togglePressRecommendationNote(resource);
  });
  card.querySelectorAll("[data-pass-note-id]").forEach((badge) => {
    badge.addEventListener("click", () => togglePassNote(badge.dataset.passNoteId));
  });
  card.querySelectorAll("[data-language-note-resource-id]").forEach((badge) => {
    badge.addEventListener("click", () => toggleLanguageNote(resource));
  });
  card.querySelector("[data-country-note-resource-id]")?.addEventListener("click", () => {
    toggleCountryNote(resource);
  });
  card.querySelectorAll("[data-region-note-resource-id]").forEach((badge) => {
    badge.addEventListener("click", () => toggleRegionNote(resource));
  });

  card.querySelector(".description-toggle")?.addEventListener("click", () => {
    const showOfficialDescription = !state.officialDescriptionResources.has(resource.id);
    if (showOfficialDescription) {
      state.officialDescriptionResources.add(resource.id);
    } else {
      state.officialDescriptionResources.delete(resource.id);
    }
    const replacement = createCard(resource, eagerLogo, options);
    replacement.querySelector(".card-copy")?.classList.add(
      showOfficialDescription ? "description-copy-expanding" : "description-copy-collapsing",
    );
    card.replaceWith(replacement);
  });

  card.querySelectorAll("[data-edition-resource-id]").forEach((select) => {
    select.addEventListener("change", (event) => {
      updateEditionSelection(resource, event.target.value, card);
    });
  });

  return card;
}

function renderAccessInstruction(resource) {
  const instruction = resource.access_instruction;
  const text = instruction?.text?.trim();

  if (!text) {
    return "";
  }

  const links = (instruction.links ?? [])
    .filter((link) => link?.url && link?.label)
    .map((link) => `<a href="${escapeAttribute(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`)
    .join(" · ");
  const linksHtml = links ? ` ${links}` : "";

  return `
    <div class="collapsible-card-notice access-instruction" data-collapsible-notice data-expanded="false">
      <div class="collapsible-card-notice-heading">
        <strong>${escapeHtml(getAccessModeLabel(resource))}</strong>
        <button class="collapsible-card-notice-toggle" type="button" title="Afficher le texte complet" aria-label="Afficher le texte complet" aria-expanded="false" data-collapsible-notice-toggle><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"/></svg></button>
      </div>
      <div class="collapsible-card-notice-content" data-collapsible-notice-content>
        <p>${escapeHtml(text)}${linksHtml}</p>
      </div>
    </div>
  `;
}

function renderEditorialNotice(resource) {
  const notice = resource.editorial_notice;
  const text = notice?.text?.trim();
  if (!text) return "";
  const level = notice.level === "warning" ? "warning" : "context";
  const label = level === "warning" ? "Avertissement éditorial" : "Contexte éditorial";
  const icon = level === "warning"
    ? '<span class="editorial-notice-icon" aria-hidden="true">⚠</span>'
    : "";

  const sources = (notice.sources ?? [])
    .filter((source) => source?.url)
    .map((source, index) => {
      const number = index + 1;
      const label = source.label || `Source ${number}`;
      return `<sup><a href="${escapeAttribute(source.url)}" target="_blank" rel="noreferrer" title="${escapeAttribute(label)}" aria-label="${escapeAttribute(`Source ${number} : ${label}`)}">[${number}]</a></sup>`;
    })
    .join("");

  return `
    <div class="collapsible-card-notice editorial-notice editorial-notice-${level}" data-collapsible-notice data-expanded="false">
      <div class="collapsible-card-notice-heading">
        <strong>${icon}${escapeHtml(label)}</strong>
        <button class="collapsible-card-notice-toggle" type="button" title="Afficher le texte complet" aria-label="Afficher le texte complet" aria-expanded="false" data-collapsible-notice-toggle><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"/></svg></button>
      </div>
      <div class="collapsible-card-notice-content" data-collapsible-notice-content>
        <p>${escapeHtml(text)}${sources ? ` <span class="editorial-notice-sources">${sources}</span>` : ""}</p>
      </div>
    </div>
  `;
}

function renderActions(resource) {
  const actions = getVisibleActions(resource);
  if (!actions.length) {
    return "";
  }

  const hasEditionOptions = Array.isArray(resource.edition_options) && resource.edition_options.length > 0;
  const regularActions = actions
    .filter((action) => action.action_group !== "variant")
    .map((action, index) => ({ action, index }))
    .sort((left, right) => (
      getActionProviderPriority(left.action) - getActionProviderPriority(right.action)
      || left.index - right.index
    ))
    .map(({ action }) => action);
  const featuredVariantActions = actions.filter((action) => action.action_group === "variant" && action.variant_featured);
  const nonFeaturedVariantActions = actions.filter((action) => action.action_group === "variant" && !action.variant_featured);
  const supplementalRegularActions = regularActions.length > 2 ? regularActions.slice(2) : [];
  const primaryRegularActions = supplementalRegularActions.length ? regularActions.slice(0, 2) : regularActions;
  const singleAutomaticVariantAction = (
    primaryRegularActions.length === 2
    && supplementalRegularActions.length === 0
    && featuredVariantActions.length === 0
    && nonFeaturedVariantActions.length === 1
    && shouldRenderVariantInline(nonFeaturedVariantActions[0])
  )
    ? nonFeaturedVariantActions
    : [];
  const singleFullLabelVariantAction = (
    primaryRegularActions.length === 1
    && supplementalRegularActions.length === 0
    && featuredVariantActions.length === 0
    && nonFeaturedVariantActions.length === 1
    && String(nonFeaturedVariantActions[0].label || "").trim().length <= 10
  )
    ? nonFeaturedVariantActions
    : [];
  const orphanVariantActions = primaryRegularActions.length === 0
    ? [...featuredVariantActions, ...nonFeaturedVariantActions]
    : [];
  const compactVariantActions = orphanVariantActions.length
    ? orphanVariantActions
    : [
        ...featuredVariantActions.filter(shouldRenderVariantInline),
        ...singleAutomaticVariantAction,
        ...singleFullLabelVariantAction,
      ];
  const fullLabelVariantActionIds = new Set(
    [...singleFullLabelVariantAction, ...orphanVariantActions].map((action) => action.id),
  );
  const inlineActionIds = new Set(compactVariantActions.map((action) => action.id));
  const compactActionIds = new Set(
    compactVariantActions
      .filter((action) => !fullLabelVariantActionIds.has(action.id))
      .map((action) => action.id),
  );
  const variantActions = [
    ...supplementalRegularActions,
    ...featuredVariantActions.filter((action) => !inlineActionIds.has(action.id)),
    ...nonFeaturedVariantActions.filter((action) => !inlineActionIds.has(action.id)),
  ];
  const primaryActions = [...primaryRegularActions, ...compactVariantActions];
  const actionListClass = resource.source === "multi_source" && primaryActions.length === 3 && !compactVariantActions.length
    ? " multi-source-actions"
    : "";
  const compactActionClass = compactVariantActions.length && primaryRegularActions.length
    ? " has-compact-actions weighted-compact-actions"
    : "";
  const hasCompactVariantActions = shouldRenderVariantActionsCompact(
    variantActions,
    supplementalRegularActions,
  );
  const variantDisclosureId = variantActions.length ? `action-options-${resource.id}` : "";
  const variantCountLabel = `${variantActions.length} option${variantActions.length > 1 ? "s" : ""} supplémentaire${variantActions.length > 1 ? "s" : ""}`;
  const actionDisclosureHtml = variantActions.length
    ? `<button class="resource-action-disclosure" type="button" title="Afficher ${variantCountLabel}" aria-label="Afficher ${variantCountLabel}" aria-expanded="false" aria-controls="${escapeAttribute(variantDisclosureId)}" data-action-disclosure data-collapsed-title="Afficher ${variantCountLabel}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"/></svg></button>`
    : "";
  const primaryControlCount = primaryActions.length + (actionDisclosureHtml ? 1 : 0);
  const regularActionHtml = renderPrimaryActions(resource, primaryActions, {
    actionListClass,
    compactActionClass,
    compactActionIds,
    fullLabelVariantActionIds,
    compactIndexPresseLabel: primaryControlCount >= 3,
    compactLatestLabel: primaryControlCount >= 3,
    hasEditionOptions,
    actionDisclosureHtml,
    useExpandedProviderLabel: actions.length === 1,
  });
  const variantActionHtml = variantActions.length
    ? `<div id="${escapeAttribute(variantDisclosureId)}" class="resource-variant-disclosure" hidden>${renderVariantActions(resource, variantActions, hasCompactVariantActions)}</div>`
    : "";

    return `
      <div class="resource-action-stack">
        ${regularActionHtml}
        ${variantActionHtml}
      </div>
    `;
}

function shouldRenderVariantActionsCompact(variantActions, supplementalRegularActions) {
  if (variantActions.length <= 3) {
    return supplementalRegularActions.length > 0
      || variantActions.some((action) => action.short_label);
  }

  if (supplementalRegularActions.length > 0) {
    return false;
  }

  const compactLabelLengths = variantActions.map((action) => (
    getCompactFeaturedVariantLabel(action).length
  ));

  return (
    variantActions.length === 4
    && compactLabelLengths.every((length) => length > 0 && length <= 5)
  ) || (
    variantActions.length >= 5
    && variantActions.length <= 6
    && compactLabelLengths.every((length) => length > 0 && length <= 2)
  );
}

function getActionProviderId(action) {
  const provider = action.source_filter_id || String(action.kind || "").split("_")[0];
  return provider === "indexpresse" ? "indexpresse_business" : provider;
}

function getActionProviderLabel(action) {
  return {
    europresse: "Europresse",
    indexpresse_business: "IndexPresse Business",
    pressreader: "PressReader",
    factiva: "Factiva",
  }[getActionProviderId(action)] || "Accès direct";
}

function getActionProviderPriority(action) {
  const provider = getActionProviderId(action);
  return {
    europresse: 0,
    indexpresse: 1,
    indexpresse_business: 1,
    pressreader: 2,
  }[provider] ?? 3;
}

function renderVariantActions(resource, variantActions, hasCompactVariantActions) {
  if (!variantActions.length) {
    return "";
  }

  if (hasCompactVariantActions) {
    return `
      <div class="resource-actions resource-variant-actions compact-variant-actions" style="--variant-action-count: ${variantActions.length}">
        ${variantActions.map((action) => renderActionLink(resource, action, {
          compactAppearance: true,
          useCompactLabel: action.kind === "indexpresse_business_articles",
        })).join("")}
      </div>
    `;
  }

  return splitActionsIntoBalancedRows(variantActions).map((row) => `
    <div class="resource-actions resource-variant-actions balanced-variant-actions" style="--variant-row-count: ${row.length}">
      ${row.map((action) => renderActionLink(resource, action, {
        compactAppearance: true,
        useCompactLabel: action.kind === "indexpresse_business_articles",
      })).join("")}
    </div>
  `).join("");
}

function splitActionsIntoBalancedRows(actions) {
  if (actions.length <= 3) {
    return [actions];
  }

  const rowCount = Math.ceil(actions.length / 3);
  const baseRowSize = Math.floor(actions.length / rowCount);
  let rowsWithExtraItem = actions.length % rowCount;
  const rows = [];
  let actionIndex = 0;

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const rowSize = baseRowSize + (rowsWithExtraItem > 0 ? 1 : 0);
    rows.push(actions.slice(actionIndex, actionIndex + rowSize));
    actionIndex += rowSize;
    rowsWithExtraItem -= 1;
  }

  return rows;
}

function renderPrimaryActions(resource, primaryActions, options = {}) {
  if (!primaryActions.length) {
    return "";
  }

  if (options.hasEditionOptions) {
    return `
      <div class="resource-actions resource-edition-actions${options.compactActionClass}${options.actionDisclosureHtml ? " has-action-disclosure" : ""}" style="--edition-action-count: ${primaryActions.length}">
        ${primaryActions.map((action) => renderActionLink(resource, action, {
          useCompactLabel: options.compactActionIds?.has(action.id),
          useFullLabel: options.fullLabelVariantActionIds?.has(action.id),
          compactIndexPresseLabel: options.compactIndexPresseLabel,
          compactLatestLabel: options.compactLatestLabel,
          useExpandedProviderLabel: options.useExpandedProviderLabel,
        })).join("")}${options.actionDisclosureHtml ?? ""}
      </div>
      <div class="resource-edition-control">
        ${renderEditionSelect(resource)}
      </div>
    `;
  }

  return `
    <div class="resource-actions resource-primary-actions${options.actionListClass}${options.compactActionClass}${options.actionDisclosureHtml ? " has-action-disclosure" : ""}">
      ${primaryActions.map((action) => renderActionLink(resource, action, {
        useCompactLabel: options.compactActionIds?.has(action.id),
        useFullLabel: options.fullLabelVariantActionIds?.has(action.id),
        compactIndexPresseLabel: options.compactIndexPresseLabel,
        compactLatestLabel: options.compactLatestLabel,
        useExpandedProviderLabel: options.useExpandedProviderLabel,
      })).join("")}${options.actionDisclosureHtml ?? ""}
    </div>
  `;
}

function renderEditionSelect(resource) {
  const options = resource.edition_options ?? [];
  const selectedOption = getSelectedEditionOption(resource);
  const selectLabel = resource.edition_select_label || "Choisir une édition";

  return `
    <select class="resource-edition-select" data-edition-resource-id="${escapeAttribute(resource.id)}" title="${escapeAttribute(selectLabel)}" aria-label="${escapeAttribute(`${selectLabel} - ${resource.name}`)}">
      ${options.map((option) => `
        <option value="${escapeAttribute(option.id)}"${option.id === selectedOption?.id ? " selected" : ""}>
          ${escapeHtml(option.label || option.name)}
        </option>
      `).join("")}
    </select>
  `;
}

function renderActionLink(resource, action, options = {}) {
  const href = resolveActionHref(resource, action);
  const classNames = ["resource-action"];
  const label = getResourceActionLabel(action, options);
  const fullLabel = options.compactIndexPresseLabel && action.short_label
    ? action.short_label
    : action.label;
  const tooltip = isPressTitleEntry(resource)
    ? `${fullLabel} (${getActionProviderLabel(action)})`
    : fullLabel;
  const compactAriaLabel = label !== fullLabel
    ? ` aria-label="${escapeAttribute(fullLabel)}"`
    : "";
  const trackingAttributes = ` data-action-resource-id="${escapeAttribute(resource.id)}" data-action-id="${escapeAttribute(action.id)}"`;

  if (isPressTitleEntry(resource)) {
    const provider = getActionProviderId(action);
    if (["pressreader", "europresse", "indexpresse_business", "factiva"].includes(provider)) {
      classNames.push(`provider-${provider}`);
    }
  }

  if (action.id === "archives" || action.id === "all_articles") {
    classNames.push("secondary");
  }

  if (action.id === "archives") {
    classNames.push("archive-action");
  }

  if (action.action_group === "variant" || options.compactAppearance) {
    classNames.push("variant");
  }

  if (options.useCompactLabel || (action.short_label && label === action.short_label)) {
    classNames.push("compact");
  }

  if (action.variant_featured) {
    classNames.push("featured-variant");
  }

  if (action.variant_tone) {
    classNames.push(`variant-${action.variant_tone}`);
  }

  return `
    <a class="${classNames.join(" ")}" href="${escapeAttribute(href)}" target="_blank" rel="noreferrer"${trackingAttributes}${getSessionAttributes(resource, action, href)} title="${escapeAttribute(tooltip)}"${compactAriaLabel}>
      ${action.id === "archives" ? renderArchiveActionIcon("resource-action-archive-icon") : ""}<span>${escapeHtml(label)}</span>
    </a>
  `;
}

function renderArchiveActionIcon(className) {
  return `<svg class="${escapeAttribute(className)}" viewBox="0 0 28 28" aria-hidden="true" focusable="false"><rect x="9.5" y="6.5" width="10" height="13" rx="1"/><rect class="quick-launch-archive-cutout-fill" x="6" y="10" width="10" height="13" rx="1"/><rect x="6" y="10" width="10" height="13" rx="1"/><circle class="quick-launch-archive-cutout-fill" cx="19.71" cy="17.46" r="6.45"/><g transform="translate(12.75 10.5) scale(.58)"><path class="quick-launch-archive-cutout-stroke" d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5"/><path class="quick-launch-archive-clock" d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5"/><path class="quick-launch-archive-hands" d="M12 7v5l4 2"/></g></svg>`;
}

function shouldRenderVariantInline(action) {
  const compactLabel = getCompactFeaturedVariantLabel(action);
  return compactLabel.length > 0 && compactLabel.length <= 5;
}

function getCompactFeaturedVariantLabel(action) {
  if (action.short_label) {
    return action.short_label.trim();
  }

  if (action.kind === "indexpresse_business_articles") {
    return "IndexPresse";
  }

  if (String(action.favorite_label || action.label || "").toLocaleLowerCase("fr").includes("hors-série")) {
    return "HS";
  }

  return String(action.favorite_label || action.label || "").trim();
}

function getResourceActionLabel(action, options = {}) {
  if (options.useFullLabel) {
    return action.label;
  }

  if (
    options.compactIndexPresseLabel
    && action.kind === "indexpresse_business_articles"
  ) {
    return "Articles IPB";
  }

  if (
    options.compactLatestLabel
    && action.id === "latest"
    && action.label === "Dernier numéro"
  ) {
    return "Dernier n°";
  }

  if (options.useCompactLabel) {
    return getCompactFeaturedVariantLabel(action);
  }

  if (
    options.useExpandedProviderLabel
    && getActionProviderId(action) === "indexpresse_business"
  ) {
    return "Articles sur IndexPresse";
  }

  if (
    action.short_label
    && !(action.short_label === "HS" && String(action.label || "").toLocaleLowerCase("fr").includes("hors-série"))
  ) {
    return action.short_label;
  }

  return action.label;
}

function getSessionAttributes(resource, action, href) {
  if (isEuropressePdfAction(resource, action)) {
    return "";
  }

  const sessionStartUrl = getSessionStartUrl(resource, action);
  return sessionStartUrl
    ? ` data-session-start="${escapeAttribute(sessionStartUrl)}" data-transition-href="${escapeAttribute(href)}"`
    : "";
}

function getVisibleActions(resource) {
  return getProfileVisibleActions(resource)
    .filter((action) => matchesActionSourceFilter(action));
}

function getProfileVisibleActions(resource) {
  return getActions(resource)
    .filter((action) => matchesActionPassFilter(resource, action))
    .filter((action) => matchesActionRemoteFilter(resource, action));
}

function matchesActionSourceFilter(action) {
  if (!shouldShowPressTitleSection() || state.pressTitleSourceFilter === pressTitleAllFilterValue) {
    return true;
  }

  return getActionProviderId(action) === state.pressTitleSourceFilter;
}

function matchesActionRemoteFilter(resource, action) {
  if (state.remoteFilter === "all") {
    return true;
  }

  const accessMode = action.access_mode || getAccessMode(resource);

  if (accessMode === "mixed") {
    return true;
  }

  if (state.remoteFilter === "remote") {
    return isRemoteAccessMode(accessMode);
  }

  if (state.remoteFilter === "onsite") {
    return accessMode === "onsite" || accessMode === "onsite_extended";
  }

  return accessMode === state.remoteFilter;
}

function matchesActionPassFilter(resource, action) {
  if (state.passFilter === "all") {
    return true;
  }

  const access = Array.isArray(action.access)
    ? action.access
    : resource.access ?? [];

  if (state.passFilter === "public") {
    return access.includes("public");
  }

  return access.includes(state.passFilter) || access.includes("public");
}

function isRemoteAccessMode(accessMode) {
  return accessMode === "remote" || accessMode === "remote_conditional" || accessMode === "free";
}

function getActions(resource) {
  if (Array.isArray(resource.actions) && resource.actions.length) {
    return resource.actions;
  }

  return [
    {
      id: "open",
      label: "Ouvrir",
      url: resource.url,
    },
  ];
}

function getPrimaryUrl(resource) {
  return resolveActionHref(resource, getActions(resource)[0]);
}

function getSelectedEditionOption(resource) {
  const options = resource.edition_options ?? [];
  if (!options.length) {
    return null;
  }

  const selectedId = state.editionSelections.get(resource.id);
  return options.find((option) => option.id === selectedId) || options[0];
}

function updateEditionSelection(resource, selectedEditionId, card) {
  if (!isValidEditionSelection(resource, selectedEditionId)) {
    state.editionSelections.delete(resource.id);
  } else {
    state.editionSelections.set(resource.id, selectedEditionId);
  }

  saveEditionSelections();
  updateEditionActionLinks(resource, card);

  if (state.favorites.has(resource.id)) {
    renderQuickLaunch();
  }
}

function updateEditionActionLinks(resource, scope = document) {
  const actionsById = new Map(getActions(resource).map((action) => [action.id, action]));
  scope.querySelectorAll(`[data-action-resource-id="${escapeCssIdentifier(resource.id)}"]`).forEach((link) => {
    const action = actionsById.get(link.dataset.actionId);
    if (!action) {
      return;
    }
    syncActionLink(link, resource, action);
  });
}

function syncActionLink(link, resource, action) {
  const href = resolveActionHref(resource, action);
  link.setAttribute("href", href);
  link.removeAttribute("data-session-start");
  link.removeAttribute("data-transition-href");

  if (!isEuropressePdfAction(resource, action)) {
    const sessionStartUrl = getSessionStartUrl(resource, action);
    if (sessionStartUrl) {
      link.dataset.sessionStart = sessionStartUrl;
      link.dataset.transitionHref = href;
    }
  }
}

function isValidEditionSelection(resource, selectedEditionId) {
  if (!resource) {
    return false;
  }

  return (resource.edition_options ?? []).some((option) => option.id === selectedEditionId);
}

function escapeCssIdentifier(value) {
  if (window.CSS?.escape) {
    return window.CSS.escape(value);
  }

  return String(value).replaceAll('"', '\\"').replaceAll("\\", "\\\\");
}

function getActionSourceCode(resource, action) {
  if (action.edition_variant_aware) {
    return getSelectedEditionVariantOption(resource, action)?.source_code ?? action.source_code ?? resource.source_code ?? "";
  }

  if (action.edition_aware) {
    return getSelectedEditionOption(resource)?.source_code ?? action.source_code ?? resource.source_code ?? "";
  }

  return action.source_code ?? resource.source_code ?? "";
}

function getSelectedEditionVariantOption(resource, action) {
  const selectedEditionId = getSelectedEditionOption(resource)?.id;
  const options = action.edition_variant_options ?? [];
  return options.find((option) => option.edition_id === selectedEditionId) || options[0] || null;
}

function getActionTemplate(resource, action) {
  if (action.edition_variant_aware) {
    const option = getSelectedEditionVariantOption(resource, action);
    const mappedTemplate = option?.action_urls?.[action.id === "archives" ? "archives" : "latest"]
      || option?.action_urls?.[action.id]
      || option?.action_urls?.latest;

    if (mappedTemplate) {
      return mappedTemplate;
    }
  }

  if (action.edition_aware) {
    const option = getSelectedEditionOption(resource);
    const mappedTemplate = option?.action_urls?.[action.id];

    if (mappedTemplate) {
      return mappedTemplate;
    }
  }

  return action.url_template || action.url || resource.url || "";
}

function resolveActionUrl(resource, action) {
  const template = getActionTemplate(resource, action);
  return template
    .replaceAll("{sourceCode}", encodeURIComponent(getActionSourceCode(resource, action)))
    .replaceAll("{today}", getToday())
    .replaceAll("{oneYearAgo}", getOneYearAgo())
    .replaceAll("{oneYearAgoCompact}", getCompactDate(getOneYearAgo()))
    .replaceAll("%7BoneYearAgoCompact%7D", getCompactDate(getOneYearAgo()));
}

function resolveActionHref(resource, action) {
  const targetUrl = resolveActionUrl(resource, action);

  if (isEuropressePdfAction(resource, action)) {
    return buildEuropresseDeepLink(targetUrl);
  }

  const startUrl = getSessionStartUrl(resource, action);

  if (!startUrl) {
    return targetUrl;
  }

  const params = new URLSearchParams({
    title: resource.name,
    action: action.label,
    start: startUrl,
    target: targetUrl,
  });

  return `./pages/transition.html?${params.toString()}`;
}

function getSessionStartUrl(resource, action) {
  if (isEuropressePdfAction(resource, action)) {
    return "";
  }

  const needsTransition = action.session_prerequisite || resource.session_prerequisite;
  return needsTransition ? action.session_start_url || resource.session_start_url || "" : "";
}

function isEuropressePdfAction(resource, action) {
  return resource.source === "europresse_pdf" || String(action.kind ?? "").startsWith("europresse_");
}

function buildEuropresseDeepLink(targetUrl, options = {}) {
  const finalPath = getEuropresseFinalPath(targetUrl);

  if (!finalPath) {
    return targetUrl;
  }

  const returnUrl = options.resetFirst === false
    ? finalPath
    : `/access/ip/default.aspx?un=D000067U_1&ReturnUrl=${encodeURIComponent(finalPath)}`;
  const accessUrl = `${europresseEntrypointUrl}&ReturnUrl=${encodeURIComponent(returnUrl)}`;
  const loginUrl = new URL(bnfProxyLoginUrl);
  loginUrl.searchParams.set("qurl", accessUrl);
  return loginUrl.href;
}

function getEuropresseFinalPath(targetUrl) {
  if (String(targetUrl).startsWith("/")) {
    return targetUrl;
  }

  try {
    const url = new URL(targetUrl);
    if (url.hostname !== europresseProxyHost) {
      return "";
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "";
  }
}

function setupEuropresseSessionHelpers() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-session-start]");

    if (!link) {
      return;
    }

    if (isModifiedClick(event)) {
      const helperTab = openNewTab(link.dataset.sessionStart);
      link.href = addQueryParam(
        link.dataset.transitionHref || link.href,
        "helper",
        helperTab ? "1" : "0",
      );
      return;
    }

    event.preventDefault();
    const transitionHref = withTransitionParams(link.dataset.transitionHref || link.href, {
      helper: "1",
    });
    const transitionTab = openNewTab(transitionHref);

    if (transitionTab) {
      window.location.assign(link.dataset.sessionStart);
      try {
        transitionTab.focus();
      } catch {
        // Focus is only a convenience; the navigation flow does not depend on it.
      }
      return;
    }

    const fallbackHref = addQueryParam(
      link.dataset.transitionHref || link.href,
      "helper",
      "0",
    );
    link.href = fallbackHref;
    window.location.assign(fallbackHref);
  });
}

function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function openNewTab(url, target = "_blank", options = {}) {
  const tab = window.open(url, target);

  if (tab && options.detach !== false) {
    try {
      tab.opener = null;
    } catch {
      // Some browsers disallow touching cross-origin windows.
    }
  }

  return tab;
}

function addQueryParam(url, key, value) {
  const target = new URL(url, window.location.href);
  target.searchParams.set(key, value);
  return `${target.pathname}${target.search}${target.hash}`;
}

function withTransitionParams(url, values) {
  return Object.entries(values).reduce((nextUrl, [key, value]) => (
    value ? addQueryParam(nextUrl, key, value) : nextUrl
  ), url);
}

function getFilteredResources() {
  const query = normalize(state.query);
  const filteredResources = state.resources
    .filter((resource) => {
      const accessMode = getAccessMode(resource);
      const resourceCategories = getResourceCategories(resource);
      const resourceTaxonomyLabels = getResourceTaxonomyNodes(resource).map((category) => category.label);
      const matchesCategory = state.category === "Presse"
        ? isPressTitleEntry(resource) || resource.topic_ids?.includes("presse")
        : isPressResourceEntry(resource)
          && (state.category !== "Toutes" || !isPressTitleEntry(resource))
          && (state.category === "Toutes" || resourceMatchesTaxonomyRoot(resource, state.category));
      const matchesFavorite = !state.favoritesOnly || state.favorites.has(resource.id);
      const matchesPass = matchesPassFilter(resource);
      const matchesRemote = matchesRemoteFilter(accessMode);
      const matchesLanguage = matchesLanguageFilter(resource);
      const haystack = normalize([
        resource.name,
        resource.source_code,
        ...resourceCategories,
        ...resourceTaxonomyLabels,
        resource.description,
        resource.access_note,
        ...getResourceLanguageCodes(resource),
        ...getResourceLanguageLabels(resource),
        ...(resource.tags ?? []),
      ].join(" "));
      return matchesCategory && matchesFavorite && matchesPass && matchesRemote && matchesLanguage && (!query || haystack.includes(query));
    })
    .filter(shouldShowResourceInCurrentListing);

  return filteredResources
    .sort((a, b) => {
      const favoriteDelta = Number(state.favorites.has(b.id)) - Number(state.favorites.has(a.id));
      return favoriteDelta || a.name.localeCompare(b.name, "fr");
    });
}

function shouldShowResourceInCurrentListing(resource) {
  if (!isCatalogVisible(resource)) {
    return false;
  }

  if (resource.source !== "indexpresse_business" || resource.indexpresse_access_review_source) {
    return true;
  }

  const activeCodes = getActiveIndexPresseBusinessPublicationCodes();
  if (!activeCodes.size) {
    return true;
  }

  const code = resource.indexpresse_publication_code || "";
  return !code || activeCodes.has(code);
}

function isCatalogVisible(resource) {
  return resource?.catalog_visible !== false;
}

function getActiveIndexPresseBusinessPublicationCodes() {
  return new Set(
    state.indexpresseBusinessLinkSources
      .map((source) => source.publicationCode)
      .filter(Boolean),
  );
}

function getResourceCategories(resource) {
  const byId = state.editorialTaxonomyIndex;
  return (resource.topic_ids ?? []).map((id) => byId.get(id)?.label).filter(Boolean);
}

function matchesRemoteFilter(accessMode) {
  if (state.remoteFilter === "all") {
    return true;
  }

  if (accessMode === "mixed") {
    return true;
  }

  if (state.remoteFilter === "remote") {
    return accessMode === "remote" || accessMode === "remote_conditional" || accessMode === "free";
  }

  if (state.remoteFilter === "onsite") {
    return accessMode === "onsite" || accessMode === "onsite_extended";
  }

  return accessMode === state.remoteFilter;
}

function matchesPassFilter(resource) {
  if (state.passFilter === "all") {
    return true;
  }

  const access = resource.access ?? [];

  if (state.passFilter === "public") {
    return access.includes("public");
  }

  return access.includes(state.passFilter) || access.includes("public");
}

function matchesLanguageFilter(resource) {
  if (state.languageFilter.size === 0) {
    return true;
  }

  const displayCodes = getResourceLanguageCodes(resource);
  const codes = displayCodes.includes("mul")
    ? getUniqueLanguageCodes(resource.content_languages?.codes)
    : displayCodes;
  if (displayCodes.length === 0) {
    const scope = resource.content_languages?.scope;
    return scope === "multilingual" || scope === "very_multilingual";
  }

  return codes.some((code) => state.languageFilter.has(code));
}

function getResourceLanguageCodes(resource) {
  return getUniqueLanguageCodes(resource.language_codes);
}

function getUniqueLanguageCodes(codes) {
  return [...new Set((codes ?? []).map(normalizeLanguageCode).filter(Boolean))];
}

function normalizeLanguageCode(code) {
  const normalizedCode = String(code ?? "").trim().toLowerCase();

  if (normalizedCode === "mu") {
    return "mul";
  }

  if (normalizedCode === "multi" || normalizedCode === "multilingual" || normalizedCode === "multiple") {
    return "mul";
  }

  return normalizedCode;
}

function getResourceLanguageLabels(resource) {
  return (resource.language_codes ?? []).map((code, index) => resource.language_labels?.[index]
    || state.languageVocabulary[code] || code);
}

function renderLanguageBadges(resource) {
  const languageData = resource.content_languages;
  const codes = getResourceLanguageCodes(resource);

  if (codes.length === 0) {
    if (!languageData || (languageData.scope !== "multilingual" && languageData.scope !== "very_multilingual")) {
      return "";
    }

    const title = [
      getLanguageSummaryLabel(languageData),
      resource.language_public_note_validated ? resource.language_public_note : "",
    ].filter(Boolean).join(" - ");

    return renderLanguageBadgeButton(resource, "MULTI", title);
  }

  if (codes.length > 3) {
    const title = `Langues : ${codes.map(formatLanguageTooltipItem).join(", ")}`;
    return renderLanguageBadgeButton(resource, "MULTI", title);
  }

  return codes
    .map((code) => renderLanguageBadgeButton(resource, formatLanguageBadgeText(code), formatLanguageTooltipItem(code)))
    .join("");
}

function renderLanguageBadgeButton(resource, text, title) {
  const expanded = isContextNoteOpen(resource.id, "language");
  return `<button class="badge language" type="button" title="${escapeAttribute(title)}" aria-label="Afficher les langues de ${escapeAttribute(resource.name)}" aria-expanded="${String(expanded)}" aria-controls="pressPopularityNote" data-language-note-resource-id="${escapeAttribute(resource.id)}" data-context-note-resource-id="${escapeAttribute(resource.id)}" data-context-note-kind="language">${escapeHtml(text)}</button>`;
}

function renderPassBadge(label, compactLabel) {
  const passId = label === "Pass Lecture/Culture"
    ? "pass_lecture_culture"
    : label === "Pass Recherche illimité"
      ? "pass_recherche_illimite"
      : "";
  if (!passId) {
    return `<span class="badge" title="${escapeAttribute(label)}">${escapeHtml(compactLabel)}</span>`;
  }

  const expanded = isContextNoteOpen(passId, "pass");
  return `<button class="badge" type="button" title="${escapeAttribute(label)}" aria-label="En savoir plus sur ${escapeAttribute(label)}" aria-expanded="${String(expanded)}" aria-controls="pressPopularityNote" data-pass-note-id="${passId}" data-context-note-resource-id="${passId}" data-context-note-kind="pass">${escapeHtml(compactLabel)}</button>`;
}

function renderPressTitleRecommendedBadge(resource) {
  const expanded = !pressPopularityNote.hidden
    && pressPopularityNote.dataset.resourceId === resource.id
    && pressPopularityNote.dataset.noteKind === "recommendation";
  return `<button class="badge recommended badge-icon-only" type="button" title="Titre recommandé par BnF Access" aria-label="Titre recommandé par BnF Access" aria-expanded="${String(expanded)}" aria-controls="pressPopularityNote" data-recommendation-note-resource-id="${escapeAttribute(resource.id)}"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg></button>`;
}

function renderPressTitlePopularBadge(resource) {
  const reasons = state.pressPopularityReasons.get(resource.id) ?? [];
  const title = reasons.length > 0
    ? reasons.map(formatPressPopularityReferenceText).join("\n")
    : "Titre présent dans un classement de référence";
  const ariaLabel = reasons.length > 0
    ? `Titre populaire : ${reasons.map(formatPressPopularityReferenceText).join(" ; ")}`
    : "Titre populaire selon un classement de référence";

  const expanded = !pressPopularityNote.hidden
    && pressPopularityNote.dataset.resourceId === resource.id
    && pressPopularityNote.dataset.noteKind === "popularity";
  return `<button class="badge popular badge-icon-only" type="button" title="${escapeAttribute(title)}" aria-label="${escapeAttribute(ariaLabel)}" aria-expanded="${String(expanded)}" aria-controls="pressPopularityNote" data-popularity-note-resource-id="${escapeAttribute(resource.id)}"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10"/><path d="M17 4v5a5 5 0 0 1-10 0V4"/><path d="M5 9H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4"/><path d="M19 9h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4"/></svg></button>`;
}

function togglePressPopularityNote(resource) {
  if (!pressPopularityNote.hidden
    && pressPopularityNote.dataset.resourceId === resource.id
    && pressPopularityNote.dataset.noteKind === "popularity") {
    closePressPopularityNote();
    return;
  }

  const reasons = state.pressPopularityReasons.get(resource.id) ?? [];
  pressPopularityNoteDetails.replaceChildren();

  const references = reasons.length > 0
    ? reasons
    : [{ text: "Titre présent dans un classement de référence.", url: "", sourceLabel: "" }];
  const list = document.createElement("ol");
  references.forEach((reason) => {
    const item = document.createElement("li");
    item.append(document.createTextNode(reason.text));
    if (reason.url) {
      const link = document.createElement("a");
      link.href = reason.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = reason.citation ? `(${reason.citation})` : "Source";
      item.append(link);
    } else if (reason.citation) {
      item.append(document.createTextNode(` (${reason.citation})`));
    }
    list.append(item);
  });
  pressPopularityNoteDetails.append(list);

  revealPressTitleNote(resource, "popularity");
}

function togglePressRecommendationNote(resource) {
  if (!pressPopularityNote.hidden
    && pressPopularityNote.dataset.resourceId === resource.id
    && pressPopularityNote.dataset.noteKind === "recommendation") {
    closePressPopularityNote();
    return;
  }

  pressPopularityNoteDetails.replaceChildren();
  const message = document.createElement("p");
  message.textContent = "Titre recommandé par BnF Access";
  pressPopularityNoteDetails.append(message);
  revealPressTitleNote(resource, "recommendation");
}

function isContextNoteOpen(resourceId, noteKind) {
  return !pressPopularityNote.hidden
    && pressPopularityNote.dataset.resourceId === resourceId
    && pressPopularityNote.dataset.noteKind === noteKind;
}

function toggleAccessNote(resource) {
  if (isContextNoteOpen(resource.id, "access")) {
    closePressPopularityNote();
    return;
  }

  const fragments = [createContextNoteParagraph(getAccessModeTitle(resource))];
  const instruction = resource.access_instruction;
  if (instruction?.text?.trim()) {
    fragments.push(createContextNoteParagraph(instruction.text.trim()));
    const links = (instruction.links ?? []).filter((link) => link?.url && link?.label);
    if (links.length) {
      const linkList = document.createElement("div");
      linkList.className = "context-note-links";
      linkList.append(...links.map((link) => createContextNoteLink(link.url, link.label)));
      fragments.push(linkList);
    }
  }
  pressPopularityNoteDetails.replaceChildren(...fragments);
  revealContextNote(resource.id, "access", resource.name);
}

function togglePassNote(passId) {
  if (isContextNoteOpen(passId, "pass")) {
    closePressPopularityNote();
    return;
  }

  const isResearch = passId === "pass_recherche_illimite";
  const title = isResearch ? "Pass Recherche illimité" : "Pass BnF lecture / culture";
  const description = isResearch
    ? "Pensé pour les travaux de recherche, ce Pass donne accès à toutes les salles de lecture, aux collections patrimoniales et à une sélection de ressources électroniques à distance. Son obtention nécessite de justifier une recherche. Certaines ressources de BnF Access lui sont réservées."
    : "Pensé pour la lecture, la découverte et les usages culturels, ce Pass donne accès aux salles tous publics, à l’offre culturelle de la BnF et à une sélection de ressources électroniques à distance. Il ne comprend pas systématiquement les mêmes ressources que le Pass Recherche."
  const pricing = isResearch
    ? "Tarifs annuels constatés en septembre 2026 : 55 € au plein tarif et 35 € au tarif réduit."
    : "Tarifs annuels constatés en septembre 2026 : 24 € au plein tarif, 15 € au tarif réduit pour les moins de 26 ans et les étudiants de moins de 35 ans, avec gratuité selon les exonérations prévues par la BnF.";

  pressPopularityNoteDetails.replaceChildren(
    createContextNoteParagraph(description),
    createContextNoteParagraph(pricing),
    createContextNoteLinks(passId),
  );
  revealContextNote(passId, "pass", title);
}

function toggleLanguageNote(resource) {
  if (isContextNoteOpen(resource.id, "language")) {
    closePressPopularityNote();
    return;
  }

  const codes = getResourceLanguageCodes(resource);
  const languageData = resource.content_languages;
  const summary = codes.length
    ? codes.map(formatLanguageTooltipItem).join(" · ")
    : getLanguageSummaryLabel(languageData || {});
  const fragments = [createContextNoteParagraph(summary)];
  if (resource.language_public_note_validated && resource.language_public_note?.trim()) {
    fragments.push(createContextNoteParagraph(resource.language_public_note.trim()));
  }
  pressPopularityNoteDetails.replaceChildren(...fragments);
  revealContextNote(resource.id, "language", `Langues · ${resource.name}`);
}

function toggleCountryNote(resource) {
  if (isContextNoteOpen(resource.id, "country")) {
    closePressPopularityNote();
    return;
  }

  pressPopularityNoteDetails.replaceChildren(createContextNoteParagraph(resource.country_label || resource.country_code));
  revealContextNote(resource.id, "country", `Pays · ${resource.name}`);
}

function toggleRegionNote(resource) {
  if (isContextNoteOpen(resource.id, "region")) {
    closePressPopularityNote();
    return;
  }

  const labels = getPressTitleLocalRegionLabels(resource);
  pressPopularityNoteDetails.replaceChildren(createContextNoteParagraph(labels.join(" · ")));
  revealContextNote(resource.id, "region", `${labels.length > 1 ? "Régions" : "Région"} · ${resource.name}`);
}

function createContextNoteParagraph(text) {
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  return paragraph;
}

function createContextNoteLinks(passId) {
  const links = document.createElement("div");
  links.className = "context-note-links";
  const pricingAnchor = passId === "pass_recherche_illimite"
    ? "#tarifs_passe_recherche"
    : "#tarifs_lecture_culture";
  links.append(
    createContextNoteLink(`${bnfPassPricingUrl}${pricingAnchor}`, "Conditions et tarifs"),
    createContextNoteLink(bnfPassSubscriptionUrl, "S’abonner en ligne"),
  );
  return links;
}

function createContextNoteLink(href, label) {
  const link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;
  return link;
}

function revealPressTitleNote(resource, noteKind) {
  revealContextNote(resource.id, noteKind, resource.name);
}

function revealContextNote(resourceId, noteKind, title) {
  const wasHidden = pressPopularityNote.hidden;
  window.clearTimeout(pressPopularityNoteCloseTimer);
  pressPopularityNoteCloseTimer = null;
  pressPopularityNote.dataset.resourceId = resourceId;
  pressPopularityNote.dataset.noteKind = noteKind;
  pressPopularityNoteTitle.textContent = title;

  pressPopularityNote.hidden = false;
  if (wasHidden) {
    pressPopularityNote.classList.remove("is-visible");
    window.requestAnimationFrame(() => {
      pressPopularityNote.classList.add("is-visible");
      syncPressPopularityNoteDockOffset();
    });
  } else {
    pressPopularityNote.classList.add("is-visible");
    syncPressPopularityNoteDockOffset();
  }
  syncPressPopularityButtons(resourceId, noteKind);
}

function closePressPopularityNote() {
  if (pressPopularityNote.hidden) return;

  window.clearTimeout(pressPopularityNoteCloseTimer);
  pressPopularityNote.classList.remove("is-visible");
  delete pressPopularityNote.dataset.resourceId;
  delete pressPopularityNote.dataset.noteKind;
  syncPressPopularityNoteDockOffset();
  syncPressPopularityButtons("", "");
  const closeDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 340;
  pressPopularityNoteCloseTimer = window.setTimeout(() => {
    pressPopularityNote.hidden = true;
    pressPopularityNoteCloseTimer = null;
  }, closeDelay);
}

function syncPressPopularityNoteDockOffset() {
  if (!jumpToSearchDock) return;

  const noteIsOpen = !pressPopularityNote.hidden && pressPopularityNote.classList.contains("is-visible");
  let offset = 0;
  if (noteIsOpen) {
    const noteRect = pressPopularityNote.getBoundingClientRect();
    const dockRect = jumpToSearchDock.getBoundingClientRect();
    const overlapsHorizontally = dockRect.left < noteRect.right && dockRect.right > noteRect.left;
    if (overlapsHorizontally) offset = Math.ceil(noteRect.height) + 10;
  }
  jumpToSearchDock.style.setProperty("--popularity-note-offset", `${offset}px`);
}

function syncPressPopularityButtons(activeResourceId, activeKind) {
  document.querySelectorAll("[data-popularity-note-resource-id]").forEach((button) => {
    button.setAttribute("aria-expanded", String(activeKind === "popularity" && button.dataset.popularityNoteResourceId === activeResourceId));
  });
  document.querySelectorAll("[data-recommendation-note-resource-id]").forEach((button) => {
    button.setAttribute("aria-expanded", String(activeKind === "recommendation" && button.dataset.recommendationNoteResourceId === activeResourceId));
  });
  document.querySelectorAll("[data-context-note-resource-id]").forEach((button) => {
    button.setAttribute("aria-expanded", String(
      button.dataset.contextNoteResourceId === activeResourceId
      && button.dataset.contextNoteKind === activeKind
    ));
  });
}

function buildPressPopularityReasonIndex(popularity) {
  const popularIds = new Set(popularity?.popular_catalog_ids ?? []);
  const sources = new Map((popularity?.sources ?? []).map((source) => [source.id, source]));
  const reasonsById = new Map();

  for (const record of popularity?.records ?? []) {
    const catalogId = record.match?.public_catalog_id;
    if (
      !catalogId
      || !popularIds.has(catalogId)
      || record.public_eligible !== true
      || record.label_suppressed === true
    ) {
      continue;
    }

    const source = sources.get(record.source_id);
    const reasonParts = formatPressPopularityReason(record, source);
    if (!reasonParts) continue;
    const reason = {
      ...reasonParts,
      url: /^https?:\/\//.test(source?.url ?? "") ? source.url : "",
    };
    const reasons = reasonsById.get(catalogId) ?? [];
    if (!reasons.some((candidate) => candidate.text === reason.text && candidate.citation === reason.citation && candidate.url === reason.url)) reasons.push(reason);
    reasonsById.set(catalogId, reasons);
  }

  return reasonsById;
}

function formatPressPopularityReason(record, source) {
  const rank = Number(record.rank);
  if (!Number.isFinite(rank) || rank <= 0) return "";

  const rankingLabel = {
    magazine_sales: "magazine le plus diffusé",
    daily_national_sales: "quotidien national le plus diffusé",
    daily_regional_sales: "quotidien régional le plus diffusé",
    web_audience: "site d’information le plus visité",
    supplemental_web_audience: "site d’information le plus visité",
  }[record.kind] ?? source?.label ?? source?.ranking_name ?? "classement de référence";
  const metric = formatPressPopularityMetric(record);
  const publisher = source?.publisher || source?.label || "";
  const period = formatPressPopularityPeriod(source?.ranking_name);
  const sourceDetails = [publisher, period].filter(Boolean).join(", ");

  return {
    text: [
    `${rank === 1 ? "1er" : `${rank}e`} ${rankingLabel}`,
    metric ? `(${metric})` : "",
    ].filter(Boolean).join(" "),
    citation: sourceDetails,
  };
}

function formatPressPopularityReferenceText(reason) {
  return [reason.text, reason.citation ? `(${reason.citation})` : ""].filter(Boolean).join(" ");
}

function formatPressPopularityPeriod(rankingName) {
  if (!rankingName) return "";

  const isoDate = rankingName.match(/\b(20\d{2})-(\d{2})-\d{2}\b/);
  if (isoDate) {
    const date = new Date(Date.UTC(Number(isoDate[1]), Number(isoDate[2]) - 1, 1));
    return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
  }

  const yearRange = rankingName.match(/\b(20\d{2})[‐‑‒–—-](20\d{2})\b/);
  if (yearRange) return `${yearRange[1]}-${yearRange[2]}`;

  const namedMonth = rankingName.match(/\b(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(20\d{2})\b/i);
  if (namedMonth) return `${namedMonth[1].toLocaleLowerCase("fr-FR")} ${namedMonth[2]}`;

  return rankingName.match(/\b20\d{2}\b/)?.[0] ?? "";
}

function formatPressPopularityMetric(record) {
  const value = Number(record.qualification?.metric_value ?? record.metric?.value);
  if (!Number.isFinite(value)) return "";

  const formattedValue = new Intl.NumberFormat("fr-FR").format(value);
  if (["magazine_sales", "daily_national_sales", "daily_regional_sales"].includes(record.kind)) {
    return `${formattedValue} ex.`;
  }
  if (record.kind === "supplemental_web_audience" || record.qualification?.metric_evidence === "estimated_traffic") {
    return `${formattedValue} visites estimées`;
  }
  if (record.kind === "web_audience") {
    return `${formattedValue} visites`;
  }

  return record.metric?.name ? `${formattedValue} ${record.metric.name}` : formattedValue;
}

function renderPressTitleCountryBadge(resource) {
  const code = resource.country_code;
  const label = resource.country_label;

  if (
    !code
    || !label
    || code === "unknown"
  ) {
    return "";
  }

  const flag = resource.country_flag_url
    ? `<img class="country-flag" src="${escapeAttribute(resource.country_flag_url)}" alt="" decoding="async">`
    : "";

  const expanded = isContextNoteOpen(resource.id, "country");
  return `<button class="badge country" type="button" title="Pays : ${escapeAttribute(label)}" aria-label="Pays : ${escapeAttribute(label)}" aria-expanded="${String(expanded)}" aria-controls="pressPopularityNote" data-country-note-resource-id="${escapeAttribute(resource.id)}" data-context-note-resource-id="${escapeAttribute(resource.id)}" data-context-note-kind="country">${flag}</button>`;
}

function renderPressTitleLocalRegionBadges(resource) {
  const codes = resource.local_region_codes || [];
  if (!codes.length) return "";

  const labels = getPressTitleLocalRegionLabels(resource);
  const title = `Région${labels.length > 1 ? "s" : ""} : ${labels.join(", ")}`;
  const expanded = isContextNoteOpen(resource.id, "region");
  const visibleCodes = codes.slice(0, 3);
  const badges = visibleCodes.map((code, index) => `
    <button class="badge local-region" type="button" title="${escapeAttribute(title)}" aria-label="Région : ${escapeAttribute(labels[index])}" aria-expanded="${String(expanded)}" aria-controls="pressPopularityNote" data-region-note-resource-id="${escapeAttribute(resource.id)}" data-context-note-resource-id="${escapeAttribute(resource.id)}" data-context-note-kind="region">
      <span aria-hidden="true">${escapeHtml(formatLocalRegionBadgeCode(code))}</span>
    </button>
  `);

  if (codes.length > visibleCodes.length) {
    badges.push(`<button class="badge local-region more" type="button" title="${escapeAttribute(title)}" aria-label="${escapeAttribute(title)}" aria-expanded="${String(expanded)}" aria-controls="pressPopularityNote" data-region-note-resource-id="${escapeAttribute(resource.id)}" data-context-note-resource-id="${escapeAttribute(resource.id)}" data-context-note-kind="region">+${codes.length - visibleCodes.length}</button>`);
  }

  return badges.join("");
}

function getPressTitleLocalRegionLabels(resource) {
  const labelsById = new Map(
    (state.localGeography?.countries || [])
      .flatMap((country) => country.subdivisions || [])
      .map((region) => [region.id, region.label]),
  );
  return (resource.local_region_codes || []).map((code, index) => (
    resource.local_region_labels?.[index] || labelsById.get(code) || code
  ));
}

function renderPressTitleLanguageBadges(resource) {
  return renderLanguageBadges(resource);
}

function formatLocalRegionBadgeCode(code) {
  return String(code || "")
    .replace(/^fr-/i, "")
    .slice(0, 4)
    .toLocaleUpperCase("fr");
}

function renderPressTitleEditorialBadges(resource) {
  const labels = getResourceCategories(resource).filter((label) => label !== "Presse");
  if (!labels.length) {
    return "";
  }

  const title = labels.join(", ");
  return labels
    .map((label) => `<span class="badge editorial press-category-badge" title="${escapeAttribute(title)}">${escapeHtml(label)}</span>`)
    .join("");
}

function layoutPressTitleCategoryBadges(card) {
  const row = card.querySelector("[data-press-categories]");
  const overflow = row?.querySelector(".press-category-overflow");
  const badges = [...(row?.querySelectorAll(".press-category-badge") ?? [])];
  if (!row || !overflow || !badges.length || !row.isConnected) return;

  const expanded = row.dataset.expanded === "true";
  badges.forEach((badge) => { badge.hidden = false; });
  overflow.hidden = true;
  row.classList.toggle("is-expanded", expanded);

  if (expanded) {
    overflow.hidden = false;
    overflow.textContent = "−";
    overflow.title = "Réduire les catégories";
    overflow.setAttribute("aria-label", "Réduire les catégories");
    overflow.setAttribute("aria-expanded", "true");
    return;
  }

  const gap = Number.parseFloat(getComputedStyle(row).columnGap) || 0;
  const widths = badges.map((badge) => badge.getBoundingClientRect().width);
  const totalWidth = widths.reduce((sum, width) => sum + width, 0) + gap * Math.max(0, badges.length - 1);
  if (totalWidth <= row.clientWidth) return;

  overflow.hidden = false;
  overflow.textContent = `+${badges.length}`;
  const overflowWidth = overflow.getBoundingClientRect().width;
  let usedWidth = 0;
  let visibleCount = 0;
  for (const width of widths) {
    const nextWidth = usedWidth + (visibleCount ? gap : 0) + width;
    const remainingCount = badges.length - visibleCount - 1;
    const reservedWidth = remainingCount > 0 ? gap + overflowWidth : 0;
    if (nextWidth + reservedWidth > row.clientWidth) break;
    usedWidth = nextWidth;
    visibleCount += 1;
  }

  badges.forEach((badge, index) => { badge.hidden = index >= visibleCount; });
  const hiddenCount = badges.length - visibleCount;
  overflow.textContent = `+${hiddenCount}`;
  overflow.title = `Afficher ${hiddenCount} catégorie${hiddenCount > 1 ? "s" : ""} supplémentaire${hiddenCount > 1 ? "s" : ""}`;
  overflow.setAttribute("aria-label", overflow.title);
  overflow.setAttribute("aria-expanded", "false");
}

function schedulePressTitleCategoryBadgeLayout() {
  if (pressTitleCategoryLayoutFrame) return;
  pressTitleCategoryLayoutFrame = requestAnimationFrame(() => {
    pressTitleCategoryLayoutFrame = null;
    document.querySelectorAll(".press-title-card").forEach(layoutPressTitleCategoryBadges);
  });
}

function getLanguageSummaryLabel(languageData) {
  if (languageData.language_count) {
    return `${languageData.language_count} langues`;
  }

  if (languageData.language_count_min) {
    return `${languageData.language_count_min} langues ou plus`;
  }

  return "Plusieurs langues";
}

function formatLanguageTooltipItem(code) {
  const normalizedCode = normalizeLanguageCode(code);
  const label = state.languageVocabulary[normalizedCode] || state.languageVocabulary[code];
  return label ? `${capitalize(label)} (${formatLanguageBadgeText(normalizedCode)})` : formatLanguageBadgeText(normalizedCode);
}

function formatLanguageOptionLabel(code) {
  const normalizedCode = normalizeLanguageCode(code);
  const label = state.languageVocabulary[normalizedCode] || state.languageVocabulary[code];
  return label ? `${capitalize(label)} (${formatLanguageBadgeText(normalizedCode)})` : formatLanguageBadgeText(normalizedCode);
}

function formatLanguageBadgeText(code) {
  const normalizedCode = normalizeLanguageCode(code);
  return compactLanguageCodes[normalizedCode] ?? normalizedCode.slice(0, 2).toUpperCase();
}

function isReviewLogo(resource) {
  const iconUrl = String(resource.icon_url ?? "");

  return (
    resource.source === "pressreader"
    && iconUrl.includes("/pressreader-cover-")
  ) || (
    resource.source === "indexpresse_business"
    && iconUrl.includes("/indexpresse-cover-")
  ) || (
    resource.source === "factiva"
    && resource.logo_status === "review"
  );
}

function hasLogo(resource) {
  return Boolean(String(resource.icon_url ?? "").trim());
}

function getAccessMode(resource) {
  if (resource.access_mode && accessModeLabels[resource.access_mode]) {
    return resource.access_mode;
  }

  return resource.remote ? "remote" : "onsite";
}

function getAccessModeLabel(resource) {
  return resource.access_label || accessModeLabels[getAccessMode(resource)] || accessModeLabels.onsite;
}

function getAccessModeTitle(resource) {
  const label = getAccessModeLabel(resource);
  const note = resource.access_note?.trim();
  return note ? `${label} : ${note}` : label;
}

function renderIcon(resource, eager = false) {
  const image = `<img src="${escapeAttribute(resource.icon_url)}" alt="" aria-hidden="true" loading="${eager ? "eager" : "lazy"}" decoding="async"${eager ? ' fetchpriority="high"' : ""}>`;
  if (/^#[0-9a-f]{6}$/i.test(resource.icon_background_color ?? "") && /\.svg$/i.test(resource.icon_url)) {
    queueMicrotask(() => hydrateThemedSvgIcons());
    return `<span class="themed-svg-icon" data-icon-src="${escapeAttribute(resource.icon_url)}" data-icon-color="${escapeAttribute(resource.icon_background_color)}">${image}</span>`;
  }
  return image;
}

function getFallbackLabel(resource) {
  if (resource.fallback_label) return resource.fallback_label;
  return resource.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function loadFavorites() {
  const ready = readStoredValue(favoriteStorageReadyKey) === "true";
  const stored = readStoredValue(favoriteStorageKey);

  if (ready || stored !== null) {
    try {
      const favorites = JSON.parse(stored ?? "[]");
      if (!Array.isArray(favorites)) throw new Error("Favoris invalides");
      state.favorites = new Set(favorites.filter((id) => typeof id === "string").map(resolveCatalogResourceId));
    } catch {
      state.favorites = new Set();
    }
    state.favoritesReady = true;
    state.favoritesInitializedFromDefaults = false;
    return;
  }

  state.favorites = new Set(
    state.resources
      .filter((resource) => resource.default_favorite && isCatalogVisible(resource))
      .map((resource) => resource.id),
  );
  state.favoritesReady = true;
  state.favoritesInitializedFromDefaults = true;
  saveFavorites();
}

function loadFavoriteOrder() {
  state.favoriteOrderCustom = readStoredValue(favoriteOrderCustomStorageKey) === "true";

  if (!state.favoriteOrderCustom) {
    state.favoriteOrder = [];
    return;
  }

  try {
    state.favoriteOrder = [...new Set(JSON.parse(readStoredValue(favoriteOrderStorageKey) ?? "[]").map(resolveCatalogResourceId))];
  } catch {
    state.favoriteOrder = [];
  }

  syncFavoriteOrder();
  normalizeFavoriteOrderMode();
}

function loadFavoriteLayout() {
  const stored = readStoredValue(favoriteLayoutStorageKey);
  let layout = null;
  let favoriteIds = [...state.favorites];

  if (stored !== null) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.version === 1 && Array.isArray(parsed.rows)) {
        layout = parsed;
        favoriteIds = listFavoriteResourceIds(parsed);
      }
    } catch {
      layout = null;
    }
  }

  const canonicalRows = layout?.rows?.length === 2
    && layout.rows[0]?.id === "resources"
    && layout.rows[1]?.id === "press"
    && layout.rows.every((row) => row.items?.every((item) => item.type === "resource"));
  if (canonicalRows && readStoredValue(pressFavoriteLayoutMigratedStorageKey) !== "true") {
    state.favoriteLayoutNeedsPressClassification = true;
    state.pendingInitialFavoriteOrder = listFavoriteResourceIds(layout);
    state.pendingDefaultPressFavorites = false;
  }

  if (!layout) {
    loadFavoriteOrder();
    const orderedIds = state.favoriteOrderCustom ? state.favoriteOrder : getAlphaFavoriteIds();
    const addDefaultPressFavorites = state.favoritesInitializedFromDefaults
      || readStoredValue(legacyFavoritesMigratedStorageKey) === "true";
    layout = createInitialFavoriteLayout(orderedIds, {
      addDefaultPressFavorites,
    });
    if (!state.pressLoaded) {
      state.favoriteLayoutNeedsPressClassification = true;
      state.pendingInitialFavoriteOrder = [...orderedIds];
      state.pendingDefaultPressFavorites = addDefaultPressFavorites;
    }
    favoriteIds = listFavoriteResourceIds(layout);
  }

  state.favoriteLayout = normalizeFavoriteLayout(layout, favoriteIds, resolveCatalogResourceId);
  state.favorites = new Set(listFavoriteResourceIds(state.favoriteLayout));
  saveFavorites();
  if (!state.favoriteLayoutNeedsPressClassification) saveFavoriteLayout();
}

function finalizeInitialFavoriteLayout() {
  if (!state.favoriteLayoutNeedsPressClassification || !state.pressLoaded) return;
  const layout = createInitialFavoriteLayout(state.pendingInitialFavoriteOrder, {
    addDefaultPressFavorites: state.pendingDefaultPressFavorites,
  });
  const favoriteIds = listFavoriteResourceIds(layout);
  state.favoriteLayout = normalizeFavoriteLayout(layout, favoriteIds, resolveCatalogResourceId);
  state.favorites = new Set(listFavoriteResourceIds(state.favoriteLayout));
  state.favoriteLayoutNeedsPressClassification = false;
  state.pendingInitialFavoriteOrder = [];
  state.pendingDefaultPressFavorites = false;
  saveFavorites();
  saveFavoriteLayout();
  writeStoredValue(pressFavoriteLayoutMigratedStorageKey, "true");
}

function createInitialFavoriteLayout(orderedIds, { addDefaultPressFavorites = false } = {}) {
  const favoriteIds = [...state.favorites];
  const seen = new Set(favoriteIds);

  if (addDefaultPressFavorites) {
    for (const resource of state.resources) {
      const entryTypes = new Set(resource.entry_types ?? []);
      if (!resource.default_favorite || !isCatalogVisible(resource)
        || !entryTypes.has("press_title") || entryTypes.has("resource") || seen.has(resource.id)) continue;
      seen.add(resource.id);
      favoriteIds.push(resource.id);
    }
  }

  const completeOrder = [...orderedIds];
  const ordered = new Set(completeOrder);
  for (const id of favoriteIds) {
    if (!ordered.has(id)) {
      ordered.add(id);
      completeOrder.push(id);
    }
  }

  const resourceIds = [];
  const pressIds = [];
  const promotedPressIds = [];
  for (const id of completeOrder) {
    if (!seen.has(id)) continue;
    const resource = state.resources.find((entry) => entry.id === id);
    const entryTypes = new Set(resource?.entry_types ?? []);
    if (entryTypes.has("press_title")) {
      pressIds.push(id);
      if (entryTypes.has("resource")) promotedPressIds.push(id);
    } else {
      resourceIds.push(id);
    }
  }

  const promoted = new Set(promotedPressIds);
  const orderedPress = [
    ...promotedPressIds,
    ...pressIds.filter((id) => !promoted.has(id)),
  ];
  const resourceLayout = createFavoriteLayout(resourceIds, resourceIds);
  const pressLayout = createFavoriteLayout(pressIds, orderedPress);
  return {
    version: resourceLayout.version,
    rows: [
      { ...resourceLayout.rows[0], id: "resources", name: "Ressources" },
      { ...pressLayout.rows[0], id: "press", name: "Presse" },
    ],
  };
}

function resolveCatalogResourceId(id) {
  const seen = new Set();
  id = legacyCatalogResourceIds.get(id) ?? id;
  let resource = state.resources.find((entry) => entry.id === id);
  while (resource?.merged_into && !seen.has(id)) {
    seen.add(id);
    id = resource.merged_into;
    resource = state.resources.find((entry) => entry.id === id);
  }
  return id;
}

function loadEditionSelections() {
  const stored = readStoredValue(editionSelectionStorageKey);

  try {
    const parsed = JSON.parse(stored ?? "{}");
    state.editionSelections = new Map(
      Object.entries(parsed)
        .filter(([resourceId, editionId]) => (
          typeof resourceId === "string"
          && typeof editionId === "string"
          && (!getResourceById(resourceId) || isValidEditionSelection(getResourceById(resourceId), editionId))
        )),
    );
  } catch {
    state.editionSelections = new Map();
  }
}

function saveEditionSelections() {
  writeStoredValue(
    editionSelectionStorageKey,
    JSON.stringify(Object.fromEntries(state.editionSelections)),
  );
}

function loadProfileFilters() {
  const storedPass = readStoredValue(passFilterStorageKey);
  const storedRemote = readStoredValue(remoteFilterStorageKey);
  const storedSiteAccess = readStoredValue(siteAccessStorageKey);
  const storedLanguageFilter = readStoredValue(languageFilterStorageKey);

  if ([...passFilter.options].some((option) => option.value === storedPass)) {
    state.passFilter = storedPass;
  }

  if ([...remoteFilter.options].some((option) => option.value === storedRemote)) {
    state.remoteFilter = storedRemote;
  } else if (storedRemote === "remote_conditional" || storedRemote === "free") {
    state.remoteFilter = "remote";
  } else if (storedRemote === "onsite_extended") {
    state.remoteFilter = "onsite";
  }

  if (siteAccessValues.has(storedSiteAccess)) {
    state.siteAccess = storedSiteAccess;
  } else {
    state.siteAccess = getSiteAccessFromRemoteFilter(state.remoteFilter);
  }

  state.languageFilter = parseStoredLanguageFilter(storedLanguageFilter);

  passFilter.value = state.passFilter;
  remoteFilter.value = state.remoteFilter;
  syncProfileFilterState();
}

function saveProfileFilters() {
  writeStoredValue(passFilterStorageKey, state.passFilter);
  writeStoredValue(remoteFilterStorageKey, state.remoteFilter);
  writeStoredValue(siteAccessStorageKey, state.siteAccess);
  writeStoredValue(languageFilterStorageKey, JSON.stringify([...state.languageFilter]));
}

function syncProfileFilterState() {
  const hasSelectedProfile = state.passFilter !== "all";
  passFilter.classList.toggle("has-selected-profile", hasSelectedProfile);
  passFilter.closest("label")?.classList.toggle("has-selected-profile", hasSelectedProfile);
  settingsPassFilter.value = state.passFilter;
  settingsSiteAccess.value = state.siteAccess;
  settingsPassFilter.closest("label")?.classList.toggle("has-selected-profile", hasSelectedProfile);
  settingsSiteAccess
    .closest("label")
    ?.classList.toggle("has-selected-profile", state.siteAccess !== "unknown");
  renderLanguageFilterControls();
}

function parseStoredLanguageFilter(value) {
  const knownCodes = getKnownLanguageCodes();

  try {
    return new Set(
      JSON.parse(value ?? "[]")
        .filter((code) => typeof code === "string")
        .map(normalizeLanguageCode)
        .filter((code) => knownCodes.has(code)),
    );
  } catch {
    const normalizedValue = normalizeLanguageCode(value);
    if (typeof value === "string" && knownCodes.has(normalizedValue)) {
      return new Set([normalizedValue]);
    }

    if (value === "non-fr") {
      return new Set([...knownCodes].filter((code) => code !== "fr" && code !== "mul"));
    }

    return new Set();
  }
}

function getSiteAccessFromRemoteFilter(value) {
  if (value === "remote") {
    return "no";
  }

  if (value === "onsite") {
    return "yes";
  }

  return "unknown";
}

function getRemoteFilterFromSiteAccess(value) {
  return value === "no" ? "remote" : "all";
}

function capitalize(value) {
  const text = String(value ?? "");
  return text ? `${text[0].toLocaleUpperCase("fr")}${text.slice(1)}` : "";
}

function toggleFavorite(resourceId) {
  const isFavorite = state.favorites.has(resourceId);

  if (isFavorite) {
    state.favorites.delete(resourceId);
    removeFavoriteResource(state.favoriteLayout, resourceId);
    if (state.draftFavoriteLayout) removeFavoriteResource(state.draftFavoriteLayout, resourceId);
  } else {
    state.favorites.add(resourceId);
    if (!state.favoriteLayout.rows.length) createFavoriteRow(state.favoriteLayout, createFavoriteContainerId("row"));
    moveFavoriteResource(state.favoriteLayout, resourceId, { rowId: state.favoriteLayout.rows[0].id });
    if (state.draftFavoriteLayout) {
      if (!state.draftFavoriteLayout.rows.length) createFavoriteRow(state.draftFavoriteLayout, createFavoriteContainerId("row"));
      moveFavoriteResource(state.draftFavoriteLayout, resourceId, { rowId: state.draftFavoriteLayout.rows[0].id });
    }
  }

  saveFavorites();
  saveFavoriteLayout();
  render();
}

function saveFavorites() {
  writeStoredValue(favoriteStorageKey, JSON.stringify([...state.favorites]));
  writeStoredValue(favoriteStorageReadyKey, "true");
}

function saveFavoriteOrder() {
  writeStoredValue(favoriteOrderStorageKey, JSON.stringify(state.favoriteOrder));
  writeStoredValue(favoriteOrderCustomStorageKey, String(state.favoriteOrderCustom));
}

function saveFavoriteLayout() {
  writeStoredValue(favoriteLayoutStorageKey, JSON.stringify(state.favoriteLayout));
}

function createFavoriteContainerId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function syncFavoriteOrder() {
  if (!state.favoriteOrderCustom) {
    return;
  }

  const previous = state.favoriteOrder.join("|");
  const favoriteIds = new Set(state.favorites);
  const ordered = state.favoriteOrder.filter((id) => favoriteIds.has(id));
  const knownIds = new Set(ordered);
  const missing = getAlphaFavoriteResources()
    .map((resource) => resource.id)
    .filter((id) => !knownIds.has(id));

  state.favoriteOrder = [...ordered, ...missing];

  if (state.favoriteOrder.join("|") !== previous) {
    saveFavoriteOrder();
  }
}

function normalizeFavoriteOrderMode() {
  if (!state.favoriteOrderCustom || !state.pressLoaded) {
    return;
  }

  const alphaOrder = getAlphaFavoriteIds();

  if (!sameOrder(state.favoriteOrder, alphaOrder)) {
    return;
  }

  state.favoriteOrder = [];
  state.favoriteOrderCustom = false;
  saveFavoriteOrder();
}

function getAlphaFavoriteIds() {
  return getAlphaFavoriteResources().map((resource) => resource.id);
}

function sameOrder(left, right) {
  return left.length === right.length && left.every((id, index) => id === right[index]);
}

function startQuickLaunchEdit(event) {
  if (state.quickLaunchEditing || state.quickLaunchTransitioning) {
    return;
  }

  const button = event?.currentTarget;
  if (button && !prefersReducedMotion()) {
    state.quickLaunchTransitioning = true;
    button.disabled = true;
    button.classList.add("is-exiting");
    window.setTimeout(enterQuickLaunchEdit, 170);
    return;
  }

  enterQuickLaunchEdit();
}

function enterQuickLaunchEdit() {
  state.quickLaunchTransitioning = false;
  state.quickLaunchEditing = true;
  state.quickLaunchActionMenus.clear();
  state.quickLaunchActionsEntering = !prefersReducedMotion();
  state.draftFavoriteLayout = cloneFavoriteLayout(state.favoriteLayout);
  render();
}

function saveQuickLaunchOrder() {
  leaveQuickLaunchEdit(() => {
    state.favoriteLayout = normalizeFavoriteLayout(
      state.draftFavoriteLayout,
      listFavoriteResourceIds(state.draftFavoriteLayout),
      resolveCatalogResourceId,
    );
    state.favorites = new Set(listFavoriteResourceIds(state.favoriteLayout));
    saveFavorites();
    saveFavoriteLayout();
  });
}

function cancelQuickLaunchEdit() {
  leaveQuickLaunchEdit();
}

function leaveQuickLaunchEdit(applyExitAction = null) {
  if (!state.quickLaunchEditing || state.quickLaunchTransitioning) {
    return;
  }

  state.quickLaunchPendingExitAction = applyExitAction;

  if (prefersReducedMotion()) {
    finishQuickLaunchExit();
    return;
  }

  state.quickLaunchTransitioning = true;
  state.quickLaunchActionsExiting = true;
  render();
  window.setTimeout(finishQuickLaunchExit, 210);
}

function finishQuickLaunchExit() {
  state.quickLaunchPendingExitAction?.();
  state.quickLaunchPendingExitAction = null;
  state.quickLaunchTransitioning = false;
  state.quickLaunchActionsExiting = false;
  state.quickLaunchEditing = false;
  state.quickLaunchModifierEntering = !prefersReducedMotion();
  state.draftFavoriteLayout = null;
  clearQuickLaunchDrag();
  render();
}

function handleQuickLaunchRemove(event) {
  event.preventDefault();
  event.stopPropagation();
  const resourceId = event.currentTarget.dataset.resourceId;
  removeFavoriteResource(state.draftFavoriteLayout, resourceId);
  clearQuickLaunchDrag();
  render();
}

function addDraftFavoriteRow(index) {
  const row = createFavoriteRow(state.draftFavoriteLayout, createFavoriteContainerId("row"), "", index);
  renderQuickLaunch();
  quickLaunch.querySelector(`.quick-launch-row[data-row-id="${CSS.escape(row.id)}"] .quick-launch-row-name`)?.focus();
}

function stopQuickLaunchRemoveEvent(event) {
  event.stopPropagation();
}

function resetQuickLaunchActionAnimationFlag() {
  if (!state.quickLaunchActionsEntering && !state.quickLaunchModifierEntering) {
    return;
  }

  requestAnimationFrame(() => {
    state.quickLaunchActionsEntering = false;
    state.quickLaunchModifierEntering = false;
  });
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function handleQuickLaunchPointerDown(event) {
  if (!state.quickLaunchEditing || event.button > 0) {
    return;
  }

  const resourceId = event.currentTarget.dataset.resourceId;
  const folderId = event.currentTarget.dataset.folderId;
  state.dragging = createQuickLaunchDragState({
    kind: resourceId ? "resource" : "folder",
    id: resourceId || folderId,
    sourceRowId: event.currentTarget.dataset.rowId,
    sourceFolderId: resourceId ? event.currentTarget.dataset.folderId || null : null,
    sourceElement: event.currentTarget,
    event,
  });
  bindQuickLaunchPointerDrag();
}

function handleQuickLaunchRowPointerDown(event) {
  if (!state.quickLaunchEditing || event.button > 0) return;
  const sourceElement = event.currentTarget.closest(".quick-launch-row");
  if (!sourceElement) return;
  event.preventDefault();
  state.dragging = createQuickLaunchDragState({
    kind: "row",
    id: sourceElement.dataset.rowId,
    sourceRowId: sourceElement.dataset.rowId,
    sourceElement,
    event,
  });
  bindQuickLaunchPointerDrag();
}

function createQuickLaunchDragState({ kind, id, sourceRowId, sourceFolderId = null, sourceElement, event }) {
  return {
    kind,
    id,
    sourceRowId,
    sourceFolderId,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    active: false,
    sourceElement,
    ghostElement: null,
    lastClientX: event.clientX,
    lastClientY: event.clientY,
    autoScrollFrame: null,
    autoScrollDirection: 0,
    autoScrollStrength: 0,
    autoScrollStartedAt: 0,
    autoScrollLastAt: 0,
  };
}

function bindQuickLaunchPointerDrag() {
  window.addEventListener("pointermove", handleQuickLaunchPointerMove, { passive: false });
  window.addEventListener("pointerup", handleQuickLaunchPointerUp);
  window.addEventListener("pointercancel", handleQuickLaunchPointerUp);
}

function preventQuickLaunchEditContextMenu(event) {
  if (!state.quickLaunchEditing) {
    return;
  }

  event.preventDefault();
}

function handleQuickLaunchPointerMove(event) {
  if (!state.dragging) {
    return;
  }

  event.preventDefault();

  const distance = Math.abs(event.clientX - state.dragging.startX) + Math.abs(event.clientY - state.dragging.startY);
  if (!state.dragging.active && distance > 4) activateQuickLaunchDrag(event);
  if (!state.dragging.active) return;
  positionQuickLaunchDragGhost(event);
  state.dragging.lastClientX = event.clientX;
  state.dragging.lastClientY = event.clientY;
  updateQuickLaunchDropTarget(event.clientX, event.clientY);
  updateQuickLaunchDragAutoScroll(event);
}

function updateQuickLaunchDropTarget(clientX, clientY) {
  clearQuickLaunchDropIndicators();

  const pointedElement = document.elementFromPoint(clientX, clientY);
  if (state.dragging.kind === "row") {
    updateQuickLaunchRowDropTarget(pointedElement, clientY);
    return;
  }
  const target = pointedElement?.closest(".quick-launch-item, .quick-launch-list");
  state.dragging.dropTarget = null;
  if (isDraggingResourceOutsideItsFolder({ clientX, clientY })) {
    state.dragging.dropTarget = { type: "row", rowId: state.dragging.sourceRowId };
    quickLaunch.querySelector(`.quick-launch-list[data-row-id="${CSS.escape(state.dragging.sourceRowId)}"]`)?.classList.add("is-drop-target");
    return;
  }
  if (!target) return;

  if (state.dragging.kind === "folder") {
    setQuickLaunchFolderDropTarget(target, { clientX, clientY });
  } else if (target.dataset.folderId && !target.dataset.resourceId) {
    state.dragging.dropTarget = { type: "folder", rowId: target.dataset.rowId, folderId: target.dataset.folderId };
  } else if (target.dataset.resourceId && target.dataset.resourceId !== state.dragging.id) {
    const bounds = target.getBoundingClientRect();
    const horizontalPosition = (clientX - bounds.left) / bounds.width;
    state.dragging.dropTarget = horizontalPosition > 0.28 && horizontalPosition < 0.72
      ? { type: "combine", resourceId: target.dataset.resourceId }
      : { type: "position", resourceId: target.dataset.resourceId, after: horizontalPosition >= 0.72 };
  } else if (target.classList.contains("quick-launch-list")) {
    state.dragging.dropTarget = { type: "row", rowId: target.dataset.rowId };
  }
  if (state.dragging.dropTarget) {
    const combines = state.dragging.kind === "resource" && ["combine", "folder"].includes(state.dragging.dropTarget.type);
    target.classList.add(combines ? "is-combine-target" : "is-drop-target");
    if (["position", "folder-position"].includes(state.dragging.dropTarget.type)) {
      target.dataset.dropPosition = state.dragging.dropTarget.after ? "after" : "before";
    }
  }
}

function updateQuickLaunchRowDropTarget(pointedElement, clientY) {
  state.dragging.dropTarget = null;
  const target = pointedElement?.closest(".quick-launch-row");
  if (!target || target.dataset.rowId === state.dragging.id) return;
  const bounds = target.getBoundingClientRect();
  const after = clientY >= bounds.top + bounds.height / 2;
  state.dragging.dropTarget = { type: "row-position", rowId: target.dataset.rowId, after };
  target.dataset.rowDropPosition = after ? "after" : "before";
}

function updateQuickLaunchDragAutoScroll(event) {
  const dragging = state.dragging;
  const supportsAutoScroll = dragging?.kind === "row"
    || event.pointerType === "touch"
    || pressTitleNarrowLayoutQuery.matches;
  if (!dragging?.active || !supportsAutoScroll) {
    stopQuickLaunchDragAutoScroll();
    return;
  }

  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  const pointerY = event.clientY - (window.visualViewport?.offsetTop || 0);
  const topDistance = pointerY;
  const bottomDistance = viewportHeight - pointerY;
  let direction = 0;
  let strength = 0;

  if (topDistance < quickLaunchAutoScrollEdge) {
    direction = -1;
    strength = 1 - Math.max(0, topDistance) / quickLaunchAutoScrollEdge;
  } else if (bottomDistance < quickLaunchAutoScrollEdge) {
    direction = 1;
    strength = 1 - Math.max(0, bottomDistance) / quickLaunchAutoScrollEdge;
  }

  const bounds = getQuickLaunchAutoScrollBounds(viewportHeight);
  const atBound = direction < 0
    ? window.scrollY <= bounds.min + 0.5
    : direction > 0 && window.scrollY >= bounds.max - 0.5;
  if (!direction || atBound) {
    stopQuickLaunchDragAutoScroll();
    return;
  }

  if (dragging.autoScrollDirection !== direction) {
    dragging.autoScrollDirection = direction;
    dragging.autoScrollStartedAt = performance.now();
    dragging.autoScrollLastAt = 0;
  }
  dragging.autoScrollStrength = strength;
  if (!dragging.autoScrollFrame) {
    dragging.autoScrollFrame = requestAnimationFrame(stepQuickLaunchDragAutoScroll);
  }
}

function stepQuickLaunchDragAutoScroll(timestamp) {
  const dragging = state.dragging;
  if (!dragging?.active || !dragging.autoScrollDirection) return;

  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  const bounds = getQuickLaunchAutoScrollBounds(viewportHeight);
  const elapsed = Math.max(0, timestamp - dragging.autoScrollStartedAt);
  const acceleration = Math.min(1, elapsed / quickLaunchAutoScrollAccelerationMs);
  const proximitySpeed = quickLaunchAutoScrollMinSpeed
    + (quickLaunchAutoScrollMaxSpeed - quickLaunchAutoScrollMinSpeed) * dragging.autoScrollStrength;
  const speed = quickLaunchAutoScrollMinSpeed
    + (proximitySpeed - quickLaunchAutoScrollMinSpeed) * (0.35 + acceleration * 0.65);
  const frameScale = dragging.autoScrollLastAt
    ? Math.min(2, (timestamp - dragging.autoScrollLastAt) / (1000 / 60))
    : 1;
  const nextScrollY = Math.min(
    bounds.max,
    Math.max(bounds.min, window.scrollY + dragging.autoScrollDirection * speed * frameScale),
  );
  dragging.autoScrollLastAt = timestamp;

  if (Math.abs(nextScrollY - window.scrollY) < 0.5) {
    stopQuickLaunchDragAutoScroll();
    return;
  }

  window.scrollTo({ top: nextScrollY, behavior: "auto" });
  updateQuickLaunchDropTarget(dragging.lastClientX, dragging.lastClientY);
  dragging.autoScrollFrame = requestAnimationFrame(stepQuickLaunchDragAutoScroll);
}

function getQuickLaunchAutoScrollBounds(viewportHeight) {
  const sectionBounds = quickLaunch.getBoundingClientRect();
  const sectionTop = window.scrollY + sectionBounds.top;
  const sectionBottom = window.scrollY + sectionBounds.bottom;
  const min = Math.max(0, sectionTop - 8);
  return {
    min,
    max: Math.max(min, sectionBottom - viewportHeight + 8),
  };
}

function stopQuickLaunchDragAutoScroll() {
  const dragging = state.dragging;
  if (!dragging) return;
  if (dragging.autoScrollFrame) cancelAnimationFrame(dragging.autoScrollFrame);
  dragging.autoScrollFrame = null;
  dragging.autoScrollDirection = 0;
  dragging.autoScrollStrength = 0;
  dragging.autoScrollStartedAt = 0;
  dragging.autoScrollLastAt = 0;
}

function handleQuickLaunchPointerUp() {
  stopQuickLaunchDragAutoScroll();
  window.removeEventListener("pointermove", handleQuickLaunchPointerMove);
  window.removeEventListener("pointerup", handleQuickLaunchPointerUp);
  window.removeEventListener("pointercancel", handleQuickLaunchPointerUp);
  const dragging = state.dragging;
  if (dragging?.active && dragging.dropTarget) {
    if (dragging.kind === "row") applyDraftFavoriteRowDrop(dragging.id, dragging.dropTarget);
    else if (dragging.kind === "folder") applyDraftFavoriteFolderDrop(dragging.id, dragging.dropTarget);
    else applyDraftFavoriteDrop(dragging.id, dragging.dropTarget);
  }
  const folderToReopen = dragging?.active && dragging.kind === "resource" && dragging.sourceFolderId
    && findFavoriteResource(state.draftFavoriteLayout, dragging.id)?.folder?.id === dragging.sourceFolderId
      ? dragging.sourceFolderId
      : null;
  const shouldRender = dragging?.active === true;
  if (dragging?.active && dragging.kind === "folder") {
    state.suppressedFavoriteFolderClickId = dragging.id;
    window.setTimeout(() => {
      if (state.suppressedFavoriteFolderClickId === dragging.id) state.suppressedFavoriteFolderClickId = null;
    }, 0);
  }
  clearQuickLaunchDrag();
  if (shouldRender) {
    renderQuickLaunch();
    if (folderToReopen) openQuickLaunchFolder(folderToReopen);
  }
}

function activateQuickLaunchDrag(event) {
  const dragging = state.dragging;
  if (!dragging?.sourceElement) return;
  dragging.active = true;
  dragging.sourceElement.classList.add("is-dragging");
  const ghost = dragging.kind === "row"
    ? createQuickLaunchRowDragGhost(dragging.sourceElement)
    : dragging.sourceElement.cloneNode(true);
  ghost.className = dragging.kind === "row" ? "quick-launch-row-drag-ghost" : "quick-launch-drag-ghost";
  ghost.removeAttribute("data-resource-id");
  ghost.removeAttribute("data-row-id");
  ghost.removeAttribute("data-folder-id");
  ghost.removeAttribute("role");
  ghost.removeAttribute("tabindex");
  ghost.setAttribute("aria-hidden", "true");
  ghost.querySelectorAll(".quick-launch-remove, .quick-launch-folder-remove, .quick-launch-destination-control, .quick-launch-folder-name, .quick-launch-row-actions").forEach((element) => element.remove());
  const bounds = dragging.sourceElement.getBoundingClientRect();
  ghost.style.width = `${bounds.width}px`;
  document.body.append(ghost);
  dragging.ghostElement = ghost;
  positionQuickLaunchDragGhost(event);
}

function createQuickLaunchRowDragGhost(sourceElement) {
  const ghost = document.createElement("div");
  const handle = sourceElement.querySelector(".quick-launch-row-drag-handle")?.cloneNode(true);
  const label = document.createElement("strong");
  label.textContent = sourceElement.querySelector(".quick-launch-row-name")?.value || "Ligne sans nom";
  if (handle) ghost.append(handle);
  ghost.append(label);
  return ghost;
}

function positionQuickLaunchDragGhost(event) {
  const ghost = state.dragging?.ghostElement;
  if (!ghost) return;
  ghost.style.left = `${event.clientX}px`;
  ghost.style.top = `${event.clientY}px`;
}

function clearQuickLaunchDropIndicators() {
  quickLaunch.querySelectorAll(".is-drop-target, .is-combine-target, [data-drop-position], [data-row-drop-position]").forEach((element) => {
    element.classList.remove("is-drop-target", "is-combine-target");
    delete element.dataset.dropPosition;
    delete element.dataset.rowDropPosition;
  });
}

function applyDraftFavoriteRowDrop(rowId, target) {
  if (target.type !== "row-position" || target.rowId === rowId) return;
  const rows = state.draftFavoriteLayout.rows;
  const sourceIndex = rows.findIndex((row) => row.id === rowId);
  if (sourceIndex < 0) return;
  const [row] = rows.splice(sourceIndex, 1);
  const targetIndex = rows.findIndex((candidate) => candidate.id === target.rowId);
  if (targetIndex < 0) {
    rows.splice(sourceIndex, 0, row);
    return;
  }
  rows.splice(targetIndex + (target.after ? 1 : 0), 0, row);
}

function clearQuickLaunchDrag() {
  stopQuickLaunchDragAutoScroll();
  state.dragging?.sourceElement?.classList.remove("is-dragging");
  state.dragging?.ghostElement?.remove();
  clearQuickLaunchDropIndicators();
  state.dragging = null;
}

function isDraggingResourceOutsideItsFolder(event) {
  if (state.dragging?.kind !== "resource" || !state.dragging.sourceFolderId) return false;
  const dialog = document.querySelector(`.quick-launch-folder-dialog[data-folder-id="${CSS.escape(state.dragging.sourceFolderId)}"]`);
  if (!dialog) return false;
  const bounds = dialog.getBoundingClientRect();
  return event.clientX < bounds.left
    || event.clientX > bounds.right
    || event.clientY < bounds.top
    || event.clientY > bounds.bottom;
}

function setQuickLaunchFolderDropTarget(target, event) {
  if (target.dataset.folderId && !target.dataset.resourceId) {
    if (target.dataset.folderId === state.dragging.id) return;
    const bounds = target.getBoundingClientRect();
    state.dragging.dropTarget = {
      type: "folder-position",
      folderId: target.dataset.folderId,
      after: event.clientX >= bounds.left + bounds.width / 2,
    };
    return;
  }
  if (target.dataset.resourceId && !target.dataset.folderId) {
    const bounds = target.getBoundingClientRect();
    state.dragging.dropTarget = {
      type: "position",
      resourceId: target.dataset.resourceId,
      after: event.clientX >= bounds.left + bounds.width / 2,
    };
    return;
  }
  if (target.classList.contains("quick-launch-list") && target.dataset.rowId) {
    state.dragging.dropTarget = { type: "row", rowId: target.dataset.rowId };
  }
}

function handleQuickLaunchKeyDown(event) {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
    return;
  }

  event.preventDefault();
  const resourceId = event.currentTarget.dataset.resourceId;
  const location = findFavoriteResource(state.draftFavoriteLayout, resourceId);
  if (!location) return;
  const container = location.folder ? location.folder.resourceIds : location.row.items;
  const currentIndex = location.folder ? location.resourceIndex : location.itemIndex;
  let nextIndex = currentIndex;

  if (event.key === "ArrowLeft") {
    nextIndex = Math.max(0, currentIndex - 1);
  }
  if (event.key === "ArrowRight") {
    nextIndex = Math.min(container.length - 1, currentIndex + 1);
  }
  if (event.key === "Home") {
    nextIndex = 0;
  }
  if (event.key === "End") {
    nextIndex = container.length - 1;
  }

  if (nextIndex !== currentIndex) {
    const [item] = container.splice(currentIndex, 1);
    container.splice(nextIndex, 0, item);
  } else if ((event.key === "ArrowUp" || event.key === "ArrowDown") && !location.folder) {
    const rowIndex = state.draftFavoriteLayout.rows.indexOf(location.row);
    const nextRow = state.draftFavoriteLayout.rows[rowIndex + (event.key === "ArrowUp" ? -1 : 1)];
    if (nextRow) moveFavoriteResource(state.draftFavoriteLayout, resourceId, { rowId: nextRow.id });
  } else {
    return;
  }

  renderQuickLaunch();
  quickLaunch.querySelector(`.quick-launch-item[data-resource-id="${CSS.escape(resourceId)}"]`)?.focus();
}

function applyDraftFavoriteDrop(resourceId, target) {
  if (target.type === "folder") {
    moveFavoriteResource(state.draftFavoriteLayout, resourceId, { rowId: target.rowId, folderId: target.folderId });
    return;
  }
  if (target.type === "row") {
    moveFavoriteResource(state.draftFavoriteLayout, resourceId, { rowId: target.rowId });
    return;
  }

  const targetLocation = findFavoriteResource(state.draftFavoriteLayout, target.resourceId);
  if (!targetLocation) return;
  if (target.type === "combine") {
    if (targetLocation.folder) {
      moveFavoriteResource(state.draftFavoriteLayout, resourceId, {
        rowId: targetLocation.row.id,
        folderId: targetLocation.folder.id,
      });
      return;
    }
    const sourceLocation = findFavoriteResource(state.draftFavoriteLayout, resourceId);
    const folderIndex = targetLocation.itemIndex - (
      sourceLocation?.row.id === targetLocation.row.id
      && !sourceLocation.folder
      && sourceLocation.itemIndex < targetLocation.itemIndex
        ? 1
        : 0
    );
    const folder = createFavoriteFolder(
      state.draftFavoriteLayout,
      targetLocation.row.id,
      createFavoriteContainerId("folder"),
      "",
      [target.resourceId, resourceId],
    );
    const currentIndex = targetLocation.row.items.indexOf(folder);
    targetLocation.row.items.splice(currentIndex, 1);
    targetLocation.row.items.splice(Math.min(folderIndex, targetLocation.row.items.length), 0, folder);
    return;
  }

  const sourceLocation = findFavoriteResource(state.draftFavoriteLayout, resourceId);
  let index = targetLocation.folder ? targetLocation.resourceIndex : targetLocation.itemIndex;
  const sameContainer = sourceLocation?.row.id === targetLocation.row.id
    && sourceLocation?.folder?.id === targetLocation.folder?.id;
  const sourceIndex = sourceLocation?.folder ? sourceLocation.resourceIndex : sourceLocation?.itemIndex;
  if (sameContainer && sourceIndex < index) index -= 1;
  if (target.after) index += 1;
  moveFavoriteResource(state.draftFavoriteLayout, resourceId, {
    rowId: targetLocation.row.id,
    folderId: targetLocation.folder?.id ?? null,
    index,
  });
}

function applyDraftFavoriteFolderDrop(folderId, target) {
  if (target.type === "row") {
    moveFavoriteFolder(state.draftFavoriteLayout, folderId, { rowId: target.rowId });
    return;
  }

  if (target.type === "folder-position") {
    const targetLocation = findFavoriteFolder(state.draftFavoriteLayout, target.folderId);
    if (!targetLocation) return;
    moveFavoriteFolder(state.draftFavoriteLayout, folderId, {
      rowId: targetLocation.row.id,
      index: targetLocation.itemIndex + (target.after ? 1 : 0),
    });
    return;
  }

  const targetLocation = findFavoriteResource(state.draftFavoriteLayout, target.resourceId);
  if (!targetLocation || targetLocation.folder) return;
  moveFavoriteFolder(state.draftFavoriteLayout, folderId, {
    rowId: targetLocation.row.id,
    index: targetLocation.itemIndex + (target.after ? 1 : 0),
  });
}

function getToday() {
  return formatDate(new Date());
}

function getOneYearAgo() {
  const now = new Date();
  const previousYear = new Date(now);
  previousYear.setFullYear(now.getFullYear() - 1);

  if (previousYear.getMonth() !== now.getMonth()) {
    previousYear.setDate(0);
  }

  return formatDate(previousYear);
}

function formatDate(value) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCompactDate(value) {
  return String(value).replaceAll("-", "");
}

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
      && !jsonFetchPromises.has(url)
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

function readStoredValue(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStoredValue(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Local storage may be unavailable in private browsing contexts.
  }
}

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

init().catch((error) => {
  console.error(error);
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-ready");
  grid.innerHTML = '<p class="empty">Impossible de charger le catalogue presse.</p>';
});
