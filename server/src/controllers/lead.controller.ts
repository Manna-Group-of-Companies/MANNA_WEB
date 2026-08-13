import type { NextFunction, Request, Response } from 'express';
import { parseLeadInput } from '../validators/lead.validator.js';
import { leadService } from '../services/lead.service.js';
import type { ApiSuccess } from '../types/api.js';

export async function createLead(
  req: Request,
  res: Response<ApiSuccess<{ id: string }>>,
  next: NextFunction,
): Promise<void> {
  try {
    const input = parseLeadInput(req.body);
    const record = await leadService.create(input, {
      userAgent: req.get('user-agent'),
    });

    res.status(201).json({
      ok: true,
      message: "Thanks — we'll be in touch within one working day.",
      data: { id: record.id },
    });
  } catch (error) {
    next(error);
  }
}
