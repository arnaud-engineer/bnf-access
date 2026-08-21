# BNF Access

Prototype non officiel pour retrouver rapidement les ressources numeriques accessibles via un Pass BnF.

Nom provisoire : `BNF Access`.

## Intention

EasyBNF a longtemps servi de raccourci pratique vers les ressources numeriques de la Bibliotheque nationale de France. Le service etant indisponible depuis debut aout 2026, ce depot explore une alternative simple, maintenable et transparente.

Le projet ne remplace pas la BnF et ne collecte aucun identifiant. Les liens pointent vers les acces officiels ou proxifies par la BnF, principalement via EZproxy/OCLC.

## Architecture

Le projet est volontairement statique :

- `public/index.html` : coquille de l'application.
- `public/styles.css` : styles de l'interface.
- `public/app.js` : lecture du JSON, recherche, filtres et rendu des cartes.
- `public/resources.json` : liste des ressources, liens, conditions d'acces et sources.
- `docs/architecture.md` : notes techniques sur la logique des liens.
- `docs/research-notes.md` : resume des constats autour d'EasyBNF.

## Lancer en local

Depuis la racine du depot :

```bash
python3 -m http.server 5173 --directory public
```

Puis ouvrir :

```text
http://localhost:5173
```

## Principes

- Projet non officiel, non affilie a la BnF.
- Pas de collecte d'identifiants, pas de compte utilisateur, pas de backend.
- Donnees versionnees dans un fichier lisible.
- Liens sources conserves pour chaque ressource.
- Descriptions courtes et originales, plutot que copie integrale de contenus tiers.
- Licence a choisir avant toute publication publique.

## Sources de depart

- Annuaire officiel BnF : https://bdl.bnf.fr/bases-de-donnees-par-titre
- Archive EasyBNF : https://web.archive.org/web/20260731093816/https://easybnf.fr/
- Ressources archivees EasyBNF : https://web.archive.org/web/20260729074038id_/https://easybnf.fr/resources.json
- Documentation OCLC EZproxy : https://help.oclc.org/Library_Management/EZproxy/EZproxy_configuration/Starting_point_URLs_and_config_txt

