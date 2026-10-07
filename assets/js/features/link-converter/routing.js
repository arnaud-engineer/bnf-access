import {
  bnfProxyLoginUrl as defaultBnfProxyLoginUrl,
  equivalentHostPrefixes as defaultEquivalentHostPrefixes,
  europresseEntrypointUrl as defaultEuropresseEntrypointUrl,
  europresseProxyHost as defaultEuropresseProxyHost
} from '../../config/platforms.js';
import {
  linkConverterRules,
  europresseSearchConverterRule,
  indexpresseBusinessSearchConverterRule,
  pressreaderSearchConverterRule,
  europresseKnownDomainMappings
} from '../../config/link-converter.js';
import {
  buildEuropresseTitleQueryFromUrl,
  buildEuropresseKeywordQueryFromUrl,
  buildPressReaderQueryOptionsFromUrl
} from './article-query.js?v=elisions-v2';
import {identifyDebridage} from '../../modules/debridage.mjs';
import {indexpresseEntry} from '../../modules/indexpresse-search.mjs';

// Provider recognition and transition URLs are separate from form, feedback and modal rendering.
export function createConverterRouting({
  bnfProxyLoginUrl = defaultBnfProxyLoginUrl,
  buildEuropresseDeepLink,
  equivalentHostPrefixes = defaultEquivalentHostPrefixes,
  europresseEntrypointUrl = defaultEuropresseEntrypointUrl,
  europresseProxyHost = defaultEuropresseProxyHost,
  identifyDebridage: identifyProfile = identifyDebridage,
  findResourceForIndexPresseBusinessSource,
  findResourceForPressReaderSource,
  state
}) {
  function convertToBnfProxyUrl(rawValue) {
    const url = parseConverterUrl(rawValue);

    if (!url) {
      return null;
    }

    for (const rule of linkConverterRules) {
      for (const mapping of rule.mappings) {
        if (url.hostname === mapping.proxyHost) {
          return {
            label: rule.label,
            url: url.href,
            startUrl: rule.sessionStartUrl,
          };
        }

        if (hostMatchesAny(url.hostname, mapping.hosts)) {
          const convertedUrl = new URL(url.href);
          convertedUrl.protocol = "https:";
          convertedUrl.hostname = mapping.proxyHost;
          return {
            label: rule.label,
            url: convertedUrl.href,
            startUrl: rule.sessionStartUrl,
          };
        }
      }
    }

    const europresseConversion = buildEuropresseSearchConversion(url);
    if (europresseConversion) {
      return europresseConversion;
    }

    const indexpresseConversion = buildIndexPresseBusinessSearchConversion(url);
    const pressreaderConversion = buildPressReaderSearchConversion(url);

    if (indexpresseConversion && pressreaderConversion) {
      return buildSourceChoiceConversion({
        originalUrl: url.href,
        indexpresseConversion,
        pressreaderConversion,
      });
    }

    return indexpresseConversion || pressreaderConversion;
  }

  function getLinkConverterServices() {
    return [
      ...linkConverterRules,
      europresseSearchConverterRule,
      indexpresseBusinessSearchConverterRule,
      pressreaderSearchConverterRule,
    ];
  }

  function buildTransitionHref({ title, action, start, target }) {
    const params = new URLSearchParams({
      title,
      action,
      start,
      target,
    });

    return `./pages/transition.html?${params.toString()}`;
  }

  function getSupportedConverterLabels() {
    return getLinkConverterServices().map((rule) => rule.label).join(", ");
  }

  function parseConverterUrl(rawValue) {
    const value = String(rawValue ?? "").trim();

    if (!value) {
      return null;
    }

    const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(value)
      ? value
      : `https://${value}`;

    try {
      const url = new URL(withProtocol);
      return url.protocol === "http:" || url.protocol === "https:" ? url : null;
    } catch {
      return null;
    }
  }

  function hostMatchesAny(hostname, knownHosts = []) {
    const comparableHost = getEquivalentComparableHost(hostname);
    return knownHosts.some((knownHost) => getEquivalentComparableHost(knownHost) === comparableHost);
  }

  function getEquivalentComparableHost(hostname) {
    const parts = String(hostname ?? "")
      .toLowerCase()
      .trim()
      .replace(/\.$/, "")
      .split(".")
      .filter(Boolean);

    while (parts.length > 2 && equivalentHostPrefixes.has(parts[0])) {
      parts.shift();
    }

    return parts.join(".");
  }

  function buildEuropresseSearchConversion(url) {
    if (isInternalUrl(url) || isKnownNonEuropresseProviderUrl(url)) {
      return null;
    }

    if (url.hostname === europresseProxyHost || url.hostname === "nouveau.europresse.com") {
      return {
        label: "Europresse",
        url: buildEuropresseDeepLink(`${url.pathname}${url.search}${url.hash}`),
      };
    }

    const titleQuery = buildEuropresseTitleQueryFromUrl(url);
    const keywordQuery = buildEuropresseKeywordQueryFromUrl(url);
    const query = titleQuery || keywordQuery;

    if (!query && identifyProfile(url.href)?.enabled !== true) {
      return null;
    }

    const sourceMatch = findEuropresseSourceForUrl(url);

    if (!sourceMatch.matches.length && !sourceMatch.searchSource?.id && !sourceMatch.sourceLabel) {
      return null;
    }

    const sourceLabel = getEuropresseSourceLabel(sourceMatch);
    const matchedSourceCode = sourceMatch.matches.length === 1
      ? sourceMatch.matches[0].source_code
      : sourceMatch.sourceCodes?.length === 1
        ? sourceMatch.sourceCodes[0]
        : "";

    return {
      label: sourceLabel ? `Recherche Europresse - ${sourceLabel}` : "Recherche Europresse",
      url: buildEuropresseSearchLauncherUrl({
        query,
        sourceLabel,
        searchSource: sourceMatch.searchSource,
        sourceCode: matchedSourceCode,
        sourceCount: sourceMatch.matches.length || (sourceMatch.searchSource?.id ? 1 : 0),
        confidence: sourceMatch.confidence,
        keywordQuery,
        originalUrl: url.href,
      }),
      searchText: query,
      copyText: buildEuropresseMachineQuery(query),
    };
  }

  function buildPressReaderSearchConversion(url) {
    if (isInternalUrl(url)) {
      return null;
    }

    const source = findPressReaderSourceForUrl(url);

    if (!source) {
      return null;
    }

    const queryOptions = buildPressReaderQueryOptionsFromUrl(url, source);
    const query = queryOptions[0] || source.title;
    const keywordQuery = queryOptions.find((option) => option !== query) || "";
    const resource = findResourceForPressReaderSource(source);

    if (!query || !(source.cids ?? []).length) {
      return null;
    }

    return {
      label: `Recherche PressReader - ${source.title}`,
      provider: "pressreader",
      sourceLabel: source.title,
      iconUrl: resource?.icon_url || source.iconUrl || pressreaderSearchConverterRule.iconUrl,
      url: buildPressReaderSearchLauncherUrl({
        query,
        source,
        keywordQuery,
        queryOptions,
        originalUrl: url.href,
      }),
      searchText: query,
    };
  }

  function buildIndexPresseBusinessSearchConversion(url) {
    if (isInternalUrl(url)) {
      return null;
    }

    if (url.hostname === "business.indexpresse.fr") {
      return {
        label: "IndexPresse Business",
        provider: "indexpresse_business",
        sourceLabel: "IndexPresse Business",
        url: url.href,
        startUrl: getIndexPresseBusinessSessionStartUrl(),
      };
    }

    const source = findIndexPresseBusinessSourceForUrl(url);

    if (!source?.publicationCode) {
      return null;
    }

    const query = buildIndexPresseBusinessQueryFromUrl(url);
    const resource = findResourceForIndexPresseBusinessSource(source);
    const preparation = new URL("./pages/indexpresse-search.html", window.location.href);
    preparation.searchParams.set("from", url.href);
    preparation.searchParams.set("q", query);
    preparation.searchParams.set("publication", source.publicationCode);

    return {
      label: `Recherche IndexPresse Business - ${source.title}`,
      provider: "indexpresse_business",
      sourceLabel: source.title,
      iconUrl: source.iconUrl || resource?.icon_url || indexpresseBusinessSearchConverterRule.iconUrl,
      url: preparation.href,
      searchText: query,
    };
  }

  function buildSourceChoiceConversion({ originalUrl, indexpresseConversion, pressreaderConversion }) {
    const sourceLabel = getSharedSourceChoiceLabel(indexpresseConversion, pressreaderConversion);
    const launcherUrl = new URL("./pages/source-choice.html", window.location.href);
    const indexpresseUrl = indexpresseConversion.startUrl ? buildTransitionHref({
      title: indexpresseConversion.label,
      action: "Recherche IndexPresse Business",
      start: indexpresseConversion.startUrl,
      target: indexpresseConversion.url,
    }) : indexpresseConversion.url;

    launcherUrl.searchParams.set("title", sourceLabel);
    launcherUrl.searchParams.set("from", originalUrl);
    launcherUrl.searchParams.set("indexpresseUrl", new URL(indexpresseUrl, window.location.href).href);
    launcherUrl.searchParams.set("indexpresseSource", indexpresseConversion.sourceLabel || "IndexPresse Business");
    if (indexpresseConversion.iconUrl) {
      launcherUrl.searchParams.set("indexpresseIcon", new URL(indexpresseConversion.iconUrl, window.location.href).href);
    }
    launcherUrl.searchParams.set("pressreaderUrl", pressreaderConversion.url);
    launcherUrl.searchParams.set("pressreaderSource", pressreaderConversion.sourceLabel || "PressReader");
    if (pressreaderConversion.iconUrl) {
      launcherUrl.searchParams.set("pressreaderIcon", new URL(pressreaderConversion.iconUrl, window.location.href).href);
    }

    return {
      label: `Choix de recherche - ${sourceLabel}`,
      provider: "source_choice",
      sourceLabel,
      url: launcherUrl.href,
    };
  }

  function getSharedSourceChoiceLabel(indexpresseConversion, pressreaderConversion) {
    const labels = [
      indexpresseConversion.sourceLabel,
      pressreaderConversion.sourceLabel,
    ].filter(Boolean);
    const seenLabels = new Set();
    const uniqueLabels = labels
      .map((label) => label.trim())
      .filter((label) => {
        const key = normalizeComparableTitle(label);
        if (!label || seenLabels.has(key)) {
          return false;
        }
        seenLabels.add(key);
        return true;
      });
    return uniqueLabels.length ? uniqueLabels.join(" / ") : "ce titre";
  }

  function findPressReaderSourceForUrl(url) {
    const matchingSources = state.pressreaderLinkSources
      .filter((source) => pressReaderSourceMatchesUrl(source, url))
      .sort((a, b) => getLongestPathPrefixLength(b) - getLongestPathPrefixLength(a));

    return matchingSources[0] || null;
  }

  function findIndexPresseBusinessSourceForUrl(url) {
    const matchingSources = state.indexpresseBusinessLinkSources
      .filter((source) => indexPresseBusinessSourceMatchesUrl(source, url))
      .sort((a, b) => getLongestPathPrefixLength(b) - getLongestPathPrefixLength(a));

    return matchingSources[0] || null;
  }

  function pressReaderSourceMatchesUrl(source, url) {
    if (!hostMatchesAny(url.hostname, source.hosts ?? [])) {
      return false;
    }

    const prefixes = getPressReaderPathPrefixes(source);
    if (!prefixes.length) {
      return true;
    }

    return prefixes.some((prefix) => pathMatchesPrefix(url.pathname, prefix));
  }

  function indexPresseBusinessSourceMatchesUrl(source, url) {
    if (!hostMatchesAny(url.hostname, source.hosts ?? [])) {
      return false;
    }

    const prefixes = getPressReaderPathPrefixes(source);
    if (!prefixes.length) {
      return true;
    }

    return prefixes.some((prefix) => pathMatchesPrefix(url.pathname, prefix));
  }

  function getPressReaderPathPrefixes(source) {
    return (source.pathPrefixes ?? [])
      .map((prefix) => normalizePathPrefix(prefix))
      .filter((prefix) => prefix && prefix !== "/");
  }

  function getLongestPathPrefixLength(source) {
    return Math.max(0, ...getPressReaderPathPrefixes(source).map((prefix) => prefix.length));
  }

  function pathMatchesPrefix(pathname, prefix) {
    const normalizedPathname = normalizePathPrefix(pathname);
    const normalizedPrefix = normalizePathPrefix(prefix);

    if (!normalizedPathname || !normalizedPrefix || normalizedPrefix === "/") {
      return false;
    }

    return normalizedPathname === normalizedPrefix || normalizedPathname.startsWith(`${normalizedPrefix}/`);
  }

  function normalizePathPrefix(value) {
    const path = `/${String(value ?? "").trim().replace(/^\/+/, "")}`;
    return path.replace(/\/+$/, "") || "/";
  }

  function buildPressReaderSearchLauncherUrl({ query, source, keywordQuery, queryOptions, originalUrl }) {
    const launcherUrl = new URL("./pages/pressreader-search.html", window.location.href);
    launcherUrl.searchParams.set("q", query);
    launcherUrl.searchParams.set("cids", (source.cids ?? []).join(","));
    launcherUrl.searchParams.set("source", source.title);
    launcherUrl.searchParams.set("from", originalUrl);

    if (keywordQuery && keywordQuery !== query) {
      launcherUrl.searchParams.set("keywords", keywordQuery);
    }

    if ((queryOptions ?? []).length > 1) {
      launcherUrl.searchParams.set("queries", JSON.stringify(queryOptions));
    }

    return launcherUrl.href;
  }

  function buildEuropresseSearchLauncherUrl({ query, sourceLabel, searchSource, sourceCode, sourceCount, confidence, keywordQuery, originalUrl }) {
    const launcherUrl = new URL("./pages/europresse-search.html", window.location.href);
    launcherUrl.searchParams.set("q", query);
    launcherUrl.searchParams.set("from", originalUrl);

    if (keywordQuery && keywordQuery !== query) {
      launcherUrl.searchParams.set("keywords", keywordQuery);
    }

    if (sourceLabel) {
      launcherUrl.searchParams.set("source", sourceLabel);
    }

    if (sourceCode) {
      launcherUrl.searchParams.set("sourceCode", sourceCode);
    }

    if (searchSource?.id) {
      launcherUrl.searchParams.set("criteriaId", searchSource.id);
    }

    if (searchSource?.label) {
      launcherUrl.searchParams.set("criteriaLabel", searchSource.label);
    }

    if (sourceCount) {
      launcherUrl.searchParams.set("sourceCount", String(sourceCount));
    }

    if (confidence) {
      launcherUrl.searchParams.set("confidence", confidence);
    }

    return launcherUrl.href;
  }

  function buildIndexPresseBusinessQueryFromUrl(url) {
    return buildEuropresseTitleQueryFromUrl(url) ||
      buildEuropresseKeywordQueryFromUrl(url) ||
      url.href;
  }

  function buildEuropresseMachineQuery(value) {
    const cleanQuery = String(value ?? "").replace(/\s+/g, " ").trim();
    return cleanQuery ? `TIT_HEAD="${cleanQuery.replace(/"/g, " ")}"` : "";
  }

  function getEuropresseSessionStartUrl() {
    const loginUrl = new URL(bnfProxyLoginUrl);
    loginUrl.searchParams.set("qurl", europresseEntrypointUrl);
    return loginUrl.href;
  }

  function getIndexPresseBusinessSessionStartUrl() {
    const loginUrl = new URL(bnfProxyLoginUrl);
    loginUrl.search = new URL(indexpresseEntry).search;
    return loginUrl.href;
  }

  function findEuropresseSourceForUrl(url) {
    const resources = state.resources.filter((resource) => resource.source === "europresse_pdf");
    const profile = identifyProfile(url.href);
    const profileResource = profile && resources.find(resource => resource.id === profile.catalog_resource_id);
    const configuredMatch = profileResource
      ? {matches: [profileResource], searchSource: getEuropresseSearchSourceFromMatches([profileResource]), sourceLabel: profileResource.name, confidence: "configured-profile"}
      // Press entries load lazily; a qualified profile already identifies the journal.
      : profile ? {matches: [], searchSource: null, sourceLabel: profile.name, confidence: "configured-profile"} : null;
    // An editor override targets manual search only; it never constrains V2 title queries.
    if (profile?.manual_search_source && configuredMatch) {
      return {...configuredMatch, searchSource: profile.manual_search_source};
    }
    if (profile?.path_prefix && configuredMatch) return configuredMatch;
    const knownMapping = europresseKnownDomainMappings.find((mapping) => hostMatchesAny(url.hostname, mapping.hosts));

    if (knownMapping) {
      const sourceMatch = buildEuropresseSourceMatch(resources, knownMapping, "known-domain");

      if (sourceMatch) {
        return sourceMatch;
      }
    }

    const webSourceMapping = state.europresseWebSources.find((mapping) => hostMatchesAny(url.hostname, mapping.hosts));

    if (webSourceMapping) {
      const sourceMatch = buildEuropresseSourceMatch(resources, webSourceMapping, "verified-web-source");

      if (sourceMatch) {
        return sourceMatch;
      }
    }

    // Preserve qualified legacy source criteria; profiles fill gaps or scoped magazines.
    if (configuredMatch) return configuredMatch;
    const inferredMatches = inferEuropresseResourcesFromHost(resources, url.hostname);
    return {
      matches: inferredMatches,
      searchSource: getEuropresseSearchSourceFromMatches(inferredMatches),
      confidence: inferredMatches.length === 1 ? "inferred-domain" : inferredMatches.length > 1 ? "inferred-domain-multiple" : "generic",
    };
  }

  function buildEuropresseSourceMatch(resources, mapping, confidence) {
    const matches = findEuropresseResourcesFromMapping(resources, mapping);
    const searchSource = mapping.searchSource || getEuropresseSearchSourceFromMatches(matches);

    if (!matches.length && !searchSource?.id && !mapping.displayLabel) {
      return null;
    }

    return {
      matches,
      searchSource,
      sourceCodes: mapping.sourceCodes ?? [],
      sourceLabel: mapping.displayLabel || searchSource?.label || "",
      confidence: matches.length > 1 ? `${confidence}-multiple` : confidence,
    };
  }

  function getEuropresseSearchSourceFromMatches(matches) {
    if (matches.length !== 1) {
      return null;
    }

    const sources = matches
      .map((resource) => resource.europresse_search_source)
      .filter((source) => source?.id);
    const uniqueIds = new Set(sources.map((source) => source.id));

    return uniqueIds.size === 1 ? sources[0] : null;
  }

  function findEuropresseResourcesFromMapping(resources, mapping) {
    if (mapping.names) {
      return mapping.names
        .map((name) => resources.find((resource) => normalizeComparableTitle(resource.name) === normalizeComparableTitle(name)))
        .filter(Boolean);
    }

    if (mapping.nameStartsWith) {
      const prefix = normalizeComparableTitle(mapping.nameStartsWith);
      return resources.filter((resource) => normalizeComparableTitle(resource.name).startsWith(prefix));
    }

    return [];
  }

  function inferEuropresseResourcesFromHost(resources, hostname) {
    const hostCore = getComparableHostCore(hostname);

    if (hostCore.length < 6) {
      return [];
    }

    return resources.filter((resource) => {
      const candidates = getComparableTitleCandidates(resource.name);
      return candidates.some((candidate) => (
        candidate.length >= 6 && (hostCore.includes(candidate) || candidate.includes(hostCore))
      ));
    });
  }

  function getEuropresseSourceLabel(sourceMatch) {
    if (sourceMatch.sourceLabel) {
      return sourceMatch.sourceLabel;
    }

    if (sourceMatch.matches.length === 1) {
      return sourceMatch.matches[0].name;
    }

    if (sourceMatch.matches.length > 1) {
      const names = sourceMatch.matches.slice(0, 3).map((resource) => resource.name).join(", ");
      const suffix = sourceMatch.matches.length > 3 ? ", ..." : "";
      return `${sourceMatch.matches.length} titres possibles : ${names}${suffix}`;
    }

    return "";
  }

  function getComparableHostCore(hostname) {
    const host = hostname
      .toLowerCase()
      .replace(/^www\./, "")
      .replace(/^m\./, "");
    const parts = host.split(".");

    return normalizeComparableTitle(parts.length > 2 ? parts.slice(0, -2).join(" ") : parts[0]);
  }

  function getComparableTitleCandidates(title) {
    const base = normalizeComparableTitle(title.replace(/\([^)]*\)/g, " "));
    const withoutLeadingArticle = base.replace(/^(le|la|les|l)/, "");
    const beforeSeparator = normalizeComparableTitle(title.split(/\s[-/]\s/)[0] ?? title);

    return [...new Set([base, withoutLeadingArticle, beforeSeparator].filter(Boolean))];
  }

  function normalizeComparableTitle(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/&/g, "et")
      .replace(/[^a-z0-9]/g, "");
  }

  function normalizeConverterLinkKey(value) {
    return String(value ?? "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("fr")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function isInternalUrl(url) {
    return url.hostname === window.location.hostname || url.hostname.endsWith(".local");
  }

  function isKnownNonEuropresseProviderUrl(url) {
    const hosts = [
      "bnf.idm.oclc.org",
      "login.bnf.idm.oclc.org",
      "www.pressreader.com",
      "www-pressreader-com.bnf.idm.oclc.org",
      "business.indexpresse.fr",
    ];

    return hostMatchesAny(url.hostname, hosts);
  }

  return {
    buildTransitionHref,
    convertToBnfProxyUrl,
    getLinkConverterServices,
    getSupportedConverterLabels,
    normalizeComparableTitle,
    normalizeConverterLinkKey,
    normalizePathPrefix
  };
}
