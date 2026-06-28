<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button, Card } from '$lib/components/ui';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import { personas } from '$lib/data/personas';
	import IconUser from '~icons/lucide/user';
</script>

<svelte:head>
	<title>For you — FunCode</title>
</svelte:head>

<div class="min-h-screen bg-surface text-ink">
	<SiteHeader />
	<PageHeader backHref="/" backLabel="Home" eyebrow="Personas" title="Find your lens" />

	<main class="mx-auto max-w-4xl px-6 py-14">
		<p class="text-pretty text-ink-soft">
			Pick the persona closest to your day job — each page filters voices, insights, and timeline
			moments for your context.
		</p>
		<div class="mt-8 grid gap-6 sm:grid-cols-2">
			{#each personas as persona (persona.id)}
				<Card icon={IconUser} title={persona.label}>
					<p class="text-sm text-ink-soft">{persona.tagline}</p>
					<div class="mt-4">
						<Button href={resolve(`/for/${persona.slug}`)} variant="soft">Open</Button>
					</div>
				</Card>
			{/each}
		</div>
	</main>

	<SiteFooter />
</div>
