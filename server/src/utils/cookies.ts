import type { Request, Response } from 'express';
import { env } from '../config/env.js';

/**
 * Cookie handling without `cookie-parser` — Express can already set cookies,
 * and reading one header is not worth a dependency.
 */

export function readCookie(req: Request, name: string): string | null {
  const header = req.headers.cookie;
  if (!header) return null;

  for (const part of header.split(';')) {
    const separator = part.indexOf('=');
    if (separator === -1) continue;
    if (part.slice(0, separator).trim() !== name) continue;
    return decodeURIComponent(part.slice(separator + 1).trim());
  }

  return null;
}

export function readSessionCookie(req: Request): string | null {
  return readCookie(req, env.sessionCookieName);
}

export function setSessionCookie(res: Response, token: string, expiresAt: Date): void {
  res.cookie(env.sessionCookieName, token, {
    httpOnly: true,
    // Lax is enough while the client shares an origin with the API; a client
    // on another site needs None or the browser never sends this back.
    sameSite: env.cookieSameSite,
    secure: env.cookieSecure,
    path: '/',
    expires: expiresAt,
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(env.sessionCookieName, {
    httpOnly: true,
    // Must match setSessionCookie exactly, or the browser keeps the old cookie.
    sameSite: env.cookieSameSite,
    secure: env.cookieSecure,
    path: '/',
  });
}
