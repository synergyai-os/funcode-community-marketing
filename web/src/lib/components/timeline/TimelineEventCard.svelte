<script lang="ts">
	import { Badge } from '$lib/components/ui';
	import ChainRef from '$lib/components/showcase/ChainRef.svelte';
	import PredictionBadge from '$lib/components/ui/PredictionBadge.svelte';
	import SourceDateBadge from '$lib/components/timeline/SourceDateBadge.svelte';
	import type { TimelineEvent } from '$lib/data/timeline';

	type Props = {
		event: TimelineEvent;
	};

	let { event }: Props = $props();
</script>

<article class="rounded-card border border-border bg-surface p-5">
	<div class="flex flex-wrap items-start justify-between gap-2">
		<div class="flex flex-wrap gap-2">
			<Badge variant="neutral">{event.kind}</Badge>
			<SourceDateBadge
				sourcePublishedAt={event.sourcePublishedAt}
				ingestedAt={event.ingestedAt}
				compact
			/>
			{#if event.kind === 'prediction' && event.predictionStatus}
				<PredictionBadge status={event.predictionStatus} horizon={event.predictionHorizon} />
			{/if}
		</div>
		{#if event.chainId}
			<ChainRef chainId={event.chainId} />
		{/if}
	</div>

	<h3 class="mt-3 font-bold text-balance">{event.title}</h3>
	<p class="mt-1 text-sm text-ink-soft">
		{event.speaker} · {event.platformName || event.platformSlug}
	</p>

	{#if event.excerpt}
		<p class="mt-3 text-sm text-pretty text-ink-soft italic">
			"{event.excerpt.slice(0, 200)}{event.excerpt.length > 200 ? '…' : ''}"
		</p>
	{/if}

	{#if event.resolutionNotes}
		<p class="mt-3 text-xs text-pretty text-ink-soft">
			Resolution: {event.resolutionNotes}
			{#if event.resolvedAt}
				· {new Date(event.resolvedAt).toLocaleDateString()}
			{/if}
		</p>
	{/if}

	<p class="mt-3 text-xs text-ink-soft">
		<!-- eslint-disable svelte/no-navigation-without-resolve -- external source -->
		<a href={event.sourceUrl} class="underline hover:text-accent" target="_blank" rel="noopener"
			>Original source</a
		>
	</p>
</article>
