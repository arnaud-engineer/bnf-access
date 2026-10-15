import {reviewedUnclassifiedZeroPaths} from './unclassified-zero-review.js?v=2026-10-13-zero1';
import {reviewedUnclassifiedMilestonePaths} from './unclassified-milestone-review.js?v=2026-10-13-milestone1';
import {computingCategoryPaths, eniComputingCategoryPaths, discoverComputingPaths} from './computing-taxonomy.js?v=2026-10-12-healthscience1';
import {agricultureCategoryPath} from './agriculture-taxonomy.js?v=2026-10-12-healthscience1';
import {scienceCategoryPaths} from './science-taxonomy.js?v=2026-10-12-healthscience1';
import {reviewGenericScience} from './science-review.js?v=2026-10-12-healthscience1';
import {residualSciencePaths} from './science-residual.js?v=2026-10-12-healthscience1';
import {isNewBookEntry} from './new-entries.js?v=2026-10-12-healthscience1';
import {reviewedPeterlangNewcomerBookPaths} from './peterlang-newcomer-review.js?v=2026-10-13-arrivals1';
import {healthCategoryPaths} from './health-taxonomy.js?v=2026-10-12-healthscience1';
import {reviewedFormPaths} from './form-taxonomy.js?v=2026-10-12-healthscience1';
import {genericArtsPaths} from './arts-taxonomy.js?v=2026-10-12-healthscience1';
import {reorganizeEditorialPath} from './editorial-reorganization.js?v=2026-10-12-healthscience1';
import {reviewClassicPaths} from './classics-review.js?v=2026-10-12-healthscience1';
import {refineLiteraturePaths, redistributeBiographyPaths, refineLiteraryStudies, addLiteraryPeriodicalPaths} from './literature-taxonomy.js?v=2026-10-12-healthscience1';
import {reviewRenaissanceCollectionPaths} from './renaissance-review.js?v=2026-10-12-healthscience1';
import {refineComicPaths} from './comics-taxonomy.js?v=2026-10-12-healthscience1';
import {reviewScienceHealthPaths} from './science-health-review.js?v=2026-10-12-healthscience1';
import {reviewArtsLettersLanguagesPaths} from './arts-letters-languages-review.js?v=2026-10-13-review1';
import {reviewRemainingPendingPaths} from './remaining-pending-review.js?v=2026-10-13-pending1';
import {canonicalBookCategoryPaths} from './canonical-categories.js?v=2026-10-15-labels1';
import {reviewTaxonomyCleanupPaths} from './taxonomy-cleanup-review.js?v=2026-10-15-cleanup1';
import {reviewCueBatchPaths} from './cue-review.js?v=2026-10-15-cues1';

