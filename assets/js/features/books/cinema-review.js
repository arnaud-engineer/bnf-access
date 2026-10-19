import {matchesReviewedEdition} from './cue-review.js';
import {reviewAestheticsPaths} from './aesthetics-review.js?v=2026-10-16-aesthetics1';
import {cinemaEditions} from './cinema-editions-20261016.js?v=2026-10-16-cinema1';

const decisions = new Map(cinemaEditions.map(d => [d.source_id, d]));
const detailLabels = new Map([
  ['Archives et patrimoine', 'Patrimoine'], ['Doublage et voix off', 'Jeu d’acteur'],
  ['Image, montage et effets visuels', 'Image / Technique'],
  ['Techniques audiovisuelles', 'Image / Technique'],
  ['Acteurs et personnalités', 'Acteurs'], ['Adaptations et littérature', 'Adaptation'],
  ['Cinéastes et réalisateurs', 'Cinéastes'], ['Économie du cinéma', 'Économie'],
  ['Films : analyses et critiques', 'Analyses de films'], ['Genres cinématographiques', 'Genres'],
  ['Histoire et cinématographies', 'Cinématographie'], ['Esthétique et théorie', 'Esthétique / Théorie'],
  ['Mise en scène et réalisation', 'Réalisation'], ['Musique et son', 'Musique / Son'],
  ['Séries et télévision', 'Série / TV'],
]);
const matchesPath = (p, from) => p.family === from[0] && p.subcategory === from[1]
  && JSON.stringify([...(p.details ?? [])].sort()) === JSON.stringify(from.slice(2).sort());

export function reviewCinemaPaths(paths, variants) {
  const result = refineCinemaPaths(paths, variants).map(path => {
    if (path.family !== 'Art / Culture'
      || !['Cinéma et audiovisuel', 'Cinéma / Audiovisuel'].includes(path.subcategory)) return path;
    return {...path, subcategory: 'Cinéma / Audiovisuel', ...(path.details ? {
      details: [...new Set(path.details.map(detail => detailLabels.get(detail) ?? detail))],
    } : {})};
  });
  const translationSources = variants.filter(v => {
    const decision = decisions.get(v.source_id);
    return decision?.index === 831 && matchesReviewedEdition(v, decision)
      && result.some(p => p.subcategory === 'Cinéma / Audiovisuel'
        && p.details?.includes('Traduction audiovisuelle') && p.sourceIds?.includes(v.source_id));
  }).map(v => v.source_id);
  if (translationSources.length && !result.some(p => p.family === 'Langues et linguistique'
    && p.subcategory === 'Traduction et interprétation')) {
    result.push({family: 'Langues et linguistique', subcategory: 'Traduction et interprétation',
      details: ['Traduction'], sourceIds: translationSources,
      ruleIds: ['cinema-translation-cross-access-20261016']});
  }
  return reviewAestheticsPaths(result.flatMap(path => {
    if (path.subcategory !== 'Cinéma / Audiovisuel'
      || !path.details?.includes('Traduction audiovisuelle')) return [path];
    const moved = (path.sourceIds ?? []).filter(id => translationSources.includes(id));
    if (!moved.length) return [path];
    const retained = path.sourceIds.filter(id => !moved.includes(id));
    const details = path.details.filter(d => d !== 'Traduction audiovisuelle');
    return [...(retained.length ? [{...path, sourceIds: retained}] : []),
      ...(details.length ? [{...path, details, sourceIds: moved}] : [])];
  }), variants);
}

function refineCinemaPaths(paths, variants) {
  const approved = new Map(variants.filter(v => matchesReviewedEdition(v, decisions.get(v.source_id)))
    .map(v => [v.source_id, decisions.get(v.source_id)]));
  if (!approved.size) return paths;
  return paths.flatMap(path => {
    const moved = (path.sourceIds ?? []).filter(id => approved.get(id)?.from.some(from => matchesPath(path, from)));
    if (!moved.length) return [path];
    const retained = path.sourceIds.filter(id => !moved.includes(id));
    return [
      ...(retained.length ? [{...path, sourceIds: retained}] : []),
      ...moved.map(id => {
        const destination = approved.get(id).destination;
        // Preserve specialized details when replacing a mixed generic path.
        const details = destination.subcategory === path.subcategory
          ? [...new Set([...(path.details ?? []).filter(d => d !== 'Cinéma'), ...(destination.details ?? [])])]
          : destination.details;
        return {...destination, ...(details?.length ? {details} : {}), sourceIds: [id],
          ruleIds: [...new Set([...(path.ruleIds ?? []), 'cinema-reviewed-edition-20261016'])]};
      }),
    ];
  });
}
