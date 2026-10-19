import {matchesReviewedEdition} from './cue-review.js';
import {alexanderstreetEditions} from './alexanderstreet-editions-20261019.js';

const decisions = new Map(alexanderstreetEditions.map(d => [d.source_id, d]));
const shape = path => ({family: path.family, subcategory: path.subcategory, details: path.details ?? []});

export function reviewAlexanderstreetPaths(paths, variants) {
  let result = paths;
  for (const variant of variants) {
    const decision = decisions.get(variant.source_id);
    if (!matchesReviewedEdition(variant, decision)) continue;
    const sourcePaths = result.filter(p => p.sourceIds?.includes(variant.source_id));
    if (JSON.stringify(sourcePaths.map(shape)) !== JSON.stringify(decision.from)) continue;
    const retained = result.flatMap(path => {
      if (!path.sourceIds?.includes(variant.source_id)) return [path];
      const sourceIds = path.sourceIds.filter(id => id !== variant.source_id);
      return sourceIds.length ? [{...path, sourceIds}] : [];
    });
    result = [...retained, ...decision.paths.map(path => ({...path,
      sourceIds: [variant.source_id], ruleIds: ['alexanderstreet-reviewed-edition-20261019']}))];
  }
  return result;
}
