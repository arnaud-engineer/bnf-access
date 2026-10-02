import {
  listFavoriteResourceIds as defaultListFavoriteResourceIds,
  deleteFavoriteFolder as defaultDeleteFavoriteFolder,
  createFavoriteFolder as defaultCreateFavoriteFolder,
  findFavoriteResource as defaultFindFavoriteResource,
  moveFavoriteResource as defaultMoveFavoriteResource,
  findFavoriteFolder as defaultFindFavoriteFolder,
  deleteFavoriteRow as defaultDeleteFavoriteRow
} from '../../favorite-layout.js?v=2026-09-13';
import {
  escapeHtml as defaultEscapeHtml,
  escapeAttribute as defaultEscapeAttribute
} from '../../shared/text.js';
import {
  logoAppearanceAttributes as defaultLogoAppearanceAttributes,
  applyLogoAppearance as defaultApplyLogoAppearance
} from '../../logo-appearance.js?v=2026-09-16-press-background';
import {
  startupImageBlockingCount as defaultStartupImageBlockingCount,
  catalogFavoritesLargeImageThresholdBytes as defaultCatalogFavoritesLargeImageThresholdBytes,
  themeValues as defaultThemeValues
} from '../../config/runtime.js';
import {
  pressTitleSourceFilters as defaultPressTitleSourceFilters,
  pressEntryTypes as defaultPressEntryTypes
} from '../../config/catalog.js';
import {createFavoriteFolders} from './folders.js';
import {createFavoritesActionMenu} from './action-menu.js';
import {createFavoritesCatalogPreview} from './catalog-preview.js';
export function createFavoritesRenderer({
  state,
  catalogFavoritesPreview,
  listFavoriteResourceIds = defaultListFavoriteResourceIds,
  quickLaunch,
  resetQuickLaunchActionAnimationFlag,
  isCatalogVisible,
  handleQuickLaunchRowPointerDown,
  preventQuickLaunchEditContextMenu,
  addDraftFavoriteRow,
  escapeHtml = defaultEscapeHtml,
  logoAppearanceAttributes = defaultLogoAppearanceAttributes,
  renderIcon,
  startupImageBlockingCount = defaultStartupImageBlockingCount,
  getFallbackLabel,
  handleQuickLaunchPointerDown,
  handleQuickLaunchKeyDown,
  getActions,
  getProfileVisibleActions,
  resolveActionHref,
  escapeAttribute = defaultEscapeAttribute,
  getSessionAttributes,
  bookSearch,
  toggleAccessNote,
  stopQuickLaunchRemoveEvent,
  deleteFavoriteFolder = defaultDeleteFavoriteFolder,
  applyLogoAppearance = defaultApplyLogoAppearance,
  createFavoriteFolder = defaultCreateFavoriteFolder,
  createFavoriteContainerId,
  findFavoriteResource = defaultFindFavoriteResource,
  moveFavoriteResource = defaultMoveFavoriteResource,
  findFavoriteFolder = defaultFindFavoriteFolder,
  deleteFavoriteRow = defaultDeleteFavoriteRow,
  pressTitleSourceFilters = defaultPressTitleSourceFilters,
  catalogFavoritesLargeImageThresholdBytes = defaultCatalogFavoritesLargeImageThresholdBytes,
  themeValues = defaultThemeValues,
  applyTheme,
  pressEntryTypes = defaultPressEntryTypes,
  waitForImageElement,
  renderArchiveActionIcon,
  getAccessMode,
  getAccessModeTitle,
  isContextNoteOpen,
  renderResourceCategoryIcon,
  saveQuickLaunchOrder,
  cancelQuickLaunchEdit,
  openShareExport,
  startQuickLaunchEdit,
  handleQuickLaunchRemove,
  getPressEntryTypes,
  getPressTitleSourceFilterIds
}) {

  function renderQuickLaunch() {
    document.querySelector(".quick-launch-folder-dialog")?.remove();
    state.openFavoriteFolderId = null;
    const layout = state.quickLaunchEditing ? state.draftFavoriteLayout : state.favoriteLayout;
    let favorites = catalogFavoritesPreview
      ? getFavoriteResources()
      : getResourcesByIds(listFavoriteResourceIds(layout));
    if (catalogFavoritesPreview && state.catalogPreviewFavoriteMenusOnly) {
      favorites = favorites.filter(resourceHasQuickLaunchActionMenu);
      state.quickLaunchActionMenus = new Set(favorites.map((resource) => resource.id));
    }
    quickLaunch.innerHTML = "";
    quickLaunch.hidden = !catalogFavoritesPreview && !state.quickLaunchEditing && favorites.length === 0;
    quickLaunch.classList.toggle("is-editing", state.quickLaunchEditing);
    quickLaunch.classList.toggle(
      "shows-background-comparisons",
      catalogFavoritesPreview && state.catalogPreviewBackgroundImagesOnly,
    );

    if (!catalogFavoritesPreview && !state.quickLaunchEditing && !favorites.length) {
      state.quickLaunchModifierEntering = false;
      return;
    }

    quickLaunch.append(createQuickLaunchHeader(favorites));
    if (catalogFavoritesPreview) {
      quickLaunch.append(createCatalogFavoritesImageFilters());
    }
    resetQuickLaunchActionAnimationFlag();

    if (!favorites.length && (!state.quickLaunchEditing || catalogFavoritesPreview)) {
      const empty = document.createElement("p");
      empty.className = "quick-launch-empty";
      empty.textContent = catalogFavoritesPreview ? "Aucun résultat." : "Aucun favori.";
      quickLaunch.append(empty);
      return;
    }

    if (catalogFavoritesPreview) {
      const list = createQuickLaunchList("Favoris");
      favorites.forEach((resource, index) => list.append(createQuickLaunchResourceItem(resource, index)));
      quickLaunch.append(list);
      scheduleQuickLaunchMenuOverflowUpdate();
      return;
    }

    const rows = document.createElement("div");
    rows.className = "quick-launch-rows";
    if (state.quickLaunchEditing) rows.append(createQuickLaunchRowInsertBar(0));
    layout.rows.forEach((row, index) => {
      if (state.quickLaunchEditing || row.items.length) {
        rows.append(createQuickLaunchRow(row, index, layout.rows.length));
        if (state.quickLaunchEditing) rows.append(createQuickLaunchRowInsertBar(index + 1));
      }
    });
    quickLaunch.append(rows);
    scheduleQuickLaunchMenuOverflowUpdate();
  }

  function scheduleQuickLaunchMenuOverflowUpdate() {
    requestAnimationFrame(() => {
      quickLaunch.querySelectorAll(".quick-launch-action-menu").forEach((menu) => {
        const update = () => {
          const isScrollable = menu.scrollHeight > menu.clientHeight + 1;
          const isAtEnd = !isScrollable || menu.scrollTop + menu.clientHeight >= menu.scrollHeight - 1;
          menu.classList.toggle("is-scrollable", isScrollable);
          menu.classList.toggle("is-at-end", isAtEnd);
        };

        menu.addEventListener("scroll", update, { passive: true });
        update();
      });
    });
  }

  function createQuickLaunchRow(row, rowIndex, rowCount) {
    const section = document.createElement("section");
    section.className = "quick-launch-row";
    section.dataset.rowId = row.id;

    if (row.name || state.quickLaunchEditing) {
      section.classList.add("has-heading");
      const heading = document.createElement("div");
      heading.className = "quick-launch-row-heading";
      if (state.quickLaunchEditing) {
        const handle = createQuickLaunchRowDragHandle(row);
        const input = document.createElement("input");
        input.className = "quick-launch-row-name";
        input.type = "text";
        input.maxLength = 80;
        input.value = row.name;
        input.placeholder = `Ligne sans nom ${rowIndex + 1}`;
        input.setAttribute("aria-label", `Nom de la ligne ${rowIndex + 1}`);
        input.addEventListener("input", () => { row.name = input.value; });
        heading.append(handle, input, createQuickLaunchRowActions(row, rowIndex, rowCount));
      } else {
        const title = document.createElement("h3");
        title.textContent = row.name;
        heading.append(title);
      }
      section.append(heading);
    }

    const list = createQuickLaunchList(row.name || `Ligne ${rowIndex + 1}`);
    list.dataset.rowId = row.id;
    row.items.forEach((item, itemIndex) => {
      if (item.type === "folder") {
        list.append(createQuickLaunchFolderItem(row, item, itemIndex));
        return;
      }
      const resource = getResourceById(item.resourceId);
      if (resource && isCatalogVisible(resource)) {
        list.append(createQuickLaunchResourceItem(resource, itemIndex, { rowId: row.id }));
      }
    });

    if (state.quickLaunchEditing && !row.items.length) {
      const empty = document.createElement("p");
      empty.className = "quick-launch-row-empty";
      empty.textContent = "Ligne vide";
      list.append(empty);
    }
    section.append(list);
    return section;
  }

  function createQuickLaunchRowDragHandle(row) {
    const button = document.createElement("button");
    button.className = "quick-launch-row-drag-handle";
    button.type = "button";
    button.title = `Déplacer la ligne ${row.name || "sans nom"}`;
    button.setAttribute("aria-label", button.title);
    button.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="5" r="1.5"/><circle cx="16" cy="5" r="1.5"/><circle cx="8" cy="12" r="1.5"/><circle cx="16" cy="12" r="1.5"/><circle cx="8" cy="19" r="1.5"/><circle cx="16" cy="19" r="1.5"/></svg>';
    button.addEventListener("pointerdown", handleQuickLaunchRowPointerDown);
    button.addEventListener("click", (event) => event.preventDefault());
    button.addEventListener("contextmenu", preventQuickLaunchEditContextMenu);
    return button;
  }

  function createQuickLaunchRowInsertBar(index) {
    const bar = document.createElement("div");
    bar.className = "quick-launch-row-insert";
    const button = createIconTextButton("+", "Ajouter une ligne ici", () => addDraftFavoriteRow(index));
    button.classList.add("quick-launch-row-insert-button");
    bar.append(button);
    return bar;
  }

  function createQuickLaunchList(label) {
    const list = document.createElement("div");
    list.className = "quick-launch-list";
    list.setAttribute("aria-label", label);
    return list;
  }

  function createQuickLaunchResourceItem(resource, resourceIndex, location = {}) {
    if (resource.is_book) return createQuickLaunchBookItem(resource, location);
    const item = document.createElement("div");
    const accessWarning = renderQuickLaunchAccessWarning(resource);
    const showsBackgroundComparison = catalogFavoritesPreview
      && state.catalogPreviewBackgroundImagesOnly
      && Boolean(resource.icon_background_image);
    const quickLaunchTile = showsBackgroundComparison
      ? `${renderCatalogBackgroundComparison(resource, resourceIndex, accessWarning)}<small class="quick-launch-label">${escapeHtml(resource.name)}</small>`
      : resource.icon_url
      ? `<span class="quick-launch-tile ${resource.icon_no_padding ? "icon-no-padding" : ""}"${logoAppearanceAttributes(resource)}>${renderIcon(resource, !catalogFavoritesPreview || resourceIndex < startupImageBlockingCount)}${accessWarning}</span><small class="quick-launch-label">${escapeHtml(resource.name)}</small>`
      : `<span class="quick-launch-tile generated"><strong>${escapeHtml(getFallbackLabel(resource))}</strong>${accessWarning}</span><small class="quick-launch-label">${escapeHtml(resource.name)}</small>`;
    item.className = "quick-launch-item";
    item.classList.toggle("has-background-comparison", showsBackgroundComparison);
    item.dataset.resourceId = resource.id;
    if (location.rowId) item.dataset.rowId = location.rowId;
    if (location.folderId) item.dataset.folderId = location.folderId;

    if (state.quickLaunchEditing) {
      item.tabIndex = 0;
      item.setAttribute("role", "button");
      item.setAttribute("aria-label", `Déplacer ${resource.name}`);
      item.setAttribute("draggable", "false");
      item.classList.toggle("is-dragging", state.dragging?.kind === "resource" && state.dragging.id === resource.id);
      item.innerHTML = quickLaunchTile;
      item.querySelector(".quick-launch-tile")?.append(createFavoriteDestinationControl(resource.id));
      item.append(createQuickLaunchRemoveButton(resource));
      item.addEventListener("pointerdown", handleQuickLaunchPointerDown);
      item.addEventListener("contextmenu", preventQuickLaunchEditContextMenu);
      item.addEventListener("dragstart", preventQuickLaunchEditContextMenu);
      item.addEventListener("keydown", handleQuickLaunchKeyDown);
      return item;
    }

    const actions = catalogFavoritesPreview ? getActions(resource) : getProfileVisibleActions(resource);
    const primaryAction = actions[0];
    if (!primaryAction) {
      item.classList.add("is-unavailable");
      item.title = `${resource.name} : indisponible avec les filtres de profil et d'accès actuels`;
      item.innerHTML = `<span class="quick-launch-main" aria-disabled="true">${quickLaunchTile}</span>`;
      bindQuickLaunchAccessWarning(item, resource);
      return item;
    }
    const secondaryActions = getQuickLaunchSecondaryActions(resource, actions, primaryAction);
    const primaryUrl = resolveActionHref(resource, primaryAction);
    item.title = resource.name;
    item.classList.toggle("has-open-actions", state.quickLaunchActionMenus.has(resource.id));
    item.innerHTML = `<a class="quick-launch-main" href="${escapeAttribute(primaryUrl)}" target="_blank" rel="noreferrer"${getSessionAttributes(resource, primaryAction, primaryUrl)} aria-label="${escapeAttribute(resource.name)}">${quickLaunchTile}</a>${renderQuickLaunchSecondaryActions(resource, secondaryActions)}`;

    if (catalogFavoritesPreview) {
      const mainAction = item.querySelector(".quick-launch-main");
      mainAction.setAttribute("aria-label", `Inspecter l’image de ${resource.name}`);
      mainAction.setAttribute("role", "button");
      mainAction.setAttribute("tabindex", "0");
      mainAction.removeAttribute("href");
      mainAction.removeAttribute("target");
      mainAction.addEventListener("click", (event) => { event.preventDefault(); openCatalogFavoritesInspector(resource); });
    }
    item.querySelector("[data-quick-launch-actions-toggle]")?.addEventListener("click", handleQuickLaunchActionsToggle);
    bindQuickLaunchAccessWarning(item, resource);
    return item;
  }

  function createQuickLaunchBookItem(resource, location) {
    const item = resource.book ? bookSearch.favoriteTile(resource.book, {
      actionsExpanded: state.quickLaunchActionMenus.has(resource.id),
    }) : document.createElement("div");
    item.className = "quick-launch-item book-favorite-item";
    item.classList.toggle("has-open-actions", !state.quickLaunchEditing && state.quickLaunchActionMenus.has(resource.id));
    item.dataset.resourceId = resource.id;
    if (location.rowId) item.dataset.rowId = location.rowId;
    if (location.folderId) item.dataset.folderId = location.folderId;
    if (!resource.book) {
      item.title = resource.name;
      item.innerHTML = `<span class="quick-launch-main" aria-disabled="true"><span class="quick-launch-tile book-favorite-tile">Livre</span><small class="quick-launch-label">${escapeHtml(resource.name)}</small></span>`;
    }
    item.querySelector("[data-quick-launch-actions-toggle]")?.addEventListener("click", handleQuickLaunchActionsToggle);
    if (state.quickLaunchEditing) {
      const main = item.querySelector(".quick-launch-main");
      const tile = main.querySelector(".quick-launch-tile"), label = main.querySelector(".quick-launch-label");
      item.replaceChildren(tile, label);
      item.tabIndex = 0;
      item.setAttribute("role", "button");
      item.setAttribute("aria-label", `Déplacer ${resource.name}`);
      item.setAttribute("draggable", "false");
      item.classList.toggle("is-dragging", state.dragging?.kind === "resource" && state.dragging.id === resource.id);
      tile.append(createFavoriteDestinationControl(resource.id));
      item.append(createQuickLaunchRemoveButton(resource));
      item.addEventListener("pointerdown", handleQuickLaunchPointerDown);
      item.addEventListener("contextmenu", preventQuickLaunchEditContextMenu);
      item.addEventListener("dragstart", preventQuickLaunchEditContextMenu);
      item.addEventListener("keydown", handleQuickLaunchKeyDown);
    }
    return item;
  }

  function bindQuickLaunchAccessWarning(item, resource) {
    const warning = item.querySelector("[data-access-note-resource-id]");
    if (!warning) return;

    const openNote = (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleAccessNote(resource);
    };
    warning.addEventListener("click", openNote);
    warning.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      openNote(event);
    });
  }

  function createQuickLaunchHeader(favorites) {
    const header = document.createElement("div");
    header.className = "section-heading quick-launch-header";
    header.classList.toggle("actions-entering", state.quickLaunchActionsEntering);
    header.classList.toggle("actions-exiting", state.quickLaunchActionsExiting);
    header.classList.toggle("modifier-entering", state.quickLaunchModifierEntering);

    const title = document.createElement("h2");
    if (catalogFavoritesPreview) {
      title.textContent = "Tous les titres et ressources";
    } else {
      title.className = "quick-launch-title";
      title.innerHTML = `${renderResourceCategoryIcon("favorites")}<span>Favoris</span>`;
    }
    header.append(title);

    const actions = document.createElement("div");
    actions.className = "quick-launch-actions";

    if (state.quickLaunchEditing) {
      actions.append(
        createActionButton("Enregistrer", saveQuickLaunchOrder, "save"),
        createActionButton("Annuler", cancelQuickLaunchEdit, "discard"),
      );
      header.append(actions);
      return header;
    }

    if (!catalogFavoritesPreview && favorites.length > 0) {
      const share = document.createElement("button");
      share.className = "quick-launch-action share-shortcut";
      share.type = "button";
      share.setAttribute("aria-label", "Partager ma configuration");
      share.title = "Partager ma configuration";
      share.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.6 6.6-4.2m-6.6 7 6.6 4.2"/></svg>';
      share.addEventListener("click", () => openShareExport(share));
      actions.append(share);
      actions.append(createActionButton("Modifier", startQuickLaunchEdit, "neutral"));
    }

    header.append(actions);
    return header;
  }

  function createActionButton(label, onClick, tone = "neutral") {
    const button = document.createElement("button");
    button.className = `quick-launch-action ${tone}`;
    button.type = "button";
    button.disabled = state.quickLaunchActionsExiting;
    button.textContent = label;
    button.addEventListener("click", onClick);
    return button;
  }

  function createQuickLaunchRemoveButton(resource) {
    const button = document.createElement("button");
    button.className = "quick-launch-remove";
    button.type = "button";
    button.setAttribute("aria-label", `Retirer ${resource.name} des favoris`);
    button.title = `Retirer ${resource.name} des favoris`;
    button.dataset.resourceId = resource.id;
    button.addEventListener("click", handleQuickLaunchRemove);
    button.addEventListener("pointerdown", stopQuickLaunchRemoveEvent);
    button.addEventListener("keydown", stopQuickLaunchRemoveEvent);
    button.addEventListener("keyup", stopQuickLaunchRemoveEvent);
    return button;
  }

  function getFavoriteResources(options = {}) {
    const resources = catalogFavoritesPreview
      ? getAlphaFavoriteResources()
      : getResourcesByIds(listFavoriteResourceIds(state.favoriteLayout));

    let visibleResources = resources.filter((resource) => (
      catalogFavoritesPreview ? getActions(resource).length > 0 : getProfileVisibleActions(resource).length > 0
    ));

    if (catalogFavoritesPreview && state.catalogPreviewEntryType !== "all") {
      visibleResources = visibleResources.filter(resource => getPressEntryTypes(resource).includes(state.catalogPreviewEntryType));
    }

    if (catalogFavoritesPreview && state.catalogPreviewTitleSource !== "all") {
      visibleResources = visibleResources.filter(resource => (
        getPressEntryTypes(resource).includes("press_title")
        && getPressTitleSourceFilterIds(resource).includes(state.catalogPreviewTitleSource)
      ));
    }

    if (catalogFavoritesPreview && !options.ignoreImageFilters) {
      return visibleResources.filter((resource) => {
        const matchesFormat = state.catalogPreviewImageFormats.size === 0
          || state.catalogPreviewImageFormats.has(getCatalogImageFormat(resource.icon_url));
        const matchesSize = !state.catalogPreviewLargeImagesOnly
          || resource.icon_size_bytes > catalogFavoritesLargeImageThresholdBytes;
        const matchesBackground = !state.catalogPreviewBackgroundImagesOnly
          || Boolean(resource.icon_background_image);
        return matchesFormat && matchesSize && matchesBackground;
      });
    }

    return visibleResources;
  }

  function getAlphaFavoriteResources() {
    return state.resources
      .filter((resource) => state.favorites.has(resource.id) && isCatalogVisible(resource))
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }

  function getResourcesByIds(ids) {
    return ids.map(getResourceById).filter((resource) => resource && isCatalogVisible(resource));
  }

  function getResourceById(id) {
    if (typeof id === "string" && id.startsWith("book:")) return bookSearch.getFavoriteResource(id);
    return state.resources.find((resource) => resource.id === id) ?? null;
  }

  const pressPlatformResourceIds = ["europresse", "pressreader", "indexpresse-business", "factiva"];
  const pressPlatformToneIds = {
    europresse: "europresse",
    pressreader: "pressreader",
    "indexpresse-business": "indexpresse_business",
    factiva: "factiva",
  };
  const pressPlatformCompactLabels = {
    "indexpresse-business": "IndexPresse Bus.",
  };
  const pressPlatformNarrowLabels = {
    "indexpresse-business": "IndexPresse",
  };

  const {
    createCatalogFavoritesImageFilters,
    getCatalogImageFormat,
    openCatalogFavoritesInspector,
    renderCatalogBackgroundComparison,
    setupCatalogFavoritesPreview
  } = createFavoritesCatalogPreview({
  applyTheme: (...args) => applyTheme(...args),
  catalogFavoritesLargeImageThresholdBytes,
  escapeAttribute,
  escapeHtml,
  getActions: (...args) => getActions(...args),
  getFallbackLabel: (...args) => getFallbackLabel(...args),
  getFavoriteResources: (...args) => getFavoriteResources(...args),
  getResourceById: (...args) => getResourceById(...args),
  getSessionAttributes: (...args) => getSessionAttributes(...args),
  isCatalogVisible: (...args) => isCatalogVisible(...args),
  logoAppearanceAttributes,
  pressEntryTypes,
  pressTitleSourceFilters,
  quickLaunch,
  renderIcon: (...args) => renderIcon(...args),
  renderQuickLaunch: (...args) => renderQuickLaunch(...args),
  resolveActionHref: (...args) => resolveActionHref(...args),
  startupImageBlockingCount,
  state,
  themeValues,
  waitForImageElement: (...args) => waitForImageElement(...args)
});

