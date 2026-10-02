import {normalize, escapeHtml} from '../../shared/text.js';
import {logoAppearanceAttributes} from '../../logo-appearance.js?v=2026-09-16-press-background';

// Search previews use the same catalogue selection as the full result view.
export function createCatalogSuggestions({
  bookSearch,
  formatLanguageBadgeText,
  formatLanguageTooltipItem,
  getAccessMode,
  getAccessModeLabel,
  getActionProviderLabel,
  getFallbackLabel,
  getResourceLanguageCodes,
  getSessionStartUrl,
  getVisibleActions,
  grid,
  isEuropressePdfAction,
  isPressResourceEntry,
  isPressTitleEntry,
  matchesLanguageFilter,
  matchesPassFilter,
  matchesPressTitleCountryFilter,
  matchesPressTitleEditorialFilter,
  matchesPressTitleLocalRegionFilter,
  matchesPressTitleSourceFilter,
  matchesRemoteFilter,
  matchesResourceCategoryFilter,
  render,
  renderFilters,
  renderIcon,
  resolveActionHref,
  searchInput,
  shouldShowResourceInCurrentListing,
  state,
  toggleFavorite
}) {
  function getCatalogSuggestionGroups(query) {
    const words = normalize(query).trim().split(/\s+/).filter(Boolean);
    const candidates = state.resources.filter(resource => shouldShowResourceInCurrentListing(resource)
      && matchesResourceCategoryFilter(resource)
      && (!state.favoritesOnly || state.favorites.has(resource.id))
      && matchesPassFilter(resource) && matchesRemoteFilter(getAccessMode(resource)) && matchesLanguageFilter(resource)
      && (!isPressTitleEntry(resource) || (matchesPressTitleSourceFilter(resource)
        && matchesPressTitleCountryFilter(resource) && matchesPressTitleEditorialFilter(resource)
        && matchesPressTitleLocalRegionFilter(resource) && getVisibleActions(resource).length > 0))
      && words.every(word => normalize(resource.name).includes(word)))
      .sort((a, b) => Number(!words.every(word => normalize(a.name).includes(word))) - Number(!words.every(word => normalize(b.name).includes(word)))
        || Number(!normalize(a.name).startsWith(normalize(query))) - Number(!normalize(b.name).startsWith(normalize(query)))
        || a.name.localeCompare(b.name, "fr"));
    return [
      { label: "Ressources", entries: candidates.filter(resource => isPressResourceEntry(resource) && !isPressTitleEntry(resource)) },
      { label: "Presse", entries: candidates.filter(isPressTitleEntry) },
    ].map(group => ({ label: group.label, rows: group.entries.slice(0, 6).map(createCatalogSuggestion) }));
  }

  function createCatalogSuggestion(resource) {
    const row = document.createElement("div");
    row.className = "book-suggestion-row";
    const action = getVisibleActions(resource)[0];
    const href = action ? resolveActionHref(resource, action) : "";
    const choose = () => {
      bookSearch.dismissSuggestions();
      state.query = resource.name;
      searchInput.value = resource.name;
      searchInput.blur();
      renderFilters();
      render();
      requestAnimationFrame(() => {
        const card = [...grid.querySelectorAll(".card")].find(item => item.dataset.resourceId === resource.id);
        card?.scrollIntoView({ block: "center", behavior: "smooth" });
      });
    };
    const option = document.createElement(/^https?:\/\//.test(href) ? "a" : "button");
    option.className = "book-suggestion";
    if (option.tagName === "A") {
      option.href = href;
      option.target = "_blank";
      option.rel = "noopener noreferrer";
      option.dataset.actionResourceId = resource.id;
      option.dataset.actionId = action.id;
      const session = getSessionStartUrl(resource, action);
      if (session && !isEuropressePdfAction(resource, action)) {
        option.dataset.sessionStart = session;
        option.dataset.transitionHref = href;
      }
    } else { option.type = "button"; option.addEventListener("click", choose); }
    option.title = action?.label || "Voir la fiche sur BnF Access";
    option.setAttribute("aria-label", `${option.title} : ${resource.name}`);
    option.innerHTML = `<span class="logo search-resource-logo ${resource.icon_no_padding ? "icon-no-padding" : ""}"${logoAppearanceAttributes(resource)}>${resource.icon_url ? renderIcon(resource) : escapeHtml(getFallbackLabel(resource))}</span>
      <span class="book-description"><strong>${escapeHtml(resource.name)}</strong><span class="search-suggestion-summary">${escapeHtml(resource.description || "")}</span><span class="book-suggestion-platforms">${action ? `<span class="badge">${escapeHtml(isPressTitleEntry(resource) ? getActionProviderLabel(action) : getAccessModeLabel(resource))}</span>` : ""}</span></span>`;
    const languageTags = option.querySelector(".book-suggestion-platforms");
    for (const code of getResourceLanguageCodes(resource)) {
      const tag = document.createElement("span");
      tag.className = "badge language";
      tag.textContent = formatLanguageBadgeText(code);
      tag.title = formatLanguageTooltipItem(code);
      languageTags.append(tag);
    }
    const actions = document.createElement("div");
    actions.className = "book-suggestion-actions";
    const favorite = document.createElement("button");
    favorite.type = "button";
    favorite.className = "favorite-button book-favorite";
    const updateFavorite = () => {
      const selected = state.favorites.has(resource.id);
      favorite.innerHTML = `<span aria-hidden="true">${selected ? "★" : "☆"}</span>`;
      favorite.setAttribute("aria-pressed", String(selected));
      favorite.setAttribute("aria-label", `${selected ? "Retirer des" : "Ajouter aux"} favoris : ${resource.name}`);
      favorite.title = selected ? "Retirer des favoris" : "Ajouter aux favoris";
    };
    updateFavorite();
    favorite.addEventListener("click", () => {
      const top = searchInput.getBoundingClientRect().top;
      toggleFavorite(resource.id);
      updateFavorite();
      requestAnimationFrame(() => window.scrollBy(0, searchInput.getBoundingClientRect().top - top));
    });
    const fiche = document.createElement("button");
    fiche.type = "button";
    fiche.className = "book-suggestion-fiche";
    fiche.textContent = "Voir la fiche";
    fiche.setAttribute("aria-label", `Voir la fiche sur BnF Access : ${resource.name}`);
    fiche.addEventListener("click", choose);
    actions.append(favorite, fiche);
    row.append(option, actions);
    return row;
  }

  return {
    getCatalogSuggestionGroups
  };
}
