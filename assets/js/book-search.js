const fold = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function createBookSearch({ input, suggestions, getContext, selectBooks }) {
  let books = null;
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
        if (data.schema_version !== 1 || !Array.isArray(data.books)) throw new Error("Invalid book catalogue");
        books = data.books.map((book) => ({ ...book,
          search: fold([book.title, ...book.authors, book.publisher, ...book.isbns].join(" ")),
          titleSearch: fold(book.title) }));
        return books;
      }).catch(() => { error = true; return null; })
      .finally(() => { pending = null; });
    return pending;
  }

  function filtered(ignore = "") {
    const context = getContext();
    const query = fold(input.value.trim());
    const words = query.split(/\s+/).filter(Boolean);
    const result = [];
    for (const book of books ?? []) {
      if (!words.every((word) => book.search.includes(word))) continue;
      if (context.languages.size && book.languages.length && !book.languages.some((code) => context.languages.has(code))) continue;
      const availability = book.availability.filter((access) => context.canAccess(access.resource_id)
        && (ignore === "platform" || !selection.platform || access.platform === selection.platform));
      if (!availability.length) continue;
      const platforms = new Set(availability.map((access) => access.platform));
      const variants = book.variants.filter((variant) => platforms.has(variant.availability.platform));
      const publishers = [...new Set(variants.map((variant) => variant.publisher).filter(Boolean))];
      const categories = [...new Set(variants.flatMap((variant) => variant.metadata.filter_categories ?? []))];
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
      text("span", book.authors.join(", ") || "Auteur non renseigné", "book-author"),
      text("span", book.publishers?.join(" · ") || book.publisher || "Éditeur non renseigné", "book-publisher"));
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
      link.href = url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.title = access.url ? `Consulter sur ${access.label}` : `Ouvrir la plateforme ${access.label}`;
      link.setAttribute("aria-label", `${link.title} : ${book.title}`);
      actions.append(link);
    }
    return actions;
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
    suggestions.replaceChildren(text("p", "Chargement des livres…", "book-search-status"));
    await load();
    if (dismissed || document.activeElement !== input || input.value.trim().length < 2) { close(); return; }
    matches = filtered().slice(0, 6);
    active = -1;
    input.removeAttribute("aria-activedescendant");
    suggestions.replaceChildren();
    if (error) {
      const retry = text("button", "Réessayer le chargement des livres", "book-search-status");
      retry.type = "button";
      retry.addEventListener("click", () => { dismissed = false; input.focus(); suggest(); });
      suggestions.append(retry);
      return;
    }
    if (!matches.length) {
      suggestions.append(text("p", "Aucun livre trouvé", "book-search-status"));
      return;
    }
    matches.forEach((book, index) => {
      const row = document.createElement("div");
      row.className = "book-suggestion-row";
      const option = document.createElement("button");
      option.type = "button";
      option.className = "book-suggestion";
      option.id = `book-suggestion-${index}`;
      option.title = "Voir la fiche sur BnF Access";
      option.setAttribute("aria-label", `Voir la fiche : ${book.title}`);
      const content = description(book);
      option.append(illustration(book), content);
      option.addEventListener("click", () => choose(book));
      row.append(option, accessLinks(book));
      suggestions.append(row);
    });
  }

  function choose(book) {
    selectedBookId = book.id;
    focusSelection = true;
    dismissed = true;
    close();
    input.value = book.title;
    selectBooks(book.title);
    input.blur();
  }

  function changeFilter(key, value) {
    selection[key] = value;
    selectedBookId = null;
    limit = 40;
    if (gridTarget) renderGrid(gridTarget.grid, gridTarget.count);
  }

  function platformSection() {
    const section = document.createElement("section");
    section.className = "entry-section book-platform-section";
    section.append(text("h2", "Plateformes de livres"));
    const list = document.createElement("div");
    list.className = "press-platform-list book-platform-list";
    for (const platform of getContext().platforms) {
      const item = document.createElement("article");
      item.className = "press-platform-item book-platform-item";
      const logo = document.createElement("div");
      logo.className = "press-platform-logo";
      if (platform.icon) {
        const image = document.createElement("img");
        image.src = platform.icon;
        image.alt = "";
        logo.append(image);
      }
      const link = text("a", "Ouvrir", "resource-action variant");
      link.href = platform.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.setAttribute("aria-label", `Ouvrir ${platform.label}`);
      item.append(logo, text("strong", platform.label),
        text("span", platform.access, "press-platform-access"), link);
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
    row.className = "book-platform-filters";
    row.append(text("span", "Plateforme", "book-filter-label"));
    function button(label, key, count) {
      const element = text("button", `${label} ${count.toLocaleString("fr")}`, "filter-button entry-subfilter");
      element.type = "button";
      element.setAttribute("aria-pressed", String(selection.platform === key));
      element.disabled = count === 0 && selection.platform !== key;
      element.addEventListener("click", () => changeFilter("platform", selection.platform === key ? "" : key));
      return element;
    }
    row.append(button("Toutes", "", platformCandidates.length));
    for (const platform of getContext().platforms) row.append(button(platform.label, platform.id, platformCounts.get(platform.id) ?? 0));
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
    for (const book of result.slice(0, limit)) {
      const card = document.createElement("article");
      card.className = "book-result";
      const content = description(book);
      const title = content.querySelector("strong");
      const heading = text("h3", title.textContent);
      heading.tabIndex = -1;
      title.replaceWith(heading);
      content.append(accessLinks(book));
      if (book.categories.length) content.append(text("span", book.categories.slice(0, 3).join(" · "), "book-categories"));
      card.append(illustration(book), content);
      list.append(card);
    }
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

  input.addEventListener("input", () => { selectedBookId = null; });
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
    if (!suggestions.contains(event.target) && event.target !== input) { dismissed = true; close(); }
  });
  return {
    renderGrid,
    update() {
      clearTimeout(timer);
      if (document.activeElement === input) { dismissed = false; timer = setTimeout(suggest, 130); }
      else if (!suggestions.contains(document.activeElement)) close();
    },
    handleKeydown(event) {
      if (event.key === "Escape") { dismissed = true; close(); return true; }
      if (suggestions.hidden || !matches.length) return false;
      if (event.key === "Enter" && active >= 0) {
        event.preventDefault(); choose(matches[active]); return true;
      }
      if (!["ArrowDown", "ArrowUp"].includes(event.key)) return false;
      event.preventDefault();
      active = (active + (event.key === "ArrowDown" ? 1 : -1) + matches.length) % matches.length;
      suggestions.querySelector(`#book-suggestion-${active}`)?.focus();
      return true;
    },
  };
}
