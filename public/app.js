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
  draftFavoriteOrder: [],
  dragging: null,
  query: "",
};

const grid = document.querySelector("#resourceGrid");
const filters = document.querySelector("#categoryFilters");
const searchInput = document.querySelector("#searchInput");
const passFilter = document.querySelector("#passFilter");
const remoteFilter = document.querySelector("#remoteFilter");
const resultCount = document.querySelector("#resultCount");
const quickLaunch = document.querySelector("#quickLaunch");
const favoriteStorageKey = "bnf-access:favorites:v1";
const favoriteStorageReadyKey = "bnf-access:favorites-ready:v1";
const favoriteOrderStorageKey = "bnf-access:favorite-order:v1";
const favoriteOrderCustomStorageKey = "bnf-access:favorite-order-custom:v1";
const passFilterStorageKey = "bnf-access:pass-filter:v1";
const remoteFilterStorageKey = "bnf-access:remote-filter:v1";

const accessLabels = {
  pass_lecture_culture: "Pass Lecture/Culture",
  pass_recherche: "Pass Recherche",
  pass_recherche_illimite: "Pass Recherche illimité",
  public: "Accès libre",
};

async function init() {
  const response = await fetch("./resources.json");
  const data = await response.json();
  state.resources = data.resources;
  loadFavorites();
  loadFavoriteOrder();
  loadProfileFilters();
  renderFilters();
  render();
}

function renderFilters() {
  const categories = ["Toutes", ...new Set(state.resources.map((resource) => resource.category))];
  filters.innerHTML = "";

  for (const category of categories) {
    const button = document.createElement("button");
    button.className = "filter-button";
    button.type = "button";
    button.textContent = category;
    button.setAttribute("aria-pressed", String(category === state.category));
    button.addEventListener("click", () => {
      state.category = category;
      renderFilters();
      render();
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
    render();
  });
  filters.prepend(favoriteButton);
}

function render() {
  renderQuickLaunch();
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
}

function renderQuickLaunch() {
  const favorites = state.quickLaunchEditing ? getResourcesByIds(state.draftFavoriteOrder) : getFavoriteResources();
  quickLaunch.innerHTML = "";
  quickLaunch.hidden = favorites.length === 0;
  quickLaunch.classList.toggle("is-editing", state.quickLaunchEditing);

  if (!favorites.length) {
    return;
  }

  quickLaunch.append(createQuickLaunchHeader(favorites));

  const list = document.createElement("div");
  list.className = "quick-launch-list";
  list.setAttribute("aria-label", state.quickLaunchEditing ? "Favoris a reorganiser" : "Favoris");

  for (const resource of favorites) {
    const item = document.createElement(state.quickLaunchEditing ? "button" : "a");
    item.className = "quick-launch-item";
    item.title = resource.name;
    item.setAttribute("aria-label", resource.name);
    item.dataset.resourceId = resource.id;
    item.innerHTML = resource.icon_url
      ? `<img src="${escapeAttribute(resource.icon_url)}" alt="" loading="lazy">`
      : `<span>${escapeHtml(getInitials(resource.name))}</span>`;

    if (state.quickLaunchEditing) {
      item.type = "button";
      item.classList.toggle("is-dragging", state.dragging?.id === resource.id);
      item.addEventListener("pointerdown", handleQuickLaunchPointerDown);
      item.addEventListener("keydown", handleQuickLaunchKeyDown);
    } else {
      item.href = resource.url;
      item.target = "_blank";
      item.rel = "noreferrer";
    }

    list.append(item);
  }

  quickLaunch.append(list);
}

function createQuickLaunchHeader(favorites) {
  const header = document.createElement("div");
  header.className = "quick-launch-header";

  const title = document.createElement("h2");
  title.className = "quick-launch-title";
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

  if (favorites.length > 1) {
    actions.append(createActionButton("Modifier", startQuickLaunchEdit, "neutral"));
  }

  header.append(actions);
  return header;
}

function createActionButton(label, onClick, tone = "neutral") {
  const button = document.createElement("button");
  button.className = `quick-launch-action ${tone}`;
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);
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
      const matchesCategory = state.category === "Toutes" || resource.category === state.category;
      const matchesFavorite = !state.favoritesOnly || state.favorites.has(resource.id);
      const matchesPass = matchesPassFilter(resource);
      const matchesRemote =
        state.remoteFilter === "all" ||
        (state.remoteFilter === "remote" && resource.remote) ||
        (state.remoteFilter === "onsite" && !resource.remote);
      const haystack = normalize([
        resource.name,
        resource.category,
        resource.description,
        ...(resource.tags ?? []),
      ].join(" "));
      return matchesCategory && matchesFavorite && matchesPass && matchesRemote && (!query || haystack.includes(query));
    })
    .sort((a, b) => {
      const favoriteDelta = Number(state.favorites.has(b.id)) - Number(state.favorites.has(a.id));
      return favoriteDelta || a.name.localeCompare(b.name, "fr");
    });
}

