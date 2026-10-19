import {videogameEditions} from './videogame-editions-20261016.js?v=2026-10-16-games2';
import {matchesReviewedEdition} from './cue-review.js';
import {videogamePass2Editions} from './videogame-editions-20261016-pass2.js?v=2026-10-16-games2';

const decisions = new Map([...videogameEditions, ...videogamePass2Editions].map(d => [d.source_id, d]));

export function addReviewedVideogamePaths(paths, variants) {
  if (paths.some(p => ['Nouveautés', 'Non classés'].includes(p.family))
    || paths.some(p => p.family === 'Art / Culture' && p.subcategory === 'Jeux vidéo')) return paths;
  const sourceIds = variants.filter(v => matchesReviewedEdition(v, decisions.get(v.source_id)))
    .map(v => v.source_id);
  if (!sourceIds.length) return paths;
  return [...paths, {family: 'Art / Culture', subcategory: 'Jeux vidéo',
    sourceIds: [...new Set(sourceIds)], ruleIds: ['videogame-reviewed-edition-20261016']}];
}
