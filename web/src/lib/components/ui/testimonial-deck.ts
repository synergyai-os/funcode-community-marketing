/**
 * Pure navigation logic for {@link TestimonialDeck.svelte}.
 *
 * Kept framework-free so deck behaviour is unit-testable without mounting a
 * component or simulating drag physics.
 */

/** A single testimonial rendered by the deck. */
export type DeckItem = { quote: string; name: string; role: string };

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

/**
 * Stack geometry — the magnitudes that shape the physical card stack. The deck
 * is rendered in a real 3D space (CSS `perspective` + `preserve-3d`), so depth
 * is expressed as a `translateZ` recede rather than a fake scale: a card sent to
 * the back travels *through* the others and is occluded by them, like a real
 * card dealt to the bottom. These are runtime transform values (px / deg), not
 * themable design tokens, so they live here rather than in Tailwind `@theme`.
 */
export const STACK_GEOMETRY = {
	/** Vertical peek per depth step, in px — cards behind rise so their top edge shows. */
	liftPx: 16,
	/** 3D recede per depth step, in px — perspective shrinks + occludes deeper cards. */
	depthZ: 84,
	/** Resting fan per depth step, in degrees — a tidy, barely-there splay. */
	fanDeg: 2,
	/** Extra lift per depth step on hover, in px — the deck "opens" to reveal the stack. */
	hoverSpreadPx: 9,
	/** Fan multiplier on hover — the splay widens so each story reads as its own card. */
	hoverFanScale: 3,
	/** Larger divisor = gentler tilt while dragging. */
	dragRotationDivisor: 40
} as const;

/**
 * Fan rotation (degrees) for a card at a given stack slot. The front card sits
 * flat; peeked cards alternate left/right so the deck spreads symmetrically.
 */
export function fanRotation(offset: number): number {
	if (offset <= 0) return 0;
	return (offset % 2 === 1 ? -1 : 1) * STACK_GEOMETRY.fanDeg;
}

/** The resting 3D transform of a card at `slot`, used as the spring target. */
export type SlotLayout = { y: number; z: number; rotate: number };

/**
 * Resting transform for a card at a given stack slot. Slots deeper than
 * `visibleDepth - 1` pile at the back slot (so a large deck still reads as a
 * tidy few-card stack). `y` lifts peeked cards up so their top edge shows, `z`
 * recedes them into the 3D stage, and `rotate` gives the gentle fan.
 */
export function slotLayout(slot: number, visibleDepth: number): SlotLayout {
	const maxDepth = Math.max(visibleDepth - 1, 0);
	const depth = Math.min(Math.max(slot, 0), maxDepth);
	return {
		y: -depth * STACK_GEOMETRY.liftPx,
		z: -depth * STACK_GEOMETRY.depthZ,
		rotate: fanRotation(depth)
	};
}

/** Tilt (degrees) for the active card dragged `x` px horizontally. */
export function dragTilt(x: number): number {
	return x / STACK_GEOMETRY.dragRotationDivisor;
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
