const state = {
  resources: [],
  category: "Toutes",
  favorites: new Set(),
  favoritesReady: false,
  favoritesOnly: false,
  passFilter: "all",
  remoteFilter: "all",
  favoriteOrder: [],
  favoriteOrderCustom: false,
  quickLaunchEditing: false,
  quickLaunchTransitioning: false,
  quickLaunchActionsEntering: false,
  quickLaunchActionsExiting: false,
  quickLaunchModifierEntering: false,
  quickLaunchPendingExitAction: null,
  draftFavoriteOrder: [],
  dragging: null,
  expandedDescriptions: new Set(),
  query: "",
};

const grid = document.querySelector("#resourceGrid");
const filters = document.querySelector("#categoryFilters");
const searchInput = document.querySelector("#searchInput");
const passFilter = document.querySelector("#passFilter");
const remoteFilter = document.querySelector("#remoteFilter");
const resultCount = document.querySelector("#resultCount");
const quickLaunch = document.querySelector("#quickLaunch");
const searchControls = document.querySelector("#searchControls");
const jumpToSearch = document.querySelector("#jumpToSearch");
const privacyNotice = document.querySelector("#privacyNotice");
const dismissNotice = document.querySelector("#dismissNotice");
const privacyNoticeDismissedKey = "bnf-access:privacy-notice-dismissed:v1";
const favoriteStorageKey = "bnf-access:favorites:v1";
const favoriteStorageReadyKey = "bnf-access:favorites-ready:v1";
const favoriteOrderStorageKey = "bnf-access:favorite-order:v1";
const favoriteOrderCustomStorageKey = "bnf-access:favorite-order-custom:v1";
const passFilterStorageKey = "bnf-access:pass-filter:v1";
const remoteFilterStorageKey = "bnf-access:remote-filter:v1";
const themedSvgCache = new Map();
let resourceGridTransitionTimer = 0;
let resourceGridEnterTimer = 0;

const accessLabels = {
  pass_lecture_culture: "Pass Lecture/Culture",
  pass_recherche: "Pass Recherche",
  pass_recherche_illimite: "Pass Recherche illimité",
  public: "Sans Pass BnF",
};

const accessModeLabels = {
  remote: "Accès distant",
  remote_conditional: "Accès distant sous condition",
  onsite: "Sur place uniquement",
  free: "Accès libre",
};

const accessModeClasses = {
  remote: "remote",
  remote_conditional: "conditional",
  onsite: "onsite",
  free: "free",
};

const categoryOrder = [
  "Presse",
  "Dicos / Encyclopédies",
  "Catalogues / Annuaires",
  "Pluridisciplinaires",
  "Langues / Lettres",
  "Histoire / Géo",
  "Sciences Humaines / Sociales",
  "Arts / Images",
  "Musique / Cinéma / Spectacle",
  "Droit / Économie",
  "Sciences / Santé",
];

async function init() {
  setupPrivacyNotice();
  const response = await fetch("./resources.json");
  const data = await response.json();
  state.resources = data.resources;
  loadFavorites();
  loadFavoriteOrder();
  loadProfileFilters();
  renderFilters();
  render();
}

function setupPrivacyNotice() {
  if (readStoredValue(privacyNoticeDismissedKey) === "true") {
    privacyNotice.hidden = true;
    return;
  }

  dismissNotice.addEventListener("click", () => {
    privacyNotice.hidden = true;
    writeStoredValue(privacyNoticeDismissedKey, "true");
  });
}

function renderFilters() {
  const knownCategories = new Set(state.resources.flatMap(getResourceCategories));
  const orderedCategories = categoryOrder.filter((category) => knownCategories.delete(category));
  const extraCategories = [...knownCategories].sort((a, b) => a.localeCompare(b, "fr"));
  const categories = ["Toutes", ...orderedCategories, ...extraCategories];
  filters.innerHTML = "";

  for (const category of categories) {
    const button = document.createElement("button");
    button.className = "filter-button";
    button.type = "button";
    button.textContent = category;
    button.setAttribute("aria-pressed", String(category === state.category));
    button.addEventListener("click", () => {
      if (state.category === category) {
        return;
      }

      state.category = category;
      renderFilters();
      renderResourceGridWithTransition();
    });
    filters.append(button);
  }

  const favoriteButton = document.createElement("button");
  favoriteButton.className = "filter-button favorite-filter";
  favoriteButton.type = "button";
  favoriteButton.textContent = "Favoris";
  favoriteButton.setAttribute("aria-pressed", String(state.favoritesOnly));
  favoriteButton.addEventListener("click", () => {
    state.favoritesOnly = !state.favoritesOnly;
    renderFilters();
    renderResourceGridWithTransition();
  });

  const separator = document.createElement("span");
  separator.className = "filter-separator";
  separator.setAttribute("aria-hidden", "true");
  filters.prepend(favoriteButton, separator);
}

