const params = new URLSearchParams(window.location.search);
const query = params.get("q") || "";
const source = params.get("source") || "";
const cids = params.get("cids") || "";
const pressreaderProxyOrigin = "https://www-pressreader-com.bnf.idm.oclc.org";

const resource = document.querySelector("#pressreaderSearchResource");
const status = document.querySelector("#pressreaderSearchStatus");
const queryOutput = document.querySelector("#pressreaderSearchQuery");
const sourceOutput = document.querySelector("#pressreaderSearchSource");
const cidsOutput = document.querySelector("#pressreaderSearchCids");
const openLink = document.querySelector("#openPressReaderSearch");
const alternatives = document.querySelector("#pressreaderSearchAlternatives");
const alternativeLinks = document.querySelector("#pressreaderSearchAlternativeLinks");

function init() {
  const queryOptions = parseQueryOptions(params.get("queries"), query);
  const cleanQuery = queryOptions[0] || humanize(query);
  const cleanCids = normalizeCids(cids);

  if (!cleanQuery || !cleanCids) {
    status.textContent = "Aucune recherche PressReader exploitable n'a été trouvée dans ce lien.";
    openLink.removeAttribute("href");
    openLink.setAttribute("aria-disabled", "true");
    return;
  }

  const displaySource = source || "Titre PressReader détecté";
  const targetUrl = buildPressReaderSearchUrl(cleanQuery, cleanCids);

  resource.textContent = `${displaySource} - recherche dans PressReader`;
  queryOutput.textContent = cleanQuery;
  sourceOutput.textContent = displaySource;
  cidsOutput.textContent = cleanCids;
  openLink.href = targetUrl;
  status.textContent = "Recherche prête. L'ouverture fonctionnera si l'accès PressReader BnF est disponible dans ce navigateur.";
  renderAlternativeLinks(queryOptions, cleanQuery, cleanCids);
}

function buildPressReaderSearchUrl(searchQuery, cidList, options = {}) {
  const url = new URL("/search/articles", pressreaderProxyOrigin);
  url.searchParams.set("query", searchQuery);

  if (options.scope === "all") {
    url.searchParams.set("in", "ALL");
  } else {
    url.searchParams.set("cids", cidList);
  }

  url.searchParams.set("date", "Anytime");
  url.searchParams.set("hideSimilar", "0");
  url.searchParams.set("type", "2");
  url.searchParams.set("state", "2");
  url.searchParams.set("searchFor", "Articles");
  return url.href;
}

function renderAlternativeLinks(queryOptions, primaryQuery, cidList) {
  const links = queryOptions
    .filter((item) => item !== primaryQuery)
    .slice(0, 4)
    .map((item, index) => ({
      label: `Variante ${index + 1}`,
      query: item,
      href: buildPressReaderSearchUrl(item, cidList),
    }));

  links.push({
    label: "Recherche large",
    query: primaryQuery,
    href: buildPressReaderSearchUrl(primaryQuery, cidList, { scope: "all" }),
  });

  alternativeLinks.innerHTML = links
    .map((item) => `
      <a class="pressreader-search-alternative" href="${escapeAttribute(item.href)}" rel="noreferrer">
        <span>${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.query)}</strong>
      </a>
    `)
    .join("");

  alternatives.hidden = links.length === 0;
}

function parseQueryOptions(value, fallback) {
  const parsed = parseJsonQueryOptions(value);
  const candidates = Array.isArray(parsed) ? parsed : String(value ?? "").split("||");
  const queries = uniqueQueries([...candidates, fallback]);

  return queries.length ? queries : uniqueQueries([fallback]);
}

function parseJsonQueryOptions(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function uniqueQueries(values) {
  const queries = [];
  const seen = new Set();

  for (const value of values) {
    const query = humanize(value);
    const comparable = query.toLowerCase();

    if (!query || seen.has(comparable)) {
      continue;
    }

    queries.push(query);
    seen.add(comparable);
  }

  return queries;
}

function normalizeCids(value) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .join(",");
}

function humanize(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

init();
