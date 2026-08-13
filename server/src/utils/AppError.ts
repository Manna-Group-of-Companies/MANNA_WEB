/** Error with an HTTP status the error handler can trust. */
export class AppError extends Error {
  readonly status: number;
  readonly expose: boolean;

  /**
   * 4xx messages are safe to show the caller and 5xx are not, so `expose`
   * defaults that way — pass it explicitly for the rare 5xx whose message is
   * genuinely useful (a missing config key, an upstream being down).
   */
  constructor(message: string, status = 500, expose = status < 500) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.expose = expose;
  }
}

export class ValidationError extends AppError {
  readonly fields: Record<string, string>;

  constructor(fields: Record<string, string>, message = 'Invalid request body') {
    super(message, 400);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
