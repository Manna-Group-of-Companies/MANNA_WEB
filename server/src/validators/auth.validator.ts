import { ValidationError } from '../utils/AppError.js';

/** Google ID tokens are ~1kB; anything much larger is not one. */
const MAX_CREDENTIAL_LENGTH = 4096;

/**
 * Narrows an untrusted request body to the ID token the Google button hands
 * us. Only shape is checked here — authenticity is the verifier's job.
 */
export function parseGoogleCredential(body: unknown): string {
  if (typeof body !== 'object' || body === null) {
    throw new ValidationError({ body: 'Expected a JSON object' });
  }

  const { credential } = body as Record<string, unknown>;

  if (typeof credential !== 'string' || credential.trim() === '') {
    throw new ValidationError({ credential: 'Google credential is required' });
  }
  if (credential.length > MAX_CREDENTIAL_LENGTH) {
    throw new ValidationError({ credential: 'Google credential is too long' });
  }

  return credential.trim();
}
