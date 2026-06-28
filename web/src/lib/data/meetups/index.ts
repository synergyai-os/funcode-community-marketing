import type { MeetupEvent } from './types';

export type { AgendaItem, MeetupEvent, MeetupStatus } from './types';

const SANTANDER_AGENDA: MeetupEvent['agenda'] = [
	{
		order: 1,
		title: 'Introduction',
		description:
			'Welcome, round-the-room intros, and what we mean by “build anything with AI” — starting with software, open to every use case. Share how you use AI today and what you want to learn.',
		durationMinutes: 15
	},
	{
		order: 2,
		title: 'Workshop: Ship with AI in 15 minutes',
		description:
			'Live walkthrough (~15 min) of how to set up and run the interactive guide — connect email, auth, design components, pick a stack — then ~45 min hands-on shipping together. The guide keeps working at /guides after the meetup.',
		durationMinutes: 60,
		guideSlug: 'ship-with-ai-15'
	},
	{
		order: 3,
		title: "What's next?",
		description:
			'Open discussion: what do you want from this meetup series? Set frequency, agree on value, and plan the next session(s). Community-led — your input shapes what we run.',
		durationMinutes: 45
	}
];

export const meetups: MeetupEvent[] = [
	{
		slug: 'funcode-meetup-santander-1',
		status: 'scheduled',
		title: 'FunCode Meetup — Santander',
		tagline: 'Product people building anything with AI — together, in person.',
		description:
			'Our first in-person FunCode meetup. Two hours to learn how to work in a world with AI: share use cases, ask questions, ship a small thing live, and co-design what this community looks like locally. Organised by members — show up curious, leave with something working.',
		startsAt: null,
		dateLabel: 'Coming soon — date announced for Santander',
		durationMinutes: 120,
		location: {
			city: 'Santander',
			region: 'Cantabria',
			country: 'Spain',
			venue: 'Venue TBC — member-organised'
		},
		organizer: 'FunCode community',
		organizerNote:
			'Member-organised — reach out after joining if you want to help host or find a venue.',
		audience:
			'Product managers, designers, founders, and builders who want to create with AI — starting with code and software, open to any AI use case.',
		agenda: SANTANDER_AGENDA,
		chainRefs: ['WP-1', 'GLO-2', 'STR-7']
	},
	{
		slug: 'open-slot-your-city',
		status: 'open-slot',
		title: 'Your city — host a meetup',
		tagline: 'Empty slot — start a FunCode meetup where you are.',
		description:
			'FunCode meetups are community-organised. Pick a date, find a space, and share it here so others can join. We provide the agenda template, workshop guide, and Play Room mindset — you bring the local energy.',
		startsAt: null,
		dateLabel: 'You pick the date',
		durationMinutes: 120,
		location: {
			city: 'Your city',
			country: 'Anywhere'
		},
		organizer: 'You (+ FunCode community)',
		organizerNote:
			'Join free first — then tell us you want to host and we’ll help you publish your slot.',
		audience: 'Anyone who wants a local, product-focused AI builder meetup.',
		agenda: SANTANDER_AGENDA,
		chainRefs: ['WP-1']
	},
	{
		slug: 'open-slot-remote',
		status: 'open-slot',
		title: 'Remote / hybrid slot',
		tagline: 'Empty slot — online or hybrid meetup.',
		description:
			'Not everyone can meet in person. Host a remote or hybrid session using the same 2-hour agenda — intro, workshop, and planning block.',
		startsAt: null,
		dateLabel: 'You pick the date',
		durationMinutes: 120,
		location: {
			city: 'Online',
			country: 'Remote'
		},
		organizer: 'You (+ FunCode community)',
		organizerNote: 'Join free — then propose your session and we’ll list it here.',
		audience: 'Remote product builders who want the same ship-with-AI energy.',
		agenda: SANTANDER_AGENDA,
		chainRefs: ['WP-1']
	}
];

export function scheduledMeetups(): MeetupEvent[] {
	return meetups.filter((m) => m.status === 'scheduled');
}

export function openMeetupSlots(): MeetupEvent[] {
	return meetups.filter((m) => m.status === 'open-slot');
}

export function meetupBySlug(slug: string): MeetupEvent | undefined {
	return meetups.find((m) => m.slug === slug);
}

export function allMeetupsForDisplay(): MeetupEvent[] {
	return [...scheduledMeetups(), ...openMeetupSlots()];
}
