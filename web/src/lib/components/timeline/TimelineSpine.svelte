<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import TimelineCard from '$lib/components/ui/TimelineCard.svelte';
	import { canUseWebAnimations } from '$lib/motion/capabilities';
	import type { TimelineEvent } from '$lib/data/timeline';

	type Props = {
		events: TimelineEvent[];
	};

	let { events }: Props = $props();

	const reducedMotion = $derived(prefersReducedMotion.current);

	function reveal(node: HTMLElement, side: 'left' | 'right') {
		const offset = side === 'left' ? -16 : 16;

		if (reducedMotion || !canUseWebAnimations()) {
			node.style.opacity = '1';
			node.style.transform = 'translateX(0)';
			return {};
		}

		node.style.opacity = '0';
		node.style.transform = `translateX(${offset}px)`;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					node.animate(
						[
							{ opacity: 0, transform: `translateX(${offset}px)` },
							{ opacity: 1, transform: 'translateX(0)' }
						],
						{ duration: 450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
					);
					observer.disconnect();
				}
			},
			{ rootMargin: '-10% 0px -10% 0px', threshold: 0.15 }
		);
		observer.observe(node);

		return {
			destroy() {
				observer.disconnect();
			}
		};
	}
</script>

<div class="relative mx-auto max-w-4xl py-4">
	<div
		class="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border-strong to-transparent md:block"
		aria-hidden="true"
	></div>

	<ol class="relative space-y-10 md:space-y-14">
		{#each events as event, i (event.id)}
			{@const side = i % 2 === 0 ? 'left' : 'right'}
			<li class="relative list-none" use:reveal={side}>
				<TimelineCard {event} {side} />
			</li>
		{/each}
	</ol>
</div>
