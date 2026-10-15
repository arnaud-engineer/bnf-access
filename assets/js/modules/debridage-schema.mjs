const methods = new Set(["reference", "title-only", "reference-title", "date-alternatives"]);
const string = (value, max = 2000) => typeof value === "string" && value.length <= max && !/[\u0000-\u001f]/.test(value);
const list = value => Array.isArray(value) && value.every(v => string(v) && v.trim());

export function validateMetadataQueryIdentity(policy) {
  if (!policy || !/^[a-z][a-z0-9_]{0,31}$/.test(policy.parameter || "") ||
      !/^\/[a-zA-Z0-9_./-]{1,199}$/.test(policy.canonical_path || "") || policy.canonical_path.includes("..") ||
      !Array.isArray(policy.canonical_extra_parameters) || policy.canonical_extra_parameters.length > 4 ||
      policy.canonical_extra_parameters.some(p => !/^[a-z][a-z0-9_]{0,31}$/.test(p) || p === policy.parameter) ||
      new Set(policy.canonical_extra_parameters).size !== policy.canonical_extra_parameters.length) {
    throw new Error("Identite de metadonnees par parametre invalide.");
  }
  return policy;
}

export function validateDebridageProfiles(data) {
  if (!data || data.schema_version !== 1 || !Array.isArray(data.profiles) || data.profiles.length > 600) throw new Error("Version des profils invalide.");
  const ids = new Set(), hosts = new Map();
  for (const p of data.profiles) {
    if (!p || !/^[a-z0-9-]+$/.test(p.id) || ids.has(p.id)) throw new Error("Identifiant de profil invalide ou dupliqué.");
    ids.add(p.id);
    if (p.provider !== "europresse" || typeof p.enabled !== "boolean" || !["experimental", "verified", "unreviewed"].includes(p.status)) throw new Error("Plateforme ou statut invalide.");
    if (!string(p.name, 120) || !p.name.trim() || !list(p.hosts) || !p.hosts.length) throw new Error("Nom ou domaines invalides.");
    if (p.path_prefix !== undefined && (!string(p.path_prefix, 200) || (p.path_prefix !== "/" && !/^\/(?:[a-z0-9-]+\/){1,6}$/.test(p.path_prefix)))) throw new Error("Préfixe de rubrique invalide.");
    if (p.requires_title_input !== undefined && typeof p.requires_title_input !== "boolean") throw new Error("Saisie du titre invalide.");
    if (p.title_url_ignored_slugs !== undefined && (!Array.isArray(p.title_url_ignored_slugs) || !p.title_url_ignored_slugs.length || p.title_url_ignored_slugs.length > 100 || p.title_url_ignored_slugs.some(v => typeof v !== "string" || !/^[a-z0-9]{1,30}(?:-[a-z0-9]{1,30}){0,5}$/.test(v)) || new Set(p.title_url_ignored_slugs).size !== p.title_url_ignored_slugs.length || !p.methods?.includes("title-only"))) throw new Error("Rubriques sans titre invalides.");
    if (p.metadata_query_identity !== undefined) {
      validateMetadataQueryIdentity(p.metadata_query_identity);
      if ((!p.requires_title_input && !p.title_url_ignored_slugs?.length) || !p.methods?.includes("title-only")) throw new Error("Identite de metadonnees reservee aux liens sans titre.");
    }
    if (p.excluded_paths !== undefined && (!list(p.excluded_paths) || p.excluded_paths.length > 100 || p.excluded_paths.some(v => !v.startsWith("/") || /[?#]/.test(v)))) throw new Error("Chemins exclus invalides.");
    if (new Set(p.hosts).size !== p.hosts.length) throw new Error("Domaine dupliqué dans le profil.");
    if (p.path_slug_terms !== undefined && (!Array.isArray(p.path_slug_terms) || !p.path_slug_terms.length || p.path_slug_terms.length > 20 || p.path_slug_terms.some(term => typeof term !== "string" || !/^[a-z0-9]{2,30}$/.test(term)) || new Set(p.path_slug_terms).size !== p.path_slug_terms.length)) throw new Error("Termes de périmètre invalides.");
    for (const host of p.hosts) {
      const scopes = hosts.get(host) || [];
      const scope = p.path_prefix || "";
      const terms = p.path_slug_terms || [];
      const collision = scopes.some(old => old.prefix === scope && ((!terms.length && !old.terms.length) || terms.some(term => old.terms.includes(term))));
      if (!/^[a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,}$/.test(host) || collision) throw new Error("Domaine invalide ou partagé sans rubrique distincte.");
      scopes.push({prefix: scope, terms});
      hosts.set(host, scopes);
    }
    // Profiles are data, not executable regex programs: no assertions, backrefs or nested quantifiers.
    if (!string(p.path, 500) || !p.path.endsWith("$") || /\(\?|\\[1-9]|\||\([^)]*[*+{][^)]*\)[*+{]/.test(p.path)) throw new Error("Format de lien non autorisé.");
    let captureCount;
    try {
      // The empty alternative lets the parser report capture slots without an article match.
      captureCount = new RegExp(`(?:${p.path})|`).exec("").length - 1;
    } catch { throw new Error("Format de lien invalide."); }
    if (!list(p.methods) || !p.methods.length || new Set(p.methods).size !== p.methods.length || p.methods.some(m => !methods.has(m))) throw new Error("Méthodes invalides.");
    if (!["reference", "title-only"].includes(p.methods[0])) throw new Error("La méthode principale doit être une référence ou une recherche par titre.");
    if (p.methods.includes("title-only") && p.methods.some(m => m !== "title-only")) throw new Error("La recherche sans référence doit avoir son propre profil.");
    if (p.title_fallback_without_reference !== undefined && (typeof p.title_fallback_without_reference !== "boolean" || (p.title_fallback_without_reference && !p.methods.includes("reference-title")))) throw new Error("Secours textuel sans référence invalide.");
    if (p.title_word_strategy !== undefined && !["balanced", "editorial", "concise", "first-four", "long-words", "long-anchors"].includes(p.title_word_strategy)) throw new Error("Sélection des mots du titre invalide.");
    if (p.title_query_mode !== undefined && (p.title_query_mode !== "phrase" || !p.methods.includes("title-only") || p.title_number_group !== undefined)) throw new Error("Mode de phrase du titre invalide.");
    if (p.title_number_group !== undefined && (!Number.isInteger(p.title_number_group) || p.title_number_group < 1 || p.title_number_group > 9 || p.title_number_group > captureCount || !p.methods.includes("title-only"))) throw new Error("Groupe du numéro de volet invalide.");
    if (p.title_url_unmatched_prefix_words !== undefined && (!Number.isInteger(p.title_url_unmatched_prefix_words) || p.title_url_unmatched_prefix_words < 0 || p.title_url_unmatched_prefix_words > 3)) throw new Error("Retrait de préfixe inconnu invalide.");
    if (p.title_url_prefixes !== undefined && (!Array.isArray(p.title_url_prefixes) || p.title_url_prefixes.length > 1000 || JSON.stringify(p.title_url_prefixes).length > 50000 || p.title_url_prefixes.some(word => typeof word !== "string" || word.length > 100 || !/^[a-z0-9]{1,30}(?:-[a-z0-9]{1,30}){0,9}$/.test(word)) || new Set(p.title_url_prefixes).size !== p.title_url_prefixes.length)) throw new Error("Préfixes de rubrique invalides.");
    if (!p.date || !["input", "captures", "month"].includes(p.date.type)) throw new Error("Extraction de date invalide.");
    for (const [index, groups] of [p.date.groups, p.date.month_groups ?? []].entries()) {
      // Historical input recipes retain unused groups; only read groups must exist.
      const used = index === 1 || p.date.type !== "input";
      if (!Array.isArray(groups) || groups.some(g => !Number.isInteger(g) || g < 1 || g > 9 || (used && g > captureCount))) throw new Error("Groupes de date invalides : le groupe utilisé doit exister dans le format du lien.");
    }
    if (p.date.type !== "input" && !p.date.groups.length) throw new Error("Date sans groupe d'extraction.");
    if (p.date_hint !== undefined && p.date_hint !== "uuid-v1") throw new Error("Indice de date invalide.");
    if (p.public_date_metadata !== undefined) {
      const policy = p.public_date_metadata;
      if (!policy || Object.keys(policy).some(key => !["host", "time_zone"].includes(key)) ||
          !p.hosts.includes(policy.host) || !/^(?:[a-z0-9-]+\.)+[a-z]{2,63}$/.test(policy.host) ||
          !string(policy.time_zone, 80) || p.reference?.type !== "url-sha1" ||
          p.date.type !== "input" || p.methods[0] !== "reference" || !p.title_fallback_without_reference) {
        throw new Error("Lecture de date publique non admissible.");
      }
      try { new Intl.DateTimeFormat("en", {timeZone: policy.time_zone}); }
      catch { throw new Error("Fuseau de date publique invalide."); }
    }
    if (p.manual_search_source !== undefined && (!p.manual_search_source || !string(p.manual_search_source.id, 12) || !/^\d{1,12}$/.test(p.manual_search_source.id) ||
      !string(p.manual_search_source.label, 120) || !p.manual_search_source.label.trim())) throw new Error("Source du secours manuel invalide.");
    if (p.publications !== undefined) {
      if (!Array.isArray(p.publications) || !p.publications.length || p.publications.some(v => !/^[A-Z0-9]{1,12}$/.test(v.code) || !string(v.label, 120))) throw new Error("Publications invalides.");
      if (new Set(p.publications.map(v => v.code)).size !== p.publications.length) throw new Error("Publications dupliquées.");
    }
    if (p.reference?.canonical_host !== undefined && (p.reference.type !== "url-sha1" ||
        typeof p.reference.canonical_host !== "string" || p.reference.canonical_host.length > 253 ||
        !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(p.reference.canonical_host))) {
      throw new Error("Domaine canonique de l'empreinte invalide.");
    }
    if (!p.methods.includes("title-only")) {
      if (p.reference?.type === "url-sha1") {
        if (!/^[A-Z0-9]{1,12}$/.test(p.reference.source_code) || !/^[a-z0-9]{1,12}$/.test(p.reference.prefix)) throw new Error("Empreinte de référence invalide.");
      } else if (p.reference?.type === "id") {
        const template = p.reference.template;
        if (!string(template, 200) || !template.startsWith("news·{day}·") || !/^[a-zA-Z0-9·×{}_-]+$/.test(template) || /\{(?!(?:day|publication|id[1-9])\})/.test(template)) throw new Error("Modèle de référence invalide.");
        if ([...template.matchAll(/\{id([1-9])\}/g)].some(match => Number(match[1]) > captureCount)) throw new Error("Identifiant de référence absent du format du lien.");
        if (template.includes("{publication}") && !p.publications?.length) throw new Error("Le modèle exige une liste de publications au choix.");
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
    .sort((a, b) => (b.path_prefix?.length || 0) - (a.path_prefix?.length || 0) || Number(!!b.path_slug_terms?.length) - Number(!!a.path_slug_terms?.length));
  let slugTerms;
  const matches = [];
  for (const profile of candidates) {
    if (profile.path_slug_terms?.length) {
      try {
        slugTerms ||= decodeURIComponent(url.pathname.split("/").filter(Boolean).at(-1) || "").toLowerCase().replace(/\.[a-z0-9]+$/, "").split("-");
      } catch { return null; }
      if (!profile.path_slug_terms.some(term => slugTerms.includes(term))) continue;
    }
    if (profile.excluded_paths?.some(p => p.replace(/\/$/, "") === url.pathname.replace(/\/$/, ""))) continue;
    const captures = url.pathname.match(new RegExp(profile.path));
    if (captures) matches.push({profile, url, captures});
  }
  const first = matches[0];
  // Two lexical scopes can co-occur in one headline; never choose by list order.
  if (first?.profile.path_slug_terms?.length && matches.slice(1).some(match => match.profile.path_slug_terms?.length && match.profile.path_prefix === first.profile.path_prefix)) return null;
  return first || null;
}
