<script lang="ts">
	import { Badge, Button, TestimonialDeck } from '$lib/components/ui';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import { lennyBatch } from '$lib/data/showcase/index.js';
	import { sourceLabelForUrl } from '$lib/data/voices-utils.js';

	const deckItems = $derived(
		lennyBatch.words.map((w) => ({
			quote: w.quote,
			name: w.guest,
			role: w.label,
			sourceHref: w.sourceUrl,
			sourceLabel: sourceLabelForUrl(w.sourceUrl),
			variant: 'voice' as const,
			chainId: w.chainId
		}))
	);
</script>

<div class="min-h-screen bg-surface text-ink">
	<SiteHeader />
	<header class="border-b border-border bg-surface-muted">
		<div class="mx-auto max-w-4xl px-6 py-14 text-center">
			<Badge variant="neutral">Voices wall</Badge>
			<h1 class="mt-6 text-4xl font-black tracking-tight">In their words</h1>
			<p class="mt-4 text-lg text-pretty text-ink-soft">
				{lennyBatch.stats.wordCount} WORD entries from the batch — preview before QUE-5 voice-card merge.
			</p>
			<Button href="/showcase/guests" variant="soft" class="mt-6">Guest index</Button>
		</div>
	</header>

	<main class="py-12">
		<TestimonialDeck items={deckItems} ariaLabel="Lenny batch voice quotes" />
	</main>

	<SiteFooter />
</div>
