import { useEffect } from 'react';
import { linkTo } from '@/lib/router';
import { aboutIntro, aboutSections } from '@/data/about';
import { site } from '@/data/site';
import { Container } from '@/components/ui/Container/Container';
import { Button } from '@/components/ui/Button/Button';
import { Reveal } from '@/components/ui/Reveal/Reveal';
import { PageHead } from '@/components/layout/PageHead/PageHead';
import styles from './AboutPage.module.css';

/** The About Us index: the eight company pages, with a line on each. */
export function AboutPage() {
  useEffect(() => {
    const previous = document.title;
    document.title = `About us — ${site.name} ${site.suffix}`;
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <>
      <PageHead
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About us' }]}
        eyebrow={aboutIntro.eyebrow}
        title={aboutIntro.title}
        lede={aboutIntro.lede}
      >
        <Button withArrow {...linkTo('/about/what-we-are')}>
          What we are
        </Button>
        <Button variant="outline" {...linkTo('/about/ceo-message')}>
          Read the CEO’s message
        </Button>
      </PageHead>

      <section className={styles.body}>
        <Container>
          <div className={styles.grid}>
            {/* The whole tile is one click target: the title's link is
                stretched over the card, the way the catalogue cards work. */}
            {aboutSections.map((section, index) => (
              <Reveal
                as="article"
                className={styles.card}
                delay={index % 3}
                key={section.slug}
              >
                <span className={styles.index} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className={styles.cardTitle}>
                  <a
                    className={styles.link}
                    {...linkTo(`/about/${section.slug}`)}
                  >
                    {section.navLabel}
                  </a>
                </h2>
                <p className={styles.cardBody}>{section.lede}</p>
                <span className={styles.more} aria-hidden="true">
                  Read on
                  <span className={styles.arrow}>→</span>
                </span>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
