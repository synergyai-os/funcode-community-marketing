<script lang="ts">
	import { resolve } from '$app/paths';
	import { Badge, Button, Card } from '$lib/components/ui';
	import { episodesForPlatform, mediaGenerated, mediaPlatforms } from '$lib/data/media';
	import IconRadio from '~icons/lucide/radio';

	/** Featured platforms with at least one ingested episode, then fill from registry. */
	const featured = $derived.by(() => {
		const withEps = mediaPlatforms
			.map((p) => ({ platform: p, count: episodesForPlatform(p.slug).length }))
			.filter((x) => x.count > 0)
			.sort((a, b) => b.count - a.count);

		const seen = new Set(withEps.map((x) => x.platform.slug));
		const rest = mediaPlatforms
			.filter((p) => !seen.has(p.slug))
			.map((p) => ({ platform: p, count: 0 }));

		return [...withEps, ...rest].slice(0, 6);
	});

	const { stats } = mediaGenerated;
</script>

<section class="border-y border-border bg-surface">
	<div class="mx-auto max-w-6xl px-6 py-20 sm:py-24">
		<div class="mx-auto max-w-2xl text-center">
			<Badge variant="neutral">Where we learn</Badge>
			<h2 class="mt-6 text-3xl font-black tracking-tight text-balance sm:text-4xl">
				Platforms, not a flat tool list
			</h2>
			<p class="mt-4 text-lg text-pretty text-ink-soft">
				Podcasts, video, and operators we ingest — hosts run the show, guests teach us how to build
				with AI. {stats.committedCount} episodes on Chain across {stats.platformCount} sources.
			</p>
		</div>

		<div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each featured as { platform, count } (platform.slug)}
				<Card icon={IconRadio} title={platform.name}>
					<p class="text-sm text-ink-soft">{platform.tagline}</p>
					{#if platform.hosts.length > 0}
						<p class="mt-2 text-xs text-ink-soft">
							Hosts: {platform.hosts.join(', ')}
						</p>
					{/if}
					<p class="mt-2 text-xs font-medium text-ink-soft">
						{count} episode{count === 1 ? '' : 's'}
					</p>
					<div class="mt-4">
						<Button href={resolve(`/media/${platform.slug}`)} variant="soft" size="sm">
							View platform
						</Button>
					</div>
				</Card>
			{/each}
		</div>

		<div class="mt-10 text-center">
			<Button href={resolve('/media')} variant="primary">Explore all sources</Button>
		</div>
	</div>
</section>
