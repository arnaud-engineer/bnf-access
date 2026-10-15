const fold = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[œŒ]/g, 'oe').replace(/[’‘]/g, "'").toLowerCase();
const literary = (subcategory, rule) => ({family: 'Littérature et études littéraires', subcategory, ruleIds: [rule]});

// Named periodicals retain their dossier subjects alongside their publication form.
export function addLiteraryPeriodicalPaths(paths, variant, title = '') {
  if (!paths.length || paths.some(p => ['Non classés', 'Nouveautés'].includes(p.family))) return paths;
  const text = fold(variant.title ?? title);
  const publisher = fold(variant.metadata?.display_publisher);
  const identified = (publisher === 'revue des deux mondes' && /^revue des deux mondes(?:\s|:|$)/.test(text))
    || (publisher === 'grasset' && /^l[ae] regle du jeu n(?:[°ºo.]|\s)*\d/.test(text))
    || (publisher === 'editions du septentrion' && /^revue littoral n(?:[°ºo.]|\s)*\d/.test(text));
  if (!identified || paths.some(p => p.family === 'Littérature et études littéraires'
    && p.subcategory === 'Revues littéraires')) return paths;
  return [...paths, literary('Revues littéraires', 'literature-identified-periodical')];
}

// Named works reviewed from catalogue titles, not guesses from an author's name.
const workStudies = new Set([19660, 19846, 463, 19567, 2, 19499, 19484, 19579,
  19485, 19489, 19571, 19781, 19488, 19504, 19481, 10794, 137499, 4489,
  19666, 19538, 19494, 19469, 19492, 20493, 52800, 486].map(id => `garnier:${id}`));
const studyAuthors = [
  'Jeanne Flore', 'Agrippa d’Aubigné', 'Aimé Césaire', 'Édouard Glissant', 'Alain Jouffroy',
  'Albert Camus', 'Albert Cohen', 'Alfred Jarry', 'André Pieyre de Mandiargues', 'André Suarès',
  'Apollinaire', 'Aragon', 'Montaigne', 'Barthélemy Aneau', 'Beckett', 'Samuel Beckett',
  'Beigbeder', 'Bernard Pingaud', 'Blaise Cendrars', 'Bohumil Hrabal', 'Charles-Albert Cingria',
  'Jean Cocteau', 'Claudel', 'Paul Claudel', 'Clément Marot', 'Céline Arnauld', 'Dante',
  'Dostoïevski', 'Francis Ponge', 'Françoise Sagan', 'Jean Follain', 'Henri Thomas',
  'Henry de Montherlant', 'Hélisenne de Crenne', 'Jean Bouchet', 'Jean de Sponde',
  'Jean Giono', 'Jean Paulhan', 'Jean-Baptiste Chassignet', 'Jean-Loup Trassard',
  'Jules Supervielle', 'Marguerite Duras', 'Marguerite Yourcenar', 'Maurice Scève',
  'Noël du Fail', 'Pascal Quignard', 'Paul Léautaud', 'Philippe Desportes', 'Pierre Boaistuau',
  'Pontus de Tyard', 'Pétrarque', 'Rabelais', 'René Char', 'Roger Caillois', 'Romain Rolland',
  'Sade', 'Shakespeare', 'Simone de Beauvoir', 'Valery Larbaud', 'Yves Bonnefoy',
  'Étienne de La Boétie', 'Balzac', 'Baudelaire', 'Georges Perec', 'Patrick Modiano',
  'André Frénaud', 'François Bon', 'Le Clézio', 'Léopold Sédar Senghor', 'Jean Second',
  'Ronsard', 'Malraux', 'Sagan', 'Georges Perros', 'Audiberti',
].map(fold);
const escapePattern = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const authorStudy = new RegExp(`(?:^|\\b(?:autour de|etudes sur|essais sur|lectures de|chez|dans l'oeuvre de|dans l'oeuvre d'|poetique de|poetique d'|poesie de|poesie d'))\\s*(?:${studyAuthors.map(escapePattern).join('|')})(?=$|[\\s,:;.!?'-])`);
const explicitWorkStudy = /\b(?:book analysis|analyse approfondie|analyse d[' ]oeuvre|analyse de l[' ](?:oeuvre|\?uvre)|fiches? de lecture|review and analysis|summary and analysis)\b/;

