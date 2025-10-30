import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Determine correct site url and baseUrl based on environment
const isGhPages = process.env.GITHUB_ACTIONS === 'true' || process.env.DEPLOY_TO_PAGES === 'true';
const siteUrl = isGhPages ? 'https://conductionnl.github.io' : 'https://openwoo.app';
const siteBaseUrl = isGhPages ? '/openwoo-app-website/' : '/';

const config: Config = {
  organizationName: 'ConductionNL',
  projectName: 'openwoo-app-website',
  title: 'OpenWOO.app',
  tagline: 'Een publicatie platform voor alle overheidsbronnen',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: siteUrl,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is '/<projectName>/'
  baseUrl: siteBaseUrl,

  // GitHub pages deployment config.
  onBrokenLinks: 'warn',
  // Ensure URLs end with a slash to avoid 404s on GH Pages and local serve
  trailingSlash: true,

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'nl',
    locales: ['nl'],
  },

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap',
      },
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'Open Webconcept Logo',
        src: 'https://github.com/ConductionNL/conduction-theme/assets/43807324/e15ee773-f23e-429a-858e-fb677e8dd64e',
        href: '/',
        height: 64,
      },
      items: [
        {
          label: 'Product',
          to: '/docs/category/product/',
          position: 'left',
        },
        {
          label: 'Techniek',
          to: '/docs/category/techniek/',
          position: 'left',
        },
        {
          label: 'Over Open Webconcept',
          href: 'https://openwebconcept.nl/',
          position: 'right',
        },
        {
          type: 'html',
          position: 'right',
          value: '<div style="width: 1px; height: 24px; background: #ddd; margin: 0 0.5rem;"></div>',
        },
        {
          href: 'https://samenorganiseren.slack.com/archives/C067Q3UE9F0',
          label: 'Slack',
          position: 'right',
          className: 'navbar-slack-link',
        },
        {
          href: 'https://github.com/ConductionNL/woo-website-template',
          label: 'GitHub',
          position: 'right',
          className: 'navbar-github-link',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'Open Webconcept Logo',
        src: 'https://github.com/ConductionNL/conduction-theme/assets/43807324/e15ee773-f23e-429a-858e-fb677e8dd64e',
        href: 'https://openwebconcept.nl/',
        width: 180,
      },
      links: [
        {
          title: 'Links',
          items: [
            {
              label: 'Home',
              to: '/',
            },
            {
              label: 'Slack',
              href: 'https://samenorganiseren.slack.com/archives/C067Q3UE9F0',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/ConductionNL/woo-website-template',
            },
            {
              label: 'Open Webconcept',
              href: 'https://openwebconcept.nl/',
            },
          ],
        },
        {
          title: 'Product',
          items: [
            {
              label: 'Kosten',
              to: '/docs/product/kosten',
            },
            {
              label: 'Privacy',
              to: '/docs/product/privacy',
            },
            {
              label: 'Beveiliging',
              to: '/docs/product/beveiliging',
            },
            {
              label: 'Toegankelijkheid',
              to: '/docs/product/toegankelijkheid',
            },
            {
              label: 'Roadmap',
              to: '/docs/product/roadmap',
            },
            {
              label: 'Veelgestelde vragen',
              to: '/docs/product/faq',
            },
          ],
        },
        {
          title: 'Techniek',
          items: [
            {
              label: 'Naar Productie',
              to: '/docs/techniek/productie',
            },
            {
              label: 'Architectuur',
              to: '/docs/techniek/architectuur',
            },
            {
              label: 'Installatie',
              to: '/docs/techniek/installatie',
            },
            {
              label: 'Integratie',
              to: '/docs/techniek/integratie',
            },
            {
              label: 'Configuratie',
              to: '/docs/techniek/configuratie',
            },
            {
              label: 'Testscenario\'s',
              to: '/docs/techniek/testscenarios',
            },
          ],
        },
      ],
      copyright: `<a href="https://github.com/ConductionNL/woo-website-template-apiv2" target="_blank" style="color: #5f5f5f; text-decoration: none;"><svg aria-hidden="true" style="width: 1em; height: 1em; vertical-align: -0.125em; display: inline-block; margin-right: 0.25rem;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"></path></svg></a> with <a href="https://github.com/ConductionNL/woo-website-template-apiv2/graphs/contributors" target="_blank" style="color: #5f5f5f; text-decoration: none;"><svg aria-hidden="true" style="width: 1em; height: 1em; vertical-align: -0.125em; display: inline-block; margin: 0 0.25rem;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"></path></svg></a> by <a href="https://conduction.nl" target="_blank" style="color: #5f5f5f; text-decoration: none;">Conduction.</a>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;