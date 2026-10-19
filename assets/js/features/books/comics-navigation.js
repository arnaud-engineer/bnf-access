import {comicDetailEditions} from './comics-details-editions-20261016.js?v=2026-10-16-comics7';
import {matchesReviewedEdition} from './cue-review.js';
import {comicStudyEditions} from './comic-studies-editions-20261016.js?v=2026-10-16-comics7';

const detailDecisions = new Map(comicDetailEditions.map(d => [d.source_id, d]));
const studyDecisions = new Map(comicStudyEditions.map(d => [d.source_id, d]));
const detailAliases = new Map([
  ['Documentaire et témoignage', 'Documentaire / Témoignage'],
  ['Humour et satire', 'Humour'],
  ['Biographies', 'Biographie / Récit'],
  ['Autobiographies et récits personnels', 'Biographie / Récit'],
  ['Adaptations littéraires', 'Fiction'], ['Fictions historiques', 'Fiction'],
  ['Fantastique et imaginaire', 'Fiction'], ['Sciences et vulgarisation', 'Vulgarisation'],
]);

export function simplifiedComicDetails(decision) {
  return decision.details.map(detail => detail === 'Récits contemporains'
    ? (decision.source_id === 'pret-bnf:687a6c44e0644d115f57bb40'
      ? 'Documentaire / Témoignage' : 'Fiction')
    : detailAliases.get(detail) ?? detail);
}

export const comicCategoryOrder = [
  'Bande dessinée', 'Comics', 'Manga', 'Manhua / Manhwa',
  'Études sur la BD',
];

// Navigation vocabulary, not an inference of an author's nationality.
export function comicNavigationPaths(paths, variants) {
  const koreanSources = new Set(variants.filter(v =>
    ['scholarvox:88877213', 'scholarvox:88877214', 'scholarvox:88877215'].includes(v.source_id)
    && v.title === `Traité comme une bête V${['scholarvox:88877213', 'scholarvox:88877214', 'scholarvox:88877215'].indexOf(v.source_id) + 1} : Compte rendu des 22 jours de captivité de Kim Keun-Tae`
    && v.authors?.includes('Kun Woong, Park')
    && v.isbns?.includes('9782849533413')
    && v.publisher === 'La Boîte à Bulles').map(v => v.source_id));
  const merged = new Map();
  for (const path of paths) {
    let result = path;
    if (path.family === 'Bande dessinée') {
      const study = ['Études et histoire', 'Livres sur la bande dessinée', 'Études sur la BD'].includes(path.subcategory)
        || path.details?.includes('Études et histoire');
      const subcategory = study ? 'Études sur la BD'
        : ['Documentaire et témoignage', 'BD documentaires et témoignages'].includes(path.subcategory) ? 'Bande dessinée'
        : path.subcategory === 'Bande dessinée européenne' ? 'Bande dessinée'
        : path.subcategory === 'Manhua' ? 'Manhua / Manhwa'
        : path.subcategory === 'Autres traditions'
        ? (path.sourceIds?.length && path.sourceIds.every(id => koreanSources.has(id))
          ? 'Manhua / Manhwa' : 'Bande dessinée') : path.subcategory;
      result = {...path, subcategory};
      if (['Documentaire et témoignage', 'BD documentaires et témoignages'].includes(path.subcategory)) {
        result.details = [...new Set([...(path.details ?? []), 'Documentaire et témoignage'])];
      }
      if (study && path.details) {
        const details = path.details.filter(detail => detail !== 'Études et histoire');
        if (details.length) result.details = details;
        else delete result.details;
      }
      if (study && path.sourceIds?.length) {
        const reviewed = path.sourceIds.map(id => {
          const decision = studyDecisions.get(id);
          return variants.some(v => matchesReviewedEdition(v, decision)) ? decision : null;
        });
        if (reviewed.every(Boolean)) {
          result.details = [...new Set([...(result.details ?? []), ...reviewed.map(d => d.detail)])];
        }
      }
      if (subcategory === 'Bande dessinée' && path.sourceIds?.length) {
        const reviewed = path.sourceIds.map(id => {
          const decision = detailDecisions.get(id);
          return variants.some(v => matchesReviewedEdition(v, decision)) ? decision : null;
        });
        if (reviewed.every(Boolean)) {
          result.details = [...new Set([...(result.details ?? []), ...reviewed.flatMap(simplifiedComicDetails)])];
        }
      }
    }
    if (result.family === 'Bande dessinée' && result.subcategory === 'Bande dessinée' && result.details) {
      result = {...result, details: [...new Set(result.details.map(detail => detailAliases.get(detail) ?? detail))]};
    }
    const key = `${result.family}\0${result.subcategory}`;
    const previous = merged.get(key);
    merged.set(key, previous ? {...previous,
      sourceIds: [...new Set([...(previous.sourceIds ?? []), ...(result.sourceIds ?? [])])],
      ruleIds: [...new Set([...(previous.ruleIds ?? []), ...(result.ruleIds ?? [])])],
      ...((previous.details || result.details) ? {details: [...new Set([
        ...(previous.details ?? []), ...(result.details ?? []),
      ])]} : {}),
    } : result);
  }
  return [...merged.values()];
}
