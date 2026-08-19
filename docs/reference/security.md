---
sidebar_position: 4
---

# Beveiliging

Wij geloven in het integreren van beveiliging in de kern van ons ontwikkelingsproces. We maken gebruik van geautomatiseerde penetratietesten en scanning als onderdeel van onze Continuous Integration en Continuous Deployment (CI/CD) pipeline. Deze aanpak stelt ons in staat om mogelijke beveiligingskwetsbaarheden vroegtijdig te identificeren en aan te pakken, tijdens de ontwikkelingsfase in plaats van later in de productiefase.

## Design Principes
Goede beveiliging begint bij het ontwerp, dat geld zeker voor de Woo. We hebben er dan ook bewust voor gekozen om van het WOO register en publicatie platform een apparte applicatie te maken ten opzichte van de afhandel applicatie voor Woo verzoeken en anonimiseringstool.

We hebben daardoor als design principe kunnen afspreken dat het woo-register géén persoon gegeven mag bevatten. Ofwel alleen maar gegevens die daadwerkelijk mogen worden gepubliceerd. Hiermee geven we ultieme invulling aan het concept dataminimalisatie.

Een tweede design principe betreft bronnen, vanuit bronnen willen we alleen publieke informatie ontvangen. Hierop moet de bron een harde garantie kunnen afgeven aan de hand van autorisatie en filtering. Op deze manier voorkomen we per abuis toch persoonsinformatie kunnen ophalen.

Gezamenlijk minimaliseren we op deze manier het risico bij een eventueel lek, in het meest extreme geval zou de volledige index en alle autorisatie sleutels kunnen worden ontvreemd maar zou hierbij alsnog geen data worden verloren die niet reeds tot het publieke domein behoord.

## Als onderdeel van de development
Onze CI/CD-pipeline bevat ook geautomatiseerde scannertools die onze broncode, containers en cloud-infrastructuur controleren op beveiligingsproblemen.
Broncodescanners analyseren onze code om beveiligingszwaktes te vinden, zoals die vermeld staan in de [OWASP](https://owasp.org/) Top 10-lijst van veelvoorkomende beveiligingsrisico's.


