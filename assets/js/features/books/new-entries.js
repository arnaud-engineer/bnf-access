import {catalogueBaseline} from './catalogue-baseline.js?v=2026-10-12-healthscience1';

const stringIds = new Map(Object.entries(catalogueBaseline).map(([prefix, group]) => [prefix, new Set(group.strings)]));

export function isExistingBookSource(id) {
  const split = String(id ?? '').lastIndexOf(':');
  const prefix = String(id ?? '').slice(0, split + 1), suffix = String(id ?? '').slice(split + 1);
  const group = catalogueBaseline[prefix];
  if (!group) return false;
  if (stringIds.get(prefix).has(suffix)) return true;
  if (!/^(?:0|[1-9]\d*)$/.test(suffix) || !Number.isSafeInteger(Number(suffix))) return false;
  const number = Number(suffix), ranges = group.ranges;
  let low = 0, high = ranges.length / 2 - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2), start = ranges[mid * 2], end = ranges[mid * 2 + 1];
    if (number < start) high = mid - 1;
    else if (number > end) low = mid + 1;
    else return true;
  }
  return false;
}

export function isNewBookEntry(variants) {
  return variants.length > 0 && variants.every(v => v.source_id && !isExistingBookSource(v.source_id));
}

export function compareBookFamilies(a, b) {
  if (a === b) return 0;
  if (a === 'Nouveautés') return 1;
  if (b === 'Nouveautés') return -1;
  if (a === 'Non classés') return 1;
  if (b === 'Non classés') return -1;
  return a.localeCompare(b, 'fr');
}
