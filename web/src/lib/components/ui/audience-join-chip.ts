import type { AnimationOptions } from 'motion';

export const JOIN_CHIP_LABEL = 'Join the club';

export const JOIN_CHIP_EMOJI_SLOT = '1.125rem';

export const JOIN_CHIP_GROW: AnimationOptions = {
	duration: 1.4,
	ease: [0.22, 1, 0.36, 1]
};

export const JOIN_CHIP_SHRINK: AnimationOptions = {
	duration: 0.8,
	ease: [0.4, 0, 1, 1]
};

export const JOIN_CHIP_VARS = {
	slotIn: JOIN_CHIP_EMOJI_SLOT,
	slotOut: '0rem',
	opacityIn: 1,
	opacityOut: 0,
	sweepStart: '0%',
	sweepEnd: '100%'
} as const;

/** Scale duration by how much of the grow/shrink path remains (0–1). */
export function joinChipDuration(base: AnimationOptions, remaining: number): AnimationOptions {
	const duration =
		typeof base.duration === 'number' ? base.duration * Math.max(0.08, remaining) : base.duration;
	return { ...base, duration };
}

export function parseSweepPercent(value: string): number {
	const n = parseFloat(value);
	return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}
