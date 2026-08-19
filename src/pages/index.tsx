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
 * Below: three entry cards into the docs (Productdocumentatie,
 * Configuratie, Service level agreement).
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
            title="Productdocumentatie"
            description="Wat OpenWoo is en wat het je organisatie oplevert, alle informatie vind je hier."
            to="/docs/"
            linkLabel="Naar de productdocumentatie"
          />
          <EntryCard
            title="Configuratie"
            description="Hoe OpenWoo onder de motorkap in elkaar zit en welke informatie geconfigureerd kan worden."
            to="/docs/Technical/configuration/"
            linkLabel="Naar de configuratie"
          />
          <EntryCard
            title="Service level agreement"
            description="Service Level Agreement (SLA) omvat de afspraken tussen de organisatie die OpenWoo.app gebruikt en Conduction die OpenWoo.app als SaaS-oplossing levert."
            to="/docs/reference/sla/"
            linkLabel="Naar de SLA"
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
