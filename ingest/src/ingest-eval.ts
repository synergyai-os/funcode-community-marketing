import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ChainCaptureManifest } from './chain-capture.types.js';
import { runChainVerify } from './chain-verify.js';
import { jobsRoot, repoRoot } from './paths.js';
import type { JobMeta } from './types.js';
import { loadRegistry, readExistingChainIds } from './voices-sync-internals.js';

export type EvalCheck = {
	name: string;
	pass: boolean;
	detail?: string;
};

export type JobEval = {
	videoId: string;
	passed: boolean;
	checks: EvalCheck[];
};

function check(name: string, pass: boolean, detail?: string): EvalCheck {
	return { name, pass, detail };
}

function listJobIds(): string[] {
	if (!existsSync(jobsRoot)) return [];
	return readdirSync(jobsRoot, { withFileTypes: true })
		.filter((d) => d.isDirectory())
		.map((d) => d.name)
		.sort();
}

function briefHasPendingTags(briefPath: string): boolean {
	if (!existsSync(briefPath)) return true;
	const text = readFileSync(briefPath, 'utf8');
	return /capture pending/i.test(text);
}

function evalJob(videoId: string): JobEval {
	const jobPath = join(jobsRoot, videoId);
	const checks: EvalCheck[] = [];
	const metaPath = join(jobPath, 'meta.json');
	const draftPath = join(jobPath, 'extraction-draft.json');
	const manifestPath = join(jobPath, 'chain-capture.json');
	const briefPath = join(jobPath, 'episode-brief.md');

	checks.push(check('meta.json', existsSync(metaPath)));
	checks.push(check('extraction-draft.json', existsSync(draftPath)));

	let meta: JobMeta | undefined;
	if (existsSync(metaPath)) {
		meta = JSON.parse(readFileSync(metaPath, 'utf8')) as JobMeta;
	}

	if (meta?.status === 'committed') {
		checks.push(check('chain-capture.json (committed job)', existsSync(manifestPath)));
	}

	if (existsSync(manifestPath)) {
		const pending = briefHasPendingTags(briefPath);
		checks.push(
			check(
				'episode-brief.md (no pending tags)',
				existsSync(briefPath) && !pending,
				pending ? 'brief still has capture pending tags' : undefined
			)
		);

		try {
			const report = runChainVerify(jobPath);
			checks.push(check('PAT-10 verify', report.passed, `${report.checks.filter((c) => !c.pass).length} failed`));
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			checks.push(check('PAT-10 verify', false, message));
		}

		const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as ChainCaptureManifest;
		const registry = loadRegistry(repoRoot);
		const voicesPath = join(repoRoot, 'web', 'src', 'lib', 'data', 'voices.ts');
		const inVoices = readExistingChainIds(voicesPath);
		const registryIds = new Set(registry.candidates.map((c) => c.chainId));

		for (const word of manifest.words) {
			const linked = inVoices.has(word.id) || registryIds.has(word.id);
			checks.push(
				check(`WORD ${word.id} in registry or voices.ts`, linked, word.label)
			);
		}
	}

	const passed = checks.every((c) => c.pass);
	return { videoId, passed, checks };
}

export function runIngestEval(): { passed: boolean; jobs: JobEval[] } {
	const jobs = listJobIds().map(evalJob);
	const passed = jobs.every((j) => j.passed);
	return { passed, jobs };
}

export function printIngestEval(): void {
	const result = runIngestEval();
	console.log(`\nIngest eval — ${result.jobs.length} job(s)\n`);

	for (const job of result.jobs) {
		const icon = job.passed ? '✓' : '✗';
		console.log(`${icon} ${job.videoId}`);
		for (const c of job.checks.filter((x) => !x.pass)) {
			console.log(`    ✗ ${c.name}${c.detail ? `: ${c.detail}` : ''}`);
		}
	}

	console.log(`\nOverall: ${result.passed ? 'PASS' : 'FAIL'}`);
	if (!result.passed) process.exit(1);
}
