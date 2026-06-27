<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { animate, type AnimationPlaybackControls, type AnimationOptions } from 'motion';
	import { prefersReducedMotion } from 'svelte/motion';

	type Variant = 'accent' | 'neutral';

	type Props = HTMLAttributes<HTMLSpanElement> & {
		variant?: Variant;
		/** A face for the chip — a single emoji that personifies this audience. */
		emoji: string;
		/** Position in the row; desyncs the ambient drift so chips never move in lockstep. */
		index?: number;
		/** Freeze the ambient float (e.g. a parent pause control). Hover-pause still works. */
		paused?: boolean;
		/** Scales how far the ambient float travels (1 = default). A "playfulness" dial. */
		amplitude?: number;
		/** Invitation CTA: hover sweep → "Join the club" → click opens join flow. */
		cta?: boolean;
		/** Fired when the CTA is clicked after the hover sweep completes. */
		onJoin?: () => void;
		children: Snippet;
	};

	let {
		variant = 'neutral',
		emoji,
		index = 0,
		paused = false,
		amplitude = 1,
		cta = false,
		onJoin,
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

	let el = $state<HTMLSpanElement | undefined>(undefined);
	let ctaPrimed = $state(false);
	let ctaSweeping = $state(false);
	let hoverAnim: AnimationPlaybackControls | null = null;

	const chipClass = $derived(cta ? '' : variants[variant]);

	// Magnetic lift: the chip leans toward the cursor and rises, on Motion springs
	// (DEC-29). Transform is Motion's channel; the CSS drift uses `translate:`, so the
	// two compose instead of fighting. Decorative only — gated on input + preference.
	const LEAN: AnimationOptions = { type: 'spring', stiffness: 280, damping: 13 };
	const REST: AnimationOptions = { type: 'spring', stiffness: 180, damping: 15 };
	const SWEEP: AnimationOptions = { duration: 4.8, ease: [0.22, 1, 0.36, 1] };
	const SWEEP_OUT: AnimationOptions = { duration: 2.2, ease: [0.4, 0, 1, 1] };

	function magnetize(event: PointerEvent) {
		if (cta || reducedMotion || !canAnimate || !el || event.pointerType === 'touch') return;
		const r = el.getBoundingClientRect();
		const dx = event.clientX - (r.left + r.width / 2);
		const dy = event.clientY - (r.top + r.height / 2);
		animate(el, { x: dx * 0.26, y: dy * 0.22, scale: 1.1, rotate: dx * 0.025 }, LEAN);
	}

	function release() {
		if (cta || !canAnimate || !el) return;
		animate(el, { x: 0, y: 0, scale: 1, rotate: 0 }, REST);
	}

	function resetSweep() {
		if (!el) return;
		el.style.setProperty('--sweep', '0%');
		ctaSweeping = false;
		ctaPrimed = false;
	}

	function settlePrimed() {
		if (!el) return;
		el.style.setProperty('--sweep', '100%');
		ctaPrimed = true;
		ctaSweeping = false;
	}

	function primeCta() {
		if (!cta || !el) return;
		if (reducedMotion || !canAnimate) {
			settlePrimed();
			return;
		}
		ctaPrimed = false;
		ctaSweeping = true;
		hoverAnim?.stop();
		el.style.setProperty('--sweep', '0%');

		// Sweep only — each label is clip-masked to its zone (red vs light).
		hoverAnim = animate(el, { '--sweep': '100%' }, { ...SWEEP, onComplete: settlePrimed });
	}

	function unprimeCta() {
		if (!cta || !el) return;
		hoverAnim?.stop();
		ctaPrimed = false;
		ctaSweeping = true;

		if (!canAnimate) {
			resetSweep();
			return;
		}

		hoverAnim = animate(el, { '--sweep': '0%' }, { ...SWEEP_OUT, onComplete: resetSweep });
	}

	function activateJoin(event: Event) {
		if (!cta || !ctaPrimed) return;
		event.preventDefault();
		event.stopPropagation();
		onJoin?.();
	}

	function onKeydown(event: KeyboardEvent) {
		if (!cta) return;
		if (event.key === 'Enter' || event.key === ' ') {
			if (!ctaPrimed) {
				event.preventDefault();
				primeCta();
				return;
			}
			activateJoin(event);
		}
		if (event.key === 'Escape') {
			unprimeCta();
		}
	}

	function onPointerLeave() {
		if (cta) unprimeCta();
		else release();
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<span
	bind:this={el}
	class={`audience-chip group inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-semibold tracking-wide whitespace-nowrap uppercase shadow-sm backdrop-blur transition-shadow duration-300 hover:shadow-card ${chipClass} ${cta ? 'audience-chip--cta' : ''} ${ctaPrimed ? 'audience-chip--primed' : ''} ${ctaSweeping ? 'audience-chip--sweeping' : ''} ${className}`}
	class:audience-chip--reverse={driftReversed}
	style={`--drift-dur:${driftDuration}s;--drift-delay:${driftDelay}s;--drift-amp:${amplitude};--sweep:0%${paused ? ';animation-play-state:paused' : ''}`}
	role={cta ? 'button' : undefined}
	tabindex={cta ? 0 : undefined}
	aria-label={cta ? (ctaPrimed ? 'Join the club' : '…and you — hover to join') : undefined}
	onpointerenter={primeCta}
	onpointerleave={onPointerLeave}
	onfocus={primeCta}
	onblur={unprimeCta}
	onclick={activateJoin}
	onkeydown={onKeydown}
	onpointermove={magnetize}
	onpointercancel={onPointerLeave}
	{...rest}
>
	<span
		class={`audience-chip__emoji text-lg leading-none motion-reduce:transition-none ${cta ? 'audience-chip__emoji--cta' : ''} ${cta ? '' : 'transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-150'}`}
		aria-hidden="true">{emoji}</span
	>
	<span class="audience-chip__label">
		{#if cta}
			<!-- Red zone (filled left): "Join the club" in white -->
			<span class="audience-chip__label-layer audience-chip__label-layer--join">
				Join the club
			</span>
			<!-- Light zone (unfilled right): "…and you" in accent -->
			<span class="audience-chip__label-layer audience-chip__label-layer--primary">
				{@render children()}
			</span>
		{:else}
			{@render children()}
		{/if}
	</span>
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

	/* ── CTA chip: gradient sweep via --sweep (Motion animates 0% → 100%) ───────
	   Each label is clip-masked to its zone — join on red (left), primary on light
	   (right). The moving edge is the only place both strings meet. */
	.audience-chip--cta {
		position: relative;
		cursor: pointer;
		justify-content: center;
		border-color: var(--color-accent-soft);
		background: var(--color-accent-soft);
		color: var(--color-accent-strong);
		min-width: 10.5rem;
	}

	.audience-chip--cta.audience-chip--sweeping {
		background: linear-gradient(
			90deg,
			var(--color-accent-strong) 0%,
			var(--color-accent-strong) var(--sweep, 0%),
			var(--color-accent-soft) var(--sweep, 0%)
		);
	}

	.audience-chip--cta.audience-chip--primed {
		border-color: var(--color-accent-strong);
		background: var(--color-accent-strong);
		box-shadow: var(--shadow-card);
	}

	.audience-chip--cta:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 3px;
	}

	.audience-chip__emoji {
		flex-shrink: 0;
		line-height: 1;
	}

	/* Emoji lives on the light zone until the sweep passes it */
	.audience-chip--sweeping .audience-chip__emoji--cta {
		clip-path: inset(0 0 0 var(--sweep, 0%));
	}

	.audience-chip__label {
		position: relative;
		z-index: 1;
		display: grid;
		place-items: center;
		min-width: 7.5rem;
	}

	.audience-chip__label-layer {
		grid-area: 1 / 1;
		width: 100%;
		text-align: center;
		line-height: 1.2;
	}

	/* Idle + light zone: accent text, hidden until sweep starts on the right */
	.audience-chip__label-layer--primary {
		color: var(--color-accent-strong);
	}

	.audience-chip--sweeping .audience-chip__label-layer--primary {
		clip-path: inset(0 0 0 var(--sweep, 0%));
	}

	/* Red zone: white text, hidden until sweep fills from the left */
	.audience-chip__label-layer--join {
		color: white;
		clip-path: inset(0 100% 0 0);
	}

	.audience-chip--sweeping .audience-chip__label-layer--join {
		clip-path: inset(0 calc(100% - var(--sweep, 0%)) 0 0);
	}

	.audience-chip--primed .audience-chip__label-layer--primary {
		clip-path: inset(0 0 0 100%);
	}

	.audience-chip--primed .audience-chip__label-layer--join {
		clip-path: inset(0 0 0 0);
	}

	@keyframes audience-drift {
		0% {
			translate: 0 0;
			rotate: 0deg;
		}
		20% {
			translate: calc(8px * var(--drift-amp, 1)) calc(-7px * var(--drift-amp, 1));
			rotate: calc(1.6deg * var(--drift-amp, 1));
		}
		50% {
			translate: calc(2px * var(--drift-amp, 1)) calc(-14px * var(--drift-amp, 1));
			rotate: calc(-0.6deg * var(--drift-amp, 1));
		}
		80% {
			translate: calc(-8px * var(--drift-amp, 1)) calc(-7px * var(--drift-amp, 1));
			rotate: calc(-1.6deg * var(--drift-amp, 1));
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
