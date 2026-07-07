# Federatief zoeken

## Integraal (organisatiebreed) zoeken

De kern van de Woo is het zoeken in de openbare informatie van een overheidsorganisatie. Hierbij zou het in theorie niet mogen uitmaken in welke bron of applicatie informatie staat. Deze vorm van bron- en domeinoverstijgend zoeken kennen we vanuit de overheidsarchitectuur al langer en noemen we doorgaans de integrale zoekvraag.

OpenWoo geeft invulling aan deze integrale zoekvraag door de zoekfunctie op te splitsen in twee lagen die apart evolueren:

- **OpenRegister** is de data- en zoeklaag. Het bezit de opslag van publicaties en de zoekbackend (SQL `ILIKE` substring-match met optionele `pg_trgm`-fuzzy-mode, per schema doorzoekbaar). Elke OpenWoo-instantie draait haar eigen OpenRegister — data blijft bij de organisatie.
- **OpenCatalogi** is de catalogus- en federatielaag. Zij ontsluit de publicaties per organisatie via publieke endpoints en verzorgt daarnaast de federatieve fan-out over meerdere instanties.

Waarin OpenWoo afwijkt van een generieke zoekstack, is dat zij alleen publieke informatie via deze weg beschikbaar maakt: alleen publicaties met een geldige `publicatiedatum` en `published`-vlag komen terug in de resultaten. Dit heeft een aantal privacy-, security- en architectuurvoordelen.

Deze zoekfunctie is ook buiten OpenWoo bruikbaar en kan bijvoorbeeld worden ingezet vanuit de website, het zaaksysteem of het klantcontactcentrum om burgers, inwoners en medewerkers van relevante informatie te voorzien.

## Federatief (landelijk) zoeken

Federatief zoeken zit in **OpenCatalogi** en werkt via één publiek endpoint per instantie:

```
GET /apps/opencatalogi/api/federation/publications?_search=<term>
```

De aangeroepen instantie doet fan-out naar haar peer-instanties (bekend via de directory, zie hieronder), voegt de resultaten samen met de eigen lokale publicaties, voegt de facets van beide kanten samen, en geeft het geheel terug als één antwoord. Elk resultaat draagt een `@self.directory`-veld zodat de bron traceerbaar blijft; op het aggregaat staat `_performance.federation: true` zodat consumenten weten dat het antwoord federatief was.

Er wordt hierbij dus **géén** gebruik gemaakt van een landelijke index, wat data­duplicatie voorkomt en organisaties zelf in controle houdt op hun publicaties. Dit concept is verder uitgewerkt in koophulpje.nl, waarbij ook een voorziening is gerealiseerd voor het genereren van `robot.txt`- en `sitemap.xml`-bestanden (ten behoeve van KOOP). De facto is hiermee dus ook een landelijke Woo-API gerealiseerd, met de beperking dat deze alleen organisaties bevat die participeren in OpenWoo.

De bevragingen tussen de federatieve zoekvraag en de verschillende organisaties kunnen via NLX/FSC lopen, of daarbuiten. Aangezien het publieke bevragingen zijn op openbare informatie is NLX an sich niet verplicht en kan het inregelen van een PKI-certificaat nodeloos complex zijn. Dat gezegd hebbende, biedt NLX ook voordelen met betrekking tot het monitoren en loggen van verkeer.

### Peer discovery via de directory

Peer-instanties worden ontdekt via een centrale directory. Standaard staat die op `https://directory.opencatalogi.nl/apps/opencatalogi/api/directory`; per omgeving overschrijfbaar via de app-config-key `default_directory_url`. Iedere instantie registreert zich bij haar directory en synchroniseert periodiek de bekende peers (cron-sync + expliciete `connect-federation`-actie in de setup-wizard). Ingebouwde beveiligingslagen: anti-loop User-Agent-detectie tegen broadcast-storms, SSRF-guard op de outbound URL (blokkeert loopback / RFC1918 / cloud-metadata / non-https), en self-detection op host + port + `instance_aliases` zodat een instantie zichzelf niet als peer registreert.

