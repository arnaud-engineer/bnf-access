// Catalogue labels, icons and recognized values; matching behavior lives in feature modules.
export const bookPlatformDefinitions = [
  ["pret-bnf", "bnf-pret-numerique", "Prêt BnF"],
  ["scholarvox", "scholarvox-cyberlibris", "ScholarVox"],
  ["eni", "eni-bibliotheque-numerique", "ENI"],
  ["garnier", "classiques-garnier-livres-et-revues-numeriques", "Garnier"],
  ["gale", "gale-general-research", "Gale"],
  ["alexanderstreet", "twentieth-century-religious-thought-library-christianity", "Alexander Street"],
  ["openedition", "openedition-books", "OpenEdition"],
  ["rsc", "rsc-publishing", "RSC"],
  ["eebo", "early-english-books-online-eebo", "Early English Books", false],
  ["eeb", "early-european-books", "Early European Books", false],
];

export const pressEntryTypes = {
  resource: "resource",
  title: "press_title",
};

export const hiddenCategoryBadges = new Set(["Sélection internationale"]);

export const pressTitleSourceFilters = [
  { id: "all", label: "Tous" },
  { id: "direct", label: "Accès direct" },
  { id: "europresse", label: "Europresse" },
  { id: "pressreader", label: "PressReader" },
  { id: "indexpresse_business", label: "IndexPresse Business" },
  { id: "factiva", label: "Factiva" },
];

export const pressTitleAllFilterValue = "all";

export const pressTitleFavoriteFilterValue = "favorites";

export const pressTitleRecommendedFilterValue = "recommended";

export const pressTitlePopularFilterValue = "popular";

export const pressTitleEditorialRootIcons = {
  actualite: '<path d="M15 18h-5"></path><path d="M18 14h-8"></path><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"></path><rect width="8" height="4" x="10" y="6" rx="1"></rect>',
  culture: '<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"></path><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>',
  divertissement: '<path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z"></path><circle cx="12" cy="12" r="10"></circle>',
  loisirs: '<circle cx="12" cy="12" r="10"></circle><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path>',
  professionnels: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect>',
  savoirs: '<path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>',
  vie_pratique: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>',
};

export const resourceCategoryIcons = {
  favorites: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"></path>',
  Toutes: '<rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect>',
  Presse: '<path d="M15 18h-5"></path><path d="M18 14h-8"></path><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"></path><rect width="8" height="4" x="10" y="6" rx="1"></rect>',
  Livre: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"></path>',
  presse_et_medias: '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5"></path><path d="M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3v-6"></path>',
  economie_et_entreprise: '<rect width="18" height="13" x="3" y="8" rx="2"></rect><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M3 13h18"></path>',
  droit: '<path d="m16 16 3-8 3 8a5 5 0 0 1-6 0Z"></path><path d="m2 16 3-8 3 8a5 5 0 0 1-6 0Z"></path><path d="M7 21h10"></path><path d="M12 3v18"></path><path d="M3 7h18"></path>',
  art_et_image: '<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"></path><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>',
  musique_et_spectacle: '<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>',
  cinema: '<path d="M2 4c6-3 14-3 20 0v7c0 6-4.5 10-10 11C6.5 21 2 17 2 11Z" stroke-width="2.5"></path><ellipse cx="7.5" cy="9.5" rx="1.9" ry="1.35" fill="currentColor" stroke="none"></ellipse><ellipse cx="16.5" cy="9.5" rx="1.9" ry="1.35" fill="currentColor" stroke="none"></ellipse><ellipse cx="12" cy="16" rx="3.6" ry="2.7" fill="currentColor" stroke="none"></ellipse>',
  litterature_et_langues: '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><path d="M16 8 2 22"></path><path d="M17.5 15H9"></path>',
  histoire_et_antiquite: '<path d="M5 22h14"></path><path d="M7 18h10"></path><path d="M9.5 18V8"></path><path d="M14.5 18V8"></path><path d="M7 8h10"></path><path d="m8 8-1-3 4-2 2 2 4-1 1 4"></path>',
  sciences_humaines: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle>',
  sciences_et_technique: '<path d="M6 18h8"></path><path d="M3 22h18"></path><path d="M14 22a7 7 0 1 0 0-14h-1"></path><path d="M9 14h2"></path><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path><path d="M12 6V3H8v3"></path>',
  catalogues_et_bibliographies: '<path d="M3 7h5l2 2h11v11H3z"></path><path d="M3 7V4h6l2 3"></path><circle cx="16" cy="14" r="2.5"></circle><path d="m18 16 2 2"></path>',
  catalogues_et_bibliographies__livres: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"></path>',
  recherche_generale: '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>',
  dictionnaires_et_encyclopedies: '<path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>',
  biographies: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path>',
};

export const promotedPressTitleCountryCodes = new Set(["fr", "ca", "be", "ch", "us", "gb"]);

export const promotedPressTitleCountryMinimumCount = 20;

export const legacyCatalogResourceIds = new Map([
  ["indexpresse-business-inve", "europresse-gi-p"],
]);

export const compactLanguageCodes = {
  enm: "ME",
  grc: "GR",
  mu: "MULTI",
  mul: "MULTI",
};

export const languageLabelOverrides = {
  mu: "multilingue",
  mul: "multilingue",
};

export const primaryLanguageCodes = ["fr", "en", "es", "de", "it"];

export const accessLabels = {
  pass_lecture_culture: "Pass Lecture/Culture",
  pass_recherche_illimite: "Pass Recherche illimité",
  public: "Sans Pass BnF",
};

export const accessModeLabels = {
  remote: "Accès distant",
  remote_conditional: "Accès distant sous condition",
  onsite: "Sur place uniquement",
  onsite_extended: "Accès sur site prolongé",
  mixed: "Accès mixte",
  free: "Accès libre",
};

export const accessModeClasses = {
  remote: "remote",
  remote_conditional: "conditional",
  onsite: "onsite",
  onsite_extended: "onsite",
  mixed: "mixed",
  free: "free",
};
