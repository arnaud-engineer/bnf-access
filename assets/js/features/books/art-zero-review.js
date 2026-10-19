import {reviewArtVisualPaths} from './art-visual-review.js?v=2026-10-16-art-zero1';
import {artZeroEditions} from './art-zero-editions-20261016.js?v=2026-10-16-art-zero1';
const decisions = new Map(artZeroEditions.map(d => [d.source_id, d]));
export function reviewArtZeroPaths(paths, variants) {
  return reviewArtVisualPaths(paths, variants, decisions);
}
