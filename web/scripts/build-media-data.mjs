#!/usr/bin/env node
/**
 * Build media + tool quote data from .ingest/jobs (committed or draft_ready).
 * Run: node web/scripts/build-media-data.mjs
 */
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	JOBS,
	REPO,
	loadUploadCache,
	readJson,
	readdirSafe,
	sourcePublishedAtFromCache
} from './lib/provenance.mjs';

const OUT = join(REPO, 'web/src/lib/data/media/generated.ts');

const TOOL_ALIASES = [
	{ slug: 'cursor', aliases: ['cursor'] },
	{ slug: 'product-brain', aliases: ['product brain', 'pb cli'] },
	{ slug: 'convex', aliases: ['convex'] },
	{ slug: 'openrouter', aliases: ['openrouter', 'whisper'] },
	{ slug: 'codex', aliases: ['codex', 'openai codex'] },
	{ slug: 'claude-code', aliases: ['claude code', 'claude'] },
	{ slug: 'railway', aliases: ['railway'] },
	{ slug: 'yt-dlp', aliases: ['yt-dlp'] }
];

function matchesTool(text, aliases) {
	const lower = text.toLowerCase();
	return aliases.some((a) => lower.includes(a));
}

const uploadCache = loadUploadCache();

const episodes = [];
const toolQuotes = new Map();

for (const jobId of readdirSafe(JOBS)) {
	const job = join(JOBS, jobId);
	const metaPath = join(job, 'meta.json');
	const draftPath = join(job, 'extraction-draft.json');
	if (!existsSync(metaPath) || !existsSync(draftPath)) continue;

	const meta = readJson(metaPath);
	const draft = readJson(draftPath);
	if (!['draft_ready', 'committed'].includes(meta.status)) continue;

	const manifestPath = join(job, 'chain-capture.json');
	const manifest = existsSync(manifestPath) ? readJson(manifestPath) : null;

	episodes.push({
		videoId: meta.videoId ?? jobId,
		sourceUrl: meta.sourceUrl,
		title: draft.episode.title,
		guest: draft.episode.guest,
		summary: draft.episode.summary,
		platformSlug: meta.platformSlug ?? manifest?.platformSlug ?? 'lennys-podcast',
		platformName: meta.platformName ?? manifest?.platformName ?? "Lenny's Podcast",
		status: meta.status,
		committed: Boolean(manifest),
		episodeIns: manifest?.episodeIns,
		guestLand: manifest?.guestLand,
		insightCount: draft.insights?.length ?? 0,
		wordCount: draft.words?.length ?? 0,
		sourcePublishedAt: sourcePublishedAtFromCache(meta, uploadCache),
		ingestedAt: meta.createdAt ?? null
	});

	const guest = draft.episode.guest;
	const sourceUrl = meta.sourceUrl;

	for (const ins of draft.insights ?? []) {
		const blob = `${ins.title} ${ins.description} ${ins.sourceExcerpt}`;
		for (const { slug, aliases } of TOOL_ALIASES) {
			if (!matchesTool(blob, aliases)) continue;
			if (!toolQuotes.has(slug)) toolQuotes.set(slug, []);
			toolQuotes.get(slug).push({
				kind: 'insight',
				guest,
				text: ins.sourceExcerpt || ins.description,
				title: ins.title,
				sourceUrl,
				platformSlug: meta.platformSlug ?? 'unknown'
			});
		}
	}

	for (const w of draft.words ?? []) {
		const blob = `${w.label} ${w.quote}`;
		for (const { slug, aliases } of TOOL_ALIASES) {
			if (!matchesTool(blob, aliases)) continue;
			if (!toolQuotes.has(slug)) toolQuotes.set(slug, []);
			toolQuotes.get(slug).push({
				kind: 'word',
				guest,
				text: w.quote,
				title: w.label,
				sourceUrl,
				platformSlug: meta.platformSlug ?? 'unknown'
			});
		}
	}
}

const byPlatform = {};
for (const ep of episodes) {
	const key = ep.platformSlug;
	if (!byPlatform[key]) byPlatform[key] = [];
	byPlatform[key].push(ep);
}

const toolQuotesObj = Object.fromEntries(toolQuotes);

const out = `/** AUTO-GENERATED — node web/scripts/build-media-data.mjs */
export const mediaGenerated = ${JSON.stringify(
	{
		generatedAt: new Date().toISOString(),
		episodes,
		episodesByPlatform: byPlatform,
		toolQuotes: toolQuotesObj,
		stats: {
			episodeCount: episodes.length,
			committedCount: episodes.filter((e) => e.committed).length,
			platformCount: Object.keys(byPlatform).length,
			toolWithQuotes: Object.keys(toolQuotesObj).length
		}
	},
	null,
	2
)} as const;

export type MediaEpisode = {
	videoId: string;
	sourceUrl: string;
	title: string;
	guest: string;
	summary: string;
	platformSlug: string;
	platformName: string;
	status: string;
	committed: boolean;
	episodeIns?: string;
	guestLand?: string;
	insightCount: number;
	wordCount: number;
	sourcePublishedAt?: string | null;
	ingestedAt?: string | null;
};

export type ToolQuote = {
	kind: 'insight' | 'word';
	guest: string;
	text: string;
	title: string;
	sourceUrl: string;
	platformSlug: string;
};
`;

writeFileSync(OUT, out);
console.log(
	`Wrote ${OUT} (${episodes.length} episodes, ${Object.keys(toolQuotesObj).length} tools with quotes)`
);
