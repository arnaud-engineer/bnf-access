import {
  primaryLanguageCodes as defaultPrimaryLanguageCodes,
  resourceCategoryIcons as defaultResourceCategoryIcons
} from '../../config/catalog.js';
import {escapeHtml, escapeAttribute} from '../../shared/text.js';

// Category and language controls update shared selection without owning the catalogue.
export function createCatalogFilterControls({
  filters,
  formatLanguageBadgeText,
  formatLanguageOptionLabel,
  formatLanguageTooltipItem,
  getResourceLanguageCodes,
  getResourceTaxonomyRoots,
  isCatalogVisible,
  languageFilters,
  loadPressCatalog,
  primaryLanguageCodes = defaultPrimaryLanguageCodes,
  render,
  resourceCategoryIcons = defaultResourceCategoryIcons,
  saveProfileFilters,
  settingsLanguageFilters,
  state,
  syncProfileFilterState
}) {
  function renderFilters() {
    const roots = getResourceTaxonomyRoots();
    const categories = [
      { id: "Tout", label: "Tout" },
      { id: "Toutes", label: "Ressources" },
      { id: "Presse", label: "Presse" },
      { id: "Livre", label: "Livres" },
    ];

    if (!categories.some((category) => category.id === state.category) && !roots.some(root => root.id === state.category)) {
      state.category = "Tout";
    }

    filters.innerHTML = "";
    const subfilters = document.querySelector("#resourceCategoryFilters");
    subfilters.replaceChildren();
    subfilters.hidden = state.category !== "Toutes" && !roots.some(root => root.id === state.category);

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

    for (const category of [...categories, ...roots]) {
      const button = document.createElement("button");
      button.className = "filter-button";
      button.type = "button";
      button.innerHTML = `${renderResourceCategoryIcon(category.id)}<span>${escapeHtml(category.label)}</span>`;
      button.setAttribute("aria-pressed", String(category.id === state.category || (category.id === "Toutes" && roots.some(root => root.id === state.category))));
      button.addEventListener("click", () => {
        state.category = category.id;
        if (["Presse", "Tout"].includes(category.id) && !state.pressLoaded) loadPressCatalog();
        renderFilters();
        render();
      });
      (categories.includes(category) ? filters : subfilters).append(button);
      if (category.id === "Tout") filters.append(separator.cloneNode(true));
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

  return {
    getKnownLanguageCodes,
    renderFilters,
    renderLanguageFilterControls,
    renderResourceCategoryIcon
  };
}
