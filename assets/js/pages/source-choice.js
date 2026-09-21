const params = new URLSearchParams(window.location.search);
const title = params.get("title") || "ce titre";
const originalUrl = params.get("from") || "";
const options = [
  {
    label: "Essayer IndexPresse Business",
    note: "Index utile, mais non exhaustif.",
    source: params.get("indexpresseSource") || "IndexPresse Business",
    url: params.get("indexpresseUrl") || "",
    icon: getSafeIconUrl(params.get("indexpresseIcon")) || "../assets/logos/indexpresse.svg",
  },
  {
    label: "Essayer PressReader",
    note: "À privilégier depuis un site BnF.",
    source: params.get("pressreaderSource") || "PressReader",
    url: params.get("pressreaderUrl") || "",
    icon: getSafeIconUrl(params.get("pressreaderIcon")) || "../assets/logos/pressreader.svg",
  },
];

const resource = document.querySelector("#sourceChoiceResource");
const original = document.querySelector("#sourceChoiceOriginalUrl");
const optionsContainer = document.querySelector("#sourceChoiceOptions");

function init() {
  resource.textContent = title;
  original.textContent = getDisplayUrl(originalUrl);

  const safeOptions = options.filter((option) => isAllowedOptionUrl(option.url));

  if (!safeOptions.length) {
    document.body.classList.add("transition-error");
    optionsContainer.innerHTML = '<p class="source-choice-empty">Aucune recherche exploitable pour ce lien.</p>';
    return;
  }

  optionsContainer.replaceChildren(...safeOptions.map(renderOption));
}

function renderOption(option) {
  const link = document.createElement("a");
  link.className = "source-choice-option";
  link.href = option.url;
  link.target = "_blank";
  link.rel = "noreferrer";

  const icon = document.createElement("img");
  icon.src = option.icon;
  icon.alt = "";
  icon.setAttribute("aria-hidden", "true");

  const text = document.createElement("span");
  text.className = "source-choice-option-text";

  const label = document.createElement("strong");
  label.textContent = option.label;

  const source = document.createElement("span");
  source.textContent = option.source;

  const note = document.createElement("small");
  note.textContent = option.note;

  text.append(label, source, note);
  link.append(icon, text);
  return link;
}

function getDisplayUrl(value) {
  try {
    const url = new URL(value);
    return url.href;
  } catch {
    return value || "Non renseigné";
  }
}

function isAllowedOptionUrl(value) {
  try {
    const url = new URL(value, window.location.href);
    if (url.origin !== window.location.origin) {
      return false;
    }

    return [
      "/pages/transition.html",
      "/pages/pressreader-search.html",
    ].includes(url.pathname);
  } catch {
    return false;
  }
}

function getSafeIconUrl(value) {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value, window.location.href);
    const allowedExtension = /\.(svg|webp|png|jpg|jpeg|gif)$/i.test(url.pathname);

    if (url.origin !== window.location.origin || !url.pathname.startsWith("/assets/logos/") || !allowedExtension) {
      return "";
    }

    return url.href;
  } catch {
    return "";
  }
}

init();
