export {
	mediaPlatforms,
	platformBySlug,
	type MediaPlatform,
	type MediaChannel
} from './platforms.js';
export { workflowTools, toolBySlug, type WorkflowTool } from './tools.js';
export { mediaGenerated } from './generated.js';
import { mediaGenerated } from './generated.js';

export type MediaEpisode = {
	videoId: string;
	sourceUrl: string;
	title: string;
	guest: string;
	summary: string;
	platformSlug: string;
	platformName: string;
	status: string;
	committed: boolean;
	episodeIns?: string;
	guestLand?: string;
	insightCount: number;
	wordCount: number;
	sourcePublishedAt?: string | null;
	ingestedAt?: string | null;
};

export type ToolQuote = {
	kind: 'insight' | 'word';
	guest: string;
	text: string;
	title: string;
	sourceUrl: string;
	platformSlug: string;
};

export function episodesForPlatform(slug: string): MediaEpisode[] {
	const map = mediaGenerated.episodesByPlatform as Record<string, readonly MediaEpisode[]>;
	return [...(map[slug] ?? [])];
}

export function quotesForTool(slug: string): ToolQuote[] {
	const map = mediaGenerated.toolQuotes as Record<string, readonly ToolQuote[]>;
	return [...(map[slug] ?? [])];
}
