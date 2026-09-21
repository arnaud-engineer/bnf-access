export const favoriteLayoutVersion = 1;

export function createFavoriteLayout(favoriteIds = [], orderedIds = favoriteIds) {
  const favorites = new Set(favoriteIds);
  const seen = new Set();
  const ids = orderedIds.filter((id) => favorites.has(id) && !seen.has(id) && seen.add(id));
  for (const id of favoriteIds) {
    if (!seen.has(id)) {
      seen.add(id);
      ids.push(id);
    }
  }

  return {
    version: favoriteLayoutVersion,
    rows: [{ id: "favorites", name: "", items: ids.map(resourceItem) }],
  };
}

export function normalizeFavoriteLayout(value, favoriteIds, resolveId = identity) {
  const favorites = new Set(favoriteIds.map(resolveId));
  const seenResources = new Set();
  const seenContainers = new Set();
  const rows = [];

  for (const [rowIndex, candidate] of (Array.isArray(value?.rows) ? value.rows : []).entries()) {
    const rowId = uniqueContainerId(candidate?.id, `row-${rowIndex + 1}`, seenContainers);
    const row = { id: rowId, name: cleanName(candidate?.name), items: [] };

    for (const [itemIndex, item] of (Array.isArray(candidate?.items) ? candidate.items : []).entries()) {
      if (item?.type === "folder") {
        const folderId = uniqueContainerId(item.id, `${rowId}-folder-${itemIndex + 1}`, seenContainers);
        const resourceIds = normalizeResourceIds(item.resourceIds, favorites, seenResources, resolveId);
        row.items.push({ type: "folder", id: folderId, name: cleanName(item.name), resourceIds });
        continue;
      }

      const resourceId = resolveId(item?.resourceId ?? item?.id);
      if (favorites.has(resourceId) && !seenResources.has(resourceId)) {
        seenResources.add(resourceId);
        row.items.push(resourceItem(resourceId));
      }
    }

    rows.push(row);
  }

  if (!rows.length) {
    rows.push({ id: "favorites", name: "", items: [] });
  }

  for (const resourceId of favorites) {
    if (!seenResources.has(resourceId)) {
      rows[0].items.push(resourceItem(resourceId));
    }
  }

  return { version: favoriteLayoutVersion, rows };
}

export function cloneFavoriteLayout(layout) {
  return normalizeFavoriteLayout(layout, listFavoriteResourceIds(layout));
}

export function listFavoriteResourceIds(layout) {
  return (layout?.rows ?? []).flatMap((row) => row.items.flatMap((item) => (
    item.type === "folder" ? item.resourceIds : [item.resourceId]
  )));
}

export function findFavoriteResource(layout, resourceId) {
  for (const row of layout.rows) {
    for (const [itemIndex, item] of row.items.entries()) {
      if (item.type === "resource" && item.resourceId === resourceId) {
        return { row, item, itemIndex, folder: null, resourceIndex: 0 };
      }
      if (item.type === "folder") {
        const resourceIndex = item.resourceIds.indexOf(resourceId);
        if (resourceIndex !== -1) {
          return { row, item, itemIndex, folder: item, resourceIndex };
        }
      }
    }
  }
  return null;
}

export function findFavoriteFolder(layout, folderId) {
  for (const row of layout.rows) {
    const itemIndex = row.items.findIndex((item) => item.type === "folder" && item.id === folderId);
    if (itemIndex !== -1) return { row, folder: row.items[itemIndex], itemIndex };
  }
  return null;
}

export function removeFavoriteResource(layout, resourceId) {
  const location = findFavoriteResource(layout, resourceId);
  if (!location) return false;
  if (location.folder) {
    location.folder.resourceIds.splice(location.resourceIndex, 1);
  } else {
    location.row.items.splice(location.itemIndex, 1);
  }
  return true;
}

