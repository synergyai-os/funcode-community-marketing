#!/usr/bin/env node
/**
 * Pre-commit file-size guard (STD-10). Checks staged files only.
 * Run: node web/scripts/check-file-size.mjs
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const REPO = fileURLToPath(new URL('../..', import.meta.url));

const EXEMPT = [
	/\.generated\.ts$/,
	/\/generated\.ts$/,
	/\.test\.(ts|svelte)$/,
	/layout\.css$/,
	/\/types\.ts$/,
	/\/data\/voices\.ts$/,
	/\/routes\/\+page\.svelte$/
];

const LIMITS = {
	'.svelte': { warn: 300, block: 500, routeWarn: 250, routeBlock: 400 },
	'.ts': { warn: 300, block: 500 },
	'.mjs': { warn: 350, block: 500 }
};

function lineCount(filePath) {
	return readFileSync(filePath, 'utf8').split('\n').length;
}

function isExempt(relPath) {
	return EXEMPT.some((re) => re.test(relPath));
}

function isRoutePage(relPath) {
	return relPath.includes('/routes/') && relPath.endsWith('+page.svelte');
}

function stagedFiles() {
	const out = execSync('git diff --cached --name-only --diff-filter=ACMR', {
		cwd: REPO,
		encoding: 'utf8'
	});
	return out
		.trim()
		.split('\n')
		.filter(Boolean)
		.filter((f) => f.startsWith('web/'));
}

const warnings = [];
const blocks = [];

for (const rel of stagedFiles()) {
	if (isExempt(rel)) continue;

	const ext = rel.endsWith('.svelte')
		? '.svelte'
		: rel.endsWith('.mjs')
			? '.mjs'
			: rel.endsWith('.ts')
				? '.ts'
				: null;
	if (!ext || !LIMITS[ext]) continue;

	const limits = LIMITS[ext];
	const abs = join(REPO, rel);
	let lines;
	try {
		lines = lineCount(abs);
	} catch {
		continue;
	}

	const warnAt = isRoutePage(rel) && ext === '.svelte' ? limits.routeWarn : limits.warn;
	const blockAt = isRoutePage(rel) && ext === '.svelte' ? limits.routeBlock : limits.block;

	if (lines > blockAt) {
		blocks.push({ rel, lines, blockAt });
	} else if (lines > warnAt) {
		warnings.push({ rel, lines, warnAt });
	}
}

for (const w of warnings) {
	console.warn(`⚠ STD-10: ${w.rel} — ${w.lines} lines (warn > ${w.warnAt}). Consider extracting.`);
}

if (blocks.length > 0) {
	console.error('\n✖ STD-10 file-size guard failed:\n');
	for (const b of blocks) {
		console.error(`  ${b.rel} — ${b.lines} lines (block > ${b.blockAt})`);
	}
	console.error('\nExtract components/modules before commit. See STD-10 on Chain.\n');
	process.exit(1);
}

console.log('✓ STD-10 file-size guard passed');
