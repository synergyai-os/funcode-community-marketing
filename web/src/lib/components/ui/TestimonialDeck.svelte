<script lang="ts">
	import { Spring } from 'svelte/motion';
	import Button from './Button.svelte';
	import Testimonial from './Testimonial.svelte';
	import { nextIndex, prevIndex, resolveSwipe } from './testimonial-deck';
	import IconChevronLeft from '~icons/lucide/chevron-left';
	import IconChevronRight from '~icons/lucide/chevron-right';

	type Item = { quote: string; name: string; role: string };

	// Stack depth tuning (runtime transforms, so they can't be tokens — named for intent).
	const PEEK_LIFT_PX = 14;
	const PEEK_SCALE_STEP = 0.06;
	const PEEK_OPACITY_STEP = 0.18;
	const DRAG_ROTATION_DIVISOR = 40;

	let { items, class: className = '' }: { items: Item[]; class?: string } = $props();

	const count = $derived(items.length);

	let index = $state(0);
	let reducedMotion = $state(false);

	// Visible stack: the active card plus up to two peeked cards behind it.
	const visible = $derived(
		Array.from({ length: Math.min(count, 3) }, (_, offset) => {
			const itemIndex = (index + offset) % count;
			return { item: items[itemIndex], offset, key: itemIndex };
		})
	);

	const x = new Spring(0, { stiffness: 0.15, damping: 0.8 });

	let stackEl: HTMLDivElement | undefined = $state();
	let dragging = $state(false);
	let startX = 0;
	let lastX = 0;
	let lastT = 0;
	let velocity = 0;

	function setOffset(px: number) {
		if (reducedMotion) x.set(px, { instant: true });
		else x.target = px;
	}

	function goTo(target: number) {
		index = target;
		setOffset(0);
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
		setOffset(event.clientX - startX);
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
		else setOffset(0);
	}

	$effect(() => {
		const query = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = query.matches;
		const onChange = (event: MediaQueryListEvent) => (reducedMotion = event.matches);
		query.addEventListener('change', onChange);
		return () => query.removeEventListener('change', onChange);
	});

	function cardStyle(offset: number) {
		if (offset === 0) {
			const angle = x.current / DRAG_ROTATION_DIVISOR;
			return `transform: translateX(${x.current}px) rotate(${angle}deg); z-index: 30;`;
		}
		const lift = offset * PEEK_LIFT_PX;
		const scale = 1 - offset * PEEK_SCALE_STEP;
		const opacity = 1 - offset * PEEK_OPACITY_STEP;
		return `transform: translateY(${lift}px) scale(${scale}); opacity: ${opacity}; z-index: ${30 - offset};`;
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
					<div
						class={card.offset === 0
							? 'cursor-grab touch-pan-y select-none active:cursor-grabbing'
							: ''}
						style={cardStyle(card.offset)}
						aria-hidden={card.offset === 0 ? undefined : true}
						onpointerdown={card.offset === 0 ? onPointerDown : undefined}
						onpointermove={card.offset === 0 ? onPointerMove : undefined}
						onpointerup={card.offset === 0 ? onPointerUp : undefined}
						onpointercancel={card.offset === 0 ? onPointerUp : undefined}
					>
						<Testimonial quote={card.item.quote} name={card.item.name} role={card.item.role} />
					</div>
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
