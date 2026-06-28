import { describe, expect, it } from 'vitest';
import { landingSlotMatchesPersona } from './landing-slot-personas.js';
import { homepageShiftPair, newLaneForPersona } from './persona-insights.js';
import { lennyBatch } from './showcase/lenny-batch.generated.js';

describe('persona-insights', () => {
	it('homepage shift pair has old and new', () => {
		const pair = homepageShiftPair();
		expect(pair).not.toBeNull();
		expect(pair!.old.landingSlot).toBe('shift-old');
		expect(pair!.neu.landingSlot).toBe('shift-new');
	});

	it('batch data and persona slot mapping', () => {
		expect(lennyBatch.shiftNew.length).toBeGreaterThan(10);
		expect(landingSlotMatchesPersona('shift-new', 'founders')).toBe(true);
		expect(newLaneForPersona('founders', 1).length).toBeGreaterThan(0);
	});

	it('core personas get new-lane insights from Lenny batch', () => {
		const core = [
			'founders',
			'product-leaders',
			'product-managers',
			'indie-makers',
			'designers-who-build',
			'teams-going-faster'
		] as const;
		for (const id of core) {
			expect(newLaneForPersona(id, 1).length).toBeGreaterThan(0);
		}
	});
});
