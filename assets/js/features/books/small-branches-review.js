import {matchesReviewedEdition} from './cue-review.js?v=2026-10-15-cues1';
import {canonicalBookCategoryPaths} from './canonical-categories.js?v=2026-10-16-language-learning1';
import {smallBranchEditions} from './small-branches-editions-20261016.js?v=2026-10-16-small1';

// Two subject reassignments checked individually, not general keyword rules.
export function reviewSmallBranchPaths(paths, variants) {
  const approved = smallBranchEditions.filter(d => variants.some(v => matchesReviewedEdition(v, d)));
  if (!approved.length) return paths;
  let result = paths;
  for (const d of approved) {
    result = result.flatMap(path => {
      if (path.family !== d.from[0] || path.subcategory !== d.from[1]
        || !path.details?.includes(d.from[2]) || !path.sourceIds?.includes(d.source_id)) return [path];
      const retainedSources = path.sourceIds.filter(id => id !== d.source_id);
      const retainedDetails = path.details.filter(detail => detail !== d.from[2]);
      return [
        ...(retainedSources.length ? [{...path, sourceIds: retainedSources}] : []),
        ...(retainedDetails.length ? [{...path, sourceIds: [d.source_id], details: retainedDetails}] : []),
        {family: d.to[0], subcategory: d.to[1], ...(d.to[2] ? {details: [d.to[2]]} : {}),
          sourceIds: [d.source_id], ruleIds: [...new Set([...(path.ruleIds ?? []), 'small-branches-reviewed-edition-20261016'])]},
      ];
    });
  }
  return canonicalBookCategoryPaths(result);
}
