import {createBookPresentation} from './features/books/presentation.js';
import {bookFavoriteId as favoriteId, filterBooks, indexBookCatalog, isFavoriteBook} from './features/books/model.js?v=2026-10-04-known-language';

export function createBookSearch({
         input,
         mirrors = [],
         suggestions,
         getContext,
         createPlatformLogo,
         selectBooks,
         onFavoritesChange,
         getFavoriteIds,
         toggleFavoriteBook,
         onCatalogReady,
         getSuggestionGroups = () => [],
         shouldSuggest = () => true
       }) {
  const favoriteKey = "bnf-access:v2:book-favorites:v1";
  let legacyFavorites = new Set();
  try {
    const saved = JSON.parse(localStorage.getItem(favoriteKey) || "[]");
    if (Array.isArray(saved)) legacyFavorites = new Set(saved.filter((value) => typeof value === "string"));
  } catch { /* Unavailable or malformed storage must not prevent browsing. */ }
  let books = null;
  let defaultFavorites = [];
  const favoriteBooks = new Map();

  let pending = null;
  let error = false;
  let timer;
  let matches = [];
  let active = -1;
  let limit = 40;
  let lastQuery = "";
  let gridTarget = null;
  let gridVersion = 0;
  let moreObserver = null;
  let dismissed = false;
  let selectedBookId = null;
  let focusSelection = false;
  let suggestionVersion = 0;

  const clearButton = document.querySelector("#searchClear");
  const searchInputs = [input, ...mirrors.map(mirror => mirror.input)];
  const syncClear = () => {
    if (clearButton) clearButton.hidden = !input.value.length;
    for (const mirror of mirrors) {
      if (mirror.input.value !== input.value) mirror.input.value = input.value;
      mirror.clear.hidden = !input.value.length;
    }
  };
  for (const mirror of mirrors) {
    mirror.input.addEventListener("input", () => {
      input.value = mirror.input.value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    mirror.clear.addEventListener("pointerdown", event => event.preventDefault());
    mirror.clear.addEventListener("click", () => {
      mirror.input.value = "";
      mirror.input.focus({ preventScroll: true });
      mirror.input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    mirror.input.addEventListener("keydown", event => {
      if (event.key === "Enter") { event.preventDefault(); mirror.input.blur(); }
    });
    mirror.input.addEventListener("focus", () => { dismissed = true; close(); });
  }
  clearButton?.addEventListener("pointerdown", (event) => event.preventDefault());
  clearButton?.addEventListener("click", () => {
    input.value = "";
    input.focus({ preventScroll: true });
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  const selection = { platform: "", publisher: "", category: "" };

  async function load() {
    if (books) return books;
    if (pending) return pending;
    error = false;
    pending = fetch(new URL("../../private/books/build/catalog.json", import.meta.url))
      .then((response) => {
        if (!response.ok) throw new Error("Book catalogue unavailable");
        return response.json();
      }).then((data) => {
        const indexed = indexBookCatalog(data);
        books = indexed.books;
        for (const [id, book] of indexed.favoriteBooks) favoriteBooks.set(id, book);
        defaultFavorites = indexed.defaultFavorites;
        onCatalogReady?.();
        return books;
      }).catch(() => { error = true; return null; })
      .finally(() => { pending = null; });
    return pending;
  }

  function filtered(ignore = "", forSuggestions = false) {
    const context = getContext();
    return filterBooks(books, {context, selection, favoriteIds: getFavoriteIds(),
      query: context.query ?? input.value, ignore, forSuggestions});
  }

  function close() {
    suggestions.hidden = true;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    active = -1;
  }

  function appendOfficialSearch() {
    suggestions.querySelector(".search-official")?.remove();
    const url = new URL("https://publications.ebsco.com/");
    url.search = new URLSearchParams({
      custId: "s1149613", groupId: "testpm", profileId: "pfi",
      search: input.value.trim(), searchField: "keyword",
    }).toString();
    const footer = text("div", "", "search-official");
    const link = text("a", "Recherche officielle BnF", "search-official-link");
    link.href = url.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = "Ouvrir votre recherche dans le catalogue officiel des livres et revues de la BnF, dans un nouvel onglet. Catalogue plus étendu, sans les filtres de BnF Access.";
    link.setAttribute("aria-label", "Recherche officielle BnF : ouvrir votre recherche dans un nouvel onglet");
    footer.append(link);
    suggestions.append(footer);
  }

  async function suggest() {
    if (!shouldSuggest()) { close(); return; }
    if (suggestions.contains(document.activeElement)) return;
    if (dismissed || !shouldSuggest() || document.activeElement !== input || input.value.trim().length < 2) { close(); return; }
    suggestions.hidden = false;
    matches = [];
    input.setAttribute("aria-expanded", "true");
    const version = ++suggestionVersion;
    const appendGroups = () => {
      for (const group of getSuggestionGroups(input.value)) {
        if (!group.rows.length) continue;
        suggestions.append(text("h3", group.label, "search-suggestion-heading"), ...group.rows);
      }
    };
    const numberOptions = () => {
      matches = [...suggestions.querySelectorAll(".book-suggestion")];
      matches.forEach((option, index) => { option.id = `book-suggestion-${index}`; });
      appendOfficialSearch();
    };
    suggestions.replaceChildren();
    appendGroups();
    numberOptions();
    if (!["Livre", "Tout"].includes(getContext().category)) {
      if (!matches.length) suggestions.append(text("p", "Aucun résultat trouvé avec ces filtres", "book-search-status"));
      appendOfficialSearch();
      return;
    }
    suggestions.append(text("p", "Chargement des livres…", "book-search-status"));
    appendOfficialSearch();
    await load();
    if (version !== suggestionVersion || suggestions.contains(document.activeElement)) return;
    if (dismissed || !shouldSuggest() || document.activeElement !== input || input.value.trim().length < 2) { close(); return; }
    matches = filtered(getContext().category === "Tout" ? "all" : "", true).slice(0, 6);
    active = -1;
    input.removeAttribute("aria-activedescendant");
    suggestions.replaceChildren();
    appendGroups();
    if (error) {
      const retry = text("button", "Réessayer le chargement des livres", "book-search-status");
      retry.type = "button";
      retry.addEventListener("click", () => { dismissed = false; input.focus(); suggest(); });
      suggestions.append(retry);
      numberOptions();
      return;
    }
    if (!matches.length) {
      if (!suggestions.children.length) suggestions.append(text("p", "Aucun résultat trouvé", "book-search-status"));
      numberOptions();
      return;
    }
    suggestions.append(text("h3", "Livres", "search-suggestion-heading"));
    matches.forEach((book, index) => {
      const row = document.createElement("div");
      row.className = "book-suggestion-row";
      const access = book.availability.find(a => /^https?:\/\//.test(a.url || getContext().platformUrl(a.resource_id) || ""));
      const option = document.createElement(access ? "a" : "button");
      if (access) {
        option.href = access.url || getContext().platformUrl(access.resource_id);
        option.target = "_blank";
        option.rel = "noopener noreferrer";
      } else option.type = "button";
      option.className = "book-suggestion";
      option.id = `book-suggestion-${index}`;
      option.title = access ? `Consulter sur ${access.label}` : "Voir la fiche sur BnF Access";
      option.setAttribute("aria-label", `${option.title} : ${book.title}`);
      const content = description(book);
      const publisher = content.querySelector(".book-publisher");
      const publisherTitle = publisher.title;
      publisher.remove();
      const platforms = text("span", "", "book-suggestion-platforms");
      for (const platform of new Map(book.availability.map(a => [a.platform, a])).values()) {
        const tag = text("span", "", `badge press-provider-badge book-platform-tag book-source-${platform.platform}`);
        const dot = text("span", "", "entry-source-dot");
        dot.setAttribute("aria-hidden", "true");
        tag.append(dot, text("span", platform.label));
        platforms.append(tag);
      }
      for (const name of book.publishers?.length ? book.publishers : [book.publisher || "Éditeur non renseigné"]) {
        const tag = text("span", name, "badge book-publisher-tag");
        tag.title = publisherTitle;
        platforms.append(tag);
      }
      appendLanguageTags(platforms, book);
      content.append(platforms);
      option.append(illustration(book), content);
      if (!access) option.addEventListener("click", () => choose(book));
      const actions = text("div", "", "book-suggestion-actions");
      const fiche = text("button", "Voir la fiche", "book-suggestion-fiche");
      fiche.type = "button";
      fiche.title = "Voir la fiche sur BnF Access";
      fiche.setAttribute("aria-label", `Voir la fiche sur BnF Access : ${book.title}`);
      fiche.addEventListener("click", () => choose(book));
      actions.append(createFavoriteButton(book, () => {
        if (getContext().category === "Livre" && gridTarget) renderGrid(gridTarget.grid, gridTarget.count);
      }, row), fiche);
      row.append(option, actions);
      suggestions.append(row);
    });
    numberOptions();
  }

  function choose(book) {
    selectedBookId = book.id;
    focusSelection = true;
    dismissed = true;
    close();
    input.value = book.title;
    syncClear();
    selectBooks(book.title);
    input.blur();
  }

  function changeFilter(key, value) {
    selection[key] = value;
    selectedBookId = null;
    limit = 40;
    if (gridTarget) renderGrid(gridTarget.grid, gridTarget.count);
  }

  function filterPanel() {
    const panel = document.createElement("div");
    panel.className = "book-filter-panel";
    const platformCandidates = filtered("platform");
    const platformCounts = new Map();
    for (const book of platformCandidates) {
      for (const id of new Set(book.availability.map((a) => a.platform))) platformCounts.set(id, (platformCounts.get(id) ?? 0) + 1);
    }
    const row = document.createElement("div");
    row.className = "book-platform-filters entry-source-filter";
    row.append(text("span", "Plateforme", "entry-source-filter-label"));
    const container = document.createElement("div");
    container.className = "entry-subfilters";
    container.setAttribute("aria-label", "Filtrer les livres par plateforme");
    function button(label, key, count) {
      const element = text("button", "", "filter-button entry-subfilter");
      element.type = "button";
      if (key) element.classList.add("book-source-filter", `book-source-${key}`);
      if (key) {
        const dot = text("span", "", "entry-source-dot");
        dot.setAttribute("aria-hidden", "true");
        element.append(dot);
      }
      element.append(text("span", label), text("span", count.toLocaleString("fr"), "entry-subfilter-count"));
      element.setAttribute("aria-pressed", String(selection.platform === key));
      element.disabled = count === 0 && selection.platform !== key;
      element.addEventListener("click", () => changeFilter("platform", selection.platform === key ? "" : key));
      return element;
    }
    container.append(button("Toutes", "", platformCandidates.length));
    for (const platform of getContext().platforms) container.append(button(platform.label, platform.id, platformCounts.get(platform.id) ?? 0));
    row.append(container);
    panel.append(row);
    const fields = document.createElement("div");
    fields.className = "book-select-filters";
    for (const [key, field, label, all] of [["publisher", "publishers", "Éditeur", "Tous les éditeurs"], ["category", "categories", "Thème / catégorie", "Toutes les catégories"]]) {
      const counts = new Map();
      for (const book of filtered(key)) for (const value of book[field]) counts.set(value, (counts.get(value) ?? 0) + 1);
      const wrapper = document.createElement("label");
      const select = document.createElement("select");
      select.dataset.bookFilter = key;
      const first = text("option", all);
      first.value = "";
      select.append(first);
      if (selection[key] && !counts.has(selection[key])) counts.set(selection[key], 0);
      for (const [value, count] of [...counts].sort((a, b) => a[0].localeCompare(b[0], "fr"))) {
        const option = text("option", `${value} (${count.toLocaleString("fr")})`);
        option.value = value;
        select.append(option);
      }
      select.value = selection[key];
      select.addEventListener("change", () => changeFilter(key, select.value));
      wrapper.append(text("span", label), select);
      fields.append(wrapper);
    }
    const reset = text("button", "Réinitialiser", "book-filter-reset");
    reset.type = "button";
    reset.disabled = !Object.values(selection).some(Boolean);
    reset.addEventListener("click", () => {
      selection.platform = selection.publisher = selection.category = "";
      selectedBookId = null;
      limit = 40;
      renderGrid(gridTarget.grid, gridTarget.count);
    });
    fields.append(reset);
    panel.append(fields);
    return panel;
  }

  async function renderGrid(grid, count) {
    const version = ++gridVersion;
    moreObserver?.disconnect();
    gridTarget = { grid, count };
    const query = (getContext().query ?? input.value).trim();
    if (query !== lastQuery) { lastQuery = query; limit = 40; }
    grid.replaceChildren(text("p", "Chargement des livres…", "book-search-status"));
    await load();
    if (version !== gridVersion || getContext().category !== "Livre") return;
    const result = filtered().filter((book) => !selectedBookId || book.id === selectedBookId);
    count.textContent = error ? "" : `${result.length.toLocaleString("fr")} livres`;
    grid.replaceChildren();
    if (error) {
      grid.append(text("p", "Le catalogue de livres n’a pas pu être chargé.", "empty"));
      const retry = text("button", "Réessayer");
      retry.type = "button";
      retry.addEventListener("click", () => renderGrid(grid, count));
      grid.append(retry);
      return;
    }
    grid.append(platformSection());
    const section = document.createElement("section");
    section.className = "entry-section book-title-section";
    const heading = document.createElement("div");
    heading.className = "entry-section-heading";
    heading.append(text("h2", "Livres"), text("p", count.textContent));
    section.append(heading, filterPanel());
    grid.append(section);
    if (!result.length) section.append(text("p", "Aucun livre ne correspond à cette recherche.", "empty"));
    const list = document.createElement("div");
    list.className = "book-results";
    for (const book of result.slice(0, limit)) list.append(bookCard(book));
    section.append(list);
    if (result.length > limit) {
      const more = text("div", "", "book-load-sentinel");
      more.setAttribute("aria-hidden", "true");
      section.append(more);
      const observer = new IntersectionObserver((entries) => {
        if (!entries.some(entry => entry.isIntersecting) || !more.isConnected
          || version !== gridVersion || getContext().category !== "Livre") return;
        observer.unobserve(more);
        const nextLimit = Math.min(limit + 40, result.length);
        const batch = document.createDocumentFragment();
        for (const book of result.slice(limit, nextLimit)) batch.append(bookCard(book));
        list.append(batch);
        limit = nextLimit;
        if (limit === result.length) {
          observer.disconnect();
          more.remove();
        } else requestAnimationFrame(() => {
          if (more.isConnected && version === gridVersion && getContext().category === "Livre") observer.observe(more);
        });
      }, { rootMargin: "0px 0px 300px 0px" });
      moreObserver = observer;
      observer.observe(more);
    }
    grid.dataset.renderComplete = "true";
    if (focusSelection) { list.querySelector("h3")?.focus(); focusSelection = false; }
  }

  function isFavorite(book) {
    return isFavoriteBook(book, getFavoriteIds());
  }

  input.addEventListener("input", () => { selectedBookId = null; syncClear(); });
  input.addEventListener("focus", () => { dismissed = false; load(); suggest(); });
  input.addEventListener("blur", () => setTimeout(() => { if (document.activeElement !== input && !suggestions.contains(document.activeElement)) close(); }, 150));
  suggestions.addEventListener("focusout", () => setTimeout(() => {
    if (document.activeElement !== input && !suggestions.contains(document.activeElement)) close();
  }, 0));
  suggestions.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { event.preventDefault(); dismissed = true; close(); input.focus(); dismissed = true; return; }
    if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    const options = [...suggestions.querySelectorAll(".book-suggestion")];
    const index = options.indexOf(document.activeElement);
    active = (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
    options[active]?.focus();
  });
  document.addEventListener("pointerdown", (event) => {
    if (!suggestions.contains(event.target) && !searchInputs.includes(event.target) && !clearButton?.contains(event.target) && !mirrors.some(mirror => mirror.clear.contains(event.target))) { dismissed = true; close(); }
  });
  const {
    appendLanguageTags,
    bookCard,
    createFavoriteButton,
    decorateFavoriteCover,
    description,
    favoriteTile,
    illustration,
    platformSection,
    text
  } = createBookPresentation({
    choose: (...args) => choose(...args),
    createPlatformLogo: (...args) => createPlatformLogo(...args),
    getContext: (...args) => getContext(...args),
    readGridTarget: () => gridTarget,
    input,
    isFavorite: (...args) => isFavorite(...args),
    renderGrid: (...args) => renderGrid(...args),
    suggestions,
    toggleFavoriteBook: (...args) => toggleFavoriteBook(...args)
  });

  return {
    async renderOverview(section) {
      const version = ++gridVersion;
      moreObserver?.disconnect();
      section.append(text("p", "Chargement des livres…", "book-search-status"));
      await load();
      if (version !== gridVersion || !section.isConnected || getContext().category !== "Tout") return;
      section.replaceChildren();
      const searching = Boolean((getContext().query ?? input.value).trim());
      const allResults = filtered("all");
      const result = allResults.filter(book => searching || book.default_favorite).slice(0, searching ? 40 : undefined);
      const hasMore = allResults.length > result.length;
      if (!error && !result.length) { section.remove(); return; }
      const heading = text("div", "", "entry-section-heading");
      const more = text("button", "Voir tout", "filter-button");
      more.type = "button";
      more.setAttribute("aria-label", "Voir tous les résultats : Livres");
      more.addEventListener("click", () => selectBooks(input.value, { keepFavorites: true }));
      heading.append(text("h2", "Livres"));
      if (hasMore) heading.append(more);
      const list = text("div", "", "book-results");
      for (const book of result) list.append(bookCard(book));
      section.append(heading, list);
      const bottomMore = more.cloneNode(true);
      bottomMore.classList.add("overview-more");
      bottomMore.addEventListener("click", () => selectBooks(input.value, { keepFavorites: true }));
      if (hasMore) section.append(bottomMore);
      if (error || !result.length) section.append(text("p", error ? "Le catalogue de livres n’a pas pu être chargé." : "Aucun résultat avec ces filtres.", "empty"));
    },
    dismissSuggestions() { dismissed = true; ++suggestionVersion; close(); },
    renderGrid,
    load,
    favoriteTile,
    decorateFavoriteCover,
    legacyFavoriteIds() { return [...legacyFavorites].map(id => `book:${id}`); },
    defaultFavoriteIds() { return [...defaultFavorites]; },
    resolveFavoriteId(id) { const book = favoriteBooks.get(id); return book ? favoriteId(book) : id; },
    getFavoriteResource(id) {
      if (!/^book:(scholarvox|pret-bnf|eni|garnier|gale|alexanderstreet|openedition|rsc):[a-zA-Z0-9_-]+$/.test(id)) return null;
      const book = favoriteBooks.get(id);
      return { id, name: book?.title || "Livre indisponible dans le catalogue actuel", is_book: true, book,
        icon_url: book?.cover || null, icon_no_padding: true, fallback_label: "Livre", actions: [] };
    },
    clearFavorites() { legacyFavorites.clear(); onFavoritesChange?.(); },
    update() {
      syncClear();
      clearTimeout(timer);
      if (document.activeElement === input) { dismissed = false; timer = setTimeout(suggest, 130); }
      else if (!suggestions.contains(document.activeElement)) close();
    },
    handleKeydown(event) {
      if (event.key === "Escape") { dismissed = true; close(); return true; }
      if (suggestions.hidden || !matches.length) return false;
      if (event.key === "Enter" && active >= 0) {
        event.preventDefault(); suggestions.querySelector(`#book-suggestion-${active}`)?.click(); return true;
      }
      if (!["ArrowDown", "ArrowUp"].includes(event.key)) return false;
      event.preventDefault();
      active = (active + (event.key === "ArrowDown" ? 1 : -1) + matches.length) % matches.length;
      suggestions.querySelector(`#book-suggestion-${active}`)?.focus();
      return true;
    },
  };
}
