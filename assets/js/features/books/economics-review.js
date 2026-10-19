import {applyEconomicsDecisions} from './economics-decisions.js?v=2026-10-16-economics7';
// Earlier guards see original branch names; rename only after reviewed decisions.
export function reviewEconomicsPaths(paths, variants) {
  paths = applyEconomicsDecisions(paths, variants);
  const renamed = paths.map(path => path.family === 'Économie / Droit / Gestion'
    && path.subcategory === 'Comptabilité et audit'
    ? {...path, subcategory:'Comptabilité'} : path);
  const merged = new Map(), result = [];
  for (const path of renamed) {
    if (!path.ruleIds?.includes('economics-reviewed-edition-20261016')) {
      result.push(path);
      continue;
    }
    const key = JSON.stringify([path.family, path.subcategory, [...(path.sourceIds ?? [])].sort()]);
    const existing = merged.get(key);
    if (existing) {
      existing.ruleIds = [...new Set([...existing.ruleIds, ...path.ruleIds])];
      existing.details = [...new Set([...(existing.details ?? []), ...(path.details ?? [])])];
    }
    else {
      const copy = {...path, ruleIds:[...path.ruleIds]};
      merged.set(key, copy);
      result.push(copy);
    }
  }
  return result;
}
