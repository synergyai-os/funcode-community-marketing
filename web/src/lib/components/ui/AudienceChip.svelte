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
	const driftDuration = $derived(6.5 + (index % 4) * 0.8);
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
	const LEAN: AnimationOptions = { type: 'spring', stiffness: 220, damping: 16 };
	const REST: AnimationOptions = { type: 'spring', stiffness: 160, damping: 18 };

	function magnetize(event: PointerEvent) {
		if (reducedMotion || !canAnimate || event.pointerType === 'touch') return;
		const r = el.getBoundingClientRect();
		const dx = event.clientX - (r.left + r.width / 2);
		const dy = event.clientY - (r.top + r.height / 2);
		animate(el, { x: dx * 0.2, y: dy * 0.2, scale: 1.06 }, LEAN);
	}

	function release() {
		if (!canAnimate) return;
		animate(el, { x: 0, y: 0, scale: 1 }, REST);
	}
</script>

<span
	bind:this={el}
	class={`audience-chip group inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-semibold tracking-wide uppercase shadow-sm backdrop-blur transition-shadow duration-300 hover:shadow-card ${variants[variant]} ${className}`}
	class:audience-chip--reverse={driftReversed}
	style={`--drift-dur:${driftDuration}s;--drift-delay:${driftDelay}s`}
	onpointermove={magnetize}
	onpointerleave={release}
	onpointercancel={release}
	{...rest}
>
	<span
		class="text-lg leading-none transition-transform duration-300 group-hover:scale-125 motion-reduce:transition-none"
		aria-hidden="true">{emoji}</span
	>
	{@render children()}
</span>

<style>
	/* Ambient drift on the `translate:` longhand — a separate channel from `transform`,
	   so Motion's magnetic lift and this perpetual float layer cleanly (INS-28). The
	   elliptical path makes chips appear to circle one another like a team. */
	.audience-chip {
		animation: audience-drift var(--drift-dur, 7s) ease-in-out var(--drift-delay, 0s) infinite;
		will-change: transform, translate;
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
		}
		25% {
			translate: 5px -4px;
		}
		50% {
			translate: 0 -8px;
		}
		75% {
			translate: -5px -4px;
		}
		100% {
			translate: 0 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.audience-chip {
			animation: none;
		}
	}
</style>
