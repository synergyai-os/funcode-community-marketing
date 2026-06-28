import { error } from '@sveltejs/kit';
import {
	episodesForPlatform,
	platformBySlug,
	type MediaEpisode,
	type MediaPlatform
} from '$lib/data/media';

export function load({ params }: { params: { platform: string } }): {
	platform: MediaPlatform;
	episodes: MediaEpisode[];
} {
	const platform = platformBySlug(params.platform);
	if (!platform) error(404, 'Platform not found');
	return { platform, episodes: episodesForPlatform(params.platform) };
}
