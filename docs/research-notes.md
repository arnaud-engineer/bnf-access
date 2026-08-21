# Notes de recherche

## EasyBNF

EasyBNF était un site non officiel permettant d'accéder plus facilement aux ressources numériques de la BnF, notamment sur mobile.

Les captures archivées montrent une application front statique :

- une page HTML ;
- un bundle JavaScript ;
- un fichier CSS ;
- des icones ;
- un fichier `resources.json` listant les ressources.

Le footer crédite `@jeremypgn` et précise que le site n'est pas affilié à la BnF. Aucun dépôt source public officiel n'a été retrouvé.

## Disponibilite

Bornes observees :

- Dernieres traces positives Wayback fin juillet 2026.
- Premier signal social clair trouvé le 11 août 2026, indiquant que le site était inaccessible depuis plusieurs jours.
- Etat actuel du domaine : blocage au niveau DNS/registre, avec statut RDAP `server hold`.

Estimation prudente : panne probablement apparue entre le 31 juillet et le 11 août 2026, possiblement autour du 7-10 août.

## Depots publics voisins

Plusieurs projets publics existent autour du meme besoin, sans etre le code original d'EasyBNF :

- `MarcBrillault/easybnf-redirect` : extension Firefox de redirection vers les accès BnF, GPL-3.0.
- `lovasoa/ophirofox` : extension pour faciliter la lecture via Europresse, MPL-2.0.
- `telary-agency/bnf` : page statique GitHub Pages orientee ressources BnF/PressReader.
- `Klaushart/Easy-BNF` : page statique creee apres la panne apparente d'EasyBNF, sans licence visible au moment de la recherche.

## Positionnement du nouveau projet

Le projet doit etre presente comme une page de secours communautaire et non officielle :

- ne pas reprendre l'identite EasyBNF ;
- ne pas se presenter comme un service BnF ;
- ne jamais collecter les identifiants ;
- sourcer les liens ;
- preferer des descriptions originales et courtes ;
- garder une structure ouverte aux corrections.
