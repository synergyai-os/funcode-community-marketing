/**
 * Backfill chain-capture.json when PAT-7 captures landed on Chain outside
 * `ingest commit` (e.g. agent MCP session). Unblocks PAT-9 brief + PAT-10 verify.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ChainCaptureManifest } from './chain-capture.types.js';
import { writeChainCaptureManifest } from './episode-brief.js';
import { execPb } from './pb-exec.js';
import type { ExtractionDraft, JobMeta } from './types.js';

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

function hitsForVideo(videoId: string): SearchHit[] {
	const byId = pbSearch(videoId);
	const byUrl = pbSearch(`youtube.com/watch?v=${videoId}`);
	const seen = new Set<string>();
	const out: SearchHit[] = [];
	for (const h of [...byId, ...byUrl]) {
		if (!h.entryId || seen.has(h.entryId)) continue;
		if (!h.sourceRef?.includes(videoId)) continue;
		seen.add(h.entryId);
		out.push(h);
	}
	return out.sort((a, b) => (a.entryId ?? '').localeCompare(b.entryId ?? ''));
}

function wordLabel(name: string): string | undefined {
	const m = /^WORD:\s*(.+)$/i.exec(name.trim());
	return m?.[1]?.trim();
}

export function reconcileChainManifest(jobPath: string): ChainCaptureManifest {
	const draftPath = join(jobPath, 'extraction-draft.json');
	if (!existsSync(draftPath)) {
		throw new Error(`Missing ${draftPath}`);
	}
	const draft = JSON.parse(readFileSync(draftPath, 'utf8')) as ExtractionDraft;
	const metaPath = join(jobPath, 'meta.json');
	const meta = existsSync(metaPath)
		? (JSON.parse(readFileSync(metaPath, 'utf8')) as JobMeta)
		: undefined;
	const videoId = meta?.videoId;
	if (!videoId) throw new Error('meta.json missing videoId');

	const hits = hitsForVideo(videoId);
	if (hits.length === 0) {
		throw new Error(
			`No Chain entries with sourceRef containing ${videoId}. Run commit or capture first.`
		);
	}

	const guest = draft.episode.guest;
	const episodeHit =
		hits.find((h) => /^Episode:/i.test(h.name ?? '') && h.name?.includes(guest)) ??
		hits.find((h) => /^Episode:/i.test(h.name ?? ''));
	if (!episodeHit?.entryId) {
		throw new Error(`No episode shell found for ${guest} / ${videoId}`);
	}

	const guestHit =
		hits.find(
			(h) =>
				h.collectionSlug === 'landscape' &&
				h.name?.toLowerCase() === guest.toLowerCase()
		) ?? hits.find((h) => h.collectionSlug === 'landscape' && h.name?.includes(guest));
	if (!guestHit?.entryId) {
		throw new Error(`No LAND guest entry found for ${guest}`);
	}

	const glossaryHit = hits.find((h) => /Glossary candidates/i.test(h.name ?? ''));

	const wordHits = hits.filter((h) => wordLabel(h.name ?? ''));
	const words = draft.words.map((w) => {
		const hit =
			wordHits.find((h) => wordLabel(h.name ?? '')?.toLowerCase() === w.label.toLowerCase()) ??
			wordHits.find((h) => h.name?.toLowerCase().includes(w.label.toLowerCase()));
		if (!hit?.entryId) {
			throw new Error(`No Chain WORD for "${w.label}"`);
		}
		return { id: hit.entryId, label: w.label };
	});

	const insightHits = hits.filter(
		(h) =>
			h.collectionSlug === 'insights' &&
			h.entryId !== episodeHit.entryId &&
			h.entryId !== glossaryHit?.entryId &&
			!wordLabel(h.name ?? '')
	);

	if (insightHits.length < draft.insights.length) {
		throw new Error(
			`Found ${insightHits.length} learnings on Chain, draft expects ${draft.insights.length}`
		);
	}

	const insights = insightHits.slice(0, draft.insights.length).map((h, i) => ({
		id: h.entryId!,
		title: h.name ?? draft.insights[i]!.title
	}));

	const manifest: ChainCaptureManifest = {
		capturedAt: new Date().toISOString(),
		sourceUrl: meta?.sourceUrl?.includes('youtube')
			? `https://www.youtube.com/watch?v=${videoId}`
			: (meta?.sourceUrl ?? `https://www.youtube.com/watch?v=${videoId}`),
		videoId,
		episodeIns: episodeHit.entryId,
		guestLand: guestHit.entryId,
		showLand: 'LAND-1',
		insights,
		words,
		glossaryIns: glossaryHit?.entryId
	};

	writeChainCaptureManifest(jobPath, manifest);
	return manifest;
}
