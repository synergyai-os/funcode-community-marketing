<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import Button from './Button.svelte';
	import DeckCard from './DeckCard.svelte';
	import { nextIndex, prevIndex, resolveSwipe, type DeckItem } from './testimonial-deck';
	import IconChevronLeft from '~icons/lucide/chevron-left';
	import IconChevronRight from '~icons/lucide/chevron-right';

	let { items, class: className = '' }: { items: DeckItem[]; class?: string } = $props();

	const count = $derived(items.length);
	const dots = $derived(items.map((_, i) => i));

	let index = $state(0);
	// Raw horizontal drag offset (px) of the active card; the card's own spring
	// turns this into smooth motion. Reset to 0 on every commit.
	let dragX = $state(0);
	const reducedMotion = $derived(prefersReducedMotion.current);

	// Visible stack: the active card plus up to two peeked cards behind it.
	const visible = $derived(
		Array.from({ length: Math.min(count, 3) }, (_, offset) => {
			const itemIndex = (index + offset) % count;
			return { item: items[itemIndex], offset, key: itemIndex };
		})
	);

	// Distance threshold falls back to this when the stack isn't measurable yet
	// (clientWidth 0 before first layout / in jsdom) — a sane phone-width default.
	const FALLBACK_WIDTH_PX = 320;

	let stackEl: HTMLDivElement | undefined = $state();
	let dragging = $state(false);
	let startX = 0;
	let lastX = 0;
	let lastT = 0;
	let velocity = 0;

	function goTo(target: number) {
		index = target;
		dragX = 0;
	}

	function goNext() {
		goTo(nextIndex(count, index));
	}

	function goPrev() {
		goTo(prevIndex(count, index));
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
		const width = stackEl?.clientWidth || FALLBACK_WIDTH_PX;
		const outcome = resolveSwipe({ dx: event.clientX - startX, vx: velocity, width });
		if (outcome === 'next') goNext();
		else if (outcome === 'prev') goPrev();
		else dragX = 0;
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
		class={`flex w-full flex-col items-center gap-6 rounded-card px-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong focus-visible:ring-offset-2 ${className}`}
		onkeydown={onKeydown}
	>
		<!-- px-7 reserves a side gutter so the absolutely-positioned chevrons hug the
		     card's rounded corner (Insify pattern) without covering the quote text
		     or overflowing a narrow viewport. -->
		<div class="relative w-full max-w-md px-7">
			<div bind:this={stackEl} class="deck-stack w-full min-w-0 py-6">
				{#each visible as card (card.key)}
					<DeckCard
						item={card.item}
						offset={card.offset}
						active={card.offset === 0}
						drag={card.offset === 0 ? dragX : 0}
						{reducedMotion}
						onpointerdown={card.offset === 0 ? onPointerDown : undefined}
						onpointermove={card.offset === 0 ? onPointerMove : undefined}
						onpointerup={card.offset === 0 ? onPointerUp : undefined}
						onpointercancel={card.offset === 0 ? onPointerUp : undefined}
					/>
				{/each}
			</div>

			<!-- Chevrons overlay the card's side edges (Insify pattern) so the card
			     stays full-width on mobile instead of being squeezed by an in-row layout. -->
			<Button
				variant="soft"
				size="icon"
				class="absolute inset-y-0 left-0 z-40 my-auto shadow-card"
				aria-label="Previous testimonial"
				disabled={count <= 1}
				onclick={goPrev}
			>
				<IconChevronLeft class="size-5" aria-hidden="true" />
			</Button>
			<Button
				variant="soft"
				size="icon"
				class="absolute inset-y-0 right-0 z-40 my-auto shadow-card"
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
	/* Cards share a single grid cell to overlap; each DeckCard sets its own
	   `grid-area: 1 / 1` (scoped CSS can't reach the child component's root). */
	.deck-stack {
		display: grid;
		/* A single explicit column (not the default `auto`) so cards fill the
		   container and wrap, instead of sizing to the quote's max-content width. */
		grid-template-columns: minmax(0, 1fr);
		place-items: stretch;
	}
</style>
