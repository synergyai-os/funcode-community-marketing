<script lang="ts">
	import { resolve } from '$app/paths';
	import { Badge, Button } from '$lib/components/ui';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import { programs, shareGrantByToken } from '$lib/data/community';
	import { programVisible } from '$lib/analytics/feature-flags';

	const visiblePrograms = $derived(programs().filter((p) => programVisible(p.tier)));

	const kindLabel: Record<string, string> = {
		guide: 'Guide',
		cohort: 'Cohort',
		workshop: 'Workshop',
		event: 'Event',
		meetup: 'Meetup',
		training: 'Training',
		private_session: 'Private'
	};
</script>

<svelte:head>
	<title>Programs — FunCode</title>
</svelte:head>

<div class="min-h-screen bg-surface text-ink">
	<SiteHeader />
	<PageHeader backHref="/" backLabel="Home" eyebrow="Programs" title="Learn your way" />

	<main class="mx-auto max-w-4xl space-y-6 px-6 py-14">
		<p class="max-w-2xl text-pretty text-ink-soft">
			Guides, cohorts, workshops, and more — one model, many kinds. Free programs ship first;
			premium stays behind feature flags until ready.
		</p>
		{#each visiblePrograms as program (program.slug)}
			<article class="rounded-card border border-border bg-surface p-6">
				<div class="flex flex-wrap items-start justify-between gap-3">
					<div>
						<div class="flex flex-wrap gap-2">
							<Badge variant="neutral">{kindLabel[program.kind] ?? program.kind}</Badge>
							<Badge variant={program.tier === 'free' ? 'accent' : 'solid'}>{program.tier}</Badge>
						</div>
						<h2 class="mt-3 text-xl font-bold">{program.title}</h2>
						<p class="mt-1 text-sm text-ink-soft">{program.tagline}</p>
					</div>
					<span class="text-xs text-ink-soft">{program.duration}</span>
				</div>
				<p class="mt-4 text-pretty text-ink-soft">{program.description}</p>
				<div class="mt-4 flex flex-wrap gap-2">
					{#each program.labelSlugs as slug (slug)}
						<Badge variant="neutral">{slug}</Badge>
					{/each}
				</div>
				<div class="mt-4">
					<Button href={resolve(`/programs/${program.slug}`)} variant="soft">Open</Button>
				</div>
			</article>
		{/each}

		<section class="rounded-card border border-dashed border-border p-6 text-sm text-ink-soft">
			<h2 class="font-bold text-ink">Try a shared collection</h2>
			<p class="mt-2">
				Demo link —
				<a
					href={resolve(`/share/${shareGrantByToken('starter-demo')?.token ?? 'starter-demo'}`)}
					class="text-accent underline">Starter curriculum</a
				>
			</p>
		</section>
	</main>

	<SiteFooter />
</div>
