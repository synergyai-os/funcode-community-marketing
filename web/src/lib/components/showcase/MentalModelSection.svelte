<script lang="ts">
	import type { MentalModelSection, ShowcaseBatch } from '$lib/data/showcase/types';
	import { insightsForSection } from '$lib/data/showcase/index.js';
	import InsightCard from './InsightCard.svelte';
	import IconArrowLeftRight from '~icons/lucide/arrow-left-right';

	type Props = {
		section: MentalModelSection;
		batch: ShowcaseBatch;
	};

	let { section, batch }: Props = $props();

	let mode = $state<'old' | 'new'>('old');

	const evidence = $derived(insightsForSection(batch, section.id, 2));
</script>

<section class="rounded-card border border-border bg-surface p-8 sm:p-10">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<h3 class="text-2xl font-black tracking-tight">{section.title}</h3>
		<div
			class="inline-flex rounded-full border border-border bg-surface-muted p-1"
			role="tablist"
			aria-label="{section.title} — old vs new"
		>
			<button
				type="button"
				role="tab"
				aria-selected={mode === 'old'}
				class={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${mode === 'old' ? 'bg-surface text-ink shadow-sm' : 'text-ink-soft hover:text-ink'}`}
				onclick={() => (mode = 'old')}
			>
				Old model
			</button>
			<button
				type="button"
				role="tab"
				aria-selected={mode === 'new'}
				class={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${mode === 'new' ? 'bg-accent text-white shadow-sm' : 'text-ink-soft hover:text-ink'}`}
				onclick={() => (mode = 'new')}
			>
				New model
			</button>
		</div>
	</div>

	<div class="mt-6 grid gap-6 lg:grid-cols-2">
		<div>
			<p class="text-xs font-bold tracking-widest text-ink-soft uppercase">
				{mode === 'old' ? 'Old headline' : 'New headline'}
			</p>
			<p class="mt-2 text-lg font-bold text-pretty">
				{mode === 'old' ? section.oldHeadline : section.newHeadline}
			</p>
			<p class="mt-4 text-sm text-pretty text-ink-soft">
				<span class="font-semibold text-ink">Belief:</span>
				{mode === 'old' ? section.oldBelief : section.newBelief}
			</p>
		</div>
		<div class="rounded-card border border-dashed border-border bg-surface-muted p-5">
			<p class="text-xs font-bold tracking-widest text-ink-soft uppercase">
				Cost of not transforming
			</p>
			<p class="mt-2 text-sm text-pretty text-ink-soft">{section.costOfWaiting}</p>
			<p class="mt-4 text-xs font-bold tracking-widest text-ink-soft uppercase">
				Steps to transform
			</p>
			<ol class="mt-2 list-decimal space-y-1 pl-4 text-sm text-ink-soft">
				{#each section.transformSteps as step (step)}
					<li>{step}</li>
				{/each}
			</ol>
		</div>
	</div>

	<div class="mt-8 flex items-center gap-2 text-sm font-medium text-ink-soft">
		<IconArrowLeftRight class="size-4" aria-hidden="true" />
		Evidence from Lenny guests ({mode === 'old' ? 'shift-old' : 'shift-new'} on Chain)
	</div>
	<div class="mt-4 grid gap-4 sm:grid-cols-2">
		{#if mode === 'old'}
			{#each evidence.old as ins (ins.chainId)}
				<InsightCard insight={ins} />
			{:else}
				<p class="text-sm text-ink-soft">No shift-old cards matched this theme yet.</p>
			{/each}
		{:else}
			{#each evidence.neu as ins (ins.chainId)}
				<InsightCard insight={ins} />
			{:else}
				<p class="text-sm text-ink-soft">No shift-new cards matched this theme yet.</p>
			{/each}
		{/if}
	</div>
</section>
