import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
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
              Ontdek de toekomst van overheidscommunicatie met OpenWoo.app, dé geavanceerde oplossing die uw organisatie transformeert door moeiteloos en efficiënt beheer van openbare gegevens. OpenWoo.app stelt overheden in staat om documenten en informatie - van zaken en verzoeken tot nieuwsberichten en officiële publicaties - automatisch te verzamelen en te publiceren vanuit een breed scala aan bronnen. Dit innovatieve platform biedt een centrale plek voor alle openbare data, waardoor inwoners, journalisten en onderzoekers via één gebruiksvriendelijke interface toegang hebben tot alle benodigde informatie. Verschillende organisaties hebben de oplossing inmiddels in productie en begin 2024 is deze ook succesvol getest met KOOP en WOOgle.
            </p>
          </div>
          <div className="col col--6">
            <img
              src="/img/heroImage.svg"
              alt="OpenWOO.app illustratie"
              className={styles.heroImage}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function MarkdownContent() {
  const [markdown, setMarkdown] = useState<string>('Loading...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/ConductionNL/woo-website-template/main/README.md'
        );

        if (!response.ok) {
          throw new Error(`Failed to load: ${response.status}`);
        }

        const text = await response.text();
        setMarkdown(text);
      } catch (err) {
        console.error('Failed to load markdown:', err);
        setError('Failed to load content');
      }
    };

    fetchMarkdown();
  }, []);

  if (error) {
    return (
      <section className={styles.markdownSection}>
        <div className="container">
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.markdownSection}>
      <div className="container">
        <div className="markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="OpenWOO.app - Een publicatie platform voor alle overheidsbronnen">
      <HomepageHeader />
      <main>
        <MarkdownContent />
      </main>
    </Layout>
  );
}
