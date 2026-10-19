import {matchesReviewedEdition} from './cue-review.js';
import {prebnfVerificationEditions} from './prebnf-verification-editions-20261018.js?v=2026-10-18-prebnf4';
const decisions = new Map(prebnfVerificationEditions.map(d => [d.source_id, d]));
export function reviewPrebnfVerificationPaths(paths, variants) {
  const decision = variants.map(v => decisions.get(v.source_id)).find(Boolean);
  if (!decision || JSON.stringify(paths) !== JSON.stringify(decision.from)) return paths;
  const expected = decision.reviewedVariants ?? [decision];
  if (variants.length !== expected.length
      || new Set(variants.map(v => v.source_id)).size !== variants.length
      || !expected.every(d => variants.some(v => matchesReviewedEdition(v, d)))) return paths;
  return decision.to.map(path => ({...path, details:[...path.details],
    sourceIds:[...path.sourceIds], ruleIds:[...path.ruleIds]}));
}
