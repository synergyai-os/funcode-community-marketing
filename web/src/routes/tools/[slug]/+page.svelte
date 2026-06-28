<script lang="ts">
	import { resolve } from '$app/paths';
	import { Badge } from '$lib/components/ui';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import { platformBySlug } from '$lib/data/media';

	type Props = {
		data: {
			tool: import('$lib/data/media').WorkflowTool;
			quotes: import('$lib/data/media').ToolQuote[];
		};
	};

	let { data }: Props = $props();
	const { tool, quotes } = $derived(data);
</script>

<svelte:head>
	<title>{tool.name} — FunCode tools</title>
</svelte:head>

<div class="min-h-screen bg-surface text-ink">
	<SiteHeader />
	<header class="border-b border-border bg-surface-muted">
		<div class="mx-auto max-w-3xl px-6 py-14">
			<Badge variant="neutral">{tool.category}</Badge>
			<h1 class="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{tool.name}</h1>
			<p class="mt-3 text-pretty text-ink-soft">{tool.tagline}</p>
			{#if tool.url}
				<!-- eslint-disable svelte/no-navigation-without-resolve -- external tool site -->
				<a
					href={tool.url}
					target="_blank"
					rel="noopener noreferrer"
					class="mt-4 inline-block text-sm text-accent underline"
				>
					Official site
				</a>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			{/if}
		</div>
	</header>

	<main class="mx-auto max-w-3xl px-6 py-12">
		<h2 class="text-sm font-bold tracking-widest text-ink-soft uppercase">
			Guest quotes ({quotes.length})
		</h2>
		{#if quotes.length === 0}
			<p class="mt-4 text-ink-soft">
				No linked quotes yet — ingest more episodes or mention this tool in extraction.
			</p>
		{:else}
			<ul class="mt-6 space-y-6">
				{#each quotes as q, i (i)}
					<li class="rounded-xl border border-border bg-surface p-5">
						<blockquote class="text-pretty italic">"{q.text}"</blockquote>
						<p class="mt-3 text-sm font-medium">{q.guest}</p>
						<p class="text-xs text-ink-soft">{q.title}</p>
						{#if q.platformSlug}
							{@const plat = platformBySlug(q.platformSlug)}
							{#if plat}
								<p class="mt-1 text-xs text-ink-soft">via {plat.name}</p>
							{/if}
						{/if}
					</li>
				{/each}
			</ul>
		{/if}

		<p class="mt-12 text-sm text-ink-soft">
			<a href={resolve('/tools')} class="underline hover:text-accent">← All tools</a>
		</p>
	</main>

	<SiteFooter />
</div>
