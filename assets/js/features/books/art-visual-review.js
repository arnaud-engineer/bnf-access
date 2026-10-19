import {matchesReviewedEdition} from './cue-review.js';
import {artVisualEditions} from './art-visual-editions-20261016.js?v=2026-10-16-art-visual1';

const decisions = new Map(artVisualEditions.map(d => [d.source_id, d]));
export function reviewArtVisualPaths(paths, variants, reviewedDecisions = decisions) {
  const editions = new Map(variants.map(v => [v.source_id, v]));
  let changed = false;
  const result = paths.flatMap(path => {
    if (path.family !== 'Art / Culture' || path.subcategory !== 'Art') return [path];
    const approved = (path.sourceIds ?? []).map(id => reviewedDecisions.get(id)).filter(d =>
      d && editions.has(d.source_id) && matchesReviewedEdition(editions.get(d.source_id), d)
      && d.from.some(details => JSON.stringify([...details].sort()) === JSON.stringify([...(path.details ?? [])].sort())));
    if (!approved.length) return [path];
    changed = true;
    const moved = new Set(approved.map(d => d.source_id));
    const retained = (path.sourceIds ?? []).filter(id => !moved.has(id));
    return [...(retained.length ? [{...path, sourceIds: retained}] : []), ...approved.flatMap(d => {
      // An existing specialized route keeps its reviewed details unchanged.
      const family = d.family ?? 'Art / Culture';
      if (paths.some(p => p.family === family && p.subcategory === d.branch && p.sourceIds?.includes(d.source_id))) return [];
      return [{...path, family, subcategory: d.branch, details: d.detail ? [d.detail] : [], sourceIds: [d.source_id],
        ruleIds: [...new Set([...(path.ruleIds ?? []), 'art-visual-reviewed-edition-20261016'])]}];
    })];
  });
  if (!changed) return paths;
  const merged = new Map();
  return result.filter(path => {
    if (!path.ruleIds?.includes('art-visual-reviewed-edition-20261016')) return true;
    const key = JSON.stringify([path.family, path.subcategory, path.details]);
    const prior = merged.get(key);
    if (!prior) {merged.set(key, path); return true;}
    prior.sourceIds = [...new Set([...prior.sourceIds, ...path.sourceIds])];
    prior.ruleIds = [...new Set([...prior.ruleIds, ...path.ruleIds])];
    return false;
  });
}
