# Audit log

Elke publicatie, elke wijziging, elke terugtrekking, elke beheerdersactie wordt tamper-evident vastgelegd. Het bewijsmateriaal dat je nodig hebt bij een Woo-audit, bezwaar­procedure of journalistieke vraag is onderdeel van de install — geen project van een jaar.

## Wat het doet

[OpenRegister](https://openregister.conduction.nl/) — het register­component onder OpenWoo — heeft een ingebakken audit log. Voor elke publicatie wordt vastgelegd:

- **Wat** is er gewijzigd: welke metadata, welke bijlage, welke status­overgang.
- **Wanneer** is het gewijzigd: tamper-evident timestamp.
- **Door wie** is het gewijzigd: geauthenticeerde gebruiker uit Nextcloud, of geautomatiseerde flow.
- **Waarom** (optioneel): toelichting bij gevoelige acties zoals terugtrekken.

## Hoe het werkt

De audit log is geen los systeem dat je naast je publicatieproces draait — het is een gegarandeerd by-product van OpenRegister. Elke schrijfactie op een publicatie­object genereert een audit-record. Records zijn citation-stable: een eenmaal vastgelegd record kan niet meer worden aangepast, alleen aangevuld.

Voor publicaties met externe gevolgen (een terugtrekking die door media is opgepikt; een herziening na bezwaar) levert dit het volledige paper trail dat juristen en journalisten nodig hebben om de gang van zaken te reconstrueren.

## Waarom dat ertoe doet

Audit-bewijs is doorgaans iets dat aan de oplossing wordt toegevoegd — een SIEM, een log-aggregator, een tweede database voor compliance. Dat werkt zolang niemand er gebruik van maakt. Op het moment dat het er écht toe doet — een terugtrekking is in opspraak, een bezwaar wordt gevoerd — is de audit-trail meestal incompleet of moeilijk reproduceerbaar.

OpenWoo behandelt audit als een first-class burger van de architectuur. Het feit dat je het nooit hoeft te configureren, is precies waarom het er nog is als je het nodig hebt.

Diepere uitleg: [Datamodel](../Architecture/datamodel.md) en [Beveiliging](../reference/security.md).
