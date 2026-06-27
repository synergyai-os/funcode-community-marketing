import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ChainCaptureManifest } from './chain-capture.types.js';
import { runEpisodeBrief, writeChainCaptureManifest } from './episode-brief.js';
import { printVoiceSyncHint, writeVoiceCandidates } from './voices-sync.js';
import { repoRoot } from './paths.js';
import { printVerifyReport, runChainVerify } from './chain-verify.js';
import { execPb } from './pb-exec.js';
import {
	buildGlossaryReviewManifest,
	normalizeGlossaryTouches,
	resolveGlossaryReview,
	writeGlossaryReviewManifest
} from './glossary-review.js';
import type { ExtractionDraft, JobMeta } from './types.js';

type PbCaptureResult = { id: string; collection: string };

export type CommitOptions = {
	dropGlossary: boolean;
	force: boolean;
	skipVerify: boolean;
};

function parseJsonLines<T extends { id?: string; error?: string; workspace?: string }>(
	output: string,
	pick: (parsed: T) => boolean
): T {
	for (const line of output.split('\n').reverse()) {
		const trimmed = line.trim();
		if (!trimmed.startsWith('{')) continue;
		try {
			const parsed = JSON.parse(trimmed) as T;
			if (parsed.error) throw new Error(String(parsed.error));
			if (pick(parsed)) return parsed;
		} catch (err) {
			if (err instanceof SyntaxError) continue;
			throw err;
		}
	}
	throw new Error(`pb returned no matching JSON: ${output.slice(0, 500)}`);
}

function assertFunCodeWorkspace(): void {
	const whoami = parseJsonLines<{ workspace?: string; profile?: string }>(
		execPb(['--json', 'whoami']),
		(p) => typeof p.workspace === 'string'
	);
	if (whoami.workspace !== 'FunCode' || whoami.profile !== 'funcode') {
		throw new Error(
			`Wrong Product Brain workspace (need FunCode/funcode, got ${whoami.workspace}/${whoami.profile}).`
		);
	}
}

function pbCapture(args: string[]): PbCaptureResult {
	const out = execPb(['--json', ...args]);
	return parseJsonLines<PbCaptureResult>(out, (p) => typeof p.id === 'string');
}

function pbRelate(fromId: string, toId: string, type = 'related_to'): void {
	execPb(['relate', '--if-missing', fromId, type, toId]);
}

function withLandingSlot(description: string, slot: string): string {
	if (/landingSlot:/i.test(description)) return description;
	return `${description.trim()} landingSlot: ${slot}`;
}

function guestWhatWeLearn(draft: ExtractionDraft): string {
	const titles = draft.insights.slice(0, 3).map((i) => i.title);
	return titles.length > 0 ? titles.join('; ') : draft.episode.summary.slice(0, 240);
}

function glossaryCandidateTerms(draft: ExtractionDraft): string[] {
	return normalizeGlossaryTouches(draft).map((t) => t.term);
}

function buildGlossaryDescription(
	draft: ExtractionDraft,
	manifest: Pick<ChainCaptureManifest, 'insights' | 'words'>,
	dropAll: boolean
): string {
	const terms = glossaryCandidateTerms(draft);
	const learningIds = manifest.insights.map((x) => x.id).join(', ');
	const wordIds = manifest.words.map((x) => x.id).join(', ');
	if (dropAll) {
		return `REVIEWED: All ${terms.length} dropped — 0 GLO, 0 new INS (default per INS-48). Candidates: ${terms.join(', ')}. Learnings ${learningIds}. WORDS ${wordIds}.`;
	}
	return `PENDING REVIEW (${terms.length} candidates per INS-48): ${terms.join(', ')}. Learnings ${learningIds}. WORDS ${wordIds}.`;
}

