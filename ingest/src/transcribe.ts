import { mkdirSync, readFileSync, readdirSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import type { IngestConfig } from './config.js';
import { openRouterHeaders } from './config.js';
import type { TranscriptResult, TranscriptSegment } from './types.js';

/** Keep payloads small — raw 10-min WAV base64 exceeds OpenRouter body limits. */
const CHUNK_SEC = 180; // 3 minutes
const OPENROUTER_STT_URL = 'https://openrouter.ai/api/v1/audio/transcriptions';

type SttResponse = {
	text?: string;
	usage?: { cost?: number; seconds?: number };
	error?: { message?: string };
};

function toMp3(wavPath: string): string {
	const mp3Path = wavPath.replace(/\.wav$/i, '.mp3');
	execFileSync(
		'ffmpeg',
		['-y', '-i', wavPath, '-ac', '1', '-ar', '16000', '-b:a', '64k', mp3Path],
		{ stdio: 'pipe' }
	);
	return mp3Path;
}

async function parseJsonResponse(res: Response): Promise<SttResponse> {
	const raw = await res.text();
	try {
		return JSON.parse(raw) as SttResponse;
	} catch {
		const snippet = raw.slice(0, 200).replace(/\s+/g, ' ');
		throw new Error(
			`OpenRouter STT returned non-JSON (${res.status} ${res.statusText}): ${snippet}`
		);
	}
}

function splitAudio(audioPath: string, workDir: string): string[] {
	const pattern = join(workDir, 'chunk-%03d.wav');
	execFileSync(
		'ffmpeg',
		[
			'-y',
			'-i',
			audioPath,
			'-f',
			'segment',
			'-segment_time',
			String(CHUNK_SEC),
			'-c',
			'copy',
			pattern
		],
		{ stdio: 'pipe' }
	);

	return readdirSync(workDir)
		.filter((f) => f.startsWith('chunk-') && f.endsWith('.wav'))
		.sort()
		.map((f) => join(workDir, f));
}

async function transcribeChunk(
	cfg: IngestConfig,
	wavPath: string
): Promise<{ text: string; cost: number; seconds: number }> {
	const mp3Path = toMp3(wavPath);
	const data = readFileSync(mp3Path).toString('base64');

	const res = await fetch(OPENROUTER_STT_URL, {
		method: 'POST',
		headers: openRouterHeaders(cfg),
		body: JSON.stringify({
			model: cfg.sttModel,
			input_audio: { data, format: 'mp3' },
			language: 'en'
		})
	});

	const body = await parseJsonResponse(res);
	if (!res.ok) {
		throw new Error(
			`OpenRouter STT failed (${res.status}): ${body.error?.message ?? JSON.stringify(body)}`
		);
	}

	return {
		text: (body.text ?? '').trim(),
		cost: body.usage?.cost ?? 0,
		seconds: body.usage?.seconds ?? 0
	};
}

export async function transcribeFile(
	cfg: IngestConfig,
	audioPath: string,
	jobPath: string
): Promise<{ result: TranscriptResult; totalCost: number }> {
	const chunkDir = join(jobPath, 'chunks');
	rmSync(chunkDir, { recursive: true, force: true });
	mkdirSync(chunkDir, { recursive: true });

	const chunks = splitAudio(audioPath, chunkDir);
	if (chunks.length === 0) {
		chunks.push(audioPath);
	}

	const segments: TranscriptSegment[] = [];
	let fullText = '';
	let totalCost = 0;
	let index = 0;

	for (let i = 0; i < chunks.length; i++) {
		const chunkPath = chunks[i]!;
		process.stdout.write(`  STT chunk ${i + 1}/${chunks.length}…\n`);
		const part = await transcribeChunk(cfg, chunkPath);
		totalCost += part.cost;

		const startSec = i * CHUNK_SEC;
		segments.push({
			index,
			startSec,
			endSec: startSec + (part.seconds || CHUNK_SEC),
			text: part.text
		});
		fullText += (fullText ? '\n\n' : '') + part.text;
		index += 1;

		if (chunkPath !== audioPath) {
			try {
				unlinkSync(chunkPath);
			} catch {
				/* ignore */
			}
		}
	}

	return {
		result: {
			fullText,
			segments,
			provider: 'openrouter-whisper',
			model: cfg.sttModel,
			language: 'en'
		},
		totalCost
	};
}

export function saveTranscript(jobPath: string, transcript: TranscriptResult): void {
	writeFileSync(join(jobPath, 'transcript.json'), JSON.stringify(transcript, null, 2));
}
