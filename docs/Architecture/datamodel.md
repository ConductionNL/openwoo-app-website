# Datamodel

## Documenten versus publicatie-objecten

Vanuit de Woo denken we doorgaans aan documenten die gepubliceerd moeten worden. Vanuit OpenWoo denken we echter in termen van publicatie-objecten waaraan één of meer documenten kunnen worden gekoppeld. Publicatie-objecten bevatten de metadata waarmee documenten kunnen worden gevonden, geclusterd en weergegeven, zoals thema's en typen.

Ook kunnen publicatie-objecten aan elkaar worden gerelateerd. Dit is vooral relevant in raadsinformatie­systemen, waar een stuk hoort bij een agenda-item dat weer hoort bij een agenda van een vergadering en gekoppeld kan zijn aan stemgedrag van personen of fracties.

Het onderling aan elkaar relateren van publicatie-objecten leidt onder water tot een driedimensionaal datamodel, en is een van de redenen waarom er binnen OpenWoo is gekozen voor linked data.

## Metadata

Ieder publicatie-object beschikt over een type (bijvoorbeeld `woo_verzoek`) en een voorgedefinieerde metadataset. De metadataset beschrijft wat er in de publicatie aan gegevens wordt verwacht en typeert deze (bijvoorbeeld "heeft titel; de titel is een string") en biedt daarmee context voor de weergave van de publicatie. Dit biedt de search-UI de mogelijkheid om cards te maken die geoptimaliseerd zijn voor specifieke Woo-categorieën, en een algemene card voor niet op voorhand gedefinieerde of onbekende categorieën.

Dat laatste kan voorkomen als een organisatie zelf metadatasets toevoegt — dat mag. Het is mogelijk voor organisaties om zelf extra metadata­beschrijvingen te definiëren en hierop te publiceren. Organisaties zijn daarmee ook niet gelimiteerd tot de door KOOP gedefinieerde categorieën.

Dit is ook een van de redenen waarom zoeken in de UI faceted search **moet** implementeren (zie ook de architectuurdocumentatie van OpenCatalogi). Het is niet op voorhand voorspelbaar op welke aspecten kan worden gezocht; dit is afhankelijk van de publicaties en gedefinieerde metadata zoals gepubliceerd door deelnemende organisaties.

## Concrete metadata per categorie

Voor de concrete properties per Woo-categorie (algemene properties, convenanten, Woo-verzoeken, klachtoordelen) zie [API-koppelvlak — Metadata](../Integrations/api-koppelvlak.md#metadata).
