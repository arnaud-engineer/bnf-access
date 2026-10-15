import {bookFavoriteId as favoriteId} from './model.js';
import {bookCredits, searchableCredits} from './credits.js';
import {bookIdentifiers} from './identifiers.js';
import {bookEditorialCategoryPaths} from './taxonomy.js?v=2026-10-12-healthscience1';
import {placeholderBrand} from './cover-placeholder.js?v=2026-10-12-healthscience1';
import {reviewedOpenEditionDescription} from './openedition-descriptions.js?v=2026-10-15-oe1';

// Book cards, favorite tiles and platform links share the same presentation. Description overflow remains measured in the user viewport.
export function createBookPresentation({
  openPlatformDirectory,
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
  const selectedSeriesVolumes = new Map();
  const platformNameObserver = new ResizeObserver((entries) => {
    for (const {target} of entries) {
      if (!target.isConnected) { platformNameObserver.unobserve(target); continue; }
      const label = target.querySelector('.press-platform-label');
      label.textContent = target.dataset.fullLabel;
      if (label.scrollWidth > label.clientWidth) label.textContent = target.dataset.shortLabel;
    }
  });

  const summaryObserver = new ResizeObserver((entries) => {
    for (const { target } of entries) {
      if (!target.isConnected) { summaryObserver.unobserve(target); continue; }
      const paragraph = target.querySelector("p");
      const button = target.querySelector("button");
      const lineHeight = parseFloat(getComputedStyle(paragraph).lineHeight);
      button.hidden = paragraph.scrollHeight <= lineHeight * (target.classList.contains('book-credits') ? 2 : 3) + 1;
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
      image.addEventListener("error", () => showPlaceholder(frame, book), { once: true });
      frame.append(image);
    } else showPlaceholder(frame, book);
    return frame;
  }

  function showPlaceholder(frame, book) {
    const brand = placeholderBrand(book, getContext().platforms);
    const cover = text('span', '', 'book-cover-placeholder');
    cover.setAttribute('aria-hidden', 'true');
    frame.title = brand ? `Couverture indisponible · Logo ${brand.kind === 'éditeur' ? 'de l’éditeur' : 'de la plateforme'} ${brand.label}` : 'Couverture indisponible';
    if (brand) {
      cover.classList.add(`book-source-${brand.id}`);
      const background = brand.resource.icon_background;
      cover.style.setProperty('--book-placeholder-background', /^#[0-9a-f]{6}$/i.test(background ?? '')
        ? background : `var(--book-logo-${brand.id}, var(--book-solid, #656565))`);
      const logo = createPlatformLogo({...brand.resource, icon_background_image: ''});
      logo.classList.add('book-placeholder-logo');
      cover.append(logo);
    } else cover.append(text('span', 'Livre', 'book-placeholder-label'));
    // Replace the whole frame, including any blurred favorite-cover clone.
    frame.replaceChildren(cover);
  }

  function description(book) {
    const content = document.createElement("span");
    content.className = "book-description";
    const credits = text('div', '', 'book-credits');
    const names = text('p', bookCredits(book).text, 'book-author book-credit-text');
    names.id = `book-credits-${book.id}-${++summaryId}`;
    const toggle = text('button', '[+]', 'description-toggle book-credit-toggle');
    toggle.type = 'button';
    toggle.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', names.id);
    toggle.setAttribute('aria-label', `Afficher tous les noms : ${book.title}`);
    toggle.addEventListener('click', () => {
      const expanded = credits.classList.toggle('is-expanded');
      toggle.textContent = expanded ? '[-]' : '[+]';
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.setAttribute('aria-label', `${expanded ? 'Replier' : 'Afficher tous'} les noms : ${book.title}`);
    });
    credits.append(names, toggle);
    requestAnimationFrame(() => { if (credits.isConnected) summaryObserver.observe(credits); });
    content.append(text("strong", book.title), credits,
      text("span", book.publishers?.join(" · ") || book.publisher || "Éditeur non renseigné", "book-publisher"));
    content.querySelector(".book-publisher").title = `Libellés sources : ${[...new Set(book.variants.map((v) => v.publisher).filter(Boolean))].join(" · ")}`;
    content.querySelector(".book-author").title = `Crédits sources : ${[...new Set(searchableCredits(book))].join(" · ")}`;
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
    const seeAll = text('button', 'Voir tout', 'quick-launch-action neutral platform-directory-link');
    seeAll.type = 'button';
    seeAll.setAttribute('aria-label', 'Voir toutes les bases de livres dans Ressources');
    seeAll.addEventListener('click', () => openPlatformDirectory('catalogues_et_bibliographies__livres'));
    heading.append(seeAll);
    section.append(heading);
    function platformList(platforms) {
      const list = document.createElement("div");
      list.className = "press-platform-list book-platform-list";
      for (const platform of platforms) {
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
        if (platform.indexed === false && ['eebo', 'eeb'].includes(platform.id)) {
          name.classList.add('book-adaptive-platform-name');
          name.dataset.fullLabel = platform.label;
          name.dataset.shortLabel = platform.id === 'eebo' ? 'Early EN Books' : 'Early EU Books';
          platformNameObserver.observe(name);
        }
        item.append(logo, name,
          text("span", platform.access, `press-platform-access ${platform.accessClass ?? ""}`), link);
        list.append(item);
      }
      return list;
    }
    const context = getContext();
    section.append(platformList(context.platforms));
    if (context.unindexedPlatforms?.length) {
      const details = document.createElement("details");
      details.className = "book-unindexed-platforms";
      details.append(text("summary", "Plateformes non indexées"), platformList(context.unindexedPlatforms));
      section.append(details);
    }
    return section;
  }

  function bookCard(book, { keepSelection = false } = {}) {
    if (book.seriesVolumes) return seriesCard(book);
    const card = document.createElement("article");
    card.className = "book-result";
    card.dataset.bookId = book.id;
    const content = description(book);
    const title = content.querySelector("strong");
    const heading = text("h3", title.textContent);
    heading.tabIndex = -1;
    title.replaceWith(heading);
    const favorite = createFavoriteButton(book, () => {
      if (!keepSelection && getContext().category === "Livre" && readGridTarget()) renderGrid(readGridTarget().grid, readGridTarget().count);
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
    const supplemented = book.variants.map(variant => ({variant,description:reviewedOpenEditionDescription(variant)}))
      .find(item => item.description);
    const source = supplemented?.variant || book.variants.find(variant => {
      const value = variant.metadata.description || variant.metadata.abstract;
      return typeof value === "string" && value.trim();
    });
    if (source) {
      const summary = text("div", "", "book-summary");
      const paragraph = text("p", (supplemented?.description.text || source.metadata.description || source.metadata.abstract).trim(), "book-summary-text");
      paragraph.id = `book-summary-${book.id}-${++summaryId}`;
      paragraph.title = `Description source : ${supplemented?.description.provider || source.metadata.description_evidence?.provider || source.availability.label}`;
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
    const identifiers = bookIdentifiers(book);
    if (identifiers.length) {
      const list = text('div', '', 'book-identifiers');
      for (const {label, value} of identifiers) {
        const line = text('div', '');
        line.append(text('span', `${label} : `), text('span', value, 'book-identifier-value'));
        list.append(line);
      }
      content.append(list);
    }
    content.append(tags);
    if (book.categories.length) {
      const categories = text("span", "", "book-categories badge-row");
      for (const path of book.editorialCategories ?? bookEditorialCategoryPaths(book.variants, {title: book.title, trackNewEntries: true})) {
        const badge = text("span", path.subcategory, "badge editorial book-category-badge");
        badge.title = `${path.family} › ${path.subcategory}${path.details ? ` › ${path.details.join(' / ')}` : ''}`;
        categories.append(badge);
      }
      categories.title = `Catégories sources : ${[...new Set(book.variants.flatMap((v) => v.metadata.filter_categories || []))].join(" · ")}`;
      content.append(categories);
    }
    card.append(illustration(book), content, favorite, access);
    return card;
  }

  function seriesCard(series) {
    let card;
    const seriesKey = series.seriesVolumes.map(({book}) => book.id).join('|');
    function selectedCard(index) {
      const next = bookCard(series.seriesVolumes[index].book, {keepSelection: true});
      next.classList.add('book-series');
      const control = text('label', '', 'book-volume-selector');
      const supplements = series.seriesVolumes.some(item => item.kind?.includes('supplement'));
      const volumes = series.seriesVolumes.some(item => item.kind === 'volume');
      control.append(text('span', `${series.seriesVolumes.length} ${supplements ? (volumes ? 'volumes et suppléments' : 'suppléments') : 'volumes'}`));
      const select = document.createElement('select');
      select.setAttribute('aria-label', `${supplements && volumes ? 'Volume ou supplément' : series.seriesVolumes[0].label} : ${series.title}`);
      series.seriesVolumes.forEach(({book, number, label}, position) => {
        const option = text('option', `${label} ${number}`);
        option.value = String(position);
        option.title = book.title;
        select.append(option);
      });
      select.value = String(index);
      select.addEventListener('change', () => {
        selectedSeriesVolumes.set(seriesKey, series.seriesVolumes[Number(select.value)].book.id);
        const replacement = selectedCard(Number(select.value));
        card.replaceWith(replacement);
        card = replacement;
        card.querySelector('select').focus({preventScroll: true});
      });
      control.append(select);
      next.prepend(control);
      return next;
    }
    const selectedIndex = series.seriesVolumes.findIndex(({book}) => book.id === selectedSeriesVolumes.get(seriesKey));
    card = selectedCard(Math.max(0, selectedIndex));
    return card;
  }

  function decorateFavoriteCover(frame) {
    if (frame.querySelector('.book-cover-placeholder')) return;
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
