import { sha1 } from "../vendor/europresse-sha1.mjs";
import profiles from "./debridage-profiles.mjs?v=profiles-sherbrooke-phrase-v1";
import {matchDebridageProfile, validateDebridageProfiles} from "./debridage-schema.mjs?v=profiles-sherbrooke-phrase-v1";
validateDebridageProfiles(profiles);

// LANG codes from Europresse's 2024 machine-language guide, not generic ISO codes.
// https://www.cision.fr/content/dam/cision-fr/espace-support/europresse---outils-de-formation/Guide_Europresse-Langage_machine2024.pdf
export const europresseLanguages = [
  ["fra", "Français"], ["eng", "Anglais"], ["de", "Allemand"],
  ["es", "Espagnol"], ["it", "Italien"],
  ["da", "Danois"], ["et", "Estonien"], ["fi", "Finnois"],
  ["is", "Islandais"], ["lv", "Letton"], ["lt", "Lituanien"],
  ["nl", "Néerlandais"], ["no", "Norvégien"], ["pt", "Portugais"],
  ["sv", "Suédois"]
];

function publicationDate(value) {
  if (typeof value !== "string") return "";
  const iso = value.length === 8
    ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}` : value;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso) || iso.startsWith("0000-")) return "";
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === iso
    ? iso.replaceAll("-", "") : "";
}

function eddKey(source, day, code, prefix) {
  const canonical = source.origin + source.pathname;
  const digest = Array.from(sha1(new TextEncoder().encode(canonical)), byte =>
    byte.toString(16).padStart(2, "0")).join("");
  return `news\u00b7${day}\u00b7${code}\u00b7edd\u00d7c${prefix}\u00d7c${day}\u00d7c${digest}`;
}

// UUIDv1 records creation time, not publication time. This is only an opt-in hint.
export function suggestEuropresseDate(value, data = profiles) {
  const matched = matchDebridageProfile(value, data);
  if (!matched?.profile.enabled || matched.profile.date_hint !== "uuid-v1") return null;
  let source;
  try { source = new URL(value); } catch { return null; }
  if (source.protocol !== "https:" || source.username || source.password || source.port ||
      !matched.profile.hosts.includes(source.hostname)) return null;
  const match = source.pathname.match(/-([a-f0-9]{8})-([a-f0-9]{4})-1([a-f0-9]{3})-[89ab][a-f0-9]{3}-[a-f0-9]{12}\/?$/);
  if (!match) return null;
  const ticks = (BigInt(`0x${match[3]}`) << 48n) |
    (BigInt(`0x${match[2]}`) << 32n) | BigInt(`0x${match[1]}`);
  const created = new Date(Number((ticks - 122192928000000000n) / 10000n));
  if (!Number.isFinite(created.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(created);
  const field = type => parts.find(part => part.type === type)?.value;
  const date = `${field("year")}-${field("month")}-${field("day")}`;
  if (!publicationDate(date)) return null;
  return { date, createdAt: created.toISOString(), basis: "uuid-v1-creation", confidence: "experimental" };
}

export function prepareEuropresseDateAlternatives(value, date, publication = "OFW", alternateDate = "", data = profiles) {
  const hint = suggestEuropresseDate(value, data);
  if (typeof date !== "string" || !publicationDate(date) || typeof alternateDate !== "string") return null;
  const otherDate = alternateDate || hint?.date;
  if (!otherDate || !publicationDate(otherDate)) return null;
  const primary = prepareEuropresseAutomatic(value, date, publication, data);
  const alternative = prepareEuropresseAutomatic(value, otherDate, publication, data);
  if (primary.state !== "ready" || alternative.state !== "ready" ||
      primary.key === alternative.key) return null;
  // The official Link route prepends NODOC= to this bounded equation (E142).
  const equation = `${primary.key} | NODOC= ${alternative.key}`;
  const login = new URL("https://bnf.idm.oclc.org/login");
  login.searchParams.set("qurl", `https://nouveau.europresse.com/Link/D000067U_1/${encodeURIComponent(equation)}`);
  const days = [publicationDate(date), publicationDate(otherDate)];
  const labels = days.map(day => `${day.slice(6, 8)}/${day.slice(4, 6)}/${day.slice(0, 4)}`);
  return {
    state: "ready", url: login.href, keys: [primary.key, alternative.key],
    dates: days,
    message: `Dates essayées : ${labels[0]} (renseignée) et ${labels[1]} (${alternateDate ? "autre date renseignée" : "création du lien"}). Europresse peut ouvrir le premier résultat ; vérifiez le titre, la publication et la date.`
  };
}

