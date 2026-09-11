import { useEffect, useRef, useState } from 'react';
import { useGoogleIdentity } from '@/hooks/useGoogleIdentity';
import { TyreSpinner } from '@/components/ui/TyreSpinner/TyreSpinner';
import type { AuthMode } from '@/types/auth';
import styles from './GoogleSignInButton.module.css';

interface GoogleSignInButtonProps {
  mode: AuthMode;
  clientId: string;
  /** Receives the Google ID token. Verification happens on the server. */
  onCredential: (credential: string) => void;
  onError: (message: string) => void;
  /** Greys the button out while the credential is being exchanged. */
  busy?: boolean;
}

/** Google only renders inside this range (pixels). */
const MIN_WIDTH = 200;
const MAX_WIDTH = 400;

function clampWidth(width: number): number {
  return Math.round(Math.min(Math.max(width, MIN_WIDTH), MAX_WIDTH));
}

/**
 * Renders Google's own button. It has to be theirs — the branded button is
 * what the sign-in guidelines require, and it is the only thing that can
 * open the account chooser from a same-origin iframe.
 */
export function GoogleSignInButton({
  mode,
  clientId,
  onCredential,
  onError,
  busy = false,
}: GoogleSignInButtonProps) {
  const script = useGoogleIdentity();
  const host = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);

  // Google's button takes a fixed pixel width, so it has to track the card.
  useEffect(() => {
    const element = host.current;
    if (!element) return;

    const measure = () => setWidth(clampWidth(element.clientWidth || MIN_WIDTH));
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Callbacks live in a ref so re-rendering the button never re-initialises
  // Google's SDK — initialize() is process-wide and should run once per config.
  const handlers = useRef({ onCredential, onError });
  handlers.current = { onCredential, onError };

  useEffect(() => {
    if (script !== 'ready' || !clientId) return;
    const element = host.current;
    if (!element) return;

    const identity = window.google?.accounts.id;
    if (!identity) {
      handlers.current.onError('Google sign-in failed to start. Please reload.');
      return;
    }

    identity.initialize({
      client_id: clientId,
      callback: ({ credential }) => {
        if (credential) handlers.current.onCredential(credential);
        else handlers.current.onError('Google did not return a sign-in token.');
      },
      auto_select: false,
      cancel_on_tap_outside: true,
      ux_mode: 'popup',
      context: mode === 'signup' ? 'signup' : 'signin',
      itp_support: true,
    });

    element.replaceChildren();
    identity.renderButton(element, {
      type: 'standard',
      theme: 'filled_black',
      size: 'large',
      text: mode === 'signup' ? 'signup_with' : 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'center',
      width,
    });

    return () => identity.cancel();
  }, [script, clientId, mode, width]);

  if (script === 'error') {
    return (
      <p className={styles.fallback} role="alert">
        Google sign-in could not load. Check your connection or any tracking
        blocker, then reload the page.
      </p>
    );
  }

  return (
    <div className={styles.wrap} data-busy={busy}>
      <div className={styles.host} ref={host} />
      {script === 'loading' && (
        <TyreSpinner
          size="sm"
          className={styles.loading}
          label="Loading Google sign-in…"
        />
      )}
    </div>
  );
}
