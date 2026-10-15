import {
  europresseSearchStopWords,
  europresseUrlPathNoise,
  pressreaderFrenchElisionRemainders,
  pressreaderFrenchContractedTerms,
  pressreaderSearchStopWords
} from '../../config/link-converter.js';

export function buildPressReaderQueryOptionsFromUrl(url, source) {
  const titleQuery = buildEuropresseTitleQueryFromUrl(url);
  const naturalTitleQuery = normalizeFrenchArticleQuery(titleQuery);
  const keywordQuery = buildPressReaderKeywordQueryFromUrl(url, naturalTitleQuery || titleQuery);
  const articleQueries = uniqueSearchQueries([
    keywordQuery,
    naturalTitleQuery,
    titleQuery,
  ]);

  return articleQueries.length ? articleQueries : uniqueSearchQueries([source?.title]);
}

export function buildPressReaderKeywordQueryFromUrl(url, preferredTitle) {
  const terms = preferredTitle
    ? tokenizePressReaderQuery(preferredTitle)
    : getEuropresseArticleTerms(url);
  const usefulTerms = [];

  for (const term of terms) {
    if (term.length < 3 || pressreaderSearchStopWords.has(term)) {
      continue;
    }

    if (/^\d+$/.test(term)) {
      continue;
    }

    if (!usefulTerms.includes(term)) {
      usefulTerms.push(term);
    }

    if (usefulTerms.length >= 12) {
      break;
    }
  }

  if (usefulTerms.length >= 3) {
    return usefulTerms.join(" ");
  }

  return "";
}

export function normalizeFrenchArticleQuery(value) {
  return expandFrenchArticleElisions(cleanFrenchArticleSearchText(value))
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanFrenchArticleSearchText(value) {
  return String(value ?? "")
    .replace(/[\u00ad\u200b-\u200d\u2060]/g, "")
    .replace(/[’‘`´]/g, "'")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function expandFrenchArticleElisions(value) {
  return String(value ?? "")
    .split(/\s+/)
    .map((term, index, terms) => {
      const plain = term.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      // A known verb followed by a negative adverb is safer than splitting every n+vowel.
      if (/^n((?:acced|arriv|exist|entr)(?:e|es|ent|ait|aient|era|eront)|obtient|obtiennent)$/.test(plain)
          && /^(?:pas|plus|jamais)$/i.test(terms[index + 1] || "")) {
        return `n'${term.slice(1)}`;
      }
      return expandFrenchArticleElisionTerm(term);
    })
    .join(" ");
}

