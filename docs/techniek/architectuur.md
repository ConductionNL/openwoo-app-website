---
sidebar_position: 2
---

# Architectuur

## Hulp nodig?

Hiervoor hebben we een apart Slack kanaal binnen Common Ground. We helpen je daar graag verder.

## Doel van OpenWoo.app

De OpenWoo.app heeft als doel om een ecosysteem van samenwerkende componenten te bieden dat voorziet in de volgende functionaliteit

- ✅ Opslag en ontsluiting van documenten en metadata middels API's;
- ✅ Het indexeren van documenten en metadata, en het ontsluiten van zoekresultaten middels API's;
- ✅ Het werken met (concept) publicaties
- ✅ Het uploaden, registreren en publiceren van documenten en metadata door medewerkers;
- ✅ Het (door)zoeken, vinden en raadplegen van documenten en metadata door burgers;
- ✅ Het beheren van autorisaties, configuratie en publicaties door beheerders;
- ✅ Integratie met de landelijke voorziening PLOOI/KOOP, WooGLe, Koophulpje, DSO.
- ✅ Integratie met standaard gemeentelijke bronnen zoals een zaaksysteem, raadsinformatiesysteem of website
- ✅ Afhandelingsflow voor zowel publiceren als Woo-verzoeken
- ✅ Het kunnen terugtrekken van publicaties t.b.v herstel op procedurele fouten
- ✅ Help functie voor medewerkers aan de hand van werk instructies
- ✅ Interne publicaties die niet openbaar toegankelijk zijn
- 🔄 (Roadmap) Generatie van documenten ten behoeve van publiceren en inhoudslijsten
- 🔄 (Roadmap) Koppeling met anonimiseringssoftware
- 🔄 (Roadmap) Naar PDF kunnen omzetten van documenten
- 🔄 (Roadmap) Archiveren
- 🔄 (Roadmap) Opslaan van zoekfilters en resultaten
- 🔄 (Roadmap) Abonneren op nieuwe publicaties die voldoen aan een opgeslagen zoekfilter
- 🔄 (Roadmap) Anonimiseren in de regie-interface
- 🔄 (Roadmap) Advies over taalniveau
- 🔄 (Roadmap) Federatieve zoekvraag

We hebben deze functionaliteit opgedeeld in drie blokken

1. Publicatieplatform
2. Motorblok (Woo-service en Open Index)
3. Bronnen

Secundair doel daarbij is wat idealistischer: om een gemeenschappelijke codebase te realiseren die door meerdere leveranciers kan worden uitgeleverd en deze vanaf dag één te betrekken. Het voorkomen van een lock-in vraagt om een open source oplossing die door en door begrepen wordt door meerdere markt partijen.

## Hergebruik tot op het bot

OpenWoo.app maakt voor haar onderliggende techniek en architectuur gebruik van OpenCatalogi. Meer technische informatie over publiceren naar het federatief datastelsel vind je dan ook in de architectuurdocumentatie van OpenCatalogi. Er zijn echter een paar zaken die we binnen OpenWoo.app aanvullend regelen.

In plaats van de standaard OpenCatalogi-voorkant gebruikt OpenWoo en een publicatiepagina die geoptimaliseerd is voor de Woo, dit kan een (sub)site zijn bij de website leverancier van de gemeente, of een van de twee losstaande React pagina's. We laten de keuze hiervoor bewust bij de deelnemende overheden zelf.

We gebruiken een aantal aanvullende metadata modellen in plaats van DCAT en PublicCode, deze worden landelijk onderhouden.

We maken gebruik van een losse WOO (micro) service die vanuit verschillende bronnen (o.a. zaaksystemen en raadsinformatie systemen) informatie ophaalt en klaar zet als publicatie. Of en hoe publicaties vervolgens automatisch worden gepubliceerd is een configuratie keuze.

Er is naast de standaard beheer omgeving van Open Catalogi ook een Publicatie Taak applicatie beschikbaar die specifiek gericht is op het (handmatig) verwerken van Woo-verzoeken en beheren van publicaties.

In een meer algemene zin hebben we bij OpenWoo.app voor andere (sub)doelgroepen gekozen dan binnen Open Catalogi, inwoners, onderzoekers, journalisten, raadsleden en ondernemers staan centraal.

## Codebases

