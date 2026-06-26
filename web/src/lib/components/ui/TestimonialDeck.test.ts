import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import TestimonialDeck from './TestimonialDeck.svelte';

const items = [
	{ quote: 'First quote.', name: 'Ada Lovelace', role: 'Founder' },
	{ quote: 'Second quote.', name: 'Grace Hopper', role: 'Engineer' },
	{ quote: 'Third quote.', name: 'Alan Turing', role: 'Maker' }
];

/** The quote shown by the active (non-aria-hidden) card. */
function activeQuote(container: HTMLElement): string {
	const card = container.querySelector('.deck-stack > div:not([aria-hidden])');
	return card?.querySelector('blockquote')?.textContent?.trim() ?? '';
}

describe('TestimonialDeck', () => {
	it('renders the first testimonial as the active card on mount', () => {
		const { container } = render(TestimonialDeck, { props: { items } });
		expect(activeQuote(container)).toBe('First quote.');
		expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
	});

	it('advances to the next testimonial when Next is clicked', async () => {
		const { container } = render(TestimonialDeck, { props: { items } });
		await fireEvent.click(screen.getByLabelText('Next testimonial'));
		expect(activeQuote(container)).toBe('Second quote.');
	});

	it('wraps from the last testimonial back to the first via Next', async () => {
		const { container } = render(TestimonialDeck, { props: { items } });
		const next = screen.getByLabelText('Next testimonial');
		await fireEvent.click(next);
		await fireEvent.click(next);
		await fireEvent.click(next);
		expect(activeQuote(container)).toBe('First quote.');
	});

	it('wraps to the last testimonial when Prev is clicked from the first', async () => {
		const { container } = render(TestimonialDeck, { props: { items } });
		await fireEvent.click(screen.getByLabelText('Previous testimonial'));
		expect(activeQuote(container)).toBe('Third quote.');
	});

	it('navigates with ArrowRight and ArrowLeft when the group is focused', async () => {
		const { container } = render(TestimonialDeck, { props: { items } });
		const group = screen.getByRole('group');
		await fireEvent.keyDown(group, { key: 'ArrowRight' });
		expect(activeQuote(container)).toBe('Second quote.');
		await fireEvent.keyDown(group, { key: 'ArrowLeft' });
		expect(activeQuote(container)).toBe('First quote.');
	});

	it('announces the active position in a polite live region and updates it', async () => {
		render(TestimonialDeck, { props: { items } });
		expect(screen.getByText('Testimonial 1 of 3')).toBeInTheDocument();
		await fireEvent.click(screen.getByLabelText('Next testimonial'));
		expect(screen.getByText('Testimonial 2 of 3')).toBeInTheDocument();
	});

	it('hides the peeked background cards from assistive tech', () => {
		const { container } = render(TestimonialDeck, { props: { items } });
		const cards = container.querySelectorAll('.deck-stack > div');
		const hidden = container.querySelectorAll('.deck-stack > div[aria-hidden="true"]');
		expect(cards.length).toBe(3);
		expect(hidden.length).toBe(2);
	});

	it('renders nothing when there are no items', () => {
		const { container } = render(TestimonialDeck, { props: { items: [] } });
		expect(container.querySelector('[role="group"]')).toBeNull();
	});

	it('advances to the next card on a confident leftward drag', async () => {
		const { container } = render(TestimonialDeck, { props: { items } });
		const card = container.querySelector('.deck-stack > div:not([aria-hidden])') as HTMLElement;
		await fireEvent.pointerDown(card, { clientX: 300, pointerId: 1 });
		await fireEvent.pointerMove(card, { clientX: 60, pointerId: 1 });
		await fireEvent.pointerUp(card, { clientX: 60, pointerId: 1 });
		expect(activeQuote(container)).toBe('Second quote.');
	});

	it('snaps back without navigating on a small slow drag', async () => {
		const { container } = render(TestimonialDeck, { props: { items } });
		const card = container.querySelector('.deck-stack > div:not([aria-hidden])') as HTMLElement;
		await fireEvent.pointerDown(card, { clientX: 300, pointerId: 1 });
		await fireEvent.pointerMove(card, { clientX: 290, pointerId: 1 });
		await fireEvent.pointerUp(card, { clientX: 290, pointerId: 1 });
		expect(activeQuote(container)).toBe('First quote.');
	});

	it('does not throw when a drag is cancelled', async () => {
		const { container } = render(TestimonialDeck, { props: { items } });
		const card = container.querySelector('.deck-stack > div:not([aria-hidden])') as HTMLElement;
		await fireEvent.pointerDown(card, { clientX: 300, pointerId: 1 });
		await expect(fireEvent.pointerCancel(card, { clientX: 300, pointerId: 1 })).resolves.toBe(true);
	});

	it('disables both arrows and shows a single card for a one-item deck', () => {
		const { container } = render(TestimonialDeck, { props: { items: [items[0]] } });
		expect(screen.getByLabelText('Previous testimonial')).toBeDisabled();
		expect(screen.getByLabelText('Next testimonial')).toBeDisabled();
		expect(container.querySelectorAll('.deck-stack > div').length).toBe(1);
		expect(container.querySelectorAll('.deck-stack > div[aria-hidden="true"]').length).toBe(0);
	});

	it('ignores keyboard navigation for a one-item deck', async () => {
		const { container } = render(TestimonialDeck, { props: { items: [items[0]] } });
		await fireEvent.keyDown(screen.getByRole('group'), { key: 'ArrowRight' });
		expect(activeQuote(container)).toBe('First quote.');
	});

	it('peeks exactly one background card for a two-item deck', () => {
		const { container } = render(TestimonialDeck, { props: { items: items.slice(0, 2) } });
		expect(container.querySelectorAll('.deck-stack > div').length).toBe(2);
		expect(container.querySelectorAll('.deck-stack > div[aria-hidden="true"]').length).toBe(1);
	});
});
