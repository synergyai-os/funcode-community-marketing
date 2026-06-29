#!/usr/bin/env node
/**
 * PAT-13 Tier 1 — site chrome eval gate (STD-11).
 * Run from web/: npm run eval:site-chrome [--json]
 */
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB = fileURLToPath(new URL('..', import.meta.url));
const REPO = fileURLToPath(new URL('../..', import.meta.url));
const UI = join(WEB, 'src/lib/components/ui');
const DATA = join(WEB, 'src/lib/data');
const REPORT_DIR = join(WEB, 'scripts/reports');
const JSON_OUT = process.argv.includes('--json');

/** @type {Array<{id:string, pass:boolean, detail:string}>} */
const checks = [];

function run(cmd, cwd = REPO) {
	return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}

function read(path) {
	return readFileSync(path, 'utf8');
}

function fileExists(rel) {
	return existsSync(join(WEB, rel));
}

// 1 — workspace guard
try {
	const who = run('pb whoami');
	checks.push({
		id: '01-whoami-funcode',
		pass: who.includes('"workspace":"FunCode"'),
		detail: 'pb whoami → workspace FunCode'
	});
} catch {
	checks.push({ id: '01-whoami-funcode', pass: false, detail: 'pb whoami failed' });
}

// 2–3 — Chain resolves
for (const [id, entry] of [
	['02-std-11', 'STD-11'],
	['03-pat-13', 'PAT-13']
]) {
	try {
		const out = run(`pb get ${entry}`);
		checks.push({ id, pass: out.includes('"entryId"'), detail: `pb get ${entry} resolves` });
	} catch {
		checks.push({ id, pass: false, detail: `pb get ${entry} failed` });
	}
}

// 4–8 — required files
const requiredFiles = [
	['04-site-nav', 'src/lib/data/site-nav.ts'],
	['05-nav-pillar', 'src/lib/components/ui/NavPillar.svelte'],
	['06-site-menu', 'src/lib/components/ui/SiteMenu.svelte'],
	['07-site-chrome', 'src/lib/components/ui/SiteChrome.svelte'],
	['08-dev-route', 'src/routes/dev/site-chrome/+page.svelte']
];
for (const [id, rel] of requiredFiles) {
	checks.push({
		id,
		pass: fileExists(rel),
		detail: `${rel} exists`
	});
}

const siteNavSrc = fileExists('src/lib/data/site-nav.ts')
	? read(join(DATA, 'site-nav.ts'))
	: '';
const navPillarSrc = fileExists('src/lib/components/ui/NavPillar.svelte')
	? read(join(UI, 'NavPillar.svelte'))
	: '';
const siteMenuSrc = fileExists('src/lib/components/ui/SiteMenu.svelte')
	? read(join(UI, 'SiteMenu.svelte'))
	: '';
const siteChromeSrc = fileExists('src/lib/components/ui/SiteChrome.svelte')
	? read(join(UI, 'SiteChrome.svelte'))
	: '';
const siteHeaderSrc = fileExists('src/lib/components/layout/SiteHeader.svelte')
	? read(join(WEB, 'src/lib/components/layout/SiteHeader.svelte'))
	: '';
const indexSrc = fileExists('src/lib/components/ui/index.ts')
	? read(join(UI, 'index.ts'))
	: '';

// 9 — siteNav groups
checks.push({
	id: '09-site-nav-groups',
	pass: /siteNav[\s\S]*id:\s*'do'/.test(siteNavSrc) &&
		/siteNav[\s\S]*id:\s*'explore'/.test(siteNavSrc) &&
		/siteNav[\s\S]*id:\s*'community'/.test(siteNavSrc),
	detail: 'siteNav has do, explore, community groups'
});

// 10 — pillar rows: flat list rows (not card boxes)
checks.push({
	id: '10-pillar-flat-rows',
	pass:
		navPillarSrc.includes('data-nav-pillar') &&
		navPillarSrc.includes('font-semibold') &&
		!navPillarSrc.includes('border border-border') &&
		!navPillarSrc.includes('shadow-sm'),
	detail: 'NavPillar flat rows: no per-item border/shadow card chrome'
});

checks.push({
	id: '11-pillar-icon-dividers',
	pass:
		navPillarSrc.includes('bg-accent-soft') &&
		read(join(UI, 'NavGroup.svelte')).includes('divide-y'),
	detail: 'NavPillar accent icon tile + NavGroup divide-y separators'
});

// 12 — motion + reduced motion
checks.push({
	id: '12-motion-import',
	pass: siteMenuSrc.includes("from 'motion'") && siteMenuSrc.includes('stagger'),
	detail: 'SiteMenu imports motion animate + stagger'
});

checks.push({
	id: '13-reduced-motion',
	pass: siteMenuSrc.includes('prefersReducedMotion'),
	detail: 'SiteMenu respects prefers-reduced-motion'
});

