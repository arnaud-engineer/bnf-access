export function validateCatalog(data) {
  if (data?.schema_version !== "2.0.0" || !Array.isArray(data.resources)) {
    throw new Error("Catalogue BnF Access v2 invalide");
  }
  const ids = data.resources.map((resource) => resource.id);
  if (new Set(ids).size !== ids.length) throw new Error("Identifiants de fiches dupliqués");
  return data;
}

export function mergeCatalogEntries(core, press) {
  validateCatalog(core);
  validateCatalog(press);
  return validateCatalog({ ...core, resources: [...core.resources, ...press.resources] });
}

const preferenceMigrationVersion = 2;

// Same-origin migrations are versioned and keep the original keys as a backup.
export function migratePreferences(storage = localStorage) {
  const storedVersion = Number.parseInt(storage.getItem("bnf-access:v2:migration-version") ?? "0", 10);
  if (storedVersion >= preferenceMigrationVersion) return;
  const prefixes = ["bnf-access-press:", "bnf-access:"];
  const listKeys = new Set(["favorites:v1", "favorite-order:v1"]);
  const suffixes = ["favorites:v1", "favorites-ready:v1", "favorite-order:v1",
    "favorite-order-custom:v1", "edition-selections:v1", "pass-filter:v1",
    "remote-filter:v1", "site-access:v1", "language-filter:v1", "theme:v1",
    "privacy-notice-dismissed:v1"];
  const pending = [];
  let migratedLegacyFavorites = false;
  for (const suffix of suffixes) {
    const target = "bnf-access:v2:" + suffix;
    if (storage.getItem(target) !== null) continue;
    const values = prefixes.map((prefix) => storage.getItem(prefix + suffix)).filter((v) => v !== null);
    if (!values.length) continue;
    const value = listKeys.has(suffix)
      ? JSON.stringify([...new Set(values.flatMap((v) => {
        const parsed = JSON.parse(v);
        if (!Array.isArray(parsed)) throw new Error("Préférences historiques invalides");
        return parsed;
      }))])
      : values[0];
    pending.push([target, value]);
    if (suffix === "favorites:v1") migratedLegacyFavorites = true;
  }
  for (const [key, value] of pending) storage.setItem(key, value);
  if (migratedLegacyFavorites) {
    storage.setItem("bnf-access:v2:legacy-favorites-migrated:v1", "true");
  }
  storage.setItem("bnf-access:v2:migrated", "true");
  storage.setItem("bnf-access:v2:migration-version", String(preferenceMigrationVersion));
}
