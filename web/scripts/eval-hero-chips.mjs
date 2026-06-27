#!/usr/bin/env node
/**
 * Hero audience chip eval — DEC-38 drag-to-place + join CTA invariants (checks 30–33).
 *
 * Run from web/: node scripts/eval-hero-chips.mjs [--json]
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB = fileURLToPath(new URL('..', import.meta.url));
const REPO = fileURLToPath(new URL('../..', import.meta.url));
const UI = join(WEB, 'src/lib/components/ui');
const JSON_OUT = process.argv.includes('--json');

/** @type {Array<{id:string, pass:boolean, detail:string}>} */
const checks = [];

function run(cmd, cwd = REPO) {
	return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}

function readUi(name) {
	return readFileSync(join(UI, name), 'utf8');
}

// 30 — DEC-38 resolves on Chain
try {
	const out = run('pb get DEC-38');
	checks.push({
		id: '30-dec-38',
		pass: out.includes('"entryId"'),
		detail: 'pb get DEC-38 resolves'
	});
} catch {
	checks.push({ id: '30-dec-38', pass: false, detail: 'pb get DEC-38 failed' });
}

// 31 — cluster chips always go through ClusterChipDrag (no bare CTA path)
const clusterSrc = readUi('AudienceCluster.svelte');
const clusterOk =
	!clusterSrc.includes("import AudienceChip") &&
	clusterSrc.includes('ClusterChipDrag') &&
	!/<AudienceChip\b/.test(clusterSrc);
checks.push({
	id: '31-cluster-drag-wrapper',
	pass: clusterOk,
	detail: clusterOk
		? 'AudienceCluster uses ClusterChipDrag only (no direct AudienceChip)'
		: 'AudienceCluster must route all chips through ClusterChipDrag'
});

// 32 — join CTA freezes on drag instead of jumping to idle ($effect path only)
const joinSrc = readUi('AudienceJoinChip.svelte');
const dragEffectMatch = joinSrc.match(
	/\$effect\s*\(\s*\(\)\s*=>\s*\{([\s\S]*?)\n\t\}\);/
);
const dragEffectBody = dragEffectMatch?.[1] ?? '';
const dragEffectFreezes =
	/if\s*\(\s*dragging\s*\)[\s\S]*?freezeForDrag\s*\(\s*\)/.test(dragEffectBody) &&
	!/\bjumpToIdle\s*\(\s*\)/.test(dragEffectBody);
checks.push({
	id: '32-join-drag-freeze',
	pass: joinSrc.includes('function freezeForDrag') && dragEffectFreezes,
	detail: dragEffectFreezes
		? '$effect: dragging → freezeForDrag (not jumpToIdle)'
		: 'AudienceJoinChip $effect must freeze visual state on drag'
});

// 33 — reduced-motion path in join chip
checks.push({
	id: '33-join-reduced-motion',
	pass: joinSrc.includes('prefersReducedMotion') && joinSrc.includes('reducedMotion'),
	detail: 'AudienceJoinChip respects prefers-reduced-motion'
});

const passed = checks.filter((c) => c.pass).length;
const total = checks.length;
const report = {
	spec: 'DEC-38-hero-chips',
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
	console.log(`Hero chips eval: ${passed}/${total}${report.pass ? ' PASS' : ' FAIL'}\n`);
	for (const c of checks) {
		console.log(`  ${c.pass ? '✓' : '✗'} ${c.id}: ${c.detail}`);
	}
}

process.exit(report.pass ? 0 : 1);
