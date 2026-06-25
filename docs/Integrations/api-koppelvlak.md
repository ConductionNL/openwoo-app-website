# API-koppelvlak

OpenWoo is in essentie een API-koppelvlak waar aan de bovenkant meerdere weergaven of user interfaces (front-ends) op kunnen worden gekoppeld, en aan de onderkant meerdere bronnen kunnen worden ontsloten. Als je meer wilt weten over OpenWoo kun je meer lezen op [www.conduction.nl/solutions/openwoo](https://www.conduction.nl/solutions/openwoo).

:::tip Hulp nodig?
Hiervoor hebben we een apart [Slack-kanaal](https://samenorganiseren.slack.com/archives/C067Q3UE9F0) binnen Common Ground. We helpen je daar graag verder.
:::

## Architectuur: twee API-lagen

Het koppelvlak bestaat uit twee gestapelde API's. De website (bv. de `woo-website-template-apiv2`) praat **niet** rechtstreeks met de databron, maar met de **OpenCatalogi-publicaties-API**. Die delegeert op zijn beurt naar **OpenRegister**, waar de daadwerkelijke objecten, registers en schema's leven.

```
┌────────────────────────────┐
│  Front-end / website       │   woo-website-template-apiv2 (Gatsby PWA)
│  GATSBY_API_BASE_URL=/api  │   roept /publications, /publications/{id}, /pages, /menus aan
└─────────────┬──────────────┘
              │  (NGINX-proxy → UPSTREAM_BASE)
              ▼
┌────────────────────────────┐
│  PRIMAIRE API              │   OpenCatalogi
│  /apps/opencatalogi/api    │   /{catalogus-slug}  ← de "publications"-catalogus
│  → catalogus = register    │   filtert op de registers + schema's van de catalogus
│    + schema's              │   en handelt de publicatie-status (datum-zichtbaarheid) af
└─────────────┬──────────────┘
              │  (delegeert naar ObjectService)
              ▼
┌────────────────────────────┐
│  SECUNDAIRE API            │   OpenRegister
│  /apps/openregister/api    │   /objects/{register}/{schema}
│  → ruwe objecten           │   onderliggende databron; zelfde data, minder context
└────────────────────────────┘
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

:::warning RBAC — zichtbaarheid wordt server-side afgedwongen (mits geconfigureerd)
De OpenCatalogi-publicaties-API draait elke zoekvraag onder **RBAC** (role-based access control). De API voert de query uit met `_rbac: true` en laat OpenRegister de `authorization.read`-regels van elk schema toepassen, dáár in de database — een gebruiker krijgt dus uitsluitend de objecten terug die hij/zij mag zien. Wanneer die regels op een schema correct gevuld zijn, is dit **niet** te omzeilen via query-parameters: een anonieme of onvoldoende geautoriseerde gebruiker krijgt concepten en gedepubliceerde objecten simpelweg niet in de `results` (en een `404` op de detail-endpoint). Filtering op zichtbaarheid gebeurt dus aan de bron, niet in de front-end.

**Belangrijk — geen `authorization.read` = default-open.** OpenRegister's `PermissionHandler` valt terug op "iedereen mag alles" zodra een schema géén `authorization`-blok heeft (`authorization: null`). De gebundelde WOO-schemas (`docs/static/oas/woo_register.json`) shippen op dit moment **zonder** zo'n blok; zonder handmatige configuratie zien anonieme bevragers dus álle objecten, ongeacht `publicatiedatum`/`depublicatiedatum`. Voeg per WOO-schema een `authorization.read`-blok toe zoals beschreven in [Publicatie-statussen](#publicatie-statussen) om de datum-gestuurde zichtbaarheid daadwerkelijk af te dwingen.
:::

Als je vanuit je casus een API nodig hebt zonder throttling/rate-limit, of namens een organisatie wijzigingen wilt doen (POST, PUT, PATCH, DELETE) of ook concepten/gedepubliceerde objecten wilt zien, dan kun je een mail sturen naar [info@conduction.nl](mailto:info@conduction.nl).

### Het koppelen van een user interface

De referentie-implementatie is de [`woo-website-template-apiv2`](https://codeberg.org/Conduction/woo-website-template-apiv2) (Gatsby PWA, de v2-template gericht op de OpenCatalogi-publicaties-API). Die werkt zo:

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

> **Let op — sorteer-/facet-veld in de referentie-implementatie.** De voorbeelden in deze doc gebruiken het WOO-domein-veld `publicatiedatum` voor sorteren en facetten; de `woo-website-template-apiv2` gebruikt feitelijk `@self.published` (`_order[@self.published]=desc`, `_facets[@self][published][type]=date_histogram`). Beide werken; `@self.published` is de OpenRegister-lifecycle-timestamp die automatisch op elk object wordt gezet, `publicatiedatum` is de domein-datum die de redacteur invult. Welke je kiest, hangt af van wat je betekenis "publicatie" geeft — controleer de configuratie van je eigen front-end voordat je query's hard-coded overneemt.

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

> De `value`-waarden hierboven (en de `schemas`/`registers`-id's in het lijst-voorbeeld) zijn **omgevings-specifiek**: schema- en register-id's worden bij install auto-toegewezen en verschillen dus per omgeving. Vraag de actuele id's altijd op via een facet-call (`?_facetable=true&_facets[@self][schema][type]=terms`) op je eigen omgeving in plaats van ze hard-coded over te nemen.

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

> **Let op — gewijzigd t.o.v. oudere documentatie:** in een verse OpenCatalogi-install heet het register `publication` (`SettingsService::autoConfigure()` zoekt op die slug); de informatiecategorie zit in het **schema** (bv. `convenanten`, `woo_verzoeken_en_besluiten`). Bestaande deployments — waaronder canary op moment van schrijven — kunnen daarnaast nog een legacy `woo`-register hebben dat parallel werkt en de echte WOO-data bevat (`…/api/objects/woo/convenanten` levert daar nog 4 objecten); die wordt naar verwachting gemigreerd. Schrijf nieuwe consumenten dus tegen `publication`, maar reken niet op een onmiddellijke 404 op `woo`. De oude aggregator op `api.gateway.commonground.nu` (met `extend[]=all`, `_queries[]=…` en content-type `application/json+aggregations`) is vervangen door bovenstaande twee lagen.

## Publicatie-statussen

Een object heeft géén apart `status`-veld. Of een object **openbaar** zichtbaar is, wordt volledig afgeleid uit twee datumvelden, geëvalueerd tegen "nu" (`$now`):

- **`publicatiedatum`** — vanaf wanneer het object openbaar is.
- **`depublicatiedatum`** — (optioneel) vanaf wanneer het object weer uit de openbaarheid verdwijnt.

Dit wordt op schema-niveau geregeld via een `authorization.read`-blok met `match`-regels voor de groep `public`. Deze regels vormen de **RBAC**-laag: ze worden door OpenRegister tijdens de query in de database toegepast (zie de RBAC-waarschuwing hierboven), zodat een gebruiker nooit objecten terugkrijgt die hij/zij niet mag zien.

> **Aanbevolen schema-configuratie voor WOO — niet meegeleverd in een default install.** De gebundelde WOO-schemas in OpenCatalogi (`docs/static/oas/woo_register.json`) shippen met `authorization: null`; voeg per WOO-schema een blok als onderstaand toe om de datum-gestuurde zichtbaarheid daadwerkelijk server-side af te dwingen (anders treedt OpenRegister's default-open gedrag op — zie de RBAC-waarschuwing hierboven):

```json
"authorization": {
  "read": [
    { "group": "public", "match": { "publicatiedatum": { "$lte": "$now" }, "depublicatiedatum": { "$gte": "$now" } } },
    { "group": "public", "match": { "publicatiedatum": { "$lte": "$now" }, "depublicatiedatum": { "$exists": false } } }
  ]
}
```

> ⚠️ **Het schema moet de velden ook daadwerkelijk hebben.** OpenRegister's Magic Mapper bouwt SQL die direct refereert aan kolommen `publicatiedatum` / `depublicatiedatum`. Voeg je deze regels toe aan een schema dat die properties (nog) niet kent — bv. via een PATCH alleen op het JSON-schema zonder dat de bijbehorende SQL-kolommen worden aangelegd — dan crasht elke (anonieme) lijst-query op `SQLSTATE[42S22]: Unknown column 't.publicatiedatum'` en geeft de endpoint HTTP 500. Zorg dus dat het schema zowel de properties (`publicatiedatum`, `depublicatiedatum`) als de `authorization.read`-regels heeft op het moment dat het wordt geïmporteerd/aangemaakt.

Ter referentie: de catalog/listing/page/organization-schemas in OpenCatalogi's `lib/Settings/publication_register.json` shippen wél met een `authorization.read`-blok, maar dat matcht op `@self.published` (het timestamp dat OpenRegister automatisch zet op elk object) met enkel `$lte $now` — geen `depublicatiedatum`-logica. Voor WOO-content wil je de afdwinging op de domein-velden `publicatiedatum`/`depublicatiedatum` zetten, zoals hierboven.

Hieruit volgen drie toestanden:

| Status | Voorwaarde | Anoniem zichtbaar? |
|--------|------------|--------------------|
| **Gepubliceerd** | `publicatiedatum` is gevuld én `<= nu`, **en** (`depublicatiedatum` ontbreekt **of** ligt in de toekomst) | ✅ Ja |
| **Concept** | `publicatiedatum` is **leeg** _of_ ligt in de **toekomst** (`> nu`) | ❌ Nee |
| **Gedepubliceerd** | `depublicatiedatum` is gevuld én ligt in het **verleden** (`<= nu`) | ❌ Nee |

Belangrijke nuances:

- **Concept = nog niet (of niet) gepubliceerd.** Zowel een leeg `publicatiedatum` als een `publicatiedatum` in de toekomst maakt het object een concept; het blijft onzichtbaar voor het publiek tot die datum bereikt is.
- **Een `depublicatiedatum` in de toekomst depubliceert nog niet** — dat is een *geplande* depublicatie; het object blijft openbaar tot die datum. Het object is pas gedepubliceerd zodra de datum (middernacht) verstreken is. Een `depublicatiedatum` gelijk aan vandaag betekent dus dat het object vandaag al gedepubliceerd is, omdat middernacht van vandaag al gepasseerd is.
- De regels gelden voor **zowel de lijst- als de detail-endpoint**, met verschil in response-shape tussen de twee API-lagen:
  - Via de **OpenCatalogi-publicaties-API** (`/apps/opencatalogi/api/publications/{id}`) krijgt een anonieme caller een nette `404 Not Found` (de controller normaliseert het permission-verdict naar "publication not found").
  - Via de **OpenRegister-objects-API** direct (`/apps/openregister/api/objects/{register}/{schema}/{id}`) bubbelt het permission-verdict op dit moment op als `500 Internal Server Error` (`User 'Anonymous' does not have permission to 'read' …`). Dit is een implementatie-detail van OpenRegister, niet de bedoelde response — bouw front-ends bij voorkeur tegen de OpenCatalogi-laag.
  - In beide gevallen ziet een geautoriseerde gebruiker het object wél (status `200`).
- Geautoriseerde gebruikers (ingelogd / met de juiste groep) zien álle objecten, ongeacht datum — zo kun je concepten klaarzetten en gedepubliceerde stukken nog raadplegen.

> Deze datum-gestuurde zichtbaarheid is precies de reden achter de [Spelregels](#spelregels): omdat een bron op elk moment kan depubliceren, mag je de data niet kopiëren.

### Twee filter-lagen — `publicatiedatum` vs `@self.published`

Het is goed om te weten dat de publicaties-API anonieme zichtbaarheid op **twee plekken** filtert. Beide moeten "groen" zijn voordat een object via `/apps/opencatalogi/api/publications` aan een anonieme bezoeker wordt geserveerd:

1. **OpenRegister RBAC-laag** — de `authorization.read`-regels op het schema (zie hierboven). Deze evalueert op de domein-velden `publicatiedatum` / `depublicatiedatum` zoals de redacteur ze invult.
2. **OpenCatalogi-controller-laag** — in `PublicationsController::show()` zit een aanvullende check via `PublicationQueryService::isObjectPublic()` die kijkt naar `@self.published` en `@self.depublished` (de OpenRegister-lifecycle-timestamps, niet de WOO-domein-datums). Faalt deze, dan krijgt de anonieme caller een nette `404`, zelfs als de RBAC-laag het object zou hebben doorgelaten.

In de praktijk betekent dit dat een nieuw aangemaakt publicatie-object pas via `/publications` zichtbaar wordt voor anonymes als (a) de schema-`authorization.read`-regels op `publicatiedatum`/`depublicatiedatum` matchen én (b) `@self.published` gezet is op een tijdstip in het verleden. De `@self.published`-stempel wordt door OpenRegister op het object gezet wanneer de redacteur "publiceren" triggert — in de admin-UI of via de transition/state-flow. Verschijnt een nieuwe publicatie niet anoniem terwijl de datumvelden lijken te kloppen, controleer dan altijd óók `@self.published`.

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
