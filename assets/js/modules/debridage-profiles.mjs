// Generated from private/data/editor/debridage-profiles.json; use the guarded editor export.
export default {
  "schema_version": 1,
  "profiles": [
    {
      "id": "liberation-fr",
      "provider": "europresse",
      "name": "Libération",
      "hosts": [
        "www.liberation.fr"
      ],
      "path": "-(\\d{8})_([A-Z2-7]{26})\\/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "captures",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "id",
        "template": "news·{day}·LIF·0{id2}"
      },
      "message": "Libération : date et référence extraites du lien.",
      "date_message": "",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-li-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
    },
    {
      "id": "monde-diplomatique-fr",
      "provider": "europresse",
      "name": "Le Monde diplomatique",
      "hosts": [
        "www.monde-diplomatique.fr"
      ],
      "path": "^\\/(\\d{4})\\/(\\d{2})\\/[A-Z][A-Z0-9_-]*\\/(\\d{1,8})\\/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "month",
        "groups": [
          1,
          2
        ]
      },
      "reference": {
        "type": "id",
        "template": "news·{day}·MD·{id3}"
      },
      "message": "Le Monde diplomatique : numéro mensuel et référence extraits du lien. Édition papier Europresse.",
      "date_message": "",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-md-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
    },
    {
      "id": "nouvelobs-com",
      "provider": "europresse",
      "name": "Le Nouvel Obs",
      "hosts": [
        "www.nouvelobs.com"
      ],
      "path": "^\\/[a-z0-9-]+\\/(\\d{8})\\.OBS(\\d{1,9})\\/[a-z0-9-]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "captures",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "id",
        "template": "news·{day}·OA·edd×cnoco×c{day}×c{day}obs{id2}"
      },
      "message": "Le Nouvel Obs : date et numéro extraits du lien. Référence web expérimentale.",
      "date_message": "",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-ob-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
    },
    {
      "id": "ouest-france-fr",
      "provider": "europresse",
      "name": "Ouest-France",
      "hosts": [
        "www.ouest-france.fr"
      ],
      "path": "-([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\\/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "input",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "id",
        "template": "news·{day}·{publication}·{id1}"
      },
      "message": "{publication_label} : référence du lien, publication choisie et date renseignée. Correspondance expérimentale; disponibilité à vérifier dans Europresse.",
      "date_message": "{publication_label} : renseignez la date de publication et vérifiez la publication choisie. Les autres titres partenaires ne sont pas couverts.",
      "limitations": "Sans date, recherche par titre sur tous les journaux, y compris Le Maine Libre. Avec une date, la référence reste limitée aux publications proposées. Plusieurs résultats peuvent être pertinents ; vérifiez le titre et la version.",
      "catalog_resource_id": "europresse-of-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse",
        "E167-arbitrages-partiels.md"
      ],
      "publications": [
        {
          "code": "OFW",
          "label": "Ouest-France"
        },
        {
          "code": "OOW",
          "label": "Presse Océan"
        },
        {
          "code": "OCW",
          "label": "Le Courrier de l'Ouest"
        }
      ],
      "date_hint": "uuid-v1",
      "title_fallback_without_reference": true,
      "title_word_strategy": "balanced"
    },
    {
      "id": "challenges-fr",
      "provider": "europresse",
      "name": "Challenges",
      "hosts": [
        "www.challenges.fr"
      ],
      "path": "^\\/[a-z0-9/-]+_(\\d{1,9})\\/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "input",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "id",
        "template": "news·{day}·OHW·{id1}"
      },
      "message": "Challenges : numéro du lien et date renseignée. Correspondance expérimentale.",
      "date_message": "Challenges : renseignez la date de publication de l'article pour essayer l'accès direct.",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier. Sans date, essai avec les mots déduits du lien, toutes sources. Un voisin peut s’ouvrir ou aucun résultat être disponible.",
      "catalog_resource_id": "europresse-oh-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse",
        "BLOCKED-TESTS-2026-10-06.md : essai URL seule sans date ; résultat et disponibilité non garantis."
      ],
      "title_fallback_without_reference": true
    },
    {
      "id": "ladepeche-fr",
      "provider": "europresse",
      "name": "La Dépêche",
      "hosts": [
        "www.ladepeche.fr"
      ],
      "path": "^\\/(\\d{4})\\/(\\d{2})\\/(\\d{2})\\/[a-z0-9-]+-\\d{1,10}\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "captures",
        "groups": [
          1,
          2,
          3
        ]
      },
      "reference": {
        "type": "url-sha1",
        "source_code": "ABBQ",
        "prefix": "dmfr"
      },
      "message": "La Dépêche : date du lien et empreinte de l'URL publique. Correspondance web expérimentale.",
      "date_message": "",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
    },
    {
      "id": "lindependant-fr",
      "provider": "europresse",
      "name": "L'Indépendant",
      "hosts": [
        "www.lindependant.fr"
      ],
      "path": "^\\/(\\d{4})\\/(\\d{2})\\/(\\d{2})\\/[a-z0-9-]+-\\d{1,10}\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "captures",
        "groups": [
          1,
          2,
          3
        ]
      },
      "reference": {
        "type": "url-sha1",
        "source_code": "MNE",
        "prefix": "infr"
      },
      "message": "L'Indépendant : date du lien et empreinte de l'URL publique. Correspondance web expérimentale.",
      "date_message": "",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
    },
    {
      "id": "lavoixdunord-fr",
      "provider": "europresse",
      "name": "La Voix du Nord",
      "hosts": [
        "www.lavoixdunord.fr"
      ],
      "path": "^\\/\\d{1,10}\\/article\\/(\\d{4}-\\d{2}-\\d{2})\\/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "captures",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "url-sha1",
        "source_code": "VWN",
        "prefix": "vnfr"
      },
      "message": "La Voix du Nord : date du lien et empreinte de l'URL publique. Correspondance web expérimentale.",
      "date_message": "",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-vn-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
    },
    {
      "id": "courrier-picard-fr",
      "provider": "europresse",
      "name": "Courrier Picard",
      "hosts": [
        "www.courrier-picard.fr"
      ],
      "path": "^\\/id\\d{1,10}\\/article\\/(\\d{4}-\\d{2}-\\d{2})\\/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "captures",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "url-sha1",
        "source_code": "VWC",
        "prefix": "cpif"
      },
      "message": "Courrier Picard : date du lien et empreinte de l'URL publique. Correspondance web expérimentale.",
      "date_message": "",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-vnc-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
    },
    {
      "id": "aisnenouvelle-fr",
      "provider": "europresse",
      "name": "L'Aisne nouvelle",
      "hosts": [
        "www.aisnenouvelle.fr"
      ],
      "path": "^\\/id\\d{1,10}\\/article\\/(\\d{4}-\\d{2}-\\d{2})\\/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "captures",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "url-sha1",
        "source_code": "AASC",
        "prefix": "hw22"
      },
      "message": "L'Aisne nouvelle : date du lien et empreinte de l'URL publique. Correspondance web expérimentale.",
      "date_message": "",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-vna-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
    },
    {
      "id": "lardennais-fr",
      "provider": "europresse",
      "name": "L'Ardennais",
      "hosts": [
        "www.lardennais.fr"
      ],
      "path": "^\\/id\\d{1,10}\\/article\\/(\\d{4}-\\d{2}-\\d{2})\\/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "captures",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "url-sha1",
        "source_code": "AASG",
        "prefix": "adnw"
      },
      "message": "L'Ardennais : date du lien et empreinte de l'URL publique. Correspondance web expérimentale.",
      "date_message": "",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-aoz-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
    },
    {
      "id": "lest-eclair-fr",
      "provider": "europresse",
      "name": "L'Est éclair",
      "hosts": [
        "www.lest-eclair.fr"
      ],
      "path": "^\\/id\\d{1,10}\\/article\\/(\\d{4}-\\d{2}-\\d{2})\\/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "captures",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "url-sha1",
        "source_code": "AASD",
        "prefix": "ewec"
      },
      "message": "L'Est éclair : date du lien et empreinte de l'URL publique. Correspondance web expérimentale.",
      "date_message": "",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-vnb-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
    },
    {
      "id": "lemessager-fr",
      "provider": "europresse",
      "name": "Le Messager",
      "hosts": [
        "www.lemessager.fr"
      ],
      "path": "^\\/\\d{1,10}\\/article\\/(\\d{4}-\\d{2}-\\d{2})\\/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "captures",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "url-sha1",
        "source_code": "AJK",
        "prefix": "hw27"
      },
      "message": "Le Messager : date du lien et empreinte de l'URL publique. Correspondance web expérimentale.",
      "date_message": "",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-ajj-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
    },
    {
      "id": "nordlittoral-fr",
      "provider": "europresse",
      "name": "Nord Littoral",
      "hosts": [
        "www.nordlittoral.fr"
      ],
      "path": "^\\/\\d{1,10}\\/article\\/(\\d{4}-\\d{2}-\\d{2})\\/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "captures",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "url-sha1",
        "source_code": "VWL",
        "prefix": "nlfr"
      },
      "message": "Nord Littoral : date du lien et empreinte de l'URL publique. Correspondance web expérimentale.",
      "date_message": "",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-vnl-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
    },
    {
      "id": "nicematin-com",
      "provider": "europresse",
      "name": "Nice-Matin",
      "hosts": [
        "www.nicematin.com"
      ],
      "path": "^\\/[a-z0-9-]+\\/[a-z0-9-]+\\/[a-z0-9-]+-\\d{1,9}$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "input",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "url-sha1",
        "source_code": "ABAX",
        "prefix": "nmfr"
      },
      "message": "Nice-Matin : date renseignée et empreinte du lien public, édition web. Les anciens liens Var-Matin doivent être résolus séparément.",
      "date_message": "Nice-Matin : renseignez la date de publication de l'article pour essayer l'accès direct.",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier. Sans date, essai avec les mots déduits du lien, toutes sources. Un voisin peut s’ouvrir ou aucun résultat être disponible.",
      "catalog_resource_id": "europresse-aso-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse",
        "BLOCKED-TESTS-2026-10-06.md : essai URL seule sans date ; résultat et disponibilité non garantis."
      ],
      "title_fallback_without_reference": true
    },
    {
      "id": "lavie-fr",
      "provider": "europresse",
      "name": "La Vie",
      "hosts": [
        "www.lavie.fr"
      ],
      "path": "^\\/[a-z0-9-]+\\/[a-z0-9-]+\\/[a-z0-9-]+-\\d{1,9}\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "input",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "url-sha1",
        "source_code": "AABY",
        "prefix": "mviw"
      },
      "message": "La Vie : date renseignée et empreinte du lien public. Correspondance web expérimentale.",
      "date_message": "La Vie : renseignez la date de publication de l'article pour essayer l'accès direct.",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier. Sans date, essai avec les mots déduits du lien, toutes sources. Un voisin peut s’ouvrir ou aucun résultat être disponible.",
      "catalog_resource_id": "europresse-lmv-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse",
        "BLOCKED-TESTS-2026-10-06.md : essai URL seule sans date ; résultat et disponibilité non garantis."
      ],
      "title_fallback_without_reference": true
    },
    {
      "id": "huffingtonpost-fr",
      "provider": "europresse",
      "name": "HuffPost France",
      "hosts": [
        "www.huffingtonpost.fr"
      ],
      "path": "^\\/[a-z0-9-]+\\/article\\/[a-z0-9-]+_\\d{1,9}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "input",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "url-sha1",
        "source_code": "HUF",
        "prefix": "hufp"
      },
      "message": "HuffPost France : date renseignée et empreinte du lien public. Conversion testée sur des articles gratuits; disponibilité et intégralité à vérifier.",
      "date_message": "HuffPost France : renseignez la date de publication de l'article pour essayer l'accès direct.",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier. Sans date, essai avec les mots déduits du lien, toutes sources. Un voisin peut s’ouvrir ou aucun résultat être disponible.",
      "catalog_resource_id": "",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse",
        "BLOCKED-TESTS-2026-10-06.md : essai URL seule sans date ; résultat et disponibilité non garantis."
      ],
      "title_fallback_without_reference": true
    },
    {
      "id": "courrierinternational-com",
      "provider": "europresse",
      "name": "Courrier International",
      "hosts": [
        "www.courrierinternational.com"
      ],
      "path": "^\\/article\\/[a-z0-9-]+_\\d{1,9}$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "input",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "url-sha1",
        "source_code": "ILW",
        "prefix": "coco"
      },
      "message": "Courrier International : empreinte de l'URL publique et date renseignée. Correspondance web expérimentale.",
      "date_message": "Courrier International : renseignez la date de publication de l'article pour essayer l'accès direct.",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier. Sans date, essai avec les mots déduits du lien, toutes sources. Un voisin peut s’ouvrir ou aucun résultat être disponible.",
      "catalog_resource_id": "europresse-il-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse",
        "BLOCKED-TESTS-2026-10-06.md : essai URL seule sans date ; résultat et disponibilité non garantis.",
        "COURRIER-RUBRIC-2026-10-06.md : rubrique musique absente du titre archive ; retrait initial seulement, URL seule.",
        "COURRIER-PREFIX-INVENTORY-2026-10-06.md : 157 prefixes structurels documentes ; retrait initial borne, qualification Europresse partielle.",
        "COURRIER-PREFIX-INVENTORY-2026-10-06.md : 408 prefixes structurels documentes ; retrait initial borne, qualification Europresse partielle."
      ],
      "title_fallback_without_reference": true,
      "title_url_prefixes": [
        "a-la-une-du-magazine",
        "aeronautique",
        "affaire-babtchenko",
        "affaire-huawei",
        "afrique",
        "afrique-du-sud",
        "alcoholmustfall",
        "allemagne",
        "alliance",
        "amerique-du-sud",
        "analyse",
        "animaux",
        "anniversaire",
        "antiracisme",
        "arabie-saoudite",
        "archeologie",
        "arctique",
        "armement",
        "art",
        "asie",
        "astrologie",
        "atmosphere",
        "attaque-du-7-octobre",
        "automobile",
        "autoritarisme",
        "autriche",
        "balkans",
        "bande-dessinee",
        "belgique",
        "biens-mal-acquis",
        "big-data",
        "bilan",
        "billet",
        "biodiversite",
        "black-lives-matter",
        "blacklivesmatter",
        "boxe",
        "bras-de-fer",
        "bresil",
        "brexit",
        "butin",
        "californie",
        "cambodge",
        "camouflet",
        "canada",
        "catastrophe-naturelle",
        "censure",
        "cent-jours-de-guerre",
        "chaos",
        "chiffre-du-jour",
        "chine",
        "chronique",
        "cinema",
        "cisjordanie",
        "classement",
        "classements",
        "climat",
        "climatiques",
        "club-courrier",
        "colombie",
        "combats",
        "commemoration",
        "commerce",
        "communique",
        "concorde",
        "confinement",
        "conflit",
        "conflit-foncier",
        "congres",
        "conseils",
        "consommation",
        "consultation",
        "contestation",
        "controverse",
        "coronavirus",
        "corruption",
        "couac",
        "coupe-du-monde",
        "cour-supreme",
        "covid-19",
        "credibilite",
        "crimee",
        "crimes-de-guerre",
        "criminalite",
        "crise",
        "crise-des-migrants",
        "crise-politique",
        "croyances",
        "crues",
        "culture",
        "cybersecurite",
        "cyclisme",
        "dans-nos-archives",
        "deboulonnage",
        "deconfinement",
        "decryptage",
        "defense",
        "demasquees",
        "demissions",
        "democratie",
        "deploiement",
        "desastre",
        "detroit-d-ormuz",
        "deuil",
        "dialogue",
        "diaporama",
        "diffusion-en-ligne",
        "diplomatie",
        "disparition",
        "diversion",
        "divertissement",
        "drame",
        "droits",
        "droits-humains",
        "eau",
        "echecs",
        "economie",
        "ecrans",
        "edito",
        "education",
        "election",
        "elections",
        "elections-americaines",
        "emigration",
        "emirats-arabes-unis",
        "en-direct",
        "en-librairie",
        "en-salle",
        "en-vente",
        "endettement",
        "energie",
        "engagement",
        "enquete",
        "entreprises",
        "entretien",
        "environnement",
        "escroquerie",
        "espace",
        "espagne",
        "etats-unis",
        "etude",
        "europe",
        "europeennes",
        "evenement",
        "executions",
        "exil",
        "extraterrestres",
        "fait-divers",
        "figurines",
        "film",
        "fin-de-vie",
        "finance",
        "finances",
        "finances-publiques",
        "fintech",
        "fiscalite",
        "floride",
        "football",
        "france",
        "fraude",
        "frontieres",
        "fusillade",
        "fusion",
        "g7",
        "garde-fous",
        "gastronomie",
        "geolocalisation",
        "geopolitique",
        "ghana",
        "greve",
        "guerison",
        "guerre",
        "guerre-commerciale",
        "guerre-en-ukraine",
        "guerre-israel-hamas",
        "hagiographie",
        "haine",
        "hecatombe",
        "himalaya",
        "histoire",
        "hommage",
        "hong-kong",
        "hongrie",
        "hydroxychloroquine",
        "ia",
        "idees",
        "immigration",
        "immobilier",
        "inauguration",
        "incendies",
        "indice",
        "indonesie",
        "inedit",
        "inegalites",
        "inondations",
        "insolite",
        "intelligence-artificielle",
        "interview",
        "israel-palestine",
        "italie",
        "japon",
        "jeu-video",
        "jeux-video",
        "jo",
        "jubile",
        "jugement",
        "justice",
        "justice-internationale",
        "kentucky",
        "la-lettre-de-l-educ",
        "la-lettre-tech",
        "la-photo-du-jour",
        "la-pilule-philosophique",
        "langues",
        "le-chiffre-du-jour",
        "le-courrier-des-recettes",
        "le-courrier-du-mondial",
        "le-mot-du-jour",
        "liberte",
        "libertes",
        "litterature",
        "livre",
        "logement",
        "loisirs",
        "love-etc",
        "maison-blanche",
        "malaise",
        "manifestations",
        "marketing",
        "maroc",
        "medecine",
        "medias",
        "mediterranee",
        "memoire",
        "menaces",
        "mexique",
        "militantisme",
        "mobilisation",
        "modern-love",
        "mondial-2018",
        "montee-des-eaux",
        "mort-de-george-floyd",
        "motion-de-censure",
        "moyen-orient",
        "musique",
        "mutinerie",
        "narcotrafic",
        "natalite",
        "nature",
        "netflix",
        "nouvel-album",
        "nouvelle-ere",
        "nucleaire",
        "onu",
        "opinion",
        "ouverture",
        "pakistan",
        "paleontologie",
        "pandemie",
        "parentalite",
        "patrimoine",
        "pauvrete",
        "peine-de-mort",
        "pendant-que-vous-dormiez",
        "petrole",
        "photo-du-jour",
        "photographie",
        "polemique",
        "politique",
        "politique-americaine",
        "populisme",
        "portfolio",
        "portrait",
        "pouvoir",
        "pratique",
        "prehistoire",
        "presidentielle",
        "presidentielle-americaine",
        "presidentielle-en-colombie",
        "presse",
        "proces",
        "productivite",
        "propagation",
        "psychologie",
        "racisme",
        "rapport",
        "rd-congo",
        "reactions",
        "reboisement",
        "recap",
        "recession",
        "recherche",
        "recompenses",
        "record",
        "recrutement",
        "recyclage",
        "referendum",
        "regain",
        "regles",
        "relance",
        "religion",
        "religions",
        "rencontre",
        "reparations",
        "repentance",
        "reportage",
        "repression",
        "reprise",
        "reseaux-sociaux",
        "retour",
        "rotterdam",
        "royaume-uni",
        "russie",
        "sacres-francais",
        "samedi-soir",
        "sante",
        "sante-publique",
        "sauvetage",
        "sciences",
        "scrutin",
        "securite",
        "securite-nationale",
        "serie",
        "serie-d-ete",
        "series",
        "sexisme",
        "societe",
        "sommet",
        "sommet-de-singapour",
        "sommet-europeen",
        "sommet-trump-kim",
        "sous-traitance",
        "sport",
        "streaming",
        "subsidence",
        "succes-mondial",
        "success-story",
        "sur-netflix",
        "sur-ocs",
        "surprenant",
        "surveillance",
        "symbole",
        "taiwan",
        "tech",
        "technologie",
        "television",
        "temoignage",
        "temoignages",
        "tendance",
        "tennis",
        "tensions",
        "tensions-au-ladakh",
        "terrorisme",
        "texas",
        "thailande",
        "tourisme",
        "tournant",
        "tradition",
        "trafics",
        "transport-aerien",
        "transports",
        "travail",
        "tribune",
        "trouvaille",
        "trucage",
        "turbulences",
        "ue",
        "une-du-jour",
        "union-europeenne",
        "universites",
        "vatican",
        "venezuela",
        "verbatim",
        "verdict",
        "video",
        "vie-de-famille",
        "vietnam",
        "village-potemkine",
        "violences",
        "virus",
        "voyage",
        "vrai-ou-faux",
        "vu-d-allemagne",
        "vu-d-espagne",
        "vu-d-inde",
        "vu-d-irlande",
        "vu-d-italie",
        "vu-d-ukraine",
        "vu-de-bagdad",
        "vu-de-belgique",
        "vu-de-bulgarie",
        "vu-de-chine",
        "vu-de-hongrie",
        "vu-de-kiev",
        "vu-de-l-etranger",
        "vu-de-malte",
        "vu-de-moscou",
        "vu-de-pologne",
        "vu-de-russie",
        "vu-de-suisse",
        "vu-des-etats-unis",
        "vu-du-canada",
        "vu-du-danemark",
        "vu-du-moyen-orient",
        "vu-du-portugal",
        "vu-du-royaume-uni",
        "vu-du-senegal",
        "xenophobie"
      ],
      "title_url_unmatched_prefix_words": 2
    },
    {
      "id": "charentelibre-fr",
      "provider": "europresse",
      "name": "Charente Libre",
      "hosts": [
        "www.charentelibre.fr"
      ],
      "path": "^\\/[a-z0-9/-]+-\\d{1,10}\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "input",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "url-sha1",
        "source_code": "AARU",
        "prefix": "chfr"
      },
      "message": "Charente Libre : empreinte de l'URL publique et date renseignée. Correspondance web expérimentale.",
      "date_message": "Charente Libre : renseignez la date de publication de l'article pour essayer l'accès direct.",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier. Sans date, essai avec les mots déduits du lien, toutes sources. Un voisin peut s’ouvrir ou aucun résultat être disponible.",
      "catalog_resource_id": "europresse-cha-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse",
        "BLOCKED-TESTS-2026-10-06.md : essai URL seule sans date ; résultat et disponibilité non garantis."
      ],
      "title_fallback_without_reference": true
    },
    {
      "id": "dordognelibre-fr",
      "provider": "europresse",
      "name": "Dordogne Libre",
      "hosts": [
        "www.dordognelibre.fr"
      ],
      "path": "^\\/[a-z0-9/-]+-\\d{1,10}\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "input",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "url-sha1",
        "source_code": "AAAD",
        "prefix": "dofr"
      },
      "message": "Dordogne Libre : empreinte de l'URL et date de publication initiale. Correspondance expérimentale; le titre peut avoir changé depuis l'archivage.",
      "date_message": "Dordogne Libre : renseignez la date de publication initiale, pas celle de mise à jour, pour essayer l'accès direct.",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier. Sans date, essai avec les mots déduits du lien, toutes sources. Un voisin peut s’ouvrir ou aucun résultat être disponible.",
      "catalog_resource_id": "europresse-dor-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse",
        "BLOCKED-TESTS-2026-10-06.md : essai URL seule sans date ; résultat et disponibilité non garantis."
      ],
      "title_fallback_without_reference": true
    },
    {
      "id": "larepubliquedespyrenees-fr",
      "provider": "europresse",
      "name": "La République des Pyrénées",
      "hosts": [
        "www.larepubliquedespyrenees.fr"
      ],
      "path": "^\\/[a-z0-9-]+\\/[a-z0-9-]+\\/[a-z0-9-]+-\\d{1,10}\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "input",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "url-sha1",
        "source_code": "RDP",
        "prefix": "pywe"
      },
      "message": "La République des Pyrénées : date renseignée et empreinte du lien public, édition web. Certains articles récents testés ne sont pas disponibles.",
      "date_message": "La République des Pyrénées : renseignez la date de publication de l'article pour essayer l'accès direct.",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier. Sans date, essai avec les mots déduits du lien, toutes sources. Un voisin peut s’ouvrir ou aucun résultat être disponible.",
      "catalog_resource_id": "europresse-amc-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse",
        "BLOCKED-TESTS-2026-10-06.md : essai URL seule sans date ; résultat et disponibilité non garantis."
      ],
      "title_fallback_without_reference": true
    },
    {
      "id": "sudouest-fr",
      "provider": "europresse",
      "name": "Sud Ouest",
      "hosts": [
        "www.sudouest.fr"
      ],
      "path": "^\\/[a-z0-9/-]+-\\d{1,10}\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "input",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "url-sha1",
        "source_code": "SOE",
        "prefix": "sofr"
      },
      "message": "Sud Ouest : empreinte de l'URL publique et date renseignée. Correspondance web expérimentale.",
      "date_message": "Sud Ouest : renseignez la date de publication de l'article pour essayer l'accès direct.",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier. Sans date, essai avec les mots déduits du lien, toutes sources. Un voisin peut s’ouvrir ou aucun résultat être disponible.",
      "catalog_resource_id": "press-title-sud-ouest",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse",
        "BLOCKED-TESTS-2026-10-06.md : essai URL seule sans date ; résultat et disponibilité non garantis."
      ],
      "title_fallback_without_reference": true
    },
    {
      "id": "telerama-fr",
      "provider": "europresse",
      "name": "Télérama",
      "hosts": [
        "www.telerama.fr"
      ],
      "path": "^\\/[a-z0-9-]+\\/[a-z0-9-]+-\\d{1,10}\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "input",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "url-sha1",
        "source_code": "TAW",
        "prefix": "trfr"
      },
      "message": "Télérama : empreinte de l'URL publique et date renseignée. Correspondance web expérimentale; critiques non couvertes.",
      "date_message": "Télérama : renseignez la date de publication de l'article pour essayer l'accès direct.",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier. Sans date, essai avec les mots déduits du lien, toutes sources. Un voisin peut s’ouvrir ou aucun résultat être disponible.",
      "catalog_resource_id": "europresse-ta-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse",
        "BLOCKED-TESTS-2026-10-06.md : essai URL seule sans date ; résultat et disponibilité non garantis."
      ],
      "title_fallback_without_reference": true
    },
    {
      "id": "lexpress-fr",
      "provider": "europresse",
      "name": "L'Express",
      "hosts": [
        "www.lexpress.fr"
      ],
      "path": "^\\/[a-z0-9/-]+-([A-Z2-7]{26})\\/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "input",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "id",
        "template": "news·{day}·EWL·{id1}"
      },
      "message": "L'Express : référence du lien et date renseignée. Correspondance web expérimentale.",
      "date_message": "L'Express : renseignez la date de publication de l'article pour essayer l'accès direct.",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier. Sans date, essai avec les mots déduits du lien, toutes sources. Un voisin peut s’ouvrir ou aucun résultat être disponible.",
      "catalog_resource_id": "europresse-ex-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse",
        "BLOCKED-TESTS-2026-10-06.md : essai URL seule sans date ; résultat et disponibilité non garantis."
      ],
      "title_fallback_without_reference": true
    },
    {
      "id": "greenunivers-com",
      "provider": "europresse",
      "name": "GreenUnivers",
      "hosts": [
        "www.greenunivers.com"
      ],
      "path": "^\\/(\\d{4})\\/(\\d{2})\\/[a-z0-9-]+-(\\d{1,9})\\/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "input",
        "groups": [
          1
        ],
        "month_groups": [
          1,
          2
        ]
      },
      "reference": {
        "type": "id",
        "template": "news·{day}·GRE·{id3}"
      },
      "message": "GreenUnivers : numéro du lien et date renseignée. Correspondance web expérimentale; les articles récents peuvent ne pas être encore disponibles.",
      "date_message": "GreenUnivers : renseignez la date de publication dans le mois indiqué par le lien. Les articles récents peuvent ne pas être encore disponibles.",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier. Sans date, essai avec les mots déduits du lien, toutes sources. Un voisin peut s’ouvrir ou aucun résultat être disponible.",
      "catalog_resource_id": "",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse",
        "BLOCKED-TESTS-2026-10-06.md : essai URL seule sans date ; résultat et disponibilité non garantis."
      ],
      "title_fallback_without_reference": true
    },
    {
      "id": "auto-infos-fr",
      "provider": "europresse",
      "name": "Auto Infos",
      "hosts": [
        "www.auto-infos.fr"
      ],
      "path": "^\\/article\\/[a-z0-9-]+\\.(\\d{1,9})$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "input",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "id",
        "template": "news·{day}·GAAD·{id1}"
      },
      "message": "Auto Infos : numéro du lien et date renseignée. Correspondance web expérimentale.",
      "date_message": "Auto Infos : renseignez la date de publication de l'article pour essayer l'accès direct.",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier. Sans date, essai avec les mots déduits du lien, toutes sources. Un voisin peut s’ouvrir ou aucun résultat être disponible.",
      "catalog_resource_id": "europresse-ako-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse",
        "BLOCKED-TESTS-2026-10-06.md : essai URL seule sans date ; résultat et disponibilité non garantis."
      ],
      "title_fallback_without_reference": true
    },
    {
      "id": "ft-com",
      "provider": "europresse",
      "name": "Financial Times",
      "hosts": [
        "www.ft.com"
      ],
      "path": "^\\/content\\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "input",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "id",
        "template": "news·{day}·GE·{id1}"
      },
      "message": "Financial Times : référence du lien et date renseignée. Correspondance web expérimentale; les articles récents peuvent ne pas être encore disponibles.",
      "date_message": "Financial Times : renseignez la date de publication. Les articles récents peuvent ne pas être encore disponibles dans Europresse.",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "factiva-financial-times",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
    },
    {
      "id": "usinenouvelle-com",
      "title_word_strategy": "concise",
      "provider": "europresse",
      "name": "L'Usine Nouvelle",
      "hosts": [
        "www.usinenouvelle.com"
      ],
      "path": "^\\/[a-z0-9/-]+\\.([A-Z2-7]{26})\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "input",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "id",
        "template": "news·{day}·GUNB·{id1}"
      },
      "message": "L'Usine Nouvelle : référence du lien et date renseignée. Correspondance web expérimentale; anciennes URL non couvertes.",
      "date_message": "L'Usine Nouvelle : renseignez la date de publication de l'article pour essayer l'accès direct.",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier. Sans date, essai avec les mots déduits du lien, toutes sources. Un voisin peut s’ouvrir ou aucun résultat être disponible.",
      "catalog_resource_id": "europresse-giu-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse",
        "BLOCKED-TESTS-2026-10-06.md : essai URL seule sans date ; résultat et disponibilité non garantis."
      ],
      "title_fallback_without_reference": true
    },
    {
      "id": "lsa-conso-fr",
      "provider": "europresse",
      "name": "LSA",
      "hosts": [
        "www.lsa-conso.fr"
      ],
      "path": "^\\/[a-z0-9/-]+\\.([A-Z2-7]{26})\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "input",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "id",
        "template": "news·{day}·GLSB·{id1}"
      },
      "message": "LSA : référence du lien et date renseignée. Correspondance web expérimentale; les articles récents peuvent ne pas être encore disponibles.",
      "date_message": "LSA : renseignez la date de publication de l'article pour essayer l'accès direct.",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier. Sans date, essai avec les mots déduits du lien, toutes sources. Un voisin peut s’ouvrir ou aucun résultat être disponible.",
      "catalog_resource_id": "europresse-gil-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse",
        "BLOCKED-TESTS-2026-10-06.md : essai URL seule sans date ; résultat et disponibilité non garantis."
      ],
      "title_fallback_without_reference": true
    },
    {
      "id": "lepoint-fr",
      "title_word_strategy": "balanced",
      "provider": "europresse",
      "name": "Le Point",
      "hosts": [
        "www.lepoint.fr"
      ],
      "path": "-([A-Z2-7]{26})\\/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "input",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "id",
        "template": "news·{day}·POR·{id1}"
      },
      "message": "Le Point : référence du lien et date renseignée. Correspondance expérimentale.",
      "date_message": "Le Point : renseignez la date de publication de l'article pour essayer l'accès direct.",
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier. Sans date, essai avec les mots déduits du lien, toutes sources. Un voisin peut s’ouvrir ou aucun résultat être disponible.",
      "catalog_resource_id": "europresse-po-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse",
        "BLOCKED-TESTS-2026-10-06.md : essai URL seule sans date ; résultat et disponibilité non garantis."
      ],
      "title_fallback_without_reference": true
    },
    {
      "id": "lemonde-fr",
      "provider": "europresse",
      "name": "Le Monde",
      "hosts": [
        "www.lemonde.fr",
        "lemonde.fr"
      ],
      "path": "^\\/[a-z0-9-]+\\/article\\/(\\d{4})\\/(\\d{2})\\/(\\d{2})\\/[a-z0-9-]+_\\d{1,10}_\\d{1,10}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "captures",
        "groups": [
          1,
          2,
          3
        ]
      },
      "message": "Le résultat peut provenir du Monde ou de La Matinale du Monde.",
      "date_message": "",
      "limitations": "Le résultat peut provenir du Monde ou de La Matinale du Monde.",
      "catalog_resource_id": "europresse-lm-p",
      "evidence": [
        "E154",
        "E161"
      ]
    },
    {
      "id": "estrepublicain-fr",
      "provider": "europresse",
      "name": "L'Est Républicain",
      "hosts": [
        "www.estrepublicain.fr"
      ],
      "path": "^\\/[a-z0-9-]+\\/(\\d{4})\\/(\\d{2})\\/(\\d{2})\\/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "captures",
        "groups": [
          1,
          2,
          3
        ]
      },
      "message": "Le fonds papier peut avoir un titre raccourci, une date différente et un délai de disponibilité.",
      "date_message": "",
      "limitations": "Le fonds papier peut avoir un titre raccourci, une date différente et un délai de disponibilité.",
      "catalog_resource_id": "europresse-erp-p",
      "evidence": [
        "E154",
        "E156",
        "E157",
        "E163"
      ]
    },
    {
      "id": "humanite-fr",
      "title_word_strategy": "concise",
      "provider": "europresse",
      "name": "L'Humanité",
      "hosts": [
        "www.humanite.fr"
      ],
      "path": "^/[a-z-]+/[a-z0-9/_-]+-[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; aucune disponibilité de l'article n'est garantie.",
      "date_message": "",
      "limitations": "E030 : témoin HUW052 retrouvé ; publication et titre à vérifier.",
      "catalog_resource_id": "europresse-hu-p",
      "evidence": [
        "RECOMMANDES-V2-2026-10-02.md : qualification du routage et limites du fonds",
        "https://www.humanite.fr/monde/emirats-arabes-unis/attaque-dun-copilote-atterrissage-durgence-ce-que-lon-sait-de-lincident-du-vol-flydubai"
      ]
    },
    {
      "id": "lequipe-fr",
      "provider": "europresse",
      "name": "L'Équipe",
      "hosts": [
        "www.lequipe.fr"
      ],
      "path": "^/[A-Za-z-]+/Article/[a-z0-9-]+/[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; aucune disponibilité de l'article n'est garantie.",
      "date_message": "",
      "limitations": "Le témoin premium n'a pas été retrouvé ; le fonds papier peut différer du site.",
      "catalog_resource_id": "europresse-eq-p",
      "evidence": [
        "RECOMMANDES-V2-2026-10-02.md : qualification du routage et limites du fonds",
        "https://www.lequipe.fr/Football/Article/-on-est-tombes-de-l-armoire-apres-les-revelations-sur-mohamed-sanhadji-l-onde-de-choc-s-est-propagee-chez-les-bleus/1722735"
      ]
    },
    {
      "id": "investir-lesechos-fr",
      "provider": "europresse",
      "name": "Investir",
      "hosts": [
        "investir.lesechos.fr"
      ],
      "path": "^/[a-z-]+/[a-z-]+/[a-z0-9-]+-[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; aucune disponibilité de l'article n'est garantie.",
      "date_message": "",
      "limitations": "E105 : témoin natif retrouvé ; identifiant public distinct de la référence Europresse.",
      "catalog_resource_id": "europresse-gi-p",
      "evidence": [
        "RECOMMANDES-V2-2026-10-02.md : qualification du routage et limites du fonds",
        "https://investir.lesechos.fr/placements/assurance-vie/le-grand-match-per-assurance-vie-pea-lequel-choisir-2254491"
      ]
    },
    {
      "id": "lopinion-fr",
      "provider": "europresse",
      "name": "L'Opinion",
      "hosts": [
        "www.lopinion.fr"
      ],
      "path": "^/[a-z-]+/[a-z0-9-]+-[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; aucune disponibilité de l'article n'est garantie.",
      "date_message": "",
      "limitations": "Témoin OPJ retrouvé lors de l'audit ; le titre web peut différer du titre archivé.",
      "catalog_resource_id": "europresse-opi-p",
      "evidence": [
        "RECOMMANDES-V2-2026-10-02.md : qualification du routage et limites du fonds",
        "https://www.lopinion.fr/economie/budget-2027-la-double-peine-pour-les-entreprises-sur-les-allegements-de-charges"
      ]
    },
    {
      "id": "la-croix-com",
      "provider": "europresse",
      "name": "La Croix",
      "hosts": [
        "www.la-croix.com"
      ],
      "path": "^/[a-z-]+/[a-z0-9-]+-[0-9]{8}$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; aucune disponibilité de l'article n'est garantie.",
      "date_message": "",
      "limitations": "Témoin LCB049 retrouvé ; recherche par titre plutôt que référence opaque.",
      "catalog_resource_id": "europresse-lc-p",
      "evidence": [
        "RECOMMANDES-V2-2026-10-02.md : qualification du routage et limites du fonds",
        "https://www.la-croix.com/economie/impots-a-qui-profitent-les-15-milliards-de-niches-fiscales-20260930"
      ]
    },
    {
      "id": "laprovence-com",
      "title_word_strategy": "concise",
      "provider": "europresse",
      "name": "La Provence",
      "hosts": [
        "www.laprovence.com"
      ],
      "path": "^/article/[a-z-]+/[0-9]+/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; aucune disponibilité de l'article n'est garantie.",
      "date_message": "",
      "limitations": "Le témoin URL seule est retrouvé dans La Provence papier avec trois mots du lien. La version web peut différer ; disponibilité et identité à vérifier.",
      "catalog_resource_id": "europresse-prv-p",
      "evidence": [
        "RECOMMANDES-V2-2026-10-02.md : qualification du routage et limites du fonds",
        "https://www.laprovence.com/article/societe/27242363412719/si-on-crie-si-on-bloque-cest-parce-que-cest-invivable-lexplosion-de-la-colere-des-lyceens-a-marseille"
      ]
    },
    {
      "id": "latribune-fr",
      "provider": "europresse",
      "name": "La Tribune",
      "hosts": [
        "www.latribune.fr"
      ],
      "path": "^/article/[a-z0-9/_-]+/[0-9]+/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; aucune disponibilité de l'article n'est garantie.",
      "date_message": "",
      "limitations": "E038 : témoin TF retrouvé ; l'horodatage natif n'est pas dans le lien public.",
      "catalog_resource_id": "europresse-tr-p",
      "evidence": [
        "RECOMMANDES-V2-2026-10-02.md : qualification du routage et limites du fonds",
        "https://www.latribune.fr/article/transports/97199012647168/canicule-orages-tempetes-pour-la-sncf-deja-180-millions-d-euros-de-manque-a-gagner-en-2026"
      ]
    },
    {
      "id": "leprogres-fr",
      "provider": "europresse",
      "name": "Le Progrès",
      "hosts": [
        "www.leprogres.fr"
      ],
      "path": "^/[a-z-]+/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; aucune disponibilité de l'article n'est garantie.",
      "date_message": "",
      "limitations": "E045 : témoin papier retrouvé avec un jour de décalage ; aucun identifiant public fiable.",
      "catalog_resource_id": "europresse-pr-p",
      "evidence": [
        "RECOMMANDES-V2-2026-10-02.md : qualification du routage et limites du fonds",
        "https://www.leprogres.fr/culture-loisirs/2026/09/05/de-la-musique-festive-et-de-l-humour-aux-belles-soirees-feyzinoises"
      ]
    },
    {
      "id": "lesoir-be",
      "provider": "europresse",
      "name": "Le Soir",
      "hosts": [
        "www.lesoir.be"
      ],
      "path": "^/[0-9]+/article/[0-9]{4}-[0-9]{2}-[0-9]{2}/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; aucune disponibilité de l'article n'est garantie.",
      "date_message": "",
      "limitations": "Le témoin payant n'a pas été retrouvé ; disponibilité web non confirmée.",
      "catalog_resource_id": "europresse-sr-p",
      "evidence": [
        "RECOMMANDES-V2-2026-10-02.md : qualification du routage et limites du fonds",
        "https://www.lesoir.be/773631/article/2026-09-28/salaire-des-enseignants-la-fwb-tente-de-rassurer-sur-les-consequences-du-bareme"
      ]
    },
    {
      "id": "lineaires-com",
      "provider": "europresse",
      "name": "Linéaires",
      "hosts": [
        "www.lineaires.com"
      ],
      "path": "^/[a-z-]+/[a-z0-9-]+-[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; aucune disponibilité de l'article n'est garantie.",
      "date_message": "",
      "limitations": "E132 : témoin BKX11449 retrouvé ; présence d'un paywall non établie.",
      "catalog_resource_id": "europresse-kx-p",
      "evidence": [
        "RECOMMANDES-V2-2026-10-02.md : qualification du routage et limites du fonds",
        "https://www.lineaires.com/la-distribution/retail-media-nouvelle-alliance-dooh-avec-auchan-et-intermarche"
      ]
    },
    {
      "id": "madame-lefigaro-fr",
      "provider": "europresse",
      "name": "Madame Figaro",
      "hosts": [
        "madame.lefigaro.fr"
      ],
      "path": "^/[a-z-]+/[a-z0-9-]+-[0-9]{8}$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; aucune disponibilité de l'article n'est garantie.",
      "date_message": "",
      "limitations": "Le titre visible peut être très différent du lien. Saisissez les mots du titre public. Sans date, essai avec les mots déduits du lien, toutes sources. Un voisin peut s’ouvrir ou aucun résultat être disponible.",
      "catalog_resource_id": "europresse-lfb-p",
      "evidence": [
        "RECOMMANDES-V2-2026-10-02.md : qualification du routage et limites du fonds",
        "https://madame.lefigaro.fr/business/si-les-femmes-n-ont-plus-d-ambition-c-est-avant-tout-parce-que-ce-mot-est-devenu-obsolete-20260206",
        "BLOCKED-TESTS-2026-10-06.md : essai URL seule sans date ; résultat et disponibilité non garantis.",
        "2026-10-06 : temoin URL seule KO. Le slug conserve un ancien titre ; la page affiche Decider, la nouvelle ambition, retrouve dans Europresse mais impossible a deduire de ce slug. Aucun titre de temoin injecte, aucun recours Microlink avec mots deja presents."
      ]
    },
    {
      "id": "maison-travaux-fr",
      "provider": "europresse",
      "name": "Maison et Travaux",
      "hosts": [
        "www.maison-travaux.fr"
      ],
      "path": "^/[a-z0-9/_-]+-[0-9]+.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; aucune disponibilité de l'article n'est garantie.",
      "date_message": "",
      "limitations": "Site actuel distinct de l'ancien domaine. Fonds papier et contenus web ne sont pas équivalents. Témoin web libre.",
      "catalog_resource_id": "europresse-wmb-p",
      "evidence": [
        "RECOMMANDES-V2-2026-10-02.md : qualification du routage et limites du fonds",
        "https://www.maison-travaux.fr/sinspirer/avantapres/avant-apres-maison-des-annees-30-se-metamorphose-633234.html",
        "2026-10-06 : temoin URL seule KO : quatre notices, Le Parisien ouvert avant Maison et Travaux (4 septembre 2025, 83 mots). Pas de correction fiable demontree ; ne pas assimiler le premier voisin a une reussite."
      ]
    },
    {
      "id": "maniere-de-voir",
      "provider": "europresse",
      "name": "Manière de voir",
      "hosts": [
        "www.monde-diplomatique.fr"
      ],
      "path": "^/mav/[0-9]+/[A-Z_0-9-]+/[0-9]+/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; aucune disponibilité de l'article n'est garantie.",
      "date_message": "",
      "limitations": "L'URL ne contient que numéro, auteur et identifiant : saisissez les mots du titre. Présence dans le fonds à vérifier.",
      "catalog_resource_id": "europresse-mx-p",
      "evidence": [
        "RECOMMANDES-V2-2026-10-02.md : qualification du routage et limites du fonds",
        "https://www.monde-diplomatique.fr/mav/208/PIEILLER/69746"
      ],
      "path_prefix": "/mav/",
      "requires_title_input": true
    },
    {
      "id": "psychologies-com",
      "provider": "europresse",
      "name": "Psychologies",
      "hosts": [
        "www.psychologies.com"
      ],
      "path": "^/[a-zA-Z0-9/_-]+-[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; aucune disponibilité de l'article n'est garantie.",
      "date_message": "",
      "limitations": "E128 : fonds papier observé, pas de correspondance avec le témoin web. Paywall non établi.",
      "catalog_resource_id": "europresse-amg-p",
      "evidence": [
        "RECOMMANDES-V2-2026-10-02.md : qualification du routage et limites du fonds",
        "https://www.psychologies.com/moi/Albert-Moukheiber-Nous-ne-voyons-pas-vraiment-le-monde-tel-quil-est-le-neuroscientifique-explique-pourquoi-notre-cerveau-deforme-la-realite-642551"
      ]
    },
    {
      "id": "strategies-fr",
      "provider": "europresse",
      "name": "Stratégies",
      "hosts": [
        "www.strategies.fr"
      ],
      "path": "^/actualites/[a-z-]+/[A-Z0-9]+/[a-z0-9-]+.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; aucune disponibilité de l'article n'est garantie.",
      "date_message": "",
      "limitations": "E102 : témoin STA retrouvé ; dates web et archive distinctes. Paywall non établi.",
      "catalog_resource_id": "europresse-st-p",
      "evidence": [
        "RECOMMANDES-V2-2026-10-02.md : qualification du routage et limites du fonds",
        "https://www.strategies.fr/actualites/medias/LQ6664445C/brice-teinturier-ipsos-bva-un-desir-de-rupture-qui-monte-vite-et-fort.html"
      ]
    },
    {
      "id": "tdg-ch",
      "provider": "europresse",
      "name": "Tribune de Genève",
      "hosts": [
        "www.tdg.ch"
      ],
      "path": "^/[a-z0-9-]+-[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; aucune disponibilité de l'article n'est garantie.",
      "date_message": "",
      "limitations": "E089 : version apparentée dans 24 Heures, pas de correspondance Tribune de Genève prouvée. Vérifiez le journal.",
      "catalog_resource_id": "europresse-wg-p",
      "evidence": [
        "RECOMMANDES-V2-2026-10-02.md : qualification du routage et limites du fonds",
        "https://www.tdg.ch/enfants-trois-sujets-de-dispute-a-eviter-devant-eux-892506103317",
        "2026-10-07 : deux parcours publics URL seule KO, enfants et Maudet. Maudet/enquete retrouve treize notices : article WG attendu en deuxieme, voisin en premier. Ne pas assimiler un premier voisin ou une reprise 24 Heures a une reussite Tribune. Recette conservee, aucun verdict humain invente. Voir AFFAIRES-TELEOBS-TDG-2026-10-07.md."
      ]
    },
    {
      "id": "telestar-fr",
      "provider": "europresse",
      "name": "Télé Star",
      "hosts": [
        "www.telestar.fr"
      ],
      "path": "^/[a-z_-]+/[a-z0-9-]+-[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; aucune disponibilité de l'article n'est garantie.",
      "date_message": "",
      "limitations": "Témoin public récent, sans paywall établi. Le fonds papier peut ne pas reprendre le site web.",
      "catalog_resource_id": "europresse-mtf-p",
      "evidence": [
        "RECOMMANDES-V2-2026-10-02.md : qualification du routage et limites du fonds",
        "https://www.telestar.fr/tele_realite/lydia-bouchard-star-academy-2026-avec-marlene-je-pense-que-lon-va-se-parler-pendant-la-saison-1784846"
      ]
    },
    {
      "id": "teleobs",
      "provider": "europresse",
      "name": "TéléObs",
      "hosts": [
        "www.nouvelobs.com"
      ],
      "path": "^\\/[a-z0-9-]+\\/(\\d{8})\\.OBS(\\d{1,9})\\/[a-z0-9-]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "captures",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "id",
        "template": "news·{day}·OA·edd×cnoco×c{day}×c{day}obs{id2}"
      },
      "message": "Le Nouvel Obs : date et numéro extraits du lien. Référence web expérimentale.",
      "date_message": "",
      "limitations": "Recette Nouvel Obs conservée ; rubrique TéléObs identifiée séparément. Disponibilité dans le fonds TéléObs à vérifier.",
      "catalog_resource_id": "europresse-obt-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse",
        "https://www.nouvelobs.com/teleobs/20260922.OBS118479/joel-le-scouarnec-l-impunite-d-un-pedocriminel.html",
        "2026-10-07 : parcours public URL seule rejoue, reference directe OA du 22 septembre 2026 : Joel Le Scouarnec, l'impunite d'un pedocriminel, Celine Rastello, 1307 mots. Article exact du Nouvel Obs web ; pas une preuve du fonds papier TeleObs. Aucun changement de recette ni verdict humain. Voir AFFAIRES-TELEOBS-TDG-2026-10-07.md."
      ],
      "path_prefix": "/teleobs/"
    },
    {
      "id": "monde-diplomatique-carnet",
      "provider": "europresse",
      "name": "Le Monde diplomatique",
      "hosts": [
        "www.monde-diplomatique.fr"
      ],
      "path_prefix": "/carnet/",
      "path": "^/carnet/(\\d{4})-(\\d{2})-(\\d{2})-[A-Za-z0-9-]+/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "captures",
        "groups": [
          1,
          2,
          3
        ]
      },
      "message": "La Valise diplomatique : recherche par mots du titre dans Europresse, sans référence papier inventée.",
      "date_message": "",
      "limitations": "Des versions site web et carnets peuvent coexister. Vérifiez le titre, la date et le lien d'origine du résultat. Le témoin testé est également lisible sur le site public.",
      "catalog_resource_id": "europresse-md-p",
      "evidence": [
        "E110-DIPLO-CARNET.md : recherche authentifiée et essai depuis le bouton V2",
        "https://www.monde-diplomatique.fr/carnet/2026-09-27-Taiwan-ou-la-grande-bascule"
      ]
    },
    {
      "id": "monde-diplomatique-partage",
      "provider": "europresse",
      "name": "Le Monde diplomatique",
      "hosts": [
        "www.monde-diplomatique.fr"
      ],
      "path_prefix": "/",
      "path": "^/[0-9]{1,8}/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "requires_title_input": true,
      "message": "Lien court de partage : indiquez les mots distinctifs du titre. L'identifiant seul ne donne pas la date ni la famille d'article.",
      "date_message": "",
      "limitations": "Recherche toutes sources et toutes dates. Le site statique ne résout pas automatiquement la redirection distante. Vérifiez l'article ouvert.",
      "catalog_resource_id": "europresse-md-p",
      "evidence": [
        "DIPLO-FORMATS.md : partage observé et essai V2 avec saisie du titre",
        "https://www.monde-diplomatique.fr/69974",
        "https://www.monde-diplomatique.fr/70063"
      ]
    },
    {
      "id": "monde-diplomatique-blogs",
      "provider": "europresse",
      "name": "Le Monde diplomatique",
      "hosts": [
        "blog.mondediplo.net"
      ],
      "path": "^/[a-z0-9][a-z0-9-]{1,180}/?$",
      "excluded_paths": [
        "/contact",
        "/a-propos",
        "/mentions-legales",
        "/recherche",
        "/archives",
        "/connexion"
      ],
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Blogs du Diplo : recherche par mots du titre. Pour un lien numérique, indiquez le titre dans les paramètres.",
      "date_message": "",
      "limitations": "Le titre peut être tronqué dans le lien. Des versions datées différemment peuvent coexister dans Europresse ; vérifiez le résultat.",
      "catalog_resource_id": "europresse-md-p",
      "evidence": [
        "DIPLO-FORMATS.md : titre retrouvé dans le fonds carnets",
        "https://blog.mondediplo.net/2494",
        "https://blog.mondediplo.net/terminus-du-neoliberalisme-ou-terminus-de-la"
      ]
    },
    {
      "id": "monde-diplomatique-publications",
      "provider": "europresse",
      "name": "Le Monde diplomatique",
      "hosts": [
        "www.monde-diplomatique.fr"
      ],
      "path_prefix": "/publications/",
      "path": "^/publications/[a-z0-9_]+/a[0-9]{1,8}/?$",
      "enabled": false,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "requires_title_input": true,
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Hors-série reconnu, mais accès automatique non qualifié. Recherchez le titre de l'article, pas le nom du hors-série, dans le secours manuel.",
      "date_message": "",
      "limitations": "Le monde ou rien apparaît dans le fonds web, mais la recherche ouvre aussi des homonymes et la date Europresse diffère. Ne pas activer sans essai plus précis.",
      "catalog_resource_id": "europresse-md-p",
      "evidence": [
        "DIPLO-FORMATS.md : correspondance candidate parmi dix résultats",
        "https://www.monde-diplomatique.fr/publications/manuel_d_autodefense_intellectuelle_geopolitique/a69974"
      ]
    },
    {
      "id": "monde-diplomatique-telex",
      "provider": "europresse",
      "name": "Le Monde diplomatique",
      "hosts": [
        "www.monde-diplomatique.fr"
      ],
      "path_prefix": "/telex/",
      "path": "^/telex/[0-9]{4}-[0-9]{2}-[A-Za-z0-9-]+/?$",
      "enabled": false,
      "status": "unreviewed",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Télex reconnu, sans correspondance Europresse confirmée. Le secours manuel reste disponible.",
      "date_message": "",
      "limitations": "Le témoin Espoir de paix dans le Caucase n'est pas retrouvé par ses mots distinctifs, toutes archives. Cela ne prouve pas l'absence de tous les télex.",
      "catalog_resource_id": "europresse-md-p",
      "evidence": [
        "DIPLO-FORMATS.md : essai sans résultat correspondant",
        "https://www.monde-diplomatique.fr/telex/2025-08-Espoir-de-paix-dans-le-Caucase"
      ]
    },
    {
      "id": "beauxarts-com",
      "provider": "europresse",
      "name": "Beaux Arts Magazine",
      "hosts": [
        "www.beauxarts.com"
      ],
      "path": "^/grand-format/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Correspondance web observée, mais notice courte : intégralité du texte payant non confirmée.",
      "catalog_resource_id": "europresse-aos-p",
      "evidence": [
        "E051-BEAUX-ARTS.md",
        "https://www.beauxarts.com/grand-format/le-black-mountain-college-une-utopie-collective-au-service-des-avant-gardes-americaines/",
        "POPULAIRES-V2-2026-10-02.md"
      ]
    },
    {
      "id": "bibamagazine-fr",
      "provider": "europresse",
      "name": "Biba",
      "hosts": [
        "www.bibamagazine.fr"
      ],
      "path": "^/[a-z0-9/_-]+-[0-9]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Le titre archivé peut omettre le préfixe du titre public. Paywall individuel non établi.",
      "catalog_resource_id": "europresse-mbi-p",
      "evidence": [
        "E070-BIBA.md",
        "https://www.bibamagazine.fr/culture/netflix/un-chef-doeuvre-ce-thriller-netflix-note-4-sur-5-est-dans-le-top-10-de-21-pays-533637.html",
        "POPULAIRES-V2-2026-10-02.md"
      ],
      "title_word_strategy": "editorial"
    },
    {
      "id": "corsematin-com",
      "provider": "europresse",
      "name": "Corse Matin",
      "hosts": [
        "www.corsematin.com"
      ],
      "path": "^/article/[a-z-]+/[0-9]+/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Versions papier et web retrouvées. Plusieurs résultats peuvent être pertinents ; vérifiez la version. Intégralité du texte non confirmée.",
      "catalog_resource_id": "europresse-nic-p",
      "evidence": [
        "E080-CORSE-MATIN.md",
        "https://www.corsematin.com/article/faits-diversjustice/57576470194602/carbuccia-le-stand-de-tir-ferme-deux-mois-pour-des-manquements-a-la-securite",
        "POPULAIRES-V2-2026-10-02.md",
        "E167-arbitrages-partiels.md"
      ]
    },
    {
      "id": "autoplus-fr",
      "provider": "europresse",
      "name": "Auto Plus",
      "hosts": [
        "www.autoplus.fr"
      ],
      "path": "^/[a-z0-9/_-]+-[0-9]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Source web distincte du magazine. Paywall individuel non établi.",
      "catalog_resource_id": "europresse-map-p",
      "evidence": [
        "E126-autoplus.md",
        "https://www.autoplus.fr/environnement/pres-de-5-000-exemplaires-vendus-en-septembre-cette-nouvelle-renault-pourrait-egaler-le-succes-de-la-r5-e-tech-1469266.html",
        "POPULAIRES-V2-2026-10-02.md"
      ]
    },
    {
      "id": "grazia-fr",
      "provider": "europresse",
      "name": "Grazia",
      "hosts": [
        "www.grazia.fr"
      ],
      "path": "^/[a-z0-9/_-]+-[0-9]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Source web distincte du magazine. Paywall individuel non établi.",
      "catalog_resource_id": "europresse-mgz-p",
      "evidence": [
        "E132-lineaires-grazia.md",
        "https://www.grazia.fr/fashion-week/news-fashion-week/defile-chloe-le-printemps-ete-2027-comme-obsession-1284292.html",
        "POPULAIRES-V2-2026-10-02.md"
      ]
    },
    {
      "id": "science-et-vie-com",
      "provider": "europresse",
      "name": "Science et Vie",
      "hosts": [
        "www.science-et-vie.com"
      ],
      "path": "^/[a-z0-9/_-]+-[0-9]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Source MSJW web, pas le numéro du magazine. Paywall individuel non établi.",
      "catalog_resource_id": "europresse-msj-p",
      "evidence": [
        "E098-science-vie.md",
        "https://www.science-et-vie.com/nature-et-environnement/les-oceans/pendant-cinquante-ans-pierre-laboute-a-photographie-le-lagon-caledonien-ses-images-preservent-la-memoire-de-recifs-aujourdhui-menaces-260945.html",
        "POPULAIRES-V2-2026-10-02.md"
      ]
    },
    {
      "id": "marianne-net",
      "provider": "europresse",
      "name": "Marianne",
      "hosts": [
        "www.marianne.net"
      ],
      "path": "^/[a-z-]+/[a-z-]+/[a-z0-9-]+-[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Témoin réservé retrouvé dans le fonds web ; les archives web observées commencent en juillet 2026.",
      "catalog_resource_id": "europresse-mq-p",
      "evidence": [
        "E095-marianne.md",
        "https://www.marianne.net/culture/litterature/exclusif-bernard-werber-j-espere-que-l-affaire-thelyson-orelien-amenera-les-prix-litteraires-a-regarder-la-qualite-des-intrigues",
        "POPULAIRES-V2-2026-10-02.md"
      ]
    },
    {
      "id": "paris-normandie-fr",
      "title_word_strategy": "long-words",
      "provider": "europresse",
      "name": "Paris-Normandie",
      "hosts": [
        "www.paris-normandie.fr"
      ],
      "path": "^/id[0-9]+/article/[0-9]{4}-[0-9]{2}-[0-9]{2}/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Une recherche trop courte ouvre des voisins. Notice web courte et versions papier distinctes : vérifiez la version ; intégralité non confirmée.",
      "catalog_resource_id": "europresse-pan-p",
      "evidence": [
        "E090-paris-normandie.md",
        "https://www.paris-normandie.fr/id749242/article/2026-10-01/dans-leure-le-petit-versailles-normand-devoile-plusieurs-siecles-dune-histoire",
        "POPULAIRES-V2-2026-10-02.md"
      ]
    },
    {
      "id": "lunion-fr",
      "provider": "europresse",
      "name": "L'Union",
      "hosts": [
        "www.lunion.fr"
      ],
      "path": "^/id[0-9]+/article/[0-9]{4}-[0-9]{2}-[0-9]{2}/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "La version de L'Union et une reprise de L'Ardennais peuvent coexister. Vérifiez le journal dans les résultats ; intégralité de la notice courte non confirmée.",
      "catalog_resource_id": "europresse-vnu-p",
      "evidence": [
        "E092-union.md",
        "https://www.lunion.fr/id831199/article/2026-10-01/des-voleurs-siphonnent-le-carburant-de-sa-camionnette-et-y-mettent-le-feu",
        "POPULAIRES-V2-2026-10-02.md",
        "E167-arbitrages-partiels.md"
      ]
    },
    {
      "id": "lepopulaire-fr",
      "provider": "europresse",
      "name": "Le Populaire du Centre",
      "hosts": [
        "www.lepopulaire.fr"
      ],
      "path": "^/[a-z0-9-]+/[a-z-]+/[a-z0-9-]+_[0-9]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "La version du Populaire et des reprises du groupe peuvent coexister. Consultez les résultats si le premier journal diffère ; intégralité du texte non confirmée.",
      "catalog_resource_id": "europresse-frp-p",
      "evidence": [
        "E084-POPULAIRE.md",
        "https://www.lepopulaire.fr/paris-75000/actualites/mobilisation-lyceenne-on-peut-passer-a-une-contestation-plus-generale-de-l-etat-analyse-le-politologue-robi-morder_15056297/",
        "POPULAIRES-V2-2026-10-02.md",
        "E167-arbitrages-partiels.md"
      ]
    },
    {
      "id": "topsante-com",
      "provider": "europresse",
      "name": "Top Santé",
      "hosts": [
        "www.topsante.com"
      ],
      "path": "^/[a-z0-9/_-]+-[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Une recherche trop courte ouvre des voisins. Ancien témoin web retrouvé ; disponibilité des liens récents non confirmée. Paywall individuel non établi.",
      "catalog_resource_id": "europresse-mto-p",
      "evidence": [
        "E128-magazines-populaires.md",
        "https://www.topsante.com/nutrition_et_recettes/les_vitamines/vitamine_d/quelle-est-la-meilleure-heure-pour-prendre-votre-vitamine-d-882185",
        "POPULAIRES-V2-2026-10-02.md"
      ]
    },
    {
      "id": "lefigaro-fr",
      "provider": "europresse",
      "name": "Le Figaro",
      "hosts": [
        "www.lefigaro.fr"
      ],
      "path": "^/[a-z0-9/_-]+-[0-9]{8}$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Recherche par mots du titre seulement, sans collecte du site ni identifiant interne. Une reprise dans un autre journal peut apparaître.",
      "catalog_resource_id": "europresse-lf-p",
      "evidence": [
        "JOURNAL.md#e028",
        "https://www.lefigaro.fr/international/pilote-dentiste-plombier-qui-sont-les-heros-du-vol-flydubai-qui-ont-neutralise-le-copilote-arme-20261001",
        "POPULAIRES-V2-2026-10-02.md"
      ]
    },
    {
      "id": "autojournal-fr",
      "provider": "europresse",
      "name": "L'Auto-Journal",
      "hosts": [
        "www.autojournal.fr"
      ],
      "path": "^/[a-z0-9/_-]+-[0-9]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Correspondance web observée. Le titre du lien peut différer du titre publié ; adaptez les mots. Paywall individuel non établi.",
      "catalog_resource_id": "europresse-mau-p",
      "evidence": [
        "E136-autojournal.md",
        "https://www.autojournal.fr/info-nouveautes-produits/bmw-serie-3-i3-nouveaute-moteur-electrique-options-autonomie-2026-426967.html",
        "POPULAIRES-V2-2026-10-02.md"
      ]
    },
    {
      "id": "diapasonmag-fr",
      "provider": "europresse",
      "name": "Diapason",
      "hosts": [
        "www.diapasonmag.fr"
      ],
      "path": "^/[a-z0-9/_-]+-[0-9]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Versions papier et web retrouvées, avec des dates différentes. Consultez les résultats pour choisir la version ; équivalence intégrale non confirmée.",
      "catalog_resource_id": "europresse-mdi-p",
      "evidence": [
        "E065-DIAPASON.md",
        "https://www.diapasonmag.fr/histoire/les-metamorphoses-de-rossini-66618.html",
        "POPULAIRES-V2-2026-10-02.md",
        "E167-arbitrages-partiels.md"
      ]
    },
    {
      "id": "lhistoire-fr",
      "provider": "europresse",
      "name": "L'Histoire",
      "hosts": [
        "www.lhistoire.fr"
      ],
      "path": "^/[a-z0-9-]+-[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Témoin réservé retrouvé dans le numéro papier 547. Des mots trop génériques ouvrent d'autres journaux ; affinez le titre et vérifiez la notice.",
      "catalog_resource_id": "europresse-shi-p",
      "evidence": [
        "E103-histoire.md",
        "https://www.lhistoire.fr/chine-lautre-pays-des-concours",
        "POPULAIRES-V2-2026-10-02.md"
      ]
    },
    {
      "id": "lamontagne-fr",
      "provider": "europresse",
      "name": "La Montagne",
      "hosts": [
        "www.lamontagne.fr"
      ],
      "path": "^/[a-z0-9-]+/[a-z-]+/[a-z0-9-]+_[0-9]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "La version de La Montagne et des reprises du groupe ont été retrouvées dans la recherche native. Le lien automatique peut ouvrir une autre version ou rencontrer un délai ; le secours manuel reste disponible.",
      "catalog_resource_id": "europresse-frm-p",
      "evidence": [
        "E040-REGIONAUX.md",
        "https://www.lamontagne.fr/brive-la-gaillarde-19100/economie/135-euros-d-amende-alors-que-le-papillon-vert-n-existe-plus-cet-automobiliste-fulmine-mais-voici-ce-qu-il-aurait-du-savoir_15055658/",
        "POPULAIRES-V2-2026-10-02.md",
        "E167-arbitrages-partiels.md"
      ]
    },
    {
      "id": "letelegramme-fr",
      "provider": "europresse",
      "name": "Le Télégramme",
      "hosts": [
        "www.letelegramme.fr"
      ],
      "path": "^/[a-z0-9/_-]+-[0-9]+\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Témoin réservé retrouvé dans le fonds web avec lien d'origine exact. Disponibilité des autres liens à vérifier.",
      "catalog_resource_id": "europresse-tl-p",
      "evidence": [
        "POPULAIRES-PASSE-COMPLETE.md",
        "https://www.letelegramme.fr/monde/le-brexit-ma-surtout-porte-un-coup-au-moral-comment-les-londoniens-apprecient-lidee-dun-come-back-dans-lue-7129097.php",
        "POPULAIRES-V2-2026-10-02.md"
      ]
    },
    {
      "id": "gourmand-viepratique-fr",
      "provider": "europresse",
      "name": "Gourmand",
      "hosts": [
        "gourmand.viepratique.fr"
      ],
      "path": "^/[a-z0-9/_-]+-[0-9]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Titre exact retrouvé dans le fonds web. Lien d'origine non contrôlé lors de cet essai ; paywall individuel non établi.",
      "catalog_resource_id": "europresse-wgo-p",
      "evidence": [
        "POPULAIRES-PASSE-COMPLETE.md",
        "https://gourmand.viepratique.fr/recettes-par-ingredient/volailles/ne-cuisez-plus-cette-viande-blanche-sans-cette-sauce-secrete-validee-par-marmiton-adieu-blanc-sec-110687.html",
        "POPULAIRES-V2-2026-10-02.md"
      ]
    },
    {
      "id": "modesettravaux-fr",
      "provider": "europresse",
      "name": "Modes et Travaux",
      "hosts": [
        "www.modesettravaux.fr"
      ],
      "path": "^/[a-z0-9/_-]+-[0-9]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Correspondance web avec origine exacte observée. Paywall individuel non établi.",
      "catalog_resource_id": "europresse-mmo-p",
      "evidence": [
        "POPULAIRES-PASSE-COMPLETE.md",
        "https://www.modesettravaux.fr/mode/bons-plans-mode/seconde-main-ce-vetement-doccasion-a-acheter-en-priorite-avant-lautomne-pour-faire-de-vraies-economies-199507.html",
        "POPULAIRES-V2-2026-10-02.md"
      ]
    },
    {
      "id": "closermag-fr",
      "provider": "europresse",
      "name": "Closer",
      "hosts": [
        "www.closermag.fr"
      ],
      "path": "^/[a-z0-9/_-]+-[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Correspondance web avec origine exacte observée. Paywall individuel non établi.",
      "catalog_resource_id": "europresse-mcs-p",
      "evidence": [
        "POPULAIRES-PASSE-COMPLETE.md",
        "https://www.closermag.fr/actualites/cest-un-putain-de-cirque-une-affaire-a-100-millions-deuros-secoue-le-rugby-un-champion-du-monde-implique-3659675",
        "POPULAIRES-V2-2026-10-02.md"
      ]
    },
    {
      "id": "lejournaldelamaison-fr",
      "provider": "europresse",
      "name": "Le Journal de la Maison",
      "hosts": [
        "www.lejournaldelamaison.fr"
      ],
      "path": "^/[a-z0-9/_-]+-[0-9]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Correspondance web avec origine exacte observée. Paywall individuel non établi.",
      "catalog_resource_id": "europresse-wjo-p",
      "evidence": [
        "POPULAIRES-PASSE-COMPLETE.md",
        "https://www.lejournaldelamaison.fr/le-journal-de-la-maison/petites-surfaces/amenagement-petites-surfaces/lidl-lance-ce-25-septembre-un-rangement-sans-percage-pour-exploiter-larriere-des-portes-a-699-e-555992.html",
        "POPULAIRES-V2-2026-10-02.md"
      ]
    },
    {
      "id": "pleinevie-fr",
      "provider": "europresse",
      "name": "Pleine Vie",
      "hosts": [
        "www.pleinevie.fr"
      ],
      "path": "^/[a-z0-9/_-]+-[0-9]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Correspondance web avec origine exacte observée. Paywall individuel non établi.",
      "catalog_resource_id": "europresse-mpl-p",
      "evidence": [
        "POPULAIRES-PASSE-COMPLETE.md",
        "https://www.pleinevie.fr/preparation-a-la-retraite/retraite-agirc-arrco-le-delai-ideal-pour-faire-sa-demande-et-ne-rien-perdre-221468.html",
        "POPULAIRES-V2-2026-10-02.md"
      ]
    },
    {
      "id": "monjardinmamaison-fr",
      "provider": "europresse",
      "name": "Mon Jardin et ma Maison",
      "hosts": [
        "monjardinmamaison.maison-travaux.fr"
      ],
      "path": "^/[a-z0-9/_-]+-[0-9]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Correspondance web avec origine exacte observée. Paywall individuel non établi.",
      "catalog_resource_id": "europresse-wmo-p",
      "evidence": [
        "POPULAIRES-PASSE-COMPLETE.md",
        "https://monjardinmamaison.maison-travaux.fr/mon-jardin-ma-maison/plantes-par-type/potager-legumes/fruits-et-legumes/juan-jose-agriculteur-abandonne-les-cereales-pour-la-pistache-je-suis-passe-de-40-000-a-650-000-euros-par-an-568360.html",
        "POPULAIRES-V2-2026-10-02.md"
      ]
    },
    {
      "id": "sportauto-fr",
      "provider": "europresse",
      "name": "Sport Auto",
      "hosts": [
        "www.sportauto.fr"
      ],
      "path": "^/[a-z0-9/_-]+-[0-9]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Correspondance web avec origine exacte observée. Paywall individuel non établi.",
      "catalog_resource_id": "europresse-msp-p",
      "evidence": [
        "POPULAIRES-PASSE-COMPLETE.md",
        "https://www.sportauto.fr/classiques/kimera-evo37-mythique-lancia-temps-modernes-a-vu-cote-doubler-quelques-mois-images-465986.html",
        "POPULAIRES-V2-2026-10-02.md"
      ]
    },
    {
      "id": "valeursactuelles-com",
      "provider": "europresse",
      "name": "Valeurs Actuelles",
      "hosts": [
        "www.valeursactuelles.com"
      ],
      "path": "^/[a-z0-9-]+/[a-z0-9-]+-[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Même notice web retrouvée par formulaire natif puis Link. Un mot absent du titre faisait échouer l'essai précédent ; affinez les mots si nécessaire. Origine et paywall individuel non confirmés.",
      "catalog_resource_id": "europresse-vaa-p",
      "evidence": [
        "POPULAIRES-PASSE-COMPLETE.md",
        "https://www.valeursactuelles.com/politique/les-gens-sy-interessent-une-petition-reclame-a-yael-braun-pivet-et-gerard-larcher-de-publier-les-notes-de-frais-des-elus-et-atteint-90-000-signatures",
        "POPULAIRES-V2-2026-10-02.md"
      ]
    },
    {
      "id": "lepelerin-com",
      "provider": "europresse",
      "name": "Le Pèlerin",
      "hosts": [
        "www.lepelerin.com"
      ],
      "path": "^/[a-z0-9/_-]+-[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Le reportage web testé reprend le magazine : la version papier du lendemain est un résultat pertinent, même avec un autre titre. Les liens courts peuvent nécessiter des mots du titre ; équivalence mot à mot non confirmée.",
      "catalog_resource_id": "europresse-pel-p",
      "evidence": [
        "E133-pelerin-jsl.md",
        "https://www.lepelerin.com/monde/reportage/lettonie-16124",
        "POPULAIRES-V2-2026-10-02.md",
        "E167-arbitrages-partiels.md"
      ]
    },
    {
      "id": "cotemaison-ouest",
      "provider": "europresse",
      "name": "Maisons Côté Ouest",
      "hosts": [
        "www.cotemaison.fr"
      ],
      "path": "^/cote-evasion/cote-ouest/[a-z0-9-]+-[0-9]+$",
      "path_prefix": "/cote-evasion/cote-ouest/",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Recherche souple par sujet : une version papier au titre différent a été retrouvée, sans preuve d'équivalence exacte. Vérifiez la notice ; ce n'est pas un accès exact garanti.",
      "catalog_resource_id": "europresse-exh-p",
      "evidence": [
        "POPULAIRES-PASSE-COMPLETE.md",
        "https://www.cotemaison.fr/cote-evasion/cote-ouest/a-bernay-la-thanatotheque-cree-des-sculptures-de-crustaces-18015",
        "POPULAIRES-V2-2026-10-02.md",
        "E167-arbitrages-partiels.md",
        "2026-10-06 : long-anchors, premier et dernier mots d'au moins sept lettres derives de l'URL. Thanatotheque/crustaces retrouve uniquement CURIOSITES MARINES (25 mars 2026, 737 mots). Version papier apparentee, equivalence exacte avec la page web non garantie."
      ],
      "title_word_strategy": "long-anchors"
    },
    {
      "id": "bienpublic-com",
      "provider": "europresse",
      "name": "Le Bien Public",
      "hosts": [
        "www.bienpublic.com"
      ],
      "path": "^/[a-z0-9-]+/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Le témoin réservé retrouve sa version papier au même titre et à la même date. Pas de lien d'origine ; équivalence intégrale au web non confirmée. Les articles récents peuvent manquer.",
      "catalog_resource_id": "europresse-bp-p",
      "evidence": [
        "E165-populaires-versions-papier.md",
        "https://www.bienpublic.com/culture-loisirs/2026/09/26/un-nouveau-couple-va-prendre-les-commandes-du-bal-monte-l-eden",
        "POPULAIRES-V2-2026-10-02.md"
      ]
    },
    {
      "id": "lechorepublicain-fr",
      "provider": "europresse",
      "name": "L'Écho Républicain",
      "hosts": [
        "www.lechorepublicain.fr"
      ],
      "path": "^/[a-z0-9-]+/[a-z-]+/[a-z0-9-]+_[0-9]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; disponibilité et publication à vérifier.",
      "date_message": "",
      "limitations": "Le témoin gratuit est retrouvé dans le papier. Pour le témoin réservé, seules des reprises d'autres journaux du groupe ont été trouvées ; vérifiez la publication, sans garantie de retrouver la version de L'Écho.",
      "catalog_resource_id": "europresse-fre-p",
      "evidence": [
        "E165-populaires-versions-papier.md",
        "https://www.lechorepublicain.fr/theuville-28360/economie/le-houblon-et-la-biere-a-la-fete-a-theuville_15033223/",
        "POPULAIRES-V2-2026-10-02.md",
        "E167-arbitrages-partiels.md"
      ]
    },
    {
      "id": "journaldemontreal-com",
      "provider": "europresse",
      "name": "Le Journal de Montréal",
      "hosts": [
        "www.journaldemontreal.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Témoin public gratuit retrouvé avec origine exacte. Reprises Québec et TVA possibles ; paywall individuel non validé.",
      "catalog_resource_id": "europresse-op-p",
      "evidence": [
        "E169-autres-second-lot.md",
        "https://www.journaldemontreal.com/2026/09/30/seedbox-licencie-97-travailleurs-a-montreal",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "daf-mag-fr",
      "provider": "europresse",
      "name": "DAF Magazine",
      "hosts": [
        "www.daf-mag.fr"
      ],
      "path": "^/[a-z0-9/-]+-[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Titre web exact retrouvé. Témoin public gratuit ; pas une preuve d'accès au texte réservé.",
      "catalog_resource_id": "europresse-edf-p",
      "evidence": [
        "E079-DAF.md",
        "https://www.daf-mag.fr/fonction-finance-1242/les-cfo-se-focalisent-sur-la-croissance-interne-en-cette-fin-dannee-27535",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "lejdc-fr",
      "provider": "europresse",
      "name": "Le Journal du Centre",
      "hosts": [
        "www.lejdc.fr"
      ],
      "path": "^/[a-z0-9-]+/[a-z-]+/[a-z0-9-]+_[0-9]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Correspondance exacte, mais notice de 29 mots seulement. Ne garantit pas l'intégralité de l'article réservé.",
      "catalog_resource_id": "europresse-frj-p",
      "evidence": [
        "E083-JOURNAL-CENTRE.md",
        "https://www.lejdc.fr/nevers-58000/actualites/mammobus-a-nevers-une-premiere-innovante-pour-le-depistage-du-cancer-du-sein_15056389/",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "lalibre-be",
      "provider": "europresse",
      "name": "La Libre Belgique",
      "hosts": [
        "www.lalibre.be"
      ],
      "path": "^/[a-z0-9/-]+-[A-Z2-7]{26}/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Papier et web au même titre retrouvés, dates différentes. Référence interne distincte du suffixe public ; vérifiez la version.",
      "catalog_resource_id": "europresse-bli-p",
      "evidence": [
        "E169-autres-second-lot.md",
        "https://www.lalibre.be/belgique/judiciaire/2026/09/29/les-motivations-de-nicolas-ullens-corroborees-par-ses-proches-BTIQPMQ3AJARFENXBC2Y3BUFTM/",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "associationmodeemploi-fr",
      "provider": "europresse",
      "name": "Associations Mode d'Emploi",
      "hosts": [
        "www.associationmodeemploi.fr"
      ],
      "path": "^/article/[a-z0-9-]+\\.[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Ancien témoin gratuit retrouvé ; deux témoins récents réservés non retrouvés. Disponibilité récente non garantie.",
      "catalog_resource_id": "europresse-akn-p",
      "evidence": [
        "E076-ASSOCIATIONS.md",
        "https://www.associationmodeemploi.fr/article/printemps-de-la-ruralite-bilan-des-concertations-regionales.77259",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "focus-levif-be",
      "provider": "europresse",
      "name": "Le Vif + Focus",
      "hosts": [
        "focus.levif.be"
      ],
      "path": "^/livres/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Le titre archivé diffère du lien et apparaît après plusieurs voisins. Saisissez des mots distinctifs ; origine exacte et intégralité non confirmées. Sans date, essai avec les mots déduits du lien, toutes sources. Un voisin peut s’ouvrir ou aucun résultat être disponible.",
      "catalog_resource_id": "europresse-bvi-p",
      "evidence": [
        "E087-vif-weekend-focus.md",
        "https://focus.levif.be/livres/inspiree-par-maigret-philippe-jaenada-offre-une-nouvelle-investigation-litteraire/",
        "E168-autres-titres.md",
        "BLOCKED-TESTS-2026-10-06.md : essai URL seule sans date ; résultat et disponibilité non garantis."
      ]
    },
    {
      "id": "24heures-ch",
      "provider": "europresse",
      "name": "24 Heures",
      "hosts": [
        "www.24heures.ch"
      ],
      "path": "^/[a-z0-9-]+-[0-9]{12}$",
      "enabled": true,
      "status": "experimental",
      "title_word_strategy": "concise",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Trois mots issus du lien pour tolérer les titres reformulés. Une recherche courte peut ouvrir un voisin ou une reprise papier : vérifiez le titre et la publication.",
      "catalog_resource_id": "europresse-wv-p",
      "evidence": [
        "E081-24HEURES.md",
        "https://www.24heures.ch/enfants-trois-sujets-de-dispute-a-eviter-devant-eux-892506103317",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "lyonne-fr",
      "provider": "europresse",
      "name": "L'Yonne Républicaine",
      "hosts": [
        "www.lyonne.fr"
      ],
      "path": "^/[a-z0-9-]+/[a-z-]+/[a-z0-9-]+_[0-9]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Les versions web sont présentes après un ancien article papier. Notices courtes ; intégralité non confirmée.",
      "catalog_resource_id": "europresse-fry-p",
      "evidence": [
        "E075-YONNE.md",
        "https://www.lyonne.fr/tonnerre-89700/actualites/nous-avons-chacun-notre-specificite-le-tonnerrois-et-le-chablisien-reprennent-leur-independance-en-matiere-de-tourisme_15056114/",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "leberry-fr",
      "provider": "europresse",
      "name": "Le Berry républicain",
      "hosts": [
        "www.leberry.fr"
      ],
      "path": "^/[a-z0-9-]+/[a-z-]+/[a-z0-9-]+_[0-9]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Titre web retrouvé, avec des voisins possibles. Notice courte ; intégralité non confirmée.",
      "catalog_resource_id": "europresse-frb-p",
      "evidence": [
        "E082-BERRY.md",
        "https://www.leberry.fr/vierzon-18100/actualites/quatre-douches-pour-60-filles-des-lits-qui-se-devissent-l-internat-source-de-colere-des-lyceens-d-henri-brisson-a-vierzon_15056436/",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "ledevoir-com",
      "provider": "europresse",
      "name": "Le Devoir",
      "hosts": [
        "www.ledevoir.com"
      ],
      "path": "^/lire/[0-9]+/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Titre demandé présent dans les résultats. Avec deux mots seulement, un autre journal s'ouvre en premier. Rubrique lire seulement qualifiée.",
      "catalog_resource_id": "europresse-le-p",
      "evidence": [
        "E088-devoir.md",
        "https://www.ledevoir.com/lire/1013336/sonia-sarfati-ecrit-mort-mots-bien-vivants",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "politis-fr",
      "title_word_strategy": "concise",
      "title_url_prefixes": [
        "analyse",
        "analyse-ecologie",
        "analyse-racisme-environnemental",
        "billet-derniere-chronique-de-bonne-humeur",
        "carte-blanche",
        "carte-blanche-florence-association-asalee",
        "cinema-notre-salut-entretien",
        "cinema-restrospective",
        "cinema-sarah-arnold",
        "cinema-sylvie-meyer-salmona",
        "culture-entretien-labed-medine-rinkel",
        "decryptage",
        "economie",
        "economie-politique",
        "education",
        "education-enquete",
        "education-outremer",
        "enquete",
        "entretien",
        "entretien-ange-pottin",
        "entretien-aspas-holding",
        "entretien-benoit-celnik-assoiffeurs",
        "entretien-david-yambio",
        "entretien-dean-baker",
        "entretien-francois-rastier",
        "entretien-irenee-regnauld",
        "entretien-kamel-brahmi",
        "entretien-philippe-grandcolas",
        "entretien-robi-morder",
        "entretien-samia-el-khalfaoui",
        "entretien-stephanie-hennette-vauchez",
        "entretien-steven-levitsky",
        "festival-village-du",
        "hs83-entretien-tassiana-ait-tahar-uber-life",
        "hs83-entretien-timothee-parrique",
        "hs83-fiction",
        "idees",
        "idees-arya-meroni-loose-finale",
        "idees-temoignage",
        "intersections",
        "intersections-beausson-diagne",
        "justice",
        "lettre-ouverte",
        "litterature-bd",
        "litterature-prudhomme",
        "live",
        "medias-presse",
        "monde",
        "monde-allemagne",
        "monde-enquete",
        "monde-portrait",
        "monde-reportage",
        "monde-reportage-egypte",
        "musique-ibibio-sound-machine",
        "musique-nina-winder-lind",
        "musique-sullivan-fortner",
        "nadege-beausson-diagne",
        "parti-pris",
        "parti-pris-mobilisations-sociales",
        "politique",
        "politique-culturelle",
        "politique-elections",
        "politique-pcf",
        "politique-senatoriales",
        "regard-denis-sieffert",
        "regard-denis-sieffert-cinema",
        "reportage",
        "reportage-atelier-paysan",
        "reportage-ecologie",
        "reportage-justice",
        "reportage-mobilisation-lyceenne",
        "reportage-orne",
        "reportage-paris",
        "reportage-racisme-environnemental-antitsiganisme",
        "reportage-tribunal-violences",
        "sante-enquete",
        "sante-entretien-jonville-bera",
        "senatoriales-politique",
        "societe",
        "spectacle",
        "sur-le-gril",
        "surl-le-gril",
        "temoignages",
        "travail-medias",
        "tribune",
        "tribunes-sdj"
      ],
      "provider": "europresse",
      "name": "Politis",
      "hosts": [
        "www.politis.fr"
      ],
      "path": "^/articles/[0-9]{4}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Lien d'origine exact retrouvé ; notice web courte, intégralité non confirmée.",
      "catalog_resource_id": "europresse-akc-p",
      "evidence": [
        "E100-politis.md",
        "https://www.politis.fr/articles/2026/10/enquete-au-cra-de-toulouse-cornebarrieu-des-personnes-scotchees-a-lisolement/",
        "E168-autres-titres.md",
        "POLITIS-PREFIX-INVENTORY-2026-10-06.md : observed leading URL prefixes; coverage and archive matching remain partial."
      ]
    },
    {
      "id": "ash-tm-fr",
      "provider": "europresse",
      "name": "Actualités Sociales Hebdomadaires",
      "hosts": [
        "www.ash.tm.fr"
      ],
      "path": "^/[a-z0-9/-]+-[0-9]+\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Titre réservé retrouvé. Le numéro public ne permet pas de déduire la référence interne ; recherche par titre seulement.",
      "catalog_resource_id": "europresse-kas-p",
      "evidence": [
        "E066-ASH.md",
        "https://www.ash.tm.fr/autonomie/quand-un-proche-aidant-sur-trois-naccede-pas-au-repit-souhaite-975160.php",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "biofil-fr",
      "provider": "europresse",
      "name": "Biofil",
      "hosts": [
        "www.biofil.fr"
      ],
      "path": "^/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Deux variantes du titre retrouvées. Notice très courte ; intégralité du texte réservé non confirmée.",
      "catalog_resource_id": "europresse-fib-p",
      "evidence": [
        "E067-BIOFIL.md",
        "https://www.biofil.fr/actualites/marche-de-la-bio-une-reprise-confirmee-au-premier-semestre-2026/",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "air-cosmos-latribune-fr",
      "provider": "europresse",
      "name": "Air et Cosmos",
      "hosts": [
        "air-cosmos.latribune.fr"
      ],
      "path": "^/article/[a-z-]+/[0-9]+/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Versions web et papier retrouvées. Ancien domaine air-cosmos.com non converti ; ne pas confondre leurs dates.",
      "catalog_resource_id": "europresse-gx-p",
      "evidence": [
        "E052-AIR-COSMOS.md",
        "https://air-cosmos.latribune.fr/article/innovation-technologies/67394886250018/le-missile-strategique-sentinel-franchit-une-etape-cle-malgre-les-retards",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "lechotouristique-com",
      "provider": "europresse",
      "name": "L'Écho Touristique",
      "hosts": [
        "www.lechotouristique.com"
      ],
      "path": "^/article/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Témoin réservé d'avril retrouvé ; témoin récent non retrouvé. La couverture des liens récents n'est pas garantie.",
      "catalog_resource_id": "europresse-gie-p",
      "evidence": [
        "E086-echo-touristique.md",
        "https://www.lechotouristique.com/article/ia-dans-le-tourisme-les-alertes-et-conseils-des-avocates-llop-et-tarragano",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "lavenir-net",
      "provider": "europresse",
      "name": "L'Avenir",
      "hosts": [
        "www.lavenir.net"
      ],
      "path": "^/actu/[a-z0-9/-]+-[A-Z2-7]{26}/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Ancien témoin réservé retrouvé ; témoin du 1er octobre non retrouvé. Le suffixe public n'est pas l'identifiant interne.",
      "catalog_resource_id": "europresse-bav-p",
      "evidence": [
        "E069-AVENIR.md",
        "https://www.lavenir.net/actu/belgique/politique/2026/09/07/fin-des-nominations-pour-les-enseignants-instauration-dun-cdie-valerie-glatigny-joue-la-montre-et-avec-les-nerfs-de-lopposition-UVAVP3P4FVGIHEEOZH4V5SUCPI/",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "lagazettedescommunes-com",
      "provider": "europresse",
      "name": "La Gazette des Communes",
      "hosts": [
        "www.lagazettedescommunes.com"
      ],
      "path": "^/[a-z0-9/-]+\\.[A-Z2-7]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Version magazine retrouvée, datée après le web. Équivalence intégrale au web non prouvée ; vérifier la version.",
      "catalog_resource_id": "europresse-mog-p",
      "evidence": [
        "E053-GAZETTE.md",
        "https://www.lagazettedescommunes.com/emploi-et-carriere/metiers-de-la-fonction-publique/mercato-dans-la-tete-des-nouveaux-dgs.N3FCEDO4FNJWROTZTGS6P6KSO4.html",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "liberation-champagne-fr",
      "provider": "europresse",
      "name": "Libération Champagne",
      "hosts": [
        "www.liberation-champagne.fr"
      ],
      "path": "^/id[0-9]+/article/[0-9]{4}-[0-9]{2}-[0-9]{2}/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Deux publications proposent ce titre. La notice Champagne est courte ; ne pas substituer silencieusement L'Est éclair.",
      "catalog_resource_id": "europresse-vnf-p",
      "evidence": [
        "E094-liberation-champagne.md",
        "https://www.liberation-champagne.fr/id831252/article/2026-10-01/ces-aubois-temoignent-de-leur-engagement-en-tant-que-reservistes",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "lessorsavoyard-lemessager-fr",
      "provider": "europresse",
      "name": "L'Essor Savoyard",
      "hosts": [
        "lessorsavoyard.lemessager.fr"
      ],
      "path": "^/[0-9]+/article/([0-9]{4}-[0-9]{2}-[0-9]{2})/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title"
      ],
      "date": {
        "type": "captures",
        "groups": [
          1
        ]
      },
      "message": "Reference calculee depuis la date et le lien, sous le domaine canonique du Messager. Version web partagee ; verifiez la publication.",
      "date_message": "",
      "limitations": "Sujet retrouvé dans Le Messager web et papier, pas une preuve d'édition Essor distincte. Vérifiez le titre et la publication. Empreinte canonique verifiee sur deux temoins de ce sous-site. Ne garantit pas les anciennes URL ou une edition papier distincte.",
      "catalog_resource_id": "europresse-vnj-p",
      "evidence": [
        "E096-essor-savoyard.md",
        "https://lessorsavoyard.lemessager.fr/649358399/article/2026-10-01/jo-2030-high-five-grand-bornand-la-nouvelle-vie-sportive-de-la-skieuse-tessa",
        "E168-autres-titres.md",
        "MESSAGER-DOMAINES-CANONIQUES-2026-10-08.md"
      ],
      "reference": {
        "type": "url-sha1",
        "source_code": "AJK",
        "prefix": "hw27",
        "canonical_host": "www.lemessager.fr"
      }
    },
    {
      "id": "trends-levif-be",
      "provider": "europresse",
      "name": "Trends Tendances",
      "hosts": [
        "trends.levif.be"
      ],
      "path": "^/a-la-une/[a-z0-9/-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Version francophone Trends Tendances, pas le magazine néerlandais Trends. Origine exacte et intégralité non confirmées.",
      "catalog_resource_id": "europresse-btd-p",
      "evidence": [
        "E108-trends.md",
        "https://trends.levif.be/a-la-une/politique-economique/bruxelles/schuman-kanal-audi-midi-des-tests-grandeur-nature-pour-le-gouvernement-bruxellois/",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "agefi-fr",
      "provider": "europresse",
      "name": "L'AGEFI - Quotidien",
      "hosts": [
        "www.agefi.fr"
      ],
      "path": "^/news/[a-z0-9/-]+-[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Titre réservé retrouvé. Aucune collecte automatique du site public ; les éditions et éventuels délais ne sont pas interchangeables.",
      "catalog_resource_id": "europresse-ga-p",
      "evidence": [
        "E106-agefi.md",
        "https://www.agefi.fr/news/economie-marches/paris-cherche-a-preserver-un-vernis-de-credibilite-budgetaire",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "beaboss-fr",
      "provider": "europresse",
      "name": "Be a Boss",
      "hosts": [
        "www.beaboss.fr"
      ],
      "path": "^/[a-z0-9/-]+-[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Témoin public gratuit retrouvé avec lien d'origine exact. Disponibilité des contenus premium non vérifiée.",
      "catalog_resource_id": "europresse-ece-p",
      "evidence": [
        "E170-autres-netmedia.md",
        "https://www.beaboss.fr/digital-1074/transformation-digitale-2029/linagora-defie-les-geants-americains-56012",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "decision-achats-fr",
      "provider": "europresse",
      "name": "Décision Achats",
      "hosts": [
        "www.decision-achats.fr"
      ],
      "path": "^/[a-z0-9/-]+-[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Titre et identifiant retrouvés ; rubrique du lien archivé différente. Témoin gratuit, disponibilité premium non vérifiée.",
      "catalog_resource_id": "europresse-ede-p",
      "evidence": [
        "E170-autres-netmedia.md",
        "https://www.decision-achats.fr/reemploi/polyester-recycle-quand-une-matiere-alternative-devient-enfin-qualifiable-par-les-acheteurs-52588",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "ecommercemag-fr",
      "provider": "europresse",
      "name": "E-Commerce",
      "hosts": [
        "www.ecommercemag.fr"
      ],
      "path": "^/[a-z0-9/-]+-[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Témoin public gratuit retrouvé avec lien d'origine exact. Disponibilité des contenus premium non vérifiée.",
      "catalog_resource_id": "europresse-eec-p",
      "evidence": [
        "E170-autres-netmedia.md",
        "https://www.ecommercemag.fr/logistique-1222/veille-tribune-2183/pick-and-smile-deploie-450-relais-et-franchit-le-cap-des-700-59918",
        "E168-autres-titres.md"
      ]
    },
    {
      "id": "qualified-europresse-psg-p",
      "provider": "europresse",
      "name": "Saanich News",
      "catalog_resource_id": "europresse-psg-p",
      "hosts": [
        "saanichnews.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://saanichnews.com/2026/09/07/saanich-choir-creates-community-through-music-for-people-with-memory-loss/"
      ]
    },
    {
      "id": "qualified-europresse-vg-p",
      "provider": "europresse",
      "name": "Journal Le Nord (Hearst)",
      "catalog_resource_id": "europresse-vg-p",
      "hosts": [
        "lenord.ca"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://lenord.ca/2026/09/04/les-peptides-injectables-ce-quil-faut-savoir/"
      ]
    },
    {
      "id": "qualified-europresse-pqr-p",
      "provider": "europresse",
      "name": "Lake Country Calendar",
      "catalog_resource_id": "europresse-pqr-p",
      "hosts": [
        "lakecountrycalendar.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://lakecountrycalendar.com/2026/09/07/lake-country-gets-first-mayoral-candidate-in-priscila-brunetto/"
      ]
    },
    {
      "id": "qualified-europresse-ppl-p",
      "provider": "europresse",
      "name": "Kimberley Bulletin",
      "catalog_resource_id": "europresse-ppl-p",
      "hosts": [
        "kimberleybulletin.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://kimberleybulletin.com/2026/09/03/city-temporarily-opens-burdett-st-to-two-way-traffic/"
      ]
    },
    {
      "id": "qualified-europresse-tu-p",
      "provider": "europresse",
      "name": "L'Actualité",
      "catalog_resource_id": "europresse-tu-p",
      "hosts": [
        "lactualite.com"
      ],
      "path": "^/politique/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://lactualite.com/politique/charles-milliard-dans-lombre-dun-parti-cameleon/"
      ]
    },
    {
      "id": "qualified-europresse-iy-p",
      "provider": "europresse",
      "name": "L'Express (Drummondville)",
      "catalog_resource_id": "europresse-iy-p",
      "hosts": [
        "www.journalexpress.ca"
      ],
      "path": "^/actualite/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.journalexpress.ca/actualite/un-evenement-pour-decouvrir-durham-sud-autrement/"
      ]
    },
    {
      "id": "qualified-europresse-qic-p",
      "provider": "europresse",
      "name": "L'info du Nord - Mont-Tremblant (QC)",
      "catalog_resource_id": "europresse-qic-p",
      "hosts": [
        "infodunordtremblant.ca"
      ],
      "path": "^/article/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://infodunordtremblant.ca/article/actualites/une-veste-ingenieuse-pour-liberer-les-skieurs-du-sac-a-dos/"
      ]
    },
    {
      "id": "qualified-europresse-qen-p",
      "provider": "europresse",
      "name": "L'Éclaireur-Progrès",
      "catalog_resource_id": "europresse-qen-p",
      "hosts": [
        "www.leclaireurprogres.ca"
      ],
      "path": "^/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.leclaireurprogres.ca/actualites/saint-come-liniere-se-developpe-a-vitesse-grand-v/"
      ]
    },
    {
      "id": "qualified-europresse-ox-p",
      "provider": "europresse",
      "name": "L'Étoile du Lac",
      "catalog_resource_id": "europresse-ox-p",
      "hosts": [
        "www.letoiledulac.com"
      ],
      "path": "^/actualites/673948/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.letoiledulac.com/actualites/673948/les-chambres-de-commerce-interpellent-les-candidats"
      ]
    },
    {
      "id": "qualified-europresse-eo-p",
      "provider": "europresse",
      "name": "La Lettre de l'Expansion",
      "catalog_resource_id": "europresse-eo-p",
      "hosts": [
        "lalettredelexpansion.com"
      ],
      "path": "^/article/71753/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://lalettredelexpansion.com/article/71753/elliott-le-pretexte-reve-de-francois-jackow-pour-reveiller-air-liquide"
      ]
    },
    {
      "id": "qualified-europresse-fiv-p",
      "provider": "europresse",
      "name": "La Revue de l'Alimentation Animale",
      "catalog_resource_id": "europresse-fiv-p",
      "hosts": [
        "www.revue-alimentation-animale.fr"
      ],
      "path": "^/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.revue-alimentation-animale.fr/actualites/cooperatives-la-nutrition-animale-contributrice-de-la-valeur-ajoutee-des-elevages/"
      ]
    },
    {
      "id": "qualified-europresse-tz-p",
      "provider": "europresse",
      "name": "La Terre de chez Nous",
      "catalog_resource_id": "europresse-tz-p",
      "hosts": [
        "www.laterre.ca"
      ],
      "path": "^/actualites/territoire/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.laterre.ca/actualites/territoire/sept-nouveaux-secteurs-reconnus-comme-regions-peripheriques/"
      ]
    },
    {
      "id": "qualified-europresse-aaa-p",
      "provider": "europresse",
      "name": "Le Cœur des Chefs",
      "catalog_resource_id": "europresse-aaa-p",
      "hosts": [
        "lecoeurdeschefs.com"
      ],
      "path": "^/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://lecoeurdeschefs.com/alexandre-mazzia-toujours-avec-le-coeur-le-premier-livre-du-chef-du-restaurant-am-a-marseille-2/"
      ]
    },
    {
      "id": "qualified-europresse-ccm-p",
      "provider": "europresse",
      "name": "Le Courrier des Maires et des Élus Locaux",
      "catalog_resource_id": "europresse-ccm-p",
      "hosts": [
        "www.courrierdesmaires.fr"
      ],
      "path": "^/article/[a-z0-9-]+\\.[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.courrierdesmaires.fr/article/mono-industrie-en-fin-de-cycle-les-ressorts-d-une-reconversion-locale-reussie.60239"
      ]
    },
    {
      "id": "qualified-europresse-oz-p",
      "provider": "europresse",
      "name": "Le Courrier Sud",
      "catalog_resource_id": "europresse-oz-p",
      "hosts": [
        "www.lecourriersud.com"
      ],
      "path": "^/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.lecourriersud.com/actualites/quebec-solidaire-promet-une-candidature-dans-nicolet-becancour/"
      ]
    },
    {
      "id": "qualified-europresse-fif-p",
      "provider": "europresse",
      "name": "Le Journal des Fluides",
      "catalog_resource_id": "europresse-fif-p",
      "hosts": [
        "www.lejournaldesfluides.com"
      ],
      "path": "^/a-la-une/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.lejournaldesfluides.com/a-la-une/deru-2-comment-apprehender-la-nouvelle-directive-europeenne/"
      ]
    },
    {
      "id": "qualified-europresse-fij-p",
      "provider": "europresse",
      "name": "Le Journal du Vrac",
      "catalog_resource_id": "europresse-fij-p",
      "hosts": [
        "www.lejournalduvrac.com"
      ],
      "path": "^/technologies/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.lejournalduvrac.com/technologies/innovation-connaissez-vous-le-nouveau-concept-de-manches-filtrantes-sybag/"
      ]
    },
    {
      "id": "qualified-europresse-akz-p",
      "provider": "europresse",
      "name": "Le Moniteur Matériels",
      "catalog_resource_id": "europresse-akz-p",
      "hosts": [
        "www.lemoniteurmateriels.fr"
      ],
      "path": "^/article/[a-z0-9-]+,[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.lemoniteurmateriels.fr/article/dans-la-drome-les-tours-du-tricastin-grignotees-par-un-outil-hors-norme,1771130"
      ]
    },
    {
      "id": "qualified-europresse-pq-p",
      "provider": "europresse",
      "name": "Le Progrès de Coaticook",
      "catalog_resource_id": "europresse-pq-p",
      "hosts": [
        "www.leprogres.net"
      ],
      "path": "^/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.leprogres.net/actualites/le-logement-abordable-et-la-participation-sociale-au-coeur-des-preoccupations-des-coaticookois/"
      ]
    },
    {
      "id": "qualified-europresse-jn-p",
      "provider": "europresse",
      "name": "Le Reflet du Lac",
      "catalog_resource_id": "europresse-jn-p",
      "hosts": [
        "www.lerefletdulac.com"
      ],
      "path": "^/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.lerefletdulac.com/actualites/christine-frechette-promet-200-m-pour-la-sepaq/"
      ]
    },
    {
      "id": "qualified-europresse-qsl-p",
      "provider": "europresse",
      "name": "Le Soleil de Châteauguay",
      "catalog_resource_id": "europresse-qsl-p",
      "hosts": [
        "cybersoleil.com"
      ],
      "path": "^/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://cybersoleil.com/la-nouvelle-ecole-notre-dame-de-la-paix-en-chantier/"
      ]
    },
    {
      "id": "qualified-europresse-qaa-p",
      "provider": "europresse",
      "name": "Les 2 Rives",
      "catalog_resource_id": "europresse-qaa-p",
      "hosts": [
        "les2rives.com"
      ],
      "path": "^/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://les2rives.com/quebec-solidaire-a-trouve-son-candidat-dans-richelieu/"
      ]
    },
    {
      "id": "qualified-europresse-pqx-p",
      "provider": "europresse",
      "name": "Monday Magazine",
      "catalog_resource_id": "europresse-pqx-p",
      "hosts": [
        "mondaymag.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://mondaymag.com/2026/05/29/the-spirit-of-new-orleans-is-coming-to-ladysmith/"
      ]
    },
    {
      "id": "qualified-europresse-oj-p",
      "provider": "europresse",
      "name": "Ottawa Business Journal",
      "catalog_resource_id": "europresse-oj-p",
      "hosts": [
        "obj.ca"
      ],
      "path": "^/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://obj.ca/next-frontier-ottawa-firms-space-infrastructure/"
      ]
    },
    {
      "id": "qualified-europresse-anu-p",
      "provider": "europresse",
      "name": "People at Work",
      "catalog_resource_id": "europresse-anu-p",
      "hosts": [
        "peopleatwork-mag.com"
      ],
      "path": "^/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://peopleatwork-mag.com/la-revanche-du-bureau-pourquoi-le-presentiel-redevient-un-atout-strategique/"
      ]
    },
    {
      "id": "qualified-europresse-pse-p",
      "provider": "europresse",
      "name": "Rimbey Review",
      "catalog_resource_id": "europresse-pse-p",
      "hosts": [
        "rimbeyreview.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://rimbeyreview.com/2026/09/03/rimbey-rcmp-encourages-safety-around-farm-machinery-during-harvest/"
      ]
    },
    {
      "id": "qualified-europresse-lgp-p",
      "provider": "europresse",
      "name": "South Shore Bulletin",
      "catalog_resource_id": "europresse-lgp-p",
      "hosts": [
        "www.southshorebulletin.ca"
      ],
      "path": "^/breaking-news-1/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.southshorebulletin.ca/breaking-news-1/dares-lake-dam-breach-stabilized"
      ]
    },
    {
      "id": "qualified-europresse-wsp-p",
      "provider": "europresse",
      "name": "Sport Stratégies",
      "catalog_resource_id": "europresse-wsp-p",
      "hosts": [
        "www.sportstrategies.com"
      ],
      "path": "^/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.sportstrategies.com/helene-schrub-a-la-lfp-anne-murac-chez-cadence-running-united-deux-nominations-qui-comptent/"
      ]
    },
    {
      "id": "qualified-europresse-psp-p",
      "provider": "europresse",
      "name": "Stettler Independent",
      "catalog_resource_id": "europresse-psp-p",
      "hosts": [
        "stettlerindependent.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://stettlerindependent.com/2026/09/04/stettler-community-wide-garage-sale-boosts-local-tourism-and-youth-vendors/"
      ]
    },
    {
      "id": "qualified-europresse-ppc-p",
      "provider": "europresse",
      "name": "The News (Abbotsford)",
      "catalog_resource_id": "europresse-ppc-p",
      "hosts": [
        "abbynews.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://abbynews.com/2026/09/05/candidates-finalized-for-abbotsford-mission-byelection/"
      ]
    },
    {
      "id": "qualified-europresse-ptb-p",
      "provider": "europresse",
      "name": "The Parksville Qualicum Beach News (BC)",
      "catalog_resource_id": "europresse-ptb-p",
      "hosts": [
        "pqbnews.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://pqbnews.com/2026/09/07/non-market-housing-forum-planned-for-sept-20-in-parksville/"
      ]
    },
    {
      "id": "qualified-europresse-pqu-p",
      "provider": "europresse",
      "name": "The Pipestone Flyer",
      "catalog_resource_id": "europresse-pqu-p",
      "hosts": [
        "pipestoneflyer.ca"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://pipestoneflyer.ca/2026/09/06/greetings-from-ashoro-building-bridges-through-cultural-exchange-hiroshima-to-canada/"
      ]
    },
    {
      "id": "qualified-europresse-rd-p",
      "provider": "europresse",
      "name": "The Red Deer Advocate",
      "catalog_resource_id": "europresse-rd-p",
      "hosts": [
        "reddeeradvocate.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://reddeeradvocate.com/2026/09/07/canadian-labour-congress-official-alberta-ndp-leader-speak-at-labour-day-event-in-red-deer/"
      ]
    },
    {
      "id": "qualified-europresse-ptd-p",
      "provider": "europresse",
      "name": "The Williams Lake Tribune",
      "catalog_resource_id": "europresse-ptd-p",
      "hosts": [
        "wltribune.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://wltribune.com/2026/09/05/williams-lake-city-councillor-michael-moses-seeks-another-term/"
      ]
    },
    {
      "id": "qualified-europresse-qbm-p",
      "provider": "europresse",
      "name": "Beauce Média",
      "catalog_resource_id": "europresse-qbm-p",
      "hosts": [
        "www.beaucemedia.ca"
      ],
      "path": "^/sports/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.beaucemedia.ca/sports/xavier-pouliot-ratera-toute-la-saison-2026-2027/"
      ]
    },
    {
      "id": "qualified-europresse-fc-p",
      "provider": "europresse",
      "name": "Courrier Frontenac",
      "catalog_resource_id": "europresse-fc-p",
      "hosts": [
        "www.courrierfrontenac.qc.ca"
      ],
      "path": "^/communaute/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.courrierfrontenac.qc.ca/communaute/don-de-7000-remis-a-la-maison-de-fin-de-vie/"
      ]
    },
    {
      "id": "qualified-press-title-le-journal-des-entreprises",
      "provider": "europresse",
      "name": "Le Journal des Entreprises",
      "catalog_resource_id": "press-title-le-journal-des-entreprises",
      "hosts": [
        "www.lejournaldesentreprises.com"
      ],
      "path": "^/article/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.lejournaldesentreprises.com/article/appel-medical-lance-le-recrutement-de-6-200-professionnels-de-sante-en-france-2147233"
      ]
    },
    {
      "id": "qualified-europresse-prt-p",
      "provider": "europresse",
      "name": "Le Particulier",
      "catalog_resource_id": "europresse-prt-p",
      "hosts": [
        "leparticulier.lefigaro.fr"
      ],
      "path": "^/jcms/c_113077/argent/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://leparticulier.lefigaro.fr/jcms/c_113077/argent/gare-aux-faux-articles-de-presse-qui-usurpent-les-noms-de-jean-luc-melenchon-ou-de-christine-lagarde-pour-promouvoir-un-site-de-trading-frauduleux-20260820"
      ]
    },
    {
      "id": "qualified-europresse-zl-p",
      "provider": "europresse",
      "name": "Les Affaires",
      "catalog_resource_id": "europresse-zl-p",
      "hosts": [
        "www.lesaffaires.com"
      ],
      "path": "^/dossiers/defense-et-securite-un-nouveau-fleuron-canadien/[a-z0-9_-]+_[0-9]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.lesaffaires.com/dossiers/defense-et-securite-un-nouveau-fleuron-canadien/defense-une-politique-transformatrice-pour-le-canada-et-pour-lindustrie-edition_17_juin_2026/",
        "2026-10-07 : URL seule KO avec six mots, dont lindustrie et edition. Selection concise generique : defense/politique/transformatrice retrouve deux notices, papier 1 juin 2026 et web 17 juin 2026. Aucun mot ni date du temoin injecte. Voir AFFAIRES-TELEOBS-TDG-2026-10-07.md."
      ],
      "title_word_strategy": "concise"
    },
    {
      "id": "qualified-europresse-moc-p",
      "provider": "europresse",
      "name": "Les Cahiers Techniques du Bâtiment",
      "catalog_resource_id": "europresse-moc-p",
      "hosts": [
        "www.cahiers-techniques-batiment.fr"
      ],
      "path": "^/article/[a-z0-9-]+\\.[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.cahiers-techniques-batiment.fr/article/clement-gaillard-nous-avons-fabrique-l-obsolescence-climatique.72736"
      ]
    },
    {
      "id": "qualified-europresse-gin-p",
      "provider": "europresse",
      "name": "Néorestauration",
      "catalog_resource_id": "europresse-gin-p",
      "hosts": [
        "www.neorestauration.com"
      ],
      "path": "^/article/[a-z0-9-]+,[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.neorestauration.com/article/au-restaurant-les-francais-boudent-le-cafe-a-la-fin-du-repas,74343"
      ]
    },
    {
      "id": "qualified-europresse-opt-p",
      "provider": "europresse",
      "name": "Option Finance",
      "catalog_resource_id": "europresse-opt-p",
      "hosts": [
        "www.optionfinance.fr"
      ],
      "path": "^/dossiers-partenaires/dossier-partenaire-natixis-im/[a-z0-9-]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.optionfinance.fr/dossiers-partenaires/dossier-partenaire-natixis-im/comment-naviguer-au-sein-des-marches-obligataires-dans-une-economie-mondiale-fragmentee-1.html"
      ]
    },
    {
      "id": "qualified-europresse-ky-p",
      "title_word_strategy": "concise",
      "provider": "europresse",
      "name": "Process Alimentaire",
      "catalog_resource_id": "europresse-ky-p",
      "hosts": [
        "www.processalimentaire.com"
      ],
      "path": "^/vie-des-iaa/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.processalimentaire.com/vie-des-iaa/chocmod-accelere-sur-la-guimauve-et-vise-les-100-meu-de-chiffre-d-affaires-en-2030"
      ]
    },
    {
      "id": "qualified-europresse-sca-p",
      "provider": "europresse",
      "name": "Sciences et Avenir - La Recherche",
      "catalog_resource_id": "europresse-sca-p",
      "hosts": [
        "www.sciencesetavenir.fr"
      ],
      "path": "^/animaux/animaux-marins/[a-z0-9_-]+_[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://www.sciencesetavenir.fr/animaux/animaux-marins/grand-requin-blanc-en-mediterranee-pourquoi-il-est-si-rare-malgre-de-recentes-observations_193256"
      ]
    },
    {
      "id": "qualified-europresse-ppu-p",
      "provider": "europresse",
      "name": "The Chilliwack Progress",
      "catalog_resource_id": "europresse-ppu-p",
      "hosts": [
        "theprogress.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Temoin retrouve par formulaire puis trajet Link le 6 octobre 2026. Toutes dates et tous journaux : une reprise ou un article voisin reste possible. La version papier peut avoir un autre titre ou une autre date. Integralite du contenu reserve non garantie.",
      "evidence": [
        "INACTIVE-V2-2026-10-06.md",
        "https://theprogress.com/2026/08/30/combine-relaxation-and-history-with-yoga-classes-at-chilliwack-museum/",
        "2026-10-07 : URL seule, selection concise existante : combine/relaxation/history. Le trajet automatique ouvre The Chilliwack Progress, 18 septembre 2026, 461 mots, page 20, Combine relaxation and history with yoga classes at the museum. Chilliwack est absent du titre papier : les six mots initiaux donnaient zero resultat et une erreur interne. Trois mots donnent dix notices, article attendu en premier ; voisins possibles. Aucun titre ni date injectes, aucun appel Microlink."
      ],
      "title_word_strategy": "concise"
    },
    {
      "id": "followup-europresse-an-p",
      "provider": "europresse",
      "name": "Acadie Nouvelle",
      "catalog_resource_id": "europresse-an-p",
      "hosts": [
        "www.acadienouvelle.com"
      ],
      "path": "^/actualites/2026/08/31/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoins controles par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : les reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "FOLLOWUP-2026-10-06.md",
        "https://www.acadienouvelle.com/actualites/2026/08/31/hausse-des-primes-dassurance-habitation-la-faute-aux-changements-climatiques/"
      ],
      "title_word_strategy": "balanced"
    },
    {
      "id": "followup-europresse-cno-p",
      "provider": "europresse",
      "name": "Coup d'Œil",
      "catalog_resource_id": "europresse-cno-p",
      "hosts": [
        "www.coupdoeil.info"
      ],
      "path": "^/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoins controles par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : les reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "FOLLOWUP-2026-10-06.md",
        "https://www.coupdoeil.info/actualites/des-oreilles-au-bout-des-doigts-sylvain-cormier-presente-35-ans-de-rendez-vous-musicaux/",
        "https://www.coupdoeil.info/actualites/elections-provinciales-2026-camille-pellerin-forget-representera-le-pq-dans-iberville/",
        "https://www.coupdoeil.info/actualites/napierville-decouverte-de-deux-ratons-laveurs-atteints-de-la-rage/"
      ]
    },
    {
      "id": "followup-europresse-sre-p",
      "provider": "europresse",
      "name": "La Recherche",
      "catalog_resource_id": "europresse-sre-p",
      "hosts": [
        "larecherche.fr"
      ],
      "path": "^/climat/[a-zA-Z0-9%-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoins controles par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : les reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "FOLLOWUP-2026-10-06.md",
        "https://larecherche.fr/climat/comment-les-climatologues-r%C3%A9inventent-leurs-sc%C3%A9narios-du-futur"
      ]
    },
    {
      "id": "followup-europresse-vk-p",
      "provider": "europresse",
      "name": "Le Franco",
      "catalog_resource_id": "europresse-vk-p",
      "hosts": [
        "lefranco.ab.ca"
      ],
      "path": "^/arts-et-culture/2026/08/24/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoins controles par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : les reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "FOLLOWUP-2026-10-06.md",
        "https://lefranco.ab.ca/arts-et-culture/2026/08/24/en-alberta-une-diversite-culturelle-meconnue/"
      ]
    },
    {
      "id": "followup-europresse-can-p",
      "provider": "europresse",
      "name": "Le Canada Français",
      "catalog_resource_id": "europresse-can-p",
      "hosts": [
        "www.canadafrancais.com"
      ],
      "path": "^/actualite/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoins controles par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : les reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "FOLLOWUP-2026-10-06.md",
        "https://www.canadafrancais.com/actualite/la-crise-du-logement-une-priorite-pour-quebec-solidaire/",
        "https://www.canadafrancais.com/actualite/la-ferme-du-mihouli-ouvre-ses-portes-le-13-septembre/"
      ]
    },
    {
      "id": "followup-europresse-cnx-p",
      "provider": "europresse",
      "name": "Granby Express",
      "catalog_resource_id": "europresse-cnx-p",
      "hosts": [
        "www.granbyexpress.com"
      ],
      "path": "^/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoins controles par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : les reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "FOLLOWUP-2026-10-06.md",
        "https://www.granbyexpress.com/actualites/circonscription-de-granby-la-feuille-de-route-des-candidats/"
      ]
    },
    {
      "id": "followup-europresse-fx-p",
      "provider": "europresse",
      "name": "L'Aurore Boréale",
      "catalog_resource_id": "europresse-fx-p",
      "hosts": [
        "auroreboreale.ca"
      ],
      "path": "^/actualites/education-et-jeunesse/2026/08/27/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoins controles par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : les reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "FOLLOWUP-2026-10-06.md",
        "https://auroreboreale.ca/actualites/education-et-jeunesse/2026/08/27/un-jeune-franco-yukonnais-recoit-une-bourse-qui-paiera-toutes-ses-etudes-dingenierie/"
      ]
    },
    {
      "id": "followup-europresse-vt-p",
      "provider": "europresse",
      "name": "Le Gaboteur",
      "catalog_resource_id": "europresse-vt-p",
      "hosts": [
        "gaboteur.ca"
      ],
      "path": "^/musique/2026/08/26/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoins controles par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : les reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "FOLLOWUP-2026-10-06.md",
        "https://gaboteur.ca/musique/2026/08/26/festival-folk-que-le-spectacle-continue/"
      ]
    },
    {
      "id": "followup-europresse-emm-p",
      "provider": "europresse",
      "name": "Marketing",
      "catalog_resource_id": "europresse-emm-p",
      "hosts": [
        "www.e-marketing.fr"
      ],
      "path": "^/marques-1296/veille-et-tribune-2251/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoins controles par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : les reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "FOLLOWUP-2026-10-06.md",
        "https://www.e-marketing.fr/marques-1296/veille-et-tribune-2251/axa-adapte-son-offre-aux-familles-monoparentales-174027"
      ]
    },
    {
      "id": "followup-europresse-pv-p",
      "provider": "europresse",
      "name": "Protégez-Vous",
      "catalog_resource_id": "europresse-pv-p",
      "hosts": [
        "www.protegez-vous.ca"
      ],
      "path": "^/nouvelles/habitation/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoins controles par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : les reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "FOLLOWUP-2026-10-06.md",
        "https://www.protegez-vous.ca/nouvelles/habitation/residences-pour-aines-un-juge-tranche-sur-les-services-obligatoires"
      ]
    },
    {
      "id": "goal-europresse-uae-p",
      "provider": "europresse",
      "name": "100 Mile House Free Press",
      "catalog_resource_id": "europresse-uae-p",
      "hosts": [
        "100milefreepress.net"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://100milefreepress.net/2025/11/04/100-mile-business-leaders-and-mayor-urge-people-to-shop-local-this-holiday-season/"
      ]
    },
    {
      "id": "goal-europresse-ppp-p",
      "provider": "europresse",
      "name": "Campbell River Mirror",
      "catalog_resource_id": "europresse-ppp-p",
      "hosts": [
        "campbellrivermirror.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://campbellrivermirror.com/2026/08/29/icbc-data-shows-riskiest-part-of-students-day-is-their-journey-to-and-from-school/"
      ],
      "title_word_strategy": "balanced"
    },
    {
      "id": "goal-europresse-ppq-p",
      "provider": "europresse",
      "name": "Castlegar News",
      "catalog_resource_id": "europresse-ppq-p",
      "hosts": [
        "www.castlegarnews.com"
      ],
      "path": "^/community/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.castlegarnews.com/community/meet-the-miss-castlegar-2025-candidates-8025166"
      ]
    },
    {
      "id": "goal-europresse-ppx-p",
      "provider": "europresse",
      "name": "Comox Valley Record",
      "catalog_resource_id": "europresse-ppx-p",
      "hosts": [
        "www.comoxvalleyrecord.com"
      ],
      "path": "^/news/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.comoxvalleyrecord.com/news/comox-adopts-accessibility-assessment-and-action-plan-7815307",
        "https://www.comoxvalleyrecord.com/news/comox-valley-church-gets-solar-boost-through-generous-community-partnership-7930580"
      ]
    },
    {
      "id": "goal-europresse-pqa-p",
      "provider": "europresse",
      "name": "Creston Valley Advance",
      "catalog_resource_id": "europresse-pqa-p",
      "hosts": [
        "crestonvalleyadvance.ca"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://crestonvalleyadvance.ca/2026/09/03/creston-concert-society-season-passes-available/",
        "https://crestonvalleyadvance.ca/2026/08/31/town-of-creston-will-provide-dedicated-parking-spot-for-ride-share-program/"
      ]
    },
    {
      "id": "goal-europresse-pqh-p",
      "provider": "europresse",
      "name": "Grand Forks Gazette",
      "catalog_resource_id": "europresse-pqh-p",
      "hosts": [
        "www.grandforksgazette.ca"
      ],
      "path": "^/local-news/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.grandforksgazette.ca/local-news/easter-bunny-visits-grand-forks-aquatic-centre-7954508"
      ]
    },
    {
      "id": "goal-europresse-cnu-p",
      "provider": "europresse",
      "name": "Journal Le Guide",
      "catalog_resource_id": "europresse-cnu-p",
      "hosts": [
        "www.journalleguide.com"
      ],
      "path": "^/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.journalleguide.com/actualites/un-pere-court-tous-les-jours-pendant-un-an-pour-honorer-son-fils/"
      ],
      "title_word_strategy": "balanced"
    },
    {
      "id": "goal-europresse-ff-p",
      "provider": "europresse",
      "name": "Journal Le Nord (St-Jérôme)",
      "catalog_resource_id": "europresse-ff-p",
      "hosts": [
        "www.journallenord.com"
      ],
      "path": "^/actualite/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.journallenord.com/actualite/pour-nos-lecteurs-lactualite-au-bout-de-vos-doigts/"
      ]
    },
    {
      "id": "goal-europresse-ju-p",
      "provider": "europresse",
      "name": "L'Action",
      "catalog_resource_id": "europresse-ju-p",
      "hosts": [
        "www.laction.com"
      ],
      "path": "^/article/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.laction.com/article/actualites/les-pompiers-de-joliette-interviennent-sur-un-accrochage-pres-du-metro/"
      ]
    },
    {
      "id": "goal-europresse-vb-p",
      "provider": "europresse",
      "name": "L'Aquilon",
      "catalog_resource_id": "europresse-vb-p",
      "hosts": [
        "mediastenois.ca"
      ],
      "path": "^/education/2026/09/03/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://mediastenois.ca/education/2026/09/03/rentree-francophone-une-quarantaine-deleves-quittent-allain-st-cyr/"
      ],
      "title_word_strategy": "balanced"
    },
    {
      "id": "goal-europresse-qw-p",
      "provider": "europresse",
      "name": "L'Hebdo du Saint-Maurice",
      "catalog_resource_id": "europresse-qw-p",
      "hosts": [
        "www.lhebdodustmaurice.com"
      ],
      "path": "^/sports/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.lhebdodustmaurice.com/sports/revivez-la-coupe-memorial-2012-en-images/"
      ]
    },
    {
      "id": "goal-europresse-qz-p",
      "provider": "europresse",
      "name": "L'Hebdo Mékinac/Des Chenaux",
      "catalog_resource_id": "europresse-qz-p",
      "hosts": [
        "www.lhebdomekinacdeschenaux.ca"
      ],
      "path": "^/culture/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.lhebdomekinacdeschenaux.ca/culture/noktanbul-nous-invite-dans-lunivers-des-bestiaux-botaniques/"
      ],
      "title_word_strategy": "balanced"
    },
    {
      "id": "goal-europresse-qoe-p",
      "provider": "europresse",
      "name": "L'Œil Régional",
      "catalog_resource_id": "europresse-qoe-p",
      "hosts": [
        "oeilregional.com"
      ],
      "path": "^/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://oeilregional.com/objectif-de-100-000-logements-par-annee-pour-le-parti-liberal/"
      ]
    },
    {
      "id": "goal-europresse-jev-p",
      "provider": "europresse",
      "name": "L'Éveil",
      "catalog_resource_id": "europresse-jev-p",
      "hosts": [
        "leveil.com"
      ],
      "path": "^/culture/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://leveil.com/culture/salon-des-aines-louise-portal-portee-par-celles-qui-lont-precedee"
      ]
    },
    {
      "id": "goal-europresse-hrm-p",
      "provider": "europresse",
      "name": "La Relève",
      "catalog_resource_id": "europresse-hrm-p",
      "hosts": [
        "lareleve.qc.ca"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://lareleve.qc.ca/2026/09/05/pour-aller-a-la-rencontre-des-jeunes-des-travailleurs-de-milieu-a-boucherville/"
      ],
      "title_word_strategy": "balanced"
    },
    {
      "id": "goal-europresse-fz-p",
      "provider": "europresse",
      "name": "La Voix Acadienne",
      "catalog_resource_id": "europresse-fz-p",
      "hosts": [
        "lavoixacadienne.com"
      ],
      "path": "^/actualites/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://lavoixacadienne.com/actualites/6661-dan-kutcher-se-lance-dans-la-course-a-la-chefferie-liberale-2"
      ]
    },
    {
      "id": "goal-europresse-hbg-p",
      "provider": "europresse",
      "name": "Le Clairon",
      "catalog_resource_id": "europresse-hbg-p",
      "hosts": [
        "leclairon.qc.ca"
      ],
      "path": "^/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://leclairon.qc.ca/la-petite-academie-une-rentree-historique-dans-de-nouveaux-locaux-fraichement-amenages/",
        "https://leclairon.qc.ca/le-rideau-tombe-deja-sur-la-saison-estivale-de-la-ciec/"
      ],
      "title_word_strategy": "balanced"
    },
    {
      "id": "goal-europresse-fy-p",
      "provider": "europresse",
      "name": "Le Courrier de la Nouvelle-Écosse",
      "catalog_resource_id": "europresse-fy-p",
      "hosts": [
        "lecourrier.com"
      ],
      "path": "^/actualites-provinciales/2026/08/14/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://lecourrier.com/actualites-provinciales/2026/08/14/zachary-richard-en-tournee-en-nouvelle-ecosse-cet-automne/"
      ]
    },
    {
      "id": "goal-europresse-hcb-p",
      "provider": "europresse",
      "name": "Le Courrier de Saint-Hyacinthe",
      "catalog_resource_id": "europresse-hcb-p",
      "hosts": [
        "lecourrier.qc.ca"
      ],
      "path": "^/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://lecourrier.qc.ca/une-rentree-sous-le-signe-des-chantiers-a-saint-hyacinthe/"
      ],
      "title_word_strategy": "balanced"
    },
    {
      "id": "goal-europresse-qjb-p",
      "provider": "europresse",
      "name": "Le Journal de Chambly",
      "catalog_resource_id": "europresse-qjb-p",
      "hosts": [
        "www.journaldechambly.com"
      ],
      "path": "^/actualite/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.journaldechambly.com/actualite/provinciales-2026-les-infos-pratiques/"
      ]
    },
    {
      "id": "goal-europresse-sa-p",
      "provider": "europresse",
      "name": "Le Journal de Saône-et-Loire",
      "catalog_resource_id": "europresse-sa-p",
      "hosts": [
        "www.lejsl.com"
      ],
      "path": "^/culture-loisirs/2026/08/31/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.lejsl.com/culture-loisirs/2026/08/31/le-groupe-bluestorm-a-reveille-la-nuit-mesvrienne"
      ]
    },
    {
      "id": "goal-europresse-oy-p",
      "provider": "europresse",
      "name": "Le Lac-St-Jean",
      "catalog_resource_id": "europresse-oy-p",
      "hosts": [
        "www.lelacstjean.com"
      ],
      "path": "^/actualites/673947/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.lelacstjean.com/actualites/673947/le-developpement-des-municipalites-freine"
      ]
    },
    {
      "id": "goal-europresse-vi-p",
      "provider": "europresse",
      "name": "Le Moniteur Acadien",
      "catalog_resource_id": "europresse-vi-p",
      "hosts": [
        "moniteuracadien.com"
      ],
      "path": "^/vie-etudiante/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://moniteuracadien.com/vie-etudiante/7909-plus-de-18-000-eleves-s-appretent-a-reprendre-le-chemin-des-ecoles-du-dsfs"
      ]
    },
    {
      "id": "goal-europresse-gz-p",
      "provider": "europresse",
      "name": "Le Nouvelles Hebdo",
      "catalog_resource_id": "europresse-gz-p",
      "hosts": [
        "www.nouvelleshebdo.com"
      ],
      "path": "^/economie/673951/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.nouvelleshebdo.com/economie/673951/les-elus-du-haut-du-lac-visitent-le-projet-minier-crevier-de-niobay"
      ]
    },
    {
      "id": "goal-europresse-qrd-p",
      "provider": "europresse",
      "name": "Le Reflet",
      "catalog_resource_id": "europresse-qrd-p",
      "hosts": [
        "lereflet.qc.ca"
      ],
      "path": "^/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://lereflet.qc.ca/tarifs-de-garderie-les-proprietaires-veulent-arreter-la-chute-libre/"
      ],
      "title_word_strategy": "balanced"
    },
    {
      "id": "goal-europresse-sml-p",
      "provider": "europresse",
      "name": "Lire - Magazine littéraire",
      "catalog_resource_id": "europresse-sml-p",
      "hosts": [
        "www.ouest-france.fr"
      ],
      "path": "^/culture/livres/lire-magazine/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Extrait de Lire Magazine diffuse par Ouest-France ; verifiez la version ouverte.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Rubrique partenaire Lire Magazine seulement : version Ouest-France, pas une garantie du magazine papier complet.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.ouest-france.fr/culture/livres/lire-magazine/chez-jean-philippe-toussaint-dans-lintimite-dun-ecrivain-qui-traque-la-solitude-et-le-suspense-943a121e-b751-11f1-ad16-43b274a58389",
        "LIRE-PARTNER-2026-10-06.md",
        "2026-10-06 : URL seule recontrolee : jean/philippe/solitude/suspense ouvre l'extrait attendu de Lire Magazine dans Ouest-France web. Lire est un mensuel autonome ; son site officiel renvoie ses articles vers Ouest-France, pas une preuve de supplement. Pas de validation de la source papier SML."
      ],
      "title_word_strategy": "balanced",
      "path_prefix": "/culture/livres/lire-magazine/"
    },
    {
      "id": "goal-europresse-pqz-p",
      "provider": "europresse",
      "name": "Nanaimo News Bulletin",
      "catalog_resource_id": "europresse-pqz-p",
      "hosts": [
        "nanaimobulletin.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://nanaimobulletin.com/2026/09/07/union-members-cogs-that-make-the-vancouver-island-university-machine-work/",
        "https://nanaimobulletin.com/2026/08/23/business-notes-ginas-mexican-cafe-has-a-new-menu/"
      ],
      "title_word_strategy": "balanced"
    },
    {
      "id": "goal-europresse-pra-p",
      "provider": "europresse",
      "name": "Nelson Star",
      "catalog_resource_id": "europresse-pra-p",
      "hosts": [
        "nelsonstar.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://nelsonstar.com/2026/08/28/business-buzz-tariff-talk-granite-lauded-railtown-flats-takes-off-wraps/",
        "https://nelsonstar.com/2026/08/27/50-50-raffle-to-support-nelson-seniors-through-transportation-program/"
      ]
    },
    {
      "id": "goal-europresse-jno-p",
      "provider": "europresse",
      "name": "Nord Info",
      "catalog_resource_id": "europresse-jno-p",
      "hosts": [
        "nordinfo.com"
      ],
      "path": "^/actualites/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://nordinfo.com/actualites/marie-chantale-desjardins-ou-le-denouement-dun-drame-31-ans-apres",
        "https://nordinfo.com/actualites/stablex-plus-de-40-ans-de-controverse-dans-les-pages-de-nord-info"
      ]
    },
    {
      "id": "goal-europresse-prc-p",
      "provider": "europresse",
      "name": "North Island Gazette",
      "catalog_resource_id": "europresse-prc-p",
      "hosts": [
        "northislandgazette.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://northislandgazette.com/2026/08/27/hardy-bay-seniors-enjoy-sun-and-sport-on-the-course/"
      ]
    },
    {
      "id": "goal-europresse-prp-p",
      "provider": "europresse",
      "name": "Peace Arch News",
      "catalog_resource_id": "europresse-prp-p",
      "hosts": [
        "peacearchnews.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://peacearchnews.com/2026/08/30/50-years-growing-up-with-peace-arch-news/"
      ]
    },
    {
      "id": "goal-europresse-prs-p",
      "provider": "europresse",
      "name": "Ponoka News",
      "catalog_resource_id": "europresse-prs-p",
      "hosts": [
        "ponokanews.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://ponokanews.com/2026/09/06/ponoka-community-growing-project-harvest-set-for-sept-18/"
      ]
    },
    {
      "id": "goal-europresse-psc-p",
      "provider": "europresse",
      "name": "Quesnel Cariboo Observer",
      "catalog_resource_id": "europresse-psc-p",
      "hosts": [
        "quesnelobserver.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://quesnelobserver.com/2026/09/04/city-of-quesnel-makes-final-push-for-alternative-winter-shelter-site/"
      ]
    },
    {
      "id": "goal-europresse-kz-p",
      "provider": "europresse",
      "name": "Rayon Boissons",
      "catalog_resource_id": "europresse-kz-p",
      "hosts": [
        "www.rayon-boissons.com"
      ],
      "path": "^/les-foires-aux-vins/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.rayon-boissons.com/les-foires-aux-vins/decouvrez-le-calendrier-des-foires-aux-vins-d-automne-2026"
      ],
      "title_word_strategy": "balanced"
    },
    {
      "id": "goal-europresse-chr-p",
      "provider": "europresse",
      "name": "Restauration Collective",
      "catalog_resource_id": "europresse-chr-p",
      "hosts": [
        "www.restauration-collective.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.restauration-collective.com/2026/08/27/sante-mentale-des-jeunes-lalimentation-un-levier-encore-trop-meconnu/"
      ],
      "title_word_strategy": "balanced"
    },
    {
      "id": "goal-europresse-psd-p",
      "provider": "europresse",
      "name": "Revelstoke Review",
      "catalog_resource_id": "europresse-psd-p",
      "hosts": [
        "revelstokereview.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://revelstokereview.com/2026/09/04/nelson-rockers-to-reincarnate-grateful-dead-while-keeping-it-original-for-revelstoke-shows/"
      ]
    },
    {
      "id": "goal-europresse-psv-p",
      "provider": "europresse",
      "name": "Sylvan Lake News",
      "catalog_resource_id": "europresse-psv-p",
      "hosts": [
        "sylvanlakenews.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://sylvanlakenews.com/2026/09/01/town-of-sylvan-lake-working-with-red-deer-county-for-regional-recreation-facility-study/"
      ]
    },
    {
      "id": "goal-europresse-ppi-p",
      "provider": "europresse",
      "name": "The Ashcroft Cache Creek Journal",
      "catalog_resource_id": "europresse-ppi-p",
      "hosts": [
        "ashcroftcachecreekjournal.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://ashcroftcachecreekjournal.com/2025/12/15/local-businesses-can-help-with-last-minute-gift-ideas/"
      ]
    },
    {
      "id": "goal-europresse-pqy-p",
      "provider": "europresse",
      "name": "The Morning Star",
      "catalog_resource_id": "europresse-pqy-p",
      "hosts": [
        "vernonmorningstar.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://vernonmorningstar.com/2026/08/27/support-available-for-north-okanagan-businesses-as-wildfire-and-drought-take-a-toll/"
      ],
      "title_word_strategy": "balanced"
    },
    {
      "id": "goal-europresse-psx-p",
      "provider": "europresse",
      "name": "Trail Times",
      "catalog_resource_id": "europresse-psx-p",
      "hosts": [
        "trailtimes.ca"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://trailtimes.ca/2026/08/06/trail-rossland-and-beaver-valley-featured-on-culture-tour-this-weekend/"
      ]
    },
    {
      "id": "goal-europresse-gia-p",
      "provider": "europresse",
      "name": "L'Argus de l'Assurance",
      "catalog_resource_id": "europresse-gia-p",
      "hosts": [
        "www.argusdelassurance.com"
      ],
      "path": "^/mutuelles/maif/[a-z0-9-]+\\.[A-Z0-9]{26}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.argusdelassurance.com/mutuelles/maif/budget-2027-pascal-demurger-maif-favorable-a-une-modulation-de-limpot-sur-les-societes-en-fonction-de-lengagement-ecologique-et-social-des-entreprises.XWKHERBSFNDRRHDMLPVTI7O7HY.html"
      ]
    },
    {
      "id": "goal-europresse-ppv-p",
      "provider": "europresse",
      "name": "The Cloverdale Reporter",
      "catalog_resource_id": "europresse-ppv-p",
      "hosts": [
        "cloverdalereporter.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://cloverdalereporter.com/2026/08/13/feds-invest-6-4-million-in-campbell-heights-businesses/"
      ]
    },
    {
      "id": "goal-europresse-pqs-p",
      "provider": "europresse",
      "name": "The Lake Cowichan Gazette",
      "catalog_resource_id": "europresse-pqs-p",
      "hosts": [
        "lakecowichangazette.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://lakecowichangazette.com/2026/09/07/culture-days-returns-to-cowichan-with-art-music-and-more/"
      ]
    },
    {
      "id": "goal-europresse-pqg-p",
      "provider": "europresse",
      "name": "Goldstream News Gazette",
      "catalog_resource_id": "europresse-pqg-p",
      "hosts": [
        "goldstreamgazette.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://goldstreamgazette.com/2026/09/07/west-shore-rcmp-investigate-series-of-vehicle-thefts-in-view-royal/"
      ]
    },
    {
      "id": "goal-europresse-pss-p",
      "provider": "europresse",
      "name": "Summerland Review",
      "catalog_resource_id": "europresse-pss-p",
      "hosts": [
        "summerlandreview.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://summerlandreview.com/2026/08/17/summerland-winery-owner-urges-residents-to-support-penticton-businesses/"
      ]
    },
    {
      "id": "goal-europresse-tbe-p",
      "provider": "europresse",
      "name": "Benefits Canada",
      "catalog_resource_id": "europresse-tbe-p",
      "hosts": [
        "www.benefitscanada.com"
      ],
      "path": "^/benefits/health-wellness/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.benefitscanada.com/benefits/health-wellness/percentage-of-plan-sponsors-offering-hcsas-continues-to-decline-bchs/"
      ]
    },
    {
      "id": "goal-europresse-moa-p",
      "provider": "europresse",
      "name": "AMC - Le Moniteur Architecture",
      "catalog_resource_id": "europresse-moa-p",
      "hosts": [
        "www.amc-archi.com"
      ],
      "path": "^/projets/urbanisme/[a-z0-9-]+\\.[A-Z0-9]{26}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.amc-archi.com/projets/urbanisme/a-rennes-le-transitoire-comme-levier-urbain-territoires.AAHE7MGBPZOYXB34A5RYTP5WCA.html"
      ]
    },
    {
      "id": "goal-europresse-alq-p",
      "provider": "europresse",
      "name": "Architectures à Vivre",
      "catalog_resource_id": "europresse-alq-p",
      "hosts": [
        "www.avivremagazine.fr"
      ],
      "path": "^/articles/projets/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Architectures a Vivre, site web ; verifiez la version ouverte.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Domaine actuel confirme par le site officiel A Vivre. Rubrique articles/projets seulement ; edition papier ALQ et magazine exe non qualifies.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.avivremagazine.fr/articles/projets/appartement-vavin-respirer-habiter-raconter"
      ],
      "path_prefix": "/articles/projets/"
    },
    {
      "id": "goal-europresse-tac-p",
      "provider": "europresse",
      "name": "Avantages (Québec)",
      "catalog_resource_id": "europresse-tac-p",
      "hosts": [
        "www.avantages.ca"
      ],
      "path": "^/sante/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Avantages Quebec, site web canadien ; verifiez la version ouverte.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Identite canadienne confirmee par Groupe Contex et site avantages.ca. Rubrique sante seulement ; magazine-avantages.fr est une autre publication. Edition papier TAC non qualifiee.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.avantages.ca/sante/les-maladies-chroniques-gonflent-les-couts/"
      ],
      "title_word_strategy": "balanced",
      "path_prefix": "/sante/"
    },
    {
      "id": "goal-europresse-hm-p",
      "provider": "europresse",
      "name": "Capital Finance",
      "catalog_resource_id": "europresse-hm-p",
      "hosts": [
        "capitalfinance.lesechos.fr"
      ],
      "path": "^/analyses/dossiers/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Capital Finance, site web ; verifiez la version ouverte.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Domaine officiel capitalfinance.lesechos.fr ; dossiers seulement. Temoin web du2 octobre avec reprise papier du5 octobre observee, sans garantie que Link ouvre la version papier.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://capitalfinance.lesechos.fr/analyses/dossiers/restructuring-le-retour-des-lbo-2254780"
      ],
      "title_word_strategy": "balanced",
      "path_prefix": "/analyses/dossiers/"
    },
    {
      "id": "goal-europresse-alo-p",
      "provider": "europresse",
      "name": "Cultures Marines",
      "catalog_resource_id": "europresse-alo-p",
      "hosts": [
        "www.culturesmarines.fr"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Cultures Marines, site web ; le document peut etre un extrait.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Temoin AAQN du1 octobre de110 mots seulement. Edition papier ALO non qualifiee ; ne pas promettre l'article integral du site reserve aux abonnes.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.culturesmarines.fr/2026/10/01/france-naissain-devient-ocealma-et-accelere-sa-diversification/"
      ]
    },
    {
      "id": "goal-europresse-dec-p",
      "provider": "europresse",
      "name": "Décideurs Magazine",
      "catalog_resource_id": "europresse-dec-p",
      "hosts": [
        "www.decideurs-magazine.com"
      ],
      "path": "^/finance/[a-z0-9-]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Decideurs Magazine, site web ; verifiez la version ouverte.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Temoin DEB web de120 mots. Deux versions web du meme titre observees ; Link ouvre la seconde. Edition papier DEC non qualifiee.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.decideurs-magazine.com/finance/65286-romain-souchois-rejoint-pergam.html"
      ]
    },
    {
      "id": "goal-europresse-bsa-p",
      "provider": "europresse",
      "name": "De Standaard",
      "catalog_resource_id": "europresse-bsa-p",
      "hosts": [
        "www.standaard.be"
      ],
      "path": "^/binnenland/wie-beslist-over-euthanasie-bij-dementie-de-persoon-die-je-was-of-de-persoon-die-je-bent-geworden/[a-z0-9-]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.standaard.be/binnenland/wie-beslist-over-euthanasie-bij-dementie-de-persoon-die-je-was-of-de-persoon-die-je-bent-geworden/162427613.html"
      ]
    },
    {
      "id": "goal-europresse-fie-p",
      "provider": "europresse",
      "name": "Entrepreneurs des Territoires Magazine",
      "catalog_resource_id": "europresse-fie-p",
      "hosts": [
        "www.edt-magazine.fr"
      ],
      "path": "^/dossier/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Entrepreneurs des Territoires, edition papier ; verifiez la version ouverte.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Identite actuelle confirmee sur edt-magazine.fr,publication Fitamant. Dossiers seulement ; le temoin web du7 septembre correspond au papier du17 aout,S. Fontaine,607 mots. Autres rubriques non qualifiees.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.edt-magazine.fr/dossier/adapter-les-travaux-agricoles-aux-risques-dincendie/",
        "2026-10-06 : selection concise generique des trois premiers mots derives de l'URL ; le temoin agricole retrouve le papier du 17 aout. Faux voisins possibles, pas une validation de toute la plateforme."
      ],
      "path_prefix": "/dossier/",
      "title_word_strategy": "concise"
    },
    {
      "id": "goal-europresse-bfe-p",
      "provider": "europresse",
      "name": "Femmes d'Aujourd'hui",
      "catalog_resource_id": "europresse-bfe-p",
      "hosts": [
        "www.femmesdaujourdhui.be"
      ],
      "path": "^/loisirs/sorties/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Femmes d'Aujourd'hui, site web ; verifiez la version ouverte.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Edition papier BFE non qualifiee. Temoin BFEW web du30 avril,1097 mots ; date publique7 juillet. Ancienne version2023 aussi presente. Rubrique loisirs/sorties seulement ; temoin recent musees vide.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.femmesdaujourdhui.be/loisirs/sorties/balades-chiens-admis-wallonie/"
      ]
    },
    {
      "id": "goal-europresse-ef-p",
      "provider": "europresse",
      "name": "Finance et Investissement",
      "catalog_resource_id": "europresse-ef-p",
      "hosts": [
        "www.finance-investissement.com"
      ],
      "path": "^/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Finance et Investissement, site web ; verifiez la version ouverte.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Edition papier EF non qualifiee. Temoin EFW571 mots,1octobre2026 ; contenu fourni par iA Gestion privee de patrimoine selon le site. Format actualites direct seulement ; sous-rubrique avis-de-nomination non qualifiee,defaut locri dans prefill.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.finance-investissement.com/actualites/richardson-gestion-de-patrimoine-devient-nobelia/"
      ]
    },
    {
      "id": "goal-europresse-asr-p",
      "provider": "europresse",
      "name": "Formes de Luxe",
      "catalog_resource_id": "europresse-asr-p",
      "hosts": [
        "www.formesdeluxe.com"
      ],
      "path": "^/article/[a-z0-9-]+\\.[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Formes de Luxe, site web ; verifiez la version ouverte.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Edition papier ASR non qualifiee. Temoin ABAY web878 mots,2octobre2026,Stephanie Gendron. Format /article/slug.identifiant numerique seulement. Page d'accueil protegee ; lien canonique observe dans Europresse rendu normalement sans contournement.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.formesdeluxe.com/article/sandrine-sommer-moet-hennessy-glass-is-a-priority-in-our-decarbonization-strategy.65532"
      ]
    },
    {
      "id": "goal-europresse-eqb-p",
      "provider": "europresse",
      "name": "France Football",
      "catalog_resource_id": "europresse-eqb-p",
      "hosts": [
        "www.francefootball.fr"
      ],
      "path": "^/news/[A-Za-z0-9-]+/[0-9]{6,}$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "France Football, edition papier ; verifiez la version ouverte.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Temoin editorial EQB296 mots,page3,12juin2021 ; version publique15juin. Pas de date imposee. Titres courts admis uniquement pour le format /news/slug/identifiant numerique. Autre temoin retourne seulement30mots : integralite non garantie. Domaine lequipe.fr et contenus video non qualifies.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.francefootball.fr/news/Toute-une-histoire-a-dorer/1262676"
      ]
    },
    {
      "id": "goal-europresse-bga-p",
      "provider": "europresse",
      "name": "Gaël",
      "catalog_resource_id": "europresse-bga-p",
      "hosts": [
        "www.gael.be"
      ],
      "path": "^/bien-etre/sante/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Gael, site web ; verifiez la version ouverte.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Edition papier BGA non qualifiee. Temoin historique BGAW610 mots,19fevrier2019,Laura Swysen ; page publique actualisee en2023. Rubrique bien-etre/sante seulement. Temoin recent beaute2026 vide : couverture recente non garantie.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.gael.be/bien-etre/sante/whitening-bleaching-and-co-comment-avoir-des-dents-blanches/"
      ]
    },
    {
      "id": "goal-europresse-anr-p",
      "provider": "europresse",
      "name": "Grandes Cuisines",
      "catalog_resource_id": "europresse-anr-p",
      "hosts": [
        "www.grandes-cuisines.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.grandes-cuisines.com/2026/08/31/de-la-preparation-au-comptoir-la-cuisine-change-de-rythme/"
      ]
    },
    {
      "id": "goal-europresse-ame-p",
      "provider": "europresse",
      "name": "Industrie Hôtelière",
      "catalog_resource_id": "europresse-ame-p",
      "hosts": [
        "www.industrie-hoteliere.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.industrie-hoteliere.com/2026/09/23/the-50-best-hotels-2026-six-hotels-recompenses-en-france/"
      ]
    },
    {
      "id": "goal-europresse-gii-p",
      "provider": "europresse",
      "name": "Industrie et Technologies",
      "catalog_resource_id": "europresse-gii-p",
      "hosts": [
        "www.usinenouvelle.com"
      ],
      "path": "^/industrie-technologie/cahiers-techniques/[a-z0-9-]+\\.[A-Z0-9]{26}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Industrie et Technologies, edition papier ; verifiez la version ouverte.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Rubrique officielle IndustrieTechnologie sur UsineNouvelle,cahiers-techniques seulement. Temoin GII du18 fevrier2026,no1080,3080mots,p43-48 ; public du26 mars2026. Suffixe CMS opaque exclu des mots-cles. Aucun elargissement aux autres rubriques UsineNouvelle.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.usinenouvelle.com/industrie-technologie/cahiers-techniques/les-aimants-permanents-au-defi-du-recyclage.6VEINXBGEZBVJAA24YMMYGUC7U.html"
      ],
      "path_prefix": "/industrie-technologie/cahiers-techniques/"
    },
    {
      "id": "goal-europresse-giq-p",
      "provider": "europresse",
      "name": "InfoChimie",
      "catalog_resource_id": "europresse-giq-p",
      "hosts": [
        "www.usinenouvelle.com"
      ],
      "path": "^/mes-magazines/magazine-info-chimie/[a-z0-9-]+\\.[A-Z0-9]{26}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "InfoChimie, edition papier ; verifiez la version ouverte.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Rubrique magazine-info-chimie seulement sur la plateforme actuelle UsineNouvelle,confirmee par InfoproDigitalMedia. Temoin GIQ du19 novembre2025,no594,1973mots,SylvieLatieule,p6-9 ; public du5 janvier2026. Sans date imposee ; autres rubriques et ancien domaine non qualifies.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.usinenouvelle.com/mes-magazines/magazine-info-chimie/notre-complementarite-est-evidente-entalpic-propose-realcat-teste.TGVUREDHGRKJNOBFX6K52E7XLA.html"
      ],
      "path_prefix": "/mes-magazines/magazine-info-chimie/"
    },
    {
      "id": "goal-europresse-jab-p",
      "provider": "europresse",
      "name": "Infos Laurentides",
      "catalog_resource_id": "europresse-jab-p",
      "hosts": [
        "journalinfoslaurentides.com"
      ],
      "path": "^/actualites/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Infos Laurentides, edition papier ; verifiez la publication ouverte.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Domaine officiel actuel journalinfoslaurentides.com,distinct de l'Info du Nord. Temoin communautaire du7 septembre web,2 septembre papier,676mots,Anne-Merline Eugene,p13. Plusieurs reprises regionales ; Link ouvre JAB. Temoin caserne ouvre a tort QID : couverture inegale et controle du journal indispensable. Autres rubriques et ancien domaine non qualifies.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://journalinfoslaurentides.com/actualites/le-communautaire-a-boutte-decu-de-sa-rencontre-avec-christine-frechette"
      ],
      "path_prefix": "/actualites/"
    },
    {
      "id": "goal-europresse-gq-p",
      "provider": "europresse",
      "name": "Investissement Conseils",
      "catalog_resource_id": "europresse-gq-p",
      "hosts": [
        "www.investissementconseils.com"
      ],
      "path": "^/patrimoine/dossiers/[a-z0-9-]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Temoin papier GQ du1 juin2026,1908mots,Anne-Sophie Caussinus,p1/75-77 ; public septembre2026. Prefixe CMS exclu seulement dans patrimoine/dossiers ; autres rubriques non qualifiees.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.investissementconseils.com/patrimoine/dossiers/48306-la-donation-partage-pour-organiser-sans-subir.html"
      ],
      "path_prefix": "/patrimoine/dossiers/"
    },
    {
      "id": "goal-europresse-uat-p",
      "provider": "europresse",
      "name": "IT for Business",
      "catalog_resource_id": "europresse-uat-p",
      "hosts": [
        "www.itforbusiness.fr"
      ],
      "path": "^/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Temoin papier UAT du8 juillet2026,no2318,644mots,p36,Alain Clapaud ; web public24septembre2026,UAW558mots aussi retrouve. Link ouvre papier sans date imposee. Formats video,magazine et sous-rubriques non qualifies.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.itforbusiness.fr/montpellier-mediterranee-allonge-la-duree-de-vie-de-ses-pc-107486"
      ]
    },
    {
      "id": "goal-europresse-hpl-p",
      "provider": "europresse",
      "name": "Journal Accès",
      "catalog_resource_id": "europresse-hpl-p",
      "hosts": [
        "www.journalacces.ca"
      ],
      "path": "^/actualite/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Temoin historique HPL du10 decembre2025,844mots,p1/8,Luc Robert ; public9decembre. Source papier44001 distincte de CQH8921 web reference. Temoin recent Frechette30septembre2026 retourne seulement un lien externe non heberge par Cision ; integralite et couverture recente non garanties.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.journalacces.ca/actualite/tourisme-le-club-med-etend-sa-presence-a-tremblant/"
      ]
    },
    {
      "id": "goal-europresse-jru-p",
      "provider": "europresse",
      "name": "Journal de rue de l'Estrie",
      "catalog_resource_id": "europresse-jru-p",
      "hosts": [
        "www.jdrestrie.ca"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z][a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Temoin JRU1juillet2026,vol24no5,544mots,p2,Nancy Mongeau ; public9juillet2026. Contraction daide separee uniquement sur articles dates jdrestrie.ca. Source papier59437 distincte du web60848. Formats numeriques sans titre et partenariat LaTribune non qualifies.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.jdrestrie.ca/2026/07/09/demandes-daide-et-collaboration-en-hausse/"
      ]
    },
    {
      "id": "goal-europresse-js-p",
      "provider": "europresse",
      "name": "L'Action d'Autray",
      "catalog_resource_id": "europresse-js-p",
      "hosts": [
        "www.lactiondautray.com"
      ],
      "path": "^/article/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Temoin papier JS du5 octobre2022,403mots,p1/4,Melissa Blouin ; public4octobre,actualise29avril2025. Format /article/slug seulement. Reprises JU/WJU possibles ; temoin recent /article/sports/ ouvre un extrait web WJS38mots plutot que sa version479mots. Rubriques imbriquees et integralite recente non qualifiees.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.lactiondautray.com/article/caroline-proulx-est-reelue-dans-berthier/"
      ]
    },
    {
      "id": "goal-europresse-gg-p",
      "provider": "europresse",
      "name": "L'AGEFI - Actifs",
      "catalog_resource_id": "europresse-gg-p",
      "hosts": [
        "www.agefi.fr"
      ],
      "path": "^/patrimoine/les-metiers/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Temoin papier GG du18 septembre2026,1870mots,p20-23,Carole Leclercq. Variante GG17septembre1873mots et GGW web existent aussi. Contraction larc separee uniquement dans patrimoine/les-metiers. Autres rubriques et editions AGEFI non qualifiees par ce temoin; profil Quotidien /news/ preserve.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.agefi.fr/patrimoine/les-metiers/epargne-salariale-la-nouvelle-corde-a-larc-des-cgp"
      ],
      "path_prefix": "/patrimoine/les-metiers/"
    },
    {
      "id": "goal-europresse-aad-p",
      "provider": "europresse",
      "name": "L'AGEFI - Finance d'Entreprise",
      "catalog_resource_id": "europresse-aad-p",
      "hosts": [
        "www.agefi.fr"
      ],
      "path": "^/cash-risk/actualites/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "AGEFI Finance d'entreprise, site web ; verifiez la version ouverte.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Deux temoins web AAAJ controles : BDO1octobre2026,311mots et affacturage21novembre2025,764mots,Marie-Amelie Fenoll. Papier AAD766mots retrouve sur affacturage mais Link ouvre web ; edition papier non qualifiee. Sources papier62130/web61612 distinctes. Contraction laffacturage separee seulement cash-risk/actualites. Autres rubriques et editions AGEFI non qualifiees.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.agefi.fr/cash-risk/actualites/bdo-france-renforce-son-offre-de-conseil-pour-les-directions-financieres",
        "https://www.agefi.fr/cash-risk/actualites/le-recours-a-laffacturage-augmente-au-sein-du-sbf-120"
      ],
      "path_prefix": "/cash-risk/actualites/"
    },
    {
      "id": "goal-europresse-aac-p",
      "provider": "europresse",
      "name": "L'AGEFI - Private Equity",
      "catalog_resource_id": "europresse-aac-p",
      "hosts": [
        "www.agefi.fr"
      ],
      "path": "^/private-equity/analyses/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par titre ; verifiez la publication et la version ouvertes.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Temoin AAC papier du8 septembre2026,958mots,Tiana Rambatomanga; public8septembre actualise18septembre. Reprise AAAIweb906mots distincte. Sources papier61613/web61611. Analyses seulement; temoin recent Astorg5octobre dans actualites vide,autres rubriques et editions AGEFI non qualifiees.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.agefi.fr/private-equity/analyses/fonds-evergreen-structurer-la-liquidite-sans-diluer-la-performance"
      ],
      "path_prefix": "/private-equity/analyses/"
    },
    {
      "id": "goal-europresse-iz-p",
      "provider": "europresse",
      "name": "L'Avenir de l'Érable",
      "catalog_resource_id": "europresse-iz-p",
      "hosts": [
        "www.lanouvelle.net"
      ],
      "path": "^/culture/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "L'Avenir de l'Erable, edition papier ; verifiez le journal ouvert.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Site commun La Nouvelle Union et L'Avenir de l'Erable confirme par Icimedias. Culture seulement; temoin UnionMusicale public10decembre2025,papierIZ17decembre761mots,p6,MarionCarey. Sourcepapier1403. Aucune qualification des autres rubriques ou de LaNouvelleUnion par ce controle; pas de date imposee.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.lanouvelle.net/culture/lunion-musicale-profitera-dun-nouveau-local/"
      ],
      "path_prefix": "/culture/"
    },
    {
      "id": "goal-europresse-qx-p",
      "provider": "europresse",
      "name": "L'Hebdo Journal",
      "catalog_resource_id": "europresse-qx-p",
      "hosts": [
        "www.lhebdojournal.com"
      ],
      "path": "^/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "L'Hebdo Journal, edition papier ; verifiez le journal ouvert.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Domaine officiel actuel lhebdojournal.com. Actualites seulement; temoin public3decembre2025, papierQX10decembre750mots,p4,Marie-Eve B. Alarie. RepriseWQX4decembre779mots distincte. Sources papier1434/web18909. Article recent PartiConservateur6octobre2026 vide; couverture recente non garantie. Autres rubriques et ancien domaine non qualifies.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.lhebdojournal.com/actualites/ide-trois-rivieres-trace-le-bilan-des-annees-de-tilly/"
      ],
      "path_prefix": "/actualites/"
    },
    {
      "id": "goal-europresse-shj-p",
      "provider": "europresse",
      "name": "L'Histoire - Les Collections",
      "catalog_resource_id": "europresse-shj-p",
      "hosts": [
        "www.lhistoire.fr"
      ],
      "path": "^/%C2%AB-longtemps-nous-avons-tendu-la-main-%C3%A0-la-russie%C2%A0%C2%BB$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "L'Histoire - Collections ; verifiez le numero ouvert.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Temoin Collections112,juillet-septembre2026,SHJ1juillet2427mots,p121. Fiche publique Pierre Levy2323mots,compte distinct conserve. Source27163 distincte du mensuel3729. Seule URL attestee qualifiee : le site partage ne permet pas de deduire une edition depuis un slug generique. Profil mensuel preserve; autres articles des Collections restent a qualifier.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.lhistoire.fr/%C2%AB-longtemps-nous-avons-tendu-la-main-%C3%A0-la-russie%C2%A0%C2%BB"
      ],
      "path_prefix": "/"
    },
    {
      "id": "goal-europresse-aoq-p",
      "provider": "europresse",
      "name": "L'Éclair Pyrénées",
      "catalog_resource_id": "europresse-aoq-p",
      "hosts": [
        "www.larepubliquedespyrenees.fr"
      ],
      "path": "^/pyrenees-atlantiques/pau/une-excellente-initiative-le-noel-solidaire-de-l-uppa-a-rassemble-les-generations-27071231\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "L'Eclair Pyrenees, edition papier ; verifiez la publication ouverte.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Temoin Noel solidaire UPPA,AOQ15decembre2025,866mots,p5,LucasBaillon ; public12decembre. Source70457. AMC et RDP egalement retrouves,Link ouvre AOQ. Seule URL attestee qualifiee : site partage sans marqueur d'edition ; autre temoin recent ouvre RDP. Profil La Republique des Pyrenees preserve ; autres articles de L'Eclair restent a qualifier.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.larepubliquedespyrenees.fr/pyrenees-atlantiques/pau/une-excellente-initiative-le-noel-solidaire-de-l-uppa-a-rassemble-les-generations-27071231.php"
      ],
      "path_prefix": "/"
    },
    {
      "id": "goal-europresse-bct-p",
      "provider": "europresse",
      "name": "La Capitale",
      "catalog_resource_id": "europresse-bct-p",
      "hosts": [
        "www.sudinfo.be"
      ],
      "path": "^/id1200651/article/2026-09-30/le-geant-de-lia-vocale-elevenlabs-sinstalle-bruxelles$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "La Capitale, edition papier ; verifiez la publication ouverte.",
      "date_message": "",
      "limitations": "Temoin controle par recherche native puis Link le 6 octobre 2026. Toutes dates et tous journaux : reprises et faux voisins restent possibles. Papier/web peuvent differer par titre ou date. Acces integral non garanti. Ancien site lacapitale.be redirige vers Sudinfo. Source papier25802 distincte du web25804. Temoin ElevenLabs public30septembre2026,papier1octobre202words,p7,Bruxelles. Seule URL attestee qualifiee : portail partage sans marqueur d'edition ; autres articles de La Capitale restent a qualifier.",
      "evidence": [
        "goal-events-2026-10-06.jsonl",
        "https://www.sudinfo.be/id1200651/article/2026-09-30/le-geant-de-lia-vocale-elevenlabs-sinstalle-bruxelles"
      ],
      "path_prefix": "/"
    },
    {
      "id": "peche-poissons-carnassiers",
      "provider": "europresse",
      "name": "La Peche et les Poissons",
      "catalog_resource_id": "europresse-aag-p",
      "hosts": [
        "peche-poissons.com",
        "www.peche-poissons.com"
      ],
      "path": "^/carnassiers/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "title_word_strategy": "concise",
      "message": "Recherche par mots du titre ; verifiez le magazine et la version ouverts.",
      "date_message": "",
      "limitations": "Selection courte de trois mots. Temoin papier correspondant retrouve ; les autres liens et magazines du site partage restent non qualifies. Toutes dates et toutes sources : des voisins restent possibles.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://peche-poissons.com/carnassiers/sandres-records-de-france-histoire/"
      ]
    },
    {
      "id": "reponsesphoto-fr",
      "provider": "europresse",
      "name": "Reponses Photo",
      "catalog_resource_id": "europresse-mre-p",
      "hosts": [
        "reponsesphoto.fr",
        "www.reponsesphoto.fr"
      ],
      "path_prefix": "/a-la-une/",
      "path": "^/a-la-une/[a-z0-9-]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le magazine et la version ouverts.",
      "date_message": "",
      "limitations": "Deux portfolios web de 2023 retrouves. Pas une validation de tous les liens, des concours, agendas ou numeros du magazine. Toutes dates et toutes sources : une reprise ou un article voisin reste possible.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.reponsesphoto.fr/a-la-une/romann-ramshorn-le-pays-du-grain-51242.html",
        "https://www.reponsesphoto.fr/actualites/aurelien-voldoire-instant-famille-50094.html"
      ]
    },
    {
      "id": "reponsesphoto-actualites",
      "provider": "europresse",
      "name": "Reponses Photo",
      "catalog_resource_id": "europresse-mre-p",
      "hosts": [
        "reponsesphoto.fr",
        "www.reponsesphoto.fr"
      ],
      "path_prefix": "/actualites/",
      "path": "^/actualites/[a-z0-9-]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le magazine et la version ouverts.",
      "date_message": "",
      "limitations": "Deux portfolios web de 2023 retrouves. Pas une validation de tous les liens, des concours, agendas ou numeros du magazine. Toutes dates et toutes sources : une reprise ou un article voisin reste possible.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.reponsesphoto.fr/a-la-une/romann-ramshorn-le-pays-du-grain-51242.html",
        "https://www.reponsesphoto.fr/actualites/aurelien-voldoire-instant-famille-50094.html"
      ]
    },
    {
      "id": "lechef-fr",
      "provider": "europresse",
      "name": "Le Chef",
      "catalog_resource_id": "europresse-che-p",
      "hosts": [
        "lechef.com",
        "www.lechef.com"
      ],
      "path": "^/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "excluded_paths": [
        "/le-podcast/",
        "/newsletters/"
      ],
      "message": "Recherche par mots du titre ; verifiez le magazine et l'article ouverts.",
      "date_message": "",
      "limitations": "Deux portraits papier retrouves depuis leur URL publique. Toutes dates et toutes sources : un article voisin reste possible. Les dates du site et du magazine peuvent differer. Podcasts, numeros et rubriques hors perimetre ; autres articles non valides.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lechef.com/jules-rolland-nuance-plomeur-29-entretenir-sa-singularite/",
        "https://www.lechef.com/bruno-doucet-le-grand-vefour-paris-75/"
      ]
    },
    {
      "id": "lavoixdusud-actualites",
      "provider": "europresse",
      "name": "La Voix du Sud",
      "catalog_resource_id": "europresse-qf-p",
      "hosts": [
        "lavoixdusud.com",
        "www.lavoixdusud.com"
      ],
      "path_prefix": "/actualites/",
      "path": "^/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et l'article ouverts.",
      "date_message": "",
      "limitations": "Deux articles locaux retrouves dans la version web du journal quebecois. Rubrique actualites uniquement ; pas les depeches nationales, concours ou archives PDF. Toutes dates et toutes sources : voisins possibles. voixdusud.com sans la est une association francaise sans lien avec le journal.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lavoixdusud.com/nous-joindre/",
        "https://www.lavoixdusud.com/actualites/rotobec-souligne-40-ans-de-presence-aux-etats-unis/",
        "https://www.lavoixdusud.com/actualites/plus-de-150-inscriptions-a-la-clinique-innovante-de-saint-damien/"
      ]
    },
    {
      "id": "chasseurfrancais-a-la-une",
      "provider": "europresse",
      "name": "Le Chasseur Français",
      "catalog_resource_id": "europresse-mch-p",
      "hosts": [
        "lechasseurfrancais.com",
        "www.lechasseurfrancais.com"
      ],
      "path_prefix": "/a-la-une/",
      "path": "^/a-la-une/[a-z0-9-]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et l'article ouverts.",
      "date_message": "",
      "limitations": "Deux temoins web concordants ; voisins et doublons possibles. Un article Biodiversite Isere du 4 octobre reste absent avec les mots URL. Recette limitee aux slugs directs a-la-une/chasse, pas les dossiers a sous-rubriques ni les hors-series papier.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lechasseurfrancais.com/a-la-une/sanglier-record-de-206-kg-dans-la-marne-190841.html",
        "https://www.lechasseurfrancais.com/chasse/biscotte-rejoint-les-stars-du-programme-du-suivi-de-sanglier-en-aveyron-186300.html"
      ]
    },
    {
      "id": "chasseurfrancais-chasse",
      "provider": "europresse",
      "name": "Le Chasseur Français",
      "catalog_resource_id": "europresse-mch-p",
      "hosts": [
        "lechasseurfrancais.com",
        "www.lechasseurfrancais.com"
      ],
      "path_prefix": "/chasse/",
      "path": "^/chasse/[a-z0-9-]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et l'article ouverts.",
      "date_message": "",
      "limitations": "Deux temoins web concordants ; voisins et doublons possibles. Un article Biodiversite Isere du 4 octobre reste absent avec les mots URL. Recette limitee aux slugs directs a-la-une/chasse, pas les dossiers a sous-rubriques ni les hors-series papier.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lechasseurfrancais.com/a-la-une/sanglier-record-de-206-kg-dans-la-marne-190841.html",
        "https://www.lechasseurfrancais.com/chasse/biscotte-rejoint-les-stars-du-programme-du-suivi-de-sanglier-en-aveyron-186300.html"
      ]
    },
    {
      "id": "hebdorivenord-actualites",
      "provider": "europresse",
      "name": "Hebdo Rive Nord",
      "catalog_resource_id": "europresse-jg-p",
      "hosts": [
        "hebdorivenord.com",
        "www.hebdorivenord.com"
      ],
      "path_prefix": "/article/actualites/",
      "path": "^/article/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "title_word_strategy": "long-words",
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots longs du titre ; verifiez le journal et l'article ouverts.",
      "date_message": "",
      "limitations": "Deux articles locaux correspondants dans la version web. Differences de titre/date entre site et archive ; voisins possibles. Actualites uniquement : pas les horoscopes et contenus syndiques Style de vie. Strategie generique long-words deja existante, pas une correction de mots propre au journal.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.hebdorivenord.com/article/actualites/debut-dun-chantier-de-112-m-sur-le-pont-reliant-repentigny-et-lile-bourdon/",
        "https://www.hebdorivenord.com/article/actualites/le-royal-de-repentigny-triomphe-des-diamants-de-quebec/"
      ]
    },
    {
      "id": "echomaskinonge-actualites",
      "provider": "europresse",
      "name": "L'Écho de Maskinongé",
      "catalog_resource_id": "europresse-jt-p",
      "hosts": [
        "lechodemaskinonge.com",
        "www.lechodemaskinonge.com"
      ],
      "path_prefix": "/actualites/",
      "path": "^/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et l'article ouverts.",
      "date_message": "",
      "limitations": "Deux articles locaux retrouves dans la version web. Recette limitee a actualites ; contenus nationaux, syndiques, culture et sports non qualifies. Toutes dates et toutes sources : versions papier ou articles voisins possibles.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lechodemaskinonge.com/actualites/que-reste-t-il-de-la-tradition-au-festival-de-la-galette/",
        "https://www.lechodemaskinonge.com/actualites/isabelle-blais-dresse-le-bilan-dune-campagne-menee-sur-le-terrain/"
      ]
    },
    {
      "id": "echolatuque-actualites",
      "provider": "europresse",
      "name": "L'Écho La Tuque - Haut St-Maurice",
      "catalog_resource_id": "europresse-qa-p",
      "hosts": [
        "lechodelatuque.com",
        "www.lechodelatuque.com"
      ],
      "path_prefix": "/actualites/",
      "path": "^/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et l'article ouverts.",
      "date_message": "",
      "limitations": "Deux temoins retrouves dans la version web de La Tuque. Un article aussi publie par Hebdo du Saint-Maurice ; des voisins anciens existent. Rubrique actualites uniquement, pas les depeches nationales ni infolettres ou sports non qualifies. Une breve de 73 mots est bien complete, pas un long reportage.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lechodelatuque.com/actualites/la-bostonnais-les-postes-de-conseillers-combles/",
        "https://www.lechodelatuque.com/actualites/guy-veillette-veut-des-megawatts-avec-ou-sans-les-eoliennes-du-projet-mauricie/"
      ]
    },
    {
      "id": "kitchissippi-root",
      "provider": "europresse",
      "name": "Kitchissippi Times",
      "catalog_resource_id": "europresse-kd-p",
      "hosts": [
        "kitchissippi.com",
        "www.kitchissippi.com"
      ],
      "path_prefix": "/",
      "path": "^/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et l'article ouverts.",
      "date_message": "",
      "limitations": "Deux portraits electoraux retrouves dans Municipal Election 2026. Dates publiques et archives differentes. D'autres temoins anciens ne sont pas retrouves ; cela ne garantit pas la disponibilite de tous les articles du site. Annuaires et pages de service exclus.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://kitchissippi.com/spencer-radford-seeks-bay-ward-council-seat/",
        "https://kitchissippi.com/why-theresa-kavanagh-wants-another-term-representing-bay-ward/"
      ],
      "excluded_paths": [
        "/category/",
        "/business/",
        "/about/",
        "/events/",
        "/support/",
        "/email/",
        "/advertise/",
        "/terms/",
        "/privacy/",
        "/cookies/",
        "/feed/"
      ]
    },
    {
      "id": "paysgessien-lemessager-fr",
      "provider": "europresse",
      "name": "Le Pays Gessien",
      "catalog_resource_id": "europresse-vnp-p",
      "hosts": [
        "lepaysgessien.lemessager.fr",
        "lepaysgessien.fr",
        "www.lepaysgessien.fr"
      ],
      "path": "^/[0-9]+/article/([0-9]{4}-[0-9]{2}-[0-9]{2})/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title"
      ],
      "date": {
        "type": "captures",
        "groups": [
          1
        ]
      },
      "message": "Reference calculee depuis la date et le lien, sous le domaine canonique du Messager. Version web partagee ; verifiez la publication.",
      "date_message": "",
      "limitations": "Deux articles locaux exacts retrouves sous Le Messager site web, Pays de Gex. Pas de preuve d'edition papier Pays Gessien distincte ni de tous les articles. Verifiez le titre et la version ouverts. Empreinte canonique verifiee sur deux temoins de ce sous-site. Ne garantit pas les anciennes URL ou une edition papier distincte.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://lepaysgessien.lemessager.fr/649358306/article/2026-09-30/un-mort-et-4-blesses-graves-sur-la-route-leaz-ce-30-septembre-2026",
        "https://lepaysgessien.lemessager.fr/649358539/article/2026-10-05/tunnel-du-vuache-fermeture-nocturne-en-octobre-pour-des-travaux-de-maintenance",
        "MESSAGER-DOMAINES-CANONIQUES-2026-10-08.md"
      ],
      "reference": {
        "type": "url-sha1",
        "source_code": "AJK",
        "prefix": "hw27",
        "canonical_host": "www.lemessager.fr"
      }
    },
    {
      "id": "flair-fr-beaute",
      "provider": "europresse",
      "name": "Flair",
      "catalog_resource_id": "europresse-bff-p",
      "hosts": [
        "flair.be",
        "www.flair.be"
      ],
      "path_prefix": "/fr/self-love/beaute/",
      "path": "^/fr/self-love/beaute/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre dans la version web francaise ; verifiez l'article et la date.",
      "date_message": "",
      "limitations": "Trois temoins de 2024 retrouves. Couverture actuelle non garantie : exemples recents food/mode absents. Apostrophes fusionnees peuvent bloquer certains liens, dont le calendrier Halloween ; strategie courte non retenue car elle ouvre des voisins. Aucun acces papier ou neerlandais qualifie.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.flair.be/fr/self-love/beaute/lush-lance-collection-dediee-beetlejuice/",
        "https://www.flair.be/fr/self-love/beaute/lush-lance-collection-flashy-dediee-film-wicked/",
        "https://www.flair.be/fr/self-love/beaute/5-raisons-troquer-gel-douche-savon-solide/"
      ]
    },
    {
      "id": "bilan-story-night",
      "provider": "europresse",
      "name": "Bilan",
      "catalog_resource_id": "europresse-wi-p",
      "hosts": [
        "bilan.ch",
        "www.bilan.ch"
      ],
      "path_prefix": "/story/",
      "path": "^/story/[a-z0-9-]+-[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "title_url_prefixes": [
        "pme-familiales"
      ],
      "message": "Recherche par mots du lien dans les archives web de Bilan ; verifiez le titre et la date.",
      "date_message": "",
      "limitations": "Deux temoins web concordants. Certains slugs SEO different fortement du titre et peuvent echouer. Galerie recente absente. Retrait du seul prefixe editorial pme-familiales observe ; aucun acces papier distinct qualifie.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.bilan.ch/story/rolex-la-padellone-defie-patek-philippe-sur-ses-terres-996930419996",
        "https://www.bilan.ch/story/pme-familiales-la-succession-sort-du-cercle-familial-699281454426"
      ]
    },
    {
      "id": "reveil-actualites-night",
      "provider": "europresse",
      "name": "Le Reveil (Alma)",
      "catalog_resource_id": "europresse-alg-p",
      "hosts": [
        "lereveil.com",
        "www.lereveil.com"
      ],
      "path_prefix": "/actualites/",
      "path": "^/actualites/[0-9]+/[a-z0-9-]+/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Le meme article peut s'ouvrir dans un autre journal du reseau ; verifiez son contenu.",
      "date_message": "",
      "limitations": "Deux temoins web concordants. Le premier resultat est une reprise dans L'Etoile du Lac ou Le Lac-St-Jean ; Le Reveil apparait aussi dans la liste. Aucun filtre Alma ni acces papier distinct qualifie. Dates et credits web archives peuvent differer.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lereveil.com/actualites/673935/paul-saint-pierre-plamondon-de-passage-a-jonquiere",
        "https://www.lereveil.com/actualites/673917/les-paramedics-de-la-csn-veulent-reprendre-les-negociations-avec-quebec"
      ]
    },
    {
      "id": "boucherville-articles-night",
      "provider": "europresse",
      "name": "Le Journal de Boucherville",
      "catalog_resource_id": "europresse-asy-p",
      "hosts": [
        "journaldeboucherville.com",
        "www.journaldeboucherville.com"
      ],
      "path": "^/[a-z-]+/[a-z0-9-]+/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "title_word_strategy": "balanced",
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien, debut et fin du titre. Une reprise dans un autre journal peut s'ouvrir ; verifiez le contenu.",
      "date_message": "",
      "limitations": "Deux temoins concordants : chronique reprise dans Les Versants et article web CSSP de Boucherville. Pas de filtre de publication garanti. Les apostrophes fusionnees peuvent encore bloquer certains liens, notamment lavantage ; conserver recherche textuelle et secours manuel.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.journaldeboucherville.com/actualite/chronique-animaliere-adopter-en-famille-daccueil-une-rencontre-vraie-un-choix-eclaire/",
        "https://www.journaldeboucherville.com/actualite/explication-du-cssp-sur-la-hausse-des-prix-de-location/",
        "https://www.journaldeboucherville.com/non-classe/etude-sur-lavantage-du-transport-en-commun-sur-la-voiture-dans-le-grand-montreal/"
      ]
    },
    {
      "id": "valloire-flash-night",
      "provider": "europresse",
      "name": "La Lettre Valloire",
      "catalog_resource_id": "europresse-mcv-p",
      "hosts": [
        "lettrevalloire.com",
        "www.lettrevalloire.com"
      ],
      "path_prefix": "/flash-eco/",
      "path": "^/flash-eco/[0-9]{4}-[a-z0-9-]+/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "title_word_strategy": "editorial",
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien sans l'annee. Une version papier du meme sujet peut s'ouvrir ; verifiez son titre et sa date.",
      "date_message": "",
      "limitations": "Deux temoins papier qualifies. Bosch est une variante du texte web, pas une copie integrale garantie. Le lien Hitachi dardon et le recent Dubuis restent sans correspondance. Des noms avec apostrophes fusionnees peuvent bloquer la recherche ; conserver les secours.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lettrevalloire.com/flash-eco/2026-le-fonds-allemand-aequita-regarde-bosch-vendome/",
        "https://www.lettrevalloire.com/flash-eco/2026-lactalis-va-avaler-triballat/",
        "https://www.lettrevalloire.com/flash-eco/2026-un-data-center-en-projet-sur-lex-site-hitachi-dardon/"
      ]
    },
    {
      "id": "quebec-date-night",
      "provider": "europresse",
      "name": "Le Journal de Quebec",
      "catalog_resource_id": "europresse-or-p",
      "hosts": [
        "journaldequebec.com",
        "www.journaldequebec.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Un article partage peut s'ouvrir dans TVA Nouvelles ou un autre journal ; verifiez son contenu.",
      "date_message": "",
      "limitations": "Un temoin QMI concordant, copie TVA ouverte en premier et Journal de Quebec egalement present. Aucun filtre de publication ni acces papier distinct qualifie. Le temoin recent Immigration et TGV reste vide ; couverture non garantie.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.journaldequebec.com/2026/09/07/guerre-commerciale-les-contre-tarifs-entrent-en-vigueur-des-minuit",
        "https://www.journaldequebec.com/2026/10/06/immigration-et-tgv-deux-pommes-de-discorde-avec-pspp-admet-marchand"
      ]
    },
    {
      "id": "cowichan-date-night",
      "provider": "europresse",
      "name": "Cowichan Valley Citizen",
      "catalog_resource_id": "europresse-ppy-p",
      "hosts": [
        "cowichanvalleycitizen.com",
        "www.cowichanvalleycitizen.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Une variante papier ou une reprise dans Lake Cowichan Gazette peut s'ouvrir ; verifiez le contenu.",
      "date_message": "",
      "limitations": "Culture Days retrouve deux variantes papier ; Lake Cowichan Gazette s'ouvre en premier, avec un programme partiellement different du web. Aucun filtre Cowichan prouve. Garden club et Kraken ne sont pas retrouves. Pas de couverture generale validee.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://cowichanvalleycitizen.com/2026/09/07/culture-days-returns-to-cowichan-with-art-music-and-more/",
        "https://cowichanvalleycitizen.com/2026/09/07/ladysmith-garden-club-speaker-series-focuses-on-biodiversity-environment/",
        "https://cowichanvalleycitizen.com/2026/10/06/lake-cowichan-kraken-continue-upward-trend-while-isles-flatline/"
      ]
    },
    {
      "id": "kelowna-date-night",
      "provider": "europresse",
      "name": "Kelowna Capital News",
      "catalog_resource_id": "europresse-pqm-p",
      "hosts": [
        "kelownacapnews.com",
        "www.kelownacapnews.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Les temoins retrouves sont des reprises dans Lake Country Calendar ; verifiez l'article et sa publication.",
      "date_message": "",
      "limitations": "Deux corps concordants retrouves dans Lake Country Calendar papier, pas dans Kelowna Capital News PQM. Aucun filtre de publication ni acces PQM distinct prouve. Dates et credits web/papier peuvent differer. Le temoin incendie reste vide.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://kelownacapnews.com/2026/09/07/lake-country-gets-first-mayoral-candidate-in-priscila-brunetto/",
        "https://kelownacapnews.com/2026/08/28/businesses-golfers-gather-at-sunset-ranch-golf-club-to-raise-funds-for-kelowna-gospel-mission/",
        "https://kelownacapnews.com/2026/09/07/structure-fire-in-west-kelowna-causes-damage-to-mobile-homes/"
      ]
    },
    {
      "id": "quebecscience-espace-night",
      "provider": "europresse",
      "name": "Quebec Science",
      "catalog_resource_id": "europresse-qsc-p",
      "hosts": [
        "quebecscience.qc.ca",
        "www.quebecscience.qc.ca"
      ],
      "path_prefix": "/espace/",
      "path": "^/espace/[a-z0-9-]+/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Une version papier peut s'ouvrir ; verifiez le titre et le contenu.",
      "date_message": "",
      "limitations": "Rubrique espace seulement : Cassiopee retrouve en papier, Dragonfly reste vide. Aucun filtre de publication ou couverture generale prouve. La rubrique physique n'est pas qualifiee : le temoin CERN ouvre d'abord un article voisin d'un autre magazine.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.quebecscience.qc.ca/espace/mystere-cassiopee-resolu/",
        "https://www.quebecscience.qc.ca/espace/dragonfly-libellule-explorer-titan/"
      ]
    },
    {
      "id": "brandon-local-night",
      "provider": "europresse",
      "name": "The Brandon Sun",
      "catalog_resource_id": "europresse-wfb-p",
      "hosts": [
        "brandonsun.com",
        "www.brandonsun.com"
      ],
      "path_prefix": "/local/",
      "path": "^/local/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Une reprise Winnipeg Free Press ou une version papier peut s'ouvrir ; verifiez titre et publication.",
      "date_message": "",
      "limitations": "Articles locaux dates seulement : Prairie Rovers retrouve en papier et web, Carberry ouvre Winnipeg en premier. Corps publics non accessibles, correspondance limitee au titre et auteur. Aucun filtre de publication prouve ; rubrique business non qualifiee.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.brandonsun.com/local/2026/10/05/prairie-rovers-tours-will-showcase-brandon",
        "https://www.brandonsun.com/local/2026/09/07/manitoba-doctor-denies-working-to-revive-carberry-er-in-response-to-recruitment-lawsuit"
      ]
    },
    {
      "id": "peninsula-date-night",
      "provider": "europresse",
      "name": "Peninsula News Review",
      "catalog_resource_id": "europresse-prq-p",
      "hosts": [
        "peninsulanewsreview.com",
        "www.peninsulanewsreview.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Une reprise dans un autre journal peut s'ouvrir ; verifiez le titre, la publication et le contenu.",
      "date_message": "",
      "limitations": "Deux reprises papier concordantes dans Saanich News et Goldstream News Gazette. Aucun acces distinct a Peninsula PRQ ni filtre de publication prouve. Dates et details peuvent differer du web.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://peninsulanewsreview.com/2026/09/07/saanich-choir-creates-community-through-music-for-people-with-memory-loss/",
        "https://peninsulanewsreview.com/2026/09/07/west-shore-rcmp-investigate-series-of-vehicle-thefts-in-view-royal/"
      ]
    },
    {
      "id": "sooke-date-night",
      "provider": "europresse",
      "name": "Sooke News Mirror",
      "catalog_resource_id": "europresse-pso-p",
      "hosts": [
        "sookenewsmirror.com",
        "www.sookenewsmirror.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/?$",
      "title_url_prefixes": [
        "sooke-history"
      ],
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien, sans le prefixe editorial Sooke History. Une reprise papier dans un autre journal peut s'ouvrir ; verifiez la publication.",
      "date_message": "",
      "limitations": "Sally Bullen retrouve en Sooke papier apres suppression du prefixe. Choir retrouve dans Saanich News, autre publication. Aucun filtre de source ou couverture generale prouve ; dates papier differentes du web.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://sookenewsmirror.com/2026/08/26/sooke-history-sally-bullen-played-vital-role-in-community/",
        "https://sookenewsmirror.com/2026/09/07/saanich-choir-creates-community-through-music-for-people-with-memory-loss/"
      ]
    },
    {
      "id": "victoria-date-night",
      "provider": "europresse",
      "name": "Victoria News",
      "catalog_resource_id": "europresse-psz-p",
      "hosts": [
        "vicnews.com",
        "www.vicnews.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/?$",
      "title_word_strategy": "balanced",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du debut et de la fin du lien. Une reprise dans un autre journal peut s'ouvrir ; verifiez titre, publication et contenu.",
      "date_message": "",
      "limitations": "GreekFest et Bachman retrouves dans Saanich News papier ; aucun acces distinct a Victoria PSZ ni filtre de publication prouve. Selection equilibree pour limiter les ecarts de titre ; plusieurs copies et dates differentes restent possibles.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://vicnews.com/2026/08/30/greekfest-is-back-in-saanich-bringing-tradition-eats-music-and-culture/",
        "https://vicnews.com/2026/08/30/langford-couple-take-care-of-business-reunite-rock-icon-bachman-with-guitar/"
      ]
    },
    {
      "id": "tribune-assurance-essentiel-night",
      "provider": "europresse",
      "name": "La Tribune de l'Assurance",
      "catalog_resource_id": "europresse-tri-p",
      "hosts": [
        "tribune-assurance.optionfinance.fr"
      ],
      "path": "^/lessentiel/[a-z0-9-]+[.]html$",
      "title_word_strategy": "long-words",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots distinctifs du lien. Verifiez titre, date et publication ; certaines elisions ou articles recents peuvent ne rien retrouver.",
      "date_message": "",
      "limitations": "Rubrique lessentiel seulement. AI Sisters retrouve dans TRI papier et TRIW web ; Maif et Lesfurets restent des limites. Aucun filtre de publication prouve, pas de validation globale du titre.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://tribune-assurance.optionfinance.fr/lessentiel/ai-sisters-forme-les-courtiers-a-lia-generative.html",
        "https://tribune-assurance.optionfinance.fr/lessentiel/le-dialogue-social-augmente-chez-maif.html",
        "https://tribune-assurance.optionfinance.fr/lessentiel/quand-lesfurets-sintroduit-dans-lia.html"
      ]
    },
    {
      "id": "officiel-transporteurs-strategie-night",
      "provider": "europresse",
      "name": "L'Officiel des Transporteurs",
      "catalog_resource_id": "europresse-kof-p",
      "hosts": [
        "lofficieldestransporteurs.fr",
        "www.lofficieldestransporteurs.fr"
      ],
      "path": "^/strategie/[a-z0-9-]+-[0-9]+[.]php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. La version papier peut avoir une autre date ; certains articles recents ne sont pas encore retrouves. Verifiez titre et publication.",
      "date_message": "",
      "limitations": "Rubrique strategie seulement. Negociation Geodis-Deret retrouvee dans KOF papier ; extrait public concordant mais integral public non verifie. Finalisation Geodis et portrait Silou vides. Aucun filtre de publication prouve.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lofficieldestransporteurs.fr/strategie/geodis-negocie-la-reprise-du-groupe-deret-974628.php",
        "https://www.lofficieldestransporteurs.fr/strategie/geodis-finalise-la-reprise-du-groupe-deret-975171.php",
        "https://www.lofficieldestransporteurs.fr/strategie/christelle-bret-transports-silou-aujourdhui-je-vis-au-jour-le-jour-974824.php"
      ]
    },
    {
      "id": "produits-mer-actualite-night",
      "provider": "europresse",
      "name": "Produits de la Mer",
      "catalog_resource_id": "europresse-dtb-p",
      "hosts": [
        "pdm-seafoodmag.com",
        "www.pdm-seafoodmag.com"
      ],
      "path_prefix": "/lactualite/",
      "path": "^/lactualite/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. La version web peut etre ouverte plutot que le magazine papier ; verifiez titre et publication.",
      "date_message": "",
      "limitations": "Actualite et nouveautes-produits seulement : deux copies web AAQM retrouvees, Haaland integral concordant, Zalg tronque. Aucun acces DTB papier ni filtre de publication prouve ; autres rubriques non qualifiees.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.pdm-seafoodmag.com/lactualite/erling-haaland-ambassadeur-du-saumon-norvegien/",
        "https://www.pdm-seafoodmag.com/nouveautes-produits/zalg-des-oignons-frits-aux-algues/"
      ]
    },
    {
      "id": "produits-mer-nouveautes-night",
      "provider": "europresse",
      "name": "Produits de la Mer",
      "catalog_resource_id": "europresse-dtb-p",
      "hosts": [
        "pdm-seafoodmag.com",
        "www.pdm-seafoodmag.com"
      ],
      "path_prefix": "/nouveautes-produits/",
      "path": "^/nouveautes-produits/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. La version web peut etre ouverte plutot que le magazine papier ; verifiez titre et publication.",
      "date_message": "",
      "limitations": "Actualite et nouveautes-produits seulement : deux copies web AAQM retrouvees, Haaland integral concordant, Zalg tronque. Aucun acces DTB papier ni filtre de publication prouve ; autres rubriques non qualifiees.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.pdm-seafoodmag.com/lactualite/erling-haaland-ambassadeur-du-saumon-norvegien/",
        "https://www.pdm-seafoodmag.com/nouveautes-produits/zalg-des-oignons-frits-aux-algues/"
      ]
    },
    {
      "id": "business-immo-articles-night",
      "provider": "europresse",
      "name": "Business Immo Global",
      "catalog_resource_id": "europresse-bus-p",
      "hosts": [
        "businessimmo.com",
        "www.businessimmo.com"
      ],
      "path": "^/actualites/article/[0-9]+/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. La date du magazine peut differer de celle du site ; verifiez titre et publication.",
      "date_message": "",
      "limitations": "Deux portraits de septembre retrouves dans BUS papier, introductions concordantes avec extraits publics. Corps publics complets non accessibles. Aucun filtre de publication prouve ; autres formats de liens non qualifies.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.businessimmo.com/actualites/article/389019070/nhood-jeune-multiforme-et-ambitieuse",
        "https://www.businessimmo.com/actualites/article/432973372/emmanuel-desmaizieres-le-gout-du-concret"
      ]
    },
    {
      "id": "nouvelle-union-actualites-night",
      "provider": "europresse",
      "name": "La Nouvelle Union",
      "catalog_resource_id": "europresse-jq-p",
      "hosts": [
        "lanouvelle.net",
        "www.lanouvelle.net"
      ],
      "path_prefix": "/actualites/",
      "path": "^/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Verifiez le titre et la publication de l'article ouvert.",
      "date_message": "",
      "limitations": "Deux articles locaux retrouves dans La Nouvelle Union web, textes publics complets concordants. Site commun avec L'Avenir de l'Erable : verifiez la publication. Edition papier et autres rubriques non qualifiees. Aucun filtre de publication prouve.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lanouvelle.net/actualites/rocheleau-50-ans-et-toujours-debout/",
        "https://www.lanouvelle.net/actualites/le-groupe-meunerie-victo-investit-35-m-pour-soutenir-sa-croissance/"
      ]
    },
    {
      "id": "montlaurier-education-night",
      "provider": "europresse",
      "name": "L'info du Nord Mont-Laurier",
      "catalog_resource_id": "europresse-hui-p",
      "hosts": [
        "infodunordmontlaurier.ca",
        "www.infodunordmontlaurier.ca"
      ],
      "path_prefix": "/article/actualites/education/",
      "path": "^/article/actualites/education/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Une version papier adaptee peut s'ouvrir ; verifiez le titre et la publication.",
      "date_message": "",
      "limitations": "Deux articles education retrouves dans HUI papier ; textes adaptes ou raccourcis, dates et credits differents du site. Reprises web Vallee de la Rouge possibles. Autres rubriques non qualifiees ; aucun filtre source prouve.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://infodunordmontlaurier.ca/article/actualites/education/plus-de-500-jeunes-participent-au-cross-country-a-mont-laurier/",
        "https://infodunordmontlaurier.ca/article/actualites/education/une-rentree-presque-sans-postes-vacants-au-csshl/"
      ]
    },
    {
      "id": "avenirrivieres-actualites-night",
      "provider": "europresse",
      "name": "L'Avenir et Des Rivieres",
      "catalog_resource_id": "europresse-cnv-p",
      "hosts": [
        "laveniretdesrivieres.com",
        "www.laveniretdesrivieres.com"
      ],
      "path_prefix": "/actualites/",
      "path": "^/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. La version papier peut s'ouvrir avant la version web ; verifiez le titre et la publication.",
      "date_message": "",
      "limitations": "Deux temoins actualites retrouves dans CNV papier, corps concordants avec le site public. Dates, OCR et mise en page peuvent differer. Versions web aussi dans les listes natives. Autres rubriques non qualifiees ; aucun filtre source prouve.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.laveniretdesrivieres.com/actualites/une-offre-vintage-a-bedford/",
        "https://www.laveniretdesrivieres.com/actualites/parc-industriel-a-stanbridge-station-un-projet-qui-avance-de-plus-en-plus/"
      ]
    },
    {
      "id": "penseebagot-root-night",
      "provider": "europresse",
      "name": "La Pensee de Bagot",
      "catalog_resource_id": "europresse-hgz-p",
      "hosts": [
        "lapensee.qc.ca",
        "www.lapensee.qc.ca"
      ],
      "path": "^/[a-z0-9-]+/$",
      "excluded_paths": [
        "/necrologie/",
        "/nous-joindre/",
        "/politique-de-confidentialite/",
        "/cahiers/"
      ],
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Une copie web raccourcie peut s'ouvrir ; verifiez le titre et la publication.",
      "date_message": "",
      "limitations": "Deux articles HGZW web retrouves, mais premier paragraphe public absent et guillemets perdus. Versions papier aussi dans les listes natives, corps papier non controles. Aucun filtre source prouve ; autres articles non valides.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://lapensee.qc.ca/un-evenement-artistique-regroupant-plus-de-100-artistes/",
        "https://lapensee.qc.ca/des-moyens-de-pression-sont-encore-prevus/"
      ]
    },
    {
      "id": "saintfrancois-root-night",
      "provider": "europresse",
      "name": "Le Journal Saint-Francois",
      "catalog_resource_id": "europresse-qjj-p",
      "hosts": [
        "journalsaint-francois.ca",
        "www.journalsaint-francois.ca"
      ],
      "path": "^/[a-z0-9-]+/$",
      "excluded_paths": [
        "/actualites/",
        "/faits-divers/",
        "/sports/",
        "/art-de-vivre/",
        "/culture/",
        "/vaudreuil-soulanges/",
        "/journal/",
        "/distribution/",
        "/givre/",
        "/emplois/",
        "/avis-legaux/",
        "/mrc-beauharnois-salaberry/",
        "/concours-ma-vie-ma-region/",
        "/nous-joindre/",
        "/politique-de-confidentialite/",
        "/politique-relative-aux-cookies/",
        "/en-mode-rentree/",
        "/ma-vie-ma-region/",
        "/achetez-local-cest-plein-de-bon-sens-juin-2026/",
        "/fete-des-meres/",
        "/preparer-votre-vehicule-pour-lete/",
        "/tendance-printaniere-2026/",
        "/conditions-generales-de-vente-et-dutilisationtermes-et-conditions/"
      ],
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Verifiez le titre et la date : des titres generiques peuvent ouvrir un ancien article.",
      "date_message": "",
      "limitations": "Deux copies papier QJJ concordantes controlees. Le titre generique rage raton laveur operation vaccination retourne 78 hits avec un ancien autre article premier ; aucune garantie pour les titres generiques ni filtre source prouve.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://journalsaint-francois.ca/valspec-en-scene-depuis-50-ans/",
        "https://journalsaint-francois.ca/valleyfield-destination-toutouristique/"
      ]
    },
    {
      "id": "versants-economie-night",
      "provider": "europresse",
      "name": "Les Versants",
      "catalog_resource_id": "europresse-hrr-p",
      "hosts": [
        "versants.com",
        "www.versants.com"
      ],
      "path_prefix": "/economie/",
      "path": "^/economie/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Verifiez le titre et la publication de la copie ouverte.",
      "date_message": "",
      "limitations": "Deux copies HRRW web economiques concordantes controlees. Introduction dupliquee et guillemets perdus. Ni acces papier ni autres rubriques qualifies ; aucun filtre source prouve.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.versants.com/economie/saint-bruno-un-nouveau-siege-social-pour-jas-filtration/",
        "https://www.versants.com/economie/saint-basile-un-premier-domino-pour-le-noyau-villageois/"
      ]
    },
    {
      "id": "richelieu-actualites-night",
      "provider": "europresse",
      "name": "Le Richelieu",
      "catalog_resource_id": "europresse-cnr-p",
      "hosts": [
        "lerichelieu.ca",
        "www.lerichelieu.ca"
      ],
      "path_prefix": "/actualites/",
      "path": "^/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Une reprise peut provenir du Canada Francais ; verifiez le titre et la publication.",
      "date_message": "",
      "limitations": "Maison Hina : papier CNR concordant. Caserne : reprise CAC web concordante, introduction dupliquee. Dates web et papier differentes. Reportage photo rentree CEGEP sans resultat. Autres rubriques non qualifiees ; aucun filtre source prouve.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lerichelieu.ca/actualites/un-don-non-conventionnel-a-la-maison-hina/",
        "https://www.lerichelieu.ca/actualites/venez-decouvrir-la-nouvelle-caserne-de-saint-luc/"
      ]
    },
    {
      "id": "cranbrook-dated-night",
      "provider": "europresse",
      "name": "Cranbrook Townsman",
      "catalog_resource_id": "europresse-ppz-p",
      "hosts": [
        "cranbrooktownsman.com",
        "www.cranbrooktownsman.com"
      ],
      "path_prefix": "/",
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "title_word_strategy": "concise",
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche courte par mots du lien. La copie papier peut avoir un titre et une date differents ; verifiez le document ouvert.",
      "date_message": "",
      "limitations": "Deux temoins culturels PPZ papier : Blood Relations concordant, bluesman raccourci. Strategie courte evite ccts fusionne dans le slug. RDEK sans resultat avec les six mots initiaux. Autres temoins initiaux infructueux ; pas de filtre source prouve. Redirection Kootenay News Advertiser non qualifiee pour PPT.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://cranbrooktownsman.com/2026/09/25/blood-relations-opens-ccts-season/",
        "https://cranbrooktownsman.com/2026/09/23/world-renowned-bluesman-to-play-in-the-kootenays-march-2027/"
      ]
    },
    {
      "id": "mission-dated-night",
      "provider": "europresse",
      "name": "Mission City Record",
      "catalog_resource_id": "europresse-pqw-p",
      "hosts": [
        "missioncityrecord.com",
        "www.missioncityrecord.com"
      ],
      "path_prefix": "/",
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. La copie papier peut avoir une date differente ; verifiez le document ouvert.",
      "date_message": "",
      "limitations": "Un temoin concert caritatif ouvre le papier PQW concordant. Boswyck et celebrations citoyennes sans resultat ; Boswyck reste vide avec strategie courte. Qualification partielle, aucun filtre source prouve ni validation humaine.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://missioncityrecord.com/2026/09/28/concert-raises-funds-for-mission-food-bank/"
      ]
    },
    {
      "id": "norththompson-dated-night",
      "provider": "europresse",
      "name": "North Thompson Star/Journal",
      "catalog_resource_id": "europresse-prd-p",
      "hosts": [
        "barrierestarjournal.com",
        "www.barrierestarjournal.com"
      ],
      "path_prefix": "/",
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "title_url_prefixes": [
        "john-enman"
      ],
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; prefixe de signature connu retire. Verifiez la publication et la version papier ouvertes.",
      "date_message": "",
      "limitations": "Deux PRD papier concordants, avec OCR, pagination et dates differentes. Chronique photo contient un ajout editorial final et quatre resultats. Seul prefixe auteur john-enman qualifie ; pas de filtre source prouve ni validation globale.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://barrierestarjournal.com/2026/09/21/equestrian-55-bc-games-a-big-opportunity-for-barriere/",
        "https://barrierestarjournal.com/2026/09/22/john-enman-bring-your-camera-to-the-fair/"
      ]
    },
    {
      "id": "northdelta-dated-night",
      "provider": "europresse",
      "name": "North Delta Reporter",
      "catalog_resource_id": "europresse-prb-p",
      "hosts": [
        "northdeltareporter.com",
        "www.northdeltareporter.com"
      ],
      "path_prefix": "/",
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Le resultat peut etre une reprise dans un autre journal ; verifiez le document ouvert.",
      "date_message": "",
      "limitations": "Deux temoins concordants : LNG dans North Delta Reporter PRB, marche veterans dans Peace Arch News PRP. Dates et OCR differents. Qualification partielle, aucun filtre source prouve ni validation humaine.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://northdeltareporter.com/2026/09/21/delta-lng-expansion-project-issued-b-c-environmental-assessment-certificate/",
        "https://northdeltareporter.com/2026/09/22/veterans-walk-back-in-white-rock/"
      ]
    },
    {
      "id": "yukon-dated-night",
      "provider": "europresse",
      "name": "Yukon News",
      "catalog_resource_id": "europresse-pte-p",
      "hosts": [
        "yukon-news.com",
        "www.yukon-news.com"
      ],
      "path_prefix": "/",
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. La copie papier peut avoir une date differente ; verifiez le document ouvert.",
      "date_message": "",
      "limitations": "Deux temoins concordants : jardin scolaire premier papier PTE, nouveaux programmes premier web IYN. Deux copies listees pour chacun, seules premieres ouvertes. OCR/date/guillemets differents ; qualification partielle sans filtre source prouve ni validation humaine.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://yukon-news.com/2026/09/25/whitehorse-school-garden-program-gets-boost-from-national-foundations/",
        "https://yukon-news.com/2026/09/24/queer-yukon-society-launching-new-programing/"
      ]
    },
    {
      "id": "surrey-dated-night",
      "provider": "europresse",
      "name": "Surrey Now-Leader",
      "catalog_resource_id": "europresse-psu-p",
      "hosts": [
        "surreynowleader.com",
        "www.surreynowleader.com"
      ],
      "path_prefix": "/",
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Le resultat peut etre une reprise dans un autre journal ; verifiez le titre, la source et la date.",
      "date_message": "",
      "limitations": "Deux reprises concordantes seulement, livres dans Peace Arch News PRP et LNG dans North Delta Reporter PRB. Aucune copie propre Surrey PSU verifiee. Temoin prix economiques ouvre une edition precedente 2025, pas le public 2026. Qualification partielle, aucun filtre source prouve ni validation humaine.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://surreynowleader.com/2026/09/01/south-surrey-book-sale-a-success/",
        "https://surreynowleader.com/2026/09/21/delta-lng-expansion-project-issued-b-c-environmental-assessment-certificate/"
      ]
    },
    {
      "id": "terrace-dated-night",
      "provider": "europresse",
      "name": "Terrace Standard",
      "catalog_resource_id": "europresse-psw-p",
      "hosts": [
        "terracestandard.com",
        "www.terracestandard.com"
      ],
      "path_prefix": "/",
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Verifiez le titre et la date de l'article ouvert.",
      "date_message": "",
      "limitations": "Un seul temoin papier PSW qualifie, autrice Spirit Bear. Derniers paragraphes reformules et raccourcis. Temoin memoir Afghanistan vide, meme en concise. Qualification partielle, aucun filtre source prouve ni validation humaine.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://terracestandard.com/2026/09/17/terrace-author-pens-book-after-a-near-fatal-crash/"
      ]
    },
    {
      "id": "freepress-dated-night",
      "provider": "europresse",
      "name": "The Free Press (Fernie)",
      "catalog_resource_id": "europresse-pqe-p",
      "hosts": [
        "thefreepress.ca",
        "www.thefreepress.ca"
      ],
      "path_prefix": "/",
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Verifiez le titre et la date de l'article ouvert.",
      "date_message": "",
      "limitations": "Deux temoins papier PQE qualifies. Pride Festival est raccourci dans le papier; collecte Pets Society concordante hors OCR et legende. Dates papier differentes. Aucun filtre source prouve ni validation humaine. Domaine officiel thefreepress.ca, distinct du domaine baseline free-press.com non teste.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://thefreepress.ca/2026/09/21/pride-festival-celebrates-diversity-in-elk-valley/",
        "https://thefreepress.ca/2026/09/10/local-fundraiser-brings-in-over-8k-for-fernie-pets-society/"
      ]
    },
    {
      "id": "similkameen-dated-night",
      "provider": "europresse",
      "name": "The Similkameen Spotlight",
      "catalog_resource_id": "europresse-psm-p",
      "hosts": [
        "similkameenspotlight.com",
        "www.similkameenspotlight.com"
      ],
      "path_prefix": "/",
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Verifiez le titre et la date de l'article ouvert.",
      "date_message": "",
      "limitations": "Qualification partielle : un seul temoin piscine retrouve en papier The Review PQN, titre et quelques phrases retouches. Pas de copie propre PSM prouvee. Marche reconciliation et Simba vides; concise marche trop large. Aucun filtre source prouve ni validation humaine.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://similkameenspotlight.com/2026/09/04/scaled-back-similkameen-rec-centre-plans-to-focus-on-pool/"
      ]
    },
    {
      "id": "review-dated-night",
      "provider": "europresse",
      "name": "The Review (Keremeos)",
      "catalog_resource_id": "europresse-pqn-p",
      "hosts": [
        "keremeosreview.com",
        "www.keremeosreview.com"
      ],
      "path_prefix": "/",
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Verifiez le titre et la date de l'article ouvert.",
      "date_message": "",
      "limitations": "Qualification partielle : un seul temoin piscine retrouve en papier propre PQN, titre et quelques phrases retouches, date et OCR differents. Temoin mayors vide en default et balanced. Aucun filtre source prouve ni validation humaine.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://keremeosreview.com/2026/09/04/scaled-back-similkameen-rec-centre-plans-to-focus-on-pool/"
      ]
    },
    {
      "id": "tolerie-fr",
      "provider": "europresse",
      "name": "Tolerie",
      "catalog_resource_id": "europresse-als-p",
      "hosts": [
        "tolerie-mag.com",
        "www.tolerie-mag.com"
      ],
      "path": "^/actus/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "title_word_strategy": "concise",
      "message": "Recherche courte par mots du titre ; verifiez la publication et l'article ouverts.",
      "date_message": "",
      "limitations": "Un seul temoin web AAQQ qualifie, papier ALS non prouve. Toutes dates et toutes sources : un voisin reste possible. Les titres courts peuvent incorporer la rubrique actus. Autres articles et rubriques non valides.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.tolerie-mag.com/actus/une-alliance-strategique-pour-la-maintenance-de-lautomation-industrielle/"
      ]
    },
    {
      "id": "carrelage-fr",
      "provider": "europresse",
      "name": "Reference Carrelage",
      "catalog_resource_id": "europresse-fir-p",
      "hosts": [
        "referencecarrelage.com",
        "www.referencecarrelage.com"
      ],
      "path": "^/actualites/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez la publication et l'article ouverts.",
      "date_message": "",
      "limitations": "Deux temoins web FIRW qualifies; un papier FIR egalement lu, avec OCR degrade et date differente. Toutes dates et toutes sources : un voisin reste possible. Autres articles et rubriques non valides.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.referencecarrelage.com/actualites/vpi-et-cermix-unissent-leurs-forces/",
        "https://www.referencecarrelage.com/actualites/du-diamant-a-la-machine-une-reponse-globale/"
      ]
    },
    {
      "id": "relationclient-fr",
      "provider": "europresse",
      "name": "Relation Client",
      "catalog_resource_id": "europresse-erc-p",
      "hosts": [
        "relationclientmag.fr",
        "www.relationclientmag.fr"
      ],
      "path": "^/[a-z0-9-]+-[0-9]+/([a-z0-9-]+-[0-9]+/)?[a-z0-9-]+-[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez la publication et l'article ouverts.",
      "date_message": "",
      "limitations": "Deux temoins web ERCW qualifies. Papier ERC non prouve. Autres articles, anciens formats, videos et diaporamas non valides. Toutes dates et toutes sources : un voisin reste possible.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.relationclientmag.fr/strategies-1255/veille-tribune-2139/wurth-modyf-bondit-de-72-via-la-fidelisation-automatisee-36900",
        "https://www.relationclientmag.fr/talents-1253/nomination-2144/jean-baptiste-auzou-rejoint-odigo-comme-ceo-36886"
      ]
    },
    {
      "id": "oakbay-dated-night",
      "provider": "europresse",
      "name": "Oak Bay News",
      "catalog_resource_id": "europresse-prk-p",
      "hosts": [
        "oakbaynews.com",
        "www.oakbaynews.com"
      ],
      "path_prefix": "/",
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; une reprise peut figurer dans un autre titre. Verifiez le document ouvert.",
      "date_message": "",
      "limitations": "Cocktail retrouve dans Monday Magazine PQX, corps concordant mais date et titre/sous-titre differents. Bibliotheque sans resultat. Pas de copie propre PRK prouvee ni de validation humaine. Ancien format non qualifie.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://oakbaynews.com/2026/10/02/decadence-on-display-30s-themed-art-of-the-cocktail-dives-into-escapism/",
        "https://oakbaynews.com/2026/09/30/150000th-book-delivered-to-greater-victoria-little-free-library/"
      ]
    },
    {
      "id": "omineca-dated-night",
      "provider": "europresse",
      "name": "Omineca Express",
      "catalog_resource_id": "europresse-prl-p",
      "hosts": [
        "ominecaexpress.com",
        "www.ominecaexpress.com"
      ],
      "path_prefix": "/",
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; une reprise peut figurer dans un autre titre. Verifiez le document ouvert.",
      "date_message": "",
      "limitations": "Aides aux entreprises retrouve dans The Interior News PQL, corps concordant mais OCR/apostrophes et date differents. Northern Inflatables sans resultat. Pas de copie propre PRL prouvee ni de validation humaine. Ancien format non qualifie.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://ominecaexpress.com/2026/08/28/province-announces-2-7m-to-help-northern-businesses-adapt-and-grow/",
        "https://ominecaexpress.com/2026/08/25/vanderhoof-business-spotlight-northern-inflatables/"
      ]
    },
    {
      "id": "clearwater-dated-night",
      "provider": "europresse",
      "name": "The North Thompson Times",
      "catalog_resource_id": "europresse-prg-p",
      "hosts": [
        "clearwatertimes.com",
        "www.clearwatertimes.com"
      ],
      "path_prefix": "/",
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; une reprise peut figurer dans un autre titre. Verifiez le document ouvert.",
      "date_message": "",
      "limitations": "Equitation retrouve dans North Thompson Star/Journal PRD, corps concordant avec OCR/mise en page et date differents. Terry Fox sans resultat. Pas de copie propre PRG prouvee ni de validation humaine. Ancien format non qualifie.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://clearwatertimes.com/2026/09/21/equestrian-55-bc-games-a-big-opportunity-for-barriere/",
        "https://clearwatertimes.com/2026/09/22/thank-you-for-caring-clearwater-hits-the-streets-for-terry-fox-run/"
      ]
    },
    {
      "id": "weekend-culinaire-night",
      "provider": "europresse",
      "name": "Le Vif Weekend",
      "catalog_resource_id": "europresse-asm-p",
      "hosts": [
        "weekend.levif.be"
      ],
      "path_prefix": "/culinaire/",
      "path": "^/culinaire/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Verifiez le document ouvert.",
      "date_message": "",
      "limitations": "Temoin Michelin retrouve dans BVIW Weekend web. Titre/date concordants, corps natif complet lu, corps public payant non compare integralement. Guimauve et Chalet sans resultat. Pas de preuve ASM papier ni de validation humaine. Autres rubriques non qualifiees.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://weekend.levif.be/culinaire/voici-les-5-plats-qui-ont-le-plus-marque-les-inspecteurs-michelin-en-belgique/",
        "https://weekend.levif.be/culinaire/ode-a-la-guimauve-nouvelle-star-des-douceurs/",
        "https://weekend.levif.be/culinaire/tout-ce-quon-sait-du-nouveau-chalet-de-la-foret/"
      ]
    },
    {
      "id": "guerreshistoire-questions-night",
      "provider": "europresse",
      "name": "Science et Vie - Guerres et Histoires",
      "catalog_resource_id": "europresse-msm-p",
      "hosts": [
        "guerres-et-histoire.com",
        "www.guerres-et-histoire.com"
      ],
      "path_prefix": "/questions-reponses/",
      "path": "^/questions-reponses/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "title_word_strategy": "long-words",
      "message": "Recherche par mots longs du lien. Verifiez le document ouvert.",
      "date_message": "",
      "limitations": "Valmy retrouve dans MSMW web, corps complet concordant; dates et attribution differentes. Psychotropes sans resultat. Pas de preuve MSM papier ou hors-serie. Bibliotheque et presentations de numeros non qualifiees. Aucune validation humaine ajoutee.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://guerres-et-histoire.com/questions-reponses/pourquoi-larmee-prussienne-sest-elle-enfuie-face-a-larmee-francaise-a-valmy/",
        "https://guerres-et-histoire.com/questions-reponses/au-cours-du-20e-siecle-les-armees-ont-elles-fait-usage-de-stupefiants-de-drogues-ou-de-substances-psychotropes/"
      ]
    },
    {
      "id": "latribune-dimanche-night",
      "provider": "europresse",
      "name": "La Tribune dimanche",
      "catalog_resource_id": "europresse-bso-p",
      "hosts": [
        "www.latribune.fr",
        "latribune.fr"
      ],
      "path_prefix": "/article/la-tribune-dimanche/",
      "path": "^/article/la-tribune-dimanche/[a-z0-9/-]+/[0-9]+/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre issus du lien. Verifiez le document ouvert.",
      "date_message": "",
      "limitations": "Deux temoins propres AARM web retrouves. SCPI corps complet concordant avec attribution differente; Sacko public paywall. Pas de preuve BSO papier. Seulement les URL /article/la-tribune-dimanche/; ancien domaine redirige vers La Tribune. Aucune validation humaine ajoutee.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.latribune.fr/article/la-tribune-dimanche/culture-lifestyle/gastronomie-sorties/16255050772045/mory-sacko-chef-etoile-pour-moi-manger-c-est-la-joie",
        "https://www.latribune.fr/article/la-tribune-dimanche/dimanche-eco/1317683994997514/comment-generer-500-euros-de-revenus-par-mois-grace-aux-scpi"
      ]
    },
    {
      "id": "mmonde-night",
      "provider": "europresse",
      "name": "M Le Magazine du Monde",
      "catalog_resource_id": "europresse-lmm-p",
      "hosts": [
        "www.lemonde.fr",
        "lemonde.fr"
      ],
      "path_prefix": "/m-le-mag/",
      "path": "^/m-le-mag/article/(\\d{4})/(\\d{2})/(\\d{2})/[a-z0-9-]+_\\d{1,10}_\\d{1,10}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "captures",
        "groups": [
          1,
          2,
          3
        ]
      },
      "message": "Recherche par mots du titre issus du lien. Verifiez le document ouvert.",
      "date_message": "",
      "limitations": "Seulement les URL /m-le-mag/article/. Portrait de M retrouve dans Le Monde web LMF, republication 2026 d'un texte 2024. Public paywall; pas de comparaison integrale ni de preuve LMM papier. Les autres rubriques partagees du Monde restent dans leur profil existant. Aucune validation humaine ajoutee.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lemonde.fr/m-le-mag/article/2026/10/06/15-ans-de-portraits-de-m-paul-watson-l-activiste-des-oceans_6390851_4500056.html"
      ]
    },
    {
      "id": "stores-fermetures-night",
      "provider": "europresse",
      "name": "Stores et Fermetures",
      "catalog_resource_id": "europresse-alb-p",
      "hosts": [
        "www.lemoniteur.fr",
        "lemoniteur.fr"
      ],
      "path_prefix": "/stores-et-fermetures/",
      "path": "^/stores-et-fermetures/[a-z0-9/-]+\\.[A-Z0-9]{26}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "title_word_strategy": "balanced",
      "message": "Recherche par mots du titre issus du lien. Verifiez le document ouvert.",
      "date_message": "",
      "limitations": "Seulement la rubrique Stores et Fermetures du Moniteur. Deux copies concordantes dans Le Moniteur web MOV, sans preuve du fonds papier ALB. Selection equilibree du slug, sans utiliser l'identifiant technique ni Microlink. Aucune validation humaine ajoutee.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lemoniteur.fr/stores-et-fermetures/andera-partners-devient-actionnaire-majoritaire-du-groupe-sotralu.HO5NXUW4DFDPZL344533VQRIVE.html",
        "https://www.lemoniteur.fr/stores-et-fermetures/fabricants/franciaflex-lance-resource-une-gamme-de-fenetres-pvc-bas-carbone.HYIXXNP5IRFIDJL33VHRME3SDY.html"
      ]
    },
    {
      "id": "technicites-night",
      "provider": "europresse",
      "name": "Techni.Cites",
      "catalog_resource_id": "europresse-alc-p",
      "hosts": [
        "www.lagazettedescommunes.com",
        "lagazettedescommunes.com"
      ],
      "path_prefix": "/club-techni-cites/",
      "path": "^/club-techni-cites/[a-z0-9/-]+\\.[A-Z0-9]{26}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre issus du lien. Verifiez la publication et la version.",
      "date_message": "",
      "limitations": "Seulement les URL modernes du Club Techni.Cites. Budget climat retrouve dans Techni.Cites papier ALC avec date anterieure au web; Rudi retrouve dans Gazette web MOH. Corps concordants avec differences typographiques. Aucun filtre date/source impose. Les autres rubriques Gazette restent dans leur profil existant. Aucune validation humaine ajoutee.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lagazettedescommunes.com/club-techni-cites/territoires-numeriques/la-plate-forme-rennaise-de-partage-de-donnees-territoriale-rudi-se-replique-a-toulouse-et-bordeaux.IPGI35XHDBBQNPTMJ5ZBAWSM5A.html",
        "https://www.lagazettedescommunes.com/club-techni-cites/ingenierie/budget-climat-la-methode-pour-reduire-ses-emissions.H3SCMS2EYNIT3JR64A3SO2ZOTQ.html"
      ]
    },
    {
      "id": "moniteur-artisans-night",
      "provider": "europresse",
      "name": "Le Moniteur des Artisans",
      "catalog_resource_id": "europresse-moe-p",
      "hosts": [
        "www.lemoniteur.fr",
        "lemoniteur.fr"
      ],
      "path_prefix": "/artisans/",
      "path": "^/artisans/[a-z0-9/-]+\\.[A-Z0-9]{26}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre issus du lien. Verifiez le document ouvert.",
      "date_message": "",
      "limitations": "Seulement la rubrique Artisans du Moniteur. Deux copies concordantes dans Le Moniteur web MOV, sans preuve du fonds papier MOE. Aucun identifiant technique ni Microlink utilise. Aucune validation humaine ajoutee.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lemoniteur.fr/artisans/actis-devoile-son-nouvel-isolant-hybris-28-au-lambda-proche-de-celui-de-lair.7SGBBMULEJAT7IF3MRW2MJYH5Q.html",
        "https://www.lemoniteur.fr/artisans/beissier-innove-avec-prestonett-j-lent-un-enduit-de-bandes-a-joint-sans-prise.ZL56OGGOHZGFXBFUBJO45VRYCY.html"
      ]
    },
    {
      "id": "negoce-night",
      "provider": "europresse",
      "name": "Negoce",
      "catalog_resource_id": "europresse-mon-p",
      "hosts": [
        "www.lemoniteur.fr",
        "lemoniteur.fr"
      ],
      "path_prefix": "/negoce/",
      "path": "^/negoce/[a-z0-9/-]+\\.[A-Z0-9]{26}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre issus du lien. Verifiez le document ouvert.",
      "date_message": "",
      "limitations": "Rubrique Negoce seulement. Deux copies completes concordantes dans Le Moniteur web MOV; fonds papier MON non prouve. Limite connue : lalliance dans le slug conserve une apostrophe fusionnee et renvoie zero. Les ancres longues ne sont pas imposees car trop larges sur un autre temoin. Aucun Microlink ni verdict humain ajoute.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lemoniteur.fr/negoce/pompes-a-chaleur-la-qualification-du-professionnel-installateur-premier-critere-de-confiance-pour-les-particuliers.5ANYGI7RH5BGPMOFOTOISPZLHA.html",
        "https://www.lemoniteur.fr/negoce/decarbonation-rexel-france-deploie-une-campagne-avec-8-industriels-pour-promouvoir-lelectrification-des-usages.TBE7XYKZUREHTA6SWZUIBN4CZQ.html",
        "https://www.lemoniteur.fr/negoce/a-batimat-lalliance-des-eco-materiaux-presente-ses-propositions-pour-structurer-la-filiere-des-biosources-et-geosources.DCISGYNQZBBV5PVRPDRJD3HGC4.html"
      ]
    },
    {
      "id": "moniteur-magazine-night",
      "provider": "europresse",
      "name": "Le Moniteur des Travaux Publics et du Batiment",
      "catalog_resource_id": "europresse-mot-p",
      "hosts": [
        "www.lemoniteur.fr",
        "lemoniteur.fr"
      ],
      "path_prefix": "/mes-magazines/magazine-le-moniteur/",
      "path": "^/mes-magazines/magazine-le-moniteur/[a-z0-9-]+\\.[A-Z0-9]{26}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre issus du lien. Verifiez le document ouvert.",
      "date_message": "",
      "limitations": "Scope magazine-le-moniteur seulement, pas tous les domaines/rubriques partages. Deux temoins propres MOT : introduction de dossier et entretien Lafarge. Public Lafarge partiel. Entretien Routes de France sans resultat sur deux recherches. Pas de date/reference injectee, aucun Microlink ni verdict humain.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lemoniteur.fr/mes-magazines/magazine-le-moniteur/meme-les-piscines-font-leur-mue-energetique.2H45OQ6N5FLHXKUJ532I5D3OU4.html",
        "https://www.lemoniteur.fr/mes-magazines/magazine-le-moniteur/industrie-il-nous-faut-tracer-un-chemin-qui-garantisse-notre-perennite-nicolas-george-directeur-general-de-lafarge-france.XP5GP65TIRJ2HHUJLV3ENCBUHM.html",
        "https://www.lemoniteur.fr/mes-magazines/magazine-le-moniteur/decarbonation-adaptation-digitalisation-la-france-peut-etre-vue-comme-un-laboratoire-europeen-pour-les-travaux-routiers-routes-de-france.BBIXIQECPNLFVNPZ23SGQ4V464.html"
      ]
    },
    {
      "id": "campus-night",
      "provider": "europresse",
      "name": "Le Monde Campus",
      "catalog_resource_id": "europresse-lme-p",
      "hosts": [
        "www.lemonde.fr",
        "lemonde.fr"
      ],
      "path_prefix": "/campus/",
      "path": "^/campus/article/(\\d{4})/(\\d{2})/(\\d{2})/[a-z0-9-]+_\\d{1,10}_\\d{1,10}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "captures",
        "groups": [
          1,
          2,
          3
        ]
      },
      "message": "Recherche par mots du titre issus du lien. Verifiez le document ouvert.",
      "date_message": "",
      "limitations": "Rubrique /campus/article/ seulement. Deux temoins concordants dans LMF web, l'un aussi dans LMT. Pas de preuve LME papier ni de comparaison integrale avec le public paywall. Date disponible sans filtrage automatique. Autres rubriques du Monde inchangees. Aucun Microlink ni verdict humain.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lemonde.fr/campus/article/2026/10/03/failles-de-securite-accusations-de-racisme-et-omerta-a-frejus-l-ecole-nationale-des-scaphandriers-en-eaux-troubles_6787801_4401467.html",
        "https://www.lemonde.fr/campus/article/2026/10/01/on-comprenait-mieux-ce-qu-on-faisait-que-nos-superieurs-payes-quatre-fois-plus-alexis-32-ans-ex-employe-d-un-cinema_6786444_4401467.html"
      ]
    },
    {
      "id": "jurisprudence-night",
      "provider": "europresse",
      "name": "Jurisprudence Automobile",
      "catalog_resource_id": "europresse-akx-p",
      "hosts": [
        "www.argusdelassurance.com",
        "argusdelassurance.com"
      ],
      "path_prefix": "/reglementation/jurisprudence-automobile/",
      "path": "^/reglementation/jurisprudence-automobile/[a-z0-9-]+\\.[A-Z0-9]{26}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre issus du lien. Verifiez le document ouvert.",
      "date_message": "",
      "limitations": "Rubrique jurisprudence-automobile seulement, pas tout le site Argus. Deux copies concordantes dans GAAB web, pas de preuve AKX papier. Public partiel/paywall, pas de comparaison integrale. L'identifiant 26 caracteres concorde avec la reference GAAB, mais aucune date deduite du lien : reference directe non configuree. Aucun Microlink ni verdict humain.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.argusdelassurance.com/reglementation/jurisprudence-automobile/dommages-corporels-la-date-de-consolidation-fixee-par-la-cpam-ne-lie-pas-toujours-le-juge.F75OLVN7FNBS7E2QGB26B2L5NU.html",
        "https://www.argusdelassurance.com/reglementation/jurisprudence-automobile/accident-de-moto-la-rupture-conventionnelle-ne-suffit-pas-a-imputer-les-pertes-professionnelles-a-laccident.OBPZNW6TIBCIFNVM3AV3GAUTOU.html"
      ]
    },
    {
      "id": "exe-night",
      "provider": "europresse",
      "name": "Exe",
      "catalog_resource_id": "europresse-alr-p",
      "hosts": [
        "www.exemagazine.fr",
        "exemagazine.fr"
      ],
      "path_prefix": "/articles/actus/",
      "path": "^/articles/actus/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre issus du lien. Verifiez le document ouvert.",
      "date_message": "",
      "limitations": "Site officiel exemagazine.fr uniquement, pas executive-magazine.com. Deux temoins AABR web et une copie ALR papier concordants. Les copies web peuvent etre tronquees; plusieurs resultats possibles. Pas de date deduite ni reference devinee. Aucun Microlink ni verdict humain.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.avivremagazine.fr/mentions",
        "https://www.exemagazine.fr/articles/actus/salle-multisports-saint-sauveur",
        "https://www.exemagazine.fr/articles/actus/le-diagramme-en-architecture"
      ]
    },
    {
      "id": "particulier-conso-night",
      "provider": "europresse",
      "name": "Le Particulier Conso",
      "catalog_resource_id": "europresse-pry-p",
      "hosts": [
        "leparticulier.lefigaro.fr"
      ],
      "path_prefix": "/jcms/",
      "path": "^/jcms/c_115482/consommation/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre issus du lien. Verifiez le document ouvert.",
      "date_message": "",
      "limitations": "Rubrique consommation uniquement, pas le domaine entier. Deux copies PRU web completes concordantes, sans preuve PRY papier. Aucun filtre de date ni de source impose, aucun identifiant devine, aucun Microlink ni verdict humain.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://leparticulier.lefigaro.fr/jcms/c_115482/consommation/les-7-criteres-indispensables-pour-bien-choisir-son-airfryer-20261002",
        "https://leparticulier.lefigaro.fr/jcms/c_115482/consommation/les-essais-du-particulier-le-blender-chauffant-moulinex-perfectmix-cook-20260420"
      ]
    },
    {
      "id": "particulier-immo-night",
      "provider": "europresse",
      "name": "Le Particulier Immobilier",
      "catalog_resource_id": "europresse-prx-p",
      "hosts": [
        "leparticulier.lefigaro.fr"
      ],
      "path_prefix": "/",
      "path": "^/jcms/c_111571/immobilier/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre issus du lien. Verifiez le document ouvert.",
      "date_message": "",
      "limitations": "Rubrique generale immobilier uniquement; achat-vente, location, copropriete et autres sous-rubriques non qualifiees. Deux copies PRU web, sans preuve PRX papier. Pas de filtre date/source impose, pas d'identifiant devine, aucun Microlink ni verdict humain.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://leparticulier.lefigaro.fr/jcms/c_111571/immobilier/eau-de-pluie-les-veritables-sanctions-encourues-par-les-proprietaires-qui-ne-respectent-pas-les-regles-d-utilisation-20260925",
        "https://leparticulier.lefigaro.fr/jcms/c_111571/immobilier/acheter-un-chateau-un-manoir-ou-une-gentilhommiere-et-si-vous-vous-osiez-franchir-le-pas-nous-avons-repere-quelques-specimens-20260920"
      ]
    },
    {
      "id": "junior-night",
      "provider": "europresse",
      "name": "Science et Vie Junior",
      "catalog_resource_id": "europresse-msl-p",
      "hosts": [
        "science-et-vie-junior.fr",
        "www.science-et-vie-junior.fr"
      ],
      "path_prefix": "/article-magazine/svt/",
      "path": "^/article-magazine/svt/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "title_word_strategy": "concise",
      "message": "Recherche courte par mots du lien. Verifiez le titre et le magazine ouverts.",
      "date_message": "",
      "limitations": "Deux articles MSL papier retrouves depuis le domaine Junior officiel, rubrique svt uniquement. Strategie generique concise existante, trois mots; plusieurs voisins possibles. Debuts publics compares seulement, contenus sous paywall. Pas de date ni reference devinee, pas de Microlink ni verdict humain. Le domaine parent Science et Vie reste inchange.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.science-et-vie.com/",
        "https://science-et-vie-junior.fr/article-magazine/svt/9-aliments-imaginaires-epluches-par-la-science/",
        "https://science-et-vie-junior.fr/article-magazine/svt/animaux-en-pleine-crise-dados/"
      ]
    },
    {
      "id": "polymeres-materiaux-night",
      "provider": "europresse",
      "name": "Polymères & Matériaux",
      "catalog_resource_id": "europresse-ala-p",
      "hosts": [
        "www.usinenouvelle.com"
      ],
      "path_prefix": "/polymeres-materiaux/",
      "path": "^/polymeres-materiaux/[a-z0-9/-]+\\.[A-Z2-7]{26}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "title_word_strategy": "concise",
      "message": "Recherche courte par mots du lien. Verifiez le titre et la publication ouverts.",
      "date_message": "",
      "limitations": "Seulement la rubrique editoriale Polymeres & Materiaux aux URL modernes du site UsineNouvelle. Deux copies GUNB web retrouvees, sans preuve ALA papier. Strategie concise existante, toutes archives et toutes sources ; voisins possibles. Aucun identifiant technique converti en reference, aucune date devinee, aucun Microlink ou verdict humain.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.usinenouvelle.com/polymeres-materiaux/",
        "https://www.usinenouvelle.com/polymeres-materiaux/emballage-textile-batiment-le-recyclage-cousu-main.VY2CJK3ZW5FG5HBEPPGJOZJ24A.html",
        "https://www.usinenouvelle.com/polymeres-materiaux/materiaux/e-flower-une-nouvelle-generation-de-textiles-flexibles-robustes-et-durables-se-profile.VH56GIMXFZBNJMOVQGQ363U25E.html"
      ]
    },
    {
      "id": "fiches-police-night",
      "provider": "europresse",
      "name": "Fiches pratiques de la police territoriale",
      "catalog_resource_id": "europresse-aks-p",
      "hosts": [
        "www.lagazettedescommunes.com"
      ],
      "path_prefix": "/club-prevention-securite/juridique-prevention-securite/fiches-pratiques-de-la-police-territoriale/",
      "path": "^/club-prevention-securite/juridique-prevention-securite/fiches-pratiques-de-la-police-territoriale/[a-z0-9-]+\\.[A-Z2-7]{26}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Verifiez le titre et surtout la version ouverte.",
      "date_message": "",
      "limitations": "Seulement les URL modernes de la collection Fiches pratiques de la police territoriale. Deux versions actuelles MOH web retrouvees, pas de preuve AKS papier actuelle. Strategie standard conservee : raccourcir la recherche peut ouvrir une ancienne version. Temoin souillures negatif (lagent fusionne). Corps collecte concordant mais tableau et liste manquent dans l'archive. Toutes archives et toutes sources ; verifiez la date/version. Aucun Microlink ni verdict humain.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lagazettedescommunes.com/club-prevention-securite/juridique-prevention-securite/fiches-pratiques-de-la-police-territoriale/",
        "https://www.lagazettedescommunes.com/club-prevention-securite/juridique-prevention-securite/fiches-pratiques-de-la-police-territoriale/le-maire-et-la-lutte-contre-les-moustiques-tigres.PQ7PMNZY75HMBK2PHOODINR3RU.html",
        "https://www.lagazettedescommunes.com/club-prevention-securite/juridique-prevention-securite/fiches-pratiques-de-la-police-territoriale/comment-faire-respecter-la-reglementation-en-matiere-de-collecte-et-de-tri-des-souillures-menageres.PUG4WLJ5CBAHJMCZGL37DOZYZQ.html",
        "https://www.lagazettedescommunes.com/club-prevention-securite/juridique-prevention-securite/fiches-pratiques-de-la-police-territoriale/les-contraventions-relatives-aux-souillures-sauvages-1-lagent-de-police-municipale.SBUEYJG56FE4HAOV6RSQDLJ65E.html"
      ]
    },
    {
      "id": "fiches-techniques-night",
      "provider": "europresse",
      "name": "Fiches pratiques techniques",
      "catalog_resource_id": "europresse-akt-p",
      "hosts": [
        "www.lagazettedescommunes.com"
      ],
      "path_prefix": "/club-techni-cites/fiches-pratiques-techni-cites/",
      "path": "^/club-techni-cites/fiches-pratiques-techni-cites/[a-z0-9-]+\\.[A-Z2-7]{26}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "title_word_strategy": "first-four",
      "message": "Recherche par quatre mots du lien. Verifiez la publication, la date et la partie ouverte.",
      "date_message": "",
      "limitations": "Seulement les URL modernes du chemin Fiches pratiques Techni.Cites. Deux copies actuelles MOH web retrouvees, pas de preuve AKT papier actuelle. Quatre premiers mots : compromis teste entre trois trop larges et six incluant damiante fusionne. Toutes sources et toutes archives ; versions et parties voisines possibles. Debuts publics seulement/paywalls, pas de comparaison integrale. Aucun Microlink, reference supposee, date injectee ou verdict humain.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lagazettedescommunes.com/club-techni-cites/fiches-pratiques-techni-cites/",
        "https://www.lagazettedescommunes.com/club-techni-cites/fiches-pratiques-techni-cites/les-marches-a-procedure-adaptee-hypotheses-publicite-et-procedure.PILL6JWAJVHLVIHYO3PDI62WMI.html",
        "https://www.lagazettedescommunes.com/club-techni-cites/fiches-pratiques-techni-cites/les-regles-applicables-aux-travaux-en-presence-damiante-2.P6YVGTABR5HMXE6Y7DGO3MTQVE.html"
      ]
    },
    {
      "id": "fiches-financieres-night",
      "provider": "europresse",
      "name": "Fiches pratiques financieres",
      "catalog_resource_id": "europresse-akr-p",
      "hosts": [
        "www.lagazettedescommunes.com"
      ],
      "path_prefix": "/club-finances/pratiques-finances/fiches-pratiques-finances/",
      "path": "^/club-finances/pratiques-finances/fiches-pratiques-finances/[a-z0-9-]+-([1-9][0-9]?)\\.[A-Z2-7]{26}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "title_url_prefixes": [
        "fiche-finances"
      ],
      "title_number_group": 1,
      "message": "Numero de volet conserve depuis le lien. Verifiez la partie et la date de la publication ouverte.",
      "date_message": "",
      "limitations": "Seulement URL modernes de la collection, numero de volet final1a99 et CMS26. Sans numero ou ancien chemin numerique : profil Gazette conserve. Prefixe fiche-finances retire ; pas de date web imposee a une copie papier. Budgets partie1 AKR1529 et tarification partie2 AKR1665 retrouves ; comparaison des debuts seulement. Numero necessaire pour eviter un autre volet. Aucune reference supposee, aucun Microlink ou verdict humain.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lagazettedescommunes.com/club-finances/pratiques-finances/fiches-pratiques-finances/",
        "https://www.lagazettedescommunes.com/club-finances/pratiques-finances/fiches-pratiques-finances/fiche-finances-focus-sur-les-regles-budgetaires-relatives-aux-budgets-annexes-des-collectivites-territoriales-1.YZOW7TVBPRG5VN7DDBYWTMOQVM.html",
        "https://www.lagazettedescommunes.com/club-finances/pratiques-finances/fiches-pratiques-finances/fiche-finances-la-tarification-des-services-publics-locaux-2.X4GZA7BKOBAJJDL65GJAI2LACQ.html"
      ]
    },
    {
      "id": "industrie-pharma-night",
      "provider": "europresse",
      "name": "Industrie Pharma",
      "catalog_resource_id": "europresse-akw-p",
      "hosts": [
        "www.usinenouvelle.com"
      ],
      "path_prefix": "/sante-pharma/pharma/",
      "path": "^/sante-pharma/pharma/[a-z0-9/-]+\\.[A-Z2-7]{26}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Verifiez le titre et la publication ouverts.",
      "date_message": "",
      "limitations": "Seulement le perimetre moderne Pharma indique par le lien officiel Industrie Pharma du site UsineNouvelle. Six mots, toutes archives et toutes sources. Temoin oncologie : AKW papier premier ; temoin Moderna : GUNB web seulement. Voisins et republications possibles. Debuts publics concordants, pas de comparaison integrale. Aucun identifiant CMS transforme en reference, date devinee, Microlink ou verdict humain.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.usinenouvelle.com/sante-pharma/pharma/",
        "https://www.usinenouvelle.com/sante-pharma/pharma/oncologie-une-chimiotherapie-a-double-verrou-pour-limiter-les-effets-secondaires.ATCPLG5PXRG77HCPDRMZZVTKDU.html",
        "https://www.usinenouvelle.com/sante-pharma/pharma/du-covid-19-au-cancer-comment-moderna-a-reussi-son-changement-de-strategie-pour-ses-vaccins-a-arnm.LM4WHKVL7BEI3DP4U252XGLAUA.html"
      ]
    },
    {
      "id": "formule-verte-night",
      "provider": "europresse",
      "name": "Formule Verte",
      "catalog_resource_id": "europresse-aku-p",
      "hosts": [
        "www.usinenouvelle.com"
      ],
      "path_prefix": "/biosource/",
      "path": "^/biosource/[a-z0-9/-]+\\.[A-Z2-7]{26}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Verifiez le titre et la publication ouverts.",
      "date_message": "",
      "limitations": "Seulement le perimetre moderne Biosource indique par le lien officiel Formule Verte. Six mots, toutes archives et toutes sources. Deux temoins GUNB web, pas de preuve AKU papier. Le perimetre /mes-magazines/magazine-chimie-formule-verte/ reste exclu : CF Innov negatif sur six et trois mots. Voisins et republications possibles. Aucun identifiant CMS transforme en reference, date devinee, Microlink ou verdict humain.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.usinenouvelle.com/biosource/",
        "https://www.usinenouvelle.com/biosource/produits-biosources/dionymer-et-miyoshi-misent-sur-une-poudre-biosourcee-pour-remplacer-les-microplastiques.4VEFI67IAZFR3A3SZNUECRIWIY.html",
        "https://www.usinenouvelle.com/biosource/biotechs-industrielles/ennolys-by-lesaffre-renforce-son-offre-de-cdmo-pour-solidifier-lecosysteme-des-biotechnologies.DMXKU2B7NBDKFANLOSQ6YD7WDY.html"
      ]
    },
    {
      "id": "emballages-magazine-night",
      "provider": "europresse",
      "name": "Emballages Magazine",
      "catalog_resource_id": "europresse-akq-p",
      "hosts": [
        "www.usinenouvelle.com"
      ],
      "path_prefix": "/emballage/",
      "path": "^/emballage/[a-z0-9/-]+\\.[A-Z2-7]{26}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "title_word_strategy": "concise",
      "message": "Recherche par mots du lien. Verifiez le titre et la publication ouverts.",
      "date_message": "",
      "limitations": "Seulement le perimetre moderne Emballage indique par le lien officiel Emballages Magazine. Trois mots, toutes archives et toutes sources. Deux temoins GUNB web, pas de preuve AKQ papier. Six mots EDS avec elision sadosse : zero ; trois mots donnent la bonne copie unique. Voisins et republications possibles. Aucun identifiant CMS transforme en reference, date devinee, Microlink ou verdict humain.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.usinenouvelle.com/emballage/",
        "https://www.usinenouvelle.com/emballage/emballages-le-vendeen-eds-emballage-sadosse-a-un-fonds-dinvestissement.NVYPLNTIDFBSLD2TNZXZZ7LCCU.html",
        "https://www.usinenouvelle.com/emballage/ppwr-un-papier-pour-etiquettes-sans-pfas-chez-upm.7TUU2RGAQVACXGHJCBZYUVHE2Y.html"
      ]
    },
    {
      "id": "lettre-audiovisuel-night",
      "provider": "europresse",
      "name": "La Lettre de l'Audiovisuel",
      "catalog_resource_id": "europresse-lau-p",
      "hosts": [
        "lettreaudiovisuel.com"
      ],
      "path_prefix": "/",
      "path": "^/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "title_word_strategy": "balanced",
      "message": "Recherche par mots du lien. Verifiez le titre et la publication ouverts.",
      "date_message": "",
      "limitations": "Domaine officiel distinct de lalettre.pro (radio et podcast). Slugs racine seulement, quatre mots equilibres, toutes archives et sources. Deux temoins LAU papier uniques ; contenus publics limites par paywall. Pages racine non editoriales possibles, autres liens non qualifies. Aucune date devinee, reference inventee, Microlink ou validation humaine.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://lettreaudiovisuel.com/",
        "https://lettreaudiovisuel.com/pathe-alerte-sur-le-modele-economique-du-cinema-francais/",
        "https://lettreaudiovisuel.com/cma-media-renonce-a-vendre-bfm-locales-et-change-de-cap/"
      ]
    },
    {
      "id": "lettre-cadre-night",
      "provider": "europresse",
      "name": "Lettre du Cadre",
      "catalog_resource_id": "europresse-aky-p",
      "hosts": [
        "www.lettreducadre.fr"
      ],
      "path_prefix": "/article/",
      "path": "^/article/[a-z0-9-]+\\.[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Verifiez le titre et la publication ouverts.",
      "date_message": "",
      "limitations": "Articles numerotes du domaine officiel seulement. Selection generique des mots du lien, toutes archives et sources. Deux temoins uniques, un GLSC web et un AKY papier ; introductions concordantes, suites publiques paywall. Deux temoins plus recents (DGS et Missir) restent negatifs. Aucun identifiant numerique converti en reference, date devinee, Microlink ou validation humaine. Disponibilite et unicite non garanties.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.lettreducadre.fr/article/la-fracture-silencieuse-du-teletravail-dans-les-collectivites.55544",
        "https://www.lettreducadre.fr/article/le-presenteisme-un-risque-silencieux-pour-le-bien-etre-des-services.55543"
      ]
    },
    {
      "id": "supply-chain-interviews-night",
      "provider": "europresse",
      "name": "Supply Chain Magazine : interviews",
      "catalog_resource_id": "europresse-klo-p",
      "hosts": [
        "supplychainmagazine.fr",
        "www.supplychainmagazine.fr"
      ],
      "path_prefix": "/",
      "path": "^/interview-[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "title_url_unmatched_prefix_words": 3,
      "title_word_strategy": "long-words",
      "message": "Recherche par mots du lien. Verifiez le titre et la publication ouverts.",
      "date_message": "",
      "limitations": "Interviews racine uniquement, pas les newsletters /nl/. Retrait generique des trois premiers mots de trois lettres ou plus, puis strategie existante mots longs. Noms composes et societes longues peuvent laisser des mots parasites. Trois temoins uniques du meme special papier SC UniveRSE24juillet2026, publies en ligne en aout. Debuts et passages concordants, preambules et OCR differents ; pas de comparaison integrale. Ni date deduite, reference devinee, Microlink, ni validation humaine. Disponibilite et unicite non garanties.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://supplychainmagazine.fr/interview-brice-pigaglio-gse-rehausser-le-curseur-des-ambitions-bas-carbone/",
        "https://supplychainmagazine.fr/interview-vincent-gufflet-fnac-darty-nous-cherchons-a-amortir-la-dette-carbone-de-nos-produits/",
        "https://supplychainmagazine.fr/interview-nicolas-davril-leroy-merlin-des-transporteurs-engages-et-moins-de-km-a-parcourir/"
      ]
    },
    {
      "id": "seaway-local-night",
      "provider": "europresse",
      "name": "Seaway News / Cornwall Express",
      "catalog_resource_id": "europresse-as-p",
      "hosts": [
        "cornwallseawaynews.com",
        "www.cornwallseawaynews.com"
      ],
      "path_prefix": "/local/",
      "path": "^/local/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien. Verifiez le titre : la version papier peut etre abregee.",
      "date_message": "",
      "limitations": "Rubrique local uniquement, mots generiques du lien sans date ni reference devinee. Deux temoins publics de decembre2023 retrouves en AS papier janvier2024, un premier parmi trois et un unique. Hampton est abrege sur papier, Starter concorde jusqu'a la conclusion Next Intake. Variante Seven Entrepreneurs et deux temoins recents restent negatifs. Pas de garantie d'unicite, de disponibilite recente ou d'equivalence integrale. Aucun Microlink ou verdict humain.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.cornwallseawaynews.com/local/hampton-inn-by-hilton-opens-new-hotel-in-cornwall/",
        "https://www.cornwallseawaynews.com/local/7-entrepreneurs-receive-starter-company-plus-support/"
      ]
    },
    {
      "id": "peuple-share-night",
      "provider": "europresse",
      "name": "Le Peuple Lotbiniere : liens de partage lexicaux",
      "catalog_resource_id": "europresse-qpb-p",
      "hosts": [
        "lepeuplelotbiniere.ca",
        "www.lepeuplelotbiniere.ca"
      ],
      "path_prefix": "/pl/147/",
      "path": "^/pl/147/[^/]+_[^/]+\\.html$",
      "excluded_paths": [
        "/pl/147/Faits_divers.html"
      ],
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien de partage. Verifiez le titre et le journal ; les liens de rubrique sans titre ne sont pas couverts.",
      "date_message": "",
      "limitations": "Uniquement liens de partage lexicaux de la rubrique147, observes dans les boutons de partage officiels. Pas de transformation inventee des liens Faits_divers.html?id= : ils restent exclus. Autobus et Grele ont chacun un unique WQPB recent. Collision Issoudun donne un voisin francais en premier ; Incendie donne un lien externe MaBeauce seulement puis de vieux homonymes. Aucun filtre de source transporte, aucune garantie pour les titres courts. Pas de Microlink dans ce profil ni attribution au papier QPB. Le prototype metadata sur ID numerique est distinct, non integre.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "peuple-query-id-prototype-2026-10-07.json",
        "https://www.lepeuplelotbiniere.ca/pl/147/Autobus_en_flammes_%C3%A0_Saint-Flavien.html?id=46623",
        "https://www.lepeuplelotbiniere.ca/pl/147/Une_temp%C3%AAte_de_gr%C3%AAle_cause_des_dommages_%C3%A0_Saint-Narcisse-de-Beaurivage.html?id=46330"
      ]
    },
    {
      "id": "aldergrove-dated-night",
      "provider": "europresse",
      "name": "Aldergrove Star",
      "catalog_resource_id": "europresse-uaf-p",
      "hosts": [
        "aldergrovestar.com",
        "www.aldergrovestar.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. La version web peut differer du papier.",
      "date_message": "",
      "limitations": "Format date/slug du site officiel uniquement. Deux temoins ouvrent directement le bon PAG web, avec corps concordant au public, hors legendes. Pas de date ni reference injectee, pas de Microlink ou verdict humain. Les copies syndiquees d'autres titres ne prouvent pas une disponibilite UAF/PAG ; un possessif anglais fools peut bloquer la recherche. Pas de garantie sur tout le fonds, les articles recents, l'unicite ou l'edition papier.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://aldergrovestar.com/2025/10/30/aldergrove-zoo-welcomes-zebras-and-waterbucks/",
        "https://aldergrovestar.com/2026/03/12/aldergrove-food-bank-moves-to-new-temporary-location/"
      ]
    },
    {
      "id": "alberni-dated-night",
      "provider": "europresse",
      "name": "Alberni Valley News",
      "catalog_resource_id": "europresse-ppf-p",
      "hosts": [
        "albernivalleynews.com",
        "www.albernivalleynews.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. La version web peut differer du papier.",
      "date_message": "",
      "limitations": "Format date/slug du site officiel uniquement. Deux temoins ouvrent directement le bon PAE web, corps concordants au public. Pas de date/reference injectee, Microlink ou verdict humain. Le diagnostic source seule trouve963documents sur un an, pas une garantie de disponibilite de chaque lien. Anciens temoins recents restent negatifs ; copies syndiquees et autres editions possibles. Pas de garantie d'unicite ou d'equivalence au PPF papier.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://albernivalleynews.com/2026/01/08/alberni-valley-firefighters-respond-to-blaze-at-former-sawmill-site/",
        "https://albernivalleynews.com/2026/03/27/alberni-valley-tourism-association-giving-out-marketing-grants-to-boost-tourism/"
      ]
    },
    {
      "id": "caledonia-dated-night",
      "provider": "europresse",
      "name": "Caledonia Courier",
      "catalog_resource_id": "europresse-ppo-p",
      "hosts": [
        "caledoniacourier.com",
        "www.caledoniacourier.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. La date papier peut differer du web.",
      "date_message": "",
      "limitations": "Deux liens officiels date/slug ouvrent le bon PPO papier ou PCA web, corps concordants hors legendes. Date papier du ski cinq jours apres le web ; signature du centre absente de l'archive. Diagnostic source seule104documents web sur un an. Anciens temoins septembre negatifs conserves ; pas de garantie de disponibilite, d'unicite ou d'equivalence integrale papier/web. Aucun Microlink ni metadonnee injectee.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://caledoniacourier.com/2025/12/20/murray-ridge-ski-hill-opens-for-its-50th-season/",
        "https://caledoniacourier.com/2026/01/23/new-wellness-centre-in-fort-st-james-brings-indigenous-healing-practices/"
      ]
    },
    {
      "id": "houston-dated-night",
      "provider": "europresse",
      "name": "Houston Today",
      "catalog_resource_id": "europresse-pqk-p",
      "hosts": [
        "houston-today.com",
        "www.houston-today.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. Texte et date papier peuvent differer du web.",
      "date_message": "",
      "limitations": "Deux liens officiels date/slug ouvrent le bon PQK papier ou PHT web. Bibliotheque : date papier six jours plus tard, variantes editoriales et legendes incluses, pas egalite textuelle stricte. Sport : trois paragraphes concordants hors legendes. Diagnostic source seule167documents web sur un an. Pas de garantie de disponibilite, d'unicite ou d'equivalence integrale papier/web ; autres domaines/formats non qualifies. Aucun Microlink ni metadonnee injectee.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://houston-today.com/2026/02/05/granisle-library-begins-expansion-into-former-village-offices/",
        "https://houston-today.com/2026/01/28/houston-athletes-win-gold-at-calgary-ringette-tournament/"
      ]
    },
    {
      "id": "chemainus-dated-night",
      "provider": "europresse",
      "name": "Chemainus Valley Courier",
      "catalog_resource_id": "europresse-pch-p",
      "hosts": [
        "chemainusvalleycourier.ca",
        "www.chemainusvalleycourier.ca"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. Signature et edition peuvent differer du site.",
      "date_message": "",
      "limitations": "Deux liens officiels date/slug ouvrent le bon PCC web, corps concordants hors legendes. Signature publique de l'exposition absente de l'archive ; rencontre : Andrea Rondeau archive vs Morgan Brayton publique. Diagnostic source seule119documents sur un an. Anciens temoins negatifs et copies voisines conserves. Pas de garantie de disponibilite, d'unicite ni d'equivalence au PCH papier. Aucun Microlink ou metadonnee injectee.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://chemainusvalleycourier.ca/2026/03/24/crocus-colours-inspire-chemainus-spring-art-show/",
        "https://chemainusvalleycourier.ca/2026/02/24/coffee-with-north-cowichan-councillor-set-for-crofton-caf/"
      ]
    },
    {
      "id": "northern-dated-night",
      "provider": "europresse",
      "name": "Northern Sentinel",
      "catalog_resource_id": "europresse-pqo-p",
      "hosts": [
        "northernsentinel.com",
        "www.northernsentinel.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. L'edition papier peut etre publiee plus tard que le site.",
      "date_message": "",
      "limitations": "Deux liens officiels date/slug ouvrent le bon Northern Sentinel : eau PQO papier193mots sept jours apres le site, travaux PKI web167mots. Corps concordants hors legende et copyright. Diagnostic source seule223documents sur un an. Pas de garantie de disponibilite, d'unicite ni de selection de l'edition web. Aucun Microlink ou metadonnee injectee.",
      "evidence": [
        "northern-live-2026-10-07.md",
        "https://northernsentinel.com/2026/05/07/kitimat-issues-water-quality-advisory-as-river-turbidity-rises/",
        "https://northernsentinel.com/2026/06/08/kuldo-boulevard-extension-work-to-close-section-of-kitimat-roadway-until-june-27/"
      ]
    },
    {
      "id": "lacombe-dated-night",
      "provider": "europresse",
      "name": "Lacombe Express",
      "catalog_resource_id": "europresse-pqp-p",
      "hosts": [
        "lacombeexpress.com",
        "www.lacombeexpress.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. L'edition ouverte peut differer du site.",
      "date_message": "",
      "limitations": "Deux liens officiels date/slug ouvrent les bons PLB web237/209mots, memes dates et Sarah Baker. Corps concordants hors copyright et typographie. Diagnostic source seule303documents sur un an. Pas de garantie de disponibilite, d'unicite ni de selection de l'edition web. Aucun Microlink ou metadonnee injectee.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://lacombeexpress.com/2026/04/15/lacombe-musician-tennessee-rindal-wins-three-awards/",
        "https://lacombeexpress.com/2026/06/25/lacombe-ford-gives-back-to-local-charities/"
      ]
    },
    {
      "id": "penticton-dated-night",
      "provider": "europresse",
      "name": "Penticton Western News",
      "catalog_resource_id": "europresse-prr-p",
      "hosts": [
        "pentictonwesternnews.com",
        "www.pentictonwesternnews.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. L'edition ouverte peut differer du site.",
      "date_message": "",
      "limitations": "Deux liens officiels date/slug ouvrent les bons PPN web149/132mots, memes dates et Brennan Phillips. Corps concordants hors legende/copyright et typographie. Diagnostic source seule945documents sur un an. Pas de garantie de disponibilite, d'unicite ni de selection de l'edition web. Aucun Microlink ou metadonnee injectee.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://pentictonwesternnews.com/2025/11/18/westjet-adding-vancouver-penticton-flights-for-summer-2026/",
        "https://pentictonwesternnews.com/2026/05/06/crash-causes-traffic-congestion-on-highway-97-in-penticton/"
      ]
    },
    {
      "id": "ladysmith-dated-night",
      "provider": "europresse",
      "name": "Ladysmith Chemainus Chronicle",
      "catalog_resource_id": "europresse-pqq-p",
      "hosts": [
        "ladysmithchronicle.com",
        "www.ladysmithchronicle.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. L'edition ouverte peut differer du site.",
      "date_message": "",
      "limitations": "Deux liens officiels date/slug ouvrent les bons PQQ papier119/298mots, respectivement dix et trois jours apres le site. Corps concordants avec variantes OCR, ponctuation et legende. Diagnostic PCO web299documents sur un an. Pas de garantie de disponibilite, d'unicite ni de selection de l'edition web. Aucun Microlink ou metadonnee injectee.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://ladysmithchronicle.com/2026/05/25/motorcyclist-killed-in-crash-north-of-ladysmith/",
        "https://ladysmithchronicle.com/2026/04/06/fire-claims-boats-in-ladysmith-harbour/"
      ]
    },
    {
      "id": "langley-dated-night",
      "provider": "europresse",
      "name": "Langley Advance Times",
      "catalog_resource_id": "europresse-pqt-p",
      "hosts": [
        "langleyadvancetimes.com",
        "www.langleyadvancetimes.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. L'edition ouverte peut differer du site.",
      "date_message": "",
      "limitations": "Deux liens officiels date/slug ouvrent les bons ILA web204/442mots, memes dates et Matthew Claxton. Corps concordants hors typographie, copyright et photos. Diagnostic source seule1910documents sur un an. Pas de garantie de disponibilite, d'unicite ni de selection de l'edition web. Aucun Microlink ou metadonnee injectee.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://langleyadvancetimes.com/2025/11/11/langley-township-council-gives-nod-to-cell-tower/",
        "https://langleyadvancetimes.com/2025/10/29/langley-businesses-honoured-at-sold-out-chamber-gala/"
      ]
    },
    {
      "id": "maple-dated-night",
      "provider": "europresse",
      "name": "The News (Maple Ridge)",
      "catalog_resource_id": "europresse-pqv-p",
      "hosts": [
        "mapleridgenews.com",
        "www.mapleridgenews.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. L'edition ouverte peut differer du site.",
      "date_message": "",
      "limitations": "Deux liens officiels date/slug ouvrent les bons PND web287mots et PQV papier238mots. Corps concordants, Whonnock papier un jour avant web avec titre abrege et photo differente. Diagnostic source seule1771documents sur un an. Pas de garantie de disponibilite, d'unicite ni de selection de l'edition web. Aucun Microlink ou metadonnee injectee.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://mapleridgenews.com/2025/10/31/ridge-meadows-flames-back-in-action-on-halloween-night/",
        "https://mapleridgenews.com/2025/11/08/whonnock-holds-intimate-remembrance-day-service-each-year/"
      ]
    },
    {
      "id": "westerly-dated-night",
      "provider": "europresse",
      "name": "Tofino-Ucluelet Westerly News",
      "catalog_resource_id": "europresse-ptc-p",
      "hosts": [
        "westerlynews.ca",
        "www.westerlynews.ca"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. L'edition ouverte peut differer du site.",
      "date_message": "",
      "limitations": "Deux liens officiels date/slug ouvrent les bons PTC papier424mots et PTO web293mots. Corps concordants ; papier eau23jours avant web. Diagnostic source seule168documents sur un an. Pas de garantie de disponibilite, d'unicite ni de selection de l'edition web. Aucun Microlink ou metadonnee injectee.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://westerlynews.ca/2026/04/17/tofino-considers-3-options-for-expanded-water-sources/",
        "https://westerlynews.ca/2026/04/18/tofino-sets-course-to-ban-single-use-plastic-and-bioplastic-cups/"
      ]
    },
    {
      "id": "agassiz-dated-night",
      "provider": "europresse",
      "name": "The Agassiz-Harrison Observer",
      "catalog_resource_id": "europresse-ppd-p",
      "hosts": [
        "agassizharrisonobserver.com",
        "www.agassizharrisonobserver.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. L'edition ouverte peut differer du site.",
      "date_message": "",
      "limitations": "Deux liens officiels date/slug ouvrent les bons PPD papier234/275mots. Corps concordants ; dates papier3jours avant et4jours apres web. Diagnostic source seule502documents sur un an. Pas de garantie de disponibilite, d'unicite ni de selection de l'edition web. Aucun Microlink ou metadonnee injectee.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://agassizharrisonobserver.com/2026/02/02/agassiz-firefighting-2025-by-the-numbers/",
        "https://agassizharrisonobserver.com/2026/01/26/pickleball-tournament-nets-3000-for-future-agassiz-pool/"
      ]
    },
    {
      "id": "northern-view-night",
      "provider": "europresse",
      "name": "The Northern View",
      "catalog_resource_id": "europresse-prh-p",
      "hosts": [
        "thenorthernview.com",
        "www.thenorthernview.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. L'edition ouverte peut differer du site.",
      "date_message": "",
      "limitations": "Un propre web PNV et deux reprises PPO/PTA; galerie courte, ne garantit pas une edition propre pour chaque lien.",
      "evidence": [
        "https://thenorthernview.com/2026/02/17/photo-gallery-66th-all-native-basketball-tournament-opening-ceremony/",
        "https://thenorthernview.com/2026/01/13/coastal-nations-double-down-on-pipeline-opposition-in-meeting-with-prime-minister/",
        "https://thenorthernview.com/2026/02/17/crews-spend-nearly-480-hours-looking-for-noel-grant/"
      ]
    },
    {
      "id": "westk-night",
      "provider": "europresse",
      "name": "West K News",
      "catalog_resource_id": "europresse-amb-p",
      "hosts": [
        "westknews.com",
        "www.westknews.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. L'edition ouverte peut differer du site.",
      "date_message": "",
      "limitations": "Un propre web AABU et une reprise PMV; ancien negatif swim-deck conserve.",
      "evidence": [
        "https://westknews.com/2026/09/21/kelowna-announces-plans-for-18-million-swim-deck-on-okanagan-lake/",
        "https://westknews.com/2026/02/17/west-kelowna-warriors-best-cranbrook-bucks-twice/",
        "https://westknews.com/2026/02/17/over-50-distracted-drivers-in-kelowna-caught-fined-in-school-zones/"
      ]
    },
    {
      "id": "salmon-night",
      "provider": "europresse",
      "name": "Salmon Arm Observer",
      "catalog_resource_id": "europresse-psh-p",
      "hosts": [
        "saobserver.net",
        "www.saobserver.net"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. L'edition ouverte peut differer du site.",
      "date_message": "",
      "limitations": "Deux propres web PSB sur saobserver.net; ancien domaine obsolete, anciens negatifs conserves.",
      "evidence": [
        "https://saobserver.net/2026/02/17/planned-pile-burn-at-salmon-arm-rappattack-base-could-produce-visible-smoke/",
        "https://saobserver.net/2026/02/17/former-home-of-tumbler-ridge-in-salmon-arm-mayors-thoughts/"
      ]
    },
    {
      "id": "hope-dated-night",
      "provider": "europresse",
      "name": "The Hope Standard",
      "catalog_resource_id": "europresse-pqj-p",
      "hosts": [
        "hopestandard.com",
        "www.hopestandard.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. L'edition ouverte peut differer du site.",
      "date_message": "",
      "limitations": "Deux temoins propres papier PQJ. Dates papier trois jours apres web; article rail actualise. Pas de garantie de selection de la version web.",
      "evidence": [
        "https://hopestandard.com/2026/01/13/rail-line-washout-leads-to-road-closure-in-hope/",
        "https://hopestandard.com/2026/02/17/earthquake-training-for-army-reservists-taking-place-in-hope/"
      ]
    },
    {
      "id": "interior-dated-night",
      "provider": "europresse",
      "name": "The Interior News",
      "catalog_resource_id": "europresse-pql-p",
      "hosts": [
        "interior-news.com",
        "www.interior-news.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. L'edition ouverte peut differer du site.",
      "date_message": "",
      "limitations": "Deux temoins propres papier PQL. Dates papier deux jours apres web; dates de rencontres modifiees dans le temoin Steelheads. Pas de garantie de version identique.",
      "evidence": [
        "https://interior-news.com/2026/02/17/steelheads-wolverines-advance-to-respective-divisional-finals/",
        "https://interior-news.com/2026/01/13/bvca-presents-kym-gouchie-and-gamksimoon/"
      ]
    },
    {
      "id": "burns-dated-night",
      "provider": "europresse",
      "name": "Burns Lake Lakes District News",
      "catalog_resource_id": "europresse-ppm-p",
      "hosts": [
        "burnslakelakesdistrictnews.com",
        "www.burnslakelakesdistrictnews.com"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. L'edition ouverte peut differer du site.",
      "date_message": "",
      "limitations": "Deux temoins propres web PLD. Ancien echec possessif athletes/athlete's non resolu; aucune garantie pour toutes les URLs.",
      "evidence": [
        "https://burnslakelakesdistrictnews.com/2026/02/17/bchl-road-show-returns-to-burns-lake-for-weekend-of-hockey/",
        "https://burnslakelakesdistrictnews.com/2026/01/13/student-teachers-from-lake-babine-nation-headed-to-international-placements/"
      ]
    },
    {
      "id": "knack-prefix-night",
      "provider": "europresse",
      "name": "Knack",
      "catalog_resource_id": "europresse-bkn-p",
      "hosts": [
        "knack.be",
        "www.knack.be"
      ],
      "path": "^/nieuws/.+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. L'edition ouverte peut differer du site.",
      "date_message": "",
      "limitations": "Prototype: deux acces au fonds web BKNW; ne prouve pas le fonds papier ni une couverture generale des prefixes.",
      "evidence": [
        "https://www.knack.be/nieuws/wetenschap/hoe-mrna-vaccins-ook-ingezet-worden-tegen-kanker/",
        "https://www.knack.be/nieuws/wereld/brazilie-radicaal-rechts-boekt-overwinning-in-braziliaanse-verkiezingen-tussen-het-bolsonarisme-en-links-lijkt-geen-derde-weg-meer-te-bestaan/"
      ],
      "title_url_prefixes": [
        "brazilie"
      ]
    },
    {
      "id": "laval-root-night",
      "provider": "europresse",
      "name": "Courrier Laval",
      "catalog_resource_id": "europresse-ah-p",
      "hosts": [
        "courrierlaval.com",
        "www.courrierlaval.com"
      ],
      "path": "^/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. L'edition ouverte peut differer du site.",
      "date_message": "",
      "limitations": "Prototype de recherche : deux nouveaux positifs, anciens contre-exemples non resolus.",
      "evidence": [
        "https://courrierlaval.com/collision-autopatrouille-police-vehicule-a-laval/",
        "https://courrierlaval.com/viaduc-concorde-laval-souvient-victimes-20-ans/"
      ]
    },
    {
      "id": "caractere-dated-night",
      "provider": "europresse",
      "name": "Caractere",
      "catalog_resource_id": "europresse-ue-p",
      "hosts": [
        "caractere.net",
        "www.caractere.net"
      ],
      "path": "^/[0-9]{4}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "title_word_strategy": "balanced",
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et l'edition archivee.",
      "date_message": "",
      "limitations": "Un temoin mensuel UE et un temoin hebdomadaire CAR documentes. Ce domaine partage ne garantit pas l'edition mensuelle. Negatif Hugues conserve ; aucun verdict humain.",
      "evidence": [
        "pending-batch-2026-10-07/caractere-pending-integration.md"
      ]
    },
    {
      "id": "levis-pme-night",
      "provider": "europresse",
      "name": "Le Journal de Levis : rubrique PME",
      "catalog_resource_id": "europresse-hsm-p",
      "hosts": [
        "www.journaldelevis.com"
      ],
      "path_prefix": "/jdl/51/",
      "path": "^/jdl/51/[^/]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "title_url_ignored_slugs": [
        "pme"
      ],
      "metadata_query_identity": {
        "parameter": "id",
        "canonical_path": "/jdl/section.aspx",
        "canonical_extra_parameters": [
          "sortcode"
        ]
      },
      "message": "Recherche par mots du lien, ou titre recupere si le lien ne contient que la rubrique PME. Verifiez le titre et la publication : une reprise peut etre ouverte.",
      "date_message": "",
      "limitations": "Limite a la rubrique /jdl/51/ observee. Les liens lexicaux evitent Microlink ; PME.html?id numerique exige une recuperation de titre, soumise au quota. Garneau ouvre JOLW162mots concordants. Armoires et Signaux ouvrent des reprises WQPB concordantes, pas deux autres temoins Levis. Pas de filtre source garanti ni de couverture des autres rubriques, de tous les articles ou de tout le domaine.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "LEVIS-METADATA-2026-10-07.md",
        "https://www.journaldelevis.com/jdl/51/PME.html?id=46758",
        "https://www.journaldelevis.com/jdl/51/Le_service_du_Groupe_Garneau_Thanatologue_certifi%C3%A9.html?id=46758",
        "https://www.journaldelevis.com/jdl/51/PME.html?id=45750",
        "https://www.journaldelevis.com/jdl/51/PME.html?id=46077"
      ]
    },
    {
      "id": "profession-cgp-juridique-night",
      "provider": "europresse",
      "name": "Profession CGP",
      "catalog_resource_id": "europresse-amu-p",
      "hosts": [
        "professioncgp.com",
        "www.professioncgp.com"
      ],
      "path": "^/article/juridique-et-fiscal/[^/]+/[^/]+\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication. La date du magazine peut differer du site.",
      "date_message": "",
      "limitations": "Deux articles de fond de la rubrique juridique et fiscal ouvrent les bons AMU papier3439/1024mots, corps concordants avec differences OCR et encadres. Recherche toutes sources : aucune garantie d'unicite ni de disponibilite. Breves recentes non concluantes et liens editoriaux reutilises exclus du perimetre. Aucun Microlink ni metadonnee injectee.",
      "evidence": [
        "NUIT-V1-2026-10-07.md",
        "https://www.professioncgp.com/article/juridique-et-fiscal/juridique-et-fiscal-transmission/du-vent-dans-les-branches-des-transmissions-familiales.html",
        "https://www.professioncgp.com/article/juridique-et-fiscal/retraite/ce-que-le-budget-2026-a-reserve-au-per.html"
      ]
    },
    {
      "id": "mesures-entretiens-night",
      "provider": "europresse",
      "name": "Mesures",
      "catalog_resource_id": "europresse-ezm-p",
      "hosts": [
        "mesures.com",
        "www.mesures.com"
      ],
      "path": "^/archives/entretiens/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "title_word_strategy": "balanced",
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la version papier ou web.",
      "date_message": "",
      "limitations": "Archives/entretiens uniquement. Deux URL seules ouvrent Mesures papier 919 (2531 mots) et Mesures web (1814 mots), avec reponses concordantes. La version web omet des questions presentes sur le site ; ne pas promettre une egalite textuelle integrale. Actualites recentes negatives conservees hors perimetre. Des slugs d'archives contiennent des mots coupes ou fusionnes non qualifies. Toutes dates et sources, aucune garantie d'unicite. Aucun Microlink, date injectee ou verdict humain.",
      "evidence": [
        "MESURES-ENTRETIENS-2026-10-07.md"
      ]
    },
    {
      "id": "pdv-enquete-night",
      "provider": "europresse",
      "name": "Points de Vente",
      "catalog_resource_id": "europresse-pdv-p",
      "hosts": [
        "pointsdevente.fr",
        "www.pointsdevente.fr"
      ],
      "path": "^/enquete/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "title_word_strategy": "balanced",
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre dans le dossier papier ouvert.",
      "date_message": "",
      "limitations": "Rubrique Enquete seulement. Deux URL seules ouvrent PDV papier 6364/3074 mots, introductions concordantes avec les extraits publics. Dossiers pouvant regrouper plusieurs articles, OCR et dates papier/web differents ; pas de comparaison integrale du paywall. Energie reste negatif. Solutions/Monetique exclu : balanced zero et long-anchors ouvre des voisins avant la bonne copie. Toutes dates et sources, aucune garantie d'unicite. Aucun Microlink, date injectee ou verdict humain.",
      "evidence": [
        "POINTS-DE-VENTE-ENQUETE-2026-10-07.md"
      ]
    },
    {
      "id": "tendances-restauration-night",
      "provider": "europresse",
      "name": "Tendances Restauration",
      "catalog_resource_id": "europresse-amf-p",
      "hosts": [
        "tendances-restauration.com",
        "www.tendances-restauration.com"
      ],
      "path": "^/[a-z0-9-]*[a-z][a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "title_word_strategy": "balanced",
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le dossier papier ouvert.",
      "date_message": "",
      "limitations": "Deux dossiers URL seule ouvrent AMF papier du 1 octobre 2026, 2062 et 1766 mots, introductions et premiers paragraphes concordants. Dates web/papier et titres de rubrique differents, OCR et encadres ; aucune comparaison integrale du paywall. Les entretiens Veil/Valfort et l'actualite nuggets restent negatifs ou ouvrent des voisins ; l'entretien Tutti Pizza Panorama2021 reste zero meme avec trois premiers mots. Les suffixes editoriaux et noms dans les slugs peuvent polluer les mots. Toutes dates et sources, aucune garantie d'unicite ou de couverture generale. Aucun Microlink, date injectee ou verdict humain.",
      "evidence": [
        "TENDANCES-RESTAURATION-DOSSIERS-2026-10-07.md"
      ]
    },
    {
      "id": "stmichel-dated-night",
      "provider": "europresse",
      "name": "Journal de St-Michel",
      "catalog_resource_id": "europresse-sk-p",
      "hosts": [
        "journaldestmichel.com",
        "www.journaldestmichel.com"
      ],
      "path": "^/[0-9]{4}-[0-9]{2}-[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "title_word_strategy": "balanced",
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et le journal ouverts.",
      "date_message": "",
      "limitations": "Permaliens lexicaux YYYY-MM seulement. Deux URL seules ouvrent SK papier 646/214 mots, textes publics concordants avec differences de mise en page et attribution sur Entente. Pas de garantie generale : anciennes URL Racisme/Biennales negatives ; Benevoles sans noms du titre ; Lettre ouverte contient JFP absent du titre. Variante first-four rejetee : ouvre Midi Libre sans rapport. Toutes dates et sources, verifiez le document. Aucun Microlink, date injectee ou verdict humain.",
      "evidence": [
        "STMICHEL-DATED-2026-10-07.md"
      ]
    },
    {
      "id": "sherbrooke-phrase-night",
      "provider": "europresse",
      "name": "Sherbrooke.info",
      "catalog_resource_id": "europresse-aal-p",
      "hosts": [
        "sherbrooke.info",
        "www.sherbrooke.info"
      ],
      "path": "^/infolettre/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "title_query_mode": "phrase",
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par phrase du lien ; verifiez le titre et le journal ouverts.",
      "date_message": "",
      "limitations": "Deux phrases lexicales URL seules ouvrent AAL papier 626/760 mots, textes publics concordants mais non identiques. Les mots isoles de Discorde ouvraient un autre journal. Retro 2024 et articles locaux 2026 restent incertains. Dates papier differentes du site. Pas de garantie generale ni filtre source transportable. Aucun Microlink, titre ou date injectes, aucun verdict humain.",
      "evidence": [
        "SHERBROOKE-PHRASE-2026-10-07.md"
      ]
    },
    {
      "id": "trends-nl-legacy-night",
      "provider": "europresse",
      "name": "Trends neerlandophone",
      "catalog_resource_id": "europresse-btc-p",
      "hosts": [
        "trends.knack.be"
      ],
      "path": "^/nieuws/[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du lien ; verifiez le titre et la publication ouverts.",
      "date_message": "",
      "limitations": "Ancien format editorial /nieuws/ seulement, pas Kanaal Z, DataNews, Beleggen ni tous les chemins recents. Deux Link URL seule ouvrent BTC papier 762 et 805 mots ; resumes officiels concordants, corps publics reserves non compares integralement. Toutes dates et tous journaux : des reprises restent possibles. Aucun titre ou date injectes, aucun Microlink ni verdict humain.",
      "evidence": [
        "TRENDS-NL-PISTES-2026-10-07.md"
      ]
    },
    {
      "id": "jde-normandie-liseuse-night",
      "provider": "europresse",
      "name": "Le Journal des entreprises - Normandie",
      "catalog_resource_id": "europresse-jfl-p",
      "hosts": [
        "www.lejournaldesentreprises.com",
        "lejournaldesentreprises.com"
      ],
      "path_prefix": "/liseuse/normandie/",
      "path": "^/liseuse/normandie/[a-z0-9-]+_[0-9]+/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "title_word_strategy": "first-four",
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Recherche du sujet de couverture du mensuel Normandie. Verifiez le titre, la publication et le numero ouverts.",
      "limitations": "Fiches de numero Normandie seulement, pas chaque article du sommaire ni les permaliens web partages. Deux Link URL seule ouvrent JFL papier 1470 et 1283 mots. Sofimari a necessite une relance et un delai de chargement. Des Briefs et versions courtes peuvent aussi ressortir ; aucun filtre source impose ou garantie generale. Pas de comparaison integrale web/papier depuis les fiches. Aucun Microlink ni verdict humain.",
      "evidence": [
        "JDE-NORMANDIE-2026-10-08.md"
      ]
    },
    {
      "id": "letemps-cyber-night",
      "provider": "europresse",
      "name": "Le Temps - anciens liens Cyber",
      "catalog_resource_id": "europresse-te-p",
      "hosts": [
        "www.letemps.ch",
        "letemps.ch"
      ],
      "path_prefix": "/cyber/",
      "path": "^/cyber/[a-z0-9-]+/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "title_word_strategy": "balanced",
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Recherche experimentale des anciens liens Cyber du Temps. Verifiez l'article et la publication ; utilisez les recherches de secours si necessaire.",
      "limitations": "Deux ouvertures TE papier verifiees depuis URL seule : SwissCovid2021 et ChatGPT2022. Deux autres liens Cyber2023 restent sans resultat : Bard et EuropeIA. Pas de garantie generale, pas de filtre source impose. Autres rubriques et chemins Cyber imbriques exclus. Comparaison avec introductions publiques seulement, suites publiques reservees aux abonnes. Aucun Microlink ni verdict humain.",
      "evidence": [
        "LE-TEMPS-ANCIEN-2026-10-08.md"
      ]
    },
    {
      "id": "lavoix-moulins-societe-night",
      "provider": "europresse",
      "name": "La Voix - MRC des Moulins, Societe",
      "catalog_resource_id": "europresse-asj-p",
      "hosts": [
        "journallavoix.com",
        "www.journallavoix.com"
      ],
      "path_prefix": "/societe/",
      "path": "^/societe/[a-z0-9-]+/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Recherche experimentale des articles Societe de La Voix, MRC des Moulins. Verifiez le titre et la publication ouverts.",
      "limitations": "Deux Link URL seule avec selection standard six mots ouvrent ASJ papier695 et469mots, corps concordants. Balanced quatre mots ouvre un faux positif pour RichardMercier : recette non retenue. Rubrique Societe seulement ; Actualites et autres chemins non qualifies. Aucun filtre source impose, aucune garantie generale ni validation humaine. Aucun Microlink.",
      "evidence": [
        "LA-VOIX-MOULINS-2026-10-08.md"
      ]
    },
    {
      "id": "courrier-du-sud-root-night",
      "provider": "europresse",
      "name": "Le Courrier du Sud - Longueuil",
      "catalog_resource_id": "europresse-qco-p",
      "hosts": [
        "lecourrierdusud.ca",
        "www.lecourrierdusud.ca"
      ],
      "path": "^/[a-z0-9-]+/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Recherche experimentale par mots du titre ; verifiez le journal et le contenu ouverts.",
      "limitations": "Deux URL seules ouvrent les corps concordants WQCO de juillet et novembre2025. Plusieurs captures peuvent avoir des dates differentes. Anciens essais recents negatifs conserves ; aucune garantie generale, aucun filtre source impose, aucun verdict humain. Ne pas confondre avec lecourriersud.com (OZ).",
      "evidence": [
        "COURRIER-DU-SUD-2026-10-08.md"
      ]
    },
    {
      "id": "electroniques-archive-night",
      "provider": "europresse",
      "name": "ElectroniqueS - archives revue",
      "catalog_resource_id": "europresse-ezc-p",
      "hosts": [
        "electroniques.biz",
        "www.electroniques.biz"
      ],
      "path": "^/archives/revue-electroniques/[a-z0-9-]+/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Recherche experimentale par mots du titre ; verifiez la publication et le contenu ouverts.",
      "limitations": "Deux liens de revue de juillet2021 ouvrent les articles EZC concordants. Wintek2006 reste negatif. Les actualites modernes et les autres rubriques sont hors perimetre. Aucune garantie generale ni filtre source impose ; aucun verdict humain.",
      "evidence": [
        "ELECTRONIQUES-ARCHIVE-2026-10-08.md"
      ]
    },
    {
      "id": "jardins-zinio-night",
      "provider": "europresse",
      "name": "L'Ami des Jardins et de la Maison - Zinio",
      "catalog_resource_id": "europresse-mam-p",
      "hosts": [
        "zinio.com",
        "www.zinio.com"
      ],
      "path_prefix": "/fr/article/lami-des-jardins/",
      "path": "^/fr/article/lami-des-jardins/[a-z0-9-]+-i[0-9]+/[a-z0-9-]+-a[0-9]+/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Recherche experimentale par mots du titre ; verifiez le journal et le contenu ouverts.",
      "limitations": "Deux permaliens Zinio du numero1141 ouvrent les articles MAM concordants. Identifiant local Zinio retire automatiquement, sans date ni reference injectee. Deux autres articles du meme numero echouent ou donnent des voisins : aucune garantie generale. Pas de filtre source impose, pas de mapping du site officiel, des sommaires ou des autres magazines Zinio. Aucun verdict humain.",
      "evidence": [
        "JARDINS-ZINIO-2026-10-08.md"
      ]
    },
    {
      "id": "gulf-standard-night",
      "provider": "europresse",
      "name": "Gulf Islands Driftwood",
      "catalog_resource_id": "europresse-pgw-p",
      "hosts": [
        "gulfislandsdriftwood.com",
        "www.gulfislandsdriftwood.com"
      ],
      "path": "^/[a-z0-9-]+/?$",
      "excluded_paths": [
        "/about-us/",
        "/meet-the-team/",
        "/privacy-policy/",
        "/terms-of-service/",
        "/subscribe-to-the-gulf-islands-driftwood/",
        "/contact/",
        "/event/",
        "/obituaries/"
      ],
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Recherche experimentale par mots du lien ; verifiez le titre, le journal et le contenu ouverts.",
      "limitations": "Deux URL propres ouvrent les corps PGW concordants (Botterell825mots et Batemans631mots). Selection standard sans date ni reference injectee ; papier parfois reformule et date differente du web. Deux autres URL, ElizabethMay et parade, donnent zero ; les trois mots finaux aveugles et TEXT global sont rejetes apres faux voisins. Pas garantie generale ni filtre publication impose. Categories, numeros entiers et pages de service exclus ; aucun verdict humain.",
      "evidence": [
        "GULF-STANDARD-2026-10-08.md"
      ]
    },
    {
      "id": "cote-est-zinio-night",
      "provider": "europresse",
      "name": "Maisons Cote Est - Zinio",
      "catalog_resource_id": "europresse-exg-p",
      "hosts": [
        "zinio.com",
        "www.zinio.com"
      ],
      "path_prefix": "/fr/article/cote-est/",
      "path": "^/fr/article/cote-est/[a-z0-9-]+-i[0-9]+/[a-z0-9-]+-a[0-9]+/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Recherche experimentale par mots du lien ; verifiez le journal et le contenu ouverts.",
      "limitations": "Deux articles du numero94 ouverts dans EXG avec auteur, chapeau et debut concordants. Apercus Zinio partiels : pas de comparaison integrale ni garantie generale. Aucun filtre source, date ou reference injectee. Pas de mapping du site cotemaison, des sommaires ou des autres magazines Zinio.",
      "evidence": [
        "COTE-EST-ZINIO-2026-10-08.md"
      ]
    },
    {
      "id": "cote-sud-zinio-night",
      "provider": "europresse",
      "name": "Maisons Cote Sud - Zinio",
      "catalog_resource_id": "europresse-exi-p",
      "hosts": [
        "zinio.com",
        "www.zinio.com"
      ],
      "path_prefix": "/fr/article/cote-sud/",
      "path": "^/fr/article/cote-sud/[a-z0-9-]+-i[0-9]+/[a-z0-9-]+-a[0-9]+/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Recherche experimentale par mots du lien ; verifiez le journal et le contenu ouverts.",
      "limitations": "Experimental : deux bons articles sur deux numeros (Nice et Aix), apercus partiels concordants. Titres courts ambigus : amphore signature ouvre un faux Figaro ; adresses marise monia donne zero en natif et erreur Link ; Bofill seul insuffisant. Verifier publication et contenu. Aucun filtre source/date/reference injecte. Pas de mapping cotemaison, sommaires ou autres magazines Zinio.",
      "evidence": [
        "COTE-SUD-ZINIO-2026-10-08.md"
      ]
    },
    {
      "id": "cote-paris-zinio-night",
      "provider": "europresse",
      "name": "Vivre Cote Paris - Zinio",
      "catalog_resource_id": "europresse-exk-p",
      "hosts": [
        "zinio.com",
        "www.zinio.com"
      ],
      "path_prefix": "/fr/article/cote-paris/",
      "path": "^/fr/article/cote-paris/[a-z0-9-]+-i[0-9]+/[a-z0-9-]+-a[0-9]+/?$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Recherche experimentale par mots du lien ; verifiez le journal et le contenu ouverts.",
      "limitations": "Deux articles de numeros distincts (60 et 78) ouverts par le vrai lien automatique dans EXK avec auteur, chapeau et debut concordants. Apercus publics partiels, pas de comparaison integrale ni garantie generale. Le premier temoin a un voisin Nouvelliste dans la recherche native. Aucun filtre source, date ou reference injectee. Pas de mapping global cotemaison, sommaire ou autres magazines Zinio.",
      "evidence": [
        "COTE-PARIS-ZINIO-2026-10-08.md"
      ]
    },
    {
      "id": "sudouest-lot-et-garonne-night",
      "provider": "europresse",
      "name": "Sud Ouest - Lot-et-Garonne",
      "catalog_resource_id": "europresse-sol-p",
      "hosts": [
        "sudouest.fr",
        "www.sudouest.fr"
      ],
      "path_prefix": "/lot-et-garonne/",
      "path": "^/lot-et-garonne/[a-z0-9/-]+-[0-9]+\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "Date publique lue automatiquement si disponible ; sinon recherche textuelle.",
      "message": "Reference de la version web calculee depuis le lien et sa date publique. Secours textuel si la date est indisponible ; pas de garantie de version papier.",
      "limitations": "Scope des articles /lot-et-garonne/ uniquement. Deux corps web concordent avec les versions SOL exposees par Europresse, dont les titres papier different. Aucun filtre source, date ou reference injectee. Pas de garantie de version papier, ni activation des autres editions ou des dossiers sommaires. Reference web SOE demontree sur deux liens du perimetre ; lecture anonyme CORS opt-in bornee, aucun Microlink. Domaine www exact seulement pour la date publique.",
      "evidence": [
        "SUD-OUEST-LOT-GARONNE-2026-10-08.md",
        "REFERENCE-CONVERSION-SUD-OUEST-LOT-BASQUE-2026-10-09.md"
      ],
      "reference": {
        "type": "url-sha1",
        "source_code": "SOE",
        "prefix": "sofr",
        "canonical_host": "www.sudouest.fr"
      },
      "public_date_metadata": {
        "host": "www.sudouest.fr",
        "time_zone": "Europe/Paris"
      },
      "title_fallback_without_reference": true
    },
    {
      "id": "sudouest-charente-maritime-night",
      "provider": "europresse",
      "name": "Sud Ouest - Charente-Maritime",
      "catalog_resource_id": "europresse-soc-p",
      "hosts": [
        "sudouest.fr",
        "www.sudouest.fr"
      ],
      "path_prefix": "/charente-maritime/",
      "path": "^/charente-maritime/[a-z0-9/-]+-[0-9]+\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "Date publique lue automatiquement si disponible ; sinon recherche textuelle.",
      "message": "Reference de la version web calculee depuis le lien et sa date publique. Secours textuel si la date est indisponible ; pas de garantie de version papier.",
      "limitations": "Articles lexicaux /charente-maritime/ uniquement. Deux temoins Oleron : un vrai Link ouvre SOC, l'autre SOE avec corps SOC concordant. Aucun filtre source, date ou reference injectee. Pas de garantie de version papier ou de couverture de toutes les communes. Les dossiers sommaires ne prouvent pas un article individuel. Reference web SOE demontree sur deux liens du perimetre ; lecture anonyme CORS opt-in bornee, aucun Microlink. Domaine www exact seulement pour la date publique.",
      "evidence": [
        "SUD-OUEST-CHARENTE-MARITIME-2026-10-08.md",
        "REFERENCE-CONVERSION-SUD-OUEST-CHARENTE-2026-10-09.md"
      ],
      "reference": {
        "type": "url-sha1",
        "source_code": "SOE",
        "prefix": "sofr",
        "canonical_host": "www.sudouest.fr"
      },
      "public_date_metadata": {
        "host": "www.sudouest.fr",
        "time_zone": "Europe/Paris"
      },
      "title_fallback_without_reference": true
    },
    {
      "id": "sudouest-pays-basque-hasparren-night",
      "provider": "europresse",
      "name": "Sud Ouest - Pays Basque (Hasparren)",
      "catalog_resource_id": "europresse-sop-p",
      "hosts": [
        "sudouest.fr",
        "www.sudouest.fr"
      ],
      "path_prefix": "/pyrenees-atlantiques/hasparren/",
      "path": "^/pyrenees-atlantiques/hasparren/[a-z0-9-]+-[0-9]+\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "Date publique lue automatiquement si disponible ; sinon recherche textuelle.",
      "message": "Reference de la version web calculee depuis le lien et sa date publique. Secours textuel si la date est indisponible ; pas de garantie de version papier.",
      "limitations": "Scope Hasparren uniquement, pas toutes les Pyrenees-Atlantiques ni toutes les communes basques. Deux corps SOE concordent avec les alternatives SOP exposees et ouvertes ; un troisieme corps web sans alternative SOP observee. Aucun filtre source/date/reference injectee, pas de garantie de version papier. Pas de validation des dossiers sommaires. Reference web SOE demontree sur deux liens du perimetre ; lecture anonyme CORS opt-in bornee, aucun Microlink. Domaine www exact seulement pour la date publique.",
      "evidence": [
        "SUD-OUEST-HASPARREN-2026-10-08.md",
        "REFERENCE-CONVERSION-SUD-OUEST-LOT-BASQUE-2026-10-09.md"
      ],
      "reference": {
        "type": "url-sha1",
        "source_code": "SOE",
        "prefix": "sofr",
        "canonical_host": "www.sudouest.fr"
      },
      "public_date_metadata": {
        "host": "www.sudouest.fr",
        "time_zone": "Europe/Paris"
      },
      "title_fallback_without_reference": true
    },
    {
      "id": "sudouest-dordogne-night",
      "provider": "europresse",
      "name": "Sud Ouest - Dordogne",
      "catalog_resource_id": "europresse-sod-p",
      "hosts": [
        "sudouest.fr",
        "www.sudouest.fr"
      ],
      "path_prefix": "/dordogne/",
      "path": "^/dordogne/[a-z0-9/-]+-[0-9]+\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "Date publique lue automatiquement si disponible ; sinon recherche textuelle.",
      "message": "Reference de la version web calculee depuis le lien et sa date publique. Secours textuel si la date est indisponible ; pas de garantie de version papier.",
      "limitations": "Articles lexicaux /dordogne/ seulement. Trois ouvertures automatiques web observees a Saint-Astier ; deux equivalents papier SOD, dont Coursac retrouve uniquement par diagnostic elargi. Deux liens sur cinq echouent avec les criteres initiaux. Aucun filtre source/date/reference injectee, aucune garantie de version papier ou de toutes les communes. Le diagnostic elargi n'est pas automatise. Reference web SOE demontree sur deux liens du perimetre ; lecture anonyme CORS opt-in bornee, aucun Microlink. Domaine www exact seulement pour la date publique.",
      "evidence": [
        "SUD-OUEST-DORDOGNE-2026-10-08.md",
        "REFERENCE-CONVERSION-SUD-OUEST-DORDOGNE-2026-10-09.md"
      ],
      "reference": {
        "type": "url-sha1",
        "source_code": "SOE",
        "prefix": "sofr",
        "canonical_host": "www.sudouest.fr"
      },
      "public_date_metadata": {
        "host": "www.sudouest.fr",
        "time_zone": "Europe/Paris"
      },
      "title_fallback_without_reference": true
    },
    {
      "id": "sudouest-bearn-pau-night",
      "provider": "europresse",
      "name": "Sud Ouest - Bearn et Soule (Pau et Bearn)",
      "catalog_resource_id": "europresse-sob-p",
      "hosts": [
        "sudouest.fr",
        "www.sudouest.fr"
      ],
      "path_prefix": "/pyrenees-atlantiques/pau/",
      "path": "^/pyrenees-atlantiques/pau/[a-z0-9-]+-[0-9]+\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title"
      ],
      "title_word_strategy": "balanced",
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "Date publique lue automatiquement si disponible ; sinon recherche textuelle.",
      "message": "Reference de la version web calculee depuis le lien et sa date publique. Secours textuel si la date est indisponible ; pas de garantie de version papier.",
      "limitations": "Chemins Pau et Bearn uniquement, pas tout le departement ni preuve de couverture de la Soule. Trois bons corps web avec selection balanced, deux correspondances SOB exposees et ouvertes. Le salon du polar ouvrait un faux positif2020 avec les six premiers mots ; balanced retrouve2026. Un quatrieme lien culture/enfant echoue encore. Aucun filtre source/date/reference cible injectee ; pas de garantie de version papier. Reference web SOE demontree sur deux liens du perimetre ; lecture anonyme CORS opt-in bornee, aucun Microlink. Domaine www exact seulement pour la date publique.",
      "evidence": [
        "SUD-OUEST-BEARN-2026-10-08.md",
        "REFERENCE-CONVERSION-SUD-OUEST-INTEGRATION-2026-10-09.md"
      ],
      "reference": {
        "type": "url-sha1",
        "source_code": "SOE",
        "prefix": "sofr",
        "canonical_host": "www.sudouest.fr"
      },
      "public_date_metadata": {
        "host": "www.sudouest.fr",
        "time_zone": "Europe/Paris"
      },
      "title_fallback_without_reference": true
    },
    {
      "id": "sudouest-bearn-regional-night",
      "provider": "europresse",
      "name": "Sud Ouest - Bearn et Soule (Bearn)",
      "catalog_resource_id": "europresse-sob-p",
      "hosts": [
        "sudouest.fr",
        "www.sudouest.fr"
      ],
      "path_prefix": "/pyrenees-atlantiques/bearn/",
      "path": "^/pyrenees-atlantiques/bearn/[a-z0-9-]+-[0-9]+\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "title_word_strategy": "balanced",
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Recherche par mots du debut et de la fin du lien ; la version web peut etre ouverte plutot que l'edition papier Bearn et Soule. Verifiez le contenu.",
      "limitations": "Chemins Pau et Bearn uniquement, pas tout le departement ni preuve de couverture de la Soule. Trois bons corps web avec selection balanced, deux correspondances SOB exposees et ouvertes. Le salon du polar ouvrait un faux positif2020 avec les six premiers mots ; balanced retrouve2026. Un quatrieme lien culture/enfant echoue encore. Aucun filtre source/date/reference cible injectee ; pas de garantie de version papier.",
      "evidence": [
        "SUD-OUEST-BEARN-2026-10-08.md"
      ]
    },
    {
      "id": "sudouest-landes-night",
      "provider": "europresse",
      "name": "Sud Ouest - Landes",
      "catalog_resource_id": "europresse-soa-p",
      "hosts": [
        "sudouest.fr",
        "www.sudouest.fr"
      ],
      "path_prefix": "/landes/",
      "path": "^/landes/[a-z0-9/-]+-[0-9]+\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "Date publique lue automatiquement si disponible ; sinon recherche textuelle.",
      "message": "Reference de la version web calculee depuis le lien et sa date publique. Secours textuel si la date est indisponible ; pas de garantie de version papier.",
      "limitations": "Articles lexicaux /landes/ seulement. Quatre ouvertures automatiques web observees ; deux correspondances papier SOA, dont Sopecal retrouve seulement par diagnostic manuel. Deux echecs automatiques conserves. Pas de garantie de papier, de toutes les communes ni de toutes les revisions. Aucun filtre source/date/reference cible injectee. Reference web SOE demontree sur deux liens du perimetre ; lecture anonyme CORS opt-in bornee, aucun Microlink. Domaine www exact seulement pour la date publique.",
      "evidence": [
        "SUD-OUEST-LANDES-2026-10-08.md",
        "REFERENCE-CONVERSION-SUD-OUEST-LANDES-LIBOURNE-2026-10-09.md"
      ],
      "reference": {
        "type": "url-sha1",
        "source_code": "SOE",
        "prefix": "sofr",
        "canonical_host": "www.sudouest.fr"
      },
      "public_date_metadata": {
        "host": "www.sudouest.fr",
        "time_zone": "Europe/Paris"
      },
      "title_fallback_without_reference": true
    },
    {
      "id": "sudouest-verdon-night",
      "provider": "europresse",
      "name": "Sud Ouest - Medoc (Le Verdon)",
      "catalog_resource_id": "europresse-sor-p",
      "hosts": [
        "sudouest.fr",
        "www.sudouest.fr"
      ],
      "path_prefix": "/gironde/le-verdon-sur-mer/",
      "path": "^/gironde/le-verdon-sur-mer/[a-z0-9-]+-[0-9]+\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "Date publique lue automatiquement si disponible ; sinon recherche textuelle.",
      "message": "Reference de la version web calculee depuis le lien et sa date publique. Secours textuel si la date est indisponible ; pas de garantie de version papier.",
      "limitations": "Articles lexicaux du Verdon-sur-Mer seulement. Trois vrais Link web observes ; une correspondance papier SOR inspectee par diagnostic manuel. Le second document papier reste non verifie (chargement bloque). Aucune garantie pour Arcachon, toute la Gironde ou le papier. Aucun filtre source/date/reference cible injectee. Reference web SOE demontree sur deux liens du perimetre ; lecture anonyme CORS opt-in bornee, aucun Microlink. Domaine www exact seulement pour la date publique.",
      "evidence": [
        "SUD-OUEST-MEDOC-2026-10-08.md",
        "REFERENCE-CONVERSION-SUD-OUEST-INTEGRATION-2026-10-09.md"
      ],
      "reference": {
        "type": "url-sha1",
        "source_code": "SOE",
        "prefix": "sofr",
        "canonical_host": "www.sudouest.fr"
      },
      "public_date_metadata": {
        "host": "www.sudouest.fr",
        "time_zone": "Europe/Paris"
      },
      "title_fallback_without_reference": true
    },
    {
      "id": "sudouest-bordeaux-night",
      "provider": "europresse",
      "name": "Sud Ouest - Bordeaux Agglo",
      "catalog_resource_id": "europresse-so-p",
      "hosts": [
        "sudouest.fr",
        "www.sudouest.fr"
      ],
      "path_prefix": "/gironde/bordeaux/",
      "path": "^/gironde/bordeaux/[a-z0-9-]+-[0-9]+\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "Date publique lue automatiquement si disponible ; sinon recherche textuelle.",
      "message": "Reference de la version web calculee depuis le lien et sa date publique. Secours textuel si la date est indisponible ; pas de garantie de version papier.",
      "limitations": "Articles lexicaux /gironde/bordeaux/ seulement. Deux vrais Link web observes et deux corps papier SO concordants ouverts par liens associes. Un article repris dans plusieurs editions, donc pas de publication exclusive. Titres et dates papier peuvent differer ; aucune garantie pour toutes les communes de l'agglomeration ou de la Gironde. Aucun filtre source/date/reference cible injectee. Reference web SOE demontree sur deux liens du perimetre ; lecture anonyme CORS opt-in bornee, aucun Microlink. Domaine www exact seulement pour la date publique.",
      "evidence": [
        "SUD-OUEST-BORDEAUX-2026-10-08.md",
        "REFERENCE-CONVERSION-SUD-OUEST-BORDEAUX-2026-10-09.md"
      ],
      "reference": {
        "type": "url-sha1",
        "source_code": "SOE",
        "prefix": "sofr",
        "canonical_host": "www.sudouest.fr"
      },
      "public_date_metadata": {
        "host": "www.sudouest.fr",
        "time_zone": "Europe/Paris"
      },
      "title_fallback_without_reference": true
    },
    {
      "id": "sudouest-libourne-night",
      "provider": "europresse",
      "name": "Sud Ouest - Libournais (Libourne)",
      "catalog_resource_id": "europresse-soi-p",
      "hosts": [
        "sudouest.fr",
        "www.sudouest.fr"
      ],
      "path_prefix": "/gironde/libourne/",
      "path": "^/gironde/libourne/[a-z0-9-]+-[0-9]+\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "Date publique lue automatiquement si disponible ; sinon recherche textuelle.",
      "message": "Reference de la version web calculee depuis le lien et sa date publique. Secours textuel si la date est indisponible ; pas de garantie de version papier.",
      "limitations": "Articles lexicaux /gironde/libourne/ seulement. Deux vrais Link web observes et deux corps papier SOI concordants, ouverts par lien associe ou diagnostic manuel TEXT. Pas de papier automatique, ni de garantie pour Blaye, toute la Gironde ou toutes les revisions. Aucun filtre source/date/reference cible injectee. Reference web SOE demontree sur deux liens du perimetre ; lecture anonyme CORS opt-in bornee, aucun Microlink. Domaine www exact seulement pour la date publique.",
      "evidence": [
        "SUD-OUEST-LIBOURNE-2026-10-08.md",
        "REFERENCE-CONVERSION-SUD-OUEST-LANDES-LIBOURNE-2026-10-09.md"
      ],
      "reference": {
        "type": "url-sha1",
        "source_code": "SOE",
        "prefix": "sofr",
        "canonical_host": "www.sudouest.fr"
      },
      "public_date_metadata": {
        "host": "www.sudouest.fr",
        "time_zone": "Europe/Paris"
      },
      "title_fallback_without_reference": true
    },
    {
      "id": "sudouest-langon-night",
      "provider": "europresse",
      "name": "Sud Ouest - Sud-Gironde (Langon)",
      "catalog_resource_id": "europresse-sos-p",
      "hosts": [
        "sudouest.fr",
        "www.sudouest.fr"
      ],
      "path_prefix": "/gironde/langon/",
      "path": "^/gironde/langon/[a-z0-9-]+-[0-9]+\\.php$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "Date publique lue automatiquement si disponible ; sinon recherche textuelle.",
      "message": "Reference de la version web calculee depuis le lien et sa date publique. Secours textuel si la date est indisponible ; pas de garantie de version papier.",
      "limitations": "Articles lexicaux /gironde/langon/ seulement. Deux vrais Link web observes, un corps papier SOS concordant ouvert par lien associe et un echec conserve. Le suivi papier du train est un autre article. Pas de garantie papier, ni pour Bazas ou tout le Sud-Gironde. Aucun filtre source/date/reference cible injectee. Reference web SOE demontree sur deux liens du perimetre ; lecture anonyme CORS opt-in bornee, aucun Microlink. Domaine www exact seulement pour la date publique.",
      "evidence": [
        "SUD-OUEST-SUD-GIRONDE-2026-10-08.md",
        "REFERENCE-CONVERSION-SUD-OUEST-SUD-GIRONDE-2026-10-09.md"
      ],
      "reference": {
        "type": "url-sha1",
        "source_code": "SOE",
        "prefix": "sofr",
        "canonical_host": "www.sudouest.fr"
      },
      "public_date_metadata": {
        "host": "www.sudouest.fr",
        "time_zone": "Europe/Paris"
      },
      "title_fallback_without_reference": true
    },
    {
      "id": "operations-legacy-shared-night",
      "provider": "europresse",
      "name": "Le Moniteur (site partage - articles historiques)",
      "catalog_resource_id": "europresse-moi-p",
      "hosts": [
        "www.lemoniteur.fr",
        "lemoniteur.fr"
      ],
      "path_prefix": "/article/",
      "path": "^/article/[a-z0-9]+-[a-z0-9-]+\\.[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Site partage : ces liens peuvent provenir d'Operations Immobilieres ou d'une autre publication du Moniteur. Verifiez le titre et la publication du document ouvert.",
      "limitations": "Deux vrais liens automatiques ouvrent les corps MOI171 de 1892 et 3441 mots. Format historique /article/slug.identifiant numerique seulement ; pas une attribution exclusive MOI ni une garantie pour tous les articles ou numeros. Aucun filtre source, date, reference cible, Microlink ou verdict humain injecte.",
      "evidence": [
        "OPERATIONS-ARCHIVE-SVD-REGULIER-2026-10-07.md"
      ]
    },
    {
      "id": "mirabel-shared-actualites-night",
      "provider": "europresse",
      "name": "Infos Mirabel / L'Eveil (actualites partagees)",
      "catalog_resource_id": "europresse-jaa-p",
      "hosts": [
        "leveil.com",
        "www.leveil.com"
      ],
      "path_prefix": "/actualites/",
      "path": "^/actualites/[a-z0-9]+-[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Site partage avec L'Eveil : verifiez le titre et la publication du document ouvert. La rubrique Actualites ne garantit pas une publication dans Infos Mirabel.",
      "limitations": "Deux vrais liens automatiques ouvrent les corps JAA du 19aout2026 (685 et 261 mots), concordants au public. Ponceaux5oct en erreur serveur meme apres actualisation. Pas de garantie pour tout le site ou toutes les editions. Route Culture existante preservee. Aucun filtre source/date/reference cible, Microlink ou verdict humain injecte.",
      "evidence": [
        "MIRABEL-ARCHIVES-TEMOIN-2026-10-07.md"
      ]
    },
    {
      "id": "recyclage-publi-night",
      "provider": "europresse",
      "name": "Recyclage Recuperation (publi-redactionnel)",
      "catalog_resource_id": "europresse-vch-p",
      "hosts": [
        "www.recyclage-recuperation.fr",
        "recyclage-recuperation.fr"
      ],
      "path_prefix": "/publi-redactionnel/",
      "path": "^/publi-redactionnel/[a-z0-9]+-[a-z0-9-]+/$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Rubrique commerciale uniquement : verifiez le titre et la publication. Le texte Europresse peut contenir des erreurs ou des paragraphes voisins.",
      "limitations": "Deux vrais liens URL seule ouvrent VCH1oct2025 : Bollegraaf422mots et SGM1015mots. Extraits publics concordants seulement, suite publique reservee. SGM mele ensuite du texte Revama/NGE : segmentation degradee, pas corps integralement concordant. Cyclevia reste en erreur apres actualisation. Autres rubriques et sites tiers exclus. Aucun Microlink, filtre date/source/reference cible ou verdict humain injecte.",
      "evidence": [
        "RECYCLAGE-PUBLI-URL-SEULE-2026-10-08.md"
      ]
    },
    {
      "id": "province-mons-quievrain-night",
      "provider": "europresse",
      "name": "La Province / Sudinfo (Mons et Quievrain)",
      "catalog_resource_id": "europresse-bpr-p",
      "hosts": [
        "sudinfo.be",
        "www.sudinfo.be"
      ],
      "path_prefix": "/",
      "path": "^/id[0-9]+/article/[0-9]{4}-[0-9]{2}-[0-9]{2}/[a-z0-9-]+$",
      "path_slug_terms": [
        "mons",
        "quievrain"
      ],
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "title_word_strategy": "concise",
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Portail Sudinfo partage, liens mentionnant Mons ou Quievrain uniquement. Verifiez le titre et la publication : la ville ne garantit pas une parution dans La Province.",
      "limitations": "Deux vrais Link URL seule concise ouvrent BPR362 et192mots, corps concordants aux comparaisons publiques conservees. Six mots standard echouent sur medailles. Trois mots peuvent aussi retrouver des voisins : pas unicite generale ni garantie papier, source ou date. Autres villes et La Capitale exclus. Aucun Microlink, titre/date/reference cible ou verdict humain injecte.",
      "evidence": [
        "PROVINCE-TRANSPORT-URL-SEULE-2026-10-08.md"
      ]
    },
    {
      "id": "tournai-sudinfo-night",
      "provider": "europresse",
      "name": "Nord Eclair Tournai / Sudinfo web",
      "catalog_resource_id": "europresse-bne-p",
      "hosts": [
        "sudinfo.be",
        "www.sudinfo.be"
      ],
      "path_prefix": "/",
      "path": "^/id[0-9]+/article/[0-9]{4}-[0-9]{2}-[0-9]{2}/[a-z0-9-]+$",
      "path_slug_terms": [
        "tournai"
      ],
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Liens Sudinfo mentionnant Tournai : recherche de la copie web. Verifiez le titre et la publication ; la version papier Nord Eclair n'est pas garantie.",
      "limitations": "Deux vrais liens automatiques URL seule ouvrent les corps Sudinfo web attendus (190 et 333 mots). Pas de garantie generale d'unicite ou de correspondance papier BNE. Comparaisons publiques conservees ; chapeau omis et Lire aussi ajoute dans la copie. Aucun titre, date, reference cible ou verdict humain injecte, aucun Microlink.",
      "evidence": [
        "TOURNAI-TRANSPORT-URL-SEULE-2026-10-08.md"
      ]
    },
    {
      "id": "meuse-liege-night",
      "provider": "europresse",
      "name": "La Meuse / Sudinfo (Liege)",
      "catalog_resource_id": "europresse-bme-p",
      "hosts": [
        "sudinfo.be",
        "www.sudinfo.be"
      ],
      "path_prefix": "/",
      "path": "^/id[0-9]+/article/[0-9]{4}-[0-9]{2}-[0-9]{2}/[a-z0-9-]+$",
      "path_slug_terms": [
        "liege",
        "liegeois"
      ],
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Liens Sudinfo mentionnant Liege ou Liegeois : resultat papier La Meuse ou copie web Sudinfo. Verifiez le titre et la publication ; la version papier n'est pas garantie.",
      "limitations": "Deux vrais Link URL seule ouvrent Concordia BSTW672web et Joy BME483papier p9. Extraits publics concordants, pas comparaison integrale du paywall. Concordia contient du code de mise en page et un Lire aussi voisin en fin de copie. Pas garantie generale d'unicite, de publication ou de disponibilite. Autres regions non qualifiees. Aucun titre/date/reference cible, Microlink ou verdict humain injecte.",
      "evidence": [
        "MEUSE-LIEGE-TRANSPORT-2026-10-08.md"
      ]
    },
    {
      "id": "gazette-charleroi-night",
      "provider": "europresse",
      "name": "La Nouvelle Gazette / Sudinfo (Charleroi)",
      "catalog_resource_id": "europresse-bng-p",
      "hosts": [
        "sudinfo.be",
        "www.sudinfo.be"
      ],
      "path_prefix": "/",
      "path": "^/id[0-9]+/article/[0-9]{4}-[0-9]{2}-[0-9]{2}/[a-z0-9-]+$",
      "path_slug_terms": [
        "charleroi"
      ],
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Liens Sudinfo mentionnant Charleroi : copie web Sudinfo possible. Verifiez le titre et la publication ; la version papier La Nouvelle Gazette n'est pas garantie.",
      "limitations": "Deux vrais Link URL seule ouvrent les copies BSTW190 et278mots. Second corps concordant avec le public, premier titre/chapeau concordants seulement. Aucun papier BNG verifie. Centre/Sambre Meuse et autres marqueurs non qualifies. Pas garantie generale d'unicite ou de disponibilite. Aucun titre/date/reference cible, Microlink ou verdict humain injecte.",
      "evidence": [
        "NOUVELLE-GAZETTE-TRANSPORT-2026-10-08.md"
      ]
    },
    {
      "id": "nicematin-single-category-night",
      "provider": "europresse",
      "name": "Nice-Matin",
      "hosts": [
        "www.nicematin.com"
      ],
      "path": "^/[a-z0-9-]+/[a-z0-9-]+-\\d{1,9}$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "reference",
        "reference-title",
        "date-alternatives"
      ],
      "date": {
        "type": "input",
        "groups": [
          1
        ]
      },
      "reference": {
        "type": "url-sha1",
        "source_code": "ABAX",
        "prefix": "nmfr"
      },
      "message": "Site commun Nice-Matin : recherche par mots du lien. Verifiez le titre et la version web ouverte.",
      "date_message": "Nice-Matin : renseignez la date de publication de l'article pour essayer l'accès direct.",
      "limitations": "Format lexical a une categorie uniquement. Le temoin Monaco ouvre ABAX avec URL originale exacte ; cela ne qualifie pas le fonds papier ASQ ni ASP. Aucun filtre de publication transporte. Sans date, recherche par titre deduit du lien.",
      "catalog_resource_id": "europresse-aso-p",
      "evidence": [
        "NICE-MATIN-FORMAT-COURT-2026-10-08.md"
      ],
      "title_fallback_without_reference": true,
      "path_prefix": "/"
    },
    {
      "id": "jde-occitanie-liseuse-night",
      "provider": "europresse",
      "name": "Le Journal des entreprises - Occitanie",
      "catalog_resource_id": "europresse-jfr-p",
      "hosts": [
        "www.lejournaldesentreprises.com"
      ],
      "path_prefix": "/liseuse/occitanie/",
      "path": "^/liseuse/occitanie/[a-z0-9-]+_[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "title_word_strategy": "balanced",
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Recherche du sujet de couverture Occitanie, pas de tous les articles du numero. Verifiez le titre, la publication et le numero : une autre edition du meme texte peut s'ouvrir.",
      "limitations": "Deux transports URL seule : Ecocert ouvre JFR461,1193mots ; Bio-UV ouvre JFR458,1311mots au lieu du460. Les 34 paragraphes des copies Bio-UV avril/juin sont identiques (25 non vides,7554 caracteres joints). AdVini echoue avec la meme recette, equation native zero. Toutes dates et tous journaux ; pas de filtre source ou numero deduit du suffixe. Concordance avec les sommaires publics, pas comparaison integrale avec les fichiers payants. Aucun Microlink, titre/date/reference cible injecte ni verdict humain.",
      "evidence": [
        "JDE-OCCITANIE-2026-10-08.md"
      ]
    },
    {
      "id": "jde-region-sud-liseuse-night",
      "provider": "europresse",
      "name": "Le Journal des entreprises - Region Sud",
      "catalog_resource_id": "europresse-jdt-p",
      "hosts": [
        "www.lejournaldesentreprises.com"
      ],
      "path_prefix": "/liseuse/region-sud/",
      "path": "^/liseuse/region-sud/[a-z0-9-]+_[0-9]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "title_word_strategy": "balanced",
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Recherche du sujet de couverture Region Sud, pas de tous les articles du numero. Verifiez le titre, la publication et le numero : une autre edition du meme texte peut s'ouvrir.",
      "limitations": "Deux vrais transports URL seule : Olyos JDT461/1467mots ; Kizeo JDT458/1094mots au lieu du460. Les 45 paragraphes des copies Kizeo avril/juin sont identiques (31 non vides,6464 caracteres joints). Toutes dates et tous journaux ; Briefs et versions courtes possibles, pas de filtre de numero invente. Concordance avec couvertures, pas comparaison integrale avec fichiers payants. Aucun Microlink, parametre de temoin ou verdict humain.",
      "evidence": [
        "JDE-REGION-SUD-2026-10-08.md"
      ]
    },
    {
      "id": "jde-breve-title-night",
      "provider": "europresse",
      "name": "Le Journal des Entreprises",
      "catalog_resource_id": "press-title-le-journal-des-entreprises",
      "hosts": [
        "www.lejournaldesentreprises.com"
      ],
      "path": "^/breve/[a-z0-9-]+$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Recherche par mots du titre ; verifiez le journal et la version ouverts.",
      "date_message": "",
      "limitations": "Format breve du site commun, sans ciblage de region ni de numero. Deux vrais transports URL seule ouvrent les textes concordants : Wolf dans JDL166mots et Diam dans JFQ179mots (publication publique Occitanie). Une edition voisine peut ouvrir le meme texte. Vivelys reste un negatif de la strategie standard; aucun enrichissement externe ou titre/date injecte.",
      "evidence": [
        "JDE-ARA-GRAND-EST-2026-10-08.md",
        "JDE-OCCITANIE-2026-10-08.md"
      ],
      "path_prefix": "/breve/"
    },
    {
      "id": "waterloo-record-lexical-uuid-night",
      "provider": "europresse",
      "name": "Waterloo Region Record",
      "catalog_resource_id": "europresse-trk-p",
      "hosts": [
        "www.therecord.com"
      ],
      "path_prefix": "/news/",
      "path": "^/news/[a-z0-9/-]+/article_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Recherche par mots du lien ; la version web du Record peut s'ouvrir plutot que le papier. Verifiez le titre et la version.",
      "limitations": "Deux transports URL seule ouvrent TRKW898 et TRKW1014. Meme sujet, diversite limitee ; titres/sujets concordants, pas comparaison integrale publique. Aucun filtre de date/source ni contrat UUID. UUID de la seconde reference different du lien. Edition papier TRK non garantie, article voisin ou republication possible. Aucun Microlink ni verdict humain.",
      "evidence": [
        "WATERLOO-URL-2026-10-08.md"
      ]
    },
    {
      "id": "hamilton-spectator-lexical-uuid-night",
      "provider": "europresse",
      "name": "The Hamilton Spectator",
      "catalog_resource_id": "europresse-ths-p",
      "hosts": [
        "www.thespec.com"
      ],
      "path_prefix": "/news/",
      "path": "^/news/[a-z0-9/-]+/article_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Recherche par mots du lien ; la version web du Hamilton Spectator peut s'ouvrir plutot que le papier. Verifiez le titre et la version.",
      "limitations": "Deux transports URL seule ouvrent THSW479 et THSW915, sujets distincts. Titre/lien original concordants, pas comparaison integrale publique. Edition papier THS non garantie. Toutes dates et tous journaux, pas de contrat UUID ni de filtre source invente. Premier autre lien recent sans succes ; article voisin ou republication possible. Aucun Microlink ni verdict humain.",
      "evidence": [
        "HAMILTON-UUID-2026-10-08.md"
      ]
    },
    {
      "id": "standard-news-lexical-uuid-night",
      "provider": "europresse",
      "name": "The Standard",
      "catalog_resource_id": "europresse-tsc-p",
      "hosts": [
        "www.stcatharinesstandard.ca"
      ],
      "path_prefix": "/news/",
      "path": "^/news/[a-z0-9/-]+/article_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Recherche par mots du lien. Une republication web dans Niagara Falls Review, The Standard ou Welland Tribune peut s'ouvrir. Verifiez le titre et la version ; papier non garanti.",
      "limitations": "Deux recherches URL seule ouvrent TNIW893 et TWEW1437. Les trois versions web ont ete ouvertes explicitement et leur corps compare : identique sur chaque article. Ce ne sont pas six transports automatiques ni une garantie de la publication demandee. Liens lexicaux news seulement ; pas contrat UUID, filtre de source/date ou Microlink. Aucun verdict humain.",
      "evidence": [
        "NIAGARA-NETWORK-2026-10-08.md"
      ]
    },
    {
      "id": "niagara-news-lexical-uuid-night",
      "provider": "europresse",
      "name": "Niagara Falls Review",
      "catalog_resource_id": "europresse-tni-p",
      "hosts": [
        "www.niagarafallsreview.ca"
      ],
      "path_prefix": "/news/",
      "path": "^/news/[a-z0-9/-]+/article_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Recherche par mots du lien. Une republication web dans Niagara Falls Review, The Standard ou Welland Tribune peut s'ouvrir. Verifiez le titre et la version ; papier non garanti.",
      "limitations": "Deux recherches URL seule ouvrent TNIW893 et TWEW1437. Les trois versions web ont ete ouvertes explicitement et leur corps compare : identique sur chaque article. Ce ne sont pas six transports automatiques ni une garantie de la publication demandee. Liens lexicaux news seulement ; pas contrat UUID, filtre de source/date ou Microlink. Aucun verdict humain.",
      "evidence": [
        "NIAGARA-NETWORK-2026-10-08.md"
      ]
    },
    {
      "id": "welland-news-lexical-uuid-night",
      "provider": "europresse",
      "name": "Welland Tribune",
      "catalog_resource_id": "europresse-twe-p",
      "hosts": [
        "www.wellandtribune.ca"
      ],
      "path_prefix": "/news/",
      "path": "^/news/[a-z0-9/-]+/article_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.html$",
      "enabled": true,
      "status": "experimental",
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "date_message": "",
      "message": "Recherche par mots du lien. Une republication web dans Niagara Falls Review, The Standard ou Welland Tribune peut s'ouvrir. Verifiez le titre et la version ; papier non garanti.",
      "limitations": "Deux recherches URL seule ouvrent TNIW893 et TWEW1437. Les trois versions web ont ete ouvertes explicitement et leur corps compare : identique sur chaque article. Ce ne sont pas six transports automatiques ni une garantie de la publication demandee. Liens lexicaux news seulement ; pas contrat UUID, filtre de source/date ou Microlink. Aucun verdict humain.",
      "evidence": [
        "NIAGARA-NETWORK-2026-10-08.md"
      ]
    }
  ]
};
