import {bookCategoryPaths} from './taxonomy.js?v=2026-10-12-healthscience1';
import {compareBookFamilies} from './new-entries.js?v=2026-10-12-healthscience1';
import {comicCategoryOrder} from './comics-navigation.js?v=2026-10-16-comics7';

const cinemaGroups = [
  ['Œuvres', ['Cinématographie', 'Genres', 'Animation', 'Documentaire', 'Série / TV']],
  ['Personnes', ['Cinéastes', 'Acteurs']],
  ['Études', ['Analyses de films', 'Esthétique', 'Théorie', 'Cinéma et société']],
  ['Création / Diffusion', ['Adaptation', 'Scénario', 'Réalisation', 'Jeu d’acteur',
    'Image / Technique', 'Musique / Son', 'Économie', 'Patrimoine']],
];

export function bookCategoryCounts(books) {
  const families = new Map();
  for (const book of books) {
    const paths = book.editorialCategories ?? bookCategoryPaths(book.categories);
    for (const family of new Set(paths.map(path => path.family))) {
      if (!families.has(family)) families.set(family, {count: 0, children: new Map(), details: new Map()});
      const counts = families.get(family);
      counts.count++;
      const familyPaths = paths.filter(path => path.family === family);
      for (const subcategory of new Set(familyPaths.map(path => path.subcategory))) {
        counts.children.set(subcategory, (counts.children.get(subcategory) ?? 0) + 1);
        if (!counts.details.has(subcategory)) counts.details.set(subcategory, new Map());
        const details = counts.details.get(subcategory);
        const unique = new Set(familyPaths.filter(path => path.subcategory === subcategory).flatMap(path => path.details ?? []));
        for (const detail of unique) details.set(detail, (details.get(detail) ?? 0) + 1);
      }
    }
  }
  return families;
}

