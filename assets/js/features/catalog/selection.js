import {
  accessModeLabels as defaultAccessModeLabels,
  pressEntryTypes as defaultPressEntryTypes,
  pressTitleAllFilterValue as defaultPressTitleAllFilterValue,
  pressTitleSourceFilters as defaultPressTitleSourceFilters
} from '../../config/catalog.js';
import {countBy, countByMany} from '../../shared/counts.js';
import {descendantCategoryIds} from '../../editorial-taxonomy.js?v=2026-09-06';
import {normalize} from '../../shared/text.js';

// Shared selection rules for listings, search suggestions and access filters.
export function createCatalogSelection({
  accessModeLabels = defaultAccessModeLabels,
  getPressTitleEditorialSelection,
  pressEntryTypes = defaultPressEntryTypes,
  pressTitleAllFilterValue = defaultPressTitleAllFilterValue,
  pressTitleSourceFilters = defaultPressTitleSourceFilters,
  state
}) {
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

  function matchesResourceCategoryFilter(resource) {
    if (state.category === "Tout") return true;
    if (state.category === "Livre") return false;
    return state.category === "Presse"
      ? isPressTitleEntry(resource) || resource.topic_ids?.includes("presse")
      : isPressResourceEntry(resource)
        && (state.category !== "Toutes" || !isPressTitleEntry(resource))
        && (state.category === "Toutes" || resourceMatchesTaxonomyRoot(resource, state.category));
  }

  function getFilteredResources() {
    const query = normalize(state.query);
    const filteredResources = state.resources
      .filter((resource) => {
        const accessMode = getAccessMode(resource);
        const resourceCategories = getResourceCategories(resource);
        const resourceTaxonomyLabels = getResourceTaxonomyNodes(resource).map((category) => category.label);
        const matchesCategory = matchesResourceCategoryFilter(resource);
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

  return {
    countBy,
    countByMany,
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
  };
}
