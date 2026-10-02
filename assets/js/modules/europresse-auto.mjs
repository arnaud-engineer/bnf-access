import { sha1 } from "../vendor/europresse-sha1.mjs";

function publicationDate(value) {
  if (typeof value !== "string") return "";
  const iso = value.length === 8
    ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}` : value;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso) || iso.startsWith("0000-")) return "";
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === iso
    ? iso.replaceAll("-", "") : "";
}

function eddKey(source, day, code, prefix) {
  const canonical = source.origin + source.pathname;
  const digest = Array.from(sha1(new TextEncoder().encode(canonical)), byte =>
    byte.toString(16).padStart(2, "0")).join("");
  return `news\u00b7${day}\u00b7${code}\u00b7edd\u00d7c${prefix}\u00d7c${day}\u00d7c${digest}`;
}

// UUIDv1 records creation time, not publication time. This is only an opt-in hint.
export function suggestEuropresseDate(value) {
  let source;
  try { source = new URL(value); } catch { return null; }
  if (source.protocol !== "https:" || source.username || source.password || source.port ||
      source.hostname !== "www.ouest-france.fr") return null;
  const match = source.pathname.match(/-([a-f0-9]{8})-([a-f0-9]{4})-1([a-f0-9]{3})-[89ab][a-f0-9]{3}-[a-f0-9]{12}\/?$/);
  if (!match) return null;
  const ticks = (BigInt(`0x${match[3]}`) << 48n) |
    (BigInt(`0x${match[2]}`) << 32n) | BigInt(`0x${match[1]}`);
  const created = new Date(Number((ticks - 122192928000000000n) / 10000n));
  if (!Number.isFinite(created.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(created);
  const field = type => parts.find(part => part.type === type)?.value;
  const date = `${field("year")}-${field("month")}-${field("day")}`;
  if (!publicationDate(date)) return null;
  return { date, createdAt: created.toISOString(), basis: "uuid-v1-creation", confidence: "experimental" };
}

export function prepareEuropresseDateAlternatives(value, date, publication = "OFW", alternateDate = "") {
  const hint = suggestEuropresseDate(value);
  if (typeof date !== "string" || !publicationDate(date) || typeof alternateDate !== "string") return null;
  const otherDate = alternateDate || hint?.date;
  if (!otherDate || !publicationDate(otherDate)) return null;
  const primary = prepareEuropresseAutomatic(value, date, publication);
  const alternative = prepareEuropresseAutomatic(value, otherDate, publication);
  if (primary.state !== "ready" || alternative.state !== "ready" ||
      primary.key === alternative.key) return null;
  // The official Link route prepends NODOC= to this bounded equation (E142).
  const equation = `${primary.key} | NODOC= ${alternative.key}`;
  const login = new URL("https://bnf.idm.oclc.org/login");
  login.searchParams.set("qurl", `https://nouveau.europresse.com/Link/D000067U_1/${encodeURIComponent(equation)}`);
  const days = [publicationDate(date), publicationDate(otherDate)];
  const labels = days.map(day => `${day.slice(6, 8)}/${day.slice(4, 6)}/${day.slice(0, 4)}`);
  return {
    state: "ready", url: login.href, keys: [primary.key, alternative.key],
    dates: days,
    message: `Dates essayées : ${labels[0]} (renseignée) et ${labels[1]} (${alternateDate ? "autre date renseignée" : "création du lien"}). Europresse peut ouvrir le premier résultat ; vérifiez le titre, la publication et la date.`
  };
}

export function europresseTitleWords(value) {
  if (typeof value !== "string") return [];
  const seen = new Set();
  return (value.normalize("NFC").match(/[\p{L}\p{N}]+/gu) || []).filter(word => {
    const comparable = word.toLocaleLowerCase("fr");
    if (word.length < 3 || seen.has(comparable)) return false;
    seen.add(comparable);
    return true;
  });
}

// E154: this known reference minus itself is empty, even when the document exists.
const textSearchCarrier = "news\u00b720260924\u00b7ERP\u00b7f2d528e562e847a5bbeb585bf9c603ce";

