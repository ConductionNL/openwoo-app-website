# Federatief zoeken

## Integraal (organisatiebreed) zoeken

De kern van de Woo is het zoeken in de openbare informatie van een overheidsorganisatie. Hierbij zou het in theorie niet mogen uitmaken in welke bron of applicatie informatie staat. Deze vorm van bron- en domeinoverstijgend zoeken kennen we vanuit de overheidsarchitectuur al langer en noemen we doorgaans de integrale zoekvraag.

OpenWoo geeft invulling aan deze integrale zoekvraag door de zoekfunctie op te splitsen in twee lagen die apart evolueren:

- **OpenRegister** is de data- en zoeklaag. Elke deelnemende organisatie draait haar eigen OpenRegister waarin haar publicaties leven en direct doorzocht kunnen worden. Data blijft daarmee altijd bij de bronorganisatie — er is geen kopie ergens anders in het netwerk.
- **OpenCatalogi** is de catalogus- en federatielaag. Zij ontsluit de publicaties van één organisatie via publieke endpoints en verzorgt daarnaast de federatieve zoekvraag zodra er over meerdere organisaties heen gezocht moet worden.

Alleen publieke informatie komt via deze weg beschikbaar: publicaties zonder geldige publicatiedatum of zonder expliciete publicatie-status blijven onzichtbaar voor externe zoekvragen. Dit heeft privacy-, security- en architectuurvoordelen ten opzichte van een klassieke centrale zoekindex.

Deze zoekfunctie is ook buiten OpenWoo bruikbaar en kan bijvoorbeeld worden ingezet vanuit de website, het zaaksysteem of het klantcontactcentrum om burgers, inwoners en medewerkers van relevante informatie te voorzien.

## Federatief (landelijk) zoeken

Federatief zoeken is in de kern een simpel principe: één binnenkomende zoekvraag wordt parallel doorgezet naar meerdere OpenCatalogi-instanties, en de antwoorden worden op één plek weer bij elkaar gebracht. Zo ontstaat een **virtuele landelijke catalogus** die onder water bestaat uit meerdere lokale catalogi.

```
                    consument
                        │
                        │  1× zoekvraag
                        ▼
                ┌──────────────────┐
                │  peer A          │◀── peer-lijst uit directory
                │  (ontvanger)     │
                └────────┬─────────┘
                         │  parallel
              ┌──────────┴──────────┐
              ▼                     ▼
         ┌─────────┐           ┌─────────┐
         │ peer B  │           │ peer C  │
         └────┬────┘           └────┬────┘
              │  resultaten         │
              └──────────┬──────────┘
                         ▼
                ┌──────────────────┐
                │  peer A          │
                │  • combineert    │  [+ eigen lokale zoek]
                │  • merge facets  │
                │  • bron-attr.    │
                └────────┬─────────┘
                         │  1× samengesteld antwoord
                         ▼
                    consument
```

Concreet: de aangeroepen instantie bevraagt haar peer-instanties, combineert de antwoorden met haar eigen publicaties (inclusief bijbehorende filters en facetten), en stuurt het geheel als één resultaat terug. Elk afzonderlijk resultaat blijft traceerbaar naar de bronorganisatie zodat consumenten altijd weten wie welke publicatie beheert, en het aggregaat draagt een expliciete markering dat het antwoord federatief was.

Er wordt hierbij dus **géén** gebruik gemaakt van een landelijke index. Dat heeft drie belangrijke gevolgen voor deelnemers:

- **Geen dataduplicatie** — publicaties leven op één plek (bij de bronorganisatie) en worden nergens gerepliceerd.
- **Bron behoudt regie** — publiceren, wijzigen en depubliceren gebeurt lokaal en werkt direct door in álle federatieve zoekvragen. Er is geen aparte upload-stap richting een centrale voorziening.
- **Organisatiedomein blijft leidend** — de publicaties leven onder een organisatie-eigen URL (bijvoorbeeld `open.gemeente-x.nl`); het federatieve antwoord verwijst naar die bron in plaats van naar een landelijk mirror-adres.

Dit concept is verder uitgewerkt in koophulpje.nl. De facto is hiermee dus ook een landelijke Woo-API gerealiseerd, met de beperking dat deze alleen organisaties bevat die participeren in OpenWoo.

De bevragingen tussen de federatieve zoekvraag en de verschillende organisaties kunnen via NLX/FSC lopen, of daarbuiten. Aangezien het publieke bevragingen zijn op openbare informatie is NLX an sich niet verplicht en kan het inregelen van een PKI-certificaat nodeloos complex zijn. Dat gezegd hebbende, biedt NLX ook voordelen met betrekking tot het monitoren en loggen van verkeer.

