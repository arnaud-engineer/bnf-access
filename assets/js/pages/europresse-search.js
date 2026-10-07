import {identifyDebridage, prepareDebridage, debridageDateHint, debridageUrlOptions, debridageMethodLabel} from "../modules/debridage.mjs?v=profiles-levis-v1";
import {prepareAutomaticArticleSearch, prepareMetadataSearch} from "../modules/article-title-metadata.mjs?v=profiles-levis-v1";
import {applyLogoAppearance} from "../logo-appearance.js";
import {europresseLanguages, europresseManualTitleQuery, prepareEuropresseRefinedTextSearch, prepareEuropresseKeywordSearch} from "../modules/europresse-auto.mjs?v=profiles-levis-v1";

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
const copyKeywordButton = document.querySelector("#copyKeywordSearch");
const manualCopyStatus = document.querySelector("#manualCopyStatus");
let manualQuery = query;
let manualKeywords = humanizeSearchQuery(keywords || query);
let manualUsesTitleWords = !query;
let manualQueryOpened = false;
let manualKeywordsOpened = false;

function init() {
  initDialogs();
  initSearchHelp();
  initQueryCopy();
  initManualGuide();
  renderManualProgress();
  initAutomaticSearch();
  renderJournalIdentity();
  const identified = identifyDebridage(originalUrl);
  pageTitle.textContent = identified?.name || source || "Recherche Europresse";
  resource.textContent = "Consulter via Europresse";
  if (!query) {
    const derived = originalUrl ? debridageUrlOptions(originalUrl) : {};
    const prepared = prepareDebridage(originalUrl, derived);
    setPageStatus(prepared.state !== "ready" && identified?.enabled && !derived.words
      ? "La recherche automatique essaiera de récupérer le titre via Microlink."
      : prepared.state === "ready" ? ""
      : prepared.state === "needs-words" ? "Le lien ne contient pas le titre. Renseignez ses mots distinctifs dans les paramètres de recherche."
      : prepared.state === "needs-date" ? "Renseignez la date de publication dans les paramètres de recherche."
      : "Aucun terme exploitable n'a été trouvé dans ce lien.");
  }

  const sourceText = source || identified?.name || "Aucune source reconnue automatiquement";
  const confidenceText = getConfidenceText(confidence, sourceCount);
  sourceOutput.textContent = confidenceText ? `${sourceText} (${confidenceText})` : sourceText;
  renderCriteriaHint();

  submitButton.addEventListener("click", openEuropresse);
  copyButton.addEventListener("click", copySearch);
  copyKeywordButton.addEventListener("click", copyKeywordSearch);
  document.querySelector("#submitKeywordSearch").addEventListener("click", () => openEuropresse(true));
  document.querySelector("#openEuropresseOnly").addEventListener("click", () => {
    window.open(buildSearchHomeUrl(), "_blank", "noopener,noreferrer");
  });
}

function renderManualProgress() {
  const nextButton = !manualQueryOpened ? "submitSearch"
    : !manualKeywordsOpened ? "submitKeywordSearch" : "openEuropresseOnly";
  document.querySelectorAll(".europresse-manual-actions .resource-action").forEach(button => {
    button.classList.toggle("secondary", button.id !== nextButton);
  });
}

function initManualGuide() {
  for (const [id, label, key] of [
    ["manualGuide", "le mode d’emploi", "bnf-access:v2:europresse-manual-guide:v1"],
    ["manualSearchInfo", "les informations de recherche", "bnf-access:v2:europresse-manual-info:v1"]
  ]) {
    const guide = document.getElementById(id);
    try {
      const saved = localStorage.getItem(key);
      if (saved === "shown" || saved === "hidden") guide.open = saved === "shown";
    } catch {}
    const updateLabel = () => {
      guide.querySelector("summary").textContent = `${guide.open ? "Masquer" : "Afficher"} ${label}`;
    };
    updateLabel();
    guide.addEventListener("toggle", () => {
      updateLabel();
      try { localStorage.setItem(key, guide.open ? "shown" : "hidden"); } catch {}
    });
  }
}

