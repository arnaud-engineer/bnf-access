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
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-oh-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
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
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-aso-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
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
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-lmv-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
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
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
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
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-il-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
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
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-cha-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
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
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-dor-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
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
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-amc-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
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
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "press-title-sud-ouest",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
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
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-ta-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
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
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-ex-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
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
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
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
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-ako-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
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
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-giu-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
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
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-gil-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
    },
    {
      "id": "lepoint-fr",
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
      "limitations": "Correspondance expérimentale ; disponibilité et identité de l'article à vérifier.",
      "catalog_resource_id": "europresse-po-p",
      "evidence": [
        "V15: essais consignés dans l'atelier Europresse"
      ]
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
      "limitations": "Le témoin payant n'a pas été retrouvé. Un décalage de versement ou une différence web/papier reste possible.",
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
      "limitations": "Le titre visible peut être très différent du lien. Saisissez les mots du titre public.",
      "catalog_resource_id": "europresse-lfb-p",
      "evidence": [
        "RECOMMANDES-V2-2026-10-02.md : qualification du routage et limites du fonds",
        "https://madame.lefigaro.fr/business/si-les-femmes-n-ont-plus-d-ambition-c-est-avant-tout-parce-que-ce-mot-est-devenu-obsolete-20260206"
      ],
      "requires_title_input": true
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
        "https://www.maison-travaux.fr/sinspirer/avantapres/avant-apres-maison-des-annees-30-se-metamorphose-633234.html"
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
        "https://www.tdg.ch/enfants-trois-sujets-de-dispute-a-eviter-devant-eux-892506103317"
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
        "https://www.nouvelobs.com/teleobs/20260922.OBS118479/joel-le-scouarnec-l-impunite-d-un-pedocriminel.html"
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
      ]
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
        "E167-arbitrages-partiels.md"
      ]
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
      "requires_title_input": true,
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Le titre archivé diffère du lien et apparaît après plusieurs voisins. Saisissez des mots distinctifs ; origine exacte et intégralité non confirmées.",
      "catalog_resource_id": "europresse-bvi-p",
      "evidence": [
        "E087-vif-weekend-focus.md",
        "https://focus.levif.be/livres/inspiree-par-maigret-philippe-jaenada-offre-une-nouvelle-investigation-litteraire/",
        "E168-autres-titres.md"
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
      "methods": [
        "title-only"
      ],
      "date": {
        "type": "input",
        "groups": []
      },
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Deux mots ouvrent des voisins ; trois mots distinctifs retrouvent le lien d'origine exact. Vérifiez la publication.",
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
        "E168-autres-titres.md"
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
      "message": "Essai par mots du titre ; vérifiez la publication et la version.",
      "date_message": "",
      "limitations": "Sujet retrouvé dans Le Messager web et papier, pas une preuve d'édition Essor distincte. Vérifiez le titre et la publication.",
      "catalog_resource_id": "europresse-vnj-p",
      "evidence": [
        "E096-essor-savoyard.md",
        "https://lessorsavoyard.lemessager.fr/649358399/article/2026-10-01/jo-2030-high-five-grand-bornand-la-nouvelle-vie-sportive-de-la-skieuse-tessa",
        "E168-autres-titres.md"
      ]
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
    }
  ]
};
