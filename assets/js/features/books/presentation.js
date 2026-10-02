import {bookFavoriteId as favoriteId} from './model.js';

// Book cards, favorite tiles and platform links share the same presentation. Description overflow remains measured in the user viewport.
export function createBookPresentation({
  choose,
  createPlatformLogo,
  getContext,
  readGridTarget,
  input,
  isFavorite,
  renderGrid,
  suggestions,
  toggleFavoriteBook
}) {
  let summaryId = 0;

  const summaryObserver = new ResizeObserver((entries) => {
    for (const { target } of entries) {
      if (!target.isConnected) { summaryObserver.unobserve(target); continue; }
      const paragraph = target.querySelector("p");
      const button = target.querySelector("button");
      const lineHeight = parseFloat(getComputedStyle(paragraph).lineHeight);
      button.hidden = paragraph.scrollHeight <= lineHeight * 3 + 1;
    }
  });

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
      const link = text("a", book.availability.length > 1 ? access.label : "Consulter");
      link.className = `resource-action book-open book-source-${access.platform}`;
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
      if (getContext().category === "Livre" && readGridTarget()) renderGrid(readGridTarget().grid, readGridTarget().count);
    }, content);
    const access = accessLinks(book);
    const tags = text("span", "", "book-platform-tags badge-row");
    for (const platform of new Map(book.availability.map(entry => [entry.platform, entry])).values()) {
      const tag = text("span", "", `badge press-provider-badge book-platform-tag book-source-${platform.platform}`);
      const dot = text("span", "", "entry-source-dot");
      dot.setAttribute("aria-hidden", "true");
      tag.append(dot, document.createTextNode(platform.label));
      tags.append(tag);
    }
    appendLanguageTags(tags, book);
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
    content.append(tags);
    if (book.categories.length) {
      const categories = text("span", "", "book-categories badge-row");
      for (const category of book.categories) categories.append(text("span", category, "badge editorial book-category-badge"));
      categories.title = `Catégories sources : ${[...new Set(book.variants.flatMap((v) => v.metadata.filter_categories || []))].join(" · ")}`;
      content.append(categories);
    }
    card.append(illustration(book), content, favorite, access);
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

  function favoriteTile(book, { actionsExpanded = false } = {}) {
    const item = document.createElement("div");
    item.className = "quick-launch-item book-favorite-item";
    item.dataset.bookId = book.id;
    const access = book.availability.find((entry) => entry.url || getContext().platformUrl(entry.resource_id));
    const url = access && (access.url || getContext().platformUrl(access.resource_id));
    const main = text(url && /^https?:\/\//.test(url) ? "a" : "button", "", "quick-launch-main");
    main.title = access && !access.url ? `Ouvrir la plateforme ${access.label} : ${book.title}` : book.title;
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
    const alternatives = [];
    const seen = new Set([url]);
    for (const entry of book.availability) {
      const href = entry.url || getContext().platformUrl(entry.resource_id);
      if (!href || !/^https?:\/\//.test(href) || seen.has(href)) continue;
      seen.add(href);
      alternatives.push({ entry, href });
    }
    item.append(main);
    if (!alternatives.length) {
      item.append(details);
      return item;
    }
    item.classList.toggle("has-open-actions", actionsExpanded);
    const toggle = text("button", actionsExpanded ? "-" : "+", "quick-launch-action-toggle");
    toggle.type = "button";
    toggle.dataset.quickLaunchActionsToggle = favoriteId(book);
    toggle.setAttribute("aria-expanded", String(actionsExpanded));
    toggle.title = `${actionsExpanded ? "Masquer" : "Afficher"} les actions - ${book.title}`;
    toggle.setAttribute("aria-label", toggle.title);
    item.append(toggle);
    if (actionsExpanded) {
      const menu = text("div", "", "quick-launch-action-menu");
      menu.dataset.actionCount = String(alternatives.length + 1);
      menu.setAttribute("aria-label", `Actions - ${book.title}`);
      const fiche = text("button", "Fiche", "quick-launch-menu-action");
      fiche.type = "button";
      fiche.title = details.title;
      fiche.setAttribute("aria-label", details.getAttribute("aria-label"));
      fiche.addEventListener("click", () => choose(book));
      const row = text("div", "", "quick-launch-menu-row");
      row.append(fiche);
      menu.append(row);
      for (const { entry, href } of alternatives) {
        const row = text("div", "", "quick-launch-menu-row");
        const link = text("a", entry.platform === "pret-bnf" ? "Prêt BnF" : entry.label, "quick-launch-menu-action");
        link.href = href;
        link.target = "_blank";
        link.rel = "noreferrer";
        link.title = `Consulter sur ${entry.label} : ${book.title}`;
        row.append(link);
        menu.append(row);
      }
      item.append(menu);
    }
    return item;
  }

  return {
    appendLanguageTags,
    bookCard,
    createFavoriteButton,
    decorateFavoriteCover,
    description,
    favoriteTile,
    illustration,
    platformSection,
    text
  };
}
