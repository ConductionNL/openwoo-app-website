# Architectuur — overzicht

## Doel van OpenWoo

OpenWoo heeft als doel om een ecosysteem van samenwerkende componenten te bieden dat voorziet in de volgende functionaliteit:

- ✅ Opslag en ontsluiting van documenten en metadata middels API's;
- ✅ Het indexeren van documenten en metadata, en het ontsluiten van zoekresultaten middels API's;
- ✅ Het werken met (concept) publicaties;
- ✅ Het uploaden, registreren en publiceren van documenten en metadata door medewerkers;
- ✅ Het (door)zoeken, vinden en raadplegen van documenten en metadata door burgers;
- ✅ Het beheren van autorisaties, configuratie en publicaties door beheerders;
- ✅ Integratie met de landelijke voorziening PLOOI/KOOP, WooGLe, Koophulpje, DSO;
- ✅ Integratie met standaard gemeentelijke bronnen zoals een zaaksysteem, raadsinformatiesysteem of website;
- ✅ Afhandelingsflow voor zowel publiceren als Woo-verzoeken;
- ✅ Het kunnen terugtrekken van publicaties t.b.v. herstel op procedurele fouten;
- ✅ Helpfunctie voor medewerkers aan de hand van werkinstructies;
- ✅ Interne publicaties die niet openbaar toegankelijk zijn;
- 🔄 (Roadmap) Generatie van documenten ten behoeve van publiceren en inhoudslijsten;
- 🔄 (Roadmap) Koppeling met anonimiseringssoftware;
- 🔄 (Roadmap) Naar PDF kunnen omzetten van documenten;
- 🔄 (Roadmap) Archiveren;
- 🔄 (Roadmap) Opslaan van zoekfilters en resultaten;
- 🔄 (Roadmap) Abonneren op nieuwe publicaties die voldoen aan een opgeslagen zoekfilter;
- 🔄 (Roadmap) Anonimiseren in de regie-interface;
- 🔄 (Roadmap) Advies over taalniveau;
- 🔄 (Roadmap) Federatieve zoekvraag.

We hebben deze functionaliteit opgedeeld in drie blokken:

1. [Publicatieplatform](./publicatieplatform.md) — de UI/frontend waar burgers de publicaties vinden.
2. [Motorblok](./motorblok.md) — Woo-service, Open Index en Open Register.
3. [Bronnen](../Integrations/ondersteunde-bronnen.md) — de zaaksystemen, DMS'en en raadsinformatiesystemen waaruit publicaties worden opgehaald.

Secundair doel daarbij is wat idealistischer: om een gemeenschappelijke codebase te realiseren die door meerdere leveranciers kan worden uitgeleverd en deze vanaf dag één te betrekken. Het voorkomen van een lock-in vraagt om een open source oplossing die door en door begrepen wordt door meerdere marktpartijen.

## Hergebruik tot op het bot

OpenWoo maakt voor haar onderliggende techniek en architectuur gebruik van OpenCatalogi. Meer technische informatie over publiceren naar het federatief datastelsel vind je dan ook in de architectuurdocumentatie van OpenCatalogi. Er zijn echter een paar zaken die we binnen OpenWoo aanvullend regelen.

In plaats van de standaard OpenCatalogi-voorkant gebruikt OpenWoo een publicatiepagina die geoptimaliseerd is voor de Woo. Dit kan een (sub)site zijn bij de websiteleverancier van de gemeente, of een van de twee losstaande React-pagina's. We laten de keuze hiervoor bewust bij de deelnemende overheden zelf.

We gebruiken een aantal aanvullende metadata-modellen in plaats van DCAT en PublicCode; deze worden landelijk onderhouden.

We maken gebruik van een losse WOO-(micro)service die vanuit verschillende bronnen (o.a. zaaksystemen en raadsinformatiesystemen) informatie ophaalt en klaarzet als publicatie. Of en hoe publicaties vervolgens automatisch worden gepubliceerd is een configuratiekeuze.

