import {matchesReviewedEdition} from './cue-review.js?v=2026-10-15-cues1';
import {canonicalBookCategoryPaths} from './canonical-categories.js?v=2026-10-16-language-learning1';
import {nonchemicalPendingEditions} from './nonchemical-pending-editions-20261016.js?v=2026-10-16-nonchemical1';

const decisions=new Map(nonchemicalPendingEditions.map(d=>[d.source_id,d]));
export function reviewNonchemicalPendingPaths(paths,variants) {
  const approved=new Map(variants.filter(v=>matchesReviewedEdition(v,decisions.get(v.source_id)))
    .map(v=>[v.source_id,decisions.get(v.source_id)]));
  if(!approved.size)return paths;
  let changed=false;
  const result=paths.flatMap(path=>{
    if(path.subcategory==='Chimie'||!path.details?.includes('À classer'))return [path];
    const moved=(path.sourceIds??[]).filter(id=>approved.get(id)?.from.some(([f,c])=>f===path.family&&c===path.subcategory));
    if(!moved.length)return [path];
    changed=true;
    const retainedSources=path.sourceIds.filter(id=>!moved.includes(id));
    const retainedDetails=path.details.filter(d=>d!=='À classer');
    return [
      ...(retainedSources.length?[{...path,sourceIds:retainedSources}]:[]),
      ...(retainedDetails.length?[{...path,sourceIds:moved,details:retainedDetails}]:[]),
      ...moved.flatMap(id=>approved.get(id).destinations.map(([family,subcategory,...details])=>({
        family,subcategory,...(details.length?{details}:{}),sourceIds:[id],
        ruleIds:[...new Set([...(path.ruleIds??[]),'nonchemical-pending-reviewed-edition-20261016'])],
      }))),
    ];
  });
  return changed?canonicalBookCategoryPaths(result):paths;
}
