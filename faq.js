const clearLocalDataButton = document.querySelector("#clearLocalData");
const clearLocalDataStatus = document.querySelector("#clearLocalDataStatus");
const installAppButton = document.querySelector("#installApp");
const installAppStatus = document.querySelector("#installAppStatus");
const localDataPrefix = "bnf-access:";

clearLocalDataButton?.addEventListener("click", () => {
  const removedCount = clearLocalData();
  setStatus(removedCount > 0
    ? "Les données locales de BnF Access ont été supprimées."
    : "Aucune donnée locale BnF Access n'était enregistrée dans ce navigateur.");
});

installAppButton?.addEventListener("click", async () => {
  const installer = window.bnfAccessInstall;

  if (!installer?.canPrompt()) {
    setInstallStatus("Si le bouton d'installation du navigateur n'apparaît pas, utilisez son menu puis Ajouter à l'écran d'accueil.");
    return;
  }

  const outcome = await installer.prompt();
  setInstallStatus(outcome === "accepted"
    ? "BnF Access a été ajouté à votre écran d'accueil."
    : "Installation annulée. Le site reste utilisable normalement dans le navigateur.");
});

window.bnfAccessInstall?.subscribe(updateInstallButton);
updateInstallButton();

function clearLocalData() {
  const keys = [];

  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith(localDataPrefix)) {
        keys.push(key);
      }
    }

    keys.forEach((key) => localStorage.removeItem(key));
  } catch {
    setStatus("Impossible de supprimer les données locales depuis ce navigateur.");
    return 0;
  }

  return keys.length;
}

function setStatus(message) {
  if (clearLocalDataStatus) {
    clearLocalDataStatus.textContent = message;
  }
}

function updateInstallButton() {
  const installer = window.bnfAccessInstall;

  if (!installAppButton || !installer) {
    return;
  }

  if (installer.isInstalled()) {
    installAppButton.disabled = true;
    installAppButton.textContent = "Application déjà installée";
    setInstallStatus("BnF Access est déjà lancé comme application web sur cet appareil.");
    return;
  }

  installAppButton.disabled = false;
  installAppButton.textContent = installer.canPrompt()
    ? "Installer l'application web"
    : "Voir comment l'installer";
}

function setInstallStatus(message) {
  if (installAppStatus) {
    installAppStatus.textContent = message;
  }
}
