import lexicon from "./europresse-elision-lexicon.mjs?v=1";

const nouns = new Set(lexicon.nouns.split(" "));
const verbs = new Set(lexicon.verbs.split(" "));
const intact = new Set(lexicon.intact.split(" "));
const negatives = new Set(["pas", "plus", "jamais"]);
const prepositions = new Set(["a", "de", "pour", "sur", "dans", "avec", "sans"]);
const monetaryAmounts = new Set(["cent", "cents", "mille", "milles", "million", "millions", "milliard", "milliards"]);

const fold = value => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/œ/g, "oe").replace(/æ/g, "ae");

// Negation provides grammatical evidence; ambiguous names are never rewritten.
export function analyseEuropresseUrlElisions(title, selectedWords) {
  const tokens = String(title).match(/[\p{L}\p{N}]+/gu) || [];
  const comparable = tokens.map(fold);
  const decisions = [];
  for (const word of String(selectedWords).split(/\s+/).filter(Boolean)) {
    const plain = fold(word);
    const index = comparable.indexOf(plain);
    const match = plain.match(/^(qu|[ldns])([aeiouh][a-z]{2,})$/);
    const decision = {original: word, word, action: "keep", reason: "unchanged"};
    // A collapsed l'/d' before a model code is ambiguous; never guess its spelling.
    if (index >= 0 && /^[ld][ae]\d{2,4}$/.test(plain)) {
      decision.action = "ambiguous-model";
      decision.reason = "possible-model-elision";
      decisions.push(decision);
      continue;
    }
    // Exact common contraction only; do not infer elisions from arbitrary l-prefixes.
    if (plain === "lautre" && index >= 0) {
      decision.word = word.slice(1);
      decision.action = "normalize";
      decision.reason = "literal-lautre";
      decisions.push(decision);
      continue;
    }
    if (!match || intact.has(plain) || index < 0) {
      decisions.push(decision);
      continue;
    }
    const [, prefix, remainder] = match;
    const occurrences = comparable.map((token, position) => token === plain ? position : -1).filter(position => position >= 0);
    const monetaryElision = plain === "deuros" && occurrences.every(position => {
      const amount = comparable[position - 1] || "";
      return /^\d+$/.test(amount) || monetaryAmounts.has(amount);
    });
    const negativeVerb = prefix === "n" && (verbs.has(remainder)
      || /^(?:(?:acced|arriv|exist|entr)(?:e|es|ent|ait|aient|era|eront)|obtient|obtiennent)$/.test(remainder))
      && occurrences.every(position => negatives.has(comparable[position + 1]));
    const articleNoun = prefix === "l" && nouns.has(remainder)
      && prepositions.has(comparable[index - 1]);
    if (monetaryElision) {
      decision.word = word.slice(1);
      decision.action = "normalize";
      decision.reason = "euro-after-monetary-amount";
    } else if (negativeVerb) {
      decision.word = word.slice(prefix.length);
      decision.action = "split";
      decision.reason = "lexicon-verb-and-negation";
    } else if (prefix === "s" && verbs.has(remainder)) {
      decision.action = "ambiguous-reflexive";
      decision.reason = "possible-reflexive-verb-elision";
    } else if (articleNoun || nouns.has(remainder) || verbs.has(remainder)) {
      // An unknown proper name is not evidence of an elision: never drop it here.
      decision.reason = "ambiguous-preserved";
    }
    decisions.push(decision);
  }
  return {words: [...new Set(decisions.map(item => item.word))].join(" "), decisions};
}

export function arbitrateEuropresseUrlWords(title, selectedWords, {allowUnknown = false} = {}) {
  const analysed = analyseEuropresseUrlElisions(title, selectedWords);
  // Earlier display normalization may already have split a contraction from the slug.
  const rawTokens = String(title).match(/[\p{L}\p{N}]+/gu) || [];
  const recovered = analyseEuropresseUrlElisions(title, rawTokens.join(" ")).decisions;
  const decisions = analysed.decisions.map(item => {
    if (item.reason === "unchanged") {
      const candidates = recovered.filter(candidate => ["split", "normalize"].includes(candidate.action)
        && fold(candidate.word) === fold(item.word));
      if (candidates.length === 1) item = candidates[0];
    }
    const possible = ["split", "normalize", "ambiguous-model", "ambiguous-reflexive"].includes(item.action)
      || item.reason === "ambiguous-preserved";
    if (!possible) return item;
    const prefix = fold(item.original).match(/^(qu|[ldns])/u)?.[1];
    const suffix = item.action === "split" || item.action === "normalize"
      ? item.word : item.original.slice(prefix?.length || 0);
    if (!prefix || suffix.length < 3) return item;
    // One whitespace-free unit keeps alternatives together during URL length fitting.
    return {...item, word: `(${item.original}|${suffix})`, alternatives: [item.original, suffix],
      action: "alternatives", reason: "targeted-elision-alternatives"};
  });
  if (allowUnknown) {
    const candidates = decisions.filter(item => item.action === "keep" && item.reason === "unchanged"
      && !intact.has(fold(item.original)) && rawTokens.some(token => fold(token) === fold(item.original))
      && /^[ld][aeiouyh][a-z]{3,}$/u.test(fold(item.original)));
    const candidateWords = new Set(candidates.map(item => fold(item.word)));
    const anchors = [...new Set(decisions.filter(item => !item.alternatives
      && /^[\p{L}]+$/u.test(item.word) && !candidateWords.has(fold(item.word)))
      .map(item => fold(item.word)).filter(word => word.length >= 4))];
    // Private design note: three unchanged anchors, including two long ones; one new pair only.
    const targeted = anchors.length >= 3 && anchors.filter(word => word.length >= 7).length >= 2;
    candidates.forEach((item, index) => {
      item.reason = targeted ? "unknown-elision-pair-limit" : "unknown-elision-insufficient-anchors";
      if (targeted && index === 0) {
        const suffix = item.original.slice(1);
        item.word = `(${item.original}|${suffix})`;
        item.alternatives = [item.original, suffix];
        item.action = "alternatives";
        item.reason = "unknown-elision-targeted-anchors";
      }
    });
  }
  return {words: [...new Set(decisions.map(item => item.word).filter(Boolean))].join(" "), decisions};
}
