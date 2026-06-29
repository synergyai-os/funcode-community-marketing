import type { Component } from 'svelte';
import type { SVGAttributes } from 'svelte/elements';
import IconCalendar from '~icons/lucide/calendar-days';
import IconRoute from '~icons/lucide/route';
import IconBookOpen from '~icons/lucide/book-open';
import IconPodcast from '~icons/lucide/podcast';
import IconClock from '~icons/lucide/clock';
import IconWrench from '~icons/lucide/wrench';
import IconSparkles from '~icons/lucide/sparkles';
import IconUserRound from '~icons/lucide/user-round';

/** Typed internal routes for site chrome (STD-11). */
export type AppRoute =
	| '/meetups'
	| '/guides'
	| '/media'
	| '/tools'
	| '/for'
	| '/programs'
	| '/showcase'
	| '/showcase/mental-model'
	| '/landscape/timeline';

export type NavIcon = Component<SVGAttributes<SVGSVGElement>>;

export type NavItem = {
	label: string;
	href: AppRoute;
	description: string;
	icon: NavIcon;
};

export type NavGroupId = 'do' | 'explore' | 'community';

export type NavGroup = {
	id: NavGroupId;
	label: string;
	items: NavItem[];
};

export type SiteNav = NavGroup[];

/** Grouped pillar navigation — Chain SSOT: STD-11. */
export const siteNav: SiteNav = [
	{
		id: 'do',
		label: 'Do',
		items: [
			{
				label: 'Meetups',
				href: '/meetups',
				description: 'Show up, build together, meet people who ship.',
				icon: IconCalendar
			},
			{
				label: 'Guides',
				href: '/guides',
				description: 'Step-by-step playbooks for building with AI.',
				icon: IconBookOpen
			}
		]
	},
	{
		id: 'explore',
		label: 'Explore',
		items: [
			{
				label: 'Showcase',
				href: '/showcase',
				description: 'Real things members built — proof over hype.',
				icon: IconSparkles
			},
			{
				label: 'Listen',
				href: '/media',
				description: 'Podcasts, talks, and voices we learn from.',
				icon: IconPodcast
			},
			{
				label: 'Timeline',
				href: '/landscape/timeline',
				description: 'How the AI builder landscape evolved — year by year.',
				icon: IconClock
			},
			{
				label: 'Tools',
				href: '/tools',
				description: 'What builders actually use — curated, not a flat list.',
				icon: IconWrench
			}
		]
	},
	{
		id: 'community',
		label: 'Community',
		items: [
			{
				label: 'Your path',
				href: '/for',
				description: 'Find your lane — PM, founder, designer, or curious.',
				icon: IconUserRound
			},
			{
				label: 'Programs',
				href: '/programs',
				description: 'Structured paths from idea to working prototype.',
				icon: IconRoute
			}
		]
	}
];
