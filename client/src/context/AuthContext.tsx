import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import {
  fetchCurrentUser,
  signInWithGoogle,
  signOut as signOutRequest,
} from '@/lib/api';
import type { SessionUser } from '@/types/auth';

interface AuthValue {
  user: SessionUser | null;
  /** False until the initial "am I signed in?" check has come back. */
  ready: boolean;
  signingIn: boolean;
  /** Exchanges a Google ID token for a session. Throws on failure. */
  signIn: (credential: string) => Promise<{ message: string; isNewUser: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  // One session check on boot. A failure here means the API is down, which
  // the marketing page should survive — treat it as signed out.
  useEffect(() => {
    let cancelled = false;

    fetchCurrentUser()
      .then((response) => {
        if (!cancelled) setUser(response.data?.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (credential: string) => {
    setSigningIn(true);
    try {
      const response = await signInWithGoogle(credential);
      setUser(response.data?.user ?? null);
      return {
        message: response.message,
        isNewUser: response.data?.isNewUser ?? false,
      };
    } finally {
      setSigningIn(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await signOutRequest();
    } finally {
      // Stop Google from silently signing the visitor straight back in.
      window.google?.accounts.id.disableAutoSelect();
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ user, ready, signingIn, signIn, signOut }),
    [user, ready, signingIn, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}
