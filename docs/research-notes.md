# Notes de recherche

## EasyBNF

EasyBNF etait un site non officiel permettant d'acceder plus facilement aux ressources numeriques de la BnF, notamment sur mobile.

Les captures archivees montrent une application front statique :

- une page HTML ;
- un bundle JavaScript ;
- un fichier CSS ;
- des icones ;
- un fichier `resources.json` listant les ressources.

Le footer credite `@jeremypgn` et precise que le site n'est pas affilie a la BnF. Aucun depot source public officiel n'a ete retrouve.

## Disponibilite

Bornes observees :

- Dernieres traces positives Wayback fin juillet 2026.
- Premier signal social clair trouve le 11 aout 2026, indiquant que le site etait inaccessible depuis plusieurs jours.
- Etat actuel du domaine : blocage au niveau DNS/registre, avec statut RDAP `server hold`.

Estimation prudente : panne probablement apparue entre le 31 juillet et le 11 aout 2026, possiblement autour du 7-10 aout.

## Depots publics voisins

Plusieurs projets publics existent autour du meme besoin, sans etre le code original d'EasyBNF :

- `MarcBrillault/easybnf-redirect` : extension Firefox de redirection vers les acces BnF, GPL-3.0.
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

