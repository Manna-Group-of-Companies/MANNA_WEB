import { useSyncExternalStore } from 'react';
import { getPathname, subscribeToRoute } from '@/lib/router';

/** Re-renders on history changes, including the back button. */
export function usePathname(): string {
  return useSyncExternalStore(subscribeToRoute, getPathname, getPathname);
}
