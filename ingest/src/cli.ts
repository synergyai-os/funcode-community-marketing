#!/usr/bin/env node
import { parseCommitArgs, runChainCommit } from './chain-commit.js';
import { parseVerifyArgs, printVerifyReport, runChainVerify } from './chain-verify.js';
import { runEpisodeBrief } from './episode-brief.js';
import { runGlossaryReview, runIngest } from './pipeline.js';
import { jobDir, repoRoot } from './paths.js';
import { runSyncVoicesReport } from './voices-sync.js';

const [command, ...rest] = process.argv.slice(2);

function dispatch(): Promise<void> {
	if (command === 'review-glossary') {
		runGlossaryReview(rest);
		return Promise.resolve();
	}
	if (command === 'commit') {
		const { job, options } = parseCommitArgs(rest);
		runChainCommit(jobDir(job), options);
		return Promise.resolve();
	}
	if (command === 'verify') {
		const { job } = parseVerifyArgs(rest);
		const report = runChainVerify(jobDir(job));
		printVerifyReport(report);
		if (!report.passed) process.exit(1);
		return Promise.resolve();
	}
	if (command === 'sync-voices') {
		runSyncVoicesReport(repoRoot);
		return Promise.resolve();
	}
	if (command === 'brief') {
		let job = '';
		for (let i = 0; i < rest.length; i++) {
			if (rest[i] === '--job' && rest[i + 1]) job = rest[++i]!;
		}
		if (!job) {
			console.log(`Usage: npm run ingest -- brief --job <videoId>

Blog-style episode brief with pb get IDs for verify-as-you-read.
Requires extraction-draft.json; chain-capture.json optional (after stage 5).`);
			process.exit(1);
		}
		runEpisodeBrief(jobDir(job));
		return Promise.resolve();
	}
	return runIngest(process.argv.slice(2));
}

dispatch().catch((err: unknown) => {
	const message = err instanceof Error ? err.message : String(err);
	console.error(`ingest failed: ${message}`);
	process.exit(1);
});
