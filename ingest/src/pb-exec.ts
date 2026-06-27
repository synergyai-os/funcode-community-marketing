import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { repoRoot } from './paths.js';

let cachedPbBin: string | undefined;

/** Prefer Homebrew pb over proto-shim copies that lag behind (missing `-f`). */
export function resolvePbBin(): string {
	if (cachedPbBin) return cachedPbBin;

	if (process.env.PB_BIN && existsSync(process.env.PB_BIN)) {
		cachedPbBin = process.env.PB_BIN;
		return cachedPbBin;
	}

	for (const candidate of ['/opt/homebrew/bin/pb', '/usr/local/bin/pb']) {
		if (existsSync(candidate)) {
			cachedPbBin = candidate;
			return cachedPbBin;
		}
	}

	cachedPbBin = 'pb';
	return cachedPbBin;
}

export function pbEnv(): NodeJS.ProcessEnv {
	return {
		...process.env,
		PATH: `/opt/homebrew/bin:/usr/local/bin:${process.env.PATH ?? ''}`
	};
}

export function execPb(args: string[]): string {
	const result = spawnSync(resolvePbBin(), args, {
		cwd: repoRoot,
		encoding: 'utf8',
		maxBuffer: 10 * 1024 * 1024,
		env: pbEnv()
	});
	if (result.status !== 0) {
		const detail = (result.stderr || result.stdout || '').trim();
		throw new Error(`pb ${args.join(' ')} failed: ${detail || `exit ${result.status}`}`);
	}
	return result.stdout.trim();
}