### Peer discovery via de directory

Om federatief te kunnen zoeken moet elke instantie weten welke andere instanties er in het netwerk actief zijn. Dat regelen we via een **centrale directory**: een openbare lijst waarop iedere deelnemende OpenCatalogi-instantie zich registreert.

Standaard staat die directory op [`directory.opencatalogi.nl`](https://directory.opencatalogi.nl/apps/opencatalogi/api/directory) — de "wie-doet-mee-lijst" van het OpenCatalogi-netwerk. Iedere instantie synchroniseert regelmatig met haar directory zodat nieuwe peers automatisch beschikbaar komen; admins kunnen deze sync ook handmatig triggeren.

Een nieuwe instantie hoeft zichzelf maar bij één bekende peer aan te melden om vervolgens via de directory door alle andere peers gevonden te worden — een klein sneeuwbaleffect dat een nieuwe deelnemer in korte tijd volledig ingeplugd krijgt in het netwerk.

Ingebouwde controles voorkomen misbruik of ongewenst gedrag:

- Een instantie herkent zichzelf en registreert zich niet als peer.
- Interne of loopback-adressen worden geweigerd zodat het federatiekanaal niet misbruikt kan worden om achter de firewall te kijken.
- Broadcast-lussen worden gedetecteerd en gestopt, zodat sync-berichten niet oneindig rondgaan.

De volledige beheer-workflow (peer toevoegen, scope kiezen, sync forceren, troubleshoot-logs) staat in de admin-runbook van OpenCatalogi: [Manage federation sources](https://opencatalogi.conduction.nl/docs/tutorials/admin/manage-federation-sources/).

### Doorfederatie naar nationale en Europese portals (roadmap)

:::note Op de roadmap, nog niet geïmplementeerd
De onderstaande DCAT-harvest-koppeling is voorgenomen op de OpenCatalogi-roadmap, maar nog niet gebouwd. Beschouw het als richting, niet als bestaande functionaliteit.
:::

Naast peer-to-peer federatie tussen OpenWoo-instanties kan een OpenCatalogi-instantie haar publicaties ook aanbieden als **DCAT-AP harvestbron** — het protocol waarmee het nationale open-data portaal ([data.overheid.nl](https://data.overheid.nl)) en het Europese portaal ([data.europa.eu](https://data.europa.eu)) externe catalogi inlezen. De DCAT-feed bestaat al als passieve pull-endpoint; de roadmap-stap is registratie als officiële harvestbron zodat OpenWoo-publicaties automatisch verschijnen in de nationale en EU-catalogi, zonder dat er data gerepliceerd hoeft te worden.

Op deze manier ontstaat een tweede laag van federatie: peer-to-peer tussen deelnemende OpenWoo-instanties én bulk-harvest richting nationale/EU-portals. In beide gevallen blijft de OpenWoo-instantie de canonieke bron van de publicaties.

## Domeinen

OpenWoo is een organisatie­specifieke applicatie waarvan de installaties onderling een federatief netwerk vormen. Dat kan het wat onduidelijk maken wat waar leeft.

:::info Toekomstige directory-widget
Het hele punt van een federatief netwerk is dat er niet één centraal lijstje van deelnemende domeinen bestaat — iedere OpenCatalogi-instantie registreert zichzelf bij de centrale directory op [`directory.opencatalogi.nl`](https://directory.opencatalogi.nl/apps/opencatalogi/api/directory), en die directory publiceert de actuele lijst van deelnemers. Op termijn wordt de tabel hieronder vervangen door een widget die deze lijst rechtstreeks uit de directory ophaalt. Tot dan wordt de tabel handmatig bijgehouden — behandel het daarom als indicatief, niet als de bron van waarheid.
:::

| Type                  | Domein                                       | Status     | Type             |
|-----------------------|----------------------------------------------|------------|------------------|
| Federatief            | koophulpje.nl                                | productie  | Publicatiepagina |
| Organisatie specifiek | [organisatie_naam].koophulpje.nl             | productie  | Publicatiepagina |

<small>_Tabelinhoud voor het laatst inhoudelijk herzien op 2026-07-07._</small>

Dit zijn de aangeboden domeinen vanuit OpenWoo. Daarnaast zien we dat de meeste organisaties hun publicatiepagina ontsluiten op hun eigen domein, bijvoorbeeld `open.[organisatie_naam].nl`.
