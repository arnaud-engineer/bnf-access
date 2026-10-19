import {matchesReviewedEdition} from './cue-review.js';
import {soundEditions} from './sound-editions-20261016.js?v=2026-10-16-sound1';
const decisions = new Map(soundEditions.map(d => [d.source_id, d]));
export function reviewSoundPaths(paths, variants) {
  const editions = new Map(variants.map(v => [v.source_id, v]));
  return paths.flatMap(path => {
    if (path.family !== 'Art / Culture' || path.subcategory !== 'Son et écoute') return [path];
    const approved = (path.sourceIds ?? []).map(id => decisions.get(id)).filter(d => d && editions.has(d.source_id)
      && matchesReviewedEdition(editions.get(d.source_id), d)
      && JSON.stringify([...d.from].sort()) === JSON.stringify([...(path.details ?? [])].sort()));
    if (!approved.length) return [path];
    const moved = new Set(approved.map(d => d.source_id));
    const retained = (path.sourceIds ?? []).filter(id => !moved.has(id));
    return [...(retained.length ? [{...path,sourceIds:retained}] : []), ...approved.filter(d => !paths.some(p =>
      p.family === d.family && p.subcategory === d.branch && (!d.detail || p.details?.includes(d.detail)) && p.sourceIds?.includes(d.source_id)))
      .map(d => ({...path,family:d.family,subcategory:d.branch,details:d.detail?[d.detail]:[],sourceIds:[d.source_id],
        ruleIds:[...new Set([...(path.ruleIds ?? []),'sound-redistributed-edition-20261016'])]}))];
  });
}