Voor de installatie van OpenWoo.app zijn meerdere codebases beschikbaar, dat heeft zowel een historische achtergrond als dat het een bewuste keuze is om van (met name UI) componenten meerdere versies te hebben. Omdat deze ook nog eens over verschillende organisaties verdeeld zijn, kan het moeilijk zijn om overzicht te houden op welke code waar staat. We houden daarom hier een overzicht bij van de extra componenten en codebases ten opzichte van de standaard OpenCatalogi-componenten.

| Codebase | Rol | Leverancier | Licentie |
|----------|-----|-------------|----------|
| Github | Taakapplicatie publiceren, Publicatieplatform | IO Digital | |
| Github | Taakapplicatie publiceren | Acato | |
| Github | Publicatieplatform | Acato | |
| Github | Publicatieplatform | Yard | EUPL |
| Github | Publicatieplatform | Conduction | EUPL |
| Github | Synchronisatieservice | Conduction | EUPL |

Hierop zijn een paar opmerkingen te maken

- We gebruiken de synchronisatie service van Open Catalogi niet (die is immers gericht op GitHub, GitLab en DCAT), in plaats daarvan is er een Woo-synchronisatieservice gericht op ZGW, STUF, DRC en ORI.
- We gebruiken voorkant van Open Catalogi niet (die is immers software en datagericht), in plaats daarvan hebben meerdere leveranciers eigen publicatieplatformen ontwikkeld.

## Uitdagingen

Bij het ontwikkelen van een publicatie voorziening komen een aantal uitdagingen in beeld

- Woo gegevens staan vaak opgeslagen in bronnen die niet makkelijk toegankelijk zijn
- De scope van de Woo (alle niet vertrouwelijke gegevens) in combinatie met het concept actieve openbaarmaking raakt de volledige informatie huishouden
- Handmatig publiceren kan daarmee geen eindoplossing zijn, maar eigenlijk ook al geen tussenoplossing
- Er mogen géén fouten worden gemaakt met anonimiseren, dit vraagt om een afgebakende proces flow met checks en balances rondom publiceren

Dat leidt tot de conclusie dat we niet op zoek zijn naar een WOO-publicatieplatform maar een algemene publicatie voorzienen die één of meerdere publicatie kanalen kan 'voeden', daarbij denken we naast de WOO-Index (koop) ook nadrukkelijk aan een organisatie eigen publicatie platform, WooGLe en bijvoorbeeld een gemeentelijke website. In het verlengde hiervan liggen ook DROP, SDG, Algoritme registers en WHO als kanalen die vanuit een generiek publicatieplatform moeten kunnen worden ontsloten.

## Belangrijkste verschillen ten opzicht van OpenWoo.app 1.0

**Splitsing opslag en search**  
Binnen de OpenWoo.app 1.0 werd er één MongoDB-instance als opslag en search gebruikt, we hebben deze zowel qua opslag uit elkaar getrokken in een Elasticsearch en ORC-instantie als verdeeld over twee aparte API's (zoeken en beheer).

**Lostrekken integratie component**  
De 1.0 versie was direct gebouwd op de Common Gateway, een integratie voorziening. Vanaf 2.0 zijn de zoek-API en beheer-API gepositioneerd als losse componenten die (desgewenst) ook op NLX/FSC kunnen worden ontsloten.

**Publicatie flow**  
De 1.0 versie was gebouwd op de gedachte dat objecten vanuit de bron altijd automatisch moesten worden gepubliceerd. In de 2.0 is dit omgedraaid en wordt er vanuit gegaan dat er actief beheer is op publicaties en dat ze pas worden gepubliceerd als daartoe is geaccordeerd. Wel kunnen er nog steeds automatische spelregels worden afgesproken.

## Publicatieplatform (onderdeel 1)

Woo-publicaties moeten worden uiteraard ergens worden gepubliceerd, dat gebeurd via een organisatie specifiek Woo-publicatieplatform. Open Catalogi kent haar eigen zoeken UI, maar voor de gemiddelde gemeente is die te generiek. Daarom zijn er vanuit het OpenWoo.app project een aantal alternatieve user interfaces beschikbaar waarbij de overheid zelf kan kiezen welke interface het beste bij haar past. Hierbij kunt u zowel kiezen voor de zoekinterface als los component als voor een integratie binnen uw huidige website.

Let op, alle interfaces maken onderwater gebruik van de zoeken-API. De interface is dan ook niet te gebruiken zonder een OpenCatalogi zoeken-API.

