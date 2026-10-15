import {biomaterialsSubject, neuroscienceSubject, environmentalHealthSubject, ecologicalTransitionSubject} from './shared-science-health.js?v=2026-10-12-healthscience1';

const rules = [
  ['Mathématiques et statistiques', /\b(?:mathemati\w*|mathemat\w*|maths?|algebr\w*|geometr\w*|arithmetic|arithmetique|probabilit\w*|probability|statistics|statistique\w*|calculus|calcul differentiel|calcul integral)\b/, [
    ['Algèbre et géométrie', /\b(?:algebr\w*|geometr\w*|arithmet\w*)\b/],
    ['Analyse', /\b(?:calculus|calcul differentiel|calcul integral|analyse fonctionnelle|differential equations|equations? differentielles?)\b/],
    ['Probabilités et statistiques', /\b(?:probabil\w*|statisti\w*|stochasti\w*|markov)\b/],
    ['Mathématiques appliquées', /\b(?:numerical|numerique\w*|applique\w*|applied|optimization|optimisation|modelisation|modeling)\b/],
  ]],
  ['Physique et astronomie', /\b(?:physique\w*|physics|quantum|quantique\w*|optics|optique\w*|thermodynami\w*|astronom\w*|astrophysi\w*|cosmolog\w*)\b/, [
    ['Physique quantique', /\b(?:quantum|quantique\w*)\b/],
    ['Optique', /\b(?:optics|optique\w*|photon\w*|laser\w*)\b/],
    ['Thermodynamique', /\bthermodynami\w*\b/],
    ['Astronomie et astrophysique', /\b(?:astronom\w*|astrophysi\w*|cosmolog\w*|etoiles?|stars?|universe|univers)\b/],
  ]],
  ['Biologie et écologie', /\b(?:biologie|biology|biologists?|biological|biochem\w*|biochim\w*|geneti\w*|genomi\w*|genetic\w*|genomic\w*|microbiolog\w*|botan\w*|zoolog\w*|ecologie|ecology|ecosystems?|ecosystemes?)\b/, [
    ['Biologie cellulaire et moléculaire', /\b(?:cellulaire|cellular|molecular|moleculaire|biochim\w*|biochem\w*)\b/],
    ['Génétique et génomique', /\b(?:geneti\w*|genetic\w*|genomi\w*|genomic\w*)\b/],
    ['Microbiologie', /\b(?:microbiolog\w*|microbial|microbes?|bacteri\w*|virolog\w*)\b/],
    ['Biologie végétale et animale', /\b(?:botan\w*|zoolog\w*|vegetal\w*|plants?|plantes?|animals?|animaux|marine biology)\b/],
    ['Écologie', /\b(?:ecologie|ecology|ecosystems?|ecosystemes?|biodiversit\w*)\b/],
  ]],
  ['Sciences de la Terre', /\b(?:geolog\w*|geophysi\w*|geoscien\w*|geochimi\w*|geochem\w*|oceanograph\w*|hydrolog\w*|meteorolog\w*|climat|climats|climate|climatique\w*|paleoclimat\w*|earth sciences?)\b/, [
    ['Géologie et géophysique', /\b(?:geolog\w*|geophysi\w*|geoscien\w*|geochimi\w*|geochem\w*)\b/],
    ['Climat et météorologie', /\b(?:climat\w*|climate|meteorolog\w*|paleoclimat\w*)\b/],
    ['Océanographie et hydrologie', /\b(?:ocean\w*|hydrolog\w*|rivers?|rivieres?|floods?|inondations?)\b/],
  ]],
  ['Mécanique et robotique', /\b(?:mecanique\w*|mechanics|mechanical|robotique|robotics|hydrodynami\w*|aerodynami\w*|tribolog\w*)\b/, [
    ['Mécanique des solides', /\b(?:solid mechanics|mecanique des solides|structures?|stress|vibration\w*|resistance des materiaux)\b/],
    ['Mécanique des fluides', /\b(?:fluid\w*|hydrodynami\w*|aerodynami\w*|hydrauli\w*)\b/],
    ['Robotique', /\b(?:robot\w*|automatique|control systems?)\b/],
  ]],
  ['Électricité, électronique et télécommunications', /\b(?:electri\w*|electroni\w*|electrotechni\w*|telecommunic\w*|microelectroni\w*|radiofrequency|radiofrequence\w*|signal processing|traitement du signal)\b/, [
    ['Électricité et électrotechnique', /\b(?:electric\w*|electriqu\w*|electrotechni\w*)\b/],
    ['Électronique', /\b(?:electroni\w*|microelectroni\w*|circuits?|semiconduct\w*)\b/],
    ['Télécommunications et signal', /\b(?:telecommunic\w*|radiofrequency|radiofrequence\w*|signal processing|traitement du signal|antennes?|antennas?)\b/],
  ]],
  ['Énergie', /\b(?:energie\w*|energy|energetique\w*|photovolta\w*|renewable|energies? renouvelables?|nuclear power|energie nucleaire|eolien\w*|petroleum|petrole)\b/, [
    ['Énergies renouvelables', /\b(?:renewable|renouvelables?|photovolta\w*|solar|solaire|eolien\w*|wind energy|geotherm\w*|biomasse|biomass)\b/],
    ['Nucléaire', /\b(?:nuclear|nucleaire)\b/],
    ['Hydrocarbures', /\b(?:petroleum|petrole|hydrocarb\w*|natural gas|gaz naturel)\b/],
    ['Stockage et efficacité énergétique', /\b(?:storage|stockage|batter\w*|efficien\w*|efficacite|energy saving|economies? d.energie)\b/],
  ]],
  ['Construction et génie civil', /\b(?:genie civil|civil engineering|geotechn\w*|batiments?|building construction|construction metallique|construction en beton|beton|concrete|eurocodes?|construction parasismique)\b/, [
    ['Bâtiment et structures', /\b(?:batiments?|buildings?|structures?|beton|concrete|eurocodes?|construction)\b/],
    ['Géotechnique', /\b(?:geotechn\w*|soil mechanics|fondations?|foundations?)\b/],
    ['Infrastructures', /\b(?:bridges?|ponts?|routes?|tunnels?|barrages?|dams?|infrastructures?)\b/],
  ]],
  ['Matériaux et métallurgie', /\b(?:materiaux|materials science|material science|materials for engineers|metallurg\w*|polymers?|polymeres?|composite materials|materiaux composites|nanomaterials?|nanomateriaux|ceramics|ceramiques?)\b/, [
    ['Métaux et métallurgie', /\b(?:metall\w*|metaux|metals?|acier\w*|steel|alloys?|alliages?)\b/],
    ['Polymères et composites', /\b(?:polymers?|polymeres?|composites?)\b/],
    ['Nanomatériaux', /\b(?:nano\w*)\b/],
    ['Céramiques', /\b(?:ceramics|ceramiques?)\b/],
  ]],
  ['Chimie', /\b(?:chimie|chimiques?|chemistry|chemical)\b/, [
    ['Chimie organique', /\b(?:organic|organique)\b/],
    ['Chimie inorganique', /\b(?:inorganic|inorganique)\b/],
    ['Chimie analytique', /\b(?:analytical|analytique|chromatograph\w*|spectroscop\w*|mass spectrometry)\b/],
    ['Chimie physique', /\b(?:physical chemistry|chimie physique|physico[ -]chim\w*)\b/],
    ['Biochimie', /\b(?:biochem\w*|biochim\w*)\b/],
  ]],
];

