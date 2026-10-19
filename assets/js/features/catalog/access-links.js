import {escapeHtml, escapeAttribute} from '../../shared/text.js';

function absoluteAccessUrl(value, baseUrl) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value, baseUrl);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

// Keep every catalogue action, regardless of the current listing filters.
export function collectAccessLinks(resource, actions, baseUrl) {
  const links = [];
  const seen = new Set();
  const editions = resource.edition_options?.length ? resource.edition_options : [null];
  const append = (link) => {
    const key = JSON.stringify([link.label, link.url, link.openUrl, link.sessionStartUrl]);
    if (!seen.has(key)) {
      seen.add(key);
      links.push(link);
    }
  };
  for (const edition of editions) {
    const entry = edition ? {...resource, edition_options: [edition]} : resource;
    for (const action of actions.getActions(entry)) {
      const openUrl = absoluteAccessUrl(actions.resolveActionHref(entry, action), baseUrl);
      if (!openUrl) continue;
      const sessionStartUrl = absoluteAccessUrl(actions.getSessionStartUrl(entry, action), baseUrl);
      // Session-dependent destinations need both the entry point and target.
      // The Open action still uses the existing transition/session machinery.
      const url = sessionStartUrl
        ? absoluteAccessUrl(actions.resolveActionUrl(entry, action), baseUrl)
        : openUrl;
      if (!url) continue;
      const provider = actions.getActionProviderLabel(action);
      const heading = [action.label || 'Accès', edition?.label].filter(Boolean).join(' · ');
      const providerLabel = provider === 'Accès direct' ? '' : provider;
      const label = [heading, providerLabel].filter(Boolean).join(' · ');
      const mode = action.access_mode || resource.access_mode;
      const access = action.access ?? resource.access ?? [];
      const freeAccess = mode === 'free' || access.includes('public');
      const requiresAuthentication = !freeAccess && Boolean(sessionStartUrl || /\.oclc\.org\//i.test(url)
        || ['remote', 'remote_conditional', 'mixed'].includes(mode));
      if (sessionStartUrl) append({
        label: `Initialiser l’accès · ${label}`, url: sessionStartUrl,
        heading: `Initialiser l’accès · ${heading}`, providerLabel,
        openUrl: sessionStartUrl, sessionStartUrl: '', requiresAuthentication,
      });
      append({label, heading, providerLabel, url, openUrl, sessionStartUrl, requiresAuthentication,
        description: sessionStartUrl ? 'Pour réutiliser ce lien, initialisez d’abord l’accès avec le lien précédent.' : ''});
    }
  }
  return links;
}

export function canShareAccessLink(data, environment = globalThis) {
  const navigator = environment.navigator;
  if (!environment.isSecureContext || typeof navigator?.share !== 'function'
    || typeof navigator.canShare !== 'function') return false;
  try {
    const policy = environment.document?.permissionsPolicy ?? environment.document?.featurePolicy;
    if (policy?.allowsFeature && !policy.allowsFeature('web-share')) return false;
    return navigator.canShare(data);
  } catch {
    return false;
  }
}

