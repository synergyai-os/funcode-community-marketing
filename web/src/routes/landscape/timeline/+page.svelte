<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import TimelineChapterScroll from '$lib/components/timeline/TimelineChapterScroll.svelte';
	import { timelineGenerated } from '$lib/data/timeline';
	import { SLICE_TOPICS, verticalSliceEvents } from '$lib/data/timeline/slice';

	const sliceEvents = $derived(verticalSliceEvents());
	const { stats, speakers, convergence } = $derived(timelineGenerated);

	const sliceConvergence = $derived(
		convergence.filter((row) => (SLICE_TOPICS as readonly string[]).includes(row.topic))
	);
</script>

<svelte:head>
	<title>AI landscape timeline — FunCode</title>
</svelte:head>

<div class="min-h-screen bg-surface text-ink">
	<SiteHeader />
	<PageHeader
		backHref="/media"
		backLabel="Sources"
		eyebrow="Landscape"
		title="AI landscape timeline"
	/>

	<div class="mx-auto max-w-4xl px-6 pb-4">
		<p class="max-w-2xl text-pretty text-ink-soft">
			Scroll through the story year by year — beliefs and predictions anchored to
			<strong>when they were said</strong>, not when we ingested them.
		</p>
		{#if stats.yearSpan}
			<p class="mt-2 text-sm text-ink-soft">
				{sliceEvents.length} moments in this slice · {stats.predictionCount} predictions total ·
				{stats.openPredictions} open · {stats.resolvedTrue} confirmed true
			</p>
		{/if}
	</div>

	<main class="mx-auto max-w-4xl px-6 pb-16 pt-6">
		<TimelineChapterScroll />

		<section class="mt-16 grid gap-8 border-t border-border pt-12 md:grid-cols-2">
			<div class="rounded-card border border-border p-5">
				<h2 class="font-bold">Who to watch</h2>
				<p class="mt-1 text-xs text-ink-soft">Prediction volume + resolution (prototype scoring)</p>
				<ol class="mt-4 space-y-3 text-sm">
					{#each speakers.slice(0, 6) as s (s.name)}
						<li>
							<p class="font-semibold">{s.name}</p>
							<p class="text-xs text-ink-soft">
								{s.predictions} predictions · {s.beliefs} beliefs · {s.resolvedTrue} true · {s.open}
								open
							</p>
						</li>
					{/each}
				</ol>
			</div>

			<div class="rounded-card border border-border p-5">
				<h2 class="font-bold">Convergence</h2>
				<p class="mt-1 text-xs text-ink-soft">Multiple voices, same topic</p>
				<ul class="mt-4 space-y-3 text-sm">
					{#each sliceConvergence as row (row.topic)}
						<li>
							<p class="font-medium">{row.label}</p>
							<p class="text-xs text-ink-soft">
								{row.speakers.join(', ')} · {row.alignment}
							</p>
						</li>
					{:else}
						<li class="text-ink-soft">Need more multi-speaker topics in this slice.</li>
					{/each}
				</ul>
			</div>
		</section>

		<div class="mt-10 flex justify-center">
			<Button href={resolve('/media')} variant="soft">Back to sources</Button>
		</div>
	</main>

	<SiteFooter />
</div>
