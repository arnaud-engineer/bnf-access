import {identifyDebridage, prepareDebridage, debridageDateHint, suggestedDebridageWords} from "../modules/debridage.mjs?v=2026-10-02-recommended";
import {applyLogoAppearance} from "../logo-appearance.js";
import {europresseTitleWords, prepareEuropresseRefinedTextSearch} from "../modules/europresse-auto.mjs";

const params = new URLSearchParams(window.location.search);
const originalUrl = params.get("from") || "";
const query = params.get("q") || "";
const keywords = params.get("keywords") || "";
const source = params.get("source") || "";
const sourceCode = params.get("sourceCode") || "";
const criteriaId = params.get("criteriaId") || "";
const criteriaLabel = params.get("criteriaLabel") || "";
const sourceCount = params.get("sourceCount") || "";
const confidence = params.get("confidence") || "generic";
const bnfProxyLoginUrl = "https://bnf.idm.oclc.org/login";
const europresseEntrypointUrl = "https://nouveau.europresse.com/access/ip/default.aspx?un=D000067U_1";

const resource = document.querySelector("#europresseSearchResource");
const pageTitle = document.querySelector("#europresseSearchTitle");
const status = document.querySelector("#europresseSearchStatus");
const machineQueryOutput = document.querySelector("#europresseSearchMachineQuery");
const queryOutput = document.querySelector("#europresseSearchQuery");
const sourceOutput = document.querySelector("#europresseSearchSource");
const criteriaBlock = document.querySelector("#europresseSearchCriteriaBlock");
const criteriaOutput = document.querySelector("#europresseSearchCriteria");
const submitButton = document.querySelector("#submitSearch");
const copyButton = document.querySelector("#copySearch");
const alternativeBlock = document.querySelector("#europresseSearchAlternative");
const alternativeQueryOutput = document.querySelector("#europresseSearchAlternativeQuery");
const copyKeywordButton = document.querySelector("#copyKeywordSearch");
const manualCopyStatus = document.querySelector("#manualCopyStatus");
let manualQuery = query;
let manualUsesTitleWords = !query;

function init() {
  initAutomaticSearch();
  renderJournalIdentity();
  const identified = identifyDebridage(originalUrl);
  pageTitle.textContent = identified?.name || source || "Recherche Europresse";
  resource.textContent = "Consulter via Europresse";
  if (query) {
    const title = document.querySelector("#articleTitle");
    title.textContent = humanizeSearchQuery(query);
    title.setAttribute("aria-label", "Titre déduit du lien");
    title.hidden = false;
  }
  if (!query) {
    const prepared = prepareDebridage(originalUrl);
    status.textContent = prepared.state === "ready" ? "Le lien est reconnu. Vous pouvez essayer l'accès automatique."
      : prepared.state === "needs-words" ? "Le lien ne contient pas le titre. Renseignez ses mots distinctifs dans les paramètres de recherche."
      : prepared.state === "needs-date" ? "Renseignez la date de publication dans les paramètres de recherche."
      : "Aucun terme exploitable n'a été trouvé dans ce lien.";
  }

  const sourceText = source || identified?.name || "Aucune source reconnue automatiquement";
  const confidenceText = getConfidenceText(confidence, sourceCount);
  const displayQuery = humanizeSearchQuery(query);
  const displayKeywords = humanizeSearchQuery(keywords || query);
  machineQueryOutput.textContent = buildMachineSearchQuery(manualQuery, manualUsesTitleWords);
  queryOutput.textContent = displayKeywords;
  sourceOutput.textContent = confidenceText ? `${sourceText} (${confidenceText})` : sourceText;
  renderCriteriaHint();
  renderKeywordFallback(displayKeywords, displayQuery);

  submitButton.addEventListener("click", openEuropresse);
  copyButton.addEventListener("click", copySearch);
  copyKeywordButton.addEventListener("click", copyKeywordSearch);
  if (query) status.textContent = "La présence de cet article dans Europresse reste à vérifier.";
}

