export interface SessionUser {
  id: string;
  email: string;
  name: string;
  picture: string | null;
}

export interface AuthResponse {
  ok: boolean;
  message: string;
  data?: {
    user: SessionUser | null;
    /** True on the sign-in that created the account. */
    isNewUser?: boolean;
  };
}

/** `/login` and `/signup` render the same page with different copy. */
export type AuthMode = 'login' | 'signup';

export type AuthStatus = 'loading' | 'ready' | 'signing-in';
