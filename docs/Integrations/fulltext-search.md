---
title: Full-text search
description: Hoe het `_search`-endpoint werkt in de huidige stack — substring-matching via OpenRegister, optionele typo-tolerante fuzzy mode, en wat (nog) niet ondersteund wordt vanuit een Lucene/Elastic-perspectief.
sidebar_position: 4
---

# Full-text search

Hoe het `_search`-endpoint van de publicatie-API in de huidige stack werkt: welke query-vormen ondersteund zijn, hoe matching gebeurt, en wat (nog) **niet** werkt zoals lezers van klassieke Lucene-documentatie misschien zouden verwachten.

:::tip Eerst lezen
[API-koppelvlak](api-koppelvlak.md) — de algemene introductie tot de OpenWoo-API, de twee API-lagen (primaire OpenCatalogi-publicaties en secundaire OpenRegister-direct), authenticatie en datum-driven zichtbaarheid.
:::

:::caution Belangrijk om vooraf te weten — geen Lucene
De huidige OpenRegister-implementatie van `_search` is **een SQL `ILIKE`-substring-match** over alle string-velden van het schema (plus `_name`, `_description`, `_summary` uit de metadata). Geen tokenisatie, geen field-weighting, geen relevantie-score, geen booleaanse operatoren, geen wildcards, geen fuzzy-tilde, geen boosting.

