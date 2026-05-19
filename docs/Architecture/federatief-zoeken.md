# Federatief zoeken

## Integraal (organisatiebreed) zoeken

De kern van de Woo is het zoeken in de openbare informatie van een overheidsorganisatie. Hierbij zou het in theorie niet mogen uitmaken in welke bron of applicatie informatie staat. Deze vorm van bron- en domeinoverstijgend zoeken kennen we vanuit de overheidsarchitectuur al langer en noemen we doorgaans de integrale zoekvraag.

OpenWoo geeft invulling aan deze integrale zoekvraag door gebruik te maken van het Common Ground-component Open Index, wat een standaardisatie is op reeds bestaande (en eventueel al binnen de organisatie beschikbare) tools. Waarin OpenWoo afwijkt, is dat zij alleen publieke informatie in deze index opneemt waardoor een zoekindex van openbare informatie ontstaat. Dit heeft een aantal privacy-, security- en architectuurvoordelen.

Deze Open Index is echter ook buiten OpenWoo bruikbaar en kan bijvoorbeeld worden ingezet vanuit de website, het zaaksysteem of het klantcontactcentrum om burgers, inwoners en medewerkers van relevante informatie te voorzien.

## Federatief (landelijk) zoeken

OpenWoo maakt gebruik van de federatieve zoekvraag ontwikkeld binnen OpenCatalogi om verschillende integrale zoekvragen virtueel samen te voegen. Simpel gezegd: de landelijke zoek-API roept meerdere instanties van Open Index aan en aggregeert de resultaten. Technisch zitten daar nog wat haken en ogen aan die binnen Open Index worden uitgelegd.

Er wordt hierbij dus **géén** gebruik gemaakt van een landelijke index, wat data­duplicatie voorkomt en organisaties zelf in controle houdt op hun publicaties. Dit concept is verder uitgewerkt in koophulpje.nl, waarbij ook een voorziening is gerealiseerd voor het genereren van `robot.txt`- en `sitemap.xml`-bestanden (ten behoeve van KOOP). De facto is hiermee dus ook een landelijke Woo-API gerealiseerd, met de beperking dat deze alleen organisaties bevat die participeren in OpenWoo.

De bevragingen tussen de federatieve zoekvraag en de verschillende organisaties kunnen via NLX/FSC lopen, of daarbuiten. Aangezien het publieke bevragingen zijn op openbare informatie is NLX an sich niet verplicht en kan het inregelen van een PKI-certificaat nodeloos complex zijn. Dat gezegd hebbende, biedt NLX ook voordelen met betrekking tot het monitoren en loggen van verkeer.

## Domeinen

OpenWoo is een organisatie­specifieke applicatie waarvan de installaties onderling een federatief netwerk vormen. Dat kan het wat onduidelijk maken wat waar leeft.

| Type                  | Domein                                       | Status     | Type             |
|-----------------------|----------------------------------------------|------------|------------------|
| Federatief            | koophulpje.nl                                | productie  | Publicatiepagina |
| Federatief            | acceptatie.koophulpje.nl                     | acceptatie | Publicatiepagina |
| Organisatie specifiek | [organisatie_naam].koophulpje.nl             | productie  | Publicatiepagina |
| Organisatie specifiek | acceptatie.[organisatie_naam].koophulpje.nl  | acceptatie | Publicatiepagina |
| n.v.t.                | OpenWoo.app                                  | productie  | Productpagina    |
| n.v.t.                | acceptatie.OpenWoo.app                       | acceptatie | Productpagina    |
| Organisatie specifiek | [organisatie_naam].OpenWoo.app               | productie  | Publicatiepagina |
| Organisatie specifiek | acceptatie.[organisatie_naam].OpenWoo.app    | acceptatie | Publicatiepagina |
| Federatief            | api.OpenWoo.app                              | productie  | API              |
| Federatief            | acceptatie.api.OpenWoo.app                   | acceptatie | API              |
| Organisatie specifiek | api.[organisatie_naam].OpenWoo.app           | productie  | API              |
| Organisatie specifiek | acceptatie.api.[organisatie_naam].OpenWoo.app| acceptatie | API              |

Dit zijn de aangeboden domeinen vanuit OpenWoo. Daarnaast zien we dat de meeste organisaties hun publicatiepagina ontsluiten op hun eigen domein, bijvoorbeeld `open.[organisatie_naam].nl`.
