<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { animate, type AnimationOptions } from 'motion';
	import { prefersReducedMotion } from 'svelte/motion';
	import { canUseWebAnimations } from '$lib/motion/capabilities';
	import AudienceJoinChip from './AudienceJoinChip.svelte';

	type Variant = 'accent' | 'neutral';

	type Props = HTMLAttributes<HTMLSpanElement> & {
		variant?: Variant;
		emoji: string;
		index?: number;
		paused?: boolean;
		amplitude?: number;
		cta?: boolean;
		onJoin?: () => void;
		dragging?: boolean;
		suppressClick?: boolean;
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
		dragging = false,
		suppressClick = false,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const variants: Record<Variant, string> = {
		accent: 'border-accent-soft bg-accent-soft text-accent-strong',
		neutral: 'border-neutral-200 bg-white text-ink-soft'
	};

	const driftDuration = $derived(5 + (index % 4) * 0.7);
	const driftDelay = $derived(index * -1.3);
	const driftReversed = $derived(index % 2 === 1);

	const reducedMotion = $derived(prefersReducedMotion.current);
	const canAnimate = canUseWebAnimations();

	let el = $state<HTMLSpanElement | undefined>(undefined);

	const LEAN: AnimationOptions = { type: 'spring', stiffness: 280, damping: 13 };
	const REST: AnimationOptions = { type: 'spring', stiffness: 180, damping: 15 };

	function magnetize(event: PointerEvent) {
		if (reducedMotion || !canAnimate || !el || event.pointerType === 'touch') return;
		const r = el.getBoundingClientRect();
		const dx = event.clientX - (r.left + r.width / 2);
		const dy = event.clientY - (r.top + r.height / 2);
		animate(el, { x: dx * 0.26, y: dy * 0.22, scale: 1.1, rotate: dx * 0.025 }, LEAN);
	}

	function release() {
		if (!canAnimate || !el) return;
		animate(el, { x: 0, y: 0, scale: 1, rotate: 0 }, REST);
	}
</script>

{#if cta}
	<AudienceJoinChip {emoji} {onJoin} {dragging} {suppressClick} class={className} {...rest}>
		{@render children()}
	</AudienceJoinChip>
{:else}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<span
		bind:this={el}
		class={`audience-chip group inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-semibold tracking-wide uppercase shadow-sm backdrop-blur transition-shadow duration-300 hover:shadow-card ${variants[variant]} ${className}`}
		class:audience-chip--reverse={driftReversed}
		style={`--drift-dur:${driftDuration}s;--drift-delay:${driftDelay}s;--drift-amp:${amplitude}${paused ? ';animation-play-state:paused' : ''}`}
		onpointerleave={release}
		onpointermove={magnetize}
		onpointercancel={release}
		{...rest}
	>
		<span
			class="audience-chip__emoji text-lg leading-none transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-150 motion-reduce:transition-none"
			aria-hidden="true">{emoji}</span
		>
		{@render children()}
	</span>
{/if}

<style>
	.audience-chip {
		animation: audience-drift var(--drift-dur, 6s) ease-in-out var(--drift-delay, 0s) infinite;
		will-change: transform, translate, rotate;
	}

	.audience-chip--reverse {
		animation-direction: reverse;
	}

	.audience-chip:hover {
		animation-play-state: paused;
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
