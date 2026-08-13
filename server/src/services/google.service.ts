import { createPublicKey, createVerify } from 'node:crypto';
import type { JsonWebKey } from 'node:crypto';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { decodeBase64Url, decodeJsonSegment } from '../utils/base64url.js';
import { logger } from '../utils/logger.js';
import type { GoogleProfile } from '../types/auth.js';

/**
 * Verifies Google ID tokens against Google's published signing keys, with no
 * dependencies beyond node:crypto. This is the whole trust boundary of
 * sign-in: everything downstream assumes a token that got through here is
 * genuinely Google's statement about a genuine account.
 */

const JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const ISSUERS = new Set(['https://accounts.google.com', 'accounts.google.com']);
/** Tolerated clock drift between us and Google, in seconds. */
const CLOCK_SKEW = 60;
const MIN_CACHE_MS = 5 * 60_000;
const MAX_CACHE_MS = 24 * 60 * 60_000;

interface SigningKey extends JsonWebKey {
  kid?: string;
  alg?: string;
  use?: string;
}

interface TokenHeader {
  alg?: string;
  kid?: string;
}

interface TokenClaims {
  iss?: string;
  aud?: string;
  sub?: string;
  exp?: number;
  iat?: number;
  email?: string;
  email_verified?: boolean | string;
  name?: string;
  given_name?: string;
  picture?: string;
}

let cache: { keys: SigningKey[]; expiresAt: number } | null = null;
/** Concurrent sign-ins share one fetch rather than stampeding Google. */
let inFlight: Promise<SigningKey[]> | null = null;

function cacheMsFrom(cacheControl: string | null): number {
  const maxAge = cacheControl?.match(/max-age=(\d+)/)?.[1];
  const ms = maxAge ? Number(maxAge) * 1000 : MIN_CACHE_MS;
  return Math.min(Math.max(ms, MIN_CACHE_MS), MAX_CACHE_MS);
}

async function fetchKeys(): Promise<SigningKey[]> {
  const response = await fetch(JWKS_URL);
  if (!response.ok) {
    throw new AppError('Could not reach Google to verify your sign-in.', 503, true);
  }

  const body = (await response.json()) as { keys?: SigningKey[] };
  const keys = body.keys ?? [];
  if (keys.length === 0) {
    throw new AppError('Google returned no signing keys.', 503, true);
  }

  cache = { keys, expiresAt: Date.now() + cacheMsFrom(response.headers.get('cache-control')) };
  return keys;
}

async function getKeys(forceRefresh = false): Promise<SigningKey[]> {
  if (!forceRefresh && cache && cache.expiresAt > Date.now()) return cache.keys;

  inFlight ??= fetchKeys().finally(() => {
    inFlight = null;
  });

  return inFlight;
}

async function findKey(kid: string): Promise<SigningKey> {
  const cached = (await getKeys()).find((key) => key.kid === kid);
  if (cached) return cached;

  // Unknown kid usually means Google rotated keys early — refetch once.
  const refreshed = (await getKeys(true)).find((key) => key.kid === kid);
  if (refreshed) return refreshed;

  throw new AppError('Sign-in token was signed with an unknown key.', 401);
}

function verifySignature(key: SigningKey, signedPart: string, signature: string): boolean {
  const publicKey = createPublicKey({ key, format: 'jwk' });
  return createVerify('RSA-SHA256')
    .update(signedPart)
    .verify(publicKey, decodeBase64Url(signature));
}

/** Google sends `email_verified` as a boolean, older tokens as "true". */
function isVerifiedEmail(value: TokenClaims['email_verified']): boolean {
  return value === true || value === 'true';
}

export const googleService = {
  get isConfigured(): boolean {
    return env.googleClientId !== '';
  },

  /**
   * Checks signature, issuer, audience and expiry, and insists on a verified
   * email. Throws AppError(401) on anything suspect.
   */
  async verifyIdToken(idToken: string): Promise<GoogleProfile> {
    if (!this.isConfigured) {
      logger.error('Sign-in attempted while GOOGLE_CLIENT_ID is unset');
      throw new AppError(
        'Google sign-in is not configured on this server.',
        503,
        true,
      );
    }

    const [rawHeader, rawClaims, signature] = idToken.split('.');
    if (!rawHeader || !rawClaims || !signature) {
      throw new AppError('Malformed sign-in token.', 401);
    }

    const header = decodeJsonSegment<TokenHeader>(rawHeader);
    if (!header?.kid || header.alg !== 'RS256') {
      throw new AppError('Unsupported sign-in token.', 401);
    }

    const key = await findKey(header.kid);
    if (!verifySignature(key, `${rawHeader}.${rawClaims}`, signature)) {
      throw new AppError('Sign-in token failed signature checks.', 401);
    }

    const claims = decodeJsonSegment<TokenClaims>(rawClaims);
    if (!claims) throw new AppError('Malformed sign-in token.', 401);

    const now = Math.floor(Date.now() / 1000);

    if (!claims.iss || !ISSUERS.has(claims.iss)) {
      throw new AppError('Sign-in token came from the wrong issuer.', 401);
    }
    if (claims.aud !== env.googleClientId) {
      // Almost always a client/server client-id mismatch rather than an attack.
      logger.warn('Rejected ID token for another audience', { aud: claims.aud });
      throw new AppError('Sign-in token was issued for a different app.', 401);
    }
    if (typeof claims.exp !== 'number' || claims.exp + CLOCK_SKEW <= now) {
      throw new AppError('Sign-in token has expired. Please try again.', 401);
    }
    if (typeof claims.iat === 'number' && claims.iat - CLOCK_SKEW > now) {
      throw new AppError('Sign-in token is not valid yet.', 401);
    }
    if (!claims.sub || !claims.email) {
      throw new AppError('Sign-in token is missing account details.', 401);
    }
    if (!isVerifiedEmail(claims.email_verified)) {
      throw new AppError('Please verify your email with Google first.', 403);
    }

    return {
      googleId: claims.sub,
      email: claims.email.toLowerCase(),
      name: claims.name ?? claims.given_name ?? claims.email.split('@')[0] ?? 'There',
      picture: claims.picture ?? null,
    };
  },
};
