import {matchesReviewedEdition} from './cue-review.js';
import {aestheticsEditions} from './aesthetics-editions-20261016.js?v=2026-10-16-aesthetics1';
const decisions = new Map(aestheticsEditions.map(d => [d.source_id, d]));
export function reviewAestheticsPaths(paths, variants) {
  const approved = new Map(variants.filter(v => matchesReviewedEdition(v, decisions.get(v.source_id)))
    .map(v => [v.source_id, decisions.get(v.source_id)]));
  if (!approved.size) return paths;
  return paths.flatMap(path => {
    const moved = (path.sourceIds ?? []).filter(id => approved.get(id)?.from.some(from =>
      path.family === from[0] && path.subcategory === from[1]
      && JSON.stringify([...(path.details ?? [])].sort()) === JSON.stringify(from.slice(2).sort())));
    if (!moved.length) return [path];
    const retained = path.sourceIds.filter(id => !moved.includes(id));
    return [...(retained.length ? [{...path, sourceIds: retained}] : []), ...moved.map(id => {
      const destination = approved.get(id).destination;
      const details = destination.subcategory === path.subcategory
        ? [...new Set([...(path.details ?? []).filter(d => d !== 'Esthétique / Théorie'), ...(destination.details ?? [])])]
        : destination.details;
      return {...destination, ...(details?.length ? {details} : {}), sourceIds: [id],
        ruleIds: [...new Set([...(path.ruleIds ?? []), 'aesthetics-reviewed-edition-20261016'])]};
    })];
  });
}
