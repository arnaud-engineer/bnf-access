# Backlog produit

Ce document rassemble les pistes a explorer plus tard. Il sert de brouillon structure, pas de promesse de livraison.

## Profil utilisateur local avance

Objectif : permettre a l'utilisateur de personnaliser l'interface selon ses droits et ses usages, sans creer de compte et sans envoyer ces informations a un serveur.

Preferences envisagees :

- type de Pass BnF : Lecture/Culture, Recherche illimite, autre situation a definir ;
- modes d'acces utiles : distant, distant sous condition, sur place, acces libre ;
- langues lues ou parlees ;
- centres d'interet ou disciplines principales ;
- ressources a masquer durablement ;
- ressources a mettre en avant au-dela des favoris manuels.

Principes :

- stocker ces informations localement dans le navigateur ;
- afficher clairement que ces preferences restent locales ;
- prevoir une option de reinitialisation ;
- eviter tout vocabulaire laissant penser a un compte BNF Access ;
- ne jamais demander d'identifiants BnF.

Questions ouvertes :

- faut-il un assistant de premiere configuration ou un simple panneau de preferences ?
- faut-il proposer plusieurs profils locaux sur le meme navigateur ?
- comment concilier filtres automatiques et exploration libre des ressources ?
- faut-il pouvoir exporter/importer ses favoris et preferences ?

## Detection du reseau BnF

Objectif : signaler plus clairement a l'utilisateur s'il semble consulter BNF Access depuis un reseau BnF.

Piste d'interface :

- conserver le badge jaune pour les ressources qui peuvent ne pas etre accessibles hors site ;
- afficher un badge vert avec coche pour les ressources sur place uniquement lorsque l'utilisateur semble etre sur un reseau BnF ;
- garder un affichage prudent pour les acces distants sous condition, car ils peuvent demander une procedure meme sur place.

Contraintes techniques :

- les plages IP BnF sont stockees dans `public/bnf-network.json` ;
- aucune plage IP ne doit etre dupliquee en dur dans `app.js` ;
- le frontend statique ne peut pas determiner seul l'IP publique de l'utilisateur ;
- une implementation propre demanderait un endpoint minimal qui renvoie seulement un statut, par exemple `onBnfNetwork: true/false`.

Contraintes de vie privee :

- ne pas appeler de service tiers de detection IP sans action explicite de l'utilisateur ;
- ne pas journaliser l'adresse IP ;
- documenter clairement ce qui est teste et ce qui ne l'est pas ;
- presenter le resultat comme un indice, pas comme une garantie d'acces.

## Amelioration des recommandations

Objectif : rendre les ressources specialisees plus trouvables sans noyer les ressources grand public.

Pistes :

- suggerer des ressources selon les langues et disciplines indiquees dans le profil local ;
- proposer des collections predefinies : presse, dictionnaires, droit, musique, arts, sciences humaines, bibliographies ;
- afficher une section de ressources recemment ajoutees ou corrigees ;
- permettre de masquer les ressources manifestement inutiles pour son usage.

## Donnees et maintenance

Objectif : garder une base fiable sans rendre la maintenance infernale.

Pistes :

- noter la date de verification par ressource ;
- distinguer plus explicitement donnees officielles BnF, corrections locales et hypotheses ;
- garder un historique lisible des changements importants de conditions d'acces ;
- prevoir une checklist de verification avant publication.
