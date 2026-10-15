import {biomaterialsSubject, neuroscienceSubject, environmentalHealthSubject, agingSubject} from './shared-science-health.js?v=2026-10-12-healthscience1';

const rules = [
  ['Médecine clinique', /\b(?:clinical medicine|medecine clinique|medecine generale|general practice|diagnosti\w*|cardio\w*|hypertension|stroke|vasculair\w*|urolog\w*|prostate|kidney|renal|nephrolog\w*|dermatolog\w*|rheumatolog\w*|rhumatolog\w*|cancer\w*|oncolog\w*|carcinolog\w*|neurolog\w*|epilep\w*|pneumolog\w*|asthma|asthme|diabet\w*|endocrin\w*|gastro\w*|digestif\w*|intestin\w*|mici|foie|hepat\w*|ophthalm\w*|ophtalm\w*|otorhino\w*|acouphen\w*|ear, nose|surgery|surgical|chirurg\w*|urgences?|emergency|resuscitation|reanimation|intensive care|anesthes\w*|geriatr\w*|palliative|palliatif\w*|pain medicine|douleur\w*|sleep medicine|medecine du sommeil|sepsis|infectious diseases|maladies infectieuses|hiv|vih|aids|sida)\b/, [
    ['Cardiologie et maladies vasculaires', /\b(?:cardio\w*|hypertension|vasculair\w*|stroke|arterial|venous)\b/],
    ['Neurologie', /\b(?:neurolog\w*|epilep\w*|stroke|sclerose en plaques|parkinson)\b/],
    ['Cancérologie', /\b(?:cancer\w*|oncolog\w*|carcinolog\w*)\b/],
    ['Chirurgie et anesthésie', /\b(?:chirurg\w*|surgery|surgical|anesthes\w*)\b/],
    ['Urgences et réanimation', /\b(?:urgences?|emergency|resuscitation|reanimation|intensive care|sepsis)\b/],
    ['Appareil digestif', /\b(?:gastro\w*|digestif\w*|intestin\w*|mici|foie|hepat\w*)\b/],
    ['Diabète et endocrinologie', /\b(?:diabet\w*|endocrin\w*)\b/],
    ['Urologie et néphrologie', /\b(?:urolog\w*|prostate|kidney|renal|nephrolog\w*)\b/],
    ['Pneumologie', /\b(?:pneumolog\w*|asthma|asthme|respiratory)\b/],
    ['Dermatologie', /\bdermatolog\w*\b/],
    ['Rhumatologie', /\b(?:rhumatolog\w*|rheumatolog\w*|spinal disorders)\b/],
    ['ORL et ophtalmologie', /\b(?:ophthalm\w*|ophtalm\w*|otorhino\w*|acouphen\w*|ear, nose)\b/],
    ['Maladies infectieuses', /\b(?:infectious diseases|maladies infectieuses|hiv|vih|aids|sida|sepsis)\b/],
    ['Gériatrie et soins palliatifs', /\b(?:geriatr\w*|palliative|palliatif\w*)\b/],
  ]],
  ['Santé mentale et psychiatrie', /\b(?:psychiatr\w*|psychopatholog\w*|mental health|sante mentale|mental disorders|troubles mentaux|depression|depressif\w*|anxiety|anxiete|anxieux|addict\w*|drogues|anorexi\w*|boulim\w*|boulime|trouble alimentaire|autis\w*|burn-out|suicid\w*|schizophren\w*|psychanal\w*|psychotherap\w*|psycholog\w*)\b/, [
    ['Psychiatrie et psychopathologie', /\b(?:psychiatr\w*|psychopatholog\w*|schizophren\w*|troubles mentaux)\b/],
    ['Addictions', /\b(?:addict\w*|drogues|dependance|alcoolisme)\b/],
    ['Anxiété et dépression', /\b(?:depression|depressif\w*|anxiety|anxiete|anxieux|burn-out)\b/],
    ['Troubles alimentaires', /\b(?:anorexi\w*|boulim\w*|boulime|trouble alimentaire)\b/],
    ['Autisme', /\bautis\w*\b/],
  ]],
  ['Soins infirmiers et accompagnement', /\b(?:infirmier\w*|nursing|nurse\w*|ifsi|aide-soignant\w*|nursing care|relation d'aide|accompagnement des patients|accompagner une personne malade|alzheimer|dementia|soins aux patients)\b/, [
    ['Soins infirmiers', /\b(?:infirmier\w*|nurs\w*|ifsi|aide-soignant\w*)\b/],
    ['Accompagnement et aidants', /\b(?:relation d'aide|accompagner|aidants?|alzheimer|dementia)\b/],
  ]],
  ['Pharmacie et médicaments', /\b(?:pharmac\w*|medicaments?|drug\w*|pharmaceutical\w*|pharmaceut\w*|therapeutic\w*|phytotherap\w*|toxicolog\w*|posolog\w*|excipient\w*)\b/, [
    ['Pharmacologie et thérapeutique', /\b(?:pharmacolog\w*|therapeutic\w*|medicaments?|drug\w*|posolog\w*)\b/],
    ['Industrie pharmaceutique', /\b(?:pharmaceutical|pharmaceut\w*|drug development|drug design|drug discovery|excipient\w*)\b/],
    ['Toxicologie', /\btoxicolog\w*\b/],
  ]],
  ['Biologie et sciences médicales', /\b(?:biolog\w*|biochim\w*|biochem\w*|immunolog\w*|immunit\w*|anatom\w*|physiolog\w*|geneti\w*|genomi\w*|genetic\w*|genomic\w*|microbiolog\w*|microbial|virolog\w*|vaccin\w*|virus|viruses|adn|dna|acides nucleiques|metaboli\w*|neuroscien\w*|brain|cerveau|cellular|cellulaire|molecular|moleculaire)\b/, [
    ['Anatomie et physiologie', /\b(?:anatom\w*|physiolog\w*|metaboli\w*)\b/],
    ['Biochimie et biologie cellulaire', /\b(?:biochim\w*|biochem\w*|cellular|cellulaire|molecular|moleculaire)\b/],
    ['Génétique et génomique', /\b(?:geneti\w*|genomi\w*|genetic\w*|genomic\w*|dna|adn|acides nucleiques)\b/],
    ['Microbiologie et immunologie', /\b(?:microbiolog\w*|microbial|immunolog\w*|immunit\w*|virolog\w*|vaccin\w*|virus|viruses)\b/],
    ['Neurosciences', /\b(?:neuroscien\w*|brain|cerveau)\b/],
  ]],
  ['Nutrition et alimentation', /\b(?:nutrition\w*|diet\w*|dietet\w*|alimentation|alimentaires?|food and nutrition|regimes|obes\w*)\b/, []],
  ['Pédiatrie et santé de l’enfant', /\b(?:pediatr\w*|paediatr\w*|child health|child development|sante de l'enfant|enfant\w*|enfance|infancy|newborn|neonat\w*|premature|premature\w*|adolescen\w*)\b/, []],
  ['Gynécologie, grossesse et naissance', /\b(?:gynecol\w*|obstetr\w*|grossesse|pregnan\w*|maternity|maternal|midwif\w*|sage-femme\w*|accouchement|childbirth|fertilit\w*|infertilit\w*|procreation|menopaus\w*)\b/, []],
  ['Rééducation et handicap', /\b(?:reeducation|rehabilitation|kinesitherap\w*|physiotherap\w*|ergotherap\w*|occupational therapy|handicap\w*|disabilit\w*|psychomotric\w*|orthophoni\w*)\b/, []],
  ['Santé publique et organisation des soins', /\b(?:public health|sante publique|epidemiolog\w*|prevention|healthcare|health care|health services|systemes? de sante|politique\w* de sante|economie de la sante|action sanitaire|hopital|hospital\w*|bioethi\w*|medical ethics|ethique medicale|genethics|clinical leadership|health management|services sociaux)\b/, [
    ['Santé publique et prévention', /\b(?:public health|sante publique|epidemiolog\w*|prevention)\b/],
    ['Organisation et gestion des soins', /\b(?:healthcare|health care|health services|systemes? de sante|hopital|hospital\w*|clinical leadership|health management)\b/],
    ['Éthique et société', /\b(?:bioethi\w*|medical ethics|ethique medicale|genethics|action sanitaire|services sociaux)\b/],
  ]],
  ['Études et concours de santé', /\b(?:dfgsm\w*|dfgsp\w*|pcem\w*|dcem\w*|paces|pass,? las|pass et las|lmd sante|ecn|edn|grilles enc|annales de medecine|faculte de medecine|teaching in medicine|learning and teaching in medicine|etudes de medecine)\b/, []],
  ['Technologies et recherche médicales', /\b(?:biomedical|biomedicine|biomedecine|health informatics|medical informatics|informatics|imagerie|imaging|radiolog\w*|medical devices|biomedical sensors|biomedical engineering|clinical research|recherche clinique)\b/, [
    ['Imagerie médicale', /\b(?:imagerie|imaging|radiolog\w*)\b/],
    ['Technologies médicales', /\b(?:biomedical|informatics|devices|sensors)\b/],
    ['Recherche clinique', /\b(?:clinical research|recherche clinique)\b/],
  ]],
];

const additionalSubjects = new Map([
  ['Médecine clinique', /\b(?:allerg\w*|arterial|venous|breast diseases|major trauma|multimorbidity|pain|spinal disorders|transfusion|adenocarcin\w*|adenom\w*|parkinson|fibromyalgi\w*|maladie chronique|clinique|physicians?|medecins?|dengue|grippe|antivector\w*|hematolog\w*|haematolog\w*|infectiolog\w*)\b/],
  ['Santé mentale et psychiatrie', /\b(?:tdah|tda\/h|hyperactiv\w*|alcoolisme|alcool|emotional disorders|troubles emotionnels|psychotherapeu\w*)\b/],
  ['Soins infirmiers et accompagnement', /\b(?:aidants?|gerontolog\w*|personnes agees|fin de vie|soignants?|communication dans le soin)\b/],
  ['Biologie et sciences médicales', /\b(?:clinical chemistry|parasitolog\w*|pathobiolog\w*|bacterial|bacteri\w*|neurogen\w*|neurobiolog\w*|neuroanatom\w*|epigenet\w*|gametes|embry\w*|histolog\w*)\b/],
  ['Gynécologie, grossesse et naissance', /\b(?:allait\w*|maternel|infertile|fecondite)\b/],
  ['Technologies et recherche médicales', /\b(?:echograph\w*|tomograph\w*|scanner medical|irm)\b/],
  ['Santé publique et organisation des soins', /\b(?:ethique clinique|medico-social\w*|etablissements de sante|vaccination|pandemi\w*|covid\w*|coronavirus)\b/],
]);
rules.push(['Santé bucco-dentaire', /\b(?:odontolog\w*|dentist\w*|dental|dentaire\w*|dents de lait|stomatolog\w*|orthodont\w*)\b/, []]);
rules.push(['Pratiques complémentaires', /\b(?:hypnos\w*|hypnot\w*|homeopath\w*|acupunct\w*|ayurved\w*|osteopath\w*|relaxation|medecines? complementaires?|medecines? alternatives?)\b/, []]);
rules.push(['Histoire de la santé et de la médecine', /\b(?:histoire (?:de la |des? )?(?:medecine|medecins|soins|sante)|history of (?:medicine|nursing|medical)|ans de medecine)\b/, []]);
rules.push(['Santé environnementale et au travail', environmentalHealthSubject, [
  ['Santé au travail', /\b(?:occupational health|sante au travail|environnement de travail)\b/],
  ['Environnement et expositions', /\b(?:environnement\w*|environmental|exposure)\b/],
]]);
rules.push(['Vieillissement et autonomie', agingSubject, [
  ['Vieillissement et gérontologie', /\b(?:aging|ageing|gerontolog\w*|vieill\w*|elderly|personnes agees)\b/],
  ['Autonomie et accompagnement', /\b(?:autonomie|auxiliaire de vie|personnes vulnerables)\b/],
]]);
const medicalTechnology = rules.find(([label]) => label === 'Technologies et recherche médicales');
medicalTechnology[2].push(['Biomatériaux et médecine régénérative', biomaterialsSubject]);
rules.find(([label]) => label === 'Biologie et sciences médicales')[2]
  .push(['Neurosciences', neuroscienceSubject]);

export function healthCategoryPaths(title) {
  const text = String(title ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[’‘]/g, "'").toLowerCase();
  const primary = text.replace(/^(?:aide[ -]memoire|memento)\s*[-–—:]\s*/, '').split(/\s[-–—:]\s/)[0];
  const veterinary = /\bveterin\w*\b/.test(primary)
    || (/\bveterin\w*\b/.test(text) && !/\b(?:applications?|examples?|exemples?)\b/.test(text))
    || (/\b(?:small animal|laboratory animal|canine|feline|equine|bovine|chiens?|chats?|chevaux)\b/.test(primary)
      && /\b(?:medicine|medecine|surgery|chirurg\w*|anesth\w*|anaesth\w*|analges\w*|diseases?|maladies?|clinical|clinique)\b/.test(primary));
  if (veterinary) return [{family: 'Santé et médecine', subcategory: 'Vétérinaire',
    ruleIds: ['health-veterinary-title']}];
  // Source health scope alone is not evidence for a particular medical specialty.
  const matched = rules.filter(([label, pattern]) => {
    if (label === 'Médecine clinique' && /\bsurgery theory\b/.test(primary)) return false;
    if (label === 'Études et concours de santé' && /\b(?:pass,? las|pass et las|dfgsm\w*|pcem\w*|afgsu)\b/.test(text)) return true;
    return pattern.test(primary) || additionalSubjects.get(label)?.test(primary)
      || (label === 'Technologies et recherche médicales' && biomaterialsSubject.test(primary))
      || (label === 'Biologie et sciences médicales' && neuroscienceSubject.test(primary));
  });
  if (!matched.length) {
    const general = /\b(?:medecine|medicine|sante|health|medical|medicale|soins)\b/.test(primary);
    return [{family: 'Santé et médecine', subcategory: general ? 'Généralités' : 'À classer',
      ruleIds: [general ? 'health-general-title' : 'health-source-unresolved']}];
  }
  return matched.map(([subcategory, , children]) => {
    const details = [...new Set(children.filter(([, pattern]) => pattern.test(primary)).map(([label]) => label))];
    return {family: 'Santé et médecine', subcategory, ruleIds: ['health-title-subject'],
      ...(children.length ? {details: details.length ? details : ['Généralités']} : {})};
  });
}
