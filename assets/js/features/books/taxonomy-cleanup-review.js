import {taxonomyCleanupEditions} from './taxonomy-cleanup-editions.js?v=2026-10-15-cleanup1';

const decisions = new Map(taxonomyCleanupEditions.map(d => [d.source_id, d]));
const normalize = value => String(value ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();

export function reviewTaxonomyCleanupPaths(paths, variants, title = '') {
  const bySource = new Map(variants.map(v => [v.source_id, v]));
  return paths.flatMap(path => {
    if (['Non classés', 'Nouveautés'].includes(path.family) || !path.sourceIds?.length) return [path];
    return path.sourceIds.flatMap(id => {
      const variant = bySource.get(id), decision = decisions.get(id);
      const retained = {...path, sourceIds: [id]};
      if (!variant || !decision || path.family !== decision.from.family
        || path.subcategory !== decision.from.subcategory) return [retained];
      const metadata = variant.metadata ?? {};
      const evidence = decision.evidence.kind === 'description'
        ? metadata.description || metadata.abstract || '' : variant.title ?? title;
      if (normalize(variant.title ?? title) !== normalize(decision.title)
        || normalize(metadata.display_publisher || variant.publisher) !== normalize(decision.publisher)
        || (decision.eisbn && metadata.eisbn !== decision.eisbn)
        || !normalize(evidence).startsWith(normalize(decision.evidence.excerpt))) return [retained];
      return decision.paths.map(destination => ({...destination,
        ...(destination.details ? {details: [...destination.details]} : {}), sourceIds: [id],
        ruleIds: [...new Set([...(path.ruleIds ?? []), 'taxonomy-cleanup-reviewed-edition'])]}));
    });
  });
}
