<script lang="ts">
	import { SiteChrome } from '$lib/components/ui';
</script>

<svelte:head>
	<title>Site chrome — dev proof (PAT-13)</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<SiteChrome homeAnchors />

<main class="mx-auto max-w-3xl px-6 py-16">
	<p class="text-xs font-bold tracking-widest text-accent-strong uppercase">PAT-13 proof surface</p>
	<h1 class="mt-3 text-3xl font-extrabold tracking-tight">Site chrome dev gate</h1>
	<p class="mt-4 text-lg text-ink-soft">
		This page mounts <code class="rounded bg-surface-subtle px-1.5 py-0.5 text-sm">SiteChrome</code> only.
		Tier 1 must pass via <code class="rounded bg-surface-subtle px-1.5 py-0.5 text-sm">npm run eval:site-chrome</code>
		before shipping header changes site-wide.
	</p>
	<p class="mt-6 text-sm text-muted">
		Dev mirror of production site chrome. Flat pillar rows with dividers (STD-11 Option A).
	</p>
</main>

<section id="how" class="mx-auto max-w-3xl px-6 pb-8">
	<h2 class="text-xl font-bold">How it works (anchor test)</h2>
	<p class="mt-2 text-ink-soft">Home anchor links appear when homeAnchors is true.</p>
</section>

<section id="faq" class="mx-auto max-w-3xl px-6 pb-24">
	<h2 class="text-xl font-bold">FAQ (anchor test)</h2>
	<p class="mt-2 text-ink-soft">Wire gate: Randy Tier 2 sign-off after Tier 1 pass.</p>
</section>
