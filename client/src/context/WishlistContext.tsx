import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';

/**
 * Saved products, held in localStorage.
 *
 * Deliberately not on the server: a buyer builds a shortlist before they have
 * any reason to sign in, and losing it at the login wall is the fastest way to
 * lose the enquiry. Move to the API the day the list has to follow somebody
 * between devices.
 */

const STORAGE_KEY = 'manna:wishlist';

interface WishlistValue {
  /** Product ids, most recently saved first. */
  ids: string[];
  count: number;
  has: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistValue | null>(null);

/** Private browsing and disabled storage both throw here — neither is fatal. */
function readStored(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    return [];
  }
}

function writeStored(ids: string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage full or blocked. The list still works for this session.
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(readStored);

  useEffect(() => {
    writeStored(ids);
  }, [ids]);

  // A second tab is the same visitor; keep the header count honest.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== STORAGE_KEY) return;
      setIds(readStored());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add = useCallback((id: string) => {
    setIds((current) =>
      current.includes(id) ? current : [id, ...current],
    );
  }, []);

  const remove = useCallback((id: string) => {
    setIds((current) => current.filter((saved) => saved !== id));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  // Decided inside the setter, so two clicks in the same tick cannot both
  // read the pre-click list and cancel each other out.
  const toggle = useCallback((id: string) => {
    setIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [id, ...current],
    );
  }, []);

  const value = useMemo<WishlistValue>(
    () => ({
      ids,
      count: ids.length,
      has: (id: string) => ids.includes(id),
      add,
      remove,
      toggle,
      clear,
    }),
    [ids, add, remove, toggle, clear],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistValue {
  const value = useContext(WishlistContext);
  if (!value) {
    throw new Error('useWishlist must be used inside <WishlistProvider>');
  }
  return value;
}
