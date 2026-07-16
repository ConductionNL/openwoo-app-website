---
title: Full-text search
description: Twee endpoints voor zoeken binnen de OpenWoo-API — een publicatie-scoped variant en een brede variant die publicaties én documenten in één resultaat teruggeeft.
sidebar_position: 4
---

# Full-text search

De OpenWoo-API biedt **twee endpoints** voor tekstueel zoeken. Welke je gebruikt hangt af van wat je wilt terugvinden:

- **Endpoint 1** doorzoekt alleen publicaties (op titel, samenvatting, thema en andere publicatie-velden).
- **Endpoint 2** doorzoekt publicaties **én** documenten in één resultatenset — geschikt voor een centrale zoekbalk.

Beide endpoints respecteren dezelfde toegangs- en zichtbaarheidsregels: gebruikers krijgen alleen resultaten waar ze op basis van hun rol en de status van de publicatie recht op hebben.

:::tip Eerst lezen
[API-koppelvlak](api-koppelvlak.md) — algemene introductie tot de OpenWoo-API, authenticatie en datum-driven zichtbaarheid.
:::

:::caution Wat je in gedachten moet houden
`_search` doet een **letterlijke substring-match**. Er zijn geen booleaanse operatoren (`AND`/`OR`), geen wildcards (`*`), geen phrase-quotes, geen fuzzy-tilde (`~`) en geen relevantie-boosts (`^n`). Voor typo-tolerantie is er een aparte parameter — zie [Fuzzy search](#fuzzy-search) hieronder.
:::

## Endpoint 1 — Zoeken binnen publicaties

```
GET https://openwoo.commonground.nu/apps/opencatalogi/api/publications?_search=<query>
```

Doorzoekt alle publicaties in de WOO-catalogus waar de gebruiker toegang toe heeft. Matcht op alle tekst-velden van het publicatie-schema (`title`, `summary`, `description`, `themes`, …) plus de algemene metadata-velden.

Een publicatie telt als hit zodra één van deze velden de zoekterm bevat. De sortering volgt `_order[<veld>]` als je die opgeeft; zonder expliciete sortering is de volgorde niet gegarandeerd.

Deze variant is ideaal wanneer je resultaten wilt binnen één catalogus-context, bijvoorbeeld voor de publicatie-overzichtspagina van een organisatie.

> **Let op:** het pad-segment `publications` is de **slug van de catalog**, geen vaste routenaam. Op een deployment zonder een catalog met deze slug krijg je `HTTP 404 — Catalog not found`. Op `openwoo.commonground.nu` is deze catalog standaard aanwezig.

> **Scope wordt bepaald door de catalog-configuratie.** Endpoint 1 doorzoekt de schemas die in de catalog zijn geconfigureerd (`registers` + `schemas` op het catalog-object). Standaard bevat een verse catalog alleen het `publication`-schema, dus krijg je alleen publicaties terug — passend bij het "publicatie-scoped"-karakter van dit endpoint. Voegt een beheerder ook `document` (of andere schemas) toe aan de catalog, dan verschijnen die object-types hier ook. Wil je bewust een mixed envelope met documenten? Gebruik [Endpoint 2](#endpoint-2--brede-zoekopdracht-over-publicaties-én-documenten) — dat endpoint negeert de catalog-scope en zoekt altijd over publicaties én documenten in één antwoord.

## Endpoint 2 — Brede zoekopdracht over publicaties én documenten

```
GET https://openwoo.commonground.nu/apps/opencatalogi/api/search?_search=<query>
```

Doorzoekt publicaties **en** documenten die daaraan hangen. Het resultaat is een gemengde lijst waarin beide soorten objecten samen voorkomen; het veld `@self.schema` geeft per rij aan wat het is — een publicatie of een document.

Elk document dat als hit terugkomt draagt een verwijzing naar de bijbehorende publicatie mee:

```json
{
  "id": "…",
  "title": "…",
  "publication": { "id": "…", "slug": "…", "title": "…" },
  "@self": { "schema": "document", "…": "…" }
}
```

Zo kan een zoekpagina één lijst tonen en per resultaat correct doorlinken naar de publicatie waar het document bijhoort. Documenten die geen geldige `publication`-verwijzing hebben (`id` + `slug`) verschijnen niet in de resultaten.

**Wat wordt doorzocht:** de metadata van publicaties én documenten — dus titels, samenvattingen, bestandsnamen, MIME-types en overige tekst-velden op het schema. **De inhoud van PDF- of DOCX-bestanden zelf wordt (nog) niet meegenomen** — zie [Wat komt er nog](#wat-komt-er-nog) hieronder.

> **Vorm van `@self.schema` verschilt per endpoint:** endpoint 2 geeft de slug (`"publication"` / `"document"`), endpoint 1 geeft het numerieke schema-ID als string (`"15"`, `"16"`). Bouw je één card-renderer voor beide endpoints? Normaliseer dan aan de client-kant.

## Query-vorm & gedrag

De volgende regels gelden voor beide endpoints:

| Wat je intypt | Wat er gebeurt |
|---|---|
| `_search=verzoek` | Matcht "verzoek", "verzoeken", "Woo-verzoek", "aanvraagverzoeken" — substring op `title`/`summary`/`description` en overige tekst-velden |
| `_search=verzoek vergunning` | Wordt als één string behandeld, **niet** als "beide woorden" |
| `_search="evenement vergunning"` | Quotes zijn onderdeel van de match — geen phrase-operator |
| `_search=verzoek OR klacht` | `OR` is gewone tekst, geen operator |
| `_search=evenem*` | `*` is gewone tekst; zonder `*` matcht al "evenement", "evenementen", "evenementenvergunning" |
| `_search=verzoek~` | `~` is gewone tekst, geen fuzzy-operator |

**Wat wél klopt:**

- **Case-insensitive** — `verzoek` matcht `Verzoek`, `VERZOEK`.
- **Substring-match** — `_search=enem` matcht `evenement`, `bedrijvenemissies`.
- **Combineerbaar met filters** — `?_search=verzoek&publicatiedatum[gte]=2026-01-01&_limit=20&_order[publicatiedatum]=desc` werkt zoals verwacht.

**Praktische tips voor consumenten:**

- Wil de gebruiker "beide woorden" matchen? Splits de query client-side of laat de UI meerdere zoektermen aanbieden — server-side ondersteunt dit niet.
- Voor "lijkt op"-zoeken (typo-tolerantie): zie [Fuzzy search](#fuzzy-search).
- Voor filtering op categorie of datum: gebruik echte query-parameters (`@self[schema]=<id>`, `publicatiedatum[gte]=…`) náást `_search`.

## Fuzzy search

Voor typo-tolerantie is er een aparte parameter `_fuzzy=true`:

```
GET https://openwoo.commonground.nu/apps/opencatalogi/api/publications?_search=evenemnt&_fuzzy=true
```

Voegt een trigram-similariteit toe op het naamveld van elk object. Een rij komt terug als óf de gewone substring-match slaagt óf de naam voldoende lijkt op de zoekterm. Elke hit krijgt een `@self.relevance`-veld (geheel getal 0–100) waarop je kunt sorteren via `_order[@self.relevance]=desc`.

Beperkingen:

- Werkt alleen op deployments met PostgreSQL en de `pg_trgm`-extensie ingeschakeld (`openwoo.commonground.nu` heeft dit aan staan).
- Vergelijkt alleen op het naamveld — typos in `titel`, `samenvatting` of `beschrijving` profiteren niet.

## Concrete voorbeelden

### Zoekbalk met paginatie

```http
GET https://openwoo.commonground.nu/apps/opencatalogi/api/publications
    ?_search=evenementenvergunning
    &_order[publicatiedatum]=desc
    &_limit=10
    &_page=1
```

### Zoekbalk met datumfilter

```http
GET https://openwoo.commonground.nu/apps/opencatalogi/api/publications
    ?_search=evenementenvergunning
    &publicatiedatum[gte]=2026-01-01
    &publicatiedatum[lte]=2026-12-31
    &_limit=20
```

### Zoeken binnen één informatiecategorie

```http
GET https://openwoo.commonground.nu/apps/opencatalogi/api/publications
    ?_search=convenant
    &@self[schema]=<schema-id>
    &_limit=10
```

`@self[schema]` filtert op één schema en verwacht het **numerieke schema-ID** (geen slug). Het ID is omgevings-specifiek — vraag op via een facet-call op je eigen omgeving:

```http
GET https://openwoo.commonground.nu/apps/opencatalogi/api/publications
    ?_facetable=true
    &_facets[@self][schema][type]=terms
    &_limit=0
```

De `buckets` in het `facets`-blok geven per voorkomend schema-ID de count.

### Centrale zoekbalk (publicaties + documenten)

```http
GET https://openwoo.commonground.nu/apps/opencatalogi/api/search
    ?_search=evenementenvergunning
    &_limit=10
```

Retourneert gemengde resultaten. Onderscheid maken tussen publicaties en documenten kan via het `@self.schema`-veld op elke rij.

### Type-ahead met lichte payload

```http
GET https://openwoo.commonground.nu/apps/opencatalogi/api/publications
    ?_search=evenem
    &_limit=5
    &_unset=attachments,beschrijving,bevindingen,conclusies
```

`_unset` laat de opgesomde velden weg uit elke resultaat-rij — handig om response-grootte klein te houden voor real-time suggesties.

### Typo-tolerant zoeken

```http
GET https://openwoo.commonground.nu/apps/opencatalogi/api/publications
    ?_search=evenemnt
    &_fuzzy=true
    &_order[@self.relevance]=desc
    &_limit=10
```

### Faceted-search UI

```http
GET https://openwoo.commonground.nu/apps/opencatalogi/api/publications
    ?_search=evenementenvergunning
    &_facetable=true
    &_facets[@self][schema][type]=terms
    &_facets[publicatiedatum][type]=date_histogram
    &_facets[publicatiedatum][interval]=year
    &_limit=10
```

Response bevat een `facets`-blok met buckets per veld, geschikt voor filter-checkboxes met counts.

## Gotchas

| Symptoom | Oorzaak / oplossing |
|---|---|
| `_search=verzoek vergunning` geeft minder hits dan verwacht | Wordt als één substring behandeld, niet als twee termen. Splits client-side of laat de UI losse velden aanbieden. |
| `_search=WOZ` matcht ook losse 'w', 'o', 'z' | Substring-match is letterlijk; korte termen produceren veel false positives. Eis minimaal 3 karakters in de UI. |
| Inhoud van een PDF-bijlage komt niet terug | De **body** van bestanden wordt nog niet doorzocht — alleen bestandsnaam, MIME en overige metadata. Zie [Wat komt er nog](#wat-komt-er-nog). |
| Document verschijnt niet in `/api/search`-resultaten | Documenten hebben een geldige `publication`-verwijzing met `id` én `slug` nodig om in de envelope te verschijnen. |
| `_search=café` matcht niet `cafe` | Diacritics-normalisatie is deployment-afhankelijk. Strip diacritics client-side voor consistent gedrag. |
| Meervouden — `verzoek` vs `verzoeken` | Geen stemming, maar substring helpt: `_search=verzoek` matcht ook `verzoeken`. |
| `_search="evenement vergunning"` doet niets bijzonders | Quotes zijn geen phrase-delimiter. Strip ze client-side. |
| Volgorde lijkt willekeurig op pagina 2 | Zonder expliciete sortering is de volgorde niet gegarandeerd. Voeg altijd `&_order[<veld>]=…` toe. |

## Schrijfacties (POST / PUT / DELETE)

Anonieme toegang geldt alleen voor lezen. Voor schrijfacties (bijvoorbeeld publiceren namens een organisatie) is standaard Nextcloud-authenticatie nodig — Basic-auth, OAuth of een app-token. Neem contact op met [info@conduction.nl](mailto:info@conduction.nl) voor productie-toegang.

## OpenAPI

De volledige API-specificatie leeft onder [/api/publications/](/api/publications/) en [/api/](/api/). Zie [API-overzicht](../api.md) voor de sync-details.

## Wat komt er nog

Op dit moment doorzoekt endpoint 2 wél de **metadata** van documenten (bestandsnaam, MIME, titel, samenvatting), maar niet de **inhoud** van PDF- en DOCX-bestanden. Die uitbreiding is de volgende stap.

De richting is duidelijk: OpenRegister heeft al een text-extractie-pipeline die de tekst uit PDF-, DOCX- en spreadsheet-bestanden kan halen. Daar wordt op geleund; er komt geen aparte zoekmachine bij. Zodra de content-indexering live staat, verandert de vorm van de resultaten niet — dezelfde platte envelope met `@self.schema`-discriminator, alleen breidt de match-kracht uit naar de bestandsinhoud.

## Referentie-implementaties

- [`woo-website-template-apiv2`](https://codeberg.org/Conduction/woo-website-template-apiv2) — de publieke WOO-publicatiepagina; gebruikt beide endpoints met een faceted-search UI.
- [`api-koppelvlak`](api-koppelvlak.md) — generiek koppelvlak-overzicht inclusief metadata-schema's, datum-driven zichtbaarheid en de architectuur achter de API-lagen.
