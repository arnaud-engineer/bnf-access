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

## Acces BnF via EZproxy

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
2. EZproxy verifie si une session BnF existe.
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

Cette forme renvoie elle aussi vers le login BnF si l'utilisateur n'est pas deja authentifie.

Pour le JSON, on privilegie pour l'instant la forme explicite `login?url=...`, plus lisible et proche des liens observes dans EasyBNF.

## Structure des ressources

Chaque entree de `resources.json` contient :

- `id` : identifiant stable.
- `name` : nom affiche.
- `category` : categorie d'affichage.
- `description` : courte description originale.
- `url` : lien a ouvrir.
- `remote` : acces distant possible ou non.
- `access` : conditions d'acces connues.
- `tags` : tags pour la recherche.
- `source` : page source ou reference utile.
- `source_archive` : trace publique archivee utilisee pour l'import initial.
- `icon_url` : logo public optionnel, quand il existe dans les traces archivees.
- `default_favorite` : favori propose a la premiere ouverture, avant personnalisation locale.
- `notes` : details pratiques, si necessaire.

## Import initial

L'import initial couvre les 245 ressources presentes dans l'archive EasyBNF du 29 juillet 2026. Les descriptions affichees sont courtes et propres au projet ; les textes longs d'origine ne sont pas recopies dans l'interface.

Onze logos ont pu etre rapatries localement depuis les traces archivees. Les autres ressources utilisent un bloc d'initiales genere par l'interface.

## Favoris locaux

Les favoris sont stockes dans `localStorage`, sous une cle versionnee. A la premiere ouverture, l'application initialise cette liste avec les ressources marquees `default_favorite` dans le JSON. Ensuite, les choix de l'utilisateur priment sur les valeurs par defaut.

Ce fonctionnement evite tout compte utilisateur et toute collecte d'identifiants, tout en donnant une page d'accueil plus utile.

Les favoris alimentent aussi une barre de lancement rapide en haut de page. Cette barre n'affiche que l'icone ou les initiales de chaque ressource favorite, et ouvre directement la ressource.

Par defaut, cette barre reste triee alphabetiquement. Si l'utilisateur passe en mode modification et enregistre un ordre manuel, cet ordre est stocke localement. Les favoris ajoutes ensuite sont places en fin de liste. Le bouton `Tri alphabetique` supprime l'ordre manuel et revient au tri alphabetique.

## Points a verifier

- Validite actuelle de chaque lien BnF.
- Conditions d'acces exactes selon les Pass.
- Ressources qui ne sont accessibles que sur place.
- Ressources dont l'acces distant a change depuis les captures EasyBNF.
- Cas speciaux comme New York Times, PressReader ou Europresse.
