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

Chaque entrée de `resources.json` contient :

- `id` : identifiant stable.
- `name` : nom affiché.
- `category` : catégorie d'affichage.
- `description` : courte description originale.
- `url` : lien à ouvrir.
- `access_mode` : mode d'accès normalisé pour l'interface (`remote`, `remote_conditional`, `onsite`, `free`).
- `access_label` : libellé affichable du mode d'accès.
- `access_source` : origine du classement (`bnf_official`, `bnf_official_manual_override` ou `local_inference`).
- `access_note` : précision courte, surtout pour les accès sous condition ou les classements inférés.
- `remote` : booléen dérivé conservé pour compatibilité interne.
- `access` : conditions de profil connues (`pass_lecture_culture`, `pass_recherche_illimite`, `public`, etc.).
- `tags` : tags pour la recherche.
- `icon_url` : logo public optionnel, quand il existe dans les traces archivées.
- `fallback_label` : abréviation optionnelle à afficher quand aucun `icon_url` n'est disponible.
- `default_favorite` : favori proposé à la première ouverture, avant personnalisation locale.
- `notes` : détails pratiques, si nécessaire.

Les sources communes sont conservées au niveau racine du JSON, dans `sources`, plutôt que répétées dans chaque ressource.

## Import initial

L'import initial couvre les 245 ressources presentes dans l'archive EasyBNF du 29 juillet 2026. Les descriptions affichees sont courtes et propres au projet ; les textes longs d'origine ne sont pas recopies dans l'interface.

Onze logos ont pu être rapatriés localement depuis les traces archivées ou des sources publiques. Tous sont désormais servis en SVG local ; MusicMe et Encyclopædia Universalis utilisent des vectorisations générées depuis les PNG sources, faute de SVG officiel fiable identifié. Les autres ressources utilisent un bloc d'initiales généré par l'interface.

Si une ressource n'a pas de logo mais nécessite une abréviation plus lisible que les initiales automatiques, elle peut définir `fallback_label`. Exemple : `Academic Search Premier` utilise `fallback_label: "ASP"` au lieu du `AS` généré depuis les deux premiers mots.

## Favoris locaux

Les favoris sont stockés dans `localStorage`, sous une clé versionnée. À la première ouverture, l'application initialise cette liste avec les ressources marquées `default_favorite` dans le JSON. Ensuite, les choix de l'utilisateur priment sur les valeurs par défaut.

Ce fonctionnement évite tout compte utilisateur et toute collecte d'identifiants, tout en donnant une page d'accueil plus utile.

Les favoris alimentent aussi une barre de lancement rapide en haut de page. Cette barre n'affiche que l'icone ou les initiales de chaque ressource favorite, et ouvre directement la ressource.

Par défaut, cette barre reste triée alphabétiquement. Si l'utilisateur passe en mode modification et enregistre un ordre manuel, cet ordre est stocké localement. Les favoris ajoutés ensuite sont placés en fin de liste. Le bouton `Tri alphabétique` supprime l'ordre manuel et revient au tri alphabétique.

## Filtres de profil

L'utilisateur peut filtrer les ressources selon son Pass et selon le mode d'accès :

- tous les profils ;
- Pass Lecture/Culture ;
- Pass Recherche illimité ;
- accès à distance ;
- accès à distance sous condition ;
- accès sur place uniquement ;
- accès libre.

Ces choix sont stockés dans `localStorage`. Les ressources sans étiquette de Pass explicite sont masquées lorsqu'un Pass précis est sélectionné, pour éviter de promettre un accès non vérifié.

Les ressources en accès libre restent visibles quel que soit le Pass sélectionné, puisqu'elles ne dépendent pas d'un droit BnF particulier.

Exception : lorsqu'un utilisateur filtre explicitement sur les ressources `sur place`, les ressources sur place sans étiquette de Pass restent visibles. Dans l'archive source, beaucoup de ressources sur place ne portent pas de métadonnée de Pass exploitable.

## Points de contrôle

- Validite actuelle de chaque lien BnF.
- Conditions d'accès exactes selon les Pass.
- Ressources qui ne sont accessibles que sur place.
- Ressources dont l'accès distant a changé depuis les captures EasyBNF.
- Cas speciaux comme New York Times, PressReader ou Europresse.
