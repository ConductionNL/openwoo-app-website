// @ts-check

/**
 * Sidebar for openwoo.conduction.nl docs.
 *
 * Fleet-canonical layout (matches openregister/docs):
 *   docs/
 *     index.md            → docs landing
 *     UseCases/           → top-3 user-facing scenarios
 *     Features/           → per major capability
 *     Architecture/       → systeemarchitectuur, in 5 stukjes
 *     Integrations/       → bron-koppelen + API-koppelvlak + bronnenoverzicht
 *     Technical/          → installatie, configuratie, productie, testscenarios
 *     reference/          → faq, security, privacy, accessibility, pricing, sla, roadmap
 */
module.exports = {
  tutorialSidebar: [
    'index',
    'api',
    {
      type: 'category',
      label: 'Use cases',
      link: {
        type: 'generated-index',
        description: 'De drie meest gestelde "wat wil je bereiken"-vragen waar OpenWoo een antwoord op geeft.',
      },
      items: [
        'UseCases/actieve-openbaarmaking',
        'UseCases/publicatie-vanuit-zaaksysteem',
        'UseCases/federatieve-zoekindex',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      link: {
        type: 'generated-index',
        description: 'De zes belangrijkste functionaliteiten van OpenWoo, één per pagina.',
      },
      items: [
        'Features/centrale-index',
        'Features/multibron-data',
        'Features/publicatieplatformen',
        'Features/automatische-aanlevering-koop',
        'Features/proactieve-publicatie',
        'Features/audit-log',
      ],
    },
    {
      type: 'category',
      label: 'Architectuur',
      link: {
        type: 'generated-index',
        description: 'Hoe OpenWoo onder de motorkap in elkaar zit: publicatieplatform, motorblok, federatief zoeken, datamodel.',
      },
      items: [
        'Architecture/overview',
        'Architecture/publicatieplatform',
        'Architecture/motorblok',
        'Architecture/federatief-zoeken',
        'Architecture/datamodel',
      ],
    },
    {
      type: 'category',
      label: 'Integraties',
      link: {
        type: 'generated-index',
        description: 'Ondersteunde bronnen, API-koppelvlak en het koppelen van een eigen bron.',
      },
      items: [
        'Integrations/ondersteunde-bronnen',
        'Integrations/api-koppelvlak',
        'Integrations/fulltext-search',
        'Integrations/bron-koppelen',
      ],
    },
    {
      type: 'category',
      label: 'Technical',
      link: {
        type: 'generated-index',
        description: 'Installatie, configuratie, productie, testscenarios.',
      },
      items: [
        'Technical/installation',
        'Technical/configuration',
        'Technical/production',
        'Technical/test-scenarios',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      link: {
        type: 'generated-index',
        description: 'FAQ, security, privacy, toegankelijkheid, kosten, SLA, roadmap.',
      },
      items: [
        'reference/faq',
        'reference/security',
        'reference/privacy',
        'reference/accessibility',
        'reference/pricing',
        'reference/sla',
        'reference/roadmap',
      ],
    },
  ],
};
