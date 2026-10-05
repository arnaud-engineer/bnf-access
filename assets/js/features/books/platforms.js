// Use the directory taxonomy as the source of truth, not a second manual list.
export function unindexedBookResources(resources, workspace, definitions) {
  const accepted = new Set(['catalogues_et_bibliographies__livres']);
  const categories = workspace?.taxonomy?.categories ?? [];
  let changed = true;
  while (changed) {
    changed = false;
    for (const category of categories) {
      if (accepted.has(category.parent_id) && !accepted.has(category.id)) {
        accepted.add(category.id);
        changed = true;
      }
    }
  }
  const indexed = new Set(definitions.filter(([, , , enabled = true]) => enabled).map(([, id]) => id));
  return resources.filter(resource => !indexed.has(resource.id)
    && (workspace?.assignments?.[resource.id]?.node_ids ?? []).some(id => accepted.has(id)))
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
}
