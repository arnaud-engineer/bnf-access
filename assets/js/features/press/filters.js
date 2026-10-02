import {
  pressTitleAllFilterValue as defaultPressTitleAllFilterValue,
  pressTitleEditorialRootIcons as defaultPressTitleEditorialRootIcons,
  pressTitleFavoriteFilterValue as defaultPressTitleFavoriteFilterValue,
  pressTitleRecommendedFilterValue as defaultPressTitleRecommendedFilterValue,
  pressTitlePopularFilterValue as defaultPressTitlePopularFilterValue,
  pressTitleSourceFilters as defaultPressTitleSourceFilters,
  promotedPressTitleCountryCodes as defaultPromotedPressTitleCountryCodes,
  promotedPressTitleCountryMinimumCount as defaultPromotedPressTitleCountryMinimumCount
} from '../../config/catalog.js';
import {
  escapeHtml as defaultEscapeHtml,
  escapeAttribute as defaultEscapeAttribute
} from '../../shared/text.js';
import {countByMany as defaultCountByMany, countBy as defaultCountBy} from '../../shared/counts.js';
import {
  activeEditorialCategoryIds as defaultActiveEditorialCategoryIds,
  orderedCategoryRows as defaultOrderedCategoryRows
} from '../../editorial-taxonomy.js?v=2026-09-06';
export function createPressFilters({
  pressTitleAllFilterValue = defaultPressTitleAllFilterValue,
  state,
  escapeHtml = defaultEscapeHtml,
  renderResourceGrid,
  escapeAttribute = defaultEscapeAttribute,
  matchesPressTitleSourceFilter,
  matchesPressTitleCountryFilter,
  matchesPressTitleEditorialFilter,
  matchesPressTitleLocalRegionFilter,
  countByMany = defaultCountByMany,
  pressTitleNarrowLayoutQuery,
  pressTitleMediumLayoutQuery,
  pressTitleEditorialRootIcons = defaultPressTitleEditorialRootIcons,
  pressTitleFavoriteFilterValue = defaultPressTitleFavoriteFilterValue,
  pressTitleRecommendedFilterValue = defaultPressTitleRecommendedFilterValue,
  pressTitlePopularFilterValue = defaultPressTitlePopularFilterValue,
  getPressTitleSourceFilterIds,
  pressTitleSourceFilters = defaultPressTitleSourceFilters,
  countBy = defaultCountBy,
  promotedPressTitleCountryCodes = defaultPromotedPressTitleCountryCodes,
  promotedPressTitleCountryMinimumCount = defaultPromotedPressTitleCountryMinimumCount,
  activeEditorialCategoryIds = defaultActiveEditorialCategoryIds,
  orderedCategoryRows = defaultOrderedCategoryRows
}) {

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

  return {
    syncPressTitleEditorialBranchExpansion,
    createPressTitleFilters,
    getPressTitleEditorialSelection
  };
}
