<script lang="ts">
	import { resolve } from '$app/paths';
	import { Badge, Button, Card } from '$lib/components/ui';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import { guides } from '$lib/data/guides';
	import IconBookOpen from '~icons/lucide/book-open';
	import IconSparkles from '~icons/lucide/sparkles';
</script>

<svelte:head>
	<title>Guides — FunCode</title>
</svelte:head>

<div class="min-h-screen bg-surface text-ink">
	<SiteHeader />

	<header class="border-b border-border bg-surface-muted">
		<div class="mx-auto max-w-4xl px-6 py-14">
			<Badge variant="accent">Interactive</Badge>
			<h1 class="mt-4 text-4xl font-black tracking-tight text-balance">Guides</h1>
			<p class="mt-3 max-w-2xl text-pretty text-ink-soft">
				Step-by-step paths you can run during a meetup and keep using afterward at
				<code class="rounded bg-surface px-1.5 py-0.5 text-sm">/guides</code>. Ship with AI — email,
				auth, design, stack, and more.
			</p>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-6 py-14">
		<div class="grid gap-6 sm:grid-cols-2">
			{#each guides as guide (guide.slug)}
				<Card
					icon={guide.status === 'interactive' ? IconSparkles : IconBookOpen}
					title={guide.title}
				>
					<p class="text-sm text-ink-soft">{guide.tagline}</p>
					<div class="mt-3 flex flex-wrap gap-2">
						<Badge variant={guide.status === 'interactive' ? 'accent' : 'neutral'}>
							{guide.status === 'interactive' ? 'Interactive' : 'Coming soon'}
						</Badge>
						<Badge variant="neutral">{guide.duration}</Badge>
					</div>
					<div class="mt-4">
						<Button href={resolve(`/guides/${guide.slug}`)} variant="soft">Open guide</Button>
					</div>
				</Card>
			{/each}
		</div>
	</main>

	<SiteFooter />
</div>