// Editorial grouping only: original provider categories remain in metadata.
const groups = [
  ['Bande dessinée', [['À classer', 'Bande dessinée', 'Bande dessinée et roman graphique'], ['Comics'], ['Manga'], ['Manhua']]],
  ['Économie / Droit / Gestion', [['Droit', 'Law'], ['Économie et gestion', 'Économie / gestion', 'Economics and Management', 'Économie']]],
  ['Histoire-Géo', [['Histoire', 'History'], ['Renaissance'], ['Géographie']]],
  ['Sciences humaines et sociales', [['Sciences humaines et sociales'], ['Philosophie', 'Philosophy'], ['Sociologie', 'Sociology'], ['Culture et société', 'Culture & Society'], ['Lettres et sciences humaines et sociales', 'Lettres / sciences humaines et sociales']]],
  ['Politique et relations internationales', [['Politique et relations internationales', 'Politique / relations internationales', 'Political Science']]],
  ['Éducation et formation', [['Éducation', 'Education'], ['Emplois, métiers et formation', 'Emplois / métiers / formation']]],
  ['Langues et linguistique', [['Linguistique', 'Linguistics'], ['Langue et littérature anglaises', 'English Language and Literatures'], ['Langue et littérature allemandes', 'German Language and Literatures'], ['Langues et littératures romanes', 'Romance Languages and Literatures']]],
  ['Littérature et études littéraires', [['Littérature'], ['Littérature française'], ['Études littéraires'], ['Classiques']]],
  ['Fiction', [['Fiction'], ['Jeunesse'], ['Romans et récits', 'Romans / récits'], ['Nouvelles'], ['Romans historiques'], ['Policier et thriller', 'Policier / thriller'], ['Science-fiction'], ['Fantastique et fantasy', 'Fantastique / fantasy']]],
  ['Poésie et théâtre', [['Poésie'], ['Théâtre']]],
  ['Biographie', [['Biographie', 'Biographies et mémoires', 'Biographies / mémoires']]],
  ['Essais', [['Essais']]],
  ['Art / Culture', [['Arts, culture et loisirs', 'Arts / culture / loisirs'], ['Art'], ['Peinture'], ['Musique', 'Music'], ['Cinéma et spectacle', 'Film and Performance Studies'], ['Cuisine', 'Cuisine et gastronomie', 'Cuisine / gastronomie'], ['Voyage']]],
  ['Médias et communication', [['Médias et communication', 'Media and Communication']]],
  ['Informatique', [['Informatique'], ['Bureautique'], ['Graphisme, CAO et DAO', 'Graphisme / CAO / DAO'], ["Informatique d’entreprise et comptabilité", "Informatique d'entreprise / Comptabilité"]]],
  ['Sciences et techniques', [['À classer', 'Sciences'], ['Chimie'], ['Technique']]],
  ['Santé et médecine', [['Santé, sciences de la vie et médecine', 'Santé / sciences de la vie / médecine']]],
  ['Psychologie et développement personnel', [['Psychologie et développement personnel', 'Développement personnel / psychologie'], ['Psychologie'], ['Développement personnel']]],
  ['Religions et spiritualités', [['Religion'], ['Théologie', 'Theology'], ['Ésotérisme et occultisme']]],
];

function literaturePath(path) {
  if (path.family === 'Psychologie et développement personnel') {
    return {...path, family: 'Sciences humaines et sociales', subcategory: path.family,
      details: path.subcategory === path.family ? [] : [path.subcategory]};
  }
  if (path.family === 'Poésie et théâtre') {
    return {...path, family: 'Littérature et études littéraires'};
  }
  if (path.family === 'Fiction') {
    return {...path, family: 'Littérature et études littéraires', subcategory: path.family,
      details: [...new Set([...(path.details ?? []), ...(path.subcategory === 'Fiction' ? [] : [path.subcategory])])]};
  }
  return path;
}

function reviewEditorialPaths(paths, title) {
  const normalized = title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return paths.map(path => {
    if (path.family === 'Sciences humaines et sociales' && path.subcategory === 'Psychologie et développement personnel'
      && !path.details?.length) {
      const details = [];
      if (/\b(?:psycholog\w*|psychanal\w*|cogniti\w*|psychotherap\w*|psychopatholog\w*)\b/.test(normalized)) details.push('Psychologie');
      if (/\b(?:developpement personnel|personal development|self[- ]help|self[- ]esteem|confiance en soi|estime de soi|epanouissement|croissance personnelle|pensee positive|coaching personnel)\b/.test(normalized)) details.push('Développement personnel');
      return {...path, details: details.length ? details : ['À classer'],
        ruleIds: [...(path.ruleIds ?? []), details.length ? 'psychology-personal-development-title' : 'psychology-personal-development-unresolved']};
    }
    return path;
  });
}

