import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { UserRecord } from '../types/auth.js';

const here = dirname(fileURLToPath(import.meta.url));
/** src/repositories → server/data (also correct from dist/repositories). */
const DATA_DIR = resolve(here, '../../data');
const STORE = resolve(DATA_DIR, 'users.jsonl');

async function readAll(): Promise<UserRecord[]> {
  try {
    const raw = await readFile(STORE, 'utf8');
    return raw
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => JSON.parse(line) as UserRecord);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

/**
 * Append-only JSON Lines store, same shape as the lead repository: a user is
 * re-appended on every sign-in and the last line for an id wins. Fine for a
 * single process and a few thousand accounts — swap this module for a
 * database client and nothing above it has to change.
 */
export const userRepository = {
  async findByGoogleId(googleId: string): Promise<UserRecord | null> {
    const records = await readAll();
    for (let index = records.length - 1; index >= 0; index -= 1) {
      const record = records[index];
      if (record?.googleId === googleId) return record;
    }
    return null;
  },

  async findById(id: string): Promise<UserRecord | null> {
    const records = await readAll();
    for (let index = records.length - 1; index >= 0; index -= 1) {
      const record = records[index];
      if (record?.id === id) return record;
    }
    return null;
  },

  async save(record: UserRecord): Promise<void> {
    await mkdir(DATA_DIR, { recursive: true });
    await appendFile(STORE, `${JSON.stringify(record)}\n`, 'utf8');
  },
};
