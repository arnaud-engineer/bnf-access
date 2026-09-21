export const reservedCategoryIds = new Set(["all", "favorites", "none", "root", "unknown"]);
export const categoryIdPattern = /^[a-z][a-z0-9_]*$/;

export function normalizeCategoryLabel(value) {
  return String(value || "").normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("fr");
}

export function cleanCategoryLabel(value) {
  return String(value || "").normalize("NFKC").trim().replace(/\s+/g, " ");
}

export function categoryIndex(taxonomy) {
  return new Map((taxonomy?.categories ?? []).map((category) => [category.id, category]));
}

export function categoryChildren(taxonomy) {
  const children = new Map();
  for (const category of taxonomy?.categories ?? []) {
    const key = category.parent_id ?? null;
    if (!children.has(key)) children.set(key, []);
    children.get(key).push(category.id);
  }
  return children;
}

export function validateEditorialTaxonomy(taxonomy) {
  if (!taxonomy || taxonomy.schema_version !== 1 || !Array.isArray(taxonomy.categories)) {
    throw new Error("Structure de taxonomie invalide");
  }
  if (taxonomy.child_orders != null && (typeof taxonomy.child_orders !== "object" || Array.isArray(taxonomy.child_orders))) {
    throw new Error("Ordres de sous-catégories invalides");
  }

  const byId = new Map();
  const labels = new Map();
  for (const category of taxonomy.categories) {
    const id = category?.id;
    const label = cleanCategoryLabel(category?.label);
    if (!categoryIdPattern.test(id || "") || reservedCategoryIds.has(id)) {
      throw new Error(`Identifiant de catégorie invalide ou réservé : ${id || "(vide)"}`);
    }
    if (byId.has(id)) throw new Error(`Identifiant de catégorie dupliqué : ${id}`);
    if (!label) throw new Error(`Libellé vide pour la catégorie ${id}`);
    const normalizedLabel = normalizeCategoryLabel(label);
    if (labels.has(normalizedLabel)) {
      throw new Error(`Libellé de catégorie déjà utilisé : ${label}`);
    }
    if (category.parent_id != null && typeof category.parent_id !== "string") {
      throw new Error(`Parent invalide pour la catégorie ${id}`);
    }
    byId.set(id, { id, label, parent_id: category.parent_id ?? null });
    labels.set(normalizedLabel, id);
  }

  for (const category of byId.values()) {
    if (category.parent_id != null && !byId.has(category.parent_id)) {
      throw new Error(`Parent inconnu pour la catégorie ${category.id}`);
    }
    const visited = new Set();
    let cursor = category.id;
    while (cursor != null) {
      if (visited.has(cursor)) throw new Error(`Cycle détecté autour de ${category.label}`);
      visited.add(cursor);
      cursor = byId.get(cursor)?.parent_id ?? null;
    }
  }

  const children = categoryChildren({ categories: [...byId.values()] });
  for (const [parentId, order] of Object.entries(taxonomy.child_orders ?? {})) {
    if (!byId.has(parentId) || !Array.isArray(order) || new Set(order).size !== order.length) {
      throw new Error(`Ordre invalide pour la catégorie ${parentId}`);
    }
    const expected = new Set(children.get(parentId) ?? []);
    if (order.length !== expected.size || order.some((id) => !expected.has(id))) {
      throw new Error(`L’ordre de ${parentId} doit contenir toutes ses sous-catégories`);
    }
  }
  return taxonomy;
}

export function canonicalizeEditorialTaxonomy(taxonomy) {
  validateEditorialTaxonomy(taxonomy);
  return {
    schema_version: 1,
    categories: taxonomy.categories
      .map((category) => ({
        id: category.id,
        label: cleanCategoryLabel(category.label),
        parent_id: category.parent_id ?? null,
      }))
      .sort((left, right) => left.id.localeCompare(right.id)),
    child_orders: Object.fromEntries(
      Object.entries(taxonomy.child_orders ?? {})
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([parentId, order]) => [parentId, [...order]]),
    ),
  };
}

export function cloneEditorialTaxonomy(taxonomy) {
  return canonicalizeEditorialTaxonomy(structuredClone(taxonomy));
}

export function editorialTaxonomiesEqual(left, right) {
  return JSON.stringify(canonicalizeEditorialTaxonomy(left)) === JSON.stringify(canonicalizeEditorialTaxonomy(right));
}

export function orderedChildIds(taxonomy, parentId) {
  const byId = categoryIndex(taxonomy);
  const ids = categoryChildren(taxonomy).get(parentId ?? null) ?? [];
  const customOrder = parentId == null ? null : taxonomy.child_orders?.[parentId];
  if (customOrder) return [...customOrder];
  return [...ids].sort((left, right) => byId.get(left).label.localeCompare(byId.get(right).label, "fr", { sensitivity: "base" }));
}

export function orderedCategoryRows(taxonomy, { activeIds = null } = {}) {
  const byId = categoryIndex(taxonomy);
  const rows = [];
  const visit = (parentId, depth, path) => {
    for (const id of orderedChildIds(taxonomy, parentId)) {
      if (activeIds && !activeIds.has(id)) continue;
      const category = byId.get(id);
      const nextPath = [...path, category.label];
      rows.push({ ...category, depth, path: nextPath.join(" › ") });
      visit(id, depth + 1, nextPath);
    }
  };
  visit(null, 0, []);
  return rows;
}

export function descendantCategoryIds(taxonomy, categoryId, { includeSelf = true } = {}) {
  const children = categoryChildren(taxonomy);
  const ids = [];
  const visit = (id) => {
    ids.push(id);
    for (const childId of children.get(id) ?? []) visit(childId);
  };
  visit(categoryId);
  return includeSelf ? ids : ids.slice(1);
}

export function activeEditorialCategoryIds(taxonomy, resources) {
  const byId = categoryIndex(taxonomy);
  const active = new Set();
  for (const resource of resources) {
    if (resource.catalog_visible === false) continue;
    for (const tag of resource.topic_ids ?? []) {
      let cursor = tag;
      while (byId.has(cursor) && !active.has(cursor)) {
        active.add(cursor);
        cursor = byId.get(cursor).parent_id;
      }
    }
  }
  return active;
}

export function createCategoryId(label) {
  const normalized = String(label || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/^[^a-z]+/, "");
  return normalized || "categorie";
}
