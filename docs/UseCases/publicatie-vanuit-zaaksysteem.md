# Publicatie vanuit je zaaksysteem

> "We werken al in xxllnc Zaken, DECOS of Djuma (of 1 van de andere bronnen). We willen daar onze publicatieflow houden — niet nóg een systeem erbij."

## De situatie

Voor de meeste Nederlandse gemeenten is het zaaksysteem of DMS de bron van waarheid voor publicabele informatie: beschikkingen, klachtoordelen, vergunningen, convenanten. Het zaakproces sluit af met een publicatiedatum, een definitief document en (idealiter) een al uitgevoerde anonimisering. Wat overheden nodig hebben, is dat die afgeronde zaken automatisch hun weg vinden naar de publieke Woo-portal via een vervolgzaak.

## Hoe OpenWoo dat oplost

[OpenConnector](https://openconnector.conduction.nl/) heeft koppelvlakken voor de meeste Nederlandse zaaksystemen en DMS'en — zie [Ondersteunde bronnen](../Integrations/ondersteunde-bronnen.md) voor het actuele overzicht. De flow is steeds ongeveer dezelfde:

1. **OpenConnector synchroniseert** — bij voorkeur op notificatie (Pub/Sub), anders via een crawl. Per zaaktype worden alleen zaken opgehaald die voldoen aan de publicatiecriteria.
2. **De zaak wordt een publicatie­object in OpenRegister.** Metadata wordt gemapt op het Woo-schema. Documenten worden als bijlagen gekoppeld.
3. **OpenCatalogi indexeert** de publicatie en maakt hem doorzoekbaar op het lokale Woo-portaal.
