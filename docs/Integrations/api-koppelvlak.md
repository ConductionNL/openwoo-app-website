# API-koppelvlak

OpenWoo is in essentie een API-koppelvlak waar aan de bovenkant meerdere weergaven of user interfaces (front-ends) op kunnen worden gekoppeld, en aan de onderkant meerdere bronnen kunnen worden ontsloten. Als je meer wilt weten over OpenWoo kun je meer lezen op [www.conduction.nl/solutions/openwoo](https://www.conduction.nl/solutions/openwoo).

:::tip Hulp nodig?
Hiervoor hebben we een apart [Slack-kanaal](https://samenorganiseren.slack.com/archives/C067Q3UE9F0) binnen Common Ground. We helpen je daar graag verder.
:::

## Architectuur: twee API-lagen

Het koppelvlak bestaat uit twee gestapelde API's. De website (bv. de `woo-website-template`) praat **niet** rechtstreeks met de databron, maar met de **OpenCatalogi-publicaties-API**. Die delegeert op zijn beurt naar **OpenRegister**, waar de daadwerkelijke objecten, registers en schema's leven.

```
┌──────────────────────────┐
│  Front-end / website      │   woo-website-template (Gatsby PWA)
│  GATSBY_API_BASE_URL=/api │   roept /publications, /publications/{id}, /pages, /menus aan
└────────────┬─────────────┘
             │  (NGINX-proxy → UPSTREAM_BASE)
             ▼
┌──────────────────────────┐
│  PRIMAIRE API             │   OpenCatalogi
│  /apps/opencatalogi/api   │   /{catalogus-slug}  ← de "publications"-catalogus
│  → catalogus = register   │   filtert op de registers + schema's van de catalogus
│    + schema's             │   en handelt de publicatie-status (datum-zichtbaarheid) af
└────────────┬─────────────┘
             │  (delegeert naar ObjectService)
             ▼
┌──────────────────────────┐
│  SECUNDAIRE API           │   OpenRegister
│  /apps/openregister/api   │   /objects/{register}/{schema}
│  → ruwe objecten          │   onderliggende databron; zelfde data, minder context
└──────────────────────────┘
```

**Vuistregel:** bouw je een publicatiewebsite of -viewer, gebruik dan de **OpenCatalogi-publicaties-API**. Die geeft je per-catalogus-scoping, schema-metadata in `@self`/`@catalog`, facetten met labels en de publicatie-status-filtering kant-en-klaar. De **OpenRegister-objects-API** is de onderliggende laag; gebruik die alleen wanneer je register/schema-specifiek en buiten een catalogus om wilt bevragen.

## Primaire API — OpenCatalogi-publicaties

### Locatie en authenticatie

De publicaties van een omgeving worden ontsloten via een **catalogus**. De standaard WOO-catalogus heeft de slug `publications`:

```
https://canary.accept.commonground.nu/apps/opencatalogi/api/publications
```

Lokaal (ontwikkelomgeving) is dat:

```
http://localhost:8080/apps/opencatalogi/api/publications
```

Het pad-segment ná `/api/` is de **catalogus-slug**. Een omgeving kan meerdere catalogi hebben; de lijst haal je op via `GET /apps/opencatalogi/api/catalogi`. Een catalogus is gekoppeld aan één of meer OpenRegister-**registers** en **schema's** — die bepalen welke informatiecategorieën erin zitten (zie [Metadata](#metadata)).

Voor het stellen van zoekvragen is **géén** authenticatie vereist (het doel van OpenWoo is immers het verspreiden van openbare informatie). Anoniem zie je uitsluitend **gepubliceerde** objecten (zie [Publicatie-statussen](#publicatie-statussen)). Er is wel sprake van throttling op responstijden en rate-limiting zonder authenticatie, en alleen GET-acties zijn anoniem toegestaan.

:::warning RBAC — zichtbaarheid wordt server-side afgedwongen
De OpenCatalogi-publicaties-API draait elke zoekvraag onder **RBAC** (role-based access control). De API voert de query uit met `_rbac: true` en laat OpenRegister de `authorization.read`-regels van elk schema toepassen, dáár in de database — een gebruiker krijgt dus uitsluitend de objecten terug die hij/zij mag zien. Dit is **niet** te omzeilen via query-parameters: een anonieme of onvoldoende geautoriseerde gebruiker krijgt concepten en gedepubliceerde objecten simpelweg niet in de `results` (en een `404` op de detail-endpoint). Filtering op zichtbaarheid gebeurt dus aan de bron, niet in de front-end.
:::

Als je vanuit je casus een API nodig hebt zonder throttling/rate-limit, of namens een organisatie wijzigingen wilt doen (POST, PUT, PATCH, DELETE) of ook concepten/gedepubliceerde objecten wilt zien, dan kun je een mail sturen naar [info@conduction.nl](mailto:info@conduction.nl).

### Het koppelen van een user interface

De referentie-implementatie is de [`woo-website-template`](https://github.com/ConductionNL/woo-website-template) (Gatsby PWA). Die werkt zo:

- De basis-URL staat in `GATSBY_API_BASE_URL` (default `/api`). In productie/Docker proxyt NGINX `/api/*` door naar de OpenCatalogi-API van de gekozen omgeving (`UPSTREAM_BASE`, bv. `…/apps/opencatalogi/api`).
- De template roept relatief de volgende endpoints aan:

| Doel | Call |
|------|------|
| Lijst/zoeken | `GET /publications?_limit=…&_page=…&_order[publicatiedatum]=desc&…` |
| Detail | `GET /publications/{id}?extend[]=themes&extend[]=@self.schema` |
| Bijlagen (met labels) | `GET /publications/{id}/attachments?_hasLabels=true&_limit=500` |
| Bijlagen (zonder labels) | `GET /publications/{id}/attachments?_noLabels=true&_limit=…&_page=…` |
| Categorie-/jaar-facetten | `GET /publications?_facetable=true&_facets[@self][schema][type]=terms&_facets[publicatiedatum][type]=date_histogram&_facets[publicatiedatum][interval]=year` |
| Pagina's / menu's (CMS) | `GET /pages?_limit=50` · `GET /menus?_limit=50` |

`/publications` is hier dus géén vast endpoint maar de **catalogus-slug** `publications`. Wijs je je front-end aan een andere catalogus toe, dan verandert dat pad-segment.

### Bevragen

Bevragen kan onder andere (alle parameters hieronder getest tegen de live API, juni 2026):

1. **Vrije tekst:** `_search=test`. Zie [Full-text search](fulltext-search.md) voor query-syntax, gewogen velden en geïndexeerde velden.
2. **Op categorie (schema):** `@self[schema]=<schema-id>` filtert op één informatiecategorie. De beschikbare schema-id's + labels haal je uit de facet-`buckets` (zie hieronder) of uit `@self.schemas` in de response.
3. **Op metadata-veld (exact-match):** elk objectveld werkt als query-parameter, bv. `titel=…`, `thema=Verkeer`, `kenmerk=…`. Let op: veld-filters matchen **exact** (geen `contains`/`starts-with`); voor "lijkt op" gebruik `_search`.
4. **Op datumbereik:** `publicatiedatum[gte]=2026-02-01` en `publicatiedatum[lte]=2026-12-31` (ISO-datum of -datetime). Deze bracket-operator-syntax (`[gte]`/`[lte]`) werkt op de publicaties-API.
5. **Sorteren:** `_order[publicatiedatum]=desc` (of een ander veld; `asc`/`desc`).
6. **Pagineren:** `_limit=<n>` en `_page=<n>` (1-geïndexeerd). De response bevat `total`, `page`, `pages`, `limit`, `offset`.
7. **Velden bijladen/weglaten:** `_extend=field1,field2` (of `extend[]=…`) en `_unset=field1,field2`.
8. **Facetten:** `_facets[<veld>][type]=terms` of `_facets[@self][schema][type]=terms`, eventueel `date_histogram` met `interval`. Zet daarbij `_facetable=true`.

#### Voorbeeld — lijst

````cli
GET 'https://canary.accept.commonground.nu/apps/opencatalogi/api/publications?_search=verzoek&_order[publicatiedatum]=desc&_limit=20'

Response (verkort):

{
    "results": [
        {
            "id": "f6551cb8-…",
            "titel": "Woo-verzoek wegenonderhoud",
            "publicatiedatum": "2026-02-10",
            "thema": "Verkeer",
            "@self": { "id": "…", "schema": 10, "published": "…", "…": "…" }
        }
    ],
    "total": 1,
    "page": 1,
    "pages": 1,
    "limit": 20,
    "offset": 0,
    "facets": { … },
    "@self":    { "source": "database", "schemas": { … }, "registers": { … } },
    "@catalog": { "slug": "publications", "title": "Publications", "registers": [1], "schemas": [1,9,10] }
}
````

#### Voorbeeld — facetten

````cli
GET '…/apps/opencatalogi/api/publications?_facetable=true&_facets[@self][schema][type]=terms'

Response (verkort):

{
    "facets": {
        "_schema": {
            "type": "terms",
            "queryParameter": "@self[schema]",
            "data": {
                "buckets": [
                    { "value": 1,  "count": 1, "label": "Publication" },
                    { "value": 9,  "count": 1, "label": "Convenanten" },
                    { "value": 10, "count": 1, "label": "Woo-verzoeken en -besluiten" }
                ]
            }
        }
    },
    "results": [ … ]
}
````

Gebruik `bucket.value` als waarde voor het `@self[schema]=…`-filter en `bucket.label` als zichtbaar label.

### Documentatie

Voor de API is een [Stoplight-documentatie](https://conduction.stoplight.io/studio/open-catalogi?) beschikbaar en een [Postman-collectie](https://codeberg.org/Conduction/opencatalogi/src/branch/main/docs/assets/Opencatalogi%20CRUD.postman_collection.json). Omdat de API zonder authenticatie te bevragen is, raden we developers aan hiermee te spelen. Voor de canonieke endpoint-definities + response-schemas zie de live OAS op [/api/](/api/).

## Secundaire API — OpenRegister-objecten

Onder de publicaties-API ligt de OpenRegister-objects-API. OpenCatalogi delegeert hier naartoe via de `ObjectService`; je krijgt dezelfde objecten, maar zónder de catalogus-context (`@catalog`, gecombineerde schema-scoping, catalogus-facetten).

Endpoint-patroon — register en schema mogen op **id** óf op **slug**:

```
GET /apps/openregister/api/objects/{register}/{schema}
GET /apps/openregister/api/objects/{register}/{schema}/{id}
```

Voorbeelden (lokaal):

```
GET /apps/openregister/api/objects/1/9                       # register-id 1, schema-id 9
GET /apps/openregister/api/objects/publication/convenanten   # register-slug + schema-slug
```

De query-parameters zijn grotendeels gelijk aan de publicaties-API: `_search`, `_limit`, `_page`/`_offset`, `_order`, `_extend`, `_unset`, `_facets`, plus exact-match veldfilters. De publicatie-status-zichtbaarheid (hieronder) geldt hier net zo goed: anoniem zie je alleen gepubliceerde objecten.

> **Let op — gewijzigd t.o.v. oudere documentatie:** er is **geen** `…/api/objects/woo/{categorie}`-endpoint en **geen** register met slug `woo`. Het register heet `publication`; de informatiecategorie zit in het **schema** (bv. `convenanten`, `woo_verzoeken_en_besluiten`). De oude aggregator op `api.gateway.commonground.nu` (met `extend[]=all`, `_queries[]=…` en content-type `application/json+aggregations`) is vervangen door bovenstaande twee lagen.

## Publicatie-statussen

Een object heeft géén apart `status`-veld. Of een object **openbaar** zichtbaar is, wordt volledig afgeleid uit twee datumvelden, geëvalueerd tegen "nu" (`$now`):

- **`publicatiedatum`** — vanaf wanneer het object openbaar is.
- **`depublicatiedatum`** — (optioneel) vanaf wanneer het object weer uit de openbaarheid verdwijnt.

Dit wordt op schema-niveau geregeld via een `authorization.read`-blok met `match`-regels voor de groep `public`. Deze regels vormen de **RBAC**-laag: ze worden door OpenRegister tijdens de query in de database toegepast (zie de RBAC-waarschuwing hierboven), zodat een gebruiker nooit objecten terugkrijgt die hij/zij niet mag zien:

```json
"authorization": {
  "read": [
    { "group": "public", "match": { "publicatiedatum": { "$lte": "$now" }, "depublicatiedatum": { "$gte": "$now" } } },
    { "group": "public", "match": { "publicatiedatum": { "$lte": "$now" }, "depublicatiedatum": { "$exists": false } } }
  ]
}
```

Hieruit volgen drie toestanden:

| Status | Voorwaarde | Anoniem zichtbaar? |
|--------|------------|--------------------|
| **Gepubliceerd** | `publicatiedatum` is gevuld én `<= nu`, **en** (`depublicatiedatum` ontbreekt **of** ligt in de toekomst) | ✅ Ja |
| **Concept** | `publicatiedatum` is **leeg** _of_ ligt in de **toekomst** (`> nu`) | ❌ Nee |
| **Gedepubliceerd** | `depublicatiedatum` is gevuld én ligt in het **verleden** (`<= nu`) | ❌ Nee |

Belangrijke nuances:

- **Concept = nog niet (of niet) gepubliceerd.** Zowel een leeg `publicatiedatum` als een `publicatiedatum` in de toekomst maakt het object een concept; het blijft onzichtbaar voor het publiek tot die datum bereikt is.
- **Een `depublicatiedatum` in de toekomst depubliceert nog niet** — dat is een *geplande* depublicatie; het object blijft openbaar tot die datum. Het object is pas gedepubliceerd zodra de datum (middernacht) verstreken is. Een `depublicatiedatum` gelijk aan vandaag betekent dus dat het object vandaag al gedepubliceerd is, omdat middernacht van vandaag al gepasseerd is.
- De regels gelden voor **zowel de lijst- als de detail-endpoint**: een concept of gedepubliceerd object geeft anoniem een `404` op `/publications/{id}`, terwijl een geautoriseerde gebruiker het object wél (status `200`) ziet.
- Geautoriseerde gebruikers (ingelogd / met de juiste groep) zien álle objecten, ongeacht datum — zo kun je concepten klaarzetten en gedepubliceerde stukken nog raadplegen.

> Deze datum-gestuurde zichtbaarheid is precies de reden achter de [Spelregels](#spelregels): omdat een bron op elk moment kan depubliceren, mag je de data niet kopiëren.

## Metadata

De kerngegevens van een Woo-publicatie zitten in het object zelf; metadata over het object (zoals het schema, register en publicatie-timestamps) zit onder `@self`. De inhoud van een object is "semi-vrij" — die verschilt per informatiecategorie (schema). Daarnaast zijn er properties die in vrijwel elke categorie voorkomen.

### Algemene / veelvoorkomende properties

| Property              | Verplicht | Gebruik            | Toegestane waarden        |
|-----------------------|-----------|--------------------|---------------------------|
| titel                 | Ja        | Titel/overzicht    | String                    |
| samenvatting          | Nee       | Overzicht          | String                    |
| beschrijving          | Nee       | Detailpagina       | String                    |
| thema                 | Nee       | Filter/facet       | String                    |
| kenmerk               | Nee       | Detailpagina       | String                    |
| categorie             | Nee       | Detailpagina       | String (vaak een `const`) |
| publicatiedatum       | Nee\*     | Status + sortering | String in date-format     |
| depublicatiedatum     | Nee       | Status             | String in date-format     |
| besluitdatum          | Nee       | Detailpagina       | String in date-format     |
| ontvangstdatum        | Nee       | Detailpagina       | String in date-format     |
| termijnoverschrijding | Nee       | Detailpagina       | String                    |

\* Technisch optioneel, maar zonder gevulde `publicatiedatum` blijft een object een **concept** en dus niet openbaar.

### Convenanten

Schema-slug `convenanten`. Bevat o.a. `titel` (verplicht), `samenvatting`, `beschrijving`, `thema`, `kenmerk`, `categorie` (`const`: `Convenanten`), `publicatiedatum`, `depublicatiedatum`, `besluitdatum`. Categorie-zichtbaarheid is datum-gestuurd (zie [Publicatie-statussen](#publicatie-statussen)).

### Woo-verzoeken en -besluiten

Schema-slug `woo_verzoeken_en_besluiten`. Vergelijkbare set properties als Convenanten, met `categorie` `const`: `Woo-verzoeken en -besluiten`. Bedoeld voor de inhoud van schriftelijke Woo-verzoeken en de besluiten daarop, inclusief de verstrekte informatie.

## Spelregels

- Er mogen géén kopieën worden gemaakt van data uit de API, zodat overheden de mogelijkheid hebben data te depubliceren (bijvoorbeeld bij het per abuis publiceren van persoonsgegevens). De [datum-gestuurde depublicatie](#publicatie-statussen) werkt alleen als consumenten de bron blijven bevragen.
- Er mag wel gebruik worden gemaakt van caching voor het verbeteren van performance, maar er mag niet langer worden gecachet dan aangegeven in de caching-header van het response-object. Ofwel: de bron bepaalt hoe lang er gecachet mag worden.
