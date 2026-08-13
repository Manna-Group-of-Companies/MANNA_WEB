import type { AboutBlock } from '@/types/content';
import { cn } from '@/lib/cn';
import { TickList } from '@/components/ui/TickList/TickList';
import { Reveal } from '@/components/ui/Reveal/Reveal';
import styles from './AboutBody.module.css';

interface AboutBodyProps {
  blocks: AboutBlock[];
  className?: string;
}

/**
 * Renders one About page's block stack.
 *
 * Every block type the content model allows is handled here, so a copy change
 * in `data/about.ts` never needs a component change.
 *
 * Each block is its own scroll reveal rather than the article being one, so a
 * long page arrives a paragraph at a time as you read down it. The stagger is
 * capped: past the fifth block the delay would outlast the scroll that
 * triggered it.
 */
const MAX_STAGGER = 5;

export function AboutBody({ blocks, className }: AboutBodyProps) {
  return (
    <article className={cn(styles.body, className)}>
      {blocks.map((block, index) => (
        <Block block={block} delay={Math.min(index, MAX_STAGGER)} key={index} />
      ))}
    </article>
  );
}

interface BlockProps {
  block: AboutBlock;
  delay: number;
}

function Block({ block, delay }: BlockProps) {
  switch (block.kind) {
    case 'lead':
      return (
        <Reveal as="p" className={styles.lead} delay={delay}>
          {block.text}
        </Reveal>
      );

    case 'para':
      return (
        <Reveal as="p" className={styles.para} delay={delay}>
          {block.text}
        </Reveal>
      );

    case 'heading':
      return (
        <Reveal as="h2" className={styles.heading} delay={delay}>
          {block.text}
        </Reveal>
      );

    case 'quote':
      return (
        <Reveal as="figure" className={styles.quoteWrap} delay={delay}>
          <blockquote className={styles.quote}>{block.text}</blockquote>
          {block.source && (
            <figcaption className={styles.source}>{block.source}</figcaption>
          )}
        </Reveal>
      );

    case 'points':
      return (
        <ol className={styles.points}>
          {block.items.map((point, index) => (
            <Reveal
              as="li"
              className={styles.point}
              delay={Math.min(index, MAX_STAGGER)}
              key={point.title}
            >
              <span className={styles.pointIndex} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2 className={styles.pointTitle}>{point.title}</h2>
              <p className={styles.pointBody}>{point.body}</p>
            </Reveal>
          ))}
        </ol>
      );

    case 'facts':
      return (
        <Reveal as="dl" className={styles.facts} delay={delay}>
          {block.rows.map((row) => (
            <div className={styles.factRow} key={row.label}>
              <dt className={styles.factLabel}>{row.label}</dt>
              <dd className={styles.factValue}>{row.value}</dd>
            </div>
          ))}
        </Reveal>
      );

    case 'list':
      return (
        <Reveal delay={delay}>
          <TickList className={styles.list} items={block.items} />
        </Reveal>
      );

    case 'timeline':
      return (
        // The rail draws itself down the page once the list is in view; the
        // milestones then arrive against it one at a time.
        <Reveal as="ol" className={styles.timeline} delay={delay}>
          {block.items.map((item, index) => (
            <Reveal
              as="li"
              className={styles.milestone}
              delay={Math.min(index, MAX_STAGGER)}
              key={item.title}
            >
              <p className={styles.period}>{item.period}</p>
              <h2 className={styles.milestoneTitle}>{item.title}</h2>
              <p className={styles.milestoneBody}>{item.body}</p>
            </Reveal>
          ))}
        </Reveal>
      );
  }
}
