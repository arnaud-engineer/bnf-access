import {programmingLanguages} from './programming-languages.js?v=2026-10-12-healthscience1';

const rules = [
  {id: 'computing-programming', label: 'Programmation',
    primary: /\b(?:algorithmique|programmation|programmer|developpement informatique|architecture logicielle|design patterns|software craftsmanship|expressions regulieres|python|java|javascript|typescript|kotlin|swift|rust|scala|golang|cobol|delphi|matlab|vba|wpf|windev|flutter|pyqt|qt|selenium|robot framework|unity(?:3d)?|pygame|uml|git|assembleur|jetpack compose|google apps script|power apps|robotic process automation)\b|\bc(?:#|\+\+)|\.net\b/,
    topic: /\b(?:programmation|programmer|langage vba|macros|tests (?:fonctionnels|logiciels)|conception de logiciels)\b/},
  {id: 'computing-web', label: 'Web',
    primary: /\b(?:javascript|typescript|google apps script|wordpress|woocommerce|prestashop|shopify|joomla|drupal|django|symfony|laravel|cakephp|php|angular|react|vue\.js|node\.js|asp\.net|blazor|bootstrap|html5?|css3?|flexbox|dreamweaver|foundation|webmarketing|referencement|seo|ui[ -]?ux|web)\b/,
    topic: /\b(?:sites? (?:web|e-commerce)|applications? web|boutique en ligne|developpement web|services rest|webdesign|design web)\b/},
  {id: 'computing-databases', label: 'Bases de données',
    primary: /\b(?:sql|mysql|postgresql|mariadb|mongodb|oracle|nosql|sqlite|entity framework|merise)\b/,
    topic: /\b(?:bases? de donnees|serveur de base de donnees)\b/},
  {id: 'computing-systems', label: 'Système',
    primary: /\b(?:linux|unix|debian|ubuntu|powershell|shell|aws|azure|docker|kubernetes|ansible|vmware|vsphere|proxmox|citrix|exchange server|windows server|cloud|centreon|prometheus|grafana|devops|devsecops|veeam|apache|nginx|lamp|ldap|openldap|gpo|intune|terraform|infrastructure as code|sharepoint (?:online|server)|administrer microsoft 365|serveur internet)\b/,
    topic: /\b(?:administration (?:du |d.un |de |des )?systeme|infrastructures? cloud|architectures? cloud|scripts? shell|virtualisation)\b/},
  {id: 'computing-networks', label: 'Réseaux',
    primary: /\b(?:cisco|ccna|ccnp|routage|routeurs?|commutateurs?|tcp\/ip|ipv[46]|wi-fi|wifi)\b|^tp sur les reseaux\b/,
    topic: /\b(?:reseaux? (?:informatiques?|sans[ -]fil|d.entreprise|5g|en fibres optiques)|services reseau|administrez un reseau|administration (?:d.un |du )reseau)\b/},
  {id: 'computing-security', label: 'Cybersécurité',
    primary: /\b(?:cybersecurite|cyberdefense|cyber-resilience|ethical hack(?:er|ing)|hacking|malwares?|forensique|forensic|rgpd|protection des donnees|menace cyber|cryptographie|metasploit)\b/,
    topic: /\b(?:securite (?:informatique|des applications|des infrastructures|du systeme|des architectures|de l'information|sous windows)|securisez|donnees personnelles|zero trust|failles de securite)\b/},
  {id: 'computing-data-ai', label: 'Données et intelligence artificielle',
    primary: /\b(?:business intelligence|big data|data (?:science|scientist|visualisation|marketing)|la data|power bi|powerpivot|chatgpt|copilot|intelligence artificielle|ia|machine learning|deep learning|talend|hadoop|spark|tableau desktop|nlp|microsoft fabric|bi et olap)\b/,
    topic: /\b(?:analyse de donnees|analyse d.images|intelligence artificielle|machine learning|traitement automatique du langage naturel)\b/},
  {id: 'computing-graphics', label: 'Graphisme et conception',
    primary: /\b(?:autocad|archicad|revit|sketchup|solidworks|catia|fusion 360|3d builder|blender|photoshop|illustrator|indesign|affinity|gimp|after effects|premiere|camtasia|flash professional)\b/,
    topic: /\b(?:modelisation 3d|retouche (?:photo|et le montage photo)|conception de batiment)\b/},
  {id: 'computing-management', label: 'Gestion de projets et informatique d’entreprise',
    primary: /\b(?:scrum|safe|less|pmbok|prince2|product owner|kanban|itil|gouvernance|strategie informatique|crm|erp|sap|sage|ciel compta|dynamics 365|gestion de projets?|conduite de projets?|gestion de portefeuille de projets|glpi|pilotage d'un systeme d'information|transformation digitale)\b/,
    topic: /\b(?:projets? (?:informatiques?|agiles?)|gouvernance informatique|departement informatique|gestion de services|test en mode agile|continuite d'activite)\b/},
  {id: 'computing-embedded', label: 'Matériel et systèmes embarqués',
    primary: /\b(?:arduino|raspberry pi|microcontroleur|micropython|micro:bit|makeblock|esp8266|esp32|systemes? embarques?|electronique|domotique|maintenance et depannage d'un pc)\b/},
];

const fold = value => String(value ?? '').normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[’‘]/g, "'").toLowerCase();

const discovery = [
  ['Programmation', /\b(?:algorithmes?|algorithm\w*|programmer|programmation|java|ocaml|lua|erlang|opengl|cordov\w*|phonegap)\b/, true],
  ['Bureautique', /\baccess\s+20\d\d\b|\b(?:freemind|freeplane|xmind)\b/, true],
  ['Réseaux', /\b(?:reseaux fixes|reseaux et telecoms|architecture des reseaux|reseau de pc|adsl)\b/, true],
  ['Graphisme et conception', /\b(?:illustrator|affinity publisher|capture nx2|cao)\b/, true],
  ['Gestion de projets et informatique d’entreprise', /\b(?:pilotage du si|architecture d'entreprise|sourcing it|information systems|information technology|ingenierie des exigences)\b/, true],
  ['Bureautique', /\b(?:microsoft office|google slides|google docs|google sheets|thunderbird|ipad|iphone)\b/],
  ['Système', /\b(?:devops|devsecops|ldap|openldap|oracle|mac|it gouvernance)\b/, true],
  ['Cybersécurité', /\b(?:firewall|vpn|it security|securite pour internet|securite informatique)\b/],
  ['Programmation', /\b(?:java\/jee|fortran|silverlight|visual basic|c sharp)\b/],
  ['Réseaux', /\b(?:systemes informatiques|ordinateurs et des reseaux|reseaux et transmissions|network management)\b/],
  ['Graphisme et conception', /\b(?:photoshop|indesign|autocad|archicad|revit|sketchup|solidworks|3ds max|3dvia studio|blender|gimp|dreamweaver)\b|\b(?:scripts? pour flash|flash cs\d)\b/],
  ['Données et intelligence artificielle', /\b(?:intelligence artificielle|machine learning|deep learning|data science|big data|bioinformatique)\b/],
  ['Programmation', /\b(?:developpement logiciel|software development|computer science|genie logiciel)\b/],
  ['Web', /\b(?:accessibilite web|ergonomie web)\b/],
  ['Système', /\b(?:cloud computing|mac os|windows (?:7|8(?:\.1)?|10|11)|administrer microsoft 365)\b/],
  ['Matériel et systèmes embarqués', /\b(?:raspberry pi|arduino|microcontrollers?|microcontroleurs?)\b/],
  ['Programmation', /\b(?:python|micropython|javascript|typescript|vba|kotlin|cobol|pyqt|algorithmique|matlab|actionscript|java ee|android)\b|\bc(?:#|\+\+)|(?:^|[\s(])\.net\b|\basp\.net\b|\b(?:langage c|programmer en c)\b|\bprogrammation (?:sequentielle|orientee|informatique|graphique)\b|\b(?:programmer|programmez|programmation|langage|apprendre|apprenez|coding|programming|developpez|developper|memoire|debuter)\b.*\b(?:java|rust|scala|pascal|delphi|go)\b/],
  ['Web', /\b(?:html5?|xhtml|css3?|php|wordpress|drupal|joomla|symfony|laravel|node\.js)\b|\b(?:framework|developper|apprendre|apprenez)\b.*\b(?:django|react|angular)\b/],
  ['Bases de données', /\b(?:sql|mysql|postgresql|mongodb|nosql|sqlite)\b/],
  ['Système', /\b(?:linux|unix|debian|ubuntu|powershell|docker|kubernetes|ansible|vmware|windows server|aws|azure)\b/],
  ['Réseaux', /\b(?:ccna|ccnp|tcp\/ip|ipv4|ipv6)\b|\bcisco\b.*\b(?:network|networking|router|switch|security|reseau|certified)\b/],
  ['Cybersécurité', /\b(?:cybersecurite|cyberdefense|hacking|metasploit)\b/],
  ['Bureautique', /\b(?:excel|powerpoint|libreoffice|openoffice|linkedin|outlook|onenote)\b/],
  ['Programmation', /\b(?:informatique|programming|computer algorithms|software|refactoring|java\/j2ee|java j2ee|scilab)\b/],
  ['Système', /\b(?:cloud|embedded systems|computer architecture|server architectures|computers)\b/],
  ['Réseaux', /\b(?:computer networks|ethernet|network administration|wireless sensor networks|comptia network|wi-fi|wifi)\b/],
  ['Web', /\b(?:web|internet)\b/],
  ['Bases de données', /\b(?:databases?|bases? de donnees)\b/],
  ['Cybersécurité', /\b(?:digital forensics|data breach|network attacks|embedded systems security)\b/],
  ['Données et intelligence artificielle', /\b(?:artificial intelligence|neural networks|data mining|data analytics|data visuali[sz]ation|datavisualisation|pattern recognition)\b/],
  ['Graphisme et conception', /\b(?:inkscape|camera raw|dxo|lightroom)\b/],
];

export function discoverComputingPaths(title, {genericScience = false} = {}) {
  const full = fold(title);
  if (/\b(?:internet of things|internet of everything|internet des objets)\b/.test(full)) {
    return {mainSubject: !/\b(?:biomedical|medical|medicine)\b/.test(full), paths: [{family: 'Informatique',
      subcategory: 'Matériel et systèmes embarqués', ruleIds: ['computing-title-discovery']}]};
  }
  if (/\b(?:monty python|django reinhardt|excel at|summary|fiche de lecture)\b/.test(full)) return null;
  const primary = full.replace(/^(?:aide[ -]memoire|memento)\s*[-–—:]\s*/, '').split(/\s[-–—]\s/)[0];
  const found = discovery.filter(([, pattern, scienceOnly]) => (!scienceOnly || genericScience) && pattern.test(full));
  if (!found.length) return null;
  const mainSubject = found.some(([, pattern]) => pattern.test(primary))
    && !/\b(?:mathemati\w*|mathemat\w*|numerical|numerique|statisti\w*|finance|financial|econom\w*|biology|biologie|biomedical|oceanograph\w*|physics|physique|chemistry|chimie|mecanique|radar|astronomy|astronomie|business plan|geophysical|structural|nuclear|marketing|gestion|relation client|management|modeling|modelling|modelisation)\b/.test(primary);
  const existing = computingCategoryPaths(title, []).filter(path => path.subcategory !== 'Généralités');
  const paths = existing.length ? existing : found.map(([label]) => ({family: 'Informatique', subcategory: label,
    ...categoryDetails(label, title, full)}));
  return {mainSubject, paths: paths.map(path => ({...path,
    ruleIds: [...(path.ruleIds ?? []), 'computing-title-discovery']}))};
}

export function computingCategoryPaths(title, sourcePaths) {
  const full = fold(title);
  // Technologies in a subtitle can be examples, not the subject of the book.
  const primary = full.split(/\s[-–—]\s/)[0];
  let matches = /^(?:vade-mecum|panorama|generalites)\b/.test(primary) ? []
    : rules.filter(rule => rule.primary.test(primary) || rule.topic?.test(full));
  const languages = programmingLanguages(title);
  const webLanguages = languages.filter(language => ['JavaScript', 'PHP'].includes(language));
  if (webLanguages.length && !/^(?:vade-mecum|panorama|generalites)\b/.test(primary)) {
    if (!matches.some(rule => rule.label === 'Web')) matches.push({id: 'computing-web-language', label: 'Web'});
    if (!languages.some(language => !['JavaScript', 'PHP', 'Généralités'].includes(language))) {
      matches = matches.filter(rule => rule.label !== 'Programmation');
    }
  }
  if (/^windows (?:10|11)\b/.test(primary) && /\b(?:installation|configuration)\b/.test(full)) {
    matches.push({id: 'computing-windows-administration', label: 'Système'});
  }
  if (/\b(?:excel|word|powerpoint|outlook|onenote|libreoffice|openoffice|teams|access|project|latex|linkedin)\b/.test(primary)
      && !matches.length) matches.push({id: 'computing-office', label: 'Bureautique'});
  if (!matches.length) {
    const subcategories = new Set(sourcePaths.map(path => path.subcategory));
    const label = subcategories.has('Graphisme, CAO et DAO') ? 'Graphisme et conception'
      : subcategories.has('Bureautique') ? 'Bureautique'
      : subcategories.has('Informatique d’entreprise et comptabilité')
        ? 'Gestion de projets et informatique d’entreprise' : 'Généralités';
    matches.push({id: 'computing-source-fallback', label});
  }
  return matches.map(rule => ({family: 'Informatique', subcategory: rule.label, ruleIds: [rule.id],
    ...categoryDetails(rule.label, title, full)}));
}

export function eniComputingCategoryPaths(title, sourcePaths) {
  let paths = computingCategoryPaths(title, sourcePaths);
  if (!paths.every(path => path.subcategory === 'Généralités')) return paths;
  const full = fold(title);
  if (/^(?:vade-mecum|panorama|generalites)\b/.test(full)) return paths;
  // ENI is a reviewed computing platform; a descriptive subtitle can resolve an opaque tool name.
  paths = computingCategoryPaths(title.replace(/\s[-–—]\s/g, ' : '), sourcePaths);
  if (!paths.every(path => path.subcategory === 'Généralités')) return paths;
  const subjects = [
    ['Programmation', /\b(?:android|ios|objective-c|visual studio|architecture hexagonale|mvvm|alm quality center|api openai|dialogflow|developpement d'applications|besoin aux exigences|xml|perl|logiciels embarques)\b/],
    ['Système', /\b(?:windows|hyper-v|iis|openstack|nagios|shinken|scom|sccm|system center|ocs inventory|packer|byod|gestion de contenu d'entreprise|alfresco|office 365.*administration|platform engineering|site reliability engineering|saas|lync server|centres de donnees)\b/],
    ['Graphisme et conception', /\b(?:3ds max|adobe muse|animate|google photos|snapseed|publisher 20\d\d|image numerique|impression 3d|maya 20\d\d|bim)\b/],
    ['Données et intelligence artificielle', /\b(?:open data|power query|cognos|intelligences artificielles|deep research|notebooklm|google genie|openai|chatbots?|blockchain\w*|metaverse|nft|rag|amazon bedrock)\b/],
    ['Cybersécurité', /\b(?:stormshield|pare-feu|fail2ban|sshd|mots de passe|laps|informatique et libertes|vpn|gmsa|risques cyber|protection de la vie privee|protection des personnes physiques)\b/],
    ['Réseaux', /\b(?:telephonie sur ip|toip|reseaux industriels)\b/],
    ['Web', /\b(?:ajax|jamstack|nextjs|piwik|google ads|google analytics|emailing|e-mailing|e-marketing|e-commerce|e-reputation|community|social media|reseaux sociaux|facebook|instagram|web3|cookies tiers|strategie de contenu|ux mobile|conception d'interfaces|marketing mobile)\b/],
    ['Bureautique', /\b(?:office|sharepoint|visio|prezi|mind mapping|yammer|mails|planning|echeanciers|tableaux croises dynamiques|tableaux de bord|lotus notes|lync 2013)\b/],
    ['Matériel et systèmes embarqués', /\bobjets connectes\b/],
    ['Gestion de projets et informatique d’entreprise', /\b(?:gestion des licences|contrats en informatique|gestion du systeme d'information|bureau des programmes|management|manager|leadership|innovation agile|motivation des equipes)\b/],
  ];
  const labels = subjects.filter(([, pattern]) => pattern.test(full)).map(([label]) => label);
  return labels.length ? labels.map(label => ({family: 'Informatique', subcategory: label,
    ruleIds: ['computing-eni-subject'], ...categoryDetails(label, title, full)})) : paths;
}

function categoryDetails(label, title, full) {
  if (label === 'Web') return {details: webDetails(full)};
  if (label === 'Système') return {details: systemDetails(full)};
  if (label === 'Programmation') {
    const details = programmingLanguages(title).filter(language => !['JavaScript', 'PHP'].includes(language));
    return {details: details.length ? details : ['Généralités']};
  }
  return {};
}

const webGroups = [
  ['HTML et CSS', /\b(?:xhtml|html5?|css3?|flexbox|bootstrap|foundation|sass|tailwind)\b/],
  ['JavaScript', /\b(?:javascript|typescript|angular|react|vue\.js|node\.js|jquery|next\.js|nuxt|google apps script)\b/],
  ['PHP', /\b(?:php|symfony|laravel|cakephp)\b/],
  ['Python et Django', /\b(?:python|django|flask|fastapi)\b/],
  ['.NET', /(?:^|[\s(])\.net\b|\basp\.net\b|\bblazor\b/],
  ['CMS', /\b(?:wordpress|joomla|drupal|spip)\b/],
  ['E-commerce', /\b(?:woocommerce|prestashop|shopify|e-commerce|boutique en ligne)\b/],
  ['Conception et design web', /\b(?:ui[ -]?ux|ux|ui|webdesign|design web|dreamweaver|ergonomie|accessibilite)\b/],
  ['Référencement et marketing web', /\b(?:webmarketing|referencement|seo|marketing (?:digital|web)|google analytics)\b/],
  ['Backend et API', /\b(?:api|rest|backend|java ee|jakarta ee|struts|ktor|spring)\b/],
  ['Sécurité et tests web', /\b(?:securite|securiser|hacking|cypress|selenium|testez|tests?)\b/],
  ['Gestion de projets web', /\b(?:gestion|pilotage|planification)\b.*\bprojets? web\b|\bprojets? web\b.*\b(?:gestion|pilotage|planification)\b/],
];

function webDetails(title) {
  const details = webGroups.filter(([, pattern]) => pattern.test(title)).map(([label]) => label);
  return details.length ? details : ['Généralités'];
}

function systemDetails(title) {
  const cloud = /\b(?:cloud|aws|azure|amazon web services|google cloud|gcp|sharepoint online|microsoft 365)\b/.test(title);
  const system = /\b(?:linux|unix|debian|ubuntu|windows|shell|powershell|vmware|vsphere|proxmox|exchange server|sharepoint server)\b/.test(title);
  return cloud ? (system ? ['Système', 'Cloud'] : ['Cloud']) : ['Système'];
}
