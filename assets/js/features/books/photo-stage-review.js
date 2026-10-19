import {matchesReviewedEdition} from './cue-review.js';
import {photoStageEditions} from './photo-stage-editions-20261016.js?v=2026-10-16-photo-stage1';
const decisions = new Map();
for (const d of photoStageEditions) {
  const key = d.source_id + ':' + d.fromBranch;
  decisions.set(key, d);
}
export function reviewPhotoStagePaths(paths, variants) {
  const editions = new Map(variants.map(v => [v.source_id, v]));
  return paths.flatMap(path => {
    if (path.family !== 'Art / Culture' || !['Photographie', 'Spectacle et arts vivants'].includes(path.subcategory)) return [path];
    const approved = (path.sourceIds ?? []).map(id => decisions.get(id + ':' + path.subcategory)).filter(d =>
      d && editions.has(d.source_id) && matchesReviewedEdition(editions.get(d.source_id), d)
      && JSON.stringify([...d.from].sort()) === JSON.stringify([...(path.details ?? [])].sort()));
    if (!approved.length) return [path];
    const moved = new Set(approved.map(d => d.source_id));
    const retained = (path.sourceIds ?? []).filter(id => !moved.has(id));
    const groups = new Map();
    for (const d of approved) {
      if (paths.some(p => p !== path && p.family === d.family && p.subcategory === d.branch && p.details?.includes(d.detail) && p.sourceIds?.includes(d.source_id))) continue;
      const key = JSON.stringify([d.family, d.branch, d.detail]);
      if (!groups.has(key)) groups.set(key, {...path, family:d.family, subcategory:d.branch, details:[d.detail], sourceIds:[],
        ruleIds:[...new Set([...(path.ruleIds ?? []), 'photo-stage-reviewed-edition-20261016'])]});
      groups.get(key).sourceIds.push(d.source_id);
    }
    return [...(retained.length ? [{...path, sourceIds:retained}] : []), ...groups.values()];
  });
}
