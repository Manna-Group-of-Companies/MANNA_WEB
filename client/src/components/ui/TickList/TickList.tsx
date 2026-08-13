import { cn } from '@/lib/cn';
import styles from './TickList.module.css';

interface TickListProps {
  items: string[];
  size?: 'md' | 'lg';
  className?: string;
}

export function TickList({ items, size = 'md', className }: TickListProps) {
  return (
    <ul className={cn(styles.list, styles[size], className)}>
      {items.map((item) => (
        <li key={item} className={styles.item}>
          <svg className={styles.tick} viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M3.5 8.6l3 3 6-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
