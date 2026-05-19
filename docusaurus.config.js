// @ts-check

/**
 * OpenWoo documentation site, openwoo.conduction.nl.
 *
 * Built on @conduction/docusaurus-preset for brand defaults (tokens,
 * Navbar/Footer swizzles, locale scaffolding, KvK/BTW copyright).
 * Modeled on openregister/docs/docusaurus.config.js as the canonical
 * fleet pattern (preset 3.5+, navbar/footer as top-level createConfig
 * opts, baseFooterLinks helper, minigames disabled on product pages).
 *
 * The site lives at https://openwoo.conduction.nl — a custom-domain
 * Pages deploy via static/CNAME, replacing the previous
 * conductionnl.github.io/openwoo-app-website/ project-Pages URL.
 *
 * Audience: implementing teams (gemeente IT, leverancier, partner).
 * Commercial copy lives on www.conduction.nl/solutions/openwoo;
 * tutorials + community-meeting videos live on
 * www.conduction.nl/academy/?app=openwoo.
 */

const {createConfig, baseFooterLinks} = require('@conduction/docusaurus-preset');

/* createConfig replaces themes wholesale when `themes:` is passed, so
   we re-include the brand theme plugin. Without the brand theme entry
   the Navbar/Footer swizzles and brand.css auto-load would silently
   drop. */
const BRAND_THEME = require.resolve('@conduction/docusaurus-preset/theme');

const config = createConfig({
  title: 'OpenWoo',
  tagline: 'Een publicatieplatform voor alle overheidsbronnen, op je Nextcloud.',
  url: 'https://openwoo.conduction.nl',
  baseUrl: '/',

  organizationName: 'ConductionNL',
  projectName: 'openwoo-app-website',

  onBrokenLinks: 'warn',
  trailingSlash: true,

  /* Nederlands first; the Dutch government is the primary audience.
     English follows once the docs/ markdown is mirrored under i18n/en/. */
  i18n: {
    defaultLocale: 'nl',
    locales: ['nl'],
    localeConfigs: {
      nl: {label: 'Nederlands', htmlLang: 'nl-NL', direction: 'ltr'},
    },
  },

  /* Override the preset's classic block to keep the existing docs/
     tree (product/ + techniek/) and drop the placeholder sample blog
     that the create-docusaurus template seeded into blog/. The full
     reshape into the fleet-canonical Features/Architecture/Integrations
     layout is tracked as a follow-up; this PR only swaps the preset
     and lands the brand landing page. */
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/ConductionNL/openwoo-app-website/tree/main/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themes: [BRAND_THEME],

  /* Brand navbar provides locale dropdown + GitHub by default; we
     replace items[] with openwoo's own. The Solution + Academy items
     point back at the conduction.nl surfaces that own the commercial
     copy and the community videos respectively. */
  navbar: {
    title: 'OpenWoo',
    items: [
      {type: 'docSidebar', sidebarId: 'tutorialSidebar', position: 'left', label: 'Documentatie'},
      {href: 'https://www.conduction.nl/solutions/openwoo',        label: 'Solution', position: 'left'},
      {href: 'https://www.conduction.nl/academy/?app=openwoo',     label: 'Academy',  position: 'left'},
      {href: 'https://samenorganiseren.slack.com/archives/C067Q3UE9F0', label: 'Slack',    position: 'right'},
      {href: 'https://github.com/ConductionNL/openwoo-app-website',     label: 'GitHub',   position: 'right'},
    ],
  },

  /* Per-property footer override (preset 1.2.0+): we pass `links` only,
     so the brand `style: 'dark'` and the brand KvK/BTW/IBAN/address
     copyright string both inherit unchanged. OpenWoo-specific column
     first, then the brand Conduction column from baseFooterLinks(). */
  footer: {
    links: [
      {
        title: 'OpenWoo',
        items: [
          {label: 'Solution',  href: 'https://www.conduction.nl/solutions/openwoo'},
          {label: 'Academy',   href: 'https://www.conduction.nl/academy/?app=openwoo'},
          {label: 'Slack',     href: 'https://samenorganiseren.slack.com/archives/C067Q3UE9F0'},
          {label: 'GitHub',    href: 'https://github.com/ConductionNL/openwoo-app-website'},
        ],
      },
      ...baseFooterLinks().filter((column) => column.title === 'Conduction'),
    ],
  },

  /* Drop the canal-footer mini-games on this product-page footer
     (preset 1.3.0+). The static skyline + canal decoration are kept;
     the interactive layer goes away. */
  minigames: false,

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  },
});

module.exports = config;
