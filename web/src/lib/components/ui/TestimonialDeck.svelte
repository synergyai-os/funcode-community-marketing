<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { animate, type AnimationOptions } from 'motion';
	import { prefersReducedMotion } from 'svelte/motion';
	import Button from './Button.svelte';
	import Testimonial from './Testimonial.svelte';
	import {
		nextIndex,
		prevIndex,
		resolveSwipe,
		dragTilt,
		slotLayout,
		STACK_GEOMETRY,
		type DeckItem
	} from './testimonial-deck';
	import IconChevronLeft from '~icons/lucide/chevron-left';
	import IconChevronRight from '~icons/lucide/chevron-right';

	let { items, class: className = '' }: { items: DeckItem[]; class?: string } = $props();

	const count = $derived(items.length);
	const dots = $derived(items.map((_, i) => i));
	// How many cards read as distinct layers; deeper cards pile at the back slot.
	const visibleDepth = $derived(Math.min(count, 3));

	let index = $state(0);
	// Live horizontal drag offset (px) of the front card.
	let dragX = $state(0);
	let dragging = $state(false);
	// Hover "opens" the deck so the stack of stories is legible (mouse only).
	let hovering = $state(false);
	// Direction of the last navigation: +1 deals the top card to the back, -1
	// lifts a card from the back up to the front.
	let navDir = 1;
	// Horizontal offset the dealt card starts its fly-out from — the release point
	// on a swipe (so the throw continues), or 0 on a click/keyboard deal.
	let dealFromX = 0;
	// Release speed (px/ms) of a swipe-commit — a hard flick throws farther/faster.
	// 0 for a click or keyboard deal (a calm, default-paced deal).
	let dealVelocity = 0;

	const reducedMotion = $derived(prefersReducedMotion.current);

	/** A card's position relative to the front: 0 = front (readable), 1.. = behind. */
	function slotOf(itemIndex: number): number {
		return (itemIndex - index + count) % count;
	}

	// ── Motion choreography ────────────────────────────────────────────────────
	// We hand the card transforms to Motion (motion.dev): the stack settles with
	// spring physics and the dealt card follows a keyframed arc — lift toward the
	// viewer, then tuck back down under the deck. Navigation *state* (index) stays
	// synchronous, so a11y, reduced-motion and tests never depend on the animation.

	/** Card element refs, indexed to match `items`. */
	let cardEls: HTMLElement[] = [];
	/** Lift-shadow layer refs, one per card — opacity/scale only (compositor-cheap). */
	let shadowEls: HTMLElement[] = [];
	let stageEl: HTMLDivElement | undefined = $state();
	let mounted = false;

	// jsdom/SSR have no Web Animations API; fall back to instant transforms there.
	const canAnimate =
		typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';

	type Target = { x: number; y: number; z: number; rotate: number };

	/** Resting transform for the card currently in `slot` (with hover + drag). */
	function restTarget(slot: number): Target {
		const base = slotLayout(slot, visibleDepth);
		const depth = Math.min(slot, visibleDepth - 1);
		const front = slot === 0;
		const open = hovering ? 1 : 0;
		return {
			x: front ? dragX : 0,
			y: base.y - open * depth * STACK_GEOMETRY.hoverSpreadPx - (front && hovering ? 12 : 0),
			z: base.z,
			rotate:
				base.rotate * (hovering ? STACK_GEOMETRY.hoverFanScale : 1) + (front ? dragTilt(dragX) : 0)
		};
	}

	function toTransform(t: Target): string {
		return `translate3d(${t.x}px, ${t.y}px, ${t.z}px) rotate(${t.rotate}deg)`;
	}

	// Stacking is decided by real depth (translateZ) in the preserve-3d stage — the
	// browser sorts cards by their Z every frame, so the dealt card slides over the
	// deck and sinks under it continuously, with no z-index snap. No z-index is set.

	// The cards that aren't dealt settle gently into their new slot — a calm,
	// no-overshoot move so the revealed card never "pops".
	const PROMOTE: AnimationOptions = { type: 'spring', stiffness: 110, damping: 22 };
	// The dealer move, in three beats so the depth change never z-fights with the
	// deck: (1) slide out to the side, (2) change depth *while off to the side* (no
	// overlap → no flicker), (3) return to centre already at the new depth. Every
	// keyframe boundary lands at ~zero velocity, so it reads as one fluid motion.
	const DEAL_MS = 1200;
	const DEAL_TIMES = [0, 0.34, 0.66, 1];
	const DEAL_FWD: AnimationOptions = {
		duration: DEAL_MS / 1000,
		times: DEAL_TIMES,
		ease: ['easeOut', 'easeInOut', 'easeIn'] // ends hidden under the deck
	};
	const DEAL_BACK: AnimationOptions = {
		duration: DEAL_MS / 1000,
		times: DEAL_TIMES,
		ease: ['easeOut', 'easeInOut', 'easeOut'] // ends in full view → settle softly
	};
	const SIDE_Y = -18; // slight lift while the card is out to the side
	const SIDE_ROTATE = 7; // gentle lean into the slide
	const SIDE_SCALE = 1.02;
	const LIFT_Z = 30; // forward card lifts toward the viewer so it slides out on top
	// Lift-shadow keyframes (opacity + scale), matched to the four deal beats: the
	// halo blooms as the card rises off the deck, then fades to nothing as it lands.
	const SHADOW_UP = [0, 0.5, 0.18, 0]; // forward: lift bright → tuck under → gone
	const SHADOW_DOWN = [0, 0.45, 0.28, 0]; // backward: rise → hold → settle flush
	const SHADOW_SCALE = [0.96, 1.06, 1.0, 0.98];

	function placeInstant() {
		for (let i = 0; i < count; i++) {
			const el = cardEls[i];
			if (!el) continue;
			const t = restTarget(slotOf(i));
			if (canAnimate) animate(el, { ...t, scale: 1 }, { duration: 0 });
			else el.style.transform = toTransform(t);
			const shadow = shadowEls[i];
			if (shadow) {
				if (canAnimate) animate(shadow, { opacity: 0 }, { duration: 0 });
				else shadow.style.opacity = '0';
			}
		}
	}

	function layoutNav() {
		if (!canAnimate || reducedMotion) return placeInstant();
		const forward = navDir > 0; // next deals the top card down to the back
		// The side the card travels to: forward slides left, backward slides right.
		const dir = forward ? -1 : 1;
		const stageW = stageEl?.clientWidth || FALLBACK_WIDTH_PX;
		// Momentum: a hard flick (≈1.5px/ms) flings the card farther and ~20% faster;
		// a click/keyboard deal (speed 0) stays at the calm default pace.
		const speed = Math.min(dealVelocity / 1.5, 1);
		// Push fully clear of the deck so the depth change at the side never overlaps.
		const sideX =
			dir * (Math.max(stageW * 0.72, Math.abs(dealFromX) + 100) + speed * stageW * 0.28);
		const ms = DEAL_MS * (1 - speed * 0.2);
		const fwd: AnimationOptions = { ...DEAL_FWD, duration: ms / 1000 };
		const bck: AnimationOptions = { ...DEAL_BACK, duration: ms / 1000 };
		const back = slotLayout(visibleDepth - 1, visibleDepth);
		const lean = dir * SIDE_ROTATE;
		for (let i = 0; i < count; i++) {
			const el = cardEls[i];
			if (!el) continue;
			const slot = slotOf(i);
			const t = restTarget(slot);
			const isDealt = forward ? slot === count - 1 : slot === 0;
			const shadow = shadowEls[i];
			if (!isDealt) {
				// Everyone else settles gently into their new slot (no pop).
				const depth = Math.min(slot, visibleDepth - 1);
				animate(el, { ...t, scale: 1 }, { ...PROMOTE, delay: depth * 0.04 });
			} else if (forward) {
				if (shadow) animate(shadow, { opacity: SHADOW_UP, scale: SHADOW_SCALE }, fwd);
				// Front card: slide out on top → sink to the back depth while off to
				// the side → return to centre already behind the deck.
				animate(
					el,
					{
						x: [dealFromX, sideX, sideX, t.x],
						y: [0, SIDE_Y, (SIDE_Y + t.y) / 2, t.y],
						z: [0, LIFT_Z, t.z, t.z],
						rotate: [dragTilt(dealFromX), lean, lean / 2, t.rotate],
						scale: [1, SIDE_SCALE, 1, 1]
					},
					fwd
				);
			} else {
				// Back card: slide out from under the deck → rise to the front depth
				// while off to the side → return to centre already on top.
				if (shadow) animate(shadow, { opacity: SHADOW_DOWN, scale: SHADOW_SCALE }, bck);
				animate(
					el,
					{
						x: [0, sideX, sideX, t.x],
						y: [back.y, SIDE_Y, (SIDE_Y + t.y) / 2, t.y],
						z: [back.z, back.z, t.z, t.z],
						rotate: [back.rotate, lean, lean / 2, t.rotate],
						scale: [1, SIDE_SCALE, 1, 1]
					},
					bck
				);
			}
		}
	}

	function layoutSettle() {
		if (!canAnimate || reducedMotion) return placeInstant();
		for (let i = 0; i < count; i++) {
			const el = cardEls[i];
			if (!el) continue;
			animate(el, restTarget(slotOf(i)), PROMOTE);
		}
	}

	function followDrag() {
		if (!canAnimate) return;
		const el = cardEls[index];
		if (!el) return;
		const t = restTarget(0);
		animate(el, { x: t.x, rotate: t.rotate }, { duration: 0 });
	}

	onMount(() => {
		placeInstant();
		mounted = true;
	});

	/** Register reactive dependencies for an `$effect` whose body is untracked. */
	function track(...deps: unknown[]): number {
		return deps.length;
	}

	// Re-deal on navigation; re-open/close on hover; follow the pointer while dragging.
	// The bodies are untracked so each effect fires only on its declared dependency.
	$effect(() => {
		track(index);
		untrack(() => mounted && layoutNav());
	});
	$effect(() => {
		track(hovering);
		untrack(() => mounted && layoutSettle());
	});
	$effect(() => {
		track(dragX);
		untrack(() => mounted && dragging && followDrag());
	});

	function goNext() {
		if (count <= 1) return;
		navDir = 1;
		dealFromX = 0;
		dealVelocity = 0;
		index = nextIndex(count, index);
		dragX = 0;
	}

	function goPrev() {
		if (count <= 1) return;
		navDir = -1;
		dealFromX = 0;
		dealVelocity = 0;
		index = prevIndex(count, index);
		dragX = 0;
	}

	function onKeydown(event: KeyboardEvent) {
		if (count <= 1) return;
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			goNext();
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			goPrev();
		}
	}

	// Distance threshold falls back to this when the stage isn't measurable yet
	// (clientWidth 0 before first layout / in jsdom) — a sane phone-width default.
	const FALLBACK_WIDTH_PX = 320;
	let startX = 0;
	let lastX = 0;
	let lastT = 0;
	let velocity = 0;

	function onPointerDown(event: PointerEvent) {
		if (count <= 1) return;
		dragging = true;
		startX = lastX = event.clientX;
		lastT = event.timeStamp;
		velocity = 0;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}

	function onPointerMove(event: PointerEvent) {
		if (!dragging) return;
		const dt = event.timeStamp - lastT;
		if (dt > 0) velocity = (event.clientX - lastX) / dt;
		lastX = event.clientX;
		lastT = event.timeStamp;
		dragX = event.clientX - startX;
	}

	function onPointerUp(event: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		const el = event.currentTarget as HTMLElement;
		// On pointercancel the capture is implicitly released; releasing again throws.
		if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
		const width = stageEl?.clientWidth || FALLBACK_WIDTH_PX;
		const dx = event.clientX - startX;
		const outcome = resolveSwipe({ dx, vx: velocity, width });
		if (outcome === 'next') {
			goNext();
			dealFromX = dx; // continue the throw from where the finger let go
			dealVelocity = Math.abs(velocity);
		} else if (outcome === 'prev') {
			goPrev();
			dealVelocity = Math.abs(velocity);
		} else {
			dragX = 0;
			// No navigation → no nav effect fires; spring the front card home.
			untrack(() => layoutSettle());
		}
	}

	function onPointerEnter(event: PointerEvent) {
		if (event.pointerType !== 'touch') hovering = true;
	}
	function onPointerLeave() {
		hovering = false;
	}
