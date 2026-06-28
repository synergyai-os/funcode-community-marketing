<script lang="ts">
	import { resolve } from '$app/paths';
	import { Badge, Button } from '$lib/components/ui';
	import ChainRef from '$lib/components/showcase/ChainRef.svelte';
	import {
		newLaneForPersona,
		personaHasIngestInsights,
		shiftOldForPersona
	} from '$lib/data/persona-insights.js';
	import type { PersonaId } from '$lib/data/personas.js';

	type Props = {
		personaId: PersonaId;
	};

	let { personaId }: Props = $props();

	const shiftNew = $derived(newLaneForPersona(personaId, 3));
	const shiftOld = $derived(shiftOldForPersona(personaId, 2));
	const visible = $derived(personaHasIngestInsights(personaId));
</script>

{#if visible}
	<section class="border-y border-border bg-surface-muted">
		<div class="mx-auto max-w-4xl px-6 py-16">
			<div class="text-center">
				<Badge variant="neutral">Belief shift</Badge>
				<h2 class="mt-4 text-2xl font-black tracking-tight text-balance sm:text-3xl">
					What leaders in your lane are doing differently
				</h2>
				<p class="mt-3 text-pretty text-ink-soft">
					From Lenny's Podcast — tagged on Chain for this persona.
				</p>
			</div>

			{#if shiftNew.length > 0}
				<h3 class="mt-10 text-sm font-bold tracking-widest text-accent uppercase">The new way</h3>
				<ul class="mt-4 space-y-4">
					{#each shiftNew as ins (ins.chainId)}
						<li class="rounded-card border border-border bg-surface p-5">
							<div class="flex flex-wrap items-start justify-between gap-2">
								<h4 class="font-bold text-balance">{ins.title}</h4>
								<ChainRef chainId={ins.chainId} />
							</div>
							<p class="mt-2 text-sm text-pretty text-ink-soft">{ins.description}</p>
							<p class="mt-2 text-xs text-ink-soft">— {ins.guest}</p>
						</li>
					{/each}
				</ul>
			{/if}

			{#if shiftOld.length > 0}
				<h3 class="mt-10 text-sm font-bold tracking-widest text-ink-soft uppercase">
					Leaving behind
				</h3>
				<ul class="mt-4 space-y-3">
					{#each shiftOld as ins (ins.chainId)}
						<li class="rounded-card border border-dashed border-border px-5 py-4">
							<div class="flex flex-wrap items-center justify-between gap-2">
								<span class="text-sm font-semibold">{ins.title}</span>
								<ChainRef chainId={ins.chainId} />
							</div>
						</li>
					{/each}
				</ul>
			{/if}

			<div class="mt-10 text-center">
				<Button href={resolve('/showcase/mental-model')} variant="soft"
					>Full transformation map</Button
				>
			</div>
		</div>
	</section>
{/if}
