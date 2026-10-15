import {unclassifiedZeroEditions} from './unclassified-zero-editions.js?v=2026-10-13-zero1';
const editions = new Map(unclassifiedZeroEditions.map(d => [d.source_id, d]));
const normalize = s => String(s ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();
export function reviewedUnclassifiedZeroPaths(variants, title = '') {
  if (!variants.length) return null;
  const paths = new Map();
  for (const v of variants) {
    const d = editions.get(v.source_id), m = v.metadata ?? {};
    const description = m.description || m.abstract || '';
    const descriptionMatches = d && [d.description_excerpt, ...(d.alternative_description_excerpts ?? [])]
      .some(excerpt => excerpt ? description.startsWith(excerpt) : description === '');
    if (!d || normalize(v.title ?? title) !== normalize(d.title)
      || normalize(v.publisher) !== normalize(d.publisher)
      || v.availability?.platform !== d.platform
      || JSON.stringify([...(v.isbns ?? [])].sort()) !== JSON.stringify(d.isbns)
      || (Object.hasOwn(m, 'subtitle') && normalize(m.subtitle) !== normalize(d.subtitle))
      || !descriptionMatches) return null;
    for (const p of d.paths) {
      const key = `${p.family}\0${p.subcategory}`;
      if (!paths.has(key)) paths.set(key, {...p, ...(p.details ? {details: [...p.details]} : {}),
        sourceIds: [], ruleIds: ['unclassified-zero-reviewed-edition']});
      const value = paths.get(key);
      value.sourceIds.push(v.source_id);
      if (p.details) value.details = [...new Set([...(value.details ?? []), ...p.details])];
    }
  }
  return paths.size ? [...paths.values()] : null;
}
