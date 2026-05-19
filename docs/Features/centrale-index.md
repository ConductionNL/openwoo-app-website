# Centrale index

Eén overzichtelijke locatie voor alle openbare data van je organisatie. Burgers, journalisten en onderzoekers vinden alles via één zoekbalk in plaats van per bronsysteem te zoeken.

## Wat het doet

OpenWoo bouwt — via [OpenCatalogi](https://opencatalogi.conduction.nl/) bovenop [OpenRegister](https://openregister.conduction.nl/) — één doorzoekbare index van alle Woo-categorieën van een organisatie. Niet één index per zaaksysteem, niet één per categorie, maar één centrale plek waar de hele publicatiehuishouding samenkomt.

## Hoe het werkt

- Elke Woo-categorie is een typed register in OpenRegister.
- OpenCatalogi indexeert deze registers in Open Index (Elasticsearch onder de motorkap, met JSON-LD bovenop voor semantische context).
- De zoek-UI biedt **faceted search** — burgers kunnen filteren op categorie, datum, thema, organisatie­onderdeel, en zelfs op organisatie-specifieke metadata-uitbreidingen.

## Waarom dat ertoe doet

Burgers willen niet weten dat een vergunning uit het zaaksysteem komt, een convenant uit Sharepoint, en een raadsbesluit uit Notubiz. Ze willen het document vinden. De centrale index zet die scheiding opzij.

Diepere uitleg: [Motorblok](../Architecture/motorblok.md) en [Federatief zoeken](../Architecture/federatief-zoeken.md).
