#!/usr/bin/env node
/**
 * Build showcase data from .ingest/jobs chain-capture + extraction-draft.
 * Run from repo root: node web/scripts/build-showcase-data.mjs
 */
import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
	JOBS,
	REPO,
	loadUploadCache,
	readJson,
	sourcePublishedAtFromCache
} from './lib/provenance.mjs';

const OUT = join(REPO, 'web/src/lib/data/showcase/lenny-batch.generated.ts');

/** Lenny bulk batch — keep in sync with .ingest/lenny-batch-13.txt */
const VIDEO_IDS = [
	'-7Yol5vX5xw',
	'xCd9ykretlg',
	'k-H4nsOTuxU',
	'wc8FBhQtdsA',
	'DIa0MYJzM5I',
	'RP4vJeIb7WU',
	'eh8bcBIAAFo',
	'_rcniEb9bLw',
	'HEqrvF7ztBE',
	'pEis2CBomVA',
	'mCO-D3pkviM',
	'PoJ1vTdHpks',
	'G5WTgB87rYQ'
];

const uploadCache = loadUploadCache();

const episodes = [];
const shiftOld = [];
const shiftNew = [];
const allInsights = [];
const words = [];
const allChainIds = new Set();

for (const videoId of VIDEO_IDS) {
	const job = join(JOBS, videoId);
	const manifest = readJson(join(job, 'chain-capture.json'));
	const draft = readJson(join(job, 'extraction-draft.json'));
	const metaPath = join(job, 'meta.json');
	const meta = existsSync(metaPath) ? readJson(metaPath) : {};

	allChainIds.add(manifest.episodeIns);
	allChainIds.add(manifest.guestLand);
	for (const i of manifest.insights) allChainIds.add(i.id);
	for (const w of manifest.words) allChainIds.add(w.id);
	allChainIds.add(manifest.glossaryIns);

	const insightByTitle = new Map(draft.insights.map((i) => [i.title, i]));

	episodes.push({
		videoId,
		sourceUrl: manifest.sourceUrl,
		episodeIns: manifest.episodeIns,
		guestLand: manifest.guestLand,
		guest: draft.episode.guest,
		title: draft.episode.title,
		summary: draft.episode.summary,
		insightCount: manifest.insights.length,
		wordCount: manifest.words.length,
		sourcePublishedAt: sourcePublishedAtFromCache({ ...meta, videoId }, uploadCache),
		ingestedAt: meta.createdAt ?? null
	});

	for (const ins of manifest.insights) {
		const d = insightByTitle.get(ins.title);
		if (!d) continue;
		const item = {
			chainId: ins.id,
			title: ins.title,
			description: d.description,
			excerpt: d.sourceExcerpt,
			landingSlot: d.landingSlot,
			guest: draft.episode.guest,
			episodeIns: manifest.episodeIns,
			sourceUrl: manifest.sourceUrl,
			sourcePublishedAt: sourcePublishedAtFromCache({ ...meta, videoId }, uploadCache),
			ingestedAt: meta.createdAt ?? null
		};
		allInsights.push(item);
		if (d.landingSlot === 'shift-old') shiftOld.push(item);
		if (d.landingSlot === 'shift-new') shiftNew.push(item);
	}

	for (const w of manifest.words) {
		const d = draft.words.find((x) => x.label === w.label);
		if (!d) continue;
		words.push({
			chainId: w.id,
			label: w.label,
			quote: d.quote,
			landingSlot: d.landingSlot,
			guest: draft.episode.guest,
			sourceUrl: manifest.sourceUrl
		});
	}
}

