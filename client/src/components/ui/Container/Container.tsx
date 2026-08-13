import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './Container.module.css';

interface ContainerProps {
  as?: ElementType;
  /** Narrower measure for centred editorial blocks. */
  size?: 'default' | 'narrow' | 'wide';
  className?: string;
  children: ReactNode;
}

export function Container({
  as: Tag = 'div',
  size = 'default',
  className,
  children,
}: ContainerProps) {
  return (
    <Tag className={cn(styles.container, styles[size], className)}>
      {children}
    </Tag>
  );
}