export function prepareEuropresseTextSearch(value, words) {
  let source;
  try { source = new URL(value); } catch {
    return { state: "unsupported", message: "Lien absent ou invalide." };
  }
  if (source.protocol !== "https:" || source.username || source.password || source.port) {
    return { state: "unsupported", message: "Un lien public HTTPS sans identifiants est requis." };
  }
  const monde = source.hostname === "www.lemonde.fr";
  const est = source.hostname === "www.estrepublicain.fr";
  const match = monde
    ? source.pathname.match(/^\/[a-z0-9-]+\/article\/(\d{4})\/(\d{2})\/(\d{2})\/[a-z0-9-]+_\d{1,10}_\d{1,10}\.html$/)
    : est ? source.pathname.match(/^\/[a-z0-9-]+\/(\d{4})\/(\d{2})\/(\d{2})\/[a-z0-9-]+$/) : null;
  if (!match || !publicationDate(`${match[1]}${match[2]}${match[3]}`)) {
    return { state: "unsupported", message: "Ce format n'est pas qualifié pour la recherche textuelle sans référence." };
  }
  const terms = europresseTitleWords(words);
  if (terms.length < 2 || terms.length > 8 || terms.some(term => term.length > 60)) {
    return { state: "needs-words", message: "Choisissez de 2 à 8 mots distinctifs du titre." };
  }
  const titleQuery = `TIT_HEAD=(${terms.map(term => `"${term}"`).join(" et ")})`;
  const equation = `${textSearchCarrier} sans NODOC= ${textSearchCarrier} | ${titleQuery}`;
  // E158: leave a margin below the observed long-path rejection; never trim terms silently.
  if ((`/Link/D000067U_1/${equation}`).length > 240) {
    return { state: "needs-words", message: "Cette recherche est trop longue pour le lien Europresse. Gardez moins de mots distinctifs du titre." };
  }
  const login = new URL("https://bnf.idm.oclc.org/login");
  login.searchParams.set("qurl", `https://nouveau.europresse.com/Link/D000067U_1/${encodeURIComponent(equation)}`);
  const caution = monde
    ? "Le résultat peut provenir du Monde ou de La Matinale du Monde."
    : "Le fonds papier peut avoir un titre raccourci, une date différente et un délai de disponibilité.";
  return {
    state: "ready", method: "title-only", url: login.href, terms, titleQuery,
    message: `Recherche par titre, sans date ni référence de l'article, toutes dates et tous journaux. ${caution} Europresse peut ouvrir un article voisin : vérifiez le titre, la publication et la date.`
  };
}

// E146: textual 'et' is accepted through Link; a literal '&' was not qualified.
export function prepareEuropresseTitleFallback(value, words, date = "", publication = "OFW") {
  if (typeof date !== "string") return { state: "needs-date", message: "Date renseignée invalide." };
  const terms = europresseTitleWords(words);
  if (terms.length < 2 || terms.length > 8 || terms.some(term => term.length > 60)) {
    return { state: "needs-words", message: "Choisissez de 2 à 8 mots distinctifs du titre." };
  }
  const hint = suggestEuropresseDate(value);
  const candidateDate = date || hint?.date || "";
  const candidate = prepareEuropresseAutomatic(value, candidateDate, publication);
  if (candidate.state !== "ready") return {
    state: candidate.state,
    message: "Un candidat de référence qualifié est nécessaire pour cet essai par titre. " + candidate.message
  };
  const titleQuery = `TIT_HEAD=(${terms.map(term => `"${term}"`).join(" et ")})`;
  const equation = `${candidate.key} | ${titleQuery}`;
  const login = new URL("https://bnf.idm.oclc.org/login");
  login.searchParams.set("qurl", `https://nouveau.europresse.com/Link/D000067U_1/${encodeURIComponent(equation)}`);
  return {
    state: "ready", url: login.href, terms, titleQuery, candidateKey: candidate.key,
    usesCreationHint: !date && Boolean(hint),
    message: "Essai par titre prêt, toutes dates et tous journaux, même si une publication est choisie. Europresse peut ouvrir un article voisin ou d'un autre journal : vérifiez le titre, la publication et la date."
  };
}

