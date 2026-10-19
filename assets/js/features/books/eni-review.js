import {matchesReviewedEdition} from './cue-review.js';
import {eniEditions} from './eni-editions-20261019.js';

const decisions = new Map(eniEditions.map(d => [d.source_id, d]));
const shape = p => ({family:p.family, subcategory:p.subcategory, details:p.details ?? []});

export function reviewEniPaths(paths, variants) {
  let result = paths;
  for (const variant of variants) {
    const decision = decisions.get(variant.source_id);
    const matchesCompact = decision && JSON.stringify(variant.metadata) === JSON.stringify(decision.compactMetadata)
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
      sourceIds:[variant.source_id], ruleIds:['eni-reviewed-edition-20261019']}))];
  }
  return result;
}
