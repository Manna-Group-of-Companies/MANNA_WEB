import { randomUUID } from 'node:crypto';
import { leadRepository } from '../repositories/lead.repository.js';
import { logger } from '../utils/logger.js';
import type { LeadInput, LeadRecord } from '../types/lead.js';

interface Context {
  userAgent?: string | undefined;
}

export const leadService = {
  async create(input: LeadInput, context: Context = {}): Promise<LeadRecord> {
    const record: LeadRecord = {
      id: randomUUID(),
      email: input.email,
      source: input.source,
      createdAt: new Date().toISOString(),
      userAgent: context.userAgent ?? null,
    };

    await leadRepository.save(record);
    logger.info('Lead captured', { id: record.id, source: record.source });

    // Hook up transactional email / CRM forwarding here.
    return record;
  },
};
