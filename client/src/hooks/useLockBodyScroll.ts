import { useEffect } from 'react';

/** Freezes page scrolling while an overlay (e.g. the mobile menu) is open. */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    document.body.dataset.scrollLocked = 'true';
    return () => {
      delete document.body.dataset.scrollLocked;
    };
  }, [locked]);
}
