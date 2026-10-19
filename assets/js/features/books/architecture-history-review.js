import {canonicalBookCategoryPaths} from './canonical-categories.js?v=2026-10-16-language-learning1';
import {architectureHistoryDecisions} from './architecture-history-editions-20261016.js?v=2026-10-16-architecture1';

const decisions = new Map(architectureHistoryDecisions.map(d => [d.source_id, d]));
const family = 'Art / Culture';
const subcategory = 'Architecture, design et urbanisme';
export const architectureHistoryDetail = 'Histoire de l’architecture et de l’urbanisme';

function matches(v, d) {
  return d && v.title === d.title && v.publisher === d.publisher
    && v.availability?.platform === d.platform
    && JSON.stringify(v.authors ?? []) === JSON.stringify(d.authors)
    && JSON.stringify([...(v.isbns ?? [])].sort()) === JSON.stringify(d.isbns)
    && JSON.stringify(v.languages ?? []) === JSON.stringify(d.languages)
    && (v.metadata?.eisbn ?? null) === d.eisbn
    && (v.metadata?.description || v.metadata?.abstract || '') === d.description;
}

export function reviewArchitectureHistoryPaths(paths, variants) {
  const approved = new Map(variants.filter(v => matches(v, decisions.get(v.source_id)))
    .map(v => [v.source_id, decisions.get(v.source_id)]));
  if (!approved.size) return paths;
  let changed = false;
  const reviewed = paths.flatMap(path => {
    if (path.family !== family || path.subcategory !== subcategory) return [path];
    const retained = (path.sourceIds ?? []).filter(id => !approved.has(id));
    const moved = (path.sourceIds ?? []).filter(id => approved.has(id));
    if (!moved.length) return [path];
    changed = true;
    return [...(retained.length ? [{...path, sourceIds: retained}] : []), ...moved.flatMap(id => {
      const decision = approved.get(id);
      const provenance = {sourceIds: [id], ruleIds: [...new Set([...(path.ruleIds ?? []), 'architecture-history-reviewed-edition-20261016'])]};
      if (decision.action === 'remove-architecture') return [];
      if (decision.action === 'essay-patrimony') return [
        {...provenance, family, subcategory: 'Patrimoine et musées'},
        {...provenance, family: 'Littérature et études littéraires', subcategory: 'Récits et essais littéraires', details: ['Essais']},
      ];
      return [{...path, ...provenance, details: [...new Set([
        ...(path.details ?? []).filter(d => !['Architecture et urbanisme', 'Urbanisme'].includes(d)), architectureHistoryDetail,
      ])]}];
    })];
  });
  return changed ? canonicalBookCategoryPaths(reviewed) : paths;
}
