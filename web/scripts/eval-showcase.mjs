#!/usr/bin/env node
/**
 * Showcase + ingest strategy eval — target ≥80% pass before trusting relations/slots.
 *
 * Run from repo root:
 *   node web/scripts/eval-showcase.mjs [--json]
 *
 * Or from web/: npm run eval:showcase
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = fileURLToPath(new URL('../..', import.meta.url));
const WEB = join(REPO, 'web');
const JOBS = join(REPO, '.ingest/jobs');
const JSON_OUT = process.argv.includes('--json');
const PASS_THRESHOLD = 0.8;

/** @type {Array<{id:string, pass:boolean, detail:string}>} */
const checks = [];

function run(cmd, cwd = REPO) {
	return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}

function add(id, pass, detail) {
	checks.push({ id, pass, detail });
}

// --- Workspace guard ---
try {
	const who = JSON.parse(run('pb whoami -q'));
	add('pb-whoami-funcode', who.workspace === 'FunCode', `workspace=${who.workspace}`);
} catch (e) {
	add('pb-whoami-funcode', false, String(e.stderr || e.message));
}

// --- Generated data ---
const genPath = join(WEB, 'src/lib/data/showcase/lenny-batch.generated.ts');
add('showcase-data-exists', existsSync(genPath), genPath);

let chainIds = [];
let stats = { episodeCount: 0, shiftOldCount: 0, shiftNewCount: 0, wordCount: 0 };
if (existsSync(genPath)) {
	const src = readFileSync(genPath, 'utf8');
	const idMatch = src.match(/export const lennyBatchChainIds: string\[\] = (\[[\s\S]*?\]);/);
	if (idMatch) chainIds = JSON.parse(idMatch[1]);
	const statsBlock = src.match(/"stats":\s*\{[\s\S]*?\n {2}\}/)?.[0] ?? src;
	const num = (key) => Number(statsBlock.match(new RegExp(`"${key}": (\\d+)`))?.[1] ?? 0);
	stats = {
		episodeCount: num('episodeCount'),
		shiftOldCount: num('shiftOldCount'),
		shiftNewCount: num('shiftNewCount'),
		wordCount: num('wordCount')
	};
}

add('batch-13-episodes', stats.episodeCount === 13, `episodes=${stats.episodeCount}`);
add('shift-old-coverage', stats.shiftOldCount >= 10, `shift-old=${stats.shiftOldCount} (want ≥10)`);
add('shift-new-coverage', stats.shiftNewCount >= 15, `shift-new=${stats.shiftNewCount} (want ≥15)`);
add('word-coverage', stats.wordCount >= 50, `words=${stats.wordCount} (want ≥50)`);

// --- Chain ID resolution (sample + full if fast enough) ---
const sampleSize = Math.min(chainIds.length, 40);
const sample = [...chainIds].sort(() => Math.random() - 0.5).slice(0, sampleSize);
let resolved = 0;
for (const id of sample) {
	try {
		run(`pb get ${id} -q`);
		resolved++;
	} catch {
		/* missing */
	}
}
const resolveRate = sample.length ? resolved / sample.length : 0;
add(
	'chain-ids-resolve-sample',
	resolveRate >= PASS_THRESHOLD,
	`${resolved}/${sample.length} (${Math.round(resolveRate * 100)}%)`
);

// --- Ingest jobs verify (13 batch) ---
const batchFile = join(REPO, '.ingest/lenny-batch-13.txt');
let videoIds = [];
if (existsSync(batchFile)) {
	videoIds = readFileSync(batchFile, 'utf8')
		.split('\n')
		.map((l) => l.trim())
		.filter((l) => l.startsWith('http'))
		.map((url) => {
			const m = url.match(/[?&]v=([^&]+)/);
			return m?.[1] ?? '';
		})
		.filter(Boolean);
}

let verifyPass = 0;
for (const vid of videoIds) {
	const reportPath = join(JOBS, vid, 'verify-report.json');
	if (!existsSync(reportPath)) continue;
	const report = JSON.parse(readFileSync(reportPath, 'utf8'));
	if (report.passed) verifyPass++;
}
const verifyRate = videoIds.length ? verifyPass / videoIds.length : 0;
add(
	'ingest-verify-batch',
	verifyRate >= PASS_THRESHOLD,
	`${verifyPass}/${videoIds.length} jobs (${Math.round(verifyRate * 100)}%)`
);

// --- Showcase routes exist ---
const routes = [
	'showcase/+page.svelte',
	'showcase/mental-model/+page.svelte',
	'showcase/shifts/+page.svelte',
	'showcase/guests/+page.svelte',
	'showcase/voices/+page.svelte'
];
for (const r of routes) {
	add(`route-${r.replace(/\//g, '-')}`, existsSync(join(WEB, 'src/routes', r)), r);
}

// --- Mental model page markers ---
const mmPath = join(WEB, 'src/routes/showcase/mental-model/+page.svelte');
if (existsSync(mmPath)) {
	const mm = readFileSync(mmPath, 'utf8');
	add('mental-model-old-new-toggle', mm.includes('MentalModelSection'), 'themed sections');
	add('mental-model-beliefs', mm.includes('belief shift') || mm.includes('Belief'), 'beliefs copy');
	add('mental-model-cta', mm.includes('Play Room'), 'Play Room CTA');
}

// --- Landing slot taxonomy on Chain ---
try {
	const pat7 = run('pb get PAT-7 -q');
	add('pat-7-resolves', pat7.includes('shift-old') && pat7.includes('shift-new'), 'PAT-7 taxonomy');
} catch {
	add('pat-7-resolves', false, 'pb get PAT-7 failed');
}

const passed = checks.filter((c) => c.pass).length;
const total = checks.length;
const rate = total ? passed / total : 0;
const report = {
	passed,
	total,
	rate: Math.round(rate * 100),
	threshold: Math.round(PASS_THRESHOLD * 100),
	ok: rate >= PASS_THRESHOLD,
	checks
};

if (JSON_OUT) {
	console.log(JSON.stringify(report, null, 2));
} else {
	console.log(
		`\nShowcase eval — ${passed}/${total} (${report.rate}%) · threshold ${report.threshold}%\n`
	);
	for (const c of checks) {
		console.log(`${c.pass ? '✓' : '✗'} ${c.id}: ${c.detail}`);
	}
	console.log(`\nOverall: ${report.ok ? 'PASS' : 'FAIL'}\n`);
}

process.exit(report.ok ? 0 : 1);
