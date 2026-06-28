<script lang="ts">
	import { resolve } from '$app/paths';
	import { Badge, Button, Card } from '$lib/components/ui';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import AiChatGate from '$lib/components/agent/AiChatGate.svelte';
	import { episodesForPlatform, mediaGenerated, mediaPlatforms } from '$lib/data/media';
	import IconRadio from '~icons/lucide/radio';
</script>

<svelte:head>
	<title>Media we learn from — FunCode</title>
</svelte:head>

<div class="min-h-screen bg-surface text-ink">
	<SiteHeader />
	<header class="border-b border-border bg-surface-muted">
		<div class="mx-auto max-w-4xl px-6 py-14 text-center">
			<Badge variant="neutral">Landscape</Badge>
			<h1 class="mt-6 text-4xl font-black tracking-tight text-balance sm:text-5xl">
				Where we learn
			</h1>
			<p class="mt-4 text-lg text-pretty text-ink-soft">
				Platforms, hosts, and channels — not a flat tool list. Guests are people we learn from;
				hosts run the show.
			</p>
			<p class="mt-2 text-sm text-ink-soft">
				{mediaGenerated.stats.episodeCount} episodes ingested ·
				{mediaGenerated.stats.committedCount} on Chain
			</p>
			<div class="mt-6">
				<Button href={resolve('/landscape/timeline')} variant="soft">Explore AI timeline</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-6 py-16">
		<div class="grid gap-6 sm:grid-cols-2">
			{#each mediaPlatforms as platform (platform.slug)}
				{@const eps = episodesForPlatform(platform.slug)}
				<Card icon={IconRadio} title={platform.name}>
					<p class="text-sm text-ink-soft">{platform.tagline}</p>
					{#if platform.hosts.length > 0}
						<p class="mt-2 text-xs text-ink-soft">Hosts: {platform.hosts.join(', ')}</p>
					{/if}
					<p class="mt-2 text-xs font-medium text-ink-soft">
						{eps.length} episode{eps.length === 1 ? '' : 's'} in pipeline
					</p>
					<div class="mt-4">
						<Button href="/media/{platform.slug}" variant="soft">View platform</Button>
					</div>
				</Card>
			{/each}
		</div>

		<p class="mt-12 flex flex-wrap justify-center gap-4 text-sm text-ink-soft">
			<a href={resolve('/tools')} class="underline hover:text-accent">Workflow tools →</a>
			<a href={resolve('/for')} class="underline hover:text-accent">Personas →</a>
		</p>
	</main>

	<SiteFooter />
</div>

<AiChatGate context={{ pageTitle: 'Media sources', pageKind: 'media' }} />
