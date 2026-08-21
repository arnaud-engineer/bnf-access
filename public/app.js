const state = {
  resources: [],
  category: "Toutes",
  query: "",
};

const grid = document.querySelector("#resourceGrid");
const filters = document.querySelector("#categoryFilters");
const searchInput = document.querySelector("#searchInput");
const resultCount = document.querySelector("#resultCount");

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
  return state.resources.filter((resource) => {
    const matchesCategory = state.category === "Toutes" || resource.category === state.category;
    const haystack = normalize([
      resource.name,
      resource.category,
      resource.description,
      ...(resource.tags ?? []),
    ].join(" "));
    return matchesCategory && (!query || haystack.includes(query));
  });
}

function createCard(resource) {
  const card = document.createElement("article");
  card.className = "card";

  const access = (resource.access ?? []).map((item) => accessLabels[item] ?? item);
  const remoteLabel = resource.remote ? "Acces distant" : "Sur place ou a verifier";

  card.innerHTML = `
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

  return card;
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

