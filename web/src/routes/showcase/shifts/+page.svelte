<script lang="ts">
	import { Badge, Button } from '$lib/components/ui';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import InsightCard from '$lib/components/showcase/InsightCard.svelte';
	import { lennyBatch } from '$lib/data/showcase/index.js';

	const pairs = $derived.by(() => {
		const max = Math.max(lennyBatch.shiftOld.length, lennyBatch.shiftNew.length);
		const rows: { old?: (typeof lennyBatch.shiftOld)[0]; neu?: (typeof lennyBatch.shiftNew)[0] }[] =
			[];
		for (let i = 0; i < max; i++) {
			rows.push({
				old: lennyBatch.shiftOld[i],
				neu: lennyBatch.shiftNew[i]
			});
		}
		return rows;
	});
</script>

<div class="min-h-screen bg-surface text-ink">
	<SiteHeader />
	<header class="border-b border-border bg-surface-muted">
		<div class="mx-auto max-w-6xl px-6 py-14">
			<Badge variant="neutral">Shift gallery</Badge>
			<h1 class="mt-6 text-4xl font-black tracking-tight">Old way ↔ new way</h1>
			<p class="mt-4 max-w-2xl text-lg text-pretty text-ink-soft">
				Every insight tagged <code class="text-sm">landingSlot: shift-old</code> or
				<code class="text-sm">shift-new</code> from the Lenny batch — surfaced where persona pages and
				mental-model sections will pull from.
			</p>
			<div class="mt-6">
				<Button href="/showcase/mental-model" variant="soft">Mental model (themed)</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-6xl space-y-12 px-6 py-16">
		{#each pairs as row, i (i)}
			<div class="grid gap-6 lg:grid-cols-2">
				<div>
					<p class="mb-3 text-xs font-bold tracking-widest text-ink-soft uppercase">The old way</p>
					{#if row.old}
						<InsightCard insight={row.old} />
					{:else}
						<p class="text-sm text-ink-soft">—</p>
					{/if}
				</div>
				<div>
					<p class="mb-3 text-xs font-bold tracking-widest text-accent uppercase">The new way</p>
					{#if row.neu}
						<InsightCard insight={row.neu} />
					{:else}
						<p class="text-sm text-ink-soft">—</p>
					{/if}
				</div>
			</div>
		{/each}
	</main>

	<SiteFooter />
</div>
