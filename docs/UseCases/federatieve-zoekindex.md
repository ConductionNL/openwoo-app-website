# Federatieve zoekindex

> "We willen meedoen aan de landelijke federatieve zoek via KOOP en WooGle, maar we willen géén data­duplicatie en we willen zélf in controle blijven op onze publicaties."

## De situatie

De Woo gaat over openbaarheid. Burgers, journalisten en Tweede Kamer­leden moeten over álle overheidsorganisaties heen kunnen zoeken — niet één gemeente tegelijk. Maar de gangbare oplossing — alle publicaties uploaden naar een centrale landelijke index — schuurt: de bron raakt grip op haar eigen data kwijt, depubliceren wordt lastig, en bij iedere wijziging moet er weer geüpload worden.

## Hoe OpenWoo dat oplost

OpenWoo gebruikt een **federatief** model in plaats van een centraal model: de landelijke zoek-API roept meerdere organisatie-specifieke instances van Open Index aan en aggregeert de resultaten. Géén data­duplicatie — de bron blijft leidend.

Concreet:

- **Lokaal blijft lokaal.** Je publicaties leven in jóuw Open Register en Open Index — onder jouw beheer, onder jouw URL (`open.jouwgemeente.nl`).
- **Federatie via koophulpje.nl.** De landelijke voorziening op [koophulpje.nl](https://koophulpje.nl/) bevraagt parallel alle deelnemende OpenWoo-instances en aggregeert de resultaten. Burgers zoeken op één plek, organisaties houden grip op hun eigen data.
- **KOOP-aanlevering uit de doos.** Voor de Landelijke Index van KOOP genereert OpenWoo automatisch `sitemap.xml`-bestanden + een API die voldoet aan de TOOI-standaard. WooGle van de UvA gebruikt dezelfde mechanismen.
- **Optioneel via NLX/FSC.** Voor monitoring en logging kun je het verkeer via NLX/FSC laten lopen. Niet verplicht (het zijn immers publieke bevragingen op openbare data), maar wel handig.

## Wat krijg je daarmee

- Burgers zoeken over alle deelnemende gemeenten heen, vinden direct het origineel.
- Jij depubliceert (bij een foutje, een persoonsgegeven dat per ongeluk doorglipte) direct in je eigen Open Register — en seconden later is de wijziging zichtbaar in elke federatieve zoekvraag.
- KOOP-aanlevering kost geen aparte project­fase: zodra je deelneemt aan OpenWoo, ben je vindbaar op de Landelijke Index.

## Vervolg

- [Federatief zoeken](../Architecture/federatief-zoeken.md) — technisch hoe de federatie werkt.
- [Naar productie](../Technical/production.md) — de stappen om jouw OpenWoo-instance aangemeld te krijgen bij KOOP en de federatieve index.
