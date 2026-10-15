const languages = [
  ['Java', /\bjava\b/i], ['C#', /\bc#/i], ['C++', /\bc\+\+/i],
  ['C', /\bc\b(?![#\+])/i], ['Python', /\b(?:micro)?python\b/i],
  ['VBA', /\bvba\b/i], ['JavaScript', /\b(?:javascript|typescript)\b|\bgoogle apps script\b/i],
  ['PHP', /\bphp\b/i],
  ['Kotlin', /\bkotlin\b/i], ['Dart', /\bdart\b/i], ['Go', /\bgolang\b|\blangage go\b/i],
  ['Rust', /\brust\b/i], ['Scala', /\bscala\b/i], ['COBOL', /\bcobol\b/i],
  ['MATLAB', /\bmatlab\b/i], ['Pascal / Delphi', /\b(?:pascal|delphi)\b/i],
  ['Assembleur', /\bassembleur\b/i], ['Shell', /\b(?:shell|bash|ksh)\b/i],
  ['PowerShell', /\bpowershell\b/i], ['Scratch', /\bscratch\b/i],
  ['R', /\blangage r\b|\ben r\b/i], ['Swift', /\bswift\b/i],
];

const miscellaneous = new Set(['COBOL', 'Dart', 'Go', 'Scala', 'Pascal / Delphi', 'MATLAB']);

export function programmingLanguages(title) {
  const text = String(title ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // Here the reference language in an algorithmics subtitle is useful too.
  const matches = languages.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
  if (/\.net\b/i.test(text)) matches.push('.NET');
  if (/\bandroid\b|\bjetpack compose\b/i.test(text)) matches.push('Android');
  // Framework defaults apply only when the title gives no explicit language.
  if (!matches.length && /\bqt\b/i.test(text)) matches.push('C++');
  if (!matches.length && /\bunity\b/i.test(text)) matches.push('C#');
  const groups = matches.map(language => language === 'C' || language === 'C++' ? 'C / C++'
    : language === 'Scratch' ? 'Généralités' : miscellaneous.has(language) ? 'Divers' : language);
  return groups.length ? [...new Set(groups)] : ['Généralités'];
}
