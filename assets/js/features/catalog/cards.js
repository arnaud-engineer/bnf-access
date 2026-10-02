import {
  accessLabels as defaultAccessLabels,
  accessModeClasses as defaultAccessModeClasses,
  hiddenCategoryBadges as defaultHiddenCategoryBadges,
  pressTitleSourceFilters as defaultPressTitleSourceFilters
} from '../../config/catalog.js';
import {escapeHtml, escapeAttribute} from '../../shared/text.js';
import {logoAppearanceAttributes} from '../../logo-appearance.js?v=2026-09-16-press-background';
import {hydrateThemedSvgIcons} from '../../catalog-icons.js?v=2026-09-14-white-themed-svg';

// Card markup and badges; access and navigation decisions remain injected.
export function createCatalogCards({
  accessLabels = defaultAccessLabels,
  accessModeClasses = defaultAccessModeClasses,
  getAccessMode,
  getAccessModeLabel,
  getAccessModeTitle,
  getPressTitleSourceFilterId,
  getPressTitleSourceFilterIds,
  getProviderLabel,
  getResourceTaxonomyBadges,
  grid,
  hiddenCategoryBadges = defaultHiddenCategoryBadges,
  isPressTitleEntry,
  isReviewLogo,
  layoutPressTitleCategoryBadges,
  pressTitleSourceFilters = defaultPressTitleSourceFilters,
  render,
  renderActions,
  renderFilters,
  renderLanguageBadges,
  renderPassBadge,
  renderPressTitleCountryBadge,
  renderPressTitleEditorialBadges,
  renderPressTitleLanguageBadges,
  renderPressTitleLocalRegionBadges,
  renderPressTitlePopularBadge,
  renderPressTitleRecommendedBadge,
  shouldShowPressTitleSection,
  state,
  toggleCountryNote,
  toggleFavorite,
  toggleLanguageNote,
  togglePassNote,
  togglePressPopularityNote,
  togglePressRecommendationNote,
  toggleRegionNote,
  updateEditionSelection
}) {
  function shouldShowPressTitleProviderBadge(resource, context) {
    const label = getProviderLabel(resource);
    return context === "title" && !isActivePressTitleSourceBadge(resource, label, context);
  }

  function shouldShowSecondaryCategoryBadge(resource, category, context) {
    return !isTitleSourceCategoryBadge(category, context)
      && !isRedundantPressCategoryBadge(category)
      && !isActivePressTitleSourceBadge(resource, category, context);
  }

  function isTitleSourceCategoryBadge(category, context) {
    return context !== "title"
      && pressTitleSourceFilters.some((filter) => filter.id !== "all" && filter.label === category);
  }

  function isRedundantPressCategoryBadge(category) {
    return category === "Presse" && shouldShowPressTitleSection();
  }

  function isActivePressTitleSourceBadge(resource, category, context) {
    if (!shouldShowPressTitleSection() || state.pressTitleSourceFilter === "all") {
      return false;
    }

    if (context !== "title") {
      return false;
    }

    if (!isPressTitleEntry(resource)) {
      return false;
    }

    const activeFilter = pressTitleSourceFilters.find((filter) => filter.id === state.pressTitleSourceFilter);
    if (!activeFilter || activeFilter.id === "all") {
      return false;
    }

    return getPressTitleSourceFilterIds(resource).includes(activeFilter.id)
      && category === activeFilter.label;
  }

  function createCard(resource, eagerLogo = false, options = {}) {
    const card = document.createElement("article");
    const context = options.context ?? "resource";
    const hasAccessInstruction = Boolean(resource.access_instruction?.text?.trim());
    const hasEditorialNotice = Boolean(resource.editorial_notice?.text?.trim());
    const hasCardNotice = hasAccessInstruction || hasEditorialNotice;
    const hasEditionOptions = Array.isArray(resource.edition_options) && resource.edition_options.length > 0;
    const cardClasses = [
      "card",
      context === "title" ? "press-title-card" : "resource-card",
      hasAccessInstruction ? "has-access-instruction" : "",
      hasEditorialNotice ? "has-editorial-notice" : "",
      hasCardNotice ? "has-card-notice" : "",
      hasEditionOptions ? "has-edition-options" : "",
    ].filter(Boolean);
    card.className = cardClasses.join(" ");
    card.dataset.resourceId = resource.id;

    const access = (resource.access ?? []).map((item) => accessLabels[item] ?? item);
    const accessMode = getAccessMode(resource);
    const accessModeLabel = getAccessModeLabel(resource);
    const accessModeClass = accessModeClasses[accessMode] ?? "onsite";
    const accessModeTitle = getAccessModeTitle(resource);
    const isFavorite = state.favorites.has(resource.id);
    const logo = resource.icon_url
      ? renderIcon(resource, eagerLogo)
      : `<span>${escapeHtml(getFallbackLabel(resource))}</span>`;
    const description = resource.description?.trim();
    const officialDescription = context === "resource"
      ? [...new Set((resource.bnf_official?.entries ?? []).map((entry) => entry.description?.trim()).filter(Boolean))].join("\n\n")
      : "";
    const hasOfficialDescription = Boolean(officialDescription && officialDescription !== description);
    const showingOfficialDescription = hasOfficialDescription && state.officialDescriptionResources.has(resource.id);
    const activeDescription = showingOfficialDescription ? officialDescription : description;
    const descriptionToggleHtml = hasOfficialDescription
      ? `<button class="description-toggle" type="button" aria-pressed="${String(showingOfficialDescription)}" aria-label="${showingOfficialDescription ? "Afficher la description courte" : "Afficher la description officielle BnF"} — ${escapeAttribute(resource.name)}" title="${showingOfficialDescription ? "Description courte" : "Description officielle BnF"}">${showingOfficialDescription ? "[-]" : "[+]"}</button>`
      : "";
    const descriptionHtml = activeDescription
      ? `<p class="description${showingOfficialDescription ? " is-official" : ""}"><span class="description-text">${showingOfficialDescription ? '<strong class="official-description-label">Description BnF :</strong> ' : ""}${escapeHtml(activeDescription)}</span>${descriptionToggleHtml}</p>`
      : `<p class="description pending"><span class="description-text">Description à renseigner.</span></p>`;
    const accessInstructionHtml = renderAccessInstruction(resource);
    const editorialNoticeHtml = renderEditorialNotice(resource);
    const noticesHtml = accessInstructionHtml || editorialNoticeHtml
      ? `<div class="card-notices">${accessInstructionHtml}${editorialNoticeHtml}</div>`
      : "";
    const pressTitleProviderId = getPressTitleSourceFilterId(resource);
    const categoryBadgeHtml = shouldShowPressTitleProviderBadge(resource, context)
      ? `<span class="badge category press-provider-badge source-${escapeAttribute(pressTitleProviderId)}"><span class="entry-source-dot" aria-hidden="true"></span>${escapeHtml(getProviderLabel(resource))}</span>`
      : "";
    const resourceTaxonomyBadges = context === "resource" && options.showTaxonomyBadges !== false
      ? getResourceTaxonomyBadges(resource)
      : [];
    const secondaryCategoryBadges = resourceTaxonomyBadges
      .filter(({ label }) => !hiddenCategoryBadges.has(label))
      .filter(({ label }) => shouldShowSecondaryCategoryBadge(resource, label, context))
      .map(({ title, rootId, rootLabel, targetId, targetLabel }) => `<button class="badge category taxonomy-badge-link" type="button" title="${escapeAttribute(title)}" aria-label="Ouvrir ${escapeAttribute(title)}" data-taxonomy-root="${escapeAttribute(rootId)}" data-taxonomy-target="${escapeAttribute(targetId)}"><span class="taxonomy-badge-segment taxonomy-badge-root" data-taxonomy-root-segment>${escapeHtml(rootLabel)}</span>${targetLabel ? `<span class="taxonomy-badge-chevron" aria-hidden="true"> › </span><span class="taxonomy-badge-segment taxonomy-badge-target">${escapeHtml(targetLabel)}</span>` : ""}</button>`)
      .join("");
    const resourceTaxonomySeparator = resourceTaxonomyBadges.length
      ? '<span class="badge-separator" aria-hidden="true">|</span>'
      : "";
    const compactProfileLabels = {
      "Pass Lecture/Culture": "Pass Culture",
      "Pass Recherche illimité": "Pass Recherche",
    };
    const compactProfileBadges = state.passFilter === "all"
      ? access.map((label) => renderPassBadge(label, compactProfileLabels[label] ?? label)).join("")
      : "";
    const languageBadges = context === "title" ? "" : renderLanguageBadges(resource);
    const accessModeBadge = `<span class="badge ${accessModeClass}" title="${escapeAttribute(accessModeTitle)}" aria-label="${escapeAttribute(accessModeTitle)}">${escapeHtml(accessModeLabel)}</span>`;
    const structuredResourceBadges = `
      <span class="badge-row badge-row-taxonomy">${categoryBadgeHtml}${secondaryCategoryBadges}${resourceTaxonomyBadges.length && languageBadges ? resourceTaxonomySeparator : ""}${languageBadges}</span>
      <span class="badge-row badge-row-passes">${compactProfileBadges}</span>
      <span class="badge-row badge-row-access">${state.remoteFilter === "all" ? accessModeBadge : ""}</span>
    `;
    const pressTitleLocaleBadges = context === "title"
      ? `${renderPressTitleCountryBadge(resource)}${renderPressTitleLocalRegionBadges(resource)}${renderPressTitleLanguageBadges(resource)}`
      : "";
    const pressTitleAccoladeBadges = context === "title"
      ? `${resource.recommended ? renderPressTitleRecommendedBadge(resource) : ""}${state.popularPressTitleIds.has(resource.id) ? renderPressTitlePopularBadge(resource) : ""}`
      : "";
    const pressTitlePrimaryGroups = [categoryBadgeHtml, pressTitleLocaleBadges, pressTitleAccoladeBadges].filter(Boolean);
    const pressTitlePrimaryBadges = pressTitlePrimaryGroups
      .map((group, index) => index === 0
        ? group
        : `<span class="badge-group">${group}</span>`)
      .join("");
    const structuredPressTitleBadges = `
      <span class="badge-row badge-row-press-metadata">${pressTitlePrimaryBadges}</span>
      <span class="badge-row badge-row-press-categories" data-press-categories>${context === "title" ? renderPressTitleEditorialBadges(resource) : ""}<button class="badge press-category-overflow" type="button" hidden></button></span>
      <span class="badge-row badge-row-passes">${compactProfileBadges}</span>
      <span class="badge-row badge-row-access">${state.remoteFilter === "all" ? accessModeBadge : ""}</span>
    `;
    const badgesHtml = context === "resource"
      ? structuredResourceBadges
      : structuredPressTitleBadges;

    card.innerHTML = `
      <div class="card-header">
        <div class="logo ${resource.icon_url ? "" : "generated"} ${isReviewLogo(resource) ? "cover-logo" : ""} ${resource.icon_no_padding ? "icon-no-padding" : ""}"${logoAppearanceAttributes(resource)}>
          ${logo}
        </div>
        <h3>${escapeHtml(resource.name)}</h3>
        <button
          class="favorite-button"
          type="button"
          aria-pressed="${String(isFavorite)}"
          aria-label="${isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}"
          title="${isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}"
          data-resource-id="${escapeAttribute(resource.id)}"
        >
          <span aria-hidden="true">${isFavorite ? "★" : "☆"}</span>
        </button>
      </div>
      <div class="card-copy">
        ${descriptionHtml}
        ${noticesHtml}
      </div>
      <div class="card-actions">
        ${renderActions(resource)}
      </div>
      <div class="badges is-structured">
        ${badgesHtml}
      </div>
    `;

    card.querySelector(".favorite-button").addEventListener("click", () => {
      toggleFavorite(resource.id);
    });

    card.querySelectorAll(".taxonomy-badge-link").forEach((badge) => {
      const openTaxonomy = (targetId) => {
        state.category = badge.dataset.taxonomyRoot;
        state.favoritesOnly = false;
        renderFilters();
        render();
        requestAnimationFrame(() => {
          const sectionId = `resource-taxonomy-${targetId}`;
          const target = targetId === badge.dataset.taxonomyRoot
            ? grid
            : document.getElementById(sectionId)
              ?? [...document.querySelectorAll('[id^="resource-taxonomy-"]')]
                .find((section) => section.id.startsWith(`${sectionId}__`));
          target?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      };
      badge.addEventListener("click", () => openTaxonomy(badge.dataset.taxonomyTarget));
      badge.querySelector("[data-taxonomy-root-segment]")?.addEventListener("click", (event) => {
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        event.stopPropagation();
        openTaxonomy(badge.dataset.taxonomyRoot);
      });
    });

    const pressCategoryRow = card.querySelector("[data-press-categories]");
    const pressCategoryOverflow = card.querySelector(".press-category-overflow");
    if (pressCategoryRow && pressCategoryOverflow) {
      pressCategoryOverflow.addEventListener("click", () => {
        const expanded = pressCategoryRow.dataset.expanded !== "true";
        pressCategoryRow.dataset.expanded = String(expanded);
        layoutPressTitleCategoryBadges(card);
      });
      requestAnimationFrame(() => layoutPressTitleCategoryBadges(card));
    }

    card.querySelector("[data-action-disclosure]")?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      const disclosure = card.querySelector(`#${CSS.escape(button.getAttribute("aria-controls"))}`);
      const expanded = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(expanded));
      button.title = expanded ? "Masquer les options supplémentaires" : button.dataset.collapsedTitle;
      button.setAttribute("aria-label", button.title);
      button.classList.toggle("is-expanded", expanded);
      disclosure.hidden = !expanded;
    });

    card.querySelectorAll("[data-collapsible-notice]").forEach((notice) => {
      const button = notice.querySelector("[data-collapsible-notice-toggle]");
      const toggleNotice = () => {
        const expanded = notice.dataset.expanded !== "true";
        notice.dataset.expanded = String(expanded);
        button.title = expanded ? "Réduire le texte" : "Afficher le texte complet";
        button.setAttribute("aria-label", button.title);
        button.setAttribute("aria-expanded", String(expanded));
        button.classList.toggle("is-expanded", expanded);
      };
      notice.addEventListener("click", (event) => {
        if (event.target.closest("a")) return;
        toggleNotice();
      });
    });

    card.querySelector("[data-popularity-note-resource-id]")?.addEventListener("click", () => {
      togglePressPopularityNote(resource);
    });
    card.querySelector("[data-recommendation-note-resource-id]")?.addEventListener("click", () => {
      togglePressRecommendationNote(resource);
    });
    card.querySelectorAll("[data-pass-note-id]").forEach((badge) => {
      badge.addEventListener("click", () => togglePassNote(badge.dataset.passNoteId));
    });
    card.querySelectorAll("[data-language-note-resource-id]").forEach((badge) => {
      badge.addEventListener("click", () => toggleLanguageNote(resource));
    });
    card.querySelector("[data-country-note-resource-id]")?.addEventListener("click", () => {
      toggleCountryNote(resource);
    });
    card.querySelectorAll("[data-region-note-resource-id]").forEach((badge) => {
      badge.addEventListener("click", () => toggleRegionNote(resource));
    });

    card.querySelector(".description-toggle")?.addEventListener("click", () => {
      const showOfficialDescription = !state.officialDescriptionResources.has(resource.id);
      if (showOfficialDescription) {
        state.officialDescriptionResources.add(resource.id);
      } else {
        state.officialDescriptionResources.delete(resource.id);
      }
      const replacement = createCard(resource, eagerLogo, options);
      replacement.querySelector(".card-copy")?.classList.add(
        showOfficialDescription ? "description-copy-expanding" : "description-copy-collapsing",
      );
      card.replaceWith(replacement);
    });

    card.querySelectorAll("[data-edition-resource-id]").forEach((select) => {
      select.addEventListener("change", (event) => {
        updateEditionSelection(resource, event.target.value, card);
      });
    });

    return card;
  }

  function renderAccessInstruction(resource) {
    const instruction = resource.access_instruction;
    const text = instruction?.text?.trim();

    if (!text) {
      return "";
    }

    const links = (instruction.links ?? [])
      .filter((link) => link?.url && link?.label)
      .map((link) => `<a href="${escapeAttribute(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`)
      .join(" · ");
    const linksHtml = links ? ` ${links}` : "";

    return `
      <div class="collapsible-card-notice access-instruction" data-collapsible-notice data-expanded="false">
        <div class="collapsible-card-notice-heading">
          <strong>${escapeHtml(getAccessModeLabel(resource))}</strong>
          <button class="collapsible-card-notice-toggle" type="button" title="Afficher le texte complet" aria-label="Afficher le texte complet" aria-expanded="false" data-collapsible-notice-toggle><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"/></svg></button>
        </div>
        <div class="collapsible-card-notice-content" data-collapsible-notice-content>
          <p>${escapeHtml(text)}${linksHtml}</p>
        </div>
      </div>
    `;
  }

  function renderEditorialNotice(resource) {
    const notice = resource.editorial_notice;
    const text = notice?.text?.trim();
    if (!text) return "";
    const level = notice.level === "warning" ? "warning" : "context";
    const label = level === "warning" ? "Avertissement éditorial" : "Contexte éditorial";
    const icon = level === "warning"
      ? '<span class="editorial-notice-icon" aria-hidden="true">⚠</span>'
      : "";

    const sources = (notice.sources ?? [])
      .filter((source) => source?.url)
      .map((source, index) => {
        const number = index + 1;
        const label = source.label || `Source ${number}`;
        return `<sup><a href="${escapeAttribute(source.url)}" target="_blank" rel="noreferrer" title="${escapeAttribute(label)}" aria-label="${escapeAttribute(`Source ${number} : ${label}`)}">[${number}]</a></sup>`;
      })
      .join("");

    return `
      <div class="collapsible-card-notice editorial-notice editorial-notice-${level}" data-collapsible-notice data-expanded="false">
        <div class="collapsible-card-notice-heading">
          <strong>${icon}${escapeHtml(label)}</strong>
          <button class="collapsible-card-notice-toggle" type="button" title="Afficher le texte complet" aria-label="Afficher le texte complet" aria-expanded="false" data-collapsible-notice-toggle><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"/></svg></button>
        </div>
        <div class="collapsible-card-notice-content" data-collapsible-notice-content>
          <p>${escapeHtml(text)}${sources ? ` <span class="editorial-notice-sources">${sources}</span>` : ""}</p>
        </div>
      </div>
    `;
  }

  function renderIcon(resource, eager = false) {
    const image = `<img src="${escapeAttribute(resource.icon_url)}" alt="" aria-hidden="true" loading="${eager ? "eager" : "lazy"}" decoding="async"${eager ? ' fetchpriority="high"' : ""}>`;
    if (/^#[0-9a-f]{6}$/i.test(resource.icon_background_color ?? "") && /\.svg$/i.test(resource.icon_url)) {
      queueMicrotask(() => hydrateThemedSvgIcons());
      return `<span class="themed-svg-icon" data-icon-src="${escapeAttribute(resource.icon_url)}" data-icon-color="${escapeAttribute(resource.icon_background_color)}">${image}</span>`;
    }
    return image;
  }

  function getFallbackLabel(resource) {
    if (resource.fallback_label) return resource.fallback_label;
    return resource.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }

  return {
    createCard,
    getFallbackLabel,
    renderIcon
  };
}
