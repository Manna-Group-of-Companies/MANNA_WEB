import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';
import { HomePage } from '@/pages/HomePage/HomePage';
import { AuthPage } from '@/pages/AuthPage/AuthPage';
import { ProductsPage } from '@/pages/ProductsPage/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage/ProductDetailPage';
import { WishlistPage } from '@/pages/WishlistPage/WishlistPage';
import { AboutPage } from '@/pages/AboutPage/AboutPage';
import { AboutDetailPage } from '@/pages/AboutDetailPage/AboutDetailPage';
import { usePathname } from '@/hooks/usePathname';
import type { AuthMode } from '@/types/auth';
import styles from './App.module.css';

/** Full-bleed screens that bring their own <main>, header and footer. */
const AUTH_ROUTES: Record<string, AuthMode> = {
  '/login': 'login',
  '/signup': 'signup',
};

const PRODUCT_PREFIX = '/products/';
const ABOUT_PREFIX = '/about/';

function normalize(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
}

/** Everything unrecognised falls through to the marketing page. */
function resolve(path: string) {
  if (path === '/products') return <ProductsPage />;
  if (path.startsWith(PRODUCT_PREFIX)) {
    const slug = decodeURIComponent(path.slice(PRODUCT_PREFIX.length));
    return <ProductDetailPage slug={slug} />;
  }
  if (path === '/about') return <AboutPage />;
  if (path.startsWith(ABOUT_PREFIX)) {
    const slug = decodeURIComponent(path.slice(ABOUT_PREFIX.length));
    return <AboutDetailPage slug={slug} />;
  }
  if (path === '/wishlist') return <WishlistPage />;
  return <HomePage />;
}

export default function App() {
  const path = normalize(usePathname());
  const authMode = AUTH_ROUTES[path];

  return (
    <>
      <a className={styles.skipLink} href="#main">
        Skip to content
      </a>

      {authMode ? (
        <AuthPage mode={authMode} />
      ) : (
        <>
          <Header />
          {/* Keyed on the path so a route change remounts the page and
              replays its entrance. Query-string changes — the catalogue
              filters — keep the same key and stay put. */}
          <main id="main" key={path} data-page="">
            {resolve(path)}
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
