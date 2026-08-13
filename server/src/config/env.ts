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
  corsOrigins: readList('CORS_ORIGIN', ['http://localhost:5173']),
  /** Serve ../client/dist alongside the API (single-process deployments). */
  serveClient: readBoolean('SERVE_CLIENT', false),

  /**
   * OAuth client id from the Google Cloud console. Empty means sign-in is not
   * configured — the auth routes then fail loudly instead of half-working.
   */
  googleClientId: process.env.GOOGLE_CLIENT_ID?.trim() ?? '',
  sessionSecret: readSessionSecret(),
  sessionCookieName: process.env.SESSION_COOKIE_NAME?.trim() || 'manna_session',
  sessionTtlDays: readNumber('SESSION_TTL_DAYS', 30),
  /** Secure cookies need HTTPS, which localhost does not have. */
  cookieSecure: readBoolean('COOKIE_SECURE', inProduction),
} as const;

export const isProduction = inProduction;
