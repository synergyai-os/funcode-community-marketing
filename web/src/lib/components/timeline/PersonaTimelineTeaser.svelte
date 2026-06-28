<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui';
	import { predictionsForPersona } from '$lib/data/timeline';
	import type { PersonaId } from '$lib/data/personas';

	type Props = {
		personaId: PersonaId;
	};

	let { personaId }: Props = $props();

	const predictions = $derived(predictionsForPersona(personaId).slice(0, 3));
	const openCount = $derived(
		predictionsForPersona(personaId).filter((p) => p.predictionStatus === 'open').length
	);
</script>

{#if predictions.length > 0}
	<section class="mt-12 rounded-card border border-border bg-surface-muted p-6">
		<h2 class="text-lg font-bold">AI landscape timeline</h2>
		<p class="mt-2 text-sm text-pretty text-ink-soft">
			What leaders predicted, when they said it, and what's proving true — filtered for your lens.
			{openCount} open prediction{openCount === 1 ? '' : 's'} in your feed.
		</p>
		<ul class="mt-4 space-y-2 text-sm">
			{#each predictions as p (p.id)}
				<li class="text-pretty">
					<span class="font-medium">{p.speaker}:</span>
					{p.title}
					{#if p.sourcePublishedAt}
						<span class="text-ink-soft"> ({new Date(p.sourcePublishedAt).getUTCFullYear()})</span>
					{/if}
				</li>
			{/each}
		</ul>
		<div class="mt-4">
			<Button href={resolve('/landscape/timeline')} variant="soft">Explore full timeline</Button>
		</div>
	</section>
{/if}
