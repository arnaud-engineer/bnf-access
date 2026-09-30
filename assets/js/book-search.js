const fold = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function createBookSearch({ input, suggestions, getContext, createPlatformLogo, selectBooks, onFavoritesChange, getFavoriteIds, toggleFavoriteBook, onCatalogReady, getSuggestionGroups = () => [] }) {
  const favoriteKey = "bnf-access:v2:book-favorites:v1";
  let legacyFavorites = new Set();
  try {
    const saved = JSON.parse(localStorage.getItem(favoriteKey) || "[]");
    if (Array.isArray(saved)) legacyFavorites = new Set(saved.filter((value) => typeof value === "string"));
  } catch { /* Unavailable or malformed storage must not prevent browsing. */ }
  let books = null;
  const favoriteBooks = new Map();
  const favoriteId = (book) => `book:${book.variants.map(v => v.source_id).sort()[0]}`;
  let pending = null;
  let error = false;
  let timer;
  let matches = [];
  let active = -1;
  let limit = 40;
  let lastQuery = "";
  let gridTarget = null;
  let dismissed = false;
  let selectedBookId = null;
  let focusSelection = false;
  let suggestionVersion = 0;
  let summaryId = 0;
  const clearButton = document.querySelector("#searchClear");
  const syncClear = () => { if (clearButton) clearButton.hidden = !input.value.length; };
  clearButton?.addEventListener("pointerdown", (event) => event.preventDefault());
  clearButton?.addEventListener("click", () => {
    input.value = "";
    input.focus({ preventScroll: true });
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  const selection = { platform: "", publisher: "", category: "" };
  const summaryObserver = new ResizeObserver((entries) => {
    for (const { target } of entries) {
      if (!target.isConnected) { summaryObserver.unobserve(target); continue; }
      const paragraph = target.querySelector("p");
      const button = target.querySelector("button");
      const lineHeight = parseFloat(getComputedStyle(paragraph).lineHeight);
      button.hidden = paragraph.scrollHeight <= lineHeight * 3 + 1;
    }
  });

  async function load() {
    if (books) return books;
    if (pending) return pending;
    error = false;
    pending = fetch(new URL("../../private/books/build/catalog.json", import.meta.url))
      .then((response) => {
        if (!response.ok) throw new Error("Book catalogue unavailable");
        return response.json();
      }).then((data) => {
        if (data.schema_version !== 1 || !Array.isArray(data.books)) throw new Error("Invalid book catalogue");
        books = data.books.map((book) => ({ ...book,
          suggestionSearch: fold([book.title, ...(book.display_authors ?? book.authors), ...book.variants.map((v) => v.metadata.display_publisher || v.publisher), ...book.isbns].join(" ")),
          search: fold([book.title, ...(book.display_authors ?? book.authors), ...book.variants.map((v) => v.metadata.display_publisher || v.publisher), ...book.publishers, ...book.isbns].join(" ")),
          titleSearch: fold(book.title) }));
        for (const book of books) for (const variant of book.variants) favoriteBooks.set(`book:${variant.source_id}`, book);
        onCatalogReady?.();
        return books;
      }).catch(() => { error = true; return null; })
      .finally(() => { pending = null; });
    return pending;
  }

  function filtered(ignore = "", forSuggestions = false) {
    const context = getContext();
    const query = fold(input.value.trim());
    const words = query.split(/\s+/).filter(Boolean);
    const result = [];
    for (const book of books ?? []) {
      if (!words.every((word) => (forSuggestions ? book.suggestionSearch : book.search).includes(word))) continue;
      if (context.languages.size && book.languages.length && !book.languages.some((code) => context.languages.has(code))) continue;
      const availability = book.availability.filter((access) => context.canAccess(access.resource_id)
        && (ignore === "platform" || !selection.platform || access.platform === selection.platform));
      if (!availability.length) continue;
      const platforms = new Set(availability.map((access) => access.platform));
      const variants = book.variants.filter((variant) => platforms.has(variant.availability.platform));
      const publishers = [...new Set(variants.map((variant) => variant.metadata.display_publisher || variant.publisher).filter(Boolean))];
      const categories = [...new Set(variants.flatMap((variant) => variant.metadata.display_categories ?? variant.metadata.filter_categories ?? []))];
      if (context.favoritesOnly && !isFavorite(book)) continue;
      if (ignore !== "publisher" && selection.publisher && !publishers.includes(selection.publisher)) continue;
      if (ignore !== "category" && selection.category && !categories.includes(selection.category)) continue;
      result.push({ ...book, availability, publishers, categories, score: query && book.titleSearch.startsWith(query) ? 0 : 1 });
    }
    if (query) result.sort((a, b) => a.score - b.score || a.title.localeCompare(b.title, "fr"));
    return result;
  }

  function text(tag, value, className) {
    const element = document.createElement(tag);
    element.textContent = value;
    if (className) element.className = className;
    return element;
  }

  function illustration(book) {
    const frame = document.createElement("span");
    frame.className = "book-cover";
    if (book.cover) {
      const image = document.createElement("img");
      image.src = book.cover;
      image.alt = "";
      image.loading = "lazy";
      image.addEventListener("error", () => { image.remove(); frame.textContent = "Livre"; }, { once: true });
      frame.append(image);
    } else frame.textContent = "Livre";
    return frame;
  }

  function description(book) {
    const content = document.createElement("span");
    content.className = "book-description";
    content.append(text("strong", book.title),
      text("span", (book.display_authors ?? book.authors).join(", ") || "Auteur non renseigné", "book-author"),
      text("span", book.publishers?.join(" · ") || book.publisher || "Éditeur non renseigné", "book-publisher"));
    content.querySelector(".book-publisher").title = `Libellés sources : ${[...new Set(book.variants.map((v) => v.publisher).filter(Boolean))].join(" · ")}`;
    content.querySelector(".book-author").title = `Auteurs sources : ${[...new Set(book.variants.flatMap((v) => v.authors))].join(" · ")}`;
    return content;
  }

  function accessLinks(book) {
    const actions = document.createElement("div");
    actions.className = "book-access-links";
    const seen = new Set();
    for (const access of book.availability) {
      const url = access.url || getContext().platformUrl(access.resource_id);
      if (!url || !/^https?:\/\//.test(url) || seen.has(url)) continue;
      seen.add(url);
      const link = text("a", access.label);
      link.className = `badge press-provider-badge book-source book-source-${access.platform}`;
      link.href = url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.title = access.url ? `Consulter sur ${access.label}` : `Ouvrir la plateforme ${access.label}`;
      link.setAttribute("aria-label", `${link.title} : ${book.title}`);
      actions.append(link);
    }
    return actions;
  }

  function appendLanguageTags(container, book) {
    for (const code of new Set(book.languages ?? [])) {
      const label = getContext().languageTag(code);
      const tag = text("span", label.text, "badge language");
      tag.title = label.title;
      container.append(tag);
    }
  }

  function close() {
    suggestions.hidden = true;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    active = -1;
  }

  async function suggest() {
    if (suggestions.contains(document.activeElement)) return;
    if (dismissed || document.activeElement !== input || input.value.trim().length < 2) { close(); return; }
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
    };
    suggestions.replaceChildren();
    appendGroups();
    numberOptions();
    if (getContext().category !== "Livre") {
      if (!matches.length) suggestions.append(text("p", "Aucun résultat trouvé avec ces filtres", "book-search-status"));
      return;
    }
    suggestions.append(text("p", "Chargement des livres…", "book-search-status"));
    await load();
    if (version !== suggestionVersion || suggestions.contains(document.activeElement)) return;
    if (dismissed || document.activeElement !== input || input.value.trim().length < 2) { close(); return; }
    matches = filtered("", true).slice(0, 6);
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

  function createFavoriteButton(book, onChange, errorTarget) {
    const favorite = document.createElement("button");
    favorite.className = "favorite-button book-favorite";
    favorite.type = "button";
    favorite.innerHTML = '<svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><path fill="currentColor" d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>';
    const update = () => {
      favorite.setAttribute("aria-pressed", String(isFavorite(book)));
      favorite.setAttribute("aria-label", `${isFavorite(book) ? "Retirer des" : "Ajouter aux"} favoris : ${book.title}`);
      favorite.title = isFavorite(book) ? "Retirer des favoris" : "Ajouter aux favoris";
    };
    update();
    favorite.addEventListener("click", () => {
      const keepSuggestionPosition = suggestions.contains(favorite);
      const inputTop = input.getBoundingClientRect().top;
      toggleFavoriteBook(favoriteId(book));
      update();
      onChange();
      if (keepSuggestionPosition) requestAnimationFrame(() => {
        window.scrollBy(0, input.getBoundingClientRect().top - inputTop);
      });
    });
    return favorite;
  }

  function changeFilter(key, value) {
    selection[key] = value;
    selectedBookId = null;
    limit = 40;
    if (gridTarget) renderGrid(gridTarget.grid, gridTarget.count);
  }

  function platformSection() {
    const section = document.createElement("section");
    section.className = "entry-section press-platforms book-platform-section";
    section.setAttribute("aria-labelledby", "book-platforms-heading");
    const heading = text("div", "", "entry-section-heading press-platforms-heading");
    const title = text("h2", "Plateformes de livres");
    title.id = "book-platforms-heading";
    heading.append(title);
    section.append(heading);
    const list = document.createElement("div");
    list.className = "press-platform-list book-platform-list";
    for (const platform of getContext().platforms) {
      const item = document.createElement("article");
      item.className = `press-platform-item book-platform-item book-source-${platform.id}`;
      const logo = createPlatformLogo(platform.resource);
      const link = text("a", "Ouvrir", "resource-action variant");
      link.href = platform.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.setAttribute("aria-label", `Ouvrir ${platform.label}`);
      const name = text("strong", "");
      name.title = platform.label;
      const dot = text("span", "", "press-platform-dot");
      dot.setAttribute("aria-hidden", "true");
      name.append(dot, text("span", platform.label, "press-platform-label"));
      item.append(logo, name,
        text("span", platform.access, `press-platform-access ${platform.accessClass ?? ""}`), link);
      list.append(item);
    }
    section.append(list);
    return section;
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
    gridTarget = { grid, count };
    const query = input.value.trim();
    if (query !== lastQuery) { lastQuery = query; limit = 40; }
    grid.replaceChildren(text("p", "Chargement des livres…", "book-search-status"));
    await load();
    if (getContext().category !== "Livre") return;
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
      const more = text("button", "Afficher davantage", "book-load-more");
      more.type = "button";
      more.addEventListener("click", () => { limit += 40; renderGrid(grid, count); });
      section.append(more);
    }
    grid.dataset.renderComplete = "true";
    if (focusSelection) { list.querySelector("h3")?.focus(); focusSelection = false; }
  }

  function isFavorite(book) {
    return book.variants.some(variant => getFavoriteIds().has(`book:${variant.source_id}`));
  }

  function bookCard(book) {
    const card = document.createElement("article");
    card.className = "book-result";
    card.dataset.bookId = book.id;
    const content = description(book);
    const title = content.querySelector("strong");
    const heading = text("h3", title.textContent);
    heading.tabIndex = -1;
    title.replaceWith(heading);
    const favorite = createFavoriteButton(book, () => {
      if (getContext().category === "Livre" && gridTarget) renderGrid(gridTarget.grid, gridTarget.count);
    }, content);
    const access = accessLinks(book);
    appendLanguageTags(access, book);
    const source = book.variants.find(variant => {
      const value = variant.metadata.description || variant.metadata.abstract;
      return typeof value === "string" && value.trim();
    });
    if (source) {
      const summary = text("div", "", "book-summary");
      const paragraph = text("p", (source.metadata.description || source.metadata.abstract).trim(), "book-summary-text");
      paragraph.id = `book-summary-${book.id}-${++summaryId}`;
      paragraph.title = `Description source : ${source.metadata.description_evidence?.provider || source.availability.label}`;
      const toggle = text("button", "[+]", "description-toggle book-summary-toggle");
      toggle.type = "button";
      toggle.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", paragraph.id);
      toggle.setAttribute("aria-label", `Lire toute la description : ${book.title}`);
      toggle.addEventListener("click", () => {
        const expanded = summary.classList.toggle("is-expanded");
        toggle.textContent = expanded ? "[-]" : "[+]";
        toggle.setAttribute("aria-expanded", String(expanded));
        toggle.setAttribute("aria-label", `${expanded ? "Replier" : "Lire toute"} la description : ${book.title}`);
      });
      summary.append(paragraph, toggle);
      content.append(summary);
      requestAnimationFrame(() => { if (summary.isConnected) summaryObserver.observe(summary); });
    }
    content.append(access);
    if (book.categories.length) {
      const categories = text("span", "", "book-categories badge-row");
      for (const category of book.categories) categories.append(text("span", category, "badge editorial book-category-badge"));
      categories.title = `Catégories sources : ${[...new Set(book.variants.flatMap((v) => v.metadata.filter_categories || []))].join(" · ")}`;
      content.append(categories);
    }
    card.append(illustration(book), content, favorite);
    return card;
  }

  function decorateFavoriteCover(frame) {
    const image = frame.querySelector("img");
    if (!image || frame.querySelector(".book-cover-backdrop")) return;
    image.classList.add("book-cover-foreground");
    const backdrop = image.cloneNode(false);
    backdrop.className = "book-cover-backdrop";
    backdrop.alt = "";
    backdrop.setAttribute("aria-hidden", "true");
    frame.prepend(backdrop);
  }

  function favoriteTile(book) {
    const item = document.createElement("div");
    item.className = "quick-launch-item book-favorite-item";
    item.dataset.bookId = book.id;
    const access = book.availability.find((entry) => entry.url || getContext().platformUrl(entry.resource_id));
    const url = access && (access.url || getContext().platformUrl(access.resource_id));
    const main = text(url && /^https?:\/\//.test(url) ? "a" : "button", "", "quick-launch-main");
    main.title = book.title;
    main.setAttribute("aria-label", `Ouvrir : ${book.title}`);
    if (main.tagName === "A") {
      main.href = url;
      main.target = "_blank";
      main.rel = "noreferrer";
    } else {
      main.type = "button";
      main.addEventListener("click", () => choose(book));
    }
    const cover = illustration(book);
    cover.className = "quick-launch-tile book-favorite-tile";
    decorateFavoriteCover(cover);
    main.append(cover, text("small", book.title, "quick-launch-label"));
    const details = text("button", "", "quick-launch-extra-action compact book-favorite-details");
    details.type = "button";
    details.title = "Voir la fiche sur BnF Access";
    details.setAttribute("aria-label", `Voir la fiche sur BnF Access : ${book.title}`);
    details.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></svg>';
    details.addEventListener("click", () => choose(book));
    item.append(main, details);
    return item;
  }

  input.addEventListener("input", () => { selectedBookId = null; syncClear(); });
  input.addEventListener("focus", () => { dismissed = false; load(); suggest(); });
  input.addEventListener("blur", () => setTimeout(() => { if (!suggestions.contains(document.activeElement)) close(); }, 150));
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
    if (!suggestions.contains(event.target) && event.target !== input && !clearButton?.contains(event.target)) { dismissed = true; close(); }
  });
  return {
    dismissSuggestions() { dismissed = true; ++suggestionVersion; close(); },
    renderGrid,
    load,
    favoriteTile,
    decorateFavoriteCover,
    legacyFavoriteIds() { return [...legacyFavorites].map(id => `book:${id}`); },
    resolveFavoriteId(id) { const book = favoriteBooks.get(id); return book ? favoriteId(book) : id; },
    getFavoriteResource(id) {
      if (!/^book:(scholarvox|pret-bnf|eni|garnier):[a-zA-Z0-9_-]+$/.test(id)) return null;
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