function initSearchHelp() {
  const note = document.querySelector("#searchHelpNote");
  const buttons = [...document.querySelectorAll("[data-search-help]")];
  let activeButton;
  function closeHelp(restoreFocus = true) {
    note.hidden = true;
    note.classList.remove("is-visible");
    buttons.forEach(button => button.setAttribute("aria-expanded", "false"));
    if (restoreFocus) activeButton?.focus();
    activeButton = null;
  }
  buttons.forEach(button => button.addEventListener("click", () => {
    if (activeButton === button) { closeHelp(); return; }
    activeButton = button;
    document.querySelector("#searchHelpTitle").textContent = button.dataset.helpTitle;
    document.querySelector("#searchHelpDetails").replaceChildren(...button.dataset.searchHelp.split(" ").map(id => {
      const paragraph = document.createElement("p");
      paragraph.textContent = document.getElementById(id).textContent;
      return paragraph;
    }));
    buttons.forEach(other => other.setAttribute("aria-expanded", String(other === button)));
    note.hidden = false;
    note.classList.add("is-visible");
  }));
  document.querySelector("#closeSearchHelp").addEventListener("click", () => closeHelp());
  const dialog = document.querySelector("#searchParameters");
  dialog.addEventListener("cancel", event => {
    if (!note.hidden) { event.preventDefault(); closeHelp(); }
  });
  dialog.addEventListener("close", () => closeHelp(false));
}

