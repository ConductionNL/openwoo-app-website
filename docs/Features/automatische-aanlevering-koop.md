# Automatische aanlevering aan KOOP

Aanmelden bij de Landelijke Index van KOOP, WooGLe en koophulpje gebeurt automatisch. Geen aparte uploadflow, geen handmatige metadata, geen tweede systeem dat synchroon moet blijven.

## Wat het doet

Zodra een publicatie in jouw Open Register is geaccordeerd, levert OpenWoo deze automatisch aan bij de landelijke indexen:

- **KOOP / Kennis- en Exploitatiecentrum Officiële Publicaties** — via een gegenereerde `sitemap.xml` en een TOOI-conforme API.
- **WooGLe (UvA / Wooverheid)** — gebruikt dezelfde mechanismen.
- **koophulpje.nl** — de federatieve zoek-API die parallel aan alle deelnemende OpenWoo-instances een zoekvraag stelt.

## Hoe het werkt

OpenWoo zorgt voor:

1. **`sitemap.xml`-generatie** met alle publieke publicatie-URL's, automatisch verversend bij elke wijziging.
2. **`robots.txt`** met de juiste directives voor crawlers van KOOP.
3. **Een publieke API** op `api.[organisatie].openwoo.app` die door de federatieve zoek bevraagd kan worden — met throttling en rate-limiting standaard ingeschakeld om de bron te beschermen.
4. **TOOI-metadata-mapping** zodat de aangeleverde records direct in het landelijke vocabularium passen.

## Waarom dat ertoe doet

KOOP-aanlevering "regelen" is een terugkerend stuk implementatiewerk dat veel gemeenten zien als een aparte project­fase. OpenWoo behandelt het als een standaardonderdeel van de install — net zoals je geen aparte project­fase aanmaakt voor "DNS instellen".

Diepere uitleg: [Federatief zoeken](../Architecture/federatief-zoeken.md).
