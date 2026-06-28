<script lang="ts">
	import { resolve } from '$app/paths';
	import { Badge } from '$lib/components/ui';
	import SourceDateBadge from '$lib/components/timeline/SourceDateBadge.svelte';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';

	type Props = {
		data: {
			platform: import('$lib/data/media').MediaPlatform;
			episodes: import('$lib/data/media').MediaEpisode[];
		};
	};

	let { data }: Props = $props();
	const { platform, episodes } = $derived(data);
</script>

<svelte:head>
	<title>{platform.name} — FunCode media</title>
</svelte:head>

<div class="min-h-screen bg-surface text-ink">
	<SiteHeader />
	<header class="border-b border-border bg-surface-muted">
		<div class="mx-auto max-w-3xl px-6 py-14">
			<Badge variant="neutral">{platform.kind}</Badge>
			<h1 class="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{platform.name}</h1>
			<p class="mt-3 text-pretty text-ink-soft">{platform.tagline}</p>
			{#if platform.hosts.length > 0}
				<p class="mt-2 text-sm text-ink-soft">Hosts: {platform.hosts.join(' · ')}</p>
			{/if}
			{#if platform.landId}
				<p class="mt-1 text-xs text-ink-soft">Chain: {platform.landId}</p>
			{/if}
		</div>
	</header>

	<main class="mx-auto max-w-3xl px-6 py-12">
		<section>
			<h2 class="text-sm font-bold tracking-widest text-ink-soft uppercase">Channels</h2>
			<ul class="mt-4 flex flex-wrap gap-2">
				{#each platform.channels as ch (ch.label)}
					<li>
						{#if ch.url}
							<!-- eslint-disable svelte/no-navigation-without-resolve -- external channel URL -->
							<a
								href={ch.url}
								target="_blank"
								rel="noopener noreferrer"
								class="rounded-full border border-border bg-surface px-3 py-1 text-sm hover:border-accent"
							>
								{ch.label}
							</a>
							<!-- eslint-enable svelte/no-navigation-without-resolve -->
						{:else}
							<span class="rounded-full border border-border px-3 py-1 text-sm text-ink-soft">
								{ch.label}
							</span>
						{/if}
					</li>
				{/each}
			</ul>
		</section>

		<section class="mt-12">
			<h2 class="text-sm font-bold tracking-widest text-ink-soft uppercase">
				Episodes ({episodes.length})
			</h2>
			{#if episodes.length === 0}
				<p class="mt-4 text-ink-soft">No episodes ingested yet for this platform.</p>
			{:else}
				<ul class="mt-6 space-y-6">
					{#each episodes as ep (ep.videoId)}
						<li class="rounded-xl border border-border bg-surface p-5">
							<div class="flex flex-wrap items-start justify-between gap-2">
								<p class="font-semibold">{ep.guest}</p>
								<SourceDateBadge
									sourcePublishedAt={ep.sourcePublishedAt}
									ingestedAt={ep.ingestedAt}
									compact
								/>
							</div>
							<p class="mt-1 text-sm text-ink-soft">{ep.title}</p>
							<p class="mt-2 line-clamp-2 text-sm text-pretty text-ink-soft">{ep.summary}</p>
							<div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-ink-soft">
								<span>{ep.insightCount} insights · {ep.wordCount} words</span>
								<span class="rounded bg-surface-muted px-2 py-0.5">{ep.status}</span>
								{#if ep.committed && ep.episodeIns}
									<span>{ep.episodeIns}</span>
								{/if}
							</div>
							<!-- eslint-disable svelte/no-navigation-without-resolve -- external episode source -->
							<a
								href={ep.sourceUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="mt-3 inline-block text-sm text-accent underline"
							>
								Source
							</a>
							<!-- eslint-enable svelte/no-navigation-without-resolve -->
						</li>
					{/each}
				</ul>
			{/if}
		</section>

		<p class="mt-12 text-sm text-ink-soft">
			<a href={resolve('/media')} class="underline hover:text-accent">← All platforms</a>
		</p>
	</main>

	<SiteFooter />
</div>
