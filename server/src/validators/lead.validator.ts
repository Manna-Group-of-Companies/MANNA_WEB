import { ValidationError } from '../utils/AppError.js';
import type { LeadInput } from '../types/lead.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_SOURCE_LENGTH = 80;

/**
 * Narrows an untrusted request body to a LeadInput, or throws a
 * ValidationError carrying per-field messages.
 */
export function parseLeadInput(body: unknown): LeadInput {
  const fields: Record<string, string> = {};

  if (typeof body !== 'object' || body === null) {
    throw new ValidationError({ body: 'Expected a JSON object' });
  }

  const { email, source } = body as Record<string, unknown>;

  if (typeof email !== 'string' || email.trim() === '') {
    fields.email = 'Email is required';
  } else if (email.length > MAX_EMAIL_LENGTH) {
    fields.email = 'Email is too long';
  } else if (!EMAIL_RE.test(email.trim())) {
    fields.email = 'Enter a valid email address';
  }

  if (source !== undefined && typeof source !== 'string') {
    fields.source = 'Source must be a string';
  }

  if (Object.keys(fields).length > 0) {
    throw new ValidationError(fields);
  }

  return {
    email: (email as string).trim().toLowerCase(),
    source:
      typeof source === 'string' && source.trim() !== ''
        ? source.trim().slice(0, MAX_SOURCE_LENGTH)
        : 'unknown',
  };
}
