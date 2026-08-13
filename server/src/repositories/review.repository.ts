import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ReviewRecord } from '../types/review.js';

const here = dirname(fileURLToPath(import.meta.url));
/** src/repositories → server/data (also correct from dist/repositories). */
const DATA_DIR = resolve(here, '../../data');
const STORE = resolve(DATA_DIR, 'reviews.jsonl');

async function readAll(): Promise<ReviewRecord[]> {
  try {
    const raw = await readFile(STORE, 'utf8');
    return raw
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => JSON.parse(line) as ReviewRecord);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

/**
 * Append-only JSON Lines store, same shape as the other repositories. An
 * account holds one review: editing appends a new line and the last one for a
 * user wins, so the file doubles as an edit history.
 */
export const reviewRepository = {
  /** Current review per author, newest edit first. */
  async list(): Promise<ReviewRecord[]> {
    const latest = new Map<string, ReviewRecord>();
    for (const record of await readAll()) latest.set(record.userId, record);

    return [...latest.values()].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
  },

  async findByUserId(userId: string): Promise<ReviewRecord | null> {
    const records = await readAll();
    for (let index = records.length - 1; index >= 0; index -= 1) {
      const record = records[index];
      if (record?.userId === userId) return record;
    }
    return null;
  },

  async save(record: ReviewRecord): Promise<void> {
    await mkdir(DATA_DIR, { recursive: true });
    await appendFile(STORE, `${JSON.stringify(record)}\n`, 'utf8');
  },
};
