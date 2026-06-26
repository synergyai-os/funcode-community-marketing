import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import TestimonialDeck from './TestimonialDeck.svelte';

const items = [
	{ quote: 'First quote.', name: 'Ada Lovelace', role: 'Founder' },
	{ quote: 'Second quote.', name: 'Grace Hopper', role: 'Engineer' },
	{ quote: 'Third quote.', name: 'Alan Turing', role: 'Maker' }
];

/** The quote shown by the active (non-aria-hidden) card at rest. */
function activeQuote(container: HTMLElement): string {
	const card = container.querySelector('.deck-stage > div:not([aria-hidden])');
	return card?.querySelector('blockquote')?.textContent?.trim() ?? '';
}

/**
 * The active card swaps with a cross-transition, so the outgoing card lingers in
 * the DOM mid-animation; assert navigation through the single, synchronous
 * aria-live position counter instead of the transient card nodes.
 */
function positionLabel(): string {
	return screen.getByText(/^Testimonial \d+ of \d+$/).textContent?.trim() ?? '';
}

describe('TestimonialDeck', () => {
	it('renders the first testimonial as the active card on mount', () => {
		const { container } = render(TestimonialDeck, { props: { items } });
		expect(activeQuote(container)).toBe('First quote.');
		expect(positionLabel()).toBe('Testimonial 1 of 3');
	});

	it('advances to the next testimonial when Next is clicked', async () => {
		render(TestimonialDeck, { props: { items } });
		await fireEvent.click(screen.getByLabelText('Next testimonial'));
		expect(positionLabel()).toBe('Testimonial 2 of 3');
	});

	it('wraps from the last testimonial back to the first via Next', async () => {
		render(TestimonialDeck, { props: { items } });
		const next = screen.getByLabelText('Next testimonial');
		await fireEvent.click(next);
		await fireEvent.click(next);
		await fireEvent.click(next);
		expect(positionLabel()).toBe('Testimonial 1 of 3');
	});

	it('wraps to the last testimonial when Prev is clicked from the first', async () => {
		render(TestimonialDeck, { props: { items } });
		await fireEvent.click(screen.getByLabelText('Previous testimonial'));
		expect(positionLabel()).toBe('Testimonial 3 of 3');
	});

	it('navigates with ArrowRight and ArrowLeft when the group is focused', async () => {
		render(TestimonialDeck, { props: { items } });
		const group = screen.getByRole('group');
		await fireEvent.keyDown(group, { key: 'ArrowRight' });
		expect(positionLabel()).toBe('Testimonial 2 of 3');
		await fireEvent.keyDown(group, { key: 'ArrowLeft' });
		expect(positionLabel()).toBe('Testimonial 1 of 3');
	});

	it('hides the peeked background cards from assistive tech', () => {
		const { container } = render(TestimonialDeck, { props: { items } });
		const cards = container.querySelectorAll('.deck-stage > div');
		const hidden = container.querySelectorAll('.deck-stage > div[aria-hidden="true"]');
		expect(cards.length).toBe(3);
		expect(hidden.length).toBe(2);
	});

	it('renders nothing when there are no items', () => {
		const { container } = render(TestimonialDeck, { props: { items: [] } });
		expect(container.querySelector('[role="group"]')).toBeNull();
	});

	it('advances to the next card on a confident leftward drag', async () => {
		const { container } = render(TestimonialDeck, { props: { items } });
		const card = container.querySelector('.deck-stage > div:not([aria-hidden])') as HTMLElement;
		await fireEvent.pointerDown(card, { clientX: 300, pointerId: 1 });
		await fireEvent.pointerMove(card, { clientX: 60, pointerId: 1 });
		await fireEvent.pointerUp(card, { clientX: 60, pointerId: 1 });
		expect(positionLabel()).toBe('Testimonial 2 of 3');
	});

	it('snaps back without navigating on a small slow drag', async () => {
		const { container } = render(TestimonialDeck, { props: { items } });
		const card = container.querySelector('.deck-stage > div:not([aria-hidden])') as HTMLElement;
		// No pointermove → zero velocity, so this exercises the distance gate alone:
		// a 10px release is well under the threshold and must not navigate.
		await fireEvent.pointerDown(card, { clientX: 300, pointerId: 1 });
		await fireEvent.pointerUp(card, { clientX: 290, pointerId: 1 });
		expect(positionLabel()).toBe('Testimonial 1 of 3');
	});

	it('does not throw when a drag is cancelled', async () => {
		const { container } = render(TestimonialDeck, { props: { items } });
		const card = container.querySelector('.deck-stage > div:not([aria-hidden])') as HTMLElement;
		await fireEvent.pointerDown(card, { clientX: 300, pointerId: 1 });
		await expect(fireEvent.pointerCancel(card, { clientX: 300, pointerId: 1 })).resolves.toBe(true);
	});

	it('disables both arrows and shows a single card for a one-item deck', () => {
		const { container } = render(TestimonialDeck, { props: { items: [items[0]] } });
		expect(screen.getByLabelText('Previous testimonial')).toBeDisabled();
		expect(screen.getByLabelText('Next testimonial')).toBeDisabled();
		expect(container.querySelectorAll('.deck-stage > div').length).toBe(1);
		expect(container.querySelectorAll('.deck-stage > div[aria-hidden="true"]').length).toBe(0);
	});

	it('ignores keyboard navigation for a one-item deck', async () => {
		render(TestimonialDeck, { props: { items: [items[0]] } });
		await fireEvent.keyDown(screen.getByRole('group'), { key: 'ArrowRight' });
		expect(positionLabel()).toBe('Testimonial 1 of 1');
	});

	it('peeks exactly one background card for a two-item deck', () => {
		const { container } = render(TestimonialDeck, { props: { items: items.slice(0, 2) } });
		expect(container.querySelectorAll('.deck-stage > div').length).toBe(2);
		expect(container.querySelectorAll('.deck-stage > div[aria-hidden="true"]').length).toBe(1);
	});
});
