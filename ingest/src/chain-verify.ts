import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ChainCaptureManifest } from './chain-capture.types.js';
import { entryRelatesTo, pbGetEntry, pbWhoami, type PbEntry } from './pb-json.js';
import type { ExtractionDraft } from './types.js';

export type VerifyCheck = {
	name: string;
	pass: boolean;
	detail?: string;
};

export type VerifyReport = {
	videoId: string;
	passed: boolean;
	checkedAt: string;
	checks: VerifyCheck[];
};

function check(name: string, pass: boolean, detail?: string): VerifyCheck {
	return { name, pass, detail };
}

function verifyEntryExists(id: string): { check: VerifyCheck; entry?: PbEntry } {
	try {
		const entry = pbGetEntry(id);
		return {
			check: check(`Entry ${id} resolves`, true, entry.name?.slice(0, 80)),
			entry
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return { check: check(`Entry ${id} resolves`, false, message) };
	}
}

function verifyRelations(
	label: string,
	entry: PbEntry,
	required: string[]
): VerifyCheck {
	const missing = required.filter((id) => !entryRelatesTo(entry, id));
	return check(
		`${label} relations`,
		missing.length === 0,
		missing.length === 0 ? `linked to ${required.join(', ')}` : `missing: ${missing.join(', ')}`
	);
}

export function parseVerifyArgs(argv: string[]): { job: string } {
	let job = '';
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === '--job' && argv[i + 1]) {
			job = argv[++i]!;
		} else if (a === '--help' || a === '-h') {
			console.log(`Usage: npm run ingest -- verify --job <videoId>

PAT-10 stage 6: verify Chain captures match chain-capture.json manifest.
Exits 0 when all checks pass, 1 otherwise. Writes verify-report.json to the job dir.`);
			process.exit(0);
		}
	}
	if (!job) {
		throw new Error('Missing --job. Example: npm run ingest -- verify --job BD3vLtWhT5A');
	}
	return { job };
}

export function runChainVerify(jobPath: string): VerifyReport {
	const manifestPath = join(jobPath, 'chain-capture.json');
	if (!existsSync(manifestPath)) {
		throw new Error(`Missing ${manifestPath} — run commit first.`);
	}

	const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as ChainCaptureManifest;
	const draftPath = join(jobPath, 'extraction-draft.json');
	const draft = existsSync(draftPath)
		? (JSON.parse(readFileSync(draftPath, 'utf8')) as ExtractionDraft)
		: undefined;

	const checks: VerifyCheck[] = [];

	const whoami = pbWhoami();
	checks.push(
		check(
			'Workspace',
			whoami.workspace === 'FunCode' && whoami.profile === 'funcode',
			`${whoami.workspace}/${whoami.profile}`
		)
	);

	checks.push(
		check(
			'Manifest videoId',
			typeof manifest.videoId === 'string' && manifest.videoId.length === 11,
			manifest.videoId
		)
	);

	if (draft) {
		checks.push(
			check(
				'Insight count matches draft',
				manifest.insights.length === draft.insights.length,
				`manifest ${manifest.insights.length}, draft ${draft.insights.length}`
			)
		);
		checks.push(
			check(
				'Insight count in PAT-7 range',
				draft.insights.length >= 5 && draft.insights.length <= 7,
				String(draft.insights.length)
			)
		);
		checks.push(
			check(
				'WORDS count matches draft',
				manifest.words.length === draft.words.length,
				`manifest ${manifest.words.length}, draft ${draft.words.length}`
			)
		);
		const expectedGlossary = (draft.glossaryTouches?.length ?? 0) > 0;
		checks.push(
			check(
				'Glossary bucket presence',
				expectedGlossary ? Boolean(manifest.glossaryIns) : true,
				expectedGlossary
					? manifest.glossaryIns ?? 'missing glossaryIns'
					: 'no candidates in draft'
			)
		);
	}

	const episodeResult = verifyEntryExists(manifest.episodeIns);
	checks.push(episodeResult.check);
	if (episodeResult.entry) {
		const episode = episodeResult.entry;
		checks.push(
			check(
				'Episode sourceRef',
				Boolean(episode.sourceRef?.includes(manifest.videoId)),
				episode.sourceRef ?? 'none'
			)
		);
		const episodeRels = [manifest.showLand ?? 'LAND-1', manifest.guestLand, 'WP-1'].filter(
			(id): id is string => Boolean(id)
		);
		checks.push(verifyRelations(`Episode ${manifest.episodeIns}`, episode, episodeRels));
	}

	if (manifest.guestLand) {
		const guestResult = verifyEntryExists(manifest.guestLand);
		checks.push(guestResult.check);
		if (guestResult.entry) {
			checks.push(
				verifyRelations(`Guest ${manifest.guestLand}`, guestResult.entry, [
					manifest.showLand ?? 'LAND-1',
					'WP-1'
				])
			);
			checks.push(
				check(
					'Guest sourceRef',
					Boolean(guestResult.entry.sourceRef?.includes(manifest.videoId)),
					guestResult.entry.sourceRef ?? 'none'
				)
			);
		}
	}

	for (const ins of manifest.insights) {
		const result = verifyEntryExists(ins.id);
		checks.push(result.check);
		if (result.entry) {
			const required = [manifest.episodeIns, manifest.guestLand, 'WP-1'].filter(
				(id): id is string => Boolean(id)
			);
			checks.push(verifyRelations(`Insight ${ins.id}`, result.entry, required));
			checks.push(
				check(
					`Insight title match (${ins.id})`,
					result.entry.name === ins.title,
					result.entry.name
				)
			);
		}
	}

	for (const word of manifest.words) {
		const result = verifyEntryExists(word.id);
		checks.push(result.check);
		if (result.entry) {
			const required = ['GLO-11', manifest.episodeIns, manifest.guestLand].filter(
				(id): id is string => Boolean(id)
			);
			checks.push(verifyRelations(`WORD ${word.id}`, result.entry, required));
		}
	}

	if (manifest.glossaryIns) {
		const glossResult = verifyEntryExists(manifest.glossaryIns);
		checks.push(glossResult.check);
		if (glossResult.entry) {
			checks.push(
				verifyRelations(`Glossary ${manifest.glossaryIns}`, glossResult.entry, [
					manifest.episodeIns,
					manifest.guestLand ?? '',
					'INS-48'
				].filter(Boolean))
			);
		}
	}

	const report: VerifyReport = {
		videoId: manifest.videoId,
		passed: checks.every((c) => c.pass),
		checkedAt: new Date().toISOString(),
		checks
	};

	const reportPath = join(jobPath, 'verify-report.json');
	writeFileSync(reportPath, JSON.stringify(report, null, 2));

	return report;
}

export function printVerifyReport(report: VerifyReport): void {
	console.log(`\n--- Chain verify (PAT-10) — ${report.videoId} ---\n`);
	for (const c of report.checks) {
		const icon = c.pass ? '✓' : '✗';
		const detail = c.detail ? ` — ${c.detail}` : '';
		console.log(`${icon} ${c.name}${detail}`);
	}
	console.log(
		report.passed
			? `\nAll ${report.checks.length} checks passed.`
			: `\nFAILED: ${report.checks.filter((c) => !c.pass).length} of ${report.checks.length} checks.`
	);
}
