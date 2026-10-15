import defaults from "./debridage-profiles.mjs?v=public-date-v1";
import {buildEuropresseTitleQueryFromUrl, buildEuropresseKeywordQueryFromUrl, cleanEuropresseArticleSlug} from "../features/link-converter/article-query.js?v=uuid-filenames-v1";
import {arbitrateEuropresseUrlWords} from "./europresse-url-elisions.mjs?v=guarded-elisions-ligatures-v1";
import {matchDebridageProfile, validateDebridageProfiles} from "./debridage-schema.mjs?v=public-date-v1";
import {prepareEuropresseAutomatic, prepareEuropresseTextSearch, prepareEuropresseTitleFallback, prepareEuropresseDateAlternatives, suggestEuropresseDate, europresseTitleWords} from "./europresse-auto.mjs?v=canonical-hash-host-v1";

export {validateDebridageProfiles};
export const debridageProfiles = defaults;

export function debridageMethodLabel(profile, method = profile?.methods?.[0]) {
  if (method === "reference" && profile?.public_date_metadata) return "Référence calculée depuis l’URL et la date publique";
  if (method === "reference") return profile?.reference?.type === "url-sha1"
    ? "Référence calculée depuis l’URL" : "Référence issue de l’identifiant du lien";
  if (method === "reference-title" && profile?.title_fallback_without_reference) return "Recherche par titre sans référence";
  if (method === "title-only" && profile?.title_query_mode === "phrase") return "Recherche par phrase du lien";
  return {"title-only": "Recherche par titre", "reference-title": "Référence ou recherche par titre",
    "date-alternatives": "Références sur deux dates"}[method] || "Méthode non configurée";
}

export function debridageMethodSummary(profile) {
  if (!profile?.enabled) return "V2 inactive";
  const [primary, ...fallbacks] = profile.methods;
  return debridageMethodLabel(profile, primary) + (fallbacks.length
    ? " · Secours : " + fallbacks.map(method => debridageMethodLabel(profile, method)).join(" / ") : "")
    + (profile.title_fallback_without_reference ? " · Sans date : recherche par titre" : "")
    + (profile.title_number_group ? " · Numéro de volet extrait de l’URL" : "");
}

export function identifyDebridage(value, data = defaults) {
  const match = matchDebridageProfile(value, data);
  return match?.profile || null;
}

export function prepareDebridage(value, options = {}, data = defaults) {
  const profile = identifyDebridage(value, data);
  if (!profile || !profile.enabled) return {state: "unsupported", message: profile?.message || "Recherche automatique non activée pour ce format de lien. Utilisez le secours manuel."};
  const method = options.method || profile.methods[0];
  if (!profile.methods.includes(method)) return {state: "unsupported", message: "Cette méthode n'est pas activée pour ce titre."};
  const date = options.date ?? "";
  const publication = options.publication ?? profile.publications?.[0]?.code ?? "OFW";
  const handlers = {
    reference: () => prepareEuropresseAutomatic(value, date, publication, data),
    "title-only": () => prepareEuropresseTextSearch(value, options.words ?? "", data),
    "reference-title": () => prepareEuropresseTitleFallback(value, options.words ?? "", date, publication, data),
    "date-alternatives": () => prepareEuropresseDateAlternatives(value, date, publication, options.alternateDate ?? "", data),
  };
  let result = handlers[method]();
  let selectedMethod = method;
  // A missing day can select an opted-in title route before navigation, not retry results.
  if (!options.method && !date && result?.state === "needs-date" && profile.title_fallback_without_reference) {
    result = handlers["reference-title"]();
    selectedMethod = "reference-title";
  }
  return {...(result || {state: "needs-date", message: "Renseignez deux dates distinctes et valides pour cet essai."}), profileId: profile.id, method: selectedMethod};
}

export function debridageDateHint(value, data = defaults) {
  return suggestEuropresseDate(value, data);
}

