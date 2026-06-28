/** Internal routes used in Learn nav and engagement ladder. */
export type AppRoute =
	| '/media'
	| '/tools'
	| '/for'
	| '/showcase/mental-model'
	| '/landscape/timeline';

/** Shared Learn navigation — homepage header, footer, ladder rungs. */
export type LearnNavLink = {
	label: string;
	href: AppRoute;
};

export const learnNavLinks: LearnNavLink[] = [
	{ label: 'Sources', href: '/media' },
	{ label: 'Timeline', href: '/landscape/timeline' },
	{ label: 'Tools', href: '/tools' },
	{ label: 'For you', href: '/for' },
	{ label: 'Mental model', href: '/showcase/mental-model' }
];

export const JOIN_URL = 'https://randyhereman.com/building';