function getResourceCategories(resource) {
  return [resource.category, ...(resource.secondary_categories ?? [])].filter(Boolean);
}

function render() {
  renderQuickLaunch();
  renderResourceGrid();
}

function renderResourceGrid() {
  const resources = getFilteredResources();
  resultCount.textContent = `${resources.length} ressource${resources.length > 1 ? "s" : ""}`;
  grid.innerHTML = "";

  if (!resources.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Aucune ressource ne correspond à cette recherche.";
    grid.append(empty);
    return;
  }

  for (const resource of resources) {
    grid.append(createCard(resource));
  }

  hydrateThemedSvgIcons(grid);
}

function renderResourceGridWithTransition() {
  if (prefersReducedMotion()) {
    renderResourceGrid();
    return;
  }

  window.clearTimeout(resourceGridTransitionTimer);
  window.clearTimeout(resourceGridEnterTimer);
  grid.classList.remove("is-entering");
  grid.classList.add("is-refreshing");

  resourceGridTransitionTimer = window.setTimeout(() => {
    renderResourceGrid();
    grid.classList.remove("is-refreshing");
    grid.classList.add("is-entering");

    resourceGridEnterTimer = window.setTimeout(() => {
      grid.classList.remove("is-entering");
    }, 220);
  }, 130);
}

function renderQuickLaunch() {
  const favorites = state.quickLaunchEditing ? getResourcesByIds(state.draftFavoriteOrder) : getFavoriteResources();
  quickLaunch.innerHTML = "";
  quickLaunch.hidden = !state.quickLaunchEditing && favorites.length === 0;
  quickLaunch.classList.toggle("is-editing", state.quickLaunchEditing);

  if (!state.quickLaunchEditing && !favorites.length) {
    state.quickLaunchModifierEntering = false;
    return;
  }

  quickLaunch.append(createQuickLaunchHeader(favorites));
  resetQuickLaunchActionAnimationFlag();

  if (!favorites.length) {
    const empty = document.createElement("p");
    empty.className = "quick-launch-empty";
    empty.textContent = "Aucun favori.";
    quickLaunch.append(empty);
    return;
  }

  const list = document.createElement("div");
  list.className = "quick-launch-list";
  list.setAttribute("aria-label", state.quickLaunchEditing ? "Favoris a reorganiser" : "Favoris");

  for (const resource of favorites) {
    const item = document.createElement(state.quickLaunchEditing ? "div" : "a");
    item.className = "quick-launch-item";
    item.classList.toggle("generated", !resource.icon_url);
    if (!state.quickLaunchEditing) {
      item.title = resource.name;
    }
    const accessWarning = getQuickLaunchAccessWarning(resource);
    const quickLaunchAriaLabel = accessWarning
      ? `${resource.name} - ${accessWarning}`
      : resource.name;
    item.setAttribute("aria-label", state.quickLaunchEditing ? `Déplacer ${quickLaunchAriaLabel}` : quickLaunchAriaLabel);
    item.dataset.resourceId = resource.id;
    const quickLaunchLabel = `<small class="quick-launch-label">${escapeHtml(resource.name)}</small>`;
    const warningBadge = accessWarning
      ? `<span class="quick-launch-access-warning" aria-hidden="true" title="${escapeAttribute(accessWarning)}">!</span>`
      : "";
    item.innerHTML = resource.icon_url
      ? `
        <span class="quick-launch-tile">
          ${renderIcon(resource, "quick")}
          ${warningBadge}
        </span>
        ${quickLaunchLabel}
      `
      : `
        <span class="quick-launch-tile generated">
          <strong>${escapeHtml(getFallbackLabel(resource))}</strong>
          ${warningBadge}
        </span>
        ${quickLaunchLabel}
      `;

    if (state.quickLaunchEditing) {
      item.tabIndex = 0;
      item.setAttribute("role", "button");
      item.setAttribute("draggable", "false");
      item.classList.toggle("is-dragging", state.dragging?.id === resource.id);
      item.append(createQuickLaunchRemoveButton(resource));
      item.addEventListener("pointerdown", handleQuickLaunchPointerDown);
      item.addEventListener("contextmenu", preventQuickLaunchEditContextMenu);
      item.addEventListener("dragstart", preventQuickLaunchEditContextMenu);
      item.addEventListener("keydown", handleQuickLaunchKeyDown);
    } else {
      item.href = resource.url;
      item.target = "_blank";
      item.rel = "noreferrer";
    }

    list.append(item);
  }

  quickLaunch.append(list);
  hydrateThemedSvgIcons(list);
}