// Only URL formats checked in the R&D journal are used. A candidate is not proof of availability.
export function prepareEuropresseAutomatic(value, date = "", publication = "OFW") {
  let source;
  try { source = new URL(value); } catch {
    return { state: "unsupported", message: "Le lien d'origine est absent ou invalide. Utilisez la recherche manuelle." };
  }
  if (source.protocol !== "https:" || source.username || source.password || source.port) {
    return { state: "unsupported", message: "Un lien public HTTPS sans identifiants est requis." };
  }
  let key;
  let method;
  if (source.hostname === "www.liberation.fr") {
    const match = source.pathname.match(/-(\d{8})_([A-Z2-7]{26})\/$/);
    if (match && publicationDate(match[1])) {
      key = `news\u00b7${match[1]}\u00b7LIF\u00b70${match[2].toLowerCase()}`;
      method = "Libération : date et référence extraites du lien.";
    }
  } else if (source.hostname === "www.monde-diplomatique.fr") {
    const match = source.pathname.match(/^\/(\d{4})\/(\d{2})\/[A-Z][A-Z0-9_-]*\/(\d{1,8})\/?$/);
    if (match && publicationDate(`${match[1]}${match[2]}01`)) {
      key = `news\u00b7${match[1]}${match[2]}01\u00b7MD\u00b7${match[3]}`;
      method = "Le Monde diplomatique : numéro mensuel et référence extraits du lien. Édition papier Europresse.";
    }
  } else if (source.hostname === "www.nouvelobs.com") {
    const match = source.pathname.match(/^\/[a-z0-9-]+\/(\d{8})\.OBS(\d{1,9})\/[a-z0-9-]+\.html$/);
    if (match && publicationDate(match[1])) {
      const day = match[1];
      key = `news\u00b7${day}\u00b7OA\u00b7edd\u00d7cnoco\u00d7c${day}\u00d7c${day}obs${match[2]}`;
      method = "Le Nouvel Obs : date et numéro extraits du lien. Référence web expérimentale.";
    }
  } else if (source.hostname === "www.ouest-france.fr") {
    const match = source.pathname.match(/-([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\/?$/);
    if (match) {
      const labels = { OFW: "Ouest-France", OOW: "Presse Océan", OCW: "Le Courrier de l'Ouest" };
      const label = Object.hasOwn(labels, publication) ? labels[publication] : "";
      if (!label) return {
        state: "unsupported", message: "Cette publication partenaire n'est pas encore couverte par l'essai automatique."
      };
      if (!publicationDate(date)) return {
        state: "needs-date", message: `${label} : renseignez la date de publication et vérifiez la publication choisie. Les autres titres partenaires ne sont pas couverts.`
      };
      key = `news\u00b7${publicationDate(date)}\u00b7${publication}\u00b7${match[1]}`;
      method = `${label} : référence du lien, publication choisie et date renseignée. Correspondance expérimentale; disponibilité à vérifier dans Europresse.`;
    }
  } else if (source.hostname === "www.challenges.fr") {
    const match = source.pathname.match(/^\/[a-z0-9/-]+_(\d{1,9})\/?$/);
    if (match) {
      if (!publicationDate(date)) return {
        state: "needs-date", message: "Challenges : renseignez la date de publication de l'article pour essayer l'accès direct."
      };
      key = `news\u00b7${publicationDate(date)}\u00b7OHW\u00b7${match[1]}`;
      method = "Challenges : numéro du lien et date renseignée. Correspondance expérimentale.";
    }
  } else if (source.hostname === "www.ladepeche.fr") {
    const match = source.pathname.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\/[a-z0-9-]+-\d{1,10}\.php$/);
    const day = match ? publicationDate(`${match[1]}${match[2]}${match[3]}`) : "";
    if (day) {
      key = eddKey(source, day, "ABBQ", "dmfr");
      method = "La Dépêche : date du lien et empreinte de l'URL publique. Correspondance web expérimentale.";
    }
  } else if (source.hostname === "www.lindependant.fr") {
    const match = source.pathname.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\/[a-z0-9-]+-\d{1,10}\.php$/);
    const day = match ? publicationDate(`${match[1]}${match[2]}${match[3]}`) : "";
    if (day) {
      key = eddKey(source, day, "MNE", "infr");
      method = "L'Indépendant : date du lien et empreinte de l'URL publique. Correspondance web expérimentale.";
    }
  } else if (source.hostname === "www.lavoixdunord.fr") {
    const match = source.pathname.match(/^\/\d{1,10}\/article\/(\d{4}-\d{2}-\d{2})\/[a-z0-9-]+$/);
    const day = match ? publicationDate(match[1]) : "";
    if (day) {
      key = eddKey(source, day, "VWN", "vnfr");
      method = "La Voix du Nord : date du lien et empreinte de l'URL publique. Correspondance web expérimentale.";
    }
  } else if (source.hostname === "www.courrier-picard.fr") {
    const match = source.pathname.match(/^\/id\d{1,10}\/article\/(\d{4}-\d{2}-\d{2})\/[a-z0-9-]+$/);
    const day = match ? publicationDate(match[1]) : "";
    if (day) {
      key = eddKey(source, day, "VWC", "cpif");
      method = "Courrier Picard : date du lien et empreinte de l'URL publique. Correspondance web expérimentale.";
    }
  } else if (source.hostname === "www.aisnenouvelle.fr") {
    const match = source.pathname.match(/^\/id\d{1,10}\/article\/(\d{4}-\d{2}-\d{2})\/[a-z0-9-]+$/);
    const day = match ? publicationDate(match[1]) : "";
    if (day) {
      key = eddKey(source, day, "AASC", "hw22");
      method = "L'Aisne nouvelle : date du lien et empreinte de l'URL publique. Correspondance web expérimentale.";
    }
  } else if (source.hostname === "www.lardennais.fr") {
    const match = source.pathname.match(/^\/id\d{1,10}\/article\/(\d{4}-\d{2}-\d{2})\/[a-z0-9-]+$/);
    const day = match ? publicationDate(match[1]) : "";
    if (day) {
      key = eddKey(source, day, "AASG", "adnw");
      method = "L'Ardennais : date du lien et empreinte de l'URL publique. Correspondance web expérimentale.";
    }
  } else if (source.hostname === "www.lest-eclair.fr") {
    const match = source.pathname.match(/^\/id\d{1,10}\/article\/(\d{4}-\d{2}-\d{2})\/[a-z0-9-]+$/);
    const day = match ? publicationDate(match[1]) : "";
    if (day) {
      key = eddKey(source, day, "AASD", "ewec");
      method = "L'Est éclair : date du lien et empreinte de l'URL publique. Correspondance web expérimentale.";
    }
  } else if (source.hostname === "www.lemessager.fr") {
    const match = source.pathname.match(/^\/\d{1,10}\/article\/(\d{4}-\d{2}-\d{2})\/[a-z0-9-]+$/);
    const day = match ? publicationDate(match[1]) : "";
    if (day) {
      key = eddKey(source, day, "AJK", "hw27");
      method = "Le Messager : date du lien et empreinte de l'URL publique. Correspondance web expérimentale.";
    }
  } else if (source.hostname === "www.nordlittoral.fr") {
    const match = source.pathname.match(/^\/\d{1,10}\/article\/(\d{4}-\d{2}-\d{2})\/[a-z0-9-]+$/);
    const day = match ? publicationDate(match[1]) : "";
    if (day) {
      key = eddKey(source, day, "VWL", "nlfr");
      method = "Nord Littoral : date du lien et empreinte de l'URL publique. Correspondance web expérimentale.";
    }
  } else if (source.hostname === "www.nicematin.com") {
    if (/^\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+-\d{1,9}$/.test(source.pathname)) {
      if (!publicationDate(date)) return {
        state: "needs-date", message: "Nice-Matin : renseignez la date de publication de l'article pour essayer l'accès direct."
      };
      key = eddKey(source, publicationDate(date), "ABAX", "nmfr");
      method = "Nice-Matin : date renseignée et empreinte du lien public, édition web. Les anciens liens Var-Matin doivent être résolus séparément.";
    }
  } else if (source.hostname === "www.lavie.fr") {
    if (/^\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+-\d{1,9}\.php$/.test(source.pathname)) {
      if (!publicationDate(date)) return {
        state: "needs-date", message: "La Vie : renseignez la date de publication de l'article pour essayer l'accès direct."
      };
      key = eddKey(source, publicationDate(date), "AABY", "mviw");
      method = "La Vie : date renseignée et empreinte du lien public. Correspondance web expérimentale.";
    }
  } else if (source.hostname === "www.huffingtonpost.fr") {
    if (/^\/[a-z0-9-]+\/article\/[a-z0-9-]+_\d{1,9}\.html$/.test(source.pathname)) {
      if (!publicationDate(date)) return {
        state: "needs-date", message: "HuffPost France : renseignez la date de publication de l'article pour essayer l'accès direct."
      };
      key = eddKey(source, publicationDate(date), "HUF", "hufp");
      method = "HuffPost France : date renseignée et empreinte du lien public. Conversion testée sur des articles gratuits; disponibilité et intégralité à vérifier.";
    }
  } else if (source.hostname === "www.courrierinternational.com") {
    if (/^\/article\/[a-z0-9-]+_\d{1,9}$/.test(source.pathname)) {
      if (!publicationDate(date)) return {
        state: "needs-date", message: "Courrier International : renseignez la date de publication de l'article pour essayer l'accès direct."
      };
      key = eddKey(source, publicationDate(date), "ILW", "coco");
      method = "Courrier International : empreinte de l'URL publique et date renseignée. Correspondance web expérimentale.";
    }
  } else if (source.hostname === "www.charentelibre.fr") {
    if (/^\/[a-z0-9/-]+-\d{1,10}\.php$/.test(source.pathname)) {
      if (!publicationDate(date)) return {
        state: "needs-date", message: "Charente Libre : renseignez la date de publication de l'article pour essayer l'accès direct."
      };
      key = eddKey(source, publicationDate(date), "AARU", "chfr");
      method = "Charente Libre : empreinte de l'URL publique et date renseignée. Correspondance web expérimentale.";
    }
  } else if (source.hostname === "www.dordognelibre.fr") {
    if (/^\/[a-z0-9/-]+-\d{1,10}\.php$/.test(source.pathname)) {
      if (!publicationDate(date)) return {
        state: "needs-date", message: "Dordogne Libre : renseignez la date de publication initiale, pas celle de mise à jour, pour essayer l'accès direct."
      };
      key = eddKey(source, publicationDate(date), "AAAD", "dofr");
      method = "Dordogne Libre : empreinte de l'URL et date de publication initiale. Correspondance expérimentale; le titre peut avoir changé depuis l'archivage.";
    }
  } else if (source.hostname === "www.larepubliquedespyrenees.fr") {
    if (/^\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+-\d{1,10}\.php$/.test(source.pathname)) {
      if (!publicationDate(date)) return {
        state: "needs-date", message: "La République des Pyrénées : renseignez la date de publication de l'article pour essayer l'accès direct."
      };
      key = eddKey(source, publicationDate(date), "RDP", "pywe");
      method = "La République des Pyrénées : date renseignée et empreinte du lien public, édition web. Certains articles récents testés ne sont pas disponibles.";
    }
  } else if (source.hostname === "www.sudouest.fr") {
    if (/^\/[a-z0-9/-]+-\d{1,10}\.php$/.test(source.pathname)) {
      if (!publicationDate(date)) return {
        state: "needs-date", message: "Sud Ouest : renseignez la date de publication de l'article pour essayer l'accès direct."
      };
      key = eddKey(source, publicationDate(date), "SOE", "sofr");
      method = "Sud Ouest : empreinte de l'URL publique et date renseignée. Correspondance web expérimentale.";
    }
  } else if (source.hostname === "www.telerama.fr") {
    if (/^\/[a-z0-9-]+\/[a-z0-9-]+-\d{1,10}\.php$/.test(source.pathname)) {
      if (!publicationDate(date)) return {
        state: "needs-date", message: "Télérama : renseignez la date de publication de l'article pour essayer l'accès direct."
      };
      key = eddKey(source, publicationDate(date), "TAW", "trfr");
      method = "Télérama : empreinte de l'URL publique et date renseignée. Correspondance web expérimentale; critiques non couvertes.";
    }
  } else if (source.hostname === "www.lexpress.fr") {
    const match = source.pathname.match(/^\/[a-z0-9/-]+-([A-Z2-7]{26})\/$/);
    if (match) {
      if (!publicationDate(date)) return {
        state: "needs-date", message: "L'Express : renseignez la date de publication de l'article pour essayer l'accès direct."
      };
      key = `news\u00b7${publicationDate(date)}\u00b7EWL\u00b7${match[1].toLowerCase()}`;
      method = "L'Express : référence du lien et date renseignée. Correspondance web expérimentale.";
    }
  } else if (source.hostname === "www.greenunivers.com") {
    const match = source.pathname.match(/^\/(\d{4})\/(\d{2})\/[a-z0-9-]+-(\d{1,9})\/$/);
    if (match && publicationDate(`${match[1]}${match[2]}01`)) {
      const day = publicationDate(date);
      if (!day || !day.startsWith(match[1] + match[2])) return {
        state: "needs-date", message: "GreenUnivers : renseignez la date de publication dans le mois indiqué par le lien. Les articles récents peuvent ne pas être encore disponibles."
      };
      key = `news\u00b7${day}\u00b7GRE\u00b7${match[3]}`;
      method = "GreenUnivers : numéro du lien et date renseignée. Correspondance web expérimentale; les articles récents peuvent ne pas être encore disponibles.";
    }
  } else if (source.hostname === "www.auto-infos.fr") {
    const match = source.pathname.match(/^\/article\/[a-z0-9-]+\.(\d{1,9})$/);
    if (match) {
      if (!publicationDate(date)) return {
        state: "needs-date", message: "Auto Infos : renseignez la date de publication de l'article pour essayer l'accès direct."
      };
      key = `news\u00b7${publicationDate(date)}\u00b7GAAD\u00b7${match[1]}`;
      method = "Auto Infos : numéro du lien et date renseignée. Correspondance web expérimentale.";
    }
  } else if (source.hostname === "www.ft.com") {
    const match = source.pathname.match(/^\/content\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/);
    if (match) {
      if (!publicationDate(date)) return {
        state: "needs-date", message: "Financial Times : renseignez la date de publication. Les articles récents peuvent ne pas être encore disponibles dans Europresse."
      };
      key = `news\u00b7${publicationDate(date)}\u00b7GE\u00b7${match[1]}`;
      method = "Financial Times : référence du lien et date renseignée. Correspondance web expérimentale; les articles récents peuvent ne pas être encore disponibles.";
    }
  } else if (source.hostname === "www.usinenouvelle.com") {
    const match = source.pathname.match(/^\/[a-z0-9/-]+\.([A-Z2-7]{26})\.html$/);
    if (match) {
      if (!publicationDate(date)) return {
        state: "needs-date", message: "L'Usine Nouvelle : renseignez la date de publication de l'article pour essayer l'accès direct."
      };
      key = `news\u00b7${publicationDate(date)}\u00b7GUNB\u00b7${match[1].toLowerCase()}`;
      method = "L'Usine Nouvelle : référence du lien et date renseignée. Correspondance web expérimentale; anciennes URL non couvertes.";
    }
  } else if (source.hostname === "www.lsa-conso.fr") {
    const match = source.pathname.match(/^\/[a-z0-9/-]+\.([A-Z2-7]{26})\.html$/);
    if (match) {
      if (!publicationDate(date)) return {
        state: "needs-date", message: "LSA : renseignez la date de publication de l'article pour essayer l'accès direct."
      };
      key = `news\u00b7${publicationDate(date)}\u00b7GLSB\u00b7${match[1].toLowerCase()}`;
      method = "LSA : référence du lien et date renseignée. Correspondance web expérimentale; les articles récents peuvent ne pas être encore disponibles.";
    }
  } else if (source.hostname === "www.lepoint.fr") {
    const match = source.pathname.match(/-([A-Z2-7]{26})\/$/);
    if (match) {
      if (!publicationDate(date)) return {
        state: "needs-date", message: "Le Point : renseignez la date de publication de l'article pour essayer l'accès direct."
      };
      key = `news\u00b7${publicationDate(date)}\u00b7POR\u00b7${match[1].toLowerCase()}`;
      method = "Le Point : référence du lien et date renseignée. Correspondance expérimentale.";
    }
  }
  if (!key) return {
    state: "unsupported",
    message: "Ce lien ne permet pas encore de construire un accès automatique fiable. La recherche par copier-coller reste disponible ci-dessous."
  };
  const destination = `https://nouveau.europresse.com/Link/D000067U_1/${encodeURIComponent(key)}`;
  const login = new URL("https://bnf.idm.oclc.org/login");
  login.searchParams.set("qurl", destination);
  return { state: "ready", key, url: login.href, message: method };
}
