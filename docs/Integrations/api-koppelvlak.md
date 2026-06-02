# API-koppelvlak

OpenWoo is in essentie een API-koppelvlak waar aan de bovenkant meerdere weergaven of user interfaces (front-ends) op kunnen worden gekoppeld, en aan de onderkant meerdere bronnen kunnen worden ontsloten. Als je meer wilt weten over OpenWoo kun je meer lezen op [www.conduction.nl/solutions/openwoo](https://www.conduction.nl/solutions/openwoo).

:::tip Hulp nodig?
Hiervoor hebben we een apart [Slack-kanaal](https://samenorganiseren.slack.com/archives/C067Q3UE9F0) binnen Common Ground. We helpen je daar graag verder.
:::

## Het koppelen van een user interface

Indien je als organisatie of leverancier OpenWoo wilt koppelen aan een huidige interface (bijvoorbeeld door de resultaten uit je gemeente in je website te integreren), kun je daarvoor gebruikmaken van de OpenWoo-API.

### Locatie en authenticatie

De API draait op een OpenRegister-deployment binnen Nextcloud. Voor leveranciers die direct willen testen is de canary-omgeving anoniem leesbaar:

```
https://canary.accept.commonground.nu/apps/openregister/api/objects/woo/{categorie}
```

`{categorie}` is één van de 17 TOOI-informatiecategorieën — er is geen single aggregator-endpoint meer; je doet één request per categorie. De volledige lijst:

`adviezen`, `agendas_en_besluitenlijsten_bestuurscolleges`, `bereikbaarheidsgegevens`, `beschikkingen`, `bij-vertegenwoordigende-organen-ingekomen-stukken`, `convenanten`, `jaarplan-of-jaarverslag`, `klachtoordelen`, `onderzoeksrapporten`, `ontwerpen_van_wet_en_regelgeving_met_adviesaanvraag`, `organisatie_en_werkwijze`, `overige_besluiten_van_algemene_strekking`, `subsidieverplichtingen_anders_dan_met_beschikking`, `vergaderstukken_decentrale_overheden`, `vergaderstukken_staten_generaal`, `wetten_en_algemeen_verbindende_voorschriften`, `woo_verzoeken_en_besluiten`.

Voor de canonieke endpoint-definities + response-schemas zie de live OAS op [/api/](/api/).

Voor het stellen van zoekvragen is **géén** authenticatie vereist (het doel van OpenWoo is immers het verspreiden van openbare informatie). Er is echter wel sprake van throttling op responstijden (de API reageert langzamer) en rate-limiting (het aantal bevragingen per minuut en uur zijn beperkt) zonder authenticatie. Ook zijn alleen de GET-acties (ophalen) toegestaan zonder authenticatie.

Als je vanuit je casus een API nodig hebt zonder throttling, rate-limit, of namens een organisatie wijzigingen wilt doen (d.w.z. POST, PUT, DELETE-requests), dan kun je een mail sturen naar [info@conduction.nl](mailto:info@conduction.nl).

### Documentatie

Voor de API is een [Stoplight-documentatie](https://conduction.stoplight.io/studio/open-catalogi?) beschikbaar met voorbeelden van de verschillende API-endpoints, calls en resultaten. Omdat de API daarnaast kan worden gebruikt zonder authenticatie, is deze ook goed te beproeven via onze [Postman-collectie](https://github.com/ConductionNL/opencatalogi/blob/feature/docs/postmancollection/docs/assets/Opencatalogi%20CRUD.postman_collection.json). We raden developers van harte aan om aan de hand van deze collectie te spelen en te ontwikkelen.

### Voorbeelden

In het merendeel van de gevallen wil je een zoekvraag uitvoeren binnen de Woo-publicaties van OpenWoo. Per TOOI-categorie is er een eigen endpoint, bv. `https://canary.accept.commonground.nu/apps/openregister/api/objects/woo/convenanten`.

Bevragen kan onder andere:

1. Op een of meer zoekwoorden, bv. `_search=test`. Zie [Full-text search](fulltext-search.md) voor query-syntax, gewogen velden en geïndexeerde velden.
2. Op categorie: kies de juiste path-segment (zie lijst hierboven) — categorie is geen query-parameter meer maar zit in het pad.
3. Op metadata-velden direct als query-parameter, bv. `titel=...`, `publicatiedatum=...`, `thema=...`, `tooiCategorieNaam=...`. De per-categorie beschikbare filters staan in de live OAS op [/api/](/api/). **Let op:** veld-filters matchen exact (geen `contains`/`starts-with`); voor "lijkt op" gebruik `_search`.
4. Op organisatie: het OpenRegister-endpoint kent geen losse `oin`-filter; organisatie-scoping wordt afgehandeld via de objects-bron / register-inrichting. Voor de OIN-registratie zie het [OIN-register van Logius](https://oinregister.logius.nl/oin-register).

````cli
GET 'https://canary.accept.commonground.nu/apps/openregister/api/objects/woo/convenanten?_search=verzoek&_extend=attachments'

Response (verkort — voor de volledige response-shape per categorie zie /api/):

{
    "@self": { ... },
    "results": [
        { "@self": { ... }, "id": "...", "titel": "...", "publicatiedatum": "...", "...": "..." }
    ],
    "facets": { ... },
    "total": 64,
    "page": 1,
    "pages": 6,
    "limit": 20,
    "offset": 0
}
````

> **Let op:** legacy query-features die de oude `api.gateway.commonground.nu`-aggregator ondersteunde (`extend[]=all`, `_queries[]=…` met content-type `application/json+aggregations`) zijn niet 1-op-1 aanwezig in de OpenRegister-API. Wat in juni 2026 op canary getest is:
>
> - **Werkt:** `_search`, `_limit`, `_page`, `_extend=field1,field2`, `_unset=field1,field2`, `_order[<veld>]=desc` (ook al staat dit niet in de OAS), `_facets[<veld>]=true` of `_facets=<veld>` (vervangt de legacy aggregations — response bevat `facets: { <veld>: { data: { buckets: [{value, count, label}] } } }`).
> - **Wordt stil genegeerd:** `_filter=titel,publicatiedatum` (response bevat alsnog alle velden — gebruik `_unset` of vraag specifieke fields via `_extend`).
> - **Werkt niet (range-filters):** `publicatiedatum[after]=…` / `publicatiedatum[before]=…` en `publicatiedatum=YYYY..YYYY` retourneren 0 results. Date-range op canary nog niet bevestigd; gebruik exact-match of filter client-side.
>
> Verifieer per use-case tegen de live OAS op [/api/](/api/) voordat je productie-code bouwt.

## Metadata

De kerngegevens van een Woo-publicatie zitten in het metadata-object. De inhoud van dit object is "semi-vrij" — die kan per publicatie­`categorie` verschillen. Daarnaast zijn er een paar algemene properties die altijd kunnen voorkomen in de metadata.

### Algemene properties

| Property              | Verplicht | Gebruik      | Toegestane waarden    |
|-----------------------|-----------|--------------|-----------------------|
| besluitdatum          | Nee       | Detailpagina | String in date format |
| ontvangstdatum        | Nee       | Detailpagina | String in date format |
| informatieverzoek     | Nee       | Detailpagina | Bijlage-object        |
| besluit               | Nee       | Detailpagina | Bijlage-object        |
| inventarisatielijst   | Nee       | Detailpagina | Bijlage-object        |
| termijnoverschrijding | Nee       | Detailpagina | String                |

### Convenanten

| Property | Verplicht | Gebruik | Toegestane waarden |
|----------|-----------|---------|--------------------|

### Woo-verzoeken

| Property | Verplicht | Gebruik | Toegestane waarden |
|----------|-----------|---------|--------------------|

### Klachtoordelen

| Property | Verplicht | Gebruik | Toegestane waarden |
|----------|-----------|---------|--------------------|

## Spelregels

- Er mogen géén kopieën worden gemaakt van data uit de API, zodat overheden de mogelijkheid hebben data te depubliceren (bijvoorbeeld bij het per abuis publiceren van persoonsgegevens).
- Er mag wel gebruik worden gemaakt van caching voor het verbeteren van performance, maar er mag niet langer worden gecachet dan aangegeven in de caching-header van het response-object. Ofwel: de bron bepaalt hoe lang er gecachet mag worden.
