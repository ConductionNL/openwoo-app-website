import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Main sidebar - auto-generated from docs structure
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Product',
      link: {
        type: 'generated-index',
        description: 'Alles over het OpenWoo.app product, van kosten tot roadmap.',
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
        description: 'Technische documentatie voor implementatie en integratie van OpenWoo.app.',
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

export default sidebars;
