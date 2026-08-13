/** The claims we keep from a verified Google ID token. */
export interface GoogleProfile {
  /** Google's stable account id — the only safe join key. Emails change. */
  googleId: string;
  email: string;
  name: string;
  picture: string | null;
}

export interface UserRecord extends GoogleProfile {
  id: string;
  createdAt: string;
  lastLoginAt: string;
}

/** The shape handed to the browser. Never includes anything else. */
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  picture: string | null;
}

export interface SessionPayload {
  /** User id. */
  sub: string;
  /** Issued at / expires at, both epoch seconds. */
  iat: number;
  exp: number;
}
