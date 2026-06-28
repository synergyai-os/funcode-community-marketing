<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import MeetupCard from '$lib/components/meetups/MeetupCard.svelte';
	import { allMeetupsForDisplay, openMeetupSlots, scheduledMeetups } from '$lib/data/meetups';
	import { Badge } from '$lib/components/ui';
</script>

<svelte:head>
	<title>Meetups — FunCode</title>
</svelte:head>

<div class="min-h-screen bg-surface text-ink">
	<SiteHeader />

	<header class="border-b border-border bg-surface-muted">
		<div class="mx-auto max-w-4xl px-6 py-14">
			<Badge variant="accent">Community</Badge>
			<h1 class="mt-4 text-4xl font-black tracking-tight text-balance">FunCode meetups</h1>
			<p class="mt-3 max-w-2xl text-pretty text-ink-soft">
				In-person and remote gatherings for product people learning to build with AI.
				Member-organised — share use cases, ship together, plan what's next.
			</p>
		</div>
	</header>

	<main class="mx-auto max-w-4xl space-y-12 px-6 py-14">
		<section aria-labelledby="scheduled-heading">
			<h2 id="scheduled-heading" class="text-lg font-bold">Upcoming</h2>
			<p class="mt-1 text-sm text-ink-soft">Confirmed meetups with a published agenda.</p>
			<div class="mt-6 space-y-6">
				{#each scheduledMeetups() as meetup (meetup.slug)}
					<MeetupCard {meetup} />
				{:else}
					<p class="text-ink-soft">No scheduled meetups yet.</p>
				{/each}
			</div>
		</section>

		<section aria-labelledby="slots-heading">
			<h2 id="slots-heading" class="text-lg font-bold">Open slots</h2>
			<p class="mt-1 text-sm text-ink-soft">
				Click a slot to host a meetup in your city or online — join free, then we'll help you share
				it here.
			</p>
			<div class="mt-6 grid gap-6 sm:grid-cols-2">
				{#each openMeetupSlots() as meetup (meetup.slug)}
					<MeetupCard {meetup} />
				{/each}
			</div>
		</section>

		<p class="text-center text-sm text-ink-soft">
			{allMeetupsForDisplay().length} listings · same 2-hour agenda template for every meetup
		</p>
	</main>

	<SiteFooter />
</div>
