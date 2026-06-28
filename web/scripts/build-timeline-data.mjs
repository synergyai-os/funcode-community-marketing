#!/usr/bin/env node
/**
 * Build temporal landscape timeline from .ingest/jobs + resolution manifest.
 * Run: node web/scripts/build-timeline-data.mjs
 */
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	JOBS,
	REPO,
	ingestJobsAvailable,
	loadUploadCache,
	readJson,
	readdirSafe,
	resolveSourcePublishedAt,
	saveUploadCache
} from './lib/provenance.mjs';

const RESOLUTIONS = join(REPO, '.community/timeline-resolutions.json');
const OUT = join(REPO, 'web/src/lib/data/timeline/generated.ts');

if (!ingestJobsAvailable()) {
	console.log(`Skip timeline build — no .ingest/jobs; keeping committed ${OUT}`);
	process.exit(0);
}

const SLOT_PERSONAS = {
	'shift-new': ['founders', 'product-leaders', 'product-managers'],
	'shift-old': ['product-leaders', 'product-managers', 'teams-going-faster'],
	'benefit-playground': ['indie-makers', 'designers-who-build', 'teams-going-faster'],
	'benefit-free': ['indie-makers', 'teams-going-faster'],
	'benefit-build': ['founders', 'indie-makers', 'designers-who-build'],
	'usecase-onboard': ['product-managers', 'indie-makers', 'founders'],
	'usecase-audience': ['product-managers', 'designers-who-build', 'founders'],
	'usecase-ladder': ['product-leaders', 'teams-going-faster'],
	'voice-leaders': ['product-leaders', 'founders']
};

const PREDICTION_RE =
	/\b(will be|will exceed|will overtake|by 20\d{2}|predict|more valuable than|going to replace|within \d+ year|expect.*to)\b/i;

const TOPIC_RULES = [
	{ topic: 'infrastructure', re: /\b(power|data center|chip|micron|gpu|infra)\b/i },
	{
		topic: 'orchestration',
		re: /\b(orchestrat|harness|model is no longer|agent loop|computer)\b/i
	},
	{ topic: 'agents', re: /\b(agent|cron|automat|24\/7)\b/i },
	{ topic: 'china', re: /\b(china|export control|deepseek)\b/i },
	{ topic: 'pricing', re: /\b(pricing|revenue|\$10,?000|token economy)\b/i },
	{ topic: 'delivery-culture', re: /\b(PR|prod|playground|gate)\b/i }
];

function inferClaimKind(ins) {
	if (ins.claimKind) return ins.claimKind;
	const blob = `${ins.title} ${ins.description} ${ins.sourceExcerpt}`;
	if (PREDICTION_RE.test(blob)) return 'prediction';
	if (ins.landingSlot?.startsWith('shift-')) return 'belief';
	return 'observation';
}

function inferTopic(text) {
	for (const { topic, re } of TOPIC_RULES) {
		if (re.test(text)) return topic;
	}
	return 'general';
}

function personaIdsForSlot(landingSlot) {
	const base = (landingSlot ?? '').split('|')[0]?.trim() ?? '';
	return SLOT_PERSONAS[base] ?? ['product-managers', 'founders'];
}

function yearFrom(iso) {
	if (!iso) return null;
	const y = new Date(iso).getUTCFullYear();
	return Number.isNaN(y) ? null : y;
}

function matchResolution(title, resolutions) {
	return resolutions.find((r) => title.includes(r.matchTitleContains));
}

const uploadCache = loadUploadCache();
const { resolutions, topicLabels } = readJson(RESOLUTIONS);
const events = [];

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
	const sourcePublishedAt =
		resolveSourcePublishedAt(meta, uploadCache, { fetchIfMissing: true }) ?? meta.createdAt ?? null;
	const ingestedAt = meta.createdAt ?? null;
	const year = yearFrom(sourcePublishedAt) ?? yearFrom(ingestedAt);

	events.push({
		id: `ep-${meta.videoId}`,
		kind: 'episode',
		title: draft.episode.title,
		speaker: draft.episode.guest,
		platformSlug: meta.platformSlug ?? 'unknown',
		platformName: meta.platformName ?? '',
		sourceUrl: meta.sourceUrl,
		sourcePublishedAt,
		ingestedAt,
		year,
		chainId: manifest?.episodeIns,
		excerpt: draft.episode.summary,
		personaIds: ['product-leaders', 'founders', 'product-managers']
	});

	let insightIdx = 0;
	for (const ins of draft.insights ?? []) {
		const claimKind = inferClaimKind(ins);
		const topic = inferTopic(`${ins.title} ${ins.description}`);
		const resolution = claimKind === 'prediction' ? matchResolution(ins.title, resolutions) : null;
		const manifestIns = manifest?.insights?.[insightIdx];

		events.push({
			id: `ins-${meta.videoId}-${insightIdx}`,
			kind:
				claimKind === 'prediction' ? 'prediction' : claimKind === 'belief' ? 'belief' : 'insight',
			title: ins.title,
			speaker: draft.episode.guest,
			platformSlug: meta.platformSlug ?? 'unknown',
			platformName: meta.platformName ?? '',
			sourceUrl: meta.sourceUrl,
			sourcePublishedAt,
			ingestedAt,
			year,
			claimKind,
			predictionStatus: resolution?.status ?? (claimKind === 'prediction' ? 'open' : undefined),
			predictionHorizon: resolution?.horizon ?? ins.predictionHorizon,
			resolvedAt: resolution?.resolvedAt ?? null,
			resolutionNotes: resolution?.resolutionNotes,
			topic,
			landingSlot: ins.landingSlot,
			excerpt: ins.sourceExcerpt,
			chainId: manifestIns?.id,
			personaIds: personaIdsForSlot(ins.landingSlot)
		});
		insightIdx++;
	}
}

