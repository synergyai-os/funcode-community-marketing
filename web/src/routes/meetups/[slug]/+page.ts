import { error } from '@sveltejs/kit';
import { meetupBySlug } from '$lib/data/meetups';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const meetup = meetupBySlug(params.slug);
	if (!meetup) error(404, 'Meetup not found');
	return { meetup };
};