function getQuickLaunchAccessWarning(resource) {
  const accessMode = getAccessMode(resource);

  if (accessMode === "onsite") {
    return "Sur place uniquement";
  }

  if (accessMode === "remote_conditional") {
    return "Accès distant sous condition";
  }

  return "";
}

function createQuickLaunchHeader(favorites) {
  const header = document.createElement("div");
  header.className = "section-heading quick-launch-header";
  header.classList.toggle("actions-entering", state.quickLaunchActionsEntering);
  header.classList.toggle("actions-exiting", state.quickLaunchActionsExiting);
  header.classList.toggle("modifier-entering", state.quickLaunchModifierEntering);

  const title = document.createElement("h2");
  title.textContent = "Favoris";
  header.append(title);

  const actions = document.createElement("div");
  actions.className = "quick-launch-actions";

  if (state.quickLaunchEditing) {
    actions.append(
      createActionButton("Enregistrer", saveQuickLaunchOrder, "save"),
      createActionButton("Annuler", cancelQuickLaunchEdit, "discard"),
      createActionButton("Tri alphabétique", resetQuickLaunchOrder, "discard"),
    );
    header.append(actions);
    return header;
  }

  if (favorites.length > 0) {
    actions.append(createActionButton("Modifier", startQuickLaunchEdit, "neutral"));
  }

  header.append(actions);
  return header;
}