| Component | Open Source | Leverancier(s) | Beschrijving | Meer informatie |
|-----------|-------------|----------------|--------------|-----------------|
| OpenCatalogi zoeken-Ui | Ja | Conduction | Een losse NL Design zoekpagina in de huisstijl van uw organisatie | |
| OpenWoo.app default zoeken-Ui | Ja | Conduction, Shift2 | Een losse NL Design zoekpagina in de huisstijl van uw organisatie | |
| Tilburgse frontend | Ja | Acato | Een losse NL Design zoekpagina in de huisstijl van uw organisatie | |
| Integratie in Open Webconcept | Ja | Yard, Conduction | Een NL Design weergavecomponent voor WordPress-websites | |
| Drupal Site | Ja | Drupal voor Overheden | Een weergavecomponent voor Drupal | |
| TYPO3 thema site | Ja | OpenGemeenten | Een weergavecomponent voor TYPO3-websites | |

Naast het lokale publicatieplatform ondersteund OpenWoo.app ook altijd de volgende landelijke publicatieplatformen

- Een gestandaardiseerde verbinding met het Kennis- en Exploitatiecentrum Officiële Publicaties (KOOP)
- Een federale zoekvraag via koophulpje.nl.
- WooGLe van de Wooverheid van de UvA.
- KoopHulpje van OpenWoo.app
- OpenCatalogi.nl van Rotterdam

:::note
Voor Open Source componenten bent u natuurlijk niet beperkt tot deze leveranciers, dit zijn de op dit moment bij ons bekende leveranciers.
:::

Weet u niet welk frontend framework uw organisatie op dit moment gebruikt? Kijk dan eens op digimonitor.

## Motorblok (onderdeel 2)

Het kloppende hart (of motorblok) onder het publicatieplatform is het Common Ground project OpenCatalogi vanuit dit project nemen we een tweetal componenten over; te weten Open Index en Open Registers.

Open Index stelt ons in staat om snel en organisatie-overstijgend te zoeken in meerdere Woo-categorieën tegelijkertijd. Hierbij wordt onder water gebruik gemaakt van Elasticsearch. Open Index normaliseert en standaardiseert Elasticsearch voor ons door het toevoegen van JSON-ld, contextuele metadata, organisaties, directory en catalogi waardoor de onderliggende infrastructuur ontstaat voor een federatieve zoekvraag. Het vormt daarmee het hard van zoeken in OpenWoo.app. Meer informatie over hoe we de techniek van Open Index inzetten vind je in de architectuurdocumentatie van OpenCatalogi.

Open Registers levert voor ons een publicatieregister waar publicaties binnen komen (automatisch aan de hand van synchronisatie of handmatig) en we deze behandelen voordat ze verder worden gecommuniceerd naar Open Index.

Er is dus een bewuste en harde scheiding tussen de werkbak (Open Registers) en de publicatiebak (Open Index) waarbij de zoek-API (en daarmee de burger interface) gebruik maakt van de zoekbak. De medewerkers maken via de Admin-UI en beheerinterface gebruik van Open Registers om publicaties te behandelen. Onder het behandelen van publicatie verstaan we onder andere:

- Controleren en aanvullen van metadata
- Toevoegen van documenten
- Controleren van anonimisering
- Eventueel anonimiseren a.h.v. externe service
- Accorderen voor publicatie
- Eventueel terugtrekken van publicaties
- Archiveren

Hierbij dient te worden opgemerkt dat het publicatieprincipe niet alleen de Woo, maar ook WHO en DSO ondersteund.

Afhankelijk van de specifieke configuratie wensen van overheden kunnen sommige van deze handelingen worden geautomatiseerd (bijvoorbeeld terugtrekken van en DSO-publicatie die ter inzage ligt na het verloop van de termijn). Hiervoor ondersteunen we twee patronen

- Een BPMN (Camunda) task die wordt afgetrapt n.a.v een notificatiebericht
- Een NextCloud-workflow

OpenWoo Service gebaseerd op het Common Ground Open Services framework faciliteert het inlezen van externe bronnen naar open index toe. Hierbij wordt bij voorkeur gebruik gemaakt van een Pub/Sub-principe (abonnement op notificaties vanuit de bron) maar kan ook (indien gewenst) gebruik worden gemaakt van crawling.

| Component | Leverancier | Meer informatie |
|-----------|-------------|-----------------|
| Open Index | Conduction | Documentatie |
| Open Registers | Conduction | Documentatie |
| OpenWoo Service | Conduction | Documentatie |

## Bronnen (onderdeel 3)

Een van de krachten van OpenWoo.app is het ondersteunen en (automatisch) publiceren vanuit een groot aantal bronnen

