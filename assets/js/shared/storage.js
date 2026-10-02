// Browsing must remain possible when local storage is denied or full.
export function readStoredValue(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStoredValue(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Persistence is optional; the in-memory setting still takes effect.
  }
}
