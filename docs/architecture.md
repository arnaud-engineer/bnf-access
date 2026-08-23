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
- `secondary_categories` : catégories secondaires optionnelles. Elles permettent à une ressource d'apparaître dans plusieurs filtres sans changer sa catégorie principale.
- `description` : courte description originale.
- `url` : lien à ouvrir.
- `access_mode` : mode d'accès normalisé pour l'interface (`remote`, `remote_conditional`, `onsite`, `free`).
- `access_label` : libellé affichable du mode d'accès.
- `access_source` : origine du classement (`bnf_official`, `bnf_official_manual_override` ou `local_inference`).
- `access_note` : précision courte, surtout pour les accès sous condition ou les classements inférés.
- `access_instruction` : consigne courte affichée sous la description quand une procédure particulière est nécessaire. Elle peut contenir un tableau `links` avec `label` et `url`.
- `remote` : booléen dérivé conservé pour compatibilité interne.
- `access` : conditions de profil connues (`pass_lecture_culture`, `pass_recherche_illimite`, `public`, etc.).
- `tags` : tags pour la recherche.
- `icon_url` : logo public optionnel, quand il existe dans les traces archivées.
- `icon_background_color` : couleur hexadécimale optionnelle utilisée pour recolorer le fond principal d'un logo SVG local. Le champ est ignoré pour les images non SVG ou les valeurs invalides.
- `fallback_label` : abréviation optionnelle à afficher quand aucun `icon_url` n'est disponible.
- `default_favorite` : favori proposé à la première ouverture, avant personnalisation locale.
- `notes` : détails pratiques, si nécessaire.

Les sources communes sont conservées au niveau racine du JSON, dans `sources`, plutôt que répétées dans chaque ressource.

## Taxonomie des ressources

Chaque ressource porte une categorie principale unique dans `resources.json`. Cette categorie sert au filtre visible dans l'interface : elle doit donc correspondre a l'endroit ou un utilisateur s'attendrait d'abord a trouver la ressource, plutot qu'a tous les sujets couverts.

Une ressource peut aussi définir `secondary_categories` lorsqu'elle relève clairement de deux usages. Dans ce cas, elle apparaît dans les filtres de sa catégorie principale et de ses catégories secondaires, mais le premier badge reste sa catégorie principale. Exemple : `Bellefaye` reste dans `Musique / Cinéma / Spectacle`, tout en apparaissant aussi dans `Catalogues / Annuaires`.

Les categories actuellement retenues sont :

- Presse ;
- Dicos / Encyclopédies ;
- Catalogues / Annuaires ;
- Pluridisciplinaires ;
- Langues / Lettres ;
- Histoire / Géo ;
- Sciences Humaines / Sociales ;
- Arts / Images ;
- Musique / Cinéma / Spectacle ;
- Droit / Économie ;
- Sciences / Santé.

Les ressources très spécialisées sont classees selon leur usage dominant. Par exemple, une bibliographie de psychologie relève des sciences humaines et sociales, tandis qu'un catalogue collectif ou un répertoire de périodiques relève plutôt de `Catalogues / Annuaires`.

L'ordre d'affichage des filtres est défini dans `categoryOrder` dans `public/app.js`. Les catégories non prévues restent affichées automatiquement en fin de liste par ordre alphabétique.

## Import initial

L'import initial couvre les 245 ressources presentes dans l'archive EasyBNF du 29 juillet 2026. Les descriptions affichees sont courtes et propres au projet ; les textes longs d'origine ne sont pas recopies dans l'interface.

Plusieurs logos ont pu être rapatriés ou recréés localement depuis les traces archivées, des sources publiques ou des fichiers fournis pour la maquette. La majorité est servie en SVG local ; MusicMe, Encyclopædia Universalis, Academic Search Premier, Année philologique et Aida utilisent des vectorisations générées ou recréées depuis les images sources, faute de SVG officiel fiable identifié. AFP Forum utilise le logo vectoriel public de l'Agence France-Presse ; Agricola utilise le logo vectoriel public de l'USDA. Worldcat utilise le pictogramme extrait du logo vectoriel public. Acta Sanctorum, ABSEEES et Littré utilisent des marques typographiques originales faute de logo officiel autonome identifié. RetroNews utilise un SVG local fourni. Mascarille et American National Biography utilisent des WebP transparents optimisés pour conserver les formes des visuels sources. Certaines familles de ressources, notamment ProQuest et EBSCO, conservent aussi un logo éditeur recoloré quand aucun logo autonome satisfaisant n'a été validé. Les autres ressources utilisent un bloc d'initiales généré par l'interface.

