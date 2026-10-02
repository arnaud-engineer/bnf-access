import {
  applyLogoAppearance as defaultApplyLogoAppearance
} from '../../logo-appearance.js?v=2026-09-16-press-background';
import {
  createFavoriteFolder as defaultCreateFavoriteFolder,
  deleteFavoriteFolder as defaultDeleteFavoriteFolder,
  deleteFavoriteRow as defaultDeleteFavoriteRow,
  findFavoriteFolder as defaultFindFavoriteFolder,
  findFavoriteResource as defaultFindFavoriteResource,
  moveFavoriteResource as defaultMoveFavoriteResource
} from '../../favorite-layout.js?v=2026-09-13';
import {escapeHtml as defaultEscapeHtml} from '../../shared/text.js';
// Folder dialogs and row destinations edit the shared draft layout, never a separate book list.
export function createFavoriteFolders({
  applyLogoAppearance = defaultApplyLogoAppearance,
  bookSearch,
  createActionButton,
  createFavoriteContainerId,
  createFavoriteFolder = defaultCreateFavoriteFolder,
  createQuickLaunchList,
  createQuickLaunchResourceItem,
  deleteFavoriteFolder = defaultDeleteFavoriteFolder,
  deleteFavoriteRow = defaultDeleteFavoriteRow,
  escapeHtml = defaultEscapeHtml,
  findFavoriteFolder = defaultFindFavoriteFolder,
  findFavoriteResource = defaultFindFavoriteResource,
  getFallbackLabel,
  getResourcesByIds,
  handleQuickLaunchPointerDown,
  moveFavoriteResource = defaultMoveFavoriteResource,
  preventQuickLaunchEditContextMenu,
  quickLaunch,
  renderIcon,
  renderQuickLaunch,
  state,
  stopQuickLaunchRemoveEvent
}) {
  function createQuickLaunchRowActions(row, rowIndex, rowCount) {
    const actions = document.createElement("div");
    actions.className = "quick-launch-row-actions";
    actions.append(createQuickLaunchFolderAddButton(row.id));
    if (rowCount > 1) {
      actions.append(
        createIconTextButton("↑", "Monter la ligne", () => moveDraftFavoriteRow(rowIndex, -1), rowIndex === 0),
        createIconTextButton("↓", "Descendre la ligne", () => moveDraftFavoriteRow(rowIndex, 1), rowIndex === rowCount - 1),
      );
    }
    actions.append(createIconTextButton("×", "Supprimer la ligne", () => requestDeleteDraftFavoriteRow(row.id), false, "danger"));
    return actions;
  }

  function createQuickLaunchFolderAddButton(rowId) {
    const button = createIconTextButton("", "Créer un dossier", () => addDraftFavoriteFolder(rowId));
    button.classList.add("quick-launch-folder-add");
    button.insertAdjacentHTML("beforeend", '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10v6"/><path d="M9 13h6"/><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>');
    return button;
  }

  function createIconTextButton(text, label, onClick, disabled = false, tone = "") {
    const button = document.createElement("button");
    button.className = `quick-launch-row-action ${tone}`.trim();
    button.type = "button";
    button.textContent = text;
    button.title = label;
    button.setAttribute("aria-label", label);
    button.disabled = disabled;
    button.addEventListener("click", onClick);
    return button;
  }

  function createQuickLaunchFolderItem(row, folder) {
    const item = document.createElement("div");
    item.className = "quick-launch-item quick-launch-folder-item";
    item.dataset.rowId = row.id;
    item.dataset.folderId = folder.id;

    const opener = document.createElement("button");
    opener.className = "quick-launch-folder-open";
    opener.type = "button";
    opener.setAttribute("aria-label", folder.name ? `Ouvrir le dossier ${folder.name}` : "Ouvrir le dossier");
    opener.append(createQuickLaunchFolderMosaic(folder));
    if (!state.quickLaunchEditing && folder.name) {
      const label = document.createElement("small");
      label.className = "quick-launch-label";
      label.textContent = folder.name;
      opener.classList.add("has-label");
      opener.append(label);
    }
    opener.addEventListener("click", () => {
      if (state.suppressedFavoriteFolderClickId === folder.id) {
        state.suppressedFavoriteFolderClickId = null;
        return;
      }
      openQuickLaunchFolder(folder.id);
    });
    item.append(opener);

    if (state.quickLaunchEditing) {
      item.tabIndex = 0;
      item.setAttribute("role", "button");
      item.setAttribute("aria-label", folder.name ? `Déplacer le dossier ${folder.name}` : "Déplacer le dossier");
      item.setAttribute("draggable", "false");
      item.classList.toggle("is-dragging", state.dragging?.kind === "folder" && state.dragging.id === folder.id);
      const input = document.createElement("input");
      input.className = "quick-launch-folder-name";
      input.type = "text";
      input.maxLength = 80;
      input.value = folder.name;
      input.placeholder = "Nom du dossier";
      input.setAttribute("aria-label", "Nom du dossier");
      input.dataset.folderNameEditor = folder.id;
      input.addEventListener("input", () => updateDraftFavoriteFolderName(folder.id, input.value, input));
      for (const eventName of ["pointerdown", "click", "keydown", "keyup"]) {
        input.addEventListener(eventName, stopQuickLaunchRemoveEvent);
      }
      const remove = createIconTextButton("×", "Supprimer le dossier et conserver ses favoris", () => {
        deleteFavoriteFolder(state.draftFavoriteLayout, row.id, folder.id, true);
        renderQuickLaunch();
      }, false, "danger");
      remove.classList.add("quick-launch-folder-remove");
      item.querySelector(".quick-launch-folder-mosaic")?.append(createFolderDestinationControl(row.id, folder.id));
      item.append(input, remove);
      item.addEventListener("pointerdown", handleQuickLaunchPointerDown);
      item.addEventListener("contextmenu", preventQuickLaunchEditContextMenu);
      item.addEventListener("dragstart", preventQuickLaunchEditContextMenu);
    }
    return item;
  }

  function createQuickLaunchFolderMosaic(folder) {
    const mosaic = document.createElement("span");
    mosaic.className = "quick-launch-tile quick-launch-folder-mosaic";
    const resources = getResourcesByIds(folder.resourceIds).slice(0, 4);
    for (const resource of resources) {
      const cell = document.createElement("span");
      cell.className = "quick-launch-folder-cell";
      cell.classList.toggle("is-book", resource.is_book === true);
      cell.classList.toggle("icon-no-padding", resource.icon_no_padding === true);
      applyLogoAppearance(cell, resource);
      cell.innerHTML = resource.icon_url
        ? renderIcon(resource, true)
        : `<strong>${escapeHtml(getFallbackLabel(resource))}</strong>`;
      if (resource.is_book) bookSearch.decorateFavoriteCover(cell);
      mosaic.append(cell);
    }
    while (mosaic.children.length < 4) {
      const cell = document.createElement("span");
      cell.className = "quick-launch-folder-cell is-empty";
      mosaic.append(cell);
    }
    return mosaic;
  }

  function openQuickLaunchFolder(folderId) {
    const layout = state.quickLaunchEditing ? state.draftFavoriteLayout : state.favoriteLayout;
    const row = layout.rows.find((candidate) => candidate.items.some((item) => item.type === "folder" && item.id === folderId));
    const folder = row?.items.find((item) => item.type === "folder" && item.id === folderId);
    if (!folder) return;

    document.querySelector(".quick-launch-folder-dialog")?.remove();
    state.openFavoriteFolderId = folderId;
    const dialog = document.createElement("dialog");
    dialog.className = "quick-launch-folder-dialog";
    dialog.classList.toggle("is-editing", state.quickLaunchEditing);
    dialog.dataset.folderId = folder.id;
    dialog.setAttribute("aria-label", folder.name ? `Dossier ${folder.name}` : "Dossier");
    const header = document.createElement("header");
    const close = createIconTextButton("×", "Fermer le dossier", () => dialog.close());
    if (state.quickLaunchEditing) {
      const input = document.createElement("input");
      input.className = "quick-launch-folder-dialog-name";
      input.type = "text";
      input.maxLength = 80;
      input.value = folder.name;
      input.placeholder = "Nom du dossier";
      input.setAttribute("aria-label", "Nom du dossier");
      input.dataset.folderNameEditor = folder.id;
      input.addEventListener("input", () => updateDraftFavoriteFolderName(folder.id, input.value, input));
      header.append(input);
    } else if (folder.name) {
      const title = document.createElement("h3");
      title.textContent = folder.name;
      header.append(title);
    }
    header.append(close);
    dialog.append(header);

    const list = createQuickLaunchList(folder.name || "Dossier");
    list.classList.add("quick-launch-folder-content");
    getResourcesByIds(folder.resourceIds).forEach((resource, index) => {
      list.append(createQuickLaunchResourceItem(resource, index, { rowId: row.id, folderId: folder.id }));
    });
    if (!folder.resourceIds.length) {
      const empty = document.createElement("p");
      empty.className = "quick-launch-row-empty";
      empty.textContent = state.quickLaunchEditing ? "Déplacez des favoris dans ce dossier." : "Dossier vide";
      list.append(empty);
    }
    dialog.append(list);
    dialog.addEventListener("close", () => {
      state.openFavoriteFolderId = null;
      dialog.remove();
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.tabIndex = -1;
    document.body.append(dialog);
    dialog.showModal();
    dialog.focus({ preventScroll: true });
  }

  function addDraftFavoriteFolder(rowId) {
    const folder = createFavoriteFolder(
      state.draftFavoriteLayout,
      rowId,
      createFavoriteContainerId("folder"),
    );
    renderQuickLaunch();
    quickLaunch.querySelector(`[data-folder-id="${CSS.escape(folder.id)}"] .quick-launch-folder-name`)?.focus();
  }

  function moveDraftFavoriteRow(rowIndex, delta) {
    const rows = state.draftFavoriteLayout.rows;
    const nextIndex = rowIndex + delta;
    if (nextIndex < 0 || nextIndex >= rows.length) return;
    const [row] = rows.splice(rowIndex, 1);
    rows.splice(nextIndex, 0, row);
    renderQuickLaunch();
  }

  function createDestinationControl(select, label) {
    const control = document.createElement("span");
    control.className = "quick-launch-destination-control";
    control.title = label;
    control.insertAdjacentHTML("beforeend", '<svg class="quick-launch-destination-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1"/><path d="M2 13h10"/><path d="m9 16 3-3-3-3"/></svg>');
    control.append(select);
    for (const eventName of ["pointerdown", "click", "keydown", "keyup"]) {
      control.addEventListener(eventName, stopQuickLaunchRemoveEvent);
    }
    return control;
  }

  function createFavoriteDestinationControl(resourceId) {
    const select = document.createElement("select");
    select.className = "quick-launch-destination";
    select.setAttribute("aria-label", "Déplacer vers");
    const location = findFavoriteResource(state.draftFavoriteLayout, resourceId);
    for (const [index, row] of state.draftFavoriteLayout.rows.entries()) {
      const rowLabel = row.name || `Ligne sans nom ${index + 1}`;
      select.append(createDestinationOption(row.id, "", rowLabel, location?.row.id === row.id && !location.folder));
      for (const item of row.items) {
        if (item.type === "folder") {
          const option = createDestinationOption(row.id, item.id, `${rowLabel} / ${item.name || "Dossier"}`, location?.folder?.id === item.id);
          option.dataset.folderId = item.id;
          option.dataset.rowLabel = rowLabel;
          select.append(option);
        }
      }
    }
    select.addEventListener("change", () => {
      const [rowId, folderId] = select.value.split("::");
      moveFavoriteResource(state.draftFavoriteLayout, resourceId, { rowId, folderId: folderId || null });
      renderQuickLaunch();
    });
    return createDestinationControl(select, "Déplacer vers une ligne ou un dossier");
  }

  function createDestinationOption(rowId, folderId, label, selected) {
    const option = document.createElement("option");
    option.value = `${rowId}::${folderId}`;
    option.textContent = label;
    option.selected = selected;
    return option;
  }

  function createFolderDestinationControl(sourceRowId, folderId) {
    const select = document.createElement("select");
    select.className = "quick-launch-destination";
    select.setAttribute("aria-label", "Déplacer le dossier vers");
    state.draftFavoriteLayout.rows.forEach((row, index) => {
      select.append(createDestinationOption(row.id, "", row.name || `Ligne sans nom ${index + 1}`, row.id === sourceRowId));
    });
    select.addEventListener("change", () => {
      const [destinationRowId] = select.value.split("::");
      if (destinationRowId === sourceRowId) return;
      const source = state.draftFavoriteLayout.rows.find((row) => row.id === sourceRowId);
      const destination = state.draftFavoriteLayout.rows.find((row) => row.id === destinationRowId);
      const index = source.items.findIndex((item) => item.type === "folder" && item.id === folderId);
      if (!destination || index === -1) return;
      destination.items.push(source.items.splice(index, 1)[0]);
      renderQuickLaunch();
    });
    return createDestinationControl(select, "Déplacer le dossier vers une ligne");
  }

  function updateDraftFavoriteFolderName(folderId, value, sourceInput) {
    const location = findFavoriteFolder(state.draftFavoriteLayout, folderId);
    if (!location) return;
    location.folder.name = value;
    const selector = `[data-folder-name-editor="${CSS.escape(folderId)}"]`;
    document.querySelectorAll(selector).forEach((input) => {
      if (input !== sourceInput) input.value = value;
    });
    const folderItem = quickLaunch.querySelector(`.quick-launch-folder-item[data-folder-id="${CSS.escape(folderId)}"]`);
    folderItem?.setAttribute("aria-label", value ? `Déplacer le dossier ${value}` : "Déplacer le dossier");
    const opener = folderItem?.querySelector(".quick-launch-folder-open");
    opener?.setAttribute("aria-label", value ? `Ouvrir le dossier ${value}` : "Ouvrir le dossier");
    const dialog = document.querySelector(`.quick-launch-folder-dialog[data-folder-id="${CSS.escape(folderId)}"]`);
    dialog?.setAttribute("aria-label", value ? `Dossier ${value}` : "Dossier");
    dialog?.querySelector(".quick-launch-folder-content")?.setAttribute("aria-label", value || "Dossier");
    document.querySelectorAll(`.quick-launch-destination option[data-folder-id="${CSS.escape(folderId)}"]`).forEach((option) => {
      option.textContent = `${option.dataset.rowLabel} / ${value || "Dossier"}`;
    });
  }

  function requestDeleteDraftFavoriteRow(rowId) {
    const row = state.draftFavoriteLayout.rows.find((candidate) => candidate.id === rowId);
    const resourceCount = row?.items.reduce((count, item) => count + (item.type === "folder" ? item.resourceIds.length : 1), 0) ?? 0;
    if (!row || !resourceCount) {
      deleteFavoriteRow(state.draftFavoriteLayout, rowId);
      renderQuickLaunch();
      return;
    }

    const destinations = state.draftFavoriteLayout.rows.filter((candidate) => candidate.id !== rowId);
    const dialog = document.createElement("dialog");
    dialog.className = "quick-launch-delete-row-dialog";
    dialog.setAttribute("aria-label", "Supprimer une ligne de favoris");
    dialog.innerHTML = `<h3>Supprimer cette ligne ?</h3><p>Elle contient ${resourceCount} favori${resourceCount > 1 ? "s" : ""}.</p>`;
    if (destinations.length) {
      const select = document.createElement("select");
      destinations.forEach((candidate, index) => select.append(createDestinationOption(candidate.id, "", candidate.name || `Ligne sans nom ${index + 1}`, index === 0)));
      const move = createActionButton("Déplacer puis supprimer", () => {
        deleteFavoriteRow(state.draftFavoriteLayout, rowId, select.value.split("::")[0]);
        dialog.close();
        renderQuickLaunch();
      }, "save");
      dialog.append(select, move);
    }
    const remove = createActionButton("Retirer les favoris", () => {
      deleteFavoriteRow(state.draftFavoriteLayout, rowId);
      dialog.close();
      renderQuickLaunch();
    }, "danger");
    const cancel = createActionButton("Annuler", () => dialog.close(), "neutral");
    const actions = document.createElement("div");
    actions.className = "quick-launch-delete-row-actions";
    actions.append(remove, cancel);
    dialog.append(actions);
    dialog.addEventListener("close", () => dialog.remove());
    document.body.append(dialog);
    dialog.showModal();
  }

  return {
    createFavoriteDestinationControl,
    createIconTextButton,
    createQuickLaunchFolderItem,
    createQuickLaunchRowActions,
    openQuickLaunchFolder
  };
}