function initAutomaticSearch() {
  const button = document.querySelector("#automaticSearch");
  const dateBlock = document.querySelector("#automaticDateBlock");
  const dateInput = document.querySelector("#automaticDate");
  const alternateDateInput = document.querySelector("#automaticAlternateDate");
  const publicationBlock = document.querySelector("#automaticPublicationBlock");
  const publicationInput = document.querySelector("#automaticPublication");
  const output = document.querySelector("#automaticStatus");
  const estimateButton = document.querySelector("#automaticDateEstimate");
  const alternativesBlock = document.querySelector("#automaticDateAlternativesBlock");
  const alternativesButton = document.querySelector("#automaticDateAlternatives");
  const alternativesStatus = document.querySelector("#automaticDateAlternativesStatus");
  const titleBlock = document.querySelector("#automaticTitleBlock");
  const titleWords = document.querySelector("#automaticTitleWords");
  const titleButton = document.querySelector("#automaticTitleSearch");
  const titleStatus = document.querySelector("#automaticTitleStatus");
  const refinementBlock = document.querySelector("#automaticRefinementBlock");
  const authorInput = document.querySelector("#automaticAuthor");
  const languageInput = document.querySelector("#automaticLanguage");
  const refinedButton = document.querySelector("#automaticRefinedSearch");
  const refinedStatus = document.querySelector("#automaticRefinementStatus");
  const profile = identifyDebridage(originalUrl);
  const panel = document.querySelector("#searchParameters");
  const methodOutput = document.querySelector("#automaticMethod");
  const connectionHelp = document.querySelector("#automaticConnectionHelp");
  let automaticAttempts = 0;
  document.querySelector("#restoreBnfAccess").href = buildSearchHomeUrl();
  document.querySelector("#manualRestoreBnfAccess").href = buildSearchHomeUrl();
  const dateHint = debridageDateHint(originalUrl);
  titleWords.value = profile?.requires_title_input ? "" : suggestedDebridageWords(keywords || query, profile);
  const titleOnly = profile?.methods[0] === "title-only";
  let usingEstimatedDate = false;
  publicationInput.replaceChildren(...(profile?.publications || []).map(choice => {
    const option = document.createElement("option");
    option.value = choice.code;
    option.textContent = choice.label;
    return option;
  }));
  publicationBlock.hidden = !profile?.publications?.length;
  dateBlock.hidden = profile?.enabled !== true || profile.date.type !== "input" || titleOnly;
  estimateButton.hidden = !dateHint || dateBlock.hidden;
  const options = () => ({date: dateInput.value, publication: publicationInput.value || undefined, words: titleWords.value, alternateDate: alternateDateInput.value});
  const refinedResult = () => prepareEuropresseRefinedTextSearch(originalUrl, titleWords.value, {
    author: authorInput.value, language: languageInput.value
  });
  function render() {
    manualQuery = humanizeSearchQuery(manualUsesTitleWords ? titleWords.value : query);
    machineQueryOutput.textContent = buildMachineSearchQuery(manualQuery, manualUsesTitleWords);
    submitButton.disabled = !manualQuery;
    copyButton.disabled = !manualQuery;
    manualCopyStatus.textContent = "";
    const result = prepareDebridage(originalUrl, options());
    const alternatives = prepareDebridage(originalUrl, {...options(), method: "date-alternatives"});
    const titleResult = titleOnly ? result : prepareDebridage(originalUrl, {...options(), method: "reference-title"});
    // Only the self-excluded title transport was tested with these extra criteria.
    refinementBlock.hidden = profile?.enabled !== true || !(titleOnly ||
      (profile?.title_fallback_without_reference && result.state === "ready" && result.method === "reference-title"));
    const refined = refinementBlock.hidden ? null : refinedResult();
    refinedButton.disabled = refined?.state !== "ready";
    refinedStatus.textContent = refined?.message || "";
    titleBlock.hidden = !titleOnly && !profile?.title_fallback_without_reference && !dateHint && result.state !== "ready";
    titleButton.hidden = titleOnly;
    button.disabled = result.state === "unsupported";
    titleButton.disabled = titleResult.state !== "ready";
    titleStatus.textContent = titleResult.message;
    alternativesBlock.hidden = alternatives.state !== "ready";
    alternativesStatus.textContent = alternatives?.message || "";
    methodOutput.textContent = (usingEstimatedDate ? "Date estimée depuis la création du lien, pas sa publication. " : "") + result.message + (profile?.limitations ? " " + profile.limitations : "");
    output.textContent = result.state === "ready"
      ? (titleOnly || result.method === "reference-title" ? "Recherche par titre, toutes dates et tous journaux. Vérifiez l'article ouvert." : "Accès expérimental prêt. Vérifiez l'article ouvert.")
      : result.state === "unsupported" ? result.message
      : "Un réglage est nécessaire dans les paramètres de recherche.";
    return result;
  }
  render();
  dateInput.addEventListener("input", () => { usingEstimatedDate = false; render(); });
  alternateDateInput.addEventListener("input", render);
  estimateButton.addEventListener("click", () => {
    if (!dateHint) return;
    dateInput.value = dateHint.date;
    usingEstimatedDate = true;
    render();
  });
  publicationInput.addEventListener("change", render);
  authorInput.addEventListener("input", render);
  languageInput.addEventListener("change", render);
  refinedButton.addEventListener("click", () => {
    if (refinementBlock.hidden) return;
    const result = refinedResult();
    if (result.state === "ready") openAutomaticResult(result);
  });
  titleWords.addEventListener("input", () => {
    manualUsesTitleWords = true;
    render();
  });
  titleButton.addEventListener("click", () => {
    const result = prepareDebridage(originalUrl, {...options(), method: "reference-title"});
    if (result.state === "ready") openAutomaticResult(result);
  });
  alternativesButton.addEventListener("click", () => {
    const result = prepareDebridage(originalUrl, {...options(), method: "date-alternatives"});
    if (result?.state === "ready") openAutomaticResult(result);
  });
  button.addEventListener("click", () => {
    const result = render();
    if (result.state === "ready") {
      openAutomaticResult(result);
    } else if (result.state === "needs-date" || result.state === "needs-words") {
      panel.open = true;
      (result.state === "needs-date" ? dateInput : titleWords).focus();
    }
  });
  function openAutomaticResult(result) {
    window.open(result.url, "_blank", "noopener,noreferrer");
    automaticAttempts += 1;
    button.textContent = "Réessayer la recherche V2";
    connectionHelp.hidden = false;
    if (automaticAttempts >= 2) {
      document.querySelector("#manualSearch").open = true;
      document.querySelector("#manualRecoveryNotice").hidden = false;
    }
  }
}