// Additional explicit subjects observed in the remaining generic Sciences titles.
const additionalSubjects = new Map([
  ['Mathématiques et statistiques', /\b(?:integrals?|integrales?|functional analysis|analyse numerique|exercices? (?:corriges? )?d'analyse|problemes? d'analyse|stochasti\w*|differential equations|equations? (?:aux derivees partielles|differentielles?)|galois|fractales?|latin squares|groupes? de lie|finite elements)\b/],
  ['Physique et astronomie', /\b(?:acousti\w*|electromagnet\w*|gravitation\w*|relativit\w*|supraconduct\w*|superconduct\w*|radiative|photoemission|particle physics|transferts? thermiques?|heat transfer|exoplanet\w*|planetes?|planets?|universe|univers|space-time|meteorites?)\b/],
  ['Biologie et écologie', /\b(?:biodiversit\w*|ecological|ecosystemique\w*|toxicolog\w*|biotechnolog\w*|biomim\w*|biofilms?|cell cycle|cycle cellulaire|stem cells|adn|dna|epigenet\w*|insect\w*|arthropod\w*|coleopter\w*|birds?|oiseaux?|mammals?|mammiferes?|reptiles?|snakes?|serpents?|spiders?|araignees?|butterflies|papillons?|sharks?|requins?|tortues?|turtles?|amphibi\w*|chauves-souris|orques?|whales?|abeilles?|bees|wild flowers|orchide\w*|liverworts|hornworts|mosses|diatoms|algues|plants|plantes|faune|flore|forets?|forest ecology)\b/],
  ['Sciences de la Terre', /\b(?:hydrogeolog\w*|seism\w*|earthquakes?|volcan\w*|karstolog\w*|sedimentolog\w*|pedolog\w*|sols?|soil science|soil ecology|bioclimatolog\w*|banquise)\b/],
  ['Mécanique et robotique', /\b(?:robots?|turbulence|turbulent flows?|fluid dynamics|boundary layer flow|fracture mechanics|gear manufacturing|vibrations?)\b/],
  ['Électricité, électronique et télécommunications', /\b(?:microcontrollers?|microcontroleurs?|vhdl|amplifiers?|microelectronics|wireless communications|digital communications|5g|4g|lte|radar|led|electromechan\w*|cablage)\b/],
  ['Énergie', /\b(?:biomasse|biomass|natural gas|gaz naturel|solar thermal|nuclear|nucleaire|windfarm|combustion|power systems)\b/],
  ['Construction et génie civil', /\bbim\b|\b(?:building (?:envelope|simulation)|bridge construction|structures? en acier|bati existant|construire|renover|toits?|charpentes?|stairs|sewer reconstruction|ventilation)\b/],
  ['Matériaux et métallurgie', /\b(?:composites|plastiques?|plastics|metallic materials|corrosion|crystallization|cristallograph\w*|carbon fiber|materials (?:matter|processing|policy)|2d materials|textiles?)\b/],
  ['Chimie', /\b(?:catalys\w*|chromatograph\w*|spectrometr\w*|surfactants?|tensioactifs?)\b/],
]);

