import { describe, expect, it } from 'vitest';
import type { Voice } from './voices';
import {
	interleaveByGuest,
	onePerGuest,
	orderVoicesForDeck,
	sourceLabelForUrl,
	voicesToDeckItems
} from './voices-utils';

const sample = (name: string, id: string): Voice => ({
	id,
	quote: `Quote from ${name}`,
	name,
	role: 'Role',
	sourceLabel: "On Lenny's Podcast",
	personaIds: ['founders'],
	chainId: 'INS-1',
	sourceRef: 'https://www.youtube.com/watch?v=abc',
	published: false,
	staged: true
});

describe('voices-utils', () => {
	it('interleaves by guest name', () => {
		const all = [
			sample('A', 'a1'),
			sample('A', 'a2'),
			sample('B', 'b1'),
			sample('B', 'b2')
		];
		const ordered = interleaveByGuest(all).map((v) => v.id);
		expect(ordered).toEqual(['a1', 'b1', 'a2', 'b2']);
	});

	it('picks one card per guest', () => {
		const all = [sample('A', 'a1'), sample('A', 'a2'), sample('B', 'b1')];
		expect(onePerGuest(all).map((v) => v.id)).toEqual(['a1', 'b1']);
	});

	it('labels Lenny YouTube sources', () => {
		expect(sourceLabelForUrl('https://www.youtube.com/@LennysPodcast/watch?v=x')).toBe(
			"On Lenny's Podcast"
		);
		expect(sourceLabelForUrl('https://www.youtube.com/watch?v=x')).toBe('Watch source');
	});

	it('maps voice cards to deck items with source traceability', () => {
		const items = voicesToDeckItems([sample('A', 'a1')]);
		expect(items[0]?.variant).toBe('voice');
		expect(items[0]?.sourceHref).toContain('youtube.com');
		expect(items[0]?.sourceLabel).toBeDefined();
	});

	it('orders homepage deck one-per-guest by default path', () => {
		const all = [sample('A', 'a1'), sample('A', 'a2'), sample('B', 'b1')];
		const items = voicesToDeckItems(all, { mode: 'one-per-guest' });
		expect(items).toHaveLength(2);
	});

	it('filters by persona when ordering', () => {
		const v: Voice = { ...sample('A', 'a1'), personaIds: ['product-managers'] };
		const items = voicesToDeckItems([v], { personaId: 'founders' });
		expect(items).toHaveLength(0);
	});

	it('orderVoicesForDeck respects mode', () => {
		const all = [sample('A', 'a1'), sample('A', 'a2')];
		expect(orderVoicesForDeck(all, 'one-per-guest')).toHaveLength(1);
		expect(orderVoicesForDeck(all, 'interleaved')).toHaveLength(2);
	});
});
