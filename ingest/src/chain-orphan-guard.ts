import { execPb } from './pb-exec.js';

type SearchHit = {
	entryId?: string;
	name?: string;
	sourceRef?: string;
	collectionSlug?: string;
};

function pbSearch(query: string): SearchHit[] {
	const out = execPb(['--json', 'search', query]);
	const parsed = JSON.parse(out) as SearchHit[] | { error?: string };
	if (!Array.isArray(parsed)) return [];
	return parsed;
}

/** Chain entries for this videoId (MCP or prior commit) without a local manifest. */
export function findOrphanCaptures(videoId: string): {
	episodeId: string;
	guestLandId?: string;
	entryCount: number;
} | null {
	const seen = new Set<string>();
	const hits: SearchHit[] = [];
	for (const h of [...pbSearch(videoId), ...pbSearch(`youtube.com/watch?v=${videoId}`)]) {
		if (!h.entryId || seen.has(h.entryId)) continue;
		if (!h.sourceRef?.includes(videoId)) continue;
		seen.add(h.entryId);
		hits.push(h);
	}

	const episode = hits.find((h) => /^Episode:/i.test(h.name ?? ''));
	if (!episode?.entryId) return null;

	const guest = hits.find(
		(h) => h.collectionSlug === 'landscape' && h.entryId !== 'LAND-1'
	);

	return {
		episodeId: episode.entryId,
		guestLandId: guest?.entryId,
		entryCount: hits.length
	};
}

export function assertNoOrphanCaptures(videoId: string, force: boolean): void {
	if (force) return;
	const orphan = findOrphanCaptures(videoId);
	if (!orphan) return;
	throw new Error(
		`Chain already has ${orphan.entryCount} capture(s) for ${videoId} (episode ${orphan.episodeId}). ` +
			`Do not duplicate — run: npm run ingest -- reconcile --job ${videoId} --wire`
	);
}
