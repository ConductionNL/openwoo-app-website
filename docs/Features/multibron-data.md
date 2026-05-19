# Multibron-dataweergave

Naadloze integratie van data uit diverse bronsystemen — zaaksystemen, websites, raadsinformatie­systemen, archieven, SharePoint — gepresenteerd onder één coherente noemer.

## Wat het doet

Eén Woo-portaal trekt parallel uit meerdere bronsystemen. Tilburg combineert bijvoorbeeld Zaaksysteem.nl, SharePoint, RXMission en Notubiz in één publieke portal. Andere gemeenten gebruiken DECOS, Djuma, OpenZaak, of een mengvorm.

## Hoe het werkt

- [OpenConnector](https://openconnector.conduction.nl/) heeft uit-de-doos-koppelvlakken voor de gangbare Nederlandse zaaksystemen en DMS'en — zie [Ondersteunde bronnen](../Integrations/ondersteunde-bronnen.md).
- Voor elke bron gebeurt de mapping naar het canonieke Woo-publicatieschema in OpenRegister. De medewerker in de zoek-UI hoeft niet te weten waar de publicatie oorspronkelijk vandaan komt.
- Bij voorkeur Pub/Sub (notificatie-driven), terugvallend op crawling waar nodig.

## Waarom dat ertoe doet

Geen enkele gemeente publiceert vanuit één systeem. Een Woo-tool die alleen één bron ondersteunt, sluit standaard de helft van de relevante publicaties uit. Multibron-ondersteuning is daarmee geen "nice-to-have" — het is de minimumvereiste om de Wet open overheid praktisch invulbaar te maken.

## Bron nog niet ondersteund?

Zie [Bron koppelen](../Integrations/bron-koppelen.md) voor de twee routes (eigen koppelvlak, of via de OpenWoo-community).
