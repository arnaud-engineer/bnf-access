const themeStorageKey = "bnf-access:v2:theme:v1";
const colorBlindStorageKey = "bnf-access:v2:colorblind-mode:v1";
const themes = new Set(["auto", "light", "dark", "oled"]);
const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

document.body.insertAdjacentHTML("afterbegin", `
  <div class="jump-to-search-dock info-page-tools">
    <div class="page-tools">
      <button id="infoOpenSettings" class="page-tool-button settings-shortcut" type="button" aria-label="Ouvrir les paramètres" title="Paramètres">
        <svg aria-hidden="true" viewBox="0 0 81 82"><path d="M78.208 48.845l-6.572-2.783c-.995-.398-1.991-.994-1.792-1.193.199-.994.199-1.789.199-2.584v-5.366c0-.994 0-1.789-.199-2.584-.199-.199.797-.795 1.792-1.193l6.572-2.584c.995-.398 1.593-1.59 1.195-2.783l-3.186-7.752c-.398-.994-1.593-1.59-2.788-1.192l-6.571 2.584c-.996.398-1.991.596-2.19.398a31.873 31.873 0 0 0-5.376-5.367c-.199-.199 0-1.193.398-2.186l2.788-6.559c.398-.994 0-2.385-1.195-2.783L51.524.149c-.995-.398-2.389 0-2.787 1.193l-2.788 6.559c-.398.994-.996 1.988-1.195 1.789a28.98 28.98 0 0 0-7.965-.397c-.199.198-.796-.795-1.195-1.789l-2.588-6.559c-.398-.994-1.593-1.59-2.788-1.193l-7.766 3.18c-.995.397-1.593 1.59-1.195 2.783l2.589 6.559c.398.994.597 1.988.398 2.186a31.873 31.873 0 0 0-5.178 5.367c-.199.198-1.195 0-2.19-.397l-6.571-2.783c-.996-.397-2.39 0-2.788 1.193L.149 27.975c-.398.994 0 2.385 1.195 2.783l6.572 2.783c.995.398 1.991.994 1.792 1.193a28.14 28.14 0 0 0 0 7.951c.199.199-.797.795-1.792 1.193l-6.572 2.584c-.995.397-1.593 1.59-1.195 2.783l3.186 7.752c.398.994 1.593 1.59 2.788 1.193l6.571-2.584c.996-.397 1.991-.596 2.19-.397a31.873 31.873 0 0 0 5.376 5.366c.199.199 0 1.193-.398 2.186l-2.788 6.559c-.398.994 0 2.385 1.195 2.783l7.766 3.18c.995.398 2.39 0 2.787-1.192l2.788-6.559c.398-.994.996-1.988 1.195-1.789a28.98 28.98 0 0 0 7.965.397c.199-.198.796.795 1.195 1.789l2.588 6.559c.398.994 1.593 1.59 2.788 1.192l7.766-3.18c.995-.397 1.593-1.59 1.195-2.783l-2.589-6.559c-.398-.994-.597-1.988-.398-2.186a31.873 31.873 0 0 0 5.376-5.366c.199-.199 1.195 0 2.191.397l6.571 2.783c.996.398 2.39 0 2.788-1.193L80 52.025c-.199-1.59-.597-2.783-1.792-3.18zM39.776 60.77c-11.748 0-21.108-9.54-21.108-21.068 0-11.727 9.359-21.068 21.108-21.068s21.108 9.342 21.108 21.068S51.325 60.77 39.776 60.77z"/></svg>
      </button>
      <a class="page-tool-button jump-to-search" href="../#searchControls" aria-label="Revenir à la recherche" title="Revenir à la recherche">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m21 21-4.35-4.35m2.35-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"/></svg>
      </a>
    </div>
  </div>
  <div id="infoSettingsModal" class="settings-modal" hidden>
    <section class="settings-dialog" role="dialog" aria-modal="true" aria-labelledby="infoSettingsTitle">
      <div class="settings-dialog-header">
        <div><h2 id="infoSettingsTitle">Paramètres</h2><p>Réglages conservés uniquement dans ce navigateur.</p></div>
        <button id="infoCloseSettings" class="settings-close" type="button" aria-label="Fermer les paramètres"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
      </div>
      <article class="settings-panel settings-panel-form">
        <div><h3>Apparence</h3><p>Choisir le thème visuel utilisé sur cet appareil.</p></div>
        <div class="settings-fields"><label class="settings-field"><span>Thème</span><select id="infoSettingsTheme"><option value="auto">Par défaut</option><option value="light">Blanc</option><option value="dark">Noir</option><option value="oled">Noir OLED</option></select></label></div>
      </article>
      <article class="settings-panel settings-panel-form">
        <div><h3>Accessibilité</h3><p>Renforcer les distinctions qui reposent sur des codes couleur.</p></div>
        <div class="settings-fields"><label class="settings-field"><span>Mode daltonien</span><select id="infoColorBlindMode"><option value="no">Non</option><option value="yes">Oui</option></select></label></div>
      </article>
      <article class="settings-panel">
        <div><h3>Données locales</h3><p>Supprimer les favoris, filtres et préférences enregistrés par BnF Access.</p><p id="infoClearStatus" class="settings-status" role="status" aria-live="polite"></p></div>
        <button id="infoClearLocalData" class="settings-action danger" type="button">Supprimer</button>
      </article>
    </section>
  </div>`);