function createActionButton(label, onClick, tone = "neutral") {
  const button = document.createElement("button");
  button.className = `quick-launch-action ${tone}`;
  button.type = "button";
  button.disabled = state.quickLaunchActionsExiting;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function createQuickLaunchRemoveButton(resource) {
  const button = document.createElement("button");
  button.className = "quick-launch-remove";
  button.type = "button";
  button.setAttribute("aria-label", `Retirer ${resource.name} des favoris`);
  button.title = `Retirer ${resource.name} des favoris`;
  button.dataset.resourceId = resource.id;
  button.addEventListener("click", handleQuickLaunchRemove);
  button.addEventListener("pointerdown", stopQuickLaunchRemoveEvent);
  button.addEventListener("keydown", stopQuickLaunchRemoveEvent);
  button.addEventListener("keyup", stopQuickLaunchRemoveEvent);
  return button;
}

function getFavoriteResources() {
  if (state.favoriteOrderCustom) {
    syncFavoriteOrder();
    return getResourcesByIds(state.favoriteOrder);
  }

  return getAlphaFavoriteResources();
}

function getAlphaFavoriteResources() {
  return state.resources
    .filter((resource) => state.favorites.has(resource.id))
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

function getResourcesByIds(ids) {
  const byId = new Map(state.resources.map((resource) => [resource.id, resource]));
  return ids.map((id) => byId.get(id)).filter(Boolean);
}

function getFilteredResources() {
  const query = normalize(state.query);
  return state.resources
    .filter((resource) => {
      const accessMode = getAccessMode(resource);
      const resourceCategories = getResourceCategories(resource);
      const matchesCategory = state.category === "Toutes" || resourceCategories.includes(state.category);
      const matchesFavorite = !state.favoritesOnly || state.favorites.has(resource.id);
      const matchesPass = matchesPassFilter(resource);
      const matchesRemote = matchesRemoteFilter(accessMode);
      const haystack = normalize([
        resource.name,
        ...resourceCategories,
        resource.description,
        getAccessModeLabel(resource),
        resource.access_note,
        resource.access_instruction?.text,
        ...(resource.tags ?? []),
      ].join(" "));
      return matchesCategory && matchesFavorite && matchesPass && matchesRemote && (!query || haystack.includes(query));
    })
    .sort((a, b) => {
      const favoriteDelta = Number(state.favorites.has(b.id)) - Number(state.favorites.has(a.id));
      return favoriteDelta || a.name.localeCompare(b.name, "fr");
    });
}

function matchesRemoteFilter(accessMode) {
  if (state.remoteFilter === "all") {
    return true;
  }

  if (state.remoteFilter === "remote") {
    return accessMode === "remote" || accessMode === "remote_conditional" || accessMode === "free";
  }

  return accessMode === state.remoteFilter;
}

function matchesPassFilter(resource) {
  if (state.passFilter === "all") {
    return true;
  }

  const access = resource.access ?? [];

  if (state.passFilter === "public") {
    return access.includes("public");
  }

  return access.includes(state.passFilter) || access.includes("public");
}

function createCard(resource) {
  const card = document.createElement("article");
  card.className = "card";
  card.tabIndex = 0;
  card.setAttribute("role", "link");
  card.setAttribute("aria-label", `Ouvrir ${resource.name}`);

  const access = (resource.access ?? []).map((item) => accessLabels[item] ?? item);
  const accessMode = getAccessMode(resource);
  const accessModeLabel = getAccessModeLabel(resource);
  const accessModeClass = accessModeClasses[accessMode] ?? "onsite";
  const isFavorite = state.favorites.has(resource.id);
  const longDescription = getOfficialDescription(resource);
  const hasLongDescription = Boolean(longDescription);
  const isExpanded = state.expandedDescriptions.has(resource.id) && hasLongDescription;
  const description = isExpanded ? longDescription : resource.description;
  const descriptionToggle = hasLongDescription
    ? ` <button
        class="description-toggle"
        type="button"
        aria-expanded="${String(isExpanded)}"
        aria-label="${isExpanded ? "Afficher la description courte" : "Afficher la description longue"}"
        title="${isExpanded ? "Afficher la description courte" : "Afficher la description longue"}"
        data-resource-id="${escapeAttribute(resource.id)}"
      >${isExpanded ? "[-]" : "[+]"}</button>`
    : "";
  const logo = resource.icon_url
    ? renderIcon(resource, "card")
    : `<span>${escapeHtml(getFallbackLabel(resource))}</span>`;
  const accessInstruction = renderAccessInstruction(resource);
  const secondaryCategoryBadges = (resource.secondary_categories ?? [])
    .map((category) => `<span class="badge category">${escapeHtml(category)}</span>`)
    .join("");
  const profileBadges = state.passFilter === "all"
    ? access.map((label) => `<span class="badge">${escapeHtml(label)}</span>`).join("")
    : "";

  card.innerHTML = `
    <div class="card-header">
      <div class="logo ${resource.icon_url ? "" : "generated"}">
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
    <p class="description">${escapeHtml(description)}${descriptionToggle}</p>
    ${accessInstruction}
    <div class="badges">
      <span class="badge category">${escapeHtml(resource.category)}</span>
      ${secondaryCategoryBadges}
      <span class="badge ${accessModeClass}">${escapeHtml(accessModeLabel)}</span>
      ${profileBadges}
    </div>
  `;

  card.addEventListener("click", () => {
    openResource(resource.url);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openResource(resource.url);
    }
  });

  card.querySelector(".favorite-button").addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFavorite(resource.id);
  });

  card.querySelector(".favorite-button").addEventListener("keydown", (event) => {
    event.stopPropagation();
  });

  card.querySelector(".favorite-button").addEventListener("keyup", (event) => {
    event.stopPropagation();
  });

  const descriptionButton = card.querySelector(".description-toggle");
  if (descriptionButton) {
    descriptionButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleDescription(resource.id);
    });

    descriptionButton.addEventListener("keydown", (event) => {
      event.stopPropagation();
    });

    descriptionButton.addEventListener("keyup", (event) => {
      event.stopPropagation();
    });
  }

  card.querySelectorAll(".access-instruction a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    link.addEventListener("keydown", (event) => {
      event.stopPropagation();
    });

    link.addEventListener("keyup", (event) => {
      event.stopPropagation();
    });
  });

  return card;
}

function renderAccessInstruction(resource) {
  const instruction = resource.access_instruction;
  if (!instruction?.text) {
    return "";
  }

  const links = (instruction.links ?? [])
    .map((link) => {
      if (!link?.url || !link?.label) {
        return "";
      }

      return `<a href="${escapeAttribute(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`;
    })
    .filter(Boolean)
    .join(" ");

  return `
    <p class="access-instruction">
      <strong>Accès :</strong> ${escapeHtml(instruction.text)}${links ? ` ${links}` : ""}
    </p>
  `;
}