const mentalModelSections = [
	{
		id: 'product',
		title: 'Product & planning',
		oldHeadline: 'Roadmaps, research, and the PM as router',
		newHeadline: 'CEO skills — what we build and why, now',
		oldBelief: 'Year-long roadmaps and customer interviews drive the right product.',
		newBelief: 'Capabilities change monthly; judgment and direction beat sequential planning.',
		costOfWaiting: 'Your roadmap becomes fiction while competitors ship with agents.',
		transformSteps: [
			'Kill the vanity roadmap — name one bet for this month',
			'Run one agent-assisted prototype before the next planning meeting',
			'Measure shipped learning, not slide completeness'
		]
	},
	{
		id: 'building',
		title: 'Building & shipping',
		oldHeadline: 'Writing code was the bottleneck',
		newHeadline: 'Code is cheap — orchestration is the craft',
		oldBelief: 'Quality means humans review every line before production.',
		newBelief: 'Agentic engineering + tests + patterns beat manual review at scale.',
		costOfWaiting: 'Teams still staffing for typing while others run parallel agent streams.',
		transformSteps: [
			'Hoard one reusable pattern library agents can combine',
			'Adopt red-green TDD with your coding agent',
			'Prototype in public — bring ideas to meetings, not decks'
		]
	},
	{
		id: 'team',
		title: 'Team & organization',
		oldHeadline: 'Hire more people — especially seniors',
		newHeadline: 'Find barrels; groom talent; stay flat',
		oldBelief: 'Scale by adding headcount and importing experienced leaders.',
		newBelief: 'Few people can drive initiatives end-to-end; org design is the multiplier.',
		costOfWaiting: 'Ammunition stacks behind the same initiatives; nothing ships faster.',
		transformSteps: [
			'Name your barrels — who can cross the hill without hand-holding?',
			'Give new hires a first-day “present work” norm',
			'Specialize agents (and humans) instead of one overloaded generalist'
		]
	},
	{
		id: 'growth',
		title: 'Growth & distribution',
		oldHeadline: 'Product-market fit first',
		newHeadline: 'Distribution and strategic bets first',
		oldBelief: 'If the product is right, growth will follow.',
		newBelief: 'Distribution and larger swings matter when product value is exponential.',
		costOfWaiting: 'Perfecting features nobody discovers while winners solve distribution.',
		transformSteps: [
			'Map distribution before the next feature sprint',
			'Automate one growth experiment loop with AI',
			'Add friction that teaches fit — don’t only optimize for clicks'
		]
	},
	{
		id: 'trust',
		title: 'Agents & trust',
		oldHeadline: 'Give the assistant full access on day one',
		newHeadline: 'Progressive trust, physical separation, human agency',
		oldBelief: 'One general-purpose agent with every integration is fastest.',
		newBelief: 'Specialized agents, ramble-mode onboarding, and earned permissions win.',
		costOfWaiting: 'Context rot, deleted calendars, and prompt-injection surprises.',
		transformSteps: [
			'Start read-only; earn send/access step by step',
			'Separate agent hardware from your daily driver',
			'Pull the thread for two weeks before judging a tool'
		]
	}
];

const body = `/** AUTO-GENERATED — node web/scripts/build-showcase-data.mjs */
import type { ShowcaseBatch } from './types.js';

export const LENNY_BATCH_VIDEO_IDS = ${JSON.stringify(VIDEO_IDS)} as const;

export const lennyBatch: ShowcaseBatch = ${JSON.stringify(
	{
		generatedAt: new Date().toISOString(),
		episodes,
		shiftOld,
		shiftNew,
		allInsights,
		words,
		mentalModelSections,
		stats: {
			episodeCount: episodes.length,
			shiftOldCount: shiftOld.length,
			shiftNewCount: shiftNew.length,
			insightCount: allInsights.length,
			wordCount: words.length,
			chainIdCount: allChainIds.size
		}
	},
	null,
	2
)} as ShowcaseBatch;

export const lennyBatchChainIds: string[] = ${JSON.stringify([...allChainIds].sort())};
`;

writeFileSync(OUT, body);
console.log(`Wrote ${OUT}`);
console.log(
	`  ${episodes.length} episodes · ${shiftOld.length} shift-old · ${shiftNew.length} shift-new · ${words.length} words · ${allChainIds.size} chain IDs`
);
