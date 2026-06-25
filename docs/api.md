---
title: API-overzicht
description: OpenWoo bestaat uit twee gestapelde API's — de primaire OpenCatalogi Publications API en de secundaire OpenRegister-direct API. Deze pagina linkt naar de OAS-rendering van beide en naar de upstream-specs.
slug: /api-overview
sidebar_position: 5
---

# API-overzicht

OpenWoo zelf heeft geen eigen runtime — het is een **register-inrichting** binnen [OpenCatalogi](https://codeberg.org/Conduction/opencatalogi) (de RegieTool) bovenop [OpenRegister](https://codeberg.org/Conduction/openregister) (object-storage). Het koppelvlak bestaat uit **twee API-lagen** die beide op deze site live gerenderd worden:

| Laag | Wat | Live OAS | Bron |
|---|---|---|---|
| **Primair** | OpenCatalogi Publications API — catalogus-scoped publicaties, facetten, datum-driven RBAC. Wat de [`woo-website-template-apiv2`](https://codeberg.org/Conduction/woo-website-template-apiv2) aanroept. | [/api/publications/](/api/publications/) | Handmatig — `static/oas/opencatalogi-publications.json` |
| **Secundair** | OpenRegister direct — `/objects/{register}/{schema}`, ruwe object-storage. Voor register/schema-specifieke calls buiten een catalogus om. | [/api/](/api/) | Auto-gemirrord van canary register 2 |

Zie [API-koppelvlak](/docs/Integrations/api-koppelvlak/) voor een uitgebreidere uitleg van de architectuur, het verschil tussen de twee lagen, en publicatie-statussen + RBAC.

## Primaire API — OpenCatalogi Publications

➡️ **[openwoo.conduction.nl/api/publications/](/api/publications/)** — OpenCatalogi Publications OAS

Dit is de API die front-ends en consumenten doorgaans aanroepen: `/publications`, `/publications/{id}`, `/publications/{id}/attachments`, `/pages`, `/menus`, plus de catalogus- en thema-endpoints. De endpoints zijn anoniem aanroepbaar; anonieme zichtbaarheid wordt server-side afgedwongen door twee filter-lagen (zie [API-koppelvlak — Publicatie-statussen](/docs/Integrations/api-koppelvlak#publicatie-statussen)).

### Bron + onderhoud

OpenCatalogi exporteert (nog) geen eigen OAS-endpoint. Deze spec wordt daarom **handmatig onderhouden** in dit repo op basis van `lib/Controller/*.php` in [`Conduction/opencatalogi`](https://codeberg.org/Conduction/opencatalogi) en de calls die `woo-website-template-apiv2` daadwerkelijk maakt.

| Aspect | Waarde |
|---|---|
| Bron-file | `static/oas/opencatalogi-publications.json` |
| Onderhoud | Handmatig — open een PR op `openwoo-app-website` wanneer de upstream-API verandert |
| Upstream-referentie | [`Conduction/opencatalogi/lib/Controller/`](https://codeberg.org/Conduction/opencatalogi/src/branch/main/lib/Controller/) — `CatalogiController`, `PublicationsController`, `PagesController`, `MenusController`, `ThemesController`, `GlossaryController` |

Wanneer OpenCatalogi een eigen OAS-endpoint krijgt, kan deze spec gemigreerd worden naar een auto-sync-flow vergelijkbaar met de OpenRegister-mirror hieronder.

## Secundaire API — OpenRegister direct

➡️ **[openwoo.conduction.nl/api/](/api/)** — live OpenRegister-direct OAS

Deze OAS dekt 17 TOOI-informatiecategorieën (convenanten, klachtoordelen, onderzoeksrapporten, jaarplan-of-jaarverslag, …) elk met list- + single-object-endpoints (34 paths totaal, 20 schemas) onder `/objects/{register}/{schema}`. Wordt **één keer per dag** (03:27 UTC) gemirrord van een referentie-deployment en gerenderd via Redocusaurus.

### Bron + sync

| Aspect | Waarde |
|---|---|
| Source-URL | `https://canary.accept.commonground.nu/index.php/apps/openregister/api/registers/2/oas` |
| Sync-mechanisme | `.forgejo/workflows/woo-oas-sync.yml` — cron `27 3 * * *` (nachtelijk) + `workflow_dispatch` (handmatig) |
| Auth | Geen — `registers/{id}/oas` is anoniem leesbaar |
| Mirror-file | `static/oas/woo.json` |
| Banner-injectie | De sync-workflow voegt een banner toe aan `info.description` zodat de gerenderde OAS-pagina duidelijk markeert dat dit de secundaire laag is. Idempotent: re-runs tegen ongewijzigde upstream geven geen extra commit. |

Wijzigt het schema in de bron-deployment? De volgende nachtelijke cron-tick detecteert het verschil, committeert en triggert de deploy. Direct synchroniseren kan via Actions → "Woo OAS sync" → Run workflow.

### Bron switchen

Wanneer er een productie-deployment beschikbaar komt of canary migreert naar het `publication`-register: één regel aanpassen in `.forgejo/workflows/woo-oas-sync.yml` (`OAS_URL` env-var). Geen andere wijzigingen nodig.

## Upstream specs (canonical sources)

OpenWoo bouwt op deze components — voor de volledige spec van de onderliggende lagen ga naar de bron:

### OpenCatalogi API (RegieTool)

De endpoints voor catalogi, publications, themas, organisations en de federation directory.

- **Live**: [opencatalogi.conduction.nl/api](https://opencatalogi.conduction.nl/api) (Redocusaurus)
- **Source**: [Conduction/opencatalogi](https://codeberg.org/Conduction/opencatalogi)

### OpenRegister API (object-storage)

De onderliggende objecten (Catalog, Publication, Glossary, …) worden via OpenRegister opgeslagen. Voor schema/register/object-management routes:

- **Live**: [openregister.conduction.nl/api](https://openregister.conduction.nl/api/) (Redocusaurus)
- **Source**: [Conduction/openregister](https://codeberg.org/Conduction/openregister)

## OpenWoo-specifieke integratie-uitleg

De live spec op `/api/` beschrijft het **wat**. Voor het **hoe** vanuit OpenWoo-perspectief:

- **[API-koppelvlak](/docs/Integrations/api-koppelvlak/)** — algemeen koppelvlak-overzicht, authenticatie, metadata-schema's, throttling
- **[Full-text search voor leveranciers](/docs/Integrations/fulltext-search/)** — query-syntax, geïndexeerde velden + weging, relevantie-score, integratie-voorbeelden, gotchas
- **[Ondersteunde bronnen](/docs/Integrations/ondersteunde-bronnen/)** — welke zaak-/document-/data-bronnen OpenWoo kan ontsluiten
- **[Bron koppelen](/docs/Integrations/bron-koppelen/)** — een nieuwe bron aansluiten

## Publiek leesbare canary-omgeving

Voor leveranciers / front-end-bouwers die direct tegen een live Woo Register willen ontwikkelen zonder eigen deployment: de canary-omgeving is anoniem leesbaar — beide API-lagen werken zonder auth-header.

**Primaire laag (aanbevolen voor nieuwe consumenten):**

```
https://canary.accept.commonground.nu/apps/opencatalogi/api/publications
```

Catalogus-slug `publications`. Voor de volledige set endpoints + parameters zie [/api/publications/](/api/publications/).

**Secundaire laag (legacy `/objects/woo/{categorie}`, nog actief op canary):**

```
https://canary.accept.commonground.nu/apps/openregister/api/objects/woo/{categorie}
```

Vervang `{categorie}` door een van de 17 TOOI-informatiecategorieën — bv. `adviezen`, `convenanten`, `klachtoordelen`, `onderzoeksrapporten`, `woo_verzoeken_en_besluiten`. De volledige lijst staat in de [/api/](/api/)-spec.

Geen authenticatie nodig voor `GET`. Voor query-syntax + voorbeelden zie [Full-text search voor leveranciers](/docs/Integrations/fulltext-search/).

## Achtergrond

OpenWoo's vroegere plan was één hand-onderhouden OpenAPI-spec voor alles. Dat is gedeeltelijk verlaten zodra duidelijk werd dat OpenRegister al per-register OAS-generation doet (`GET /api/registers/{id}/oas`) — die laag is daarom gemirrord in plaats van handmatig onderhouden. De OpenCatalogi-laag eronder heeft (nog) geen OAS-generation; daarom is `static/oas/opencatalogi-publications.json` handmatig opgesteld en wordt het bijgewerkt wanneer de upstream-API verandert.

Wanneer OpenCatalogi een eigen OAS-endpoint krijgt, kan de hand-curated file gemigreerd worden naar een tweede sync-flow analoog aan `.forgejo/workflows/woo-oas-sync.yml`.
