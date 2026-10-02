import {
  escapeAttribute as defaultEscapeAttribute,
  escapeHtml as defaultEscapeHtml
} from '../../shared/text.js';
// Secondary actions and access warnings share the tile menu state, not browser sessions.
export function createFavoritesActionMenu({
  escapeAttribute = defaultEscapeAttribute,
  escapeHtml = defaultEscapeHtml,
  getAccessMode,
  getAccessModeTitle,
  getActions,
  getSessionAttributes,
  isContextNoteOpen,
  renderArchiveActionIcon,
  renderQuickLaunch,
  resolveActionHref,
  state
}) {
  function getQuickLaunchSecondaryActions(resource, actions, primaryAction) {
    const primaryId = primaryAction?.id;

    return actions.filter((action) => (
      action.id !== primaryId
      && action.favorite_visible !== false
      && (
        action.id === "archives"
        || action.source_filter_id === "indexpresse_business"
        || action.action_group === "variant"
      )
    ));
  }

  function renderQuickLaunchSecondaryActions(resource, actions) {
    if (!actions.length) {
      return "";
    }

    if (actions.length === 1 && isCompactQuickLaunchSingleSecondaryAction(actions[0])) {
      return renderQuickLaunchSingleSecondaryAction(resource, actions[0]);
    }

    return renderQuickLaunchActionMenu(resource, actions);
  }

  function resourceHasQuickLaunchActionMenu(resource) {
    const actions = getActions(resource);
    const primaryAction = actions[0];
    if (!primaryAction) return false;
    const secondaryActions = getQuickLaunchSecondaryActions(resource, actions, primaryAction);
    return secondaryActions.length > 1
      || (secondaryActions.length === 1 && !isCompactQuickLaunchSingleSecondaryAction(secondaryActions[0]));
  }

  function isCompactQuickLaunchSingleSecondaryAction(action) {
    if (action.id === "archives") return true;
    return getQuickLaunchExtraActionLabel(action).replace(/\s+/g, "").length <= 4;
  }

  function renderQuickLaunchSingleSecondaryAction(resource, action) {
    const href = resolveActionHref(resource, action);
    const label = getQuickLaunchExtraActionLabel(action);
    const classNames = [action.id === "archives" ? "quick-launch-archive" : "quick-launch-extra-action"];
    if (action.id !== "archives" && label.replace(/\s+/g, "").length <= 4) {
      classNames.push("compact");
    }
    const content = action.id === "archives"
      ? renderArchiveActionIcon("quick-launch-archive-icon")
      : escapeHtml(label);

    return `
      <a class="${classNames.join(" ")}" href="${escapeAttribute(href)}" target="_blank" rel="noreferrer"${getSessionAttributes(resource, action, href)} aria-label="${escapeAttribute(`${action.label} - ${resource.name}`)}" title="${escapeAttribute(action.label)}">
        ${content}
      </a>
    `;
  }

  function renderQuickLaunchActionMenu(resource, actions) {
    const isExpanded = state.quickLaunchActionMenus.has(resource.id);
    const toggleLabel = isExpanded
      ? `Masquer les actions - ${resource.name}`
      : `Afficher les actions - ${resource.name}`;

    return `
      <button class="quick-launch-action-toggle" type="button" data-quick-launch-actions-toggle="${escapeAttribute(resource.id)}" aria-expanded="${String(isExpanded)}" aria-label="${escapeAttribute(toggleLabel)}" title="${escapeAttribute(toggleLabel)}">
        <span class="shortcut-plus-symbol${isExpanded ? " is-minus" : ""}" aria-hidden="true">${isExpanded ? "-" : "+"}</span>
      </button>
      ${isExpanded ? `
        <div class="quick-launch-action-menu" data-action-count="${actions.length}" aria-label="${escapeAttribute(`Actions - ${resource.name}`)}">
          ${renderQuickLaunchMenuRows(resource, actions)}
        </div>
      ` : ""}
    `;
  }

  function renderQuickLaunchMenuRows(resource, actions) {
    return groupQuickLaunchMenuActions(actions).map((row) => {
      const rowClassName = row.length > 1
        ? "quick-launch-menu-row is-split"
        : "quick-launch-menu-row";
      const rowStyle = row.length > 1
        ? ` style="${escapeAttribute(getQuickLaunchMenuRowTemplate(row))}"`
        : "";

      return `
        <div class="${rowClassName}"${rowStyle}>
          ${row.map((action) => renderQuickLaunchMenuAction(resource, action)).join("")}
        </div>
      `;
    }).join("");
  }

  function groupQuickLaunchMenuActions(actions) {
    const rows = [];
    let pendingCompactAction = null;

    actions.forEach((action) => {
      if (!isCompactQuickLaunchMenuAction(action)) {
        if (pendingCompactAction) {
          rows.push([pendingCompactAction]);
          pendingCompactAction = null;
        }
        rows.push([action]);
        return;
      }

      if (pendingCompactAction && canShareQuickLaunchMenuRow(pendingCompactAction, action)) {
        rows.push([pendingCompactAction, action]);
        pendingCompactAction = null;
        return;
      }

      if (pendingCompactAction) {
        rows.push([pendingCompactAction]);
      }

      pendingCompactAction = action;
    });

    if (pendingCompactAction) {
      rows.push([pendingCompactAction]);
    }

    return rows;
  }

  function isCompactQuickLaunchMenuAction(action) {
    if (action.id === "archives" || action.kind === "indexpresse_business_articles") {
      return false;
    }

    const label = getQuickLaunchExtraActionLabel(action);
    return label.replace(/\s+/g, "").length <= 4;
  }

  function canShareQuickLaunchMenuRow(firstAction, secondAction) {
    const firstScore = getQuickLaunchMenuLabelScore(firstAction);
    const secondScore = getQuickLaunchMenuLabelScore(secondAction);

    return Math.max(firstScore, secondScore) <= 4 && firstScore + secondScore <= 6;
  }

  function getQuickLaunchMenuLabelScore(action) {
    return getQuickLaunchExtraActionLabel(action).replace(/\s+/g, "").length;
  }

  function getQuickLaunchMenuRowTemplate(row) {
    const weights = row.map((action) => Math.max(1, Math.ceil(getQuickLaunchMenuLabelScore(action) / 2)));
    return `grid-template-columns: ${weights.map((weight) => `minmax(0, ${weight}fr)`).join(" ")}`;
  }

  function renderQuickLaunchMenuAction(resource, action) {
    const href = resolveActionHref(resource, action);
    const label = getQuickLaunchExtraActionLabel(action);
    const classNames = ["quick-launch-menu-action"];

    if (action.action_group === "variant") {
      classNames.push("variant");
    }

    if (action.variant_tone) {
      classNames.push(`variant-${action.variant_tone}`);
    }

    return `
      <a class="${classNames.join(" ")}" href="${escapeAttribute(href)}" target="_blank" rel="noreferrer"${getSessionAttributes(resource, action, href)} aria-label="${escapeAttribute(`${action.label} - ${resource.name}`)}" title="${escapeAttribute(action.label)}">
        ${escapeHtml(label)}
      </a>
    `;
  }

  function handleQuickLaunchActionsToggle(event) {
    event.preventDefault();
    event.stopPropagation();
    const resourceId = event.currentTarget.dataset.quickLaunchActionsToggle;

    if (!resourceId) {
      return;
    }

    if (state.quickLaunchActionMenus.has(resourceId)) {
      state.quickLaunchActionMenus.delete(resourceId);
    } else {
      state.quickLaunchActionMenus.add(resourceId);
    }

    renderQuickLaunch();
  }

  function getQuickLaunchExtraActionLabel(action) {
    if (action.kind === "indexpresse_business_articles" && action.action_group !== "variant") {
      return "Articles";
    }

    if (action.action_group === "variant" && action.short_label) {
      return action.short_label;
    }

    if (String(action.favorite_label || action.label || "").toLocaleLowerCase("fr").includes("hors-série")) {
      return "HS";
    }

    return action.favorite_label || action.label;
  }

  function renderQuickLaunchAccessWarning(resource) {
    const accessMode = getAccessMode(resource);
    if (accessMode !== "remote_conditional" && accessMode !== "onsite_extended") {
      return "";
    }

    const accessLabel = getAccessModeTitle(resource);
    const expanded = isContextNoteOpen(resource.id, "access");
    return `
      <span class="quick-launch-access-warning" role="button" tabindex="0" aria-label="${escapeAttribute(accessLabel)}" title="${escapeAttribute(accessLabel)}" aria-expanded="${String(expanded)}" aria-controls="pressPopularityNote" data-access-note-resource-id="${escapeAttribute(resource.id)}" data-context-note-resource-id="${escapeAttribute(resource.id)}" data-context-note-kind="access">
        !
      </span>
    `;
  }

  return {
    getQuickLaunchSecondaryActions,
    handleQuickLaunchActionsToggle,
    renderQuickLaunchAccessWarning,
    renderQuickLaunchSecondaryActions,
    resourceHasQuickLaunchActionMenu
  };
}
