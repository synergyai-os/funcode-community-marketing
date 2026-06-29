<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { NavGroup } from '$lib/data/site-nav';
	import NavPillar from './NavPillar.svelte';

	type Props = {
		group: NavGroup;
		onNavigate?: () => void;
		headingClass?: string;
	};

	let { group, onNavigate, headingClass = '' }: Props = $props();
</script>

<section class="space-y-2" aria-labelledby="nav-group-{group.id}">
	<h2
		id="nav-group-{group.id}"
		class={`px-2 pb-1 text-xs font-bold tracking-widest text-muted uppercase ${headingClass}`}
	>
		{group.label}
	</h2>
	<ul class="divide-y divide-border px-2" role="list">
		{#each group.items as item (item.href)}
			<li>
				<NavPillar {...item} {onNavigate} />
			</li>
		{/each}
	</ul>
</section>