function getAccessMode(resource) {
  if (resource.access_mode && accessModeLabels[resource.access_mode]) {
    return resource.access_mode;
  }

  return resource.remote ? "remote" : "onsite";
}

function getAccessModeLabel(resource) {
  return resource.access_label || accessModeLabels[getAccessMode(resource)] || accessModeLabels.onsite;
}

function getOfficialDescription(resource) {
  const entries = resource.bnf_official?.entries ?? [];
  const descriptions = entries
    .map((entry) => entry.description?.trim())
    .filter(Boolean);

  if (descriptions.length === 0) {
    return "";
  }

  if (descriptions.length === 1) {
    return descriptions[0];
  }

  return entries
    .map((entry) => {
      const description = entry.description?.trim();
      if (!description) {
        return "";
      }

      return `${entry.title} : ${description}`;
    })
    .filter(Boolean)
    .join("\n\n");
}

function toggleDescription(resourceId) {
  if (state.expandedDescriptions.has(resourceId)) {
    state.expandedDescriptions.delete(resourceId);
  } else {
    state.expandedDescriptions.add(resourceId);
  }

  render();
}

function openResource(url) {
  window.open(url, "_blank", "noreferrer");
}

function loadFavorites() {
  const ready = readStoredValue(favoriteStorageReadyKey) === "true";
  const stored = readStoredValue(favoriteStorageKey);

  if (ready && stored) {
    try {
      state.favorites = new Set(JSON.parse(stored));
      state.favoritesReady = true;
      return;
    } catch {
      state.favorites = new Set();
    }
  }

  state.favorites = new Set(
    state.resources
      .filter((resource) => resource.default_favorite)
      .map((resource) => resource.id),
  );
  state.favoritesReady = true;
  saveFavorites();
}

function loadFavoriteOrder() {
  state.favoriteOrderCustom = readStoredValue(favoriteOrderCustomStorageKey) === "true";

  if (!state.favoriteOrderCustom) {
    state.favoriteOrder = [];
    return;
  }

  try {
    state.favoriteOrder = JSON.parse(readStoredValue(favoriteOrderStorageKey) ?? "[]");
  } catch {
    state.favoriteOrder = [];
  }

  syncFavoriteOrder();
  normalizeFavoriteOrderMode();
}

function loadProfileFilters() {
  const storedPass = readStoredValue(passFilterStorageKey);
  const storedRemote = readStoredValue(remoteFilterStorageKey);

  if ([...passFilter.options].some((option) => option.value === storedPass)) {
    state.passFilter = storedPass;
  }

  if ([...remoteFilter.options].some((option) => option.value === storedRemote)) {
    state.remoteFilter = storedRemote;
  } else if (storedRemote === "remote_conditional" || storedRemote === "free") {
    state.remoteFilter = "remote";
  }

  passFilter.value = state.passFilter;
  remoteFilter.value = state.remoteFilter;
  syncProfileFilterState();
}

function saveProfileFilters() {
  writeStoredValue(passFilterStorageKey, state.passFilter);
  writeStoredValue(remoteFilterStorageKey, state.remoteFilter);
}

function syncProfileFilterState() {
  const hasSelectedProfile = state.passFilter !== "all";
  passFilter.classList.toggle("has-selected-profile", hasSelectedProfile);
  passFilter.closest("label")?.classList.toggle("has-selected-profile", hasSelectedProfile);
}

function syncFavoriteOrder() {
  if (!state.favoriteOrderCustom) {
    return;
  }

  const previous = state.favoriteOrder.join("|");
  const favoriteIds = new Set(state.favorites);
  const ordered = state.favoriteOrder.filter((id) => favoriteIds.has(id));
  const knownIds = new Set(ordered);
  const missing = getAlphaFavoriteResources()
    .map((resource) => resource.id)
    .filter((id) => !knownIds.has(id));

  state.favoriteOrder = [...ordered, ...missing];

  if (state.favoriteOrder.join("|") !== previous) {
    saveFavoriteOrder();
  }
}

function normalizeFavoriteOrderMode() {
  if (!state.favoriteOrderCustom) {
    return;
  }

  const alphaOrder = getAlphaFavoriteIds();

  if (!sameOrder(state.favoriteOrder, alphaOrder)) {
    return;
  }

  state.favoriteOrder = [];
  state.favoriteOrderCustom = false;
  saveFavoriteOrder();
}

function getAlphaFavoriteIds() {
  return getAlphaFavoriteResources().map((resource) => resource.id);
}

