export function countBy(items, getKey) {
  const counts = new Map();
  for (const item of items) {
    const key = getKey(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

// Count every supplied key, including repetitions; callers decide whether a
// record's keys should first be deduplicated. This preserves filter counters.
export function countByMany(items, getKeys) {
  const counts = new Map();
  for (const item of items) {
    for (const key of getKeys(item)) counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}
