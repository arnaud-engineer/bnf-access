// Manual rescue only: these inputs must never feed the automatic URL resolver.
const noise = new Set("les des une pour dans avec sans sur que qui pas plus est son ses cette cet mais alors tout tous voici quand comment pourquoi aux au du et the and for with from this that are was were".split(" "));

function excerptTerms(value) {
  const tokens = String(value ?? "").normalize("NFC").match(/[\p{L}\p{N}]+/gu) || [];
  const unique = new Map();
  for (const token of tokens) {
    const key = token.toLocaleLowerCase("fr");
    if (token.length < 3 || token.length > 60 || /^\d+$/u.test(token) || noise.has(key)) continue;
    if (!unique.has(key)) unique.set(key, token);
  }
  return {terms: [...unique.values()].slice(0, 8), truncated: unique.size > 8};
}

export function prepareEuropresseManualQuery(title = "", excerpt = "") {
  if (String(title).length > 2000 || String(excerpt).length > 5000) {
    return {query: "", message: "Gardez un court fragment plutôt que l’article entier."};
  }
  const heading = excerptTerms(title);
  const body = excerptTerms(excerpt);
  if (heading.terms.length + body.terms.length < 2) {
    return {query: "", message: "Renseignez au moins deux mots significatifs dans le titre ou le texte."};
  }
  const clauses = [["TIT_HEAD", heading.terms], ["TEXT", body.terms]]
    .filter(([, terms]) => terms.length)
    .map(([field, terms]) => `${field}=(${terms.map(term => `"${term}"`).join(" et ")})`);
  return {query: clauses.join(" et "), titleTerms: heading.terms, textTerms: body.terms,
    message: heading.truncated || body.truncated ? "Les huit premiers mots significatifs de chaque champ ont été retenus. Raccourcissez l’extrait si nécessaire." : ""};
}
