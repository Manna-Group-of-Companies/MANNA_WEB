import { randomUUID } from 'node:crypto';
import { googleService } from './google.service.js';
import { userRepository } from '../repositories/user.repository.js';
import { createSessionToken, readSessionToken } from '../utils/session.js';
import { logger } from '../utils/logger.js';
import type { SessionUser, UserRecord } from '../types/auth.js';

function toSessionUser(record: UserRecord): SessionUser {
  return {
    id: record.id,
    email: record.email,
    name: record.name,
    picture: record.picture,
  };
}

export const authService = {
  /**
   * Google is the only identity provider, so sign-up and sign-in are the same
   * exchange: a first-time Google account gets a record created for it.
   * `isNewUser` only exists so the UI can say "welcome" or "welcome back".
   */
  async signInWithGoogle(idToken: string): Promise<{
    user: SessionUser;
    token: string;
    expiresAt: Date;
    isNewUser: boolean;
  }> {
    const profile = await googleService.verifyIdToken(idToken);
    const existing = await userRepository.findByGoogleId(profile.googleId);
    const now = new Date().toISOString();

    // Name, email and avatar are re-read from Google on each sign-in — Google
    // is the source of truth for them, not our copy.
    const record: UserRecord = {
      id: existing?.id ?? randomUUID(),
      googleId: profile.googleId,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
      createdAt: existing?.createdAt ?? now,
      lastLoginAt: now,
    };

    await userRepository.save(record);

    const { token, expiresAt } = createSessionToken(record.id);
    logger.info(existing ? 'User signed in' : 'User signed up', { id: record.id });

    return { user: toSessionUser(record), token, expiresAt, isNewUser: !existing };
  },

  /** Resolves a session cookie to the user it belongs to, or null. */
  async userFromToken(token: string | null): Promise<SessionUser | null> {
    if (!token) return null;

    const payload = readSessionToken(token);
    if (!payload) return null;

    const record = await userRepository.findById(payload.sub);
    return record ? toSessionUser(record) : null;
  },
};