const extraDetails = new Map([
  ['Mathématiques et statistiques', [
    ['Analyse', /\b(?:analyse complexe|analyse fonctionnelle|functional analysis|equations?|integrals?|integrales?|fourier|infinitesimal)\b/],
    ['Algèbre et géométrie', /\b(?:algebraic|geometric|matrices|matrix|topolog\w*|group theory|theorie des groupes|polynomials?|polynomes?)\b/],
    ['Probabilités et statistiques', /\b(?:statistical|statisticians?|stochastic|bayesian|bayesien\w*|chi-squared|random walks)\b/],
  ]],
  ['Physique et astronomie', [
    ['Acoustique', /\bacousti\w*\b/],
    ['Astronomie et astrophysique', /\b(?:exoplanet\w*|planetes?|planets?|universe|univers|meteorites?)\b/],
    ['Thermodynamique', /\b(?:transferts? thermiques?|heat transfer)\b/],
    ['Optique', /\b(?:optical|holograph\w*)\b/],
  ]],
  ['Biologie et écologie', [
    ['Biologie végétale et animale', /\b(?:insect\w*|arthropod\w*|birds?|oiseaux?|mammals?|mammiferes?|reptiles?|snakes?|serpents?|spiders?|araignees?|butterflies|papillons?|sharks?|requins?|tortues?|turtles?|amphibi\w*|chauves-souris|orques?|abeilles?|bees|orchide\w*|mosses|liverworts|hornworts|algues|faune|flore|forets?)\b/],
    ['Écologie', /\b(?:ecological|ecosystemique\w*|biomim\w*)\b/],
    ['Biologie cellulaire et moléculaire', /\b(?:adn|dna|cell cycle|cycle cellulaire|stem cells)\b/],
  ]],
  ['Sciences de la Terre', [
    ['Géologie et géophysique', /\b(?:seism\w*|earthquakes?|volcan\w*|karstolog\w*|sedimentolog\w*)\b/],
    ['Sols et pédologie', /\b(?:sols?|soil|pedolog\w*)\b/],
    ['Océanographie et hydrologie', /\bhydrogeolog\w*\b/],
  ]],
  ['Électricité, électronique et télécommunications', [
    ['Électronique', /\b(?:microcontrollers?|microcontroleurs?|vhdl|amplifiers?|led)\b/],
    ['Télécommunications et signal', /\b(?:wireless|digital communications|5g|4g|lte|radar|cablage)\b/],
  ]],
]);