export function refineLiteraryStudies(paths, variant, title = '') {
  const text = fold(variant.title ?? title);
  return paths.map(p => {
    if (p.family !== 'Littérature et études littéraires' || p.subcategory !== 'Études littéraires') return p;
    let subcategory, rule;
    if (workStudies.has(variant.source_id) || explicitWorkStudy.test(text)) {
      subcategory = 'Analyses d’Œuvres'; rule = 'literature-work-study';
    } else if (!/\b(?:bibliograph\w*|catalogue|inventaire|index|autres etudes sur la litterature)\b/.test(text)
      && authorStudy.test(text)) {
      subcategory = 'Analyses d’Auteurs'; rule = 'literature-author-study';
    } else return p;
    const {details, ...retained} = p;
    return {...retained, subcategory, ruleIds: [...new Set([...(p.ruleIds ?? []), rule])]};
  });
}

// Reviewed Prêt BnF editions: collected Literature is a broad shelf, not a genre.
const reviewed = new Map([
  ['pret-bnf:631f3a2fee368700016cc7a1', ['Essais', 'Essais']],
  ['pret-bnf:631f3a2fee368700016cc7a9', ['Essais', 'Essais']],
  ['pret-bnf:631f3a0eee368700016cbe1a', ['Essais', 'Essais']],
  ['pret-bnf:631f3a1fee368700016cc318', ['Sciences humaines et sociales', 'Philosophie']],
  ['pret-bnf:631f39faee368700016cb879', ['Littérature et études littéraires', 'Fiction']],
  ['pret-bnf:6581907a4c485400011bbc34', ['Littérature et études littéraires', 'Fiction']],
  ['pret-bnf:631f3adbee368700016cf757', ['Biographie', 'Biographie']],
  ['pret-bnf:687a6c56e0644d115f57c0e5', ['Littérature et études littéraires', 'Études littéraires']],
  ['pret-bnf:6581906d4c485400011bb555', ['Art / Culture', 'Bande dessinée']],
  ['pret-bnf:631f39f2ee368700016cb64b', ['Art / Culture', 'Art']],
  ['pret-bnf:631f3a08ee368700016cbc9e', ['Art / Culture', 'Voyage']],
  ['pret-bnf:631f3a26ee368700016cc4e6', ['Art / Culture', 'Voyage']],
  ['pret-bnf:631f3a06ee368700016cbbf2', ['Art / Culture', 'Voyage']],
  ['pret-bnf:631f3a25ee368700016cc4df', ['Art / Culture', 'Voyage']],
]);

