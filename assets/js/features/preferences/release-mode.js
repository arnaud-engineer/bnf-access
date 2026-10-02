import {readStoredValue, writeStoredValue} from '../../shared/storage.js';
import {alphaModeDiscoveredStorageKey, releaseModeStorageKey} from '../../config/storage-keys.js';

// Alpha discovery and release settings share one state owner; URL opening remains Alpha-only.
export function createReleaseMode({
  alphaModeNote,
  bookSearch,
  closeConverterResourcesModal,
  closePressPopularityNote,
  linkConverter,
  linkConverterFeedback,
  loadDeferredLinkSources,
  releaseModeDescription,
  releaseModeLabel,
  releaseModeSettings,
  releaseModeToggleLabel,
  renderQuickLaunch,
  searchHints,
  settingsAlphaMode,
  syncPressPopularityNoteDockOffset,
  syncSearchLinkAction,
  alphaModeNoteClose
}) {
  let isAlphaMode = false;

  let alphaModeDiscovered = false;

  function loadReleaseMode() {
    alphaModeDiscovered = readStoredValue(alphaModeDiscoveredStorageKey) === "true";
    setAlphaMode(alphaModeDiscovered && readStoredValue(releaseModeStorageKey) === "alpha", { persist: false });
  }

  function syncReleaseModeSettings() {
    releaseModeSettings.hidden = !alphaModeDiscovered;
    settingsAlphaMode.checked = isAlphaMode;
    releaseModeToggleLabel.textContent = isAlphaMode ? "Mode Alpha" : "Mode Bêta";
    releaseModeDescription.textContent = isAlphaMode
      ? "Le mode Alpha propose des fonctionnalités expérimentales, parfois moins stables."
      : "Le mode Bêta est plus stable, avec moins de fonctionnalités.";
  }

  function showAlphaModeNote() {
    closePressPopularityNote();
    alphaModeNote.hidden = false;
    window.requestAnimationFrame(() => {
      alphaModeNote.classList.add("is-visible");
      syncPressPopularityNoteDockOffset();
    });
  }

  function closeAlphaModeNote() {
    if (alphaModeNote.hidden) return;
    alphaModeNote.classList.remove("is-visible");
    alphaModeNote.hidden = true;
    syncPressPopularityNoteDockOffset();
  }

  function setAlphaMode(enabled, { gesture = false, persist = true } = {}) {
    const firstDiscovery = enabled && gesture && !alphaModeDiscovered;
    if (firstDiscovery) {
      alphaModeDiscovered = true;
      writeStoredValue(alphaModeDiscoveredStorageKey, "true");
    }
    isAlphaMode = enabled;
    searchHints.setAlphaMode(enabled);
    syncSearchLinkAction();
    linkConverterFeedback.textContent = "";
    bookSearch.dismissSuggestions();
    releaseModeLabel.textContent = enabled ? "ALPHA" : "BETA";
    syncReleaseModeSettings();
    if (persist) writeStoredValue(releaseModeStorageKey, enabled ? "alpha" : "beta");
    if (enabled) {
      linkConverter.hidden = false;
      loadDeferredLinkSources();
    } else {
      linkConverter.hidden = true;
      closeConverterResourcesModal();
      closeAlphaModeNote();
    }
    renderQuickLaunch();
    if (firstDiscovery) showAlphaModeNote();
  }

  function getAlphaMode() { return isAlphaMode; }

  function resetReleaseModeDiscovery() { alphaModeDiscovered = false; }

  function bindReleaseModeEvents() {
    settingsAlphaMode.addEventListener("change", (event) => {
      setAlphaMode(event.target.checked);
    });

    alphaModeNoteClose.addEventListener("click", closeAlphaModeNote);

    let releaseTapCount = 0;

    let releaseTapStartedAt = 0;

    releaseModeLabel.addEventListener("click", () => {
      const now = performance.now();
      if (now - releaseTapStartedAt > 5000) {
        releaseTapCount = 0;
        releaseTapStartedAt = now;
      }
      releaseTapCount += 1;
      if (releaseTapCount === 7) {
        releaseTapCount = 0;
        releaseTapStartedAt = 0;
        setAlphaMode(!getAlphaMode(), { gesture: true });
      }
    });
  }

  return {
    bindReleaseModeEvents,
    closeAlphaModeNote,
    getAlphaMode,
    loadReleaseMode,
    resetReleaseModeDiscovery,
    setAlphaMode
  };
}
