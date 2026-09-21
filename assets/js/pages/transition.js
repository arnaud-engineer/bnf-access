const params = new URLSearchParams(window.location.search);
const title = params.get("title") || "Ressource";
const action = params.get("action") || "Ouverture";
const startUrl = params.get("start") || "";
const targetUrl = params.get("target") || "";
const helperState = params.get("helper");

const resource = document.querySelector("#transitionResource");
const status = document.querySelector("#transitionStatus");
const startLink = document.querySelector("#startLink");
const targetLink = document.querySelector("#targetLink");
const frame = document.querySelector("#sessionFrame");

const minDelayMs = 2200;
const maxDelayMs = 4200;
const helperDelayMs = 11000;
const startedAt = Date.now();
let redirected = false;
let readySignalReceived = false;

function init() {
  resource.textContent = `${action} - ${title}`;

  if (!isAllowedStartUrl(startUrl) || !isAllowedTargetUrl(targetUrl)) {
    showError();
    return;
  }

  startLink.href = startUrl;
  targetLink.href = targetUrl;
  targetLink.rel = "noreferrer";
  startLink.rel = "noreferrer";

  if (helperState === "1") {
    frame.remove();
    status.textContent = "Préparation de l'accès ouverte, lancement de la ressource dans quelques secondes...";
    scheduleRedirect(helperDelayMs);
    return;
  }

  if (helperState === "0") {
    frame.remove();
    status.textContent = "Le navigateur a bloqué l'onglet de connexion. Lancez la connexion BnF, puis ouvrez la ressource.";
    return;
  }

  frame.addEventListener("load", () => {
    readySignalReceived = true;
    status.textContent = "Préparation lancée, ouverture du titre...";
    scheduleRedirect(500);
  });

  frame.addEventListener("error", () => {
    status.textContent = "Préparation automatique incertaine, tentative d'ouverture du titre...";
  });

  status.textContent = "Connexion à la ressource via la BnF...";
  frame.src = startUrl;

  window.setTimeout(() => {
    if (!readySignalReceived) {
      status.textContent = "Ouverture du titre demandé...";
    }
    scheduleRedirect(0);
  }, maxDelayMs);

  window.setTimeout(() => {
    if (readySignalReceived) {
      scheduleRedirect(0);
    }
  }, minDelayMs);
}

function scheduleRedirect(delay) {
  if (redirected) {
    return;
  }

  redirected = true;
  const elapsed = Date.now() - startedAt;
  const remainingMinimumDelay = Math.max(0, minDelayMs - elapsed);
  const actualDelay = Math.max(delay, remainingMinimumDelay);
  window.setTimeout(() => {
    window.location.assign(targetUrl);
  }, actualDelay);
}

function showError() {
  document.body.classList.add("transition-error");
  status.textContent = "Le lien demandé n'est pas reconnu.";
  targetLink.hidden = true;
  startLink.hidden = true;
  frame.remove();
}

function isAllowedStartUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (
      url.hostname === "bnf.idm.oclc.org" ||
      url.hostname === "login.bnf.idm.oclc.org"
    );
  } catch {
    return false;
  }
}

function isAllowedTargetUrl(value) {
  try {
    const url = new URL(value, window.location.href);
    if (url.origin === window.location.origin) {
      return true;
    }

    return url.protocol === "https:" && (
      url.hostname === "nouveau-europresse-com.bnf.idm.oclc.org" ||
      url.hostname === "www-arretsurimages-net.bnf.idm.oclc.org" ||
      url.hostname === "www-alternatives-economiques-fr.bnf.idm.oclc.org" ||
      url.hostname === "www-mediapart-fr.bnf.idm.oclc.org" ||
      url.hostname === "blogs-mediapart-fr.bnf.idm.oclc.org" ||
      url.hostname === "business.indexpresse.fr" ||
      url.hostname === "bnf.idm.oclc.org" ||
      url.hostname === "login.bnf.idm.oclc.org"
    );
  } catch {
    return false;
  }
}

init();
