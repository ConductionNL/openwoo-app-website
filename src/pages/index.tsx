import React from 'react';
import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

/**
 * OpenWoo landing page — v1 jumbotron layout on the v2 docs content.
 * Hero: title/tagline/description left, brand illustration right.
 * Below: three entry cards into the docs (Product, Techniek, API).
 */
function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const heroImg = useBaseUrl('/img/heroImage.svg');
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <Heading as="h1" className={styles.heroTitle}>
              {siteConfig.title}
            </Heading>
            <p className={styles.heroSubtitle}><i>{siteConfig.tagline}</i></p>
            <p className={styles.heroDescription}>
              Ontdek de toekomst van overheidscommunicatie met OpenWoo.app, dé geavanceerde
              oplossing die uw organisatie transformeert door moeiteloos en efficiënt beheer
              van openbare gegevens. OpenWoo.app stelt overheden in staat om documenten en
              informatie - van zaken en verzoeken tot nieuwsberichten en officiële
              publicaties - automatisch te verzamelen en te publiceren vanuit een breed
              scala aan bronnen. Dit innovatieve platform biedt een centrale plek voor alle
              openbare data, waardoor inwoners, journalisten en onderzoekers via één
              gebruiksvriendelijke interface toegang hebben tot alle benodigde informatie.
            </p>
          </div>
          <div className="col col--6">
            <img
              src={heroImg}
              alt="OpenWoo.app illustratie"
              className={styles.heroImage}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function EntryCard({title, description, to, linkLabel}: {
  title: string;
  description: string;
  to: string;
  linkLabel: string;
}) {
  return (
    <div className="col col--4 margin-bottom--lg">
      <div className="card" style={{height: '100%'}}>
        <div className="card__header">
          <Heading as="h3">{title}</Heading>
        </div>
        <div className="card__body">
          <p>{description}</p>
        </div>
        <div className="card__footer">
          <Link className="button button--primary button--block" to={to}>
            {linkLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

function GettingStarted() {
  return (
    <section className={styles.aboutSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Aan de slag
        </Heading>
        <div className="row">
          <EntryCard
            title="Product"
            description="Wat OpenWoo is en wat het je organisatie oplevert: kosten, privacy, beveiliging, toegankelijkheid, roadmap en veelgestelde vragen."
            to="/docs/category/reference/"
            linkLabel="Naar de productdocumentatie"
          />
          <EntryCard
            title="Techniek"
            description="Hoe OpenWoo onder de motorkap in elkaar zit en hoe je het draait: architectuur, installatie, configuratie en de weg naar productie."
            to="/docs/category/architectuur/"
            linkLabel="Naar de technische documentatie"
          />
          <EntryCard
            title="API"
            description="Het API-koppelvlak voor leveranciers en integrators: endpoints, schema's en de OpenAPI-specificaties van het platform."
            to="/docs/api-overview"
            linkLabel="Naar de API-documentatie"
          />
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Home"
      description="OpenWoo.app - Een publicatieplatform voor alle overheidsbronnen">
      <HomepageHeader />
      <main>
        <GettingStarted />
      </main>
    </Layout>
  );
}
