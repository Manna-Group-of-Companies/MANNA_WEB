import { cn } from '@/lib/cn';
import { useLeadForm } from '@/hooks/useLeadForm';
import { Container } from '@/components/ui/Container/Container';
import { Button } from '@/components/ui/Button/Button';
import { Reveal } from '@/components/ui/Reveal/Reveal';
import { site } from '@/data/site';
import styles from './LeadCta.module.css';

export function LeadCta() {
  const { email, status, message, handleChange, handleSubmit } = useLeadForm({
    source: 'homepage-footer-cta',
  });

  const submitting = status === 'submitting';

  return (
    <section className={styles.section} id="contact">
      <Container size="narrow" className={styles.inner}>
        <Reveal as="h2" className={styles.title}>
          Start your project with Manna.
        </Reveal>

        <Reveal as="p" delay={1} className={styles.lede}>
          Send a drawing, a sample, or the tyre size you need treaded.
          Average response time is 24&ndash;48 hours.
        </Reveal>

        <Reveal delay={2} className={styles.formWrap}>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.row}>
              <label className="sr-only" htmlFor="lead-email">
                Work email
              </label>
              <input
                className={styles.input}
                id="lead-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(event) => handleChange(event.target.value)}
                aria-invalid={status === 'error'}
                disabled={submitting}
              />
              <Button type="submit" size="lg" withArrow disabled={submitting}>
                {submitting ? 'Sending…' : 'Get started'}
              </Button>
            </div>

            <p className={styles.micro}>
              No obligation. We reply within one working day.
            </p>

            <p
              className={cn(
                styles.status,
                status === 'error' && styles.statusError,
                status === 'success' && styles.statusSuccess,
              )}
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          </form>
        </Reveal>

        <Reveal delay={3} className={styles.details}>
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Works</span>
            <address className={styles.detailValue}>
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              {site.address.city}, {site.address.state} {site.address.postcode}
              <br />
              {site.address.country}
            </address>
          </div>

          <div className={styles.detail}>
            <span className={styles.detailLabel}>Speak to us</span>
            <p className={styles.detailValue}>
              <a className={styles.detailLink} href={`tel:${site.phoneHref}`}>
                {site.phone}
              </a>
              <br />
              <a className={styles.detailLink} href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
          </div>

          <div className={styles.detail}>
            <span className={styles.detailLabel}>Find us</span>
            <p className={styles.detailValue}>
              <a
                className={styles.detailLink}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  site.mapsQuery,
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                Get directions
              </a>
              <br />
              GST {site.gst}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
