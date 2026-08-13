import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { LeadRecord } from '../types/lead.js';

const here = dirname(fileURLToPath(import.meta.url));
/** src/repositories → server/data (also correct from dist/repositories). */
const DATA_DIR = resolve(here, '../../data');
const STORE = resolve(DATA_DIR, 'leads.jsonl');

/**
 * Append-only JSON Lines store. Deliberately dependency-free — swap this
 * module for a database client and nothing above it has to change.
 */
export const leadRepository = {
  async save(record: LeadRecord): Promise<void> {
    await mkdir(DATA_DIR, { recursive: true });
    await appendFile(STORE, `${JSON.stringify(record)}\n`, 'utf8');
  },

  async list(): Promise<LeadRecord[]> {
    try {
      const raw = await readFile(STORE, 'utf8');
      return raw
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line) => JSON.parse(line) as LeadRecord);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
      throw error;
    }
  },
};
