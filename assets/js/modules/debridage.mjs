import defaults from "./debridage-profiles.mjs";
import {matchDebridageProfile, validateDebridageProfiles} from "./debridage-schema.mjs";
import {prepareEuropresseAutomatic, prepareEuropresseTextSearch, prepareEuropresseTitleFallback, prepareEuropresseDateAlternatives, suggestEuropresseDate, europresseTitleWords} from "./europresse-auto.mjs";

export {validateDebridageProfiles};
export const debridageProfiles = defaults;

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

export function suggestedDebridageWords(value, profile = null) {
  const words = europresseTitleWords(value);
  if (profile?.title_word_strategy === "balanced") {
    const stop = new Set(["les", "des", "une", "pour", "dans", "avec", "sur", "que", "qui", "pas", "plus", "est", "cest", "nest", "dun", "dune", "quil", "quils", "son", "ses", "cette", "cet", "mais", "alors"]);
    const distinct = words.filter(word => !stop.has(word.toLocaleLowerCase("fr")));
    return (distinct.length > 4 ? [...distinct.slice(0, 2), ...distinct.slice(-2)] : distinct).join(" ");
  }
  return words.slice(0, 6).join(" ");
}