saveUploadCache(uploadCache);

const years = [...new Set(events.map((e) => e.year).filter(Boolean))].sort((a, b) => a - b);
const beliefsByYear = {};
const predictionsByYear = {};

for (const e of events) {
	if (!e.year) continue;
	if (e.kind === 'belief' || (e.kind === 'insight' && e.claimKind === 'belief')) {
		if (!beliefsByYear[e.year]) beliefsByYear[e.year] = [];
		beliefsByYear[e.year].push(e.id);
	}
	if (e.kind === 'prediction') {
		if (!predictionsByYear[e.year]) predictionsByYear[e.year] = [];
		predictionsByYear[e.year].push(e.id);
	}
}

const speakers = aggregateSpeakers(events);
const convergence = aggregateConvergence(events, topicLabels);

const stats = {
	eventCount: events.length,
	predictionCount: events.filter((e) => e.kind === 'prediction').length,
	beliefCount: events.filter((e) => e.kind === 'belief').length,
	openPredictions: events.filter((e) => e.kind === 'prediction' && e.predictionStatus === 'open')
		.length,
	resolvedTrue: events.filter((e) => e.kind === 'prediction' && e.predictionStatus === 'true')
		.length,
	yearSpan: years.length ? { min: years[0], max: years[years.length - 1] } : null
};

const out = `/** AUTO-GENERATED — node web/scripts/build-timeline-data.mjs */
import type { TimelineManifest } from './types';

export const timelineGenerated = ${JSON.stringify(
	{
		generatedAt: new Date().toISOString(),
		events,
		years,
		beliefsByYear,
		predictionsByYear,
		speakers,
		convergence,
		topicLabels,
		stats
	},
	null,
	2
)} as const satisfies TimelineManifest;
`;

writeFileSync(OUT, out);
console.log(
	`Wrote ${OUT} — ${events.length} events, ${stats.predictionCount} predictions, years ${years.join(', ')}`
);

function aggregateSpeakers(events) {
	const map = new Map();
	for (const e of events) {
		if (!e.speaker || e.kind === 'episode') continue;
		if (!map.has(e.speaker)) {
			map.set(e.speaker, {
				name: e.speaker,
				beliefs: 0,
				predictions: 0,
				open: 0,
				resolvedTrue: 0,
				resolvedPartial: 0
			});
		}
		const s = map.get(e.speaker);
		if (e.kind === 'belief') s.beliefs++;
		if (e.kind === 'prediction') {
			s.predictions++;
			if (e.predictionStatus === 'open') s.open++;
			if (e.predictionStatus === 'true') s.resolvedTrue++;
			if (e.predictionStatus === 'partial') s.resolvedPartial++;
		}
	}
	return [...map.values()]
		.filter((s) => s.predictions > 0 || s.beliefs > 0)
		.sort((a, b) => b.predictions - a.predictions || b.beliefs - a.beliefs);
}

function aggregateConvergence(events, labels) {
	const byTopic = new Map();
	for (const e of events) {
		if (!e.topic || e.topic === 'general') continue;
		if (e.kind !== 'prediction' && e.kind !== 'belief') continue;
		if (!byTopic.has(e.topic)) byTopic.set(e.topic, []);
		byTopic.get(e.topic).push(e);
	}

	const rows = [];
	for (const [topic, items] of byTopic) {
		const speakers = [...new Set(items.map((i) => i.speaker))];
		if (speakers.length < 2) continue;
		const statuses = items.filter((i) => i.kind === 'prediction').map((i) => i.predictionStatus);
		const aligned = statuses.length <= 1 || new Set(statuses).size === 1;
		rows.push({
			topic,
			label: labels[topic] ?? topic,
			speakers,
			eventCount: items.length,
			alignment: aligned ? 'converging' : 'mixed',
			latestYear: Math.max(...items.map((i) => i.year ?? 0))
		});
	}
	return rows.sort((a, b) => b.latestYear - a.latestYear);
}
