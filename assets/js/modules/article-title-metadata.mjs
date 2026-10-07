import {suggestedDebridageWords, identifyDebridage, debridageUrlOptions, prepareDebridage} from "./debridage.mjs?v=profiles-mesures-entretiens-v1";
import {prepareEuropresseKeywordSearch} from "./europresse-auto.mjs?v=profiles-mesures-entretiens-v1";
import {validateMetadataQueryIdentity} from "./debridage-schema.mjs?v=profiles-mesures-entretiens-v1";

const endpoint = "https://api.microlink.io/";
const maximumBytes = 128 * 1024;

function publicArticleUrl(value, queryIdentity, canonical = false) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.port || url.hash ||
      !url.hostname.includes(".") || /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(url.hostname) ||
      url.hostname.includes(":")) throw new Error("Lien public HTTPS sans paramètres de session requis.");
  if (queryIdentity) {
    validateMetadataQueryIdentity(queryIdentity);
    const keys = [...url.searchParams.keys()];
    const allowed = [queryIdentity.parameter, ...(canonical ? queryIdentity.canonical_extra_parameters : [])];
    if (!/^\d{1,12}$/.test(url.searchParams.get(queryIdentity.parameter) || "") ||
        new Set(keys).size !== keys.length || keys.some(key => !allowed.includes(key)) ||
        keys.some(key => key !== queryIdentity.parameter && !/^\d{1,4}(?:\.\d{1,4}){0,8}$/.test(url.searchParams.get(key)))) {
      throw new Error("Parametres non publics ou identifiant invalide.");
    }
  } else if (url.search) throw new Error("Parametres non autorises.");
  return url;
}

export function metadataTitleWords(title, profile) {
  return suggestedDebridageWords(title, profile, {stripPrefix: false});
}

export function needsArticleTitleMetadata(profile, derived) {
  return profile?.enabled === true && !derived.words?.trim();
}

function quotaHeaders(headers) {
  const number = name => {
    const raw = headers.get(name);
    return raw !== null && /^\d+$/.test(raw) ? Number(raw) : null;
  };
  return {limit: number("x-rate-limit-limit"), remaining: number("x-rate-limit-remaining"),
    reset: number("x-rate-limit-reset")};
}

async function smallJson(response) {
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximumBytes) throw new Error("Réponse trop volumineuse.");
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

// Keep only public title/provenance/quota, never publisher headers or cookies.
export async function retrieveArticleTitle(value, {fetchImpl = globalThis.fetch, timeoutMs = 8000, queryIdentity} = {}) {
  let source;
  try { source = publicArticleUrl(value, queryIdentity); }
  catch { return {state: "unavailable", message: "Lien non admissible pour la récupération de métadonnées."}; }
  const request = new URL(endpoint);
  request.searchParams.set("url", source.href);
  request.searchParams.set("filter", "title,url");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let quota;
  try {
    const response = await fetchImpl(request.href, {signal: controller.signal, credentials: "omit", referrerPolicy: "no-referrer"});
    quota = quotaHeaders(response.headers);
    if (response.status === 429) return {state: "quota", quota, message: "Quota Microlink atteint. Aucun titre récupéré."};
    if (!response.ok) return {state: "unavailable", quota, message: `Microlink indisponible (HTTP ${response.status}).`};
    const payload = await smallJson(response);
    const title = typeof payload.data?.title === "string" ? payload.data.title.trim() : "";
    const target = publicArticleUrl(payload.data?.url, queryIdentity, true);
    const samePath = target.pathname.replace(/\/$/, "") === source.pathname.replace(/\/$/, "");
    const identity = target.hostname === source.hostname && (queryIdentity
      ? target.searchParams.get(queryIdentity.parameter) === source.searchParams.get(queryIdentity.parameter) &&
        (samePath || target.pathname === queryIdentity.canonical_path)
      : samePath);
    const blocked = /security verification|access denied|just a moment|captcha|verify (?:you|your)|sign[ -]?in|log[ -]?in|connexion|page not found|403 forbidden|404 not found/i.test(title);
    if (payload.status !== "success" || !identity || blocked || title.length < 8 || title.length > 500 ||
        (payload.statusCode != null && payload.statusCode !== 200)) {
      return {state: "unavailable", quota, message: "Aucun titre d’article fiable récupéré par Microlink."};
    }
    return {state: "ready", provider: "Microlink", sourceUrl: source.href, title, quota};
  } catch {
    return {state: "unavailable", quota, message: controller.signal.aborted
      ? "Microlink n’a pas répondu à temps." : "Titre non récupéré (réseau ou réponse inexploitable)."};
  } finally { clearTimeout(timer); }
}

export function createArticleTitleResolver(retrieve = retrieveArticleTitle) {
  const cache = new Map();
  let exhaustedUntil = 0;
  return (value, options = {}) => {
    const key = value + "\n" + JSON.stringify(options.queryIdentity || null);
    if (cache.has(key)) return cache.get(key);
    if (Date.now() < exhaustedUntil) return Promise.resolve({state: "quota", message: "Quota Microlink atteint ; récupération suspendue."});
    const pending = retrieve(value, options).then(result => {
      if (result.state === "quota" || result.quota?.remaining === 0) {
        exhaustedUntil = result.quota?.reset ? result.quota.reset * 1000 : Date.now() + 86400000;
      }
      return result;
    });
    cache.set(key, pending);
    // Bound memory while retaining failed attempts to avoid automatic retry loops.
    if (cache.size > 100) cache.delete(cache.keys().next().value);
    return pending;
  };
}

const resolveTitle = createArticleTitleResolver();

export function prepareMetadataSearch(value, metadata, data) {
  if (metadata?.state !== "ready") return null;
  const profile = identifyDebridage(value, data);
  if (!needsArticleTitleMetadata(profile, debridageUrlOptions(value, data)) ||
      metadata?.state !== "ready" || metadata.sourceUrl !== new URL(value).href) return null;
  const words = metadataTitleWords(metadata.title, profile);
  return {...prepareEuropresseKeywordSearch(words), words, metadata, profileId: profile.id, provenance: "microlink"};
}

export async function prepareAutomaticArticleSearch(value, options = {}, data, retrieve = resolveTitle) {
  const profile = identifyDebridage(value, data);
  const derived = debridageUrlOptions(value, data);
  const initial = prepareDebridage(value, {...derived, ...options}, data);
  // Existing references and explicit user criteria always take precedence.
  if (initial.state === "ready" || !needsArticleTitleMetadata(profile, derived) || options.words?.trim()) return initial;
  const metadata = await retrieve(value, {queryIdentity: profile.metadata_query_identity});
  const enriched = prepareMetadataSearch(value, metadata, data);
  return enriched?.state === "ready" ? enriched : {...initial, metadata,
    message: metadata.state === "ready" ? "Le titre récupéré ne fournit pas assez de mots-clés." : metadata.message};
}
