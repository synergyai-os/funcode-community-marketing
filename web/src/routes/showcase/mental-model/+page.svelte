<script lang="ts">
	import { Badge, Button } from '$lib/components/ui';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import AiChatGate from '$lib/components/agent/AiChatGate.svelte';
	import MentalModelSection from '$lib/components/showcase/MentalModelSection.svelte';
	import { lennyBatch } from '$lib/data/showcase/index.js';
</script>

<div class="min-h-screen bg-surface text-ink">
	<SiteHeader />
	<header class="border-b border-border bg-surface-muted">
		<div class="mx-auto max-w-4xl px-6 py-14">
			<Badge variant="solid">Mental model</Badge>
			<h1 class="mt-6 text-4xl font-black tracking-tight text-balance sm:text-5xl">
				How the world works now — and what it takes to transform
			</h1>
			<p class="mt-4 max-w-2xl text-lg text-pretty text-ink-soft">
				Each section toggles between the <strong>old model</strong> leaders are leaving behind and
				the
				<strong>new model</strong> Lenny's guests operate in today. Evidence links to Chain — nothing
				fabricated.
			</p>
			<div class="mt-6 flex flex-wrap gap-3">
				<Button href="/showcase" variant="soft">Showcase home</Button>
				<Button href="/showcase/shifts" variant="soft">Shift gallery</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl space-y-10 px-6 py-16">
		<section class="rounded-card border border-accent/30 bg-accent-soft/40 p-8">
			<h2 class="text-xl font-bold">Why this page exists</h2>
			<p class="mt-3 text-pretty text-ink-soft">
				FunCode teaches people to build with AI — not by listing tools, but by showing the belief
				shift. These leaders already live in the new model. The question for readers: what beliefs,
				steps, and costs stand between you and operating there?
			</p>
		</section>

		{#each lennyBatch.mentalModelSections as section (section.id)}
			<MentalModelSection {section} batch={lennyBatch} />
		{/each}

		<section class="rounded-card border border-border bg-surface-muted p-8 text-center">
			<h2 class="text-2xl font-black">Ready to practice the new model?</h2>
			<p class="mt-3 text-ink-soft">
				Play Rooms are where you try this out loud — low stakes, real feedback, same Chain.
			</p>
			<div class="mt-6">
				<Button href="https://randyhereman.com/building" variant="primary"
					>Join FunCode — free</Button
				>
			</div>
		</section>
	</main>

	<SiteFooter />
</div>

<AiChatGate context={{ pageTitle: 'Mental model', pageKind: 'mental-model' }} />