async function openEuropresse() {
  if (!manualQuery) {
    return;
  }
  // Open during the click: clipboard permission can outlast browser user activation.
  window.open(buildSearchHomeUrl(), "_blank", "noopener,noreferrer");
  const copied = await copySearch();
  manualCopyStatus.textContent = copied
    ? "Recherche copiée. Dans le nouvel onglet Europresse, collez-la dans le champ de recherche."
    : "Copie automatique impossible. Copiez le texte « Recherche à coller » ci-dessus, puis collez-le dans le nouvel onglet Europresse.";
}

function humanizeSearchQuery(value) {
  return value.replace(/\s+/g, " ").trim();
}

function buildMachineSearchQuery(value, distinctWords = false) {
  const cleanQuery = humanizeSearchQuery(value);
  if (distinctWords) {
    const terms = europresseTitleWords(cleanQuery);
    if (terms.length) return `TIT_HEAD=(${terms.map(term => `"${term}"`).join(" et ")})`;
  }
  return cleanQuery ? `TIT_HEAD="${escapeEuropresseQueryValue(cleanQuery)}"` : "";
}

function escapeEuropresseQueryValue(value) {
  return value.replace(/"/g, " ");
}

async function copySearch() {
  if (!manualQuery) {
    return false;
  }

  return copyPreparedSearch(buildMachineSearchQuery(manualQuery, manualUsesTitleWords), "Recherche copiée. Collez-la dans Europresse pour lancer la recherche.");
}

async function copyKeywordSearch() {
  const text = humanizeSearchQuery(keywords);

  if (!text) {
    return false;
  }

  return copyPreparedSearch(text, "Mots-clés copiés. Collez-les dans Europresse si la recherche par titre ne suffit pas.");
}

async function copyPreparedSearch(text, successMessage) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = successMessage;
      manualCopyStatus.textContent = successMessage;
      return true;
    } catch {
      // Local-network HTTP pages can be rejected by Clipboard API.
    }
  }

  if (copyTextWithSelection(text)) {
    status.textContent = successMessage;
    manualCopyStatus.textContent = successMessage;
    return true;
  }

  status.textContent = "Copie automatique impossible. Copiez vous-même le texte affiché sur cette page, puis collez-le dans Europresse.";
  manualCopyStatus.textContent = status.textContent;
  return false;
}