function matchesPassFilter(resource) {
  if (state.passFilter === "all") {
    return true;
  }

  const access = resource.access ?? [];

  if (access.includes(state.passFilter)) {
    return true;
  }

  return state.remoteFilter === "onsite" && !resource.remote && access.length === 0;
}

function createCard(resource) {
  const card = document.createElement("article");
  card.className = "card";

  const access = (resource.access ?? []).map((item) => accessLabels[item] ?? item);
  const remoteLabel = resource.remote ? "Accès distant" : "Sur place ou à vérifier";
  const isFavorite = state.favorites.has(resource.id);
  const logo = resource.icon_url
    ? `<img src="${escapeAttribute(resource.icon_url)}" alt="${escapeAttribute(resource.icon_alt ?? "")}" loading="lazy">`
    : `<span>${escapeHtml(getInitials(resource.name))}</span>`;

  card.innerHTML = `
    <div class="media-row">
      <div class="logo ${resource.icon_url ? "" : "generated"}">
        ${logo}
      </div>
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
    <div class="card-top">
      <h3>${escapeHtml(resource.name)}</h3>
      <span class="category">${escapeHtml(resource.category)}</span>
    </div>
    <p class="description">${escapeHtml(resource.description)}</p>
    <div class="badges">
      <span class="badge ${resource.remote ? "remote" : "onsite"}">${remoteLabel}</span>
      ${access.map((label) => `<span class="badge">${escapeHtml(label)}</span>`).join("")}
    </div>
    <div class="card-actions">
      <a class="card-link" href="${escapeAttribute(resource.url)}" target="_blank" rel="noreferrer">Ouvrir</a>
    </div>
  `;

  card.querySelector(".favorite-button").addEventListener("click", () => {
    toggleFavorite(resource.id);
  });

  return card;
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
}

function loadProfileFilters() {
  const storedPass = readStoredValue(passFilterStorageKey);
  const storedRemote = readStoredValue(remoteFilterStorageKey);

  if ([...passFilter.options].some((option) => option.value === storedPass)) {
    state.passFilter = storedPass;
  }

  if ([...remoteFilter.options].some((option) => option.value === storedRemote)) {
    state.remoteFilter = storedRemote;
  }

  passFilter.value = state.passFilter;
  remoteFilter.value = state.remoteFilter;
}

function saveProfileFilters() {
  writeStoredValue(passFilterStorageKey, state.passFilter);
  writeStoredValue(remoteFilterStorageKey, state.remoteFilter);
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

function startQuickLaunchEdit() {
  state.quickLaunchEditing = true;
  state.draftFavoriteOrder = getFavoriteResources().map((resource) => resource.id);
  render();
}

function saveQuickLaunchOrder() {
  state.favoriteOrder = state.draftFavoriteOrder.filter((id) => state.favorites.has(id));
  state.favoriteOrderCustom = true;
  state.quickLaunchEditing = false;
  state.draftFavoriteOrder = [];
  saveFavoriteOrder();
  render();
}

function cancelQuickLaunchEdit() {
  state.quickLaunchEditing = false;
  state.draftFavoriteOrder = [];
  state.dragging = null;
  render();
}

function resetQuickLaunchOrder() {
  state.favoriteOrder = [];
  state.favoriteOrderCustom = false;
  state.quickLaunchEditing = false;
  state.draftFavoriteOrder = [];
  state.dragging = null;
  saveFavoriteOrder();
  render();
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
  saveProfileFilters();
  render();
});

remoteFilter.addEventListener("change", (event) => {
  state.remoteFilter = event.target.value;
  saveProfileFilters();
  render();
});

init().catch((error) => {
  grid.innerHTML = `<p class="empty">Impossible de charger les ressources.</p>`;
  console.error(error);
});
