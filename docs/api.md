---
title: API-overzicht
description: De Woo Register API leeft live op /api en wordt automatisch gemirrord van een referentie-deployment. Verder linkt deze pagina door naar OpenCatalogi en OpenRegister voor de upstream specs.
slug: /api-overview
sidebar_position: 5
---

# API-overzicht

OpenWoo zelf heeft geen eigen runtime — het is een **register-inrichting** binnen [OpenCatalogi](https://github.com/ConductionNL/opencatalogi) (de RegieTool) bovenop [OpenRegister](https://github.com/ConductionNL/openregister) (object-storage). Per register genereert OpenRegister automatisch een complete OpenAPI 3.1.0 spec. Deze pagina is de hub naar:

- de **live Woo Register API** (gemirrord en gerenderd op deze site)
- de **upstream specs** van OpenCatalogi en OpenRegister (single source of truth)
- de **OpenWoo-specifieke integratie-tutorials** voor leveranciers

## Live Woo Register API

De canonieke OpenAPI 3.1.0 spec voor de Woo Register wordt **één keer per dag** (03:27 UTC) gemirrord van een referentie-deployment en gerenderd via Redocusaurus:

➡️ **[openwoo.conduction.nl/api](/api/)** — live Woo Register OAS

De spec dekt 17 TOOI-informatiecategorieën (convenanten, klachtoordelen, onderzoeksrapporten, jaarplan-of-jaarverslag, …) elk met list- + single-object-endpoints (34 paths totaal, 20 schemas).

### Bron + sync

| Aspect | Waarde |
|---|---|
| Source-URL | `https://canary.accept.commonground.nu/index.php/apps/openregister/api/registers/3/oas` |
| Sync-mechanisme | `.github/workflows/woo-oas-sync.yml` — cron `27 3 * * *` (nachtelijk) + `workflow_dispatch` (handmatig) |
| Auth | Geen — `registers/{id}/oas` is anoniem leesbaar |
| Mirror-file | `static/oas/woo.json` |

Wijzigt het schema in de bron-deployment? De volgende nachtelijke cron-tick detecteert het verschil, committeert en triggert de deploy. Direct synchroniseren kan via Actions → "Woo OAS sync" → Run workflow.

### Bron switchen

Wanneer er een productie-deployment beschikbaar komt: één regel aanpassen in `.github/workflows/woo-oas-sync.yml` (`OAS_URL` env-var). Geen andere wijzigingen nodig.

## Upstream specs (canonical sources)

OpenWoo bouwt op deze components — voor de volledige spec van de onderliggende lagen ga naar de bron:

### OpenCatalogi API (RegieTool)

De endpoints voor catalogi, publications, themas, organisations en de federation directory.

- **Live**: [opencatalogi.conduction.nl/api](https://opencatalogi.conduction.nl/api) (Redocusaurus)
- **Source**: [ConductionNL/opencatalogi](https://github.com/ConductionNL/opencatalogi)

### OpenRegister API (object-storage)

De onderliggende objecten (Catalog, Publication, Glossary, …) worden via OpenRegister opgeslagen. Voor schema/register/object-management routes:

- **Live**: [openregister.conduction.nl/api](https://openregister.conduction.nl/api/) (Redocusaurus)
- **Source**: [ConductionNL/openregister](https://github.com/ConductionNL/openregister)

## OpenWoo-specifieke integratie-uitleg

De live spec op `/api/` beschrijft het **wat**. Voor het **hoe** vanuit OpenWoo-perspectief:

- **[API-koppelvlak](/docs/Integrations/api-koppelvlak/)** — algemeen koppelvlak-overzicht, authenticatie, metadata-schema's, throttling
- **[Full-text search voor leveranciers](/docs/Integrations/fulltext-search/)** — query-syntax, geïndexeerde velden + weging, relevantie-score, integratie-voorbeelden, gotchas
- **[Ondersteunde bronnen](/docs/Integrations/ondersteunde-bronnen/)** — welke zaak-/document-/data-bronnen OpenWoo kan ontsluiten
- **[Bron koppelen](/docs/Integrations/bron-koppelen/)** — een nieuwe bron aansluiten

## Publieke OpenWoo gateway (zonder Nextcloud)

Voor publieke leveranciers / front-end-bouwers die zoeken zonder eigen Nextcloud-instance: de CommonGround-gateway aggregator over OpenWoo-instances:

```
https://api.gateway.commonground.nu/api/publicaties
```

Geen authenticatie nodig voor `GET`. Throttling + rate-limiting actief. Voor query-syntax + voorbeelden zie [Full-text search voor leveranciers](/docs/Integrations/fulltext-search/).

## Achtergrond

OpenWoo's vroegere plan was een hand-onderhouden OpenAPI-spec. Dat is verlaten zodra duidelijk werd dat OpenRegister al per-register OAS-generation doet (`GET /api/registers/{id}/oas`). Mirror van de live spec geeft "altijd up-to-date" zonder enige handmatige sync of cross-repo token. Zie [hydra#279](https://github.com/ConductionNL/hydra/issues/279).
