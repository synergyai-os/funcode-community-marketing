import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ExtractionDraft, GlossaryDisposition, GlossaryTouchCandidate } from './types.js';

/** Hard cap per episode — INS-48. Extractor + review both enforce. */
export const GLOSSARY_TOUCH_LIMIT = 3;

export type GlossaryReviewManifest = {
	videoId: string;
	sourceUrl: string;
	episodeTitle?: string;
	promptVersion: string;
	episodeInsId?: string;
	touchCount: number;
	recommendedDefault: 'drop_all';
	touches: GlossaryTouchCandidate[];
	/** Resolved after founder review via AskQuestion (agent workflow INS-48). */
	resolved?: {
		bulkDisposition: 'drop_all' | 'bad_vs_sad_ins' | 'pick_individual';
		gloPromote: 'none' | 'one_manual';
		reviewedAt: string;
		note?: string;
	};
};

const GENERIC_TERMS = new Set([
	'dog fooding',
	'dogfooding',
	'growth mindset',
	'latent demand',
	'one team mentality'
]);

function isGuestInternal(term: string): boolean {
	const lower = term.toLowerCase();
	return (
		lower.includes('dashboard') ||
		lower.includes('routine') ||
		lower.includes('asynchronous agent') ||
		lower.includes('just-in-time')
	);
}

function recommendDisposition(term: string): GlossaryDisposition {
	const lower = term.toLowerCase();
	if (GENERIC_TERMS.has(lower)) {
		return 'drop';
	}
	if (isGuestInternal(term)) {
		return 'drop';
	}
	if (lower.includes('bad vs sad')) {
		return 'ins';
	}
	return 'drop';
}

function rationaleFor(term: string, disposition: GlossaryDisposition): string {
	if (disposition === 'ins') {
		return 'Guest error taxonomy — optional INS only, not FunCode GLO (INS-48).';
	}
	if (GENERIC_TERMS.has(term.toLowerCase())) {
		return 'Generic industry term — not FunCode-owned vocabulary.';
	}
	if (isGuestInternal(term)) {
		return 'Guest/org-internal jargon — episode context only.';
	}
	return 'Default drop per glossary gate (INS-48): GLO is FunCode-owned teaching vocabulary.';
}

export function normalizeGlossaryTouches(draft: ExtractionDraft): GlossaryTouchCandidate[] {
	const raw = draft.glossaryTouches;
	if (raw.length === 0) return [];

	if (typeof raw[0] === 'string') {
		return (raw as unknown as string[]).slice(0, GLOSSARY_TOUCH_LIMIT).map((term) => {
			const disposition = recommendDisposition(term);
			return {
				term,
				adoptReason: '',
				recommendedDisposition: disposition,
				dispositionRationale: rationaleFor(term, disposition)
			};
		});
	}

	return (raw as GlossaryTouchCandidate[]).slice(0, GLOSSARY_TOUCH_LIMIT);
}

export function capGlossaryTouches<T extends ExtractionDraft['glossaryTouches']>(touches: T): T {
	if (touches.length <= GLOSSARY_TOUCH_LIMIT) return touches;
	return touches.slice(0, GLOSSARY_TOUCH_LIMIT) as T;
}

export function buildGlossaryReviewManifest(
	videoId: string,
	draft: ExtractionDraft,
	meta: { sourceUrl: string; title?: string; episodeInsId?: string }
): GlossaryReviewManifest {
	const touches = normalizeGlossaryTouches(draft);
	return {
		videoId,
		sourceUrl: meta.sourceUrl,
		episodeTitle: meta.title ?? draft.episode.title,
		promptVersion: draft.promptVersion,
		episodeInsId: meta.episodeInsId,
		touchCount: touches.length,
		recommendedDefault: 'drop_all',
		touches
	};
}

export function printGlossaryReviewSummary(manifest: GlossaryReviewManifest): void {
	const title = manifest.episodeTitle ?? manifest.videoId;
	console.log(`\nGlossary review — ${title} (${manifest.touchCount} candidates)`);
	console.log(`Source: ${manifest.sourceUrl}`);
	console.log(`Prompt: ${manifest.promptVersion}`);
	if (manifest.episodeInsId) console.log(`Episode INS: ${manifest.episodeInsId}`);
	console.log(`\nRecommended: drop all — 0 GLO, 0 new INS (INS-48)`);

	if (manifest.touches.length === 0) {
		console.log('\nNo glossary touches in extraction draft.');
		return;
	}

	console.log('\nCandidates:');
	for (const t of manifest.touches) {
		console.log(`  • ${t.term} → ${t.recommendedDisposition} — ${t.dispositionRationale}`);
	}

	if (manifest.resolved) {
		console.log(`\n✓ Reviewed ${manifest.resolved.reviewedAt}: ${manifest.resolved.bulkDisposition}, GLO=${manifest.resolved.gloPromote}`);
	} else {
		console.log('\nAgent: use AskQuestion (bulk disposition + GLO promote) before pb capture.');
		console.log('  Q1 options: drop_all (recommended) | bad_vs_sad_ins | pick_individual');
		console.log('  Q2 options: none (recommended) | one_manual');
	}
}

export function loadOrBuildReviewManifest(jobPath: string, episodeInsId?: string): GlossaryReviewManifest {
	const draftPath = join(jobPath, 'extraction-draft.json');
	const metaPath = join(jobPath, 'meta.json');
	const reviewPath = join(jobPath, 'glossary-review.json');

	if (!existsSync(draftPath)) {
		throw new Error(`Missing ${draftPath} — run ingest first.`);
	}

	const draft = JSON.parse(readFileSync(draftPath, 'utf8')) as ExtractionDraft;
	const meta = existsSync(metaPath)
		? (JSON.parse(readFileSync(metaPath, 'utf8')) as { sourceUrl: string; title?: string; videoId: string })
		: { sourceUrl: '', videoId: jobPath.split('/').pop() ?? 'unknown' };

	const existing = existsSync(reviewPath)
		? (JSON.parse(readFileSync(reviewPath, 'utf8')) as GlossaryReviewManifest)
		: undefined;

	const manifest = buildGlossaryReviewManifest(meta.videoId, draft, {
		sourceUrl: meta.sourceUrl,
		title: meta.title,
		episodeInsId: episodeInsId ?? existing?.episodeInsId
	});

	if (existing?.resolved) {
		manifest.resolved = existing.resolved;
		manifest.episodeInsId = existing.episodeInsId ?? manifest.episodeInsId;
	}

	return manifest;
}

export function writeGlossaryReviewManifest(jobPath: string, manifest: GlossaryReviewManifest): string {
	const reviewPath = join(jobPath, 'glossary-review.json');
	writeFileSync(reviewPath, JSON.stringify(manifest, null, 2));
	return reviewPath;
}

export function resolveGlossaryReview(
	manifest: GlossaryReviewManifest,
	resolution: {
		bulkDisposition: 'drop_all' | 'bad_vs_sad_ins' | 'pick_individual';
		gloPromote: 'none' | 'one_manual';
		note?: string;
	}
): GlossaryReviewManifest {
	return {
		...manifest,
		resolved: {
			...resolution,
			reviewedAt: new Date().toISOString()
		}
	};
}
