---
title: Hoe deze releases-sectie werkt
description: De Releases-sectie wordt automatisch bijgewerkt vanuit de stack-componenten via repository_dispatch.
sidebar_position: 0
---

# Hoe deze releases-sectie werkt

Deze sectie verzamelt de release-aankondigingen voor elk stack-component dat onder de OpenWoo-vlag vaart. Elke pagina is **automatisch gegenereerd** uit een GitHub Release in de bron-repo — geen handmatige doorvoer nodig.

## Pipeline

1. Een stack-component (bijv. [opencatalogi](https://github.com/ConductionNL/opencatalogi)) publiceert een **stable** release op GitHub.
2. De `release-notes-publish.yml` workflow in die repo vuurt een `repository_dispatch` af op deze docs-repo met de release-payload (tag, naam, body, URL, datum).
3. De `release-notes-listener.yml` workflow hier schrijft een markdown-pagina onder `docs/releases/<component>/<tag>.md` en pusht naar `main`.
4. De `deploy.yml` workflow rebuildt en deployt openwoo.conduction.nl — meestal binnen een paar minuten.

Pre-releases (beta / unstable) worden niet gepubliceerd in deze sectie. Alleen stable.

## Een nieuw component aansluiten

1. Voeg het component-event toe aan `release-notes-listener.yml` (`types:` array).
2. Voeg `release-notes-publish.yml` toe in het component-repo (kopie van opencatalogi's versie).
3. Provision een PAT met `contents:read` op het component en `contents:write` op openwoo-app-website, en zet die als `RELEASE_NOTES_DISPATCH_TOKEN` repo-secret in het component-repo.

## Tracking

Zie [hydra#279](https://github.com/ConductionNL/hydra/issues/279) voor de bredere documentatie-pipeline (deliverable #1 / release notes is hier de implementatie van).
