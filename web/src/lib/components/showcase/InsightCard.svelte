<script lang="ts">
	import type { ShowcaseInsight } from '$lib/data/showcase/types';
	import ChainRef from './ChainRef.svelte';
	import SourceDateBadge from '$lib/components/timeline/SourceDateBadge.svelte';

	type Props = {
		insight: ShowcaseInsight;
	};

	let { insight }: Props = $props();
</script>

<article class="rounded-card border border-border bg-surface p-6">
	<div class="flex flex-wrap items-start justify-between gap-2">
		<h4 class="text-base font-bold text-balance">{insight.title}</h4>
		<div class="flex flex-wrap items-center gap-2">
			<SourceDateBadge
				sourcePublishedAt={insight.sourcePublishedAt}
				ingestedAt={insight.ingestedAt}
				compact
			/>
			<ChainRef chainId={insight.chainId} />
		</div>
	</div>
	<p class="mt-3 text-sm text-pretty text-ink-soft">{insight.description}</p>
	<blockquote class="mt-4 border-l-2 border-accent pl-4 text-sm text-pretty italic text-ink">
		"{insight.excerpt.slice(0, 220)}{insight.excerpt.length > 220 ? '…' : ''}"
	</blockquote>
	<p class="mt-3 text-xs text-ink-soft">
		— {insight.guest} ·
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external YouTube source -->
		<a href={insight.sourceUrl} class="underline hover:text-accent" target="_blank" rel="noopener"
			>Lenny's Podcast</a
		>
	</p>
</article>
