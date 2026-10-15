const fold = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[œŒ]/g, 'oe').replace(/[’‘]/g, "'").toLowerCase();

// Names are corroborating subject signals only inside the generic arts source.
const painters = /\b(?:monet|manet|renoir|degas|cezanne|gauguin|van gogh|matisse|picasso|chagall|kandinsky|klimt|schiele|klee|malevitch|malevich|mondrian|rothko|soulages|courbet|corot|bonnard|pissarro|sisley|caillebotte|botticelli|mantegna|caravage|caravaggio|rembrandt|vermeer|rubens|van dyck|velazquez|goya|durer|holbein|memling|brueghel|arcimboldo|hokusai|hiroshige|utamaro|frida kahlo|modigliani|tamara de lempicka|lempicka|toulouse.lautrec|delacroix|gericault|constable|j\.m\.w\. turner|william turner|f\.?riedrich|fra angelico|el greco|le greco|leonardo da vinci|leonard de vinci|fragonard|watteau|ingres|vigee.le.?brun|edward hopper|edvard munch|dufy|vlaminck|derain|franz marc|august macke|kirchner|nolde|ensor|magritte|salvador dali|dali|bosch|el bosco|gleyre|fantin.latour|felicien rops|vallotton|mary cassatt|cassatt|okeeffe|o'keeffe|diego rivera|repin|repine|levitan|aivazov\w*|aivazosk\w*|shishkin|chichkine|marquet|larsson|burne.jones|beardsley|bakst|pascin|whistler|hans hartung|paul signac)\b/;
const filmPeople = /\b(?:hitchcock|kubrick|tarantino|scorsese|spielberg|eastwood|chaplin|bresson|godard|truffaut|chabrol|rohmer|rivette|varda|resnais|tarkovski|tarkovsky|fellini|antonioni|kurosawa|miyazaki|kitano|buñuel|bunuel|lynch|cronenberg|cassavetes|jarmusch|herzog|fassbinder|melville|scola|peckinpah|satyajit ray|orson welles|john ford|sergio leone|jean renoir|francis ford coppola|david fincher|wes anderson|george cukor|leo mccarey|youssef chahine|jean eustache|jacques tourneur|wes craven|robert redford|tom cruise|sylvester stallone|nicolas cage|kate winslet|audrey hepburn|jean gabin|marlon brando|marlene dietrich|bette davis|joan crawford|natalie wood|romy schneider|mel gibson)\b/;
const otherPainters = /\b(?:kahlo|jan van eyck|van eyck|jasper johns|jean fouquet|jean.louis forain|joaquin ferrer|le douanier rousseau|le lorrain|louis david|maurice denis|vroubel|vrubel|pieter bruegel|brueghels|pollock|puvis de chavannes|raphael|rivera|rauschenberg|van der weyden|sargent|seurat|tal coat|titian|tizian|turner|valentin serov|vasily surikov|surikow|yves klein|de kooning)\b/;
const otherFilmPeople = /\b(?:cary grant|schroeter|lubitsch|amos gitai|pasolini|paradjanov|olivera|barbet schroeder|bela tarr|billy wilder|brigitte bardot|bruce lee|catherine breillat|cecil b\. demille|charlot|delphine seyrig|guitry|isabelle huppert|james dean|jean epstein|jean rouch|jean.claude biette|jean.pierre marielle|josef von sternberg|kieslowski|laurel et hardy|louis malle|luchino visconti|visconti|philippe garrel|ridley scott|samuel fuller|steve mcqueen|frederick wiseman|fritz lang|terrence malick|theo angelopoulos|woody allen|wong kar.wai)\b/;
const otherMusicians = /\b(?:alan wilson|arctic monkeys|isaac hayes|jacques higelin|offenbach|janet jackson|jean ferrat|jean leloup|jean.michel jarre|jeff beck|jeff buckley|jj cale|john lee hooker|johnny cash|kate bush|klaus schulze|couperin|lead belly|led zeppelin|leonard cohen|liszt|leo ferre|madonna|manu dibango|marvin gaye|massilia sound system|maurane|meredith monk|messiaen|mike oldfield|otis redding|p.funk|patti smith|philip glass|philippe katerine|queen|ray charles|renaud|son house|stromae|the allman brothers|the byrds|the clash|the doors|janis joplin|wagner|edith piaf|etienne daho|frank zappa)\b/;

function subject(title, {primaryOnly = true} = {}) {
  const full = fold(title);
  const text = primaryOnly ? full.split(/\s*:\s*|\s+[–—-]\s+/)[0] : full;
  const path = (subcategory, details, id = 'arts-title-subject', family = 'Art / Culture') => ({family, subcategory,
    ...(details?.length ? {details} : {}), ruleIds: [id]});
  // A film/spectacle series is stronger evidence than words in its work title.
  if (/\bfiches cinema\b/.test(full)) return path('Cinéma et spectacle', ['Cinéma'], 'arts-cinema-series');
  if (/\bfiches spectacle\b/.test(full)) return path('Cinéma et spectacle', [/\bchoregraph\w*\b/.test(full) ? 'Danse' : 'Théâtre et arts du spectacle'], 'arts-spectacle-series');
  if (/\b(?:choregraph\w*|ballets?|danse|danser|dance|dancers?)\b/.test(text) && !/\b(?:danse des|danse dans|piano|musique|music)\b/.test(text)) return path('Cinéma et spectacle', ['Danse']);
  if (/\b(?:mise en scene|fiches spectacle|arts du spectacle|arts vivants|cirque|theatr\w*|theaters?|broadway)\b/.test(text)) return path('Cinéma et spectacle', ['Théâtre et arts du spectacle']);
  if (/\b(?:libraries|library|bibliotheques?|bibliothecaires?|documentalistes?|librarianship)\b/.test(text)) {
    return path('Bibliothèques et documentation', [], 'arts-transfer-documentation', 'Médias et communication');
  }
  if (/\b(?:journalisme|journalists?|journalism|presse ecrite|medias?|media|edition du livre|histoire de l'edition)\b/.test(text)
    && !/\b(?:new media art|art|artists?|artistiques?|cinema|photograph\w*|musique)\b/.test(text)) {
    return path('Médias et communication', [], 'arts-transfer-media', 'Médias et communication');
  }
  if (/\b(?:cinemas?|cinematograph\w*|films?|filmer|filmmak\w*|cineastes?|cineph\w*|hollywood|western|scenaristes?|scenario|screenwriting|movie\w*|horror films?|cine.bazar|cine.club|filmique\w*)\b/.test(text)
    || filmPeople.test(text) || otherFilmPeople.test(text)) {
    return path('Cinéma et spectacle', [/\b(?:animation|anime|pixar)\b/.test(text) ? 'Animation' : 'Cinéma']);
  }
  if (/\b(?:series televisees|series americaines|television|televisuel\w*|tv series|the wire|soprano|twin peaks|breaking bad|game of thrones)\b/.test(text)) {
    return path('Cinéma et spectacle', ['Séries et télévision']);
  }
  if (/\b(?:jeu d'acteur|acting|actrices?|acteurs?)\b/.test(text)) return path('Cinéma et spectacle', ['Jeu d’acteur']);
  if (/\b(?:photograph\w*|fotograf\w*|photojournalis\w*|photos?|reflex|cartier.bresson|robert capa|richard avedon|august sander|bill brandt|walker evans|emmanuel sougez|edward steichen|daguerreotype)\b/.test(text)) {
    return path('Photographie', []);
  }
  if (/\b(?:sculpt\w*|rodin|camille claudel|brancusi|giacometti|jean tinguely|thorvaldsen)\b/.test(text)) return path('Sculpture', []);
  if (/\b(?:bande[s]? dessinee[s]?|comic books?|comics|mangas?|graphic novels?|neuvieme art|bd|tintin|asterix|franquin|moebius)\b/.test(text)) {
    return path('Bande dessinée', [/\bmangas?\b/.test(text) ? 'Manga' : 'Études et histoire']);
  }
  if (/\b(?:dessin\w*|drawings?|drawing|dibujos|illustrat\w*|gravur\w*|graveurs?|estampes?|calligraph\w*|enlumin\w*|ukiyo.e|graffiti|graphistes?|graphic design)\b/.test(text)
    && !/\b(?:peint\w*|paint\w*)\b/.test(text)) {
    return path('Arts graphiques', [/\b(?:gravur\w*|graveurs?|estampes?|ukiyo.e)\b/.test(text) ? 'Gravure et estampe' : 'Dessin et illustration']);
  }
  if (/\b(?:architectur\w*|architektur|architectes?|architects?|urbanis\w*|urbanites?|urban planning|urban transformation|urban futures|renovation urbaine|espace public|public space|mobilier urbain|ville (?:durable|resiliente|verticale)|villes fortifiees|gaudi|le corbusier|bauhaus|design|decoration interieure|interior design|borromini|frank lloyd wright)\b/.test(text)) {
    return path('Architecture et design', [/\b(?:design|bauhaus|decoration)\b/.test(text) ? 'Design et décoration' : 'Architecture et urbanisme']);
  }
  if (/\b(?:arts? decoratifs?|decorative art|art deco|textiles?|costumes?|couture|bijoux|joailler\w*|porcelaines?|porcelain|ceramiqu\w*|ceramic|poterie|shoes|chaussures|abanicos|bikini|sous.vetements|dessous feminins|broderie|tissage|fashion|chanel|lingerie|vetements?|faience|ameublement)\b/.test(text)
    || /^(?:fans|fan tales)$/.test(text) || /^(?:la |dictionnaire de la |histoire (?:de la |et composantes de la ))?mode\b/.test(text)) {
    return path('Mode et arts décoratifs', [/\b(?:mode|costumes?|couture|shoes|chaussures|bikini|sous.vetements|dessous feminins)\b/.test(text) ? 'Mode et textile' : 'Arts décoratifs et artisanat']);
  }
  if (/\b(?:peint\w*|peindre|paint\w*|aquarell\w*|acuarelas?|watercolou?rs?|impressionnis\w*|impressionism|post.impression\w*|cubism\w*|expressionnis\w*|expressionism|fauves|nabis|preraphael\w*|pre.raphaelit\w*|canaletto|claude lorrain|souza.cardoso|poussin|daumier|tableaux)\b/.test(text) || painters.test(text) || otherPainters.test(text)) {
    return path('Peinture', []);
  }
  if (/\b(?:musiqu\w*|music\w*|jazz|blues|rock|punk|reggae|rap|hip.hop|chansons?|chanteurs?|chanteuses?|pian\w*|guitar\w*|violon\w*|symphon\w*|orchest\w*|composit\w*|operas?|percussion|solfege|polyphonie|clavecin|albums?|disques?|banjo|clarinet|drums|flute|orgues?|choral\w*|chantons?|beatles|beethoven|mozart|bach|vivaldi|monteverdi|berlioz|debussy|ravel|britten|milhaud|rossini|boulez|xenakis|nancarrow|sinatra|bob dylan|david bowie|pink floyd|radiohead|kraftwerk|depeche mode|fleetwood mac|black sabbath|joni mitchell|john coltrane|miles davis|nina simone|taylor swift|rolling stones|johnny hallyday|brassens|2pac|tupac|abba|adamo|arcade fire|arthur rubinstein|albert ayler|alan stivell|amy winehouse|barney wilen|bessie smith|ben harper|bono|brian wilson|brahms|brel|chopin|nougaro|chet baker|dalida|django reinhardt|dire straits|eagles|elliott smith|ella fitzgerald|frank zappa|franz liszt|felix leclerc|stravinsky|earth, wind & fire|creedence clearwater|kraftwerk|depeche mode|king crimson|joy division|tangerine dream|jimi hendrix|jim morrison|kraftwerk|mariah carey|mylene farmer|ntm|kendrick lamar|oasis|lynyrd skynyrd|the cure|the who|talking heads|weather report)\b/.test(text)) {
    const details = [];
    if (/\b(?:jazz|blues|coltrane|miles davis)\b/.test(text)) details.push('Jazz et blues');
    if (/\b(?:rock|pop|punk|metal|beatles|rolling stones|pink floyd)\b/.test(text)) details.push('Rock et pop');
    if (/\b(?:rap|hip.hop|r&b|soul|funk)\b/.test(text)) details.push('Rap, soul et funk');
    if (/\b(?:techno|electro\w*|ambient|kraftwerk)\b/.test(text)) details.push('Musiques électroniques');
    if (/\b(?:classique|operas?|baroque|symphon\w*|orchest\w*|beethoven|mozart|vivaldi|bach|monteverdi|debussy|ravel|berlioz)\b/.test(text)) details.push('Classique et opéra');
    return path('Musique', details);
  }
  if (otherMusicians.test(text) || /\b(?:techno|meloman\w*|ukulele|mandolin\w*|singing|songs?|singers?|violin|composer|trompette|trumpet|harpe|sonate|fugue|facture instrumentale|schoenberg|plain.chant)\b/.test(text)) return path('Musique', []);
  if (/\b(?:musees?|museums?|museolog\w*|museal\w*|patrimo\w*|heritage culturel|monuments historiques|expologie|exhibit display|louvre)\b/.test(text)
    && !/\b(?:geneti\w*|familial|financier)\b/.test(text)) {
    return path('Patrimoine et musées', []);
  }
  if (/\b(?:gastronomi\w*|recettes?|cookbooks?|cooking|cuisin\w*|cocktails?|oenolog\w*)\b/.test(text)) return path('Cuisine', []);
  if (/\b(?:sport\w*|olympi\w*|football|rugby|tennis|golf|cyclis\w*|randonnee|alpinis\w*|echecs|chess|jeux de societe|board games|bricolage|origami)\b/.test(text)) {
    return path('Loisirs et pratiques', [/\b(?:echecs|chess|jeux|games)\b/.test(text) ? 'Jeux' : /\b(?:bricolage|origami)\b/.test(text) ? 'Loisirs créatifs' : 'Sports et plein air']);
  }
  if (/\b(?:voyages?|travel|tourisme|tourism)\b/.test(text)) return path('Voyage', []);
  if (/\b(?:esthetiqu\w*|aesthetics?|histoire de l'art|art history|arts? plastiques?|arts? visuels?|visual arts?|oeuvres? d'art|histoire des arts|artistiques?|artistic|artists?|artistes?|artwork\w*|beaux.arts|iconograph\w*|surrealis\w*|rococo|futurism\w*|futurisme|neo.classicisme|manierisme|symbolism\w*|avant.gard\w*)\b/.test(text)
    || /\barts?\b/.test(text) && !/\b(?:art de vivre|art of war|art rhetorique|art oratoire|art de la conversation)\b/.test(text)
    || /\b(?:michel.ange|michelangelo|marcel duchamp|william morris)\b/.test(text)) {
    return path('Art', [], 'arts-title-general-art');
  }
  if (/\b(?:romanciers?|romancieres?|etudes litteraires|critique litteraire|litteratures?|literatures?|literary|ecrivains?|ecrivaines?|writers?)\b/.test(text)) {
    return path('Études littéraires', [], 'arts-transfer-literary-studies', 'Littérature et études littéraires');
  }
  if (/\b(?:linguist\w*|phonolog\w*|rhetorique|traduction|translation studies)\b/.test(text)) return path('Linguistique', [], 'arts-transfer-linguistics', 'Langues et linguistique');
  if (/\b(?:philosoph\w*|metaphys\w*|epistemolog\w*)\b/.test(text)) return path('Philosophie', [], 'arts-transfer-philosophy', 'Sciences humaines et sociales');
  if (/\bfiches exposition\b/.test(full)) return path('Art', [], 'arts-exhibition-series');
  return null;
}

export function genericArtsPaths(title, metadata = {}) {
  const direct = subject(title);
  if (direct) return [direct];
  const subtitle = String(title).split(/\s*:\s*|\s+[–—-]\s+/).slice(1).join(' ');
  const secondary = subtitle && !/\b(?:applications?|exemples?|examples?|inspired|inspire|comme|like|metaphor|metaphore)\b/.test(fold(subtitle))
    ? subject(subtitle, {primaryOnly: false}) : null;
  if (secondary) return [{...secondary, ruleIds: ['arts-subtitle-subject']}];
  // For opaque titles, require a subject declaration at the start of a summary.
  const lead = fold(metadata.abstract ?? metadata.description ?? '').slice(0, 420);
  const declaration = lead.match(/^(?:.{0,90}?)(?:ce (?:livre|volume|recueil|ouvrage)|cet (?:ouvrage|essai)|this (?:book|volume))\s+(?:est|presente|etudie|analyse|explore|retrace|propose|offre|examines|explores|presents)\b[^.!?]{0,250}/)?.[0];
  const evidence = declaration ? subject(declaration) : null;
  if (evidence) return [{...evidence, ruleIds: ['arts-summary-subject']}];
  const summarySignals = [
    ['cinema|cinematograph\\w*|cineaste\\w*|realisateur\\w*|films?|movies?', 'Cinéma et spectacle', ['Cinéma']],
    ['musiqu\\w*|music\\w*|chanteur\\w*|chanteuse\\w*|rappeur\\w*|compositeur\\w*|albums?', 'Musique'],
    ['peintre\\w*|painter\\w*|peinture\\w*|paintings?|aquarell\\w*', 'Peinture'],
    ['photograph\\w*|fotograf\\w*|photojournal\\w*', 'Photographie'],
    ['architect\\w*|urbanis\\w*', 'Architecture et design'],
    ['musees?|museums?|museolog\\w*|museal\\w*', 'Patrimoine et musées'],
  ];
  const corroborated = summarySignals.filter(([pattern]) => (lead.match(new RegExp(`\\b(?:${pattern})\\b`, 'g')) ?? []).length >= 2);
  if (corroborated.length === 1) {
    const [, subcategory, details] = corroborated[0];
    return [{family: 'Art / Culture', subcategory, ...(details ? {details} : {}), ruleIds: ['arts-summary-corroborated']}];
  }
  return [{family: 'Art / Culture', subcategory: 'À classer', ruleIds: ['arts-unresolved']}];
}
