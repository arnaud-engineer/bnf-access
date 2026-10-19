import {matchesReviewedEdition} from './cue-review.js';
import {heritageEditions} from './heritage-editions-20261016.js?v=2026-10-16-heritage1';

const decisions = new Map(heritageEditions.map(d => [d.source_id, d]));
export function reviewHeritagePaths(paths, variants) {
  const editions = new Map(variants.map(v => [v.source_id, v]));
  return paths.flatMap(path => {
    if (path.family !== 'Art / Culture' || !['Patrimoine et musées', 'Son et écoute'].includes(path.subcategory)) return [path];
    const approved = (path.sourceIds ?? []).map(id => decisions.get(id)).filter(d =>
      d && d.fromBranch === path.subcategory && editions.has(d.source_id)
      && matchesReviewedEdition(editions.get(d.source_id), d)
      && JSON.stringify([...d.from].sort()) === JSON.stringify([...(path.details ?? [])].sort()));
    if (!approved.length) return [path];
    const moved = new Set(approved.filter(d => d.action !== 'add').map(d => d.source_id));
    const retained = (path.sourceIds ?? []).filter(id => !moved.has(id));
    const groups = new Map();
    for (const d of approved) {
      if (paths.some(p => p.family === 'Art / Culture' && p.subcategory === d.branch && p.details?.includes(d.detail) && p.sourceIds?.includes(d.source_id))) continue;
      const key = JSON.stringify([d.branch, d.detail]);
      if (!groups.has(key)) groups.set(key, {...path, subcategory:d.branch, details:[d.detail], sourceIds:[],
        ruleIds:[...new Set([...(path.ruleIds ?? []), 'heritage-reviewed-edition-20261016'])]});
      groups.get(key).sourceIds.push(d.source_id);
    }
    return [...(retained.length ? [{...path, sourceIds:retained}] : []), ...groups.values()];
  });
}
