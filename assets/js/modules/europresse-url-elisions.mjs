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
    const negativeVerb = prefix === "n" && verbs.has(remainder)
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
    } else if (articleNoun || nouns.has(remainder) || verbs.has(remainder)) {
      // An unknown proper name is not evidence of an elision: never drop it here.
      decision.reason = "ambiguous-preserved";
    }
    decisions.push(decision);
  }
  return {words: [...new Set(decisions.map(item => item.word))].join(" "), decisions};
}

const generic = new Set("les des une pour dans avec sur que qui pas plus est son ses cette cet mais alors tout tous voici nouveau nouvelle quand comment pourquoi trois deux fait faire avoir etre peut doit".split(" "));

export function arbitrateEuropresseUrlWords(title, selectedWords, {allowWildcards = false} = {}) {
  const analysed = analyseEuropresseUrlElisions(title, selectedWords);
  const reliable = analysed.decisions.filter(item => item.action !== "split");
  const distinct = reliable.filter(item => !generic.has(fold(item.word)) && !/^\d+$/.test(item.word));
  const enough = distinct.length >= 3 && distinct.filter(item => item.word.length >= 5).length >= 2;
  let wildcardUsed = false;
  const decisions = analysed.decisions.map(item => {
    if (item.action !== "split") return item;
    if (enough) return {...item, word: "", action: "omit", reason: "sufficient-reliable-words"};
    // Native form accepts '*', but Link transport remains unqualified (2026-10-06).
    if (!allowWildcards || wildcardUsed) return {...item, reason: "literal-verb-until-wildcard-transport-qualified"};
    // Only a known verb stem, never an arbitrary substring or unknown proper name.
    const stem = item.word.length >= 6 ? item.word.slice(0, -1) : item.word;
    wildcardUsed = true;
    return {...item, word: `${stem}*`, action: "wildcard", reason: "sparse-reliable-words"};
  });
  return {words: [...new Set(decisions.map(item => item.word).filter(Boolean))].join(" "), decisions};
}
