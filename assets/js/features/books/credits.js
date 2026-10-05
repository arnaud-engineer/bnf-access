import {displayPersonName} from './names.js';

const editorRoles = new Set(['editor', 'editor.', 'edt', '340']);
const authorRoles = new Set(['author', 'aut', '070']);
const collectiveNames = new Set(['collectif', 'collective', 'various authors']);

// Role variants come from different saved exports. Keep conflicting roles unclassified.
function editorialCredits(book) {
  return book.variants.flatMap(variant => {
    const metadata = variant.metadata;
    const names = (metadata.contributors ?? []).filter(person => {
      const roles = new Set([...(person.roles ?? []), person.role ?? '']);
      return [...roles].some(role => editorRoles.has(role))
        && ![...roles].some(role => authorRoles.has(role));
    }).map(person => person.name).filter(Boolean);
    names.push(...(metadata.editors ?? []).filter(Boolean));
    // Raw Gale credits may be abbreviated: preserve the entire field, never invent names.
    const credits = names.map(name => ({name: displayPersonName(name), platform: variant.availability.platform}));
    if (!names.length && metadata.editors_raw?.trim()) credits.push({name: displayPersonName(metadata.editors_raw, false), platform: variant.availability.platform});
    return credits;
  });
}

// Missing authors and editorial responsibility alone never prove collective authorship.
export function bookCredits(book) {
  const authors = (book.display_authors ?? book.authors ?? []).map(name => displayPersonName(name));
  const namedCollective = authors.length > 0 && authors.every(name => collectiveNames.has(name.trim().toLowerCase()));
  const collective = namedCollective || book.variants.some(variant => variant.metadata.book_type === 'edited-volume'
    || (variant.availability.platform === 'rsc'
      && /^https:\/\/books-rsc-org\.bnf\.idm\.oclc\.org\/books\/edited-volume\/\d+\//.test(variant.availability.url ?? '')));
  const credits = editorialCredits(book);
  const editors = [...new Set(credits.map(person => person.name))];
  if (authors.length && !namedCollective) return {text: authors.join(', '), collective: false, kind: 'authors'};
  if (collective) return {text: `Ouvrage collectif${editors.length ? ` · sous la direction de ${editors.join(', ')}` : ''}`, collective: true, kind: 'collective'};
  if (editors.length) return {text: `${credits.every(person => person.platform === 'openedition') ? 'Sous la direction de' : 'Édition scientifique :'} ${editors.join(', ')}`, collective: false, kind: 'editorial'};
  return {text: 'Auteur non renseigné', collective: false, kind: 'unknown'};
}

export function searchableCredits(book) {
  const names = [...(book.authors ?? []), ...(book.display_authors ?? []),
    ...book.variants.flatMap(variant => [...(variant.authors ?? []),
      ...(variant.metadata.contributors ?? []).map(person => person.name).filter(Boolean),
      ...(variant.metadata.editors ?? []), variant.metadata.editors_raw ?? ''])].filter(Boolean);
  return [...new Set([...names, ...names.map(name => displayPersonName(name))])];
}
