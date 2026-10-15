import {cueReviewEditions} from './cue-review-editions.js?v=2026-10-15-cues1';
import {sprintEditions} from './sprint-editions-20261015.js?v=2026-10-15-sprint1';
import {sprintEditions as sprintPass2} from './sprint-editions-20261015-pass2.js?v=2026-10-15-sprint2';
import {sprintEditions as galeResidual} from './gale-residual-editions-20261015.js?v=2026-10-15-gale1';
import {sprintEditions as openedition} from './openedition-reviewed-editions-20261015.js?v=2026-10-15-oe1';
import {pilotEditions} from './prebnf-pilot-editions-20261015.js?v=2026-10-15-pilot1';
import {runEditions} from './prebnf-run-editions-20261015.js?v=2026-10-15-run1';

const decisions = new Map([...cueReviewEditions, ...sprintEditions, ...sprintPass2, ...galeResidual, ...openedition, ...pilotEditions, ...runEditions].map(d => [d.source_id, d]));
export function matchesReviewedEdition(v, d) {
  return Boolean(d) && v.source_id === d.source_id && v.title === d.title && v.publisher === d.publisher
    && v.availability?.platform === d.platform
    && JSON.stringify(v.authors ?? []) === JSON.stringify(d.authors)
    && JSON.stringify([...(v.isbns ?? [])].sort()) === JSON.stringify(d.isbns)
    && (!Object.hasOwn(d, 'subtitle') || (v.metadata?.subtitle ?? '') === d.subtitle)
    && (v.metadata?.description || v.metadata?.abstract || '') === d.description;
}
export function reviewCueBatchPaths(paths, variants) {
  if (!paths.length || paths.some(p => p.family !== 'Non classés')) return paths;
  const reviewed = [];
  for (const v of variants) {
    const d = decisions.get(v.source_id);
    if (!matchesReviewedEdition(v, d)) return paths;
    reviewed.push(d);
  }
  if (!reviewed.length) return paths;
  const merged = new Map();
  for (const d of reviewed) {
    const ruleId = d.ruleId || 'reviewed-cue-edition-2026-10-15';
    for (const destination of [d, ...(d.additionalPaths ?? [])]) {
      const key = JSON.stringify([destination.family, destination.subcategory, destination.details, ruleId]);
      if (!merged.has(key)) merged.set(key, {family: destination.family, subcategory: destination.subcategory,
        details: [...destination.details], sourceIds: [], ruleIds: [ruleId]});
      merged.get(key).sourceIds.push(d.source_id);
    }
  }
  return [...merged.values()];
}
