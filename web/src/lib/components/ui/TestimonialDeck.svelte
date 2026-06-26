<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import Button from './Button.svelte';
	import DeckCard from './DeckCard.svelte';
	import { nextIndex, prevIndex, resolveSwipe } from './testimonial-deck';
	import IconChevronLeft from '~icons/lucide/chevron-left';
	import IconChevronRight from '~icons/lucide/chevron-right';

	type Item = { quote: string; name: string; role: string };

	let { items, class: className = '' }: { items: Item[]; class?: string } = $props();

	const count = $derived(items.length);

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
		const width = stackEl?.clientWidth || 320;
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
		class={`flex flex-col items-center gap-6 rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong focus-visible:ring-offset-2 ${className}`}
		onkeydown={onKeydown}
	>
		<div class="flex w-full items-center justify-center gap-3 sm:gap-5">
			<Button
				variant="secondary"
				size="md"
				class="size-11 shrink-0 !p-0"
				aria-label="Previous testimonial"
				disabled={count <= 1}
				onclick={goPrev}
			>
				<IconChevronLeft class="size-5" aria-hidden="true" />
			</Button>

			<div bind:this={stackEl} class="deck-stack w-full max-w-md">
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

			<Button
				variant="secondary"
				size="md"
				class="size-11 shrink-0 !p-0"
				aria-label="Next testimonial"
				disabled={count <= 1}
				onclick={goNext}
			>
				<IconChevronRight class="size-5" aria-hidden="true" />
			</Button>
		</div>

		<p aria-live="polite" class="text-sm font-medium text-ink-soft">
			Testimonial {index + 1} of {count}
		</p>
	</div>
{/if}

<style>
	.deck-stack {
		display: grid;
		place-items: stretch;
	}
	.deck-stack > * {
		grid-area: 1 / 1;
	}
</style>