export function europresseTitleWords(value) {
  if (typeof value !== "string") return [];
  const seen = new Set();
  return (value.normalize("NFC").match(/[\p{L}\p{N}]+/gu) || []).filter(word => {
    const comparable = word.toLocaleLowerCase("fr");
    if (word.length < 3 || seen.has(comparable)) return false;
    seen.add(comparable);
    return true;
  });
}

// E154: this known reference minus itself is empty, even when the document exists.
const textSearchCarrier = "news\u00b720260924\u00b7ERP\u00b7f2d528e562e847a5bbeb585bf9c603ce";

// A terminal wildcard must remain unquoted. All other input stays literal.
function titleSearchTerms(words) {
  if (typeof words !== "string") return [];
  if (/[()|]/u.test(words)) {
    const chunks = words.normalize("NFC").trim().split(/\s+/);
    if (chunks.some(term => !/^(?:[\p{L}\p{N}]{3,60}|\([\p{L}\p{N}]{3,60}\|[\p{L}\p{N}]{3,60}\))$/u.test(term))) return [];
    return [...new Map(chunks.map(term => [term.toLocaleLowerCase("fr"), term])).values()];
  }
  if (words.includes("*")) {
    const chunks = words.normalize("NFC").trim().split(/\s+/);
    if (chunks.some(term => !/^[\p{L}\p{N}]{3,60}\*?$/u.test(term))) return [];
    if (chunks.filter(term => term.endsWith("*")).length > 1) return [];
    return [...new Map(chunks.map(term => [term.toLocaleLowerCase("fr"), term])).values()];
  }
  return europresseTitleWords(words);
}

const validTitleTerm = term => term.startsWith("(")
  ? term.slice(1, -1).split("|").every(part => part.length <= 60) : term.length <= 60;
const renderTitleTerms = terms => `TIT_HEAD=(${terms.map(original => {
  // Europresse indexes oe even when the displayed headline contains the ligature.
  const term = original.replace(/œ/g, "oe").replace(/Œ/g, "OE");
  return term.startsWith("(")
  ? `(${term.slice(1, -1).split("|").map(part => `"${part}"`).join(" ou ")})`
  : term.endsWith("*") ? term : `"${term}"`;
}).join(" et ")})`;

export function europresseManualTitleQuery(words) {
  const terms = titleSearchTerms(words);
  return terms.length >= 2 && terms.length <= 8 && terms.every(validTitleTerm)
    ? renderTitleTerms(terms) : "";
}

export function prepareEuropresseTextSearch(value, words, data = profiles) {
  const matched = matchDebridageProfile(value, data);
  if (!matched?.profile.enabled || (!matched.profile.methods.includes("title-only") && !matched.profile.title_fallback_without_reference)) return {state: "unsupported", message: "Ce format n'est pas qualifié pour la recherche textuelle sans référence."};
  const {profile, captures} = matched;
  if (profile.date.type !== "input" && profile.date.groups.length && !publicationDate(profile.date.groups.map(i => captures[i]).join("") + (profile.date.type === "month" ? "01" : ""))) return {state: "unsupported", message: "La date du lien est invalide."};
  const seriesNumber = profile.title_number_group === undefined ? "" : captures[profile.title_number_group] || "";
  if (seriesNumber && !/^[1-9][0-9]?$/.test(seriesNumber)) return {state: "needs-words", message: "Le numéro de volet du lien est invalide."};
  const result = prepareTitleTextSearch(words, seriesNumber, profile.title_query_mode);
  if (result.state !== "ready") return result;
  const caution = profile.title_fallback_without_reference
    ? "Sans date disponible, essai avec les mots du lien : vérifiez la publication dans Europresse."
    : profile.message;
  return {
    ...result, profileId: profile.id,
    message: `Recherche par titre, sans date ni référence de l'article, toutes dates et tous journaux. ${seriesNumber ? `Volet ${seriesNumber} extrait du lien. ` : ""}${caution} Europresse peut ouvrir un article voisin : vérifiez le titre, la publication et la date.`
  };
}

// Independent rescue: renew the institutional entry before transmitting title words.
export function prepareEuropresseKeywordSearch(words) {
  const result = prepareTitleTextSearch(words);
  if (result.state !== "ready") return result;
  const target = new URL(new URL(result.url).searchParams.get("qurl"));
  const entry = new URL("https://nouveau.europresse.com/access/ip/default.aspx");
  entry.searchParams.set("un", "D000067U_1");
  entry.searchParams.set("ReturnUrl", target.pathname);
  const login = new URL("https://bnf.idm.oclc.org/login");
  login.searchParams.set("qurl", entry.href);
  return {...result, url: login.href,
    message: "Recherche dans les titres, toutes dates et toutes sources. Europresse peut ouvrir le premier article : vérifiez le titre et le journal."};
}