export function refineLiteraturePaths(paths, variant, title = '') {
  const broad = p => p.family === 'Littérature et études littéraires'
    && ['Littérature', 'Littérature française'].includes(p.subcategory);
  if (!paths.some(broad)) return paths;
  const retained = paths.filter(p => !broad(p));
  const metadata = variant.metadata ?? {}, text = fold(variant.title ?? title);
  const summary = fold(metadata.abstract ?? metadata.description).slice(0, 700);
  const sources = (metadata.filter_categories ?? []).map(fold);
  const explicitStudy = sources.some(s => /^etudes (?:et essais|de litterature|montaignistes)/.test(s));
  const primaryText = sources.includes('textes de la renaissance');
  const assignment = reviewed.get(variant.source_id);
  let replacements;
  if (assignment) replacements = [{family: assignment[0], subcategory: assignment[1], ruleIds: ['literature-edition-reviewed']}];
  else if (explicitStudy) replacements = [literary('Études littéraires', 'literature-source-study')];
  else if (retained.some(p => p.family === 'Littérature et études littéraires'
    && ['Fiction', 'Poésie', 'Théâtre', 'Études littéraires'].includes(p.subcategory))
    || sources.includes('geographies du monde')) replacements = [];
  else if (/\b(?:commentaire|commentaires|bibliographie|repertoire analytique|histoire de la poesie|etudes sur|etude de|analyse litteraire|discours de l'art poetique|compendio della poesia)\b/.test(text)
    || (!primaryText && /\b(?:cette etude|la presente etude|cet (?:ouvrage|essai) analyse|ce livre etudie|l'etude (?:se divise|du corpus)|etudes consacrees)\b/.test(summary))) {
    replacements = [literary('Études littéraires', 'literature-explicit-study')];
  } else if (primaryText && /\b(?:tragedie|tragedies|comedie|comedies|theatre|piece dramatique)\b/.test(text)) {
    replacements = [literary('Théâtre', 'literature-primary-text-title')];
  } else if (primaryText && /\b(?:poesies?|poetiques?|poemes?|sonnets?|eglogues?|elegies|odes|epigrammes|psaumes|pseaumes)\b/.test(text)) {
    replacements = [literary('Poésie', 'literature-primary-text-title')];
  } else if (primaryText && /\b(?:ce (?:recueil|volume) (?:contient|comprend|reunit) (?:les |des )?poesies|recueil de poesies?|poeme philosophique|douze eglogues|ces trois recueils.*amour|chef-d'oeuvre poetique)\b/.test(summary)) {
    replacements = [literary('Poésie', 'literature-primary-text-summary')];
  } else if (primaryText && (/\b(?:amadis de gaule|gargantua|pantagruel|heptameron|histoires tragiques|avantures du baron)\b/.test(text)
    || /\b(?:traduction.*(?:d'une novela|du roman)|ce roman|recueil de nouvelles|composante narrative)\b/.test(summary))) {
    replacements = [literary('Fiction', 'literature-primary-text-fiction')];
  } else replacements = [literary('À classer', 'literature-unresolved')];
  const inherited = paths.filter(broad).flatMap(p => p.ruleIds ?? []);
  return [...retained, ...replacements.map(p => ({...p, ruleIds: [...new Set([...inherited, ...p.ruleIds])]}))];
}

// Edition-level review keeps memoirs and biographies together by dominant subject.
const biographyEditions = new Map([
  ...['6425a0bdd10d1e00018ccb06', '631f3a54ee368700016cd234', '631f3a4eee368700016cd09e',
    '631f3a1aee368700016cc1aa', '631f3a1dee368700016cc277', '631f3a76ee368700016cdbdb',
    '631f3a58ee368700016cd35e', '631f39b6ee368700016ca54a']
    .map(id => [`pret-bnf:${id}`, ['Histoire-Géo', 'Biographie', 'Historique']]),
  ...['658190754c485400011bb99d', '631f3981ee368700016c960b', '631f3991ee368700016c9ae4',
    '631f3d3eee368700016da58d', '631f3a23ee368700016cc443', '631f3a12ee368700016cbf44',
    '631f3988ee368700016c9807', '631f39f0ee368700016cb5bf', '631f3ac7ee368700016cf1ca',
    '631f3a0eee368700016cbe0c', '631f397aee368700016c941b', '631f397aee368700016c940d',
    '631f3adbee368700016cf757']
    .map(id => [`pret-bnf:${id}`, ['Littérature et études littéraires', 'Biographie']]),
  ...['scholarvox:88951526', 'pret-bnf:631f3cbeee368700016d819a',
    'pret-bnf:631f3a20ee368700016cc33e', 'scholarvox:88859208']
    .map(id => [id, ['Histoire-Géo', 'Biographie', 'Sciences et techniques']]),
  ['scholarvox:88921306', ['Littérature et études littéraires', 'Fiction', 'Science-fiction']],
  ['scholarvox:88948212', ['Sciences et techniques', 'Mathématiques']],
  ['pret-bnf:631f3a08ee368700016cbc7b', ['Économie / Droit / Gestion', 'Droit']],
]);

export function redistributeBiographyPaths(paths, variant) {
  if (!paths.some(p => p.family === 'Biographie')) return paths;
  const assignment = biographyEditions.get(variant.source_id)
    ?? ['Histoire-Géo', 'Biographie', 'À classer'];
  const [family, subcategory, detail] = assignment;
  const retained = paths.filter(p => p.family !== 'Biographie'
    && !(variant.source_id === 'pret-bnf:6425a0bdd10d1e00018ccb06' && p.subcategory === 'Fiction')
    && !(variant.source_id === 'pret-bnf:631f3ac7ee368700016cf1ca' && p.subcategory === 'Études littéraires'));
  return [...retained, {family, subcategory, ...(detail ? {details: [detail]} : {}),
    ruleIds: [biographyEditions.has(variant.source_id) ? 'biography-edition-reviewed' : 'biography-awaiting-review']}];
}
