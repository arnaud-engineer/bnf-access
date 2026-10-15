import {reviewedPeterlangNewcomerEditions} from './peterlang-newcomer-editions.js?v=2026-10-13-arrivals1';
import {reviewedPeterlangArrivals20261015} from './peterlang-arrivals-2026-10-15-editions.js?v=2026-10-15-arrivals1';

const editions = new Map([...reviewedPeterlangNewcomerEditions, ...reviewedPeterlangArrivals20261015].map(row => [row.source_id, row]));
const normalize = value => String(value ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();

export function reviewedPeterlangNewcomerEdition(variant, title = '') {
  const decision = editions.get(variant.source_id);
  if (!decision || variant.availability?.platform !== 'peterlang') return null;
  const metadata = variant.metadata ?? {};
  const description = metadata.description || metadata.abstract || '';
  if (normalize(variant.title ?? title) !== normalize(decision.title)
    || normalize(variant.publisher) !== normalize(decision.publisher)
    || JSON.stringify([...(variant.isbns ?? [])].sort()) !== JSON.stringify(decision.isbns)
    // The compact UI omits subtitles; exact digital ISBNs still guard editions.
    || (Object.hasOwn(metadata, 'subtitle') && normalize(metadata.subtitle) !== normalize(decision.subtitle))
    || !description.startsWith(decision.description_excerpt)) return null;
  return decision;
}

// A changed or unreviewed alias keeps the whole new book in the review queue.
// Visible paths always retain only the source IDs of their visible variants.
export function reviewedPeterlangNewcomerBookPaths(variants, {title = '', knownVariants = variants} = {}) {
  if (!knownVariants.length || !knownVariants.every(v => reviewedPeterlangNewcomerEdition(v, title))) return null;
  const paths = new Map();
  for (const variant of variants) {
    const decision = reviewedPeterlangNewcomerEdition(variant, title);
    if (!decision) return null;
    for (const path of decision.paths) {
      const key = `${path.family}\0${path.subcategory}`;
      if (!paths.has(key)) paths.set(key, {...path,
        ...(path.details ? {details: [...path.details]} : {}),
        sourceIds: [], ruleIds: ['peterlang-newcomer-reviewed-edition']});
      const merged = paths.get(key);
      if (!merged.sourceIds.includes(variant.source_id)) merged.sourceIds.push(variant.source_id);
      if (path.details) merged.details = [...new Set([...(merged.details ?? []), ...path.details])];
    }
  }
  return paths.size ? [...paths.values()] : null;
}
