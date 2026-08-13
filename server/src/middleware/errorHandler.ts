import type { NextFunction, Request, Response } from 'express';
import { AppError, ValidationError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';
import type { ApiFailure } from '../types/api.js';

/** Express identifies the error handler by its four-argument signature. */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response<ApiFailure>,
  _next: NextFunction,
): void {
  if (error instanceof ValidationError) {
    res.status(error.status).json({
      ok: false,
      message: error.message,
      fields: error.fields,
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.status).json({
      ok: false,
      message: error.expose ? error.message : 'Something went wrong',
    });
    return;
  }

  logger.error('Unhandled error', error);
  res.status(500).json({ ok: false, message: 'Something went wrong' });
}