Eerdere versies van deze pagina beschreven Lucene-achtige features (`AND`/`OR`, `term^3`, `term*`, `term~`, `_score`, gewogen velden). Die hoorden bij de oude 1.0-aggregator (`api.gateway.commonground.nu`) en zijn **niet** aanwezig in de 2.0-stack (OpenCatalogi + OpenRegister). Een tussentijds geplande OpenCatalogi-laag die deze features toevoegt staat op de roadmap — zie [Roadmap](#roadmap) onderaan.
:::

## Endpoint

Twee opties, afhankelijk van of je catalogus-context wilt of niet:

**Primaire laag — `/apps/opencatalogi/api/publications`** (aanbevolen):

```
GET https://canary.accept.commonground.nu/apps/opencatalogi/api/publications?_search=<query>
```

Catalogus-slug `publications` voor de WOO-catalogus. Retourneert publicaties uit álle registers/schema's die aan die catalogus gekoppeld zijn, inclusief `@catalog`-context. Anonieme RBAC-filtering wordt toegepast (zie [Publicatie-statussen](api-koppelvlak.md#publicatie-statussen)).

**Secundaire laag — `/apps/openregister/api/objects/{register}/{schema}`**:

```
GET https://canary.accept.commonground.nu/apps/openregister/api/objects/{register}/{schema}?_search=<query>
```

Voor register/schema-specifieke calls buiten een catalogus om. `{register}` en `{schema}` mogen id of slug zijn.

Beide endpoints delegeren `_search` naar dezelfde [`MagicSearchHandler`](https://codeberg.org/Conduction/openregister/src/branch/main/lib/Db/MagicMapper/MagicSearchHandler.php) in OpenRegister, dus de matching-semantiek is gelijk.

## Hoe matching werkt

Voor elke ingegeven `_search=<term>` bouwt OpenRegister een SQL-WHERE-clausule die over de volgende kolommen een `ILIKE '%<term>%'` doet (PostgreSQL — case-insensitive substring match):

- Alle properties van het schema die `type: string` hebben (bv. `titel`, `samenvatting`, `beschrijving`, `thema`, …)
- De metadata-tekstvelden `_name`, `_description`, `_summary`

Op MySQL wordt dit `LOWER(CAST(column AS CHAR)) LIKE LOWER('%<term>%')` — functioneel hetzelfde.

Een rij telt als hit zodra **één** van deze kolommen de substring bevat. Er is geen ranking, geen veld-weging, geen scoring. De default-sortering is wat je opgeeft via `_order[<veld>]=desc`, anders inkomstvolgorde van OpenRegister.

### Wat dit betekent voor query-vorm

| Wat je intypt | Wat er gebeurt |
|---|---|
| `_search=verzoek` | ILIKE `%verzoek%` op alle string-velden — matcht "verzoek", "verzoeken", "Woo-verzoek" |
| `_search=verzoek vergunning` | ILIKE `%verzoek vergunning%` — letterlijke substring, **niet** "beide woorden" |
| `_search=verzoek+vergunning` | ILIKE `%verzoek+vergunning%` — `+` is gewone tekst |
| `_search="evenement vergunning"` | ILIKE `%"evenement vergunning"%` — de quotes zijn onderdeel van de match |
| `_search=verzoek OR klacht` | ILIKE `%verzoek OR klacht%` — `OR` is hier gewone tekst, geen operator |
| `_search=evenem*` | ILIKE `%evenem*%` — `*` is gewone tekst (en niet nodig: zonder `*` matcht al "evenement", "evenementen", "evenementenvergunning") |
| `_search=evenement~` | ILIKE `%evenement~%` — `~` is gewone tekst, geen fuzzy operator |
| `_search=verzoek^3` | ILIKE `%verzoek^3%` — `^3` is gewone tekst, geen boost |

**Praktische gevolgen voor consumenten:**
- Geef gebruikers de keuze om hun zoekterm te splitsen in losse calls als ze "beide woorden" willen — server-side ondersteunt dit niet.
- Voor "lijkt op"-zoeken (typo-tolerantie), zie [Fuzzy search](#fuzzy-search-pg_trgm) hieronder.
- Voor categorie-/datum-/veld-filtering: gebruik echte query-parameters (`@self[schema]=<id>`, `publicatiedatum[gte]=…`, etc.) náást `_search`. Zie [API-koppelvlak — Bevragen](api-koppelvlak.md#bevragen).

### Eigenschappen die wél kloppen

- **Case-insensitive** — `_search=verzoek` matcht `Verzoek`, `VERZOEK`.
- **Substring-match** — `_search=enem` matcht `evenement`, `bedrijvenemissies`. Stam-tolerant zonder expliciete stemming.
- **Diacritics** — afhankelijk van de DB-collation. PostgreSQL-defaults (`UTF8 + en_US`) doen géén automatische diacritics-normalisatie; `café` matcht niet `cafe`. Test op je eigen deployment.
- **Combinatie met filters** — `?_search=verzoek&publicatiedatum[gte]=2026-01-01&_limit=20&_order[publicatiedatum]=desc` werkt zoals verwacht (search AND filter AND sort AND paginate).

## Fuzzy search (pg_trgm)

OpenRegister biedt **één** typo-tolerantie-mechanisme: een aparte `?_fuzzy=true` query-parameter die — alleen op PostgreSQL deployments met de `pg_trgm`-extensie ingeschakeld — trigram-similariteit toevoegt op het metadata-veld `_name`.

```
GET /apps/opencatalogi/api/publications?_search=evenement&_fuzzy=true
```

Eigenschappen:

- Werkt alléén op PostgreSQL met `CREATE EXTENSION pg_trgm` enabled (de code probeert dit te detecteren; valt anders stil terug op de ILIKE-only mode).
- Voegt een `similarity(_name, '<query>') > 0.1`-conditie OR'd met de ILIKE-condities — een rij telt als hit als óf de ILIKE matcht óf de naam fuzzy lijkt.
- Voegt een berekende kolom `@self.relevance` toe aan elke result-rij — een geheel getal 0–100 dat de trigram-similariteit van `_name` met de query weergeeft.
- ⚠️ **Alleen op `_name`** — andere velden zijn geen fuzzy-doel. Een typo in `titel` of `beschrijving` profiteert niet van deze mode.

Voorbeeld-response (verkort):

```json
{
  "results": [
    {
      "id": "f6551cb8-…",
      "titel": "Evenementenvergunning verzoek",
      "@self": { "id": "…", "schema": 10, "relevance": 87, "...": "..." }
    }
  ]
}
```

> **Let op — niet `_score`, niet `_order[_score]`.** Het veld heet `@self.relevance` (niet `_score`). Sorteren op fuzzy-similariteit doe je via `_order[@self.relevance]=desc`. De combinatie wordt ondersteund maar is alleen zinvol als `_fuzzy=true` is meegegeven; zonder die parameter is `@self.relevance` afwezig.

## Solr-/Elasticsearch-backend

OpenRegister kent een tweede zoek-pad: wanneer een Solr- of Elasticsearch-backend in de deployment is geconfigureerd, routeert `searchObjects` automatisch naar dat backend in plaats van naar de ILIKE-handler. Zie [`openregister/lib/Service/Index/Backends/`](https://codeberg.org/Conduction/openregister/src/branch/main/lib/Service/Index/Backends/) — `SolrBackend.php` en `ElasticsearchBackend.php`.

Zodra Solr/Elasticsearch actief is, **kunnen** Lucene-style features (boolean operatoren, phrase-queries, wildcards, fuzzy tildes, boosting, scoring, sort op `_score`) wél werken — die backends ondersteunen Lucene query-syntax natively. Dit is echter:

- **Niet de default-configuratie** — canary en de meeste OpenWoo-deployments draaien zonder.
- **Niet expliciet getest binnen OpenWoo** vanuit deze docs — verifieer per deployment voordat je productie-code op deze features baseert.
- **Geen onderdeel van de actuele OpenWoo-API-contract** — als de Solr-features in de toekomst breed worden uitgerold, kondigen we dat aan via een release-note + update van deze pagina.

Heb je een use-case die structureel Lucene-niveau zoekfunctionaliteit nodig heeft? Mail [info@conduction.nl](mailto:info@conduction.nl) zodat we kunnen prioriteren.

## Concrete integratievoorbeelden

### Eenvoudige zoekbalk met paginatie

```http
GET https://canary.accept.commonground.nu/apps/opencatalogi/api/publications
    ?_search=evenementenvergunning
    &_order[publicatiedatum]=desc
    &_limit=10
    &_page=1
```

Substring-match op alle string-velden + metadata. Resultaten gesorteerd op publicatiedatum aflopend.

### Zoekbalk met datumfilter

```http
GET https://canary.accept.commonground.nu/apps/opencatalogi/api/publications
    ?_search=evenementenvergunning
    &publicatiedatum[gte]=2026-01-01
    &publicatiedatum[lte]=2026-12-31
    &_limit=20
```

Substring-match + datum-range (bracket-operator-syntax `[gte]`/`[lte]` werkt op de publicaties-API).

### Zoeken binnen één informatiecategorie

```http
GET https://canary.accept.commonground.nu/apps/opencatalogi/api/publications
    ?_search=convenant
    &@self[schema]=<schema-id>
    &_limit=10
```

`@self[schema]` filtert op één schema. Het schema-id is omgevings-specifiek — vraag op via een facet-call (`?_facetable=true&_facets[@self][schema][type]=terms`) op je eigen omgeving.

### Type-ahead / suggesties met lichte payload

```http
GET https://canary.accept.commonground.nu/apps/opencatalogi/api/publications
    ?_search=evenem
    &_limit=5
    &_unset=attachments,beschrijving,bevindingen,conclusies
```

`_unset` laat de opgesomde velden weg uit elke result-rij — handig om response-grootte klein te houden voor real-time suggesties. (`_filter` wordt op canary stil genegeerd; gebruik `_unset` als blacklist.)

### Typo-tolerant zoeken (PostgreSQL + pg_trgm)

```http
GET https://canary.accept.commonground.nu/apps/opencatalogi/api/publications
    ?_search=evenemnt
    &_fuzzy=true
    &_order[@self.relevance]=desc
    &_limit=10
```

Vraagt fuzzy mode aan. Resultaten gesorteerd op trigram-similariteit van `_name` aflopend.

### Faceted-search UI

```http
GET https://canary.accept.commonground.nu/apps/opencatalogi/api/publications
    ?_search=evenementenvergunning
    &_facetable=true
    &_facets[@self][schema][type]=terms
    &_facets[publicatiedatum][type]=date_histogram
    &_facets[publicatiedatum][interval]=year
    &_limit=10
```

Response bevat een `facets`-blok met buckets per veld, geschikt om filter-checkboxes met counts te tonen. De `woo-website-template-apiv2` gebruikt dit patroon.

## Gotchas

| Symptoom | Oorzaak / oplossing |
|---|---|
| `_search=verzoek vergunning` geeft minder hits dan verwacht | Wordt als één substring behandeld, niet als twee termen. Geef twee aparte calls af of laat de UI de termen los aanbieden. |
| `_search=WOZ` matcht ook losse 'w', 'o', 'z' | Substring match is letterlijk; korte termen produceren veel false positives. Tip: laat zoekvelden minimaal 3 karakters eisen. |
| PDF-bijlage met match komt niet terug | Bijlage-inhoud (`_attachments.body`) wordt **niet** door `_search` mee-doorzocht in de ILIKE-mode; alleen schema-properties en metadata. Voor PDF-text-search is een Solr/Elasticsearch-backend vereist. |
| `_search=café` matcht niet `cafe` | DB-collation-afhankelijk; PostgreSQL-defaults doen geen diacritics-normalisatie. Strip diacritics client-side bij de query én bij display als je dit consistent wilt. |
| Snel meervoud-toggling (`verzoek` ≠ `verzoeken`) | Geen stemming. Maar substring helpt: `_search=verzoek` matcht ook `verzoeken`. Voor "verzoeken" → "verzoek": gebruik de kortere stam in de query. |
| `_search="evenement vergunning"` doet niets bijzonders | Quotes zijn geen phrase-delimiter. Strip ze client-side. |
| Resultaten lijken willekeurig in tweede paginering | Default-sort is database-order. Voeg expliciet een tiebreaker toe: `&_order[publicatiedatum]=desc&_order[titel]=asc`. |

## Rate-limiting

Zonder authenticatie geldt: 60 requests per minuut per IP, 1000 per uur. Hits boven die drempel krijgen `429 Too Many Requests` met een `Retry-After`-header.

Voor productie-front-ends raden we aan een Conduction-API-key aan te vragen ([info@conduction.nl](mailto:info@conduction.nl)) — die heft de rate-limit op én ontgrendelt `POST`/`PUT`/`DELETE` voor namens-een-organisatie-publishing.

## OpenAPI

De volledige API-specificatie inclusief request- en response-schemas leeft onder [/api/publications/](/api/publications/) (primaire laag) en [/api/](/api/) (secundaire laag). Zie [API-overzicht](../api.md) voor de sync-details.

## Roadmap

Echte Lucene-style FTS (boolean operatoren, phrase-queries, gewogen velden, scoring, sort op `_score`) is **in voorbereiding als OC-laag** bovenop OpenRegister: de OpenCatalogi-laag krijgt een query-parser en scoring-engine die `_search` server-side decomponeert in OR-conditie-ketens, weegt per veld, en `@self.relevance` per record terugzet. Dat houdt OpenRegister als pure object-storage, en concentreert de zoek-intelligentie op de plek waar de catalogus-context al woont.

Tracker: [`Conduction/opencatalogi`](https://codeberg.org/Conduction/opencatalogi) — kijk naar issues met label `search` / `fts`. Tot die engine in canary draait, geldt: substring + optionele pg_trgm fuzzy, zoals hierboven beschreven.

## Referentie-implementaties

- [`woo-website-template-apiv2`](https://codeberg.org/Conduction/woo-website-template-apiv2) — de publieke WOO-publicatiepagina voor de 2.0-stack (Nextcloud + OpenRegister); gebruikt dit endpoint met faceted-search UI. De voormalige `woo-website-template` (1.0, Gateway-backend) wordt op termijn afgebouwd ten gunste van -apiv2.
- [`api-koppelvlak`](api-koppelvlak.md) — generiek koppelvlak-overzicht inclusief metadata-schema's, datum-driven zichtbaarheid, en de architectuur achter de twee API-lagen.
- [`openregister/lib/Db/MagicMapper/MagicSearchHandler.php`](https://codeberg.org/Conduction/openregister/src/branch/main/lib/Db/MagicMapper/MagicSearchHandler.php) — de daadwerkelijke implementatie van `_search` en `_fuzzy`.
