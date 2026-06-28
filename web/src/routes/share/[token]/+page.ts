import { error } from '@sveltejs/kit';
import { collectionBySlug, resolveCollectionLabels, shareGrantByToken } from '$lib/data/community';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const grant = shareGrantByToken(params.token);
	if (!grant) error(404, 'Share link not found');

	const collection = collectionBySlug(grant.collectionSlug);
	if (!collection) error(404, 'Collection not found');

	return {
		grant,
		collection,
		labels: resolveCollectionLabels(collection)
	};
};
