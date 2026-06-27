import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ChainCaptureManifest } from './chain-capture.types.js';
import type { ExtractionDraft } from './types.js';
import { jobsRoot } from './paths.js';
import { personaIdsForLandingSlot } from './landing-slot-personas.js';
import {
	loadRegistry,
	readExistingChainIds,
	registryPath
} from './voices-sync-internals.js';

/** Registry entry — merge into web/src/lib/data/voices.ts after Randy reviews quote + personaIds. */
export type VoiceCandidate = {
	id: string;
	quote: string;
	name: string;
	chainId: string;
	sourceRef: string;
	sourceLabel: string;
	landingSlot: string;
	staged: boolean;
	published: boolean;
	suggestedAt: string;
	videoId: string;
};

export type VoicesRegistry = {
	updatedAt: string;
	candidates: VoiceCandidate[];
};

const VOICE_SOURCE_LABEL = "On Lenny's Podcast";

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 56);
}

function voiceCardId(guest: string, label: string): string {
	const guestPart = slugify(guest.split(/\s+/)[0] ?? guest);
	return `${guestPart}-${slugify(label)}`;
}

function saveRegistry(repoRoot: string, registry: VoicesRegistry): void {
	registry.updatedAt = new Date().toISOString();
	writeFileSync(registryPath(repoRoot), JSON.stringify(registry, null, 2));
}

function normalizeLabel(label: string): string {
	return label.replace(/^WORD:\s*/i, '').trim();
}

function matchWordCapture(
	manifest: ChainCaptureManifest,
	word: ExtractionDraft['words'][number]
): { id: string; label: string } | undefined {
	const target = normalizeLabel(word.label);
	return manifest.words.find((w) => normalizeLabel(w.label) === target);
}

/**
 * After PAT-7 commit, append WORD captures to `.ingest/voices-registry.json`.
 * Human merges polished quotes + personaIds into `web/src/lib/data/voices.ts`.
 */
export function writeVoiceCandidates(
	repoRoot: string,
	jobPath: string,
	manifest: ChainCaptureManifest,
	draft: ExtractionDraft
): void {
	const registry = loadRegistry(repoRoot);
	const byChainId = new Map(registry.candidates.map((c) => [c.chainId, c]));
	const guest = draft.episode.guest;
	const jobCandidates: VoiceCandidate[] = [];

	for (const word of draft.words) {
		const captured = matchWordCapture(manifest, word);
		if (!captured) continue;

		const candidate: VoiceCandidate = {
			id: voiceCardId(guest, word.label),
			quote: word.quote.trim(),
			name: guest,
			chainId: captured.id,
			sourceRef: manifest.sourceUrl,
			sourceLabel: VOICE_SOURCE_LABEL,
			landingSlot: word.landingSlot,
			staged: true,
			published: false,
			suggestedAt: manifest.capturedAt,
			videoId: manifest.videoId
		};
		byChainId.set(captured.id, candidate);
		jobCandidates.push(candidate);
	}

	registry.candidates = [...byChainId.values()].sort((a, b) =>
		a.chainId.localeCompare(b.chainId)
	);
	saveRegistry(repoRoot, registry);

	if (jobCandidates.length > 0) {
		writeFileSync(
			join(jobPath, 'voice-candidates.json'),
			JSON.stringify({ videoId: manifest.videoId, candidates: jobCandidates }, null, 2)
		);
		console.log(`Wrote ${jobCandidates.length} voice candidate(s) → voice-candidates.json`);
	}
}

export function printVoiceSyncHint(repoRoot: string): void {
	console.log('\n--- Voice cards (GLO-11 / PAT-7) ---');
	console.log('Registry: .ingest/voices-registry.json');
	console.log('Merge targets: web/src/lib/data/voices.ts + voice-guests.ts');
	console.log(`Report: npm run ingest -- sync-voices  (from ${join(repoRoot, 'ingest')})`);
}

function formatVoiceSnippet(c: VoiceCandidate): string {
	const personas = personaIdsForLandingSlot(c.landingSlot);
	return `	{
		id: '${c.id}',
		quote: '${c.quote.replace(/'/g, "\\'")}',
		name: '${c.name}',
		role: guestAuthority('${c.name}'),
		sourceLabel: VOICE_SOURCE_LABEL,
		personaIds: ${JSON.stringify(personas)},
		chainId: '${c.chainId}',
		sourceRef: '${c.sourceRef}',
		published: false,
		staged: true
	}`;
}

function jobsWithManifestMissingRegistry(existing: Set<string>): string[] {
	if (!existsSync(jobsRoot)) return [];
	const warnings: string[] = [];
	for (const entry of readdirSync(jobsRoot, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		const manifestPath = join(jobsRoot, entry.name, 'chain-capture.json');
		if (!existsSync(manifestPath)) continue;
		const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as ChainCaptureManifest;
		const unlinked = manifest.words.filter((w) => !existing.has(w.id));
		if (unlinked.length > 0) {
			warnings.push(
				`${entry.name}: ${unlinked.length} WORD(s) in chain-capture but not in voices.ts — ${unlinked.map((w) => w.id).join(', ')}`
			);
		}
	}
	return warnings;
}

/** Compare registry vs voices.ts — print merge checklist for Randy. */
export function runSyncVoicesReport(repoRoot: string): void {
	const registry = loadRegistry(repoRoot);
	const voicesPath = join(repoRoot, 'web', 'src', 'lib', 'data', 'voices.ts');
	const existing = readExistingChainIds(voicesPath);

	console.log(`\nVoice sync — ${registry.candidates.length} registry candidate(s)\n`);

	const jobWarnings = jobsWithManifestMissingRegistry(existing);
	if (jobWarnings.length > 0) {
		console.log('Jobs with chain-capture WORDs not yet in voices.ts:');
		for (const w of jobWarnings) console.log(`  ⚠ ${w}`);
		console.log('');
	}

	if (registry.candidates.length === 0) {
		if (jobWarnings.length === 0) {
			console.log('No candidates yet. Run PAT-7 commit on an episode with WORD captures.');
		}
		return;
	}

	const missing = registry.candidates.filter((c) => !existing.has(c.chainId));
	const linked = registry.candidates.filter((c) => existing.has(c.chainId));

	console.log(`Linked in voices.ts: ${linked.length}`);
	console.log(`Needs merge:        ${missing.length}\n`);

	if (missing.length === 0) {
		console.log('All registry chainIds exist in voices.ts.');
		if (jobWarnings.length === 0) return;
	}

	for (const c of missing) {
		console.log(`— ${c.chainId} (${c.name}, ${c.videoId})`);
		console.log(`  landingSlot: ${c.landingSlot}`);
		console.log(`  quote draft: "${c.quote.slice(0, 80)}${c.quote.length > 80 ? '…' : ''}"`);
		console.log(formatVoiceSnippet(c));
		console.log('');
	}

	console.log(
		'Review quote verbatimness + personaIds before setting published: true (QUE-5).\n'
	);
}
