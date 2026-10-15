// Reviewed source variants, not a blanket inference from the publication's form.
const assignments = [
  ['Littérature et études littéraires', 'Études littéraires', [
    19589, 16470, 19786, 19660, 19634, 157883, 221, 19641, 95917, 19604, 804,
    19639, 19651, 19638, 19616, 3407, 19643, 474, 19630, 17840, 19587,
    11381, 19849, 19632, 19640, 9264, 7233, 109950, 101439, 19867,
    111235, 19853, 101440, 54904, 97219, 19653, 19598, 141938, 3322, 219,
    19664, 19629, 19601, 92647, 105611, 13563, 1006, 19633, 19609, 9371,
    2142, 19603, 19847, 19873, 19810, 19872, 19594, 19622, 19592,
    123215, 19658, 95799, 126660, 19663,
  ]],
  ['Langues et linguistique', 'Linguistique', [97520, 19628, 40796, 575, 98833, 6367, 19830, 3280, 19657, 98875, 19596]],
  ['Sciences humaines et sociales', 'Philosophie', [2260, 19637, 3287, 476, 19631, 80516, 138364, 882, 88804, 7842, 19861, 157274]],
  ['Histoire-Géo', 'Renaissance', [19790, 19751, 92281, 19620, 19834, 19650, 19626, 19649]],
  ['Histoire-Géo', 'Histoire', [9018, 19591]],
  ['Religions et spiritualités', 'Théologie', [3025, 68500, 19605, 19648, 86729, 19852, 92538, 79858]],
  ['Art / Culture', 'Art', [19654, 80957, 19617]],
  ['Art / Culture', 'Cinéma et spectacle', [19607, 19614, 31725]],
  ['Sciences humaines et sociales', 'Culture et société', [80845, 19652, 19646, 3056]],
  ['Éducation et formation', 'Éducation', [19829]],
  ['Économie / Droit / Gestion', 'Droit', [19612]],
  ['Santé et médecine', 'Histoire de la santé et de la médecine', [19745, 149993, 19876]],
];

const reviewed = new Map();
for (const [family, subcategory, ids] of assignments) {
  for (const id of ids) {
    const sourceId = `garnier:${id}`;
    if (reviewed.has(sourceId)) throw new Error(`Duplicate form review: ${sourceId}`);
    reviewed.set(sourceId, [{family, subcategory}]);
  }
}
reviewed.set('garnier:19784', [{family: 'Littérature et études littéraires', subcategory: 'Études littéraires'}]);
reviewed.set('pret-bnf:631f3ae3ee368700016cf989', [{family: 'Histoire-Géo', subcategory: 'Histoire'}]);
reviewed.set('pret-bnf:631f3eb6ee368700016e0a50', [
  {family: 'Art / Culture', subcategory: 'Voyage'}, {family: 'Histoire-Géo', subcategory: 'Géographie'},
]);
reviewed.set('pret-bnf:6425a0fcd10d1e00018cdcdd', [
  {family: 'Politique et relations internationales', subcategory: 'Politique et relations internationales'},
]);

export function reviewedFormPaths(sourceId) {
  return reviewed.get(sourceId)?.map(path => ({...path, ruleIds: ['form-source-reviewed']})) ?? null;
}
