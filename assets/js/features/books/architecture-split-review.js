import {matchesReviewedEdition} from './cue-review.js';
import {architectureSplitEditions} from './architecture-split-editions-20261016.js?v=2026-10-16-architecture-split1';
const decisions = new Map(architectureSplitEditions.map(d => [d.source_id, d]));
export function reviewArchitectureSplitPaths(paths, variants) {
  const approved = new Map(variants.filter(v => matchesReviewedEdition(v, decisions.get(v.source_id)))
    .map(v => [v.source_id, decisions.get(v.source_id)]));
  if (!approved.size) return paths;
  return paths.flatMap(path => {
    const moved = (path.sourceIds ?? []).filter(id => approved.get(id)?.from.some(from =>
      path.family === from[0] && path.subcategory === from[1]
      && JSON.stringify([...(path.details ?? [])].sort()) === JSON.stringify(from.slice(2).sort())));
    if (!moved.length) return [path];
    const retained = path.sourceIds.filter(id => !moved.includes(id));
    return [...(retained.length ? [{...path, sourceIds: retained}] : []), ...moved.map(id => ({...path,
      details: [...new Set([...(path.details ?? []).filter(d => d !== 'Architecture et urbanisme'), ...approved.get(id).details])],
      sourceIds: [id], ruleIds: [...new Set([...(path.ruleIds ?? []), 'architecture-split-reviewed-edition-20261016'])],
    }))];
  });
}
