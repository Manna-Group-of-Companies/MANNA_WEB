import { useEffect } from 'react';
import { linkTo } from '@/lib/router';
import {
  categoryLabel,
  findProductBySlug,
  relatedProducts,
} from '@/data/catalogue';
import { site } from '@/data/site';
import { Container } from '@/components/ui/Container/Container';
import { Button } from '@/components/ui/Button/Button';
import { TickList } from '@/components/ui/TickList/TickList';
import { PatternArt } from '@/components/ui/PatternArt/PatternArt';
import { Reveal } from '@/components/ui/Reveal/Reveal';
import { PageHead } from '@/components/layout/PageHead/PageHead';
import { ProductCard } from '@/components/product/ProductCard/ProductCard';
import { WishlistButton } from '@/components/product/WishlistButton/WishlistButton';
import styles from './ProductDetailPage.module.css';

interface ProductDetailPageProps {
  slug: string;
}

export function ProductDetailPage({ slug }: ProductDetailPageProps) {
  const product = findProductBySlug(slug);

  // The tab title is the one piece of chrome a client-side route has to keep
  // in step by hand.
  useEffect(() => {
    const previous = document.title;
    document.title = product
      ? `${product.name} — ${site.name} ${site.suffix}`
      : `Product not found — ${site.name} ${site.suffix}`;
    return () => {
      document.title = previous;
    };
  }, [product]);

  if (!product) {
    return (
      <PageHead
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Not found' },
        ]}
        eyebrow="404"
        title="We could not find that product."
        lede="The link may be out of date, or the line may have been renamed. The full catalogue is one click away."
      >
        <Button withArrow {...linkTo('/products')}>
          Browse the catalogue
        </Button>
        <Button variant="outline" href="/#contact">
          Ask an engineer
        </Button>
      </PageHead>
    );
  }

  const related = relatedProducts(product);
  const quoteHref = `mailto:${site.email}?subject=${encodeURIComponent(
    `Quote request: ${product.name}`,
  )}&body=${encodeURIComponent(
    `Please quote the following:\n\n- ${product.name} (${product.slug})\n\nQuantity:\nSize / drawing:\nApplication:\n`,
  )}`;

  return (
    <>
      <PageHead
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          {
            label: categoryLabel(product.category),
            href: `/products?category=${product.category}`,
          },
          { label: product.name },
        ]}
        className={styles.head}
        eyebrow={categoryLabel(product.category)}
        title={product.name}
      />

      <section className={styles.hero}>
        <Container>
          <div className={styles.split}>
            <Reveal className={styles.stage}>
              {product.image ? (
                <picture>
                  {product.image.webpSrcSet && (
                    <source type="image/webp" srcSet={product.image.webpSrcSet} />
                  )}
                  <img
                    className={styles.photo}
                    data-fit={product.image.fit ?? 'cover'}
                    src={product.image.src}
                    srcSet={product.image.srcSet}
                    sizes="(max-width: 900px) 92vw, 560px"
                    alt={product.name}
                  />
                </picture>
              ) : (
                <PatternArt pattern={product.pattern} className={styles.art} />
              )}
              {product.badge && (
                <span className={styles.badge}>{product.badge}</span>
              )}
            </Reveal>

            <Reveal className={styles.detail} delay={1}>
              <p className={styles.summary}>{product.summary}</p>
              <p className={styles.description}>{product.description}</p>

              <dl className={styles.facts}>
                <div className={styles.fact}>
                  <dt>Lead time</dt>
                  <dd>{product.leadTime}</dd>
                </div>
                <div className={styles.fact}>
                  <dt>Minimum order</dt>
                  <dd>{product.moq}</dd>
                </div>
              </dl>

              <div className={styles.materials}>
                <p className={styles.factLabel}>Compounds</p>
                <ul className={styles.pills}>
                  {product.materials.map((material) => (
                    <li className={styles.pill} key={material}>
                      {material}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.actions}>
                <Button href={quoteHref} size="lg" withArrow>
                  Request a quote
                </Button>
                <WishlistButton
                  productId={product.id}
                  productName={product.name}
                  variant="full"
                />
              </div>

              <p className={styles.note}>
                Every job is quoted on drawing and quantity, so the catalogue
                carries no price. Send the drawing — or the worn part — and you
                will have a figure back the same week.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className={styles.specsBand}>
        <Container>
          <div className={styles.columns}>
            <Reveal className={styles.column}>
              <h2 className={styles.columnTitle}>Specification</h2>
              <dl className={styles.specs}>
                {product.specs.map((spec) => (
                  <div className={styles.specRow} key={spec.label}>
                    <dt className={styles.specLabel}>{spec.label}</dt>
                    <dd className={styles.specValue}>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal className={styles.column} delay={1}>
              <h2 className={styles.columnTitle}>What you get</h2>
              <TickList items={product.features} />

              <h2 className={styles.columnTitle}>Typical applications</h2>
              <ul className={styles.applications}>
                {product.applications.map((application) => (
                  <li className={styles.application} key={application}>
                    {application}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className={styles.related}>
          <Container>
            <div className={styles.relatedHead}>
              <h2 className={styles.relatedTitle}>
                More in {categoryLabel(product.category).toLowerCase()}
              </h2>
              <a
                className={styles.relatedLink}
                {...linkTo(`/products?category=${product.category}`)}
              >
                View the category →
              </a>
            </div>
            <div className={styles.relatedGrid}>
              {related.map((item, index) => (
                <ProductCard key={item.id} product={item} delay={index} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
