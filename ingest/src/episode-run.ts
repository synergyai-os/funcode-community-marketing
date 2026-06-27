import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { assertNoOrphanCaptures, findOrphanCaptures } from './chain-orphan-guard.js';
import { runFullReconcile } from './chain-reconcile.js';
import { runChainCommit, type CommitOptions } from './chain-commit.js';
import { printVerifyReport, runChainVerify } from './chain-verify.js';
import { runEpisodeBrief } from './episode-brief.js';
import { jobDir, repoRoot } from './paths.js';
import { runIngest } from './pipeline.js';
import { runSyncVoicesReport } from './voices-sync.js';
import { parseYouTubeVideoId } from './youtube.js';

export type EpisodeRunOptions = {
	dropGlossary: boolean;
	force: boolean;
	skipIngest: boolean;
	wire: boolean;
};

export function parseEpisodeArgs(argv: string[]): { url: string; options: EpisodeRunOptions } {
	let url = '';
	let dropGlossary = true;
	let force = false;
	let skipIngest = false;
	let wire = false;

	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === '--url' && argv[i + 1]) {
			url = argv[++i]!;
		} else if (a === '--drop-glossary') {
			dropGlossary = true;
		} else if (a === '--keep-glossary') {
			dropGlossary = false;
		} else if (a === '--force') {
			force = true;
		} else if (a === '--skip-ingest') {
			skipIngest = true;
		} else if (a === '--wire') {
			wire = true;
		} else if (a === '--help' || a === '-h') {
			console.log(`Usage: npm run ingest -- episode --url <youtube-url> [options]

One-shot PAT-8 → commit or reconcile --wire → brief → verify → voice sync report.

  --drop-glossary   INS-48 drop_all on commit (default)
  --keep-glossary   Keep glossary bucket without drop_all
  --force           Re-ingest / re-commit when allowed
  --skip-ingest     Skip STT+extract if extraction-draft.json exists
  --wire            After manifest exists, re-wire relations (fixes MCP orphans)`);
			process.exit(0);
		}
	}

	if (!url) {
		throw new Error('Missing --url. Example: npm run ingest -- episode --url "https://youtube.com/watch?v=..."');
	}

	return { url, options: { dropGlossary, force, skipIngest, wire } };
}

export async function runEpisodePipeline(url: string, options: EpisodeRunOptions): Promise<string> {
	const videoId = parseYouTubeVideoId(url);
	const jobPath = jobDir(videoId);
	const draftPath = join(jobPath, 'extraction-draft.json');
	const manifestPath = join(jobPath, 'chain-capture.json');

	if (!options.skipIngest || !existsSync(draftPath)) {
		const ingestArgs = ['--url', url];
		if (options.force) ingestArgs.push('--force');
		await runIngest(ingestArgs);
	}

	if (options.wire && existsSync(manifestPath)) {
		runFullReconcile(jobPath, { wire: true, force: options.force, skipVerify: false });
	} else if (!existsSync(manifestPath)) {
		const orphan = findOrphanCaptures(videoId);
		if (orphan) {
			console.log(
				`Chain orphan detected (${orphan.entryCount} entries, episode ${orphan.episodeId}) — reconciling with --wire…`
			);
			runFullReconcile(jobPath, { wire: true, force: true, skipVerify: false });
		} else {
			const commitOpts: CommitOptions = {
				dropGlossary: options.dropGlossary,
				force: options.force,
				skipVerify: false
			};
			runChainCommit(jobPath, commitOpts);
		}
	} else {
		console.log('chain-capture.json exists — brief + verify');
		runEpisodeBrief(jobPath);
		const report = runChainVerify(jobPath);
		printVerifyReport(report);
		if (!report.passed) {
			throw new Error(
				`PAT-10 verify failed — run: npm run ingest -- reconcile --job ${videoId} --wire`
			);
		}
	}

	runSyncVoicesReport(repoRoot);

	const briefPath = join(jobPath, 'episode-brief.md');
	console.log(`\n✓ Episode pipeline complete — brief: ${briefPath}`);
	return briefPath;
}

/** Guard used by commit — exported for tests. */
export { assertNoOrphanCaptures };
