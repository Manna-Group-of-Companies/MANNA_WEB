import { useState } from 'react';
import { announcement } from '@/data/site';
import styles from './AnnouncementBar.module.css';

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <span className={styles.tag}>{announcement.tag}</span>
        <p className={styles.text}>
          {announcement.text} —{' '}
          <a className={styles.link} href={announcement.link.href}>
            {announcement.link.label}
          </a>
        </p>
        <button
          className={styles.close}
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss announcement"
        >
          <svg viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M2 2l10 10M12 2L2 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