</script>

{#if count > 0}
	<!--
		The carousel is intentionally focusable and keyboard-operable: ArrowLeft/Right
		move between testimonials (WCAG 2.1.1). role="group" is non-interactive per the
		heuristic, so the tabindex/interaction warnings are false positives here.
	-->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		role="group"
		aria-roledescription="carousel"
		aria-label="Builder testimonials"
		tabindex="0"
		class={`flex w-full flex-col items-center gap-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong focus-visible:ring-offset-2 ${className}`}
		onkeydown={onKeydown}
		onpointerenter={onPointerEnter}
		onpointerleave={onPointerLeave}
	>
		<!--
			Row layout keeps a constant 12px (gap-3) gutter between each chevron and
			the card on both sides at every width; the card (flex-1) shrinks to fit on
			narrow viewports instead of being overlapped by the controls.
		-->
		<div class="flex w-full max-w-md items-center gap-3">
			<Button
				variant="soft"
				size="icon"
				class="z-40 shrink-0 shadow-card"
				aria-label="Previous testimonial"
				disabled={count <= 1}
				onclick={goPrev}
			>
				<IconChevronLeft class="size-5" aria-hidden="true" />
			</Button>

			<!-- Vertical padding leaves room for the stack to lift behind the front card. -->
			<div class="relative min-w-0 flex-1 py-8">
				<div bind:this={stageEl} class="deck-stage w-full min-w-0">
					{#each items as item, i (i)}
						{@const slot = slotOf(i)}
						<!-- Drag is a pointer-only affordance; keyboard users use the group's
						     arrow keys and the chevron Buttons. -->
						<div
							bind:this={cardEls[i]}
							class={`deck-card ${slot === 0 ? 'cursor-grab touch-pan-y select-none active:cursor-grabbing' : ''}`}
							class:deck-card--front={slot === 0}
							aria-hidden={slot === 0 ? undefined : 'true'}
							onpointerdown={slot === 0 ? onPointerDown : undefined}
							onpointermove={slot === 0 ? onPointerMove : undefined}
							onpointerup={slot === 0 ? onPointerUp : undefined}
							onpointercancel={slot === 0 ? onPointerUp : undefined}
						>
							<div bind:this={shadowEls[i]} class="deck-card__shadow" aria-hidden="true"></div>
							<Testimonial quote={item.quote} name={item.name} role={item.role} />
						</div>
					{/each}
				</div>
			</div>

			<Button
				variant="soft"
				size="icon"
				class="z-40 shrink-0 shadow-card"
				aria-label="Next testimonial"
				disabled={count <= 1}
				onclick={goNext}
			>
				<IconChevronRight class="size-5" aria-hidden="true" />
			</Button>
		</div>

		<div class="flex items-center gap-2" aria-hidden="true">
			{#each dots as dot (dot)}
				<span
					class={`size-2 rounded-full transition-colors duration-300 ${
						dot === index ? 'bg-accent-strong' : 'bg-neutral-300'
					}`}
				></span>
			{/each}
		</div>
		<p aria-live="polite" class="sr-only">Testimonial {index + 1} of {count}</p>
	</div>
{/if}

<style>
	/* A real 3D stage: cards share one grid cell (so the deck height tracks the
	   tallest card) and live in a shared 3D space, so depth (translateZ) genuinely
	   occludes — the dealt card travels *under* the stack. Motion drives the
	   per-card transforms; CSS only establishes the 3D context. */
	.deck-stage {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		place-items: stretch;
		perspective: 1500px;
		transform-style: preserve-3d;
	}

	.deck-card {
		grid-area: 1 / 1;
		transform-style: preserve-3d;
		/* Keep each card on its own compositing layer with a stable backface so the
		   depth-sort during a deal doesn't flicker. */
		backface-visibility: hidden;
		will-change: transform;
	}

	/* Lift shadow: a soft halo that only appears while a card is dealt, conveying
	   that it has risen off the deck. Behind the card content; only opacity and
	   transform animate (compositor-cheap), so the box-shadow never repaints. */
	.deck-card__shadow {
		position: absolute;
		inset: 0;
		border-radius: var(--radius-card);
		box-shadow: var(--shadow-card-lifted);
		opacity: 0;
		pointer-events: none;
	}

	/* The card face paints above the lift-shadow layer (both are positioned, so
	   DOM order decides; figure is the later sibling). */
	.deck-card :global(figure) {
		position: relative;
	}

	/* Only the readable front card receives pointer input. */
	.deck-card:not(.deck-card--front) {
		pointer-events: none;
	}
</style>
