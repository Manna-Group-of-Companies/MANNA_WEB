import type { Request, Response } from 'express';
import type { ApiFailure } from '../types/api.js';

export function notFound(req: Request, res: Response<ApiFailure>): void {
  res.status(404).json({
    ok: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}