rules.push(['Industrie et procédés', /\b(?:manufacturing|fabrication additive|3d printing|4d printing|maintenance (?:preventive|industrielle)|process (?:systems\s?engineering|engineering)|genie des procedes|usinage|machining|extrusion|refrigeration|industrial automation|factory automation)\b/, [
  ['Fabrication et procédés', /\b(?:manufacturing|fabrication|printing|usinage|machining|extrusion|process|procedes)\b/],
  ['Maintenance industrielle', /\bmaintenance\b/],
  ['Automatisation industrielle', /\bautomation\b/],
  ['Froid industriel', /\brefrigeration\b/],
]]);
rules.push(['Aéronautique et transports', /\b(?:aerospace|aeronauti\w*|aeropropulsion|aircraft|flight dynamics|ship repair|marine vessel|maintenance automobile|vehicle dynamics|transportation|navigation maritime)\b/, [
  ['Aéronautique', /\b(?:aerospace|aeronauti\w*|aeropropulsion|aircraft|flight)\b/],
  ['Transport maritime', /\b(?:ship|marine vessel|maritime)\b/],
  ['Automobile et transports terrestres', /\b(?:automobile|vehicle|transportation)\b/],
]]);

const reviewSubjects = new Map([
  ['Mathématiques et statistiques', /\b(?:mathemath\w*|maths\w*|algebriques?|geometriques?|bayesian|bayesien\w*|chi-squared|markov\w*|matrices|matrix|tensors?|tenseurs?|topolog\w*|singularit\w*|fonctions? analytiques?|fonctions? complexes?|numerical methods|methodes? numeriques?|numerical schemes|dynamical systems|nonlinear optimization|optimisation combinatoire|graphes?|number theory|prime numbers?|theory of numbers|convergence uniforme|hamilton\w*)\b|^analyse\b.*\b(?:cours|exercices|metriques|normes|espaces|mathemati\w*)\b/],
  ['Physique et astronomie', /\b(?:photons?|atomes?|atoms?|neutrons?|rayonnement\w*|radiation|lasers?|magneti\w*|magnetism|electrons?|quanta|nanophysi\w*|nanophoton\w*|holograph\w*|condensed matter|matiere condensee|thermonucleaire|black holes?|trous noirs|cosmos|cosmique\w*|cosmic|solar system|systeme solaire|spaceflight|space exploration|orbite|astrobiolog\w*|asteroseismi\w*)\b/],
  ['Biologie et écologie', /\b(?:biologiqu\w*|biomolecular|biomolecul\w*|physiology|physiolog\w*|histolog\w*|embry\w*|vertebr\w*|proteins?|proteines?|lipid\w*|enzymes?|enzym\w*|parasiti\w*|pathogen\w*|microorganism\w*|micro-organism\w*|microbiot\w*|biomechan\w*|biomecani\w*|biodeterior\w*|fish|fishes|poissons?|corbeaux|castors?|hiboux?|owls?|fleurs?|flora|floral\w*|foug\w*|fungi|champignons?|trees|arbres|arbustes|plancton|plankton|moustiques?|mosquito\w*|poulpes?|octopus|aphids|pucerons?|hymenopter\w*|animal research)\b/],
  ['Sciences de la Terre', /\b(?:petrolog\w*|mineralog\w*|mineral resources|ressources minerales|lithosph\w*|roches?|rocks|geomorph\w*|erosion|ruissellement|tsunami\w*|oceans?|oceanique\w*|lac\b|lakes?|vagues|waves|marees|glaci\w*|rechauffement climatique|global warming|climatolog\w*|teledetection|remote sensing|geospatial)\b/],
  ['Mécanique et robotique', /\b(?:hydraulique\w*|rheolog\w*|rheomet\w*|fluid machinery|dynamique des fluides|ecoulements?|fluid flows?|tribotr\w*|pumps|pompes|automatique|control system|feedback control|fracture|shear localization)\b/],
  ['Électricité, électronique et télécommunications', /\b(?:electronics|electrotech\w*|circuit\w*|semiconduct\w*|fpgas?|cplds?|antennes?|antennas?|oscilloscop\w*|frequency synthesis|power quality|signal processing|electromagnetic compatibility|emc|printed circuit boards|capteurs electroniques)\b/],
  ['Énergie', /\b(?:bioenergy|bioenergi\w*|microgrids?|wind farms?|wind energy|small wind|eolien\w*|reacteurs?|reactors?|fission|radioactive waste|radioactifs|gas well|oil and gas|petroliers?|petroliere\w*|coal|charbon|geotherm\w*|fuel cells|piles a combustible|batteries|batterie|energy efficiency|iso 50001)\b/],
  ['Construction et génie civil', /\b(?:murs?|planchers?|facades?|bardage\w*|toitures?|tuiles|carrelage\w*|chapes?|dalles?|maconner\w*|menuiser\w*|plomberie|revetements?|logements?|cctps?|fenetres?|combles|cloisons?|platre|chantier\w*|travaux publics|projet routier|chaussees?|steel structures|timber structures|construction failures|architecture navale|architecture durable|architectural graphics|isolation thermique|ponts thermiques|resistance des structures|fondations?)\b/],
  ['Matériaux et métallurgie', /\b(?:materials|polymeric|polymerique\w*|metallograph\w*|nanotechnolog\w*|nanoscien\w*|biomaterials|biomateriaux|alloys|alloy|alliages?|glass|verre|carbon nanotubes|nanotubes|ceramic\w*|cement|ciment|acier|steels?|timber|resines?|resins)\b/],
  ['Chimie', /\b(?:chemicals?|spectroscopy|spectroscopie|organic synthesis|synthese organique|catalytic|catalyse|adsorption|desorption|electrochem\w*|electrochim\w*|molecular chemistry|acid manufacture|metal complexes|composes chimiques|supramolecul\w*)\b/],
  ['Industrie et procédés', /\b(?:industrial processes|procedes industriels|industrial engineering|genie industriel|industrie 4\.0|industry 4\.0|industrial plants|usines?|production industrielle|scada|usine du futur|welding|soudage|industrial accidents)\b/],
  ['Aéronautique et transports', /\b(?:aerospatial\w*|road transport|transport routier|maritime|shipbuilding|automotive|navale?|drone\w*|aerial survey|airport\w*|aeroport\w*)\b/],
]);

