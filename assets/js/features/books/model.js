import {searchableCredits} from './credits.js';
import {bookEditorialCategoryPaths} from './taxonomy.js?v=2026-10-18-prebnf4';

// Indexed catalogue snapshots are immutable; each new index gets fresh caches.
const editorialPathCaches = new WeakMap();
const newEntryTracking = new WeakMap();

// Books use accent folding without punctuation removal; keep it distinct from
// catalogue normalization so ISBNs, quoted titles and existing queries still match.
export const foldBookText = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function bookFavoriteId(book) {
  return `book:${book.variants.map(variant => variant.source_id).sort()[0]}`;
}

export function isFavoriteBook(book, favoriteIds) {
  return book.variants.some(variant => favoriteIds.has(`book:${variant.source_id}`));
}

export function indexBookCatalog(data, {trackNewEntries = true} = {}) {
  if (data.schema_version !== 1 || !Array.isArray(data.books)) throw new Error("Invalid book catalogue");
  if (data.compact_variants === 1) {
    data = {...data, books: data.books.map(book => ({...book, variants: book.variants.map(variant => ({
      title: book.title, authors: book.authors, publisher: book.publisher, isbns: book.isbns,
      languages: book.languages, cover: book.cover, ...variant
    }))}))};
  }
  const books = data.books.map((book) => ({ ...book,
    suggestionSearch: foldBookText([book.title, ...searchableCredits(book), ...book.variants.map((variant) => variant.metadata.display_publisher || variant.publisher), ...book.isbns].join(" ")),
    search: foldBookText([book.title, ...searchableCredits(book), ...book.variants.map((variant) => variant.metadata.display_publisher || variant.publisher), ...book.publishers, ...book.isbns].join(" ")),
    titleSearch: foldBookText(book.title),
  }));
  // Every source alias resolves to the same book, while the saved favorite uses
  // the existing stable, sorted source ID. Do not merge variants by print ISBN.
  const favoriteBooks = new Map();
  for (const book of books) {
    editorialPathCaches.set(book, new Map());
    newEntryTracking.set(book, trackNewEntries);
    for (const variant of book.variants) favoriteBooks.set(`book:${variant.source_id}`, book);
  }
  const defaultFavorites = [...new Set((data.default_favorites ?? []).map(id => `book:${id}`)
    .filter(id => favoriteBooks.has(id)).map(id => bookFavoriteId(favoriteBooks.get(id))))];
  return {
    books,
    favoriteBooks,
    defaultFavorites
  };
}

// Inputs are explicit and records are copied: filtering never rewrites the
// catalogue or the user's selection. Suggestions deliberately omit platform names.
export function filterBooks(books, {context, selection, favoriteIds, query, ignore = "", forSuggestions = false}) {
  const foldedQuery = foldBookText(query.trim());
  const words = foldedQuery.split(/\s+/).filter(Boolean);
  const result = [];
  for (const book of books ?? []) {
    if (!words.every((word) => (forSuggestions ? book.suggestionSearch : book.search).includes(word))) continue;
    // An unknown language is visible under All, never a match for a specific language.
    if (context.languages.size && !book.languages.some((code) => context.languages.has(code))) continue;
    const availability = book.availability.filter((access) => context.canAccess(access.resource_id)
      && (["platform", "all"].includes(ignore) || !selection.platform || access.platform === selection.platform));
    if (!availability.length) continue;
    const platforms = new Set(availability.map((access) => access.platform));
    const variants = book.variants.filter((variant) => platforms.has(variant.availability.platform));
    const publishers = [...new Set(variants.map((variant) => variant.metadata.display_publisher || variant.publisher).filter(Boolean))];
    const categories = [...new Set(variants.flatMap((variant) => variant.metadata.display_categories ?? variant.metadata.filter_categories ?? []))];
    const cache = editorialPathCaches.get(book);
    const cacheKey = variants.map(variant => variant.source_id).join('\0');
    let paths = cache?.get(cacheKey);
    if (!paths) {
      paths = bookEditorialCategoryPaths(variants, {title: book.title, knownVariants: book.variants,
        trackNewEntries: newEntryTracking.get(book) ?? true});
      cache?.set(cacheKey, paths);
    }
    const sourceCategories = variants.map(variant => ({sourceId: variant.source_id,
      platform: variant.availability.platform,
      categories: [...(variant.metadata.filter_categories ?? [])],
      displayCategories: [...(variant.metadata.display_categories ?? variant.metadata.filter_categories ?? [])]}));
    if (context.favoritesOnly && !isFavoriteBook(book, favoriteIds)) continue;
    if (!["publisher", "all"].includes(ignore) && selection.publisher && !publishers.includes(selection.publisher)) continue;
    if (!["family", "all"].includes(ignore) && selection.family && !paths.some(path => path.family === selection.family)) continue;
    if (!["category", "family", "all"].includes(ignore) && selection.category
        && !paths.some(path => (!selection.family || path.family === selection.family) && path.subcategory === selection.category)
        && (selection.family || !categories.includes(selection.category))) continue;
    if (!["detail", "category", "family", "all"].includes(ignore) && selection.detail
        && !paths.some(path => path.family === selection.family && path.subcategory === selection.category
          && path.details?.includes(selection.detail))) continue;
    result.push({ ...book, availability, publishers, categories, sourceCategories,
      editorialCategories: paths.map(path => ({...path, sourceIds: [...path.sourceIds],
        ...(path.ruleIds ? {ruleIds: [...path.ruleIds]} : {}), ...(path.details ? {details: [...path.details]} : {})})),
      score: foldedQuery && book.titleSearch.startsWith(foldedQuery) ? 0 : 1 });
  }
  if (foldedQuery) result.sort((a, b) => a.score - b.score || a.title.localeCompare(b.title, "fr"));
  return result;
}
