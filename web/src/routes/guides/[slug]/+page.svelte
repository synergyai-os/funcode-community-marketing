<script lang="ts">
	import { resolve } from '$app/paths';
	import { Badge, Button } from '$lib/components/ui';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import { getJoinContext } from '$lib/context/join';

	type Props = {
		data: { guide: import('$lib/data/guides').Guide };
	};

	let { data }: Props = $props();
	const guide = $derived(data.guide);
	const join = getJoinContext();
</script>

<svelte:head>
	<title>{guide.title} — FunCode Guides</title>
</svelte:head>

<div class="min-h-screen bg-surface text-ink">
	<SiteHeader />
	<PageHeader backHref="/guides" backLabel="All guides" eyebrow="Guide" title={guide.title} />

	<main class="mx-auto max-w-3xl px-6 py-12">
		<p class="text-lg text-pretty text-ink-soft">{guide.description}</p>

		<div class="mt-4 flex flex-wrap gap-2">
			<Badge variant={guide.status === 'interactive' ? 'accent' : 'neutral'}>
				{guide.status === 'interactive' ? 'Interactive' : 'Placeholder'}
			</Badge>
			<Badge variant="neutral">{guide.duration}</Badge>
		</div>

		{#if guide.status === 'interactive'}
			<div class="mt-8 rounded-card border border-accent-soft bg-accent-soft/30 p-6">
				<p class="font-semibold text-ink">Ready to run during a meetup</p>
				<p class="mt-2 text-sm text-pretty text-ink-soft">
					This guide works live in the workshop and stays available here when you're done. Join free
					to save progress later.
				</p>
				<Button class="mt-4" variant="primary" onclick={() => join.openJoin()}
					>Join to track progress</Button
				>
			</div>
		{/if}

		<ol class="mt-10 space-y-6">
			{#each guide.steps as step (step.order)}
				<li class="rounded-card border border-border bg-surface p-5">
					<div class="flex items-baseline gap-3">
						<span class="text-sm font-bold text-accent">Step {step.order}</span>
						<h2 class="font-bold">{step.title}</h2>
					</div>
					<p class="mt-2 text-sm text-pretty text-ink-soft">{step.body}</p>
				</li>
			{/each}
		</ol>

		<div class="mt-10 flex flex-wrap gap-3">
			<Button href={resolve('/meetups/funcode-meetup-santander-1')} variant="soft">
				Santander meetup agenda →
			</Button>
			<Button href={resolve('/guides')} variant="ghost">All guides</Button>
		</div>
	</main>

	<SiteFooter />
</div>