const modal = document.querySelector("#infoSettingsModal");
const openButton = document.querySelector("#infoOpenSettings");
const closeButton = document.querySelector("#infoCloseSettings");
const themeSelect = document.querySelector("#infoSettingsTheme");
const colorBlindSelect = document.querySelector("#infoColorBlindMode");
const clearStatus = document.querySelector("#infoClearStatus");
const dock = document.querySelector(".info-page-tools");

function automaticTheme() { return darkThemeQuery.matches ? "oled" : "light"; }
function applyTheme(value) {
  const theme = value === "auto" ? automaticTheme() : value;
  if (theme === "light") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  document.querySelector("#themeColor")?.setAttribute("content", { light: "#f7f7f4", dark: "#141619", oled: "#000000" }[theme]);
  themeSelect.value = value;
}
function applyColorBlind(enabled) {
  if (enabled) document.documentElement.dataset.colorVision = "colorblind";
  else delete document.documentElement.dataset.colorVision;
  colorBlindSelect.value = enabled ? "yes" : "no";
}
function closeModal() {
  modal.classList.remove("is-open"); document.body.classList.remove("has-modal");
  window.setTimeout(() => { modal.hidden = true; }, 160); openButton.focus();
}
function updateDock() {
  const footer = document.querySelector("#siteFooter");
  const overlap = footer ? Math.max(0, window.innerHeight - footer.getBoundingClientRect().top + 12) : 0;
  dock.style.setProperty("--floating-footer-offset", `${overlap}px`);
}

const storedTheme = themes.has(localStorage.getItem(themeStorageKey)) ? localStorage.getItem(themeStorageKey) : "auto";
applyTheme(storedTheme);
applyColorBlind(localStorage.getItem(colorBlindStorageKey) === "true");
openButton.addEventListener("click", () => { clearStatus.textContent = ""; modal.hidden = false; document.body.classList.add("has-modal"); requestAnimationFrame(() => { modal.classList.add("is-open"); closeButton.focus(); }); });
closeButton.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.hidden) closeModal(); });
themeSelect.addEventListener("change", () => { localStorage.setItem(themeStorageKey, themeSelect.value); applyTheme(themeSelect.value); });
colorBlindSelect.addEventListener("change", () => { const enabled = colorBlindSelect.value === "yes"; localStorage.setItem(colorBlindStorageKey, String(enabled)); applyColorBlind(enabled); });
document.querySelector("#infoClearLocalData").addEventListener("click", async () => {
  const keys = Object.keys(localStorage).filter((key) => (
    key.startsWith("bnf-access:") || key.startsWith("bnf-access-press:")
  ) && !key.includes(":catalog-editor:"));
  keys.forEach((key) => localStorage.removeItem(key));
  localStorage.setItem("bnf-access:v2:migrated", "true");
  localStorage.setItem("bnf-access:v2:migration-version", "2");
  applyTheme("auto"); applyColorBlind(false); clearStatus.textContent = keys.length ? "Les préférences locales de BnF Access ont été supprimées." : "Aucune préférence locale n’était enregistrée."; clearStatus.dataset.status = "success";
});
darkThemeQuery.addEventListener("change", () => { if (themeSelect.value === "auto") applyTheme("auto"); });
window.addEventListener("scroll", updateDock, { passive: true }); window.addEventListener("resize", updateDock); updateDock();
