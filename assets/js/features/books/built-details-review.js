import {matchesReviewedEdition} from './cue-review.js';
import {builtDetailEditions} from './built-details-editions-20261016.js?v=2026-10-16-built-details1';
const decisions = new Map(builtDetailEditions.map(d => [d.branch + '\0' + d.source_id, d]));
export function reviewBuiltDetailPaths(paths, variants) {
  const editions = new Map(variants.map(v => [v.source_id, v]));
  let changed = false;
  const result = paths.flatMap(path => {
    if (path.family !== 'Art / Culture' || !['Architecture', 'Urbanisme'].includes(path.subcategory)) return [path];
    const approved = (path.sourceIds ?? []).map(id => decisions.get(path.subcategory + '\0' + id))
      .filter(d => d && editions.has(d.source_id) && matchesReviewedEdition(editions.get(d.source_id), d) && d.from.some(from =>
        path.family === from[0] && path.subcategory === from[1]
        && JSON.stringify([...(path.details ?? [])].sort()) === JSON.stringify(from.slice(2).sort())));
    if (!approved.length) return [path];
    changed = true;
    const moved = new Set(approved.map(d => d.source_id));
    const retained = path.sourceIds.filter(id => !moved.has(id));
    return [...(retained.length ? [{...path, sourceIds: retained}] : []), ...approved.map(d => ({...path,
      subcategory: d.destinationBranch, details: [d.detail], sourceIds: [d.source_id],
      ruleIds: [...new Set([...(path.ruleIds ?? []), 'built-details-reviewed-edition-20261016'])],
    }))];
  });
  if (!changed) return paths;
  // Two reviewed routes can meet after correcting an old cross-listing.
  const merged = new Map();
  return result.filter(path => {
    if (!path.ruleIds?.includes('built-details-reviewed-edition-20261016')) return true;
    const key = JSON.stringify([path.family, path.subcategory, path.details]);
    const previous = merged.get(key);
    if (!previous) {merged.set(key, path); return true;}
    previous.sourceIds = [...new Set([...previous.sourceIds, ...path.sourceIds])];
    previous.ruleIds = [...new Set([...previous.ruleIds, ...path.ruleIds])];
    return false;
  });
}