| Component | Koppelvlak | Open Source | Leveranciers(s) | Meer informatie |
|-----------|------------|-------------|-----------------|-----------------|
| Zaaksysteem.nl | Search | Ja | Xxllnc | |
| Notubiz | ZGW | Nee | Notubiz | |
| RX Fundament | ZGW | Nee | Roxit | |
| Decos JOIN | ZGW | Nee | Decos | |
| OpenZaak | ZGW | Ja | Maykin Media | |
| SimSite | Custom API | ? | Shift2 | |
| Open Verzoeken | Custom API | Ja | Yard, Acato | |
| Open Convenanten | Custom API | Ja | Yard, Acato | |
| Open Klachten | Custom API | Ja | Yard, Acato | |
| Open PUB | Custom API | Ja | Yard, Acato | |
| Open PDC | Custom API | Ja | Yard, Acato | |

:::note
Er zijn meer koppelvlakken en daarmee bronnen beschikbaar (bijvoorbeeld StUF en ZDS). Bovenstaande is slechts een overzicht van de bij ons bekende en beproefte bronnen. Andere koppelvlakken en maatwerk zijn uiteraard ook mogelijk, neem daarvoor contact op met een leverancier.
:::

## Totaalplaatje

De drie onderdelen samen geven ons een totaalbeeld van samenwerkende componenten die als ecosysteem een oplossing leveren.

## Hoe werkt dat scrapen vanuit de Woo-service?

De Woo-service "scraped" elke nacht alle relevante informatie en synchroniseert deze met de publicatie objecten in Open Registers. De stappen zijn (bijvoorbeeld bij een zaaksysteem) als volgt:

1. Ophalen van alle zaaktypen.
2. Per zaaktype worden de beschikbare eigenschappen gecontroleerd (zie inrichting zaaksysteem).
3. Voor elk zaaktype dat aan de voorwaarden voldoet, worden de zaken opgehaald.
4. Per zaak wordt gecontroleerd of er een publicatiedatum is; zo ja, wordt de zaak opgenomen of bijgewerkt als publicatie object in Open Registers.
5. Zaken die niet zijn gevonden in bovenstaande loop, maar wel in Open Registers staan, worden gedepubliceerd (ingetrokken) en geoormerkt.

Het bovenstaande proces zorgt ervoor dat het zaaksysteem leidend is en dat zaken zowel kunnen worden gepubliceerd als worden ingetrokken.

## Integraal (Organisatiebreed) zoeken

De kern van de Woo is het zoeken in de openbare informatie van een overheid organisatie, hierbij zou het in theorie niet mogen uitmaken in welke bron, of applicatie, informatie staat. Deze vorm van bron- en domeinoverstijgend zoeken kennen we vanuit de overheidsarchitectuur al langer en noemen we doorgaans integrale zoekvraag.

OpenWoo.app geeft invulling aan deze integrale zoekvraag door gebruik te maken van het Common Ground component Open Index, wat een standaardisatie is op reeds bestaande (en eventueel al binnen de organisatie beschikbare) tools. Waarin OpenWoo.app afwijkt, is dat zij alleen publieke informatie in deze index opneemt waardoor een zoek index openbare informatie ontstaat. Dit heeft een aantal privacy, security en architectuur voordelen.

Deze Open Index is echter ook buiten OpenWoo bruikbaar en kan bijvoorbeeld worden ingezet vanuit de website, zaaksysteem of klant contact centrum om burgers, inwoners en medewerkers van relevante informatie te voorzien.

## Federatief (Landelijk) zoeken

OpenWoo.app maakt gebruik van de federatieve zoekvraag ontwikkeld binnen OpenCatalogi om verschillende integrale zoekvragen virtueel samen te voegen. Simpel gezegd roept de landelijke zoek-API meerdere instanties van Open Index aan en aggregeert de resultaten. Technisch zitten daar nog wat haken en ogen aan die binnen Open Index worden uitgelegd. Er wordt hierbij dus géén gebruik gemaakt van een landelijke index, het geen data duplicatie voorkomt en organisaties zelf in controle houdt op hun publicaties. Dit dit concept is verder uitgewerkt in koophulpje.nl waarbij ook een voorziening is gerealiseerd voor het genereren van robot.txt en sitemap.xml bestanden (ten behoeve van KOOP). De facto is hiermee dus ook een landelijke Woo-API gerealiseerd met de beperking dat deze alleen organisaties bevat die participeren in OpenWoo.app De bevragingen tussen de federale zoekvraag en de verschillende organisaties kan via NLX/FSC lopen, of daarbuiten. Gezien het publieke bevragingen zijn op openbare informatie is NLX an sich niet verplicht en kan het inregelen van een PKI-certificaat nodeloos complex zijn. Dat gezegd hebbende biedt NLX ook voordelen met betrekking tot het monitoren en loggen van verkeer.