function renderDisplayedQuery(value, field = document.querySelector("#articleTitle")) {
  const fragments = value.split(/(TIT_HEAD|=|"[^"]*")/g);
  field.replaceChildren(...fragments.map(fragment => {
    const tokenClass = fragment === "TIT_HEAD" ? "europresse-code-tag"
      : fragment === "=" ? "europresse-code-operator"
      : fragment.startsWith('"') ? "europresse-code-string" : "";
    if (!tokenClass) return document.createTextNode(fragment);
    const token = document.createElement("span");
    token.className = tokenClass;
    token.textContent = fragment;
    return token;
  }));
}

function initQueryCopy() {
  for (const [buttonId, feedbackId, copy] of [
    ["copyDisplayedQuery", "displayedQueryCopyStatus", copySearch],
    ["copyManualQuery", "manualQueryCopyStatus", copySearch],
    ["copyManualKeywords", "manualKeywordsCopyStatus", copyKeywordSearch]
  ]) initCopyFeedback(document.getElementById(buttonId), document.getElementById(feedbackId), copy);
}

function initCopyFeedback(button, feedback, copy) {
  let timer;
  button.addEventListener("click", async () => {
    clearTimeout(timer);
    feedback.textContent = "";
    if (await copy()) {
      feedback.textContent = "Copié";
      timer = setTimeout(() => { feedback.textContent = ""; }, 1600);
    }
  });
}

function setPageStatus(message) {
  status.textContent = message;
  status.hidden = !message;
}

function openDialog(dialog) {
  // Keep one search dialog open; native dialogs handle Escape and keyboard focus.
  document.querySelectorAll(".europresse-dialog[open]").forEach(other => {
    if (other !== dialog) other.close();
  });
  if (!dialog.open) dialog.showModal();
}

function initDialogs() {
  for (const [buttonId, dialogId] of [["openSearchParameters", "searchParameters"], ["openManualSearch", "manualSearch"]]) {
    const dialog = document.getElementById(dialogId);
    document.getElementById(buttonId).addEventListener("click", () => openDialog(dialog));
    dialog.addEventListener("close", () => {
      if (!document.querySelector(".europresse-dialog[open]")) document.getElementById(buttonId).focus();
    });
    dialog.querySelector("[data-close-dialog]").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
  }
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
  for (const [label, languages] of [["Langues courantes", europresseLanguages.slice(0, 5)], ["Autres langues", europresseLanguages.slice(5)]]) {
    const group = document.createElement("optgroup");
    group.label = label;
    group.append(...languages.map(([code, name]) => new Option(name, code)));
    languageInput.append(group);
  }
  const refinedButton = document.querySelector("#automaticRefinedSearch");
  const refinedStatus = document.querySelector("#automaticRefinementStatus");
  const profile = identifyDebridage(originalUrl);
  const panel = document.querySelector("#searchParameters");
  const methodOutput = document.querySelector("#automaticMethod");
  const connectionHelp = document.querySelector("#automaticConnectionHelp");
  const textualButton = document.querySelector("#textualSearch");
  const textualStatus = document.querySelector("#textualStatus");
  const firefoxHelp = document.querySelector("#textualFirefoxHelp");
  // Browser-specific guidance only; never change the search transport by user agent.
  firefoxHelp.hidden = !/(?:Firefox|FxiOS)\//.test(navigator.userAgent);
  if (!firefoxHelp.hidden) textualButton.setAttribute("aria-describedby", "textualStatus textualFirefoxHelp");
  let automaticAttempts = 0;
  let recoveredMetadata = null;
  let recoveringTitle = false;
  let rescueOnReturn = false;
  let openRescueOnReturn = false;
  let leftForTextualSearch = false;
  const retryHelp = document.querySelector("#automaticRetryHelp");
  const settingsButton = document.querySelector("#openSearchParameters");
  const manualButton = document.querySelector("#openManualSearch");
  function showManualNotices() {
    document.querySelector("#manualRecoveryNotice").hidden = false;
    document.querySelector("#manualNoResultNotice").hidden = false;
  }
  function activateManualRescue() {
    rescueOnReturn = false;
    leftForTextualSearch = false;
    textualButton.classList.add("secondary");
    button.classList.add("secondary");
    manualButton.classList.remove("secondary");
    retryHelp.hidden = false;
    retryHelp.textContent = "Toujours pas l’article attendu ? Europresse peut être capricieux : essayez maintenant le copier-coller de secours avec le bouton ci-dessus.";
    document.querySelector(".europresse-feedback").before(retryHelp);
  }
  // Only observe leaving/returning to our page, never infer Europresse's result.
  function rememberDeparture() {
    if (rescueOnReturn) leftForTextualSearch = true;
  }
  function offerRescueOnReturn() {
    if (!rescueOnReturn || !leftForTextualSearch || document.hidden) return;
    activateManualRescue();
    if (openRescueOnReturn) openDialog(document.querySelector("#manualSearch"));
  }
  window.addEventListener("blur", rememberDeparture);
  window.addEventListener("focus", offerRescueOnReturn);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) rememberDeparture();
    else offerRescueOnReturn();
  });
  document.querySelector("#restoreBnfAccess").href = buildSearchHomeUrl();
  document.querySelector("#manualRestoreBnfAccess").href = buildSearchHomeUrl();
  const dateHint = debridageDateHint(originalUrl);
  titleWords.value = originalUrl ? debridageUrlOptions(originalUrl).words : "";
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
    manualKeywords = humanizeSearchQuery(manualUsesTitleWords ? titleWords.value : keywords || query);
    renderDisplayedQuery(buildMachineSearchQuery(manualQuery, manualUsesTitleWords), machineQueryOutput);
    queryOutput.textContent = manualKeywords;
    renderDisplayedQuery(machineQueryOutput.textContent);
    document.querySelector("#copyDisplayedQuery").disabled = !manualQuery;
    submitButton.disabled = !manualQuery;
    copyButton.disabled = !manualQuery;
    document.querySelector("#copyManualQuery").disabled = !manualQuery;
    [copyKeywordButton, document.querySelector("#copyManualKeywords"), document.querySelector("#submitKeywordSearch")].forEach(button => { button.disabled = !manualKeywords; });
    manualCopyStatus.textContent = "";
    const initial = prepareDebridage(originalUrl, options());
    const result = initial.state === "ready" ? initial : prepareMetadataSearch(originalUrl, recoveredMetadata) || initial;
    const textual = prepareEuropresseKeywordSearch(titleWords.value);
    textualStatus.textContent = textual.state === "ready" ? "" : textual.message;
    const alternatives = prepareDebridage(originalUrl, {...options(), method: "date-alternatives"});
    const titleResult = titleOnly ? result : prepareDebridage(originalUrl, {...options(), method: "reference-title"});
    // Only the self-excluded title transport was tested with these extra criteria.
    refinementBlock.hidden = profile?.enabled !== true || !(titleOnly ||
      (profile?.title_fallback_without_reference && result.state === "ready" && result.method === "reference-title"));
    const refined = refinementBlock.hidden ? null : refinedResult();
    refinedButton.disabled = refined?.state !== "ready";
    refinedStatus.textContent = refined?.message || "";
    refinedStatus.classList.toggle("is-error", Boolean(refined && refined.state !== "ready" && (authorInput.value || languageInput.value)));
    titleBlock.hidden = false;
    titleButton.hidden = titleOnly || titleResult.state === "unsupported";
    button.disabled = recoveringTitle || automaticAttempts >= 2 || result.state === "unsupported";
    titleButton.disabled = titleResult.state !== "ready";
    titleStatus.textContent = titleResult.state === "ready" ? titleResult.message : textual.message;
    titleStatus.classList.toggle("is-error", textual.state !== "ready");
    alternativesBlock.hidden = alternatives.state !== "ready";
    alternativesStatus.textContent = alternatives?.message || "";
    methodOutput.textContent = debridageMethodLabel(profile, result.method) + ". " + (usingEstimatedDate ? "Date estimée depuis la création du lien, pas sa publication. " : "") + result.message + (profile?.limitations ? " " + profile.limitations : "");
    output.textContent = result.state === "ready"
      ? (titleOnly || result.method === "reference-title" ? "Recherche par titre, toutes dates et tous journaux. Vérifiez l'article ouvert." : "Accès expérimental prêt. Vérifiez l'article ouvert.")
      : result.state === "unsupported" ? result.message
      : "Un réglage est nécessaire dans les paramètres de recherche.";
    return result;
  }
  render();
  textualButton.addEventListener("click", () => {
    const result = prepareEuropresseKeywordSearch(titleWords.value);
    if (result.state === "ready") {
      showManualNotices();
      rescueOnReturn = true;
      openRescueOnReturn = automaticAttempts >= 2;
      leftForTextualSearch = false;
      window.open(result.url, "_blank", "noopener,noreferrer");
      textualStatus.textContent = "";
      connectionHelp.hidden = automaticAttempts >= 2;
    } else {
      openDialog(panel);
      titleWords.focus();
      textualStatus.textContent = result.message;
    }
  });
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
    recoveredMetadata = null;
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
  button.addEventListener("click", async () => {
    let result = render();
    let destination;
    if (result.state !== "ready" && profile?.enabled && !titleWords.value.trim() && !debridageUrlOptions(originalUrl).words) {
      destination = window.open("about:blank", "_blank");
      if (!destination) { setPageStatus("Autorisez l’ouverture du nouvel onglet, puis réessayez."); return; }
      destination.opener = null;
      recoveringTitle = true;
      render();
      setPageStatus("Récupération du titre via Microlink…");
      try {
        result = await prepareAutomaticArticleSearch(originalUrl, options());
        if (result.provenance === "microlink") {
          recoveredMetadata = result.metadata;
          titleWords.value = result.words;
          manualUsesTitleWords = true;
          setPageStatus("Titre récupéré via Microlink : " + result.metadata.title);
        } else setPageStatus(result.message);
      } catch { setPageStatus("Titre non récupéré. Utilisez les paramètres ou le secours manuel."); }
      finally { recoveringTitle = false; render(); }
    }
    if (result.state === "ready") {
      openAutomaticResult(result, destination);
    } else if (result.state === "needs-date" || result.state === "needs-words") {
      destination?.close();
      openDialog(panel);
      (result.state === "needs-date" ? dateInput : titleWords).focus();
    } else destination?.close();
  });
  function openAutomaticResult(result, destination) {
    if (automaticAttempts >= 2) return;
    showManualNotices();
    if (destination) destination.location.replace(result.url);
    else window.open(result.url, "_blank", "noopener,noreferrer");
    automaticAttempts += 1;
    button.textContent = "Réessayer la recherche automatique";
    retryHelp.hidden = false;
    connectionHelp.hidden = true;
    if (automaticAttempts >= 2) {
      button.disabled = true;
      settingsButton.disabled = true;
      textualButton.classList.remove("secondary");
      retryHelp.textContent = "Europresse est parfois capricieux. Essayez la recherche textuelle, parfois plus fiable. Si elle ne donne pas l’article attendu, le copier-coller de secours reste disponible.";
      document.querySelector(".europresse-feedback").before(retryHelp);
      if (panel.open) panel.close();
    }
  }
}

