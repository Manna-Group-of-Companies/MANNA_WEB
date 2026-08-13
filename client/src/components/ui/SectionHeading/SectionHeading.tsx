import { cn } from '@/lib/cn';
import { Reveal } from '@/components/ui/Reveal/Reveal';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: 'start' | 'center';
  /** Inverts colours for use on the dark band. */
  tone?: 'ink' | 'light';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'start',
  tone = 'ink',
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      as="header"
      className={cn(styles.head, styles[align], styles[tone], className)}
    >
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h2 className={styles.title}>{title}</h2>
      {lede && <p className={styles.lede}>{lede}</p>}
    </Reveal>
  );
}
