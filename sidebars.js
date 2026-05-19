// @ts-check

/**
 * Sidebar for openwoo.conduction.nl docs.
 *
 * Kept in lockstep with docs/{product,techniek}/. Re-organisation into
 * the fleet-canonical Features/Architecture/Integrations layout is
 * tracked as a follow-up — this PR only swaps the preset and lands the
 * brand landing page.
 */
module.exports = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Product',
      link: {
        type: 'generated-index',
        description: 'Alles over het OpenWoo-product, van kosten tot roadmap.',
      },
      items: [
        'product/kosten',
        'product/sla',
        'product/privacy',
        'product/beveiliging',
        'product/toegankelijkheid',
        'product/roadmap',
        'product/community',
        'product/faq',
      ],
    },
    {
      type: 'category',
      label: 'Techniek',
      link: {
        type: 'generated-index',
        description: 'Technische documentatie voor implementatie en integratie van OpenWoo.',
      },
      items: [
        'techniek/productie',
        'techniek/architectuur',
        'techniek/installatie',
        'techniek/integratie',
        'techniek/configuratie',
        'techniek/testscenarios',
      ],
    },
  ],
};
