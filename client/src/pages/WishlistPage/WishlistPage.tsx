import { useEffect, useMemo, useState } from 'react';
import { linkTo } from '@/lib/router';
import { findProductsByIds } from '@/data/catalogue';
import { site } from '@/data/site';
import { useWishlist } from '@/context/WishlistContext';
import { Container } from '@/components/ui/Container/Container';
import { Button } from '@/components/ui/Button/Button';
import { PageHead } from '@/components/layout/PageHead/PageHead';
import { ProductCard } from '@/components/product/ProductCard/ProductCard';
import styles from './WishlistPage.module.css';

/** Builds the enquiry email so the shortlist arrives as one request, not six. */
function quoteHref(names: string[]): string {
  const subject = `Quote request: ${names.length} saved ${
    names.length === 1 ? 'product' : 'products'
  }`;
  const body = [
    'Please quote the following:',
    '',
    ...names.map((name) => `- ${name}`),
    '',
    'Quantities:',
    'Sizes / drawings:',
    'Application:',
    '',
  ].join('\n');

  return `mailto:${site.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export function WishlistPage() {
  const { ids, count, remove, clear } = useWishlist();
  const [confirmingClear, setConfirmingClear] = useState(false);

  const products = useMemo(() => findProductsByIds(ids), [ids]);

  // A saved id that no longer resolves is a line we have retired. Drop it from
  // storage too, or the header count keeps counting something unshowable.
  useEffect(() => {
    if (products.length === ids.length) return;
    const live = new Set(products.map((product) => product.id));
    ids.filter((id) => !live.has(id)).forEach(remove);
  }, [ids, products, remove]);

  useEffect(() => {
    const previous = document.title;
    document.title = `Wishlist (${count}) — ${site.name} ${site.suffix}`;
    return () => {
      document.title = previous;
    };
  }, [count]);

  // Emptying the list should retire the confirm prompt with it.
  useEffect(() => {
    if (count === 0) setConfirmingClear(false);
  }, [count]);

  if (products.length === 0) {
    return (
      <PageHead
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]}
        eyebrow="Wishlist"
        title="Nothing saved yet."
        lede="Tap the heart on any product and it lands here. Build a shortlist as you browse, then send the whole thing over for a single quote."
      >
        <Button withArrow {...linkTo('/products')}>
          Browse the catalogue
        </Button>
      </PageHead>
    );
  }

  return (
    <>
      <PageHead
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]}
        eyebrow="Wishlist"
        title={`${products.length} ${
          products.length === 1 ? 'product' : 'products'
        } saved.`}
        lede="Saved to this browser, so the list survives a refresh. Send it over and we will quote every line in one reply."
      >
        <Button
          href={quoteHref(products.map((product) => product.name))}
          size="lg"
          withArrow
        >
          Request a quote for all
        </Button>

        {confirmingClear ? (
          <span className={styles.confirm} role="status">
            <span className={styles.confirmText}>Clear the whole list?</span>
            <button
              className={styles.danger}
              type="button"
              onClick={() => clear()}
            >
              Yes, clear
            </button>
            <button
              className={styles.quiet}
              type="button"
              onClick={() => setConfirmingClear(false)}
            >
              Keep it
            </button>
          </span>
        ) : (
          <button
            className={styles.quiet}
            type="button"
            onClick={() => setConfirmingClear(true)}
          >
            Clear wishlist
          </button>
        )}
      </PageHead>

      <section className={styles.body}>
        <Container>
          <div className={styles.grid}>
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                delay={index % 3}
                action={
                  <button
                    className={styles.remove}
                    type="button"
                    aria-label={`Remove ${product.name} from your wishlist`}
                    onClick={() => remove(product.id)}
                  >
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path
                        d="M6 6l8 8M14 6l-8 8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                }
              />
            ))}
          </div>

          <div className={styles.foot}>
            <p className={styles.footText}>
              Need something that is not on the list? We make a great deal that
              never reaches the catalogue.
            </p>
            <div className={styles.footActions}>
              <Button variant="outline" {...linkTo('/products')}>
                Keep browsing
              </Button>
              <Button variant="outline" href="/#contact">
                Ask an engineer
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
