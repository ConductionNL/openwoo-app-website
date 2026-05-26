---
title: Full-text search
description: Toelichting bij het _search-endpoint van de OpenWoo publication-API — query-syntax, gewogen velden, relevantie-score, en concrete integratievoorbeelden.
sidebar_position: 4
---

# Full-text search

Toelichting bij het full-text search-endpoint dat de openbare publicatiepagina's voedt (typisch de [`woo-website-template`](https://github.com/ConductionNL/woo-website-template) en eigen front-ends): query-syntax, gewogen velden, relevantie-score en concrete integratievoorbeelden.

:::tip Eerst lezen
[API-koppelvlak](api-koppelvlak.md) — de algemene introductie tot de OpenWoo-API, authenticatie en throttling. De voorbeelden hieronder bouwen daarop voort.
:::

## Endpoint

```
GET https://api.gateway.commonground.nu/api/publicaties?_search=<query>
```

- `_search` is parameterloos full-text — geen veld-specificatie nodig.
- Combineerbaar met alle andere filters (`oin=…`, `categorie=…`, `publicatiedatum[after]=…`).
- Default-sort is `_order[publicatiedatum]=desc` (nieuwste eerst). Sorteren op **relevantie** doe je expliciet met `_order[_score]=desc` (zie [Relevantie-score](#relevantie-score) hieronder).

## Geïndexeerde velden

Het `_search`-endpoint zoekt over de volgende velden van een Woo-publicatie, in afnemende volgorde van weging:

| Veld                                 | Gewicht | Waarom dit gewicht                                                                            |
|--------------------------------------|---------|------------------------------------------------------------------------------------------------|
| `titel`                              | 5×      | Titels zijn doelbewust kort en informatief — een match in de titel is bijna altijd relevant. |
| `tooiCategorieNaam`                  | 3×      | Categorie geeft thematische match (bv. "Convenant" of "Woo verzoek").                         |
| `beschrijving` / `samenvatting`      | 2×      | Korte prose, hoog signaal-tot-ruis.                                                            |
| `bevindingen` / `conclusies`         | 1.5×    | Iets langere prose, lager dichtheid per term.                                                 |
| `_attachments.body` (PDF-extracts)   | 1×      | Volledige tekst van bijlagen — hoog volume, lager signaal per match.                          |
| `organisatieonderdeel`, `functienaam`| 0.5×    | Naam-velden, alleen zinvol bij gerichte zoekopdracht.                                          |

> Bijlage-extracten worden enkel doorzocht als de PDF tekst-extractable is. Gescande PDFs zonder OCR-laag vallen buiten het index. Zie [Gotchas](#gotchas).

## Query-syntax

`_search` accepteert een uitgebreide query-string. Alles is **case-insensitive** en diacritics worden geneutraliseerd (`café` matcht `cafe`).

### Termen

```
_search=verzoek                   # enkel woord
_search=verzoek+vergunning        # AND (impliciet) — beide moeten voorkomen
_search="evenement vergunning"    # exacte frase (woordvolgorde + nabijheid)
```

### Booleaanse operatoren

```
_search=verzoek OR klacht         # OR  — minstens één
_search=verzoek NOT klacht        # NOT — uitsluiten
_search=(verzoek OR klacht) AND vergunning
```

`AND`, `OR`, `NOT` MOETEN in hoofdletters om als operator herkend te worden. Lowercase `and` wordt als term behandeld.

### Wildcards en fuzzy

```
_search=evenem*                   # wildcard — match alle termen die met "evenem" beginnen
_search=evenement~                # fuzzy — Levenshtein-edit-distance ≤2 (standaard)
_search=evenement~1               # fuzzy met expliciete edit-distance
```

### Boosting in de query

```
_search=verzoek^3 vergunning      # geef "verzoek" 3× extra gewicht binnen deze query
```

Dit is bovenop het standaard veld-gewicht uit de tabel hierboven.

## Relevantie-score

Default-sortering is **chronologisch** (`publicatiedatum desc`), niet op relevantie. Dat is een bewuste keuze: voor de meeste burger-vragen ("wat is recent gepubliceerd over X") is nieuwste-eerst de juiste volgorde.

Voor een "best match first" interface sorteer je expliciet op relevantie:

```
GET /api/publicaties?_search=evenementenvergunning&_order[_score]=desc&_limit=10
```

De `_score`-waarde is een Lucene-style TF-IDF-score genormaliseerd op 0–100, beschikbaar als veld in de response per record:

```json
{
  "results": [
    {
      "_id": "...",
      "_score": 87.3,
      "titel": "Evenementenvergunning verzoek",
      "...": "..."
    }
  ]
}
```

Combineer relevantie met chronologie via `_order[_score]=desc&_order[publicatiedatum]=desc` — secundair sorteert op datum bij gelijke score.

## Concrete integratievoorbeelden

### Eenvoudige zoekbalk met paginatie

```http
GET https://api.gateway.commonground.nu/api/publicaties
    ?_search=evenementenvergunning
    &_order[_score]=desc
    &_limit=10
    &_page=1
```

### Geavanceerde zoekbalk met categorie- en datumfilter

```http
GET https://api.gateway.commonground.nu/api/publicaties
    ?_search=evenementenvergunning
    &categorie=Convenant
    &publicatiedatum[after]=2023-01-01T00:00:00Z
    &publicatiedatum[before]=2024-01-01T00:00:00Z
    &_order[_score]=desc
    &_limit=20
```

### Type-ahead / suggesties

Voor real-time suggesties tijdens typen kun je een lichte variant gebruiken met wildcards en `_limit=5`:

```http
GET https://api.gateway.commonground.nu/api/publicaties
    ?_search=evenem*
    &_order[_score]=desc
    &_limit=5
    &_fields=titel,categorie,publicatiedatum
```

`_fields` reduceert de response-grootte — vraag alleen wat je in de suggestion-dropdown toont.

### Combinatie met aggregations voor filter-facets

Voor een facetzoekinterface (categorie- en datumfilter-checkboxes naast de resultatenlijst) gebruik het `application/json+aggregations`-content-type:

```http
GET https://api.gateway.commonground.nu/api/publicaties
    ?_search=evenementenvergunning
    &_queries[]=categorie
    &_queries[]=oin
Accept: application/json+aggregations
```

Response geeft per veld de count per waarde — geschikt om filter-checkboxes met counts te tonen.

## Gotchas

| Symptoom                                              | Oorzaak / oplossing                                                                                                                                                                                                |
|-------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Search op acroniem (`WOZ`) geeft géén hits            | Stopword-lijst is Nederlands; afkortingen worden niet apart geïndexeerd. Wrap in aanhalingstekens (`_search="WOZ"`) of zoek op de uitgeschreven vorm.                                                              |
| PDF-bijlage met match komt niet terug                 | PDF zonder OCR-laag is niet indexeerbaar. De producent moet de PDF her-publiceren met tekstlaag — anders is alleen de metadata doorzoekbaar.                                                                       |
| Resultaten lijken willekeurig in tweede paginering    | Default-sort is `publicatiedatum`, niet score. Bij gelijke datum (bv. veel publicaties op één dag) is de volgorde niet gegarandeerd. Voeg een tiebreaker toe: `&_order[publicatiedatum]=desc&_order[titel]=asc`. |
| Hoofdlettergevoelig OR matcht niet                    | `OR` moet in hoofdletters. `or` is een term.                                                                                                                                                                       |
| Snel meervoud-toggling (`verzoek` ≠ `verzoeken`)      | De index doet stemming, maar incidenteel. Voor harde garantie: gebruik wildcards (`verzoek*`).                                                                                                                     |
| Zoekvraag met Unicode-quotes uit Office faalt         | "Smart quotes" (`“` / `”`) worden niet herkend als phrase-delimiter. Strip ze client-side naar `"`.                                                                                                                |

## Rate-limiting

Zonder authenticatie geldt: 60 requests per minuut per IP, 1000 per uur. Hits boven die drempel krijgen `429 Too Many Requests` met een `Retry-After`-header.

Voor productie-front-ends raden we aan een Conduction-API-key aan te vragen (`info@conduction.nl`) — die heft de rate-limit op én ontgrendelt `POST`/`PUT`/`DELETE` voor namens-een-organisatie-publishing.

## OpenAPI

De volledige API-specificatie inclusief request- en response-schemas leeft onder [/api](/api/). Phase-2 van de docs-pipeline (zie [hydra#279](https://github.com/ConductionNL/hydra/issues/279)) genereert die automatisch uit geannoteerde OpenCatalogi-controllers.

## Referentie-implementaties

- [`woo-website-template`](https://github.com/ConductionNL/woo-website-template) — de publieke WOO publicatiepagina; gebruikt dit endpoint met faceted-search UI.
- [`api-koppelvlak`](api-koppelvlak.md) — generiek koppelvlak-overzicht inclusief metadata-schema's.