const aliases = new Map();
// Explicit review of the twelve historical Nature variants; raw labels stay intact.
const reviewedNature = new Map([
  ['pret-bnf:631f3c61ee368700016d66bd', ['Sciences et techniques', 'Biologie et écologie', 'Biologie végétale et animale']],
  ['pret-bnf:631f3cd1ee368700016d86ea', ['Sciences et techniques', 'Biologie et écologie', 'Biologie végétale et animale']],
  ['pret-bnf:631f3a23ee368700016cc40b', ['Sciences et techniques', 'Agriculture et agro-alimentaire', 'Agriculture']],
  ['pret-bnf:631f3c04ee368700016d4c6a', ['Sciences et techniques', 'Biologie et écologie', 'Biologie végétale et animale']],
  ['pret-bnf:631f3a80ee368700016cdea3', ['Art / Culture', 'Voyage']],
  ['pret-bnf:6425a0dcd10d1e00018cd3ae', ['Sciences et techniques', 'Chimie']],
  ['pret-bnf:658190734c485400011bb82e', ['Sciences et techniques', 'Biologie et écologie', 'Biologie végétale et animale']],
  ['pret-bnf:631f3b9cee368700016d2f07', ['Sciences et techniques', 'Biologie et écologie', 'Biologie végétale et animale']],
  ['pret-bnf:631f3c0cee368700016d4eae', ['Sciences et techniques', 'Agriculture et agro-alimentaire', 'Agriculture']],
  ['pret-bnf:6425a0e5d10d1e00018cd657', ['Sciences et techniques', 'Énergie', 'Nucléaire']],
  ['pret-bnf:631f3ab7ee368700016ced63', ['Sciences et techniques', 'Biologie et écologie', 'Biologie végétale et animale']],
  ['pret-bnf:631f3979ee368700016c93f1', ['Art / Culture', 'Voyage']],
]);
for (const [family, children] of groups) {
  for (const [subcategory, ...sources] of children) {
    for (const source of [subcategory, ...sources]) {
      if (aliases.has(source) && aliases.get(source).subcategory !== subcategory) throw new Error(`Conflicting book category: ${source}`);
      aliases.set(source, {family, subcategory});
    }
  }
}

export function bookCategoryPaths(categories, {platform = ''} = {}) {
  const paths = new Map();
  for (const source of categories) {
    const path = literaturePath(['Actes, mélanges et collectifs', 'Ouvrages de référence et guides', 'Ouvrages de référence / guides'].includes(source)
      ? {family: 'Sciences humaines et sociales', subcategory: 'À classer', ruleIds: ['form-source-awaiting-review']}
      : source === 'Rencontres'
      ? {family: 'Littérature et études littéraires', subcategory: 'À classer', ruleIds: ['collection-source-awaiting-review']}
      : ['Nature et environnement', 'Nature / environnement'].includes(source)
      ? {family: 'Sciences et techniques', subcategory: 'À classer', ruleIds: ['nature-source-regrouping']}
      : platform === 'eni' && source === 'Technique'
      ? {family: 'Informatique', subcategory: 'Technique'}
      : aliases.get(source) ?? {family: 'Autres catégories', subcategory: source});
    const key = `${path.family}\0${path.subcategory}`;
    const existing = paths.get(key);
    paths.set(key, path.details ? {...path, details: [...new Set([...(existing?.details ?? []), ...path.details])]} : path);
  }
  return [...paths.values()];
}

export function bookEditorialCategoryPaths(variants, options = {}) {
  return canonicalBookCategoryPaths(reviewCueBatchPaths(reviewTaxonomyCleanupPaths(
    classifyBookEditorialPaths(variants, options), variants, options.title), variants));
}

