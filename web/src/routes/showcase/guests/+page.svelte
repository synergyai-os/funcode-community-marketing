<script lang="ts">
	import { Badge, Button } from '$lib/components/ui';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import ChainRef from '$lib/components/showcase/ChainRef.svelte';
	import { lennyBatch } from '$lib/data/showcase/index.js';
</script>

<div class="min-h-screen bg-surface text-ink">
	<SiteHeader />
	<header class="border-b border-border bg-surface-muted">
		<div class="mx-auto max-w-4xl px-6 py-14">
			<Badge variant="neutral">Guest index</Badge>
			<h1 class="mt-6 text-4xl font-black tracking-tight">Lenny's Podcast — batch guests</h1>
			<p class="mt-4 text-lg text-pretty text-ink-soft">
				Episode shells and landscape entries — each links to YouTube and Chain.
			</p>
			<Button href="/showcase" variant="soft" class="mt-6">Showcase home</Button>
		</div>
	</header>

	<main class="mx-auto max-w-4xl space-y-6 px-6 py-16">
		{#each lennyBatch.episodes as ep (ep.videoId)}
			<article class="rounded-card border border-border bg-surface p-8">
				<div class="flex flex-wrap items-start justify-between gap-3">
					<div>
						<h2 class="text-xl font-bold text-balance">{ep.guest}</h2>
						<p class="mt-1 text-sm text-ink-soft">{ep.title}</p>
					</div>
					<div class="flex flex-wrap gap-2">
						<ChainRef chainId={ep.episodeIns} />
						<ChainRef chainId={ep.guestLand} />
					</div>
				</div>
				<p class="mt-4 text-pretty text-ink-soft">{ep.summary}</p>
				<p class="mt-4 text-xs text-ink-soft">
					{ep.insightCount} learnings · {ep.wordCount} WORDs ·
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external YouTube -->
					<a href={ep.sourceUrl} class="underline hover:text-accent" target="_blank" rel="noopener"
						>Watch episode</a
					>
				</p>
			</article>
		{/each}
	</main>

	<SiteFooter />
</div>
