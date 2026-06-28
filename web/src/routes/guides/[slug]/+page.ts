import { error } from '@sveltejs/kit';
import { guideBySlug } from '$lib/data/guides';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const guide = guideBySlug(params.slug);
	if (!guide) error(404, 'Guide not found');
	return { guide };
};