const {
  getQuickLaunchSecondaryActions,
  handleQuickLaunchActionsToggle,
  renderQuickLaunchAccessWarning,
  renderQuickLaunchSecondaryActions,
  resourceHasQuickLaunchActionMenu
} = createFavoritesActionMenu({
  escapeAttribute,
  escapeHtml,
  getAccessMode: (...args) => getAccessMode(...args),
  getAccessModeTitle: (...args) => getAccessModeTitle(...args),
  getActions: (...args) => getActions(...args),
  getSessionAttributes: (...args) => getSessionAttributes(...args),
  isContextNoteOpen: (...args) => isContextNoteOpen(...args),
  renderArchiveActionIcon: (...args) => renderArchiveActionIcon(...args),
  renderQuickLaunch: (...args) => renderQuickLaunch(...args),
  resolveActionHref: (...args) => resolveActionHref(...args),
  state
});

const {
  createFavoriteDestinationControl,
  createIconTextButton,
  createQuickLaunchFolderItem,
  createQuickLaunchRowActions,
  openQuickLaunchFolder
} = createFavoriteFolders({
    applyLogoAppearance: (...args) => applyLogoAppearance(...args),
    bookSearch,
    createActionButton: (...args) => createActionButton(...args),
    createFavoriteContainerId: (...args) => createFavoriteContainerId(...args),
    createFavoriteFolder: (...args) => createFavoriteFolder(...args),
    createQuickLaunchList: (...args) => createQuickLaunchList(...args),
    createQuickLaunchResourceItem: (...args) => createQuickLaunchResourceItem(...args),
    deleteFavoriteFolder: (...args) => deleteFavoriteFolder(...args),
    deleteFavoriteRow: (...args) => deleteFavoriteRow(...args),
    escapeHtml,
    findFavoriteFolder: (...args) => findFavoriteFolder(...args),
    findFavoriteResource: (...args) => findFavoriteResource(...args),
    getFallbackLabel: (...args) => getFallbackLabel(...args),
    getResourcesByIds: (...args) => getResourcesByIds(...args),
    handleQuickLaunchPointerDown,
    moveFavoriteResource: (...args) => moveFavoriteResource(...args),
    preventQuickLaunchEditContextMenu,
    quickLaunch,
    renderIcon: (...args) => renderIcon(...args),
    renderQuickLaunch: (...args) => renderQuickLaunch(...args),
    state,
    stopQuickLaunchRemoveEvent
  });

  return {
    renderQuickLaunch,
    setupCatalogFavoritesPreview: (...args) => setupCatalogFavoritesPreview(...args),
    pressPlatformResourceIds,
    pressPlatformToneIds,
    pressPlatformCompactLabels,
    pressPlatformNarrowLabels,
    getResourceById,
    getAlphaFavoriteResources,
    openQuickLaunchFolder: (...args) => openQuickLaunchFolder(...args),
    getFavoriteResources,
  };
}
