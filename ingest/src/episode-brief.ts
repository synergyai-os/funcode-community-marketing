import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ChainCaptureManifest } from './chain-capture.types.js';
import type { ExtractionDraft } from './types.js';

const SLOT_LABELS: Record<string, string> = {
	'shift-old': 'The old way',
	'shift-new': 'The new way',
	'benefit-build': 'Build with AI',
	'benefit-playground': 'Playground',
	'benefit-free': 'Free community',
	'usecase-onboard': 'Getting started',
	'usecase-ladder': 'Engagement ladder',
	'usecase-audience': 'Who it\'s for',
	'usecase-faq': 'FAQ',
	'voice-leaders': 'Voice card'
};

function slotLabel(slot: string): string {
	const base = slot.split('|')[0]?.trim() ?? slot;
	return SLOT_LABELS[base] ?? base;
}

function verifyTag(id: string | undefined, pending = 'capture pending'): string {
	if (id) return `\`pb get ${id}\``;
	if (pending === 'capture pending') {
		return '_**BLOCKED:** run `npm run ingest -- reconcile --job <videoId> --wire` or `commit` — no chain-capture.json_';
	}
	return `_${pending}_`;
}

function funCodeLens(draft: ExtractionDraft): string {
	const slots = new Set([
		...draft.insights.map((i) => i.landingSlot),
		...draft.words.map((w) => w.landingSlot)
	]);
	const themes: string[] = [];
	if ([...slots].some((s) => s.includes('shift-new'))) {
		themes.push('how AI changes the way we build and ship');
	}
	if ([...slots].some((s) => s.includes('benefit-playground'))) {
		themes.push('Play Room culture — try things out loud, low stakes');
	}
	if ([...slots].some((s) => s.includes('usecase-audience') || s.includes('usecase-onboard'))) {
		themes.push('who wins in this world and how to start riding the wave');
	}
	if (themes.length === 0) {
		return draft.episode.summary;
	}
	return `${draft.episode.summary} For FunCode, the through-line is ${themes.join('; ')}.`;
}

export function writeChainCaptureManifest(jobPath: string, manifest: ChainCaptureManifest): string {
	const path = join(jobPath, 'chain-capture.json');
	writeFileSync(path, JSON.stringify(manifest, null, 2));
	return path;
}

export function loadChainCaptureManifest(jobPath: string): ChainCaptureManifest | undefined {
	const path = join(jobPath, 'chain-capture.json');
	if (!existsSync(path)) return undefined;
	return JSON.parse(readFileSync(path, 'utf8')) as ChainCaptureManifest;
}

export function generateEpisodeBrief(
	draft: ExtractionDraft,
	manifest: ChainCaptureManifest | undefined,
	sourceUrl: string
): string {
	const lines: string[] = [];
	const guest = draft.episode.guest;
	const title = draft.episode.title;

	lines.push(`# ${title}`);
	lines.push('');
	lines.push(`*${guest} · Lenny's Podcast · ${sourceUrl}*`);
	lines.push('');
	if (manifest) {
		lines.push(
			`Episode ${verifyTag(manifest.episodeIns)} · Guest ${verifyTag(manifest.guestLand)} · Show ${verifyTag(manifest.showLand, 'LAND-1')}`
		);
		lines.push('');
	}
	lines.push('## Why this episode matters for FunCode');
	lines.push('');
	lines.push(funCodeLens(draft));
	lines.push('');
	lines.push('---');
	lines.push('');
	lines.push('## What we learned');
	lines.push('');

	draft.insights.forEach((insight, i) => {
		const chainId = manifest?.insights.find((x) => x.title === insight.title)?.id
			?? manifest?.insights[i]?.id;
		lines.push(`### ${i + 1}. ${insight.title}`);
		lines.push('');
		lines.push(insight.description);
		lines.push('');
		lines.push(
			`**Verify:** ${verifyTag(chainId)} · *${slotLabel(insight.landingSlot)}*`
		);
		lines.push('');
		lines.push(`> ${insight.sourceExcerpt.trim()}`);
		lines.push('');
	});

	lines.push('---');
	lines.push('');
	lines.push('## In their words');
	lines.push('');
	lines.push('_Attributed quotes on Chain as WORD entries — verify before voice cards (QUE-5)._');
	lines.push('');

	draft.words.forEach((word, i) => {
		const chainId = manifest?.words.find((x) => x.label === word.label)?.id
			?? manifest?.words[i]?.id;
		const speaker = word.speakerHint && word.speakerHint !== 'unknown' ? word.speakerHint : guest;
		lines.push(`### “${word.label}” — ${speaker}`);
		lines.push('');
		lines.push(`> ${word.quote.trim()}`);
		lines.push('');
		lines.push(`**Verify:** ${verifyTag(chainId)} · *${slotLabel(word.landingSlot)}*`);
		lines.push('');
	});

	if (draft.glossaryTouches.length > 0) {
		lines.push('---');
		lines.push('');
		lines.push('## Glossary triage');
		lines.push('');
		const glossId = manifest?.glossaryIns;
		const touches = draft.glossaryTouches;
		const items = touches.map((t) =>
			typeof t === 'string' ? t : `**${t.term}** (${t.recommendedDisposition}) — ${t.dispositionRationale}`
		);
		lines.push(`Candidates (${touches.length}, max 3 per INS-48): ${items.join('; ')}.`);
		lines.push('');
		lines.push(`**Verify:** ${verifyTag(glossId)}`);
		lines.push('');
	}

	lines.push('---');
	lines.push('');
	lines.push('## Chain index');
	lines.push('');
	if (manifest) {
		const insIds = manifest.insights.map((x) => x.id).join(', ');
		const wordIds = manifest.words.map((x) => x.id).join(', ');
		lines.push(`| Role | IDs |`);
		lines.push(`|------|-----|`);
		lines.push(`| Episode | ${manifest.episodeIns} |`);
		if (manifest.guestLand) lines.push(`| Guest | ${manifest.guestLand} |`);
		lines.push(`| Learnings | ${insIds || '—'} |`);
		lines.push(`| WORDS | ${wordIds || '—'} |`);
		if (manifest.glossaryIns) lines.push(`| Glossary bucket | ${manifest.glossaryIns} |`);
	} else {
		lines.push('_**BLOCKED:** No `chain-capture.json` — run `npm run ingest -- reconcile --job <videoId> --wire` or `commit`, then re-run `brief`._');
	}
	lines.push('');
	lines.push(`*Prompt ${draft.promptVersion} · Source ${sourceUrl}*`);

	return lines.join('\n');
}

export function runEpisodeBrief(jobPath: string): void {
	const draftPath = join(jobPath, 'extraction-draft.json');
	if (!existsSync(draftPath)) {
		throw new Error(`Missing ${draftPath}`);
	}
	const draft = JSON.parse(readFileSync(draftPath, 'utf8')) as ExtractionDraft;
	const metaPath = join(jobPath, 'meta.json');
	const sourceUrl = existsSync(metaPath)
		? (JSON.parse(readFileSync(metaPath, 'utf8')) as { sourceUrl: string }).sourceUrl
		: '';
	const manifest = loadChainCaptureManifest(jobPath);
	const brief = generateEpisodeBrief(draft, manifest, sourceUrl);
	const outPath = join(jobPath, 'episode-brief.md');
	writeFileSync(outPath, brief);
	console.log(brief);
	console.log(`\n---\nWritten: ${outPath}`);
}
