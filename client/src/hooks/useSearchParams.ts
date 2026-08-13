import { useSyncExternalStore } from 'react';
import { getSearch, subscribeToRoute } from '@/lib/router';

/**
 * Re-renders on query string changes, including the back button.
 * Returns the raw string so the snapshot stays referentially stable —
 * parse it with `new URLSearchParams(...)` at the call site.
 */
export function useSearch(): string {
  return useSyncExternalStore(subscribeToRoute, getSearch, getSearch);
}

/** Convenience wrapper for a single query parameter. */
export function useSearchParam(key: string): string | null {
  return new URLSearchParams(useSearch()).get(key);
}
