import {refineLiteraryStudies} from './literature-taxonomy.js?v=2026-10-12-healthscience1';
import {reviewedLettersEditions} from './letters-editions.js?v=2026-10-12-healthscience1';
import {reviewUnresolvedHistory, reviewHistoricalMisrouting} from './history-review.js?v=2026-10-12-healthscience1';
import {reviewRemainingPendingPaths} from './remaining-pending-review.js?v=2026-10-13-pending1';

const fold = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[’‘]/g, "'").replace(/œ/g, 'oe').toLowerCase();
const path = (family, subcategory, rule, details) => ({family, subcategory,
  ruleIds: [rule], ...(details?.length ? {details} : {})});
const matching = (text, rules) => rules.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);

const economicSubjects = [
  ['Comptabilité et audit', /\b(?:comptab\w*|accounting|audit\w*|comptes consolides|controle de gestion|ifrs|dcg|dscg)\b/],
  ['Finance', /\b(?:financ\w*|bourse|boursier\w*|investiss\w*|investment\w*|banking|banqu\w*|asset management|gestion de patrimoine|trading|stock market|credit|assurance\w*)\b/],
  ['Marketing et vente', /\b(?:marketing|vente\w*|vendre|sales|branding|marques?|relation client|customer|commercial\w*|negociation commerciale|e-commerce|publicite|advertising)\b/],
  ['Ressources humaines', /\b(?:ressources humaines|human resources|rh|recrut\w*|recruit\w*|gestion du personnel|paie|payroll|droit du travail|gestion des competences|employee\w*|salaries)\b/],
  ['Entrepreneuriat', /\b(?:entrepreneur\w*|entreprendre|entrepreneuriat|startups?|start-ups?|creation d'entreprise|creer (?:son|une) entreprise|business model|business plan|auto-entrepreneur\w*)\b/],
  ['Management', /\b(?:management|manager\w*|leadership|dirigeant\w*|gouvernance|strategie d'entreprise|business strategy|gestion (?:du temps|de projet\w*|des equipes|de crise)|pilotage|logistique|supply chain|decision\w*|coaching|productivite|prise de parole|prendre la parole|negociation|organisation\w*)\b/],
  ['Économie', /\b(?:econom\w*|macro.?econom\w*|micro.?econom\w*|croissance|inflation|mondialisation|globalization|commerce international|monnaie|monetary|capitalism\w*|capitalisme|inegalites|competitivite|developpement economique|fiscal\w*)\b/],
];

function economics(title) {
  const labels = matching(title, economicSubjects);
  return (labels.length ? labels : ['À classer']).map(label => path('Économie / Droit / Gestion', label,
    labels.length ? 'editorial-economics-title' : 'editorial-economics-unresolved'));
}

const languages = [
  ['Anglais', /\b(?:anglais|english|toefl|toeic|ielts)\b/],
  ['Allemand', /\b(?:allemand|german|deutsch\w*)\b/],
  ['Espagnol', /\b(?:espagnol|spanish|espanol)\b/],
  ['Italien', /\b(?:italien|italian|italiano)\b/],
  ['Français', /\b(?:francais|french|fle)\b/],
  ['Latin et grec', /\b(?:latin|grec|greek)\b/],
  ['Autres langues', /\b(?:arabe|arabic|chinois|chinese|japonais|japanese|russe|russian|portugais|portuguese|hebreu|hebrew|coreen|korean|neerlandais|dutch)\b/],
];
const languageLearning = /\b(?:grammaire|grammar|conjugaison|vocabulaire|vocabulary|orthographe|spelling|apprendre (?:le |l'|une langue)|learn (?:english|french|german|spanish)|toefl|toeic|ielts|fle|premiers pas en anglais|parler anglais|langue etrangere|foreign language|a1\/a2|b1-b2)\b/;
const languageStudies = /\b(?:linguisti\w*|phoneti\w*|phonolog\w*|syntax\w*|semanti\w*|sociolinguisti\w*|psycholinguisti\w*|discours|discourse|terminolog\w*)\b/;
const translation = /\b(?:traduction|traduct\w*|translation studies|translating|interpretation de conference|conference interpreting|interpretes?)\b/;
const literaryStudies = /\b(?:fiche de lecture|fiches de lecture|analyse (?:complete|detaillee|de l'oeuvre)|analysis of|summary|resume (?:complet|detaille)|comprendre (?:la litterature|l'oeuvre)|book review|review and analysis|etudes? litteraires?|literary|litterature|literature|litteraire\w*|poetique|poetics|romanciers?|romanesque|novels?|rewritings|ecriture|narratolog\w*|literatur\w*)\b/;

function languagePath(title, sourceCategory = '') {
  if (translation.test(title)) return path('Langues et linguistique', 'Traduction et interprétation', 'editorial-language-translation');
  if (languageLearning.test(title)) {
    const details = matching(title, languages);
    if (!details.length && sourceCategory) details.push(...matching(fold(sourceCategory), languages));
    return path('Langues et linguistique', 'Apprentissage des langues', 'editorial-language-learning',
      details.length ? details : ['À classer']);
  }
  if (languageStudies.test(title) && !/\b(?:semantic web|web semantique)\b/.test(title)) return path('Langues et linguistique', 'Linguistique', 'editorial-language-linguistics');
  if (literaryStudies.test(title)) {
    const guide = /\b(?:fiche de lecture|fiches de lecture|analyse (?:complete|detaillee|de l'oeuvre)|review and analysis|resume complet)\b/.test(title);
    return path('Littérature et études littéraires', guide ? 'Analyses d’Œuvres' : 'Études littéraires',
      'editorial-language-literary-study', !guide && sourceCategory ? matching(fold(sourceCategory), languages) : undefined);
  }
  return null;
}

function education(title) {
  const language = languagePath(title);
  if (language && language.subcategory !== 'Études littéraires') return [language];
  if (/\b(?:entrepreneur\w*|entreprendre|creation d'entreprise|marketing|management|manager\w*|ressources humaines|rh)\b/.test(title)) return economics(title);
  const rules = [
    ['Pédagogie et enseignement', /\b(?:pedagog\w*|enseigner|enseignement|teaching|education|educational|teachers?|enseignant\w*|didacti\w*|transmission du savoir|learning in schools?)\b/],
    ['Études et concours', /\b(?:concours|examen\w*|exam\w*|post-bac|parcoursup|sciences po|iep|baccalaureat|brevet|annales|reussir ses etudes|admission\w*|ecoles? de commerce)\b/],
    ['Formation professionnelle', /\b(?:formation professionnelle|professional training|adult education|lifelong learning|formateur\w*|formation engageante|experiences de formation|alternance|apprentissage professionnel|developper ses competences)\b/],
    ['Orientation et recherche d’emploi', /\b(?:emploi|job search|job interview|carriere|career|orientation professionnelle|reconversion|cv|curriculum vitae|lettre de motivation|entretien\w* (?:de recrutement|d'embauche)|profession|metiers?|vie professionnelle)\b/],
  ];
  const labels = matching(title, rules);
  return (labels.length ? labels : ['À classer']).map(label => path('Éducation et formation', label,
    labels.length ? 'editorial-education-title' : 'editorial-education-unresolved'));
}

function history(title, renaissance = false, metadata = {}, sourceId = '') {
  if (renaissance) return [path('Histoire-Géo', 'Renaissance', 'editorial-history-source-renaissance')];
  const transfer = reviewHistoricalMisrouting(title, metadata, sourceId);
  if (transfer) return transfer;
  const periods = [
    ['Antiquité', /\b(?:antiquite|antique|ancient|antiquity|rome antique|roman empire|empire romain|grece antique|grece ancienne|grece classique|egypte ancienne|hieroglyph\w*|pharaon\w*|mesopotam\w*|alexandre le grand|jules cesar)\b/],
    ['Moyen Âge', /\b(?:moyen.age|mediev\w*|medieval\w*|middle ages|croisades?|crusades?|caroling\w*|meroving\w*|charlemagne|feodal\w*|gothique)\b/],
    ['Renaissance', /\b(?:renaissance|humanisme renaissant|renaissance humanism)\b/],
    ['Époque moderne', /\b(?:early modern|epoque moderne|ancien regime|louis xiv|louis xv|louis xvi|reforme protestante|siecle des lumieres|enlightenment|guerre de trente ans|revolution francaise)\b/],
    ['Époque contemporaine', /\b(?:contemporain\w*|contemporary|world wars?|guerres? mondiales?|premiere guerre|seconde guerre|nazis\w*|nazism|holocaust\w*|shoah|guerre froide|cold war|decolon\w*|napoleon\w*|national socialism|troisieme republique|cinquieme republique)\b/],
  ];
  const labels = matching(title, periods);
  // Dates are useful in history, but not arbitrary isolated numbers or page counts.
  for (const match of title.matchAll(/\b(\d{3,4})\s*[-–—]\s*(\d{3,4})\b/g)) {
    const start = Number(match[1]), end = Number(match[2]);
    if (start > end || start < 500 || end > 2030) continue;
    for (const [label, min, max] of [['Moyen Âge', 500, 1491], ['Époque moderne', 1492, 1788], ['Époque contemporaine', 1789, 2030]]) {
      if (start <= max && end >= min) labels.push(label);
    }
  }
  const openingYear = title.match(/^(\d{4})(?:\s*[:.]|\s*[-–—]\s)/);
  if (openingYear) {
    const year = Number(openingYear[1]);
    if (year >= 1789 && year <= 2030) labels.push('Époque contemporaine');
    else if (year >= 1492 && year < 1789) labels.push('Époque moderne');
    else if (year >= 1000 && year < 1492) labels.push('Moyen Âge');
  }
  if (/\b(?:xix|xx|xxi|19th|20th|21st)\b.*\b(?:siecle|century)\b/.test(title)
    || /\b(?:siecle|century)\b.*\b(?:xix|xx|xxi)\b/.test(title)) labels.push('Époque contemporaine');
  if (/\b(?:xvi|xvii|xviii|16th|17th|18th)\b.*\b(?:siecle|century)\b/.test(title)
    || /\b(?:siecle|century)\b.*\b(?:xvi|xvii|xviii)\b/.test(title)) labels.push('Époque moderne');
  const general = /\b(?:histoire universelle|world history|histoire generale|historiograph\w*|metier d'historien|method\w* (?:en|de l')histoire|introduction a l'histoire)\b/.test(title);
  if (!labels.length && !general) {
    const reviewed = reviewUnresolvedHistory(title, metadata);
    if (reviewed) return reviewed;
  }
  return [...new Set(labels.length ? labels : [general ? 'Généralités' : 'À classer'])]
    .map(label => path('Histoire-Géo', label, labels.length ? 'editorial-history-period' : general
      ? 'editorial-history-general' : 'editorial-history-unresolved'));
}

function letters(title, metadata, sourceId) {
  const language = languagePath(title);
  if (language) return [language];
  if (/(?:\s:\s|^)(?:roman|recueil de nouvelles|contes)(?:\s|$)/.test(title)) {
    return [path('Littérature et études littéraires', 'Fiction', 'editorial-letters-title')];
  }
  const rules = [
    ['Sciences humaines et sociales', 'Philosophie', /\b(?:philosoph\w*|metaphysi\w*|epistemolog\w*|ethique|ethics|ontology|ontolog\w*)\b/],
    ['Sciences humaines et sociales', 'Sociologie', /\b(?:sociolog\w*|sciences sociales|social sciences|inegalites sociales|classes sociales|social class)\b/],
    ['Politique et relations internationales', 'Politique et relations internationales', /\b(?:democrati\w*|democracy|geopoliti\w*|relations internationales|international relations|political science|science politique)\b/],
    ['Histoire-Géo', 'Histoire', /\b(?:histoire|history|historique|historian\w*|historiograph\w*)\b/],
    ['Histoire-Géo', 'Géographie', /\b(?:geograph\w*|geographi\w*|geographie)\b/],
    ['Religions et spiritualités', 'Religion', /\b(?:religion\w*|theolog\w*|christianity|christianisme|chretien\w*|judaism\w*|judaisme|bouddhi\w*|buddhis\w*|islam\w*)\b|\bchristian (?:faith|theology|ethics|church|thought|doctrine|meditation|life|context)\b/],
    ['Littérature et études littéraires', 'Poésie', /\b(?:recueil de poemes|poemes|poetry|poesie|poeme)\b/],
    ['Littérature et études littéraires', 'Théâtre', /\b(?:tragedie|comedie|piece de theatre)\b/],
    ['Littérature et études littéraires', 'Fiction', /(?:\s:\s|^)(?:roman|recueil de nouvelles|contes)(?:\s|$)|\b(?:short stories|recueil de nouvelles|policier|thriller|science-fiction|fantasy)\b/],
  ];
  const found = rules.filter(([, , pattern]) => pattern.test(title)).map(([family, subcategory]) => {
    if (subcategory === 'Histoire') return history(title, false, metadata, sourceId);
    return [path(family, subcategory, 'editorial-letters-title')];
  }).flat();
  if (found.length) return found;
  const summary = fold(metadata.abstract ?? metadata.description).slice(0, 600);
  if (/\b(?:ce roman|dans ce roman|roman de|a novel by|this novel|recueil de nouvelles|this collection of short stories)\b/.test(summary)) {
    return [path('Littérature et études littéraires', 'Fiction', 'editorial-letters-summary-fiction')];
  }
  const peerGenre = reviewedLettersEditions.get(sourceId);
  if (peerGenre) return [path('Littérature et études littéraires', peerGenre, 'editorial-letters-reviewed-edition')];
  const reviewed = unresolvedLetters(title, summary);
  if (reviewed) return reviewed;
  return [path('Sciences humaines et sociales', 'Lettres et sciences humaines et sociales à classer', 'editorial-letters-unresolved')];
}

// Applied only after the broad source shelf has failed its existing subject rules.
const lettersSubjects = [
  ['Médias et communication', 'Bibliothèques et documentation', /\b(?:librar(?:y|ies|ians?|ianship)|bibliothecaires?|bibliotheconomie|bibliotheques?|archivistique|archivists?|archiviste|information literacy|information professionals|representation documentaires?|indexation|gestion documentaire|services d'information et de documentation)\b/],
  ['Langues et linguistique', 'Linguistique', /\b(?:langues? minoritaires|langues? officielles|official languages|quantification des langues|structures en langue|lexicograph\w*|lexical\w*|affixation|auxiliaries|stylistique|rhetorique|rhetoric|multilingual\w*|multilingu\w*|bilinguis\w*|creolization of language|numerals|language acquisition)\b/],
  ['Éducation et formation', 'Pédagogie et enseignement', /\b(?:higher education|enseignement superieur|pedagog\w*|didactique|teachers?|educational|education financing|education a l'information)\b/],
  ['Sciences humaines et sociales', 'Anthropologie et ethnologie', /\b(?:anthropologie|anthropology|ethnologie|ethnology|ethnographie|ethnography)\b/],
  ['Sciences humaines et sociales', 'Psychologie et développement personnel', /\b(?:psycholog\w*|psychanal\w*|psychotherap\w*|troubles mentaux|mental disorders)\b/],
  ['Sciences humaines et sociales', 'Sociologie', /\b(?:immigration|migrants?|racisme|racism|racial|inegalit\w*|gender studies|etudes de genre|societal|social movements|mouvements sociaux|interracial|inter-racial)\b/],
  ['Politique et relations internationales', 'Politique et relations internationales', /\b(?:communis\w*|political realities|political authority|political science|human security|nationalisme|nationalism|citizenship|citoyennete|protestations politiques|contestations politiques)\b/],
  ['Économie / Droit / Gestion', 'Droit', /\b(?:land rights|droits de l'homme|droits de la femme|droit (?:civil|penal|constitutionnel|international)|human rights)\b/],
  ['Médias et communication', 'Médias et communication', /\b(?:journalis\w*|journalistic|news media|news aggregat\w*|aggregating the news|communication ecrite)\b/],
  ['Art / Culture', 'Cinéma et spectacle', /\b(?:cinema|movies|screenwriting|scenario|fiches spectacle|choregraph\w*)\b/],
];

const reviewedLetterWorks = new Map([
  ['Fiction', [
    '813', 'adolphe', 'agnes grey', 'acte', 'atala', 'aden arabie', 'anna karenine', 'anna karenina',
    'beatrix', 'bel-ami', 'boule de suif', 'bruges-la-morte', 'candide', 'colomba', 'don quichotte',
    'humilies et offenses', 'jane eyre', 'la princesse de cleves', 'la princesse de montpensier',
    "la journee d'un journaliste americain en 2889 : suivi de : le humbug",
    'la chartreuse de parme', 'le rouge et le noir', 'la peau de chagrin', 'le pere goriot',
    'le grand meaulnes', 'le petit prince', 'les miserables', 'les trois mousquetaires',
    'le comte de monte-cristo', 'madame bovary', 'salammbô',
    'oliver twist', 'olivier twist', 'germinal', 'l assommoir', "l'assommoir", 'notre-dame de paris',
    'les souffrances du jeune werther', 'fort comme la mort', 'a sentimental education',
    "a l'ombre des jeunes filles en fleur", 'du cote de chez swann', 'le cote de guermantes',
    'la prisonniere', 'le temps retrouve', 'les hauts de hurlevent', 'wuthering heights',
    'a cidade e as serras', 'a ilustre casa de ramires', 'a confissao de lucio',
  ]],
  ['Théâtre', ['agamemnon', 'andromaque', 'antigone', 'berenice', 'britannicus', 'cinna',
    'coriolan', 'cyrano de bergerac', 'dom juan', 'hamlet', 'macbeth', 'le cid', 'le misanthrope',
    "l'avare", "l'ecole des femmes", 'les fausses confidences', 'le malade imaginaire',
    'beaucoup de bruit pour rien', 'en attendant godot', 'tartuffe', 'othello', 'phedre']],
  ['Poésie', ['alcools', 'calligrammes', 'les fleurs du mal', 'les contemplations',
    'les chimeres', 'les illuminations', 'une saison en enfer', 'les regrets',
    'meditations poetiques : nouvelles meditations poetiques']],
].flatMap(([genre, titles]) => titles.map(title => [fold(title), genre])));

function unresolvedLetters(title, summary) {
  const result = (family, subcategory, rule, details) => [path(family, subcategory, rule, details)];
  const literature = (subcategory, rule) => result('Littérature et études littéraires', subcategory, rule);
  if (/\b(?:commentaire de texte|questionnaire de lecture|book analysis|analyse approfondie|analyse d'oeuvre|fiches? de lecture)\b/.test(title)) {
    return literature('Analyses d’Œuvres', 'editorial-letters-work-analysis');
  }
  if (/\bagregation\b/.test(title) && /\b(?:hamlet|twelfth night|tender is the night|female quixote|collected poems|sir gawain)\b/.test(title)) {
    return literature('Analyses d’Œuvres', 'editorial-letters-work-analysis');
  }
  if (reviewedLetterWorks.has(title)) return literature(reviewedLetterWorks.get(title), 'editorial-letters-reviewed-work');
  if (/\b(?:essai sur une oeuvre|analyse de (?:l'oeuvre|son oeuvre)|analysis of (?:the|his|her) works?)\b/.test(summary)) {
    return literature('Analyses d’Œuvres', 'editorial-letters-summary-subject');
  }
  if (/\b(?:presente biographie|cette biographie|this biography|biography of)\b/.test(summary)) {
    return literature('Biographie', 'editorial-letters-summary-subject');
  }
  const author = refineLiteraryStudies(literature('Études littéraires', 'editorial-letters-author-candidate'), {}, title);
  if (author[0].subcategory === 'Analyses d’Auteurs') return author;
  if (/\b(?:bibliotheque (?:ideale|classique|de l'essai)|bibliotheque de .+inventaire|narrative\w*|fiction (?:contemporaine|dans|and|et|au)|contemporary .+fiction|ecocriti\w*|poetiques? (?:de|du|des)|poetics|dramaturg\w*|rewriting|ecrivains?|writers?|romanciers?|dans le roman|du roman francophone|in the plays of)\b/.test(title)) {
    return literature('Études littéraires', 'editorial-letters-literary-study');
  }
  if (/\b(?:cinema|movies|scenario|fiches spectacle|choregraph\w*)\b/.test(title)) {
    return result('Art / Culture', 'Cinéma et spectacle', 'editorial-letters-subject');
  }
  if (/\b(?:theatre|theater|drama)\b/.test(title) && !/\b(?:arsene lupin|romans, nouvelles)\b/.test(title)) {
    return literature('Théâtre', 'editorial-letters-theatre');
  }
  if (/\b(?:poems|collected verse|selected verse|recueil poetique|poetic anthology)\b/.test(title)) {
    return literature('Poésie', 'editorial-letters-poetry');
  }
  if (/\b(?:debuter en|etapes pour reussir en|textes latins|themes latins|mots latins|enrichir son anglais|grec ancien par jour|caracteres chinois|manuel de chinois|converser en|expression idiomatique)\b/.test(title)) {
    const details = matching(title, languages);
    return result('Langues et linguistique', 'Apprentissage des langues', 'editorial-letters-language-learning', details);
  }
  for (const [family, subcategory, pattern] of lettersSubjects) {
    if (pattern.test(title)) return result(family, subcategory, 'editorial-letters-subject');
  }
  // A reviewed work name is accepted only as the whole title or with an edition/volume suffix.
  const work = title.replace(/^"\s*|\s*"$/g, '').replace(/\s*(?::\s*(?:tome|volume|edition)|,\s*(?:tome|volume)|\s+ed\.).*$/, '').trim();
  if (reviewedLetterWorks.has(work)) return literature(reviewedLetterWorks.get(work), 'editorial-letters-reviewed-work');
  if (/\b(?:ce recueil (?:de |rassemble des |reunit des )(?:poemes|poesies)|recueil de poesie|collection of poems|poetry collection|selected poems|collected poems)\b/.test(summary)) {
    return literature('Poésie', 'editorial-letters-summary-genre');
  }
  if (/\b(?:ce roman|un roman (?:policier|historique|d'aventure|de science-fiction)|this (?:novel|novella)|a (?:detective|historical|science fiction) novel|collection of short stories|recueil de contes)\b/.test(summary)
    && !/\b(?:analyse|study|critique|etude|commentaire)\b/.test(title)) {
    return literature('Fiction', 'editorial-letters-summary-genre');
  }
  if (/\b(?:cet ouvrage|ce livre|this book|this volume)\s+(?:est (?:un|une)|is (?:an?|about)|porte sur|etudie|examine|explores|examines|presents)\s+(?:l'|la |le |les |the )?(?:linguistique|language acquisition|sociolinguistics)\b/.test(summary)) {
    return result('Langues et linguistique', 'Linguistique', 'editorial-letters-summary-subject');
  }
  if (/\b(?:ce livre|cet ouvrage|this book)\s+(?:etudie|examine|explores|examines|is about)\s+(?:l'|la |le |les |the )?(?:oeuvre|work|poesie|poetry|litterature|literature)\b/.test(summary)) {
    return literature('Études littéraires', 'editorial-letters-summary-subject');
  }
  return null;
}

const computingDetails = new Map([
  ['Données et intelligence artificielle', [
    ['Intelligence artificielle', /\b(?:intelligence artificielle|artificial intelligence|machine learning|deep learning|neural networks?|chatgpt|copilot|nlp|ia|llm|reseaux de neurones)\b/],
    ['Analyse de données', /\b(?:data (?:science|analytics|visuali[sz]ation|mining)|analyse de donnees|business intelligence|power bi|powerpivot|tableau|statistics|statistiques)\b/],
    ['Ingénierie des données', /\b(?:data engineering|ingenierie des donnees|big data|hadoop|spark|talend|etl|data warehouse|data lake|microsoft fabric)\b/],
  ]],
  ['Bases de données', [
    ['SQL et relationnel', /\b(?:sql|mysql|postgresql|mariadb|oracle|sqlite|relationnel\w*|relational|entity framework)\b/],
    ['NoSQL', /\b(?:nosql|mongodb|redis|cassandra|neo4j|graph databases?)\b/],
    ['Administration', /\b(?:administr\w*|dba|optimis\w*|optimiz\w*|audit|backup|sauvegarde|replication|performance)\b/],
  ]],
  ['Graphisme et conception', [
    ['Image et retouche', /\b(?:photoshop|lightroom|gimp|retouche|camera raw|dxo|capture nx|photo numerique)\b/],
    ['PAO', /\b(?:pao|indesign|illustrator|affinity publisher|inkscape|mise en page|desktop publishing)\b/],
    ['3D', /\b(?:blender|3ds max|3d builder|modelisation 3d|3dvia|cinema 4d)\b/],
    ['CAO/DAO', /\b(?:cao|dao|autocad|archicad|revit|solidworks|catia|fusion 360|sketchup)\b/],
  ]],
]);

const chemistryDetails = [
  ['Chimie organique', /\b(?:organic|organique|synthese organique|organic synthesis|heterocycl\w*|stereochem\w*|stereochim\w*|organometal\w*)\b/],
  ['Chimie inorganique', /\b(?:inorganic|inorganique|coordination chemistry|metal complexes)\b/],
  ['Chimie analytique', /\b(?:analytical|analytique|chromatograph\w*|spectroscop\w*|spectrometr\w*|spectrometry|mass spectrometry|chemical analysis|analyse chimique|biosensors?)\b/],
  ['Chimie physique', /\b(?:physical chemistry|chimie physique|physico.?chim\w*|thermodynami\w*|electrochem\w*|electrochim\w*|photochem\w*|photochim\w*|chemical kinetics|reaction kinetics|quantum chemistry|surface chemistry|colloids?|surfactants?|tensioactifs?)\b/],
  ['Biochimie', /\b(?:biochem\w*|biochim\w*|enzymes?|enzymatic|proteins?|proteines?|peptides?|carbohydrates?|glyco\w*)\b/],
  ['Chimie des matériaux', /\b(?:materials?|materiaux|polymers?|polymeres?|plastics?|plastiques?|nanomater\w*|nanoparti\w*|graphene|composites?|ceramics?|ceramiques?|crystals?|cristaux|crystall\w*|cristall\w*|coatings?|revetements?|alloys?|alliages?)\b/],
  ['Chimie environnementale', /\b(?:environment\w*|environnem\w*|pollut\w*|water treatment|wastewater|decontamin\w*|remediation|green chemistry|chimie verte|recycling|recyclage)\b/],
  ['Procédés chimiques et catalyse', /\b(?:chemical engineering|genie chimique|chemical process\w*|reaction engineering|catalys\w*|catalyt\w*|biorefin\w*|refining|raffinage|distillat\w*|reactors?|reacteurs?|process intensification)\b/],
];

const religionDetails = [
  ['Christianisme', /\b(?:christian\w*|chretien\w*|christ|jesus|catholi\w*|protestan\w*|orthodox\w*|church\w*|eglise\w*|ecclesiol\w*|evangel\w*|luther\w*|calvin\w*|bonhoeffer|eucharist\w*|sacram\w*|trinity|trinitaire|trinite|apostles?|apotre\w*|pentecot\w*|saint joseph|saint-pierre de rome)\b/],
  ['Islam', /\b(?:islam\w*|muslim\w*|musulman\w*|coran\w*|quran\w*|koran\w*|soufi\w*|sufi\w*)\b/],
  ['Judaïsme', /\b(?:judaism\w*|judaisme|jew\w*|juif\w*|juive\w*|rabbin\w*|torah|talmud\w*)\b/],
  ['Bouddhisme', /\b(?:bouddh\w*|buddh\w*|nichiren|zen)\b/],
  ['Hindouisme', /\b(?:hindou\w*|hindu\w*|vedas?|vedique\w*|upanishad\w*|bhagavad|krishna|shiva)\b/],
  ['Textes sacrés et exégèse', /\b(?:bible|biblical|biblique\w*|scripture\w*|ecritures? saintes?|holy scriptures?|new testament|old testament|nouveau testament|ancien testament|exeg\w*|gospel\w*|evangile\w*|genesis|genese|coran|quran|torah|talmud|song of songs|corinthians?|cantique des cantiques)\b/],
  ['Théologie', /\b(?:theolog\w*|theologie\w*|christolog\w*|eschatolog\w*|apolog\w*|dogmati\w*|soteriol\w*)\b/],
  ['Ésotérisme', /\b(?:esoter\w*|occult\w*|alchim\w*|alchemy|hermetis\w*|mage|magie|magic|astrolog\w*|kabbal\w*|cabale)\b/],
  ['Histoire et étude des religions', /\b(?:history of religions?|histoire des religions?|religion in history|religions? (?:and|et) (?:societ\w*|politic\w*|sexism\w*|biolog\w*)|sociolog\w* (?:of|des?) religions?|study of religions?|etude des religions?|traditions religieuses|world religions|sciences? des religions|laicite|secular\w*|atheis\w*|atheism\w*|atheisme)\b/],
  ['Spiritualité', /\b(?:spiritual\w*|spirituel\w*|mystic\w*|mystiq\w*|prayer\w*|priere\w*|meditation\w*|monastic\w*|monast\w*|moine\w*|foi|faith)\b/],
];

function religion(original, title) {
  const details = matching(title, religionDetails);
  if (original.subcategory === 'Théologie') details.push('Théologie');
  if (original.subcategory === 'Ésotérisme et occultisme') details.push('Ésotérisme');
  const general = /^(?:religions?|religions? du monde|world religions|introduction (?:a la|to) religion|propos sur la religion)$/.test(title);
  return {...original, family: 'Sciences humaines et sociales', subcategory: 'Religion',
    details: [...new Set(details.length ? details : [general ? 'Généralités' : 'À classer'])],
    ruleIds: [...(original.ruleIds ?? []), 'editorial-religion-details']};
}

export function reorganizeEditorialPath(original, title, metadata = {}, sourceId = '') {
  if (original.ruleIds?.some(rule => ['arts-letters-languages-reviewed-edition',
    'remaining-pending-reviewed-edition'].includes(rule))) return [original];
  const text = fold(title);
  let paths;
  if (original.family === 'Sciences humaines et sociales' && original.subcategory === 'Lettres et sciences humaines et sociales') {
    // A later description must not preempt a guarded review of this source shelf.
    const pending = {...original, subcategory: 'Lettres et sciences humaines et sociales à classer'};
    const reviewed = reviewRemainingPendingPaths([pending], {source_id: sourceId, metadata}, title);
    paths = reviewed.some(p => p.ruleIds?.includes('remaining-pending-reviewed-edition'))
      ? reviewed : letters(text, metadata, sourceId);
  }
  else if (original.family === 'Économie / Droit / Gestion' && original.subcategory === 'Économie et gestion') paths = economics(text);
  else if (original.family === 'Éducation et formation' && ['Éducation', 'Emplois, métiers et formation'].includes(original.subcategory)) paths = education(text);
  else if (original.family === 'Langues et linguistique' && original.subcategory !== 'Linguistique') {
    paths = [languagePath(text, original.subcategory) ?? path('Langues et linguistique', 'À classer', 'editorial-language-unresolved')];
  } else if (original.family === 'Histoire-Géo' && ['Histoire', 'Renaissance'].includes(original.subcategory)) paths = history(text, original.subcategory === 'Renaissance', metadata, sourceId);
  else if (original.family === 'Informatique' && computingDetails.has(original.subcategory)) {
    const details = matching(text, computingDetails.get(original.subcategory));
    paths = [{...original, details: details.length ? details : ['À classer'], ruleIds: ['editorial-computing-details']}];
  } else if (original.family === 'Sciences et techniques' && original.subcategory === 'Chimie') {
    const details = matching(text, chemistryDetails);
    const general = /^(?:chimie|chemistry)(?:\s+(?:ed\.|edition|\d)|\s*[:–—-]|$)/.test(text)
      || /\b(?:chimie generale|general chemistry|introduction a la chimie|introduction to chemistry|basic chemistry|fundamentals of chemistry|principles of chemistry|chimie pour|chemistry for|chimie en fiches|chimie tout-en-un)\b/.test(text);
    paths = [{...original, details: details.length ? details : [general ? 'Généralités' : 'À classer'], ruleIds: ['editorial-chemistry-details']}];
  } else if (original.family === 'Religions et spiritualités') paths = [original];
  else return [original];
  // Also refine religious paths produced by the broad letters classifier above.
  paths = paths.map(p => p.family === 'Religions et spiritualités' ? religion(p, text) : p);
  return paths.map(refined => ({...refined,
    ruleIds: [...new Set([...(original.ruleIds ?? []), ...(refined.ruleIds ?? [])])]}));
}
