# API-koppelvlak

OpenWoo is in essentie een API-koppelvlak waar aan de bovenkant meerdere weergaven of user interfaces (front-ends) op kunnen worden gekoppeld, en aan de onderkant meerdere bronnen kunnen worden ontsloten. Als je meer wilt weten over OpenWoo kun je meer lezen op [www.conduction.nl/solutions/openwoo](https://www.conduction.nl/solutions/openwoo).

:::tip Hulp nodig?
Hiervoor hebben we een apart [Slack-kanaal](https://samenorganiseren.slack.com/archives/C067Q3UE9F0) binnen Common Ground. We helpen je daar graag verder.
:::

## Het koppelen van een user interface

Indien je als organisatie of leverancier OpenWoo wilt koppelen aan een huidige interface (bijvoorbeeld door de resultaten uit je gemeente in je website te integreren), kun je daarvoor gebruikmaken van de OpenWoo-API.

### Locatie en authenticatie

De API staat online en er kunnen HTTP-methods aangeroepen worden op [https://api.gateway.commonground.nu/api/publicaties](https://api.gateway.commonground.nu/api/publicaties). Voor het stellen van zoekvragen is **géén** authenticatie vereist (het doel van OpenWoo is immers het verspreiden van openbare informatie). Er is echter wel sprake van throttling op responstijden (de API reageert langzamer) en rate-limiting (het aantal bevragingen per minuut en uur zijn beperkt) zonder authenticatie. Ook zijn alleen de GET-acties (ophalen) toegestaan zonder authenticatie.

Als je vanuit je casus een API nodig hebt zonder throttling, rate-limit, of namens een organisatie wijzigingen wilt doen (d.w.z. POST, PUT, DELETE-requests), dan kun je een mail sturen naar [info@conduction.nl](mailto:info@conduction.nl).

### Documentatie

Voor de API is een [Stoplight-documentatie](https://conduction.stoplight.io/studio/open-catalogi?) beschikbaar met voorbeelden van de verschillende API-endpoints, calls en resultaten. Omdat de API daarnaast kan worden gebruikt zonder authenticatie, is deze ook goed te beproeven via onze [Postman-collectie](https://codeberg.org/Conduction/opencatalogi/src/branch/feature/docs/postmancollection/docs/assets/Opencatalogi%20CRUD.postman_collection.json). We raden developers van harte aan om aan de hand van deze collectie te spelen en te ontwikkelen.

### Voorbeelden

In het merendeel van de gevallen wil je een zoekvraag uitvoeren binnen de Woo-publicaties van OpenWoo. Het endpoint daarvoor is: `https://api.gateway.commonground.nu/api/publicaties`.

1. Op een of meer zoekwoorden, bv. `_search=test`.
2. Op organisatie, dit gaat aan de hand van OIN (de volledige OIN-lijst vind je [hier](https://oinregister.logius.nl/oin-register)), bv. `oin=00000001001299992000`.
3. Op categorie: `categorie=Convenant`.
4. Op datum. Hierbij kun je een begin- en einddatum opgeven om een periode (bijvoorbeeld een jaar) te doorzoeken: `publicatiedatum[after]=2022-12-31T23:59:59Z&publicatiedatum[before]=2024-01-01T00:00:00Z`.

````cli
GET 'https://api.gateway.commonground.nu/api/publicaties?extend[]=all&_search=verzoek&_order[publicatiedatum]=desc&_limit=12&_page=1'

Response

{
    "results": [
        {
            "_id": "385628ef-dd81-4ab2-98e1-3051ab1b3ef6",
            "_self": {
                "id": "385628ef-dd81-4ab2-98e1-3051ab1b3ef6",
                "name": "informatieverzoek evenementenvergunning",
                "self": "/api/publicaties/385628ef-dd81-4ab2-98e1-3051ab1b3ef6",
                "schema": {
                    "id": "40c1041c-1526-4494-b191-244fdd30aefd",
                    "name": "Publicatie",
                    "ref": "https://commongateway.nl/woo.publicatie.schema.json"
                },
                "level": 1,
                "dateCreated": "2024-07-03T07:51:59+00:00",
                "dateModified": "2024-08-02T12:26:46+00:00",
                "dateDeleted": null,
                "database": { "id": null, "name": null, "ref": null },
                "owner": {
                    "id": "06ef47a7-a2f1-4589-af59-b00a611d5692",
                    "name": "Default User",
                    "ref": "https://docs.commongateway.nl/user/default.user.json"
                },
                "organization": {
                    "id": "a1c8e0b6-2f78-480d-a9fb-9792142f4761",
                    "name": "Default Organization",
                    "ref": "https://docs.commongateway.nl/organization/default.organization.json"
                },
                "application": { "id": null, "name": null, "ref": null },
                "synchronizations": [
                    {
                        "id": "c04f118a-d853-48c4-a8d4-d4d86ef11b36",
                        "source": {
                            "id": "f1cf401b-fbbc-4416-b2da-519eac0163b9",
                            "ref": "https://commongateway.woo.nl/source/conduction.zaaksysteem.source.json",
                            "name": "Conduction zaaksysteem",
                            "description": "Conduction zaaksysteem api",
                            "location": "https://openwoo.zaaksysteem.net/api"
                        },
                        "endpoint": null,
                        "sourceId": "001046b9-0a9b-4068-a6bf-3e7efcf75c67",
                        "dateCreated": "2024-07-03T07:51:59+00:00",
                        "dateModified": "2024-07-03T07:52:00+00:00",
                        "lastChecked": null,
                        "lastSynced": null,
                        "sourceLastChanged": null
                    }
                ]
            }
        }
        // 1 enkele voorbeeld publicatie, in dit geval zijn het er 64
    ],
    "count": 12,
    "limit": 12,
    "total": 64,
    "offset": 0,
    "page": 1,
    "pages": 6
}
````

Vanuit het weergeven van een zoekformulier is het goed mogelijk dat je alleen bestaande waarden wilt weergeven (bijvoorbeeld bij jaartal of categorie). Je kunt daarvoor het content type `application/json+aggregations` gebruiken in combinatie met de query-parameter `_queries[]`. Deze vertelt je welke zoekwaarden welke resultaten opleveren.

````cli
GET 'https://api.gateway.commonground.nu/api/publicaties?_queries[]=categorie'
Accept: application/json+aggregations

Response

{
    "categorie": [
        { "_id": "Woo verzoek", "count": 36 },
        { "_id": "Convenant",   "count": 9  }
    ]
}
````

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
