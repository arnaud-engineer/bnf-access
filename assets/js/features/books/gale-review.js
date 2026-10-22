import {matchesReviewedEdition} from './cue-review.js';
import {galeEditions} from './gale-editions-20261019.js';
import {galeDeepEditions} from './gale-deep-editions-20261022.js';

const decisions = new Map(galeEditions.map(d => [d.source_id, d]));
const deepDecisions = new Map(galeDeepEditions.map(d => [d.source_id, d]));
const shape = p => ({family:p.family, subcategory:p.subcategory, details:p.details ?? []});

function applyDecisions(paths, variants, decisionMap, ruleId) {
  let result = paths;
  for (const variant of variants) {
    const decision = decisionMap.get(variant.source_id);
    if (!decision) continue;
    const matchesCompact = JSON.stringify(variant.metadata) === JSON.stringify(decision.compactMetadata)
      && matchesReviewedEdition(variant, {...decision, subtitle:decision.compactMetadata.subtitle ?? '',
        description:decision.compactMetadata.description || decision.compactMetadata.abstract || ''});
    if (!matchesReviewedEdition(variant, decision) && !matchesCompact) continue;
    const sourcePaths = result.filter(p => p.sourceIds?.includes(variant.source_id));
    if (JSON.stringify(sourcePaths.map(shape)) !== JSON.stringify(decision.from)) continue;
    const retained = result.flatMap(p => {
      if (!p.sourceIds?.includes(variant.source_id)) return [p];
      const sourceIds = p.sourceIds.filter(id => id !== variant.source_id);
      return sourceIds.length ? [{...p, sourceIds}] : [];
    });
    result = [...retained, ...decision.paths.map(p => ({...p,
      sourceIds:[variant.source_id], ruleIds:[ruleId]}))];
  }
  return result;
}

export function reviewGalePaths(paths, variants) {
  const reviewed = applyDecisions(paths, variants, decisions, 'gale-reviewed-edition-20261019');
  return applyDecisions(reviewed, variants, deepDecisions, 'gale-deep-reviewed-edition-20261022');
}
