<script lang="ts">
	import { Spring } from 'svelte/motion';
	import type { HTMLAttributes } from 'svelte/elements';
	import Testimonial from './Testimonial.svelte';
	import { depthTransform, dragTilt } from './testimonial-deck';

	type Item = { quote: string; name: string; role: string };

	type Props = HTMLAttributes<HTMLDivElement> & {
		item: Item;
		/** Discrete stack depth: 0 = front (active), 1/2 = peeked behind. */
		offset: number;
		/** Whether this is the front, draggable card. */
		active?: boolean;
		/** Live horizontal drag offset in px (honoured only while active). */
		drag?: number;
		reducedMotion?: boolean;
	};

	let { item, offset, active = false, drag = 0, reducedMotion = false, ...rest }: Props = $props();

	// Two springs give each card physicality: `depth` animates promotion and
	// recede as cards move through the stack (replacing an instant snap); `x`
	// carries the horizontal drag and springs back when the card is released or
	// hands off the front slot. The spring seeds from the card's mount-time
	// offset (so cards added at the back appear in place); the effect below
	// tracks every later change.
	// svelte-ignore state_referenced_locally
	const depth = new Spring(offset, { stiffness: 0.1, damping: 0.7 });
	const x = new Spring(0, { stiffness: 0.16, damping: 0.82 });

	function settle(spring: Spring<number>, value: number) {
		if (reducedMotion) spring.set(value, { instant: true });
		else spring.target = value;
	}

	$effect(() => {
		settle(depth, offset);
	});
	$effect(() => {
		settle(x, active ? drag : 0);
	});

	const t = $derived(depthTransform(depth.current));
	const tilt = $derived(active ? dragTilt(x.current) : 0);
	const transform = $derived(
		`translateX(${x.current}px) translateY(${t.translateY}px) scale(${t.scale}) rotate(${tilt}deg)`
	);
</script>

<div
	{...rest}
	class={active ? 'cursor-grab touch-pan-y select-none active:cursor-grabbing' : ''}
	style={`transform: ${transform}; opacity: ${t.opacity}; z-index: ${30 - offset};`}
	aria-hidden={active ? undefined : true}
>
	<Testimonial quote={item.quote} name={item.name} role={item.role} />
</div>
