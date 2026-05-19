# Publicatieplatform (onderdeel 1)

Woo-publicaties moeten ergens worden gepubliceerd; dat gebeurt via een organisatie­specifiek Woo-publicatieplatform. OpenCatalogi kent een eigen zoek-UI, maar voor de gemiddelde gemeente is die te generiek. Daarom zijn er vanuit het OpenWoo-project een aantal alternatieve user interfaces beschikbaar, waarbij de overheid zelf kan kiezen welke interface het beste bij haar past. Je kunt zowel kiezen voor de zoekinterface als los component, als voor een integratie binnen je huidige website.

:::note
Alle interfaces maken onderwater gebruik van de OpenCatalogi-zoek-API. De interface is dan ook niet te gebruiken zonder een OpenCatalogi-zoek-API.
:::

## Beschikbare frontends

| Component                     | Open source | Leverancier(s)         | Beschrijving |
|-------------------------------|-------------|------------------------|--------------|
| OpenCatalogi zoek-UI          | Ja          | Conduction             | Een losse NL Design-zoekpagina in de huisstijl van je organisatie. |
| OpenWoo default zoek-UI       | Ja          | Conduction, Shift2     | Een losse NL Design-zoekpagina in de huisstijl van je organisatie. |
| Tilburgse frontend            | Ja          | Acato                  | Een losse NL Design-zoekpagina in de huisstijl van je organisatie. |
| Integratie in Open Webconcept | Ja          | Yard, Conduction       | Een NL Design-weergavecomponent voor WordPress-websites. |
| Drupal-site                   | Ja          | Drupal voor Overheden  | Een weergavecomponent voor Drupal. |
| TYPO3-themasite               | Ja          | OpenGemeenten          | Een weergavecomponent voor TYPO3-websites. |

Naast het lokale publicatieplatform ondersteunt OpenWoo ook altijd de volgende landelijke publicatieplatformen:

- Een gestandaardiseerde verbinding met het Kennis- en Exploitatiecentrum Officiële Publicaties (KOOP);
- Een federale zoekvraag via koophulpje.nl;
- WooGLe van de Wooverheid van de UvA;
- KoopHulpje van OpenWoo;
- OpenCatalogi.nl van Rotterdam.

:::note
Voor open source componenten ben je natuurlijk niet beperkt tot deze leveranciers; dit zijn de op dit moment bij ons bekende leveranciers.
:::

Weet je niet welk frontend-framework je organisatie op dit moment gebruikt? Kijk eens op [Digimonitor](https://www.digimonitor.nl/).

## Codebases

Voor de installatie van OpenWoo zijn meerdere codebases beschikbaar. Dat heeft zowel een historische achtergrond als dat het een bewuste keuze is om van (met name UI-)componenten meerdere versies te hebben. Omdat deze ook nog eens over verschillende organisaties verdeeld zijn, kan het lastig zijn om overzicht te houden op welke code waar staat. We houden daarom hier een overzicht bij van de extra componenten en codebases ten opzichte van de standaard OpenCatalogi-componenten.

| Codebase | Rol                                            | Leverancier | Licentie |
|----------|------------------------------------------------|-------------|----------|
| GitHub   | Taakapplicatie publiceren, Publicatieplatform  | IO Digital  |          |
| GitHub   | Taakapplicatie publiceren                      | Acato       |          |
| GitHub   | Publicatieplatform                             | Acato       |          |
| GitHub   | Publicatieplatform                             | Yard        | EUPL     |
| GitHub   | Publicatieplatform                             | Conduction  | EUPL     |
| GitHub   | Synchronisatieservice                          | Conduction  | EUPL     |

Een paar opmerkingen daarbij:

- We gebruiken de synchronisatieservice van OpenCatalogi niet (die is immers gericht op GitHub, GitLab en DCAT); in plaats daarvan is er een Woo-synchronisatieservice gericht op ZGW, STUF, DRC en ORI.
- We gebruiken de voorkant van OpenCatalogi niet (die is immers software- en datagericht); in plaats daarvan hebben meerdere leveranciers eigen publicatieplatformen ontwikkeld.
