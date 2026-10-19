import {matchesReviewedEdition} from './cue-review.js?v=2026-10-15-cues1';
import {canonicalBookCategoryPaths} from './canonical-categories.js?v=2026-10-16-language-learning1';
import {reliabilityEditions} from './reliability-editions-20261016.js?v=2026-10-16-reliability2';

const decisions=new Map(reliabilityEditions.map(d=>[d.source_id,d]));
const matchesPath=(p,[family,subcategory,...details])=>p.family===family&&p.subcategory===subcategory
  &&JSON.stringify([...(p.details??[])].sort())===JSON.stringify([...details].sort());
export function reviewReliabilityPaths(paths,variants) {
  const approved=new Map(variants.filter(v=>matchesReviewedEdition(v,decisions.get(v.source_id)))
    .map(v=>[v.source_id,decisions.get(v.source_id)]));
  if(!approved.size)return paths;
  let changed=false;
  const result=paths.flatMap(path=>{
    const moved=(path.sourceIds??[]).filter(id=>approved.get(id)?.from.some(from=>matchesPath(path,from)));
    if(!moved.length)return [path];
    changed=true;
    const retainedSources=path.sourceIds.filter(id=>!moved.includes(id));
    return [
      ...(retainedSources.length?[{...path,sourceIds:retainedSources}]:[]),
      ...moved.flatMap(id=>approved.get(id).destinations.map(([family,subcategory,...details])=>({
        family,subcategory,...(details.length?{details}:{}),sourceIds:[id],
        ruleIds:[...new Set([...(path.ruleIds??[]),'reliability-reviewed-edition-20261016'])],
      }))),
    ];
  });
  return changed?canonicalBookCategoryPaths(result):paths;
}
