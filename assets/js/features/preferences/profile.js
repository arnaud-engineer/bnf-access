import {
  languageFilterStorageKey as defaultLanguageFilterStorageKey,
  passFilterStorageKey as defaultPassFilterStorageKey,
  remoteFilterStorageKey as defaultRemoteFilterStorageKey,
  siteAccessStorageKey as defaultSiteAccessStorageKey
} from '../../config/storage-keys.js';
import {
  readStoredValue as defaultReadStoredValue,
  writeStoredValue as defaultWriteStoredValue
} from '../../shared/storage.js';
import {siteAccessValues as defaultSiteAccessValues} from '../../config/runtime.js';
// Restore profile/access/language preferences, including legacy stored values.
export function createProfilePreferences({
  getKnownLanguageCodes,
  languageFilterStorageKey = defaultLanguageFilterStorageKey,
  normalizeLanguageCode,
  passFilter,
  passFilterStorageKey = defaultPassFilterStorageKey,
  readStoredValue = defaultReadStoredValue,
  remoteFilter,
  remoteFilterStorageKey = defaultRemoteFilterStorageKey,
  renderLanguageFilterControls,
  settingsPassFilter,
  settingsSiteAccess,
  siteAccessStorageKey = defaultSiteAccessStorageKey,
  siteAccessValues = defaultSiteAccessValues,
  state,
  writeStoredValue = defaultWriteStoredValue
}) {
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

  return {
    getRemoteFilterFromSiteAccess,
    getSiteAccessFromRemoteFilter,
    loadProfileFilters,
    saveProfileFilters,
    syncProfileFilterState
  };
}
