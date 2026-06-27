import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ChainCaptureManifest } from './chain-capture.types.js';
import { wireManifestRelations } from './chain-relations.js';
import { loadChainCaptureManifest, runEpisodeBrief } from './episode-brief.js';
import { reconcileChainManifest } from './chain-reconcile-manifest.js';
import { printVerifyReport, runChainVerify } from './chain-verify.js';
import { execPb } from './pb-exec.js';
import { printVoiceSyncHint, writeVoiceCandidates } from './voices-sync.js';
import { repoRoot } from './paths.js';
import type { ExtractionDraft, JobMeta } from './types.js';

export type ReconcileOptions = {
	wire: boolean;
	force: boolean;
	skipVerify: boolean;
};

function assertFunCodeWorkspace(): void {
	const out = execPb(['--json', 'whoami']);
	const whoami = JSON.parse(out) as { workspace?: string; profile?: string; error?: string };
	if (whoami.error) throw new Error(String(whoami.error));
	if (whoami.workspace !== 'FunCode' || whoami.profile !== 'funcode') {
		throw new Error(
			`Wrong Product Brain workspace (need FunCode/funcode, got ${whoami.workspace}/${whoami.profile}).`
		);
	}
}

export function parseReconcileArgs(argv: string[]): { job: string; options: ReconcileOptions } {
	let job = '';
	let wire = false;
	let force = false;
	let skipVerify = false;

	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === '--job' && argv[i + 1]) {
			job = argv[++i]!;
		} else if (a === '--wire') {
			wire = true;
		} else if (a === '--force') {
			force = true;
		} else if (a === '--skip-verify') {
			skipVerify = true;
		} else if (a === '--help' || a === '-h') {
			console.log(`Usage: npm run ingest -- reconcile --job <videoId> [--wire] [--force] [--skip-verify]

Backfill chain-capture.json from Chain (MCP captures). With --wire, link PAT-7 relations,
refresh voice registry, brief, and PAT-10 verify.

  --wire          pb relate graph + voice candidates + brief + verify
  --force         Rebuild manifest from Chain search even if chain-capture.json exists
  --skip-verify   Skip PAT-10 after --wire`);
			process.exit(0);
		}
	}

	if (!job) {
		throw new Error('Missing --job. Example: npm run ingest -- reconcile --job Ybrl4FYM57c --wire');
	}

	return { job, options: { wire, force, skipVerify } };
}

/** Full reconcile path — manifest backfill, optional wire, brief, verify. */
export function runFullReconcile(jobPath: string, options: ReconcileOptions): ChainCaptureManifest {
	const manifestPath = join(jobPath, 'chain-capture.json');
	let manifest: ChainCaptureManifest;

	if (!existsSync(manifestPath) || options.force) {
		manifest = reconcileChainManifest(jobPath);
		console.log(
			`Reconciled chain-capture.json — episode ${manifest.episodeIns}, ${manifest.insights.length} learnings, ${manifest.words.length} WORDS`
		);
	} else {
		manifest = loadChainCaptureManifest(jobPath)!;
		console.log(`Using existing chain-capture.json — episode ${manifest.episodeIns}`);
	}

	if (!options.wire) return manifest;

	const draftPath = join(jobPath, 'extraction-draft.json');
	if (!existsSync(draftPath)) {
		throw new Error(`Missing ${draftPath}`);
	}
	const draft = JSON.parse(readFileSync(draftPath, 'utf8')) as ExtractionDraft;
	const metaPath = join(jobPath, 'meta.json');
	const meta = existsSync(metaPath)
		? (JSON.parse(readFileSync(metaPath, 'utf8')) as JobMeta)
		: undefined;

	assertFunCodeWorkspace();
	console.log('Starting Product Brain session…');
	execPb(['session', 'start', '-q']);

	wireManifestRelations(manifest);
	console.log('Relations wired.');

	writeVoiceCandidates(repoRoot, jobPath, manifest, draft);
	printVoiceSyncHint(repoRoot);

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
			throw new Error('PAT-10 chain verify failed after reconcile --wire');
		}
	}

	return manifest;
}

export { reconcileChainManifest } from './chain-reconcile-manifest.js';
