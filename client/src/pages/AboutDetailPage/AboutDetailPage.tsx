import { useEffect } from 'react';
import { cn } from '@/lib/cn';
import { linkTo } from '@/lib/router';
import { aboutNeighbours, findAboutSection } from '@/data/about';
import { site } from '@/data/site';
import { Container } from '@/components/ui/Container/Container';
import { Button } from '@/components/ui/Button/Button';
import { Reveal } from '@/components/ui/Reveal/Reveal';
import { PageHead } from '@/components/layout/PageHead/PageHead';
import { AboutNav } from '@/components/about/AboutNav/AboutNav';
import { AboutBody } from '@/components/about/AboutBody/AboutBody';
import styles from './AboutDetailPage.module.css';

interface AboutDetailPageProps {
  slug: string;
}

/** One page of the About Us section, read beside the section rail. */
export function AboutDetailPage({ slug }: AboutDetailPageProps) {
  const section = findAboutSection(slug);

  // The tab title is the one piece of chrome a client-side route has to keep
  // in step by hand.
  useEffect(() => {
    const previous = document.title;
    document.title = section
      ? `${section.title} — ${site.name} ${site.suffix}`
      : `Page not found — ${site.name} ${site.suffix}`;
    return () => {
      document.title = previous;
    };
  }, [section]);

  if (!section) {
    return (
      <PageHead
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'About us', href: '/about' },
          { label: 'Not found' },
        ]}
        eyebrow="404"
        title="We could not find that page."
        lede="The link may be out of date. Everything about the company sits one click away."
      >
        <Button withArrow {...linkTo('/about')}>
          About Manna Group
        </Button>
        <Button variant="outline" href="/#contact">
          Talk to us
        </Button>
      </PageHead>
    );
  }

  const { previous, next } = aboutNeighbours(section.slug);

  return (
    <>
      <PageHead
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'About us', href: '/about' },
          { label: section.navLabel },
        ]}
        eyebrow={section.eyebrow}
        title={section.title}
        lede={section.lede}
      />

      <section className={styles.section}>
        <Container>
          <div className={styles.split}>
            <AboutNav className={styles.rail} current={section.slug} />

            <div className={styles.main}>
              {/* Each block brings its own reveal, so the article is not
                  wrapped in one of its own. */}
              <AboutBody blocks={section.blocks} />

              <Reveal as="nav" className={styles.pager} aria-label="About pages">
                {previous ? (
                  <a
                    className={styles.pagerLink}
                    {...linkTo(`/about/${previous.slug}`)}
                  >
                    <span className={styles.pagerLabel}>Previous</span>
                    <span className={styles.pagerTitle}>
                      ← {previous.navLabel}
                    </span>
                  </a>
                ) : (
                  <span />
                )}
                {next && (
                  <a
                    className={cn(styles.pagerLink, styles.pagerNext)}
                    {...linkTo(`/about/${next.slug}`)}
                  >
                    <span className={styles.pagerLabel}>Next</span>
                    <span className={styles.pagerTitle}>
                      {next.navLabel} →
                    </span>
                  </a>
                )}
              </Reveal>

              <Reveal className={styles.cta} delay={1}>
                <p className={styles.ctaText}>
                  Tell us what you need made and we will tell you whether it is
                  work we can do well.
                </p>
                <div className={styles.ctaActions}>
                  <Button href="/#contact" withArrow>
                    Talk to us
                  </Button>
                  <Button variant="outline" {...linkTo('/products')}>
                    Browse the catalogue
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