function classifyBookEditorialPaths(variants, {title = '', knownVariants = variants, trackNewEntries = false} = {}) {
  // New books require editorial review regardless of their collected labels.
  if (trackNewEntries && isNewBookEntry(knownVariants)) {
    const reviewed = reviewedPeterlangNewcomerBookPaths(variants, {title, knownVariants});
    if (reviewed) return reviewed;
    return [{family: 'Nouveautés', subcategory: 'À classer',
      sourceIds: [...new Set(variants.map(v => v.source_id))], ruleIds: ['new-entry-awaiting-review']}];
  }
  const paths = new Map();
  for (const variant of variants) {
    const categories = variant.metadata.display_categories ?? variant.metadata.filter_categories ?? [];
    const reviewed = reviewedNature.get(variant.source_id);
    const sourcePaths = bookCategoryPaths(categories, {platform: variant.availability.platform}).map(path => {
      if (!reviewed || !path.ruleIds?.includes('nature-source-regrouping')) return path;
      const [family, subcategory, detail] = reviewed;
      return {family, subcategory, ...(detail ? {details: [detail]} : {}), ruleIds: ['nature-source-reviewed']};
    });
    if (categories.some(category => ['Nature et environnement', 'Nature / environnement'].includes(category))
      && categories.some(category => ['Géographie', 'Voyage'].includes(category))) {
      for (let i = sourcePaths.length - 1; i >= 0; i--) {
        if (sourcePaths[i].ruleIds?.includes('nature-source-regrouping')) sourcePaths.splice(i, 1);
      }
    }
    const eni = variant.availability.platform === 'eni';
    const computingPaths = sourcePaths.filter(path => path.family === 'Informatique');
    if (eni && !computingPaths.length) computingPaths.push({family: 'Informatique', subcategory: 'Généralités'});
    const discovery = computingPaths.length ? null : discoverComputingPaths(variant.title ?? title, {
      genericScience: sourcePaths.some(path => path.family === 'Sciences et techniques' && path.subcategory === 'À classer'),
    });
    let editorialPaths = [...sourcePaths.filter(path => !eni && path.family !== 'Informatique'
      && !(discovery?.mainSubject && path.family === 'Sciences et techniques' && ['À classer', 'Technique'].includes(path.subcategory))),
      ...(eni ? eniComputingCategoryPaths(variant.title ?? title, computingPaths)
        : computingPaths.length ? computingCategoryPaths(variant.title ?? title, computingPaths) : discovery?.paths ?? [])];
    if (eni) editorialPaths = editorialPaths.map(path => ({...path,
      ruleIds: [...new Set([...(path.ruleIds ?? []), 'computing-eni-platform'])]}));
    if (editorialPaths.some(path => path.family === 'Sciences et techniques' && path.subcategory === 'À classer')) {
      const transfer = reviewGenericScience(variant.title ?? title);
      if (transfer && transfer.family !== 'Sciences et techniques') {
        editorialPaths = editorialPaths.filter(path => path.family !== 'Sciences et techniques' || path.subcategory !== 'À classer');
        editorialPaths.push(transfer);
      }
    }
    const agriculture = editorialPaths.some(path => path.family === 'Sciences et techniques')
      ? agricultureCategoryPath(variant.title ?? title, {
        publisher: variant.metadata.display_publisher ?? variant.publisher ?? '',
      }) : null;
    if (agriculture) {
      editorialPaths = editorialPaths.filter(path => path.family !== 'Sciences et techniques'
        || !['À classer', 'Technique'].includes(path.subcategory));
      editorialPaths.push(agriculture);
    }
    if (editorialPaths.some(path => path.family === 'Sciences et techniques')) {
      const sciencePaths = scienceCategoryPaths(variant.title ?? title, {
        chemistry: sourcePaths.some(path => path.subcategory === 'Chimie'),
      });
      if (sciencePaths.length) {
        const inheritedRules = editorialPaths.filter(path => path.family === 'Sciences et techniques')
          .flatMap(path => path.ruleIds ?? []);
        editorialPaths = editorialPaths.filter(path => path.family !== 'Sciences et techniques'
          || !['À classer', 'Technique', 'Chimie'].includes(path.subcategory));
        editorialPaths.push(...sciencePaths.map(path => ({...path,
          ruleIds: [...new Set([...inheritedRules, ...(path.ruleIds ?? [])])]})));
      }
    }
    if (editorialPaths.some(path => path.family === 'Sciences et techniques' && path.subcategory === 'À classer')) {
      const residual = residualSciencePaths(variant.title ?? title);
      if (residual.length) {
        editorialPaths = editorialPaths.filter(path => path.family !== 'Sciences et techniques' || path.subcategory !== 'À classer');
        editorialPaths.push(...residual);
      }
    }
    if (editorialPaths.some(path => path.family === 'Sciences et techniques' && path.subcategory === 'À classer')) {
      const review = reviewGenericScience(variant.title ?? title);
      if (review) {
        editorialPaths = editorialPaths.filter(path => path.family !== 'Sciences et techniques' || path.subcategory !== 'À classer');
        editorialPaths.push(review);
      }
    }
    if (editorialPaths.some(path => path.family === 'Santé et médecine')) {
      const inheritedRules = editorialPaths.filter(path => path.family === 'Santé et médecine')
        .flatMap(path => path.ruleIds ?? []);
      editorialPaths = [...editorialPaths.filter(path => path.family !== 'Santé et médecine'),
        ...healthCategoryPaths(variant.title ?? title).map(path => ({...path,
          ruleIds: [...new Set([...inheritedRules, ...path.ruleIds])]}))];
    }
    editorialPaths = reviewEditorialPaths(editorialPaths.map(literaturePath), variant.title ?? title)
      .flatMap(path => path.ruleIds?.some(rule => ['form-source-awaiting-review', 'collection-source-awaiting-review'].includes(rule))
        ? reviewedFormPaths(variant.source_id) ?? [path] : [path]);
    editorialPaths = editorialPaths.flatMap(path => {
      if (path.family !== 'Art / Culture' || path.subcategory !== 'Arts, culture et loisirs') return [path];
      const reviewed = reviewArtsLettersLanguagesPaths([{...path, subcategory: 'À classer'}], variant, title);
      if (reviewed.some(p => p.ruleIds?.includes('arts-letters-languages-reviewed-edition'))) return reviewed;
      return genericArtsPaths(variant.title ?? title, variant.metadata).map(refined => ({...refined,
        ruleIds: [...new Set([...(path.ruleIds ?? []), ...refined.ruleIds])]}));
    });
      editorialPaths = editorialPaths.flatMap(path => reorganizeEditorialPath(path, variant.title ?? title, variant.metadata, variant.source_id));
    editorialPaths = reviewClassicPaths(editorialPaths, variant);
    editorialPaths = refineLiteraturePaths(editorialPaths, variant, title);
    editorialPaths = redistributeBiographyPaths(editorialPaths, variant);
    editorialPaths = refineLiteraryStudies(editorialPaths, variant, title);
    editorialPaths = reviewRenaissanceCollectionPaths(editorialPaths, variant);
    editorialPaths = refineComicPaths(editorialPaths, variant, title);
    editorialPaths = reviewScienceHealthPaths(editorialPaths, variant, title);
    editorialPaths = reviewArtsLettersLanguagesPaths(editorialPaths, variant, title);
    editorialPaths = reviewRemainingPendingPaths(editorialPaths, variant, title);
    editorialPaths = addLiteraryPeriodicalPaths(editorialPaths, variant, title);
    for (const path of editorialPaths) {
      const key = `${path.family}\0${path.subcategory}`;
      if (!paths.has(key)) paths.set(key, {...path, sourceIds: []});
      const sources = paths.get(key).sourceIds;
      if (!sources.includes(variant.source_id)) sources.push(variant.source_id);
      if (path.ruleIds) paths.get(key).ruleIds = [...new Set([...(paths.get(key).ruleIds ?? []), ...path.ruleIds])];
      if (path.details) paths.get(key).details = [...new Set([...(paths.get(key).details ?? []), ...path.details])];
    }
  }
  if (!paths.size) {
    const reviewed = reviewedUnclassifiedMilestonePaths(variants, title);
    if (reviewed) return reviewed;
  }
  if (!paths.size) {
    const reviewed = reviewedUnclassifiedZeroPaths(variants, title);
    if (reviewed) return reviewed;
  }
  if (!paths.size) return [{family: 'Non classés', subcategory: 'À classer',
    sourceIds: [...new Set(variants.map(variant => variant.source_id))], ruleIds: ['editorial-no-source-category']}];
  return [...paths.values()];
}

export function bookCategoryValues(categories, level, family = '') {
  return [...new Set(bookCategoryPaths(categories)
    .filter(path => level === 'family' || !family || path.family === family)
    .map(path => level === 'family' ? path.family : path.subcategory))];
}
