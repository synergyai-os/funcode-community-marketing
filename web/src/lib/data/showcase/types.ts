export type ShowcaseInsight = {
	chainId: string;
	title: string;
	description: string;
	excerpt: string;
	landingSlot: string;
	guest: string;
	episodeIns: string;
	sourceUrl: string;
	sourcePublishedAt?: string | null;
	ingestedAt?: string | null;
};

export type ShowcaseWord = {
	chainId: string;
	label: string;
	quote: string;
	landingSlot: string;
	guest: string;
	sourceUrl: string;
};

export type ShowcaseEpisode = {
	videoId: string;
	sourceUrl: string;
	episodeIns: string;
	guestLand: string;
	guest: string;
	title: string;
	summary: string;
	insightCount: number;
	wordCount: number;
	sourcePublishedAt?: string | null;
	ingestedAt?: string | null;
};

export type MentalModelSection = {
	id: string;
	title: string;
	oldHeadline: string;
	newHeadline: string;
	oldBelief: string;
	newBelief: string;
	costOfWaiting: string;
	transformSteps: string[];
};

export type ShowcaseBatch = {
	generatedAt: string;
	episodes: ShowcaseEpisode[];
	shiftOld: ShowcaseInsight[];
	shiftNew: ShowcaseInsight[];
	allInsights: ShowcaseInsight[];
	words: ShowcaseWord[];
	mentalModelSections: MentalModelSection[];
	stats: {
		episodeCount: number;
		shiftOldCount: number;
		shiftNewCount: number;
		insightCount: number;
		wordCount: number;
		chainIdCount: number;
	};
};
