import { describe, it, expect } from 'vitest';
import { published, testimonials, type Quote } from './testimonials';

const consented: Quote = {
	quote: 'Real one.',
	name: 'Ada Lovelace',
	role: 'Founder',
	consent: true
};
const placeholder: Quote = { quote: 'Sample.', name: 'Stand In', role: 'Maker', consent: false };

describe('published', () => {
	it('returns only consented quotes', () => {
		expect(published([consented, placeholder])).toEqual([consented]);
	});

	it('returns an empty list when nothing is consented', () => {
		expect(published([placeholder])).toEqual([]);
	});

	it('never exposes the unconsented placeholder testimonials (TEN-5/BR-3 gate)', () => {
		expect(published(testimonials)).toEqual([]);
		expect(testimonials.every((q) => q.consent === false)).toBe(true);
	});
});