// 14 — forbidden generic white bar on SiteChrome
checks.push({
	id: '14-no-white-bar-only',
	pass: !siteChromeSrc.includes('bg-surface/95 backdrop-blur-md border-b') &&
		(siteChromeSrc.includes('accent-soft') || siteChromeSrc.includes('gradient')),
	detail: 'SiteChrome avoids generic bg-surface/95+border-b-only; uses warm gradient/floating bar'
});

// 15 — backdrop matches JoinClubModal recipe
checks.push({
	id: '15-backdrop-recipe',
	pass: siteMenuSrc.includes('color-mix') && siteMenuSrc.includes('55%'),
	detail: 'SiteMenu backdrop uses ink 55% color-mix + blur'
});

// 16 — ui exports
checks.push({
	id: '16-ui-exports',
	pass: indexSrc.includes('NavPillar') &&
		indexSrc.includes('SiteMenu') &&
		indexSrc.includes('SiteChrome'),
	detail: 'ui/index.ts exports NavPillar, SiteMenu, SiteChrome'
});

// 17 — WIRE GATE: SiteHeader wraps SiteChrome (STD-11 production header)
checks.push({
	id: '17-site-header-wired',
	pass:
		siteHeaderSrc.includes('SiteChrome') &&
		!siteHeaderSrc.includes('learnNavLinks') &&
		!siteHeaderSrc.includes('learn-nav'),
	detail: 'SiteHeader.svelte wraps SiteChrome; old learn-nav flat header removed'
});

// 18 — dev route mounts SiteChrome only
const devSrc = fileExists('src/routes/dev/site-chrome/+page.svelte')
	? read(join(WEB, 'src/routes/dev/site-chrome/+page.svelte'))
	: '';
checks.push({
	id: '18-dev-mounts-chrome',
	pass:
		/import[\s\S]*SiteChrome/.test(devSrc) &&
		!/<SiteHeader\b/.test(devSrc) &&
		!/import[\s\S]*SiteHeader/.test(devSrc),
	detail: 'dev/site-chrome imports and mounts SiteChrome, not SiteHeader'
});

// 21–24 — STD-11 Tier 2 desktop interaction + trigger styling (2026-06-28)
checks.push({
	id: '21-desktop-hover-open',
	pass:
		siteChromeSrc.includes('onmouseenter') &&
		siteChromeSrc.includes('scheduleCloseGroup') &&
		siteChromeSrc.includes('nav-group') &&
		!siteChromeSrc.includes('toggleGroup'),
	detail: 'SiteChrome desktop nav: hover-open on .nav-group, no click toggleGroup'
});

checks.push({
	id: '22-nav-text-triggers',
	pass:
		siteChromeSrc.includes('nav-item') &&
		siteChromeSrc.includes('variant="ghost"') &&
		!siteChromeSrc.includes('variant="soft"') &&
		siteChromeSrc.includes('chevron-down') &&
		siteChromeSrc.includes('aria-haspopup'),
	detail: 'Nav triggers: shared text-link nav-item class (not soft/button pills), chevron + aria-haspopup'
});

checks.push({
	id: '23-dropdown-anchor-parent',
	pass:
		siteChromeSrc.includes('dropdownAnchor="parent"') &&
		siteMenuSrc.includes("dropdownAnchor === 'parent'"),
	detail: 'SiteMenu dropdownAnchor=parent for gap-bridge positioning'
});

checks.push({
	id: '24-join-cta-primary',
	pass: siteChromeSrc.includes('variant="primary"') && siteChromeSrc.includes('Join — free'),
	detail: 'Desktop Join CTA: primary Button (only pill in nav bar)'
});

// 19 — lint:ds
try {
	run('npm run lint:ds', WEB);
	checks.push({ id: '19-lint-ds', pass: true, detail: 'npm run lint:ds exit 0' });
} catch (e) {
	checks.push({
		id: '19-lint-ds',
		pass: false,
		detail: `lint:ds failed: ${e instanceof Error ? e.message : String(e)}`
	});
}

// 20 — svelte-check on chrome files
try {
	run('npm run check', WEB);
	checks.push({ id: '20-check', pass: true, detail: 'npm run check exit 0' });
} catch (e) {
	checks.push({
		id: '20-check',
		pass: false,
		detail: `check failed: ${e instanceof Error ? e.message : String(e)}`
	});
}

const passed = checks.filter((c) => c.pass).length;
const total = checks.length;
const report = {
	spec: 'PAT-13',
	tier: 1,
	passed,
	total,
	pass: passed === total,
	checks,
	timestamp: new Date().toISOString()
};

mkdirSync(REPORT_DIR, { recursive: true });
writeFileSync(join(REPORT_DIR, 'site-chrome-eval.json'), JSON.stringify(report, null, 2));

if (JSON_OUT) {
	console.log(JSON.stringify(report, null, 2));
} else {
	console.log(`PAT-13 Tier 1: ${passed}/${total}${report.pass ? ' PASS' : ' FAIL'}\n`);
	for (const c of checks) {
		console.log(`  ${c.pass ? '✓' : '✗'} ${c.id}: ${c.detail}`);
	}
	console.log(`\nReport: web/scripts/reports/site-chrome-eval.json`);
}

process.exit(report.pass ? 0 : 1);
