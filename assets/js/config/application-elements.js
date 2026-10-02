// Collect after HTML parsing; controllers receive only their own element bindings.
export function collectApplicationElements() {
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
  const releaseModeLabel = document.querySelector("#betaLabel");
  const linkConverter = document.querySelector("#linkConverter");
  const linkConverterForm = document.querySelector("#linkConverterForm");
  const searchLinkOpen = document.querySelector("#searchLinkOpen");
  const linkConverterServices = document.querySelector("#linkConverterServices");
  const linkConverterFeedback = document.querySelector("#linkConverterFeedback");
  const linkConverterResourceListOpen = document.querySelector("#linkConverterResourceListOpen");
  const converterResourcesModal = document.querySelector("#converterResourcesModal");
  const converterResourcesClose = document.querySelector("#converterResourcesClose");
  const converterResourcesSearch = document.querySelector("#converterResourcesSearch");
  const converterResourcesProviderFilter = document.querySelector("#converterResourcesProviderFilter");
  const converterResourcesCount = document.querySelector("#converterResourcesCount");
  const converterResourcesList = document.querySelector("#converterResourcesList");
  const searchControls = document.querySelector("#globalSearch");
  const siteFooter = document.querySelector("#siteFooter");
  const jumpToSearchDock = document.querySelector(".jump-to-search-dock");
  const jumpToSearch = document.querySelector("#jumpToSearch");
  const openSettings = document.querySelector("#openSettings");
  const settingsModal = document.querySelector("#settingsModal");
  const shareModal = document.querySelector("#shareModal");
  const openShareFromSettings = document.querySelector("#openShareFromSettings");
  const shareExportTab = document.querySelector("#shareExportTab");
  const shareImportTab = document.querySelector("#shareImportTab");
  const shareExport = document.querySelector("#shareExport");
  const shareImport = document.querySelector("#shareImport");
  const shareImportLink = document.querySelector("#shareImportLink");
  const shareImportPreview = document.querySelector("#shareImportPreview");
  const shareScanPanel = document.querySelector("#shareScanPanel");
  const shareScanVideo = document.querySelector("#shareScanVideo");
  const shareScanStatus = document.querySelector("#shareScanStatus");
  const shareLink = document.querySelector("#shareLink");
  const shareQr = document.querySelector("#shareQr");
  const shareStatus = document.querySelector("#shareStatus");
  const shareScopeDetails = document.querySelector("#shareScopeDetails");
  const shareNetworkHint = document.querySelector("#shareNetworkHint");
  const shareImportSummary = document.querySelector("#shareImportSummary");
  const shareImportDetails = document.querySelector("#shareImportDetails");
  const shareImportStatus = document.querySelector("#shareImportStatus");
  const confirmShareImport = document.querySelector("#confirmShareImport");
  const closeSettings = document.querySelector("#closeSettings");
  const releaseModeSettings = document.querySelector("#releaseModeSettings");
  const settingsAlphaMode = document.querySelector("#settingsAlphaMode");
  const releaseModeToggleLabel = document.querySelector("#releaseModeToggleLabel");
  const releaseModeDescription = document.querySelector("#releaseModeDescription");
  const alphaModeNote = document.querySelector("#alphaModeNote");
  const alphaModeNoteClose = document.querySelector("#alphaModeNoteClose");
  const alphaModeSettingsLink = document.querySelector("#alphaModeSettingsLink");
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
  return {
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
  };
}
