import {matchesReviewedEdition} from './cue-review.js';
import {leisureEditions} from './leisure-editions-20261016.js?v=2026-10-16-leisure1';

const decisions = new Map(leisureEditions.map(d => [d.source_id, d]));
export function reviewLeisurePaths(paths, variants) {
  const editions = new Map(variants.map(v => [v.source_id, v]));
  return paths.flatMap(original => {
    if (original.family !== 'Art / Culture' || original.subcategory !== 'Loisirs et pratiques') return [original];
    // Rename at the end of the pipeline to preserve older edition/path guards.
    const path = {...original, subcategory: 'Loisirs / Pratiques'};
    const approved = (path.sourceIds ?? []).map(id => decisions.get(id)).filter(d =>
      d && editions.has(d.source_id) && matchesReviewedEdition(editions.get(d.source_id), d)
      && d.from.some(from => JSON.stringify([...from].sort()) === JSON.stringify([...(path.details ?? [])].sort())));
    if (!approved.length) return [path];
    const moved = new Set(approved.map(d => d.source_id));
    const retained = (path.sourceIds ?? []).filter(id => !moved.has(id));
    const groups = new Map();
    for (const d of approved) {
      if (!groups.has(d.detail)) groups.set(d.detail, {...path, details: [d.detail], sourceIds: [],
        ruleIds: [...new Set([...(path.ruleIds ?? []), 'leisure-reviewed-edition-20261016'])]});
      groups.get(d.detail).sourceIds.push(d.source_id);
    }
    return [...(retained.length ? [{...path, sourceIds: retained}] : []), ...groups.values()];
  });
}
