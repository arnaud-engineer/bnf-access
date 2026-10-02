import {
  cloneFavoriteLayout as defaultCloneFavoriteLayout,
  normalizeFavoriteLayout as defaultNormalizeFavoriteLayout,
  listFavoriteResourceIds as defaultListFavoriteResourceIds,
  removeFavoriteResource as defaultRemoveFavoriteResource,
  createFavoriteRow as defaultCreateFavoriteRow,
  findFavoriteResource as defaultFindFavoriteResource,
  moveFavoriteResource as defaultMoveFavoriteResource,
  createFavoriteFolder as defaultCreateFavoriteFolder,
  moveFavoriteFolder as defaultMoveFavoriteFolder,
  findFavoriteFolder as defaultFindFavoriteFolder
} from '../../favorite-layout.js?v=2026-09-13';
import {
  quickLaunchAutoScrollEdge as defaultQuickLaunchAutoScrollEdge,
  quickLaunchAutoScrollAccelerationMs as defaultQuickLaunchAutoScrollAccelerationMs,
  quickLaunchAutoScrollMinSpeed as defaultQuickLaunchAutoScrollMinSpeed,
  quickLaunchAutoScrollMaxSpeed as defaultQuickLaunchAutoScrollMaxSpeed
} from '../../config/runtime.js';
export function createFavoritesEditor({
  state,
  cloneFavoriteLayout = defaultCloneFavoriteLayout,
  render,
  normalizeFavoriteLayout = defaultNormalizeFavoriteLayout,
  listFavoriteResourceIds = defaultListFavoriteResourceIds,
  resolveCatalogResourceId,
  saveFavorites,
  saveFavoriteLayout,
  integrateBookFavorites,
  removeFavoriteResource = defaultRemoveFavoriteResource,
  createFavoriteRow = defaultCreateFavoriteRow,
  createFavoriteContainerId,
  renderQuickLaunch,
  quickLaunch,
  pressTitleNarrowLayoutQuery,
  quickLaunchAutoScrollEdge = defaultQuickLaunchAutoScrollEdge,
  quickLaunchAutoScrollAccelerationMs = defaultQuickLaunchAutoScrollAccelerationMs,
  quickLaunchAutoScrollMinSpeed = defaultQuickLaunchAutoScrollMinSpeed,
  quickLaunchAutoScrollMaxSpeed = defaultQuickLaunchAutoScrollMaxSpeed,
  findFavoriteResource = defaultFindFavoriteResource,
  openQuickLaunchFolder,
  moveFavoriteResource = defaultMoveFavoriteResource,
  createFavoriteFolder = defaultCreateFavoriteFolder,
  moveFavoriteFolder = defaultMoveFavoriteFolder,
  findFavoriteFolder = defaultFindFavoriteFolder
}) {

  function startQuickLaunchEdit(event) {
    if (state.quickLaunchEditing || state.quickLaunchTransitioning) {
      return;
    }

    const button = event?.currentTarget;
    if (button && !prefersReducedMotion()) {
      state.quickLaunchTransitioning = true;
      button.disabled = true;
      button.classList.add("is-exiting");
      window.setTimeout(enterQuickLaunchEdit, 170);
      return;
    }

    enterQuickLaunchEdit();
  }

  function enterQuickLaunchEdit() {
    state.quickLaunchTransitioning = false;
    state.quickLaunchEditing = true;
    state.quickLaunchActionMenus.clear();
    state.quickLaunchActionsEntering = !prefersReducedMotion();
    state.draftFavoriteLayout = cloneFavoriteLayout(state.favoriteLayout);
    render();
  }

  function saveQuickLaunchOrder() {
    leaveQuickLaunchEdit(() => {
      state.favoriteLayout = normalizeFavoriteLayout(
        state.draftFavoriteLayout,
        listFavoriteResourceIds(state.draftFavoriteLayout),
        resolveCatalogResourceId,
      );
      state.favorites = new Set(listFavoriteResourceIds(state.favoriteLayout));
      saveFavorites();
      saveFavoriteLayout();
    });
  }

  function cancelQuickLaunchEdit() {
    leaveQuickLaunchEdit();
  }

  function leaveQuickLaunchEdit(applyExitAction = null) {
    if (!state.quickLaunchEditing || state.quickLaunchTransitioning) {
      return;
    }

    state.quickLaunchPendingExitAction = applyExitAction;

    if (prefersReducedMotion()) {
      finishQuickLaunchExit();
      return;
    }

    state.quickLaunchTransitioning = true;
    state.quickLaunchActionsExiting = true;
    render();
    window.setTimeout(finishQuickLaunchExit, 210);
  }

  function finishQuickLaunchExit() {
    state.quickLaunchPendingExitAction?.();
    state.quickLaunchPendingExitAction = null;
    state.quickLaunchTransitioning = false;
    state.quickLaunchActionsExiting = false;
    state.quickLaunchEditing = false;
    state.quickLaunchModifierEntering = !prefersReducedMotion();
    state.draftFavoriteLayout = null;
    clearQuickLaunchDrag();
    integrateBookFavorites();
    render();
  }

  function handleQuickLaunchRemove(event) {
    event.preventDefault();
    event.stopPropagation();
    const resourceId = event.currentTarget.dataset.resourceId;
    removeFavoriteResource(state.draftFavoriteLayout, resourceId);
    clearQuickLaunchDrag();
    render();
  }

  function addDraftFavoriteRow(index) {
    const row = createFavoriteRow(state.draftFavoriteLayout, createFavoriteContainerId("row"), "", index);
    renderQuickLaunch();
    quickLaunch.querySelector(`.quick-launch-row[data-row-id="${CSS.escape(row.id)}"] .quick-launch-row-name`)?.focus();
  }

  function stopQuickLaunchRemoveEvent(event) {
    event.stopPropagation();
  }

  function resetQuickLaunchActionAnimationFlag() {
    if (!state.quickLaunchActionsEntering && !state.quickLaunchModifierEntering) {
      return;
    }

    requestAnimationFrame(() => {
      state.quickLaunchActionsEntering = false;
      state.quickLaunchModifierEntering = false;
    });
  }

  function prefersReducedMotion() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }

  function handleQuickLaunchPointerDown(event) {
    if (!state.quickLaunchEditing || event.button > 0) {
      return;
    }

    const resourceId = event.currentTarget.dataset.resourceId;
    const folderId = event.currentTarget.dataset.folderId;
    state.dragging = createQuickLaunchDragState({
      kind: resourceId ? "resource" : "folder",
      id: resourceId || folderId,
      sourceRowId: event.currentTarget.dataset.rowId,
      sourceFolderId: resourceId ? event.currentTarget.dataset.folderId || null : null,
      sourceElement: event.currentTarget,
      event,
    });
    bindQuickLaunchPointerDrag();
  }

  function handleQuickLaunchRowPointerDown(event) {
    if (!state.quickLaunchEditing || event.button > 0) return;
    const sourceElement = event.currentTarget.closest(".quick-launch-row");
    if (!sourceElement) return;
    event.preventDefault();
    state.dragging = createQuickLaunchDragState({
      kind: "row",
      id: sourceElement.dataset.rowId,
      sourceRowId: sourceElement.dataset.rowId,
      sourceElement,
      event,
    });
    bindQuickLaunchPointerDrag();
  }

  function createQuickLaunchDragState({ kind, id, sourceRowId, sourceFolderId = null, sourceElement, event }) {
    return {
      kind,
      id,
      sourceRowId,
      sourceFolderId,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
      sourceElement,
      ghostElement: null,
      lastClientX: event.clientX,
      lastClientY: event.clientY,
      autoScrollFrame: null,
      autoScrollDirection: 0,
      autoScrollStrength: 0,
      autoScrollStartedAt: 0,
      autoScrollLastAt: 0,
    };
  }

  function bindQuickLaunchPointerDrag() {
    window.addEventListener("pointermove", handleQuickLaunchPointerMove, { passive: false });
    window.addEventListener("pointerup", handleQuickLaunchPointerUp);
    window.addEventListener("pointercancel", handleQuickLaunchPointerUp);
  }

  function preventQuickLaunchEditContextMenu(event) {
    if (!state.quickLaunchEditing) {
      return;
    }

    event.preventDefault();
  }

  function handleQuickLaunchPointerMove(event) {
    if (!state.dragging) {
      return;
    }

    event.preventDefault();

    const distance = Math.abs(event.clientX - state.dragging.startX) + Math.abs(event.clientY - state.dragging.startY);
    if (!state.dragging.active && distance > 4) activateQuickLaunchDrag(event);
    if (!state.dragging.active) return;
    positionQuickLaunchDragGhost(event);
    state.dragging.lastClientX = event.clientX;
    state.dragging.lastClientY = event.clientY;
    updateQuickLaunchDropTarget(event.clientX, event.clientY);
    updateQuickLaunchDragAutoScroll(event);
  }

  function updateQuickLaunchDropTarget(clientX, clientY) {
    clearQuickLaunchDropIndicators();

    const pointedElement = document.elementFromPoint(clientX, clientY);
    if (state.dragging.kind === "row") {
      updateQuickLaunchRowDropTarget(pointedElement, clientY);
      return;
    }
    const target = pointedElement?.closest(".quick-launch-item, .quick-launch-list");
    state.dragging.dropTarget = null;
    if (isDraggingResourceOutsideItsFolder({ clientX, clientY })) {
      state.dragging.dropTarget = { type: "row", rowId: state.dragging.sourceRowId };
      quickLaunch.querySelector(`.quick-launch-list[data-row-id="${CSS.escape(state.dragging.sourceRowId)}"]`)?.classList.add("is-drop-target");
      return;
    }
    if (!target) return;

    if (state.dragging.kind === "folder") {
      setQuickLaunchFolderDropTarget(target, { clientX, clientY });
    } else if (target.dataset.folderId && !target.dataset.resourceId) {
      state.dragging.dropTarget = { type: "folder", rowId: target.dataset.rowId, folderId: target.dataset.folderId };
    } else if (target.dataset.resourceId && target.dataset.resourceId !== state.dragging.id) {
      const bounds = target.getBoundingClientRect();
      const horizontalPosition = (clientX - bounds.left) / bounds.width;
      state.dragging.dropTarget = horizontalPosition > 0.28 && horizontalPosition < 0.72
        ? { type: "combine", resourceId: target.dataset.resourceId }
        : { type: "position", resourceId: target.dataset.resourceId, after: horizontalPosition >= 0.72 };
    } else if (target.classList.contains("quick-launch-list")) {
      state.dragging.dropTarget = { type: "row", rowId: target.dataset.rowId };
    }
    if (state.dragging.dropTarget) {
      const combines = state.dragging.kind === "resource" && ["combine", "folder"].includes(state.dragging.dropTarget.type);
      target.classList.add(combines ? "is-combine-target" : "is-drop-target");
      if (["position", "folder-position"].includes(state.dragging.dropTarget.type)) {
        target.dataset.dropPosition = state.dragging.dropTarget.after ? "after" : "before";
      }
    }
  }

  function updateQuickLaunchRowDropTarget(pointedElement, clientY) {
    state.dragging.dropTarget = null;
    const target = pointedElement?.closest(".quick-launch-row");
    if (!target || target.dataset.rowId === state.dragging.id) return;
    const bounds = target.getBoundingClientRect();
    const after = clientY >= bounds.top + bounds.height / 2;
    state.dragging.dropTarget = { type: "row-position", rowId: target.dataset.rowId, after };
    target.dataset.rowDropPosition = after ? "after" : "before";
  }

  function updateQuickLaunchDragAutoScroll(event) {
    const dragging = state.dragging;
    const supportsAutoScroll = dragging?.kind === "row"
      || event.pointerType === "touch"
      || pressTitleNarrowLayoutQuery.matches;
    if (!dragging?.active || !supportsAutoScroll) {
      stopQuickLaunchDragAutoScroll();
      return;
    }

    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const pointerY = event.clientY - (window.visualViewport?.offsetTop || 0);
    const topDistance = pointerY;
    const bottomDistance = viewportHeight - pointerY;
    let direction = 0;
    let strength = 0;

    if (topDistance < quickLaunchAutoScrollEdge) {
      direction = -1;
      strength = 1 - Math.max(0, topDistance) / quickLaunchAutoScrollEdge;
    } else if (bottomDistance < quickLaunchAutoScrollEdge) {
      direction = 1;
      strength = 1 - Math.max(0, bottomDistance) / quickLaunchAutoScrollEdge;
    }

    const bounds = getQuickLaunchAutoScrollBounds(viewportHeight);
    const atBound = direction < 0
      ? window.scrollY <= bounds.min + 0.5
      : direction > 0 && window.scrollY >= bounds.max - 0.5;
    if (!direction || atBound) {
      stopQuickLaunchDragAutoScroll();
      return;
    }

    if (dragging.autoScrollDirection !== direction) {
      dragging.autoScrollDirection = direction;
      dragging.autoScrollStartedAt = performance.now();
      dragging.autoScrollLastAt = 0;
    }
    dragging.autoScrollStrength = strength;
    if (!dragging.autoScrollFrame) {
      dragging.autoScrollFrame = requestAnimationFrame(stepQuickLaunchDragAutoScroll);
    }
  }

  function stepQuickLaunchDragAutoScroll(timestamp) {
    const dragging = state.dragging;
    if (!dragging?.active || !dragging.autoScrollDirection) return;

    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const bounds = getQuickLaunchAutoScrollBounds(viewportHeight);
    const elapsed = Math.max(0, timestamp - dragging.autoScrollStartedAt);
    const acceleration = Math.min(1, elapsed / quickLaunchAutoScrollAccelerationMs);
    const proximitySpeed = quickLaunchAutoScrollMinSpeed
      + (quickLaunchAutoScrollMaxSpeed - quickLaunchAutoScrollMinSpeed) * dragging.autoScrollStrength;
    const speed = quickLaunchAutoScrollMinSpeed
      + (proximitySpeed - quickLaunchAutoScrollMinSpeed) * (0.35 + acceleration * 0.65);
    const frameScale = dragging.autoScrollLastAt
      ? Math.min(2, (timestamp - dragging.autoScrollLastAt) / (1000 / 60))
      : 1;
    const nextScrollY = Math.min(
      bounds.max,
      Math.max(bounds.min, window.scrollY + dragging.autoScrollDirection * speed * frameScale),
    );
    dragging.autoScrollLastAt = timestamp;

    if (Math.abs(nextScrollY - window.scrollY) < 0.5) {
      stopQuickLaunchDragAutoScroll();
      return;
    }

    window.scrollTo({ top: nextScrollY, behavior: "auto" });
    updateQuickLaunchDropTarget(dragging.lastClientX, dragging.lastClientY);
    dragging.autoScrollFrame = requestAnimationFrame(stepQuickLaunchDragAutoScroll);
  }

  function getQuickLaunchAutoScrollBounds(viewportHeight) {
    const sectionBounds = quickLaunch.getBoundingClientRect();
    const sectionTop = window.scrollY + sectionBounds.top;
    const sectionBottom = window.scrollY + sectionBounds.bottom;
    const min = Math.max(0, sectionTop - 8);
    return {
      min,
      max: Math.max(min, sectionBottom - viewportHeight + 8),
    };
  }

  function stopQuickLaunchDragAutoScroll() {
    const dragging = state.dragging;
    if (!dragging) return;
    if (dragging.autoScrollFrame) cancelAnimationFrame(dragging.autoScrollFrame);
    dragging.autoScrollFrame = null;
    dragging.autoScrollDirection = 0;
    dragging.autoScrollStrength = 0;
    dragging.autoScrollStartedAt = 0;
    dragging.autoScrollLastAt = 0;
  }

  function handleQuickLaunchPointerUp() {
    stopQuickLaunchDragAutoScroll();
    window.removeEventListener("pointermove", handleQuickLaunchPointerMove);
    window.removeEventListener("pointerup", handleQuickLaunchPointerUp);
    window.removeEventListener("pointercancel", handleQuickLaunchPointerUp);
    const dragging = state.dragging;
    if (dragging?.active && dragging.dropTarget) {
      if (dragging.kind === "row") applyDraftFavoriteRowDrop(dragging.id, dragging.dropTarget);
      else if (dragging.kind === "folder") applyDraftFavoriteFolderDrop(dragging.id, dragging.dropTarget);
      else applyDraftFavoriteDrop(dragging.id, dragging.dropTarget);
    }
    const folderToReopen = dragging?.active && dragging.kind === "resource" && dragging.sourceFolderId
      && findFavoriteResource(state.draftFavoriteLayout, dragging.id)?.folder?.id === dragging.sourceFolderId
        ? dragging.sourceFolderId
        : null;
    const shouldRender = dragging?.active === true;
    if (dragging?.active && dragging.kind === "folder") {
      state.suppressedFavoriteFolderClickId = dragging.id;
      window.setTimeout(() => {
        if (state.suppressedFavoriteFolderClickId === dragging.id) state.suppressedFavoriteFolderClickId = null;
      }, 0);
    }
    clearQuickLaunchDrag();
    if (shouldRender) {
      renderQuickLaunch();
      if (folderToReopen) openQuickLaunchFolder(folderToReopen);
    }
  }

  function activateQuickLaunchDrag(event) {
    const dragging = state.dragging;
    if (!dragging?.sourceElement) return;
    dragging.active = true;
    dragging.sourceElement.classList.add("is-dragging");
    const ghost = dragging.kind === "row"
      ? createQuickLaunchRowDragGhost(dragging.sourceElement)
      : dragging.sourceElement.cloneNode(true);
    ghost.className = dragging.kind === "row" ? "quick-launch-row-drag-ghost" : "quick-launch-drag-ghost";
    ghost.removeAttribute("data-resource-id");
    ghost.removeAttribute("data-row-id");
    ghost.removeAttribute("data-folder-id");
    ghost.removeAttribute("role");
    ghost.removeAttribute("tabindex");
    ghost.setAttribute("aria-hidden", "true");
    ghost.querySelectorAll(".quick-launch-remove, .quick-launch-folder-remove, .quick-launch-destination-control, .quick-launch-folder-name, .quick-launch-row-actions").forEach((element) => element.remove());
    const bounds = dragging.sourceElement.getBoundingClientRect();
    ghost.style.width = `${bounds.width}px`;
    document.body.append(ghost);
    dragging.ghostElement = ghost;
    positionQuickLaunchDragGhost(event);
  }

  function createQuickLaunchRowDragGhost(sourceElement) {
    const ghost = document.createElement("div");
    const handle = sourceElement.querySelector(".quick-launch-row-drag-handle")?.cloneNode(true);
    const label = document.createElement("strong");
    label.textContent = sourceElement.querySelector(".quick-launch-row-name")?.value || "Ligne sans nom";
    if (handle) ghost.append(handle);
    ghost.append(label);
    return ghost;
  }

  function positionQuickLaunchDragGhost(event) {
    const ghost = state.dragging?.ghostElement;
    if (!ghost) return;
    ghost.style.left = `${event.clientX}px`;
    ghost.style.top = `${event.clientY}px`;
  }

  function clearQuickLaunchDropIndicators() {
    quickLaunch.querySelectorAll(".is-drop-target, .is-combine-target, [data-drop-position], [data-row-drop-position]").forEach((element) => {
      element.classList.remove("is-drop-target", "is-combine-target");
      delete element.dataset.dropPosition;
      delete element.dataset.rowDropPosition;
    });
  }

  function applyDraftFavoriteRowDrop(rowId, target) {
    if (target.type !== "row-position" || target.rowId === rowId) return;
    const rows = state.draftFavoriteLayout.rows;
    const sourceIndex = rows.findIndex((row) => row.id === rowId);
    if (sourceIndex < 0) return;
    const [row] = rows.splice(sourceIndex, 1);
    const targetIndex = rows.findIndex((candidate) => candidate.id === target.rowId);
    if (targetIndex < 0) {
      rows.splice(sourceIndex, 0, row);
      return;
    }
    rows.splice(targetIndex + (target.after ? 1 : 0), 0, row);
  }

  function clearQuickLaunchDrag() {
    stopQuickLaunchDragAutoScroll();
    state.dragging?.sourceElement?.classList.remove("is-dragging");
    state.dragging?.ghostElement?.remove();
    clearQuickLaunchDropIndicators();
    state.dragging = null;
  }

  function isDraggingResourceOutsideItsFolder(event) {
    if (state.dragging?.kind !== "resource" || !state.dragging.sourceFolderId) return false;
    const dialog = document.querySelector(`.quick-launch-folder-dialog[data-folder-id="${CSS.escape(state.dragging.sourceFolderId)}"]`);
    if (!dialog) return false;
    const bounds = dialog.getBoundingClientRect();
    return event.clientX < bounds.left
      || event.clientX > bounds.right
      || event.clientY < bounds.top
      || event.clientY > bounds.bottom;
  }

  function setQuickLaunchFolderDropTarget(target, event) {
    if (target.dataset.folderId && !target.dataset.resourceId) {
      if (target.dataset.folderId === state.dragging.id) return;
      const bounds = target.getBoundingClientRect();
      state.dragging.dropTarget = {
        type: "folder-position",
        folderId: target.dataset.folderId,
        after: event.clientX >= bounds.left + bounds.width / 2,
      };
      return;
    }
    if (target.dataset.resourceId && !target.dataset.folderId) {
      const bounds = target.getBoundingClientRect();
      state.dragging.dropTarget = {
        type: "position",
        resourceId: target.dataset.resourceId,
        after: event.clientX >= bounds.left + bounds.width / 2,
      };
      return;
    }
    if (target.classList.contains("quick-launch-list") && target.dataset.rowId) {
      state.dragging.dropTarget = { type: "row", rowId: target.dataset.rowId };
    }
  }

  function handleQuickLaunchKeyDown(event) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const resourceId = event.currentTarget.dataset.resourceId;
    const location = findFavoriteResource(state.draftFavoriteLayout, resourceId);
    if (!location) return;
    const container = location.folder ? location.folder.resourceIds : location.row.items;
    const currentIndex = location.folder ? location.resourceIndex : location.itemIndex;
    let nextIndex = currentIndex;

    if (event.key === "ArrowLeft") {
      nextIndex = Math.max(0, currentIndex - 1);
    }
    if (event.key === "ArrowRight") {
      nextIndex = Math.min(container.length - 1, currentIndex + 1);
    }
    if (event.key === "Home") {
      nextIndex = 0;
    }
    if (event.key === "End") {
      nextIndex = container.length - 1;
    }

    if (nextIndex !== currentIndex) {
      const [item] = container.splice(currentIndex, 1);
      container.splice(nextIndex, 0, item);
    } else if ((event.key === "ArrowUp" || event.key === "ArrowDown") && !location.folder) {
      const rowIndex = state.draftFavoriteLayout.rows.indexOf(location.row);
      const nextRow = state.draftFavoriteLayout.rows[rowIndex + (event.key === "ArrowUp" ? -1 : 1)];
      if (nextRow) moveFavoriteResource(state.draftFavoriteLayout, resourceId, { rowId: nextRow.id });
    } else {
      return;
    }

    renderQuickLaunch();
    quickLaunch.querySelector(`.quick-launch-item[data-resource-id="${CSS.escape(resourceId)}"]`)?.focus();
  }

  function applyDraftFavoriteDrop(resourceId, target) {
    if (target.type === "folder") {
      moveFavoriteResource(state.draftFavoriteLayout, resourceId, { rowId: target.rowId, folderId: target.folderId });
      return;
    }
    if (target.type === "row") {
      moveFavoriteResource(state.draftFavoriteLayout, resourceId, { rowId: target.rowId });
      return;
    }

    const targetLocation = findFavoriteResource(state.draftFavoriteLayout, target.resourceId);
    if (!targetLocation) return;
    if (target.type === "combine") {
      if (targetLocation.folder) {
        moveFavoriteResource(state.draftFavoriteLayout, resourceId, {
          rowId: targetLocation.row.id,
          folderId: targetLocation.folder.id,
        });
        return;
      }
      const sourceLocation = findFavoriteResource(state.draftFavoriteLayout, resourceId);
      const folderIndex = targetLocation.itemIndex - (
        sourceLocation?.row.id === targetLocation.row.id
        && !sourceLocation.folder
        && sourceLocation.itemIndex < targetLocation.itemIndex
          ? 1
          : 0
      );
      const folder = createFavoriteFolder(
        state.draftFavoriteLayout,
        targetLocation.row.id,
        createFavoriteContainerId("folder"),
        "",
        [target.resourceId, resourceId],
      );
      const currentIndex = targetLocation.row.items.indexOf(folder);
      targetLocation.row.items.splice(currentIndex, 1);
      targetLocation.row.items.splice(Math.min(folderIndex, targetLocation.row.items.length), 0, folder);
      return;
    }

    const sourceLocation = findFavoriteResource(state.draftFavoriteLayout, resourceId);
    let index = targetLocation.folder ? targetLocation.resourceIndex : targetLocation.itemIndex;
    const sameContainer = sourceLocation?.row.id === targetLocation.row.id
      && sourceLocation?.folder?.id === targetLocation.folder?.id;
    const sourceIndex = sourceLocation?.folder ? sourceLocation.resourceIndex : sourceLocation?.itemIndex;
    if (sameContainer && sourceIndex < index) index -= 1;
    if (target.after) index += 1;
    moveFavoriteResource(state.draftFavoriteLayout, resourceId, {
      rowId: targetLocation.row.id,
      folderId: targetLocation.folder?.id ?? null,
      index,
    });
  }

  function applyDraftFavoriteFolderDrop(folderId, target) {
    if (target.type === "row") {
      moveFavoriteFolder(state.draftFavoriteLayout, folderId, { rowId: target.rowId });
      return;
    }

    if (target.type === "folder-position") {
      const targetLocation = findFavoriteFolder(state.draftFavoriteLayout, target.folderId);
      if (!targetLocation) return;
      moveFavoriteFolder(state.draftFavoriteLayout, folderId, {
        rowId: targetLocation.row.id,
        index: targetLocation.itemIndex + (target.after ? 1 : 0),
      });
      return;
    }

    const targetLocation = findFavoriteResource(state.draftFavoriteLayout, target.resourceId);
    if (!targetLocation || targetLocation.folder) return;
    moveFavoriteFolder(state.draftFavoriteLayout, folderId, {
      rowId: targetLocation.row.id,
      index: targetLocation.itemIndex + (target.after ? 1 : 0),
    });
  }

  return {
    resetQuickLaunchActionAnimationFlag,
    handleQuickLaunchRowPointerDown,
    preventQuickLaunchEditContextMenu,
    addDraftFavoriteRow,
    handleQuickLaunchPointerDown,
    handleQuickLaunchKeyDown,
    stopQuickLaunchRemoveEvent,
    saveQuickLaunchOrder,
    cancelQuickLaunchEdit,
    startQuickLaunchEdit,
    handleQuickLaunchRemove
  };
}
