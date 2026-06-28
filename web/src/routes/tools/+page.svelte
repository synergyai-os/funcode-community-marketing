<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button, Card } from '$lib/components/ui';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import { workflowTools } from '$lib/data/media';
	import IconWrench from '~icons/lucide/wrench';
</script>

<svelte:head>
	<title>Tools — FunCode</title>
</svelte:head>

<div class="min-h-screen bg-surface text-ink">
	<SiteHeader />
	<PageHeader backHref="/media" backLabel="Sources" eyebrow="Landscape" title="Workflow tools" />

	<main class="mx-auto max-w-4xl px-6 py-14">
		<p class="text-pretty text-ink-soft">
			Tools leaders mention when shipping with AI — not a flat stack list, but quotes in context.
		</p>
		<div class="mt-8 grid gap-6 sm:grid-cols-2">
			{#each workflowTools as tool (tool.slug)}
				<Card icon={IconWrench} title={tool.name}>
					<p class="text-sm text-ink-soft">{tool.tagline}</p>
					<div class="mt-4">
						<Button href={resolve(`/tools/${tool.slug}`)} variant="soft">View tool</Button>
					</div>
				</Card>
			{/each}
		</div>
	</main>

	<SiteFooter />
</div>
