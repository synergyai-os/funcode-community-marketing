<script lang="ts">
	import { resolve } from '$app/paths';
	import { Badge, Button } from '$lib/components/ui';
	import type { AgendaItem } from '$lib/data/meetups';

	type Props = {
		items: AgendaItem[];
		totalMinutes: number;
	};

	let { items, totalMinutes }: Props = $props();

	const sorted = $derived([...items].sort((a, b) => a.order - b.order));
</script>

<section aria-labelledby="agenda-heading">
	<h2 id="agenda-heading" class="text-sm font-bold tracking-widest text-ink-soft uppercase">
		Agenda · {totalMinutes} min total
	</h2>
	<ol class="mt-6 space-y-6">
		{#each sorted as item (item.order)}
			<li class="relative rounded-card border border-border bg-surface p-5 pl-12">
				<span
					class="absolute top-5 left-4 grid size-7 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent-strong"
					aria-hidden="true"
				>
					{item.order}
				</span>
				<div class="flex flex-wrap items-start justify-between gap-2">
					<h3 class="font-bold text-balance">{item.title}</h3>
					<Badge variant="neutral">{item.durationMinutes} min</Badge>
				</div>
				<p class="mt-2 text-sm text-pretty text-ink-soft">{item.description}</p>
				{#if item.guideSlug}
					<div class="mt-3">
						<Button href={resolve(`/guides/${item.guideSlug}`)} variant="soft" size="sm">
							Open guide →
						</Button>
					</div>
				{/if}
			</li>
		{/each}
	</ol>
</section>
