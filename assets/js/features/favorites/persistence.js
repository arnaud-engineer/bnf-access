import {
  bookDefaultFavoritesMigratedKey as defaultBookDefaultFavoritesMigratedKey,
  bookFavoritesMigratedKey as defaultBookFavoritesMigratedKey,
  editionSelectionStorageKey as defaultEditionSelectionStorageKey,
  favoriteLayoutStorageKey as defaultFavoriteLayoutStorageKey,
  favoriteOrderCustomStorageKey as defaultFavoriteOrderCustomStorageKey,
  favoriteOrderStorageKey as defaultFavoriteOrderStorageKey,
  favoriteStorageKey as defaultFavoriteStorageKey,
  favoriteStorageReadyKey as defaultFavoriteStorageReadyKey,
  legacyFavoritesMigratedStorageKey as defaultLegacyFavoritesMigratedStorageKey,
  pressFavoriteLayoutMigratedStorageKey as defaultPressFavoriteLayoutMigratedStorageKey
} from '../../config/storage-keys.js';
import {legacyCatalogResourceIds as defaultLegacyCatalogResourceIds} from '../../config/catalog.js';
import {
  readStoredValue as defaultReadStoredValue,
  writeStoredValue as defaultWriteStoredValue
} from '../../shared/storage.js';
import {
  listFavoriteResourceIds,
  normalizeFavoriteLayout,
  cloneFavoriteLayout,
  createFavoriteRow,
  moveFavoriteResource,
  createFavoriteLayout,
  removeFavoriteResource
} from '../../favorite-layout.js?v=2026-09-13';

// Shared favourite layout persistence and one-time migrations; never reseed personalized rows.
export function createFavoritesPersistence({
  bookDefaultFavoritesMigratedKey = defaultBookDefaultFavoritesMigratedKey,
  bookFavoritesMigratedKey = defaultBookFavoritesMigratedKey,
  bookSearch,
  catalogFavoritesPreview,
  editionSelectionStorageKey = defaultEditionSelectionStorageKey,
  favoriteLayoutStorageKey = defaultFavoriteLayoutStorageKey,
  favoriteOrderCustomStorageKey = defaultFavoriteOrderCustomStorageKey,
  favoriteOrderStorageKey = defaultFavoriteOrderStorageKey,
  favoriteStorageKey = defaultFavoriteStorageKey,
  favoriteStorageReadyKey = defaultFavoriteStorageReadyKey,
  getAlphaFavoriteResources,
  getResourceById,
  isCatalogVisible,
  isValidEditionSelection,
  legacyCatalogResourceIds = defaultLegacyCatalogResourceIds,
  legacyFavoritesMigratedStorageKey = defaultLegacyFavoritesMigratedStorageKey,
  pressFavoriteLayoutMigratedStorageKey = defaultPressFavoriteLayoutMigratedStorageKey,
  readStoredValue = defaultReadStoredValue,
  render,
  state,
  writeStoredValue = defaultWriteStoredValue
}) {
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
    integrateBookFavorites();
  }

  function integrateBookFavorites() {
    // Migration markers make removed defaults stay removed on subsequent visits.
    if (catalogFavoritesPreview || !state.favoritesReady || state.favoriteLayoutNeedsPressClassification || state.quickLaunchEditing) return;
    const layout = cloneFavoriteLayout(state.favoriteLayout);
    const ids = new Set(listFavoriteResourceIds(layout));
    // Keep the legacy list as backup without restoring favorites removed after migration.
    const legacy = readStoredValue(bookFavoritesMigratedKey) === "true" ? [] : bookSearch.legacyFavoriteIds();
    const extras = [...new Set(legacy.map(id => bookSearch.resolveFavoriteId(id)))].filter(id => !ids.has(id));
    const defaultsPending = readStoredValue(bookDefaultFavoritesMigratedKey) !== "true";
    if (defaultsPending && (ids.size || state.favoritesInitializedFromDefaults)) {
      for (const id of bookSearch.defaultFavoriteIds()) if (!ids.has(id) && !extras.includes(id)) extras.push(id);
    }
    if (extras.length) {
      const row = createFavoriteRow(layout, createFavoriteContainerId("row"), "Livres");
      for (const id of extras) { ids.add(id); moveFavoriteResource(layout, id, { rowId: row.id }); }
    }
    const normalized = normalizeFavoriteLayout(layout, [...ids], resolveCatalogResourceId);
    const changed = JSON.stringify(normalized) !== JSON.stringify(state.favoriteLayout);
    if (changed) {
      state.favoriteLayout = normalized;
      state.favorites = new Set(listFavoriteResourceIds(normalized));
      saveFavorites();
      saveFavoriteLayout();
    }
    if (readStoredValue(favoriteLayoutStorageKey) === JSON.stringify(normalized)) writeStoredValue(bookFavoritesMigratedKey, "true");
    if (bookSearch.defaultFavoriteIds().length && readStoredValue(favoriteLayoutStorageKey) === JSON.stringify(normalized)) writeStoredValue(bookDefaultFavoritesMigratedKey, "true");
    if (changed) render();
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
    if (typeof id === "string" && id.startsWith("book:")) return bookSearch.resolveFavoriteId(id);
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

  return {
    createFavoriteContainerId,
    finalizeInitialFavoriteLayout,
    integrateBookFavorites,
    loadEditionSelections,
    loadFavoriteLayout,
    loadFavorites,
    resolveCatalogResourceId,
    saveEditionSelections,
    saveFavoriteLayout,
    saveFavorites,
    toggleFavorite
  };
}
