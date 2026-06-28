<script lang="ts">
	import { resolve } from '$app/paths';
	import { Badge, Button, Card } from '$lib/components/ui';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import { lennyBatch } from '$lib/data/showcase/index.js';
	import IconBrain from '~icons/lucide/brain';
	import IconUsers from '~icons/lucide/users';
	import IconQuote from '~icons/lucide/quote';
	import IconArrowLeftRight from '~icons/lucide/arrow-left-right';

	const { stats } = lennyBatch;
</script>

<div class="min-h-screen bg-surface text-ink">
	<SiteHeader />
	<header class="border-b border-border bg-surface-muted">
		<div class="mx-auto max-w-4xl px-6 py-14 text-center">
			<Badge variant="neutral">Chain showcase</Badge>
			<h1 class="mt-6 text-4xl font-black tracking-tight text-balance sm:text-5xl">
				Lenny ingest showcase
			</h1>
			<p class="mt-4 text-lg text-pretty text-ink-soft">
				{stats.episodeCount} episodes on Chain · {stats.shiftOldCount} shift-old · {stats.shiftNewCount}
				shift-new · {stats.wordCount} WORD quotes · {stats.chainIdCount} entries
			</p>
			<p class="mt-2 text-sm text-ink-soft">
				Generated {new Date(lennyBatch.generatedAt).toLocaleDateString()} — regenerate with
				<code class="rounded bg-surface px-1">node web/scripts/build-showcase-data.mjs</code>
			</p>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-6 py-16">
		<div class="grid gap-6 sm:grid-cols-2">
			<Card icon={IconBrain} title="Mental model">
				Old → new transformation by theme. Beliefs, costs, steps, and Chain-backed evidence per
				section.
				<div class="mt-4">
					<Button href="/showcase/mental-model" variant="soft">Open mental model</Button>
				</div>
			</Card>
			<Card icon={IconArrowLeftRight} title="Shift gallery">
				Every shift-old insight paired with the new-world counterpoint from the same batch.
				<div class="mt-4">
					<Button href="/showcase/shifts" variant="soft">Browse shifts</Button>
				</div>
			</Card>
			<Card icon={IconUsers} title="Guest index">
				All {stats.episodeCount} Lenny guests — episode shell, summary, Chain IDs.
				<div class="mt-4">
					<Button href="/showcase/guests" variant="soft">Meet the guests</Button>
				</div>
			</Card>
			<Card icon={IconQuote} title="Voices wall">
				{stats.wordCount} attributed WORD entries ready for voice-card review (QUE-5).
				<div class="mt-4">
					<Button href="/showcase/voices" variant="soft">Read quotes</Button>
				</div>
			</Card>
		</div>

		<p class="mt-12 text-center text-sm text-ink-soft">
			<a href={resolve('/')} class="underline hover:text-accent">← Back to funcode.club</a>
		</p>
	</main>

	<SiteFooter />
</div>
