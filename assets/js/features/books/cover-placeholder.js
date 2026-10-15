const publisherAliases = new Map([
  ['eni', /^(?:editions? )?eni$/],
  ['peterlang', /\bpeter lang\b/],
  ['garnier', /\b(?:classiques garnier|garnier)\b/],
  ['rsc', /\b(?:royal society of chemistry|rsc publishing)\b/],
]);

export function placeholderBrand(book, platforms = []) {
  const publishers = (book.publishers ?? [book.publisher]).filter(Boolean)
    .map(name => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim());
  const publisher = platforms.find(p => p.resource?.icon_url
    && publishers.some(name => publisherAliases.get(p.id)?.test(name)));
  if (publisher) return {...publisher, kind: 'éditeur'};
  for (const access of book.availability ?? []) {
    const platform = platforms.find(p => p.id === access.platform && p.resource?.icon_url);
    if (platform) return {...platform, kind: 'plateforme'};
  }
  return null;
}
