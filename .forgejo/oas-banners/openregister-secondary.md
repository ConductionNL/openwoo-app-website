## ℹ️ Dit is de secundaire OpenRegister-API (laag onder de publicaties-API)

Deze OAS documenteert de **ruwe OpenRegister-objects-API** — `/objects/{register}/{schema}` — die direct werkt met registers en schema's. Voor publicatiewebsites en -viewers wil je doorgaans de **primaire [OpenCatalogi Publications API](/api/publications/)** gebruiken, die deze laag inkapselt met catalogus-scoping, gecombineerde schema-facetten en datum-driven publicatie-status-filtering.

Zie [API-koppelvlak](/docs/Integrations/api-koppelvlak) voor de architectuur-context en de keuze tussen de twee lagen.

> **Bron + sync.** Deze spec wordt automatisch gemirrord vanuit een upstream OpenRegister-deployment via een nachtelijke Forgejo-workflow. De getoonde paden weerspiegelen de inrichting van die bron-deployment; jouw eigen deployment kan dezelfde informatiecategorieën onder een ander register-slug en pad-segment exposen.

---

