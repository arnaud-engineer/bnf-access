const methods = new Set(["reference", "title-only", "reference-title", "date-alternatives"]);
const string = (value, max = 2000) => typeof value === "string" && value.length <= max && !/[\u0000-\u001f]/.test(value);
const list = value => Array.isArray(value) && value.every(v => string(v) && v.trim());

export function validateDebridageProfiles(data) {
  if (!data || data.schema_version !== 1 || !Array.isArray(data.profiles) || data.profiles.length > 300) throw new Error("Version des profils invalide.");
  const ids = new Set(), hosts = new Map();
  for (const p of data.profiles) {
    if (!p || !/^[a-z0-9-]+$/.test(p.id) || ids.has(p.id)) throw new Error("Identifiant de profil invalide ou dupliqué.");
    ids.add(p.id);
    if (p.provider !== "europresse" || typeof p.enabled !== "boolean" || !["experimental", "verified", "unreviewed"].includes(p.status)) throw new Error("Plateforme ou statut invalide.");
    if (!string(p.name, 120) || !p.name.trim() || !list(p.hosts) || !p.hosts.length) throw new Error("Nom ou domaines invalides.");
    if (p.path_prefix !== undefined && (!string(p.path_prefix, 200) || (p.path_prefix !== "/" && !/^\/(?:[a-z0-9-]+\/){1,6}$/.test(p.path_prefix)))) throw new Error("Préfixe de rubrique invalide.");
    if (p.requires_title_input !== undefined && typeof p.requires_title_input !== "boolean") throw new Error("Saisie du titre invalide.");
    if (p.excluded_paths !== undefined && (!list(p.excluded_paths) || p.excluded_paths.length > 100 || p.excluded_paths.some(v => !v.startsWith("/") || /[?#]/.test(v)))) throw new Error("Chemins exclus invalides.");
    if (new Set(p.hosts).size !== p.hosts.length) throw new Error("Domaine dupliqué dans le profil.");
    for (const host of p.hosts) {
      const scopes = hosts.get(host) || new Set();
      const scope = p.path_prefix || "";
      if (!/^[a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,}$/.test(host) || scopes.has(scope)) throw new Error("Domaine invalide ou partagé sans rubrique distincte.");
      scopes.add(scope);
      hosts.set(host, scopes);
    }
    // Profiles are data, not executable regex programs: no assertions, backrefs or nested quantifiers.
    if (!string(p.path, 500) || !p.path.endsWith("$") || /\(\?|\\[1-9]|\||\([^)]*[*+{][^)]*\)[*+{]/.test(p.path)) throw new Error("Format de lien non autorisé.");
    try { new RegExp(p.path); } catch { throw new Error("Format de lien invalide."); }
    if (!list(p.methods) || !p.methods.length || new Set(p.methods).size !== p.methods.length || p.methods.some(m => !methods.has(m))) throw new Error("Méthodes invalides.");
    if (!["reference", "title-only"].includes(p.methods[0])) throw new Error("La méthode principale doit être une référence ou une recherche par titre.");
    if (p.methods.includes("title-only") && p.methods.some(m => m !== "title-only")) throw new Error("La recherche sans référence doit avoir son propre profil.");
    if (p.title_fallback_without_reference !== undefined && (typeof p.title_fallback_without_reference !== "boolean" || (p.title_fallback_without_reference && !p.methods.includes("reference-title")))) throw new Error("Secours textuel sans référence invalide.");
    if (p.title_word_strategy !== undefined && p.title_word_strategy !== "balanced") throw new Error("Sélection des mots du titre invalide.");
    if (!p.date || !["input", "captures", "month"].includes(p.date.type)) throw new Error("Extraction de date invalide.");
    for (const groups of [p.date.groups, p.date.month_groups ?? []]) {
      if (!Array.isArray(groups) || groups.some(g => !Number.isInteger(g) || g < 1 || g > 9)) throw new Error("Groupes de date invalides.");
    }
    if (p.date.type !== "input" && !p.date.groups.length) throw new Error("Date sans groupe d'extraction.");
    if (p.date_hint !== undefined && p.date_hint !== "uuid-v1") throw new Error("Indice de date invalide.");
    if (p.publications !== undefined) {
      if (!Array.isArray(p.publications) || !p.publications.length || p.publications.some(v => !/^[A-Z0-9]{1,12}$/.test(v.code) || !string(v.label, 120))) throw new Error("Publications invalides.");
      if (new Set(p.publications.map(v => v.code)).size !== p.publications.length) throw new Error("Publications dupliquées.");
    }
    if (!p.methods.includes("title-only")) {
      if (p.reference?.type === "url-sha1") {
        if (!/^[A-Z0-9]{1,12}$/.test(p.reference.source_code) || !/^[a-z0-9]{1,12}$/.test(p.reference.prefix)) throw new Error("Empreinte de référence invalide.");
      } else if (p.reference?.type === "id") {
        const template = p.reference.template;
        if (!string(template, 200) || !template.startsWith("news·{day}·") || !/^[a-zA-Z0-9·×{}_-]+$/.test(template) || /\{(?!(?:day|publication|id[1-9])\})/.test(template)) throw new Error("Modèle de référence invalide.");
      } else throw new Error("Méthode de référence manquante.");
    }
    for (const field of ["message", "date_message", "limitations", "catalog_resource_id"]) if (!string(p[field])) throw new Error("Champ de profil invalide : " + field);
    if (!list(p.evidence) || (p.enabled && (p.status === "unreviewed" || !p.evidence.length))) throw new Error("Un profil actif nécessite des essais documentés.");
  }
  return data;
}

export function matchDebridageProfile(value, data) {
  let url;
  try { url = new URL(value); } catch { return null; }
  if (url.protocol !== "https:" || url.username || url.password || url.port || url.pathname.length > 3000) return null;
  // A scoped magazine wins over its parent newspaper, independently of list order.
  const candidates = data.profiles.filter(p => p.hosts.includes(url.hostname) && (!p.path_prefix || url.pathname.startsWith(p.path_prefix)))
    .sort((a, b) => (b.path_prefix?.length || 0) - (a.path_prefix?.length || 0));
  for (const profile of candidates) {
    if (profile.excluded_paths?.some(p => p.replace(/\/$/, "") === url.pathname.replace(/\/$/, ""))) continue;
    const captures = url.pathname.match(new RegExp(profile.path));
    if (captures) return {profile, url, captures};
  }
  return null;
}