export function parseCommitArgs(argv: string[]): { job: string; options: CommitOptions } {
	let job = '';
	let dropGlossary = true;
	let force = false;
	let skipVerify = false;

	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === '--job' && argv[i + 1]) {
			job = argv[++i]!;
		} else if (a === '--drop-glossary') {
			dropGlossary = true;
		} else if (a === '--keep-glossary') {
			dropGlossary = false;
		} else if (a === '--force') {
			force = true;
		} else if (a === '--skip-verify') {
			skipVerify = true;
		} else if (a === '--help' || a === '-h') {
			console.log(`Usage: npm run ingest -- commit --job <videoId> [--drop-glossary] [--keep-glossary] [--force] [--skip-verify]

PAT-7 stage 5: pb capture episode, guest LAND, insights, WORDS, glossary bucket.
Writes chain-capture.json, resolves glossary review (INS-48), runs PAT-9 brief, then PAT-10 verify.

  --drop-glossary   Apply INS-48 drop_all default (default when flag omitted)
  --keep-glossary   Capture glossary bucket without drop_all resolution
  --force           Re-commit even if chain-capture.json exists
  --skip-verify     Skip PAT-10 chain verify after commit`);
			process.exit(0);
		}
	}

	if (!job) {
		throw new Error('Missing --job. Example: npm run ingest -- commit --job 4D3hDmGhFhA');
	}

	return { job, options: { dropGlossary, force, skipVerify } };
}

