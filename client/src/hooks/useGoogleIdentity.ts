import { useEffect, useState } from 'react';

const SRC = 'https://accounts.google.com/gsi/client';

type ScriptStatus = 'loading' | 'ready' | 'error';

/**
 * Loads the Google Identity Services script once per document and reports
 * when `window.google.accounts.id` is usable. Loaded on demand rather than
 * from index.html so visitors who never open the auth page never fetch it.
 */
export function useGoogleIdentity(): ScriptStatus {
  const [status, setStatus] = useState<ScriptStatus>(() =>
    window.google ? 'ready' : 'loading',
  );

  useEffect(() => {
    if (window.google) {
      setStatus('ready');
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SRC}"]`,
    );
    const script = existing ?? document.createElement('script');

    const onLoad = () => setStatus(window.google ? 'ready' : 'error');
    const onError = () => setStatus('error');

    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);

    if (!existing) {
      script.src = SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => {
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
    };
  }, []);

  return status;
}