## Domeinen

OpenWoo.app is een organisatie specifieke applicatie waarvan de installaties onderling een federatief netwerk vormen. Dat kan het wat onduidelijk maken wat waar leeft.

| Type | Domein | Status | Type |
|------|--------|--------|------|
| Federatief | koophulpje.nl | productie | Publicatiepagina |
| Federatief | acceptatie.koophulpje.nl | acceptatie | Publicatiepagina |
| Organisatie Specifiek | [organisatie_naam].koophulpje.nl | productie | Publicatiepagina |
| Organisatie Specifiek | acceptatie.[organisatie_naam].koophulpje.nl | acceptatie | Publicatiepagina |
| n.v.t | OpenWoo.app | productie | Product Pagina |
| n.v.t | acceptatie.OpenWoo.app | acceptatie | Product Pagina |
| Organisatie Specifiek | [organisatie_naam].OpenWoo.app | productie | Publicatiepagina |
| Organisatie Specifiek | acceptatie.[organisatie_naam].OpenWoo.app | acceptatie | Publicatiepagina |
| Federatief | api.OpenWoo.app | productie | API |
| Federatief | acceptatie.api.OpenWoo.app | acceptatie | API |
| Organisatie Specifiek | api.[organisatie_naam].OpenWoo.app | productie | API |
| Organisatie Specifiek | acceptatie.api.[organisatie_naam].OpenWoo.app | acceptatie | API |

Dit zijn de aangeboden domeinen vanuit OpenWoo.app, daarnaast zien de dat de meeste organisaties hun publicatiepagina ontsluiten op hun eigen domein e.g. open.[organisatie_naam].nl

## Documenten vs Publicatieobjecten

Vanuit de Woo denken we doorgaans aan documenten die gepubliceerd moeten worden. Vanuit OpenWoo.app denken we echter in termen van publicatieobjecten waaraan één of meer documenten kunnen worden gekoppeld. Publicatieobjecten bevatten de metadata waarmee documenten kunnen worden gevonden, geclusterd en weergegeven, zoals thema's en typen. Ook kunnen publicatieobjecten aan elkaar worden gerelateerd. Dit is vooral relevant in raadsinformatiesystemen, waar een stuk hoort bij een agenda-item, dat weer hoort bij een agenda van een vergadering en gekoppeld kan zijn aan stemgedrag van personen of fracties.

Het onderling aan elkaar relateren van publicatieobjecten leidt onder water tot een driedimensionaal datamodel en is een van de redenen waarom er binnen OpenWoo.app is gekozen voor linked data.

## Metadata

Ieder publicatie object beschikt over een type (bijvoorbeeld woo_verzoek) en een voorgedefinieerde metadataset. De metadataset beschrijft wat er in de publicatie aan gegevens wordt verwacht en typeert deze (bijvoorbeeld heeft titel, de titel is een string) en biedt daarmee context voor de weergave van de publicatie. Dit biedt de search UI de mogelijkheid om cards te maken die geoptimaliseerd zijn voor specifieke WOO-categorieën en een algemene card voor niet op voorhand gedefinieerde of onbekende categorieën.

Dat laatste kan voorkomen als een organisatie zelf metadata sets toevoegt, dat mag. Het is mogelijk voor organisaties om zelf extra metadata beschrijvingen te definiëren en hierop te publiceren. Organisaties zijn daarmee ook niet gelimiteerd tot de door KOOP gedefinieerde categorieën. Dit is ook een van de redenen waarom zoeken in de UI de faceted search MOET implementeren (zie ook de architectuur documentatie van open catalogi). Het is niet op voorhand voorspelbaar op welke aspecten kan worden gezocht, dit is afhankelijk van de publicaties en gedefinieerde metadata zoals gepubliceerd door deelnemende organisaties.

## Roadmap

Organisaties kunnen bijdragen aan de ontwikkeling van deze componenten door items aan te dragen, deze zelf op te pakken en uit te voeren, of door de uitvoering ervan te financieren. Voor het huidige overzicht, zie Roadmap.
