// The BnF entry expects a literal target URL, as in its official resource menu.
export const indexpresseEntry = "https://bnf.idm.oclc.org/login?url=https://indexpresse.vercel.app/fr";

export function buildIndexpresseSearch({ query, publication, exact = false }) {
  const words = String(query || "").trim();
  if (!words || words.length > 500 || !/^[A-Z0-9_-]{1,24}$/.test(publication || "")) return null;
  const url = new URL("https://business.indexpresse.fr/results");
  url.searchParams.set("query", words);
  url.searchParams.set("publication", publication);
  url.searchParams.set("publicationMode", "AND");
  if (exact) url.searchParams.set("exact", "true");
  return url.href;
}

function articleIdentity(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
    return `${url.hostname.replace(/^www\./, '')}${url.pathname.replace(/\/$/, '')}`;
  } catch { return null; }
}

export function resolveIndexpresseDestination({ query, originalQuery, publication, from, registry }) {
  const search = buildIndexpresseSearch({ query, publication });
  if (!search) return null;
  const identity = articleIdentity(from);
  // Edited criteria invalidate a correspondence established for the original article.
  const matches = identity && String(query).trim() === String(originalQuery).trim()
    && registry?.version === 1 && Array.isArray(registry.matches)
    ? registry.matches.filter(item => item?.verified === true
      && item.publication === publication && articleIdentity(item.sourceUrl) === identity
      && /^[0-9A-HJKMNP-TV-Z]{26}$/.test(item.documentRef || '')
      && ['article', 'dossier'].includes(item.kind)) : [];
  if (matches.length !== 1) return { kind: 'results', url: search };
  const match = matches[0];
  const url = new URL('https://business.indexpresse.fr/results');
  url.searchParams.set('doc', match.documentRef);
  return { kind: match.kind, url: url.href };
}
