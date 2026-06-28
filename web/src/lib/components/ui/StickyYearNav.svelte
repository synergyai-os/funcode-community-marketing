<script lang="ts">
	import Button from './Button.svelte';

	type Props = {
		years: number[];
		activeYear: number;
		countsByYear: Record<number, number>;
		onSelectYear: (year: number) => void;
		class?: string;
	};

	let { years, activeYear, countsByYear, onSelectYear, class: className = '' }: Props = $props();
</script>

<nav
	class={`sticky top-0 z-20 -mx-6 border-b border-border bg-surface/90 px-6 py-3 backdrop-blur-md ${className}`}
	aria-label="Timeline chapters by year"
>
	<ol class="mx-auto flex max-w-3xl items-center justify-center gap-2 overflow-x-auto">
		{#each years as year (year)}
			<li>
				<Button
					variant={activeYear === year ? 'primary' : 'soft'}
					size="sm"
					aria-current={activeYear === year ? 'true' : undefined}
					onclick={() => onSelectYear(year)}
				>
					{year}
					<span class="ml-1 opacity-70">({countsByYear[year] ?? 0})</span>
				</Button>
			</li>
		{/each}
	</ol>
</nav>
