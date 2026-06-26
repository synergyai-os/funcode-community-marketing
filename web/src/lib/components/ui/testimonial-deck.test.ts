import { describe, it, expect } from 'vitest';
import {
	nextIndex,
	prevIndex,
	clampIndex,
	resolveSwipe,
	dragTilt,
	fanRotation,
	slotLayout,
	STACK_GEOMETRY
} from './testimonial-deck';

describe('clampIndex', () => {
	it('keeps an in-range index unchanged', () => {
		expect(clampIndex(3, 1)).toBe(1);
	});

	it('clamps below zero up to zero', () => {
		expect(clampIndex(3, -2)).toBe(0);
	});

	it('clamps past the end down to the last index', () => {
		expect(clampIndex(3, 9)).toBe(2);
	});

	it('returns 0 for an empty deck', () => {
		expect(clampIndex(0, 5)).toBe(0);
	});
});

describe('nextIndex', () => {
	it('advances by one', () => {
		expect(nextIndex(3, 0)).toBe(1);
	});

	it('wraps to the first item after the last', () => {
		expect(nextIndex(3, 2)).toBe(0);
	});

	it('stays at 0 for a single-item deck', () => {
		expect(nextIndex(1, 0)).toBe(0);
	});

	it('returns 0 for an empty deck', () => {
		expect(nextIndex(0, 0)).toBe(0);
	});

	it('normalises an out-of-range index before advancing', () => {
		expect(nextIndex(3, 9)).toBe(0);
	});
});

describe('prevIndex', () => {
	it('steps back by one', () => {
		expect(prevIndex(3, 2)).toBe(1);
	});

	it('wraps to the last item before the first', () => {
		expect(prevIndex(3, 0)).toBe(2);
	});

	it('stays at 0 for a single-item deck', () => {
		expect(prevIndex(1, 0)).toBe(0);
	});

	it('returns 0 for an empty deck', () => {
		expect(prevIndex(0, 0)).toBe(0);
	});
});

describe('resolveSwipe', () => {
	const width = 300;

	it('commits to next on a confident leftward drag', () => {
		expect(resolveSwipe({ dx: -200, vx: 0, width })).toBe('next');
	});

	it('commits to prev on a confident rightward drag', () => {
		expect(resolveSwipe({ dx: 200, vx: 0, width })).toBe('prev');
	});

	it('snaps back when the drag is below threshold and slow', () => {
		expect(resolveSwipe({ dx: -20, vx: 0, width })).toBe('none');
	});

	it('commits to next on a fast leftward flick despite a small distance', () => {
		expect(resolveSwipe({ dx: -10, vx: -1.5, width })).toBe('next');
	});

	it('commits to prev on a fast rightward flick despite a small distance', () => {
		expect(resolveSwipe({ dx: 10, vx: 1.5, width })).toBe('prev');
	});

	it('respects a custom distance threshold', () => {
		expect(resolveSwipe({ dx: -100, vx: 0, width, threshold: 0.2 })).toBe('next');
		expect(resolveSwipe({ dx: -100, vx: 0, width, threshold: 0.9 })).toBe('none');
	});

	it('treats a still pointer as no swipe', () => {
		expect(resolveSwipe({ dx: 0, vx: 0, width })).toBe('none');
	});

	it('commits exactly at the distance threshold boundary', () => {
		expect(resolveSwipe({ dx: -width * 0.5, vx: 0, width })).toBe('next');
	});

	it('commits exactly at the velocity gate boundary', () => {
		expect(resolveSwipe({ dx: -1, vx: -0.5, width })).toBe('next');
	});

	it('respects a custom velocity gate', () => {
		expect(resolveSwipe({ dx: -1, vx: -0.4, width, velocity: 0.3 })).toBe('next');
		expect(resolveSwipe({ dx: -1, vx: -0.4, width, velocity: 0.9 })).toBe('none');
	});
});

describe('fanRotation', () => {
	it('keeps the front card flat', () => {
		expect(fanRotation(0)).toBe(0);
	});

	it('fans peeked cards to alternating sides', () => {
		expect(fanRotation(1)).toBe(-STACK_GEOMETRY.fanDeg);
		expect(fanRotation(2)).toBe(STACK_GEOMETRY.fanDeg);
	});
});

describe('slotLayout', () => {
	const depth = 3;

	it('places the front card flat at the origin', () => {
		const front = slotLayout(0, depth);
		expect(front.y).toBeCloseTo(0);
		expect(front.z).toBeCloseTo(0);
		expect(front.rotate).toBe(0);
	});

	it('lifts and recedes deeper cards by one step each', () => {
		expect(slotLayout(1, depth)).toEqual({
			y: -STACK_GEOMETRY.liftPx,
			z: -STACK_GEOMETRY.depthZ,
			rotate: fanRotation(1)
		});
	});

	it('caps cards beyond the visible depth at the back slot', () => {
		const maxDepth = depth - 1;
		const capped = {
			y: -maxDepth * STACK_GEOMETRY.liftPx,
			z: -maxDepth * STACK_GEOMETRY.depthZ,
			rotate: fanRotation(maxDepth)
		};
		expect(slotLayout(maxDepth, depth)).toEqual(capped);
		expect(slotLayout(maxDepth + 5, depth)).toEqual(capped);
	});
});

describe('dragTilt', () => {
	it('is flat at rest', () => {
		expect(dragTilt(0)).toBe(0);
	});

	it('tilts opposite directions for opposite drags', () => {
		expect(dragTilt(-80)).toBeCloseTo(-80 / STACK_GEOMETRY.dragRotationDivisor);
		expect(dragTilt(80)).toBeCloseTo(80 / STACK_GEOMETRY.dragRotationDivisor);
	});
});
