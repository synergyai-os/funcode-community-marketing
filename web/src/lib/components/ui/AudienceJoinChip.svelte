<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { onMount } from 'svelte';
	import { animate, type AnimationPlaybackControls } from 'motion';
	import { prefersReducedMotion } from 'svelte/motion';
	import { canUseWebAnimations } from '$lib/motion/capabilities';
	import {
		JOIN_CHIP_EMOJI_SLOT,
		JOIN_CHIP_GROW,
		JOIN_CHIP_LABEL,
		JOIN_CHIP_SHRINK,
		JOIN_CHIP_VARS,
		joinChipDuration,
		parseSweepPercent
	} from './audience-join-chip';

	type Props = HTMLAttributes<HTMLSpanElement> & {
		emoji: string;
		onJoin?: () => void;
		dragging?: boolean;
		suppressClick?: boolean;
		children: Snippet;
	};

	let {
		emoji,
		onJoin,
		dragging = false,
		suppressClick = false,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const reducedMotion = $derived(prefersReducedMotion.current);
	const canAnimate = canUseWebAnimations();

	let el = $state<HTMLSpanElement | undefined>(undefined);
	let joinMeasureEl = $state<HTMLSpanElement | undefined>(undefined);
	let emojiMeasureEl = $state<HTMLSpanElement | undefined>(undefined);
	let primed = $state(false);
	let animating = $state(false);
	let pointerInside = false;
	let hoverAnim: AnimationPlaybackControls | null = null;
	let cachedIdleW = 0;
	let cachedExpandedW = 0;
	const HOLD_MS = 320;
	const HOLD_MOVE_THRESHOLD = 10;

	let holdTimer: ReturnType<typeof setTimeout> | null = null;
	let touchStartX = 0;
	let touchStartY = 0;
	let dragFrozen = false;

	function clearHoldTimer() {
		if (holdTimer) {
			clearTimeout(holdTimer);
			holdTimer = null;
		}
	}

	const showSweepBg = $derived(animating || primed);

	const ariaLabel = $derived(
		primed
			? `${JOIN_CHIP_LABEL} — activate to open`
			: animating
				? `${JOIN_CHIP_LABEL} — hold to complete`
				: '…and you — hold, tap twice, or press Enter to join'
	);

	const liveStatus = $derived(primed ? JOIN_CHIP_LABEL : animating ? 'Opening join…' : '');

	$effect(() => {
		if (dragging) {
			clearHoldTimer();
			freezeForDrag();
			return;
		}
		if (dragFrozen) {
			dragFrozen = false;
			requestAnimationFrame(() => {
				if (el?.matches(':hover')) pointerInside = true;
			});
		}
	});

	function measureWidth(mode: 'idle' | 'expanded'): number {
		if (!el) return 0;
		if (mode === 'expanded') {
			joinMeasureEl?.classList.add('is-measuring');
			emojiMeasureEl?.classList.add('is-measuring-hidden');
		}
		const w = el.getBoundingClientRect().width;
		joinMeasureEl?.classList.remove('is-measuring');
		emojiMeasureEl?.classList.remove('is-measuring-hidden');
		return w;
	}

	function refreshCachedWidths() {
		if (!el) return;
		cachedIdleW = measureWidth('idle');
		cachedExpandedW = measureWidth('expanded');
	}

	function widthFor(mode: 'idle' | 'expanded'): number {
		const cached = mode === 'idle' ? cachedIdleW : cachedExpandedW;
		return cached > 0 ? cached : measureWidth(mode);
	}

	type Snapshot = {
		width: number;
		sweep: string;
		emojiSlot: string;
		emojiOpacity: number;
	};

	function snapshot(): Snapshot | null {
		if (!el) return null;
		const cs = getComputedStyle(el);
		return {
			width: el.getBoundingClientRect().width,
			sweep: cs.getPropertyValue('--sweep').trim() || JOIN_CHIP_VARS.sweepStart,
			emojiSlot: cs.getPropertyValue('--emoji-slot').trim() || JOIN_CHIP_EMOJI_SLOT,
			emojiOpacity: parseFloat(cs.getPropertyValue('--emoji-opacity')) || JOIN_CHIP_VARS.opacityIn
		};
	}

	function stopAnim() {
		hoverAnim?.stop();
		hoverAnim = null;
	}

	function jumpToIdle() {
		if (!el) return;
		stopAnim();
		animating = false;
		primed = false;
		dragFrozen = false;
		el.style.width = '';
		el.style.removeProperty('--sweep');
		el.style.removeProperty('--emoji-slot');
		el.style.removeProperty('--emoji-opacity');
	}

	/** Stop motion and lock whatever the chip looks like right now — used during drag. */
	function freezeForDrag() {
		if (!el) return;
		stopAnim();
		dragFrozen = true;
		// Don't treat the chip as hovered while dragging; drop keeps the frozen look.
		pointerInside = false;

		const s = snapshot();
		if (!s) return;

		const sweepPct = parseSweepPercent(s.sweep);

		if (primed || sweepPct >= 95) {
			settlePrimed();
			return;
		}

		if (animating || sweepPct > 0) {
			el.style.width = `${s.width}px`;
			el.style.setProperty('--sweep', s.sweep);
			el.style.setProperty('--emoji-slot', s.emojiSlot);
			el.style.setProperty('--emoji-opacity', String(s.emojiOpacity));
			animating = true;
			primed = false;
			return;
		}

		animating = false;
		primed = false;
	}

	function settlePrimed() {
		if (!el) return;
		animating = false;
		primed = true;
		el.style.width = `${widthFor('expanded')}px`;
		el.style.setProperty('--sweep', JOIN_CHIP_VARS.sweepEnd);
		el.style.setProperty('--emoji-slot', JOIN_CHIP_VARS.slotOut);
		el.style.setProperty('--emoji-opacity', String(JOIN_CHIP_VARS.opacityOut));
	}

	function growTowardPrimed() {
		if (!el || dragging) return;

		if (reducedMotion || !canAnimate) {
			settlePrimed();
			return;
		}

		stopAnim();
		primed = false;
		animating = true;

		const from = snapshot()!;
		const targetW = widthFor('expanded');
		const sweepFrom = parseSweepPercent(from.sweep);
		const widthFrom = from.width;
		const widthSpan = Math.max(1, targetW - widthFor('idle'));
		const widthRemaining = Math.max(0, Math.min(1, (targetW - widthFrom) / widthSpan));
		const sweepRemaining = Math.max(0, Math.min(1, (100 - sweepFrom) / 100));
		const remaining = Math.max(widthRemaining, sweepRemaining);

		el.style.width = `${widthFrom}px`;

		hoverAnim = animate(
			el,
			{
				width: [`${widthFrom}px`, `${targetW}px`],
				'--emoji-slot': [from.emojiSlot, JOIN_CHIP_VARS.slotOut],
				'--emoji-opacity': [from.emojiOpacity, JOIN_CHIP_VARS.opacityOut],
				'--sweep': [from.sweep, JOIN_CHIP_VARS.sweepEnd]
			},
			{
				...joinChipDuration(JOIN_CHIP_GROW, remaining),
				onComplete: () => {
					hoverAnim = null;
					if (pointerInside) settlePrimed();
					else shrinkTowardIdle();
				}
			}
		);
	}

	function shrinkTowardIdle() {
		if (!el || dragging) return;
		if (!animating && !primed) return;

		if (reducedMotion || !canAnimate) {
			jumpToIdle();
			return;
		}

		stopAnim();
		primed = false;
		animating = true;

		const from = snapshot()!;
		const idleW = widthFor('idle');
		const sweepFrom = parseSweepPercent(from.sweep);
		const widthFrom = from.width;
		const widthSpan = Math.max(1, widthFor('expanded') - idleW);
		const widthRemaining = Math.max(0, Math.min(1, (widthFrom - idleW) / widthSpan));
		const sweepRemaining = Math.max(0, Math.min(1, sweepFrom / 100));
		const remaining = Math.max(widthRemaining, sweepRemaining);

		el.style.width = `${widthFrom}px`;

		hoverAnim = animate(
			el,
			{
				width: [`${widthFrom}px`, `${idleW}px`],
				'--emoji-slot': [from.emojiSlot, JOIN_CHIP_VARS.slotIn],
				'--emoji-opacity': [from.emojiOpacity, JOIN_CHIP_VARS.opacityIn],
				'--sweep': [from.sweep, JOIN_CHIP_VARS.sweepStart]
			},
			{
				...joinChipDuration(JOIN_CHIP_SHRINK, remaining),
				onComplete: () => {
					hoverAnim = null;
					if (pointerInside) growTowardPrimed();
					else jumpToIdle();
				}
			}
		);
	}

	function activateJoin(event: Event) {
		if (!primed || suppressClick || dragging) return;
		event.preventDefault();
		event.stopPropagation();
		onJoin?.();
	}

	function onChipClick(event: MouseEvent) {
		if (suppressClick || dragging) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		if (!primed) {
			event.preventDefault();
			pointerInside = true;
			growTowardPrimed();
			return;
		}
		activateJoin(event);
	}

	function onKeydown(event: KeyboardEvent) {
		if (dragging) return;
		if (event.key === 'Enter' || event.key === ' ') {
			if (!primed) {
				event.preventDefault();
				pointerInside = true;
				growTowardPrimed();
				return;
			}
			activateJoin(event);
		}
		if (event.key === 'Escape') {
			pointerInside = false;
			shrinkTowardIdle();
		}
	}

	function onPointerEnter(event: PointerEvent) {
		if (event.pointerType === 'touch' || dragging) return;
		pointerInside = true;
		if (!primed) growTowardPrimed();
	}

	function onTouchPointerDown(event: PointerEvent) {
		if (event.pointerType !== 'touch' || dragging || dragFrozen) return;
		touchStartX = event.clientX;
		touchStartY = event.clientY;
		clearHoldTimer();
		holdTimer = setTimeout(() => {
			holdTimer = null;
			if (!dragging && !dragFrozen) {
				pointerInside = true;
				growTowardPrimed();
			}
		}, HOLD_MS);
	}

	function onTouchPointerMove(event: PointerEvent) {
		if (event.pointerType !== 'touch' || !holdTimer) return;
		if (
			Math.hypot(event.clientX - touchStartX, event.clientY - touchStartY) > HOLD_MOVE_THRESHOLD
		) {
			clearHoldTimer();
		}
	}

	function onTouchPointerUp(event: PointerEvent) {
		if (event.pointerType !== 'touch') return;
		clearHoldTimer();
		if (dragging || dragFrozen) return;
		if (!primed && animating) {
			pointerInside = false;
			shrinkTowardIdle();
		}
	}

	function onPointerLeave() {
		if (dragging || dragFrozen) return;
		pointerInside = false;
		if (primed || animating) shrinkTowardIdle();
	}

	function onBlur() {
		requestAnimationFrame(() => {
			if (!el || dragging || el.matches(':hover')) return;
			pointerInside = false;
			if (primed || animating) shrinkTowardIdle();
		});
	}

	onMount(() => {
		requestAnimationFrame(refreshCachedWidths);
	});
</script>

<span
	bind:this={el}
	class={`audience-join-chip inline-grid overflow-hidden rounded-full border border-accent-soft bg-accent-soft text-sm font-semibold tracking-wide text-accent-strong uppercase shadow-sm backdrop-blur transition-shadow duration-300 ${showSweepBg ? 'audience-join-chip--active' : ''} ${primed ? 'audience-join-chip--primed' : ''} ${className}`}
	role="button"
	tabindex="0"
	aria-label={ariaLabel}
	onpointerdown={onTouchPointerDown}
	onpointermove={onTouchPointerMove}
	onpointerup={onTouchPointerUp}
	onpointercancel={onTouchPointerUp}
	onpointerenter={onPointerEnter}
	onpointerleave={onPointerLeave}
	onblur={onBlur}
	onclick={onChipClick}
	onkeydown={onKeydown}
	{...rest}
>
	<span
		class="audience-join-chip__measure inline-flex items-center gap-2.5 px-5 py-2.5"
		aria-hidden="true"
	>
		<span bind:this={emojiMeasureEl} class="audience-join-chip__emoji">{emoji}</span>
		<span class="audience-join-chip__measure-grid">
			<span class="audience-join-chip__measure-line">{@render children()}</span>
			<span
				bind:this={joinMeasureEl}
				class="audience-join-chip__measure-line audience-join-chip__measure-line--join"
			>
				{JOIN_CHIP_LABEL}
			</span>
		</span>
	</span>

	<span class="audience-join-chip__overlay" aria-hidden="true">
		<span class="sr-only" aria-live="polite">{liveStatus}</span>
		<span class="audience-join-chip__line audience-join-chip__line--join">
			<span class="audience-join-chip__text">{JOIN_CHIP_LABEL}</span>
		</span>
		<span class="audience-join-chip__line audience-join-chip__line--primary">
			<span class="audience-join-chip__emoji audience-join-chip__emoji--visible" aria-hidden="true"
				>{emoji}</span
			>
			<span class="audience-join-chip__text">{@render children()}</span>
		</span>
	</span>
</span>

<style>
	.audience-join-chip {
		position: relative;
		width: fit-content;
		cursor: pointer;
		touch-action: manipulation;
		--sweep: 0%;
		--emoji-slot: 1.125rem;
		--emoji-opacity: 1;
	}

	@media (hover: hover) and (pointer: fine) {
		.audience-join-chip:hover {
			box-shadow: var(--shadow-card);
		}
	}

	.audience-join-chip__measure {
		grid-area: 1 / 1;
		visibility: hidden;
		pointer-events: none;
	}

	.audience-join-chip__overlay {
		grid-area: 1 / 1;
		position: relative;
		min-width: 0;
		min-height: 100%;
		pointer-events: none;
	}

	/* Gradient sweep while growing/shrinking; solid red when settled. */
	.audience-join-chip--active:not(.audience-join-chip--primed) {
		background: linear-gradient(
			90deg,
			var(--color-accent-strong) 0%,
			var(--color-accent-strong) calc(var(--sweep, 0%) - 6px),
			color-mix(in oklab, var(--color-accent-strong) 55%, var(--color-accent-soft)) var(--sweep, 0%),
			var(--color-accent-soft) calc(var(--sweep, 0%) + 6px)
		);
	}

	.audience-join-chip--primed {
		border-color: var(--color-accent-strong);
		background: var(--color-accent-strong);
		box-shadow: var(--shadow-card);
		animation: join-chip-ready-glow 2.4s ease-in-out infinite;
	}

	.audience-join-chip:focus {
		outline: none;
	}

	.audience-join-chip:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 3px;
	}

	.audience-join-chip__measure-grid {
		display: grid;
		white-space: nowrap;
	}

	.audience-join-chip__measure-line {
		grid-area: 1 / 1;
		visibility: hidden;
		height: 0;
		overflow: hidden;
	}

	.audience-join-chip__measure-line--join {
		display: none;
	}

	.audience-join-chip__measure-line--join.is-measuring {
		display: block;
	}

	.audience-join-chip__emoji.is-measuring-hidden {
		display: none;
	}

	.audience-join-chip__emoji {
		flex-shrink: 0;
		font-size: 1.125rem;
		line-height: 1.125rem;
	}

	.audience-join-chip__emoji--visible {
		width: var(--emoji-slot, 1.125rem);
		opacity: var(--emoji-opacity, 1);
		overflow: hidden;
		text-align: center;
	}

	.audience-join-chip__line {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--emoji-slot, 1.125rem);
		padding: 0.625rem 1.25rem;
		line-height: 1.2;
		white-space: nowrap;
	}

	.audience-join-chip__text {
		flex: 0 1 auto;
		min-width: 0;
		text-align: center;
	}

	.audience-join-chip__line--join {
		color: white;
		clip-path: inset(0 100% 0 0);
	}

	.audience-join-chip--active .audience-join-chip__line--join {
		clip-path: inset(0 calc(100% - var(--sweep, 0%)) 0 0);
	}

	.audience-join-chip--primed .audience-join-chip__line--join {
		clip-path: inset(0 0 0 0);
	}

	.audience-join-chip__line--primary {
		color: var(--color-accent-strong);
	}

	.audience-join-chip--active:not(.audience-join-chip--primed) .audience-join-chip__line--primary {
		clip-path: inset(0 0 0 var(--sweep, 0%));
	}

	.audience-join-chip--primed .audience-join-chip__line--primary {
		clip-path: inset(0 0 0 100%);
	}

	@keyframes join-chip-ready-glow {
		0%,
		100% {
			box-shadow: var(--shadow-card);
		}
		50% {
			box-shadow:
				var(--shadow-card),
				0 0 0 3px color-mix(in oklab, var(--color-accent) 25%, transparent);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.audience-join-chip--primed {
			animation: none;
		}
	}
</style>