Er is naast de standaard beheeromgeving van OpenCatalogi ook een Publicatie-Taakapplicatie beschikbaar die specifiek gericht is op het (handmatig) verwerken van Woo-verzoeken en beheren van publicaties.

In een meer algemene zin hebben we bij OpenWoo voor andere (sub)doelgroepen gekozen dan binnen OpenCatalogi: inwoners, onderzoekers, journalisten, raadsleden en ondernemers staan centraal.

## Uitdagingen

Bij het ontwikkelen van een publicatievoorziening komen een aantal uitdagingen in beeld:

- Woo-gegevens staan vaak opgeslagen in bronnen die niet makkelijk toegankelijk zijn.
- De scope van de Woo (alle niet-vertrouwelijke gegevens) in combinatie met het concept actieve openbaarmaking raakt de volledige informatiehuishouding.
- Handmatig publiceren kan daarmee geen eindoplossing zijn, maar eigenlijk ook al geen tussenoplossing.
- Er mogen géén fouten worden gemaakt met anonimiseren; dit vraagt om een afgebakende procesflow met checks en balances rondom publiceren.

Dat leidt tot de conclusie dat we niet op zoek zijn naar een Woo-publicatieplatform maar een algemene publicatievoorziening die één of meerdere publicatiekanalen kan "voeden". Daarbij denken we naast de Woo-Index (KOOP) ook nadrukkelijk aan een organisatie-eigen publicatieplatform, WooGLe en bijvoorbeeld een gemeentelijke website. In het verlengde hiervan liggen ook DROP, SDG, algoritmeregisters en WHO als kanalen die vanuit een generiek publicatieplatform moeten kunnen worden ontsloten.

## Belangrijkste verschillen ten opzichte van OpenWoo 1.0

**Splitsing opslag en search.** Binnen OpenWoo 1.0 werd één MongoDB-instance als opslag en search gebruikt. We hebben deze zowel qua opslag uit elkaar getrokken in een Elasticsearch- en ORC-instantie, als verdeeld over twee aparte API's (zoeken en beheer).

**Lostrekken integratiecomponent.** De 1.0-versie was direct gebouwd op de Common Gateway, een integratievoorziening. Vanaf 2.0 zijn de zoek-API en beheer-API gepositioneerd als losse componenten die (desgewenst) ook op NLX/FSC kunnen worden ontsloten.

**Publicatieflow.** De 1.0-versie was gebouwd op de gedachte dat objecten vanuit de bron altijd automatisch moesten worden gepubliceerd. In de 2.0 is dit omgedraaid: er wordt vanuit gegaan dat er actief beheer is op publicaties en dat ze pas worden gepubliceerd als daartoe is geaccordeerd. Wel kunnen er nog steeds automatische spelregels worden afgesproken.

## Totaalplaatje

De drie onderdelen samen geven ons een totaalbeeld van samenwerkende componenten die als ecosysteem een oplossing leveren. Voor de verdere diepte:

- [Publicatieplatform](./publicatieplatform.md) — UI-frameworks en codebases per leverancier.
- [Motorblok](./motorblok.md) — Open Index, Open Register, OpenWoo-service, en hoe scraping werkt.
- [Federatief zoeken](./federatief-zoeken.md) — Integraal en landelijk doorzoekbaar maken.
- [Datamodel](./datamodel.md) — Publicatieobjecten en metadata.
- [Bronnen](../Integrations/ondersteunde-bronnen.md) — De ondersteunde zaaksystemen, DMS'en en raadsinformatiesystemen.

## Bijdragen aan de roadmap

Organisaties kunnen bijdragen aan de ontwikkeling van deze componenten door items aan te dragen, deze zelf op te pakken en uit te voeren, of door de uitvoering ervan te financieren. Voor het huidige overzicht, zie [Roadmap](../reference/roadmap.md).