export function runChainCommit(jobPath: string, options: CommitOptions): void {
	const manifestPath = join(jobPath, 'chain-capture.json');
	if (existsSync(manifestPath) && !options.force) {
		throw new Error(
			`${manifestPath} already exists — pass --force to re-commit or delete it first.`
		);
	}

	const draftPath = join(jobPath, 'extraction-draft.json');
	if (!existsSync(draftPath)) {
		throw new Error(`Missing ${draftPath} — run ingest first.`);
	}

	const draft = JSON.parse(readFileSync(draftPath, 'utf8')) as ExtractionDraft;
	const metaPath = join(jobPath, 'meta.json');
	const meta = existsSync(metaPath)
		? (JSON.parse(readFileSync(metaPath, 'utf8')) as JobMeta)
		: undefined;
	const sourceUrl = meta?.sourceUrl ?? '';
	const videoId = meta?.videoId ?? jobPath.split('/').pop() ?? 'unknown';
	const guest = draft.episode.guest;
	const topic = draft.episode.title;

	assertFunCodeWorkspace();
	console.log('Starting Product Brain session…');
	execPb(['session', 'start', '-q']);

	const guestLandDescription = `${guest} on Lenny's Podcast (${videoId}). ${draft.episode.summary.slice(0, 200)}`;
	console.log(`Capturing guest LAND: ${guest}…`);
	const guestLand = pbCapture([
		'capture',
		'-c',
		'landscape',
		'-n',
		guest,
		'-d',
		guestLandDescription,
		'-f',
		'category=ecosystem',
		'-f',
		'relationshipToPb=complementary',
		'-f',
		'icpOverlap=medium',
		'-f',
		`whatWeLearn=${guestWhatWeLearn(draft)}`,
		'--source-ref',
		sourceUrl
	]);

	const episodeName = `Episode: ${guest} on Lenny's Podcast — ${topic}`;
	console.log(`Capturing episode shell…`);
	const episodeIns = pbCapture([
		'capture',
		'-c',
		'insights',
		'-n',
		episodeName,
		'-d',
		draft.episode.summary,
		'-f',
		'evidenceStrength=first-hand',
		'--source-ref',
		sourceUrl,
		'--source-excerpt',
		draft.episode.summary.slice(0, 280)
	]);

	const insightCaptures: Array<{ id: string; title: string }> = [];
	for (const insight of draft.insights) {
		console.log(`  Insight: ${insight.title}`);
		const captured = pbCapture([
			'capture',
			'-c',
			'insights',
			'-n',
			insight.title,
			'-d',
			withLandingSlot(insight.description, insight.landingSlot),
			'-f',
			'evidenceStrength=first-hand',
			'--source-ref',
			sourceUrl,
			'--source-excerpt',
			insight.sourceExcerpt.slice(0, 500)
		]);
		insightCaptures.push({ id: captured.id, title: insight.title });
	}

	const wordCaptures: Array<{ id: string; label: string }> = [];
	for (const word of draft.words) {
		const wordName = word.label.startsWith('WORD:') ? word.label : `WORD: ${word.label}`;
		const label = word.label.replace(/^WORD:\s*/i, '');
		console.log(`  WORD: ${label}`);
		const captured = pbCapture([
			'capture',
			'-c',
			'insights',
			'-n',
			wordName,
			'-d',
			withLandingSlot(word.quote.slice(0, 240), word.landingSlot),
			'-f',
			'evidenceStrength=first-hand',
			'--source-ref',
			sourceUrl,
			'--source-excerpt',
			word.quote.slice(0, 500)
		]);
		wordCaptures.push({ id: captured.id, label });
	}

	let glossaryIns: string | undefined;
	const glossaryTerms = glossaryCandidateTerms(draft);
	if (glossaryTerms.length > 0) {
		const partialManifest = { insights: insightCaptures, words: wordCaptures };
		const glossDescription = buildGlossaryDescription(draft, partialManifest, options.dropGlossary);
		console.log(`Capturing glossary bucket (${glossaryTerms.length} candidates)…`);
		const captured = pbCapture([
			'capture',
			'-c',
			'insights',
			'-n',
			`Glossary candidates from ${guest} / Lenny episode (${videoId})`,
			'-d',
			glossDescription,
			'-f',
			'evidenceStrength=first-hand',
			'--source-ref',
			sourceUrl
		]);
		glossaryIns = captured.id;
	}

	console.log('Linking relations…');
	pbRelate(guestLand.id, 'LAND-1');
	pbRelate(guestLand.id, 'WP-1');
	pbRelate(episodeIns.id, 'LAND-1');
	pbRelate(episodeIns.id, guestLand.id);
	pbRelate(episodeIns.id, 'WP-1');

	for (const ins of insightCaptures) {
		pbRelate(ins.id, episodeIns.id);
		pbRelate(ins.id, guestLand.id);
		pbRelate(ins.id, 'WP-1');
	}

	for (const word of wordCaptures) {
		pbRelate(word.id, 'GLO-11');
		pbRelate(word.id, episodeIns.id);
		pbRelate(word.id, guestLand.id);
	}

	if (glossaryIns) {
		pbRelate(glossaryIns, episodeIns.id);
		pbRelate(glossaryIns, guestLand.id);
		pbRelate(glossaryIns, 'INS-48');
	}

	const manifest: ChainCaptureManifest = {
		capturedAt: new Date().toISOString(),
		sourceUrl,
		videoId,
		episodeIns: episodeIns.id,
		guestLand: guestLand.id,
		showLand: 'LAND-1',
		insights: insightCaptures,
		words: wordCaptures,
		glossaryIns
	};

	const capturePath = writeChainCaptureManifest(jobPath, manifest);
	console.log(`Wrote ${capturePath}`);

	writeVoiceCandidates(repoRoot, jobPath, manifest, draft);
	printVoiceSyncHint(repoRoot);

	const reviewManifest = buildGlossaryReviewManifest(videoId, draft, {
		sourceUrl,
		title: meta?.title,
		episodeInsId: episodeIns.id
	});
	const finalReview = options.dropGlossary
		? resolveGlossaryReview(reviewManifest, {
				bulkDisposition: 'drop_all',
				gloPromote: 'none',
				note: 'Auto-resolved on commit (INS-48 default)'
			})
		: reviewManifest;
	writeGlossaryReviewManifest(jobPath, finalReview);

	if (meta) {
		meta.status = 'committed';
		meta.updatedAt = new Date().toISOString();
		writeFileSync(metaPath, JSON.stringify(meta, null, 2));
	}

	console.log('Closing Product Brain session…');
	execPb(['session', 'close', '-q']);

	console.log('\n--- Episode brief (PAT-9) ---\n');
	runEpisodeBrief(jobPath);

	if (!options.skipVerify) {
		const report = runChainVerify(jobPath);
		printVerifyReport(report);
		if (!report.passed) {
			throw new Error('PAT-10 chain verify failed — fix captures or re-run with --force');
		}
		console.log('\nStage 7: Session learning — capture friction to Chain (INS/TEN) or sharpen .cursor/rules/episode-ingest.mdc before session close.');
	}
}
