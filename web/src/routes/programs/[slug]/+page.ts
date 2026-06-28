import { error } from '@sveltejs/kit';
import { programBySlug } from '$lib/data/community';
import { programVisible } from '$lib/analytics/feature-flags';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const program = programBySlug(params.slug);
	if (!program) error(404, 'Program not found');
	if (!programVisible(program.tier)) error(404, 'Program not available');
	return { program };
};
