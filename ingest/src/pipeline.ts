import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadConfig } from './config.js';
import { extractChainDraft } from './extract.js';
import {
	buildGlossaryReviewManifest,
	loadOrBuildReviewManifest,
	printGlossaryReviewSummary,
	resolveGlossaryReview,
	writeGlossaryReviewManifest
} from './glossary-review.js';
import { ensureJobDir, jobDir } from './paths.js';
import { saveTranscript, transcribeFile } from './transcribe.js';
import type { JobMeta, TranscriptResult } from './types.js';
import { downloadAudio, fetchVideoTitle, parseYouTubeVideoId } from './youtube.js';

function readJson<T>(path: string): T {
	return JSON.parse(readFileSync(path, 'utf8')) as T;
}

function writeMeta(jobPath: string, meta: JobMeta): void {
	meta.updatedAt = new Date().toISOString();
	writeFileSync(join(jobPath, 'meta.json'), JSON.stringify(meta, null, 2));
}

function parseArgs(argv: string[]): { url: string; force: boolean; skipExtract: boolean } {
	let url = '';
	let force = false;
	let skipExtract = false;

	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === '--url' && argv[i + 1]) {
			url = argv[++i]!;
		} else if (a === '--force') {
			force = true;
		} else if (a === '--skip-extract') {
			skipExtract = true;
		} else if (a === '--help' || a === '-h') {
			console.log(`Usage: npm run ingest -- --url <youtube-url> [--force] [--skip-extract]

  --force         Re-transcribe even if transcript.json exists
  --skip-extract  Stop after transcription (no LLM extraction)

Requires: .env.local with OPENROUTER_API_KEY, yt-dlp, ffmpeg on PATH.
Output: .ingest/jobs/<videoId>/ (gitignored). Review before pb capture.

Subcommands:
  review-glossary --job <videoId>  Glossary candidate summary for AskQuestion (INS-48)
  commit --job <videoId> [--drop-glossary]  Stage 5 → chain-capture.json → brief (PAT-9) → verify (PAT-10)
  verify --job <videoId>             PAT-10: verify Chain matches manifest
  brief --job <videoId>              Blog-style brief with Chain verify tags (PAT-9)`);
			process.exit(0);
		}
	}

	if (!url) {
		throw new Error('Missing --url. Example: npm run ingest -- --url "https://youtube.com/watch?v=..."');
	}

	return { url, force, skipExtract };
}