function sameOrder(left, right) {
  return left.length === right.length && left.every((id, index) => id === right[index]);
}

function saveFavorites() {
  writeStoredValue(favoriteStorageKey, JSON.stringify([...state.favorites]));
  writeStoredValue(favoriteStorageReadyKey, "true");
}

function saveFavoriteOrder() {
  writeStoredValue(favoriteOrderStorageKey, JSON.stringify(state.favoriteOrder));
  writeStoredValue(favoriteOrderCustomStorageKey, String(state.favoriteOrderCustom));
}

function toggleFavorite(resourceId) {
  const isFavorite = state.favorites.has(resourceId);

  if (isFavorite) {
    state.favorites.delete(resourceId);
    state.favoriteOrder = state.favoriteOrder.filter((id) => id !== resourceId);
    state.draftFavoriteOrder = state.draftFavoriteOrder.filter((id) => id !== resourceId);
  } else {
    state.favorites.add(resourceId);
    if (state.favoriteOrderCustom && !state.favoriteOrder.includes(resourceId)) {
      state.favoriteOrder.push(resourceId);
    }
    if (state.quickLaunchEditing && !state.draftFavoriteOrder.includes(resourceId)) {
      state.draftFavoriteOrder.push(resourceId);
    }
  }

  saveFavorites();
  if (state.favoriteOrderCustom) {
    saveFavoriteOrder();
  }
  render();
}

function startQuickLaunchEdit(event) {
  if (state.quickLaunchEditing || state.quickLaunchTransitioning) {
    return;
  }

  const button = event?.currentTarget;
  if (button && !prefersReducedMotion()) {
    state.quickLaunchTransitioning = true;
    button.disabled = true;
    button.classList.add("is-exiting");
    window.setTimeout(enterQuickLaunchEdit, 170);
    return;
  }

  enterQuickLaunchEdit();
}

function enterQuickLaunchEdit() {
  state.quickLaunchTransitioning = false;
  state.quickLaunchEditing = true;
  state.quickLaunchActionsEntering = !prefersReducedMotion();
  state.draftFavoriteOrder = getFavoriteResources().map((resource) => resource.id);
  render();
}

function saveQuickLaunchOrder() {
  leaveQuickLaunchEdit(() => {
    const savedOrder = state.draftFavoriteOrder.filter((id) => state.favorites.has(id));
    state.favorites = new Set(savedOrder);

    if (sameOrder(savedOrder, getAlphaFavoriteIds())) {
      state.favoriteOrder = [];
      state.favoriteOrderCustom = false;
    } else {
      state.favoriteOrder = savedOrder;
      state.favoriteOrderCustom = true;
    }

    saveFavorites();
    saveFavoriteOrder();
  });
}

function cancelQuickLaunchEdit() {
  leaveQuickLaunchEdit();
}

function resetQuickLaunchOrder() {
  leaveQuickLaunchEdit(() => {
    state.favorites = new Set(state.draftFavoriteOrder.filter((id) => state.favorites.has(id)));
    state.favoriteOrder = [];
    state.favoriteOrderCustom = false;
    saveFavorites();
    saveFavoriteOrder();
  });
}

function leaveQuickLaunchEdit(applyExitAction = null) {
  if (!state.quickLaunchEditing || state.quickLaunchTransitioning) {
    return;
  }

  state.quickLaunchPendingExitAction = applyExitAction;

  if (prefersReducedMotion()) {
    finishQuickLaunchExit();
    return;
  }

  state.quickLaunchTransitioning = true;
  state.quickLaunchActionsExiting = true;
  render();
  window.setTimeout(finishQuickLaunchExit, 210);
}

function finishQuickLaunchExit() {
  state.quickLaunchPendingExitAction?.();
  state.quickLaunchPendingExitAction = null;
  state.quickLaunchTransitioning = false;
  state.quickLaunchActionsExiting = false;
  state.quickLaunchEditing = false;
  state.quickLaunchModifierEntering = !prefersReducedMotion();
  state.draftFavoriteOrder = [];
  state.dragging = null;
  render();
}

function handleQuickLaunchRemove(event) {
  event.preventDefault();
  event.stopPropagation();
  const resourceId = event.currentTarget.dataset.resourceId;
  state.draftFavoriteOrder = state.draftFavoriteOrder.filter((id) => id !== resourceId);
  state.dragging = null;
  render();
}

function stopQuickLaunchRemoveEvent(event) {
  event.stopPropagation();
}

