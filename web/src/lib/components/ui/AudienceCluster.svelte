<script lang="ts">
	import { onMount } from 'svelte';
	import { animate, type AnimationOptions } from 'motion';
	import { prefersReducedMotion } from 'svelte/motion';
	import AudienceChip from './AudienceChip.svelte';

	type Item = { emoji: string; label: string; you?: boolean };
	type Variant = 'rows' | 'scatter';
	type Layer = 'front' | 'behind';

	type Props = {
		items: Item[];
		/**
		 * `rows` — a tidy two-row cluster in normal flow (great on phones).
		 * `scatter` — chips float around and through the headline, some in front of
		 * the text and some behind it, with pointer parallax (needs a `relative`
		 * headline stage as its positioned parent).
		 */
		variant?: Variant;
		/** 0 = calm, 1 = lively. One dial over float amplitude, resting tilt and parallax. */
		playfulness?: number;
		/** Freeze the ambient float. Bindable so an external control can toggle it. */
		paused?: boolean;
		class?: string;
	};

	let {
		items,
		variant = 'rows',
		playfulness = 0.7,
		paused = $bindable(false),
		class: className = ''
	}: Props = $props();

	const reducedMotion = $derived(prefersReducedMotion.current);
	// jsdom/SSR have no Web Animations API — feature-detect so tests/SSR stay static (INS-28).
	const canAnimate =
		typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';
	const willAnimate = $derived(canAnimate && !reducedMotion);

	// Playfulness fans out into the concrete dials the layers consume.
	const chipAmplitude = $derived(0.5 + playfulness); // float travel (×) per chip
	const tiltScale = $derived(0.4 + playfulness * 0.8); // resting-pose tilt strength
	const maxShift = $derived(12 + playfulness * 26); // px of pointer parallax at depth 1

	// ── Drag-to-toss + spring snap-back (shared by both variants) ───────────────
	// Each chip can be grabbed, flung, and springs home. Mirrors the TestimonialDeck
	// pointer pattern (DEC-29). The drag transform lives on its own wrapper, separate
	// from the chip's float and the pose tilt — three channels, no fight (INS-29).
	let dragEls: HTMLElement[] = [];
	let activeIndex = $state(-1);
	const SNAP: AnimationOptions = { type: 'spring', stiffness: 300, damping: 17 };
	// Transient drag origins keyed by chip index (plain record — not reactive state).
	const drag: Record<number, { startX: number; startY: number }> = {};

	function onPointerDown(gi: number, event: PointerEvent) {
		if (!canAnimate) return;
		drag[gi] = { startX: event.clientX, startY: event.clientY };
		activeIndex = gi;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}

	function onPointerMove(gi: number, event: PointerEvent) {
		const start = drag[gi];
		if (!start) return;
		const dx = event.clientX - start.startX;
		const dy = event.clientY - start.startY;
		animate(
			dragEls[gi],
			{ x: dx, y: dy, scale: 1.08, rotate: Math.max(-12, Math.min(12, dx * 0.05)) },
			{ duration: 0 }
		);
	}

	function onPointerUp(gi: number, event: PointerEvent) {
		if (!(gi in drag)) return;
		delete drag[gi];
		const el = event.currentTarget as HTMLElement;
		if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
		animate(
			dragEls[gi],
			{ x: 0, y: 0, scale: 1, rotate: 0 },
			reducedMotion ? { duration: 0 } : SNAP
		);
		if (activeIndex === gi) activeIndex = -1;
	}

	// ── ROWS variant — two playful lines, in normal flow ────────────────────────
	const mid = $derived(Math.ceil(items.length / 2));
	const rows = $derived([
		items.slice(0, mid).map((it, i) => ({ it, gi: i })),
		items.slice(mid).map((it, i) => ({ it, gi: mid + i }))
	]);
	const ROW_ROTATE = [-3, 2.5, -2, 3, -2.5, 2, 0];
	const ROW_LIFT = [8, -6, 7, -9, 6, -7, 0];
	const rowRotate = (gi: number, accent: boolean) =>
		accent ? 0 : ROW_ROTATE[gi % ROW_ROTATE.length] * tiltScale;
	const rowLift = (gi: number, accent: boolean) =>
		accent ? 0 : ROW_LIFT[gi % ROW_LIFT.length] * tiltScale;

	// ── SCATTER variant — chips weave through the headline ──────────────────────
	// PRECISION PLACEMENT: every chip is positioned by its CENTRE, given as a pixel
	// offset (dx, dy) from the headline stage's TOP-CENTRE. Because the headline is
	// centred, these offsets stay true across all lg+ widths (only the centre moves
	// with the viewport). To steer a chip, edit its dx/dy. `rotate` is its resting
	// tilt, `layer` puts it in front of (z 20) or behind (z 0) the text, and `depth`
	// drives both size and parallax strength (further = smaller + calmer).
	//
	// Reference grid, measured against the centred headline (px from stage top-centre):
	//   L1 "Everyone can create." → cy 36,  spans dx −365…365
	//   L2 "Learn how to"          → cy 108, spans dx −220…220
	//   L3 "build with AI."        → cy 180, spans dx −226…201  ("b" starts at dx −226)
	//   the subhead begins at dy ≈ 256, so keep chips above ~235.
	// "…and you" anchors its right edge on that "b" so it reads "…and you build with AI".
	type Spot = { dx: number; dy: number; rotate: number; depth: number; layer: Layer };
	const SPOTS: Spot[] = [
		{ dx: -296, dy: -34, rotate: -4, depth: 0.95, layer: 'front' }, // 0 Product managers — above L1, flanks badge left
		{ dx: 326, dy: -40, rotate: 3, depth: 1.0, layer: 'front' }, // 1 Designers who build now — above L1, flanks badge right
		{ dx: -298, dy: 104, rotate: -3, depth: 0.85, layer: 'behind' }, // 2 Founders — behind, L2 left gutter
		{ dx: 300, dy: 96, rotate: 3, depth: 0.84, layer: 'behind' }, // 3 Indie makers — behind, L2 right gutter
		{ dx: 345, dy: 180, rotate: 3, depth: 0.98, layer: 'front' }, // 4 Agent-curious engineers — L3 right gutter
		{ dx: 20, dy: 233, rotate: -3, depth: 0.85, layer: 'front' }, // 5 Teams going faster — low centre, under L3
		{ dx: -312, dy: 180, rotate: -2, depth: 1.08, layer: 'front' } // 6 …and you — L3 left, into "build"
	];
	const spot = (i: number) => SPOTS[i % SPOTS.length];

	// Normalised pointer offset from viewport centre, -1..1, rAF-throttled.
	let px = $state(0);
	let py = $state(0);
	let frame = 0;

	function onParallax(event: PointerEvent) {
		if (reducedMotion || frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			px = (event.clientX / window.innerWidth - 0.5) * 2;
			py = (event.clientY / window.innerHeight - 0.5) * 2;
		});
	}

	// Centre the chip on (dx, dy) from the stage top-centre, add pointer parallax,
	// then apply its resting tilt (scaled by playfulness).
	function scatterTransform(i: number): string {
		const s = spot(i);
		const sx = px * maxShift * s.depth;
		const sy = py * maxShift * s.depth;
		return `translate(calc(-50% + ${s.dx + sx}px), calc(-50% + ${s.dy + sy}px)) rotate(${s.rotate * tiltScale}deg)`;
	}

	// Staggered spring entrance — the scatter pops into place chip by chip on arrival.
	const ENTER: AnimationOptions = { type: 'spring', stiffness: 150, damping: 13 };
	let revealEls: HTMLElement[] = [];

	onMount(() => {
		if (variant !== 'scatter') return;
		if (willAnimate) {
			revealEls.forEach((el, i) => {
				if (!el) return;
				animate(el, { opacity: 0, scale: 0.5 }, { duration: 0 });
				animate(el, { opacity: 1, scale: spot(i).depth }, { ...ENTER, delay: 0.2 + i * 0.08 });
			});
			window.addEventListener('pointermove', onParallax);
		}
		return () => {
			if (frame) cancelAnimationFrame(frame);
			window.removeEventListener('pointermove', onParallax);
		};
	});
