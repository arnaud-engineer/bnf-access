import {sprintEditions} from './openedition-reviewed-editions-20261015.js?v=2026-10-15-oe1';
import {matchesReviewedEdition} from './cue-review.js';

const supplements = new Map(sprintEditions.filter(d => d.descriptionSupplement).map(d => [d.source_id,d]));

// Display-only supplement: the collected description and its provenance remain intact.
export function reviewedOpenEditionDescription(variant) {
  const decision = supplements.get(variant.source_id);
  return matchesReviewedEdition(variant,decision) ? {
    text:decision.descriptionSupplement, url:decision.evidence.url,
    provider:'OpenEdition : résumé éditorial archivé', capturedAt:decision.evidence.capturedAt,
    sha256:decision.evidence.rawSha256,
  } : null;
}
