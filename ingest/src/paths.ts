import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ingestDir = dirname(fileURLToPath(import.meta.url));
export const repoRoot = join(ingestDir, '../..');
export const ingestRoot = join(repoRoot, 'ingest');
export const jobsRoot = join(repoRoot, '.ingest', 'jobs');
export const envLocalPath = join(repoRoot, '.env.local');

export function jobDir(videoId: string): string {
	return join(jobsRoot, videoId);
}

export function ensureJobDir(videoId: string): string {
	const dir = jobDir(videoId);
	mkdirSync(dir, { recursive: true });
	return dir;
}
