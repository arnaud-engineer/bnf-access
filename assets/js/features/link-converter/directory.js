import {
  converterResourcePageSize as defaultConverterResourcePageSize,
  converterResourceSearchDelayMs as defaultConverterResourceSearchDelayMs,
  converterResourcesAnimationMs as defaultConverterResourcesAnimationMs
} from '../../config/runtime.js';
import {normalize, escapeAttribute, escapeHtml} from '../../shared/text.js';
import {
  europresseSearchConverterRule,
  indexpresseBusinessSearchConverterRule,
  pressreaderSearchConverterRule,
  europresseKnownDomainMappings
} from '../../config/link-converter.js';

// Searchable link-provider directory; conversion and navigation remain outside this modal.
export function createConverterDirectory({
  converterResourcePageSize = defaultConverterResourcePageSize,
  converterResourceSearchDelayMs = defaultConverterResourceSearchDelayMs,
  converterResourcesAnimationMs = defaultConverterResourcesAnimationMs,
  converterResourcesClose,
  converterResourcesCount,
  converterResourcesList,
  converterResourcesModal,
  converterResourcesProviderFilter,
  converterResourcesSearch,
  getFallbackLabel,
  getLinkConverterServices,
  linkConverterResourceListOpen,
  loadDeferredLinkSources,
  normalizeComparableTitle,
  normalizeConverterLinkKey,
  normalizePathPrefix,
  playListRefreshAnimation,
  state
}) {
  let converterResourcesCloseTimer = 0;

  function setupConverterResourcesModal() {
    if (
      !linkConverterResourceListOpen ||
      !converterResourcesModal ||
      !converterResourcesClose ||
      !converterResourcesSearch ||
      !converterResourcesProviderFilter ||
      !converterResourcesCount ||
      !converterResourcesList
    ) {
      return;
    }

    linkConverterResourceListOpen.addEventListener("click", openConverterResourcesModal);
    converterResourcesClose.addEventListener("click", closeConverterResourcesModal);
    converterResourcesSearch.addEventListener("input", scheduleConverterResourceSearch);
    converterResourcesSearch.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        renderConverterResourceListImmediately();
      }
    });
    converterResourcesProviderFilter.addEventListener("change", renderConverterResourceListImmediately);
    converterResourcesList.addEventListener("click", (event) => {
      if (!event.target.closest("[data-converter-show-more]")) return;
      state.converterResourceVisibleLimit += converterResourcePageSize;
      renderConverterResourceList();
    });
    converterResourcesModal.addEventListener("click", (event) => {
      if (event.target === converterResourcesModal) {
        closeConverterResourcesModal();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (!converterResourcesModal.hidden && event.key === "Escape") {
        closeConverterResourcesModal();
      }
    });
  }

  function openConverterResourcesModal() {
    window.clearTimeout(converterResourcesCloseTimer);
    converterResourcesModal.hidden = false;
    converterResourcesModal.classList.remove("is-closing");
    document.body.classList.add("has-modal");
    converterResourcesSearch.value = "";
    converterResourcesProviderFilter.value = "all";
    state.converterResourceVisibleLimit = converterResourcePageSize;
    renderConverterResourceList();
    loadDeferredLinkSources();
    window.requestAnimationFrame(() => {
      converterResourcesModal.classList.add("is-open");
    });
  }

  function closeConverterResourcesModal() {
    if (converterResourcesModal.hidden) {
      return;
    }

    converterResourcesModal.classList.remove("is-open");
    converterResourcesModal.classList.add("is-closing");
    document.body.classList.remove("has-modal");
    converterResourcesCloseTimer = window.setTimeout(() => {
      converterResourcesModal.hidden = true;
      converterResourcesModal.classList.remove("is-closing");
      linkConverterResourceListOpen.focus({ preventScroll: true });
    }, converterResourcesAnimationMs);
  }

  function renderConverterResourceList() {
    const query = normalize(converterResourcesSearch.value);
    const providerFilter = converterResourcesProviderFilter.value;
    const entries = getConverterResourceEntries();
    const publishedEntries = entries.filter((entry) => (
      entry.directoryVisible &&
      (providerFilter === "all" || entry.providerGroup === providerFilter) &&
      (!query || entry.searchText.includes(query))
    ));
    const secondaryMode = Boolean(query) && publishedEntries.length === 0;
    const matchingEntries = secondaryMode
      ? entries.filter((entry) => (
          entry.secondarySearchVisible
          && (providerFilter === "all" || entry.providerGroup === providerFilter)
          && entry.searchText.includes(query)
        ))
      : publishedEntries;
    const shownEntries = query
      ? matchingEntries.slice(0, state.converterResourceVisibleLimit)
      : matchingEntries;
    const remaining = matchingEntries.length - shownEntries.length;

    converterResourcesList.setAttribute("aria-busy", "false");
    converterResourcesCount.textContent = secondaryMode
      ? `${matchingEntries.length} correspondance${matchingEntries.length > 1 ? "s" : ""} possible${matchingEntries.length > 1 ? "s" : ""}`
      : `${matchingEntries.length} ressource${matchingEntries.length > 1 ? "s" : ""} vérifiée${matchingEntries.length > 1 ? "s" : ""}`;

    const secondaryIntroduction = secondaryMode && matchingEntries.length
      ? `<div class="converter-resources-secondary-intro">
          <strong>Aucune ressource vérifiée dans l’annuaire.</strong>
          <span>Le débrideur reconnaît néanmoins les correspondances possibles suivantes.</span>
        </div>`
      : "";
    const emptyMessage = query
      ? "Aucune ressource trouvée."
      : "Aucune ressource vérifiée dans cette sélection.";
    const showMoreButton = remaining > 0
      ? `<button class="converter-resources-show-more" type="button" data-converter-show-more>
          Afficher 50 résultats supplémentaires <span>${remaining} restant${remaining > 1 ? "s" : ""}</span>
        </button>`
      : "";

    converterResourcesList.innerHTML = matchingEntries.length
      ? `${secondaryIntroduction}${shownEntries.map((entry) => renderConverterResourceEntry(entry, secondaryMode)).join("")}${showMoreButton}`
      : `<p class="converter-resources-empty">${emptyMessage}</p>`;
    playListRefreshAnimation(converterResourcesList);
  }

  function scheduleConverterResourceSearch() {
    window.clearTimeout(state.converterResourceSearchTimer);
    state.converterResourceSearchRevision += 1;
    state.converterResourceVisibleLimit = converterResourcePageSize;
    const revision = state.converterResourceSearchRevision;

    if (!converterResourcesSearch.value.trim()) {
      renderConverterResourceList();
      return;
    }

    converterResourcesList.setAttribute("aria-busy", "true");
    converterResourcesCount.textContent = "Recherche…";
    state.converterResourceSearchTimer = window.setTimeout(() => {
      if (revision !== state.converterResourceSearchRevision) return;
      renderConverterResourceList();
    }, converterResourceSearchDelayMs);
  }

  function renderConverterResourceListImmediately() {
    window.clearTimeout(state.converterResourceSearchTimer);
    state.converterResourceSearchRevision += 1;
    state.converterResourceVisibleLimit = converterResourcePageSize;
    renderConverterResourceList();
  }

  function invalidateConverterResourceIndex() {
    state.converterResourceIndex = null;
  }

  function getConverterResourceEntries() {
    if (state.converterResourceIndex) return state.converterResourceIndex;
    const entries = [];

    for (const rule of getLinkConverterServices()) {
      const isSearchGateway = [
        europresseSearchConverterRule.label,
        indexpresseBusinessSearchConverterRule.label,
        pressreaderSearchConverterRule.label,
      ].includes(rule.label);
      entries.push({
        id: `direct:${rule.label}`,
        reviewId: ({
          "Alternatives économiques": "converter-link:direct:alternatives-economiques",
          "Arrêt sur images": "converter-link:direct:arret-sur-images",
          Mediapart: "converter-link:direct:mediapart",
          Europresse: "converter-link:direct:europresse",
          "IndexPresse Business": "converter-link:direct:indexpresse-business",
          PressReader: "converter-link:direct:pressreader",
        })[rule.label],
        name: rule.label,
        provider: isSearchGateway ? "Recherche générale" : "Accès direct",
        providerGroup: rule.label === pressreaderSearchConverterRule.label
          ? "pressreader"
          : rule.label === europresseSearchConverterRule.label
            ? "europresse"
            : rule.label === indexpresseBusinessSearchConverterRule.label
              ? "indexpresse"
              : "direct",
        iconUrl: rule.iconUrl || "",
        hosts: getHostsFromLinkRule(rule),
        searchLabel: "",
        sortName: rule.label,
      });
    }

    const seenEuropresseSources = new Set();
    const mappings = [...europresseKnownDomainMappings, ...state.europresseWebSources];

    for (const mapping of mappings) {
      const sourceId = mapping.searchSource?.id || "";
      const name = getEuropresseMappingDisplayName(mapping);
      const dedupeKey = sourceId ? `source:${sourceId}` : `name:${normalizeConverterLinkKey(name)}`;

      if (!name || seenEuropresseSources.has(dedupeKey)) {
        continue;
      }

      seenEuropresseSources.add(dedupeKey);

      const resource = findResourceForEuropresseMapping(mapping);
      entries.push({
        id: `europresse:${dedupeKey}`,
        reviewId: `converter-link:europresse:${dedupeKey}`,
        name,
        provider: "Europresse",
        providerGroup: "europresse",
        iconUrl: resource?.icon_url || europresseSearchConverterRule.iconUrl,
        hosts: mapping.hosts ?? [],
        websiteUrl: mapping.websiteUrl || "",
        searchLabel: mapping.searchSource?.label || "",
        sortName: name,
      });
    }

    const seenPressReaderSources = new Set();

    for (const source of state.pressreaderLinkSources) {
      const cids = source.cids ?? [];
      const dedupeKey = cids.length ? `cid:${cids.join("|")}` : `name:${normalizeConverterLinkKey(source.title)}`;

      if (!source.title || seenPressReaderSources.has(dedupeKey)) {
        continue;
      }

      seenPressReaderSources.add(dedupeKey);

      const resource = findResourceForPressReaderSource(source);
      entries.push({
        id: `pressreader:${dedupeKey}`,
        reviewId: `converter-link:pressreader:${dedupeKey}`,
        name: source.title,
        provider: "PressReader",
        providerGroup: "pressreader",
        iconUrl: resource?.icon_url || pressreaderSearchConverterRule.iconUrl,
        hosts: source.hosts ?? [],
        pathPrefixes: source.pathPrefixes ?? [],
        websiteUrl: source.websiteUrl || "",
        searchLabel: cids.length ? `CID ${cids.join(", ")}` : "",
        sortName: source.title,
      });
    }

    const seenIndexPresseSources = new Set();

    for (const source of state.indexpresseBusinessLinkSources) {
      const code = source.publicationCode || "";
      const dedupeKey = code ? `publication:${code}` : `name:${normalizeConverterLinkKey(source.title)}`;

      if (!source.title || seenIndexPresseSources.has(dedupeKey)) {
        continue;
      }

      seenIndexPresseSources.add(dedupeKey);

      const resource = findResourceForIndexPresseBusinessSource(source);
      entries.push({
        id: `indexpresse:${dedupeKey}`,
        reviewId: `converter-link:indexpresse:${dedupeKey}`,
        name: source.title,
        provider: "IndexPresse Business",
        providerGroup: "indexpresse",
        iconUrl: source.iconUrl || resource?.icon_url || indexpresseBusinessSearchConverterRule.iconUrl,
        hosts: source.hosts ?? [],
        pathPrefixes: source.pathPrefixes ?? [],
        websiteUrl: source.websiteUrl || "",
        searchLabel: code ? `Publication ${code}` : "",
        sortName: source.title,
      });
    }

    state.converterResourceIndex = entries
      .map((entry) => {
        const settings = state.linkDirectorySettings[entry.reviewId] ?? {};
        const displayName = String(settings.display_name || "").trim();
        const prepared = displayName
          ? { ...entry, name: displayName, sortName: displayName, searchAliases: [entry.name] }
          : entry;
        const reviewStatus = String(settings.review_status || "");
        const accessModel = String(settings.access_model || "");
        const directoryVisible = settings.directory_visible === true;
        return {
          ...prepared,
          reviewStatus,
          accessModel,
          directoryVisible,
          secondarySearchVisible: !directoryVisible
            && !["correction", "unavailable", "no_website", "ignore"].includes(reviewStatus),
          secondaryLabel: getConverterSecondaryAccessLabel(accessModel),
          searchText: normalize(`${prepared.name} ${prepared.searchAliases?.join(" ") || ""} ${prepared.provider} ${prepared.hosts.join(" ")} ${prepared.searchLabel}`),
        };
      })
      .sort((a, b) => a.sortName.localeCompare(b.sortName, "fr", { sensitivity: "base" }));
    return state.converterResourceIndex;
  }

  function getConverterSecondaryAccessLabel(accessModel) {
    if (accessModel === "free") return "Gratuit";
    if (["mixed", "paid"].includes(accessModel)) return "Payant";
    return "";
  }

  function renderConverterResourceEntry(entry, secondaryMode = false) {
    const websiteUrl = getConverterResourceWebsiteUrl(entry);
    const content = `
      <span class="converter-resource-logo">
        ${entry.iconUrl
          ? `<img src="${escapeAttribute(entry.iconUrl)}" alt="" loading="lazy" decoding="async">`
          : `<span aria-hidden="true">${escapeHtml(getFallbackLabel({ name: entry.name }))}</span>`}
      </span>
      <span class="converter-resource-text">
        <strong>${escapeHtml(entry.name)}</strong>
        <span class="converter-resource-meta">
          <small>${escapeHtml(entry.provider)}</small>
          ${secondaryMode && entry.secondaryLabel
            ? `<span class="converter-resource-status" data-status="${entry.secondaryLabel === "Gratuit" ? "free" : "paid"}">${escapeHtml(entry.secondaryLabel)}</span>`
            : ""}
        </span>
      </span>
    `;

    if (!websiteUrl) {
      return `<article class="converter-resource-item">${content}</article>`;
    }

    const label = secondaryMode
      ? `Ouvrir le site proposé de ${entry.name}`
      : `Ouvrir le site officiel de ${entry.name}`;
    return `
      <a class="converter-resource-item" href="${escapeAttribute(websiteUrl)}" target="_blank" rel="noreferrer" aria-label="${escapeAttribute(label)}" title="${escapeAttribute(label)}">
        ${content}
      </a>
    `;
  }

  function getConverterResourceWebsiteUrl(entry) {
    if (entry.websiteUrl) {
      try {
        const url = new URL(entry.websiteUrl);
        if (["http:", "https:"].includes(url.protocol) && url.hostname.includes(".")) {
          return url.href;
        }
      } catch {
        // Fall back to the converter matching rules below.
      }
    }

    const host = getPrimaryConverterResourceHost(entry.hosts);

    if (!host) {
      return "";
    }

    try {
      const candidate = /^https?:\/\//i.test(host) ? host : `https://${host}`;
      const url = new URL(candidate);

      if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".")) {
        return "";
      }

      const pathPrefix = getPrimaryConverterResourcePathPrefix(entry.pathPrefixes);
      if (pathPrefix) {
        url.pathname = pathPrefix;
      }

      return url.href;
    } catch {
      return "";
    }
  }

  function getPrimaryConverterResourcePathPrefix(pathPrefixes) {
    if (!Array.isArray(pathPrefixes)) {
      return "";
    }

    for (const pathPrefix of pathPrefixes) {
      const value = normalizePathPrefix(pathPrefix);

      if (value && value !== "/") {
        return value;
      }
    }

    return "";
  }

  function getPrimaryConverterResourceHost(hosts) {
    if (!Array.isArray(hosts)) {
      return "";
    }

    for (const host of hosts) {
      const value = String(host ?? "").trim().replace(/^\*\./, "");

      if (value) {
        return value;
      }
    }

    return "";
  }

  function getHostsFromLinkRule(rule) {
    return (rule.mappings ?? []).flatMap((mapping) => mapping.hosts ?? []);
  }

  function getEuropresseMappingDisplayName(mapping) {
    if (mapping.displayLabel) {
      return mapping.displayLabel;
    }

    if (mapping.names?.length) {
      return mapping.names[0];
    }

    return mapping.searchSource?.label || "";
  }

  function findResourceForEuropresseMapping(mapping) {
    const resources = state.resources.filter((resource) => resource.source === "europresse_pdf");
    const sourceCodes = new Set(mapping.sourceCodes ?? []);

    if (sourceCodes.size) {
      const bySourceCode = resources.find((resource) => sourceCodes.has(resource.source_code));

      if (bySourceCode) {
        return bySourceCode;
      }
    }

    if (mapping.searchSource?.id) {
      const bySearchSource = resources.find((resource) => resource.europresse_search_source?.id === mapping.searchSource.id);

      if (bySearchSource) {
        return bySearchSource;
      }
    }

    for (const name of mapping.names ?? []) {
      const byName = resources.find((resource) => normalizeComparableTitle(resource.name) === normalizeComparableTitle(name));

      if (byName) {
        return byName;
      }
    }

    return null;
  }

  function findResourceForPressReaderSource(source) {
    const cids = new Set(source.cids ?? []);
    const resourceIds = new Set(source.resourceIds ?? []);
    return state.resources.find((resource) => (
      resource.source === "pressreader" &&
      (
        cids.has(resource.pressreader_cid) ||
        resourceIds.has(resource.id)
      )
    )) || null;
  }

  function findResourceForIndexPresseBusinessSource(source) {
    const publicationCode = source.publicationCode || "";
    return state.resources.find((resource) => (
      resource.source === "indexpresse_business" &&
      resource.indexpresse_publication_code === publicationCode
    )) || null;
  }

  return {
    closeConverterResourcesModal,
    findResourceForIndexPresseBusinessSource,
    findResourceForPressReaderSource,
    invalidateConverterResourceIndex,
    renderConverterResourceList,
    setupConverterResourcesModal
  };
}
