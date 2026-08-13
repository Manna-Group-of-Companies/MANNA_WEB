import { Container } from '@/components/ui/Container/Container';
import { Button } from '@/components/ui/Button/Button';
import { Reveal } from '@/components/ui/Reveal/Reveal';
import { HeroCarousel } from '@/components/sections/HeroCarousel/HeroCarousel';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero} id="top">
      <Container className={styles.copy}>
        <Reveal as="h1" className={styles.title}>
          Custom rubber products,
          <br />
          quality and excellence.
        </Reveal>

        {/* Kept to one line on a desktop screen, which caps it at roughly a
            hundred characters. The export markets moved out to the
            announcement bar rather than being lost. */}
        <Reveal as="p" delay={1} className={styles.lede}>
          Three decades of tread rubber, retreading, compounds and moulded
          goods — made at Rubber Park, Kerala.
        </Reveal>

        <Reveal delay={2} className={styles.cta}>
          <Button href="#contact" size="lg">
            Request a quote
          </Button>
          <p className={styles.micro}>
            Minimum enquiry quantity of one. Every line quoted on request.
          </p>
        </Reveal>
      </Container>

      <HeroCarousel />
    </section>
  );
}
