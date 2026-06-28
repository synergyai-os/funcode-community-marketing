<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';

	type Props = {
		data: { program: import('$lib/data/community').Program };
	};

	let { data }: Props = $props();
	const program = $derived(data.program);
</script>

<svelte:head>
	<title>{program.title} — FunCode</title>
</svelte:head>

<div class="min-h-screen bg-surface text-ink">
	<SiteHeader />
	<PageHeader
		backHref="/programs"
		backLabel="All programs"
		eyebrow={program.kind}
		title={program.title}
	/>

	<main class="mx-auto max-w-3xl px-6 py-12">
		<p class="text-lg text-ink-soft">{program.tagline}</p>
		<p class="mt-6 text-pretty text-ink-soft">{program.description}</p>

		<dl class="mt-8 grid gap-3 text-sm">
			<div class="flex gap-2">
				<dt class="font-semibold">Duration</dt>
				<dd class="text-ink-soft">{program.duration}</dd>
			</div>
			{#if program.schedule}
				<div class="flex gap-2">
					<dt class="font-semibold">Schedule</dt>
					<dd class="text-ink-soft">{program.schedule.starts} → {program.schedule.ends}</dd>
				</div>
			{/if}
			<div class="flex gap-2">
				<dt class="font-semibold">Visibility</dt>
				<dd class="text-ink-soft">{program.visibility}</dd>
			</div>
		</dl>

		<section class="mt-10">
			<h2 class="text-sm font-bold tracking-widest text-ink-soft uppercase">Chain refs</h2>
			<ul class="mt-3 flex flex-wrap gap-2 font-mono text-sm text-ink-soft">
				{#each program.chainRefs as ref (ref)}
					<li class="rounded bg-surface-muted px-2 py-1">{ref}</li>
				{/each}
			</ul>
		</section>
	</main>

	<SiteFooter />
</div>
