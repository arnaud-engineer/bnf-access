const institution = /universit|institut|collectif|committee|association|society|société|societe|organisation|organization|press|éditions|editions|\b(?:CNRS|UNESCO|OECD|OCDE)\b/i;
const suffix = /^(?:jr\.?|sr\.?|junior|senior|dir\.?|ed\.?|éditeur|editeur|editor)$/i;

// Only all-uppercase words change case: retain supplied McDonald/de la Cruz spellings.
export function displayPersonName(raw, invert = true) {
  let value = raw.replace(/\s+/g, ' ').trim();
  if (institution.test(value)) return value;
  const parts = value.split(',').map(part => part.trim());
  if (invert && parts.length === 2 && parts.every(Boolean) && !suffix.test(parts[1]) && !/[0-9;()]/.test(value)) {
    value = `${parts[1]} ${parts[0]}`;
  }
  return value.replace(/\p{L}[\p{L}\p{M}]*/gu, word => {
    if (word !== word.toLocaleUpperCase('fr') || word === word.toLocaleLowerCase('fr')) return word;
    const lower = word.toLocaleLowerCase('fr');
    return lower[0].toLocaleUpperCase('fr') + lower.slice(1);
  });
}
