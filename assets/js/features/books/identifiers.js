// Keep identifiers separate from edition grouping: print/set ISBNs need not merge books.
export function bookIdentifiers(book) {
  const values = new Map();
  const add = (label, value) => {
    if (typeof value !== 'string' || !value.trim()) return;
    value = value.trim();
    const key = label.startsWith('ISBN') || label.startsWith('e-ISBN') ? value.replace(/[\s-]/g, '') : value;
    if (!values.has(key) || values.get(key).label === 'ISBN') values.set(key, {label, value});
  };
  for (const variant of book.variants ?? []) {
    const metadata = variant.metadata ?? {};
    add('ISBN imprimé', metadata.print_isbn);
    add('e-ISBN', metadata.eisbn);
    for (const [format, value] of Object.entries(metadata.isbn_by_format ?? {})) {
      const digital = /pdf|epub|electronic|ebook/i.test(format);
      add(`${digital ? 'e-ISBN' : 'ISBN'} (${format})`, value);
    }
    for (const value of metadata.bibliographic_isbns ?? []) add('ISBN', value);
    for (const value of variant.isbns ?? []) add('ISBN', value);
    for (const [field, label] of [['doi', 'DOI'], ['issn', 'ISSN'], ['oclc', 'OCLC'], ['ark', 'ARK']]) add(label, metadata[field]);
  }
  for (const value of book.isbns ?? []) add('ISBN', value);
  return [...values.values()];
}
