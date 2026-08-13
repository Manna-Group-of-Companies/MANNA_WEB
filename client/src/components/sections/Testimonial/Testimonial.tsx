import { testimonial } from '@/data/sections';
import { Container } from '@/components/ui/Container/Container';
import { Reveal } from '@/components/ui/Reveal/Reveal';
import styles from './Testimonial.module.css';

export function Testimonial() {
  return (
    <section className={styles.section} id="about">
      <Container size="narrow">
        <Reveal as="blockquote" className={styles.quote}>
          <p className={styles.text}>&ldquo;{testimonial.quote}&rdquo;</p>
          <footer className={styles.attribution}>
            <span className={styles.name}>{testimonial.name}</span>
            <span className={styles.org}>{testimonial.org}</span>
          </footer>
        </Reveal>
      </Container>
    </section>
  );
}