function prepareTitleTextSearch(words, seriesNumber = "", queryMode = "") {
  const phraseMode = queryMode === "phrase";
  const phrase = typeof words === "string" ? words.normalize("NFC").trim().replace(/\s+/g, " ") : "";
  if (phraseMode && (!/^[\p{L}\p{N}]+(?: [\p{L}\p{N}]+)+$/u.test(phrase) || !/\p{L}/u.test(phrase))) {
    return {state: "needs-words", message: "Renseignez une phrase du titre, sans opérateur ni joker."};
  }
  const terms = phraseMode ? phrase.split(" ") : titleSearchTerms(words);
  // Only an opted-in, validated capture may add a short numeric title term.
  if (seriesNumber && terms.length >= 2 && !terms.includes(seriesNumber)) terms.push(seriesNumber);
  if (terms.length < (phraseMode ? 3 : 2) || terms.length > (phraseMode ? 30 : 8) || !terms.every(validTitleTerm)) {
    return { state: "needs-words", message: phraseMode ? "Renseignez une phrase du titre de 3 à 30 mots." : "Choisissez de 2 à 8 mots distinctifs du titre." };
  }
  if (terms.some(term => term.endsWith("*"))) return {
    state: "needs-words", message: "Les jokers ne sont pas qualifiés dans le lien automatique Europresse. Utilisez le copier-coller de secours ou des mots entiers."
  };
  const titleQuery = phraseMode ? `TIT_HEAD="${phrase}"` : renderTitleTerms(terms);
  const equation = `${textSearchCarrier} sans NODOC= ${textSearchCarrier} | ${titleQuery}`;
  // E158: leave a margin below the observed long-path rejection; never trim terms silently.
  if ((`/Link/D000067U_1/${equation}`).length > 240) {
    return { state: "needs-words", message: "Cette recherche est trop longue pour le lien Europresse. Gardez moins de mots distinctifs du titre." };
  }
  const login = new URL("https://bnf.idm.oclc.org/login");
  login.searchParams.set("qurl", `https://nouveau.europresse.com/Link/D000067U_1/${encodeURIComponent(equation)}`);
  return {
    state: "ready", method: "title-only", url: login.href, terms, titleQuery
  };
}

