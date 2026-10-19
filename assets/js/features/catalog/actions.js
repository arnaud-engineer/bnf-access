import {
  escapeAttribute as defaultEscapeAttribute,
  escapeHtml as defaultEscapeHtml
} from '../../shared/text.js';
import {pressTitleAllFilterValue as defaultPressTitleAllFilterValue} from '../../config/catalog.js';
import {
  getToday as defaultGetToday,
  getOneYearAgo as defaultGetOneYearAgo,
  getCompactDate as defaultGetCompactDate
} from '../../shared/dates.js';
import {
  europresseEntrypointUrl as defaultEuropresseEntrypointUrl,
  bnfProxyLoginUrl as defaultBnfProxyLoginUrl,
  europresseProxyHost as defaultEuropresseProxyHost
} from '../../config/platforms.js';
export function createResourceActions({
  escapeAttribute = defaultEscapeAttribute,
  escapeHtml = defaultEscapeHtml,
  isPressTitleEntry,
  shouldShowPressTitleSection,
  state,
  pressTitleAllFilterValue = defaultPressTitleAllFilterValue,
  getAccessMode,
  saveEditionSelections,
  renderQuickLaunch,
  getToday = defaultGetToday,
  getOneYearAgo = defaultGetOneYearAgo,
  getCompactDate = defaultGetCompactDate,
  europresseEntrypointUrl = defaultEuropresseEntrypointUrl,
  bnfProxyLoginUrl = defaultBnfProxyLoginUrl,
  europresseProxyHost = defaultEuropresseProxyHost
}) {

  function renderActions(resource) {
    const actions = getVisibleActions(resource);
    if (!actions.length) {
      return "";
    }

    const hasEditionOptions = Array.isArray(resource.edition_options) && resource.edition_options.length > 0;
    const regularActions = actions
      .filter((action) => action.action_group !== "variant")
      .map((action, index) => ({ action, index }))
      .sort((left, right) => (
        getActionProviderPriority(left.action) - getActionProviderPriority(right.action)
        || left.index - right.index
      ))
      .map(({ action }) => action);
    const featuredVariantActions = actions.filter((action) => action.action_group === "variant" && action.variant_featured);
    const nonFeaturedVariantActions = actions.filter((action) => action.action_group === "variant" && !action.variant_featured);
    const supplementalRegularActions = regularActions.length > 2 ? regularActions.slice(2) : [];
    const primaryRegularActions = supplementalRegularActions.length ? regularActions.slice(0, 2) : regularActions;
    const singleAutomaticVariantAction = (
      primaryRegularActions.length === 2
      && supplementalRegularActions.length === 0
      && featuredVariantActions.length === 0
      && nonFeaturedVariantActions.length === 1
      && shouldRenderVariantInline(nonFeaturedVariantActions[0])
    )
      ? nonFeaturedVariantActions
      : [];
    const singleFullLabelVariantAction = (
      primaryRegularActions.length === 1
      && supplementalRegularActions.length === 0
      && featuredVariantActions.length === 0
      && nonFeaturedVariantActions.length === 1
      && String(nonFeaturedVariantActions[0].label || "").trim().length <= 10
    )
      ? nonFeaturedVariantActions
      : [];
    const orphanVariantActions = primaryRegularActions.length === 0
      ? [...featuredVariantActions, ...nonFeaturedVariantActions]
      : [];
    const compactVariantActions = orphanVariantActions.length
      ? orphanVariantActions
      : [
          ...featuredVariantActions.filter(shouldRenderVariantInline),
          ...singleAutomaticVariantAction,
          ...singleFullLabelVariantAction,
        ];
    const fullLabelVariantActionIds = new Set(
      [...singleFullLabelVariantAction, ...orphanVariantActions].map((action) => action.id),
    );
    const inlineActionIds = new Set(compactVariantActions.map((action) => action.id));
    const compactActionIds = new Set(
      compactVariantActions
        .filter((action) => !fullLabelVariantActionIds.has(action.id))
        .map((action) => action.id),
    );
    const variantActions = [
      ...supplementalRegularActions,
      ...featuredVariantActions.filter((action) => !inlineActionIds.has(action.id)),
      ...nonFeaturedVariantActions.filter((action) => !inlineActionIds.has(action.id)),
    ];
    const primaryActions = [...primaryRegularActions, ...compactVariantActions];
    const actionListClass = resource.source === "multi_source" && primaryActions.length === 3 && !compactVariantActions.length
      ? " multi-source-actions"
      : "";
    const compactActionClass = compactVariantActions.length && primaryRegularActions.length
      ? " has-compact-actions weighted-compact-actions"
      : "";
    const hasCompactVariantActions = shouldRenderVariantActionsCompact(
      variantActions,
      supplementalRegularActions,
    );
    const variantDisclosureId = variantActions.length ? `action-options-${resource.id}` : "";
    const variantCountLabel = `${variantActions.length} option${variantActions.length > 1 ? "s" : ""} supplémentaire${variantActions.length > 1 ? "s" : ""}`;
    const actionDisclosureHtml = variantActions.length
      ? `<button class="resource-action-disclosure" type="button" title="Afficher ${variantCountLabel}" aria-label="Afficher ${variantCountLabel}" aria-expanded="false" aria-controls="${escapeAttribute(variantDisclosureId)}" data-action-disclosure data-collapsed-title="Afficher ${variantCountLabel}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"/></svg></button>`
      : "";
    const primaryControlCount = primaryActions.length + (actionDisclosureHtml ? 1 : 0);
    const regularActionHtml = renderPrimaryActions(resource, primaryActions, {
      actionListClass,
      compactActionClass,
      compactActionIds,
      fullLabelVariantActionIds,
      compactIndexPresseLabel: primaryControlCount >= 3,
      compactLatestLabel: primaryControlCount >= 3,
      hasEditionOptions,
      actionDisclosureHtml,
      useExpandedProviderLabel: actions.length === 1,
    });
    const variantActionHtml = variantActions.length
      ? `<div id="${escapeAttribute(variantDisclosureId)}" class="resource-variant-disclosure" hidden>${renderVariantActions(resource, variantActions, hasCompactVariantActions)}</div>`
      : "";

      return `
        <div class="resource-action-stack">
          ${regularActionHtml}
          ${variantActionHtml}
        </div>
      `;
  }

  function shouldRenderVariantActionsCompact(variantActions, supplementalRegularActions) {
    if (variantActions.length <= 3) {
      return supplementalRegularActions.length > 0
        || variantActions.some((action) => action.short_label);
    }

    if (supplementalRegularActions.length > 0) {
      return false;
    }

    const compactLabelLengths = variantActions.map((action) => (
      getCompactFeaturedVariantLabel(action).length
    ));

    return (
      variantActions.length === 4
      && compactLabelLengths.every((length) => length > 0 && length <= 5)
    ) || (
      variantActions.length >= 5
      && variantActions.length <= 6
      && compactLabelLengths.every((length) => length > 0 && length <= 2)
    );
  }

  function getActionProviderId(action) {
    const provider = action.source_filter_id || String(action.kind || "").split("_")[0];
    return provider === "indexpresse" ? "indexpresse_business" : provider;
  }

  function getActionProviderLabel(action) {
    return {
      europresse: "Europresse",
      indexpresse_business: "IndexPresse Business",
      pressreader: "PressReader",
      factiva: "Factiva",
    }[getActionProviderId(action)] || "Accès direct";
  }

  function getActionProviderPriority(action) {
    const provider = getActionProviderId(action);
    return {
      europresse: 0,
      indexpresse: 1,
      indexpresse_business: 1,
      pressreader: 2,
    }[provider] ?? 3;
  }

  function renderVariantActions(resource, variantActions, hasCompactVariantActions) {
    if (!variantActions.length) {
      return "";
    }

    if (hasCompactVariantActions) {
      return `
        <div class="resource-actions resource-variant-actions compact-variant-actions" style="--variant-action-count: ${variantActions.length}">
          ${variantActions.map((action) => renderActionLink(resource, action, {
            compactAppearance: true,
            useCompactLabel: action.kind === "indexpresse_business_articles",
          })).join("")}
        </div>
      `;
    }

    return splitActionsIntoBalancedRows(variantActions).map((row) => `
      <div class="resource-actions resource-variant-actions balanced-variant-actions" style="--variant-row-count: ${row.length}">
        ${row.map((action) => renderActionLink(resource, action, {
          compactAppearance: true,
          useCompactLabel: action.kind === "indexpresse_business_articles",
        })).join("")}
      </div>
    `).join("");
  }

  function splitActionsIntoBalancedRows(actions) {
    if (actions.length <= 3) {
      return [actions];
    }

    const rowCount = Math.ceil(actions.length / 3);
    const baseRowSize = Math.floor(actions.length / rowCount);
    let rowsWithExtraItem = actions.length % rowCount;
    const rows = [];
    let actionIndex = 0;

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      const rowSize = baseRowSize + (rowsWithExtraItem > 0 ? 1 : 0);
      rows.push(actions.slice(actionIndex, actionIndex + rowSize));
      actionIndex += rowSize;
      rowsWithExtraItem -= 1;
    }

    return rows;
  }

  function renderPrimaryActions(resource, primaryActions, options = {}) {
    if (!primaryActions.length) {
      return "";
    }

    if (options.hasEditionOptions) {
      return `
        <div class="resource-actions resource-edition-actions${options.compactActionClass}${options.actionDisclosureHtml ? " has-action-disclosure" : ""}" style="--edition-action-count: ${primaryActions.length}">
          ${primaryActions.map((action) => renderActionLink(resource, action, {
            useCompactLabel: options.compactActionIds?.has(action.id),
            useFullLabel: options.fullLabelVariantActionIds?.has(action.id),
            compactIndexPresseLabel: options.compactIndexPresseLabel,
            compactLatestLabel: options.compactLatestLabel,
            useExpandedProviderLabel: options.useExpandedProviderLabel,
          })).join("")}${options.actionDisclosureHtml ?? ""}
        </div>
        <div class="resource-edition-control">
          ${renderEditionSelect(resource)}
        </div>
      `;
    }

    return `
      <div class="resource-actions resource-primary-actions${options.actionListClass}${options.compactActionClass}${options.actionDisclosureHtml ? " has-action-disclosure" : ""}">
        ${primaryActions.map((action) => renderActionLink(resource, action, {
          useCompactLabel: options.compactActionIds?.has(action.id),
          useFullLabel: options.fullLabelVariantActionIds?.has(action.id),
          compactIndexPresseLabel: options.compactIndexPresseLabel,
          compactLatestLabel: options.compactLatestLabel,
          useExpandedProviderLabel: options.useExpandedProviderLabel,
        })).join("")}${options.actionDisclosureHtml ?? ""}
      </div>
    `;
  }

  function renderEditionSelect(resource) {
    const options = resource.edition_options ?? [];
    const selectedOption = getSelectedEditionOption(resource);
    const selectLabel = resource.edition_select_label || "Choisir une édition";

    return `
      <select class="resource-edition-select" data-edition-resource-id="${escapeAttribute(resource.id)}" title="${escapeAttribute(selectLabel)}" aria-label="${escapeAttribute(`${selectLabel} - ${resource.name}`)}">
        ${options.map((option) => `
          <option value="${escapeAttribute(option.id)}"${option.id === selectedOption?.id ? " selected" : ""}>
            ${escapeHtml(option.label || option.name)}
          </option>
        `).join("")}
      </select>
    `;
  }

  function renderActionLink(resource, action, options = {}) {
    const href = resolveActionHref(resource, action);
    const classNames = ["resource-action"];
    const label = getResourceActionLabel(action, options);
    const fullLabel = options.compactIndexPresseLabel && action.short_label
      ? action.short_label
      : action.label;
    const tooltip = isPressTitleEntry(resource)
      ? `${fullLabel} (${getActionProviderLabel(action)})`
      : fullLabel;
    const compactAriaLabel = label !== fullLabel
      ? ` aria-label="${escapeAttribute(fullLabel)}"`
      : "";
    const trackingAttributes = ` data-action-resource-id="${escapeAttribute(resource.id)}" data-action-id="${escapeAttribute(action.id)}"`;

    if (isPressTitleEntry(resource)) {
      const provider = getActionProviderId(action);
      if (["pressreader", "europresse", "indexpresse_business", "factiva"].includes(provider)) {
        classNames.push(`provider-${provider}`);
      }
    }

    if (action.id === "archives" || action.id === "all_articles") {
      classNames.push("secondary");
    }

    if (action.id === "archives") {
      classNames.push("archive-action");
    }

    if (action.action_group === "variant" || options.compactAppearance) {
      classNames.push("variant");
    }

    if (options.useCompactLabel || (action.short_label && label === action.short_label)) {
      classNames.push("compact");
    }

    if (action.variant_featured) {
      classNames.push("featured-variant");
    }

    if (action.variant_tone) {
      classNames.push(`variant-${action.variant_tone}`);
    }

    return `
      <a class="${classNames.join(" ")}" href="${escapeAttribute(href)}" target="_blank" rel="noreferrer"${trackingAttributes}${getSessionAttributes(resource, action, href)} title="${escapeAttribute(tooltip)}"${compactAriaLabel}>
        ${action.id === "archives" ? renderArchiveActionIcon("resource-action-archive-icon") : ""}<span>${escapeHtml(label)}</span>
      </a>
    `;
  }

  function renderArchiveActionIcon(className) {
    return `<svg class="${escapeAttribute(className)}" viewBox="0 0 28 28" aria-hidden="true" focusable="false"><rect x="9.5" y="6.5" width="10" height="13" rx="1"/><rect class="quick-launch-archive-cutout-fill" x="6" y="10" width="10" height="13" rx="1"/><rect x="6" y="10" width="10" height="13" rx="1"/><circle class="quick-launch-archive-cutout-fill" cx="19.71" cy="17.46" r="6.45"/><g transform="translate(12.75 10.5) scale(.58)"><path class="quick-launch-archive-cutout-stroke" d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5"/><path class="quick-launch-archive-clock" d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5"/><path class="quick-launch-archive-hands" d="M12 7v5l4 2"/></g></svg>`;
  }

  function shouldRenderVariantInline(action) {
    const compactLabel = getCompactFeaturedVariantLabel(action);
    return compactLabel.length > 0 && compactLabel.length <= 5;
  }

  function getCompactFeaturedVariantLabel(action) {
    if (action.short_label) {
      return action.short_label.trim();
    }

    if (action.kind === "indexpresse_business_articles") {
      return "IndexPresse";
    }

    if (String(action.favorite_label || action.label || "").toLocaleLowerCase("fr").includes("hors-série")) {
      return "HS";
    }

    return String(action.favorite_label || action.label || "").trim();
  }

  function getResourceActionLabel(action, options = {}) {
    if (options.useFullLabel) {
      return action.label;
    }

    if (
      options.compactIndexPresseLabel
      && action.kind === "indexpresse_business_articles"
    ) {
      return "Articles IPB";
    }

    if (
      options.compactLatestLabel
      && action.id === "latest"
      && action.label === "Dernier numéro"
    ) {
      return "Dernier n°";
    }

    if (options.useCompactLabel) {
      return getCompactFeaturedVariantLabel(action);
    }

    if (
      options.useExpandedProviderLabel
      && getActionProviderId(action) === "indexpresse_business"
    ) {
      return "Articles sur IndexPresse";
    }

    if (
      action.short_label
      && !(action.short_label === "HS" && String(action.label || "").toLocaleLowerCase("fr").includes("hors-série"))
    ) {
      return action.short_label;
    }

    return action.label;
  }

  function getSessionAttributes(resource, action, href) {
    if (isEuropressePdfAction(resource, action)) {
      return "";
    }

    const sessionStartUrl = getSessionStartUrl(resource, action);
    return sessionStartUrl
      ? ` data-session-start="${escapeAttribute(sessionStartUrl)}" data-transition-href="${escapeAttribute(href)}"`
      : "";
  }

  function getVisibleActions(resource) {
    return getProfileVisibleActions(resource)
      .filter((action) => matchesActionSourceFilter(action));
  }

  function getProfileVisibleActions(resource) {
    return getActions(resource)
      .filter((action) => matchesActionPassFilter(resource, action))
      .filter((action) => matchesActionRemoteFilter(resource, action));
  }

  function matchesActionSourceFilter(action) {
    if (!shouldShowPressTitleSection() || state.pressTitleSourceFilter === pressTitleAllFilterValue) {
      return true;
    }

    return getActionProviderId(action) === state.pressTitleSourceFilter;
  }

  function matchesActionRemoteFilter(resource, action) {
    if (state.remoteFilter === "all") {
      return true;
    }

    const accessMode = action.access_mode || getAccessMode(resource);

    if (accessMode === "mixed") {
      return true;
    }

    if (state.remoteFilter === "remote") {
      return isRemoteAccessMode(accessMode);
    }

    if (state.remoteFilter === "onsite") {
      return accessMode === "onsite" || accessMode === "onsite_extended";
    }

    return accessMode === state.remoteFilter;
  }

  function matchesActionPassFilter(resource, action) {
    if (state.passFilter === "all") {
      return true;
    }

    const access = Array.isArray(action.access)
      ? action.access
      : resource.access ?? [];

    if (state.passFilter === "public") {
      return access.includes("public");
    }

    return access.includes(state.passFilter) || access.includes("public");
  }

  function isRemoteAccessMode(accessMode) {
    return accessMode === "remote" || accessMode === "remote_conditional" || accessMode === "free";
  }

  function getActions(resource) {
    if (Array.isArray(resource.actions) && resource.actions.length) {
      return resource.actions;
    }

    return [
      {
        id: "open",
        label: "Ouvrir",
        url: resource.url,
      },
    ];
  }

  function getPrimaryUrl(resource) {
    return resolveActionHref(resource, getActions(resource)[0]);
  }

  function getSelectedEditionOption(resource) {
    const options = resource.edition_options ?? [];
    if (!options.length) {
      return null;
    }

    const selectedId = state.editionSelections.get(resource.id);
    return options.find((option) => option.id === selectedId) || options[0];
  }

  function updateEditionSelection(resource, selectedEditionId, card) {
    if (!isValidEditionSelection(resource, selectedEditionId)) {
      state.editionSelections.delete(resource.id);
    } else {
      state.editionSelections.set(resource.id, selectedEditionId);
    }

    saveEditionSelections();
    updateEditionActionLinks(resource, card);

    if (state.favorites.has(resource.id)) {
      renderQuickLaunch();
    }
  }

  function updateEditionActionLinks(resource, scope = document) {
    const actionsById = new Map(getActions(resource).map((action) => [action.id, action]));
    scope.querySelectorAll(`[data-action-resource-id="${escapeCssIdentifier(resource.id)}"]`).forEach((link) => {
      const action = actionsById.get(link.dataset.actionId);
      if (!action) {
        return;
      }
      syncActionLink(link, resource, action);
    });
  }

  function syncActionLink(link, resource, action) {
    const href = resolveActionHref(resource, action);
    link.setAttribute("href", href);
    link.removeAttribute("data-session-start");
    link.removeAttribute("data-transition-href");

    if (!isEuropressePdfAction(resource, action)) {
      const sessionStartUrl = getSessionStartUrl(resource, action);
      if (sessionStartUrl) {
        link.dataset.sessionStart = sessionStartUrl;
        link.dataset.transitionHref = href;
      }
    }
  }

  function isValidEditionSelection(resource, selectedEditionId) {
    if (!resource) {
      return false;
    }

    return (resource.edition_options ?? []).some((option) => option.id === selectedEditionId);
  }

  function escapeCssIdentifier(value) {
    if (window.CSS?.escape) {
      return window.CSS.escape(value);
    }

    return String(value).replaceAll('"', '\\"').replaceAll("\\", "\\\\");
  }

  function getActionSourceCode(resource, action) {
    if (action.edition_variant_aware) {
      return getSelectedEditionVariantOption(resource, action)?.source_code ?? action.source_code ?? resource.source_code ?? "";
    }

    if (action.edition_aware) {
      return getSelectedEditionOption(resource)?.source_code ?? action.source_code ?? resource.source_code ?? "";
    }

    return action.source_code ?? resource.source_code ?? "";
  }

  function getSelectedEditionVariantOption(resource, action) {
    const selectedEditionId = getSelectedEditionOption(resource)?.id;
    const options = action.edition_variant_options ?? [];
    return options.find((option) => option.edition_id === selectedEditionId) || options[0] || null;
  }

  function getActionTemplate(resource, action) {
    if (action.edition_variant_aware) {
      const option = getSelectedEditionVariantOption(resource, action);
      const mappedTemplate = option?.action_urls?.[action.id === "archives" ? "archives" : "latest"]
        || option?.action_urls?.[action.id]
        || option?.action_urls?.latest;

      if (mappedTemplate) {
        return mappedTemplate;
      }
    }

    if (action.edition_aware) {
      const option = getSelectedEditionOption(resource);
      const mappedTemplate = option?.action_urls?.[action.id];

      if (mappedTemplate) {
        return mappedTemplate;
      }
    }

    return action.url_template || action.url || resource.url || "";
  }

  function resolveActionUrl(resource, action) {
    const template = getActionTemplate(resource, action);
    return template
      .replaceAll("{sourceCode}", encodeURIComponent(getActionSourceCode(resource, action)))
      .replaceAll("{today}", getToday())
      .replaceAll("{oneYearAgo}", getOneYearAgo())
      .replaceAll("{oneYearAgoCompact}", getCompactDate(getOneYearAgo()))
      .replaceAll("%7BoneYearAgoCompact%7D", getCompactDate(getOneYearAgo()));
  }

  function resolveActionHref(resource, action) {
    const targetUrl = resolveActionUrl(resource, action);

    if (isEuropressePdfAction(resource, action)) {
      return buildEuropresseDeepLink(targetUrl);
    }

    const startUrl = getSessionStartUrl(resource, action);

    if (!startUrl) {
      return targetUrl;
    }

    const params = new URLSearchParams({
      title: resource.name,
      action: action.label,
      start: startUrl,
      target: targetUrl,
    });

    return `./pages/transition.html?${params.toString()}`;
  }

  function getSessionStartUrl(resource, action) {
    if (isEuropressePdfAction(resource, action)) {
      return "";
    }

    const needsTransition = action.session_prerequisite || resource.session_prerequisite;
    return needsTransition ? action.session_start_url || resource.session_start_url || "" : "";
  }

  function isEuropressePdfAction(resource, action) {
    return resource.source === "europresse_pdf" || String(action.kind ?? "").startsWith("europresse_");
  }

  function buildEuropresseDeepLink(targetUrl, options = {}) {
    const finalPath = getEuropresseFinalPath(targetUrl);

    if (!finalPath) {
      return targetUrl;
    }

    const returnUrl = options.resetFirst === false
      ? finalPath
      : `/access/ip/default.aspx?un=D000067U_1&ReturnUrl=${encodeURIComponent(finalPath)}`;
    const accessUrl = `${europresseEntrypointUrl}&ReturnUrl=${encodeURIComponent(returnUrl)}`;
    const loginUrl = new URL(bnfProxyLoginUrl);
    loginUrl.searchParams.set("qurl", accessUrl);
    return loginUrl.href;
  }

  function getEuropresseFinalPath(targetUrl) {
    if (String(targetUrl).startsWith("/")) {
      return targetUrl;
    }

    try {
      const url = new URL(targetUrl);
      if (url.hostname !== europresseProxyHost) {
        return "";
      }

      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return "";
    }
  }

  function setupEuropresseSessionHelpers() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[data-session-start]");

      if (!link) {
        return;
      }

      if (isModifiedClick(event)) {
        const helperTab = openNewTab(link.dataset.sessionStart);
        link.href = addQueryParam(
          link.dataset.transitionHref || link.href,
          "helper",
          helperTab ? "1" : "0",
        );
        return;
      }

      event.preventDefault();
      const transitionHref = withTransitionParams(link.dataset.transitionHref || link.href, {
        helper: "1",
      });
      const transitionTab = openNewTab(transitionHref);

      if (transitionTab) {
        window.location.assign(link.dataset.sessionStart);
        try {
          transitionTab.focus();
        } catch {
          // Focus is only a convenience; the navigation flow does not depend on it.
        }
        return;
      }

      const fallbackHref = addQueryParam(
        link.dataset.transitionHref || link.href,
        "helper",
        "0",
      );
      link.href = fallbackHref;
      window.location.assign(fallbackHref);
    });
  }

  function isModifiedClick(event) {
    return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  }

  function openNewTab(url, target = "_blank", options = {}) {
    const tab = window.open(url, target);

    if (tab && options.detach !== false) {
      try {
        tab.opener = null;
      } catch {
        // Some browsers disallow touching cross-origin windows.
      }
    }

    return tab;
  }

  function addQueryParam(url, key, value) {
    const target = new URL(url, window.location.href);
    target.searchParams.set(key, value);
    return `${target.pathname}${target.search}${target.hash}`;
  }

  function withTransitionParams(url, values) {
    return Object.entries(values).reduce((nextUrl, [key, value]) => (
      value ? addQueryParam(nextUrl, key, value) : nextUrl
    ), url);
  }

  return {
    setupEuropresseSessionHelpers,
    getVisibleActions,
    resolveActionUrl,
    renderActionLink,
    renderActions,
    updateEditionSelection,
    resolveActionHref,
    getSessionStartUrl,
    isEuropressePdfAction,
    getActionProviderLabel,
    isValidEditionSelection,
    buildEuropresseDeepLink,
    openNewTab,
    withTransitionParams,
    getActions,
    getProfileVisibleActions,
    getSessionAttributes,
    renderArchiveActionIcon
  };
}