export function expandFrenchArticleElisionTerm(term) {
  const cleanTerm = term.toLowerCase();
  const contracted = pressreaderFrenchContractedTerms.get(cleanTerm);

  if (contracted) {
    return contracted;
  }

  const explicitMatch = cleanTerm.match(/^([cdjlmnst])'(.+)$/i);

  if (explicitMatch) {
    return `${explicitMatch[1]}'${explicitMatch[2]}`;
  }

  const quMatch = cleanTerm.match(/^qu([aeiouyh].{1,})$/i);

  if (quMatch && pressreaderFrenchElisionRemainders.has(quMatch[1])) {
    return `qu'${quMatch[1]}`;
  }

  const singleLetterMatch = cleanTerm.match(/^([cdjlmnst])([aeiouyh].{2,})$/i);

  if (singleLetterMatch && pressreaderFrenchElisionRemainders.has(singleLetterMatch[2])) {
    return `${singleLetterMatch[1]}'${singleLetterMatch[2]}`;
  }

  return term;
}

export function tokenizePressReaderQuery(value) {
  return normalizePressReaderComparableText(value).match(/[a-z0-9]+/g) ?? [];
}

export function normalizePressReaderComparableText(value) {
  return normalizeFrenchArticleQuery(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function uniqueSearchQueries(values) {
  const queries = [];
  const seen = new Set();

  for (const value of values) {
    const query = String(value ?? "").replace(/\s+/g, " ").trim();
    const comparable = normalizePressReaderComparableText(query);

    if (!query || !comparable || seen.has(comparable)) {
      continue;
    }

    queries.push(query);
    seen.add(comparable);
  }

  return queries;
}

export function buildEuropresseTitleQueryFromUrl(url) {
  const title = getEuropresseArticleTitleFromUrl(url);
  return title || "";
}

export function buildEuropresseKeywordQueryFromUrl(url, titleOverride) {
  const title = titleOverride ?? getEuropresseArticleTitleFromUrl(url);
  const terms = title ? tokenizeEuropressePathPart(title) : getEuropresseArticleTerms(url);
  const usefulTerms = [];

  for (const term of terms) {
    if (term.length < 3 || europresseSearchStopWords.has(term)) {
      continue;
    }

    if (/^\d+$/.test(term)) {
      continue;
    }

    if (!usefulTerms.includes(term)) {
      usefulTerms.push(term);
    }

    if (usefulTerms.length >= 14) {
      break;
    }
  }

  return usefulTerms.join(" ");
}

function getZinioArticleSlug(url) {
  if (url.protocol !== "https:" || !/^(?:www\.)?zinio\.com$/i.test(url.hostname)) return null;
  const match = url.pathname.match(/^\/[a-z]{2}\/article\/[a-z0-9-]+\/[a-z0-9-]+-i\d+\/([a-z0-9-]+)-a\d+\/?$/);
  return match ? match[1] : null;
}

export function getEuropresseArticleTitleFromUrl(url) {
  // An identified article's short slug must not fall back to magazine/issue IDs.
  const zinioSlug = getZinioArticleSlug(url);
  if (zinioSlug !== null) return cleanEuropresseArticleSlug(zinioSlug);
  const pathParts = decodeURIComponent(url.pathname)
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
  const shortFranceFootballTitle = /^(?:www\.)?francefootball\.fr$/i.test(url.hostname) &&
    pathParts.length === 3 && pathParts[0].toLowerCase() === "news" &&
    /^[0-9]{6,}$/.test(pathParts[2]);
  // These publishers put a CMS identifier before the article title.
  if (/^(?:www\.)?(?:gestiondefortune|decideurs-magazine)\.com$/i.test(url.hostname) && pathParts.length) {
    const last = pathParts.length - 1;
    pathParts[last] = pathParts[last].replace(/^\d{5,}-([a-z].*\.html)$/i, '$1');
  }
  if (/^(?:www\.)?investissementconseils\.com$/i.test(url.hostname) && pathParts.length === 3 &&
      pathParts[0] === "patrimoine" && pathParts[1] === "dossiers") {
    pathParts[2] = pathParts[2].replace(/^\d{5,}-([a-z].*\.html)$/i, "$1");
  }
  if (/^(?:www\.)?(?:lavoixacadienne|moniteuracadien)\.com$/i.test(url.hostname) && pathParts.length) {
    const last = pathParts.length - 1;
    pathParts[last] = pathParts[last].replace(/^\d{4,}-([a-z].*)$/i, '$1');
  }
  if (/^(?:www\.)?pointsdevente\.fr$/i.test(url.hostname) && pathParts[0] === "fil-info" && pathParts.length === 2) {
    pathParts[1] = pathParts[1].replace(/^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])-([a-z].*)$/i, "$1");
  }
  if (/^(?:www\.)?jdrestrie\.ca$/i.test(url.hostname) && pathParts.length === 4 &&
      /^\d{4}$/.test(pathParts[0]) && /^(?:0[1-9]|1[0-2])$/.test(pathParts[1]) &&
      /^(?:0[1-9]|[12]\d|3[01])$/.test(pathParts[2])) {
    pathParts[3] = pathParts[3].replace(/(^|-)daide(?=-|$)/gi, "$1d-aide");
  }
  if (/^(?:www\.)?agefi\.fr$/i.test(url.hostname) && pathParts.length === 3 &&
      pathParts[0] === "patrimoine" && pathParts[1] === "les-metiers") {
    pathParts[2] = pathParts[2].replace(/(^|-)larc(?=-|$)/gi, "$1l-arc");
  }
  if (/^(?:www\.)?agefi\.fr$/i.test(url.hostname) && pathParts.length === 3 &&
      pathParts[0] === "cash-risk" && pathParts[1] === "actualites") {
    pathParts[2] = pathParts[2].replace(/(^|-)laffacturage(?=-|$)/gi, "$1l-affacturage");
  }
  if (/^(?:www\.)?sudinfo\.be$/i.test(url.hostname) && pathParts.length === 4 &&
      /^id\d+$/.test(pathParts[0]) && pathParts[1] === "article" &&
      /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/.test(pathParts[2])) {
    pathParts[3] = pathParts[3].replace(/(^|-)lia(?=-|$)/gi, "$1l-ia")
      .replace(/(^|-)sinstalle(?=-|$)/gi, "$1s-installe");
  }
  const candidateParts = pathParts
    .slice()
    .reverse()
    .map(part => cleanEuropresseArticleSlug(stripOpaqueArticleSuffix(part)))
    .filter(Boolean);

  for (const candidate of candidateParts) {
    const terms = tokenizeEuropressePathPart(candidate);
    const meaningfulTerms = terms.filter((term) => (
      term.length >= 3 &&
      !/^\d+$/.test(term) &&
      !europresseSearchStopWords.has(term) &&
      !europresseUrlPathNoise.has(term)
    ));

    const shortIdentifiedArticle = candidate === candidateParts[0] &&
      (/-\d{4,}\.html?$/i.test(pathParts.at(-1) || "") ||
        /^\/articles\/(?:[^/]+\/)?[^/]+\/?$/i.test(url.pathname));
    if (meaningfulTerms.length >= (shortFranceFootballTitle || shortIdentifiedArticle ? 2 : 3)) {
      return candidate;
    }
  }

  return "";
}

export function cleanEuropresseArticleSlug(value) {
  const cleanSlug = String(value ?? "")
    .replace(/\.[a-z0-9]{2,5}$/i, "")
    .replace(/-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i, "")
    .replace(/[_-]\d{4,}(?:[_-]\d+)*$/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalizeFrenchArticleQuery(cleanSlug);
}

// Search words only: retain the original URL for publisher IDs and reference hashes.
export function stripOpaqueArticleSuffix(value) {
  // A standalone CMS UUID is not a headline; the preceding segment may be one.
  if (/^(?:article[_-])?[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}(?:\.html?)?$/i.test(String(value))) return "";
  const match = String(value).match(/^(.*)[.-]([A-Z0-9]{24,40}|[a-f0-9]{32}|[a-f0-9]{40})(?:\.html?)?$/);
  if (!match || !/[0-9]/.test(match[2]) || !/[a-z]/i.test(match[2])) return value;
  const words = tokenizeEuropressePathPart(match[1]).filter(word => word.length >= 3 &&
    !/^\d+$/.test(word) && !europresseSearchStopWords.has(word) && !europresseUrlPathNoise.has(word));
  return new Set(words).size >= 3 ? match[1] : value;
}

export function getEuropresseArticleTerms(url) {
  const zinioSlug = getZinioArticleSlug(url);
  if (zinioSlug !== null) return tokenizeEuropressePathPart(zinioSlug);
  const pathParts = decodeURIComponent(url.pathname)
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
  const candidateParts = pathParts
    .slice()
    .reverse()
    .map((part) => String(stripOpaqueArticleSuffix(part)).replace(/\.[a-z0-9]{2,5}$/i, "").replace(/-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i, ""))
    .filter((part) => part && !/^\d+$/.test(part));

  for (const candidate of candidateParts) {
    const terms = tokenizeEuropressePathPart(candidate);
    const meaningfulTerms = terms.filter((term) => (
      term.length >= 3 &&
      !/^\d+$/.test(term) &&
      !europresseSearchStopWords.has(term) &&
      !europresseUrlPathNoise.has(term)
    ));

    if (meaningfulTerms.length >= 3) {
      return terms;
    }
  }

  return tokenizeEuropressePathPart(pathParts.join(" "));
}

export function tokenizeEuropressePathPart(value) {
  return normalizeFrenchArticleQuery(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .match(/[a-z0-9]+/g) ?? [];
}
