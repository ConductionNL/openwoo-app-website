import React from 'react';
import Layout from '@theme/Layout';
import {
  DetailHero,
  Section,
  SectionHead,
  FeatureList,
  FeatureItem,
  PairRow,
  PairCard,
  CtaBanner,
} from '@conduction/docusaurus-preset/components';

/**
 * openwoo.conduction.nl landing page.
 *
 * Heavily trimmed compared to the commercial copy on
 * www.conduction.nl/solutions/openwoo — the audience here is the
 * implementing team (gemeente IT, leverancier, partner). Goal of this
 * page: get them into either the Techniek docs or the Product docs in
 * one click. Commercial framing stays on the solutions page.
 */
export default function Home(): JSX.Element {
  return (
    <Layout
      title="OpenWoo — technische documentatie"
      description="Technische documentatie en productinformatie voor OpenWoo, het publicatieplatform voor alle overheidsbronnen op Nextcloud."
    >
      <DetailHero
        crumb={['OpenWoo']}
        status={{label: 'Productie-ready', color: 'var(--c-mint-500)'}}
        version="Doelgroep: implementatie­teams"
        title="OpenWoo. Documentatie."
        tagline={
          <>
            OpenWoo is een publicatieplatform voor alle overheidsbronnen, gebouwd op{' '}
            <span className="next-blue">Nextcloud</span>. De elf Wet open overheid-categorieën worden typed
            registers in OpenRegister, OpenCatalogi indexeert ze publiek, en OpenConnector haalt ze uit je
            zaaksysteem of DMS. Deze site bevat de technische documentatie en productinformatie.
          </>
        }
        primaryCta={{label: 'Techniek', href: '/docs/category/techniek/'}}
        secondaryCta={{label: 'Product', href: '/docs/category/product/'}}
        iconColor="var(--c-blue-cobalt)"
        icon={
          <svg viewBox="0 0 24 24">
            <path d="M12 3l9 4v5c0 5-4 8-9 9-5-1-9-4-9-9V7l9-4z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        }
      />

      <Section spacing="default">
        <SectionHead
          eyebrow="In het kort"
          title="Drie apps, één configuratiepas."
          align="stack"
          lede="OpenWoo is geen losse app, maar een compositiepatroon: OpenRegister voor de typed registers, OpenCatalogi voor de publieke catalogus, OpenConnector voor de ingest uit je bron­systemen. Plus een seed-configuratie met de elf Woo-categorieën, audit log en citation-stable URLs."
        />
        <FeatureList>
          <FeatureItem
            icon={
              <svg viewBox="0 0 24 24">
                <ellipse cx="12" cy="6" rx="8" ry="3" />
                <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
              </svg>
            }
            title="Eleven typed registers."
          >
            Elke Woo-categorie wordt een eigen register in OpenRegister. Schema, audit log en
            citation-stable IDs zijn standaard onderdeel van de install.
          </FeatureItem>
          <FeatureItem
            icon={
              <svg viewBox="0 0 24 24">
                <path d="M3 7l9-4 9 4-9 4-9-4z" />
                <path d="M3 12l9 4 9-4M3 17l9 4 9-4" />
              </svg>
            }
            title="Publiek doorzoekbaar."
          >
            OpenCatalogi indexeert elk register en publiceert het op{' '}
            <strong>jouwgemeente.nl/woo</strong>. Federatieve zoek via FSC/NLX, KOOP-aanlevering uit
            de doos.
          </FeatureItem>
          <FeatureItem
            icon={
              <svg viewBox="0 0 24 24">
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="6" r="3" />
                <circle cx="18" cy="18" r="3" />
                <path d="M9 12h9M9 12l9-6M9 12l9 6" />
              </svg>
            }
            title="Connector pulls from your DMS."
          >
            OpenConnector haalt Woo-records via REST, SOAP of file-drops uit Zaaksysteem.nl, DECOS,
            Djuma, Sharepoint, RXMission, Notubiz, of wat er ook draait.
          </FeatureItem>
        </FeatureList>
      </Section>

      <Section spacing="default" background="tinted">
        <SectionHead
          eyebrow="Gebouwd op"
          title="Drie Conduction-apps."
          align="stack"
          lede="OpenWoo bestaat uit drie open-source apps die elk ook los inzetbaar zijn voor andere doeleinden. Elke app heeft zijn eigen documentatiesite met API-referentie."
        />
        <PairRow>
          <PairCard
            href="https://opencatalogi.conduction.nl/"
            icon={
              <svg viewBox="0 0 24 24">
                <path d="M3 7l9-4 9 4-9 4-9-4z" />
                <path d="M3 12l9 4 9-4M3 17l9 4 9-4" />
              </svg>
            }
            name="OpenCatalogi"
            why="Publieke catalogus en federatieve zoek voor elk Woo-register."
          />
          <PairCard
            href="https://openregister.conduction.nl/"
            icon={
              <svg viewBox="0 0 24 24">
                <ellipse cx="12" cy="6" rx="8" ry="3" />
                <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
              </svg>
            }
            name="OpenRegister"
            why="Typed registers, schema's, audit log, citation-stable IDs."
          />
          <PairCard
            href="https://openconnector.conduction.nl/"
            icon={
              <svg viewBox="0 0 24 24">
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="6" r="3" />
                <circle cx="18" cy="18" r="3" />
                <path d="M9 12h9M9 12l9-6M9 12l9 6" />
              </svg>
            }
            name="OpenConnector"
            why="Ingest uit zaaksysteem, DMS, of wat er ook draait via REST, SOAP, file drops."
          />
        </PairRow>
      </Section>

      <Section spacing="default">
        <SectionHead
          eyebrow="Verder"
          title="Solutions, Academy, en de Slack-community."
          align="stack"
          lede="Het commerciële verhaal en de actuele lijst van twaalf gemeenten in productie staan op de Conduction-solutionspagina. Tutorials en opnames van de maandelijkse community-meetings zijn beschikbaar in Academy."
        />
        <PairRow>
          <PairCard
            href="https://www.conduction.nl/solutions/openwoo"
            name="Solution — conduction.nl"
            why="Hero, value props, twaalf gemeenten in productie, zeven deelnemende leveranciers."
          />
          <PairCard
            href="https://www.conduction.nl/academy/?app=openwoo"
            name="Academy — tutorials & video"
            why="Stap-voor-stap setup-gidsen plus alle opgenomen community-meetings sinds 2023."
          />
          <PairCard
            href="https://samenorganiseren.slack.com/archives/C067Q3UE9F0"
            name="Slack — community"
            why="Vragen tussen meetings door, leveranciers + gemeenten + Conduction in één kanaal."
          />
        </PairRow>
      </Section>

      <CtaBanner
        title="Klaar om te beginnen?"
        lede={
          <>
            Start bij <strong>Techniek</strong> als je gaat installeren, bij <strong>Product</strong> als je
            wil weten wat er onder de motorkap zit, of praat met een partner als je liever de uitrol
            uit handen geeft.
          </>
        }
        primaryCta={{label: 'Naar Techniek', href: '/docs/category/techniek/'}}
        secondaryCta={{label: 'Praat met een partner', href: 'https://www.conduction.nl/partners'}}
      />
    </Layout>
  );
}
