const fold = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[’‘]/g, "'").toLowerCase();

// Transfers apply only to the generic source Sciences, not specialized domains.
export function reviewGenericScience(title) {
  const full = fold(title);
  const primary = full.replace(/^(?:aide[ -]memoire|formulaire|memento)\s*[-–—:]\s*/, '').split(/\s[-–—:]\s/)[0];
  const path = (family, subcategory, id, details) => ({family, subcategory,
    ruleIds: [id], ...(details ? {details} : {})});
  if (/\b(?:droit|jurisprudence|juridique\w*|legal|law|reglementation)\b/.test(primary)) {
    return path('Économie / Droit / Gestion', 'Droit', 'science-transfer-law');
  }
  if (/\b(?:finance|financial|credit risk|financing|economics|economie|supply chain|marketing|logistique|comptabilite)\b/.test(primary)) {
    return path('Économie / Droit / Gestion', 'Économie et gestion', 'science-transfer-economy');
  }
  if (/\b(?:autobiograph\w*|biograph\w*|memoires de|memoirs of)\b/.test(primary)) {
    return path('Biographie', 'Biographie', 'science-transfer-biography');
  }
  if (/\b(?:science-fiction|science fiction)\b/.test(primary)) {
    return path('Littérature et études littéraires', 'Fiction', 'science-transfer-fiction', ['Science-fiction']);
  }
  if (/\b(?:libraries|librarians?|librarianship|library|bibliotheques?|bibliothecaires?|documentalistes?)\b/.test(primary)) {
    return path('Médias et communication', 'Bibliothèques et documentation', 'science-transfer-documentation');
  }
  const health = /\b(?:medecine|medical|medicine|clinical|clinique|chirurg\w*|surgical|surgery|cardiolog\w*|oncolog\w*|carcinolog\w*|cancer\w*|neurolog\w*|alzheimer|dementia|pharmacolog\w*|pharmacognos\w*|epidemiolog\w*|nutrition humaine|human nutrition|dfgsm\w*|pcem\w*|dcem\w*|lmd sante|endobiogen\w*|infirmier\w*|epileptic|procreation|appareil circulatoire humain|anatomophysiologie du cerveau|neuroanatomie|sante mentale)\b/;
  if (health.test(primary) && !/\b(?:veterin\w*|animale?|elevage\w*|plantes?|vegetal\w*|agric\w*)\b/.test(primary)) {
    return path('Santé et médecine', 'Santé, sciences de la vie et médecine', 'science-transfer-health');
  }
  if (/\b(?:philosophie des sciences|philosophy of science|epistemolog\w*)\b/.test(primary)) {
    return path('Sciences et techniques', 'Généralités', 'science-general-philosophy', ['Philosophie des sciences']);
  }
  if (/\b(?:psychologie|psychology|psychologiques?|psychological)\b/.test(primary)) {
    return path('Psychologie et développement personnel', 'Psychologie et développement personnel', 'science-transfer-psychology');
  }
  if (/\b(?:darwin|einstein|galilee|newton|poincare|marie curie|pythagore|archimede)\b/.test(primary)) {
    return path('Sciences et techniques', 'Généralités', 'science-general-history', ['Histoire des sciences']);
  }
  if (/\b(?:histoire des sciences|history of science|histoire des techniques|histori\w* scientifiques?)\b/.test(primary)) {
    return path('Sciences et techniques', 'Généralités', 'science-general-history', ['Histoire des sciences']);
  }
  if (/\b(?:sciences?|scientifique\w*|scientists?|scientific|engineering science|experiences? de pensee|prospective technologique)\b/.test(primary)) {
    const method = /\b(?:enseigner|enseignement|teaching|research|recherche|method\w*|experiences?|writing|ecrire|rediger)\b/.test(full);
    return path('Sciences et techniques', 'Généralités', 'science-general-overview',
      [method ? 'Méthodes et enseignement des sciences' : 'Culture scientifique']);
  }
  return null;
}
