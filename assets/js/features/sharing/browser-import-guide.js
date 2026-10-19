export const firefoxBookmarkImportSteps = [
  'Dans Firefox, ouvrez le menu ≡, puis Marque-pages → Organiser les marque-pages pour ouvrir la fenêtre Bibliothèque.',
  'En haut de la Bibliothèque, cliquez sur le bouton aux deux flèches, l’une vers le haut et l’autre vers le bas : Importation et sauvegarde. Sur Mac, son nom n’est pas toujours affiché : survolez l’icône pour lire son infobulle.',
  'Choisissez Importer des marque-pages au format HTML, sélectionnez le fichier bnf-access-favoris téléchargé, puis cliquez sur Ouvrir.',
  'Dans la colonne de gauche, dépliez Tous les marque-pages, puis ouvrez Menu des marque-pages. Le dossier BnF Access se trouve dans cette liste, éventuellement tout en bas. Il n’apparaît pas automatiquement dans la barre personnelle.',
  'Pour le retrouver dans la barre, faites glisser le dossier BnF Access vers Barre personnelle dans la colonne de gauche. Les marque-pages existants sont conservés : ne relancez pas l’import si vous cherchez le dossier, cela peut créer des doublons.',
];

export const chromeBookmarkImportSteps = [
  'Dans Chrome sur ordinateur, cliquez sur le menu ⋮ en haut à droite, puis Favoris et listes → Importer les favoris et les paramètres.',
  'Dans la fenêtre d’import, sélectionnez le fichier HTML de favoris si un choix de source est proposé, puis cliquez sur Choisir un fichier.',
  'Sélectionnez le fichier bnf-access-favoris téléchargé, cliquez sur Ouvrir, puis validez avec OK si Chrome le demande.',
  'Pour retrouver le résultat, ouvrez le menu ⋮ → Favoris et listes → Gestionnaire de favoris. Cherchez le dossier BnF Access : si vous aviez déjà des favoris, regardez dans Autres favoris ; sinon, regardez dans Barre de favoris. Dépliez aussi un éventuel dossier Importés.',
  'Pour garder BnF Access visible, déplacez son dossier vers Barre de favoris dans le gestionnaire. Vous pouvez afficher cette barre depuis le menu Favoris et listes. Ne relancez pas l’import pour chercher le dossier : vous risqueriez de créer des doublons.',
];

export const safariBookmarkImportSteps = [
  'Dans Safari sur Mac, ouvrez le menu Fichier de la barre de menus, tout en haut de l’écran. Choisissez Importer des données de navigation depuis un fichier ou un dossier.',
  'Cliquez sur Choisir un fichier ou un dossier. Selon votre version de Safari, le chemin peut plutôt être Fichier → Importer depuis → Fichier HTML de signets.',
  'Sélectionnez le fichier bnf-access-favoris téléchargé, puis cliquez sur Importer. Si Safari propose plusieurs types de données, choisissez les signets.',
  'Ouvrez vos signets depuis le menu Signets ou la barre latérale. Les signets importés se trouvent à la suite des signets existants : cherchez BnF Access en bas de la liste, en dépliant un éventuel dossier d’import.',
  'Pour afficher le dossier dans la barre, faites-le glisser dans Favoris, puis choisissez Présentation → Afficher la barre des favoris. Les signets existants sont conservés ; ne recommencez pas l’import simplement pour retrouver le dossier, afin d’éviter les doublons.',
];

export function getBookmarkImportSteps(browser, navigator = {}) {
  if (isMobileBookmarkBrowser(navigator)) return [];
  return {firefox: firefoxBookmarkImportSteps, chrome: chromeBookmarkImportSteps, safari: safariBookmarkImportSteps}[browser] ?? [];
}

export function detectBookmarkBrowser(navigator = {}) {
  const ua = navigator.userAgent || '';
  if (/Firefox\/|FxiOS\//i.test(ua)) return 'firefox';
  const brands = navigator.userAgentData?.brands?.map(entry => entry.brand) ?? [];
  if (/Edg|OPR\/|Opera|SamsungBrowser|Vivaldi/i.test(ua)
    || brands.some(brand => /Edge|Opera|Brave|Vivaldi/i.test(brand)) || navigator.brave) return 'other';
  if (brands.includes('Google Chrome') || /Chrome\/|CriOS\//i.test(ua)) return 'chrome';
  if (/Version\/[\d.]+.*Safari\//i.test(ua)) return 'safari';
  return 'other';
}

export function isMobileBookmarkBrowser(navigator = {}) {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '')
    || (/Mac/i.test(navigator.platform || '') && navigator.maxTouchPoints > 1)
    || navigator.userAgentData?.mobile === true;
}

export function getBookmarkImportGuide(browser, navigator = {}) {
  if (isMobileBookmarkBrowser(navigator)) return 'Sur téléphone ou tablette, cet export n’est pas proposé. Ouvrez BnF Access sur un ordinateur pour exporter vos favoris vers votre navigateur.';
  const steps = getBookmarkImportSteps(browser, navigator);
  if (steps.length) return steps.join(' ');
  return 'Dans votre navigateur, ouvrez le gestionnaire de favoris, de marque-pages ou de signets. Cherchez Importer, puis l’import depuis un fichier HTML. Sélectionnez le fichier bnf-access-favoris téléchargé. Si cette option n’est pas proposée, consultez l’aide de votre navigateur ou importez le fichier sur un ordinateur compatible.';
}
