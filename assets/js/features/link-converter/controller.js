import {
  bnfProxyLoginUrl as defaultBnfProxyLoginUrl,
  equivalentHostPrefixes as defaultEquivalentHostPrefixes,
  europresseEntrypointUrl as defaultEuropresseEntrypointUrl,
  europresseProxyHost as defaultEuropresseProxyHost
} from '../../config/platforms.js';
import {bookPlatformDefinitions as defaultBookPlatformDefinitions} from '../../config/catalog.js';
import {
  converterResourcePageSize as defaultConverterResourcePageSize,
  converterResourceSearchDelayMs as defaultConverterResourceSearchDelayMs,
  converterResourcesAnimationMs as defaultConverterResourcesAnimationMs
} from '../../config/runtime.js';
import {
  logoAppearanceAttributes as defaultLogoAppearanceAttributes
} from '../../logo-appearance.js?v=2026-09-16-press-background';
import {createConverterRouting} from './routing.js';
import {createConverterDirectory} from './directory.js';

import {escapeHtml, escapeAttribute} from '../../shared/text.js';

export function createLinkConverterController({
  bnfProxyLoginUrl = defaultBnfProxyLoginUrl,
  bookPlatformDefinitions = defaultBookPlatformDefinitions,
  bookSearch,
  buildEuropresseDeepLink,
  converterResourcePageSize = defaultConverterResourcePageSize,
  converterResourceSearchDelayMs = defaultConverterResourceSearchDelayMs,
  converterResourcesAnimationMs = defaultConverterResourcesAnimationMs,
  converterResourcesClose,
  converterResourcesCount,
  converterResourcesList,
  converterResourcesModal,
  converterResourcesProviderFilter,
  converterResourcesSearch,
  equivalentHostPrefixes = defaultEquivalentHostPrefixes,
  europresseEntrypointUrl = defaultEuropresseEntrypointUrl,
  europresseProxyHost = defaultEuropresseProxyHost,
  getAccessMode,
  getFallbackLabel,
  isAlphaMode,
  isCatalogVisible,
  isPressTitleEntry,
  linkConverterFeedback,
  linkConverterForm,
  linkConverterInput,
  linkConverterResourceListOpen,
  linkConverterServices,
  loadDeferredLinkSources,
  logoAppearanceAttributes = defaultLogoAppearanceAttributes,
  matchesPassFilter,
  matchesRemoteFilter,
  openNewTab,
  playListRefreshAnimation,
  renderFilters,
  renderIcon,
  searchInput,
  searchLinkOpen,
  state,
  withTransitionParams
}) {

  function toggleLinkConverter() {
    if (!isAlphaMode()) return;
    loadDeferredLinkSources();
    searchInput.focus({ preventScroll: true });
    searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function isSearchLink(value) {
    const text = String(value ?? "").trim();
    return /^https?:\/\//i.test(text) || /^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}(?:[/:?#]|$)/i.test(text);
  }

  function syncSearchLinkAction() {
    const enabled = isAlphaMode() && isSearchLink(searchInput.value);
    searchLinkOpen.hidden = !enabled;
    searchInput.closest(".search").classList.toggle("has-link-action", enabled);
  }

  function setupLinkConverter() {
    if (!linkConverterForm || !linkConverterInput || !linkConverterFeedback || !linkConverterServices) {
      return;
    }

    setupConverterResourcesModal();

    linkConverterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!isAlphaMode() || !isSearchLink(linkConverterInput.value)) return;
      bookSearch.dismissSuggestions();
      const conversion = convertToBnfProxyUrl(linkConverterInput.value);

      if (!conversion) {
        linkConverterFeedback.textContent = `Lien non reconnu pour l’instant. Ressources prises en charge : ${getSupportedConverterLabels()}.`;
        linkConverterInput.focus();
        return;
      }

      const targetUrl = conversion.startUrl
        ? buildTransitionHref({
            title: conversion.label,
            action: "Ouverture du lien",
            start: conversion.startUrl,
            target: conversion.url,
          })
        : conversion.url;
      const openedWindow = conversion.startUrl
        ? openSessionBackedConvertedLink(conversion.startUrl, targetUrl)
        : openConvertedLink(targetUrl);

      renderLinkConverterFeedback({
        conversion,
        targetUrl,
        openedWindow,
        searchCopied: false,
      });

      if (!conversion.searchText && conversion.copyText) {
        copyTextToClipboard(conversion.copyText);
      }
    });
  }

  function renderLinkConverterFeedback({ conversion, targetUrl, openedWindow }) {
    if (conversion.provider === "source_choice") {
      linkConverterFeedback.innerHTML = `
        Plusieurs pistes ouvertes pour ${escapeHtml(conversion.sourceLabel || conversion.label)}.
        IndexPresse peut manquer certains articles ; PressReader fonctionne surtout sur site BnF.
        ${openedWindow ? "" : `Si l’ouverture est bloquée par le navigateur, <a href="${escapeAttribute(targetUrl)}" target="_blank" rel="noreferrer">ouvrir la page de choix</a>.`}
      `;
      return;
    }

    if (conversion.provider === "pressreader") {
      linkConverterFeedback.innerHTML = `
        Préparation PressReader ouverte pour ${escapeHtml(conversion.sourceLabel || conversion.label)}.
        <a href="${escapeAttribute(targetUrl)}" target="_blank" rel="noreferrer">Ouvrir la préparation PressReader</a>.
      `;
      return;
    }

    if (conversion.provider === "indexpresse_business") {
      linkConverterFeedback.innerHTML = `
        Recherche IndexPresse Business ouverte pour ${escapeHtml(conversion.sourceLabel || conversion.label)}.
        IndexPresse peut proposer une notice ou un texte intégral, mais son index n’est pas exhaustif.
        ${openedWindow ? "" : `Si l’ouverture est bloquée par le navigateur, <a href="${escapeAttribute(targetUrl)}" target="_blank" rel="noreferrer">ouvrir la recherche IndexPresse</a>.`}
      `;
      return;
    }

    if (conversion.searchText) {
      const displayedSearchText = conversion.copyText || humanizeSearchQuery(conversion.searchText);
      linkConverterFeedback.innerHTML = `
        Préparation Europresse ouverte. Essayez la recherche automatique lorsqu’elle est disponible, ou utilisez le secours manuel.
        <span class="converter-query">${escapeHtml(displayedSearchText)}</span>
        ${openedWindow ? "" : `Si l’ouverture est bloquée par le navigateur, <a href="${escapeAttribute(targetUrl)}" target="_blank" rel="noreferrer">ouvrir la préparation Europresse</a>.`}
      `;
      return;
    }

    linkConverterFeedback.innerHTML = `
      Ouverture via la BnF : ${escapeHtml(conversion.label)}.
      Si l’ouverture est bloquée par le navigateur,
      <a href="${escapeAttribute(targetUrl)}" target="_blank" rel="noreferrer">ouvrir le lien converti</a>.
    `;

    if (!openedWindow) {
      linkConverterFeedback.innerHTML = `
        Si l’ouverture est bloquée par le navigateur,
        <a href="${escapeAttribute(targetUrl)}" target="_blank" rel="noreferrer">ouvrir le lien converti</a>.
      `;
    }
  }

  async function copyTextToClipboard(text) {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Some browsers reject Clipboard API on local-network HTTP pages.
      }
    }

    return copyTextWithSelection(text);
  }

  function copyTextWithSelection(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";

    document.body.append(textarea);
    textarea.select();

    try {
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      textarea.remove();
    }
  }

  function humanizeSearchQuery(value) {
    return String(value ?? "").replace(/\s+/g, " ").trim();
  }

  function openSessionBackedConvertedLink(startUrl, transitionHref) {
    const transitionTab = openNewTab(withTransitionParams(transitionHref, {
      helper: "1",
    }));

    if (!transitionTab) {
      return null;
    }

    window.location.assign(startUrl);

    try {
      transitionTab.focus();
    } catch {
      // Focus is only a convenience; the navigation flow does not depend on it.
    }

    return transitionTab;
  }

  function openConvertedLink(url) {
    const openedWindow = window.open("about:blank", "_blank");

    if (!openedWindow) {
      return null;
    }

    try {
      openedWindow.opener = null;
    } catch {
      // The tab is already open; clearing opener is a best-effort privacy guard.
    }

    openedWindow.location.href = url;
    return openedWindow;
  }

  function renderLinkConverterServices() {
    const bookPlatforms = document.querySelector("#searchBookPlatforms");
    const renderShortcuts = (target, entries, className) => {
      target.innerHTML = entries
        .filter((rule) => {
          const resource = state.resources.find(entry => entry.id === rule.resourceId);
          return resource && isCatalogVisible(resource) && matchesPassFilter(resource)
            && matchesRemoteFilter(getAccessMode(resource));
        })
        .map((rule) => {
          const resource = state.resources.find(entry => entry.id === rule.resourceId);
          return `
        <button
          class="${className}"
          type="button"
          title="Rechercher : ${escapeAttribute(rule.label)}"
          aria-label="${escapeAttribute(rule.label)}"
          data-resource-id="${escapeAttribute(rule.resourceId)}"
        >
          <span class="quick-launch-tile${resource.icon_no_padding ? " icon-no-padding" : ""}"${logoAppearanceAttributes(resource)}>${resource.icon_url ? renderIcon(resource, true) : escapeHtml(getFallbackLabel(resource))}</span>
        </button>
        `;
        })
        .join("");

      target.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          if (!isAlphaMode()) return;
          const resource = state.resources.find(entry => entry.id === button.dataset.resourceId);
          if (resource) searchConverterResource(resource);
        });
      });
    };
    renderShortcuts(linkConverterServices, getLinkConverterServices(), "link-converter-service");
    renderShortcuts(bookPlatforms, bookPlatformDefinitions.filter(([, , , indexed = true]) => indexed)
      .map(([, resourceId, label]) => ({ resourceId, label })), "search-book-platform");
  }

  function searchConverterResource(resource) {
    state.category = isPressTitleEntry(resource) ? "Presse" : "Toutes";
    state.favoritesOnly = false;
    searchInput.value = resource.name;
    renderFilters();
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    bookSearch.dismissSuggestions();
    searchInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
  }

  const {
    closeConverterResourcesModal,
    findResourceForIndexPresseBusinessSource,
    findResourceForPressReaderSource,
    invalidateConverterResourceIndex,
    renderConverterResourceList,
    setupConverterResourcesModal
  } = createConverterDirectory({
  converterResourcePageSize,
  converterResourceSearchDelayMs,
  converterResourcesAnimationMs,
  converterResourcesClose,
  converterResourcesCount,
  converterResourcesList,
  converterResourcesModal,
  converterResourcesProviderFilter,
  converterResourcesSearch,
  getFallbackLabel: (...args) => getFallbackLabel(...args),
  getLinkConverterServices: (...args) => getLinkConverterServices(...args),
  linkConverterResourceListOpen,
  loadDeferredLinkSources: (...args) => loadDeferredLinkSources(...args),
  normalizeComparableTitle: (...args) => normalizeComparableTitle(...args),
  normalizeConverterLinkKey: (...args) => normalizeConverterLinkKey(...args),
  normalizePathPrefix: (...args) => normalizePathPrefix(...args),
  playListRefreshAnimation: (...args) => playListRefreshAnimation(...args),
  state
});

const {
  buildTransitionHref,
  convertToBnfProxyUrl,
  getLinkConverterServices,
  getSupportedConverterLabels,
  normalizeComparableTitle,
  normalizeConverterLinkKey,
  normalizePathPrefix
} = createConverterRouting({
    bnfProxyLoginUrl,
    buildEuropresseDeepLink: (...args) => buildEuropresseDeepLink(...args),
    equivalentHostPrefixes,
    europresseEntrypointUrl,
    europresseProxyHost,
    findResourceForIndexPresseBusinessSource: (...args) => findResourceForIndexPresseBusinessSource(...args),
    findResourceForPressReaderSource: (...args) => findResourceForPressReaderSource(...args),
    state
  });

  return {
    closeConverterResourcesModal: (...args) => closeConverterResourcesModal(...args),
    getLinkConverterServices: (...args) => getLinkConverterServices(...args),
    invalidateConverterResourceIndex: (...args) => invalidateConverterResourceIndex(...args),
    isSearchLink,
    renderConverterResourceList: (...args) => renderConverterResourceList(...args),
    renderLinkConverterServices,
    setupLinkConverter,
    syncSearchLinkAction,
    toggleLinkConverter,
  };
}
