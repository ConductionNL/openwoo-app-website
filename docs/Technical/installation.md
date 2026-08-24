---
sidebar_position: 3
---

# Installatie

Deze installatiehandleiding is bedoeld voor overheden en leveranciers die zelfstandig aan de slag willen met OpenWoo-website. Als je OpenWoo-website als SaaS wilt afnemen, kijk dan onder [kosten](../reference/pricing.md).

Het template voor de OpenWoo-website is gebaseerd op de Conduction Productpage-template voor Common Ground (gearchiveerd — repo niet langer beschikbaar). Hieronder tref je een verkorte installatiehandleiding aan die vooral focust op de onderliggende bronnen.

## Randvoorwaarden

Om dit template te gebruiken, moet je beschikken over:

- NL Design Token voor je organisatie (de oude Productpage-template-documentatie op `conductionnl.github.io` is niet langer beschikbaar — neem contact op via [info@conduction.nl](mailto:info@conduction.nl) voor de actuele NL Design-instructies)
- Een GitHub-organisatie en beheerdersrechten daarop OF (zie [Serverless Installatie](#serverless-installatie))
- Een APACHE/NGINX-server (zie [Server Installatie](#server-installatie))
- Een Open Webconcept CMS (WordPress) met de [OpenWoo](https://github.com/OpenWebconcept/plugin-openwoo) en [Open Convenanten](https://github.com/OpenWebconcept/plugin-openconvenanten) plugins OF
- Een losse installatie (on-premise of SaaS) met de Woo Bundle (gearchiveerd 1.0-component — repo niet langer beschikbaar; voor 2.0 zie [Nextcloud met OpenCatalogi + OpenRegister](#nextcloud-met-opencatalogi--openregister) hieronder)

## Frontend

### Serverless Installatie

De OpenWOO Website is in eerste instantie opgezet om serverless gebruikt te worden via GitHub. Dat scheelt niet alleen in de kosten, maar levert ook voordeel op in de beschikbaarheid en belasting. Simpel gezegd, de GitHub CDN is gebouwd om flink wat meer aan te kunnen dan de gemiddelde gemeente.

:::note GitHub Actions / GitHub Pages
`woo-website-template-apiv2` draait op **GitHub Actions** (`.github/workflows/`) en GitHub Pages. De stappen hieronder volgen die route.
:::

#### Stappen

1. Fork de [`woo-website-template-apiv2`](https://github.com/ConductionNL/woo-website-template-apiv2)-repo naar je eigen GitHub-organisatie via de "Fork"-knop rechtsboven. (Op termijn wordt deze repo samengevoegd terug onder de naam `woo-website-template`.)
2. [Zet de workflow permissions](#workflow-permissions) op `Read and write permissions`.
3. Ga op de main branch in de repository naar de folder `.github/workflows/`
4. Verwijder de workflow `product-page-deploy` als deze er nog staat
5. Open de workflow `woo-page-deploy` en pas de branche aan van `never` naar `main`
6. Pas de verdere configuratie in `woo-page-deploy` aan zoals [hieronder vermeld onder configuratie](#configuratie) en sla deze op
7. Ga naar acties en wacht tot de actie "Deploy the WOO Page to GitHub Pages" succesvol is afgerond
8. Ga naar settings -> pages, selecteer onder source `deploy from branch` en geef als branche op `gh-pages`
9. Bovenaan de pagina verschijnt nu de URL waarop je je Open WOO Website kunt terugvinden
10. Als je de Open WOO Website wilt hosten onder een subdomein van je organisatie en voorzien van een PKI-certificaat, kun je daarvoor de normale GitHub Pages-handleidingen volgen of een SLA afsluiten voor ondersteuning (zie [kosten](../reference/pricing.md))

#### Workflow Permissions

**Stappen**

1. Ga naar Settings
2. Ga naar Actions
3. Ga naar General.

![settings-action](/img/installation/settings-action.png)

4. Scroll naar Workflow permissions.
5. Set permissions naar `Read and write permissions`.

![Workflow permissions](/img/installation/workflow-permissions.png)

### Server Installatie

Als je de OpenWoo-website liever vanaf een eigen server draait, kan dat uiteraard ook. In dat geval is er wel sprake van een ietwat ingewikkelder installatie waarvoor je beter de handleiding van het onderliggende framework kunt volgen.

#### Stappen

1. Volg de stappen hiervoor op de Productpage-template (gearchiveerd — repo niet langer beschikbaar; raadpleeg een actuele Conduction product-site zoals deze repo voor de huidige opzet)
2. Pas de configuratie aan zoals hieronder vermeld bij configuratie

### Configuratie

Configuratie vindt plaats via environment (env) waardes. In het geval van een serverless configuratie moeten de env-waardes worden aangepast in de [page deploy workflow](https://github.com/ConductionNL/woo-website-template-apiv2/blob/main/.github/workflows/product-page-deploy.yml) (GitHub Actions onder `.github/workflows/`). In het geval van een serverinstallatie in het `.env`-bestand in de Gatsby-rootmap. We ondersteunen de volgende configuratie-opties.

| Key | Verplicht | Usage | Allowed Value | Default / Example |
|-----|-----------|-------|---------------|-------------------|
| GITHUB_PAGES_BRANCH | Alleen bij serverless | De branche waarop de pagina wordt gebouwd | string, max 255 characters | gh-pages |
| GITHUB_REPOSITORY_NAME | Alleen bij serverless | | string, max 255 characters | `$\{{ github.event.repository.name }}` |
| API_BASE_URL | Ja | De locatie van de Open Woo API (OpenRegister-deployment) | string, max 255 characters | "https://canary.accept.commonground.nu/apps/openregister/api" |
| NL_DESIGN_THEME_CLASSNAME | Ja | De naam van het thema van de organisatie | string, max 255 characters | "conduction-theme" |
| FAVICON_URL | Ja | De locatie van de favicon van de organisatie | string, max 255 characters | "https://conduction.nl/wp-content/uploads/2021/07/cropped-favicon-32x32.png" |
| HEADER_LOGO_URL | Ja | De locatie van het primaire logo van de organisatie | string, moet een base encoded afbeelding zijn OF url | "https://conduction.nl/wp-content/uploads/2021/07/cropped-conductionlogo-1.png" |
| ORGANISATION_NAME | Ja | De naam van de organisatie | string, max 255 characters | "Conduction" |
| JUMBOTRON_IMAGE_URL | Nee | De locatie van de gebruikte header, bij leeg wordt er geen header getoond | string, max 255 characters | "https://www.conduction.nl/wp-content/uploads/2021/07/cropped-Conduction_HOME_0000_afb1-1.png" |
| FOOTER_LOGO_URL | Ja | De locatie van het primaire logo van de organisatie | string, moet een base encoded afbeelding zijn OF url | ... |
| FOOTER_LOGO_HREF | Ja | De homepage van de organisatie | string, max 255 characters | "https://conduction.nl/" |
| OIDN_NUMBER | Nee | Het OIDN-nummer van de organisatie, bij leeg worden Woo-publicaties mogelijk niet beperkt tot de eigen organisatie | integer, max 16 characters | 1234567890 |

## Backend

Voor de backend zijn twee opties beschikbaar. In beide gevallen moet de resulterende URL worden opgenomen onder `API_BASE_URL` in de frontend-configuratie.

### Open Webconcept met OpenWoo en Open Convenanten Plugin

In dit geval koppel je de React frontend rechtstreeks op een WordPress installatie, dat betekent dat alle publicaties handmatig moeten worden geüpload.

Volg de installatiehandleiding op [https://github.com/OpenWebconcept/plugin-openwoo](https://github.com/OpenWebconcept/plugin-openwoo) en op [https://github.com/OpenWebconcept/plugin-openconvenanten](https://github.com/OpenWebconcept/plugin-openconvenanten).

### Nextcloud met OpenCatalogi + OpenRegister

In dit geval koppel je de React frontend aan een Nextcloud-installatie met [OpenCatalogi](https://github.com/ConductionNL/opencatalogi) (RegieTool) en [OpenRegister](https://github.com/ConductionNL/openregister) (object-storage). Publicaties worden automatisch opgehaald uit bestaande bronnen via de OpenWoo-register-inrichting. Dit is sinds OpenWoo 2.0 het canonieke backend-pad (zie [architectuur-overview](../Architecture/overview.md)).

`API_BASE_URL` wijs je naar de OpenRegister-API van de deployment, bv.:

```
https://canary.accept.commonground.nu/apps/openregister/api
```

> **Legacy (1.0):** Een eerdere variant koppelde de frontend aan de Common Gateway WooBundle (gearchiveerd — repo niet langer beschikbaar). Deze route wordt sinds 2.0 niet langer aanbevolen — de zoek- en beheer-API zijn nu losse componenten op OpenRegister en eventueel ontsluitbaar op NLX/FSC.

## Externe Systemen

Voor het koppelen van externe systemen geldt dat zij op de juiste manier moeten zijn geconfigureerd. Kijk daarvoor onder [configuratie](./configuration.md).

## Verdere documentatie

De oude Productpage-template-documentatie op `conductionnl.github.io` is niet langer beschikbaar. Raadpleeg een actuele Conduction product-site of neem contact op via [info@conduction.nl](mailto:info@conduction.nl) voor de huidige documentatie.
