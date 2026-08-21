const state = {
  resources: [],
  category: "Toutes",
  favorites: new Set(),
  favoritesReady: false,
  favoritesOnly: false,
  query: "",
};

const grid = document.querySelector("#resourceGrid");
const filters = document.querySelector("#categoryFilters");
const searchInput = document.querySelector("#searchInput");
const resultCount = document.querySelector("#resultCount");
const favoriteStorageKey = "bnf-access:favorites:v1";
const favoriteStorageReadyKey = "bnf-access:favorites-ready:v1";

const accessLabels = {
  pass_lecture_culture: "Pass Lecture/Culture",
  pass_recherche: "Pass Recherche",
  pass_recherche_illimite: "Pass Recherche illimite",
  public: "Acces libre",
};

async function init() {
  const response = await fetch("./resources.json");
  const data = await response.json();
  state.resources = data.resources;
  loadFavorites();
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
  const resources = getFilteredResources();
  resultCount.textContent = `${resources.length} ressource${resources.length > 1 ? "s" : ""}`;
  grid.innerHTML = "";

  if (!resources.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Aucune ressource ne correspond a cette recherche.";
    grid.append(empty);
    return;
  }

  for (const resource of resources) {
    grid.append(createCard(resource));
  }
}

function getFilteredResources() {
  const query = normalize(state.query);
  return state.resources
    .filter((resource) => {
      const matchesCategory = state.category === "Toutes" || resource.category === state.category;
      const matchesFavorite = !state.favoritesOnly || state.favorites.has(resource.id);
      const haystack = normalize([
        resource.name,
        resource.category,
        resource.description,
        ...(resource.tags ?? []),
      ].join(" "));
      return matchesCategory && matchesFavorite && (!query || haystack.includes(query));
    })
    .sort((a, b) => {
      const favoriteDelta = Number(state.favorites.has(b.id)) - Number(state.favorites.has(a.id));
      return favoriteDelta || a.name.localeCompare(b.name, "fr");
    });
}

function createCard(resource) {
  const card = document.createElement("article");
  card.className = "card";

  const access = (resource.access ?? []).map((item) => accessLabels[item] ?? item);
  const remoteLabel = resource.remote ? "Acces distant" : "Sur place ou a verifier";
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
      <a class="source-link" href="${escapeAttribute(resource.source)}" target="_blank" rel="noreferrer">Source</a>
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

function saveFavorites() {
  writeStoredValue(favoriteStorageKey, JSON.stringify([...state.favorites]));
  writeStoredValue(favoriteStorageReadyKey, "true");
}

function toggleFavorite(resourceId) {
  if (state.favorites.has(resourceId)) {
    state.favorites.delete(resourceId);
  } else {
    state.favorites.add(resourceId);
  }
  saveFavorites();
  render();
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

init().catch((error) => {
  grid.innerHTML = `<p class="empty">Impossible de charger les ressources.</p>`;
  console.error(error);
});