Si une ressource n'a pas de logo, ou si son logo doit être retiré plus tard, elle peut définir `fallback_label` pour contrôler l'abréviation affichée. Exemple : `Academic Search Premier` utilise `fallback_label: "ASP"` au lieu du `AS` généré depuis les deux premiers mots.

Quand plusieurs ressources partagent le même SVG, `icon_background_color` permet de les distinguer visuellement sans dupliquer le fichier. L'interface garde l'image originale comme secours, puis tente de charger le SVG inline et de remplacer sa couleur principale.

## Favoris locaux

Les favoris sont stockés dans `localStorage`, sous une clé versionnée. À la première ouverture, l'application initialise cette liste avec les ressources marquées `default_favorite` dans le JSON. Ensuite, les choix de l'utilisateur priment sur les valeurs par défaut.

Ce fonctionnement évite tout compte utilisateur et toute collecte d'identifiants, tout en donnant une page d'accueil plus utile.

Les favoris alimentent aussi une barre de lancement rapide en haut de page. Cette barre n'affiche que l'icone ou les initiales de chaque ressource favorite, et ouvre directement la ressource.

Par défaut, cette barre reste triée alphabétiquement. Si l'utilisateur passe en mode modification et enregistre un ordre réellement différent du tri alphabétique, cet ordre est stocké localement. Les favoris ajoutés ensuite sont placés en fin de liste. Le bouton `Tri alphabétique` supprime l'ordre manuel et revient au tri alphabétique.

## Filtres de profil

L'utilisateur peut filtrer les ressources selon son Pass et selon le mode d'accès :

- tous les profils ;
- Pass Lecture/Culture ;
- Pass Recherche illimité ;
- sans Pass BnF ;
- accès à distance ;
- accès sur place uniquement.

Ces choix sont stockés dans `localStorage`. Chaque ressource déclare explicitement son profil d'accès dans `access` :

- `pass_lecture_culture` ;
- `pass_recherche_illimite` ;
- `public`, pour les ressources libres sur Internet.

Les ressources en accès libre restent visibles quel que soit le Pass sélectionné, puisqu'elles ne dépendent pas d'un droit BnF particulier.

Le profil `Sans Pass BnF` isole uniquement les ressources déclarées `public`.

Pour les ressources uniquement consultables sur place, l'annuaire BnF indique l'accès à la BnF sans distinguer les droits par type de Pass. Elles sont donc taguées avec les deux Pass annuels lorsque l'annuaire ne précise pas de restriction plus fine.

Le filtre d'accès `À distance` regroupe les ressources `remote`, `remote_conditional` et `free`. Les cartes continuent d'afficher le mode précis avec leur badge : accès distant, accès distant sous condition ou accès libre.

## Detection reseau BnF

Les plages IP publiques identifiees comme appartenant a la BnF sont stockees dans `public/bnf-network.json`. Elles ne doivent pas etre dupliquees en dur dans le code JavaScript.

Une detection automatique fiable ne peut pas etre faite uniquement en frontend statique : le navigateur ne donne pas directement son IP publique. Si cette fonctionnalite est ajoutee plus tard, elle doit passer par un endpoint explicite qui compare l'IP de la requete aux plages du JSON et renvoie uniquement un statut minimal, par exemple `onBnfNetwork: true/false`, sans journaliser l'adresse IP.

Le resultat doit rester un indice pratique, pas une promesse absolue d'acces : les sorties reseau peuvent varier selon le site, le wifi, AVEC, les postes publics ou les proxys.

## Points de contrôle

- Validite actuelle de chaque lien BnF.
- Conditions d'accès exactes selon les Pass.
- Ressources qui ne sont accessibles que sur place.
- Ressources dont l'accès distant a changé depuis les captures EasyBNF.
- Cas speciaux comme New York Times, PressReader ou Europresse.
