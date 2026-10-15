// Display vocabulary only: edition decisions and provider metadata stay intact.
const literature = 'Littérature et études littéraires';
const humanities = 'Sciences humaines et sociales';
const familyAliases = new Map([
  ['Économie et gestion', 'Économie / Droit / Gestion'],
  ['Éducation et enseignement', 'Éducation et formation'],
  ['Fiction', literature],
  ['Poésie et théâtre', literature],
]);
const categoryAliases = new Map([
  [humanities, new Map([
    ['Anthropologie', ['Anthropologie et ethnologie', 'Anthropologie']],
    ['Ethnologie', ['Anthropologie et ethnologie', 'Ethnologie']],
    ['Ethnologie et ethnologie', ['Anthropologie et ethnologie', 'Ethnologie']],
    ['Méthodes et recherche en sciences humaines', ['Méthodes de recherche']],
    ['Travail social et accompagnement', ['Travail social', 'Accompagnement']],
    ['Psychologie', ['Psychologie et développement personnel', 'Psychologie']],
  ])],
  ['Sciences et techniques', new Map([
    ['Agriculture et agroalimentaire', ['Agriculture et agro-alimentaire']],
  ])],
  ['Histoire-Géo', new Map([
    ['Histoire des sciences et des techniques', ['Histoire des sciences et techniques']],
  ])],
  ['Art / Culture', new Map([
    ['Architecture et design', ['Architecture, design et urbanisme']],
    ['Architecture et urbanisme', ['Architecture, design et urbanisme', 'Urbanisme']],
    ['Arts graphiques', ['Arts visuels', 'Arts graphiques']],
    ['Peinture', ['Arts visuels', 'Peinture']],
    ['Sculpture', ['Arts visuels', 'Sculpture']],
    ['Cinéma', ['Cinéma et audiovisuel', 'Cinéma']],
    ['Spectacle et arts de la scène', ['Spectacle et arts vivants']],
    ['Danse', ['Spectacle et arts vivants', 'Danse']],
    ['Musées et patrimoine', ['Patrimoine et musées']],
    ['Cuisine et gastronomie', ['Cuisine']],
  ])],
  ['Langues et linguistique', new Map([
    ['Sociolinguistique', ['Linguistique', 'Sociolinguistique']],
    ['Traduction', ['Traduction et interprétation', 'Traduction']],
  ])],
  ['Économie / Droit / Gestion', new Map([
    ['Management et organisation', ['Management', 'Organisation']],
  ])],
  ['Éducation et formation', new Map([
    ['Orientation et métiers', ['Orientation et recherche d’emploi', 'Métiers']],
  ])],
]);

export function canonicalBookCategoryPath(path) {
  if (['Non classés', 'Nouveautés'].includes(path.family)) return path;
  const family = familyAliases.get(path.family) ?? path.family;
  const fiction = path.family === 'Fiction';
  const [subcategory, detail] = fiction
    ? ['Fiction', path.subcategory === 'Fiction' ? undefined : path.subcategory]
    : categoryAliases.get(family)?.get(path.subcategory) ?? [path.subcategory];
  if (family === path.family && subcategory === path.subcategory) return path;
  return {...path, family, subcategory,
    ...((path.details?.length || detail) ? {details: [...new Set([...(path.details ?? []), ...(detail ? [detail] : [])])]} : {}),
    ruleIds: [...new Set([...(path.ruleIds ?? []), 'editorial-canonical-label'])]};
}

export function canonicalBookCategoryPaths(paths) {
  const merged = new Map();
  for (const original of paths.flatMap(splitScreenAndStagePath)) {
    const path = canonicalBookCategoryPath(original);
    const key = `${path.family}\0${path.subcategory}`;
    const previous = merged.get(key);
    if (!previous) merged.set(key, {...path,
      ...(path.details ? {details: [...path.details]} : {}),
      ...(path.sourceIds ? {sourceIds: [...path.sourceIds]} : {}),
      ...(path.ruleIds ? {ruleIds: [...path.ruleIds]} : {})});
    else for (const field of ['details', 'sourceIds', 'ruleIds']) {
      if (path[field]) previous[field] = [...new Set([...(previous[field] ?? []), ...path[field]])];
    }
  }
  return [...merged.values()];
}

function splitScreenAndStagePath(path) {
  if (path.family !== 'Art / Culture' || path.subcategory !== 'Cinéma et spectacle') return [path];
  const screen = (path.details ?? []).filter(d => ['Cinéma', 'Animation', 'Séries et télévision', 'Techniques audiovisuelles'].includes(d));
  const stage = (path.details ?? []).filter(d => ['Théâtre et arts du spectacle', 'Danse'].includes(d));
  if (!screen.length && !stage.length) return [path];
  const shared = (path.details ?? []).filter(d => !screen.includes(d) && !stage.includes(d));
  return [
    ...(screen.length ? [{...path, subcategory: 'Cinéma et audiovisuel', details: [...screen, ...shared]}] : []),
    ...(stage.length ? [{...path, subcategory: 'Spectacle et arts vivants', details: [...stage, ...shared]}] : []),
  ].map(p => ({...p, ruleIds: [...new Set([...(p.ruleIds ?? []), 'editorial-screen-stage-split'])]}));
}