export async function runIngest(argv: string[]): Promise<void> {
	const { url, force, skipExtract } = parseArgs(argv);
	const cfg = loadConfig();
	const videoId = parseYouTubeVideoId(url);
	const jobPath = ensureJobDir(videoId);

	let meta: JobMeta;
	const metaPath = join(jobPath, 'meta.json');
	if (existsSync(metaPath)) {
		meta = readJson<JobMeta>(metaPath);
		meta.sourceUrl = url;
	} else {
		meta = {
			videoId,
			sourceUrl: url,
			status: 'pending',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};
	}

	const title = fetchVideoTitle(url);
	if (title) meta.title = title;

	const transcriptPath = join(jobPath, 'transcript.json');
	const normalizedAudio = join(jobPath, 'audio-normalized.wav');
	let transcript: TranscriptResult | undefined;

	if (existsSync(transcriptPath) && !force) {
		console.log(`Using existing transcript (${transcriptPath}). Pass --force to re-run STT.`);
		transcript = readJson<TranscriptResult>(transcriptPath);
		meta.status = 'draft_ready';
	} else {
		let audioPath = normalizedAudio;
		if (existsSync(normalizedAudio) && !force) {
			console.log(`Using existing audio (${normalizedAudio}). Pass --force to re-download.`);
		} else {
			meta.status = 'downloading';
			writeMeta(jobPath, meta);
			console.log(`Downloading audio for ${videoId}…`);
			const downloaded = downloadAudio(url, jobPath);
			audioPath = downloaded.audioPath;
			if (downloaded.durationSec) meta.audioDurationSec = downloaded.durationSec;
		}

		meta.status = 'transcribing';
		meta.sttModel = cfg.sttModel;
		writeMeta(jobPath, meta);
		console.log('Transcribing via OpenRouter Whisper…');
		const { result, totalCost } = await transcribeFile(cfg, audioPath, jobPath);
		transcript = result;
		meta.transcriptCostUsd = totalCost;
		saveTranscript(jobPath, result);
		console.log(`Transcript saved (${result.fullText.length} chars, ~$${totalCost.toFixed(4)} STT).`);
	}

	if (skipExtract || !transcript) {
		meta.status = transcript ? 'draft_ready' : meta.status;
		writeMeta(jobPath, meta);
		console.log(`Done. Job: ${jobPath}`);
		return;
	}

	const draftPath = join(jobPath, 'extraction-draft.json');
	if (existsSync(draftPath) && !force) {
		console.log(`Using existing extraction draft. Pass --force to re-extract.`);
		meta.status = 'draft_ready';
		writeMeta(jobPath, meta);
		console.log(`Done. Job: ${jobPath}`);
		console.log(`Next: npm run ingest -- commit --job ${videoId} --drop-glossary`);
		return;
	}

	meta.status = 'extracting';
	meta.extractModel = cfg.extractModel;
	writeMeta(jobPath, meta);
	console.log('Running PAT-7 Chain extraction (OpenRouter LLM)…');
	const { draft, cost } = await extractChainDraft(cfg, transcript, url, meta.title);
	meta.extractCostUsd = cost;
	writeFileSync(draftPath, JSON.stringify(draft, null, 2));

	meta.status = 'draft_ready';
	writeMeta(jobPath, meta);

	console.log(`Extraction draft saved (~$${cost.toFixed(4)} LLM).`);
	console.log(`  Insights: ${draft.insights.length}, WORDS: ${draft.words.length}, glossary touches: ${draft.glossaryTouches.length}`);

	const reviewManifest = buildGlossaryReviewManifest(videoId, draft, {
		sourceUrl: url,
		title: meta.title
	});
	const reviewPath = writeGlossaryReviewManifest(jobPath, reviewManifest);
	printGlossaryReviewSummary(reviewManifest);
	console.log(`Glossary review manifest: ${reviewPath}`);

	console.log(`Review ${draftPath}, then:`);
	console.log(`  npm run ingest -- commit --job ${videoId} --drop-glossary`);
	console.log(`Job directory: ${jobPath}`);
}

function parseReviewArgs(argv: string[]): {
	job: string;
	episodeInsId?: string;
	resolve?: { bulkDisposition: 'drop_all' | 'bad_vs_sad_ins' | 'pick_individual'; gloPromote: 'none' | 'one_manual' };
} {
	let job = '';
	let episodeInsId: string | undefined;
	let resolve:
		| { bulkDisposition: 'drop_all' | 'bad_vs_sad_ins' | 'pick_individual'; gloPromote: 'none' | 'one_manual' }
		| undefined;

	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === '--job' && argv[i + 1]) {
			job = argv[++i]!;
		} else if (a === '--episode-ins' && argv[i + 1]) {
			episodeInsId = argv[++i];
		} else if (a === '--resolve-drop-all') {
			resolve = { bulkDisposition: 'drop_all', gloPromote: 'none' };
		} else if (a === '--help' || a === '-h') {
			console.log(`Usage: npm run ingest -- review-glossary --job <videoId> [--episode-ins INS-36]

Prints glossary candidate summary for AskQuestion review (INS-48).
Writes/updates .ingest/jobs/<videoId>/glossary-review.json

  --resolve-drop-all  Mark review resolved (after founder confirmed drop all)`);
			process.exit(0);
		}
	}

	if (!job) {
		throw new Error('Missing --job. Example: npm run ingest -- review-glossary --job Ybrl4FYM57c');
	}

	return { job, episodeInsId, resolve };
}

export function runGlossaryReview(argv: string[]): void {
	const { job, episodeInsId, resolve } = parseReviewArgs(argv);
	const jobPath = jobDir(job);
	const manifest = loadOrBuildReviewManifest(jobPath, episodeInsId);
	const finalManifest = resolve
		? resolveGlossaryReview(manifest, {
				...resolve,
				note: 'Founder review via AskQuestion (INS-48 workflow)'
			})
		: manifest;
	const reviewPath = writeGlossaryReviewManifest(jobPath, finalManifest);
	printGlossaryReviewSummary(finalManifest);
	console.log(`\nManifest: ${reviewPath}`);
}
