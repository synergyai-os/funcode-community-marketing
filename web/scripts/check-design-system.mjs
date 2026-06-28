#!/usr/bin/env node
/**
 * Design-system guard (FunCode BR-2, STD-1/2/3).
 *
 * Fails the build when UI code goes "bespoke" instead of deriving from the
 * design system. Catches what ESLint can't see (Tailwind class strings + CSS):
 *   - hardcoded hex colors outside the @theme token file
 *   - Tailwind arbitrary color utilities (e.g. bg-[#abc], text-[--x])
 *   - inline <svg> in components (icons must come via ~icons/lucide/* + Icon atom)
 *   - raw <button> outside the atom layer (use the Button atom)
 *   - Tailwind neutral-* palette classes (use @theme semantic tokens)
 *   - forbidden icon libraries (lucide-svelte, @iconify/svelte)
 *
 * Genuine gaps are not silenced here — they are resolved by UPDATING the design
 * system with the Product Design role (ROL-2), per BR-2.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = fileURLToPath(new URL('../src', import.meta.url));

/** Files/areas allowed to contain otherwise-flagged content. */
const THEME_FILE = `routes${sep}layout.css`; // the @theme token source of truth
const ATOM_DIR = `lib${sep}components${sep}ui${sep}`; // the atom layer
const DATA_DIR = `lib${sep}data${sep}`; // ingested/generated content (not UI styling)

const SCAN_EXT = /\.(svelte|css|ts)$/;

/** @type {Array<{file:string,line:number,rule:string,msg:string}>} */
const violations = [];

const rules = [
	{
		id: 'no-hardcoded-hex',
		ext: /\.(svelte|css|ts)$/,
		test: /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/,
		allow: (rel) => rel.endsWith(THEME_FILE) || rel.includes(DATA_DIR),
		msg: 'Hardcoded hex color. Define it as a token in src/routes/layout.css @theme and use the utility (STD-1).'
	},
	{
		id: 'no-arbitrary-color',
		ext: /\.(svelte|css|ts)$/,
		test: /\b(?:bg|text|border|ring|ring-offset|fill|stroke|from|via|to|decoration|outline|caret|accent|shadow)-\[/,
		allow: () => false,
		msg: 'Arbitrary Tailwind value for a themed property. Use a design token, not an inline value (STD-1).'
	},
	{
		// Case-sensitive: lowercase = raw HTML element, Capitalized = Svelte component (allowed).
		id: 'no-inline-svg',
		ext: /\.svelte$/,
		test: /<svg[\s>]/,
		allow: () => false,
		msg: 'Inline <svg>. Import icons via ~icons/lucide/* and render through the Icon atom (STD-2).'
	},
	{
		// Case-sensitive: matches raw <button>, not the <Button> atom.
		id: 'no-raw-button',
		ext: /\.svelte$/,
		test: /<button[\s>]/,
		allow: (rel) => rel.includes(ATOM_DIR),
		msg: 'Raw <button>. Compose the Button atom instead of a re-styled element (STD-3).'
	},
	{
		id: 'no-neutral-palette',
		ext: /\.(svelte|css|ts)$/,
		test: /\b(?:bg|text|border|ring|ring-offset|fill|stroke|from|via|to|decoration|outline|caret|accent|shadow)-neutral-/,
		allow: () => false,
		msg: 'Tailwind neutral-* palette class. Use semantic @theme tokens (surface, border, muted, etc.) per STD-1.'
	},
	{
		id: 'no-forbidden-icon-lib',
		ext: /\.(svelte|ts)$/,
		test: /(?:from\s+['"]lucide-svelte|from\s+['"]@iconify\/svelte)/,
		allow: () => false,
		msg: 'Forbidden icon import. Use ~icons/lucide/* build-time imports per STD-2.'
	},
	{
		id: 'no-hardcoded-rgb',
		ext: /\.(svelte|css)$/,
		test: /\brgb\s*\(/,
		allow: (rel) => rel.endsWith(THEME_FILE),
		msg: 'Hardcoded rgb() color. Define it as a token in layout.css @theme and use the utility (STD-1).'
	}
];

function walk(dir) {
	for (const name of readdirSync(dir)) {
		const full = join(dir, name);
		const s = statSync(full);
		if (s.isDirectory()) walk(full);
		else if (SCAN_EXT.test(name)) scan(full);
	}
}

function scan(file) {
	const rel = relative(SRC, file);
	const lines = readFileSync(file, 'utf8').split('\n');
	for (const rule of rules) {
		if (!rule.ext.test(file) || rule.allow(rel)) continue;
		lines.forEach((line, i) => {
			if (rule.test.test(line)) {
				violations.push({ file: rel, line: i + 1, rule: rule.id, msg: rule.msg });
			}
		});
	}
}

walk(SRC);

if (violations.length > 0) {
	console.error(
		`\n✖ Design-system guard failed (${violations.length} issue(s)) — BR-2: derive or update, never bespoke.\n`
	);
	for (const v of violations) {
		console.error(`  src/${v.file}:${v.line}  [${v.rule}]\n    ${v.msg}`);
	}
	console.error(
		'\nFix by reusing the design system, or update it with Product Design (ROL-2). See DEC-11, STD-1/2/3.\n'
	);
	process.exit(1);
}

console.log('✓ Design-system guard passed — UI derives from the design system (BR-2).');