export function createBookCategoryFilters({books, selection, expanded, onChange,
  expandedByDefault = false}) {
  const text = (tag, label, className) => {
    const element = document.createElement(tag);
    element.textContent = label;
    element.className = className;
    return element;
  };
  const wrapper = text('div', '', 'entry-type-filter book-category-filters');
  wrapper.append(text('span', 'Catégorie', 'entry-type-filter-label'));
  const container = text('div', '', 'entry-subfilters entry-type-subfilters');
  container.setAttribute('aria-label', 'Filtrer les livres par catégorie');
  const utilities = text('div', '', 'entry-type-utilities');
  const taxonomy = text('div', '', 'entry-type-taxonomy');
  function button(label, count, active, className, onClick) {
    const element = text('button', '', `filter-button entry-subfilter entry-type-subfilter ${className}`);
    element.type = 'button';
    element.title = `${label} (${count.toLocaleString('fr')} livres)`;
    element.setAttribute('aria-label', element.title);
    element.setAttribute('aria-pressed', String(active));
    element.disabled = count === 0 && !active;
    element.append(text('span', label, 'entry-subfilter-label'),
      text('span', count.toLocaleString('fr'), 'entry-subfilter-count'));
    element.addEventListener('click', onClick);
    return element;
  }
  utilities.append(button('Toutes les catégories', books.length, !selection.family && !selection.category, '', () => onChange('', '')));
  const families = bookCategoryCounts(books);
  if (selection.family && !families.has(selection.family)) families.set(selection.family, {count: 0, children: new Map(), details: new Map()});
  for (const [family, counts] of [...families].sort((a, b) => compareBookFamilies(a[0], b[0]))) {
    const branch = text('div', '', 'entry-type-branch has-children');
    branch.setAttribute('role', 'group');
    branch.setAttribute('aria-label', family);
    const active = selection.family === family;
    branch.classList.toggle('is-parent-active', active && !selection.category);
    branch.classList.toggle('has-active-child', active && !!selection.category);
    branch.append(button(family, counts.count, active && !selection.category,
      'is-taxonomy-filter entry-type-parent-filter', () => {
        expanded.set(family, true);
        onChange(active && !selection.category ? '' : family, '');
      }));
    const disclosure = text('button', '', 'entry-type-branch-toggle');
    disclosure.type = 'button';
    const chevron = text('span', '', 'entry-type-branch-chevron');
    chevron.setAttribute('aria-hidden', 'true');
    disclosure.append(chevron);
    const shell = text('div', '', 'entry-type-children-shell');
    const children = text('div', '', 'entry-type-children');
    children.id = `book-category-children-${encodeURIComponent(family)}`;
    disclosure.setAttribute('aria-controls', children.id);
    const isExpanded = () => expanded.get(family) ?? expandedByDefault;
    const applyExpansion = () => {
      const open = isExpanded();
      branch.classList.toggle('is-expanded', open);
      disclosure.setAttribute('aria-expanded', String(open));
      const label = `${open ? 'Replier' : 'Déplier'} les sous-catégories : ${family}`;
      disclosure.setAttribute('aria-label', label);
      disclosure.title = label;
      shell.inert = !open;
    };
    disclosure.addEventListener('click', () => {
      expanded.set(family, !isExpanded());
      applyExpansion();
    });
    if (active && selection.category && !counts.children.has(selection.category)) counts.children.set(selection.category, 0);
    const orderedChildren = [...counts.children].sort((a, b) => family === 'Bande dessinée'
      ? (comicCategoryOrder.indexOf(a[0]) < 0 ? 99 : comicCategoryOrder.indexOf(a[0]))
        - (comicCategoryOrder.indexOf(b[0]) < 0 ? 99 : comicCategoryOrder.indexOf(b[0]))
        || a[0].localeCompare(b[0], 'fr')
      : a[0].localeCompare(b[0], 'fr'));
    let hasComicSeparator = false;
    for (const [category, count] of orderedChildren) {
      if (family === 'Bande dessinée' && !hasComicSeparator
        && category === 'Études sur la BD') {
        const separator = text('span', '|', 'book-comic-category-separator');
        separator.setAttribute('aria-hidden', 'true');
        children.append(separator);
        hasComicSeparator = true;
      }
      const child = button(category, count, active && selection.category === category,
        'is-taxonomy-filter entry-type-child-filter', () => {
          expanded.set(family, true);
          onChange(family, active && selection.category === category ? '' : category);
        });
      child.dataset.depth = '1';
      const details = counts.details.get(category);
      if (details?.size || (active && selection.category === category && selection.detail)) {
        const selected = active && selection.category === category;
        const row = text('div', '', 'book-category-child-branch');
        row.classList.toggle('is-selected', selected);
        const detailRow = text('div', '', 'book-category-details');
        detailRow.id = `book-category-details-${encodeURIComponent(family)}-${encodeURIComponent(category)}`;
        detailRow.setAttribute('role', 'group');
        detailRow.setAttribute('aria-label', `${category === 'Programmation' ? 'Langages' : 'Sous-catégories'} : ${category}`);
        detailRow.hidden = !selected;
        child.setAttribute('aria-expanded', String(selected));
        child.setAttribute('aria-controls', detailRow.id);
        const detailCounts = new Map(details ?? []);
        if (family === 'Sciences humaines et sociales' && category === 'Psychologie et développement personnel') {
          for (const label of ['Psychologie', 'Développement personnel']) {
            if (!detailCounts.has(label)) detailCounts.set(label, 0);
          }
        }
        if (selected && selection.detail && !detailCounts.has(selection.detail)) detailCounts.set(selection.detail, 0);
        const isCinema = family === 'Art / Culture' && category === 'Cinéma / Audiovisuel';
        const appendDetail = (target, detail, detailCount) => {
          const detailButton = button(detail, detailCount, selected && selection.detail === detail,
            'is-taxonomy-filter entry-type-child-filter book-category-detail-filter',
            () => onChange(family, category, selection.detail === detail ? '' : detail));
          detailButton.dataset.depth = '2';
          target.append(detailButton);
        };
        if (isCinema) {
          detailRow.classList.add('book-cinema-groups');
          const remaining = new Map(detailCounts);
          for (const [label, labels] of cinemaGroups) {
            const present = labels.filter(detail => remaining.has(detail));
            if (!present.length) continue;
            const group = text('div', '', 'book-cinema-group');
            group.setAttribute('role', 'group');
            group.setAttribute('aria-label', label);
            const heading = text('span', label, 'book-cinema-group-label');
            const filters = text('div', '', 'book-cinema-group-filters');
            for (const detail of present) {
              appendDetail(filters, detail, remaining.get(detail));
              remaining.delete(detail);
            }
            group.append(heading, filters);
            detailRow.append(group);
          }
          // Keep future or previously selected details reachable before grouping them.
          for (const [detail, count] of remaining) appendDetail(detailRow, detail, count);
        } else {
          for (const [detail, count] of [...detailCounts].sort((a, b) => a[0].localeCompare(b[0], 'fr')))
            appendDetail(detailRow, detail, count);
        }
        row.append(child, detailRow);
        children.append(row);
      } else children.append(child);
    }
    shell.append(children);
    branch.append(disclosure, shell);
    applyExpansion();
    taxonomy.append(branch);
  }
  container.append(utilities, taxonomy);
  wrapper.append(container);
  return wrapper;
}
