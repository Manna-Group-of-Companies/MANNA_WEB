import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { internalPath, linkTo, navigate } from '@/lib/router';
import { site } from '@/data/site';
import { useAuth } from '@/context/AuthContext';
import { useSearchParam } from '@/hooks/useSearchParams';
import { Logo } from '@/components/layout/Logo/Logo';
import { Button } from '@/components/ui/Button/Button';
import { TickList } from '@/components/ui/TickList/TickList';
import { TyreSpinner } from '@/components/ui/TyreSpinner/TyreSpinner';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton/GoogleSignInButton';
import type { AuthMode } from '@/types/auth';
import styles from './AuthPage.module.css';

interface AuthPageProps {
  mode: AuthMode;
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

/** Where a visitor lands once they are through the door, absent a `?next=`. */
const AFTER_AUTH = '/';

const COPY: Record<AuthMode, { title: string; lede: string }> = {
  login: {
    title: 'Sign in to Manna.',
    lede: 'Pick up quotes, drawings and order history where you left them.',
  },
  signup: {
    title: 'Create your Manna account.',
    lede: 'One click with Google and your project workspace is ready.',
  },
};

const BENEFITS = [
  'Quotes and drawings kept in one place',
  'Datasheets and cure records on demand',
  'A named engineer on every enquiry',
];

export function AuthPage({ mode }: AuthPageProps) {
  const { user, ready, signingIn, signIn, signOut } = useAuth();
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const copy = COPY[mode];
  // Whoever sent the visitor here can ask for them back — the review form
  // does, so signing in to write one returns to the reviews rather than to
  // the top of the homepage.
  const after = internalPath(useSearchParam('next')) ?? AFTER_AUTH;

  // A signed-in visitor who lands here gets the "you're already in" state,
  // so the back button after signing in is not a dead end.
  useEffect(() => {
    setError('');
    setNotice('');
  }, [mode]);

  async function handleCredential(credential: string) {
    setError('');
    try {
      const result = await signIn(credential);
      setNotice(result.message);
      navigate(after);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Sign-in failed. Please try again.',
      );
    }
  }

  return (
    <main className={styles.page} id="main">
      <section className={styles.aside}>
        <div className={styles.asideInner}>
          <Logo {...linkTo('/')} />
          <p className={styles.eyebrow}>Customer portal</p>
          <h2 className={styles.asideTitle}>{site.tagline}</h2>
          <TickList items={BENEFITS} className={styles.benefits} />
          <p className={styles.asideFoot}>
            Questions? <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.card}>
          <Logo className={styles.cardLogo} {...linkTo('/')} />

          <header className={styles.head}>
            <h1 className={styles.title}>{copy.title}</h1>
            <p className={styles.lede}>{copy.lede}</p>
          </header>

          {!ready ? (
            <TyreSpinner className={styles.loading} label="Checking your session…" />
          ) : user ? (
            <div className={styles.signedIn}>
              <div className={styles.identity}>
                {user.picture ? (
                  <img
                    className={styles.avatar}
                    src={user.picture}
                    alt=""
                    width={44}
                    height={44}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className={styles.avatarFallback} aria-hidden="true">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className={styles.identityText}>
                  <strong>{user.name}</strong>
                  <span className={styles.identityEmail}>{user.email}</span>
                </span>
              </div>

              <Button size="lg" withArrow {...linkTo(after)}>
                Continue
              </Button>
              <button
                className={styles.quiet}
                type="button"
                onClick={() => void signOut()}
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              {CLIENT_ID ? (
                <GoogleSignInButton
                  mode={mode}
                  clientId={CLIENT_ID}
                  busy={signingIn}
                  onCredential={(credential) => void handleCredential(credential)}
                  onError={setError}
                />
              ) : (
                <p className={styles.setup} role="alert">
                  Google sign-in is not configured. Set{' '}
                  <code>VITE_GOOGLE_CLIENT_ID</code> in <code>client/.env</code>{' '}
                  and <code>GOOGLE_CLIENT_ID</code> in <code>server/.env</code>,
                  then restart both dev servers.
                </p>
              )}

              <p className={styles.micro}>
                Google is the only way in — there is no password to forget.
              </p>
            </>
          )}

          <p
            className={cn(
              styles.status,
              error && styles.statusError,
              notice && styles.statusSuccess,
            )}
            role="status"
            aria-live="polite"
          >
            {error || notice || (signingIn ? 'Signing you in…' : '')}
          </p>

          {!user && (
            <p className={styles.switch}>
              {mode === 'login' ? (
                <>
                  New to Manna? <a {...linkTo('/signup')}>Create an account</a>
                </>
              ) : (
                <>
                  Already have an account? <a {...linkTo('/login')}>Sign in</a>
                </>
              )}
            </p>
          )}

          <p className={styles.legal}>
            By continuing you agree to our <a href="/#top">terms</a> and{' '}
            <a href="/#top">privacy policy</a>. We only read your name, email
            address and profile picture from Google.
          </p>
        </div>

        <p className={styles.back}>
          <a {...linkTo('/')}>
            &larr; Back to {site.name} {site.suffix}
          </a>
        </p>
      </section>
    </main>
  );
}
