const fold = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[’‘]/g, "'").toLowerCase();

const literaryCollections = new Set([
  'Textes de la Renaissance', 'Études et essais sur la Renaissance',
  'Bibliothèque de la Renaissance',
  'Société internationale de recherches interdisciplinaires sur la Renaissance (S.I.R.I.R.)',
].map(fold));

// These editions have a historical subject independent of their collection.
const historicalEditions = new Map([
  [19845, 'les relations diplomatiques entre les deux monarchies'],
  [19788, 'Robertet qui dirigea la politique étrangère française'],
  [19718, 'Histoire du Concile de Trente de Paolo Sarpi'],
  [86784, 'la manière de se soigner dans la principauté de Montbéliard'],
  [19546, 'trois siècles de la civilisation occidentale'],
  [19548, "les jésuites se démarquent des autres acteurs de l'évangélisation"],
  [19542, "l'histoire de la danse et des mentalités européennes"],
  [98094, 'L’émancipation des consciences à la Renaissance'],
  [19528, 'la connaissance du livre imprimé au xvie siècle'],
  [136374, 'le rôle politique et culturel essentiel des médecins'],
  [19584, "l'absolutisme monarchique se consolidait"],
  [19566, 'l’histoire de la politique culturelle'],
  [7317, 'Ce recueil explore les frontières de l’histoire'],
  [19539, 'la représentation de l’homosexualité à la Renaissance'],
  [19583, 'la vie intellectuelle franco-écossaise'],
  [136858, 'légitimer l’exercice d’un pouvoir au féminin'],
  [19681, 'ses années de gloire militaire, diplomatique et politique'],
  [19671, 'la propagande dirigée contre Henri III'],
  [19883, 'de rares images de la vie familiale'],
  [19706, 'divers points d’histoire'],
  [19673, 'traversé la Saint-Barthélemy et bravé l’autorité royale'],
  [19855, 'exalter le courtisan, le guerrier et le serviteur de la monarchie'],
  [19550, 'restitue le rôle historique essentiel'],
  [13095, 'histoire du livre, histoire du droit'],
  [13454, 'privilèges d’impression accordés aux auteurs'],
  [20501, 'une biographie qui étudie l’ascendance et la vie'],
  [107735, 'croise histoire événementielle et littéraire'],
  [19737, 'le statut de la femme à la Renaissance'],
  [19843, 'Ce procès-verbal nous livre'],
  [12849, 'l’histoire des relations qu’Érasme entretint avec la France'],
].map(([id, excerpt]) => [`garnier:${id}`, fold(excerpt)]));

export function reviewRenaissanceCollectionPaths(paths, variant) {
  const renaissance = p => p.family === 'Histoire-Géo' && p.subcategory === 'Renaissance';
  if (!paths.some(renaissance) || !paths.some(p => p.family === 'Littérature et études littéraires')) return paths;
  const metadata = variant.metadata ?? {};
  const collected = (metadata.filter_categories ?? []).map(fold);
  if (!collected.includes('litterature francaise') || !collected.some(c => literaryCollections.has(c))
    || collected.includes('histoire') || collected.includes('history') || collected.includes('renaissance')) return paths;
  const evidence = historicalEditions.get(variant.source_id);
  if (evidence) {
    // Missing/replaced evidence fails closed: do not silently remove history.
    if (!fold(metadata.abstract ?? metadata.description).includes(evidence)) return paths;
    return paths.map(p => renaissance(p) ? {...p,
      ruleIds: [...new Set([...(p.ruleIds ?? []), 'renaissance-reviewed-historical-subject'])]} : p);
  }
  return paths.filter(p => !renaissance(p)).map(p => p.family === 'Littérature et études littéraires'
    ? {...p, ruleIds: [...new Set([...(p.ruleIds ?? []), 'renaissance-literary-collection-not-history'])]} : p);
}
