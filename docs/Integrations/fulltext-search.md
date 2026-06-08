---
title: Full-text search
description: Toelichting bij het _search-endpoint van de OpenWoo publication-API — query-syntax, gewogen velden, relevantie-score, en concrete integratievoorbeelden.
sidebar_position: 4
---

# Full-text search

Toelichting bij het full-text search-endpoint dat de openbare publicatiepagina's voedt (typisch de [`woo-website-template-apiv2`](https://codeberg.org/Conduction/woo-website-template-apiv2) en eigen front-ends): query-syntax, gewogen velden, relevantie-score en concrete integratievoorbeelden.

:::tip Eerst lezen
[API-koppelvlak](api-koppelvlak.md) — de algemene introductie tot de OpenWoo-API, authenticatie en throttling. De voorbeelden hieronder bouwen daarop voort.
:::

## Endpoint

```
GET https://canary.accept.commonground.nu/apps/openregister/api/objects/woo/{categorie}?_search=<query>
```

- `_search` is parameterloos full-text — geen veld-specificatie nodig.
- Vervang `{categorie}` door een van de 17 TOOI-informatiecategorieën (zie [API-koppelvlak](api-koppelvlak.md) voor de volledige lijst). De categorie zit in het pad, niet als query-filter.
- Combineerbaar met directe filter-parameters per veld (`titel=…`, `publicatiedatum=…`, `thema=…`).

:::warning Verificatie tegen live canary (juni 2026)
Onderstaande pagina beschrijft de full-text-search-features zoals die in de 1.0-aggregator (`api.gateway.commonground.nu`) werkten. Tegen canary getest:

- **Werkt:** `_search`, `_limit`, `_page`, `_extend`, `_unset`, `_order[<veld>]=desc` (op indexed scalar fields zoals `publicatiedatum`), `_facets[<veld>]=true` (vervangt legacy aggregations).
- **Wordt stil genegeerd:** `_filter=field1,field2` retourneert alsnog alle velden.
- **Werkt niet:** `publicatiedatum[after]`/`[before]` en `YYYY..YYYY`-range — retourneert 0 results; gebruik exact-match.
- **Niet bevestigd:** query-time boosting (`term^3`), fuzzy (`term~`), wildcards (`term*`), `_order[_score]=desc`-sortering, Lucene-style scoring in `_score`-veld. Staan niet in de OAS; voor productie eerst tegen canary testen.
:::

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
GET https://canary.accept.commonground.nu/apps/openregister/api/objects/woo/convenanten
    ?_search=evenementenvergunning
    &_order[publicatiedatum]=desc
    &_limit=10
    &_page=1
```

> Categorie zit in het pad (`/objects/woo/convenanten`), niet als query-filter. `_order[publicatiedatum]=desc` is op canary bevestigd. Sortering op relevantie (`_order[_score]=desc`) is in de OAS niet gedocumenteerd — verifieer voor productie.

### Geavanceerde zoekbalk met datumfilter

```http
GET https://canary.accept.commonground.nu/apps/openregister/api/objects/woo/convenanten
    ?_search=evenementenvergunning
    &publicatiedatum=2023-09-12
    &_limit=20
```

> **Let op:** `publicatiedatum=…` matcht exact op canary. Range-syntax `publicatiedatum[after]=YYYY-MM-DD` / `publicatiedatum[before]=…` en `publicatiedatum=YYYY..YYYY` retourneren in juni 2026 0 results op canary — gebruik exact-match of filter client-side tot range-filters bevestigd zijn.

### Type-ahead / suggesties

Voor real-time suggesties tijdens typen kun je een lichte variant gebruiken met `_limit=5` en `_unset` om grote velden weg te laten uit de response:

```http
GET https://canary.accept.commonground.nu/apps/openregister/api/objects/woo/convenanten
    ?_search=evenem
    &_limit=5
    &_unset=attachments,beschrijving,bevindingen,conclusies
```

> **Let op:** `_filter=titel,publicatiedatum` (whitelist-syntax) wordt op canary stil genegeerd — response bevat alsnog alle velden. Tot dat opgelost is, gebruik `_unset` (blacklist) om de payload te verkleinen. Wildcard-syntax (`evenem*`) is in de 1.0-aggregator beschreven; voor 2.0 niet gedocumenteerd en niet bevestigd op canary.

### Combinatie met aggregations voor filter-facets

Voor een facetzoekinterface (categorie- en datumfilter-checkboxes naast de resultatenlijst) is op canary het `_facets`-mechanisme aanwezig:

```http
GET https://canary.accept.commonground.nu/apps/openregister/api/objects/woo/convenanten
    ?_search=evenementenvergunning
    &_facets[categorie]=true
    &_facets[publicatiedatum]=true
    &_limit=10
```

Response bevat een `facets`-blok met buckets + counts per veld, geschikt om filter-checkboxes met counts te tonen:

```json
{
  "facets": {
    "categorie": {
      "name": "categorie",
      "type": "terms",
      "data": {
        "type": "terms",
        "total_count": 1,
        "buckets": [
          { "value": "Convenanten", "count": 4, "label": "Convenanten" }
        ]
      }
    }
  },
  "results": [ ... ],
  "total": 4
}
```

> **Legacy 1.0-equivalent.** De oude aggregator gebruikte `_queries[]=categorie` met `Accept: application/json+aggregations`:
>
> ```http
> GET https://api.gateway.commonground.nu/api/publicaties
>     ?_search=evenementenvergunning
>     &_queries[]=categorie
>     &_queries[]=oin
> Accept: application/json+aggregations
> ```
>
> Op canary wordt deze syntax stil genegeerd — gebruik `_facets[<veld>]=true` voor 2.0-deployments.

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

De volledige API-specificatie inclusief request- en response-schemas leeft onder [/api](/api/). De spec wordt automatisch gegenereerd door OpenRegister (per register een complete OpenAPI 3.1.0 spec) en nachtelijk gemirrord vanuit een referentie-deployment — zie [API-overzicht](../api.md) voor de sync-details.

## Referentie-implementaties

- [`woo-website-template-apiv2`](https://codeberg.org/Conduction/woo-website-template-apiv2) — de publieke WOO publicatiepagina voor de 2.0-stack (Nextcloud + OpenRegister); gebruikt dit endpoint met faceted-search UI. De voormalige `woo-website-template` (1.0, Gateway-backend) wordt op termijn samengevoegd terug onder die naam.
- [`api-koppelvlak`](api-koppelvlak.md) — generiek koppelvlak-overzicht inclusief metadata-schema's.
