<script lang="ts">
	import { resolve } from '$app/paths';
	import { Badge, Button } from '$lib/components/ui';
	import { getJoinContext } from '$lib/context/join';
	import type { MeetupEvent } from '$lib/data/meetups';
	import IconMapPin from '~icons/lucide/map-pin';
	import IconUsers from '~icons/lucide/users';
	import IconPlus from '~icons/lucide/plus';

	type Props = {
		meetup: MeetupEvent;
	};

	let { meetup }: Props = $props();
	const join = getJoinContext();
	const isOpenSlot = $derived(meetup.status === 'open-slot');
</script>

<article
	class={`rounded-card border p-6 transition hover:-translate-y-0.5 hover:shadow-card ${
		isOpenSlot
			? 'border-dashed border-border-strong bg-surface-muted/50'
			: 'border-border bg-surface'
	}`}
>
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="flex flex-wrap gap-2">
			<Badge variant={isOpenSlot ? 'neutral' : 'accent'}>
				{isOpenSlot ? 'Open slot' : 'Scheduled'}
			</Badge>
			<Badge variant="neutral">{meetup.durationMinutes} min</Badge>
		</div>
		{#if isOpenSlot}
			<IconPlus class="size-5 text-accent" aria-hidden="true" />
		{/if}
	</div>

	<h2 class="mt-3 text-xl font-bold text-balance">{meetup.title}</h2>
	<p class="mt-1 text-sm text-ink-soft">{meetup.tagline}</p>

	<ul class="mt-4 space-y-2 text-sm text-ink-soft">
		<li class="flex items-start gap-2">
			<IconMapPin class="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
			<span>
				{meetup.location.city}{meetup.location.region ? `, ${meetup.location.region}` : ''},
				{meetup.location.country}
				{#if meetup.location.venue}
					· {meetup.location.venue}
				{/if}
			</span>
		</li>
		<li class="flex items-start gap-2">
			<IconUsers class="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
			<span>{meetup.organizer} — {meetup.organizerNote}</span>
		</li>
	</ul>

	<p class="mt-2 text-sm font-medium text-ink">{meetup.dateLabel}</p>

	<p class="mt-4 text-pretty text-ink-soft">{meetup.description}</p>

	<div class="mt-5 flex flex-wrap gap-2">
		{#if isOpenSlot}
			<Button variant="primary" size="sm" onclick={() => join.openJoin('host-meetup')}>
				Host this slot
			</Button>
		{:else}
			<Button href={resolve(`/meetups/${meetup.slug}`)} variant="soft" size="sm">
				View agenda
			</Button>
			<Button variant="primary" size="sm" onclick={() => join.openJoin('rsvp')}>RSVP — free</Button>
		{/if}
	</div>
</article>
