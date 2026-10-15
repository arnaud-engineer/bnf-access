// Reviewed editions only: names alone are not safe identifiers of a work.
const reviewed = new Map([
  ['pret-bnf:6581907b4c485400011bbcbc', 'Fiction'], // 1984
  ['pret-bnf:631f3a90ee368700016ce314', 'Fiction'], // Aglaé
  ['pret-bnf:631f3abfee368700016cef93', 'Fiction'], // Albert Savarus
  ['pret-bnf:631f3ebdee368700016e0c1a', 'Fiction'], // Amour d'automne; another edition has Fiction.
  ['pret-bnf:631f39deee368700016cb0dd', 'Fiction'], // André, George Sand
  ['pret-bnf:631f3a83ee368700016cdf8d', 'Fiction'], // Atala
  ['pret-bnf:631f3eb3ee368700016e0991', 'Fiction'], // Au hasard de la vie, Kipling; another edition has Jeunesse.
  ['pret-bnf:631f3eb4ee368700016e09bb', 'Fiction'], // Autour du bivouac; another edition has Fiction.
  ['pret-bnf:631f3a8aee368700016ce17e', 'Fiction'], // Bel-Ami
  ['pret-bnf:631f3a85ee368700016cdffd', 'Fiction'], // Boule de suif
  ['pret-bnf:631f3aa5ee368700016ce8a1', 'Fiction'], // Bruges-la-Morte
  ['pret-bnf:631f3aacee368700016cea5a', 'Fiction'], // Béatrix
  ['pret-bnf:631f3adfee368700016cf884', 'Fiction'], // À rebours
  ['pret-bnf:631f3952ee368700016c888a', 'Fiction'], // À vau-l'eau
  ['pret-bnf:631f3adfee368700016cf876', 'Théâtre'], // Andromaque
  ['pret-bnf:631f3adeee368700016cf837', 'Théâtre'], // André del Sarto; another edition has Théâtre.
  ['pret-bnf:631f3a83ee368700016cdfa9', 'Théâtre'], // Bérénice, despite collected Romans / récits.
  ['pret-bnf:631f3984ee368700016c96d9', 'Poésie'], // Chants révolutionnaires: verse excerpt, not painting.
  ['pret-bnf:631f3a8aee368700016ce185', 'Philosophie'], // Zarathoustra; other editions have Philosophie.
  ['pret-bnf:687a6c4ae0644d115f57bd24', 'Musique'], // Charles Gounod: biography and study of his music.
]);

export function reviewClassicPaths(paths, variant) {
  const categories = variant.metadata?.display_categories ?? variant.metadata?.filter_categories ?? [];
  if (!categories.includes('Classiques')) return paths;
  const subject = reviewed.get(variant.source_id);
  if (subject) {
    const family = subject === 'Philosophie' ? 'Sciences humaines et sociales'
      : subject === 'Musique' ? 'Art / Culture' : 'Littérature et études littéraires';
    return [{family, subcategory: subject, ruleIds: ['editorial-classics-edition-reviewed']}];
  }
  const retained = paths.filter(p => p.subcategory !== 'Classiques');
  return (retained.length ? retained : [{family: 'Littérature et études littéraires', subcategory: 'À classer'}])
    .map(p => ({...p, ruleIds: [...new Set([...(p.ruleIds ?? []), 'editorial-classics-source-subject'])]}));
}
