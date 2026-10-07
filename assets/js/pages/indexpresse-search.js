import { buildIndexpresseSearch, indexpresseEntry, resolveIndexpresseDestination } from '../modules/indexpresse-search.mjs';

const params = new URLSearchParams(window.location.search);
const queryInput = document.querySelector('#queryWords');
const preview = document.querySelector('#queryPreview');
const status = document.querySelector('#searchStatus');
const targeted = document.querySelector('#targetedSearch');
const automatic = document.querySelector('#automaticSearch');
const openOnly = document.querySelector('#openIndexpresse');
const dialog = document.querySelector('#searchParameters');
let publication = '';
let verifiedLinks = null;
let copyTimer;
const originalQuery = (params.get('q') || '').slice(0, 500);
queryInput.value = originalQuery;
document.querySelector('#bnfEntry').href = indexpresseEntry;
openOnly.href = indexpresseEntry;

function updateQuery() {
  preview.textContent = queryInput.value.trim();
  targeted.disabled = !buildIndexpresseSearch({query: queryInput.value, publication});
  automatic.disabled = targeted.disabled;
}
function prioritize(button) {
  for (const item of [automatic, targeted, openOnly]) item.classList.toggle('secondary', item !== button);
}
automatic.addEventListener('click', () => {
  const destination = resolveIndexpresseDestination({query: queryInput.value,
    originalQuery, publication, from: params.get('from'), registry: verifiedLinks});
  if (!destination) return;
  window.open(destination.url, '_blank', 'noopener,noreferrer');
  const note = document.querySelector('#automaticStatus');
  note.textContent = destination.kind === 'results'
    ? 'Pas de lien de lecture vérifié pour cet article : la recherche ciblée s’ouvre. Choisissez le résultat correspondant.'
    : destination.kind === 'dossier'
      ? 'Le dossier papier associé s’ouvre. Il peut réunir plusieurs articles : vérifiez le titre et les pages.'
      : 'L’article associé s’ouvre. Vérifiez le titre et la date.';
  note.hidden = false;
  prioritize(targeted.disabled ? openOnly : targeted);
});
targeted.addEventListener('click', () => {
  const url = buildIndexpresseSearch({query: queryInput.value, publication});
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
  // noopener can return null even when the new tab has opened.
  status.textContent = 'Recherche demandée dans le journal sélectionné. Vérifiez le titre et la date ; certains articles peuvent être absents de l’index.';
  prioritize(openOnly);
});
document.querySelector('#copyQuery').addEventListener('click', async () => {
  const feedback = document.querySelector('#copyStatus');
  let copied = false;
  try { await navigator.clipboard.writeText(preview.textContent); copied = true; } catch {
    const input = document.createElement('textarea');
    input.value = preview.textContent; input.style.position = 'fixed'; input.style.left = '-9999px';
    document.body.append(input); input.select();
    try { copied = document.execCommand('copy'); } catch {} finally { input.remove(); }
  }
  feedback.textContent = copied ? 'Copié' : 'Copie impossible : sélectionnez le texte.';
  clearTimeout(copyTimer); copyTimer = setTimeout(() => { feedback.textContent = ''; }, 2200);
});
document.querySelector('#openSearchParameters').addEventListener('click', () => dialog.showModal());
document.querySelector('#closeSearchParameters').addEventListener('click', () => dialog.close());
document.querySelector('#applyQuery').addEventListener('click', () => { updateQuery(); dialog.close(); });
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
updateQuery();
try {
  const [response, links] = await Promise.all([
    fetch('../data/indexpresse-business-link-sources.json'),
    fetch('../data/indexpresse-verified-links.json')
      .then(response => response.ok ? response.json() : null).catch(() => null),
  ]);
  verifiedLinks = links;
  if (!response.ok) throw new Error('Source registry unavailable');
  const registry = await response.json();
  const source = registry.sources.find(item => item.publicationCode === params.get('publication'));
  if (!source) throw new Error('Unknown publication');
  publication = source.publicationCode;
  document.querySelector('#indexpresseTitle').textContent = source.title;
  document.querySelector('#sourceFilter').textContent = `Journal ciblé : ${source.title}`;
  if (source.iconUrl?.startsWith('./assets/')) {
    const img = document.createElement('img');
    img.src = `../${source.iconUrl.slice(2)}`; img.alt = source.title;
    document.querySelector('#journalLogo').append(img);
    document.querySelector('#journalLogo').hidden = false;
    document.querySelector('#journalSeparator').hidden = false;
  }
  updateQuery();
} catch {
  status.textContent = 'Journal non reconnu ou liste indisponible. Vous pouvez ouvrir IndexPresse et rechercher manuellement.';
}