// Initial automatic criteria must come only from the submitted URL.
export function debridageUrlOptions(value, data = defaults) {
  const url = new URL(value);
  const profile = identifyDebridage(value, data);
  const rawTitle = debridageRawUrlTitle(url, profile);
  const title = stripDebridageUrlPrefix(rawTitle, profile);
  // A sparse terminal article slug must not borrow words from its category folders.
  const sparseArticleSlug = !rawTitle && /\/[^/]*[\p{L}][^/]*-\d{4,}(?:\.html?)?\/?$/u.test(url.pathname);
  const keywords = (rawTitle && !title) || sparseArticleSlug ? "" : buildEuropresseKeywordQueryFromUrl(url, title);
  const opaqueOnlyPath = /\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/?$/i.test(url.pathname);
  // Some article URLs expose a category filename rather than their title.
  let ignoredSlug = false;
  if (profile?.title_url_ignored_slugs?.length) {
    const terminalSlug = decodeURIComponent(url.pathname.split("/").filter(Boolean).at(-1) || "").replace(/\.html?$/i, "")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    ignoredSlug = profile.title_url_ignored_slugs.includes(terminalSlug);
  }
  // The prefix was already removed before stop words and token limits; never strip twice.
  let words = profile?.requires_title_input || opaqueOnlyPath || ignoredSlug ? "" : suggestedDebridageWords(keywords || title, profile, {stripPrefix: false});
  // An explicit phrase recipe keeps the lexical slug intact, including stop words.
  if (profile?.title_query_mode === "phrase") return {words: profile.requires_title_input || opaqueOnlyPath || ignoredSlug ? "" : title};
  const usesTitle = profile?.enabled && profile.methods.some(method => method === "title-only" || method === "reference-title");
  if (usesTitle) {
    const terminalSlug = decodeURIComponent(url.pathname.split("/").filter(Boolean).at(-1) || "").replace(/[-_]+/g, " ");
    words = arbitrateEuropresseUrlWords(terminalSlug, words, {allowUnknown: false}).words;
  }
  // Fit generated defaults only; manually edited criteria keep the explicit length guard.
  if (usesTitle) {
    let prepared = prepareDebridage(value, {words}, data);
    let terms = words.split(/\s+/).filter(Boolean);
    while (terms.length > 2 && prepared.state === "needs-words" && prepared.message.includes("trop longue")) {
      terms.pop();
      words = terms.join(" ");
      prepared = prepareDebridage(value, {words}, data);
    }
    const terminalSlug = decodeURIComponent(url.pathname.split("/").filter(Boolean).at(-1) || "").replace(/[-_]+/g, " ");
    const expanded = arbitrateEuropresseUrlWords(terminalSlug, words, {allowUnknown: true}).words;
    if (expanded !== words) {
      const candidate = prepareDebridage(value, {words: expanded}, data);
      // Never drop another anchor to make room for an uncertain elision.
      if (candidate.state === "ready" && candidate.url
        && decodeURIComponent(new URL(new URL(candidate.url).searchParams.get("qurl")).pathname).length <= 240) words = expanded;
    }
  }
  return {words};
}

function debridageRawUrlTitle(url, profile) {
  const title = buildEuropresseTitleQueryFromUrl(url);
  return title || (profile?.title_url_unmatched_prefix_words
    ? cleanEuropresseArticleSlug(decodeURIComponent(url.pathname).split('/').filter(Boolean).at(-1) || '') : '');
}

export function stripDebridageUrlPrefix(value, profile = null) {
  if ((!profile?.title_url_prefixes?.length && !profile?.title_url_unmatched_prefix_words) || typeof value !== "string") return value;
  const tokens = [...value.matchAll(/[\p{L}\p{N}]+/gu)];
  const comparable = tokens.map(token => token[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/œ/g, "oe").toLowerCase());
  const candidates = (profile.title_url_prefixes || []).map(prefix => prefix.split("-"))
    .sort((a, b) => b.length - a.length);
  const prefix = candidates.find(parts => parts.every((part, i) => comparable[i] === part));
  if (!prefix) {
    const count = profile.title_url_unmatched_prefix_words || 0;
    if (!count) return value;
    let consumed = 0;
    let words = 0;
    while (consumed < tokens.length && words < count) {
      if ((tokens[consumed][0].match(/\p{L}/gu) || []).length >= 3) words++;
      consumed++;
    }
    return value.slice(tokens[consumed]?.index ?? value.length).trim();
  }
  const remainder = value.slice(tokens[prefix.length]?.index ?? value.length).trim();
  // A matched long prefix must not fall back to a shorter one when the title is sparse.
  return europresseTitleWords(remainder).length >= 3 ? remainder : value;
}

