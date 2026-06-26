<script lang="ts">
	import { Spring } from 'svelte/motion';
	import type { HTMLAttributes } from 'svelte/elements';
	import Testimonial from './Testimonial.svelte';
	import { depthTransform, dragTilt, fanRotation, type DeckItem } from './testimonial-deck';

	type Props = HTMLAttributes<HTMLDivElement> & {
		item: DeckItem;
		/** Discrete stack depth: 0 = front (active), 1/2 = peeked behind. */
		offset: number;
		/** Whether this is the front, draggable card. */
		active?: boolean;
		/** Live horizontal drag offset in px (honoured only while active). */
		drag?: number;
		reducedMotion?: boolean;
	};

	let { item, offset, active = false, drag = 0, reducedMotion = false, ...rest }: Props = $props();

	// Three springs give each card physicality: `depth` animates promotion and
	// recede (scale/lift) as cards move through the stack; `fan` rotates each
	// card into its fanned slot and flat to the front; `x` carries the
	// horizontal drag and springs back on release or hand-off. Each spring seeds
	// from the card's mount-time slot (so cards added at the back appear in
	// place); the effects below track every later change.
	// svelte-ignore state_referenced_locally
	const depth = new Spring(offset, { stiffness: 0.1, damping: 0.7 });
	// svelte-ignore state_referenced_locally
	const fan = new Spring(fanRotation(offset), { stiffness: 0.1, damping: 0.7 });
	const x = new Spring(0, { stiffness: 0.16, damping: 0.82 });

	function settle(spring: Spring<number>, value: number) {
		if (reducedMotion) spring.set(value, { instant: true });
		else spring.target = value;
	}

	$effect(() => {
		settle(depth, offset);
	});
	$effect(() => {
		settle(fan, fanRotation(offset));
	});
	$effect(() => {
		settle(x, active ? drag : 0);
	});

	const t = $derived(depthTransform(depth.current));
	const tilt = $derived(active ? dragTilt(x.current) : 0);
	const transform = $derived(
		`translateX(${x.current}px) translateY(${t.translateY}px) rotate(${fan.current + tilt}deg) scale(${t.scale})`
	);

	// `grid-area: 1 / 1` is set here (not in the parent's scoped CSS) so the cards
	// stack on top of each other: Svelte's scoped styles do not cross the
	// component boundary into this child's root element.
	const style = $derived(
		`grid-area: 1 / 1; transform: ${transform}; opacity: ${t.opacity}; z-index: ${30 - offset}; will-change: transform;`
	);
</script>

<div
	{...rest}
	class={active ? 'cursor-grab touch-pan-y select-none active:cursor-grabbing' : ''}
	{style}
	aria-hidden={active ? undefined : true}
>
	<Testimonial quote={item.quote} name={item.name} role={item.role} />
</div>
