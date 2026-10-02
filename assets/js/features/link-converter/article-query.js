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
    .map(expandFrenchArticleElisionTerm)
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

export function buildEuropresseKeywordQueryFromUrl(url) {
  const terms = getEuropresseArticleTerms(url);
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

export function getEuropresseArticleTitleFromUrl(url) {
  const pathParts = decodeURIComponent(url.pathname)
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
  const candidateParts = pathParts
    .slice()
    .reverse()
    .map(cleanEuropresseArticleSlug)
    .filter(Boolean);

  for (const candidate of candidateParts) {
    const terms = tokenizeEuropressePathPart(candidate);
    const meaningfulTerms = terms.filter((term) => (
      term.length >= 3 &&
      !/^\d+$/.test(term) &&
      !europresseSearchStopWords.has(term) &&
      !europresseUrlPathNoise.has(term)
    ));

    if (meaningfulTerms.length >= 3) {
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

export function getEuropresseArticleTerms(url) {
  const pathParts = decodeURIComponent(url.pathname)
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
  const candidateParts = pathParts
    .slice()
    .reverse()
    .map((part) => part.replace(/\.[a-z0-9]{2,5}$/i, "").replace(/-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i, ""))
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
