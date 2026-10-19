import {matchesReviewedEdition} from './cue-review.js';
import {builtDomainEditions} from './built-domains-editions-20261016.js?v=2026-10-16-built-domains1';
const decisions = new Map(builtDomainEditions.map(d => [d.source_id, d]));
const parent = 'Architecture, design et urbanisme';
const direct = new Set(['Architecture', 'Urbanisme']);
export function reviewBuiltDomainPaths(paths, variants) {
  const approved = new Map(variants.filter(v => matchesReviewedEdition(v, decisions.get(v.source_id)))
    .map(v => [v.source_id, decisions.get(v.source_id)]));
  if (!paths.some(p => p.family === 'Art / Culture' && p.subcategory === parent)) return paths;
  return paths.flatMap(path => {
    if (path.family !== 'Art / Culture' || path.subcategory !== parent) return [path];
    const moved = (path.sourceIds ?? []).filter(id => approved.get(id)?.from.some(from =>
      path.family === from[0] && path.subcategory === from[1]
      && JSON.stringify([...(path.details ?? [])].sort()) === JSON.stringify(from.slice(2).sort())));
    const retained = (path.sourceIds ?? []).filter(id => !moved.includes(id));
    const result = moved.flatMap(id => approved.get(id).destinations.map(destination => ({...destination,
      sourceIds: [id], ruleIds: [...new Set([...(path.ruleIds ?? []), 'built-domains-reviewed-edition-20261016'])],
    })));
    if (retained.length) {
      if (path.details?.length && path.details.every(d => direct.has(d))) {
        for (const subcategory of new Set(path.details)) {
          const promoted = {...path, subcategory, sourceIds: retained};
          delete promoted.details;
          result.push(promoted);
        }
      } else result.push({...path, sourceIds: retained});
    }
    return result;
  });
}
