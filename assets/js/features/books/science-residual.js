const rules = [
  ['Mathématiques et statistiques', 'Analyse', /\b(?:optimisation|optimization|ondelettes?|wavelets?|analyse harmonique|analyse matricielle|analyse non standard|time series|series temporelles|boundary value problems|iterative methods|hypergeometric|trigonometri\w*|analyse pour l'agregation|cours d'analyse|calcul vectoriel|calcul mental|calculus|integral transforms)\b/],
  ['Mathématiques et statistiques', 'Algèbre et géométrie', /\b(?:mapping class groups|anneaux|theorie de la mesure|espaces metriques|entropie metrique|complex analysis|lie groups|number theory)\b/],
  ['Mathématiques et statistiques', 'Probabilités et statistiques', /\b(?:econometrics|econometrie|analyse factorielle|analyses factorielles|random process|probabiliste|techniques de sondage|probability distributions|birnbaum-saunders distribution)\b/],
  ['Biologie et écologie', 'Biologie végétale et animale', /\b(?:anatomie (?:comparee|du bois|des bois)|anatomy of (?:dolphins|animals)|odonata|dragonflies|damselflies|moths|ants|ospreys|vultures?|bovids|antelopes|cetaces|seahorses|lamiaceae|microtoena|snowdrops|aloes|bamboos|bambous|hetre|tulipes?|coniferes?|carnivores|heteropter\w*|phytophages|aphididae|mycorrhiz\w*|mycorhiz\w*)\b/],
  ['Biologie et écologie', 'Évolution et paléontologie', /\b(?:paleontolog\w*|paleontologists|fossils?|fossiles?|pterosaurs|dinosaurs?|dinosaures?|human evolution|evolutionary processes|evolution of nervous systems|natural selection|selection naturelle|multicellular development)\b|^evolution\s*(?:[:–-]|ed\.|$)|\bevolution\s*:\s*components\b/],
  ['Biologie et écologie', 'Écologie', /\b(?:ecosysteme\w*|ecologique\w*|ecotoxicolog\w*|biomes|especes envahissantes|especes vegetales|biocontrol)\b/],
  ['Sciences de la Terre', 'Géologie et géophysique', /\b(?:tecton\w*|stratigra\w*|biostratigra\w*|mining|mines et carrieres|minieres?|ore deposits|magmas?|massifs rocheux|glaces|lysimetr\w*)\b/],
  ['Sciences de la Terre', 'Océanographie et hydrologie', /\b(?:cycle de l'eau|hydrobiolog\w*|torrent\w*|alea pluvial|el nino|precipitation|fleuve\w*)\b/],
  ['Physique et astronomie', 'Astronomie et astrophysique', /\b(?:stellar|interstellaire|eclipses?|dans l'espace|space trajectories|solar heating|ferroelectricity)\b/],
  ['Construction et génie civil', 'Bâtiment et structures', /\b(?:habitat|maisons?|architecte d'interieur|macons?|facade\w*|etancheite a l'air|chauffage|air de l'enveloppe|bridge (?:engineering|loads|management|design))\b/],
  ['Mécanique et robotique', 'Mécanique des fluides', /\b(?:cavitation|bubble dynamics|centrifugal pump|pumps?|propeller\w*|engrenages?|fluidic|thermo-fluidic)\b/],
  ['Électricité, électronique et télécommunications', 'Télécommunications et signal', /\b(?:cellular communications|wireless communication|rf ic|signaux|speech processing|telephone installation|origins of radio)\b/],
  ['Métrologie et instrumentation', 'Métrologie', /\b(?:etalonnage|incertitudes? de mesures?|processus de mesure|test and measurement|colour and appearance measurement)\b/],
  ['Industrie et procédés', 'Fabrication et procédés', /\b(?:impression 3d|imprimer en 3d|bioprinting|filtration|braiding|nonwovens|carpet manufacture|fermentation technology|separation (?:par membranes|physicochimique)|process plant layout|installations frigorifiques)\b/],
  ['Énergie', 'Hydrocarbures', /\b(?:oil recovery|well completion|well cementing|reservoir simulation|oil reservoir|gas reservoir|water injection)\b/],
  ['Chimie', 'Généralités', /\b(?:alkaloids|alcaloides|carboranes|ionic liquids|periodic table|tableau periodique|cesium|asymmetric synthesis|alkaline earth compounds)\b/],
  ['Eau, assainissement et déchets', 'Eau et assainissement', /\b(?:water quality|questions pratiques sur l'eau|effluent treatment|dechets|pollution|depollution)\b/],
  ['Génie biomédical', 'Dispositifs et technologies médicales', /\b(?:biomedical engineering|genie biomedical|biomedical (?:devices|sensors|signal|signals)|prosthesis|prosthetic|organ-on-a-chip)\b/],
  ['Prévention des risques et ergonomie', 'Sécurité et risques professionnels', /\b(?:laboratory safety|machinery safety|process safety|risques professionnels|risques au travail|risques \(au travail\)|resilience engineering|engineering a safer world)\b/],
  ['Prévention des risques et ergonomie', 'Ergonomie', /\b(?:ergonomics|intervention en ergonomie|ergonomie industrielle|ergonomie au travail)\b/],
];

// Only remaining generic Sciences variants: never override a specialized source.
export function residualSciencePaths(title) {
  const text = String(title ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[’‘]/g, "'").toLowerCase();
  const primary = text.replace(/^(?:aide[ -]memoire|formulaire|memento)\s*[-–—:]\s*/, '').split(/\s[-–—:]\s/)[0];
  const paths = new Map();
  for (const [subcategory, detail, pattern] of rules) {
    if (!pattern.test(primary)) continue;
    const path = paths.get(subcategory) ?? {family: 'Sciences et techniques', subcategory,
      details: [], ruleIds: ['science-residual-subject']};
    if (!path.details.includes(detail)) path.details.push(detail);
    paths.set(subcategory, path);
  }
  return [...paths.values()];
}
