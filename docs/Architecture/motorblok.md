# Motorblok (onderdeel 2)

Het kloppende hart (of motorblok) onder het publicatieplatform is het Common Ground-project OpenCatalogi. Vanuit dit project nemen we twee componenten over: Open Index en Open Registers.

## Open Index

Open Index stelt ons in staat om snel en organisatie-overstijgend te zoeken in meerdere Woo-categorieën tegelijkertijd. Hierbij wordt onder water gebruikgemaakt van Elasticsearch. Open Index normaliseert en standaardiseert Elasticsearch voor ons door het toevoegen van JSON-LD, contextuele metadata, organisaties, directory en catalogi, waardoor de onderliggende infrastructuur ontstaat voor een federatieve zoekvraag. Het vormt daarmee het hart van zoeken in OpenWoo. Meer informatie over hoe we de techniek van Open Index inzetten vind je in de architectuurdocumentatie van OpenCatalogi.

## Open Registers

Open Registers levert voor ons een publicatieregister waar publicaties binnenkomen (automatisch aan de hand van synchronisatie of handmatig) en waar we deze behandelen voordat ze verder worden gecommuniceerd naar Open Index.

Er is dus een bewuste en harde scheiding tussen de werkbak (Open Registers) en de publicatiebak (Open Index). De zoek-API (en daarmee de burger-interface) maakt gebruik van de zoekbak. De medewerkers maken via de Admin-UI en beheerinterface gebruik van Open Registers om publicaties te behandelen. Onder het behandelen van publicaties verstaan we onder andere:

- Controleren en aanvullen van metadata;
- Toevoegen van documenten;
- Controleren van anonimisering;
- Eventueel anonimiseren a.h.v. een externe service;
- Accorderen voor publicatie;
- Eventueel terugtrekken van publicaties;
- Archiveren.

Het publicatieprincipe ondersteunt niet alleen de Woo, maar ook WHO en DSO.

Afhankelijk van de specifieke configuratiewensen van overheden kunnen sommige van deze handelingen worden geautomatiseerd (bijvoorbeeld het terugtrekken van een DSO-publicatie die ter inzage ligt, na het verloop van de termijn). Hiervoor ondersteunen we twee patronen:

- Een BPMN-task (Camunda) die wordt afgetrapt naar aanleiding van een notificatiebericht;
- Een Nextcloud-workflow.

## OpenWoo-service

OpenWoo Service, gebaseerd op het Common Ground Open Services-framework, faciliteert het inlezen van externe bronnen naar Open Index toe. Hierbij wordt bij voorkeur gebruikgemaakt van een Pub/Sub-principe (abonnement op notificaties vanuit de bron), maar kan ook (indien gewenst) gebruikgemaakt worden van crawling.

| Component       | Leverancier | Meer informatie |
|-----------------|-------------|-----------------|
| Open Index      | Conduction  | Documentatie    |
| Open Registers  | Conduction  | Documentatie    |
| OpenWoo-service | Conduction  | Documentatie    |

## Hoe werkt het scrapen vanuit de Woo-service?

De Woo-service "scraped" elke nacht alle relevante informatie en synchroniseert deze met de publicatie-objecten in Open Registers. De stappen zijn (bijvoorbeeld bij een zaaksysteem) als volgt:

1. Ophalen van alle zaaktypen.
2. Per zaaktype worden de beschikbare eigenschappen gecontroleerd (zie [inrichting zaaksysteem](../Integrations/bron-koppelen.md)).
3. Voor elk zaaktype dat aan de voorwaarden voldoet worden de zaken opgehaald.
4. Per zaak wordt gecontroleerd of er een publicatiedatum is; zo ja, wordt de zaak opgenomen of bijgewerkt als publicatie-object in Open Registers.
5. Zaken die niet zijn gevonden in bovenstaande loop, maar wel in Open Registers staan, worden gedepubliceerd (ingetrokken) en geoormerkt.

Het bovenstaande proces zorgt ervoor dat het zaaksysteem leidend is en dat zaken zowel kunnen worden gepubliceerd als worden ingetrokken.
