<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui';
	import EventAgenda from '$lib/components/meetups/EventAgenda.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import { getJoinContext } from '$lib/context/join';
	import IconClock from '~icons/lucide/clock';
	import IconMapPin from '~icons/lucide/map-pin';

	type Props = {
		data: { meetup: import('$lib/data/meetups').MeetupEvent };
	};

	let { data }: Props = $props();
	const meetup = $derived(data.meetup);
	const join = getJoinContext();
	const isOpenSlot = $derived(meetup.status === 'open-slot');
</script>

<svelte:head>
	<title>{meetup.title} — FunCode</title>
</svelte:head>

<div class="min-h-screen bg-surface text-ink">
	<SiteHeader />
	<PageHeader backHref="/meetups" backLabel="All meetups" eyebrow="Meetup" title={meetup.title} />

	<main class="mx-auto max-w-3xl px-6 py-12">
		<p class="text-lg text-pretty text-ink-soft">{meetup.tagline}</p>

		<dl class="mt-8 grid gap-4 rounded-card border border-border bg-surface-muted p-5 text-sm">
			<div class="flex gap-3">
				<dt class="sr-only">Date</dt>
				<dd class="flex items-center gap-2 font-medium">
					<IconClock class="size-4 text-accent" aria-hidden="true" />
					{meetup.dateLabel} · {meetup.durationMinutes} minutes
				</dd>
			</div>
			<div class="flex gap-3">
				<dt class="sr-only">Location</dt>
				<dd class="flex items-start gap-2">
					<IconMapPin class="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
					<span>
						{meetup.location.city}{meetup.location.region ? `, ${meetup.location.region}` : ''}, {meetup
							.location.country}
						{#if meetup.location.venue}
							<br /><span class="text-ink-soft">{meetup.location.venue}</span>
						{/if}
					</span>
				</dd>
			</div>
			<div>
				<dt class="font-semibold">Organiser</dt>
				<dd class="mt-1 text-ink-soft">{meetup.organizer} — {meetup.organizerNote}</dd>
			</div>
			<div>
				<dt class="font-semibold">Who it's for</dt>
				<dd class="mt-1 text-ink-soft">{meetup.audience}</dd>
			</div>
		</dl>

		<p class="mt-8 text-pretty text-ink-soft">{meetup.description}</p>

		<div class="mt-8 flex flex-wrap gap-2">
			{#if isOpenSlot}
				<Button variant="primary" onclick={() => join.openJoin('host-meetup')}>
					Host this meetup
				</Button>
			{:else}
				<Button variant="primary" onclick={() => join.openJoin('rsvp')}>RSVP — free</Button>
			{/if}
			<Button href={resolve('/guides')} variant="soft">Browse guides</Button>
		</div>

		<div class="mt-14">
			<EventAgenda items={meetup.agenda} totalMinutes={meetup.durationMinutes} />
		</div>
	</main>

	<SiteFooter />
</div>
