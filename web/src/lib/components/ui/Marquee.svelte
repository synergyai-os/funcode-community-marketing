<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Button from './Button.svelte';
	import IconPause from '~icons/lucide/pause';
	import IconPlay from '~icons/lucide/play';

	export type MarqueeSpeed = 'default' | 'relaxed';

	type Props = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		/** Seconds for one full loop — overrides `speed` when set. */
		duration?: number;
		/** Token-backed preset from layout.css @theme (`--marquee-duration-*`). */
		speed?: MarqueeSpeed;
	};

	let {
		children,
		duration,
		speed = 'default',
		class: className = '',
		'aria-label': ariaLabel = 'Scrolling content',
		...rest
	}: Props = $props();

	let paused = $state(false);

	const durationCss = $derived(
		duration !== undefined
			? `${duration}s`
			: speed === 'relaxed'
				? 'var(--marquee-duration-relaxed)'
				: 'var(--marquee-duration-default)'
	);
</script>

<!--
	Infinite, accessible marquee. Renders the children twice so the track can
	loop seamlessly; the duplicate is hidden from assistive tech.

	Accessibility:
	- An explicit pause/resume control (Button atom) satisfies WCAG 2.2.2 —
	  motion does not run indefinitely without a way to stop it.
	- Hover also pauses as a progressive enhancement.
	- When the user prefers reduced motion the track becomes a keyboard-operable
	  horizontal scroll region (tabindex, role, aria-label, focus ring) per
	  WCAG 2.1.1, and the edge mask is dropped so nothing is visually clipped.
-->
<div class={`marquee ${className}`} {...rest}>
	<!--
		Intentionally focusable: in reduced-motion mode this becomes a horizontal
		scroll region that keyboard users must be able to focus to scroll (WCAG
		2.1.1). A labelled scrollable group is the WAI-ARIA-sanctioned pattern, so
		the noninteractive-tabindex heuristic is a false positive here.
	-->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class="marquee__viewport"
		class:is-paused={paused}
		style={`--marquee-duration:${durationCss}`}
		tabindex="0"
		role="group"
		aria-label={ariaLabel}
	>
		<div class="marquee__track">
			<div class="marquee__group">{@render children()}</div>
			<div class="marquee__group" aria-hidden="true">{@render children()}</div>
		</div>
	</div>

	<div class="marquee__controls">
		<Button variant="secondary" size="sm" aria-pressed={paused} onclick={() => (paused = !paused)}>
			{#snippet leading()}
				{#if paused}
					<IconPlay class="size-4" aria-hidden="true" />
				{:else}
					<IconPause class="size-4" aria-hidden="true" />
				{/if}
			{/snippet}
			{paused ? 'Resume' : 'Pause'}
		</Button>
	</div>
</div>

<style>
	.marquee {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.marquee__viewport {
		overflow: hidden;
		border-radius: var(--radius-card);
		-webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
		mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
	}

	.marquee__viewport:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.marquee__track {
		display: flex;
		width: max-content;
		gap: 1.5rem;
		animation: marquee-scroll var(--marquee-duration, 40s) linear infinite;
	}

	.marquee__group {
		display: flex;
		gap: 1.5rem;
	}

	.marquee__viewport:hover .marquee__track,
	.marquee__viewport.is-paused .marquee__track {
		animation-play-state: paused;
	}

	.marquee__controls {
		display: flex;
		justify-content: center;
	}

	@keyframes marquee-scroll {
		from {
			transform: translateX(0);
		}
		to {
			/* Shift exactly one group (half the track) plus half the inter-group gap. */
			transform: translateX(calc(-50% - 0.75rem));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee__viewport {
			overflow-x: auto;
			-webkit-mask-image: none;
			mask-image: none;
		}
		.marquee__track {
			animation: none;
		}
		.marquee__group[aria-hidden='true'] {
			display: none;
		}
		/* Motion isn't running, so the pause control has nothing to control. */
		.marquee__controls {
			display: none;
		}
	}
</style>
