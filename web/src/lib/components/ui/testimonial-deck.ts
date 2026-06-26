/**
 * Pure navigation logic for {@link TestimonialDeck.svelte}.
 *
 * Kept framework-free so deck behaviour is unit-testable without mounting a
 * component or simulating drag physics.
 */

/** Constrain an index to the deck's bounds; an empty deck resolves to 0. */
export function clampIndex(count: number, index: number): number {
	if (count <= 0) return 0;
	return Math.min(Math.max(index, 0), count - 1);
}

/** The next index, wrapping from the last item back to the first. */
export function nextIndex(count: number, index: number): number {
	if (count <= 0) return 0;
	return (clampIndex(count, index) + 1) % count;
}

/** The previous index, wrapping from the first item back to the last. */
export function prevIndex(count: number, index: number): number {
	if (count <= 0) return 0;
	return (clampIndex(count, index) + count - 1) % count;
}

export type SwipeOutcome = 'next' | 'prev' | 'none';

export type SwipeInput = {
	/** Horizontal travel in px (negative = leftward). */
	dx: number;
	/** Horizontal velocity in px/ms at release (negative = leftward). */
	vx: number;
	/** Card width in px, used to scale the distance threshold. */
	width: number;
	/** Fraction of `width` the drag must cross to commit. Defaults to 0.5. */
	threshold?: number;
	/** Velocity in px/ms that commits a swipe regardless of distance. Defaults to 0.5. */
	velocity?: number;
};

/**
 * Tinder-style swipe resolution. A confident leftward throw advances to the
 * next card; rightward returns to the previous one. A drag that crosses
 * neither the distance nor velocity gate snaps back (`'none'`).
 */
export function resolveSwipe({
	dx,
	vx,
	width,
	threshold = 0.5,
	velocity = 0.5
}: SwipeInput): SwipeOutcome {
	const distanceCommitted = Math.abs(dx) >= threshold * width;
	const velocityCommitted = Math.abs(vx) >= velocity;
	if (!distanceCommitted && !velocityCommitted) return 'none';

	// Distance is the primary signal; fall back to velocity for fast flicks.
	const direction = distanceCommitted ? Math.sign(dx) : Math.sign(vx);
	if (direction === 0) return 'none';
	return direction < 0 ? 'next' : 'prev';
}
