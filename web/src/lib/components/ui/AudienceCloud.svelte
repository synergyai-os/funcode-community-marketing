<script lang="ts">
	import { onMount } from 'svelte';
	import { animate, type AnimationOptions } from 'motion';
	import { prefersReducedMotion } from 'svelte/motion';
	import AudienceChip from './AudienceChip.svelte';

	type Item = { emoji: string; label: string; you?: boolean };
	let { items, class: className = '' }: { items: Item[]; class?: string } = $props();

	// Edge-anchored scatter for the hero's outer gutters. Two ideas keep it
	// collision-free at any width (this layer is 2xl-only — below that the gutters
	// can't hold six big chips, so the marquee carries the audience instead):
	//   1. Chips anchor to the viewport EDGE (left: / right:), so they hug the
	//      gutter and never drift inward as the window widens.
	//   2. Placement is LENGTH-AWARE by band. The centred column is tall and wide at
	//      the headline (y24–54, ~320px gutter at 2xl) but narrow at the paragraph
	//      (y58–70, ~432px gutter): long labels live beside the paragraph, short
	//      ones flank the headline, medium ones sit by the CTAs — measured, not guessed.
	// `depth` drives size + parallax strength for a real sense of layers.
	type Side = 'left' | 'right' | 'center';
	type Spot = { side: Side; x: number; y: number; depth: number };
	const SPOTS: Spot[] = [
		{ side: 'left', x: 3, y: 80, depth: 0.95 }, // 0 Product managers (med) — by CTAs
		{ side: 'right', x: 3, y: 64, depth: 1.0 }, // 1 Designers who build now (long) — by paragraph
		{ side: 'left', x: 4, y: 33, depth: 0.9 }, // 2 Founders (short) — flanks headline
		{ side: 'right', x: 4, y: 30, depth: 0.86 }, // 3 Indie makers (short) — flanks headline
		{ side: 'left', x: 3, y: 66, depth: 1.0 }, // 4 Agent-curious engineers (long) — by paragraph
		{ side: 'right', x: 3, y: 80, depth: 0.97 }, // 5 Teams going faster (med) — by CTAs
		{ side: 'center', x: 50, y: 94, depth: 1.12 } // 6 …and you (accent) — bottom centre
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
	const MAX_SHIFT = 24; // px of parallax travel at depth 1

	function onPointerMove(event: PointerEvent) {
		if (reduced || frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			px = (event.clientX / window.innerWidth - 0.5) * 2;
			py = (event.clientY / window.innerHeight - 0.5) * 2;
		});
	}

	// Outer-wrapper transform: edge offset + parallax. `center` chips also recentre
	// horizontally (-50%); edge chips anchor flush to their gutter.
	function transform(s: Spot): string {
		const sx = px * MAX_SHIFT * s.depth;
		const sy = py * MAX_SHIFT * s.depth;
		const x = s.side === 'center' ? `calc(-50% + ${sx}px)` : `${sx}px`;
		return `translate3d(${x}, calc(-50% + ${sy}px), 0)`;
	}

	// Staggered spring entrance with a little overshoot — the cloud pops into place,
	// chip by chip, as the page lands rather than simply fading in.
	const ENTER: AnimationOptions = { type: 'spring', stiffness: 150, damping: 12 };

	onMount(() => {
		if (!willAnimate) return;
		revealEls.forEach((el, i) => {
			if (!el) return;
			animate(el, { opacity: 0, scale: 0.5 }, { duration: 0 });
			animate(el, { opacity: 1, scale: spot(i).depth }, { ...ENTER, delay: 0.2 + i * 0.09 });
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
			style={`${s.side === 'right' ? 'right' : 'left'}:${s.x}%;top:${s.y}%;transform:${transform(s)}`}
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
