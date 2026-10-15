const maximumBytes = 1024 * 1024;

function articleUrl(value, policy) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.hostname !== policy.host || url.username ||
      url.password || url.port || url.search || url.hash) throw new Error('URL non admissible');
  return url;
}

export function extractPublicArticleDate(html, value, policy, Parser = globalThis.DOMParser) {
  const source = articleUrl(value, policy);
  const doc = new Parser().parseFromString(html, 'text/html');
  const canonical = articleUrl(doc.querySelector('link[rel="canonical"]')?.getAttribute('href'), policy);
  if (canonical.href !== source.href) throw new Error('Article canonique different');
  const dates = [];
  for (const script of doc.querySelectorAll('script[type="application/ld+json"]')) {
    let nodes;
    try {
      const data = JSON.parse(script.textContent);
      nodes = Array.isArray(data) ? data : data?.['@graph'] || [data];
    } catch { continue; }
    for (const node of nodes) {
      if (!node || ![node['@type']].flat().includes('NewsArticle') || node.url !== source.href) continue;
      const raw = node.datePublished;
      if (typeof raw !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(raw)) continue;
      const instant = new Date(raw), day = raw.slice(0,10);
      if (!Number.isFinite(instant.getTime()) || day.startsWith('0000-') ||
          new Date(day+'T00:00:00Z').toISOString().slice(0,10) !== day) continue;
      const parts = new Intl.DateTimeFormat('en', {timeZone:policy.time_zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(instant);
      const part = name => parts.find(p=>p.type === name).value;
      dates.push(`${part('year')}-${part('month')}-${part('day')}`);
    }
  }
  const distinct = [...new Set(dates)];
  if (distinct.length !== 1) throw new Error('Date absente ou contradictoire');
  return {state:'ready',sourceUrl:source.href,date:distinct[0],provider:'publisher'};
}

export async function retrievePublicArticleDate(value, policy, {fetchImpl=globalThis.fetch, Parser=globalThis.DOMParser, timeoutMs=8000}={}) {
  let source;
  try { source=articleUrl(value,policy); } catch { return {state:'unavailable',message:'URL non admissible'}; }
  const controller = new AbortController();
  const timer = setTimeout(()=>controller.abort(),timeoutMs);
  try {
    const response = await fetchImpl(source.href,{mode:'cors',credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal});
    if (!response.ok || response.url !== source.href || !/^text\/html\b/i.test(response.headers.get('content-type') || '')) throw new Error('Reponse non admissible');
    if (Number(response.headers.get('content-length')) > maximumBytes) throw new Error('Reponse volumineuse');
    const reader=response.body.getReader(),chunks=[];
    let size=0;
    try {
      while (true) {
        const {done,value:chunk}=await reader.read();
        if (done) break;
        size+=chunk.byteLength;
        if (size>maximumBytes) throw new Error('Reponse volumineuse');
        chunks.push(chunk);
      }
    } finally { await reader.cancel().catch(()=>{}); }
    const bytes=new Uint8Array(size);
    let offset=0;
    for (const chunk of chunks) {bytes.set(chunk,offset);offset+=chunk.byteLength;}
    return extractPublicArticleDate(new TextDecoder().decode(bytes),source.href,policy,Parser);
  } catch { return {state:'unavailable',message:'Date publique non disponible ; recherche textuelle conservee.'}; }
  finally {clearTimeout(timer);}
}

export function createPublicArticleDateResolver(retrieve=retrievePublicArticleDate) {
  const cache=new Map();
  return (value,policy) => {
    const key=value+'\n'+JSON.stringify(policy);
    if (!cache.has(key)) {
      const result=Promise.resolve().then(()=>retrieve(value,policy)).catch(()=>({state:'unavailable'}));
      cache.set(key,result);
      if (cache.size>100) cache.delete(cache.keys().next().value);
    }
    return cache.get(key);
  };
}
