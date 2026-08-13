import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';
import { products } from '@/data/products';
import { Container } from '@/components/ui/Container/Container';
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading';
import { PatternArt } from '@/components/ui/PatternArt/PatternArt';
import { TickList } from '@/components/ui/TickList/TickList';
import { Reveal } from '@/components/ui/Reveal/Reveal';
import styles from './ProductShowcase.module.css';

export function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = products[activeIndex] ?? products[0];
  if (!active) return null;

  /** Roving tabindex: arrow keys move between tabs, Home/End jump to the ends. */
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = products.length - 1;
    let next: number | null = null;

    if (event.key === 'ArrowRight') next = activeIndex === last ? 0 : activeIndex + 1;
    if (event.key === 'ArrowLeft') next = activeIndex === 0 ? last : activeIndex - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = last;

    if (next === null) return;
    event.preventDefault();
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className={styles.section} id="products">
      <Container>
        <SectionHeading
          eyebrow="Product range"
          title="Five product lines, one supplier."
          align="center"
        />

        <Reveal className={styles.showcase}>
          <div
            className={styles.tabs}
            role="tablist"
            aria-label="Product range"
            onKeyDown={onKeyDown}
          >
            {products.map((product, index) => (
              <button
                key={product.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                className={cn(
                  styles.tab,
                  index === activeIndex && styles.tabActive,
                )}
                role="tab"
                id={`tab-${product.id}`}
                aria-selected={index === activeIndex}
                aria-controls={`panel-${product.id}`}
                tabIndex={index === activeIndex ? 0 : -1}
                type="button"
                onClick={() => setActiveIndex(index)}
              >
                {product.tab}
              </button>
            ))}
          </div>

          <div
            className={styles.panel}
            role="tabpanel"
            id={`panel-${active.id}`}
            aria-labelledby={`tab-${active.id}`}
            key={active.id}
          >
            <div className={styles.art}>
              <PatternArt pattern={active.pattern} />
            </div>
            <div className={styles.body}>
              <h3 className={styles.title}>{active.title}</h3>
              <p className={styles.copy}>{active.body}</p>
              <TickList items={active.points} />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