export function debridageUrlPrefixSummary(value, profile = null) {
  if (!profile?.title_url_prefixes?.length && !profile?.title_url_unmatched_prefix_words) return "";
  const title = debridageRawUrlTitle(new URL(value), profile);
  const cleaned = stripDebridageUrlPrefix(title, profile);
  const removed = cleaned !== title ? title.slice(0, title.length - cleaned.length).trim() : "";
  const words = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/œ/g, "oe").toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
  const matched = (profile.title_url_prefixes || []).some(prefix => prefix.split("-").every((part, i) => words[i] === part));
  const fallback = profile.title_url_unmatched_prefix_words ? ` · Sans correspondance JSON : retrait de ${profile.title_url_unmatched_prefix_words} mots (au moins 3 lettres)` : "";
  return `Filtre de préfixes d’URL actif : ${profile.title_url_prefixes?.length || 0} préfixes configurés${fallback} · ` +
    (removed ? `${matched ? 'Préfixe retiré des mots-clés' : 'Retrait heuristique des mots-clés'} : « ${removed} ».` : "Aucun préfixe retiré pour ce lien.");
}

export function suggestedDebridageWords(value, profile = null, {stripPrefix = true} = {}) {
  if (stripPrefix) value = stripDebridageUrlPrefix(value, profile);
  if (profile?.title_word_strategy === "editorial") {
    const normalized = String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’‘]/g, "'").toLowerCase();
    // Promotional prefixes may be absent from the archived headline.
    const core = normalized.replace(/\bchef[\s'-]+d[\s'-]*(?:oeuvre|œuvre)\b/g, " ")
      .replace(/\bdonne\s+[\d\s]+fois\s+en\s+\d{4}\b/g, " ");
    const stop = new Set(["les", "des", "une", "pour", "dans", "avec", "sur", "que", "qui", "pas", "plus", "est", "cest", "nest", "dun", "dune", "quil", "quils", "son", "ses", "cette", "cet", "mais", "alors", "tout", "tous", "vous", "notre", "votre", "note", "top", "compte", "numero", "seulement"]);
    const distinct = europresseTitleWords(core).filter(word => !stop.has(word) && !/^\d+$/.test(word));
    if (distinct.length >= 3) return (distinct.length > 4 ? [...distinct.slice(0, 2), ...distinct.slice(-2)] : distinct).join(" ");
    // Do not reduce a sparse title to one generic keyword.
    return europresseTitleWords(value).slice(0, 6).join(" ");
  }
  const words = europresseTitleWords(value);
  if (profile?.title_word_strategy === "long-anchors") {
    const longer = words.filter(word => [...word].length >= 7 && /\p{L}/u.test(word));
    return (longer.length >= 2 ? [longer[0], longer.at(-1)] : words.slice(0, 6)).join(" ");
  }
  if (profile?.title_word_strategy === "long-words") {
    const longer = words.filter(word => [...word].length >= 7);
    return (longer.length >= 3 ? longer.slice(0, 4) : words.slice(0, 6)).join(" ");
  }
  if (profile?.title_word_strategy === "concise") return words.slice(0, 3).join(" ");
  if (profile?.title_word_strategy === "first-four") return words.slice(0, 4).join(" ");
  if (profile?.title_word_strategy === "balanced") {
    const stop = new Set(["les", "des", "une", "pour", "dans", "avec", "sur", "que", "qui", "pas", "plus", "est", "cest", "nest", "dun", "dune", "quil", "quils", "son", "ses", "cette", "cet", "mais", "alors"]);
    const distinct = words.filter(word => !stop.has(word.toLocaleLowerCase("fr")));
    return (distinct.length > 4 ? [...distinct.slice(0, 2), ...distinct.slice(-2)] : distinct).join(" ");
  }
  return words.slice(0, 6).join(" ");
}
