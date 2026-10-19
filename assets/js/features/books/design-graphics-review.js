import {canonicalBookCategoryPaths} from './canonical-categories.js?v=2026-10-16-language-learning1';

// Individually reviewed editions; no inference from the word "design" alone.
export const graphicDesignDecisions = [
  {source_id: 'scholarvox:40001327', title: 'Créer un logotype', publisher: "Editions d'Organisation",
    authors: ['Urvoy, Jean-Jacques', 'Fardin, Pierre-Emmanuel'], isbns: ['9782212542431', '9782212864007'],
    eisbn: '9782212864007', excerpt: '', reason: 'Conception de logotypes et identité visuelle, explicitement nommée par le titre.'},
  {source_id: 'scholarvox:88948785', title: 'Design in Airline Travel Posters 1920-1970 : A Semiology and Sociocultural History',
    publisher: 'Anthem Press', authors: ['Scott, David'], isbns: ['9781785276286', '9781785276293'],
    eisbn: '9781785276293', excerpt: 'This book studies design in airline travel posters of the 1920-1970 period.',
    reason: 'La description porte sur les affiches publicitaires, leurs images et leurs textes, non sur les objets ou les intérieurs.'},
  {source_id: 'scholarvox:88981207', title: "L'Art de l'UI Design : Méthodes et bonnes pratiques du design d'interface utilisateur",
    publisher: 'Dunod', authors: ['Krakus, Olivier'], isbns: ['9782100888894', '9782100897735'],
    eisbn: '9782100897735', excerpt: 'Complet et pédagogique, L Art de l UI Design présente tous les concepts,',
    reason: 'La description détaille la hiérarchie visuelle, la typographie, les couleurs, les icônes et les grilles des interfaces numériques.'},
  {source_id: 'scholarvox:88838262', title: 'La typographie suisse du Bauhaus à Paris Ed. 1',
    publisher: 'Presses polytechniques et universitaires romandes', authors: ['Chatelain, Roger'],
    isbns: ['9782832310663', '9782880747718'], eisbn: '9782832310663', excerpt: '',
    reason: 'Ouvrage explicitement consacré à la typographie, pas à l’ensemble des disciplines du Bauhaus.'},
];
const decisions = new Map(graphicDesignDecisions.map(d => [d.source_id, d]));

function matches(variant, decision) {
  if (!variant || !decision) return false;
  const description = variant.metadata?.description || variant.metadata?.abstract || '';
  return variant.title === decision.title && variant.publisher === decision.publisher
    && variant.availability?.platform === 'scholarvox'
    && variant.metadata?.eisbn === decision.eisbn
    && JSON.stringify(variant.authors ?? []) === JSON.stringify(decision.authors)
    && JSON.stringify([...(variant.isbns ?? [])].sort()) === JSON.stringify([...decision.isbns].sort())
    && (decision.excerpt ? description.startsWith(decision.excerpt) : description === '');
}

export function reviewGraphicDesignPaths(paths, variants) {
  const approved = new Set(variants.filter(v => matches(v, decisions.get(v.source_id))).map(v => v.source_id));
  if (!approved.size) return paths;
  let changed = false;
  const reviewed = paths.flatMap(path => {
    if (path.family !== 'Art / Culture' || path.subcategory !== 'Architecture, design et urbanisme'
      || !path.details?.includes('Design et décoration')) return [path];
    const moved = (path.sourceIds ?? []).filter(id => approved.has(id));
    if (!moved.length) return [path];
    changed = true;
    const retained = path.sourceIds.filter(id => !approved.has(id));
    return [
      ...(retained.length ? [{...path, sourceIds: retained}] : []),
      {...path, sourceIds: moved,
        details: [...new Set(path.details.map(detail => detail === 'Design et décoration' ? 'Design graphique' : detail))],
        ruleIds: [...new Set([...(path.ruleIds ?? []), 'graphic-design-reviewed-edition-20261016'])]},
    ];
  });
  return changed ? canonicalBookCategoryPaths(reviewed) : paths;
}
