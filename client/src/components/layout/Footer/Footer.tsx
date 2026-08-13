import { Container } from '@/components/ui/Container/Container';
import { Logo } from '@/components/layout/Logo/Logo';
import { linkProps } from '@/lib/router';
import { footerNav, legalLinks, site } from '@/data/site';
import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Logo />
            <p className={styles.blurb}>{site.blurb}</p>
            <a className={styles.email} href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>

          {footerNav.map((group) => (
            <nav
              className={styles.col}
              key={group.title}
              aria-label={group.title}
            >
              <h3 className={styles.colTitle}>{group.title}</h3>
              <ul className={styles.colList}>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a className={styles.colLink} {...linkProps(link.href)}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className={styles.bar}>
          <p className={styles.legal}>
            &copy; {year} {site.name} {site.suffix}. All rights reserved.
          </p>
          <ul className={styles.legalLinks}>
            {legalLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
