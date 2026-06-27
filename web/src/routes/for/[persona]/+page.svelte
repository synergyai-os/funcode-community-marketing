<script lang="ts">
	import { Button, Badge } from '$lib/components/ui';
	import VoicesSection from '$lib/components/landing/VoicesSection.svelte';
	import { contentForPersona } from '$lib/data/persona-content';
	import { personaById, type Persona } from '$lib/data/personas';
	import { displayVoices, voicesForPersona } from '$lib/data/voices';

	type Props = {
		data: { persona: Persona };
	};

	let { data }: Props = $props();
	const persona = $derived(data.persona);
	const highlights = $derived(contentForPersona(persona.id).highlights);
	const voiceCount = $derived(voicesForPersona(persona.id, displayVoices()).length);

	const JOIN_URL = 'https://randyhereman.com/building';
</script>

<svelte:head>
	<title>{persona.label} — FunCode</title>
</svelte:head>

<div class="min-h-screen bg-white text-ink">
	<header class="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
		<a href="/" class="flex items-center gap-2 font-extrabold tracking-tight">
			<span class="grid h-8 w-8 place-items-center rounded-lg bg-ink text-white">&lt;/&gt;</span>
			<span>FunCode</span>
		</a>
		<Button href={JOIN_URL} variant="primary" size="sm">Join — free</Button>
	</header>

	<main>
		<section class="border-b border-border bg-surface-muted">
			<div class="mx-auto max-w-3xl px-6 py-16 text-center sm:py-20">
				<Badge variant="solid">{persona.emoji} {persona.label}</Badge>
				<h1 class="mt-6 text-4xl font-black tracking-tight text-balance sm:text-5xl">
					Build with AI — your way
				</h1>
				<p class="mt-4 text-lg text-pretty text-ink-soft">{persona.tagline}</p>
				{#if voiceCount > 0}
					<p class="mt-3 text-sm font-medium text-ink-soft">
						{voiceCount} attributed {voiceCount === 1 ? 'quote' : 'quotes'} in the deck below
					</p>
				{/if}
				<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
					<Button href={JOIN_URL} variant="primary">Join — free</Button>
					<Button href="/#voices" variant="soft">All voices</Button>
				</div>
			</div>
		</section>

		<section class="mx-auto max-w-2xl px-6 py-12">
			<h2 class="text-center text-sm font-bold tracking-widest text-ink-soft uppercase">
				Why this lane
			</h2>
			<ul class="mt-6 space-y-4 text-pretty text-ink-soft">
				{#each highlights as line (line)}
					<li class="flex gap-3">
						<span class="mt-2 size-1.5 shrink-0 rounded-full bg-accent-strong" aria-hidden="true"
						></span>
						<span>{line}</span>
					</li>
				{/each}
			</ul>
		</section>

		<VoicesSection lockedPersonaId={persona.id} />

		<section class="mx-auto max-w-2xl px-6 py-16 text-center">
			<p class="text-ink-soft">
				More persona-tailored Play Rooms, guides, and examples land here over time — same Chain,
				{personaById(persona.id).label.toLowerCase()} lens.
			</p>
			<div class="mt-6">
				<Button href={JOIN_URL} variant="soft">Start in a Play Room</Button>
			</div>
		</section>
	</main>
</div>
