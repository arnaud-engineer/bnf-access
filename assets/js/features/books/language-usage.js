import {canonicalBookCategoryPaths} from './canonical-categories.js?v=2026-10-16-language-learning1';

// Final navigation regrouping, after the edition-guarded language decisions.
export function languageUsagePaths(paths) {
  let changed=false;
  const result=paths.flatMap(path=>{
    if(path.family!=='Langues et linguistique'||path.subcategory!=='Apprentissage des langues')return [path];
    changed=true;
    const {details,...base}=path;
    const remaining=(details??[]).filter(d=>d!=='Français');
    const ruleIds=[...new Set([...(path.ruleIds??[]),'language-usage-approved-20261016'])];
    return [
      ...(details?.includes('Français')?[{...base,subcategory:'Grammaire et orthographe',ruleIds}]:[]),
      ...(!details?.includes('Français')||remaining.length?[{...base,subcategory:'Langues étrangères',
        ...(details?{details:remaining}:{}),ruleIds}]:[]),
    ];
  });
  return changed?canonicalBookCategoryPaths(result):paths;
}
