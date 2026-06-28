<script lang="ts">
	import Badge from './Badge.svelte';

	type Props = {
		year: number;
		eventCount: number;
		subtitle?: string;
	};

	let { year, eventCount, subtitle }: Props = $props();
</script>

<header class="relative py-10 text-center">
	<Badge variant="accent" size="lg">Chapter</Badge>
	<h2 class="mt-3 text-5xl font-black tracking-tight text-ink tabular-nums">{year}</h2>
	<p class="mt-2 text-sm text-ink-soft">
		{eventCount}
		{eventCount === 1 ? 'moment' : 'moments'}
		{#if subtitle}
			· {subtitle}
		{/if}
	</p>
	<div
		class="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent"
		aria-hidden="true"
	></div>
</header>
