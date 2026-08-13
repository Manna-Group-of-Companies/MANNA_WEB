import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { linkTo, navigate } from '@/lib/router';
import { catalogue, findCategory, productCategories } from '@/data/catalogue';
import { useSearchParam } from '@/hooks/useSearchParams';
import { useWishlist } from '@/context/WishlistContext';
import { Container } from '@/components/ui/Container/Container';
import { Button } from '@/components/ui/Button/Button';
import { PageHead } from '@/components/layout/PageHead/PageHead';
import { ProductCard } from '@/components/product/ProductCard/ProductCard';
import styles from './ProductsPage.module.css';

const ALL = 'all';

/** Fields a search term is matched against, in the order they are weighted. */
function matches(term: string, haystack: string[]): boolean {
  return haystack.some((field) => field.toLowerCase().includes(term));
}

export function ProductsPage() {
  // The category lives in the URL so a filtered view can be linked and shared;
  // the free-text search stays local, so typing does not fill up the history.
  const categoryParam = useSearchParam('category');
  const category =
    categoryParam && findCategory(categoryParam) ? categoryParam : ALL;
  const [query, setQuery] = useState('');
  const { count } = useWishlist();

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();

    return catalogue.filter((product) => {
      if (category !== ALL && product.category !== category) return false;
      if (!term) return true;
      return matches(term, [
        product.name,
        product.summary,
        product.description,
        ...product.materials,
        ...product.applications,
      ]);
    });
  }, [category, query]);

  const active = category === ALL ? null : findCategory(category);

  function selectCategory(next: string) {
    const to = next === ALL ? '/products' : `/products?category=${next}`;
    // The toolbar is mid-page — jumping to the top on every chip would be jarring.
    navigate(to, { scroll: false });
  }

  return (
    <>
      <PageHead
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Products', ...(active ? { href: '/products' } : {}) },
          ...(active ? [{ label: active.label }] : []),
        ]}
        eyebrow="Catalogue"
        title={active ? active.label : 'Every line we make, in one place.'}
        lede={
          active
            ? active.blurb
            : 'Compounded, moulded and fabricated in our own works. Save what fits your job and send the shortlist over — we quote the lot in one go.'
        }
      >
        <Button href="/#contact" withArrow>
          Request a quote
        </Button>
        {count > 0 && (
          <a className={styles.savedLink} {...linkTo('/wishlist')}>
            {count} {count === 1 ? 'product' : 'products'} saved →
          </a>
        )}
      </PageHead>

      <section className={styles.body} id="catalogue">
        <Container>
          <div className={styles.toolbar}>
            <div
              className={styles.filters}
              role="group"
              aria-label="Filter by category"
            >
              <button
                className={cn(
                  styles.chip,
                  category === ALL && styles.chipActive,
                )}
                type="button"
                aria-pressed={category === ALL}
                onClick={() => selectCategory(ALL)}
              >
                All products
              </button>
              {productCategories.map((item) => (
                <button
                  key={item.id}
                  className={cn(
                    styles.chip,
                    category === item.id && styles.chipActive,
                  )}
                  type="button"
                  aria-pressed={category === item.id}
                  onClick={() => selectCategory(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className={styles.search}>
              <label className="sr-only" htmlFor="product-search">
                Search products
              </label>
              <svg
                className={styles.searchIcon}
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <circle
                  cx="9"
                  cy="9"
                  r="5.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M13.2 13.2 17 17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <input
                className={styles.searchInput}
                id="product-search"
                type="search"
                placeholder="Material, application or part…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>

          <p className={styles.count} role="status" aria-live="polite">
            {results.length} of {catalogue.length} products
          </p>

          {results.length > 0 ? (
            <div className={styles.grid}>
              {results.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  delay={index % 3}
                />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <h2 className={styles.emptyTitle}>Nothing matches that yet.</h2>
              <p className={styles.emptyBody}>
                We make a great deal that never reaches the catalogue. Describe
                the part and we will tell you whether it is one of ours.
              </p>
              <div className={styles.emptyActions}>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery('');
                    selectCategory(ALL);
                  }}
                >
                  Clear filters
                </Button>
                <Button href="/#contact" withArrow>
                  Ask an engineer
                </Button>
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
