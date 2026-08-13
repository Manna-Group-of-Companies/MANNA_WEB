import type { CSSProperties } from 'react';
import type { Stat } from '@/types/content';
import { stats } from '@/data/sections';
import { useReveal } from '@/hooks/useReveal';
import { useCountUp } from '@/hooks/useCountUp';
import { Container } from '@/components/ui/Container/Container';
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading';
import styles from './StatsBand.module.css';

function StatItem({ stat, delay }: { stat: Stat; delay: number }) {
  const { ref, revealed } = useReveal<HTMLDivElement>({ threshold: 0.4 });
  const value = useCountUp(stat.value, revealed);

  return (
    <div
      className={styles.stat}
      ref={ref}
      data-reveal=""
      data-revealed={revealed}
      style={{ '--reveal-delay': `${delay * 90}ms` } as CSSProperties}
    >
      <p className={styles.value}>
        {value.toLocaleString('en-GB')}
        {stat.suffix}
      </p>
      <p className={styles.label}>{stat.label}</p>
    </div>
  );
}

export function StatsBand() {
  return (
    <section className={styles.band} aria-label="Manna Rubber at a glance">
      <Container>
        <SectionHeading
          eyebrow="By the numbers"
          title="Three decades of rubber, measured."
          align="center"
          className={styles.head}
        />

        <div className={styles.grid}>
          {stats.map((stat, index) => (
            <StatItem key={stat.id} stat={stat} delay={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
