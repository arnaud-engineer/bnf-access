const agriculture = /\b(?:agric\w*|agronom\w*|agroecolog\w*|agrofore\w*|agroecosystem\w*|agrometeorolog\w*|elevage|elever|apicul\w*|horticul\w*|viticul\w*|aquacul\w*|aquapon\w*|livestock|farming|farmers?|crops?|assolements?|irrigation\w*|irrigations?|fourrager\w*|ruminants?|bovins?|ovins?|caprins?|vigne\w*|sylvicul\w*)\b|\b(?:protection|ravageurs|rendement|rotations?|systemes?) (?:des? |de )cultures?\b/;
const food = /\b(?:agro[ -]?aliment\w*|agri[ -]?food|industries? alimentaires?|produits? laitiers?|technologie du lait|science et technologie du lait|foodborne|food (?:science|chemistry|analysis|safety|quality|processing|production|preservation|packaging|engineering|bioengineering|technology|technologies|traceability|authenticity|industry|industries|additives|fermentation|microbiology)|foods? and beverages?)\b|\b(?:transformation|transformer|conservation|fermentation|analyse|analyses|risques|securite|sanitaire|sanitaires|texture|flaveur|emulsions|additifs|microbiologie|chimie)\b.*\b(?:aliments?|alimentaires?|foods?)\b|\b(?:aliments?|foods?)\b.*\b(?:processing|preservation|packaging|safety|quality|chemistry|fermentation|microbiology|bioengineering|technologies|analysis)\b/;

const additionalAgriculture = /\b(?:paysans?|paysanne\w*|permacultur\w*|pedolog\w*|agropedolog\w*|agraires?|agronumericus|agroeconomicus|moissonneuses?|tracteurs?|cheptels?|vignobles?|vinification|oenolog\w*|enolog\w*|porcin\w*|avicult\w*|poules? pondeuses|vaches? laitieres?|nutrition animale|alimentation (?:des |de la |du )?(?:animaux|chevaux|vaches?|betail)|plantes? cultivees|soybean production|millets?|pesticides?|phytosanitaire\w*)\b/;

export function agricultureCategoryPath(title, {publisher = ''} = {}) {
  const text = String(title ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[’‘]/g, "'").toLowerCase().replace(/œ/g, 'oe');
  const details = [];
  const agriculturalPublisher = /\bfrance agricole\b/i.test(publisher);
  const publisherSoil = agriculturalPublisher && /\b(?:sols?|paysage|jardin|chevaux?)\b/.test(text);
  const observedAgriculture = /\b(?:elevages?|pastora\w*|agropastor\w*|piscicol\w*|peches?|surpeche|halieut\w*|productions? animales?|production du mouton|maraich\w*|vergers?|arboricult\w*|troupeaux|troupeau|fertilis\w*|fertilite|poules? domestiques|nutrition des animaux|nutrition animale|sante animale|agro-veto|agroveto)\b/.test(text);
  const cropOrLivestock = /\b(?:cultures annuelles|cultures (?:legumieres|tropicales|intermediaires)|patur\w*|bovin\w*|ovin\w*|serriste|pastoral\w*|piscicult\w*|jardins? potagers?|fermes?|you can farm|farm management|defense des cultures)\b/.test(text);
  const residualAgriculture = /\b(?:zootechn\w*|rizicult\w*|reboisement|semences?|grande culture|materiel viticole|installations vinicoles|engrais|le mais|maize|cereales?|grain de ble|raisin\w*|vendanges?|prairies|cotonnier|horticole|anatomie de la chevre|soins aux anes|poules et des coqs|mildiou du tournesol)\b/.test(text);
  const residualFood = /\b(?:food grains|food and nutrition|food security|food ingredients|food products|cereal grains|food quality|food fermentation|technologie brassicole|bie\w*logie|zytholog\w*|produire et vendre le cidre|conservation des fruits)\b/.test(text);
  if (agriculture.test(text) || additionalAgriculture.test(text) || observedAgriculture || cropOrLivestock || publisherSoil || residualAgriculture) details.push('Agriculture');
  if (food.test(text) || residualFood) details.push('Agro-alimentaire');
  const primary = text.split(/\s[-–—:]\s/)[0];
  if (/\b(?:horticul\w*|arboricul\w*|vergers?|fruits oublies|fruits tropicaux|palmier-dattier|agrumes?|clementiniers?|cultures perennes tropicales)\b/.test(primary)) {
    if (!details.includes('Agriculture')) details.push('Agriculture');
    details.push('Horticulture et arboriculture');
  }
  if (/\b(?:viticul\w*|vign\w*|oenolog\w*|enolog\w*|vinification|cepages?|vendanges?|travail du vin|couleurs du vin|elaboration des vins|bordeaux et ses vins)\b/.test(primary)) {
    if (!details.includes('Agriculture')) details.push('Agriculture');
    details.push('Viticulture et œnologie');
  }
  if (food.test(primary) || (residualFood && /\b(?:food|aliment\w*)\b/.test(primary))) {
    if (!details.includes('Agro-alimentaire')) details.push('Agro-alimentaire');
    details.push('Sciences des aliments');
  }
  return details.length ? {family: 'Sciences et techniques',
    subcategory: 'Agriculture et agro-alimentaire', details,
    ruleIds: [publisherSoil ? 'science-agriculture-publisher-context' : 'science-agriculture-food-title']} : null;
}
