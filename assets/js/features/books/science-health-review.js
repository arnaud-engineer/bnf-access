import {reviewedScienceHealthEditions} from './science-health-editions.js?v=2026-10-12-healthscience1';

const fold = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[œŒ]/g, 'oe').replace(/[’‘]/g, "'").toLowerCase();
const editions = new Map(reviewedScienceHealthEditions.map(row => [row[0], row]));

export function reviewScienceHealthPaths(paths, variant, title = '') {
  const decision = editions.get(variant.source_id);
  if (!decision) return paths;
  const [, expectedTitle, publisher, families, replacements, evidence] = decision;
  const actualTitle = variant.title ?? title;
  const evidenceText = evidence.kind === 'description'
    ? variant.metadata.abstract ?? variant.metadata.description ?? '' : actualTitle;
  if (fold(actualTitle) !== fold(expectedTitle)
    || fold(variant.metadata.display_publisher) !== fold(publisher)
    || !fold(evidenceText).includes(fold(evidence.excerpt))) return paths;
  const pending = paths.filter(p => families.includes(p.family) && p.subcategory === 'À classer');
  if (!pending.length) return paths;
  const inherited = pending.flatMap(p => p.ruleIds ?? []);
  return [...paths.filter(p => !pending.includes(p)), ...replacements.map(p => ({...p,
    ...(p.details ? {details: [...p.details]} : {}),
    ruleIds: [...new Set([...inherited, ...(p.ruleIds ?? []), 'science-health-reviewed-edition'])],
  }))];
}
