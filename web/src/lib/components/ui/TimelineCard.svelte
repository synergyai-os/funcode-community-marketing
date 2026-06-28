<script lang="ts">
	import { Badge } from '$lib/components/ui';
	import ChainRef from '$lib/components/showcase/ChainRef.svelte';
	import PredictionBadge from '$lib/components/ui/PredictionBadge.svelte';
	import type { TimelineEvent } from '$lib/data/timeline';
	import { timelineGenerated } from '$lib/data/timeline';
	import { formatSourceDate } from '$lib/utils/format-date';

	type Props = {
		event: TimelineEvent;
		side: 'left' | 'right';
	};

	let { event, side }: Props = $props();

	const topicLabel = $derived(
		event.topic
			? ((timelineGenerated.topicLabels as Record<string, string>)[event.topic] ?? event.topic)
			: null
	);

	const sourceDate = $derived(formatSourceDate(event.sourcePublishedAt));
	const ingestDate = $derived(formatSourceDate(event.ingestedAt));
	const displayDate = $derived(sourceDate ?? ingestDate);
	const dateIso = $derived(event.sourcePublishedAt ?? event.ingestedAt ?? undefined);
</script>

<article
	class={`group relative max-w-md rounded-card border border-border bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lg ${
		side === 'left' ? 'ml-auto md:mr-[calc(50%+1.5rem)]' : 'mr-auto md:ml-[calc(50%+1.5rem)]'
	}`}
>
	<div
		class={`absolute top-8 hidden size-3 rounded-full border-2 border-accent bg-surface md:block ${
			side === 'left' ? '-right-[calc(1.5rem+0.375rem)]' : '-left-[calc(1.5rem+0.375rem)]'
		}`}
		aria-hidden="true"
	></div>

	<div class="flex flex-wrap items-start justify-between gap-2">
		<div class="flex flex-wrap gap-2">
			<Badge variant="neutral">{event.kind}</Badge>
			{#if topicLabel}
				<Badge variant="accent">{topicLabel}</Badge>
			{/if}
			{#if event.kind === 'prediction' && event.predictionStatus}
				<PredictionBadge status={event.predictionStatus} horizon={event.predictionHorizon} />
			{/if}
		</div>
		{#if event.chainId}
			<ChainRef chainId={event.chainId} />
		{/if}
	</div>

	<h3 class="mt-3 font-bold text-balance">{event.title}</h3>
	{#if displayDate && dateIso}
		<time
			class="mt-2 block text-sm font-semibold text-ink tabular-nums"
			datetime={dateIso}
			title={sourceDate
				? 'Original source publication date'
				: 'Ingested to FunCode (source date unknown)'}
		>
			{sourceDate ? displayDate : `Ingested · ${displayDate}`}
		</time>
	{/if}
	<p class="mt-1 text-sm text-ink-soft">
		{event.speaker} · {event.platformName || event.platformSlug}
	</p>

	{#if event.excerpt}
		<p class="mt-3 text-sm text-pretty text-ink-soft italic">
			"{event.excerpt.slice(0, 220)}{event.excerpt.length > 220 ? '…' : ''}"
		</p>
	{/if}

	{#if event.resolutionNotes}
		<p class="mt-3 rounded-card bg-surface-muted px-3 py-2 text-xs text-pretty text-ink-soft">
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
