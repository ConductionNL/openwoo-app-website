# Actieve openbaarmaking

> "We willen de elf Woo-categorieën actief publiceren bij de bron, zonder dat medewerkers er handmatig achteraan moeten."

## De situatie

De Wet open overheid (Woo) verplicht overheden om informatie uit elf categorieën actief openbaar te maken. Een gemeente van ~50.000 inwoners produceert daarbinnen al snel duizenden publicaties per jaar — convenanten, klachtoordelen, beschikkingen, agenda's en notulen, jaarverslagen, en meer. Handmatig publiceren is geen tussenoplossing, het is gewoon geen oplossing.

## Hoe OpenWoo dat oplost

OpenWoo verandert publiceren van een afzonderlijke handeling in een natuurlijk gevolg van het werkproces.

1. **Eén register per categorie.** De elf Woo-categorieën worden elf typed registers in [OpenRegister](https://openregister.conduction.nl/), met vaste metadata en validatie. Een convenant is een convenant, geen los PDF'je in SharePoint.
2. **De bron blijft leidend.** [OpenConnector](https://openconnector.conduction.nl/) leest publicaties uit het bestaande zaaksysteem, DMS of raadsinformatiesysteem. Wat je medewerkers daar afronden, komt automatisch in het register terecht.
3. **Beheer met checks-and-balances.** Een publicatie komt eerst in concept binnen. Een beheerder (of een geautomatiseerde regel) accordeert. Pas daarna wordt de publicatie via OpenCatalogi op `jouwgemeente.nl/woo` zichtbaar — met audit log, citation-stable URL en federatie naar de landelijke index.

## Wat krijgen burgers daarmee

Eén plek, één zoekbalk, alle openbare informatie van de organisatie. Faceted search op categorie, datum, thema. Stabiele URL's die ook over drie jaar nog werken, ook na een herorganisatie of platformmigratie.

## Vervolg

- [Publicatie vanuit je zaaksysteem](./publicatie-vanuit-zaaksysteem.md) — hoe de koppeling met Zaaksysteem.nl, DECOS of een ander DMS er concreet uit ziet.
- [Architectuur — overzicht](../Architecture/overview.md) — de drie samenwerkende componenten op een rij.
- [Naar productie](../Technical/production.md) — de stappen om OpenWoo in productie te nemen.
