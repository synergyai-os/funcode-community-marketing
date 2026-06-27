#!/usr/bin/env node
/**
 * PAT-11 Tier 1 — automated design-system eval checks (extends PAT-2 checks 22–28).
 *
 * Run from web/: node scripts/eval-design-system-cli.mjs [--json]
 */
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB = fileURLToPath(new URL('..', import.meta.url));
const REPO = fileURLToPath(new URL('../..', import.meta.url));
const SRC = join(WEB, 'src');
const JSON_OUT = process.argv.includes('--json');

/** @type {Array<{id:string, pass:boolean, detail:string}>} */
const checks = [];

function run(cmd, cwd = REPO) {
	return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}

function pbGet(ids) {
	const out = run(`pb get ${ids}`);
	return out.includes('"entryId"');
}

function walk(dir, ext, files = []) {
	for (const name of readdirSync(dir)) {
		const full = join(dir, name);
		if (statSync(full).isDirectory()) walk(full, ext, files);
		else if (ext.test(name)) files.push(full);
	}
	return files;
}

function grepSrc(pattern) {
	const files = walk(SRC, /\.(svelte|ts)$/);
	const hits = [];
	for (const file of files) {
		const rel = relative(SRC, file);
		const lines = readFileSync(file, 'utf8').split('\n');
		lines.forEach((line, i) => {
			if (pattern.test(line)) hits.push(`${rel}:${i + 1}`);
		});
	}
	return hits;
}

// 22 — DEC-11 resolves
checks.push({
	id: '22-dec-11',
	pass: pbGet('DEC-11'),
	detail: 'pb get DEC-11 resolves'
});

// 23 — STD-1/2/3 resolve
checks.push({
	id: '23-std-trio',
	pass: pbGet('STD-1') && pbGet('STD-2') && pbGet('STD-3'),
	detail: 'pb get STD-1 STD-2 STD-3 resolve'
});

// 24 — BR-2 + ROL-2 resolve
checks.push({
	id: '24-br2-rol2',
	pass: pbGet('BR-2') && pbGet('ROL-2'),
	detail: 'pb get BR-2 ROL-2 resolve'
});

// 25 — orient returns design-system governance
try {
	const orient = run('pb orient --task "design system landing page CTA"');
	checks.push({
		id: '25-orient-ds',
		pass: /DEC-11|STD-1|STD-2|STD-3|BR-2/.test(orient),
		detail: 'pb orient --task mentions DEC-11 or STD-* or BR-2'
	});
} catch {
	checks.push({ id: '25-orient-ds', pass: false, detail: 'pb orient --task failed' });
}

// 26 — lint:ds
try {
	run('npm run lint:ds', WEB);
	checks.push({ id: '26-lint-ds', pass: true, detail: 'npm run lint:ds exit 0' });
} catch (e) {
	checks.push({
		id: '26-lint-ds',
		pass: false,
		detail: `lint:ds failed: ${e instanceof Error ? e.message : String(e)}`
	});
}

// 27 — DS-scoped eslint (ui atoms + guard script)
try {
	run('npx eslint src/lib/components/ui scripts/check-design-system.mjs scripts/eval-design-system-cli.mjs', WEB);
	checks.push({
		id: '27-eslint-ds',
		pass: true,
		detail: 'eslint on ui/ + DS scripts exit 0'
	});
} catch (e) {
	checks.push({
		id: '27-eslint-ds',
		pass: false,
		detail: `eslint DS scope failed: ${e instanceof Error ? e.message : String(e)}`
	});
}

// 28 — forbidden icon imports
const forbiddenIcons = grepSrc(/(?:from\s+['"]lucide-svelte|from\s+['"]@iconify\/svelte)/);
checks.push({
	id: '28-no-forbidden-icons',
	pass: forbiddenIcons.length === 0,
	detail:
		forbiddenIcons.length === 0
			? 'no lucide-svelte or @iconify/svelte imports'
			: `found: ${forbiddenIcons.join(', ')}`
});

// Bonus — no neutral palette leakage
const neutralHits = grepSrc(
	/\b(?:bg|text|border|ring|ring-offset|fill|stroke|from|via|to|decoration|outline|caret|accent|shadow)-neutral-/
);
checks.push({
	id: '29-no-neutral-palette',
	pass: neutralHits.length === 0,
	detail:
		neutralHits.length === 0
			? 'no neutral-* palette classes in src'
			: `found: ${neutralHits.slice(0, 5).join(', ')}${neutralHits.length > 5 ? '…' : ''}`
});

const passed = checks.filter((c) => c.pass).length;
const total = checks.length;
const report = {
	spec: 'PAT-11',
	tier: 1,
	passed,
	total,
	pass: passed === total,
	checks,
	timestamp: new Date().toISOString()
};

if (JSON_OUT) {
	console.log(JSON.stringify(report, null, 2));
} else {
	console.log(`PAT-11 Tier 1: ${passed}/${total}${report.pass ? ' PASS' : ' FAIL'}\n`);
	for (const c of checks) {
		console.log(`  ${c.pass ? '✓' : '✗'} ${c.id}: ${c.detail}`);
	}
}

process.exit(report.pass ? 0 : 1);
