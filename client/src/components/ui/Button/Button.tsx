import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';
import { cn } from '@/lib/cn';
import styles from './Button.module.css';

type Variant = 'dark' | 'light' | 'outline' | 'outlineLight';
type Size = 'md' | 'lg';

interface Shared {
  variant?: Variant;
  size?: Size;
  /** Appends the sliding arrow used on Squarespace-style CTAs. */
  withArrow?: boolean;
  className?: string;
  children: ReactNode;
}

type AsAnchor = Shared &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & {
    href: string;
  };

type AsButton = Shared &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: never;
  };

export type ButtonProps = AsAnchor | AsButton;

export function Button({
  variant = 'dark',
  size = 'md',
  withArrow = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(styles.button, styles[variant], styles[size], className);

  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {withArrow && (
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      )}
    </>
  );

  if ('href' in rest && rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }

  const { type = 'button', ...buttonRest } =
    rest as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button className={classes} type={type} {...buttonRest}>
      {content}
    </button>
  );
}
