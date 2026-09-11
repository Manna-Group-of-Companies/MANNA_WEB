import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import '@/styles/index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element #root was not found in index.html');
}

createRoot(container).render(
  <StrictMode>
    <AuthProvider>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </AuthProvider>
  </StrictMode>,
);

/** Longest the boot loader may hold the page, however slow the network. */
const BOOT_LOADER_MAX_MS = 6000;

/**
 * Lifts the tyre loader drawn in index.html. It waits for `load` — the
 * stylesheet, fonts and hero images — so the page is revealed finished
 * rather than assembling itself, but never for longer than the cap above.
 */
function dismissBootLoader() {
  const loader = document.getElementById('boot-loader');
  if (!loader) return;

  let done = false;
  const hide = () => {
    if (done) return;
    done = true;
    loader.setAttribute('data-done', '');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    // Reduced motion shortens the fade to nothing, which can skip the event.
    window.setTimeout(() => loader.remove(), 600);
  };

  if (document.readyState === 'complete') {
    hide();
  } else {
    window.addEventListener('load', hide, { once: true });
    window.setTimeout(hide, BOOT_LOADER_MAX_MS);
  }
}

dismissBootLoader();
