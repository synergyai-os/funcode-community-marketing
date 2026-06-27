import { describe, expect, it } from 'vitest';
import { heroAudienceChips, personaBySlug, personas } from './personas';
	import { displayVoices, publishedVoices, voiceCountsByPersona, voices, voicesForPersona } from './voices';

describe('personas', () => {
	it('includes product-leaders for strategic voice coverage', () => {
		expect(personas.some((p) => p.id === 'product-leaders')).toBe(true);
	});

	it('hero chips end with the invitation CTA', () => {
		const chips = heroAudienceChips();
		expect(chips.at(-1)?.you).toBe(true);
		expect(chips.filter((c) => !c.you).length).toBe(personas.length);
	});

	it('resolves persona by slug for routes', () => {
		expect(personaBySlug('founders')?.label).toBe('Founders');
		expect(personaBySlug('not-a-persona')).toBeUndefined();
	});
});

describe('voices', () => {
	it('tags every voice to at least one persona', () => {
		for (const v of voices) {
			expect(v.personaIds.length).toBeGreaterThan(0);
		}
	});

	it('gives each persona at least two cards (expanded list quality gate)', () => {
		const counts = voiceCountsByPersona();
		for (const [id, count] of Object.entries(counts)) {
			expect(count, `persona ${id}`).toBeGreaterThanOrEqual(2);
		}
	});

	it('filters by persona', () => {
		const pm = voicesForPersona('product-managers');
		expect(pm.length).toBeGreaterThan(0);
		expect(pm.every((v) => v.personaIds.includes('product-managers'))).toBe(true);
	});

	it('hides unpublished voices in production display', () => {
		expect(publishedVoices()).toEqual([]);
		expect(voices.every((v) => v.published === false)).toBe(true);
	});

	it('marks staged voices ready for QUE-5 publish flip', () => {
		expect(voices.every((v) => v.staged === true)).toBe(true);
	});
});
