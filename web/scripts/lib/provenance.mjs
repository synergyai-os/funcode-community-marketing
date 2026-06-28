/**
 * Shared ingest provenance helpers for build-*-data.mjs scripts (INS-395).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Repo root (FunCode monorepo, three levels above web/scripts/lib). */
export const REPO = fileURLToPath(new URL('../../..', import.meta.url));

export const JOBS = join(REPO, '.ingest/jobs');
export const UPLOAD_CACHE = join(REPO, '.ingest/cache/upload-dates.json');

export function readJson(path) {
	return JSON.parse(readFileSync(path, 'utf8'));
}

export function readdirSafe(dir) {
	try {
		return readdirSync(dir);
	} catch {
		return [];
	}
}

/** True when `.ingest/jobs` exists and has at least one job folder. */
export function ingestJobsAvailable() {
	return existsSync(JOBS) && readdirSafe(JOBS).length > 0;
}

export function loadUploadCache() {
	if (!existsSync(UPLOAD_CACHE)) return {};
	try {
		return readJson(UPLOAD_CACHE);
	} catch {
		return {};
	}
}

export function saveUploadCache(cache) {
	mkdirSync(dirname(UPLOAD_CACHE), { recursive: true });
	writeFileSync(UPLOAD_CACHE, JSON.stringify(cache, null, 2));
}

export function parseUploadDate(raw) {
	if (!raw || !/^\d{8}$/.test(String(raw).trim())) return null;
	const d = String(raw).trim();
	return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}T00:00:00.000Z`;
}

export function fetchUploadDate(sourceUrl) {
	try {
		const out = execFileSync('yt-dlp', ['--print', 'upload_date', '--no-playlist', sourceUrl], {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'pipe']
		}).trim();
		return parseUploadDate(out);
	} catch {
		return null;
	}
}

/**
 * Resolve original source publication date (not ingest time).
 * Falls back to ingest createdAt only when source date unavailable.
 */
export function resolveSourcePublishedAt(meta, cache, { fetchIfMissing = false } = {}) {
	if (meta.sourcePublishedAt) return meta.sourcePublishedAt;
	const videoId = meta.videoId;
	if (videoId && cache[videoId]) return cache[videoId];
	if (
		fetchIfMissing &&
		meta.sourceUrl &&
		(meta.sourceUrl.includes('youtube') || meta.sourceUrl.includes('youtu.be'))
	) {
		const fetched = fetchUploadDate(meta.sourceUrl);
		if (fetched && videoId) {
			cache[videoId] = fetched;
			return fetched;
		}
	}
	return null;
}

/** Cache lookup only — for media/showcase builds (no yt-dlp during prebuild). */
export function sourcePublishedAtFromCache(meta, cache) {
	return meta.sourcePublishedAt ?? (meta.videoId ? (cache[meta.videoId] ?? null) : null);
}
