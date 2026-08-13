import { industries } from '@/data/sections';
import { Container } from '@/components/ui/Container/Container';
import { Reveal } from '@/components/ui/Reveal/Reveal';
import styles from './IndustriesStrip.module.css';

export function IndustriesStrip() {
  return (
    <section className={styles.strip} id="industries">
      <Container>
        <Reveal as="p" className={styles.label}>
          Trusted across
        </Reveal>
        <Reveal as="ul" delay={1} className={styles.row}>
          {industries.map((industry) => (
            <li className={styles.item} key={industry}>
              {industry}
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