// Optional explicit criteria; never change the broad title route or infer an author.
export function prepareEuropresseRefinedTextSearch(value, words, refinements = {}, data = profiles) {
  const broad = prepareEuropresseTextSearch(value, words, data);
  if (broad.state !== "ready") return broad;
  const invalid = message => ({state: "needs-refinement", message});
  if (!refinements || typeof refinements !== "object" || Array.isArray(refinements)) {
    return invalid("Renseignez un auteur personnel ou une langue pour cet essai.");
  }
  const {author = "", language = ""} = refinements;
  if (typeof author !== "string" || typeof language !== "string") {
    return invalid("Renseignez un nom de personne et choisissez une langue.");
  }
  const name = author.normalize("NFC").trim();
  if (name.length > 100 || (name && !/^[\p{L}\p{M}\s.'\u2019-]+$/u.test(name))) {
    return invalid("Renseignez seulement le nom de l'auteur, sans opérateur de recherche.");
  }
  const names = [...new Set(name.match(/[\p{L}\p{M}]+/gu) || [])];
  if (name && (names.length < 1 || names.length > 4 || names.some(term => term.length > 40))) {
    return invalid("Gardez au maximum quatre mots du nom de l'auteur.");
  }
  if (language && !europresseLanguages.some(([code]) => code === language)) return invalid("Choisissez une langue proposée.");
  if (!names.length && !language) return invalid("Renseignez un auteur ou une langue pour cet essai.");
  const suffix = [
    names.length ? `AUT_BY=(${names.map(term => `"${term}"`).join(" et ")})` : "",
    language ? `LANG=${language}` : ""
  ].filter(Boolean).map(clause => ` et ${clause}`).join("");
  const titleQuery = broad.titleQuery + suffix;
  const equation = `${textSearchCarrier} sans NODOC= ${textSearchCarrier} | ${titleQuery}`;
  if ((`/Link/D000067U_1/${equation}`).length > 240) {
    return invalid("Cette recherche est trop longue. Gardez moins de mots du titre ou du nom de l'auteur, ou utilisez la recherche V2 sans affinage.");
  }
  return {
    ...broad, method: "title-refined", url: europresseLoginUrl(equation), titleQuery,
    message: "Essai avec les critères renseignés, toutes dates et tous journaux. Aucun résultat ? Revenez à la recherche V2 sans affinage. Vérifiez l'article ouvert."
  };
}

// E146: textual 'et' is accepted through Link; a literal '&' was not qualified.
export function prepareEuropresseTitleFallback(value, words, date = "", publication = "OFW", data = profiles) {
  if (typeof date !== "string") return { state: "needs-date", message: "Date renseignée invalide." };
  const profile = matchDebridageProfile(value, data)?.profile;
  if (profile?.title_fallback_without_reference) {
    if (date && !publicationDate(date)) return {state: "needs-date", message: "Date renseignée invalide."};
    if (profile.publications && !profile.publications.some(p => p.code === publication)) return {state: "unsupported", message: "Publication non reconnue."};
    return prepareEuropresseTextSearch(value, words, data);
  }
  const terms = titleSearchTerms(words);
  if (terms.length < 2 || terms.length > 8 || !terms.every(validTitleTerm)) {
    return { state: "needs-words", message: "Choisissez de 2 à 8 mots distinctifs du titre." };
  }
  if (terms.some(term => term.endsWith("*"))) return {
    state: "needs-words", message: "Les jokers ne sont pas qualifiés dans le lien automatique Europresse. Utilisez le copier-coller de secours ou des mots entiers."
  };
  const hint = suggestEuropresseDate(value, data);
  const candidateDate = date || hint?.date || "";
  const candidate = prepareEuropresseAutomatic(value, candidateDate, publication, data);
  if (candidate.state !== "ready") return {
    state: candidate.state,
    message: "Un candidat de référence qualifié est nécessaire pour cet essai par titre. " + candidate.message
  };
  const titleQuery = renderTitleTerms(terms);
  const equation = `${candidate.key} | ${titleQuery}`;
  const login = new URL("https://bnf.idm.oclc.org/login");
  login.searchParams.set("qurl", `https://nouveau.europresse.com/Link/D000067U_1/${encodeURIComponent(equation)}`);
  return {
    state: "ready", url: login.href, terms, titleQuery, candidateKey: candidate.key,
    usesCreationHint: !date && Boolean(hint),
    message: "Essai par titre prêt, toutes dates et tous journaux, même si une publication est choisie. Europresse peut ouvrir un article voisin ou d'un autre journal : vérifiez le titre, la publication et la date."
  };
}

// Profiles contain publisher differences; the transport and safety checks are shared.
export function prepareEuropresseAutomatic(value, date = "", publication = "OFW", data = profiles) {
  const matched = matchDebridageProfile(value, data);
  if (!matched || !matched.profile.enabled || !matched.profile.methods.includes("reference")) return {
    state: "unsupported", message: "Ce lien ne permet pas encore de construire un accès automatique fiable. La recherche par copier-coller reste disponible ci-dessous."
  };
  const {profile, url: source, captures} = matched;
  const choice = profile.publications?.find(p => p.code === publication);
  if (profile.publications && !choice) return { state: "unsupported", message: "Cette publication partenaire n'est pas encore couverte par l'essai automatique." };
  const message = text => text.replaceAll("{publication_label}", choice?.label || profile.name);
  let day = profile.date.type === "input" ? publicationDate(date)
    : publicationDate(profile.date.groups.map(i => captures[i]).join("") + (profile.date.type === "month" ? "01" : ""));
  const month = profile.date.month_groups?.map(i => captures[i]).join("");
  if (month && !publicationDate(month + "01")) return {state: "unsupported", message: "Le mois du lien est invalide."};
  if (profile.date.type === "input" && (!day || (month && !day.startsWith(month)))) return {
    state: "needs-date", profileId: profile.id, message: message(profile.date_message)
  };
  if (!day) return {state: "unsupported", message: "La date du lien est invalide."};
  let key;
  if (profile.reference.type === "url-sha1") {
    key = eddKey(source, day, profile.reference.source_code, profile.reference.prefix);
  } else {
    key = profile.reference.template.replace(/\{(day|publication|id[1-9])\}/g, (_, field) =>
      field === "day" ? day : field === "publication" ? choice.code : (captures[Number(field.slice(2))] || "").toLowerCase());
  }
  if (!/^news·[0-9]{8}·[A-Z0-9]+·[a-z0-9×-]+$/.test(key)) return { state: "unsupported", message: "La référence du lien est invalide." };
  return { state: "ready", key, url: europresseLoginUrl(key), profileId: profile.id, message: message(profile.message) };
}

function europresseLoginUrl(equation) {
  const login = new URL("https://bnf.idm.oclc.org/login");
  login.searchParams.set("qurl", `https://nouveau.europresse.com/Link/D000067U_1/${encodeURIComponent(equation)}`);
  return login.href;
}
