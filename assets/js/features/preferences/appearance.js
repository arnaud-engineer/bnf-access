import {
  colorBlindModeStorageKey as defaultColorBlindModeStorageKey,
  themeStorageKey as defaultThemeStorageKey
} from '../../config/storage-keys.js';
import {
  readStoredValue as defaultReadStoredValue,
  writeStoredValue as defaultWriteStoredValue
} from '../../shared/storage.js';
import {themeCycle as defaultThemeCycle, themeValues as defaultThemeValues} from '../../config/runtime.js';
// Theme and colour-vision preferences preserve the existing browser storage keys.
export function createAppearancePreferences({
  colorBlindModeStorageKey = defaultColorBlindModeStorageKey,
  darkThemeQuery,
  readStoredValue = defaultReadStoredValue,
  settingsColorBlindMode,
  settingsTheme,
  state,
  themeCycle = defaultThemeCycle,
  themeStorageKey = defaultThemeStorageKey,
  themeValues = defaultThemeValues,
  writeStoredValue = defaultWriteStoredValue
}) {
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
    if (window.parent !== window) {
      window.parent.postMessage({ type: "bnf-access:theme", theme: resolvedTheme }, "https://app.bnfaccess.fr");
    }

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

  return {
    applyColorBlindMode,
    applyTheme,
    cycleTheme,
    loadColorBlindMode,
    loadTheme,
    saveColorBlindMode,
    saveTheme
  };
}
