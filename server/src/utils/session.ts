import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '../config/env.js';
import { decodeJsonSegment, encodeBase64Url } from './base64url.js';
import type { SessionPayload } from '../types/auth.js';

/**
 * A session token is `<payload>.<signature>` — the payload is readable but
 * not forgeable, which is all a "who is this" cookie needs. Deliberately
 * dependency-free; swap for a JWT library if you ever need key rotation.
 */

const SECONDS_PER_DAY = 86_400;

function sign(body: string): string {
  return createHmac('sha256', env.sessionSecret).update(body).digest('base64url');
}

export function createSessionToken(userId: string): {
  token: string;
  expiresAt: Date;
} {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + env.sessionTtlDays * SECONDS_PER_DAY;
  const payload: SessionPayload = { sub: userId, iat: issuedAt, exp: expiresAt };
  const body = encodeBase64Url(JSON.stringify(payload));

  return { token: `${body}.${sign(body)}`, expiresAt: new Date(expiresAt * 1000) };
}

/** Returns the payload, or null if the token is malformed, forged or expired. */
export function readSessionToken(token: string): SessionPayload | null {
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;

  const expected = Buffer.from(sign(body));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length) return null;
  if (!timingSafeEqual(expected, actual)) return null;

  const payload = decodeJsonSegment<SessionPayload>(body);
  if (!payload || typeof payload.sub !== 'string' || typeof payload.exp !== 'number') {
    return null;
  }
  if (payload.exp * 1000 <= Date.now()) return null;

  return payload;
}
