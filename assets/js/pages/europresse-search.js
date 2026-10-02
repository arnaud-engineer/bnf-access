import { prepareEuropresseAutomatic, suggestEuropresseDate, prepareEuropresseDateAlternatives, europresseTitleWords, prepareEuropresseTitleFallback, prepareEuropresseTextSearch } from "../modules/europresse-auto.mjs?v=2026-10-02-auto-v15";

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

function init() {
  initAutomaticSearch();
  if (!query) {
    status.textContent = "Aucun terme exploitable n'a été trouvé dans ce lien.";
    submitButton.disabled = true;
    copyButton.disabled = true;
    return;
  }

  const sourceText = source || "Aucune source reconnue automatiquement";
  const confidenceText = getConfidenceText(confidence, sourceCount);
  const displayQuery = humanizeSearchQuery(query);
  const displayKeywords = humanizeSearchQuery(keywords || query);
  const machineQuery = buildMachineSearchQuery(query);

  resource.textContent = source ? `${sourceText} - recherche dans Europresse` : "Recherche large dans Europresse";
  machineQueryOutput.textContent = machineQuery;
  queryOutput.textContent = displayKeywords;
  sourceOutput.textContent = confidenceText ? `${sourceText} (${confidenceText})` : sourceText;
  renderCriteriaHint();
  renderKeywordFallback(displayKeywords, displayQuery);

  submitButton.addEventListener("click", openEuropresse);
  copyButton.addEventListener("click", copySearch);
  copyKeywordButton.addEventListener("click", copyKeywordSearch);
  status.textContent = "Recherche prête. Cliquez sur le bouton ci-dessous quand vous avez lu les consignes.";
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
  const dateHint = suggestEuropresseDate(originalUrl);
  titleWords.value = europresseTitleWords(keywords || query).slice(0, 6).join(" ");
  const titleOnly = prepareEuropresseTextSearch(originalUrl, titleWords.value).state !== "unsupported";
  let usingEstimatedDate = false;
  let sharedPublication = false;
  try { sharedPublication = new URL(originalUrl).hostname === "www.ouest-france.fr"; } catch {}
  publicationBlock.hidden = !sharedPublication;
  dateBlock.hidden = prepareEuropresseAutomatic(originalUrl).state !== "needs-date";
  estimateButton.hidden = !dateHint || dateBlock.hidden;
  function render() {
    const result = titleOnly ? prepareEuropresseTextSearch(originalUrl, titleWords.value)
      : prepareEuropresseAutomatic(originalUrl, dateInput.value, publicationInput.value);
    const alternatives = prepareEuropresseDateAlternatives(originalUrl, dateInput.value, publicationInput.value, alternateDateInput.value);
    const titleResult = titleOnly ? result
      : prepareEuropresseTitleFallback(originalUrl, titleWords.value, dateInput.value, publicationInput.value);
    titleBlock.hidden = !titleOnly && !dateHint && result.state !== "ready";
    titleButton.hidden = titleOnly;
    button.disabled = titleOnly && result.state !== "ready";
    titleButton.disabled = titleResult.state !== "ready";
    titleStatus.textContent = titleResult.message;
    alternativesBlock.hidden = !alternatives;
    alternativesStatus.textContent = alternatives?.message || "";
    output.textContent = titleOnly ? "Essai par titre : choisissez les mots du sujet qui peuvent rester dans la version papier. Aucun collage dans Europresse ni date à renseigner."
      : usingEstimatedDate
      ? `Date estimée depuis la création du lien, pas sa publication. Si l'essai échoue, corrigez la date ou utilisez la recherche manuelle. ${result.message}`
      : result.message;
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
  titleWords.addEventListener("input", render);
  titleButton.addEventListener("click", () => {
    const result = prepareEuropresseTitleFallback(originalUrl, titleWords.value, dateInput.value, publicationInput.value);
    if (result.state === "ready") window.location.assign(result.url);
  });
  alternativesButton.addEventListener("click", () => {
    const result = prepareEuropresseDateAlternatives(originalUrl, dateInput.value, publicationInput.value, alternateDateInput.value);
    if (result?.state === "ready") window.location.assign(result.url);
  });
  button.addEventListener("click", () => {
    const result = render();
    if (result.state === "ready") {
      window.location.assign(result.url);
    } else if (result.state === "needs-date") {
      dateInput.focus();
    }
  });
}

async function openEuropresse() {
  if (!query) {
    return;
  }

  const copied = await copySearch();
  status.textContent = copied
    ? "Recherche copiée. Ouverture d'Europresse..."
    : "Ouverture d'Europresse... Copiez la recherche affichée si elle n'est pas déjà dans votre presse-papiers.";
  window.location.assign(buildSearchHomeUrl());
}

function humanizeSearchQuery(value) {
  return value.replace(/\s+/g, " ").trim();
}

function buildMachineSearchQuery(value) {
  const cleanQuery = humanizeSearchQuery(value);
  return cleanQuery ? `TIT_HEAD="${escapeEuropresseQueryValue(cleanQuery)}"` : "";
}

function escapeEuropresseQueryValue(value) {
  return value.replace(/"/g, " ");
}

async function copySearch() {
  if (!query) {
    return false;
  }

  return copyPreparedSearch(buildMachineSearchQuery(query), "Recherche copiée. Collez-la dans Europresse pour lancer la recherche.");
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
      return true;
    } catch {
      // Local-network HTTP pages can be rejected by Clipboard API.
    }
  }

  if (copyTextWithSelection(text)) {
    status.textContent = successMessage;
    return true;
  }

  status.textContent = "Recherche prête. Copiez les mots affichés dans Europresse.";
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
