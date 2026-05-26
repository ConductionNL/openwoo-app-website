---
title: Hoe deze releases-sectie werkt
description: De Releases-sectie wordt automatisch bijgewerkt door een scheduled poller die elke 30 minuten de tracked stack-componenten checkt op nieuwe stable releases.
sidebar_position: 0
---

# Hoe deze releases-sectie werkt

Deze sectie verzamelt de release-aankondigingen voor elk stack-component dat onder de OpenWoo-vlag vaart. Elke pagina is **automatisch gegenereerd** uit een GitHub Release in de bron-repo — geen handmatige doorvoer nodig.

## Pipeline

1. Een stack-component (bijv. [opencatalogi](https://github.com/ConductionNL/opencatalogi)) publiceert een **stable** release op GitHub.
2. De `release-notes-sync.yml` workflow hier draait elke 30 minuten op een schedule. Voor elk getrackt component leest hij `https://api.github.com/repos/<owner>/<repo>/releases` (publieke endpoint — geen auth nodig) en filtert op stable (`prerelease == false`, `draft == false`).
3. Voor elke release die nog niet op disk staat schrijft hij een markdown-pagina onder `docs/releases/<component>/<tag>.md` en pusht naar `main`.
4. De `deploy.yml` workflow rebuildt en deployt openwoo.conduction.nl — meestal binnen een paar minuten na de commit.

Pre-releases (beta / unstable) worden niet gepubliceerd in deze sectie. Alleen stable.

## Waarom pull, niet push

De voor de hand liggende architectuur is `repository_dispatch`: opencatalogi vuurt een event af zodra er een release is. Dat vraagt echter een cross-repo schrijftoken in opencatalogi's workflow, en ConductionNL hanteert sinds de "GitHub has been hacked" sessie een ban op Personal Access Tokens in hosted-runner workflows.

Pull-architectuur lost dat op: openwoo-app-website's workflow gebruikt zijn eigen `GITHUB_TOKEN`, de releases-API is anoniem leesbaar, en geen enkel secret hoeft cross-repo te bestaan. Latency: max ~30 minuten van release tot live op de docs-site, wat ruim voldoende is voor release notes.

Bonus: de poller is robuust tegen gemiste events — als de schedule een keer faalt, haalt de volgende run alles alsnog op. Bij een dispatch-architectuur is een verloren event een verloren release.

## Handmatig triggeren

Wil je niet 30 minuten wachten of een release-page-rendering forceren? Open de Actions-tab en run **Release notes sync** via `workflow_dispatch`. De `force` input herschrijft elke pagina, ook al bestaat-ie al op disk — handig na een wijziging in de markdown-template.

## Een nieuw component aansluiten

Eén regel toevoegen aan `.github/workflows/release-notes-sync.yml` onder `strategy.matrix.include`:

```yaml
- source_app: doriath
  source_repo: ConductionNL/doriath
```

De volgende cron-tick (max 30 min) verschijnen automatisch alle stable releases van dat component onder `docs/releases/doriath/`.

## Tracking

Zie [hydra#279](https://github.com/ConductionNL/hydra/issues/279) voor de bredere documentatie-pipeline (deliverable #1 / release notes is hier de implementatie van).
