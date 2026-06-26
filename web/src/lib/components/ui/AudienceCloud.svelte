<script lang="ts">
	import { onMount } from 'svelte';
	import { animate, type AnimationOptions } from 'motion';
	import { prefersReducedMotion } from 'svelte/motion';
	import AudienceChip from './AudienceChip.svelte';

	type Item = { emoji: string; label: string; you?: boolean };
	let { items, class: className = '' }: { items: Item[]; class?: string } = $props();

	// Curated scatter for a hero band: chips live in the left/right gutters and
	// corners so the centre column (headline + CTAs) stays clear. `depth` drives
	// size and parallax strength — chips further back read smaller and drift less,
	// giving a real sense of layers. Index maps 1:1 to items; extra items wrap.
	// Positions are tuned to label length: long labels sit inset (room to breathe),
	// short labels can hug the edges. Centre column (~18–82% on lg) stays clear.
	const SPOTS = [
		{ x: 9, y: 27, depth: 0.9 }, // Product managers
		{ x: 80, y: 16, depth: 1.04 }, // Designers who build now (longest → inset)
		{ x: 12, y: 62, depth: 1.0 }, // Founders (short)
		{ x: 91, y: 50, depth: 0.86 }, // Indie makers (short → far right)
		{ x: 16, y: 88, depth: 0.82 }, // Agent-curious engineers
		{ x: 82, y: 84, depth: 0.96 }, // Teams going faster
		{ x: 66, y: 93, depth: 1.1 } // …and you (accent)
	];
	const spot = (i: number) => SPOTS[i % SPOTS.length];

	const reduced = $derived(prefersReducedMotion.current);
	// jsdom/SSR have no Web Animations API — feature-detect so tests/SSR stay static.
	const canAnimate =
		typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';
	const willAnimate = $derived(canAnimate && !reduced);

	// Reveal targets (scale + opacity); parallax lives on the outer wrapper so the two
	// transforms never fight (INS-29: separate elements, separate channels).
	let revealEls: HTMLElement[] = [];

	// Normalised pointer offset from viewport centre, -1..1. rAF-throttled.
	let px = $state(0);
	let py = $state(0);
	let frame = 0;
	const MAX_SHIFT = 16; // px of parallax travel at depth 1

	function onPointerMove(event: PointerEvent) {
		if (reduced || frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			px = (event.clientX / window.innerWidth - 0.5) * 2;
			py = (event.clientY / window.innerHeight - 0.5) * 2;
		});
	}

	// Staggered spring entrance — the cloud assembles itself as the page lands.
	const ENTER: AnimationOptions = { type: 'spring', stiffness: 120, damping: 18 };

	onMount(() => {
		if (!willAnimate) return;
		revealEls.forEach((el, i) => {
			if (!el) return;
			animate(el, { opacity: 0, scale: 0.7 }, { duration: 0 });
			animate(el, { opacity: 1, scale: spot(i).depth }, { ...ENTER, delay: 0.15 + i * 0.07 });
		});
		window.addEventListener('pointermove', onPointerMove);
		return () => {
			if (frame) cancelAnimationFrame(frame);
			window.removeEventListener('pointermove', onPointerMove);
		};
	});
</script>

<!-- Decorative: the readable roll-call lives in the "Who it's for" section, so this
     ambient layer is hidden from assistive tech to avoid a duplicate reading. -->
<div class={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
	{#each items as item, i (item.label)}
		{@const s = spot(i)}
		<div
			class="absolute w-max"
			style={`left:${s.x}%;top:${s.y}%;transform:translate3d(calc(-50% + ${px * MAX_SHIFT * s.depth}px), calc(-50% + ${py * MAX_SHIFT * s.depth}px), 0)`}
		>
			<div bind:this={revealEls[i]} style={`scale:${willAnimate ? 1 : s.depth}`}>
				<AudienceChip
					class="pointer-events-auto"
					emoji={item.emoji}
					index={i}
					variant={item.you ? 'accent' : 'neutral'}
				>
					{item.label}
				</AudienceChip>
			</div>
		</div>
	{/each}
</div>