const expandedSubjects = new Map([
  ['Mathématiques et statistiques', /\b(?:mathematics|mathematiques|algebraic|geometric|statistical|statisticians?|stochastic|trigonometr\w*|arithmetic|arithmet\w*|infinitesimal|quadratiques|euclidiens|hermitiens|polynomials?|polynomes?|random walks|game theory|theorie des jeux|theory of groups|group theory|theorems?|theoremes?|functional analysis|fourier analysis|analyse complexe|analyse fonctionnelle|ergodi\w*|espaces vectoriels|linear programming|programmation lineaire|combinatori\w*|equations?|dynamical system)\b/],
  ['Biologie et écologie', /\b(?:biology|animals?|animaux|avian|beetles?|beetle|butterfly|mosquitoes|fishes|fossils?|fossiles?|yeasts?|levures?|chromosomes?|cytogen\w*|cytometry|cytometri\w*|cytogenetics|plant atlas|plant physiology|moss|ferns|succulents|baobabs?|habitats|wildlife|ecosystem|biodiversity|biological order|biosphere|bioactive|biosensor\w*|glycobiolog\w*|liposomes?|botanical)\b/],
  ['Physique et astronomie', /\b(?:electrostati\w*|electrocineti\w*|electrodynami\w*|galaxies?|astrometry|astrometri\w*|astronaut\w*|exploration martienne|thermiqu\w*|thermique\w*|thermal|optical|optique|light sources|standard model|modele standard|heat transfer|lumiere|gravitation)\b/],
  ['Sciences de la Terre', /\b(?:climatic|climat\w*|arctic|antarctic|antarctique|arctique|earth sciences|igeneous|igneous|mineral pseudomorphism|drought|crues?|inondations?|flood\w*|subduction|geomorpholog\w*|mineral resources|mineralogy|oceanography|river\w*|rivieres?|plans d'eau|littoral)\b/],
  ['Matériaux et métallurgie', /\b(?:metals?|metal|aluminium|aluminum|copper|caoutchouc|rubber|foams?|mousses?|coatings?|refractory|refractaire\w*|sulfide ores|textiles?|woven|fabrics|fibre\w*|fiber\w*|poly\w*(?:ide|ene|ane|ester)s?)\b/],
  ['Électricité, électronique et télécommunications', /\b(?:electromagnetic|microwave\w*|power engineering|power system|high voltage|low voltage|ac\/dc|digital logic|logic controllers|digital filter|radio logicielle|radio intelligente|radiofrequence\w*|electrical|mems|digital tv|microprocessor\w*)\b/],
  ['Énergie', /\b(?:cogener\w*|biofuels?|biocarbur\w*|bio-refin\w*|biorefin\w*|shale gas|gas reservoir|hydroelectri\w*|hydrogen production|hydrogene vert|power generation|grid systems|oil upgrading|gas-turbine)\b/],
  ['Construction et génie civil', /\b(?:bardages?|enduits?|construction|constructions?|building|buildings|architectural|urbanisme|ecoquartiers?|barres? en acier|geomecani\w*|ponts?|barrages?|dikes|bridges|sanitation)\b/],
  ['Industrie et procédés', /\b(?:industrie|industriel\w*|industrial|process engineering|production networks|maintenan\w*|zero panne|safety certification|safety engineering|programmable logic controllers|automates programmables)\b/],
  ['Aéronautique et transports', /\b(?:naval|ship\w*|vehicle\w*|vehicules?|automobiles?|trains?|railway|chemins de fer|spacecraft|aeronautic\w*)\b/],
  ['Chimie', /\b(?:molecules?|molecular|supramolecular|catalyzed|catalysed|chemical|chemistry|chimi\w*|spectroscopies|spectrometry|radionucl\w*|solvent extraction|solvants?)\b/],
]);

rules.push(['Eau, assainissement et déchets', /\b(?:water treatment|traitement des eaux|water supply|alimentation en eau|water management|gestion de l'eau|gestion des eaux|eaux usees|wastewater|assainissement|stations? d'epuration|desalination|desalement|solid waste|waste management|gestion des dechets|recyclage|recycling|landfilling|depollution|remediation|air pollution|pollution de l'air|contaminants in the environment)\b/, [
  ['Eau et assainissement', /\b(?:water|eau\w*|assainissement|epuration|desalination|desalement)\b/],
  ['Déchets et recyclage', /\b(?:waste|dechets|recycl\w*|landfilling)\b/],
  ['Pollution et dépollution', /\b(?:pollution|depollution|remediation|contaminants)\b/],
]]);
rules.push(['Métrologie et instrumentation', /\b(?:metrolog\w*|metrology|instrumentation|measurement science|scientific instruments|capteurs physiques|capteurs chimiques)\b/, [
  ['Métrologie', /\b(?:metrolog\w*|metrology|measurement science)\b/],
  ['Instrumentation et capteurs', /\b(?:instrument\w*|capteurs?|sensors?)\b/],
]]);

rules.push(['Génie biomédical', biomaterialsSubject, [
  ['Biomatériaux et médecine régénérative', biomaterialsSubject],
]]);
rules.push(['Environnement et transitions écologiques', ecologicalTransitionSubject, [
  ['Développement durable et transitions', /\b(?:developpement durable|sustainable development|transitions?|carboneutre|durabilite)\b/],
  ['Gestion et restauration des milieux', /\b(?:resource governance|ressources naturelles|nature-based|restauration ecologique|environmental governance)\b/],
  ['Environnement et santé', environmentalHealthSubject],
]]);
extraDetails.get('Biologie et écologie').push(['Neurosciences', neuroscienceSubject]);

export function scienceCategoryPaths(title, {chemistry = false, subtitleFallback = true} = {}) {
  const full = String(title ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[’‘]/g, "'").toLowerCase();
  // Subtitle applications alone must not determine the main scientific domain.
  const primary = full.replace(/^(?:aide[ -]memoire|formulaire|memento)\s*[-–—:]\s*/, '').split(/\s[-–—:]\s/)[0];
  const paths = rules.filter(([label, pattern]) => {
    if (label === 'Mécanique et robotique' && /\b(?:quantum|quantique)\b/.test(primary)
        && !/\b(?:fluid\w*|solides?|robot\w*)\b/.test(primary)) return false;
    if (label === 'Électricité, électronique et télécommunications'
        && /\b(?:electronic exchanges|financial|stock exchanges?)\b/.test(primary)) return false;
    let additional = additionalSubjects.get(label)?.test(primary);
    if (label === 'Biologie et écologie' && /\b(?:power|industrial|chemical|thermal|treatment) plants\b/.test(primary)) additional = false;
    if (label === 'Physique et astronomie' && /\b(?:agric\w*|paysan\w*|sante|ecologie|biodiversit\w*)\b/.test(primary)) additional = false;
    if (label === 'Construction et génie civil' && /\b(?:construire|renover)\b/.test(primary)
        && !/\b(?:maison|batiment|toits?|charpentes?|logements?|construction|ponts?|murs?|planchers?|beton)\b/.test(full)) additional = false;
    if (label === 'Sciences de la Terre' && /\bsol\b/.test(primary)
        && !/\b(?:sols|comprendre|pedolog\w*|soil|fertilite|terre)\b/.test(full)) additional = false;
    let reviewed = reviewSubjects.get(label)?.test(primary) || expandedSubjects.get(label)?.test(primary);
    if (label === 'Biologie et écologie' && /\b(?:agriculture biologique|lutte biologique|psycholog\w*|biological warfare|weapons?)\b/.test(primary)) reviewed = false;
    if (label === 'Construction et génie civil' && /\b(?:windows|cloud|plantes?|cultures?|soil mechanics|veterinaire|decision|social\w*|religion|savoir|cogniti\w*|identite|langage|math\w*|algebr\w*|constructivism|beliefs?|theory construction)\b/.test(primary)) reviewed = false;
    if (label === 'Matériaux et métallurgie' && /\b(?:teaching materials|learning materials|materiels? pedagogiques|art of glass)\b/.test(primary)) reviewed = false;
    if (label === 'Chimie' && /\b(?:molecular biology|biologie moleculaire|molecular diagnostic|molecular genetics)\b/.test(primary)) reviewed = false;
    if (label === 'Environnement et transitions écologiques'
        && /\b(?:rse|csrd|reporting|corporate|marketing|management)\b/.test(primary)) return false;
    const shared = (label === 'Biologie et écologie' && neuroscienceSubject.test(primary))
      || (label === 'Environnement et transitions écologiques' && environmentalHealthSubject.test(primary));
    return (label === 'Chimie' && chemistry) || pattern.test(primary) || additional || reviewed || shared;
  })
    .map(([subcategory, , groups]) => {
      const details = [...new Set([...groups, ...(extraDetails.get(subcategory) ?? [])]
        .filter(([, pattern]) => pattern.test(full)).map(([label]) => label))];
      return {family: 'Sciences et techniques', subcategory,
        details: details.length ? details : ['Généralités'], ruleIds: ['science-title-domain']};
    });
  // A descriptive subtitle can identify an otherwise opaque title, not an application example.
  const subtitle = full.split(/\s:\s/).slice(1).join(' : ');
  if (!paths.length && subtitleFallback && subtitle
      && !/\b(?:applications?|examples?|exemples?|using|utilisant|applied to)\b/.test(subtitle)
      && !/^(?:introduction|generalites|culture scientifique)\b/.test(primary)) {
    const inferred = scienceCategoryPaths(subtitle, {subtitleFallback: false});
    if (inferred.length === 1) return inferred.map(path => ({...path, ruleIds: ['science-subtitle-subject']}));
  }
  return paths;
}
