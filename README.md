# Présentation

BnF Access est un catalogue de raccourcis personnalisables permettant un accès simplifié aux ressources numériques et aux titres de presse consultables avec un Pass BnF.

## Intention

[EasyBNF](https://easybnf.fr/) a longtemps servi de raccourci pratique vers les ressources numériques de la Bibliothèque nationale de France. BnF Access poursuit cette idée avec une interface statique, maintenable et transparente, enrichie d'un catalogue de presse et de possibilités de personnalisation.

Le projet ne remplace pas la BnF et ne collecte aucun identifiant. Les liens pointent vers les accès officiels, les plateformes concernées ou les accès proxifiés par la BnF.

## Fonctionnement

Le projet est volontairement statique. Le site publiable se trouve directement à la racine du dépôt.

- `index.html` : interface principale.
- `pages/` : FAQ, crédits, mentions légales et pages intermédiaires d’accès.
- `assets/css/` : styles et mise en page adaptative.
- `assets/js/` : recherche, filtres, favoris, rendu progressif et interactions.
- `assets/icons/`, `assets/flags/` et `assets/logos/` : identité visuelle et illustrations du catalogue.
- `data/catalog-core.json` : ressources numériques générales.
- `data/catalog-press.json` : titres et plateformes de presse.
- `data/catalog.json` : projection complète du catalogue.
- `data/` : autres index publics nécessaires au chargement et aux liens des plateformes.
- `service-worker.js` : mise en cache locale des données et visuels utiles.

Les catalogues volumineux et les images sont chargés progressivement. Les éléments déjà consultés peuvent être réutilisés depuis le cache du navigateur lorsque leur version n'a pas changé.

## Lancer en local

Depuis la racine du dépôt :

```bash
python3 -m http.server 5188 --bind 127.0.0.1
```

Puis ouvrir :

```text
http://127.0.0.1:5188/
```

## Principes

- Projet non officiel, indépendant et non affilié à la BnF.
- Pas de collecte d'identifiants, pas de compte utilisateur et pas de backend applicatif.
- Favoris, organisation des raccourcis, filtres et préférences conservés localement dans le navigateur.
- Séparation claire entre les ressources générales et les titres de presse.
- Recherche et filtres par profil, conditions d'accès, langue, source et catégories.
- Catalogue lisible regroupant liens, descriptions, conditions d'accès, taxonomies et visuels.
- Chargement progressif pour préserver la réactivité sur les appareils moins puissants.
- Site gratuit, sans publicité.

## Sources et crédits

Les informations sont notamment recoupées depuis les pages publiques de la BnF, les plateformes d'accès, les éditeurs et différentes traces publiques archivées.

- [Annuaire officiel des ressources électroniques de la BnF](https://bdl.bnf.fr/bases-de-donnees-par-titre)
- [Tarifs et Pass BnF](https://www.bnf.fr/fr/tarifs-dacces-aux-bibliotheques-et-loffre-culturelle)
- [Archive d'EasyBNF](https://web.archive.org/web/20260731093816/https://easybnf.fr/)
- [Documentation OCLC EZproxy](https://help.oclc.org/Library_Management/EZproxy/EZproxy_configuration/Starting_point_URLs_and_config_txt)

Le projet doit beaucoup à EasyBNF, créé par [@jeremypgn](https://twitter.com/jeremypgn), qui a largement inspiré BnF Access.

La taxonomie est notamment inspirée du travail réalisé par [David Mabillot](https://www.mabillot.com/) pour [easyBnF Phoenix](https://www.mabillot.com/easybnf-phoenix.html), repris ici avec son autorisation.

## Avertissement

Les accès dépendent du Pass BnF utilisé, du lieu de consultation et des conditions propres à chaque plateforme. Leur disponibilité peut évoluer indépendamment de BnF Access.

Les noms, marques et logos reproduits restent la propriété de leurs titulaires respectifs et servent uniquement à identifier les ressources référencées.
