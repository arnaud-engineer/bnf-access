// Display vocabulary only: edition decisions and provider metadata stay intact.
const literature = 'Littérature et études littéraires';
const humanities = 'Sciences humaines et sociales';
const familyAliases = new Map([
  ['Économie et gestion', 'Économie / Droit / Gestion'],
  ['Éducation et enseignement', 'Éducation et formation'],
  ['Fiction', literature],
  ['Poésie et théâtre', literature],
  ['Religions et spiritualités', humanities],
]);
const categoryAliases = new Map([
  [humanities, new Map([
    ['Anthropologie', ['Anthropologie et ethnologie', 'Anthropologie']],
    ['Ethnologie', ['Anthropologie et ethnologie', 'Ethnologie']],
    ['Ethnologie et ethnologie', ['Anthropologie et ethnologie', 'Ethnologie']],
    ['Méthodes et recherche en sciences humaines', ['Méthodes de recherche']],
    ['Travail social et accompagnement', ['Travail social', 'Accompagnement']],
    ['Psychologie', ['Psychologie et développement personnel', 'Psychologie']],
    ['Sciences humaines et sociales', ['Généralités']],
  ])],
  ['Sciences et techniques', new Map([
    ['Agriculture et agroalimentaire', ['Agriculture et agro-alimentaire']],
    ['Mathématiques', ['Mathématiques et statistiques']],
    ['Sciences forensiques', ['Sciences forensiques et criminalistique']],
    ['Criminalistique', ['Sciences forensiques et criminalistique']],
    ['Astronomie et espace', ['Physique et astronomie', 'Astronomie et astrophysique']],
    ['Eau et assainissement', ['Eau, assainissement et déchets', 'Eau et assainissement']],
    ['Environnement et écologie', ['Environnement et transitions écologiques']],
    ['Industrie et procédés', ['Ingénierie et industrie']],
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
    ['Mode et design', ['Mode et arts décoratifs', 'Mode et textile']],
    ['Études et histoire des arts', ['Art', 'Études et histoire des arts']],
  ])],
  ['Langues et linguistique', new Map([
    ['Sociolinguistique', ['Linguistique', 'Sociolinguistique']],
    ['Traduction', ['Traduction et interprétation', 'Traduction']],
    ['Traduction et traductologie', ['Traduction et interprétation', 'Traductologie']],
  ])],
  ['Économie / Droit / Gestion', new Map([
    ['Management et organisation', ['Management', 'Organisation']],
    ['Marketing', ['Marketing et vente', 'Marketing']],
    ['Marketing et communication commerciale', ['Marketing et vente', 'Communication commerciale']],
  ])],
  ['Éducation et formation', new Map([
    ['Orientation et métiers', ['Orientation et recherche d’emploi', 'Métiers']],
  ])],
  [literature, new Map([
    ['Anthologies littéraires', ['Anthologies']],
    ['Essais', ['Récits et essais littéraires', 'Essais']],
  ])],
  ['Politique et relations internationales', new Map([
    ['Relations internationales', ['Géopolitique et relations internationales']],
    ['Politique et relations internationales', ['Généralités']],
    ['Science politique', ['Politique', 'Science politique']],
  ])],
  ['Santé et médecine', new Map([
    ['Médecine du sport', ['Médecine clinique', 'Médecine du sport']],
    ['Santé visuelle', ['Médecine clinique', 'ORL et ophtalmologie']],
    ['Sexualité et santé sexuelle', ['Médecine clinique', 'Sexologie']],
    ['Prévention et santé au travail', ['Santé environnementale et au travail', 'Santé au travail']],
    ['Vieillissement et gérontologie', ['Vieillissement et autonomie', 'Vieillissement et gérontologie']],
  ])],
]);