async function openEuropresse(useKeywords = false) {
  // Click handlers pass an Event; only an explicit true chooses the keyword path.
  useKeywords = useKeywords === true;
  if (!(useKeywords ? manualKeywords : manualQuery)) {
    return;
  }
  // Open during the click: clipboard permission can outlast browser user activation.
  window.open(buildSearchHomeUrl(), "_blank", "noopener,noreferrer");
  if (useKeywords) manualKeywordsOpened = true;
  else manualQueryOpened = true;
  renderManualProgress();
  const copied = await (useKeywords ? copyKeywordSearch() : copySearch());
  manualCopyStatus.textContent = copied
    ? `${useKeywords ? "Mots-clés copiés" : "Recherche copiée"}. Dans le nouvel onglet Europresse, collez ${useKeywords ? "ces mots-clés" : "la recherche"} dans le champ de recherche.`
    : `Copie automatique impossible. Copiez le texte « ${useKeywords ? "Mots-clés" : "Recherche à coller"} » ci-dessus, puis collez-le dans le nouvel onglet Europresse.`;
}

function humanizeSearchQuery(value) {
  return value.replace(/\s+/g, " ").trim();
}

function buildMachineSearchQuery(value, distinctWords = false) {
  const cleanQuery = humanizeSearchQuery(value);
  if (distinctWords) {
    const query = europresseManualTitleQuery(cleanQuery);
    if (query) return query;
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
  const text = manualKeywords;

  if (!text) {
    return false;
  }

  return copyPreparedSearch(text, "Mots-clés copiés. Collez-les dans Europresse si la recherche par titre ne suffit pas.");
}

async function copyPreparedSearch(text, successMessage) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      setPageStatus("");
      manualCopyStatus.textContent = successMessage;
      return true;
    } catch {
      // Local-network HTTP pages can be rejected by Clipboard API.
    }
  }

  if (copyTextWithSelection(text)) {
    setPageStatus("");
    manualCopyStatus.textContent = successMessage;
    return true;
  }

  setPageStatus("Copie automatique impossible. Copiez vous-même le texte affiché sur cette page, puis collez-le dans Europresse.");
  manualCopyStatus.textContent = status.textContent;
  return false;
}

function copyTextWithSelection(text) {
  const previousFocus = document.activeElement;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";

  // A modal makes the rest of the document inert, including fallback inputs.
  (document.querySelector(".europresse-dialog[open]") || document.body).append(textarea);
  textarea.focus();
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
    previousFocus?.focus();
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
