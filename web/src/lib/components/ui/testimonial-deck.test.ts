import { describe, it, expect } from 'vitest';
import {
	nextIndex,
	prevIndex,
	clampIndex,
	resolveSwipe,
	depthTransform,
	dragTilt,
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

describe('depthTransform', () => {
	it('leaves the front card (depth 0) untouched', () => {
		expect(depthTransform(0)).toEqual({ translateY: 0, scale: 1, opacity: 1 });
	});

	it('lifts, shrinks and fades cards as depth grows', () => {
		const back = depthTransform(2);
		expect(back.translateY).toBe(2 * STACK_GEOMETRY.liftPx);
		expect(back.scale).toBeCloseTo(1 - 2 * STACK_GEOMETRY.scaleStep);
		expect(back.opacity).toBeCloseTo(1 - 2 * STACK_GEOMETRY.opacityStep);
	});

	it('interpolates smoothly at a fractional, spring-driven depth', () => {
		const mid = depthTransform(0.5);
		expect(mid.scale).toBeCloseTo(1 - 0.5 * STACK_GEOMETRY.scaleStep);
		expect(mid.opacity).toBeCloseTo(1 - 0.5 * STACK_GEOMETRY.opacityStep);
	});

	it('clamps scale and opacity to a physical range for deep stacks', () => {
		const deep = depthTransform(100);
		expect(deep.scale).toBe(0);
		expect(deep.opacity).toBe(0);
	});

	it('clamps opacity to 1 for an overshooting negative depth', () => {
		expect(depthTransform(-0.3).opacity).toBe(1);
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