export function createAccessLinksDialog() {
  let dialog;
  let trigger;
  let generation = 0;
  let sharePending = false;

  function ensureDialog() {
    if (dialog) return;
    dialog = document.createElement('dialog');
    dialog.className = 'access-links-dialog';
    dialog.setAttribute('aria-labelledby', 'accessLinksTitle');
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll('button, a[href], input')]
        .filter(element => !element.disabled && !element.hidden && element.getClientRects().length);
      const first = controls[0];
      const last = controls.at(-1);
      if ((event.shiftKey && document.activeElement === first)
        || (!event.shiftKey && document.activeElement === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      }
    });
    dialog.addEventListener('close', () => {
      generation += 1;
      if (trigger?.isConnected) trigger.focus({preventScroll: true});
    });
    dialog.addEventListener('click', (event) => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right
        || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
    document.body.append(dialog);
  }

  async function copyUrl(url, field, status) {
    const currentGeneration = generation;
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        copied = true;
      }
    } catch {
      // A denied Clipboard permission can still allow the selection fallback.
    }
    if (currentGeneration !== generation || !dialog.open) return;
    if (!copied) {
      field.focus();
      field.select();
      try { copied = document.execCommand('copy'); } catch { /* Keep the URL selected. */ }
    }
    status.textContent = copied ? 'Lien copié !' : 'Copie impossible. Le lien est sélectionné : vous pouvez le copier manuellement.';
  }

  async function shareLink(data, button, status) {
    if (sharePending) return;
    const currentGeneration = generation;
    sharePending = true;
    button.disabled = true;
    status.textContent = '';
    try {
      await navigator.share(data);
      if (currentGeneration === generation && dialog.open) status.textContent = 'Lien transmis.';
    } catch (error) {
      if (error.name !== 'AbortError' && currentGeneration === generation && dialog.open) {
        status.textContent = 'Partage indisponible. Vous pouvez copier le lien.';
        button.hidden = true;
        button.closest('.access-link-entry').querySelector('input').focus();
      }
    } finally {
      sharePending = false;
      button.disabled = false;
    }
  }

  function open(name, links, sourceButton) {
    if (!links.length) return;
    ensureDialog();
    generation += 1;
    trigger = sourceButton;
    const shareData = links.map(link => ({title: `${name} — ${link.label}`, url: link.url}));
    const shareAvailable = shareData.map(data => canShareAccessLink(data));
    dialog.innerHTML = `
      <header class="settings-dialog-header">
        <div><h2 id="accessLinksTitle">Récupérer les liens d’accès</h2><p>${escapeHtml(name)}</p></div>
        <button type="button" class="settings-close" aria-label="Fermer" title="Fermer" autofocus>×</button>
      </header>
      <div class="access-links-content">
        ${links.map((link, index) => `
          <section class="access-link-entry" aria-labelledby="accessLinkLabel${index}">
            <h3 id="accessLinkLabel${index}"><a class="access-bookmark-link" href="${escapeAttribute(link.url)}" target="_blank" rel="noreferrer" draggable="true" title="${escapeAttribute(`Lien à conserver : ${name} — ${link.label}`)}">${escapeHtml(name)} — ${escapeHtml(link.heading || link.label)}</a>${link.providerLabel ? `<span class="access-link-provider"> · ${escapeHtml(link.providerLabel)}</span>` : ''}</h3>
            ${link.description ? `<p>${escapeHtml(link.description)}</p>` : ''}
            <div class="access-link-row">
              <input type="text" class="access-link-url" aria-labelledby="accessLinkLabel${index}" value="${escapeAttribute(link.url)}" readonly spellcheck="false">
              <div class="access-link-actions${shareAvailable[index] ? ' has-share' : ''}">
                <button type="button" data-copy-link="${index}" title="Copier le lien" aria-label="Copier : ${escapeAttribute(link.label)}"><span class="access-copy-icon" aria-hidden="true"></span></button>
                <a class="access-open-link" href="${escapeAttribute(link.openUrl)}" target="_blank" rel="noreferrer"${link.sessionStartUrl ? ` data-session-start="${escapeAttribute(link.sessionStartUrl)}" data-transition-href="${escapeAttribute(link.openUrl)}"` : ''} title="Ouvrir le lien" aria-label="Ouvrir : ${escapeAttribute(link.label)}"><span class="access-open-text">Ouvrir</span><span aria-hidden="true">↗</span></a>
                ${shareAvailable[index] ? `<button type="button" data-share-link="${index}" title="Partager le lien" aria-label="Partager : ${escapeAttribute(link.label)}"><span class="access-share-icon" aria-hidden="true"></span></button>` : ''}
              </div>
            </div>
            <p class="access-link-status" role="status" aria-live="polite"></p>
          </section>`).join('')}
        <p class="access-links-help">Vous pouvez conserver ces liens dans les favoris de votre navigateur et les réutiliser sans repasser par BnF Access.</p>
        <p class="access-links-help access-links-desktop-help">Affichez la barre de favoris de votre navigateur, puis faites glisser le titre souligné de l’accès vers cette barre. Vous conservez ainsi le lien BnF d’origine, sans ouvrir la ressource.</p>
        <p class="access-links-help access-links-mobile-help">Un appui long sur le titre souligné affiche les actions du navigateur. Partager, s’il est disponible, ouvre le panneau de partage. Pour conserver le lien exact, copiez-le, créez un favori depuis le menu du navigateur, puis modifiez son adresse pour y coller le lien.</p>
        ${links.some(link => link.requiresAuthentication) ? `<p class="access-links-help">${links.every(link => link.requiresAuthentication) ? 'L’accès nécessite une authentification BnF.' : 'Les accès non libres nécessitent une authentification BnF.'}</p>` : ''}
      </div>`;
    dialog.querySelector('.settings-close').addEventListener('click', () => dialog.close());
    dialog.querySelectorAll('[data-copy-link]').forEach(button => {
      const link = links[Number(button.dataset.copyLink)];
      const entry = button.closest('.access-link-entry');
      button.addEventListener('click', () => copyUrl(link.url, entry.querySelector('input'), entry.querySelector('[role="status"]')));
    });
    dialog.querySelectorAll('[data-share-link]').forEach(button => {
      button.addEventListener('click', () => shareLink(shareData[Number(button.dataset.shareLink)], button,
        button.closest('.access-link-entry').querySelector('[role="status"]')));
    });
    dialog.showModal();
  }

  return {open};
}
