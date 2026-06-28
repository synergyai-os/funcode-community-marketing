/** Internal routes used in Learn nav and engagement ladder. */
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

export type LearnNavLink = {
	label: string;
	href: AppRoute;
};

/** Primary header navigation — cohesive IA across the site. */
export const learnNavLinks: LearnNavLink[] = [
	{ label: 'Meetups', href: '/meetups' },
	{ label: 'Guides', href: '/guides' },
	{ label: 'Sources', href: '/media' },
	{ label: 'Timeline', href: '/landscape/timeline' },
	{ label: 'For you', href: '/for' }
];

/** Secondary links — footer + mobile drawer extras. */
export const learnNavSecondary: LearnNavLink[] = [
	{ label: 'Programs', href: '/programs' },
	{ label: 'Showcase', href: '/showcase' },
	{ label: 'Tools', href: '/tools' }
];

export const JOIN_URL = 'https://randyhereman.com/building';
