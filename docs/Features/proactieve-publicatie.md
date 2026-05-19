# Proactieve publicatie

De Wet open overheid verplicht overheden tot proactieve openbaarmaking — informatie publiceren zónder dat een burger erom hoeft te vragen. OpenWoo automatiseert die publicatie zoveel mogelijk, zonder de menselijke check op cruciale momenten weg te halen.

## Wat het doet

OpenWoo verandert publiceren van een aparte handeling in een uitvloeisel van het normale werkproces. Zaken die in het zaaksysteem worden afgerond, komen automatisch in een conceptpublicatie terecht. Vanaf daar:

- **Automatische accordering** (op basis van configureerbare regels): voor categorieën met laag risico kan een publicatie direct na binnenkomst publiek gemaakt worden.
- **Handmatige accordering** (voor risicovollere categorieën): een beheerder controleert metadata, anonimisering, en bijlagen voordat ze accordeert.
- **Hybride flows**: bijvoorbeeld automatische accordering mits het document is gemarkeerd "gecontroleerd op persoonsgegevens" in het zaaksysteem.

## Hoe het werkt

OpenWoo ondersteunt twee automatiserings­patronen op de publicatie­flow:

- **BPMN-tasks (Camunda)** — afgetrapt op een notificatiebericht uit het zaaksysteem.
- **Nextcloud-workflows** — voor lichtere, organisatie-specifieke regels.

Beide kunnen worden ingezet voor automatisch publiceren, automatisch terugtrekken (bijv. bij DSO-publicaties met een vervaltermijn), of voor escalatie naar een beheerder bij twijfelgevallen.

## Waarom dat ertoe doet

Handmatig publiceren werkt voor 50 publicaties per jaar. Het werkt niet voor 5000 publicaties per jaar — wat de actuele realiteit is voor een middelgrote gemeente. Proactieve publicatie betekent dat de Woo-verplichting praktisch invulbaar is zónder een nieuwe afdeling op te tuigen.

Diepere uitleg: [Motorblok — beheer en workflow­patronen](../Architecture/motorblok.md).
