import {
  escapeAttribute as defaultEscapeAttribute,
  escapeHtml as defaultEscapeHtml,
  capitalize as defaultCapitalize
} from '../../shared/text.js';
import {
  bnfPassPricingUrl as defaultBnfPassPricingUrl,
  bnfPassSubscriptionUrl as defaultBnfPassSubscriptionUrl
} from '../../config/platforms.js';
import {compactLanguageCodes as defaultCompactLanguageCodes} from '../../config/catalog.js';
export function createCatalogContextNotes({
  getResourceLanguageCodes,
  escapeAttribute = defaultEscapeAttribute,
  escapeHtml = defaultEscapeHtml,
  pressPopularityNote,
  state,
  pressPopularityNoteDetails,
  getAccessModeTitle,
  bnfPassPricingUrl = defaultBnfPassPricingUrl,
  bnfPassSubscriptionUrl = defaultBnfPassSubscriptionUrl,
  closeAlphaModeNote,
  pressPopularityNoteTitle,
  jumpToSearchDock,
  alphaModeNote,
  getResourceCategories,
  normalizeLanguageCode,
  capitalize = defaultCapitalize,
  compactLanguageCodes = defaultCompactLanguageCodes
}) {
  let pressPopularityNoteCloseTimer = null;
  let pressTitleCategoryLayoutFrame = null;
  function renderLanguageBadges(resource) {
    const languageData = resource.content_languages;
    const codes = getResourceLanguageCodes(resource);

    if (codes.length === 0) {
      if (!languageData || (languageData.scope !== "multilingual" && languageData.scope !== "very_multilingual")) {
        return "";
      }

      const title = [
        getLanguageSummaryLabel(languageData),
        resource.language_public_note_validated ? resource.language_public_note : "",
      ].filter(Boolean).join(" - ");

      return renderLanguageBadgeButton(resource, "MULTI", title);
    }

    if (codes.length > 3) {
      const title = `Langues : ${codes.map(formatLanguageTooltipItem).join(", ")}`;
      return renderLanguageBadgeButton(resource, "MULTI", title);
    }

    return codes
      .map((code) => renderLanguageBadgeButton(resource, formatLanguageBadgeText(code), formatLanguageTooltipItem(code)))
      .join("");
  }

  function renderLanguageBadgeButton(resource, text, title) {
    const expanded = isContextNoteOpen(resource.id, "language");
    return `<button class="badge language" type="button" title="${escapeAttribute(title)}" aria-label="Afficher les langues de ${escapeAttribute(resource.name)}" aria-expanded="${String(expanded)}" aria-controls="pressPopularityNote" data-language-note-resource-id="${escapeAttribute(resource.id)}" data-context-note-resource-id="${escapeAttribute(resource.id)}" data-context-note-kind="language">${escapeHtml(text)}</button>`;
  }

  function renderPassBadge(label, compactLabel) {
    const passId = label === "Pass Lecture/Culture"
      ? "pass_lecture_culture"
      : label === "Pass Recherche illimité"
        ? "pass_recherche_illimite"
        : "";
    if (!passId) {
      return `<span class="badge" title="${escapeAttribute(label)}">${escapeHtml(compactLabel)}</span>`;
    }

    const expanded = isContextNoteOpen(passId, "pass");
    return `<button class="badge" type="button" title="${escapeAttribute(label)}" aria-label="En savoir plus sur ${escapeAttribute(label)}" aria-expanded="${String(expanded)}" aria-controls="pressPopularityNote" data-pass-note-id="${passId}" data-context-note-resource-id="${passId}" data-context-note-kind="pass">${escapeHtml(compactLabel)}</button>`;
  }

  function renderPressTitleRecommendedBadge(resource) {
    const expanded = !pressPopularityNote.hidden
      && pressPopularityNote.dataset.resourceId === resource.id
      && pressPopularityNote.dataset.noteKind === "recommendation";
    return `<button class="badge recommended badge-icon-only" type="button" title="Titre recommandé par BnF Access" aria-label="Titre recommandé par BnF Access" aria-expanded="${String(expanded)}" aria-controls="pressPopularityNote" data-recommendation-note-resource-id="${escapeAttribute(resource.id)}"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg></button>`;
  }

  function renderPressTitlePopularBadge(resource) {
    const reasons = state.pressPopularityReasons.get(resource.id) ?? [];
    const title = reasons.length > 0
      ? reasons.map(formatPressPopularityReferenceText).join("\n")
      : "Titre présent dans un classement de référence";
    const ariaLabel = reasons.length > 0
      ? `Titre populaire : ${reasons.map(formatPressPopularityReferenceText).join(" ; ")}`
      : "Titre populaire selon un classement de référence";

    const expanded = !pressPopularityNote.hidden
      && pressPopularityNote.dataset.resourceId === resource.id
      && pressPopularityNote.dataset.noteKind === "popularity";
    return `<button class="badge popular badge-icon-only" type="button" title="${escapeAttribute(title)}" aria-label="${escapeAttribute(ariaLabel)}" aria-expanded="${String(expanded)}" aria-controls="pressPopularityNote" data-popularity-note-resource-id="${escapeAttribute(resource.id)}"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10"/><path d="M17 4v5a5 5 0 0 1-10 0V4"/><path d="M5 9H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4"/><path d="M19 9h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4"/></svg></button>`;
  }

  function togglePressPopularityNote(resource) {
    if (!pressPopularityNote.hidden
      && pressPopularityNote.dataset.resourceId === resource.id
      && pressPopularityNote.dataset.noteKind === "popularity") {
      closePressPopularityNote();
      return;
    }

    const reasons = state.pressPopularityReasons.get(resource.id) ?? [];
    pressPopularityNoteDetails.replaceChildren();

    const references = reasons.length > 0
      ? reasons
      : [{ text: "Titre présent dans un classement de référence.", url: "", sourceLabel: "" }];
    const list = document.createElement("ol");
    references.forEach((reason) => {
      const item = document.createElement("li");
      item.append(document.createTextNode(reason.text));
      if (reason.url) {
        const link = document.createElement("a");
        link.href = reason.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = reason.citation ? `(${reason.citation})` : "Source";
        item.append(link);
      } else if (reason.citation) {
        item.append(document.createTextNode(` (${reason.citation})`));
      }
      list.append(item);
    });
    pressPopularityNoteDetails.append(list);

    revealPressTitleNote(resource, "popularity");
  }

  function togglePressRecommendationNote(resource) {
    if (!pressPopularityNote.hidden
      && pressPopularityNote.dataset.resourceId === resource.id
      && pressPopularityNote.dataset.noteKind === "recommendation") {
      closePressPopularityNote();
      return;
    }

    pressPopularityNoteDetails.replaceChildren();
    const message = document.createElement("p");
    message.textContent = "Titre recommandé par BnF Access";
    pressPopularityNoteDetails.append(message);
    revealPressTitleNote(resource, "recommendation");
  }

  function isContextNoteOpen(resourceId, noteKind) {
    return !pressPopularityNote.hidden
      && pressPopularityNote.dataset.resourceId === resourceId
      && pressPopularityNote.dataset.noteKind === noteKind;
  }

  function toggleAccessNote(resource) {
    if (isContextNoteOpen(resource.id, "access")) {
      closePressPopularityNote();
      return;
    }

    const fragments = [createContextNoteParagraph(getAccessModeTitle(resource))];
    const instruction = resource.access_instruction;
    if (instruction?.text?.trim()) {
      fragments.push(createContextNoteParagraph(instruction.text.trim()));
      const links = (instruction.links ?? []).filter((link) => link?.url && link?.label);
      if (links.length) {
        const linkList = document.createElement("div");
        linkList.className = "context-note-links";
        linkList.append(...links.map((link) => createContextNoteLink(link.url, link.label)));
        fragments.push(linkList);
      }
    }
    pressPopularityNoteDetails.replaceChildren(...fragments);
    revealContextNote(resource.id, "access", resource.name);
  }

  function togglePassNote(passId) {
    if (isContextNoteOpen(passId, "pass")) {
      closePressPopularityNote();
      return;
    }

    const isResearch = passId === "pass_recherche_illimite";
    const title = isResearch ? "Pass Recherche illimité" : "Pass BnF lecture / culture";
    const description = isResearch
      ? "Pensé pour les travaux de recherche, ce Pass donne accès à toutes les salles de lecture, aux collections patrimoniales et à une sélection de ressources électroniques à distance. Son obtention nécessite de justifier une recherche. Certaines ressources de BnF Access lui sont réservées."
      : "Pensé pour la lecture, la découverte et les usages culturels, ce Pass donne accès aux salles tous publics, à l’offre culturelle de la BnF et à une sélection de ressources électroniques à distance. Il ne comprend pas systématiquement les mêmes ressources que le Pass Recherche."
    const pricing = isResearch
      ? "Tarifs annuels constatés en septembre 2026 : 55 € au plein tarif et 35 € au tarif réduit."
      : "Tarifs annuels constatés en septembre 2026 : 24 € au plein tarif, 15 € au tarif réduit pour les moins de 26 ans et les étudiants de moins de 35 ans, avec gratuité selon les exonérations prévues par la BnF.";

    pressPopularityNoteDetails.replaceChildren(
      createContextNoteParagraph(description),
      createContextNoteParagraph(pricing),
      createContextNoteLinks(passId),
    );
    revealContextNote(passId, "pass", title);
  }

  function toggleLanguageNote(resource) {
    if (isContextNoteOpen(resource.id, "language")) {
      closePressPopularityNote();
      return;
    }

    const codes = getResourceLanguageCodes(resource);
    const languageData = resource.content_languages;
    const summary = codes.length
      ? codes.map(formatLanguageTooltipItem).join(" · ")
      : getLanguageSummaryLabel(languageData || {});
    const fragments = [createContextNoteParagraph(summary)];
    if (resource.language_public_note_validated && resource.language_public_note?.trim()) {
      fragments.push(createContextNoteParagraph(resource.language_public_note.trim()));
    }
    pressPopularityNoteDetails.replaceChildren(...fragments);
    revealContextNote(resource.id, "language", `Langues · ${resource.name}`);
  }

  function toggleCountryNote(resource) {
    if (isContextNoteOpen(resource.id, "country")) {
      closePressPopularityNote();
      return;
    }

    pressPopularityNoteDetails.replaceChildren(createContextNoteParagraph(resource.country_label || resource.country_code));
    revealContextNote(resource.id, "country", `Pays · ${resource.name}`);
  }

  function toggleRegionNote(resource) {
    if (isContextNoteOpen(resource.id, "region")) {
      closePressPopularityNote();
      return;
    }

    const labels = getPressTitleLocalRegionLabels(resource);
    pressPopularityNoteDetails.replaceChildren(createContextNoteParagraph(labels.join(" · ")));
    revealContextNote(resource.id, "region", `${labels.length > 1 ? "Régions" : "Région"} · ${resource.name}`);
  }

  function createContextNoteParagraph(text) {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    return paragraph;
  }

  function createContextNoteLinks(passId) {
    const links = document.createElement("div");
    links.className = "context-note-links";
    const pricingAnchor = passId === "pass_recherche_illimite"
      ? "#tarifs_passe_recherche"
      : "#tarifs_lecture_culture";
    links.append(
      createContextNoteLink(`${bnfPassPricingUrl}${pricingAnchor}`, "Conditions et tarifs"),
      createContextNoteLink(bnfPassSubscriptionUrl, "S’abonner en ligne"),
    );
    return links;
  }

  function createContextNoteLink(href, label) {
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    return link;
  }

  function revealPressTitleNote(resource, noteKind) {
    revealContextNote(resource.id, noteKind, resource.name);
  }

  function revealContextNote(resourceId, noteKind, title) {
    closeAlphaModeNote();
    const wasHidden = pressPopularityNote.hidden;
    window.clearTimeout(pressPopularityNoteCloseTimer);
    pressPopularityNoteCloseTimer = null;
    pressPopularityNote.dataset.resourceId = resourceId;
    pressPopularityNote.dataset.noteKind = noteKind;
    pressPopularityNoteTitle.textContent = title;

    pressPopularityNote.hidden = false;
    if (wasHidden) {
      pressPopularityNote.classList.remove("is-visible");
      window.requestAnimationFrame(() => {
        pressPopularityNote.classList.add("is-visible");
        syncPressPopularityNoteDockOffset();
      });
    } else {
      pressPopularityNote.classList.add("is-visible");
      syncPressPopularityNoteDockOffset();
    }
    syncPressPopularityButtons(resourceId, noteKind);
  }

  function closePressPopularityNote() {
    if (pressPopularityNote.hidden) return;

    window.clearTimeout(pressPopularityNoteCloseTimer);
    pressPopularityNote.classList.remove("is-visible");
    delete pressPopularityNote.dataset.resourceId;
    delete pressPopularityNote.dataset.noteKind;
    syncPressPopularityNoteDockOffset();
    syncPressPopularityButtons("", "");
    const closeDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 340;
    pressPopularityNoteCloseTimer = window.setTimeout(() => {
      pressPopularityNote.hidden = true;
      pressPopularityNoteCloseTimer = null;
    }, closeDelay);
  }

  function syncPressPopularityNoteDockOffset() {
    if (!jumpToSearchDock) return;

    const activeNote = [pressPopularityNote, alphaModeNote].find(
      (note) => !note.hidden && note.classList.contains("is-visible"),
    );
    let offset = 0;
    if (activeNote) {
      const noteRect = activeNote.getBoundingClientRect();
      const dockRect = jumpToSearchDock.getBoundingClientRect();
      const overlapsHorizontally = dockRect.left < noteRect.right && dockRect.right > noteRect.left;
      if (overlapsHorizontally) offset = Math.ceil(noteRect.height) + 10;
    }
    jumpToSearchDock.style.setProperty("--popularity-note-offset", `${offset}px`);
  }

  function syncPressPopularityButtons(activeResourceId, activeKind) {
    document.querySelectorAll("[data-popularity-note-resource-id]").forEach((button) => {
      button.setAttribute("aria-expanded", String(activeKind === "popularity" && button.dataset.popularityNoteResourceId === activeResourceId));
    });
    document.querySelectorAll("[data-recommendation-note-resource-id]").forEach((button) => {
      button.setAttribute("aria-expanded", String(activeKind === "recommendation" && button.dataset.recommendationNoteResourceId === activeResourceId));
    });
    document.querySelectorAll("[data-context-note-resource-id]").forEach((button) => {
      button.setAttribute("aria-expanded", String(
        button.dataset.contextNoteResourceId === activeResourceId
        && button.dataset.contextNoteKind === activeKind
      ));
    });
  }

  function buildPressPopularityReasonIndex(popularity) {
    const popularIds = new Set(popularity?.popular_catalog_ids ?? []);
    const sources = new Map((popularity?.sources ?? []).map((source) => [source.id, source]));
    const reasonsById = new Map();

    for (const record of popularity?.records ?? []) {
      const catalogId = record.match?.public_catalog_id;
      if (
        !catalogId
        || !popularIds.has(catalogId)
        || record.public_eligible !== true
        || record.label_suppressed === true
      ) {
        continue;
      }

      const source = sources.get(record.source_id);
      const reasonParts = formatPressPopularityReason(record, source);
      if (!reasonParts) continue;
      const reason = {
        ...reasonParts,
        url: /^https?:\/\//.test(source?.url ?? "") ? source.url : "",
      };
      const reasons = reasonsById.get(catalogId) ?? [];
      if (!reasons.some((candidate) => candidate.text === reason.text && candidate.citation === reason.citation && candidate.url === reason.url)) reasons.push(reason);
      reasonsById.set(catalogId, reasons);
    }

    return reasonsById;
  }

  function formatPressPopularityReason(record, source) {
    const rank = Number(record.rank);
    if (!Number.isFinite(rank) || rank <= 0) return "";

    const rankingLabel = {
      magazine_sales: "magazine le plus diffusé",
      daily_national_sales: "quotidien national le plus diffusé",
      daily_regional_sales: "quotidien régional le plus diffusé",
      web_audience: "site d’information le plus visité",
      supplemental_web_audience: "site d’information le plus visité",
    }[record.kind] ?? source?.label ?? source?.ranking_name ?? "classement de référence";
    const metric = formatPressPopularityMetric(record);
    const publisher = source?.publisher || source?.label || "";
    const period = formatPressPopularityPeriod(source?.ranking_name);
    const sourceDetails = [publisher, period].filter(Boolean).join(", ");

    return {
      text: [
      `${rank === 1 ? "1er" : `${rank}e`} ${rankingLabel}`,
      metric ? `(${metric})` : "",
      ].filter(Boolean).join(" "),
      citation: sourceDetails,
    };
  }

  function formatPressPopularityReferenceText(reason) {
    return [reason.text, reason.citation ? `(${reason.citation})` : ""].filter(Boolean).join(" ");
  }

  function formatPressPopularityPeriod(rankingName) {
    if (!rankingName) return "";

    const isoDate = rankingName.match(/\b(20\d{2})-(\d{2})-\d{2}\b/);
    if (isoDate) {
      const date = new Date(Date.UTC(Number(isoDate[1]), Number(isoDate[2]) - 1, 1));
      return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
    }

    const yearRange = rankingName.match(/\b(20\d{2})[‐‑‒–—-](20\d{2})\b/);
    if (yearRange) return `${yearRange[1]}-${yearRange[2]}`;

    const namedMonth = rankingName.match(/\b(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(20\d{2})\b/i);
    if (namedMonth) return `${namedMonth[1].toLocaleLowerCase("fr-FR")} ${namedMonth[2]}`;

    return rankingName.match(/\b20\d{2}\b/)?.[0] ?? "";
  }

  function formatPressPopularityMetric(record) {
    const value = Number(record.qualification?.metric_value ?? record.metric?.value);
    if (!Number.isFinite(value)) return "";

    const formattedValue = new Intl.NumberFormat("fr-FR").format(value);
    if (["magazine_sales", "daily_national_sales", "daily_regional_sales"].includes(record.kind)) {
      return `${formattedValue} ex.`;
    }
    if (record.kind === "supplemental_web_audience" || record.qualification?.metric_evidence === "estimated_traffic") {
      return `${formattedValue} visites estimées`;
    }
    if (record.kind === "web_audience") {
      return `${formattedValue} visites`;
    }

    return record.metric?.name ? `${formattedValue} ${record.metric.name}` : formattedValue;
  }

  function renderPressTitleCountryBadge(resource) {
    const code = resource.country_code;
    const label = resource.country_label;

    if (
      !code
      || !label
      || code === "unknown"
    ) {
      return "";
    }

    const flag = resource.country_flag_url
      ? `<img class="country-flag" src="${escapeAttribute(resource.country_flag_url)}" alt="" decoding="async">`
      : "";

    const expanded = isContextNoteOpen(resource.id, "country");
    return `<button class="badge country" type="button" title="Pays : ${escapeAttribute(label)}" aria-label="Pays : ${escapeAttribute(label)}" aria-expanded="${String(expanded)}" aria-controls="pressPopularityNote" data-country-note-resource-id="${escapeAttribute(resource.id)}" data-context-note-resource-id="${escapeAttribute(resource.id)}" data-context-note-kind="country">${flag}</button>`;
  }

  function renderPressTitleLocalRegionBadges(resource) {
    const codes = resource.local_region_codes || [];
    if (!codes.length) return "";

    const labels = getPressTitleLocalRegionLabels(resource);
    const title = `Région${labels.length > 1 ? "s" : ""} : ${labels.join(", ")}`;
    const expanded = isContextNoteOpen(resource.id, "region");
    const visibleCodes = codes.slice(0, 3);
    const badges = visibleCodes.map((code, index) => `
      <button class="badge local-region" type="button" title="${escapeAttribute(title)}" aria-label="Région : ${escapeAttribute(labels[index])}" aria-expanded="${String(expanded)}" aria-controls="pressPopularityNote" data-region-note-resource-id="${escapeAttribute(resource.id)}" data-context-note-resource-id="${escapeAttribute(resource.id)}" data-context-note-kind="region">
        <span aria-hidden="true">${escapeHtml(formatLocalRegionBadgeCode(code))}</span>
      </button>
    `);

    if (codes.length > visibleCodes.length) {
      badges.push(`<button class="badge local-region more" type="button" title="${escapeAttribute(title)}" aria-label="${escapeAttribute(title)}" aria-expanded="${String(expanded)}" aria-controls="pressPopularityNote" data-region-note-resource-id="${escapeAttribute(resource.id)}" data-context-note-resource-id="${escapeAttribute(resource.id)}" data-context-note-kind="region">+${codes.length - visibleCodes.length}</button>`);
    }

    return badges.join("");
  }

  function getPressTitleLocalRegionLabels(resource) {
    const labelsById = new Map(
      (state.localGeography?.countries || [])
        .flatMap((country) => country.subdivisions || [])
        .map((region) => [region.id, region.label]),
    );
    return (resource.local_region_codes || []).map((code, index) => (
      resource.local_region_labels?.[index] || labelsById.get(code) || code
    ));
  }

  function renderPressTitleLanguageBadges(resource) {
    return renderLanguageBadges(resource);
  }

  function formatLocalRegionBadgeCode(code) {
    return String(code || "")
      .replace(/^fr-/i, "")
      .slice(0, 4)
      .toLocaleUpperCase("fr");
  }

  function renderPressTitleEditorialBadges(resource) {
    const labels = getResourceCategories(resource).filter((label) => label !== "Presse");
    if (!labels.length) {
      return "";
    }

    const title = labels.join(", ");
    return labels
      .map((label) => `<span class="badge editorial press-category-badge" title="${escapeAttribute(title)}">${escapeHtml(label)}</span>`)
      .join("");
  }

  function layoutPressTitleCategoryBadges(card) {
    const row = card.querySelector("[data-press-categories]");
    const overflow = row?.querySelector(".press-category-overflow");
    const badges = [...(row?.querySelectorAll(".press-category-badge") ?? [])];
    if (!row || !overflow || !badges.length || !row.isConnected) return;

    const expanded = row.dataset.expanded === "true";
    badges.forEach((badge) => { badge.hidden = false; });
    overflow.hidden = true;
    row.classList.toggle("is-expanded", expanded);

    if (expanded) {
      overflow.hidden = false;
      overflow.textContent = "−";
      overflow.title = "Réduire les catégories";
      overflow.setAttribute("aria-label", "Réduire les catégories");
      overflow.setAttribute("aria-expanded", "true");
      return;
    }

    const gap = Number.parseFloat(getComputedStyle(row).columnGap) || 0;
    const widths = badges.map((badge) => badge.getBoundingClientRect().width);
    const totalWidth = widths.reduce((sum, width) => sum + width, 0) + gap * Math.max(0, badges.length - 1);
    if (totalWidth <= row.clientWidth) return;

    overflow.hidden = false;
    overflow.textContent = `+${badges.length}`;
    const overflowWidth = overflow.getBoundingClientRect().width;
    let usedWidth = 0;
    let visibleCount = 0;
    for (const width of widths) {
      const nextWidth = usedWidth + (visibleCount ? gap : 0) + width;
      const remainingCount = badges.length - visibleCount - 1;
      const reservedWidth = remainingCount > 0 ? gap + overflowWidth : 0;
      if (nextWidth + reservedWidth > row.clientWidth) break;
      usedWidth = nextWidth;
      visibleCount += 1;
    }

    badges.forEach((badge, index) => { badge.hidden = index >= visibleCount; });
    const hiddenCount = badges.length - visibleCount;
    overflow.textContent = `+${hiddenCount}`;
    overflow.title = `Afficher ${hiddenCount} catégorie${hiddenCount > 1 ? "s" : ""} supplémentaire${hiddenCount > 1 ? "s" : ""}`;
    overflow.setAttribute("aria-label", overflow.title);
    overflow.setAttribute("aria-expanded", "false");
  }

  function schedulePressTitleCategoryBadgeLayout() {
    if (pressTitleCategoryLayoutFrame) return;
    pressTitleCategoryLayoutFrame = requestAnimationFrame(() => {
      pressTitleCategoryLayoutFrame = null;
      document.querySelectorAll(".press-title-card").forEach(layoutPressTitleCategoryBadges);
    });
  }

  function getLanguageSummaryLabel(languageData) {
    if (languageData.language_count) {
      return `${languageData.language_count} langues`;
    }

    if (languageData.language_count_min) {
      return `${languageData.language_count_min} langues ou plus`;
    }

    return "Plusieurs langues";
  }

  function formatLanguageTooltipItem(code) {
    const normalizedCode = normalizeLanguageCode(code);
    const label = state.languageVocabulary[normalizedCode] || state.languageVocabulary[code];
    return label ? `${capitalize(label)} (${formatLanguageBadgeText(normalizedCode)})` : formatLanguageBadgeText(normalizedCode);
  }

  function formatLanguageOptionLabel(code) {
    const normalizedCode = normalizeLanguageCode(code);
    const label = state.languageVocabulary[normalizedCode] || state.languageVocabulary[code];
    return label ? `${capitalize(label)} (${formatLanguageBadgeText(normalizedCode)})` : formatLanguageBadgeText(normalizedCode);
  }

  function formatLanguageBadgeText(code) {
    const normalizedCode = normalizeLanguageCode(code);
    return compactLanguageCodes[normalizedCode] ?? normalizedCode.slice(0, 2).toUpperCase();
  }

  return {
    formatLanguageBadgeText,
    formatLanguageTooltipItem,
    buildPressPopularityReasonIndex,
    closePressPopularityNote,
    syncPressPopularityNoteDockOffset,
    schedulePressTitleCategoryBadgeLayout,
    formatLanguageOptionLabel,
    renderPassBadge,
    renderLanguageBadges,
    renderPressTitleCountryBadge,
    renderPressTitleLocalRegionBadges,
    renderPressTitleLanguageBadges,
    renderPressTitleRecommendedBadge,
    renderPressTitlePopularBadge,
    renderPressTitleEditorialBadges,
    layoutPressTitleCategoryBadges,
    togglePressPopularityNote,
    togglePressRecommendationNote,
    togglePassNote,
    toggleLanguageNote,
    toggleCountryNote,
    toggleRegionNote,
    toggleAccessNote,
    isContextNoteOpen
  };
}
