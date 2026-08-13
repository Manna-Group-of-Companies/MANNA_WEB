/** Response envelope shared by every endpoint. */
export interface ApiSuccess<T = undefined> {
  ok: true;
  message: string;
  data?: T;
}

export interface ApiFailure {
  ok: false;
  message: string;
  fields?: Record<string, string>;
}