De volledige beheer-workflow (peer toevoegen, scope kiezen, sync forceren, troubleshoot-logs) staat in de admin-runbook van OpenCatalogi: [`docs/tutorials/admin/02-manage-federation-sources.md`](https://codeberg.org/Conduction/opencatalogi/src/branch/development/docs/tutorials/admin/02-manage-federation-sources.md).

## Domeinen

OpenWoo is een organisatie­specifieke applicatie waarvan de installaties onderling een federatief netwerk vormen. Dat kan het wat onduidelijk maken wat waar leeft.

:::caution Beschikbaarheid — bijgewerkt 2026-07-07
Deze tabel beschrijft de **beoogde** domein-topologie; niet elke rij is op dit moment live/valide. Stand van zaken per 2026-07-07:

- `koophulpje.nl` — ✅ productie live (echt TLS-certificaat).
- `[organisatie_naam].koophulpje.nl` — deels live (bijv. `epe.koophulpje.nl` werkt; de meeste organisatie-subdomeinen zijn nog niet uitgerold).
- `acceptatie.koophulpje.nl` en `acceptatie.[organisatie_naam].koophulpje.nl` — ⚠️ server antwoordt maar met een ongeldig (Kubernetes-ingress) TLS-certificaat.
- `OpenWoo.app` — ⚠️ redirecte inmiddels naar `https://www.conduction.nl/solutions/openwoo/`; geen eigenstandige productpagina meer op dit domein.
- `acceptatie.OpenWoo.app` — ⚠️ server antwoordt maar met ongeldig TLS-certificaat.
- `[organisatie_naam].OpenWoo.app` en `acceptatie.[organisatie_naam].OpenWoo.app` — ❌ niet actief (getest: `epe.OpenWoo.app` → 404).
- `api.OpenWoo.app` — ❌ momenteel `503 Service Temporarily Unavailable` + ongeldig TLS-certificaat. De federatieve API leeft (nog) niet op dit domein.
- `acceptatie.api.OpenWoo.app` — ❌ 404 + ongeldig TLS-certificaat.
- `api.[organisatie_naam].OpenWoo.app` — ❌ geen DNS-wildcard (getest: `api.epe.OpenWoo.app` → NXDOMAIN).

Tot deze omissies zijn opgelost is de effectieve productieve federation-entry-point `koophulpje.nl` (plus de per-organisatie subdomeinen die daar wél op zitten).
:::

| Type                  | Domein                                       | Status     | Type             |
|-----------------------|----------------------------------------------|------------|------------------|
| Federatief            | koophulpje.nl                                | productie  | Publicatiepagina |
| Federatief            | acceptatie.koophulpje.nl                     | acceptatie | Publicatiepagina |
| Organisatie specifiek | [organisatie_naam].koophulpje.nl             | productie  | Publicatiepagina |
| Organisatie specifiek | acceptatie.[organisatie_naam].koophulpje.nl  | acceptatie | Publicatiepagina |
| n.v.t.                | OpenWoo.app                                  | productie  | Productpagina    |
| n.v.t.                | acceptatie.OpenWoo.app                       | acceptatie | Productpagina    |
| Organisatie specifiek | [organisatie_naam].OpenWoo.app               | productie  | Publicatiepagina |
| Organisatie specifiek | acceptatie.[organisatie_naam].OpenWoo.app    | acceptatie | Publicatiepagina |
| Federatief            | api.OpenWoo.app                              | productie  | API              |
| Federatief            | acceptatie.api.OpenWoo.app                   | acceptatie | API              |
| Organisatie specifiek | api.[organisatie_naam].OpenWoo.app           | productie  | API              |
| Organisatie specifiek | acceptatie.api.[organisatie_naam].OpenWoo.app| acceptatie | API              |

Dit zijn de aangeboden domeinen vanuit OpenWoo. Daarnaast zien we dat de meeste organisaties hun publicatiepagina ontsluiten op hun eigen domein, bijvoorbeeld `open.[organisatie_naam].nl`.
