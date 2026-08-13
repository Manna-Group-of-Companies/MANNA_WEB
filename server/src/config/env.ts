import 'dotenv/config';
import { logger } from '../utils/logger.js';

function readNumber(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a number, got "${raw}"`);
  }
  return parsed;
}

function readBoolean(key: string, fallback: boolean): boolean {
  const raw = process.env[key];
  if (raw === undefined) return fallback;
  return raw === 'true' || raw === '1';
}

function readList(key: string, fallback: string[]): string[] {
  const raw = process.env[key];
  if (!raw) return fallback;
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

const nodeEnv = process.env.NODE_ENV ?? 'development';
const inProduction = nodeEnv === 'production';

/** Hoisted: the CORS and cookie rules below both depend on these. */
const serveClient = readBoolean('SERVE_CLIENT', false);
const cookieSecure = readBoolean('COOKIE_SECURE', inProduction);

/**
 * A browser's `Origin` header is scheme + host + port, never a trailing slash
 * and never a path. `https://example.com/` therefore matches nothing, and the
 * failure looks like a server outage rather than a typo — so normalise it.
 *
 * Unset in production is a hard error the same way SESSION_SECRET is: falling
 * back to localhost means every real request is refused. SERVE_CLIENT=true is
 * the exception, since then the client is same-origin and CORS never applies.
 */
function readCorsOrigins(): string[] {
  const raw = process.env.CORS_ORIGIN;

  if (!raw) {
    if (inProduction && !serveClient) {
      throw new Error(
        'CORS_ORIGIN must list the deployed site origin in production — ' +
          'without it the API only answers http://localhost:5173.',
      );
    }
    return ['http://localhost:5173'];
  }

  return readList('CORS_ORIGIN', []).map((origin) => origin.replace(/\/+$/, ''));
}

/**
 * The client is served from a different site than the API in production
 * (Cloudflare vs Render), and a browser will not attach a Lax cookie to a
 * cross-site fetch — sign-in would appear to work, then every later request
 * would come back signed out. None is what carries across, and browsers only
 * accept None alongside Secure.
 */
function readCookieSameSite(): 'lax' | 'none' | 'strict' {
  const raw = process.env.SESSION_COOKIE_SAMESITE?.trim().toLowerCase();
  const value = raw || (inProduction && !serveClient ? 'none' : 'lax');

  if (value !== 'lax' && value !== 'none' && value !== 'strict') {
    throw new Error(
      `SESSION_COOKIE_SAMESITE must be lax, none or strict, got "${raw}"`,
    );
  }

  if (value === 'none' && !cookieSecure) {
    throw new Error(
      'SESSION_COOKIE_SAMESITE=none requires COOKIE_SECURE=true — a browser ' +
        'discards a None cookie that is not also Secure.',
    );
  }

  return value;
}

/** Only used when SESSION_SECRET is absent outside production. */
const DEV_SESSION_SECRET = 'manna-development-session-secret-not-for-production';

function readSessionSecret(): string {
  const raw = process.env.SESSION_SECRET;

  if (!raw) {
    if (inProduction) {
      throw new Error(
        'SESSION_SECRET must be set in production — sessions are signed with it.',
      );
    }
    logger.warn('SESSION_SECRET is unset; using the insecure development key.');
    return DEV_SESSION_SECRET;
  }

  if (inProduction && raw.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters in production.');
  }

  return raw;
}

export const env = {
  nodeEnv,
  port: readNumber('PORT', 4000),
  corsOrigins: readCorsOrigins(),
  /** Serve ../client/dist alongside the API (single-process deployments). */
  serveClient,

  /**
   * OAuth client id from the Google Cloud console. Empty means sign-in is not
   * configured — the auth routes then fail loudly instead of half-working.
   */
  googleClientId: process.env.GOOGLE_CLIENT_ID?.trim() ?? '',
  sessionSecret: readSessionSecret(),
  sessionCookieName: process.env.SESSION_COOKIE_NAME?.trim() || 'manna_session',
  sessionTtlDays: readNumber('SESSION_TTL_DAYS', 30),
  /** Secure cookies need HTTPS, which localhost does not have. */
  cookieSecure,
  cookieSameSite: readCookieSameSite(),
} as const;

export const isProduction = inProduction;
