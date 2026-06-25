## ℹ️ Dit is de secundaire OpenRegister-API (laag onder de publicaties-API)

Deze OAS documenteert de **ruwe OpenRegister-objects-API** — `/objects/{register}/{schema}` — die direct werkt met registers en schema's. Voor publicatiewebsites en -viewers wil je doorgaans de **primaire [OpenCatalogi Publications API](/api/publications/)** gebruiken, die deze laag inkapselt met catalogus-scoping, gecombineerde schema-facetten en datum-driven publicatie-status-filtering.

Zie [API-koppelvlak](/docs/Integrations/api-koppelvlak) voor de architectuur-context en de keuze tussen de twee lagen.

> **Bron + sync.** Deze spec wordt automatisch gemirrord vanuit canary register 2 (de legacy `woo`-register, slug `woo`) via een nachtelijke Forgejo-workflow. De getoonde TOOI-categorieën weerspiegelen wat momenteel op canary staat; deployments met het nieuwere `publication`-register exposen dezelfde categorieën onder een ander pad-segment (`/objects/publication/{schema}`).

---

