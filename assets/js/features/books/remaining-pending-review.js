import {reviewedRemainingPendingEditions} from './remaining-pending-editions.js?v=2026-10-13-pending1';
import {reviewedNamedPendingEditions} from './named-pending-editions.js?v=2026-10-13-named1';

const fold = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[œŒ]/g, 'oe').replace(/[’‘]/g, "'").toLowerCase();
const editions = new Map(reviewedRemainingPendingEditions.map(row => [row[0], row]));
const namedEditions = new Map(reviewedNamedPendingEditions.map(row => [row[0], row]));

export function reviewRemainingPendingPaths(paths, variant, title = '') {
  const ordinary = reviewEditionPaths(paths, variant, title, editions);
  return reviewEditionPaths(ordinary, variant, title, namedEditions);
}

function reviewEditionPaths(paths, variant, title, decisions) {
  const decision = decisions.get(variant.source_id);
  if (!decision) return paths;
  const [, expectedTitle, publisher, families, replacements, evidence] = decision;
  const actualTitle = variant.title ?? title;
  const evidenceText = evidence.kind === 'description'
    ? variant.metadata.abstract ?? variant.metadata.description ?? '' : actualTitle;
  if (fold(actualTitle) !== fold(expectedTitle)
    || fold(variant.metadata.display_publisher) !== fold(publisher)
    || !fold(evidenceText).includes(fold(evidence.excerpt))) return paths;
  const pending = paths.filter(p => families.includes(p.family)
    && p.subcategory === (decision[6] ?? 'À classer'));
  if (!pending.length) return paths;
  const inherited = pending.flatMap(p => p.ruleIds ?? []);
  return [...paths.filter(p => !pending.includes(p)), ...replacements.map(p => ({...p,
    ...(p.details ? {details: [...p.details]} : {}),
    ruleIds: [...new Set([...inherited, ...(p.ruleIds ?? []), 'remaining-pending-reviewed-edition'])],
  }))];
}
