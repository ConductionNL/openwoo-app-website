# Publicatie vanuit je zaaksysteem

> "We werken al in Zaaksysteem.nl (of DECOS, of Djuma). We willen daar onze publicatieflow houden — niet nóg een systeem erbij."

## De situatie

Voor de meeste Nederlandse gemeenten is het zaaksysteem de bron van waarheid voor publicabele informatie: beschikkingen, klachtoordelen, vergunningen, convenanten. Het zaakproces sluit af met een publicatiedatum, een definitief document en (idealiter) een al uitgevoerde anonimisering. Wat overheden nodig hebben, is dat die afgeronde zaken automatisch hun weg vinden naar de publieke Woo-portal.

## Hoe OpenWoo dat oplost

[OpenConnector](https://openconnector.conduction.nl/) heeft koppelvlakken voor de meeste Nederlandse zaaksystemen en DMS'en — zie [Ondersteunde bronnen](../Integrations/ondersteunde-bronnen.md) voor het actuele overzicht. De flow is steeds dezelfde:

1. **OpenConnector synchroniseert** — bij voorkeur op notificatie (Pub/Sub), anders via een nachtelijke crawl. Per zaaktype worden alleen zaken opgehaald die voldoen aan de publicatiecriteria.
2. **De zaak wordt een publicatie­object in OpenRegister.** Metadata wordt gemapt op het Woo-schema. Documenten worden als bijlagen gekoppeld.
3. **Beheer en accordering** gebeurt in de Admin-UI van OpenRegister. Een gemeente kan ervoor kiezen om publicaties automatisch te accorderen (mits aan voorwaarden voldaan), of om handmatige controle te vereisen.
4. **OpenCatalogi indexeert** de geaccordeerde publicatie en maakt hem doorzoekbaar op het lokale Woo-portaal en (optioneel) de federatieve landelijke index.

## Concrete voorbeelden

Twaalf gemeenten draaien dit nu in productie. De [solutions-pagina](https://www.conduction.nl/solutions/openwoo) heeft de actuele lijst — Tilburg combineert Zaaksysteem.nl met Sharepoint, RXMission én Notubiz; Hoeksche Waard draait op DECOS; Helmond op Djuma. Andere gemeenten hebben varianten van Zaaksysteem.nl.

## Vervolg

- [Bron koppelen](../Integrations/bron-koppelen.md) — als je bron nog niet wordt ondersteund.
- [API-koppelvlak](../Integrations/api-koppelvlak.md) — als je een eigen UI op de OpenWoo-data wilt bouwen.
- [Configuratie](../Technical/configuration.md) — welke environment-variabelen waar gezet moeten worden.
