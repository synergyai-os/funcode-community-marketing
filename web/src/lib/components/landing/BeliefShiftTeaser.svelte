<script lang="ts">
	import { resolve } from '$app/paths';
	import { Badge, Button } from '$lib/components/ui';
	import ChainRef from '$lib/components/showcase/ChainRef.svelte';
	import { homepageShiftPair } from '$lib/data/persona-insights.js';

	const pair = homepageShiftPair();
</script>

{#if pair}
	<section class="border-y border-border bg-surface-muted">
		<div class="mx-auto max-w-4xl px-6 py-20 sm:py-24">
			<div class="text-center">
				<Badge variant="neutral">The shift</Badge>
				<h2 class="mt-6 text-3xl font-black tracking-tight text-balance sm:text-4xl">
					Operators we learn from already live here
				</h2>
				<p class="mt-4 text-lg text-pretty text-ink-soft">
					The old model vs what they're doing today — Lenny, 20VC, Lex, and more. Sourced from
					Chain, not vibes.
				</p>
			</div>

			<div class="mt-12 grid gap-6 lg:grid-cols-2">
				<article class="rounded-card border border-border bg-surface p-6">
					<p class="text-xs font-bold tracking-widest text-ink-soft uppercase">The old way</p>
					<h3 class="mt-2 text-lg font-bold text-balance">{pair.old.title}</h3>
					<p class="mt-3 text-sm text-pretty text-ink-soft">{pair.old.description}</p>
					<div class="mt-4 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
						<span>{pair.old.guest}</span>
						<ChainRef chainId={pair.old.chainId} />
					</div>
				</article>
				<article class="rounded-card border border-accent/40 bg-accent-soft/30 p-6">
					<p class="text-xs font-bold tracking-widest text-accent uppercase">The new way</p>
					<h3 class="mt-2 text-lg font-bold text-balance">{pair.neu.title}</h3>
					<p class="mt-3 text-sm text-pretty text-ink-soft">{pair.neu.description}</p>
					<div class="mt-4 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
						<span>{pair.neu.guest}</span>
						<ChainRef chainId={pair.neu.chainId} />
					</div>
				</article>
			</div>

			<div class="mt-10 text-center">
				<Button href={resolve('/showcase/mental-model')} variant="primary"
					>See the full mental model</Button
				>
				<p class="mt-4 text-sm text-ink-soft">
					<a href={resolve('/media')} class="underline hover:text-accent">Browse all sources →</a>
				</p>
			</div>
		</div>
	</section>
{/if}
