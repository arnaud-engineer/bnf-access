# Architecture et logique des liens

## Modele general

La version initiale suit le modele observe sur EasyBNF : une application web statique lit un fichier JSON de ressources et affiche une carte par ressource.

Il n'y a pas de serveur applicatif. Le navigateur ouvre directement les liens BnF.

```text
public/index.html
public/app.js
public/styles.css
public/resources.json
```

## Accès BnF via EZproxy

La plupart des liens distants utilisent EZproxy/OCLC, sous cette forme :

```text
https://bnf.idm.oclc.org/login?url=https://www.example.com/path
```

Exemple Mediapart :

```text
https://bnf.idm.oclc.org/login?url=http://www.mediapart.fr/licence
```

Comportement attendu :

1. L'utilisateur clique sur le lien.
2. EZproxy vérifié si une session BnF existe.
3. Si la session n'existe pas, EZproxy declenche l'authentification BnF via SAML/Shibboleth.
4. Apres connexion, EZproxy renvoie vers la ressource demandee.
5. Le fournisseur voit une connexion autorisee via l'environnement BnF.

## Variante par hostname proxifie

Certaines ressources peuvent aussi etre appelees via un hostname reecrit :

```text
https://www-mediapart-fr.bnf.idm.oclc.org/licence
https://www-arretsurimages-net.bnf.idm.oclc.org/
https://www-pressreader-com.bnf.idm.oclc.org/
```

Cette forme renvoie elle aussi vers le login BnF si l'utilisateur n'est pas déjà authentifié.

Pour le JSON, on privilegie pour l'instant la forme explicite `login?url=...`, plus lisible et proche des liens observes dans EasyBNF.

## Structure des ressources

Chaque entree de `resources.json` contient :

- `id` : identifiant stable.
- `name` : nom affiche.
- `category` : catégorie d'affichage.
- `description` : courte description originale.
- `url` : lien a ouvrir.
- `remote` : accès distant possible ou non.
- `access` : conditions d'accès connues.
- `tags` : tags pour la recherche.
- `source` : page source ou référence utile.
- `source_archive` : trace publique archivée utilisée pour l'import initial.
- `icon_url` : logo public optionnel, quand il existe dans les traces archivées.
- `default_favorite` : favori proposé à la première ouverture, avant personnalisation locale.
- `notes` : details pratiques, si necessaire.

## Import initial

L'import initial couvre les 245 ressources presentes dans l'archive EasyBNF du 29 juillet 2026. Les descriptions affichees sont courtes et propres au projet ; les textes longs d'origine ne sont pas recopies dans l'interface.

Onze logos ont pu être rapatriés localement depuis les traces archivées. Les autres ressources utilisent un bloc d'initiales genere par l'interface.

## Favoris locaux

Les favoris sont stockés dans `localStorage`, sous une clé versionnée. À la première ouverture, l'application initialise cette liste avec les ressources marquées `default_favorite` dans le JSON. Ensuite, les choix de l'utilisateur priment sur les valeurs par défaut.

Ce fonctionnement évite tout compte utilisateur et toute collecte d'identifiants, tout en donnant une page d'accueil plus utile.

Les favoris alimentent aussi une barre de lancement rapide en haut de page. Cette barre n'affiche que l'icone ou les initiales de chaque ressource favorite, et ouvre directement la ressource.

Par défaut, cette barre reste triée alphabétiquement. Si l'utilisateur passe en mode modification et enregistre un ordre manuel, cet ordre est stocké localement. Les favoris ajoutés ensuite sont placés en fin de liste. Le bouton `Tri alphabétique` supprime l'ordre manuel et revient au tri alphabétique.

## Filtres de profil

L'utilisateur peut filtrer les ressources selon son Pass et selon le mode d'accès :

- tous les Pass ;
- Pass Lecture/Culture ;
- Pass Recherche illimité ;
- accès a distance ;
- accès sur place.

Ces choix sont stockés dans `localStorage`. Les ressources sans étiquette de Pass explicite sont masquées lorsqu'un Pass précis est sélectionné, pour éviter de promettre un accès non vérifié.

Exception : lorsqu'un utilisateur filtre explicitement sur les ressources `sur place`, les ressources sur place sans étiquette de Pass restent visibles. Dans l'archive source, beaucoup de ressources sur place ne portent pas de métadonnée de Pass exploitable.

## Points a vérifiér

- Validite actuelle de chaque lien BnF.
- Conditions d'accès exactes selon les Pass.
- Ressources qui ne sont accessibles que sur place.
- Ressources dont l'accès distant a changé depuis les captures EasyBNF.
- Cas speciaux comme New York Times, PressReader ou Europresse.
