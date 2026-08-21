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
- `notes` : details pratiques, si necessaire.

## Points a verifier

- Validite actuelle de chaque lien BnF.
- Conditions d'acces exactes selon les Pass.
- Ressources qui ne sont accessibles que sur place.
- Ressources dont l'acces distant a change depuis les captures EasyBNF.
- Cas speciaux comme New York Times, PressReader ou Europresse.

