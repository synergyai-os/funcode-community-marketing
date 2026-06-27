import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export function parseYouTubeVideoId(url: string): string {
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
		/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
	];
	for (const re of patterns) {
		const m = url.match(re);
		if (m?.[1]) return m[1];
	}
	throw new Error(`Could not parse YouTube video id from URL: ${url}`);
}

export function requireBinary(name: string): void {
	try {
		execFileSync('which', [name], { stdio: 'pipe' });
	} catch {
		throw new Error(
			`${name} is not on PATH. Install it (e.g. brew install ${name === 'yt-dlp' ? 'yt-dlp' : name}).`
		);
	}
}

export function fetchVideoTitle(url: string): string | undefined {
	try {
		const out = execFileSync(
			'yt-dlp',
			['--print', '%(title)s', '--no-playlist', url],
			{ encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
		);
		const title = out.trim();
		return title || undefined;
	} catch {
		return undefined;
	}
}

/** Download best audio and convert to mono 16kHz wav for Whisper. */
export function downloadAudio(url: string, jobPath: string): { audioPath: string; durationSec?: number } {
	requireBinary('yt-dlp');
	requireBinary('ffmpeg');

	const template = join(jobPath, 'source.%(ext)s');

	execFileSync(
		'yt-dlp',
		['-x', '--audio-format', 'wav', '-o', template, '--no-playlist', '--no-warnings', url],
		{ stdio: 'inherit' }
	);

	const downloaded = readdirSync(jobPath)
		.filter((f) => f.startsWith('source') && f.endsWith('.wav'))
		.map((f) => join(jobPath, f))[0];

	if (!downloaded || !existsSync(downloaded)) {
		throw new Error('yt-dlp did not produce source.wav in the job directory');
	}

	// Normalize: mono 16kHz — smaller chunks, Whisper-friendly
	const normalized = join(jobPath, 'audio-normalized.wav');
	execFileSync(
		'ffmpeg',
		['-y', '-i', downloaded, '-ac', '1', '-ar', '16000', normalized],
		{ stdio: 'pipe' }
	);

	let durationSec: number | undefined;
	try {
		const probe = execFileSync(
			'ffprobe',
			[
				'-v',
				'error',
				'-show_entries',
				'format=duration',
				'-of',
				'default=noprint_wrappers=1:nokey=1',
				normalized
			],
			{ encoding: 'utf8' }
		);
		const n = parseFloat(probe.trim());
		if (!Number.isNaN(n)) durationSec = n;
	} catch {
		// ffprobe optional
	}

	return { audioPath: normalized, durationSec };
}
