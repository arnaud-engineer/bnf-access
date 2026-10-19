import {matchesReviewedEdition} from './cue-review.js';
import {economicsEditions} from './economics-editions-20261016.js?v=2026-10-16-economics7';
const decisions = new Map();
for (const d of economicsEditions) {
  const key = d.source_id + ':' + d.fromBranch;
  decisions.set(key, d);
}
export function applyEconomicsDecisions(paths, variants) {
  const editions = new Map(variants.map(v => [v.source_id, v]));
  return paths.flatMap(path => {
    if (path.family !== 'Économie / Droit / Gestion' || !['Comptabilité et audit', 'Économie'].includes(path.subcategory)) return [path];
    const approved = (path.sourceIds ?? []).map(id => decisions.get(id + ':' + path.subcategory)).filter(d =>
      d && editions.has(d.source_id) && matchesReviewedEdition(editions.get(d.source_id), d)
      && JSON.stringify([...d.from].sort()) === JSON.stringify([...(path.details ?? [])].sort()));
    if (!approved.length) return [path];
    const moved = new Set(approved.map(d => d.source_id));
    const retained = (path.sourceIds ?? []).filter(id => !moved.has(id));
    const groups = new Map();
    for (const d of approved) {
      if (paths.some(p => p !== path && p.family === d.family && p.subcategory === d.branch && (!d.detail || p.details?.includes(d.detail)) && p.sourceIds?.includes(d.source_id))) continue;
      const key = JSON.stringify([d.family, d.branch, d.detail]);
      if (!groups.has(key)) groups.set(key, {...path, family:d.family, subcategory:d.branch, details:d.detail?[d.detail]:[], sourceIds:[],
        ruleIds:[...new Set([...(path.ruleIds ?? []), 'economics-reviewed-edition-20261016'])]});
      groups.get(key).sourceIds.push(d.source_id);
    }
    return [...(retained.length ? [{...path, sourceIds:retained}] : []), ...groups.values()];
  });
}
