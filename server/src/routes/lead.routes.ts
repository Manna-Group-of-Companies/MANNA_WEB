import { Router } from 'express';
import { createLead } from '../controllers/lead.controller.js';
import { rateLimit } from '../middleware/rateLimit.js';

export const leadRoutes = Router();

// 5 submissions per IP per 10 minutes is plenty for a quote form.
leadRoutes.post('/', rateLimit({ windowMs: 10 * 60_000, max: 5 }), createLead);