function resetQuickLaunchActionAnimationFlag() {
  if (!state.quickLaunchActionsEntering && !state.quickLaunchModifierEntering) {
    return;
  }

  requestAnimationFrame(() => {
    state.quickLaunchActionsEntering = false;
    state.quickLaunchModifierEntering = false;
  });
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function handleQuickLaunchPointerDown(event) {
  if (!state.quickLaunchEditing || event.button > 0) {
    return;
  }

  event.preventDefault();
  state.dragging = {
    id: event.currentTarget.dataset.resourceId,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    active: false,
  };

  window.addEventListener("pointermove", handleQuickLaunchPointerMove, { passive: false });
  window.addEventListener("pointerup", handleQuickLaunchPointerUp);
  window.addEventListener("pointercancel", handleQuickLaunchPointerUp);
}

function preventQuickLaunchEditContextMenu(event) {
  if (!state.quickLaunchEditing) {
    return;
  }

  event.preventDefault();
}

function handleQuickLaunchPointerMove(event) {
  if (!state.dragging) {
    return;
  }

  event.preventDefault();

  const distance = Math.abs(event.clientX - state.dragging.startX) + Math.abs(event.clientY - state.dragging.startY);
  state.dragging.active = state.dragging.active || distance > 4;

  const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".quick-launch-item");
  const overId = target?.dataset.resourceId;

  if (overId && overId !== state.dragging.id && state.draftFavoriteOrder.includes(overId)) {
    moveDraftFavorite(state.dragging.id, overId);
    renderQuickLaunch();
  }
}

function handleQuickLaunchPointerUp() {
  window.removeEventListener("pointermove", handleQuickLaunchPointerMove);
  window.removeEventListener("pointerup", handleQuickLaunchPointerUp);
  window.removeEventListener("pointercancel", handleQuickLaunchPointerUp);
  state.dragging = null;
  renderQuickLaunch();
}

function handleQuickLaunchKeyDown(event) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
    return;
  }

  event.preventDefault();
  const resourceId = event.currentTarget.dataset.resourceId;
  const currentIndex = state.draftFavoriteOrder.indexOf(resourceId);
  let nextIndex = currentIndex;

  if (event.key === "ArrowLeft") {
    nextIndex = Math.max(0, currentIndex - 1);
  }
  if (event.key === "ArrowRight") {
    nextIndex = Math.min(state.draftFavoriteOrder.length - 1, currentIndex + 1);
  }
  if (event.key === "Home") {
    nextIndex = 0;
  }
  if (event.key === "End") {
    nextIndex = state.draftFavoriteOrder.length - 1;
  }

  if (nextIndex !== currentIndex) {
    state.draftFavoriteOrder.splice(currentIndex, 1);
    state.draftFavoriteOrder.splice(nextIndex, 0, resourceId);
    renderQuickLaunch();
    [...quickLaunch.querySelectorAll(".quick-launch-item")]
      .find((item) => item.dataset.resourceId === resourceId)
      ?.focus();
  }
}

function moveDraftFavorite(movedId, targetId) {
  const currentIndex = state.draftFavoriteOrder.indexOf(movedId);
  const targetIndex = state.draftFavoriteOrder.indexOf(targetId);

  if (currentIndex === -1 || targetIndex === -1 || currentIndex === targetIndex) {
    return;
  }

  state.draftFavoriteOrder.splice(currentIndex, 1);
  state.draftFavoriteOrder.splice(targetIndex, 0, movedId);
}

function readStoredValue(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStoredValue(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Favoris non persistants si le navigateur bloque le stockage local.
  }
}

function getFallbackLabel(resource) {
  return resource.fallback_label || getInitials(resource.name);
}

function renderIcon(resource, context) {
  const src = escapeAttribute(resource.icon_url);
  const alt = context === "card" ? escapeAttribute(resource.icon_alt ?? "") : "";
  const color = getIconBackgroundColor(resource);

  if (!color || !isSvgIcon(resource.icon_url)) {
    return `<img src="${src}" alt="${alt}" loading="lazy">`;
  }

  return `
    <span
      class="themed-svg-icon"
      data-icon-src="${src}"
      data-icon-color="${escapeAttribute(color)}"
    >
      <img src="${src}" alt="${alt}" loading="lazy">
    </span>
  `;
}

function getIconBackgroundColor(resource) {
  const color = resource.icon_background_color;
  return typeof color === "string" && /^#[0-9a-f]{6}$/i.test(color) ? color : "";
}