export function moveFavoriteResource(layout, resourceId, destination) {
  const targetRow = layout.rows.find((row) => row.id === destination.rowId);
  if (!targetRow) return false;

  const targetFolder = destination.folderId
    ? targetRow.items.find((item) => item.type === "folder" && item.id === destination.folderId)
    : null;
  if (destination.folderId && !targetFolder) return false;

  removeFavoriteResource(layout, resourceId);
  if (targetFolder) {
    const index = clampIndex(destination.index, targetFolder.resourceIds.length);
    targetFolder.resourceIds.splice(index, 0, resourceId);
  } else {
    const index = clampIndex(destination.index, targetRow.items.length);
    targetRow.items.splice(index, 0, resourceItem(resourceId));
  }
  return true;
}

export function moveFavoriteFolder(layout, folderId, destination) {
  const source = findFavoriteFolder(layout, folderId);
  const targetRow = layout.rows.find((row) => row.id === destination.rowId);
  if (!source || !targetRow) return false;

  let index = clampIndex(destination.index, targetRow.items.length);
  if (source.row.id === targetRow.id && source.itemIndex < index) index -= 1;
  source.row.items.splice(source.itemIndex, 1);
  targetRow.items.splice(index, 0, source.folder);
  return true;
}

export function createFavoriteRow(layout, id, name = "", index = layout.rows.length) {
  const row = { id, name: cleanName(name), items: [] };
  layout.rows.splice(clampIndex(index, layout.rows.length), 0, row);
  return row;
}

export function createFavoriteFolder(layout, rowId, id, name = "", resourceIds = []) {
  const row = layout.rows.find((candidate) => candidate.id === rowId);
  if (!row) return null;
  const folder = { type: "folder", id, name: cleanName(name), resourceIds: [] };
  row.items.push(folder);
  for (const resourceId of resourceIds) {
    removeFavoriteResource(layout, resourceId);
    folder.resourceIds.push(resourceId);
  }
  return folder;
}

export function deleteFavoriteFolder(layout, rowId, folderId, keepResources = true) {
  const row = layout.rows.find((candidate) => candidate.id === rowId);
  const index = row?.items.findIndex((item) => item.type === "folder" && item.id === folderId) ?? -1;
  if (!row || index === -1) return [];
  const [folder] = row.items.splice(index, 1);
  if (keepResources) {
    row.items.splice(index, 0, ...folder.resourceIds.map(resourceItem));
  }
  return folder.resourceIds;
}

export function deleteFavoriteRow(layout, rowId, destinationRowId = null) {
  const index = layout.rows.findIndex((row) => row.id === rowId);
  if (index === -1) return [];
  const [row] = layout.rows.splice(index, 1);
  const removedIds = row.items.flatMap((item) => item.type === "folder" ? item.resourceIds : [item.resourceId]);
  const destination = layout.rows.find((candidate) => candidate.id === destinationRowId);
  if (destination) destination.items.push(...row.items);
  if (!layout.rows.length) layout.rows.push({ id: "favorites", name: "", items: [] });
  return removedIds;
}

function resourceItem(resourceId) {
  return { type: "resource", resourceId };
}

function normalizeResourceIds(values, favorites, seen, resolveId) {
  const result = [];
  for (const value of (Array.isArray(values) ? values : [])) {
    const id = resolveId(value);
    if (favorites.has(id) && !seen.has(id)) {
      seen.add(id);
      result.push(id);
    }
  }
  return result;
}

function uniqueContainerId(value, fallback, seen) {
  const base = String(value || fallback).trim() || fallback;
  let id = base;
  let suffix = 2;
  while (seen.has(id)) id = `${base}-${suffix++}`;
  seen.add(id);
  return id;
}

function cleanName(value) {
  return String(value ?? "").trim().slice(0, 80);
}

function clampIndex(value, length) {
  return Number.isInteger(value) ? Math.max(0, Math.min(value, length)) : length;
}

function identity(value) {
  return value;
}
