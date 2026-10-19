import {escapeHtml, escapeAttribute} from '../../shared/text.js';
import {getAccessBookmarkTitle} from '../catalog/access-links.js';

export function buildBrowserBookmarks(layout, getResource, getLinks) {
  let count = 0;
  let skipped = 0;
  const folder = (name, contents) => contents
    ? `<DT><H3>${escapeHtml(name)}</H3>\n<DL><p>\n${contents}</DL><p>\n` : '';
  const resource = id => {
    const entry = getResource(id);
    if (!entry) { skipped += 1; return ''; }
    const links = getLinks(entry).filter(link => {
      try { return ['http:', 'https:'].includes(new URL(link.url).protocol); }
      catch { return false; }
    });
    if (!links.length) { skipped += 1; return ''; }
    const contents = links.map(link => {
      count += 1;
      return `<DT><A HREF="${escapeAttribute(link.url)}">${escapeHtml(getAccessBookmarkTitle(entry.name, link, links.length))}</A>\n`;
    }).join('');
    return links.length > 1 ? folder(entry.name, contents) : contents;
  };
  const rows = (layout?.rows ?? []).map(row => {
    const contents = row.items.map(item => item.type === 'folder'
      ? folder(item.name || 'Dossier', item.resourceIds.map(resource).join(''))
      : resource(item.resourceId)).join('');
    return row.name ? folder(row.name, contents) : contents;
  }).join('');
  return {count, skipped, html: `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Favoris BnF Access</TITLE>
<H1>Favoris BnF Access</H1>
<DL><p>
${folder('BnF Access', rows)}</DL><p>\n`};
}