function isSvgIcon(url) {
  return typeof url === "string" && /\.svg(?:[?#].*)?$/i.test(url);
}

function hydrateThemedSvgIcons(root = document) {
  root.querySelectorAll(".themed-svg-icon[data-icon-src][data-icon-color]").forEach((target) => {
    if (target.dataset.hydrated === "true") {
      return;
    }

    target.dataset.hydrated = "true";
    loadThemedSvg(target.dataset.iconSrc, target.dataset.iconColor)
      .then((svg) => {
        if (svg) {
          target.replaceChildren(svg);
        }
      })
      .catch(() => {
        // Le <img> de secours reste affiché si le SVG ne peut pas être préparé.
      });
  });
}

async function loadThemedSvg(src, color) {
  const cacheKey = `${src}|${color}`;
  const cached = themedSvgCache.get(cacheKey);
  if (cached) {
    return cached.cloneNode(true);
  }

  const response = await fetch(src);
  if (!response.ok) {
    return null;
  }

  const svg = buildThemedSvg(await response.text(), color);
  if (!svg) {
    return null;
  }

  themedSvgCache.set(cacheKey, svg);
  return svg.cloneNode(true);
}

function buildThemedSvg(svgText, color) {
  const documentSvg = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const svg = documentSvg.querySelector("svg");
  if (!svg || documentSvg.querySelector("parsererror")) {
    return null;
  }

  svg.querySelectorAll("script, foreignObject").forEach((node) => node.remove());
  const sourceColor = findPrimarySvgColor(svg);
  if (!sourceColor) {
    return null;
  }

  replaceSvgColor(svg, sourceColor, color);
  svg.removeAttribute("id");
  svg.removeAttribute("x");
  svg.removeAttribute("y");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("themed-svg-icon__svg");
  return svg;
}

function findPrimarySvgColor(svg) {
  const colors = new Map();
  svg.querySelectorAll("*").forEach((node) => {
    for (const color of getNodeFillColors(node)) {
      const normalized = normalizeHexColor(color);
      if (normalized && normalized !== "#ffffff" && normalized !== "#000000") {
        colors.set(normalized, (colors.get(normalized) ?? 0) + 1);
      }
    }
  });

  return [...colors.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
}

function getNodeFillColors(node) {
  const colors = [];
  const fill = node.getAttribute("fill");
  const style = node.getAttribute("style");

  if (fill) {
    colors.push(fill);
  }

  if (style) {
    const match = style.match(/(?:^|;)\s*fill\s*:\s*([^;]+)/i);
    if (match) {
      colors.push(match[1]);
    }
  }

  return colors;
}

function replaceSvgColor(svg, sourceColor, targetColor) {
  svg.querySelectorAll("*").forEach((node) => {
    if (normalizeHexColor(node.getAttribute("fill")) === sourceColor) {
      node.setAttribute("fill", targetColor);
    }

    const style = node.getAttribute("style");
    if (!style) {
      return;
    }

    node.setAttribute(
      "style",
      style.replace(/((?:^|;)\s*fill\s*:\s*)(#[0-9a-f]{3,6})/gi, (match, prefix, color) => (
        normalizeHexColor(color) === sourceColor ? `${prefix}${targetColor}` : match
      )),
    );
  });
}

function normalizeHexColor(color) {
  if (typeof color !== "string") {
    return "";
  }

  const trimmed = color.trim();
  if (/^#[0-9a-f]{6}$/i.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  if (/^#[0-9a-f]{3}$/i.test(trimmed)) {
    return `#${[...trimmed.slice(1)].map((char) => char + char).join("")}`.toLowerCase();
  }

  return "";
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

passFilter.addEventListener("change", (event) => {
  state.passFilter = event.target.value;
  syncProfileFilterState();
  saveProfileFilters();
  renderResourceGridWithTransition();
});

remoteFilter.addEventListener("change", (event) => {
  state.remoteFilter = event.target.value;
  saveProfileFilters();
  renderResourceGridWithTransition();
});

jumpToSearch.addEventListener("click", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targetTop = Math.max(0, searchControls.getBoundingClientRect().top + window.scrollY - 14);
  window.scrollTo({
    top: targetTop,
    behavior: reduceMotion ? "auto" : "smooth",
  });
});

init().catch((error) => {
  grid.innerHTML = `<p class="empty">Impossible de charger les ressources.</p>`;
  console.error(error);
});
