/** base64url helpers — the encoding JWTs and our session token both use. */

export function encodeBase64Url(value: Buffer | string): string {
  const buffer = typeof value === 'string' ? Buffer.from(value, 'utf8') : value;
  return buffer.toString('base64url');
}

export function decodeBase64Url(value: string): Buffer {
  return Buffer.from(value, 'base64url');
}

/**
 * Parse a base64url-encoded JSON segment. Returns null on anything malformed
 * so callers can reject a token instead of throwing mid-request.
 */
export function decodeJsonSegment<T>(segment: string): T | null {
  try {
    return JSON.parse(decodeBase64Url(segment).toString('utf8')) as T;
  } catch {
    return null;
  }
}
