import {matchesReviewedEdition} from './cue-review.js?v=2026-10-15-cues1';
import {canonicalBookCategoryPaths} from './canonical-categories.js?v=2026-10-16-language-learning1';
import {languageLearningEditions} from './language-learning-editions-20261016.js?v=2026-10-16-language-learning1';

const decisions = new Map(languageLearningEditions.map(d => [d.source_id, d]));

export function reviewLanguageLearningPaths(paths, variants) {
  const approved = new Map(variants.filter(v => matchesReviewedEdition(v, decisions.get(v.source_id)))
    .map(v => [v.source_id, decisions.get(v.source_id)]));
  if (!approved.size) return paths;
  let changed = false;
  const result = paths.flatMap(path => {
    if (path.family !== 'Langues et linguistique' || path.subcategory !== 'Apprentissage des langues') return [path];
    const reviewed = (path.sourceIds ?? []).filter(id => approved.has(id));
    if (!reviewed.length) return [path];
    const retained = path.sourceIds.filter(id => !approved.has(id));
    return [...(retained.length ? [{...path, sourceIds: retained}] : []), ...reviewed.map(id => {
      const d = approved.get(id), [family, subcategory, detail] = d.to;
      const details = detail ? [detail] : [];
      if (path.family === family && path.subcategory === subcategory
        && JSON.stringify(path.details ?? []) === JSON.stringify(details)) return {...path, sourceIds: [id]};
      changed = true;
      return {family, subcategory, ...(detail ? {details} : {}), sourceIds: [id],
        ruleIds: [...new Set([...(path.ruleIds ?? []), 'language-learning-reviewed-edition-20261016'])]};
    })];
  });
  return changed ? canonicalBookCategoryPaths(result) : paths;
}
