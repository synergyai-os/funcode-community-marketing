<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { animate, type AnimationOptions } from 'motion';
	import { prefersReducedMotion } from 'svelte/motion';

	type Variant = 'accent' | 'neutral';

	type Props = HTMLAttributes<HTMLSpanElement> & {
		variant?: Variant;
		/** A face for the chip — a single emoji that personifies this audience. */
		emoji: string;
		/** Position in the row; desyncs the ambient drift so chips never move in lockstep. */
		index?: number;
		children: Snippet;
	};

	let {
		variant = 'neutral',
		emoji,
		index = 0,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const variants: Record<Variant, string> = {
		accent: 'border-accent-soft bg-accent-soft text-accent-strong',
		neutral: 'border-neutral-200 bg-white text-ink-soft'
	};

	// Desynced, perpetual drift: each chip floats on its own clock so the row reads
	// like a small crowd milling about, not a marching band. Tuned per-index.
	const driftDuration = $derived(5 + (index % 4) * 0.7);
	const driftDelay = $derived(index * -1.3);
	const driftReversed = $derived(index % 2 === 1);

	const reducedMotion = $derived(prefersReducedMotion.current);
	// jsdom/SSR have no Web Animations API — feature-detect so tests/SSR stay static (INS-28).
	const canAnimate =
		typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';

	let el: HTMLSpanElement;

	// Magnetic lift: the chip leans toward the cursor and rises, on Motion springs
	// (DEC-29). Transform is Motion's channel; the CSS drift uses `translate:`, so the
	// two compose instead of fighting. Decorative only — gated on input + preference.
	const LEAN: AnimationOptions = { type: 'spring', stiffness: 280, damping: 13 };
	const REST: AnimationOptions = { type: 'spring', stiffness: 180, damping: 15 };

	function magnetize(event: PointerEvent) {
		if (reducedMotion || !canAnimate || event.pointerType === 'touch') return;
		const r = el.getBoundingClientRect();
		const dx = event.clientX - (r.left + r.width / 2);
		const dy = event.clientY - (r.top + r.height / 2);
		// Lean + lift + a touch of tilt toward the cursor, with a springy pop.
		animate(el, { x: dx * 0.26, y: dy * 0.22, scale: 1.1, rotate: dx * 0.025 }, LEAN);
	}

	function release() {
		if (!canAnimate) return;
		animate(el, { x: 0, y: 0, scale: 1, rotate: 0 }, REST);
	}
</script>

<span
	bind:this={el}
	class={`audience-chip group inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-semibold tracking-wide whitespace-nowrap uppercase shadow-sm backdrop-blur transition-shadow duration-300 hover:shadow-card ${variants[variant]} ${className}`}
	class:audience-chip--reverse={driftReversed}
	style={`--drift-dur:${driftDuration}s;--drift-delay:${driftDelay}s`}
	onpointermove={magnetize}
	onpointerleave={release}
	onpointercancel={release}
	{...rest}
>
	<span
		class="text-lg leading-none transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-150 motion-reduce:transition-none"
		aria-hidden="true">{emoji}</span
	>
	{@render children()}
</span>

<style>
	/* Ambient float on the `translate:` + `rotate:` longhands — separate channels from
	   `transform`, so Motion's magnetic lift and this perpetual float layer cleanly
	   (INS-29). Bob, sway and a gentle tilt make each chip read like a person buoyed in
	   place rather than a static pill. */
	.audience-chip {
		animation: audience-drift var(--drift-dur, 6s) ease-in-out var(--drift-delay, 0s) infinite;
		will-change: transform, translate, rotate;
	}

	.audience-chip--reverse {
		animation-direction: reverse;
	}

	/* Hold still under the cursor so the magnetic lean reads crisply. */
	.audience-chip:hover {
		animation-play-state: paused;
	}

	@keyframes audience-drift {
		0% {
			translate: 0 0;
			rotate: 0deg;
		}
		20% {
			translate: 8px -7px;
			rotate: 1.6deg;
		}
		50% {
			translate: 2px -14px;
			rotate: -0.6deg;
		}
		80% {
			translate: -8px -7px;
			rotate: -1.6deg;
		}
		100% {
			translate: 0 0;
			rotate: 0deg;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.audience-chip {
			animation: none;
		}
	}
</style>
