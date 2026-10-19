import {reviewedLanguageWorkAdditions} from './reviewed-language-works-20261016.js?v=2026-10-16-review1';
import {canonicalBookCategoryPaths} from './canonical-categories.js?v=2026-10-16-language-learning1';

// Explicit work relationships, not title-similarity or shared-ISBN heuristics.
export const reviewedLanguageWorks = [{
  id: 'gaudi-jeremy-roe',
  publisher: 'Parkstone International', authors: ['Roe, Jeremy'],
  evidence: [
    'https://www.libreriauniversitaria.it/ebook/9781780428376/autore-jeremy-roe/ebook-antoni-gaudi.htm',
    'https://pocketbook.de/en/antoni-gaudi-9781780429670',
  ],
  editions: [
    {sourceId: 'scholarvox:88835588', language: 'fr',
      title: "Antoni Gaudí : L'architecte des rêves et de la dévotion",
      isbns: ['9781780428376', '9781859959282']},
    {sourceId: 'scholarvox:88835868', language: 'en',
      title: 'Antoni Gaudí : The Architect of Dreams and Devotion',
      isbns: ['9781780429670', '9781859959244']},
  ],
}, ...reviewedLanguageWorkAdditions];

function matchesEdition(book, edition, work) {
  const variant = book.variants.find(v => v.source_id === edition.sourceId);
  return variant && book.title === edition.title && variant.title === edition.title
    && variant.publisher === work.publisher && variant.availability?.platform === (edition.platform ?? 'scholarvox')
    && JSON.stringify(variant.authors ?? []) === JSON.stringify(work.authors)
    && JSON.stringify([...(variant.isbns ?? [])].sort()) === JSON.stringify(edition.isbns)
    && book.languages.length === 1 && book.languages[0] === edition.language
    && variant.languages?.length === 1 && variant.languages[0] === edition.language;
}

export function createBookLanguageGrouper(catalogue) {
  const candidates = new Map();
  const wanted = new Set(reviewedLanguageWorks.flatMap(work => work.editions.map(e => e.sourceId)));
  for (const book of catalogue) for (const variant of book.variants) {
    if (wanted.has(variant.source_id)) {
      const books = candidates.get(variant.source_id) ?? [];
      books.push(book);
      candidates.set(variant.source_id, books);
    }
  }
  const byBook = new Map();
  for (const work of reviewedLanguageWorks) {
    const members = work.editions.map(edition => {
      const books = candidates.get(edition.sourceId) ?? [];
      return books.length === 1 && matchesEdition(books[0], edition, work)
        ? {book: books[0], language: edition.language} : null;
    });
    if (members.some(member => !member) || new Set(members.map(m => m.book.id)).size !== members.length) continue;
    const group = {id: work.id, members};
    for (const member of members) byBook.set(member.book.id, group);
  }

  // The input is already filtered. Related links may offer another language,
  // but only matching editions can supply the displayed title or selector.
  return function groupLanguageEditions(matches, {canAccess = () => true} = {}) {
    const visible = new Map();
    for (const book of matches) if (byBook.has(book.id)) visible.set(book.id, book);
    if (!visible.size) return matches;
    const emitted = new Set();
    return matches.flatMap(book => {
      const group = byBook.get(book.id);
      if (!group) return [book];
      if (emitted.has(group.id)) return [];
      emitted.add(group.id);
      const members = group.members.filter(member => visible.has(member.book.id))
        .map(member => ({...member, book: visible.get(member.book.id)}));
      members.sort((a, b) => Number(b.language === 'fr') - Number(a.language === 'fr'));
      const preferred = members[0].book;
      if (members.length > 1) return [{...preferred, languageWorkId: group.id,
        languageEditions: members,
        languages: [...new Set(members.flatMap(member => member.book.languages))],
        publishers: [...new Set(members.flatMap(member => member.book.publishers ?? []))],
        availability: members.flatMap(member => member.book.availability),
        categories: [...new Set(members.flatMap(member => member.book.categories ?? []))],
        editorialCategories: canonicalBookCategoryPaths(members.flatMap(member => member.book.editorialCategories ?? []))}];
      const alternatives = group.members.filter(member => member.book.id !== preferred.id)
        .map(member => ({...member, book: {...member.book,
          availability: member.book.availability.filter(access => canAccess(access.resource_id))}}))
        .filter(member => member.book.availability.length);
      return [{...preferred, relatedLanguageEditions: alternatives}];
    });
  };
}