function copyTextWithSelection(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";

  document.body.append(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

function buildSearchHomeUrl() {
  return buildEuropresseUrl("/Search/Reading", {});
}

function buildEuropresseUrl(path, queryParams) {
  const finalUrl = new URL(path, "https://nouveau.europresse.com");

  Object.entries(queryParams).forEach(([key, value]) => {
    finalUrl.searchParams.set(key, value);
  });

  const returnUrl = `${finalUrl.pathname}${finalUrl.search}`;
  const accessUrl = `${europresseEntrypointUrl}&ReturnUrl=${encodeURIComponent(returnUrl)}`;
  const loginUrl = new URL(bnfProxyLoginUrl);
  loginUrl.searchParams.set("qurl", accessUrl);
  return loginUrl.href;
}

function getConfidenceText(value, count) {
  if (value === "known-domain") {
    return "domaine connu";
  }

  if (value === "known-domain-multiple") {
    return `${count} titres possibles`;
  }

  if (value === "inferred-domain") {
    return "domaine déduit";
  }

  if (value === "inferred-domain-multiple") {
    return `${count} titres possibles, déduction automatique`;
  }

  if (value === "verified-web-source") {
    return "source web Europresse vérifiée";
  }

  if (value === "verified-web-source-multiple") {
    return `${count} titres possibles, source web vérifiée`;
  }

  return "";
}

function renderCriteriaHint() {
  if (!criteriaId && !criteriaLabel) {
    return;
  }

  criteriaBlock.hidden = false;
  criteriaOutput.textContent = criteriaId && criteriaLabel
    ? `${criteriaLabel} (${criteriaId})`
    : criteriaLabel || criteriaId;
}

function renderKeywordFallback(displayKeywords, displayQuery) {
  if (!alternativeBlock || !alternativeQueryOutput || !copyKeywordButton || !keywords) {
    return;
  }

  if (displayKeywords.toLowerCase() === displayQuery.toLowerCase()) {
    return;
  }

  alternativeBlock.hidden = false;
  alternativeQueryOutput.textContent = displayKeywords;
}

init();

async function renderJournalIdentity() {
  const profile = identifyDebridage(originalUrl);
  if (!profile) return;
  if (!profile.catalog_resource_id) return;
  try {
    const root = new URL("../../../", import.meta.url);
    const catalogs = await Promise.all(["catalog-core.json", "catalog-press.json"].map(async file => {
      const response = await fetch(new URL("data/" + file, root));
      if (!response.ok) throw new Error("Catalogue indisponible");
      return response.json();
    }));
    const journal = catalogs.flatMap(c => c.resources || []).find(r => r.id === profile.catalog_resource_id);
    if (!journal?.icon_url) return;
    const icon = new URL(journal.icon_url, root);
    if (icon.origin !== window.location.origin || !icon.pathname.startsWith(root.pathname + "assets/logos/")) return;
    const platformIcon = new URL(document.querySelector(".debridage-identity > span:first-child img").src);
    if (icon.pathname === platformIcon.pathname) return;
    const tile = document.querySelector("#journalLogo");
    const image = document.createElement("img");
    image.src = icon.href;
    image.alt = profile.name;
    image.addEventListener("error", () => { tile.hidden = true; document.querySelector("#journalSeparator").hidden = true; });
    const appearance = {...journal};
    if (appearance.icon_background_image) {
      const background = new URL(appearance.icon_background_image, root);
      appearance.icon_background_image = background.origin === icon.origin && background.pathname.startsWith(root.pathname + "assets/logos/") ? background.href : "";
    }
    tile.classList.toggle("icon-no-padding", journal.icon_no_padding === true);
    applyLogoAppearance(tile, appearance);
    tile.replaceChildren(image);
    tile.hidden = false;
    document.querySelector("#journalSeparator").hidden = false;
  } catch {
    // The identified name remains available if the optional catalogue image cannot load.
  }
}
