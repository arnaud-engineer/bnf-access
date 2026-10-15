import {reviewedComicEditions} from './comics-editions.js?v=2026-10-12-healthscience1';

const fold = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[œŒ]/g, 'oe').replace(/[’‘]/g, "'").toLowerCase();
const editions = new Map(reviewedComicEditions.map(([id, title, publisher, category]) =>
  [id, {title: fold(title), publisher: fold(publisher), category}]));

export function refineComicPaths(paths, variant, title = '') {
  const metadata = variant.metadata ?? {};
  const reviewed = editions.get(variant.source_id);
  const text = fold(variant.title ?? title);
  if (reviewed && text === reviewed.title && fold(metadata.display_publisher ?? variant.publisher) === reviewed.publisher) {
    return [{family: 'Bande dessinée', subcategory: reviewed.category,
      ruleIds: ['comics-reviewed-edition-title-publisher']}];
  }
  return paths.map(path => {
    if (path.family !== 'Art / Culture' || path.subcategory !== 'Bande dessinée') return path;
    const manga = path.details?.includes('Manga');
    return {...path, family: 'Bande dessinée', subcategory: manga ? 'Manga' : 'Études et histoire',
      details: manga ? ['Études et histoire'] : undefined,
      ruleIds: [...new Set([...(path.ruleIds ?? []), 'comics-study-family-migration'])]};
  });
}
