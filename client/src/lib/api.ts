import type { LeadPayload, LeadResponse } from '@/types/lead';
import type { AuthResponse } from '@/types/auth';
import type {
  ReviewDraft,
  ReviewResponse,
  ReviewsResponse,
} from '@/types/review';

/**
 * In dev, Vite proxies `/api` to the Express server (see vite.config.ts).
 * In production set VITE_API_BASE_URL if the API lives on another origin.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    // Carries the session cookie, including when the API is on another origin.
    credentials: 'include',
    ...init,
  });

  const body = (await response.json().catch(() => null)) as T | null;

  if (!response.ok) {
    const message =
      body && typeof body === 'object' && 'message' in body
        ? String((body as { message: unknown }).message)
        : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  if (body === null) {
    throw new ApiError('Empty response from server', response.status);
  }

  return body;
}

export function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  return request<LeadResponse>('/api/leads', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Exchanges the Google ID token for a session cookie. */
export function signInWithGoogle(credential: string): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  });
}

/** Resolves with `user: null` when nobody is signed in — not an error. */
export function fetchCurrentUser(): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/me');
}

export function signOut(): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/logout', { method: 'POST' });
}

/** Public — reviews render for signed-out visitors too. */
export function fetchReviews(): Promise<ReviewsResponse> {
  return request<ReviewsResponse>('/api/reviews');
}

/** Publishes the signed-in reader's review, or rewrites their existing one. */
export function submitReview(draft: ReviewDraft): Promise<ReviewResponse> {
  return request<ReviewResponse>('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(draft),
  });
}

export { ApiError };
