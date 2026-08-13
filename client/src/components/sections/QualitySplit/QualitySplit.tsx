import { qualityPoints } from '@/data/sections';
import { Container } from '@/components/ui/Container/Container';
import { PatternArt } from '@/components/ui/PatternArt/PatternArt';
import { TickList } from '@/components/ui/TickList/TickList';
import { Button } from '@/components/ui/Button/Button';
import { Reveal } from '@/components/ui/Reveal/Reveal';
import styles from './QualitySplit.module.css';

export function QualitySplit() {
  return (
    <section className={styles.section} id="quality">
      <Container className={styles.grid}>
        <Reveal className={styles.media}>
          <div className={styles.art}>
            <PatternArt pattern="rings" />
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeValue}>
              30<span className={styles.badgeUnit}>yrs</span>
            </span>
            <span className={styles.badgeCaption}>Manufacturing in Kerala</span>
          </div>
        </Reveal>

        <Reveal delay={1} className={styles.copy}>
          <p className={styles.eyebrow}>Why choose us</p>
          <h2 className={styles.title}>Quality is non-negotiable here.</h2>
          <p className={styles.lede}>
            We use only the finest raw materials, and stringent quality control
            runs through every stage of manufacture. Retreading a tyre takes a
            fraction of the oil a new one needs — so the sustainable choice and
            the economical one turn out to be the same choice.
          </p>
          <TickList items={qualityPoints} size="lg" className={styles.list} />
          <Button href="#contact" variant="outline" withArrow>
            Talk to us about your requirement
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
