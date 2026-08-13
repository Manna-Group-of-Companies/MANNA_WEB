import { capabilities } from '@/data/sections';
import { useCarousel } from '@/hooks/useCarousel';
import { Container } from '@/components/ui/Container/Container';
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading';
import { Reveal } from '@/components/ui/Reveal/Reveal';
import { CapabilityCard } from './CapabilityCard';
import styles from './Capabilities.module.css';

export function Capabilities() {
  const { ref, page, pages, goTo } = useCarousel<HTMLUListElement>();

  return (
    <section className={styles.section} id="capabilities">
      <Container>
        <SectionHeading
          eyebrow="Capabilities"
          title="From raw compound to finished tread."
          lede="Mixing, tread rubber, retreading, reclaim and moulded goods — five production lines under one roof at Rubber Park, so the compound in your part is one we made ourselves."
        />

        <Reveal className={styles.rail}>
          <ul className={styles.track} ref={ref}>
            {capabilities.map((item) => (
              <li className={styles.item} key={item.id}>
                <CapabilityCard item={item} />
              </li>
            ))}
          </ul>

          {pages > 1 && (
            <div className={styles.controls}>
              <div className={styles.dots}>
                {Array.from({ length: pages }, (_, index) => (
                  <button
                    key={index}
                    className={styles.dot}
                    type="button"
                    aria-current={index === page}
                    aria-label={`Go to card group ${index + 1} of ${pages}`}
                    onClick={() => goTo(index)}
                  >
                    <span className={styles.dotMark} />
                  </button>
                ))}
              </div>

              <div className={styles.arrows}>
                <button
                  className={styles.nav}
                  type="button"
                  aria-label="Previous capabilities"
                  disabled={page === 0}
                  onClick={() => goTo(page - 1)}
                >
                  <Chevron direction="left" />
                </button>
                <button
                  className={styles.nav}
                  type="button"
                  aria-label="More capabilities"
                  disabled={page === pages - 1}
                  onClick={() => goTo(page + 1)}
                >
                  <Chevron direction="right" />
                </button>
              </div>
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === 'left' ? 'M10 3 5 8l5 5' : 'M6 3l5 5-5 5'} />
    </svg>
  );
}