</script>

{#if variant === 'scatter'}
	<!-- Decorative twin of the readable roll-call in the "Built for product people"
	     section, so this layered flourish is hidden from assistive tech. Drag is a
	     pointer-only delight; nothing here is keyboard- or AT-dependent. -->
	<div class={`scatter ${className}`} aria-hidden="true">
		{#each items as item, i (item.label)}
			{@const s = spot(i)}
			{@const accent = item.you ?? false}
			<div
				class="scatter__anchor"
				style={`left:50%;top:0;z-index:${activeIndex === i ? 40 : s.layer === 'behind' ? 0 : 20};transform:${scatterTransform(i)}`}
			>
				<div bind:this={revealEls[i]} style={`scale:${willAnimate ? 1 : s.depth};opacity:1`}>
					<!-- Drag wrapper (Motion channel), inside an aria-hidden cluster — no role needed. -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						bind:this={dragEls[i]}
						class="scatter__drag"
						class:is-active={activeIndex === i}
						onpointerdown={(e) => onPointerDown(i, e)}
						onpointermove={(e) => onPointerMove(i, e)}
						onpointerup={(e) => onPointerUp(i, e)}
						onpointercancel={(e) => onPointerUp(i, e)}
					>
						<AudienceChip
							emoji={item.emoji}
							index={i}
							variant={accent ? 'accent' : 'neutral'}
							amplitude={chipAmplitude * s.depth}
							{paused}
						>
							{item.label}
						</AudienceChip>
					</div>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<!-- Decorative twin of the readable roll-call; drag is a pointer-only flourish.
	     Layout uses Tailwind utilities (not scoped `display`) so responsive display
	     toggles like `lg:hidden` from the caller win the cascade. -->
	<div class={`flex flex-col items-center gap-3 ${className}`} aria-hidden="true">
		{#each rows as row, r (r)}
			<div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
				{#each row as { it, gi } (it.label)}
					{@const accent = it.you ?? false}
					<div
						class="cluster__pose"
						class:is-active={activeIndex === gi}
						style={`transform:rotate(${rowRotate(gi, accent)}deg) translateY(${rowLift(gi, accent)}px)`}
					>
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							bind:this={dragEls[gi]}
							class="cluster__drag"
							onpointerdown={(e) => onPointerDown(gi, e)}
							onpointermove={(e) => onPointerMove(gi, e)}
							onpointerup={(e) => onPointerUp(gi, e)}
							onpointercancel={(e) => onPointerUp(gi, e)}
						>
							<AudienceChip
								emoji={it.emoji}
								index={gi}
								variant={accent ? 'accent' : 'neutral'}
								amplitude={chipAmplitude}
								{paused}
							>
								{it.label}
							</AudienceChip>
						</div>
					</div>
				{/each}
			</div>
		{/each}
	</div>
{/if}

<style>
	/* ── Scatter ──────────────────────────────────────────────────────────────
	   Fills its positioned parent (the headline stage). The container itself sets
	   no z-index, so each chip's own z-index layers it relative to the headline
	   (front: 20, behind: 0; the H1 sits at 10). */
	.scatter {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.scatter__anchor {
		position: absolute;
		width: max-content;
	}

	/* The grab surface. `touch-action: pan-y` is deliberate (INS-73): the chips span
	   almost the full width on phones, so claiming all gestures (touch-action:none)
	   trapped vertical scroll and made the page feel broken on mobile. pan-y lets the
	   browser keep vertical scrolling while we still get the horizontal drag-to-toss. */
	.scatter__drag,
	.cluster__drag {
		pointer-events: auto;
		cursor: grab;
		touch-action: pan-y;
		will-change: transform;
	}

	.scatter__drag:active,
	.cluster__drag:active {
		cursor: grabbing;
	}

	/* ── Rows ─────────────────────────────────────────────────────────────────── */
	.cluster__pose {
		position: relative;
		z-index: 1;
	}

	/* The chip you're holding floats above its neighbours (scatter raises its
	   anchor's z-index inline; rows toggle it here). */
	.cluster__pose.is-active {
		z-index: 40;
	}
</style>
