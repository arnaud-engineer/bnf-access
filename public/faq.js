const clearLocalDataButton = document.querySelector("#clearLocalData");
const clearLocalDataStatus = document.querySelector("#clearLocalDataStatus");
const localDataPrefix = "bnf-access:";

clearLocalDataButton?.addEventListener("click", () => {
  const removedCount = clearLocalData();
  setStatus(removedCount > 0
    ? "Les données locales de BnF Access ont été supprimées."
    : "Aucune donnée locale BnF Access n'était enregistrée dans ce navigateur.");
});

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
