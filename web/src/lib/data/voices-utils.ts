import type { DeckItem } from '$lib/components/ui/testimonial-deck';
import type { PersonaId } from './personas.js';
import type { Voice } from './voices.js';
import { VOICE_SOURCE_LABEL } from './voices.js';
export function sourceLabelForUrl(sourceRef: string): string {
	if (/lennyspodcast|youtube\.com\/@LennysPodcast/i.test(sourceRef)) {
		return VOICE_SOURCE_LABEL;
	}
	if (/youtube\.com|youtu\.be/i.test(sourceRef)) {
		return 'Watch source';
	}
	return 'Source';
}

export type VoiceDeckMode = 'interleaved' | 'one-per-guest';

/**
 * Round-robin by guest so the deck alternates voices instead of five Fiona cards in a row.
 */
export function interleaveByGuest(all: Voice[]): Voice[] {
	const buckets = new Map<string, Voice[]>();
	for (const v of all) {
		const list = buckets.get(v.name) ?? [];
		list.push(v);
		buckets.set(v.name, list);
	}
	const names = [...buckets.keys()];
	if (names.length === 0) return [];

	const out: Voice[] = [];
	let depth = 0;
	while (out.length < all.length) {
		let pushed = false;
		for (const name of names) {
			const bucket = buckets.get(name)!;
			if (depth < bucket.length) {
				out.push(bucket[depth]!);
				pushed = true;
			}
		}
		if (!pushed) break;
		depth++;
	}
	return out;
}

/** First card per guest — compact homepage preview when list grows. */
export function onePerGuest(all: Voice[]): Voice[] {
	const seen = new Set<string>();
	const out: Voice[] = [];
	for (const v of all) {
		if (seen.has(v.name)) continue;
		seen.add(v.name);
		out.push(v);
	}
	return out;
}

export function orderVoicesForDeck(all: Voice[], mode: VoiceDeckMode = 'interleaved'): Voice[] {
	return mode === 'one-per-guest' ? onePerGuest(all) : interleaveByGuest(all);
}

export function voicesToDeckItems(
	all: Voice[],
	opts: { mode?: VoiceDeckMode; personaId?: PersonaId } = {}
): DeckItem[] {
	const { mode = 'interleaved', personaId } = opts;
	let list = all;
	if (personaId) {
		list = list.filter((v) => v.personaIds.includes(personaId));
	}
	list = orderVoicesForDeck(list, mode);

	return list.map((v) => ({
		quote: v.quote,
		name: v.name,
		role: v.role,
		sourceHref: v.sourceRef,
		sourceLabel: v.sourceLabel,
		variant: 'voice' as const
	}));
}
