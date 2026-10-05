// Display grouping only: editions, provider links and favorite IDs stay independent.
export function volumeIdentity(book) {
  const match = book.title.match(/^(.+?)\s*(?:[:,;-]\s*)?(retrospective supplement|supplément rétrospectif|supplement|supplément|volume|vol\.?|tome)\s+(\d{1,4})(.*)$/i);
  if (!match || Number(match[3]) < 1) return null;
  const title = match[1].replace(/[\s:;,\-]+$/, '').trim();
  if (!title) return null;
  const normalize = value => value.normalize('NFC').toLocaleLowerCase('fr').replace(/\s+/g, ' ').trim();
  const supplement = /supplement|supplément/i.test(match[2]);
  const retrospective = /retrospective|rétrospectif/i.test(match[2]);
  const kind = supplement ? (retrospective ? 'retrospective-supplement' : 'supplement') : 'volume';
  const label = supplement ? (retrospective ? 'Supplément rétrospectif' : 'Supplément') : /^tome$/i.test(match[2]) ? 'Tome' : 'Volume';
  // Gale's source title/volume confirms subtitles and set/edition annotations.
  const sourceConfirmed = book.variants?.length > 0 && book.variants.every(variant => {
    if (variant.availability.platform !== 'gale') return false;
    const source = normalize(variant.metadata.source_title ?? '');
    return supplement ? source === normalize(book.title.slice(0, book.title.length - match[4].length).trim())
      : source === normalize(title) && Number(variant.metadata.volume) === Number(match[3]);
  });
  if (match[4].trim() && !sourceConfirmed) return null;
  const publishers = [...(book.publishers ?? [])].map(normalize).sort();
  // Unknown publishers are insufficient evidence to join similarly named books.
  if (!publishers.length) return null;
  const platforms = [...new Set(book.availability.map(access => access.platform))].sort();
  // Confirmed Gale supplement families can span a change in publisher branding.
  const publisherIdentity = sourceConfirmed ? ['gale-source-family'] : publishers;
  return {title,
    number: Number(match[3]), label, kind,
    key: JSON.stringify([normalize(title), publisherIdentity, platforms])};
}

export function groupBookSeries(books) {
  const groups = new Map();
  for (const book of books) {
    const volume = volumeIdentity(book);
    if (!volume) continue;
    const group = groups.get(volume.key) ?? [];
    group.push({book, ...volume});
    groups.set(volume.key, group);
  }
  const emitted = new Set();
  return books.flatMap(book => {
    const volume = volumeIdentity(book);
    const members = volume && groups.get(volume.key);
    if (!members || new Set(members.map(item => `${item.kind}:${item.number}`)).size < 2) return [book];
    if (emitted.has(volume.key)) return [];
    emitted.add(volume.key);
    const rank = {volume: 0, supplement: 1, 'retrospective-supplement': 2};
    const ordered = [...members].sort((a, b) => rank[a.kind] - rank[b.kind]
      || a.number - b.number || a.book.title.localeCompare(b.book.title, 'fr'));
    return [{...ordered[0].book, title: volume.title, seriesVolumes: ordered}];
  });
}