const detailAliases = new Map([
  ['Langues et linguistique\0Apprentissage des langues', new Map([
    ['Ancien français', 'Français (ancien)'],
  ])],
  ['Art / Culture\0Arts visuels', new Map([
    ['Graphisme', 'Graphisme et design graphique'], ['Design graphique', 'Graphisme et design graphique'],
  ])],
  ['Économie / Droit / Gestion\0Économie', new Map([
    ['Industries culturelles', 'Économie et industries culturelles'],
  ])],
  [humanities + '\0Sociologie', new Map([
    ['Métiers culturels', 'Sociologie de la culture'],
  ])],
  ['Sciences et techniques\0Agriculture et agro-alimentaire', new Map([
    ['Agroalimentaire', 'Agro-alimentaire'], ['Aquaculture et pêche', 'Pêche et aquaculture'],
  ])],
  ['Sciences et techniques\0Chimie', new Map([
    ['Chimie de l’environnement', 'Chimie environnementale'], ['Chimie générale', 'Généralités'],
  ])],
  ['Sciences et techniques\0Physique et astronomie', new Map([
    ['Optique', 'Optique et photonique'],
  ])],
  ['Sciences et techniques\0Sciences de la Terre', new Map([
    ['Géologie', 'Géologie et géophysique'],
  ])],
  ['Sciences et techniques\0Matériaux et métallurgie', new Map([
    ['Polymères', 'Polymères et composites'],
  ])],
  ['Sciences et techniques\0Électricité, électronique et télécommunications', new Map([
    ['Télécommunications', 'Télécommunications et signal'],
  ])],
  [humanities + '\0Religion', new Map([
    ['Ésotérisme et occultisme', 'Ésotérisme'],
  ])],
  [literature + '\0Fiction', new Map([
    ['Roman historique', 'Romans historiques'], ['Fiction historique', 'Romans historiques'],
  ])],
  ['Santé et médecine\0Biologie et sciences médicales', new Map([
    ['Génétique', 'Génétique et génomique'],
  ])],
  ['Santé et médecine\0Médecine clinique', new Map([
    ['ORL et troubles auditifs', 'ORL et ophtalmologie'],
  ])],
  ['Informatique\0Web', new Map([
    ['Conception et design web', 'Conception, design et ergonomie'],
    ['Conception et ergonomie', 'Conception, design et ergonomie'],
  ])],
]);

export function canonicalBookCategoryPath(path) {
  if (['Non classés', 'Nouveautés'].includes(path.family)) return path;
  const relocated = path.family === humanities && ['Politique', 'Science politique'].includes(path.subcategory)
    ? 'Politique et relations internationales'
    : path.family === humanities && path.subcategory === 'Médias et communication'
    ? 'Médias et communication' : undefined;
  const family = relocated ?? familyAliases.get(path.family) ?? path.family;
  const fiction = path.family === 'Fiction';
  const religion = path.family === 'Religions et spiritualités';
  const [subcategory, detail] = religion
    ? ['Religion', path.subcategory === 'Religion' ? undefined
      : path.subcategory === 'Ésotérisme et occultisme' ? 'Ésotérisme' : path.subcategory]
    : fiction
    ? ['Fiction', path.subcategory === 'Fiction' ? undefined : path.subcategory]
    : family === 'Médias et communication' && path.subcategory === family
    ? ['Généralités']
    : categoryAliases.get(family)?.get(path.subcategory) ?? [path.subcategory];
  const aliases = detailAliases.get(`${family}\0${subcategory}`);
  const removedDetails = family === humanities && subcategory === 'Anthropologie et ethnologie'
    ? ['Anthropologie', 'Ethnologie']
    : family === 'Économie / Droit / Gestion' && subcategory === 'Marketing et vente'
    ? ['Marketing']
    : family === 'Art / Culture' && subcategory === 'Arts visuels' ? ['Satire et caricature'] : [];
  const details = [...new Set([...(path.details ?? []), ...(detail ? [detail] : [])]
    .filter(value => !removedDetails.includes(value)).map(value => aliases?.get(value) ?? value))];
  if (family === path.family && subcategory === path.subcategory
      && JSON.stringify(details) === JSON.stringify(path.details ?? [])) return path;
  return {...path, family, subcategory,
    ...(path.details || details.length ? {details} : {}),
    ruleIds: [...new Set([...(path.ruleIds ?? []), 'editorial-canonical-label'])]};
}

export function canonicalBookCategoryPaths(paths) {
  const merged = new Map();
  for (const original of paths.flatMap(splitScreenAndStagePath).map(canonicalBookCategoryPath).flatMap(splitGraphicDesignPath)) {
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

function splitGraphicDesignPath(path) {
  if (path.family !== 'Art / Culture' || path.subcategory !== 'Architecture, design et urbanisme'
    || !path.details?.includes('Design graphique')) return [path];
  const retained = path.details.filter(d => d !== 'Design graphique');
  const rules = [...new Set([...(path.ruleIds ?? []), 'small-branches-approved-20261016'])];
  return [
    ...(retained.length ? [{...path, details: retained, ruleIds: rules}] : []),
    {...path, subcategory: 'Arts visuels', details: ['Graphisme et design graphique'], ruleIds: rules},
  ];
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
