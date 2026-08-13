import type { NextFunction, Request, Response } from 'express';
import { parseGoogleCredential } from '../validators/auth.validator.js';
import { authService } from '../services/auth.service.js';
import {
  clearSessionCookie,
  readSessionCookie,
  setSessionCookie,
} from '../utils/cookies.js';
import type { ApiSuccess } from '../types/api.js';
import type { SessionUser } from '../types/auth.js';

type UserPayload = { user: SessionUser | null };

export async function signInWithGoogle(
  req: Request,
  res: Response<ApiSuccess<UserPayload & { isNewUser: boolean }>>,
  next: NextFunction,
): Promise<void> {
  try {
    const credential = parseGoogleCredential(req.body);
    const { user, token, expiresAt, isNewUser } =
      await authService.signInWithGoogle(credential);

    setSessionCookie(res, token, expiresAt);

    res.status(isNewUser ? 201 : 200).json({
      ok: true,
      message: isNewUser
        ? `Welcome to Manna, ${user.name}. Your account is ready.`
        : `Welcome back, ${user.name}.`,
      data: { user, isNewUser },
    });
  } catch (error) {
    next(error);
  }
}

/** Always 200 — "nobody is signed in" is an answer, not an error. */
export async function getCurrentUser(
  req: Request,
  res: Response<ApiSuccess<UserPayload>>,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await authService.userFromToken(readSessionCookie(req));

    // A cookie that no longer resolves is stale; stop sending it back.
    if (!user && readSessionCookie(req)) clearSessionCookie(res);

    res.json({
      ok: true,
      message: user ? 'Signed in' : 'Signed out',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

export function signOut(_req: Request, res: Response<ApiSuccess>): void {
  clearSessionCookie(res);
  res.json({ ok: true, message: 'You have been signed out.' });
}
