<script lang="ts">
	import { Badge, Card, TestimonialDeck } from '$lib/components/ui';
	import { personaById, type PersonaId } from '$lib/data/personas';
	import { displayVoices } from '$lib/data/voices';
	import { voicesToDeckItems } from '$lib/data/voices-utils';

	type Props = {
		/** Lock deck to one persona (persona landing pages). */
		lockedPersonaId?: PersonaId;
		class?: string;
	};

	let { lockedPersonaId, class: className = '' }: Props = $props();

	const catalog = displayVoices();

	const deckItems = $derived.by(() =>
		voicesToDeckItems(catalog, {
			mode: lockedPersonaId ? 'interleaved' : 'one-per-guest',
			personaId: lockedPersonaId
		})
	);

	const hasCatalog = $derived(catalog.length > 0);
</script>

<!--
	Thought-leader voice cards (GLO-11) — same premium shell as #builders (DEC-22,
	DEC-26, INS-32). TestimonialDeck + Testimonial atoms; NOT Marquee, NOT combobox.
-->
<section id="voices" class={`py-20 sm:py-24 ${className}`}>
	<div class="mx-auto max-w-2xl px-6 text-center">
		<Badge variant="neutral">What they say</Badge>
		<h2 class="mt-6 text-3xl font-black tracking-tight text-balance sm:text-4xl">
			{#if lockedPersonaId}
				{personaById(lockedPersonaId).emoji}
				{personaById(lockedPersonaId).label} — in their words
			{:else}
				Thought leaders building in public
			{/if}
		</h2>
		<p class="mt-4 text-lg text-pretty text-ink-soft">
			{#if lockedPersonaId}
				{personaById(lockedPersonaId).tagline} Swipe through.
			{:else}
				Attributed quotes from Lenny's Podcast guests — leaders operating in the AI world
				today. Swipe through.
			{/if}
		</p>
	</div>

	{#if deckItems.length > 0}
		<div class="mt-12">
			<TestimonialDeck items={deckItems} ariaLabel="Thought leader quotes" />
		</div>
	{:else if lockedPersonaId}
		<div class="mx-auto mt-12 max-w-xl px-6 text-center text-ink-soft">
			<p>Voice cards for this persona are queued — ingest + QUE-5 attribution review.</p>
		</div>
	{:else if !hasCatalog}
		<div class="mx-auto mt-12 max-w-xl px-6">
			<Card title="Thought leaders, soon">
				Verbatim podcast quotes with source links — staged on Chain, waiting on QUE-5
				attribution sign-off before we publish publicly. No fabricated names here.
			</Card>
		</div>
	{/if}
</section>
