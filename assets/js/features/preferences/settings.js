import {readStoredValue, writeStoredValue} from '../../shared/storage.js';
import {privacyNoticeDismissedKey} from '../../config/storage-keys.js';
import {converterResourcesAnimationMs} from '../../config/runtime.js';

// Settings dialog, privacy acknowledgement and explicit local reset preserve existing storage boundaries.
export function createSettingsController({
  bookSearch,
  clearLocalDataStatus,
  closeAlphaModeNote,
  closeSettings,
  dismissNotice,
  openSettings,
  privacyNotice,
  resetReleaseModeDiscovery,
  setAlphaMode,
  settingsModal,
  settingsTheme,
  state,
  applyTheme,
  saveTheme,
  settingsColorBlindMode,
  applyColorBlindMode,
  saveColorBlindMode,
  alphaModeSettingsLink,
  darkThemeQuery,
  settingsPassFilter,
  passFilter,
  syncProfileFilterState,
  saveProfileFilters,
  render,
  settingsSiteAccess,
  getRemoteFilterFromSiteAccess,
  remoteFilter,
  clearLocalDataButton
}) {
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
    closeAlphaModeNote();
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
      bookSearch.clearFavorites();
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
    resetReleaseModeDiscovery();
    setAlphaMode(false, { persist: false });
    closeAlphaModeNote();
  }

  function setClearLocalDataStatus(message, ok) {
    clearLocalDataStatus.textContent = message;
    clearLocalDataStatus.dataset.status = ok ? "success" : "error";
  }

  function bindSettingsEvents() {
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

    alphaModeSettingsLink.addEventListener("click", openSettingsModal);

    darkThemeQuery.addEventListener("change", () => {
      if (state.theme === "auto") {
        applyTheme();
      }
    });

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

    clearLocalDataButton.addEventListener("click", clearLocalData);

    settingsModal.addEventListener("click", (event) => {
      if (event.target === settingsModal) {
        closeSettingsModal();
      }
    });
  }

  return {
    bindSettingsEvents,
    clearLocalData,
    closeSettingsModal,
    openSettingsModal,
    setupPrivacyNotice
  };
}
