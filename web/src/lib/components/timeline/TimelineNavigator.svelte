<script lang="ts">
	import type { TimelineEvent } from '$lib/data/timeline';

	type Props = {
		years: number[];
		selectedYear: number | null;
		events: TimelineEvent[];
		onSelectYear: (year: number | null) => void;
	};

	let { years, selectedYear, events, onSelectYear }: Props = $props();

	const countsByYear = $derived.by(() => {
		const counts: Record<number, number> = {};
		for (const y of years) counts[y] = 0;
		for (const e of events) {
			if (e.year != null && e.year in counts) counts[e.year] = (counts[e.year] ?? 0) + 1;
		}
		return counts;
	});
</script>

<nav class="overflow-x-auto pb-2" aria-label="Timeline by year">
	<ol class="flex min-w-max items-end gap-1 px-1">
		<li>
			<button
				type="button"
				class="rounded-full px-3 py-1.5 text-sm font-medium transition {selectedYear === null
					? 'bg-accent text-white'
					: 'bg-surface-muted text-ink-soft hover:text-ink'}"
				onclick={() => onSelectYear(null)}
			>
				All years
			</button>
		</li>
		{#each years as year (year)}
			<li class="flex flex-col items-center gap-1">
				<span class="text-xs font-medium text-muted">{countsByYear[year] ?? 0}</span>
				<button
					type="button"
					class="rounded-full px-3 py-1.5 text-sm font-semibold transition {selectedYear === year
						? 'bg-accent text-white'
						: 'bg-surface-muted text-ink hover:bg-accent-soft'}"
					aria-pressed={selectedYear === year}
					onclick={() => onSelectYear(year)}
				>
					{year}
				</button>
			</li>
		{/each}
	</ol>
</nav>
