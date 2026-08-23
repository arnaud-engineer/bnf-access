# BNF Access

Prototype non officiel pour retrouver rapidement les ressources numériques accessibles via un Pass BnF.

Nom provisoire : `BNF Access`.

## Intention

EasyBNF a longtemps servi de raccourci pratique vers les ressources numériques de la Bibliothèque nationale de France. Le service étant indisponible depuis début août 2026, ce dépôt explore une alternative simple, maintenable et transparente.

Le projet ne remplace pas la BnF et ne collecte aucun identifiant. Les liens pointent vers les accès officiels ou proxifiés par la BnF, principalement via EZproxy/OCLC.

## Architecture

Le projet est volontairement statique :

- `public/index.html` : coquille de l'application.
- `public/styles.css` : styles de l'interface.
- `public/app.js` : lecture du JSON, recherche, filtres et rendu des cartes.
- `public/resources.json` : liste des ressources, liens, conditions d'accès, logos connus et sources.
- `public/bnf-network.json` : plages reseau BnF candidates pour une future detection sur site.
- `docs/architecture.md` : notes techniques sur la logique des liens.
- `docs/backlog.md` : pistes produit et notes de backlog.
- `docs/logo-sources.md` : provenance des logos locaux.
- `docs/research-notes.md` : resume des constats autour d'EasyBNF.

## Lancer en local

Depuis la racine du dépôt :

```bash
python3 -m http.server 5173 --directory public
```

Puis ouvrir :

```text
http://localhost:5173
```

## Principes

- Projet non officiel, non affilié à la BnF.
- Pas de collecte d'identifiants, pas de compte utilisateur, pas de backend.
- Données versionnées dans un fichier lisible.
- Sources communes conservées au niveau global du JSON.
- Import initial de 245 ressources depuis les traces publiques EasyBNF.
- Logos locaux affichés quand une trace publique exploitable existe ; sinon l'interface génère des initiales.
- Favoris sauvegardés localement dans le navigateur, initialisés avec les ressources grand public.
- Barre de lancement rapide alimentée par les favoris, avec ordre manuel optionnel.
- Filtres locaux persistants par type de Pass et accès distance/sur place.
- Descriptions courtes et originales, plutot que copie integrale de contenus tiers.
- Licence à choisir avant toute publication publique.

## Sources de depart

- Annuaire officiel BnF : https://bdl.bnf.fr/bases-de-donnees-par-titre
- Tarifs et Pass BnF : https://www.bnf.fr/fr/tarifs-dacces-aux-bibliotheques-et-loffre-culturelle
- Archive EasyBNF : https://web.archive.org/web/20260731093816/https://easybnf.fr/
- Ressources archivées EasyBNF : https://web.archive.org/web/20260729074038id_/https://easybnf.fr/resources.json
- Documentation OCLC EZproxy : https://help.oclc.org/Library_Management/EZproxy/EZproxy_configuration/Starting_point_URLs_and_config_txt
